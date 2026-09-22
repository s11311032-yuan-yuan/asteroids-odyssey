import { CONFIG } from '../config.js';

/**
 * Handles explosion debris, starfield background rendering, and screen shake juice.
 */
export class ParticleSystem {
  constructor(width = CONFIG.CANVAS.WIDTH, height = CONFIG.CANVAS.HEIGHT) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.starField = [];
    this.shakeDuration = 0;
    this.shakeIntensity = 0;

    this._initStarfield();
  }

  _rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  _initStarfield() {
    this.starField = [];
    for (let i = 0; i < CONFIG.STARFIELD.COUNT; i++) {
      this.starField.push({
        x: this._rand(0, this.width),
        y: this._rand(0, this.height),
        size: this._rand(1, 2),
        a: this._rand(0.2, 0.9)
      });
    }
  }

  triggerScreenShake(intensity = 6, duration = 12) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  spawnDebris(x, y, count = CONFIG.PARTICLES.DEBRIS_COUNT, color = CONFIG.PARTICLES.COLOR) {
    for (let i = 0; i < count; i++) {
      const speed = CONFIG.PARTICLES.DEBRIS_SPEED_RANGE;
      const life = this._rand(CONFIG.PARTICLES.LIFE_MIN, CONFIG.PARTICLES.LIFE_MAX);
      this.particles.push({
        x,
        y,
        vx: this._rand(-speed, speed),
        vy: this._rand(-speed, speed),
        life: life,
        maxLife: CONFIG.PARTICLES.LIFE_MAX,
        color: color
      });
    }
  }

  update(dt = 1.0) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(CONFIG.PARTICLES.FRICTION, dt);
      p.vy *= Math.pow(CONFIG.PARTICLES.FRICTION, dt);
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      if (this.shakeDuration <= 0) {
        this.shakeIntensity = 0;
      }
    }
  }

  clear() {
    this.particles = [];
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
  }

  getShakeOffset() {
    if (this.shakeDuration > 0 && this.shakeIntensity > 0) {
      const currentPower = (this.shakeDuration / 12) * this.shakeIntensity;
      return {
        x: (Math.random() - 0.5) * currentPower * 2,
        y: (Math.random() - 0.5) * currentPower * 2
      };
    }
    return { x: 0, y: 0 };
  }

  drawStars(ctx) {
    ctx.fillStyle = CONFIG.STARFIELD.BG_COLOR;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = CONFIG.STARFIELD.STAR_COLOR;
    for (let i = 0; i < this.starField.length; i++) {
      const s = this.starField[i];
      ctx.globalAlpha = s.a;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    ctx.globalAlpha = 1.0;
  }

  drawParticles(ctx) {
    ctx.shadowBlur = 0;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.globalAlpha = Math.max(p.life / p.maxLife, 0);
      ctx.fillStyle = p.color || CONFIG.PARTICLES.COLOR;
      ctx.fillRect(p.x, p.y, 2, 2);
    }
    ctx.globalAlpha = 1.0;
  }
}
