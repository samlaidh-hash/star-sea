// Global game configuration constants

const CONFIG = {
    // Canvas and loop
    CANVAS_WIDTH: 1920,  // DEPRECATED - Canvas now uses window.innerWidth
    CANVAS_HEIGHT: 1080, // DEPRECATED - Canvas now uses window.innerHeight
    TARGET_FPS: 30,
    VELOCITY_ITERATIONS: 4,
    POSITION_ITERATIONS: 2,

    // Debug
    DEBUG_MODE: false,
    DEBUG_SHOW_ARCS: false,

    // Performance mode - simplified rendering
    PERFORMANCE_MODE: false, // Disabled - testing full graphics with physics off + reduced resolution

    // Emergency minimal mode - disables almost everything
    MINIMAL_MODE: false, // Disabled - performance mode should be enough

    // Binary search debugging - disable systems to find bottleneck
    DISABLE_AI: false,        // Tested - AI is fine (0ms)
    DISABLE_PHYSICS: true,    // *** CULPRIT FOUND! Physics takes 167ms - DISABLED PERMANENTLY ***
    DISABLE_COLLISIONS: false, // Re-enabled - test if collisions work without physics
    DISABLE_PARTICLES: false,  // Re-enabled

    // Colors
    COLOR_PLAYER: '#00ccff',
    COLOR_TRIGON: '#ff4444',
    COLOR_SCINTILIAN: '#00ff88',
    COLOR_PIRATE: '#ff8800',

    // Ship lengths (render scale baseline)
    SHIP_LENGTH_FG: 40,
    SHIP_LENGTH_DD: 50,
    SHIP_LENGTH_CL: 60,
    SHIP_LENGTH_CS: 65,  // Strike Cruiser (between CL and CA)
    SHIP_LENGTH_CA: 70,
    SHIP_LENGTH_BC: 80,

    // Ship HP (hull)
    SHIP_HP_FG: 60,
    SHIP_HP_DD: 80,
    SHIP_HP_CL: 100,
    SHIP_HP_CS: 110,     // Strike Cruiser (between CL and CA)
    SHIP_HP_CA: 120,
    SHIP_HP_BC: 140,

    // Movement
    MAX_SPEED_FG: 140,
    MAX_SPEED_DD: 130,
    MAX_SPEED_CL: 120,
    MAX_SPEED_CS: 115,   // Strike Cruiser (between CL and CA)
    MAX_SPEED_CA: 110,
    MAX_SPEED_BC: 100,

    ACCELERATION_FG: 180,
    ACCELERATION_DD: 170,
    ACCELERATION_CL: 160,
    ACCELERATION_CS: 155, // Strike Cruiser (between CL and CA)
    ACCELERATION_CA: 150,
    ACCELERATION_BC: 140,

    TURN_RATE_FG: 90,   // degrees per second
    TURN_RATE_DD: 80,
    TURN_RATE_CL: 70,
    TURN_RATE_CS: 65,   // Strike Cruiser (between CL and CA)
    TURN_RATE_CA: 60,
    TURN_RATE_BC: 50,

    MAX_SPEED_TRIGON_MULTIPLIER: 1.1,
    TURN_RATE_TRIGON_MULTIPLIER: 1.2,

    // Shields
    SYSTEM_HP_SHIELD_GEN: 8, // generator HP baseline

    SHIELD_STRENGTH_FORE_CA: 20,
    SHIELD_STRENGTH_AFT_CA: 18,
    SHIELD_STRENGTH_PORT_CA: 16,
    SHIELD_STRENGTH_STARBOARD_CA: 16,

    // Strike Cruiser shields (between CL and CA)
    SHIELD_STRENGTH_FORE_CS: 19,
    SHIELD_STRENGTH_AFT_CS: 17,
    SHIELD_STRENGTH_PORT_CS: 15,
    SHIELD_STRENGTH_STARBOARD_CS: 15,

    SHIELD_RECOVERY_DELAY: 10.0, // seconds without hits (increased from 5.0)
    SHIELD_RECOVERY_RATE: 1.0,   // points per second (reduced from 2.0)

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

    // Weapons - Beams
    BEAM_SPEED: 5000,             // pixels per second (almost instant)
    BEAM_RANGE_PIXELS: 500,       // maximum range
    BEAM_DAMAGE: 1,               // damage per hit
    BEAM_COOLDOWN: 1.0,           // seconds between shots
    BEAM_LIFETIME: 0.1,           // seconds beam persists (reduced from 0.4)
    COLOR_BEAM_PROJECTILE: '#ff6633', // orangey-red
    COLOR_BEAM_SCINTILIAN: '#00ff88', // green (Scintilian faction)

    // Weapons - Torpedoes
    TORPEDO_SPEED_CA: 325,        // base speed for CA-class torpedoes
    TORPEDO_DAMAGE: 8,            // damage per torpedo
    TORPEDO_LOADED: 4,            // torpedoes loaded in launcher
    TORPEDO_STORED: 16,           // torpedoes in storage
    TORPEDO_BLAST_RADIUS_PIXELS: 18,
    TORPEDO_LIFETIME: 10,         // seconds before expiring
    TORPEDO_RELOAD_TIME: 5,       // seconds to reload all 4 torpedoes
    TORPEDO_SYSTEM_HIT_COUNT: 4,
    COLOR_TORPEDO: '#ffaa00',     // orange

    // Weapons - Disruptors (Trigon)
    DISRUPTOR_SPEED: 650,         // 2x torpedo speed
    DISRUPTOR_DAMAGE: 2,          // 2 damage per hit
    COLOR_DISRUPTOR: '#4488ff',   // glowing blue

    // Weapons - Plasma Torpedoes (Scintilian)
    PLASMA_SPEED_CA: 217,         // 2/3 of normal torpedo speed
    PLASMA_DAMAGE_POTENTIAL: 30,  // starting DP
    PLASMA_DP_DECAY_PER_SECOND: 1, // DP lost per second
    COLOR_PLASMA: '#00ff88',      // green

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
    CLOAK_WEAPON_DELAY: 5.0, // seconds after decloak before firing

    // Transporter
    COLOR_TRANSPORTER_BEAM: '#00ffff',
    COLOR_TRANSPORTER_EFFECT: '#00ffff',

    // Torpedo speed multiplier
    TORPEDO_SPEED_MULTIPLIER: 1.2,

    // Interceptor missile
    COLOR_INTERCEPTOR_MISSILE: '#00ff00',

    // Streak Beam (Strike Cruiser weapon)
    STREAK_BEAM_RANGE: 500,        // Same as other beams
    STREAK_BEAM_DAMAGE: 1,         // 1 damage per streak
    STREAK_BEAM_COOLDOWN: 1.5,     // 1.5 seconds between firing sequences
    STREAK_BEAM_SHOT_INTERVAL: 0.2, // 0.2 seconds between the two shots
    COLOR_STREAK_BEAM: '#ff8833'   // Orange-red
};