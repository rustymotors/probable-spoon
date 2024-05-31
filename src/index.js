// probable-spoon is a game server
// Copyright (C) 2024 Molly Crendraven

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import net from "node:net";
import { emitKeypressEvents } from "node:readline";

// === TYPES ===

/** @typedef connectionHandler
 * @type {function(net.Socket): void}
 */

/** @typedef errorHandler
 * @type {function(Error): void}
 */

/**
 * @typedef KeypressEvent
 * @type {object}
 * @property {string} sequence
 * @property {string} name
 * @property {boolean} ctrl
 * @property {boolean} meta
 * @property {boolean} shift
 */

// === GLOBALS ===

/** @type {TCPServer} */
let loginServer;

/** @type {TCPServer} */
let personaServer;

// === FUNCTIONS ===

/**
 *
 * @param {Buffer} data
 */
function onData(data) {
  const hex = data.toString("hex");
  console.log(`Data received: ${hex}`);
}

/**
 * @param {net.Socket} socket
 */
function onConnection(socket) {
  console.log("Connection established");
  socket.on("data", onData);
}

/**
 *
 * @param {Error} err
 */
export function onServerError(err) {
  console.error(`Server error: ${err.message}`);
}

/**
 *
 * @param {{ address(): net.AddressInfo | null | string}} s
 * @returns string
 */
function getPort(s) {
  const address = s.address();
  if (address === null || typeof address === "string") {
    return String(address);
  }
  return String(address.port);
}

/**
 * @param {net.Server} s
 */
function onListening(s) {
  const port = getPort(s);

  console.log(`Server listening on port ${port}`);
  s.on("connection", onConnection);
  s.on("close", () => {
    console.log(`Server on port ${port} closed`);
  });
  s.on("error", (err) => {
    console.error(`Server on port ${port} errored: ${err.message}`);
  });
}

export class TCPServer {
  /**
   *
   * @param {number} port
   * @param {function(net.Server): void} onListening
   * @param {function(net.Socket): void} onConnection
   * @param {function(Error): void} onServerError
   */
  constructor(port, onListening, onConnection, onServerError) {
    this.port = port;
    this.server = net.createServer(onConnection);
    this.server.on("error", onServerError);
    this.server.on("listening", () => {
      onListening(this.server);
    });
  }

  listen() {
    this.server.listen(this.port);
  }

  /**
   *
   * @param {errorHandler} errorHandler
   */
  async close(errorHandler) {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          errorHandler(err);
          reject(err);
        }
        resolve(void 0);
      });
    });
  }
}

async function _atExit(exitCode = 0) {
  // await loginServer.close(onServerError);
  // await personaServer.close(onServerError);
  console.log("Goodbye, world!");
  process.exit(exitCode);
}

class MainLoop {
  /** @type {NodeJS.Timeout | undefined} */
  _timer = undefined;

  /** @typedef {function(): Promise<void> | void} Task */

  /** @type {Array<Task>} */
  _startTasks = [];

  /** @type {Array<Task>} */
  _stopTasks = [];

  /** @type {Array<Task>} */
  _loopTasks = [];

  /**
   *
   * @param {KeypressEvent} key
   */
  handleKeypressEvent(key) {
    const keyString = key.sequence;

    if (keyString === "x") {
      this.stop();
    }
  }
  /**
   *
   * @param {"start" | "loop" | "stop"} type
   * @param {function (): void} task
   */
  addTask(type, task) {
    if (type === "start") {
      this._startTasks.push(task);
    } else if (type === "stop") {
      this._stopTasks.push(task);
    } else if (type === "loop") {
      this._loopTasks.push(task);
    }
  }

  /**
   * @param {Array<Task>} tasks
   */
  async _callTasks(tasks) {
    tasks.forEach(async (task) => {
      await task();
    });
  }

  async start() {
    this.timer = setTimeout(this.loop.bind(this), 1000);
    if (process.stdin.isTTY !== true) {
      return;
    }
    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    console.log("Press X to exit");
    process.stdin.on("keypress", (str, key) => {
      if (key !== undefined) {
        this.handleKeypressEvent(key);
      }
    });
    await this._callTasks(this._startTasks);
  }

  async stop() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      process.stdin.setRawMode(false);
      console.log("Exiting...");
      await this._callTasks(this._stopTasks);
      _atExit();
    }
  }

  async loop() {
    await this._callTasks(this._loopTasks);
    this.timer = setTimeout(this.loop.bind(this), 1000);
  }
}

// === MAIN ===

export default function main() {
  process.on("exit", (/** @type {number} **/ code) => {
    console.log(`Server exited with code ${code}`);
  });

  console.log("Hello, world!");
  loginServer = new TCPServer(8226, onListening, onConnection, onServerError);
  personaServer = new TCPServer(8228, onListening, onConnection, onServerError);
  // loginServer.listen();
  // personaServer.listen();
  const mainLoop = new MainLoop();
  mainLoop.addTask("start", loginServer.listen.bind(loginServer));
  mainLoop.addTask("start", personaServer.listen.bind(personaServer));
  mainLoop.addTask("stop", loginServer.close.bind(loginServer, onServerError));
  mainLoop.addTask(
    "stop",
    personaServer.close.bind(personaServer, onServerError)
  );
  mainLoop.start();
}
