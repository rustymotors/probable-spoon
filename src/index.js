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

import express from "express";
import { MainLoop } from "./MainLoop.js";
import { TCPServer } from "./TCPServer.js";
import { createServer } from "http";

// === GLOBALS ===

/** @type {import("node:http").Server} */
let authServer

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
function onSocketConnection(socket) {
  console.log("Connection established");
  socket.on("data", onData);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function onWebConnection(req, res) {
  res.send("Hello, world!");}

/**
 *
 * @param {Error} err
 */
export function onServerError(err) {
  console.error(`Server error: ${err.message}`);
}

/**
 * 
 * @param {Error | undefined} err 
 */
function onClose(err = undefined) {
  if (err) {
    console.error(`Server close error: ${err.message}`);
  }
  console.log("Server closed");
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
 * @param {number} port
 */
function onWebListening(port) {
  console.log(`Web server listening on port ${port}`);
}

/** 
 * @param {import("net").Server} s
 */
function onSocketListening(s) {
  const port = getPort(s);

  console.log(`Server listening on port ${port}`);
  s.on("connection", onSocketConnection);
  s.on("close", () => {
    console.log(`Server on port ${port} closed`);
  });
  s.on("error", (/** @type {Error} */ err) => {
    console.error(`Server on port ${port} errored: ${err.message}`);
  });
}

export async function _atExit(exitCode = 0) {
  console.log("Goodbye, world!");
  process.exit(exitCode);
}

// === MAIN ===

export default function main() {
  process.on("exit", (/** @type {number} **/ code) => {
    console.log(`Server exited with code ${code}`);
  });

  console.log("Hello, world!");
  const app = express();
  app.use(onWebConnection);
  authServer = createServer(app);
  loginServer = new TCPServer(8226, onSocketListening, onSocketConnection, onServerError);
  personaServer = new TCPServer(8228, onSocketListening, onSocketConnection, onServerError);

  const mainLoop = new MainLoop();
  mainLoop.addTask("start", authServer.listen.bind(authServer, 3000, () => {
    onWebListening(3000);
  }));
  mainLoop.addTask("start", loginServer.listen.bind(loginServer));
  mainLoop.addTask("start", personaServer.listen.bind(personaServer));
  mainLoop.addTask("stop", authServer.close.bind(authServer, onClose));
  mainLoop.addTask("stop", loginServer.close.bind(loginServer, onServerError));
  mainLoop.addTask(
    "stop",
    personaServer.close.bind(personaServer, onServerError)
  );
  mainLoop.start();
}
