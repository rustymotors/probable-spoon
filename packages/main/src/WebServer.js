// obsidian-spoon is a game server
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
import * as Sentry from "@sentry/node";
import http from "node:http";
import express from "express";
/** @typedef connectionHandler
 * @type {function(NodeJS.Socket): void}
 */
/** @typedef errorHandler
 * @type {function(Error): void}
 */
export class WebServer {
    port;
    server;
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
        Sentry.setupExpressErrorHandler(app);
        app.use(onConnection);
        /** @type {http.Server} */
        this.server = http.createServer(app);
        this.server.on("error", onServerError);
        this.server.on("listening", () => {
            onListening(this.server);
        });
    }
    /**
     * Start the server listening on the configured port.
     */
    listen() {
        this.server.listen(this.port);
    }
    /**
     *
     * @param {errorHandler} onError
     * @returns {Promise<void>}
     */
    async close(onError) {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    onError(err);
                    reject(err);
                }
                resolve();
            });
        });
    }
}
//# sourceMappingURL=WebServer.js.map