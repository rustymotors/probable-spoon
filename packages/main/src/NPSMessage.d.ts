/// <reference types="node" resolution-mode="require"/>
import { NPSMessageHeader } from "./NPSMessageHeader.js";
import { NPSMessagePayload } from "./NPSMessagePayload.js";
/**
 * Class representing an NPS message.
 *
 * @property {NPSMessageHeader} _header
 * @property {NPSMessagePayload} data
 */
export declare class NPSMessage {
  _header: NPSMessageHeader;
  data: NPSMessagePayload;
  constructor();
  /**
   *
   * @param {Buffer} data
   * @returns {NPSMessage}
   */
  static parse(data: Buffer): NPSMessage;
  /**
   * @returns Buffer
   */
  toBuffer(): Buffer;
  /**
   * @returns string
   */
  toString(): string;
}
