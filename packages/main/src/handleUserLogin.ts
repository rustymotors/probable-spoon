import { NPSUserLoginPayload } from "./NPSUserLoginPayload.js";
import fs from "node:fs";
import crypto from "node:crypto";
import type { TClientCallback } from "./types.js";

export function loadPrivateKey(path: string): string {
  const privateKey = fs.readFileSync(path);

  return privateKey.toString("utf8");
}

console.log("foo!");

export function decryptSessionKey(
  encryptedSessionKey: string,
  privateKey: string,
): string {
  const sessionKeyStructure = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedSessionKey, "hex"),
  );

  return sessionKeyStructure.toString("hex");
}

/**
 *
 * @param {import("./NPSUserLoginPayload.js").NPSUserLoginPayload} payload
 * @param {TClientCallback} clientCallback
 */
export function handleUserLogin(
  payload: NPSUserLoginPayload,
  clientCallback: TClientCallback,
) {
  const userLoginPayload = payload;
  console.log(`User login: ${userLoginPayload.toString()}`);

  const privateKey = loadPrivateKey("data/private_key.pem");

  const sessionKey = decryptSessionKey(
    userLoginPayload.sessionKey.toString(),
    privateKey,
  );

  console.log(`Session key: ${Buffer.from(sessionKey, "hex").toString("hex")}`);

  const key = sessionKey.slice(4, 4 + 64);

  console.log(`Key: ${Buffer.from(key, "hex").toString("hex")}`);
}
