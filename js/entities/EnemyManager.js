import { CONFIG } from '../config.js';
import { Physics } from '../systems/Physics.js';

/**
 * Manages wave spawning, motion, splitting, and high-fidelity
 * Crystalline Cyberpunk Asteroid rendering with glowing mineral veins.
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

    // Determine neon vein and perimeter colors based on size
    let veinColor, strokeColor;
    if (size === 3) {
      veinColor = '#00f0ff'; // Electric Cyan
      strokeColor = '#38bdf8';
    } else if (size === 2) {
      veinColor = '#d946ef'; // Plasma Magenta
      strokeColor = '#f472b6';
    } else {
      veinColor = '#fbbf24'; // Cyber Amber Gold
      strokeColor = '#fde047';
    }

    // Generate internal crystal fissure vein connections
    const veins = [];
    const step = Math.max(2, Math.floor(verts / 4));
    for (let i = 0; i < verts; i += step) {
      veins.push(i);
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
      offsets,
      veins,
      veinColor,
      strokeColor
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
      particleSystem.spawnDebris(asteroid.x, asteroid.y, CONFIG.PARTICLES.DEBRIS_COUNT, asteroid.veinColor);
      particleSystem.triggerScreenShake(asteroid.size === 3 ? 6 : 4, 10);
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
    for (let i = 0; i < this.asteroids.length; i++) {
      const a = this.asteroids[i];
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.angle);

      // Precalculate vertex positions
      const pts = [];
      for (let j = 0; j < a.verts; j++) {
        const ang = (j / a.verts) * Math.PI * 2;
        const rr = a.r * a.offsets[j];
        pts.push({ x: Math.cos(ang) * rr, y: Math.sin(ang) * rr });
      }

      // 1. Dark Obsidian Body Fill
      ctx.beginPath();
      for (let j = 0; j < pts.length; j++) {
        if (j === 0) ctx.moveTo(pts[j].x, pts[j].y);
        else ctx.lineTo(pts[j].x, pts[j].y);
      }
      ctx.closePath();
      ctx.fillStyle = CONFIG.ASTEROIDS.COLORS.HULL_FILL;
      ctx.fill();

      // 2. Glowing Internal Crystal Veins
      ctx.save();
      ctx.strokeStyle = a.veinColor;
      ctx.shadowColor = a.veinColor;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.85;
      for (const idx of a.veins) {
        if (pts[idx]) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(pts[idx].x * 0.95, pts[idx].y * 0.95);
          ctx.stroke();

          // Sub-branch vein
          const nextIdx = (idx + 1) % pts.length;
          ctx.beginPath();
          ctx.moveTo(pts[idx].x * 0.5, pts[idx].y * 0.5);
          ctx.lineTo(pts[nextIdx].x * 0.7, pts[nextIdx].y * 0.7);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Outer Faceted Luminous Border
      ctx.strokeStyle = a.strokeColor;
      ctx.shadowColor = a.strokeColor;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let j = 0; j < pts.length; j++) {
        if (j === 0) ctx.moveTo(pts[j].x, pts[j].y);
        else ctx.lineTo(pts[j].x, pts[j].y);
      }
      ctx.closePath();
      ctx.stroke();

      // 4. Highlight Nodes at Facet Vertices
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = a.veinColor;
      ctx.shadowBlur = 6;
      for (let j = 0; j < pts.length; j += 2) {
        ctx.beginPath();
        ctx.arc(pts[j].x, pts[j].y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  clear() {
    this.asteroids = [];
  }
}
