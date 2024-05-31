import net from "node:net";

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
