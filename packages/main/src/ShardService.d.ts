export declare class ShardService {
  /**
   *
   * @param {number} id
   * @param {string} name
   * @param {string} description
   * @param {string} ip
   * @param {string} serverGroupName
   */
  addShard(
    id: number,
    name: string,
    description: string,
    ip: string,
    serverGroupName: string,
  ): void;
  /**
   * @returns {string}
   */
  getShardList(): string;
}
