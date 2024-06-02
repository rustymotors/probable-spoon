export declare class UserLoginService {
  /**
   * Returns the customer ID if the user is valid, otherwise -1.
   *
   * @param {string} username
   * @param {string} password
   * @returns {number}
   */
  checkUser(username: string, password: string): number;
  /**
   * Creates a token for the given customer ID.
   *
   * @param {number} customerId
   * @returns {string}
   */
  createToken(
    customerId: number,
  ): `${string}-${string}-${string}-${string}-${string}`;
  /**
   * Checks if the token is valid and returns the customer ID.
   * If the token is invalid, returns -1.
   *
   * @param {string} token
   * @returns {number}
   */
  checkToken(token: string): any;
  /**
   * Deletes the token.
   *
   * @param {string} token
   */
  deleteToken(token: string): void;
  /**
   * Deletes all tokens.
   * @returns {Promise<void>}
   */
  deleteAllTokens(): Promise<void>;
}
