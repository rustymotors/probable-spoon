import { NPSMessageHeader } from "./NPSMessageHeader.js";
import { NPSMessagePayload } from "./NPSMessagePayload.js";

export class NPSMessage {
  constructor() {
    this._header = new NPSMessageHeader();
    this.data = new NPSMessagePayload();
  }
  /**
   *
   * @param {Buffer} data
   * @returns {NPSMessage}
   */
  static parse(data) {
    const self = new NPSMessage();
    if (data.length < 8) {
      throw new Error(`Invalid message length: ${data.length}`);
    }

    self._header = NPSMessageHeader.parse(data);

    const expectedLength = self._header.messageLength - self._header.dataOffset;

    self.data = NPSMessagePayload.parse(
      data.subarray(self._header.dataOffset),
      expectedLength,
    );

    return self;
  }

  /**
   * @returns Buffer
   */
  toBuffer() {
    return Buffer.concat([this._header.toBuffer(), this.data.toBuffer()]);
  }

  /**
   * @returns string
   */
  toString() {
    return `${this._header.toString()}, Data: ${this.data.toString()}`;
  }
}
