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
   * @param {*} errorHandler
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
  await loginServer.close(onServerError);
  await personaServer.close(onServerError);
  console.log("Goodbye, world!");
  process.exit(exitCode);
}

class MainLoop {
  /** @type {MainLoop | undefined} */
  _instance = undefined;

  /** @type {NodeJS.Timeout | undefined} */
  _timer = undefined;

  constructor() {
    this._instance = this;
    return this._instance;
  }

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

  start() {
    this.timer = setInterval(this.loop, 1000);
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
  }

  stop() {
    if (this.timer !== undefined) {
      process.stdin.setRawMode(false);
      console.log("Exiting...");
      clearInterval(this.timer);
      _atExit();
    }
  }

  static getInstance() {
    if (MainLoop._instance === undefined) {
      this._instance = new MainLoop();
    }
    return this._instance;
  }

  loop() {}
}

function mainLoop() {
  return new MainLoop();
}

// === MAIN ===

export default function main() {
  process.on("exit", (/** @type {number} **/ code) => {
    console.log(`Server exited with code ${code}`);
  });

  console.log("Hello, world!");
  loginServer = new TCPServer(8226, onListening, onConnection, onServerError);
  personaServer = new TCPServer(8228, onListening, onConnection, onServerError);
  loginServer.listen();
  personaServer.listen();
  mainLoop().start();
}
