import net from "node:net";

/** @typedef connectionHandler
 * @type {function(NodeJS.Socket): void}
 */

/** @typedef errorHandler
 * @type {function(Error): void}
 */

export class TCPServer {
  /**
   *
   * @param {number} port
   * @param {function(net.Server): void} onListening
   * @param {function(net.Socket): void} onConnection
   * @param {errorHandler} onServerError
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
