import { CONFIG } from '../config.js';

/**
 * Advanced Atmospheric & VFX Particle System:
 * - Dynamic Procedural Cosmic Nebula Backdrops
 * - 3-Tier Multi-Layer Parallax Starfield with twinkling
 * - Luminous Energy Debris & Streak Sparks
 * - Expanding Shockwave Rings on Heavy Explosions
 * - Screen Shake & Chromatic Aberration Juice
 */
export class ParticleSystem {
  constructor(width = CONFIG.CANVAS.WIDTH, height = CONFIG.CANVAS.HEIGHT) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.shockwaves = [];
    this.starLayers = [];
    this.nebulae = [];

    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.glitchTimer = 0;

    this._initNebulae();
    this._initStarfield();
  }

  _rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  _initNebulae() {
    this.nebulae = [
      { x: this.width * 0.25, y: this.height * 0.3, r: 240, color: 'rgba(56, 189, 248, 0.08)' },
      { x: this.width * 0.75, y: this.height * 0.7, r: 280, color: 'rgba(217, 70, 239, 0.07)' },
      { x: this.width * 0.8, y: this.height * 0.25, r: 210, color: 'rgba(99, 102, 241, 0.06)' },
      { x: this.width * 0.3, y: this.height * 0.85, r: 260, color: 'rgba(244, 63, 94, 0.06)' }
    ];
  }

  _initStarfield() {
    this.starLayers = CONFIG.ATMOSPHERE.STAR_LAYERS.map((cfg) => {
      const stars = [];
      for (let i = 0; i < cfg.count; i++) {
        stars.push({
          x: this._rand(0, this.width),
          y: this._rand(0, this.height),
          size: this._rand(cfg.minSize, cfg.maxSize),
          baseAlpha: this._rand(cfg.alpha * 0.6, cfg.alpha),
          twinkleSpeed: this._rand(0.02, 0.05),
          twinklePhase: this._rand(0, Math.PI * 2),
          color: Math.random() > 0.3 ? '#e0f2fe' : Math.random() > 0.5 ? '#fbcfe8' : '#fef08a'
        });
      }
      return { speed: cfg.speed, stars };
    });
  }

  triggerScreenShake(intensity = 6, duration = 12) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  triggerGlitch(duration = 10) {
    this.glitchTimer = duration;
  }

  triggerShockwave(x, y, maxR = 60, color = '#00f0ff') {
    this.shockwaves.push({
      x,
      y,
      r: 6,
      maxR,
      color,
      alpha: 1.0,
      width: 3.5
    });
  }

  spawnDebris(x, y, count = CONFIG.PARTICLES.DEBRIS_COUNT, baseColor = null) {
    const colors = baseColor
      ? [baseColor, '#ffffff']
      : ['#00f0ff', '#ff007f', '#ffd000', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const speed = this._rand(1.5, CONFIG.PARTICLES.DEBRIS_SPEED_RANGE * 1.6);
      const angle = this._rand(0, Math.PI * 2);
      const life = this._rand(CONFIG.PARTICLES.LIFE_MIN, CONFIG.PARTICLES.LIFE_MAX);
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size: this._rand(1.8, 3.2),
        color: chosenColor,
        isThrust: false
      });
    }

    // Also trigger expanding shockwave
    this.triggerShockwave(x, y, count > 20 ? 85 : 45, colors[0]);
  }

  spawnThrustParticle(x, y, shipAngle) {
    // Plasma exhaust flame with cone spread
    const spread = this._rand(-0.35, 0.35);
    const speed = this._rand(2.0, 5.0);
    const exhaustAngle = shipAngle + Math.PI + spread;
    const colors = ['#ffffff', '#00f0ff', '#38bdf8', '#ff007f'];

    this.particles.push({
      x: x + this._rand(-2, 2),
      y: y + this._rand(-2, 2),
      vx: Math.cos(exhaustAngle) * speed,
      vy: Math.sin(exhaustAngle) * speed,
      life: this._rand(10, 18),
      maxLife: 18,
      size: this._rand(2.2, 4.0),
      color: colors[Math.floor(Math.random() * colors.length)],
      isThrust: true
    });
  }

  update(dt = 1.0) {
    // 1. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const friction = p.isThrust ? 0.92 : CONFIG.PARTICLES.FRICTION;
      p.vx *= Math.pow(friction, dt);
      p.vy *= Math.pow(friction, dt);
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 2. Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += (sw.maxR - sw.r) * 0.18 * dt + 1.2 * dt;
      sw.alpha = Math.max(0, 1 - sw.r / sw.maxR);
      if (sw.alpha <= 0.05 || sw.r >= sw.maxR) {
        this.shockwaves.splice(i, 1);
      }
    }

    // 3. Update Camera Shake & Glitch
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      if (this.shakeDuration <= 0) this.shakeIntensity = 0;
    }
    if (this.glitchTimer > 0) {
      this.glitchTimer -= dt;
    }

    // 4. Update Star Twinkling
    for (const layer of this.starLayers) {
      for (const s of layer.stars) {
        s.twinklePhase += s.twinkleSpeed * dt;
      }
    }
  }

  clear() {
    this.particles = [];
    this.shockwaves = [];
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.glitchTimer = 0;
  }

  getShakeOffset() {
    if (this.shakeDuration > 0 && this.shakeIntensity > 0) {
      const power = (this.shakeDuration / 12) * this.shakeIntensity;
      return {
        x: (Math.random() - 0.5) * power * 2,
        y: (Math.random() - 0.5) * power * 2
      };
    }
    return { x: 0, y: 0 };
  }

  getGlitchActive() {
    return this.glitchTimer > 0;
  }

  drawStars(ctx) {
    // Deep cosmic space gradient
    const bgGrad = ctx.createLinearGradient(0, 0, this.width, this.height);
    bgGrad.addColorStop(0, '#040711');
    bgGrad.addColorStop(0.5, '#070b1a');
    bgGrad.addColorStop(1, '#05030d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Render Atmospheric Nebula Clouds
    ctx.save();
    for (const neb of this.nebulae) {
      const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Render 3-Layer Parallax Starfield
    for (const layer of this.starLayers) {
      for (const s of layer.stars) {
        const twinkle = Math.sin(s.twinklePhase) * 0.35;
        const alpha = Math.max(0.1, Math.min(1.0, s.baseAlpha + twinkle));
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.size > 2 ? 6 : 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }

  drawShockwaves(ctx) {
    for (const sw of this.shockwaves) {
      ctx.save();
      ctx.globalAlpha = sw.alpha * 0.85;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = sw.width * sw.alpha;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawParticles(ctx) {
    this.drawShockwaves(ctx);

    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const alpha = Math.max(p.life / p.maxLife, 0);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      if (p.isThrust) {
        // Soft glowing plasma flame
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Radiant motion-streaked spark
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 1.2) {
          ctx.lineWidth = p.size;
          ctx.strokeStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
}
