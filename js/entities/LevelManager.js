import { I18n } from '../i18n/I18n.js';

/**
 * Coordinates level stages (1 to 5), objectives, and campaign win conditions.
 */
export class LevelManager {
  constructor() {
    this.maxLevel = 5;
    this.currentLevel = 1;
    this.fragmentsDestroyed = 0;
    this.targetFragments = 12;
    this.boss = null;
    this.levelComplete = false;
  }

  resetCampaign() {
    this.currentLevel = 1;
    this.startLevel(1);
  }

  startLevel(levelNumber) {
    this.currentLevel = Math.max(1, Math.min(this.maxLevel, levelNumber));
    const levelData = I18n.getLevel(this.currentLevel);
    this.targetFragments = levelData.targetCount || 15;
    this.fragmentsDestroyed = 0;
    this.levelComplete = false;
    this.boss = null;
  }

  isBossLevel() {
    return this.currentLevel === 5;
  }

  onAsteroidDestroyed() {
    this.fragmentsDestroyed++;
  }

  checkObjectiveMet() {
    if (this.isBossLevel()) {
      return Boolean(this.boss && !this.boss.active);
    }
    return this.fragmentsDestroyed >= this.targetFragments;
  }

  getProgressRatio() {
    if (this.isBossLevel()) {
      if (!this.boss) return 0;
      return 1 - this.boss.getHpRatio();
    }
    return Math.min(1, this.fragmentsDestroyed / this.targetFragments);
  }

  getObjectiveStatusText() {
    const levelData = I18n.getLevel(this.currentLevel);
    if (this.isBossLevel()) {
      return levelData.objectiveText;
    }
    return `${levelData.objectiveText} (${this.fragmentsDestroyed}/${this.targetFragments})`;
  }
}
