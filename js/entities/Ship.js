/**
 * Star Sea - Ship Entity
 */

const WEAPON_POSITIONS = {
    forwardCenter: { x: 0, y: -15 },
    forwardPort: { x: -6, y: -14 },
    forwardStarboard: { x: 6, y: -14 },
    aftCenter: { x: 0, y: 15 },
    forwardTorpPort: { x: -3, y: -12 },
    forwardTorpStarboard: { x: 3, y: -12 },
    dualTorpCenter: { x: 0, y: -10 },
    aftTorpPort: { x: -3, y: 12 },
    aftTorpStarboard: { x: 3, y: 12 },
    disruptorPort: { x: -7, y: -13 },
    disruptorStarboard: { x: 7, y: -13 }
};

const SHIP_WEAPON_LOADOUTS = {
    FEDERATION: {
        FG: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Dual Torpedo Launcher (FG)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 4, loaded: 2, maxLoaded: 2, stored: 20 }
        ],
        DD: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Dual Torpedo Launcher (DD)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 6, loaded: 3, maxLoaded: 3, stored: 30 }
        ],
        CL: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Dual Torpedo Launcher (CL)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 8, loaded: 4, maxLoaded: 4, stored: 40 }
        ],
        CA: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'beam', name: 'Aft Beam Battery', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'torpedo', name: 'Dual Torpedo Launcher (CA)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 10, loaded: 5, maxLoaded: 5, stored: 50 }
        ],
        BC: [
            { type: 'beam', name: 'Port Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardPort' },
            { type: 'beam', name: 'Starboard Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardStarboard' },
            { type: 'beam', name: 'Aft Beam Array', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'torpedo', name: 'Dual Torpedo Launcher (BC)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 12, loaded: 6, maxLoaded: 6, stored: 60 }
        ]
    },
    TRIGON: {
        FG: [
            { type: 'disruptor', name: 'Forward Disruptor Cannons', arc: 120, arcCenter: 0, positionKey: 'forwardCenter' }
        ],
        DD: [
            { type: 'disruptor', name: 'Port Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorPort' },
            { type: 'disruptor', name: 'Starboard Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorStarboard' }
        ],
        CL: [
            { type: 'disruptor', name: 'Port Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorPort' },
            { type: 'disruptor', name: 'Starboard Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorStarboard' }
        ],
        CA: [
            { type: 'disruptor', name: 'Forward Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'disruptor', name: 'Port Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorPort' },
            { type: 'disruptor', name: 'Starboard Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorStarboard' }
        ],
        BC: [
            { type: 'disruptor', name: 'Forward Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'disruptor', name: 'Port Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorPort' },
            { type: 'disruptor', name: 'Starboard Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorStarboard' },
            { type: 'disruptor', name: 'Aft Disruptor Cannon', arc: 120, arcCenter: 180, positionKey: 'aftCenter' }
        ]
    },
    SCINTILIAN: {
        FG: [
            { type: 'pulseBeam', name: 'Forward Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'forwardCenter', cooldown: 0.5, damage: 0.5 }
        ],
        DD: [
            { type: 'pulseBeam', name: 'Forward Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'forwardCenter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Forward Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        CL: [
            { type: 'pulseBeam', name: 'Forward Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'forwardCenter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Forward Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'aftTorpStarboard' }
        ],
        CA: [
            { type: 'pulseBeam', name: 'Forward Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'forwardCenter', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Aft Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'aftCenter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Forward Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'aftTorpStarboard' }
        ],
        BC: [
            { type: 'pulseBeam', name: 'Port Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'forwardPort', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'forwardStarboard', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Aft Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'aftCenter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Forward Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'aftTorpStarboard' }
        ]
    },
    PIRATE: {
        FG: [
            { type: 'beam', name: 'Stolen Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Improvised Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        DD: [
            { type: 'disruptor', name: 'Salvaged Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Rudder Torpedo Pod', arc: 90, arcCenter: 180, positionKey: 'aftTorpStarboard' }
        ],
        CL: [
            { type: 'pulseBeam', name: 'Hybrid Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'forwardCenter', cooldown: 0.6, damage: 0.6 },
            { type: 'torpedo', name: 'Contraband Torpedo Rack', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        CA: [
            { type: 'beam', name: 'Captured Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardPort' },
            { type: 'plasma', name: 'Black Market Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'aftTorpStarboard' }
        ],
        BC: [
            { type: 'disruptor', name: 'Heavy Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'disruptorPort' },
            { type: 'plasma', name: 'Stolen Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'aftCenter' }
        ]
    },
    DEFAULT: {
        FG: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' }
        ],
        DD: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        CL: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' }
        ],
        CA: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        BC: [
            { type: 'beam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ]
    }
};

const WEAPON_BUILDERS = {
    beam: spec => new BeamWeapon(spec),
    pulseBeam: spec => new PulseBeam(spec),
    torpedo: spec => new TorpedoLauncher(spec),
    plasma: spec => new PlasmaTorpedo(spec),
    disruptor: spec => new Disruptor(spec)
};

function cloneWeaponPosition(positionKey, explicitPosition) {
    if (explicitPosition) {
        return { x: explicitPosition.x, y: explicitPosition.y };
    }
    if (positionKey && WEAPON_POSITIONS[positionKey]) {
        const base = WEAPON_POSITIONS[positionKey];
        return { x: base.x, y: base.y };
    }
    return undefined;
}

function buildWeaponFromSpec(spec) {
    const builder = WEAPON_BUILDERS[spec.type];
    if (!builder) {
        console.warn(`Unknown weapon type in loadout: ${spec.type}`);
        return null;
    }

    const { type, positionKey, position, ...rest } = spec;
    const config = { ...rest };
    const finalPosition = cloneWeaponPosition(positionKey, position);
    if (finalPosition) {
        config.position = finalPosition;
    }

    if (config.arcCenter === undefined && spec.facing) {
        switch (spec.facing) {
            case 'aft':
                config.arcCenter = 180;
                break;
            case 'port':
                config.arcCenter = 270;
                break;
            case 'starboard':
                config.arcCenter = 90;
                break;
            default:
                config.arcCenter = 0;
        }
    }

    return builder(config);
}

function resolveLoadoutFaction(faction) {
    return faction === 'PLAYER' ? 'FEDERATION' : faction;
}

function getShipLoadoutSpecs(faction, shipClass) {
    const factionKey = resolveLoadoutFaction(faction);
    const factionLoadouts = SHIP_WEAPON_LOADOUTS[factionKey];
    if (factionLoadouts && factionLoadouts[shipClass]) {
        return factionLoadouts[shipClass];
    }
    const defaultLoadouts = SHIP_WEAPON_LOADOUTS.DEFAULT || {};
    return defaultLoadouts[shipClass] || [];
}
class Ship extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'ship';
        this.shipClass = config.shipClass; // 'FG', 'CL', 'CA', 'BC'
        this.faction = config.faction; // 'PLAYER', 'TRIGON', 'SCINTILIAN', 'PIRATE'
        this.isPlayer = config.isPlayer || false;
        this.physicsWorld = config.physicsWorld;

        // Visual effects
        this.damageFlashAlpha = 0;

        // Movement
        this.maxSpeed = this.getMaxSpeed();
        this.maxReverseSpeed = this.maxSpeed * 0.5; // Half of forward speed
        this.acceleration = this.getAcceleration();
        this.deceleration = this.acceleration; // Same as acceleration for natural slowdown
        this.reverseDeceleration = this.acceleration * 2; // 2x for S key quick stop
        this.turnRate = this.getTurnRate();
        this.currentSpeed = 0; // Current forward/reverse speed (-maxReverse to +maxSpeed)

        // Visual properties
        this.color = this.getColor();
        this.vertices = this.generateShipVertices();

        // Weapon firing points
        this.weaponPoints = this.generateWeaponPoints();

        // For HUD display
        this.name = config.name || this.generateShipName();

        // Create physics body if physics world provided
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }

        // Health
        this.maxHp = this.getShipHp();
        this.hp = this.maxHp;

        // Countermeasures (legacy - replaced by bay system)
        this.decoys = CONFIG.DECOY_COUNT;
        this.mines = CONFIG.MINE_COUNT;
        this.lastDeploymentTime = 0;

        // Bay System
        this.bayCapacity = this.getBayCapacity();
        this.bayContents = this.initializeBayContents();

        // Shuttle System
        this.selectedShuttleMission = 'attack'; // Current selected mission type
        this.activeShuttles = []; // Tracking launched shuttles
        this.shuttleMissionTypes = ['attack', 'defense', 'weasel', 'suicide', 'transport'];

        // Shields
        this.shields = this.createShields();

        // Internal Systems (create before weapons so we can link them)
        this.systems = this.createSystems();

        // Tractor Beam System
        this.tractorBeam = new TractorBeam(this);

        // Weapons (created after systems so we can link them)
        this.weapons = this.createWeapons();

        // Link weapons to systems for damage tracking
        if (this.systems) {
            this.systems.setWeapons(this.weapons);
        }
    }

    createWeapons() {
        const specs = getShipLoadoutSpecs(this.faction, this.shipClass);
        const weapons = [];

        for (const spec of specs) {
            const weapon = buildWeaponFromSpec(spec);
            if (weapon) {
                weapons.push(weapon);
            }
        }

        return weapons;
    }

    createShields() {
        // Heavy Cruiser shield configuration
        if (this.shipClass === 'CA' && (this.faction === 'PLAYER' || this.faction === 'FEDERATION')) {
            return new ShieldSystem({
                fore: {
                    strength: CONFIG.SHIELD_STRENGTH_FORE_CA,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                },
                aft: {
                    strength: CONFIG.SHIELD_STRENGTH_AFT_CA,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                },
                port: {
                    strength: CONFIG.SHIELD_STRENGTH_PORT_CA,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                },
                starboard: {
                    strength: CONFIG.SHIELD_STRENGTH_STARBOARD_CA,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                }
            });
        }

        // Default shields for other ship types
        return new ShieldSystem({
            fore: { strength: 10, generatorHP: 8 },
            aft: { strength: 10, generatorHP: 8 },
            port: { strength: 10, generatorHP: 8 },
            starboard: { strength: 10, generatorHP: 8 }
        });
    }

    createSystems() {
        // Player Heavy Cruiser system configuration
        if (this.shipClass === 'CA' && (this.faction === 'PLAYER' || this.faction === 'FEDERATION')) {
            return new SystemManager({
                impulseHP: CONFIG.SYSTEM_HP_IMPULSE,
                warpHP: CONFIG.SYSTEM_HP_WARP,
                sensorsHP: CONFIG.SYSTEM_HP_SENSORS,
                cncHP: CONFIG.SYSTEM_HP_CNC,
                bayHP: CONFIG.SYSTEM_HP_BAY,
                powerHP: CONFIG.SYSTEM_HP_MAIN_POWER,
                hasCloak: false
            });
        }

        // Scintilian ships - with Cloaking Device
        if (this.faction === 'SCINTILIAN') {
            return new SystemManager({
                impulseHP: 16,
                warpHP: 20,
                sensorsHP: 6,
                cncHP: 6,
                bayHP: 6,
                powerHP: 12,
                hasCloak: true,
                cloakHP: CONFIG.SYSTEM_HP_SENSORS // Same HP as sensors
            });
        }

        // Default systems for other ship types
        return new SystemManager({
            impulseHP: 16,
            warpHP: 20,
            sensorsHP: 6,
            cncHP: 6,
            bayHP: 6,
            powerHP: 12,
            hasCloak: false
        });
    }

    createPhysicsBody() {
        const size = this.getShipSize();

        // Create circular body for now (will refine with proper hull shape later)
        const body = this.physicsWorld.createCircleBody(this.x, this.y, size * 0.6, {
            type: 'dynamic',
            rotation: this.rotation,
            density: 1.5,
            restitution: 0.5,
            bullet: true, // Enable continuous collision detection
            category: this.physicsWorld.CATEGORY.SHIP,
            mask: 0xFFFF
        });

        this.physicsComponent = new PhysicsComponent(this, body, this.physicsWorld);
    }

    getShipHp() {
        switch (this.shipClass) {
            case 'FG': return CONFIG.SHIP_HP_FG;
            case 'DD': return CONFIG.SHIP_HP_DD;
            case 'CL': return CONFIG.SHIP_HP_CL;
            case 'CA': return CONFIG.SHIP_HP_CA;
            case 'BC': return CONFIG.SHIP_HP_BC;
            default: return CONFIG.SHIP_HP_CA;
        }
    }

    getMaxSpeed() {
        let speed;
        switch (this.shipClass) {
            case 'FG': speed = CONFIG.MAX_SPEED_FG; break;
            case 'DD': speed = CONFIG.MAX_SPEED_DD; break;
            case 'CL': speed = CONFIG.MAX_SPEED_CL; break;
            case 'CA': speed = CONFIG.MAX_SPEED_CA; break;
            case 'BC': speed = CONFIG.MAX_SPEED_BC; break;
            default: speed = CONFIG.MAX_SPEED_CA;
        }

        if (this.faction === 'TRIGON') {
            speed *= CONFIG.MAX_SPEED_TRIGON_MULTIPLIER;
        }

        return speed;
    }

    getAcceleration() {
        switch (this.shipClass) {
            case 'FG': return CONFIG.ACCELERATION_FG;
            case 'DD': return CONFIG.ACCELERATION_DD;
            case 'CL': return CONFIG.ACCELERATION_CL;
            case 'CA': return CONFIG.ACCELERATION_CA;
            case 'BC': return CONFIG.ACCELERATION_BC;
            default: return CONFIG.ACCELERATION_CA;
        }
    }

    getTurnRate() {
        let rate;
        switch (this.shipClass) {
            case 'FG': rate = CONFIG.TURN_RATE_FG; break;
            case 'DD': rate = CONFIG.TURN_RATE_DD; break;
            case 'CL': rate = CONFIG.TURN_RATE_CL; break;
            case 'CA': rate = CONFIG.TURN_RATE_CA; break;
            case 'BC': rate = CONFIG.TURN_RATE_BC; break;
            default: rate = CONFIG.TURN_RATE_CA;
        }

        if (this.faction === 'TRIGON') {
            rate *= CONFIG.TURN_RATE_TRIGON_MULTIPLIER;
        }

        return rate;
    }

    getBayCapacity() {
        switch (this.shipClass) {
            case 'FG': return CONFIG.BAY_CAPACITY_FG;
            case 'DD': return CONFIG.BAY_CAPACITY_DD;
            case 'CL': return CONFIG.BAY_CAPACITY_CL;
            case 'CA': return CONFIG.BAY_CAPACITY_CA;
            case 'BC': return CONFIG.BAY_CAPACITY_BC;
            default: return CONFIG.BAY_CAPACITY_CA;
        }
    }

    initializeBayContents() {
        // Default loadouts based on ship class
        // Each item takes 1 space: shuttle, decoy, or mine
        // For now, shuttles not implemented, so use decoys and mines
        const contents = [];

        switch (this.shipClass) {
            case 'FG':
                // 2 spaces: 1 Decoy + 1 Mine
                contents.push({ type: 'decoy' });
                contents.push({ type: 'mine' });
                break;
            case 'DD':
                // 3 spaces: 2 Decoys + 1 Mine
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'mine' });
                break;
            case 'CL':
                // 4 spaces: 2 Decoys + 2 Mines
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
                break;
            case 'CA':
                // 6 spaces: 3 Decoys + 3 Mines
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
                break;
            case 'BC':
                // 8 spaces: 4 Decoys + 4 Mines
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
                break;
            default:
                // Default CA loadout
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'decoy' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
                contents.push({ type: 'mine' });
        }

        return contents;
    }

    getColor() {
        switch (this.faction) {
            case 'PLAYER': return CONFIG.COLOR_PLAYER;
            case 'TRIGON': return CONFIG.COLOR_TRIGON;
            case 'SCINTILIAN': return CONFIG.COLOR_SCINTILIAN;
            case 'PIRATE': return CONFIG.COLOR_PIRATE;
            default: return '#ffffff';
        }
    }

    generateShipName() {
        const prefixes = ['USS', 'IKS', 'IRW', 'ITS'];
        const names = ['Enterprise', 'Defiant', 'Voyager', 'Discovery', 'Reliant', 'Excalibur'];
        const prefix = this.faction === 'PLAYER' ? 'USS' :
                      this.faction === 'TRIGON' ? 'IKS' :
                      this.faction === 'SCINTILIAN' ? 'IRW' :
                      'ITS';
        const name = names[Math.floor(Math.random() * names.length)];
        return `${prefix} ${name}`;
    }

    generateShipVertices() {
        // Generate ship outline based on class and faction
        // This is a simplified version - will be enhanced with proper ship designs

        const size = this.getShipSize();

        if (this.faction === 'PLAYER') {
            // Galaxy-class inspired (saucer + engineering hull + nacelles)
            return this.generateGalaxyClass(size);
        } else if (this.faction === 'TRIGON') {
            // D-7 inspired (command pod + neck + body + nacelles)
            return this.generateD7Class(size);
        } else if (this.faction === 'SCINTILIAN') {
            // Warbird inspired (saucer with forward-swept nacelles)
            return this.generateWarbirdClass(size);
        } else if (this.faction === 'PIRATE') {
            // Tholian inspired (asymmetrical diamond)
            return this.generateTholianClass(size);
        }

        // Fallback: simple triangle
        return [
            { x: 0, y: -size },
            { x: -size * 0.6, y: size },
            { x: size * 0.6, y: size }
        ];
    }

    getShipSize() {
        switch (this.shipClass) {
            case 'FG': return CONFIG.SHIP_LENGTH_FG;
            case 'DD': return CONFIG.SHIP_LENGTH_DD;
            case 'CL': return CONFIG.SHIP_LENGTH_CL;
            case 'CA': return CONFIG.SHIP_LENGTH_CA;
            case 'BC': return CONFIG.SHIP_LENGTH_BC;
            default: return CONFIG.SHIP_LENGTH_CA;
        }
    }

    generateGalaxyClass(size) {
        // Galaxy-class (USS Enterprise NCC-1701-D) with nacelles on struts
        const vertices = [];

        // SAUCER SECTION (large elliptical primary hull - dominates Galaxy-class)
        const saucerRadiusX = size * 0.75; // Wide saucer
        const saucerRadiusY = size * 0.65; // Less tall than wide
        const saucerY = -size * 0.35;

        // Full elliptical saucer (front and sides)
        for (let i = 0; i <= 16; i++) {
            const angle = Math.PI * 0.6 + (i / 16) * Math.PI * 1.8; // 108ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° to 432ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° arc (front and sides)
            vertices.push({
                x: Math.cos(angle) * saucerRadiusX,
                y: saucerY + Math.sin(angle) * saucerRadiusY
            });
        }

        // Right side - connect saucer to engineering hull
        const neckWidth = size * 0.12;
        vertices.push({ x: neckWidth, y: saucerY + saucerRadiusY * 0.6 });

        // Right side of engineering hull
        vertices.push({ x: size * 0.18, y: size * 0.25 });

        // RIGHT NACELLE STRUT (flat horizontal section extending from engineering hull)
        vertices.push({ x: size * 0.18, y: size * 0.4 }); // Strut connection point on hull
        vertices.push({ x: size * 0.35, y: size * 0.38 }); // Strut extends outward
        vertices.push({ x: size * 0.5, y: size * 0.36 });  // Strut continues

        // RIGHT NACELLE (positioned at end of strut, standing off from hull)
        vertices.push({ x: size * 0.52, y: size * 0.3 });  // Nacelle front outer edge
        vertices.push({ x: size * 0.82, y: size * 0.35 }); // Nacelle extends forward
        vertices.push({ x: size * 0.85, y: size * 0.75 }); // Nacelle main body
        vertices.push({ x: size * 0.78, y: size * 0.82 }); // Nacelle aft outer edge
        vertices.push({ x: size * 0.48, y: size * 0.77 }); // Nacelle aft inner edge

        // Strut return path (bottom of strut connecting nacelle back to hull)
        vertices.push({ x: size * 0.46, y: size * 0.72 }); // Strut bottom
        vertices.push({ x: size * 0.3, y: size * 0.7 });
        vertices.push({ x: size * 0.18, y: size * 0.68 }); // Strut connects back to hull

        // Continue engineering hull
        vertices.push({ x: size * 0.18, y: size * 0.9 });

        // Bottom of engineering hull
        vertices.push({ x: size * 0.1, y: size * 0.98 });
        vertices.push({ x: 0, y: size });
        vertices.push({ x: -size * 0.1, y: size * 0.98 });

        // Left side of engineering hull
        vertices.push({ x: -size * 0.18, y: size * 0.9 });
        vertices.push({ x: -size * 0.18, y: size * 0.68 }); // Strut connection

        // LEFT NACELLE STRUT (mirror of right)
        vertices.push({ x: -size * 0.3, y: size * 0.7 });
        vertices.push({ x: -size * 0.46, y: size * 0.72 });

        // LEFT NACELLE (mirror of right)
        vertices.push({ x: -size * 0.48, y: size * 0.77 }); // Nacelle aft inner edge
        vertices.push({ x: -size * 0.78, y: size * 0.82 }); // Nacelle aft outer edge
        vertices.push({ x: -size * 0.85, y: size * 0.75 }); // Nacelle main body
        vertices.push({ x: -size * 0.82, y: size * 0.35 }); // Nacelle extends forward
        vertices.push({ x: -size * 0.52, y: size * 0.3 });  // Nacelle front outer edge

        // Strut top (connecting nacelle to hull)
        vertices.push({ x: -size * 0.5, y: size * 0.36 });
        vertices.push({ x: -size * 0.35, y: size * 0.38 });
        vertices.push({ x: -size * 0.18, y: size * 0.4 });
        vertices.push({ x: -size * 0.18, y: size * 0.25 });

        // Left side - connect back to saucer
        vertices.push({ x: -neckWidth, y: saucerY + saucerRadiusY * 0.6 });

        return vertices;
    }

    generateD7Class(size) {
        // ALL Trigon ships use D7-style bird-of-prey design
        const vertices = [];

        // COMMAND POD (triangle with apex pointing backwards, curved front)
        // Curved front edge (top of ship in image)
        const podRadius = size * 0.45;

        // Front curve - right side to left side via top
        for (let i = 0; i <= 8; i++) {
            const angle = Math.PI * 0.3 + (i / 8) * Math.PI * 0.4; // 54ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° to 126ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° arc
            vertices.push({
                x: Math.cos(angle) * podRadius,
                y: -size * 0.65 + Math.sin(angle) * podRadius * 0.6
            });
        }

        // Apex of triangle (pointing backwards into ship body)
        vertices.push({ x: 0, y: -size * 0.4 });

        // NECK (narrow connecting section from pod to wings)
        vertices.push({ x: size * 0.2, y: -size * 0.2 });

        // RIGHT WING (swept back)
        // Wing root
        vertices.push({ x: size * 0.25, y: -size * 0.1 });

        // Wing leading edge (swept forward slightly)
        vertices.push({ x: size * 0.7, y: 0 });
        vertices.push({ x: size * 0.85, y: size * 0.15 });

        // Wing tip
        vertices.push({ x: size * 0.9, y: size * 0.35 });

        // Wing trailing edge (swept back sharply)
        vertices.push({ x: size * 0.8, y: size * 0.55 });
        vertices.push({ x: size * 0.6, y: size * 0.7 });
        vertices.push({ x: size * 0.4, y: size * 0.8 });

        // CENTRAL BODY (rear section between wings)
        vertices.push({ x: size * 0.2, y: size * 0.9 });
        vertices.push({ x: 0, y: size * 1.0 });  // Aft point
        vertices.push({ x: -size * 0.2, y: size * 0.9 });

        // LEFT WING (mirror of right)
        // Wing trailing edge
        vertices.push({ x: -size * 0.4, y: size * 0.8 });
        vertices.push({ x: -size * 0.6, y: size * 0.7 });
        vertices.push({ x: -size * 0.8, y: size * 0.55 });

        // Wing tip
        vertices.push({ x: -size * 0.9, y: size * 0.35 });

        // Wing leading edge
        vertices.push({ x: -size * 0.85, y: size * 0.15 });
        vertices.push({ x: -size * 0.7, y: 0 });

        // Wing root
        vertices.push({ x: -size * 0.25, y: -size * 0.1 });

        // Left neck
        vertices.push({ x: -size * 0.2, y: -size * 0.2 });

        return vertices;
    }

    generateWarbirdClass(size) {
        // Simplified Warbird: saucer with swept wings
        const vertices = [];

        // Main saucer
        const saucerRadius = size * 0.5;
        for (let i = 0; i <= 10; i++) {
            const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
            vertices.push({
                x: Math.cos(angle) * saucerRadius,
                y: Math.sin(angle) * saucerRadius
            });
        }

        return vertices;
    }

    generateTholianClass(size) {
        // Asymmetrical diamond
        return [
            { x: 0, y: -size * 0.9 },
            { x: size * 0.7, y: -size * 0.2 },
            { x: size * 0.4, y: size * 0.8 },
            { x: -size * 0.5, y: size * 0.6 },
            { x: -size * 0.8, y: 0 }
        ];
    }

    generateWeaponPoints() {
        const size = this.getShipSize();
        const points = {
            forwardBeamBand: null,
            aftBeamPoint: null,
            forwardTorpedoPoint: null,
            aftTorpedoPoint: null
        };

        if (this.faction === 'PLAYER' || this.faction === 'FEDERATION' || this.faction === 'SCINTILIAN' || this.faction === 'PIRATE') {
            // Galaxy-class weapon points (centered in saucer)
            const saucerRadius = size * 0.5; // Smaller radius to fit inside saucer
            const saucerCenterY = -size * 0.15; // Centered in saucer, moved down

            // Forward beam battery band (270ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° circular arc on saucer)
            points.forwardBeamBand = {
                type: 'ellipse',
                centerX: 0,
                centerY: saucerCenterY,
                radiusX: saucerRadius,
                radiusY: saucerRadius, // Circular, not elliptical
                startAngle: 180, // Left side
                endAngle: 360,   // Right side (via top)
                arcDegrees: 270
            };

            // Aft beam battery band (rounded rectangle perpendicular to ship axis)
            points.aftBeamPoint = {
                type: 'rectangle',
                x: 0,
                y: size * 0.95, // Position at rear of engineering hull
                width: size * 0.3, // Width perpendicular to ship axis
                height: size * 0.08, // Height along ship axis
                rotation: 0 // Perpendicular to long axis (horizontal)
            };

            // Forward torpedo origin (top front of ship)
            points.forwardTorpedoPoint = {
                type: 'point',
                x: 0,
                y: saucerCenterY - saucerRadius // Top of circular saucer
            };

            // Aft torpedo origin (bottom rear of ship)
            points.aftTorpedoPoint = {
                type: 'point',
                x: 0,
                y: size * 1.02 // Bottom of engineering hull
            };
        }
        // Add weapon points for other factions as needed

        return points;
    }

    thrust(direction, deltaTime) {
        // direction: 1 = forward, -1 = backward (reverse)
        if (direction > 0) {
            // W key - accelerate forward
            this.currentSpeed += this.acceleration * deltaTime;
            this.currentSpeed = Math.min(this.currentSpeed, this.maxSpeed);
        } else if (direction < 0) {
            // S key - decelerate quickly, then reverse
            if (this.currentSpeed > 1.0) {
                // Currently moving forward - apply quick deceleration
                this.currentSpeed -= this.reverseDeceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, 0);
            } else if (this.currentSpeed >= -0.1 && this.currentSpeed <= 1.0) {
                // Near zero - accelerate backward gradually
                this.currentSpeed -= this.acceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, -this.maxReverseSpeed);
            } else {
                // Already reversing - continue accelerating backward
                this.currentSpeed -= this.acceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, -this.maxReverseSpeed);
            }
        }

        // Apply velocity based on current speed and facing direction
        if (this.physicsComponent) {
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }
    }

    // Natural deceleration when no thrust input
    applyDeceleration(deltaTime) {
        if (this.currentSpeed > 0) {
            // Slowing down from forward motion
            this.currentSpeed -= this.deceleration * deltaTime;
            this.currentSpeed = Math.max(this.currentSpeed, 0);
        } else if (this.currentSpeed < 0) {
            // Slowing down from reverse motion
            this.currentSpeed += this.deceleration * deltaTime;
            this.currentSpeed = Math.min(this.currentSpeed, 0);
        }

        // Apply velocity
        if (this.physicsComponent) {
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }
    }

    turn(direction, deltaTime) {
        // direction: 1 = right, -1 = left
        const degreesturned = this.turnRate * deltaTime * direction;

        // Calculate speed reduction: 10% per 30 degrees
        const speedReduction = (Math.abs(degreesturned) / 30) * 0.10;
        const wasPositive = this.currentSpeed > 0;
        const wasNegative = this.currentSpeed < 0;

        this.currentSpeed *= (1 - speedReduction);

        // Safeguard: ensure turning doesn't flip the direction of movement
        if (wasPositive && this.currentSpeed < 0) this.currentSpeed = 0;
        if (wasNegative && this.currentSpeed > 0) this.currentSpeed = 0;

        if (this.physicsComponent) {
            // Apply torque via physics
            const torque = this.turnRate * direction * 10; // Scale for physics
            this.physicsComponent.body.applyTorque(torque);

            // Also directly set rotation for responsive feel
            this.rotation += degreesturned;
            this.rotation = MathUtils.normalizeAngle(this.rotation);
            this.physicsComponent.body.setAngle(MathUtils.toRadians(this.rotation));

            // Update velocity direction based on new facing
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.rotation += degreesturned;
            this.rotation = MathUtils.normalizeAngle(this.rotation);
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }
    }

    stopRotation() {
        if (this.physicsComponent) {
            // Zero out angular velocity
            this.physicsComponent.body.setAngularVelocity(0);
        }
    }

    update(deltaTime) {
        if (this.physicsComponent) {
            // Sync position from physics
            this.physicsComponent.syncToEntity();
            // Note: currentSpeed is maintained independently via thrust/deceleration/turn methods
            // We don't sync it from physics to avoid direction flip bugs when turning
        } else {
            // Fallback to non-physics movement
            this.transform.updatePosition(deltaTime);
        }

        const currentTime = performance.now() / 1000;

        // Update damage flash effect (decay)
        if (this.damageFlashAlpha > 0) {
            this.damageFlashAlpha = Math.max(0, this.damageFlashAlpha - deltaTime * 3); // Fade over ~0.3 seconds
        }

        // Update shields
        if (this.shields) {
            this.shields.update(deltaTime, currentTime);
        }

        // Update systems (now includes weapons auto-repair)
        if (this.systems) {
            const systemEvent = this.systems.update(deltaTime, currentTime);
            if (systemEvent) {
                if (systemEvent.type === 'core-breach') {
                    this.hp = 0;
                    this.destroy();
                } else if (systemEvent.type === 'control-glitch' && this.isPlayer) {
                    eventBus.emit('control-glitch');
                }
            }

            // Apply system effects to ship stats
            this.maxSpeed = this.getMaxSpeed() * this.systems.getSpeedMultiplier();
            this.turnRate = this.getTurnRate() * this.systems.getTurnRateMultiplier();
        }

        // Update tractor beam (requires entities from Engine)
        // Note: tractor beam is updated from Engine.js where entities list is available

        // Apply tractor beam penalties to ship stats
        if (this.tractorBeam && this.tractorBeam.isActive()) {
            this.maxSpeed *= this.tractorBeam.getSpeedMultiplier();
        }
    }

    /**
     * Check if ship can fire weapons (cloaking check)
     */
    canFireWeapons() {
        if (this.systems && this.systems.cloak) {
            const currentTime = performance.now() / 1000;
            return this.systems.cloak.canFireWeapons(currentTime);
        }
        return true; // Ships without cloak can always fire
    }

    /**
     * Check if ship is cloaked
     */
    isCloaked() {
        return this.systems && this.systems.cloak && this.systems.cloak.cloaked;
    }

    /**
     * Fire beam weapons at target
     */
    fireBeams(targetX, targetY, currentTime) {
        if (!this.canFireWeapons()) return [];

        // Use provided currentTime or get it now
        if (!currentTime) {
            currentTime = performance.now() / 1000;
        }

        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // DEBUG
        if (CONFIG.DEBUG_MODE && this.isPlayer) {
            console.log('Fire Beams - Angles:', {
                shipPos: { x: this.x.toFixed(1), y: this.y.toFixed(1) },
                targetPos: { x: targetX.toFixed(1), y: targetY.toFixed(1) },
                shipRotation: this.rotation.toFixed(1),
                targetAngle: targetAngle.toFixed(1),
                angleDiff: (targetAngle - this.rotation).toFixed(1)
            });
        }

        // Fire all beam weapons that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof BeamWeapon || weapon instanceof Disruptor || weapon instanceof PulseBeam) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime);
                    if (projectile) {
                        // Apply tractor beam penalty to beam damage
                        if (this.tractorBeam && this.tractorBeam.isActive()) {
                            projectile.damage *= this.tractorBeam.getBeamMultiplier();
                        }
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Fire torpedoes at target
     */
    fireTorpedoes(targetX, targetY, lockOnTarget = null) {
        if (!this.canFireWeapons()) {
            if (CONFIG.DEBUG_MODE && this.isPlayer) {
                console.log('Cannot fire weapons - weapons disabled');
            }
            return [];
        }

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // DEBUG
        if (CONFIG.DEBUG_MODE && this.isPlayer) {
            console.log('Fire Torpedoes:', {
                weaponCount: this.weapons.length,
                targetAngle: targetAngle.toFixed(1),
                lockOnTarget: !!lockOnTarget
            });
        }

        // Fire all torpedo/plasma launchers that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof TorpedoLauncher || weapon instanceof PlasmaTorpedo) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime, lockOnTarget);
                    if (projectile) {
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Fire plasma torpedoes with charged damage
     */
    firePlasma(targetX, targetY, lockOnTarget, chargeDamage) {
        if (!this.canFireWeapons()) {
            if (CONFIG.DEBUG_MODE && this.isPlayer) {
                console.log('Cannot fire weapons - weapons disabled');
            }
            return [];
        }

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all plasma torpedo launchers that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof PlasmaTorpedo) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime, lockOnTarget, chargeDamage);
                    if (projectile) {
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Get disruptor burst shots (called every frame during burst)
     */
    getDisruptorBurstShots(targetX, targetY) {
        if (!this.canFireWeapons()) return [];

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Check all disruptors for burst shots
        for (const weapon of this.weapons) {
            if (weapon instanceof Disruptor) {
                const projectile = weapon.getNextBurstShot(this, targetX, targetY, currentTime);
                if (projectile) {
                    projectiles.push(projectile);
                }
            }
        }

        return projectiles;
    }

    /**
     * Deploy decoy
     */
    deployDecoy() {
        const currentTime = performance.now() / 1000;

        // Check bay contents for decoy
        const decoyIndex = this.bayContents.findIndex(item => item.type === 'decoy');
        if (decoyIndex === -1) return null; // No decoys in bay

        if (currentTime - this.lastDeploymentTime < CONFIG.DEPLOYMENT_COOLDOWN) return null;

        // Remove decoy from bay
        this.bayContents.splice(decoyIndex, 1);

        // Update legacy counter for backward compatibility
        this.decoys = this.bayContents.filter(item => item.type === 'decoy').length;

        this.lastDeploymentTime = currentTime;

        // Create decoy at ship position
        const decoy = new Decoy(this.x, this.y);
        eventBus.emit('decoy-deployed', { ship: this });

        return decoy;
    }

    /**
     * Deploy mine
     */
    deployMine() {
        const currentTime = performance.now() / 1000;

        // Check bay contents for mine
        const mineIndex = this.bayContents.findIndex(item => item.type === 'mine');
        if (mineIndex === -1) return null; // No mines in bay

        if (currentTime - this.lastDeploymentTime < CONFIG.DEPLOYMENT_COOLDOWN) return null;

        // Remove mine from bay
        this.bayContents.splice(mineIndex, 1);

        // Update legacy counter for backward compatibility
        this.mines = this.bayContents.filter(item => item.type === 'mine').length;

        this.lastDeploymentTime = currentTime;

        // Create mine at ship position
        const mine = new Mine(this.x, this.y, this);
        eventBus.emit('mine-deployed', { ship: this });

        return mine;
    }

    /**
     * Cycle through shuttle mission types
     */
    cycleShuttleMission() {
        const currentIndex = this.shuttleMissionTypes.indexOf(this.selectedShuttleMission);
        const nextIndex = (currentIndex + 1) % this.shuttleMissionTypes.length;
        this.selectedShuttleMission = this.shuttleMissionTypes[nextIndex];

        // Emit event for HUD update
        eventBus.emit('shuttle-mission-changed', { ship: this, missionType: this.selectedShuttleMission });
    }

    /**
     * Launch a shuttle from the bay by mission index
     * @param {number} missionIndex - Mission index (0-5)
     * @param {string} craftType - 'shuttle', 'drone', 'fighter', or 'bomber'
     */
    launchShuttleByIndex(missionIndex, craftType = 'shuttle') {
        // Map mission index to mission type
        const missionTypes = ['attack', 'defense', 'weasel', 'suicide', 'transport', 'patrol'];
        const missionType = missionTypes[missionIndex] || 'attack';

        // Check if bay has a shuttle (for now, all craft types use shuttle entity)
        const shuttleIndex = this.bayContents.findIndex(item => item.type === 'shuttle');
        if (shuttleIndex === -1) {
            // No shuttles in bay
            if (CONFIG.DEBUG_MODE && this.isPlayer) {
                console.log('No shuttles available in bay');
            }
            return null;
        }

        // Remove shuttle from bay
        this.bayContents.splice(shuttleIndex, 1);

        // Create shuttle entity
        const shuttle = new Shuttle({
            x: this.x,
            y: this.y,
            parentShip: this,
            missionType: missionType,
            missionData: this.getShuttleMissionDataFor(missionType),
            faction: this.faction,
            craftType: craftType // Store craft type for future differentiation
        });

        // Track active shuttle
        this.activeShuttles.push(shuttle);

        // Emit event
        eventBus.emit('shuttle-launched', { ship: this, shuttle: shuttle, missionType: missionType, craftType: craftType });

        return shuttle;
    }

    /**
     * Launch shuttle on selected mission (legacy method)
     */
    launchShuttle() {
        // Use first mission type as default
        return this.launchShuttleByIndex(0, 'shuttle');
    }

    /**
     * Get mission data for transport missions
     */
    getShuttleMissionDataFor(missionType) {
        if (missionType === 'transport' || missionType === 'patrol') {
            // Default transport mission: fly 500 units forward, pause 5 seconds, return
            const forwardX = this.x + Math.cos(this.rotation) * 500;
            const forwardY = this.y + Math.sin(this.rotation) * 500;

            return {
                targetLocation: { x: forwardX, y: forwardY },
                pauseDuration: 5
            };
        }

        return {};
    }

    /**
     * Get mission data for transport missions (legacy method)
     */
    getShuttleMissionData() {
        return this.getShuttleMissionDataFor(this.selectedShuttleMission);
    }

    /**
     * Recall all active shuttles
     */
    recallShuttles() {
        for (const shuttle of this.activeShuttles) {
            if (shuttle && shuttle.active) {
                shuttle.recall();
            }
        }

        // Emit event
        eventBus.emit('shuttles-recalled', { ship: this, count: this.activeShuttles.length });
    }

    /**
     * Clean up inactive shuttles from tracking
     */
    cleanupShuttles() {
        this.activeShuttles = this.activeShuttles.filter(shuttle => shuttle && shuttle.active);
    }

    /**
     * Get all beam weapons (including pulse beams)
     */
    getBeamWeapons() {
        return this.weapons.filter(w => w instanceof BeamWeapon || w instanceof PulseBeam);
    }

    /**
     * Get all torpedo launchers
     */
    getTorpedoLaunchers() {
        return this.weapons.filter(w => w instanceof TorpedoLauncher || w instanceof PlasmaTorpedo);
    }

    /**
     * Check if shields are down (no shields or all shields at 0)
     */
    areShieldsDown(impactAngle, shipRotation) {
        if (!this.shields || this.isCloaked()) return true;

        // Check which shield facing is hit
        const relativeAngle = MathUtils.normalizeAngle(impactAngle - shipRotation);
        let facing = 'fore';

        if (relativeAngle >= 45 && relativeAngle < 135) {
            facing = 'starboard';
        } else if (relativeAngle >= 135 && relativeAngle < 225) {
            facing = 'aft';
        } else if (relativeAngle >= 225 && relativeAngle < 315) {
            facing = 'port';
        }

        // Check if that shield facing is down
        return this.shields[facing].hp <= 0;
    }

    /**
     * Take damage
     */
    takeDamage(damage, contactPoint) {
        let remainingDamage = damage;
        const currentTime = performance.now() / 1000;

        // Notify cloaking device if hit while cloaked
        if (this.systems && this.systems.cloak) {
            this.systems.cloak.onHit(currentTime);
        }

        // Calculate impact angle if contact point provided
        // NO SHIELDS while cloaked!
        if (contactPoint && this.shields && !this.isCloaked()) {
            const impactAngle = MathUtils.angleBetween(this.x, this.y, contactPoint.x, contactPoint.y);
            remainingDamage = this.shields.applyDamage(this.rotation, impactAngle, remainingDamage, currentTime);

            if (this.isPlayer && remainingDamage < damage) {
                const shieldDamage = damage - remainingDamage;
                eventBus.emit('shield-hit', {
                    damage: shieldDamage,
                    overflow: remainingDamage,
                    point: contactPoint
                });
            }
        }

        // Apply damage to internal systems based on hit location
        if (remainingDamage > 0 && contactPoint && this.systems) {
            // Convert contact point to ship-relative coordinates
            const dx = contactPoint.x - this.x;
            const dy = contactPoint.y - this.y;

            // Rotate to ship's reference frame
            const rad = MathUtils.toRadians(-this.rotation);
            const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
            const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

            const systemDamage = this.systems.applyDamageToNearestSystem(localX, localY, remainingDamage);

            if (systemDamage.system && this.isPlayer) {
                const systemDamageTaken = remainingDamage - systemDamage.overflow;
                if (systemDamageTaken > 0) {
                    eventBus.emit('system-damage', {
                        system: systemDamage.system.name,
                        damage: systemDamageTaken,
                        hp: systemDamage.system.hp,
                        maxHp: systemDamage.system.maxHp
                    });
                }
            }

            remainingDamage = systemDamage.overflow;
        }

        // Apply remaining damage to hull
        if (remainingDamage > 0) {
            this.hp = Math.max(0, this.hp - remainingDamage);

            // Add damage flash effect for ALL ships (not just player)
            this.damageFlashAlpha = 0.8;

            if (this.isPlayer) {
                eventBus.emit('player-damage', {
                    damage: remainingDamage,
                    hp: this.hp,
                    point: contactPoint
                });
            }
        }

        if (this.hp <= 0) {
            this.destroy();
        }
    }

    destroy() {
        super.destroy();
        if (this.physicsComponent) {
            this.physicsComponent.destroy();
        }

        if (this.isPlayer) {
            eventBus.emit('player-destroyed');
        } else {
            // Emit enemy destroyed event for mission tracking
            eventBus.emit('enemy-destroyed', {
                enemy: this,
                faction: this.faction,
                shipClass: this.shipClass
            });
        }
    }
}





