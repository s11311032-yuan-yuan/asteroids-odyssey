import { Game } from './core/Game.js';

/**
 * Bootstrap Asteroids Odyssey when DOM is ready.
 */
function init() {
  const canvas = document.getElementById('game');
  if (!canvas) {
    console.error('Canvas element #game not found!');
    return;
  }

  const game = new Game(canvas);
  game.start();

  // Expose game instance for debugging or automated testing
  window.__ASTEROIDS_GAME__ = game;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
