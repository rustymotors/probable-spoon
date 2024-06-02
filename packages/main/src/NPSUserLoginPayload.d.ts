/// <reference types="node" resolution-mode="require"/>
import { NPSMessagePayload } from "./NPSMessagePayload.js";
import { INPSPayload } from "./types.js";
/**
 * @typedef INPSPayload
 * @type {import("./NPSMessagePayload.js").INPSPayload}
 */
/**
 * @implements {INPSPayload}
 * @extends {NPSMessagePayload}
 * Payload for the NPSUserLogin message.
 */
export declare class NPSUserLoginPayload
  extends NPSMessagePayload
  implements INPSPayload
{
  ticket: string;
  sessionKey: string;
  gameId: string;
  constructor();
  /**
   *
   * @param {number} len
   * @param {Buffer} data
   * @returns {NPSUserLoginPayload}
   */
  static parse(data: Buffer, len?: number): NPSUserLoginPayload;
  /**
   * @returns {Buffer}
   */
  toBuffer(): Buffer;
  /**
   * @returns {string}
   */
  toString(): string;
}
