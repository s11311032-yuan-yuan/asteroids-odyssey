import { I18n } from '../i18n/I18n.js';

/**
 * Visual novel style narrative cutscene overlay for mission briefings and debriefings.
 */
export class StoryOverlay {
  constructor() {
    this.container = document.getElementById('storyOverlay');
    this.speakerEl = document.getElementById('storySpeaker');
    this.textEl = document.getElementById('storyText');
    this.avatarEl = document.getElementById('storyAvatar');
    this.nextBtn = document.getElementById('storyNextBtn');
    this.skipBtn = document.getElementById('storySkipBtn');
    this.titleEl = document.getElementById('storyChapterTitle');

    this.currentLines = [];
    this.currentIndex = 0;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.currentFullText = '';
    this.resolvePromise = null;

    this._bindEvents();
  }

  _bindEvents() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.advance());
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.skip());
    }

    // Spacebar to advance dialogue when story overlay is visible
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.isVisible()) {
        e.preventDefault();
        this.advance();
      }
    });
  }

  isVisible() {
    return this.container && this.container.classList.contains('show');
  }

  showBriefing(levelNumber) {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      const levelData = I18n.getLevel(levelNumber);
      this.currentLines = levelData.dialog || [];
      this.currentIndex = 0;

      if (this.titleEl) {
        this.titleEl.textContent = levelData.title || '';
      }

      if (this.container) {
        this.container.classList.add('show');
      }

      this._displayLine();
    });
  }

  _displayLine() {
    if (this.currentIndex >= this.currentLines.length) {
      this.close();
      return;
    }

    const line = this.currentLines[this.currentIndex];
    const isCommander = line.speaker === 'commander';

    if (this.speakerEl) {
      this.speakerEl.textContent = I18n.t(`characters.${line.speaker}`);
      this.speakerEl.className = isCommander ? 'speaker-commander' : 'speaker-ai';
    }

    if (this.avatarEl) {
      this.avatarEl.className = `avatar-box ${isCommander ? 'avatar-commander' : 'avatar-ai'}`;
      this.avatarEl.innerHTML = isCommander ? '👩‍✈️' : '🤖';
    }

    if (this.nextBtn) {
      const isLast = this.currentIndex === this.currentLines.length - 1;
      this.nextBtn.textContent = isLast ? I18n.t('ui.continue') : '▶';
    }

    if (this.skipBtn) {
      this.skipBtn.textContent = I18n.t('ui.skip');
    }

    // Start typewriter
    this._typeText(line.text);
  }

  _typeText(text) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.currentFullText = text;
    this.isTyping = true;
    let charIndex = 0;
    this.textEl.textContent = '';

    this.typewriterTimer = setInterval(() => {
      charIndex++;
      this.textEl.textContent = this.currentFullText.slice(0, charIndex);
      if (charIndex >= this.currentFullText.length) {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
      }
    }, 20);
  }

  advance() {
    if (this.isTyping) {
      // Instant reveal
      clearInterval(this.typewriterTimer);
      this.textEl.textContent = this.currentFullText;
      this.isTyping = false;
    } else {
      this.currentIndex++;
      this._displayLine();
    }
  }

  skip() {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.close();
  }

  close() {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    if (this.container) {
      this.container.classList.remove('show');
    }
    if (this.resolvePromise) {
      const fn = this.resolvePromise;
      this.resolvePromise = null;
      fn();
    }
  }
}
