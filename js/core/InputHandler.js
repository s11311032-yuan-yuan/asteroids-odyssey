import { CONFIG } from '../config.js';

/**
 * Handles keyboard, mouse, and touch events for movement and shooting.
 */
export class InputHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.mouse = {
      x: CONFIG.CANVAS.WIDTH / 2,
      y: CONFIG.CANVAS.HEIGHT / 2,
      down: false,
      active: false
    };

    this.actionListeners = [];
    this._bindEvents();
  }

  onAction(callback) {
    this.actionListeners.push(callback);
  }

  _triggerAction(type) {
    for (const listener of this.actionListeners) {
      listener(type);
    }
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (CONFIG.KEYS.PREVENT_DEFAULT.includes(e.code)) {
        e.preventDefault();
      }

      if (CONFIG.KEYS.FIRE.includes(e.code)) {
        this._triggerAction('fireOrRestart');
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) * (CONFIG.CANVAS.WIDTH / rect.width);
      this.mouse.y = (e.clientY - rect.top) * (CONFIG.CANVAS.HEIGHT / rect.height);
      this.mouse.active = true;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.mouse.down = true;
        this._triggerAction('fireOrRestart');
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouse.down = false;
      }
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = (touch.clientX - rect.left) * (CONFIG.CANVAS.WIDTH / rect.width);
        this.mouse.y = (touch.clientY - rect.top) * (CONFIG.CANVAS.HEIGHT / rect.height);
        this.mouse.active = true;
        this.mouse.down = true;
        this._triggerAction('fireOrRestart');
        e.preventDefault();
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = (touch.clientX - rect.left) * (CONFIG.CANVAS.WIDTH / rect.width);
        this.mouse.y = (touch.clientY - rect.top) * (CONFIG.CANVAS.HEIGHT / rect.height);
        e.preventDefault();
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      this.mouse.down = false;
      e.preventDefault();
    }, { passive: false });
  }

  isKeyActive(codes) {
    return codes.some((code) => Boolean(this.keys[code]));
  }

  isRotateLeft() {
    return this.isKeyActive(CONFIG.KEYS.ROTATE_LEFT);
  }

  isRotateRight() {
    return this.isKeyActive(CONFIG.KEYS.ROTATE_RIGHT);
  }

  isThrust() {
    return this.isKeyActive(CONFIG.KEYS.THRUST) || this.mouse.down;
  }

  isReverse() {
    return this.isKeyActive(CONFIG.KEYS.REVERSE);
  }
}
