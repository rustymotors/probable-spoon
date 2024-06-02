/**
 *
 * @param {import("./NPSUserLoginPayload.js").NPSUserLoginPayload} payload
 * @param {TClientCallback} clientCallback
 */
export function handleUserLogin(payload, clientCallback) {
  const userLoginPayload = payload;
  console.log(`User login: ${userLoginPayload.toString()}`);
}
//# sourceMappingURL=handleUserLogin.js.map
