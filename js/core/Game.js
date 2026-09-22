import { CONFIG } from '../config.js';
import { GameLoop } from './GameLoop.js';
import { InputHandler } from './InputHandler.js';
import { Player } from '../entities/Player.js';
import { EnemyManager } from '../entities/EnemyManager.js';
import { Boss } from '../entities/Boss.js';
import { LevelManager } from '../entities/LevelManager.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { Physics } from '../systems/Physics.js';
import { HUD } from '../ui/HUD.js';
import { StoryOverlay } from '../ui/StoryOverlay.js';
import { I18n } from '../i18n/I18n.js';

/**
 * Main game coordinator class managing campaign progression, boss battles,
 * story dialogues, collisions, and multi-language support.
 */
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Systems & Handlers
    this.input = new InputHandler(this.canvas);
    this.hud = new HUD();
    this.story = new StoryOverlay();
    this.particles = new ParticleSystem(CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    this.enemies = new EnemyManager();
    this.player = new Player();
    this.levels = new LevelManager();
    this.boss = null;

    // Game state: 'idle' | 'briefing' | 'playing' | 'cleared' | 'over' | 'victory'
    this.state = 'idle';
    this.score = 0;
    this.lives = CONFIG.SHIP.INITIAL_LIVES;
    this.hiscore = this._loadHiScore();

    // Initialize HUD display & language
    this.hud.refreshTexts();
    this.hud.updateHiScore(this.hiscore);
    this.hud.updateScore(0);
    this.hud.renderLives(this.lives);

    // Listen for language changes to update HUD objective
    I18n.onChange(() => {
      this.hud.refreshTexts();
      this.updateObjectiveUI();
    });

    // Action listener (fire / restart)
    this.input.onAction((action) => {
      if (action === 'fireOrRestart') {
        if (this.state === 'over') {
          this.resetGame();
        } else if (this.state === 'playing') {
          this.player.fire();
        }
      }
    });

    // Create game loop
    this.loop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );
  }

  _loadHiScore() {
    try {
      return parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.HI_SCORE) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  _saveHiScore() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.HI_SCORE, String(this.hiscore));
    } catch (e) {}
  }

  start() {
    this.resetGame();
    this.loop.start();
  }

  resetGame() {
    this.score = 0;
    this.lives = CONFIG.SHIP.INITIAL_LIVES;
    this.levels.resetCampaign();

    this.player.reset();
    this.enemies.clear();
    this.particles.clear();
    this.boss = null;

    this.hud.hideGameOver();
    this.hud.hideStageClear();
    this.hud.hideVictory();
    this.hud.showBossHealth(false);
    this.hud.updateScore(this.score);
    this.hud.renderLives(this.lives);

    this._startChapter(1);
  }

  async _startChapter(chapterNumber) {
    this.state = 'briefing';
    this.levels.startLevel(chapterNumber);
    this.enemies.clear();
    this.particles.clear();
    this.player.respawn();

    this.hud.updateLevel(chapterNumber);
    this.updateObjectiveUI();

    // Spawn Boss if Chapter 5
    if (this.levels.isBossLevel()) {
      this.boss = new Boss();
      this.levels.boss = this.boss;
      this.hud.showBossHealth(true);
      this.hud.updateBossHealth(1.0);
    } else {
      this.boss = null;
      this.levels.boss = null;
      this.hud.showBossHealth(false);
      // Spawn wave of asteroids
      const count = 3 + chapterNumber;
      this.enemies.spawnWave(count, this.player.x, this.player.y);
    }

    // Play story cutscene briefing
    await this.story.showBriefing(chapterNumber);
    this.state = 'playing';
  }

  updateObjectiveUI() {
    this.hud.updateObjective(
      this.levels.getObjectiveStatusText(),
      this.levels.getProgressRatio()
    );
  }

  gameOver() {
    this.state = 'over';
    if (this.score > this.hiscore) {
      this.hiscore = this.score;
      this._saveHiScore();
    }
    this.hud.updateHiScore(this.hiscore);
    this.hud.showGameOver(this.score, this.hiscore);
  }

  onStageCleared() {
    this.state = 'cleared';
    this.particles.triggerScreenShake(8, 20);

    if (this.levels.currentLevel >= this.levels.maxLevel) {
      // Victory!
      this.state = 'victory';
      if (this.score > this.hiscore) {
        this.hiscore = this.score;
        this._saveHiScore();
      }
      this.hud.updateHiScore(this.hiscore);
      this.hud.showVictory(this.score, () => this.resetGame());
    } else {
      // Next stage
      this.hud.showStageClear(() => {
        this._startChapter(this.levels.currentLevel + 1);
      });
    }
  }

  checkCollisions() {
    const asteroids = this.enemies.asteroids;
    const bullets = this.player.bullets;

    // 1. Bullets vs Asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (Physics.checkCollision(a, b)) {
          bullets.splice(j, 1);
          asteroids.splice(i, 1);

          const points = this.enemies.splitAsteroid(a, this.particles);
          this.score += points;
          this.hud.updateScore(this.score);

          this.levels.onAsteroidDestroyed();
          this.updateObjectiveUI();

          // Check if objective met
          if (this.levels.checkObjectiveMet() && this.state === 'playing') {
            this.onStageCleared();
            return;
          }
          break;
        }
      }
    }

    // 2. Bullets vs Boss & Boss Shields
    if (this.boss && this.boss.active) {
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];

        // Check shield satellites first
        let hitShield = false;
        for (const s of this.boss.shields) {
          const sx = this.boss.x + Math.cos(s.angle) * s.r;
          const sy = this.boss.y + Math.sin(s.angle) * s.r;
          if (Physics.distance(b.x, b.y, sx, sy) < (b.r + s.size)) {
            bullets.splice(j, 1);
            hitShield = true;
            this.particles.spawnDebris(sx, sy, 4, '#06b6d4');
            break;
          }
        }
        if (hitShield) continue;

        // Check Boss core
        if (Physics.distance(b.x, b.y, this.boss.x, this.boss.y) < (b.r + this.boss.r)) {
          bullets.splice(j, 1);
          const bossDead = this.boss.takeDamage(2);
          this.hud.updateBossHealth(this.boss.getHpRatio());
          this.particles.spawnDebris(b.x, b.y, 6, '#c084fc');
          this.particles.triggerScreenShake(5, 8);

          if (bossDead) {
            this.score += 1500;
            this.hud.updateScore(this.score);
            this.particles.spawnDebris(this.boss.x, this.boss.y, 40, '#ff0055');
            this.particles.triggerScreenShake(15, 30);
            this.onStageCleared();
            return;
          }
          break;
        }
      }

      // 3. Boss Bullets vs Player
      if (!this.player.isInvulnerable() && this.state === 'playing') {
        for (let k = this.boss.bullets.length - 1; k >= 0; k--) {
          const bb = this.boss.bullets[k];
          if (Physics.distance(bb.x, bb.y, this.player.x, this.player.y) < (bb.r + this.player.r * 0.8)) {
            this.boss.bullets.splice(k, 1);
            this.damagePlayer();
            break;
          }
        }
      }
    }

    // 4. Ship vs Asteroids
    if (!this.player.isInvulnerable() && this.state === 'playing') {
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        if (Physics.checkCircleCollision(a, this.player, -this.player.r * 0.4)) {
          this.damagePlayer();
          break;
        }
      }
    }

    // 5. Respawn asteroids if field is empty and objective is not yet met
    if (this.state === 'playing' && asteroids.length === 0 && !this.levels.isBossLevel()) {
      const count = 3 + this.levels.currentLevel;
      this.enemies.spawnWave(count, this.player.x, this.player.y);
    }
  }

  damagePlayer() {
    this.lives--;
    this.particles.spawnDebris(this.player.x, this.player.y, 16, CONFIG.SHIP.COLORS.BODY);
    this.particles.triggerScreenShake(10, 16);
    this.hud.triggerScreenShake();
    this.hud.renderLives(this.lives);

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.player.respawn();
    }
  }

  update(dt = 1.0) {
    if (this.state === 'playing') {
      this.player.update(this.input, dt);
      this.enemies.update(dt);
      if (this.boss) this.boss.update(this.player, dt);
      this.particles.update(dt);
      this.checkCollisions();
      this.hud.updateCooldown(this.player.getCooldownRatio());
    } else if (this.state === 'briefing') {
      // Keep background moving during briefing
      this.particles.update(dt);
    } else {
      this.particles.update(dt);
    }
  }

  render() {
    const shake = this.particles.getShakeOffset();
    this.ctx.save();
    if (shake.x !== 0 || shake.y !== 0) {
      this.ctx.translate(shake.x, shake.y);
    }

    // Clear and draw background starfield
    this.particles.drawStars(this.ctx);

    if (this.state !== 'idle') {
      this.enemies.draw(this.ctx);
      if (this.boss) this.boss.draw(this.ctx);
      this.player.drawBullets(this.ctx);
      this.particles.drawParticles(this.ctx);

      if (this.state === 'playing' || this.state === 'briefing') {
        this.player.draw(this.ctx);
      }
    }

    this.ctx.restore();
  }
}
