import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { Physics } from '../systems/Physics.js';
import { SoundSystem } from '../systems/SoundSystem.js';

/**
 * Boss Entity: The Leviathan Core (Chapter 5)
 * Features multi-phase HP, rotating crystalline shield shards, and targeted energy bursts.
 */
export class Boss extends Entity {
  constructor(x = CONFIG.CANVAS.WIDTH / 2, y = CONFIG.CANVAS.HEIGHT / 3) {
    super(x, y, 65);
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.angle = 0;
    this.spinSpeed = 0.015;

    // Movement
    this.vx = 0.6;
    this.vy = 0.3;

    // Attack cooldowns
    this.fireTimer = 90;
    this.bullets = [];

    // Shield satellites
    this.shields = [
      { angle: 0, r: 95, size: 14 },
      { angle: Math.PI * 0.66, r: 95, size: 14 },
      { angle: Math.PI * 1.33, r: 95, size: 14 }
    ];

    // Phase 2 indicator
    this.enraged = false;
  }

  takeDamage(amount = 2) {
    this.hp -= amount;
    if (this.hp <= this.maxHp * 0.5 && !this.enraged) {
      this.enraged = true;
      this.spinSpeed = 0.03;
    }
    if (this.hp <= 0) {
      this.hp = 0;
      this.active = false;
      return true; // Boss defeated
    }
    return false;
  }

  getHpRatio() {
    return Math.max(0, this.hp / this.maxHp);
  }

  update(player, dt = 1.0) {
    if (!this.active) return;

    // Smooth floating movement around upper-middle
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < 120 || this.x > CONFIG.CANVAS.WIDTH - 120) this.vx *= -1;
    if (this.y < 80 || this.y > 240) this.vy *= -1;

    this.angle += this.spinSpeed * dt;

    // Update rotating shields
    for (const shield of this.shields) {
      shield.angle += (this.enraged ? 0.04 : 0.02) * dt;
    }

    // Boss weapon firing
    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this._fireBarrage(player);
      this.fireTimer = this.enraged ? 55 : 85;
    }

    // Update boss bullets
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

  _fireBarrage(player) {
    SoundSystem.playBossLaser();
    const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
    const speed = this.enraged ? 3.8 : 3.0;

    if (this.enraged) {
      // 3-way spread shot
      for (const spread of [-0.25, 0, 0.25]) {
        this.bullets.push({
          x: this.x + Math.cos(angleToPlayer + spread) * (this.r * 0.8),
          y: this.y + Math.sin(angleToPlayer + spread) * (this.r * 0.8),
          vx: Math.cos(angleToPlayer + spread) * speed,
          vy: Math.sin(angleToPlayer + spread) * speed,
          r: 4,
          life: 140
        });
      }
    } else {
      // Single aimed shot
      this.bullets.push({
        x: this.x + Math.cos(angleToPlayer) * (this.r * 0.8),
        y: this.y + Math.sin(angleToPlayer) * (this.r * 0.8),
        vx: Math.cos(angleToPlayer) * speed,
        vy: Math.sin(angleToPlayer) * speed,
        r: 3.5,
        life: 130
      });
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Glow aura
    ctx.shadowBlur = this.enraged ? 25 : 16;
    ctx.shadowColor = this.enraged ? '#ff2a55' : '#a855f7';

    // Outer rotating crystal ring
    ctx.save();
    ctx.rotate(this.angle);
    ctx.strokeStyle = this.enraged ? '#ff5577' : '#c084fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const sides = 8;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      const rad = this.r * (i % 2 === 0 ? 1.0 : 0.75);
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner pulsating core
    ctx.fillStyle = this.enraged ? '#ff0055' : '#7e22ce';
    ctx.beginPath();
    ctx.arc(0, 0, 24 + Math.sin(Date.now() * 0.005) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Orbiting shield fragments
    for (const s of this.shields) {
      const sx = Math.cos(s.angle) * s.r;
      const sy = Math.sin(s.angle) * s.r;
      ctx.fillStyle = '#67e8f9';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Draw Boss Bullets
    ctx.fillStyle = this.enraged ? '#ff0055' : '#c084fc';
    ctx.shadowColor = this.enraged ? '#ff0055' : '#c084fc';
    ctx.shadowBlur = 10;
    for (const b of this.bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
