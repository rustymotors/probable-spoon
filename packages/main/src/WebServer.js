import http from "node:http";
import express from "express";

/** @typedef connectionHandler
 * @type {function(NodeJS.Socket): void}
 */
/** @typedef errorHandler
 * @type {function(Error): void}
 */

export class WebServer {
  /**
   *
   * @param {number} port
   * @param {function(http.Server): void} onListening
   * @param {function(http.IncomingMessage, http.ServerResponse): void} onConnection
   * @param {errorHandler} onServerError
   */
  constructor(port, onListening, onConnection, onServerError) {
    this.port = port;
    const app = express();
    app.use(onConnection);
    /** @type {http.Server} */
    this.server = http.createServer(app);
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
   * @param {errorHandler} onError
   */
  async close(onError) {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          onError(err);
          reject(err);
        }
        resolve(void 0);
      });
    });
  }
}
