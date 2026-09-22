/**
 * GameLoop provides a robust animation loop using requestAnimationFrame
 * with delta time normalization (scaled relative to 60fps) to ensure consistent physics.
 */
export class GameLoop {
  constructor(updateFn, renderFn) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.running = false;
    this.rafId = null;

    this.loop = this.loop.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  loop(currentTime) {
    if (!this.running) return;

    const elapsed = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Delta time normalized to 60 FPS
    const dt = Math.min(elapsed / (1000 / 60), 3.0);

    this.updateFn(dt);
    this.renderFn();

    this.rafId = requestAnimationFrame(this.loop);
  }
}
