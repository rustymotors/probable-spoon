import { IncomingMessage, ServerResponse } from "node:http";
import { ShardService } from "./ShardService.js";
import { UserLoginService } from "./UserLoginService.js";

/**
 *
 * @param {import("node:http").ServerResponse} res
 * @param {string} ticket
 */
function sendTicket(res: ServerResponse, ticket: string) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(`Valid=TRUE\nTicket=${ticket}`);
}

/**
 *
 * @param {import("node:http").ServerResponse} res
 * @param {number} statusCode
 * @param {string} message
 */

function sendError(res: ServerResponse, statusCode: number, message: string) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain");
  res.end(
    `reasoncode=INV-200\nreasontext=${message}\nreasonurl=https://rusty-motors.com`,
  );
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
function homePage(req: IncomingMessage, res: ServerResponse) {
  res.end("Hello, world!");
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @param {string} username
 * @param {string} password
 */
function authLogin(
  req: IncomingMessage,
  res: ServerResponse,
  username: string,
  password: string,
) {
  const userLoginService = new UserLoginService();
  const customerId = userLoginService.checkUser(username, password);

  if (customerId === -1) {
    return sendError(res, 401, "Invalid username or password");
  }

  const token = userLoginService.createToken(customerId);
  return sendTicket(res, token);
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
function getShardList(req: IncomingMessage, res: ServerResponse) {
  const shardService = new ShardService();

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");

  res.end(shardService.getShardList());
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
function onWebRequest(req: IncomingMessage, res: ServerResponse) {
  console.log(`Request URL: ${req.url}`);
  const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);

  if (url.pathname === "/") {
    return homePage(req, res);
  }

  if (url.pathname === "/AuthLogin") {
    const username = url.searchParams.get("username") ?? "";
    const password = url.searchParams.get("password") ?? "";

    return authLogin(req, res, username, password);
  }

  if (url.pathname === "/ShardList/") {
    return getShardList(req, res);
  }
  res.end("Hello, world!");
}

export { onWebRequest };
