/**
 * Global game configurations, constants, physics parameters, level tunings, and keybindings.
 */
export const CONFIG = {
  CANVAS: {
    WIDTH: 800,
    HEIGHT: 600
  },
  STORAGE_KEYS: {
    HI_SCORE: 'asteroids_hiscore_v1',
    LANG: 'asteroids_lang_v1'
  },
  SHIP: {
    RADIUS: 14,
    ROTATION_SPEED: 0.06,
    THRUST: 0.12,
    REVERSE_FACTOR: 0.6,
    FRICTION: 0.99,
    MOUSE_ROTATION_FACTOR: 0.15,
    INVULNERABLE_START: 90,
    INVULNERABLE_RESPAWN: 120,
    INITIAL_LIVES: 3,
    COLORS: {
      BODY: '#4dfcc4',
      THRUST: '#ff9f4d',
      SHADOW: '#4dfcc4'
    }
  },
  WEAPON: {
    FIRE_COOLDOWN: 10,
    BULLET_SPEED: 7,
    BULLET_INHERIT_VELOCITY: 0.3,
    BULLET_RADIUS: 2,
    BULLET_LIFETIME: 60,
    COLOR: '#fffb96'
  },
  ASTEROIDS: {
    SAFE_SPAWN_DISTANCE: 150,
    VERTS_MIN: 8,
    VERTS_MAX: 13,
    OFFSET_MIN: 0.75,
    OFFSET_MAX: 1.25,
    SPIN_RANGE: 0.02,
    SIZES: {
      3: { baseR: 46, score: 20, speedMult: 1.15 },
      2: { baseR: 28, score: 50, speedMult: 1.30 },
      1: { baseR: 15, score: 100, speedMult: 1.45 }
    },
    COLORS: {
      STROKE: '#c9d3de',
      SHADOW: '#5a6a7a'
    }
  },
  BOSS: {
    RADIUS: 65,
    MAX_HP: 100,
    COLORS: {
      NORMAL_CORE: '#7e22ce',
      ENRAGED_CORE: '#ff0055',
      SHIELD: '#06b6d4',
      RING: '#c084fc'
    }
  },
  PARTICLES: {
    DEBRIS_COUNT: 10,
    DEBRIS_SPEED_RANGE: 3,
    LIFE_MIN: 20,
    LIFE_MAX: 40,
    FRICTION: 0.96,
    COLOR: '#ffcf8a'
  },
  STARFIELD: {
    COUNT: 120,
    BG_COLOR: '#131722',
    STAR_COLOR: '#2c3444'
  },
  KEYS: {
    ROTATE_LEFT: ['ArrowLeft', 'KeyA'],
    ROTATE_RIGHT: ['ArrowRight', 'KeyD'],
    THRUST: ['ArrowUp', 'KeyW'],
    REVERSE: ['ArrowDown', 'KeyS'],
    FIRE: ['Space'],
    PREVENT_DEFAULT: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']
  }
};
