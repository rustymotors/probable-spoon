import { describe, expect, it, vi } from "vitest";

import { TCPServer } from "../src/index.js";

describe("TCPServer", () => {
  it("should return an error if the port is priviliged", () => /** @type {Promise<void>} */(new Promise(done => {
    const onListening = vi.fn();
    const onConnection = vi.fn();
    const onServerError = vi.fn().mockImplementation((err) => {
      expect(err.message).toMatch(/EACCES/);
      done();
    });

    console.error = vi.fn();

    const s = new TCPServer(80, onListening, onConnection, onServerError);
    s.listen();
  })));

  it("should return an error if the port is in use", () => /** @type {Promise<void>} */(new Promise(done => {
    const onListening = vi.fn();
    const onConnection = vi.fn();
    const onServerError = vi.fn().mockImplementation((err) => {
      expect(err.message).toMatch(/EADDRINUSE/);
      done();
    });

    console.error = vi.fn();

    const s = new TCPServer(8080, onListening, onConnection, onServerError);
    s.listen();
  })));
});
