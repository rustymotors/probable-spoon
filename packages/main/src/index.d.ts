declare module "obsidian-main" {
  export default function main(): void;

  export interface KeypressEvent {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
  }

  export type Task = () => Promise<void> | void | any;

  export interface IShardEntry {
    formatForWeb(): string;
  }

  export function _atExit(): void;
}
