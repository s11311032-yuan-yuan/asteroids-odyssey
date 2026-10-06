import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { Physics } from '../systems/Physics.js';
import { SoundSystem } from '../systems/SoundSystem.js';

/**
 * Player ship and projectile entity management.
 */
export class Player extends Entity {
  constructor() {
    super(CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2, CONFIG.SHIP.RADIUS);
    this.reset();
  }

  reset() {
    SoundSystem.stopThrust();
    this.x = CONFIG.CANVAS.WIDTH / 2;
    this.y = CONFIG.CANVAS.HEIGHT / 2;
    this.vx = 0;
    this.vy = 0;
    this.angle = -Math.PI / 2;
    this.thrusting = false;
    this.fireCooldown = 0;
    this.invulnerableTimer = CONFIG.SHIP.INVULNERABLE_START;
    this.bullets = [];
  }

  respawn() {
    SoundSystem.stopThrust();
    this.x = CONFIG.CANVAS.WIDTH / 2;
    this.y = CONFIG.CANVAS.HEIGHT / 2;
    this.vx = 0;
    this.vy = 0;
    this.angle = -Math.PI / 2;
    this.thrusting = false;
    this.invulnerableTimer = CONFIG.SHIP.INVULNERABLE_RESPAWN;
  }

  isInvulnerable() {
    return this.invulnerableTimer > 0;
  }

  getCooldownRatio() {
    return Math.max(0, 1 - (this.fireCooldown / CONFIG.WEAPON.FIRE_COOLDOWN));
  }

  fire() {
    if (this.fireCooldown > 0) return false;

    this.fireCooldown = CONFIG.WEAPON.FIRE_COOLDOWN;
    const bullet = {
      x: this.x + Math.cos(this.angle) * this.r,
      y: this.y + Math.sin(this.angle) * this.r,
      vx: Math.cos(this.angle) * CONFIG.WEAPON.BULLET_SPEED + this.vx * CONFIG.WEAPON.BULLET_INHERIT_VELOCITY,
      vy: Math.sin(this.angle) * CONFIG.WEAPON.BULLET_SPEED + this.vy * CONFIG.WEAPON.BULLET_INHERIT_VELOCITY,
      r: CONFIG.WEAPON.BULLET_RADIUS,
      life: CONFIG.WEAPON.BULLET_LIFETIME
    };
    this.bullets.push(bullet);
    SoundSystem.playLaser();
    return true;
  }

  update(inputHandler, dt = 1.0, particleSystem = null) {
    const rotSpeed = CONFIG.SHIP.ROTATION_SPEED * dt;
    const thrust = CONFIG.SHIP.THRUST * dt;

    if (inputHandler.isRotateLeft()) this.angle -= rotSpeed;
    if (inputHandler.isRotateRight()) this.angle += rotSpeed;

    if (inputHandler.mouse.active) {
      const targetAngle = Math.atan2(inputHandler.mouse.y - this.y, inputHandler.mouse.x - this.x);
      let diff = targetAngle - this.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      if (inputHandler.mouse.down) {
        this.angle += diff * (CONFIG.SHIP.MOUSE_ROTATION_FACTOR * dt);
      }
    }

    this.thrusting = false;
    if (inputHandler.isThrust()) {
      this.vx += Math.cos(this.angle) * thrust;
      this.vy += Math.sin(this.angle) * thrust;
      this.thrusting = true;
      SoundSystem.playThrust();

      if (particleSystem) {
        const exhaustX = this.x - Math.cos(this.angle) * (this.r * 0.8);
        const exhaustY = this.y - Math.sin(this.angle) * (this.r * 0.8);
        particleSystem.spawnThrustParticle(exhaustX, exhaustY, this.angle);
      }
    } else {
      SoundSystem.stopThrust();
    }

    if (inputHandler.isReverse()) {
      this.vx -= Math.cos(this.angle) * thrust * CONFIG.SHIP.REVERSE_FACTOR;
      this.vy -= Math.sin(this.angle) * thrust * CONFIG.SHIP.REVERSE_FACTOR;
    }

    const friction = Math.pow(CONFIG.SHIP.FRICTION, dt);
    this.vx *= friction;
    this.vy *= friction;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    Physics.wrap(this);

    if (this.fireCooldown > 0) {
      this.fireCooldown -= dt;
      if (this.fireCooldown < 0) this.fireCooldown = 0;
    }

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
      if (this.invulnerableTimer < 0) this.invulnerableTimer = 0;
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      Physics.wrap(b);
      if (b.life <= 0) {
        this.bullets.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 5) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    // 1. Dark Metallic Hull Base
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-12, 12);
    ctx.lineTo(-7, 3);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-7, -3);
    ctx.lineTo(-12, -12);
    ctx.closePath();
    ctx.fillStyle = CONFIG.SHIP.COLORS.HULL_FILL;
    ctx.fill();

    // 2. Electric Cyan Neon Outer Glow
    ctx.strokeStyle = CONFIG.SHIP.COLORS.PRIMARY_NEON;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = CONFIG.SHIP.COLORS.SHADOW;
    ctx.shadowBlur = 14;
    ctx.stroke();

    // 3. Wingtip Stabilizer Accents (Hot Magenta)
    ctx.strokeStyle = CONFIG.SHIP.COLORS.SECONDARY_NEON;
    ctx.shadowColor = CONFIG.SHIP.COLORS.SECONDARY_NEON;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-4, 7);
    ctx.lineTo(-12, 12);
    ctx.moveTo(-4, -7);
    ctx.lineTo(-12, -12);
    ctx.stroke();

    // 4. Glowing Cockpit Visor
    ctx.fillStyle = CONFIG.SHIP.COLORS.CANOPY;
    ctx.shadowColor = CONFIG.SHIP.COLORS.CANOPY;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(3, 0, 5, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor core glint
    ctx.fillStyle = CONFIG.SHIP.COLORS.CANOPY_CORE;
    ctx.beginPath();
    ctx.ellipse(4, 0, 2.5, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Multi-Layer Ion Thruster Flame
    if (this.thrusting) {
      const flicker = Math.random() * 8;
      
      // Outer Plasma Flame (Magenta)
      ctx.strokeStyle = CONFIG.SHIP.COLORS.THRUST_OUTER;
      ctx.shadowColor = CONFIG.SHIP.COLORS.THRUST_OUTER;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(-22 - flicker, 0);
      ctx.moveTo(-7, -3);
      ctx.lineTo(-15 - flicker * 0.6, -1);
      ctx.moveTo(-7, 3);
      ctx.lineTo(-15 - flicker * 0.6, 1);
      ctx.stroke();

      // Mid Flame (Cyan)
      ctx.strokeStyle = CONFIG.SHIP.COLORS.THRUST_MID;
      ctx.shadowColor = CONFIG.SHIP.COLORS.THRUST_MID;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-16 - flicker * 0.7, 0);
      ctx.stroke();

      // Inner White Core
      ctx.strokeStyle = CONFIG.SHIP.COLORS.THRUST_CORE;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-12, 0);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBullets(ctx) {
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      const bulletAngle = Math.atan2(b.vy, b.vx);

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(bulletAngle);

      // Outer Cyan Energy Bloom
      ctx.shadowColor = CONFIG.WEAPON.COLOR_GLOW;
      ctx.shadowBlur = 12;
      ctx.fillStyle = CONFIG.WEAPON.COLOR_GLOW;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner White-Hot Plasma Core
      ctx.fillStyle = CONFIG.WEAPON.COLOR_CORE;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.ellipse(1, 0, 4.5, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
