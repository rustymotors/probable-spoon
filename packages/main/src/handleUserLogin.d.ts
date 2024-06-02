import { NPSUserLoginPayload } from "./NPSUserLoginPayload.js";
import { TClientCallback } from "./types.js";
/**
 *
 * @param {import("./NPSUserLoginPayload.js").NPSUserLoginPayload} payload
 * @param {TClientCallback} clientCallback
 */
export declare function handleUserLogin(
  payload: NPSUserLoginPayload,
  clientCallback: TClientCallback,
): void;
