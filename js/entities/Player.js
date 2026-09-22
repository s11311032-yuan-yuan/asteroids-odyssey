import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { Physics } from '../systems/Physics.js';

/**
 * Player ship and projectile entity management.
 */
export class Player extends Entity {
  constructor() {
    super(CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2, CONFIG.SHIP.RADIUS);
    this.reset();
  }

  reset() {
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
    return true;
  }

  update(inputHandler, dt = 1.0) {
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

    ctx.strokeStyle = CONFIG.SHIP.COLORS.BODY;
    ctx.lineWidth = 2;
    ctx.shadowColor = CONFIG.SHIP.COLORS.SHADOW;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-12, 10);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-12, -10);
    ctx.closePath();
    ctx.stroke();

    if (this.thrusting) {
      const flameFlicker = Math.random() * 8;
      ctx.strokeStyle = CONFIG.SHIP.COLORS.THRUST;
      ctx.shadowColor = CONFIG.SHIP.COLORS.THRUST;
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(-18 - flameFlicker, 0);
      ctx.moveTo(-8, -4);
      ctx.lineTo(-14, -1);
      ctx.moveTo(-8, 4);
      ctx.lineTo(-14, 1);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBullets(ctx) {
    ctx.fillStyle = CONFIG.WEAPON.COLOR;
    ctx.shadowColor = CONFIG.WEAPON.COLOR;
    ctx.shadowBlur = 8;
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
