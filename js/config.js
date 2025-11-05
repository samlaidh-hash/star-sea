// Global game configuration constants

const CONFIG = {
    // Canvas and loop
    CANVAS_WIDTH: 1920,
    CANVAS_HEIGHT: 1080,
    TARGET_FPS: 60,
    VELOCITY_ITERATIONS: 8,
    POSITION_ITERATIONS: 3,

    // Debug
    DEBUG_MODE: false,
    DEBUG_SHOW_ARCS: false,

    // Colors
    COLOR_PLAYER: '#00ccff',
    COLOR_TRIGON: '#ff4444',
    COLOR_SCINTILIAN: '#00ff88',
    COLOR_PIRATE: '#ff8800',

    // Ship lengths (render scale baseline)
    SHIP_LENGTH_FG: 40,
    SHIP_LENGTH_DD: 50,
    SHIP_LENGTH_CL: 60,
    SHIP_LENGTH_CA: 70,
    SHIP_LENGTH_BC: 80,

    // Ship HP (hull)
    SHIP_HP_FG: 60,
    SHIP_HP_DD: 80,
    SHIP_HP_CL: 100,
    SHIP_HP_CA: 120,
    SHIP_HP_BC: 140,

    // Movement
    MAX_SPEED_FG: 140,
    MAX_SPEED_DD: 130,
    MAX_SPEED_CL: 120,
    MAX_SPEED_CA: 110,
    MAX_SPEED_BC: 100,

    ACCELERATION_FG: 180,
    ACCELERATION_DD: 170,
    ACCELERATION_CL: 160,
    ACCELERATION_CA: 150,
    ACCELERATION_BC: 140,

    TURN_RATE_FG: 140,
    TURN_RATE_DD: 120,
    TURN_RATE_CL: 100,
    TURN_RATE_CA: 90,
    TURN_RATE_BC: 80,

    MAX_SPEED_TRIGON_MULTIPLIER: 1.1,
    TURN_RATE_TRIGON_MULTIPLIER: 1.2,

    // Shields
    SYSTEM_HP_SHIELD_GEN: 8, // generator HP baseline

    SHIELD_STRENGTH_FORE_CA: 20,
    SHIELD_STRENGTH_AFT_CA: 18,
    SHIELD_STRENGTH_PORT_CA: 16,
    SHIELD_STRENGTH_STARBOARD_CA: 16,

    SHIELD_RECOVERY_DELAY: 5.0, // seconds without hits
    SHIELD_RECOVERY_RATE: 6.0,  // points per second

    // Internal systems
    SYSTEM_HP_IMPULSE: 16,
    SYSTEM_HP_WARP: 20,
    SYSTEM_HP_SENSORS: 6,
    SYSTEM_HP_CNC: 6,
    SYSTEM_HP_BAY: 6,
    SYSTEM_HP_MAIN_POWER: 12,
    SYSTEM_HP_POWER: 12, // alias used in InternalSystems

    // Warp charging
    WARP_CHARGE_RATE: 60, // percent per second (affected by efficiency)

    // Weapons
    TORPEDO_BLAST_RADIUS_PIXELS: 18,
    TORPEDO_SYSTEM_HIT_COUNT: 4,

    // Plasma charge (damage per second by class)
    PLASMA_MAX_CHARGE_TIME: 5, // seconds
    PLASMA_CHARGE_RATE_FG: 6,
    PLASMA_CHARGE_RATE_CL: 7,
    PLASMA_CHARGE_RATE_CA: 8,
    PLASMA_CHARGE_RATE_BC: 9,

    // Auto-repair
    AUTO_REPAIR_RATE: 0.03, // HP per second

    // Countermeasures
    DECOY_COUNT: 6,
    MINE_COUNT: 6,
    DEPLOYMENT_COOLDOWN: 6.0, // seconds

    // Bay System - Space capacity by ship class
    BAY_CAPACITY_FG: 2,
    BAY_CAPACITY_DD: 3,
    BAY_CAPACITY_CL: 4,
    BAY_CAPACITY_CA: 6,
    BAY_CAPACITY_BC: 8,

    // Targeting
    LOCK_ON_DRIFT_TOLERANCE: 50, // pixels

    // Detection radius (pixels by class)
    DETECTION_RADIUS_FG_PIXELS: 800,
    DETECTION_RADIUS_DD_PIXELS: 900,
    DETECTION_RADIUS_CL_PIXELS: 1000,
    DETECTION_RADIUS_CA_PIXELS: 1100,
    DETECTION_RADIUS_BC_PIXELS: 1200,

    // Particles
    PARTICLE_COUNT_COLLAPSAR: 120,
    PARTICLE_COUNT_DUST: 80,

    // Audio
    AUDIO_ENABLED: true,
    AUDIO_VOLUME_MASTER: 0.8,

    // Cloak
    CLOAK_COOLDOWN: 30.0,   // seconds between toggles
    CLOAK_WEAPON_DELAY: 5.0 // seconds after decloak before firing
};