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

import { MainLoop } from "./MainLoop.js";
import { TCPServer } from "./TCPServer.js";

// === TYPES ===

/** @typedef connectionHandler
 * @type {function(NodeJS.Socket): void}
 */

/** @typedef errorHandler
 * @type {function(Error): void}
 */

/** @external Server
 * @see https://nodejs.org/api/net.html#net_class_net_server

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
 * @param {NodeJS.Socket} socket
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
 * @param {import("net").Server} s
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
 * @typedef {import("net").Server} Server
 * @param {Server} s
 */
function onListening(s) {
  const port = getPort(s);

  console.log(`Server listening on port ${port}`);
  s.on("connection", onConnection);
  s.on("close", () => {
    console.log(`Server on port ${port} closed`);
  });
  s.on("error", (/** @type {Error} */ err) => {
    console.error(`Server on port ${port} errored: ${err.message}`);
  });
}

export async function _atExit(exitCode = 0) {
  // await loginServer.close(onServerError);
  // await personaServer.close(onServerError);
  console.log("Goodbye, world!");
  process.exit(exitCode);
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
