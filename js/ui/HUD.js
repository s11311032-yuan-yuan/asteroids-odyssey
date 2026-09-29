import { I18n } from '../i18n/I18n.js';
import { SoundSystem } from '../systems/SoundSystem.js';

/**
 * Manages UI updates, score display, cooldown meters, level progress, boss health bar,
 * victory overlay, sound toggle, and dynamic language updates.
 */
export class HUD {
  constructor() {
    this.scoreEl = document.getElementById('score');
    this.hiscoreEl = document.getElementById('hiscore');
    this.livesEl = document.getElementById('lives');
    this.overlayEl = document.getElementById('overlay');
    this.finalScoreEl = document.getElementById('finalScore');
    this.finalHiEl = document.getElementById('finalHi');
    this.cooldownBarEl = document.getElementById('cooldownBar');
    this.gameWrapEl = document.getElementById('gameWrap');

    // New campaign elements
    this.levelEl = document.getElementById('levelNumber');
    this.objectiveTextEl = document.getElementById('objectiveText');
    this.objectiveBarEl = document.getElementById('objectiveBar');
    this.bossWrapEl = document.getElementById('bossHealthWrap');
    this.bossBarEl = document.getElementById('bossHpBar');
    this.bossTextEl = document.getElementById('bossHpText');

    this.victoryOverlayEl = document.getElementById('victoryOverlay');
    this.victoryScoreEl = document.getElementById('victoryScore');
    this.stageClearOverlayEl = document.getElementById('stageClearOverlay');
    this.stageClearNextBtn = document.getElementById('stageClearNextBtn');
    this.victoryRestartBtn = document.getElementById('victoryRestartBtn');

    this.langSelectEl = document.getElementById('langSelect');
    this.startHintEl = document.getElementById('startHint');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');

    this._setupLanguageSelector();
    this._setupSoundToggle();
  }

  _setupSoundToggle() {
    if (!this.soundToggleBtn) return;

    const updateBtn = () => {
      const muted = SoundSystem.isMuted();
      this.soundToggleBtn.textContent = muted ? '🔇' : '🔊';
      const labelKey = muted ? 'ui.soundOff' : 'ui.soundOn';
      this.soundToggleBtn.title = I18n.t(labelKey);
      this.soundToggleBtn.setAttribute('aria-label', I18n.t(labelKey));
    };

    updateBtn();
    this.soundToggleBtn.addEventListener('click', () => {
      SoundSystem.toggleMute();
      updateBtn();
    });

    this.updateSoundBtn = updateBtn;
  }

  _setupLanguageSelector() {
    if (!this.langSelectEl) return;

    this.langSelectEl.value = I18n.getLanguage();
    this.langSelectEl.addEventListener('change', (e) => {
      I18n.setLanguage(e.target.value);
    });

    I18n.onChange(() => {
      this.refreshTexts();
    });
  }

  refreshTexts() {
    // Update all elements with data-i18n
    const translatables = document.querySelectorAll('[data-i18n]');
    translatables.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = I18n.t(key);
      }
    });

    if (this.startHintEl) {
      this.startHintEl.textContent = I18n.t('ui.controlsHint');
    }
    if (this.bossTextEl) {
      this.bossTextEl.textContent = I18n.t('ui.bossHp');
    }
    if (this.updateSoundBtn) {
      this.updateSoundBtn();
    }
  }

  updateScore(score) {
    if (this.scoreEl) this.scoreEl.textContent = score;
  }

  updateHiScore(hiscore) {
    if (this.hiscoreEl) this.hiscoreEl.textContent = hiscore;
  }

  updateLevel(levelNum) {
    if (this.levelEl) this.levelEl.textContent = levelNum;
  }

  updateObjective(statusText, progressRatio) {
    if (this.objectiveTextEl) this.objectiveTextEl.textContent = statusText;
    if (this.objectiveBarEl) {
      this.objectiveBarEl.style.width = `${Math.round(Math.max(0, Math.min(1, progressRatio)) * 100)}%`;
    }
  }

  showBossHealth(show = true) {
    if (this.bossWrapEl) {
      this.bossWrapEl.style.display = show ? 'flex' : 'none';
    }
  }

  updateBossHealth(ratio) {
    if (this.bossBarEl) {
      const clamped = Math.max(0, Math.min(1, ratio));
      this.bossBarEl.style.width = `${Math.round(clamped * 100)}%`;
    }
  }

  updateCooldown(ratio) {
    if (this.cooldownBarEl) {
      const clamped = Math.max(0, Math.min(1, ratio));
      this.cooldownBarEl.style.width = `${Math.round(clamped * 100)}%`;
      this.cooldownBarEl.style.opacity = clamped >= 1 ? '1.0' : '0.5';
    }
  }

  renderLives(lives) {
    if (!this.livesEl) return;
    this.livesEl.innerHTML = '';
    for (let i = 0; i < lives; i++) {
      const icon = document.createElement('div');
      icon.className = 'lifeIcon';
      this.livesEl.appendChild(icon);
    }
  }

  triggerScreenShake() {
    if (!this.gameWrapEl) return;
    this.gameWrapEl.classList.remove('screen-shake');
    void this.gameWrapEl.offsetWidth;
    this.gameWrapEl.classList.add('screen-shake');
  }

  showGameOver(score, hiscore) {
    if (this.finalScoreEl) this.finalScoreEl.textContent = score;
    if (this.finalHiEl) this.finalHiEl.textContent = hiscore;
    if (this.overlayEl) this.overlayEl.classList.add('show');
  }

  hideGameOver() {
    if (this.overlayEl) this.overlayEl.classList.remove('show');
  }

  showStageClear(onNext) {
    if (this.stageClearOverlayEl) {
      this.stageClearOverlayEl.classList.add('show');
    }
    if (this.stageClearNextBtn) {
      this.stageClearNextBtn.onclick = () => {
        if (this.stageClearOverlayEl) this.stageClearOverlayEl.classList.remove('show');
        onNext();
      };
    }
  }

  hideStageClear() {
    if (this.stageClearOverlayEl) {
      this.stageClearOverlayEl.classList.remove('show');
    }
  }

  showVictory(finalScore, onRestart) {
    if (this.victoryScoreEl) this.victoryScoreEl.textContent = finalScore;
    if (this.victoryOverlayEl) this.victoryOverlayEl.classList.add('show');
    if (this.victoryRestartBtn) {
      this.victoryRestartBtn.onclick = () => {
        if (this.victoryOverlayEl) this.victoryOverlayEl.classList.remove('show');
        onRestart();
      };
    }
  }

  hideVictory() {
    if (this.victoryOverlayEl) this.victoryOverlayEl.classList.remove('show');
  }
}
