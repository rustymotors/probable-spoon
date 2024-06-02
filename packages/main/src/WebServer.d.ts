/// <reference types="node" resolution-mode="require"/>
import http from "node:http";
import { TErrorHandler } from "./types.js";
/** @typedef connectionHandler
 * @type {function(NodeJS.Socket): void}
 */
/** @typedef errorHandler
 * @type {function(Error): void}
 */
export declare class WebServer {
  port: number;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  /**
   *
   * @param {number} port
   * @param {function(http.Server): void} onListening
   * @param {function(http.IncomingMessage, http.ServerResponse): void} onConnection
   * @param {errorHandler} onServerError
   */
  constructor(
    port: number,
    onListening: (arg0: http.Server) => void,
    onConnection: (
      arg0: http.IncomingMessage,
      arg1: http.ServerResponse,
    ) => void,
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
