/// <reference types="node" resolution-mode="require"/>
import { KeypressEvent, TTask } from "./types.js";
export declare class MainLoop {
  /** @type {NodeJS.Timeout | undefined} */
  _timer: NodeJS.Timeout | undefined;
  /** @type {Array<import("obsidian-main").Task>} */
  _startTasks: Array<TTask>;
  /** @type {Array<import("obsidian-main").Task>} */
  _stopTasks: Array<TTask>;
  /** @type {Array<import("obsidian-main").Task>} */
  _loopTasks: Array<TTask>;
  /**
   *
   * @param {import("obsidian-main").KeypressEvent} key
   */
  handleKeypressEvent(key: KeypressEvent): void;
  /**
   *
   * @param {"start" | "loop" | "stop"} type
   * @param {import("obsidian-main").Task} task
   */
  addTask(type: "start" | "loop" | "stop", task: TTask): void;
  /**
   * @param {Array<import("obsidian-main").Task>} tasks
   */
  _callTasks(tasks: Array<TTask>): Promise<void>;
  /**
   * Starts the main loop.
   *
   */
  start(): Promise<void>;
  /**
   * Stops the main loop.
   */
  stop(): Promise<void>;
  /**
   * Body of the main loop.
   */
  loop(): Promise<void>;
}
