import { emitKeypressEvents } from "node:readline";
import { _atExit } from "obsidian-main";

export class MainLoop {
  /** @type {NodeJS.Timeout | undefined} */
  _timer = undefined;

  /** @typedef {function(): Promise<void> | void | any} Task */
  /** @type {Array<Task>} */
  _startTasks = [];

  /** @type {Array<Task>} */
  _stopTasks = [];

  /** @type {Array<Task>} */
  _loopTasks = [];

  /**
   *
   * @param {import("obsidian-main").KeypressEvent} key
   */
  handleKeypressEvent(key) {
    const keyString = key.sequence;

    if (keyString === "x") {
      this.stop();
    }
  }
  /**
   *
   * @param {"start" | "loop" | "stop"} type
   * @param {Task} task
   */
  addTask(type, task) {
    if (type === "start") {
      this._startTasks.push(task);
    } else if (type === "stop") {
      this._stopTasks.push(task);
    } else if (type === "loop") {
      this._loopTasks.push(task);
    }
  }

  /**
   * @param {Array<Task>} tasks
   */
  async _callTasks(tasks) {
    tasks.forEach(async (task) => {
      await task();
    });
  }

  async start() {
    this.timer = setTimeout(this.loop.bind(this), 1000);
    if (process.stdin.isTTY !== true) {
      return;
    }
    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    console.log("Press X to exit");
    process.stdin.on("keypress", (str, key) => {
      if (key !== undefined) {
        this.handleKeypressEvent(key);
      }
    });
    await this._callTasks(this._startTasks);
  }

  async stop() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      process.stdin.setRawMode(false);
      console.log("Exiting...");
      await this._callTasks(this._stopTasks);
      _atExit();
    }
  }

  async loop() {
    await this._callTasks(this._loopTasks);
    this.timer = setTimeout(this.loop.bind(this), 1000);
  }
}
