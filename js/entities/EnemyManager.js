import { CONFIG } from '../config.js';
import { Physics } from '../systems/Physics.js';

/**
 * Manages wave spawning, motion, splitting, and rendering of Asteroid entities.
 */
export class EnemyManager {
  constructor() {
    this.asteroids = [];
  }

  _rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  createAsteroid(x, y, size) {
    const config = CONFIG.ASTEROIDS.SIZES[size] || CONFIG.ASTEROIDS.SIZES[3];
    const baseR = config.baseR;
    const verts = Math.floor(this._rand(CONFIG.ASTEROIDS.VERTS_MIN, CONFIG.ASTEROIDS.VERTS_MAX));
    const offsets = [];
    for (let i = 0; i < verts; i++) {
      offsets.push(this._rand(CONFIG.ASTEROIDS.OFFSET_MIN, CONFIG.ASTEROIDS.OFFSET_MAX));
    }

    return {
      x,
      y,
      vx: this._rand(-1, 1) * config.speedMult,
      vy: this._rand(-1, 1) * config.speedMult,
      r: baseR,
      size,
      angle: this._rand(0, Math.PI * 2),
      spin: this._rand(-CONFIG.ASTEROIDS.SPIN_RANGE, CONFIG.ASTEROIDS.SPIN_RANGE),
      verts,
      offsets
    };
  }

  spawnWave(count, shipX, shipY) {
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = this._rand(0, CONFIG.CANVAS.WIDTH);
        y = this._rand(0, CONFIG.CANVAS.HEIGHT);
      } while (Physics.distance(x, y, shipX, shipY) < CONFIG.ASTEROIDS.SAFE_SPAWN_DISTANCE);

      this.asteroids.push(this.createAsteroid(x, y, 3));
    }
  }

  splitAsteroid(asteroid, particleSystem) {
    const scoreVal = CONFIG.ASTEROIDS.SIZES[asteroid.size]?.score || 20;

    if (particleSystem) {
      particleSystem.spawnDebris(asteroid.x, asteroid.y);
      particleSystem.triggerScreenShake(4, 8);
    }

    if (asteroid.size > 1) {
      const nextSize = asteroid.size - 1;
      for (let i = 0; i < 2; i++) {
        const child = this.createAsteroid(asteroid.x, asteroid.y, nextSize);
        child.vx += this._rand(-1, 1);
        child.vy += this._rand(-1, 1);
        this.asteroids.push(child);
      }
    }

    return scoreVal;
  }

  update(dt = 1.0) {
    for (let i = 0; i < this.asteroids.length; i++) {
      const a = this.asteroids[i];
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.angle += a.spin * dt;
      Physics.wrap(a);
    }
  }

  draw(ctx) {
    ctx.strokeStyle = CONFIG.ASTEROIDS.COLORS.STROKE;
    ctx.shadowColor = CONFIG.ASTEROIDS.COLORS.SHADOW;
    ctx.shadowBlur = 6;
    ctx.lineWidth = 2;

    for (let i = 0; i < this.asteroids.length; i++) {
      const a = this.asteroids[i];
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.angle);
      ctx.beginPath();
      for (let j = 0; j < a.verts; j++) {
        const ang = (j / a.verts) * Math.PI * 2;
        const rr = a.r * a.offsets[j];
        const px = Math.cos(ang) * rr;
        const py = Math.sin(ang) * rr;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  clear() {
    this.asteroids = [];
  }
}
