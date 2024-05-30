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

/**
 * @typedef listeningHandler
 * @type {function(net.Server): void}
 */

/** @typedef connectionHandler
 * @type {function(net.Socket): void}
 */

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
function onServerError(err) {
  console.error(`Server error: ${err.message}`);
}

/**
 * @param {net.Server} s
 */
function onListening(s) {
  const address = s.address();

  if (address === null || typeof address === "string") {
    console.error("Server listening on unknown address");
    return;
  }

  const port = address.port;

  console.log(`Server listening on port ${port}`);
  s.on("connection", onConnection);
  s.on("close", () => {
    console.log(`Server on port ${port} closed`);
  });
  s.on("error", (err) => {
    console.error(`Server on port ${port} errored: ${err.message}`);
  });
}

/**
 *
 * @param {number} port
 * @param {listeningHandler} onListening
 * @param {connectionHandler} onConnection
 */
function makeTCPServerforPort(port, onListening, onConnection) {
  const server = net.createServer(onConnection);

  server.on("error", onServerError);
  server.on("listening", onListening);
  server.listen(port);
  return server;
}

export default function main() {
  console.log("Hello, world!");
  makeTCPServerforPort(8080, onListening, onConnection);
}
