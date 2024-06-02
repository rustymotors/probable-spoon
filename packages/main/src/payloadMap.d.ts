/**
 *
 * @param {number} messageId
 * @returns {((data: Buffer, len: number) => INPSPayload) | undefined}
 */
declare function getPayloadParser(messageId: number): any;
/**
 *
 * @param {number} messageId
 * @returns {((payload: INPSPayload, clientCallback: (data: Buffer) => void) => void) | undefined}
 */
declare function getPayloadHandler(messageId: number): any;
export { getPayloadParser, getPayloadHandler };
