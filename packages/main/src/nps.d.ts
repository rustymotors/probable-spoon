/// <reference types="node" resolution-mode="require"/>
import { TClientCallback } from "./types.js";
/**
 * @param {number} port
 * @param {Buffer} data
 * @param {(data: Buffer) => void} sendToClient
 */
declare function onNPSData(port: number, data: Buffer, sendToClient: TClientCallback): void;
export { onNPSData };
