import { Physics } from '../systems/Physics.js';

/**
 * Base Entity class for game objects.
 */
export class Entity {
  constructor(x = 0, y = 0, r = 10) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = r;
    this.angle = 0;
    this.active = true;
  }

  update(dt = 1.0) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    Physics.wrap(this);
  }

  draw(ctx) {}

  getBounds() {
    return {
      x: this.x - this.r,
      y: this.y - this.r,
      width: this.r * 2,
      height: this.r * 2
    };
  }
}
