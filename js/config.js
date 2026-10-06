/**
 * Global game configurations, constants, physics parameters, level tunings,
 * and high-fidelity Neon Cyberpunk art style settings.
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
    RADIUS: 15,
    ROTATION_SPEED: 0.06,
    THRUST: 0.12,
    REVERSE_FACTOR: 0.6,
    FRICTION: 0.99,
    MOUSE_ROTATION_FACTOR: 0.15,
    INVULNERABLE_START: 90,
    INVULNERABLE_RESPAWN: 120,
    INITIAL_LIVES: 3,
    COLORS: {
      PRIMARY_NEON: '#00f0ff',
      SECONDARY_NEON: '#ff007f',
      HULL_FILL: 'rgba(12, 22, 38, 0.88)',
      HULL_ACCENT: 'rgba(0, 240, 255, 0.25)',
      CANOPY: '#38bdf8',
      CANOPY_CORE: '#ffffff',
      THRUST_CORE: '#ffffff',
      THRUST_MID: '#00f0ff',
      THRUST_OUTER: '#ff007f',
      SHADOW: '#00f0ff'
    }
  },
  WEAPON: {
    FIRE_COOLDOWN: 10,
    BULLET_SPEED: 7.5,
    BULLET_INHERIT_VELOCITY: 0.3,
    BULLET_RADIUS: 2.5,
    BULLET_LIFETIME: 60,
    COLOR_CORE: '#ffffff',
    COLOR_GLOW: '#00f0ff',
    COLOR_TRAIL: '#ff007f'
  },
  ASTEROIDS: {
    SAFE_SPAWN_DISTANCE: 150,
    VERTS_MIN: 9,
    VERTS_MAX: 14,
    OFFSET_MIN: 0.75,
    OFFSET_MAX: 1.25,
    SPIN_RANGE: 0.02,
    SIZES: {
      3: { baseR: 46, score: 20, speedMult: 1.15, veinCount: 5 },
      2: { baseR: 28, score: 50, speedMult: 1.30, veinCount: 4 },
      1: { baseR: 15, score: 100, speedMult: 1.45, veinCount: 3 }
    },
    COLORS: {
      HULL_FILL: 'rgba(15, 23, 42, 0.85)',
      STROKE: '#38bdf8',
      SHADOW: '#0284c7',
      VEIN_CYAN: '#00f0ff',
      VEIN_MAGENTA: '#ff007f',
      VEIN_GOLD: '#f59e0b'
    }
  },
  BOSS: {
    RADIUS: 68,
    MAX_HP: 100,
    COLORS: {
      HULL: 'rgba(20, 10, 30, 0.92)',
      RING: '#d946ef',
      CORE_NORMAL: '#9333ea',
      CORE_ENRAGED: '#ff0055',
      SHIELD_FILL: 'rgba(6, 182, 212, 0.25)',
      SHIELD_BORDER: '#22d3ee',
      BULLET_CORE: '#ffffff',
      BULLET_GLOW: '#ff0055'
    }
  },
  PARTICLES: {
    DEBRIS_COUNT: 14,
    DEBRIS_SPEED_RANGE: 3.5,
    LIFE_MIN: 20,
    LIFE_MAX: 45,
    FRICTION: 0.95
  },
  ATMOSPHERE: {
    NEBULA_COUNT: 4,
    BG_BASE: '#040711',
    STAR_LAYERS: [
      { count: 70, speed: 0.2, minSize: 0.8, maxSize: 1.4, alpha: 0.4 },
      { count: 45, speed: 0.5, minSize: 1.4, maxSize: 2.2, alpha: 0.75 },
      { count: 18, speed: 0.9, minSize: 2.2, maxSize: 3.0, alpha: 0.95 }
    ]
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
