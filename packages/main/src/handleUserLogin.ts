import { NPSUserLoginPayload } from "./NPSUserLoginPayload.js";
import type { TClientCallback } from "./types.js";

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
}
