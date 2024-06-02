/**
 *
 * @param {Error} err
 */
declare function onServerError(err: Error): void;
/**
 *
 * @param {number} exitCode
 */
declare function _atExit(exitCode?: number): Promise<void>;
declare function main(): void;
export { main, _atExit, onServerError };
