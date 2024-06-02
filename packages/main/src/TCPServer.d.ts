/// <reference types="node" resolution-mode="require"/>
import net from "node:net";
import { TErrorHandler } from "./types.js";
export declare class TCPServer {
  port: any;
  server: net.Server;
  /**
   *
   * @param {number} port
   * @param {function(net.Server): void} onListening
   * @param {function(net.Socket): void} onConnection
   * @param {errorHandler} onServerError
   */
  constructor(
    port: number,
    onListening: (arg0: net.Server) => void,
    onConnection: (arg0: net.Socket) => void,
    onServerError: TErrorHandler,
  );
  /**
   * Start the server listening on the configured port.
   */
  listen(): void;
  /**
   *
   * @param {errorHandler} onError
   * @returns {Promise<void>}
   */
  close(onError: TErrorHandler): Promise<void>;
}
