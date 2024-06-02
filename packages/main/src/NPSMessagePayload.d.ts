/**
 * To be used as a base class for NPS message payloads.
 *
 * @implements {INPSPayload}
 * @class
 * @property {Buffer} data
 *
 * @example
 * class MyPayload extends NPSMessagePayload {
 *  constructor() {
 *      super();
 *      this.myProperty = 0;
 *  }
 *
 *  static parse(data) {
 *      this.myProperty = data.readUInt32LE(0);
 *  }
 *
 *  toBuffer() {
 *      const buffer = Buffer.alloc(4);
 *      buffer.writeUInt32LE(this.myProperty, 0);
 *      return buffer;
 *  }
 *
 *  toString() {
 *      return `MyPayload: ${this.myProperty}`;
 *  }
 * }
 */
/// <reference types="node" resolution-mode="require"/>
export declare class NPSMessagePayload {
  data: Buffer;
  constructor();
  /**
   *
   * @param {Buffer} data
   * @returns NPSMessagePayload
   */
  static parse(data: Buffer, len?: number): NPSMessagePayload;
  /**
   * @returns Buffer
   */
  toBuffer(): Buffer;
  /**
   * @returns string
   */
  toString(): string;
}
