/// <reference types="node" resolution-mode="require"/>
/**
 * Class representing an NPS message header.
 */
export declare class NPSMessageHeader {
  _dataStart: number;
  messageId: number;
  messageLength: number;
  version: number;
  constructor();
  /**
   *
   * @param {Buffer} data
   * @returns NPSMessageHeader
   */
  static parse(data: Buffer): NPSMessageHeader;
  get dataOffset(): number;
  /**
   * @private
   * @returns Buffer
   */
  _writeExtraData(): Buffer;
  /**
   * @returns Buffer
   */
  toBuffer(): Buffer;
  /**
   * @returns string
   */
  toString(): string;
}
