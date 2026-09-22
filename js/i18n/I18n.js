import { TRANSLATIONS } from './translations.js';

/**
 * Singleton Localization Manager for runtime language switching.
 */
class I18nManager {
  constructor() {
    this.storageKey = 'asteroids_lang_v1';
    this.supportedLanguages = [
      { code: 'zh-TW', name: '繁體中文' },
      { code: 'en', name: 'English' },
      { code: 'ja', name: '日本語' },
      { code: 'zh-CN', name: '簡體中文' }
    ];

    this.currentLanguage = this._detectLanguage();
    this.listeners = [];
  }

  _detectLanguage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && TRANSLATIONS[saved]) return saved;
      
      const navLang = navigator.language || navigator.userLanguage || '';
      if (navLang.startsWith('zh-CN') || navLang.startsWith('zh-SG')) return 'zh-CN';
      if (navLang.startsWith('zh')) return 'zh-TW';
      if (navLang.startsWith('ja')) return 'ja';
      if (navLang.startsWith('en')) return 'en';
    } catch (e) {
      // Ignore
    }
    return 'zh-TW';
  }

  getLanguage() {
    return this.currentLanguage;
  }

  setLanguage(langCode) {
    if (!TRANSLATIONS[langCode] || this.currentLanguage === langCode) return;
    this.currentLanguage = langCode;
    try {
      localStorage.setItem(this.storageKey, langCode);
    } catch (e) {}

    for (const listener of this.listeners) {
      listener(this.currentLanguage);
    }
  }

  onChange(listener) {
    this.listeners.push(listener);
  }

  t(path) {
    const keys = path.split('.');
    let current = TRANSLATIONS[this.currentLanguage];
    for (const key of keys) {
      if (!current || current[key] === undefined) {
        // Fallback to en or zh-TW
        let fallback = TRANSLATIONS['zh-TW'];
        for (const fbKey of keys) {
          if (!fallback || fallback[fbKey] === undefined) return path;
          fallback = fallback[fbKey];
        }
        return fallback;
      }
      current = current[key];
    }
    return current;
  }

  getLevel(levelNumber) {
    const langData = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS['zh-TW'];
    return langData.levels[levelNumber] || langData.levels[1];
  }
}

export const I18n = new I18nManager();
