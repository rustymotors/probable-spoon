import { NPSMessage } from "./NPSMessage.js";
import { NPSUserLoginPayload } from "./NPSUserLoginPayload.js";

/** 
 * @typedef INPSPayload 
 * @type {import("./NPSMessagePayload.js").INPSPayload}
 */ 

/** @type {Map<number, (data: Buffer, len: number) => INPSPayload>} */
const payloadMap = new Map();



payloadMap.set(1281, NPSUserLoginPayload.parse);

/**
 * @param {number} port
 * @param {Buffer} data
 * @param {(data: Buffer) => void} sendToClient
 */
export function onNPSData(port, data, sendToClient) {
  const message = NPSMessage.parse(data);
  console.log(`Received message on port ${port}: ${message.toString()}`);

  const messageType = payloadMap.get(message._header.messageId);

  if (!messageType) {
    console.error(`Unknown message type: ${message._header.messageId}`);
    return;
  }

  const payload = messageType(message.data.data, message._header.messageLength - message._header.dataOffset);

  console.log(`Parsed payload: ${payload.toString()}`);
}
