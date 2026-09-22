import { CONFIG } from '../config.js';

/**
 * Physics utilities for collisions (AABB, circle-distance) and boundary wrapping.
 */
export class Physics {
  static distance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
  }

  static checkCircleCollision(entityA, entityB, extraMargin = 0) {
    const d = this.distance(entityA.x, entityA.y, entityB.x, entityB.y);
    return d < (entityA.r + entityB.r + extraMargin);
  }

  static checkAABB(boxA, boxB) {
    return (
      boxA.x < boxB.x + boxB.width &&
      boxA.x + boxA.width > boxB.x &&
      boxA.y < boxB.y + boxB.height &&
      boxA.y + boxA.height > boxB.y
    );
  }

  static checkCollision(a, b, margin = 0) {
    const totalR = a.r + b.r + margin;
    if (Math.abs(a.x - b.x) > totalR || Math.abs(a.y - b.y) > totalR) {
      return false;
    }
    return this.distance(a.x, a.y, b.x, b.y) < totalR;
  }

  static wrap(entity, width = CONFIG.CANVAS.WIDTH, height = CONFIG.CANVAS.HEIGHT) {
    if (entity.x < -entity.r) entity.x = width + entity.r;
    if (entity.x > width + entity.r) entity.x = -entity.r;
    if (entity.y < -entity.r) entity.y = height + entity.r;
    if (entity.y > height + entity.r) entity.y = -entity.r;
  }
}
