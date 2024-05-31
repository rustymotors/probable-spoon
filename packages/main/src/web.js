/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
export function onWebRequest(req, res) {
  res.end("Hello, world!");
}
