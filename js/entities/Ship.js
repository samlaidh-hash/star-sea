/**
 * Star Sea - Ship Entity
 */

const WEAPON_POSITIONS = {
    forwardCenter: { x: 0, y: -30 },
    forwardPort: { x: -6, y: -14 },
    forwardStarboard: { x: 6, y: -14 },
    aftCenter: { x: 0, y: 70 },
    forwardTorpPort: { x: -3, y: -12 },
    forwardTorpStarboard: { x: 3, y: -12 },
    dualTorpCenter: { x: 0, y: -10 },
    aftTorpPort: { x: -3, y: 12 },
    aftTorpStarboard: { x: 3, y: 12 },
    disruptorPort: { x: -7, y: -13 },
    disruptorStarboard: { x: 7, y: -13 },
    // Trigon-specific positions (scaled by size, on wings)
    trigonWingPortFwd: { x: -0.6, y: -0.25, scaled: true },      // Left wing forward
    trigonWingStarboardFwd: { x: 0.6, y: -0.25, scaled: true },  // Right wing forward
    trigonWingPortAft: { x: -0.5, y: 0.35, scaled: true },       // Left wing aft
    trigonWingStarboardAft: { x: 0.5, y: 0.35, scaled: true },   // Right wing aft
    trigonNose: { x: 0, y: -0.8, scaled: true },                 // Nose position
    trigonCenterAft: { x: 0, y: 0.9, scaled: true },             // Center aft position
    // Scintilian-specific positions (scaled by size, on wings and body)
    scintilianHead: { x: 0, y: -0.75, scaled: true },            // Command head position
    scintilianNeck: { x: 0, y: -0.2, scaled: true },             // Neck centerline
    scintilianWingPortOuter: { x: -0.7, y: 0.6, scaled: true },  // Left wing outer
    scintilianWingStarboardOuter: { x: 0.7, y: 0.6, scaled: true }, // Right wing outer
    scintilianWingPortInner: { x: -0.3, y: 0.15, scaled: true }, // Left wing inner
    scintilianWingStarboardInner: { x: 0.3, y: 0.15, scaled: true }, // Right wing inner
    scintilianCenterAft: { x: 0, y: 0.75, scaled: true },        // Center aft position
    // Pirate-specific positions (scaled by size, cross-shaped layout)
    pirateUpperStabilizer: { x: 0, y: -0.8, scaled: true },      // Upper weapon mount
    pirateLowerStabilizer: { x: 0, y: 0.8, scaled: true },       // Lower weapon mount
    pirateWingPortTip: { x: -0.85, y: 0, scaled: true },         // Left wing tip
    pirateWingStarboardTip: { x: 0.85, y: 0, scaled: true },     // Right wing tip
    pirateWingPortInner: { x: -0.4, y: 0, scaled: true },        // Left wing inner
    pirateWingStarboardInner: { x: 0.4, y: 0, scaled: true },    // Right wing inner
    pirateCentralPod: { x: 0, y: 0, scaled: true }               // Central pod
};

const SHIP_WEAPON_LOADOUTS = {
    FEDERATION: {
        FG: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (FG)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 4, loaded: 2, maxLoaded: 2 }
        ],
        DD: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (DD)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 6, loaded: 3, maxLoaded: 3 }
        ],
        CL: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (CL)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 8, loaded: 4, maxLoaded: 4 }
        ],
        CS: [
            { type: 'streakBeam', name: 'Port Streak Beam', arc: 270, arcCenter: 270, positionKey: 'forwardPort' },
            { type: 'streakBeam', name: 'Starboard Streak Beam', arc: 270, arcCenter: 90, positionKey: 'forwardStarboard' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (CS)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 8, loaded: 4, maxLoaded: 4 }
        ],
        CA: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'continuousBeam', name: 'Aft Beam Battery', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (CA)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 10, loaded: 5, maxLoaded: 5 }
        ],
        BC: [
            { type: 'continuousBeam', name: 'Port Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardPort' },
            { type: 'continuousBeam', name: 'Starboard Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardStarboard' },
            { type: 'continuousBeam', name: 'Aft Beam Array', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (BC)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 12, loaded: 6, maxLoaded: 6 }
        ],
        BB: [
            { type: 'continuousBeam', name: 'Port Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardPort' },
            { type: 'continuousBeam', name: 'Starboard Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardStarboard' },
            { type: 'continuousBeam', name: 'Aft Beam Array', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (BB)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 14, loaded: 7, maxLoaded: 7 }
        ],
        DN: [
            { type: 'continuousBeam', name: 'Port Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardPort' },
            { type: 'continuousBeam', name: 'Starboard Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardStarboard' },
            { type: 'continuousBeam', name: 'Aft Beam Array', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (DN)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 16, loaded: 8, maxLoaded: 8 }
        ],
        SD: [
            { type: 'continuousBeam', name: 'Port Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardPort' },
            { type: 'continuousBeam', name: 'Starboard Forward Beam Array', arc: 270, arcCenter: 0, positionKey: 'forwardStarboard' },
            { type: 'continuousBeam', name: 'Aft Beam Array', arc: 270, arcCenter: 180, positionKey: 'aftCenter' },
            { type: 'dualTorpedo', name: 'Dual Torpedo Launcher (SD)', arc: 90, arcCenter: 0, arcCenters: [0, 180], positionKey: 'dualTorpCenter', hp: 18, loaded: 9, maxLoaded: 9 }
        ]
    },
    TRIGON: {
        FG: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' }
        ],
        DD: [
            { type: 'disruptor', name: 'Port Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' }
        ],
        CL: [
            { type: 'disruptor', name: 'Port Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' }
        ],
        CA: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' },
            { type: 'disruptor', name: 'Port Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' }
        ],
        BC: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' },
            { type: 'disruptor', name: 'Port Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' },
            { type: 'disruptor', name: 'Center Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonCenterAft' }
        ],
        BB: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' },
            { type: 'disruptor', name: 'Port Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' },
            { type: 'disruptor', name: 'Port Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingPortAft' },
            { type: 'disruptor', name: 'Starboard Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingStarboardAft' }
        ],
        DN: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' },
            { type: 'disruptor', name: 'Port Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' },
            { type: 'disruptor', name: 'Port Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingPortAft' },
            { type: 'disruptor', name: 'Starboard Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingStarboardAft' },
            { type: 'disruptor', name: 'Center Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonCenterAft' }
        ],
        SD: [
            { type: 'disruptor', name: 'Nose Disruptor Cannon', arc: 120, arcCenter: 0, positionKey: 'trigonNose' },
            { type: 'disruptor', name: 'Port Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingPortFwd' },
            { type: 'disruptor', name: 'Starboard Wing Fwd Disruptor', arc: 120, arcCenter: 0, positionKey: 'trigonWingStarboardFwd' },
            { type: 'disruptor', name: 'Port Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingPortAft' },
            { type: 'disruptor', name: 'Starboard Wing Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonWingStarboardAft' },
            { type: 'disruptor', name: 'Center Aft Disruptor', arc: 120, arcCenter: 180, positionKey: 'trigonCenterAft' }
        ]
    },
    SCINTILIAN: {
        FG: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 }
        ],
        DD: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' }
        ],
        CL: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ],
        CA: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardInner', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ],
        BC: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ],
        BB: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ],
        DN: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ],
        SD: [
            { type: 'pulseBeam', name: 'Head Pulse Beam', arc: 270, arcCenter: 0, positionKey: 'scintilianHead', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Inner Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardInner', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Port Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingPortOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'pulseBeam', name: 'Starboard Wing Outer Pulse Beam', arc: 270, arcCenter: 180, positionKey: 'scintilianWingStarboardOuter', cooldown: 0.5, damage: 0.5 },
            { type: 'plasma', name: 'Neck Plasma Launcher', arc: 90, arcCenter: 0, positionKey: 'scintilianNeck' },
            { type: 'plasma', name: 'Aft Plasma Launcher', arc: 90, arcCenter: 180, positionKey: 'scintilianCenterAft' }
        ]
    },
    // PIRATE loadouts removed - now generated randomly per-ship for variety
    DEFAULT: {
        FG: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' }
        ],
        DD: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        CL: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' }
        ],
        CA: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ],
        BC: [
            { type: 'continuousBeam', name: 'Forward Beam Battery', arc: 270, arcCenter: 0, positionKey: 'forwardCenter' },
            { type: 'torpedo', name: 'Forward Torpedo Launcher', arc: 90, arcCenter: 0, positionKey: 'forwardTorpPort' }
        ]
    }
};

const WEAPON_BUILDERS = {
    beam: spec => new BeamWeapon(spec),
    continuousBeam: spec => new ContinuousBeam(spec),
    pulseBeam: spec => new PulseBeam(spec),
    torpedo: spec => new TorpedoLauncher(spec),
    dualTorpedo: spec => new DualTorpedoLauncher(spec),
    plasma: spec => new PlasmaTorpedo(spec),
    disruptor: spec => new Disruptor(spec),
    streakBeam: spec => new StreakBeam(spec)
};

function cloneWeaponPosition(positionKey, explicitPosition, shipSize) {
    if (explicitPosition) {
        return { x: explicitPosition.x, y: explicitPosition.y };
    }
    if (positionKey && WEAPON_POSITIONS[positionKey]) {
        const base = WEAPON_POSITIONS[positionKey];
        // If scaled is true, multiply by ship size (for faction-specific positions)
        if (base.scaled && shipSize) {
            return { x: base.x * shipSize, y: base.y * shipSize };
        }
        return { x: base.x, y: base.y };
    }
    return undefined;
}

function buildWeaponFromSpec(spec, shipSize) {
    const builder = WEAPON_BUILDERS[spec.type];
    if (!builder) {
        console.warn(`Unknown weapon type in loadout: ${spec.type}`);
        return null;
    }

    const { type, positionKey, position, ...rest } = spec;
    const config = { ...rest };
    const finalPosition = cloneWeaponPosition(positionKey, position, shipSize);
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

/**
 * Generate random pirate weapon loadout
 * Pirates get 1-2 weapon types chosen randomly from: beams, torpedoes, disruptors, plasma
 */
function generatePirateLoadout(shipClass) {
    const weaponTypes = ['continuousBeam', 'torpedo', 'disruptor', 'plasma'];
    const numWeapons = Math.random() < 0.5 ? 1 : 2; // 50% chance of 1 or 2 types

    // Randomly select weapon types
    const selectedTypes = [];
    const availableTypes = [...weaponTypes];
    for (let i = 0; i < numWeapons && availableTypes.length > 0; i++) {
        const index = Math.floor(Math.random() * availableTypes.length);
        selectedTypes.push(availableTypes[index]);
        availableTypes.splice(index, 1); // Remove to prevent duplicates
    }

    const loadout = [];

    // Add weapons based on selected types
    for (const type of selectedTypes) {
        switch (type) {
            case 'continuousBeam':
                loadout.push({
                    type: 'continuousBeam',
                    name: 'Salvaged Beam',
                    arc: 270,
                    arcCenter: 0,
                    positionKey: 'pirateUpperStabilizer'
                });
                break;
            case 'torpedo':
                loadout.push({
                    type: 'torpedo',
                    name: 'Jury-Rigged Torpedo',
                    arc: 90,
                    arcCenter: 180,
                    positionKey: 'pirateLowerStabilizer'
                });
                break;
            case 'disruptor':
                loadout.push({
                    type: 'disruptor',
                    name: 'Stolen Disruptor',
                    arc: 120,
                    arcCenter: 270,
                    positionKey: 'pirateWingPortInner'
                });
                break;
            case 'plasma':
                loadout.push({
                    type: 'plasma',
                    name: 'Black Market Plasma',
                    arc: 90,
                    arcCenter: 180,
                    positionKey: 'pirateLowerStabilizer'
                });
                break;
        }
    }

    return loadout;
}

function getShipLoadoutSpecs(faction, shipClass) {
    // Pirates get random loadouts for variety
    if (faction === 'PIRATE') {
        return generatePirateLoadout(shipClass);
    }

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

        // Health - NOW HANDLED BY HULL SYSTEM
        // this.maxHp = this.getShipHp();  // DEPRECATED - Use this.systems.hull.maxHp
        // this.hp = this.maxHp;           // DEPRECATED - Use this.systems.hull.hp

        // Countermeasures (legacy - replaced by bay system)
        this.decoys = CONFIG.DECOY_COUNT;
        this.mines = CONFIG.MINE_COUNT;
        this.captorMines = CONFIG.CAPTOR_MINE_COUNT || 2;  // Variant mine: captures ships
        this.phaserMines = CONFIG.PHASER_MINE_COUNT || 2;   // Variant mine: area denial
        this.transporterMines = CONFIG.TRANSPORTER_MINE_COUNT || 2; // Variant mine: teleports ships
        this.interceptors = CONFIG.INTERCEPTOR_COUNT || 6;  // Anti-torpedo missiles
        this.lastDeploymentTime = 0;

        // Bay System
        this.bayCapacity = this.getBayCapacity();
        this.bayContents = this.initializeBayContents();

        // Shuttle System
        this.selectedShuttleMission = 'attack'; // Current selected mission type
        this.activeShuttles = []; // Tracking launched shuttles
        this.shuttleMissionTypes = ['attack', 'defense', 'weasel', 'suicide', 'transport'];
        // Torpedo type selection
        this.selectedTorpedoType = 'standard'; // 'standard', 'heavy', 'quantum', 'gravity'
        this.torpedoTypes = ['standard', 'heavy', 'quantum', 'gravity'];

        // Boost system
        this.boostActive = false;
        this.boostDuration = 2.0; // 2 seconds
        this.boostMultiplier = 2.0; // 2x speed
        this.boostCooldown = 10.0; // 10 seconds cooldown
        this.boostStartTime = 0;
        this.lastBoostTime = -this.boostCooldown; // Allow boost immediately
        this.boostDirection = null; // 'w', 'a', 's', 'd'

        // Throttle system (NEW - replaces hold-to-accelerate)
        this.throttle = 0;  // 0.0 to 1.0 (0% to 100% max speed)
        this.targetSpeed = 0;  // Speed ship is trying to reach based on throttle
        this.throttleBoost = {
            active: false,
            endTime: 0,
            duration: 3,  // 3 seconds
            amount: 50,   // +50 speed units
            rechargeDuration: 10  // 10 seconds
        };

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

        // Crew Skills System - affects ship performance
        this.crewSkills = new CrewSkillSystem(this);

        // Apply helm bonuses to movement stats (applied once at construction)
        const helmBonuses = this.crewSkills.getHelmBonuses();
        this.maxSpeed *= helmBonuses.speedMult;
        this.maxReverseSpeed *= helmBonuses.speedMult;
        this.acceleration *= helmBonuses.accelMult;
        this.deceleration *= helmBonuses.accelMult;
        this.reverseDeceleration *= helmBonuses.accelMult;
        this.turnRate *= helmBonuses.turnMult;

        // Consumables System - mission loadout items
        this.consumables = new ConsumableSystem(this);

        // Tractor Beam System - G key to pull targets
        this.tractorBeam = new TractorBeamSystem(this);

        // Transporter System - T key toggle for crew transport
        this.transporter = new TransporterSystem(this);
    }

    createWeapons() {
        const specs = getShipLoadoutSpecs(this.faction, this.shipClass);
        const weapons = [];
        const shipSize = this.getShipSize();

        for (const spec of specs) {
            const weapon = buildWeaponFromSpec(spec, shipSize);
            if (weapon) {
                weapons.push(weapon);
            }
        }

        return weapons;
    }

    createShields() {
        // Strike Cruiser shield configuration
        if (this.shipClass === 'CS' && (this.faction === 'PLAYER' || this.faction === 'FEDERATION')) {
            return new ShieldSystem({
                fore: {
                    strength: CONFIG.SHIELD_STRENGTH_FORE_CS,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                },
                aft: {
                    strength: CONFIG.SHIELD_STRENGTH_AFT_CS,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                },
                port: {
                    strength: CONFIG.SHIELD_STRENGTH_PORT_CS,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                },
                starboard: {
                    strength: CONFIG.SHIELD_STRENGTH_STARBOARD_CS,
                    generatorHP: CONFIG.SYSTEM_HP_SHIELD_GEN
                }
            });
        }

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
        // Get hull HP based on ship class
        const hullHP = this.getHullHPForClass(this.shipClass);

        // Player Heavy Cruiser system configuration
        if (this.shipClass === 'CA' && (this.faction === 'PLAYER' || this.faction === 'FEDERATION')) {
            return new SystemManager({
                impulseHP: CONFIG.SYSTEM_HP_IMPULSE,
                warpHP: CONFIG.SYSTEM_HP_WARP,
                sensorsHP: CONFIG.SYSTEM_HP_SENSORS,
                cncHP: CONFIG.SYSTEM_HP_CNC,
                bayHP: CONFIG.SYSTEM_HP_BAY,
                powerHP: CONFIG.SYSTEM_HP_MAIN_POWER,
                hullHP: hullHP,
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
                hullHP: hullHP,
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
            hullHP: hullHP,
            hasCloak: false
        });
    }

    getHullHPForClass(shipClass) {
        // Hull HP scaled similar to old ship HP values
        switch(shipClass) {
            case 'FG': return CONFIG.SHIP_HP_FG || 60;
            case 'DD': return CONFIG.SHIP_HP_DD || 80;
            case 'CL': return CONFIG.SHIP_HP_CL || 100;
            case 'CS': return CONFIG.SHIP_HP_CS || 110;
            case 'CA': return CONFIG.SHIP_HP_CA || 120;
            case 'BC': return CONFIG.SHIP_HP_BC || 140;
            case 'BB': return 160;
            case 'DN': return 180;
            case 'SD': return 200;
            default: return 100;
        }
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
            case 'CS': return CONFIG.SHIP_HP_CS;
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
            case 'CS': speed = CONFIG.MAX_SPEED_CS; break;
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
            case 'CS': return CONFIG.ACCELERATION_CS;
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
            case 'CS': rate = CONFIG.TURN_RATE_CS; break;
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
            case 'CS': return CONFIG.SHIP_LENGTH_CS;
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
        // Trigon Bird-of-Prey design (based on user-provided silhouette)
        // Central command section with forward-swept angular wings
        const vertices = [];

        // FRONT TIP (nose of the ship)
        vertices.push({ x: 0, y: -size * 0.9 });

        // RIGHT SIDE OF CENTRAL COMMAND SECTION
        // Bridge/command pod detail (small notch)
        vertices.push({ x: size * 0.15, y: -size * 0.75 });
        vertices.push({ x: size * 0.2, y: -size * 0.7 });
        vertices.push({ x: size * 0.15, y: -size * 0.65 });

        // Central body continues down
        vertices.push({ x: size * 0.25, y: -size * 0.5 });

        // RIGHT WING ROOT (connection point)
        vertices.push({ x: size * 0.3, y: -size * 0.3 });

        // RIGHT WING - FORWARD SWEPT (distinctive angular shape)
        // Wing sweeps forward and outward
        vertices.push({ x: size * 0.5, y: -size * 0.35 }); // Wing extends forward
        vertices.push({ x: size * 0.7, y: -size * 0.25 }); // Wing tip forward position

        // Wing outer edge (angular facets)
        vertices.push({ x: size * 0.85, y: -size * 0.1 }); // Outer wing tip
        vertices.push({ x: size * 0.9, y: size * 0.1 });    // Wing maximum extent

        // Wing trailing edge (sweeps back to body)
        vertices.push({ x: size * 0.8, y: size * 0.3 });
        vertices.push({ x: size * 0.6, y: size * 0.45 });
        vertices.push({ x: size * 0.4, y: size * 0.55 });

        // RIGHT SIDE CENTRAL BODY (aft section)
        vertices.push({ x: size * 0.3, y: size * 0.65 });
        vertices.push({ x: size * 0.2, y: size * 0.8 });

        // AFT SECTION (engine/rear of ship)
        vertices.push({ x: size * 0.15, y: size * 0.95 });
        vertices.push({ x: 0, y: size * 1.0 }); // Aft centerline point
        vertices.push({ x: -size * 0.15, y: size * 0.95 });

        // LEFT SIDE CENTRAL BODY (aft section) - MIRROR OF RIGHT
        vertices.push({ x: -size * 0.2, y: size * 0.8 });
        vertices.push({ x: -size * 0.3, y: size * 0.65 });

        // LEFT WING - FORWARD SWEPT (mirror of right)
        // Wing trailing edge
        vertices.push({ x: -size * 0.4, y: size * 0.55 });
        vertices.push({ x: -size * 0.6, y: size * 0.45 });
        vertices.push({ x: -size * 0.8, y: size * 0.3 });

        // Wing outer edge
        vertices.push({ x: -size * 0.9, y: size * 0.1 });
        vertices.push({ x: -size * 0.85, y: -size * 0.1 });

        // Wing leading edge (forward sweep)
        vertices.push({ x: -size * 0.7, y: -size * 0.25 });
        vertices.push({ x: -size * 0.5, y: -size * 0.35 });

        // LEFT WING ROOT
        vertices.push({ x: -size * 0.3, y: -size * 0.3 });

        // LEFT SIDE OF CENTRAL COMMAND SECTION
        vertices.push({ x: -size * 0.25, y: -size * 0.5 });

        // Bridge/command pod detail (mirror)
        vertices.push({ x: -size * 0.15, y: -size * 0.65 });
        vertices.push({ x: -size * 0.2, y: -size * 0.7 });
        vertices.push({ x: -size * 0.15, y: -size * 0.75 });

        return vertices;
    }

    generateWarbirdClass(size) {
        // Scintilian Warbird design (based on user-provided silhouette)
        // Circular command section with large downward-swept wings (anchor shape)
        const vertices = [];

        // CIRCULAR COMMAND HEAD (top section)
        const headRadius = size * 0.3;
        const headCenterY = -size * 0.6;

        // Draw circular head (top half prominent, bottom connects to neck)
        for (let i = 0; i <= 10; i++) {
            const angle = Math.PI * 0.2 + (i / 10) * Math.PI * 0.6; // 36° to 144° arc
            vertices.push({
                x: Math.cos(angle) * headRadius,
                y: headCenterY + Math.sin(angle) * headRadius
            });
        }

        // RIGHT SIDE OF NECK (narrow vertical section)
        vertices.push({ x: size * 0.08, y: -size * 0.4 });
        vertices.push({ x: size * 0.08, y: -size * 0.1 });

        // RIGHT WING ROOT (where wing connects to body)
        vertices.push({ x: size * 0.15, y: 0 });

        // RIGHT WING - DOWNWARD SWEPT (large, elegant curve)
        // Wing sweeps down and out, then curves back
        vertices.push({ x: size * 0.3, y: size * 0.15 });   // Wing starts curving out
        vertices.push({ x: size * 0.5, y: size * 0.35 });   // Wing mid section
        vertices.push({ x: size * 0.7, y: size * 0.6 });    // Wing extends outward
        vertices.push({ x: size * 0.85, y: size * 0.8 });   // Wing tip outer edge

        // Wing curves back toward center (trailing edge)
        vertices.push({ x: size * 0.75, y: size * 0.95 });  // Wing curves back
        vertices.push({ x: size * 0.5, y: size * 1.0 });    // Wing inner edge

        // CENTER AFT SECTION (bottom of body between wings)
        vertices.push({ x: size * 0.2, y: size * 0.85 });
        vertices.push({ x: 0, y: size * 0.75 });            // Center bottom point
        vertices.push({ x: -size * 0.2, y: size * 0.85 });

        // LEFT WING - DOWNWARD SWEPT (mirror of right)
        // Inner edge
        vertices.push({ x: -size * 0.5, y: size * 1.0 });
        vertices.push({ x: -size * 0.75, y: size * 0.95 });

        // Wing outer edge
        vertices.push({ x: -size * 0.85, y: size * 0.8 });
        vertices.push({ x: -size * 0.7, y: size * 0.6 });
        vertices.push({ x: -size * 0.5, y: size * 0.35 });
        vertices.push({ x: -size * 0.3, y: size * 0.15 });

        // LEFT WING ROOT
        vertices.push({ x: -size * 0.15, y: 0 });

        // LEFT SIDE OF NECK
        vertices.push({ x: -size * 0.08, y: -size * 0.1 });
        vertices.push({ x: -size * 0.08, y: -size * 0.4 });

        // Return to head (completes the circle on the left side)
        // The loop will automatically close back to the first vertex

        return vertices;
    }

    generateTholianClass(size) {
        // Pirate ship design (based on user-provided silhouette)
        // Cross-shaped with central pod, wide horizontal wings, and vertical stabilizers
        const vertices = [];

        // UPPER VERTICAL STABILIZER (weapon mount)
        vertices.push({ x: 0, y: -size * 0.9 });           // Top point
        vertices.push({ x: size * 0.12, y: -size * 0.7 }); // Right side of stabilizer
        vertices.push({ x: size * 0.12, y: -size * 0.3 }); // Connect to central pod

        // RIGHT HORIZONTAL WING
        // Upper wing edge
        vertices.push({ x: size * 0.2, y: -size * 0.25 }); // Wing root upper
        vertices.push({ x: size * 0.4, y: -size * 0.2 });  // Wing extends out
        vertices.push({ x: size * 0.7, y: -size * 0.15 }); // Wing mid section
        vertices.push({ x: size * 0.9, y: -size * 0.1 });  // Wing tip leading edge

        // Right wing tip (rounded)
        vertices.push({ x: size * 0.95, y: 0 });           // Wing tip point

        // Lower wing edge
        vertices.push({ x: size * 0.9, y: size * 0.1 });   // Wing tip trailing edge
        vertices.push({ x: size * 0.7, y: size * 0.15 });  // Wing trailing mid
        vertices.push({ x: size * 0.4, y: size * 0.2 });   // Wing trailing inner
        vertices.push({ x: size * 0.2, y: size * 0.25 });  // Wing root lower

        // CENTRAL POD - RIGHT SIDE (circular section)
        vertices.push({ x: size * 0.15, y: size * 0.3 });  // Pod right upper

        // RIGHT SIDE OF LOWER STABILIZER
        vertices.push({ x: size * 0.12, y: size * 0.35 }); // Connect to lower stabilizer
        vertices.push({ x: size * 0.12, y: size * 0.7 });  // Lower stabilizer right

        // LOWER VERTICAL STABILIZER (weapon mount)
        vertices.push({ x: 0, y: size * 0.9 });            // Bottom point

        // LEFT SIDE OF LOWER STABILIZER
        vertices.push({ x: -size * 0.12, y: size * 0.7 }); // Lower stabilizer left
        vertices.push({ x: -size * 0.12, y: size * 0.35 });

        // CENTRAL POD - LEFT SIDE
        vertices.push({ x: -size * 0.15, y: size * 0.3 }); // Pod left lower

        // LEFT HORIZONTAL WING
        // Lower wing edge (mirror of right)
        vertices.push({ x: -size * 0.2, y: size * 0.25 });
        vertices.push({ x: -size * 0.4, y: size * 0.2 });
        vertices.push({ x: -size * 0.7, y: size * 0.15 });
        vertices.push({ x: -size * 0.9, y: size * 0.1 });

        // Left wing tip
        vertices.push({ x: -size * 0.95, y: 0 });

        // Upper wing edge
        vertices.push({ x: -size * 0.9, y: -size * 0.1 });
        vertices.push({ x: -size * 0.7, y: -size * 0.15 });
        vertices.push({ x: -size * 0.4, y: -size * 0.2 });
        vertices.push({ x: -size * 0.2, y: -size * 0.25 });

        // Connect back to upper stabilizer
        vertices.push({ x: -size * 0.12, y: -size * 0.3 });
        vertices.push({ x: -size * 0.12, y: -size * 0.7 });

        return vertices;
    }

    generateWeaponPoints() {
        const size = this.getShipSize();
        const points = {
            forwardBeamBand: null,
            aftBeamPoint: null,
            portBeamPoint: null,
            starboardBeamPoint: null,
            dualTorpedoPoint: null // Federation ships use dual mount launchers
        };

        if (this.faction === 'PLAYER' || this.faction === 'FEDERATION') {
            // Strike Cruiser (CS) has port/starboard streak beams instead of forward beam band
            if (this.shipClass === 'CS') {
                // Port beam (left side)
                points.portBeamPoint = {
                    type: 'point',
                    x: -40,
                    y: 33
                };

                // Starboard beam (right side)
                points.starboardBeamPoint = {
                    type: 'point',
                    x: 40,
                    y: 33
                };
            } else {
                // Other Federation ships (CA, BC, etc.) use forward/aft beam configuration
                const saucerRadius = size * 0.5; // Smaller radius to fit inside saucer
                const saucerCenterY = -size * 0.30; // Centered in saucer, moved down to match WEAPON_POSITIONS forwardCenter

                // Forward beam battery band (270° circular arc on saucer)
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
                    y: size * 0.90, // Position at rear of engineering hull
                    width: size * 0.3, // Width perpendicular to ship axis
                    height: size * 0.08, // Height along ship axis
                    rotation: 0 // Perpendicular to long axis (horizontal)
                };
            }

            // Dual torpedo launcher (all Federation ships)
            points.dualTorpedoPoint = {
                type: 'point',
                x: 0,
                y: -20 // Dual torpedo launcher position
            };
        }
        // Add weapon points for other factions as needed

        return points;
    }

    thrust(direction, deltaTime) {
        // direction: 1 = forward, -1 = backward (reverse)
        // Apply boost multiplier if active
        const boostMultiplier = this.getBoostMultiplier();
        const effectiveAcceleration = this.acceleration * boostMultiplier;
        const effectiveMaxSpeed = this.maxSpeed * boostMultiplier;
        const effectiveMaxReverseSpeed = this.maxReverseSpeed * boostMultiplier;

        if (direction > 0) {
            // W key - accelerate forward
            this.currentSpeed += effectiveAcceleration * deltaTime;
            this.currentSpeed = Math.min(this.currentSpeed, effectiveMaxSpeed);
        } else if (direction < 0) {
            // S key - decelerate quickly, then reverse
            if (this.currentSpeed > 1.0) {
                // Currently moving forward - apply quick deceleration
                this.currentSpeed -= this.reverseDeceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, 0);
            } else if (this.currentSpeed >= -0.1 && this.currentSpeed <= 1.0) {
                // Near zero - accelerate backward gradually
                this.currentSpeed -= effectiveAcceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, -effectiveMaxReverseSpeed);
            } else {
                // Already reversing - continue accelerating backward
                this.currentSpeed -= effectiveAcceleration * deltaTime;
                this.currentSpeed = Math.max(this.currentSpeed, -effectiveMaxReverseSpeed);
            }
        }

        // Apply velocity based on current speed and facing direction
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
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
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
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

        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
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
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            // Zero out angular velocity
            this.physicsComponent.body.setAngularVelocity(0);
        }
        // No action needed for non-physics mode (rotation handled directly)
    }

    /**
     * Update throttle system - ship maintains speed based on throttle setting
     * Called every frame from update()
     */
    updateThrottle(deltaTime) {
        // Calculate target speed from throttle (0.0 to 1.0)
        this.targetSpeed = this.maxSpeed * this.throttle;

        // Add boost if active
        const currentTime = performance.now() / 1000;
        if (this.throttleBoost.active && currentTime < this.throttleBoost.endTime) {
            this.targetSpeed += this.throttleBoost.amount;
        } else if (this.throttleBoost.active) {
            this.throttleBoost.active = false; // Boost expired
        }

        // Accelerate/decelerate toward target speed
        const currentSpeed = Math.abs(this.currentSpeed);
        const speedDiff = this.targetSpeed - currentSpeed;

        if (Math.abs(speedDiff) > 1) { // Only adjust if difference is significant
            if (speedDiff > 0) {
                // Accelerate toward target
                const accel = this.acceleration * deltaTime;
                this.currentSpeed += accel;
                this.currentSpeed = Math.min(this.currentSpeed, this.targetSpeed);
            } else {
                // Decelerate toward target
                const decel = this.deceleration * deltaTime;
                this.currentSpeed -= decel;
                this.currentSpeed = Math.max(this.currentSpeed, this.targetSpeed);
            }

            // Apply velocity based on current speed and facing direction
            if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
                const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
                this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
            } else {
                this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
            }
        }
    }

    /**
     * Emergency stop - rapidly decelerate to zero and boost shields
     */
    emergencyStop() {
        const currentTime = performance.now() / 1000;

        // Set throttle to zero
        this.throttle = 0;
        this.targetSpeed = 0;

        // Rapid deceleration (90% speed reduction)
        this.currentSpeed *= 0.1;

        // Apply velocity
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            const vec = MathUtils.vectorFromAngle(this.rotation, this.currentSpeed);
            this.physicsComponent.body.setLinearVelocity(planck.Vec2(vec.x, vec.y));
        } else {
            this.transform.setVelocityFromAngle(this.rotation, this.currentSpeed);
        }

        // Shield boost for 7 seconds
        if (this.shields) {
            this.shields.applyEmergencyBoost(currentTime, 7);
        }

        eventBus.emit('emergency-stop', { ship: this });
    }

    update(deltaTime) {
        if (this.physicsComponent && !CONFIG.DISABLE_PHYSICS) {
            // Sync position from physics (only if physics is enabled)
            this.physicsComponent.syncToEntity();
            // Note: currentSpeed is maintained independently via thrust/deceleration/turn methods
            // We don't sync it from physics to avoid direction flip bugs when turning
        } else {
            // Fallback to non-physics movement (or when physics disabled)
            this.transform.updatePosition(deltaTime);
        }

        const currentTime = performance.now() / 1000;

        // Update throttle system (NEW - maintains speed automatically)
        this.updateThrottle(deltaTime);

        // Update boost system
        this.updateBoost(deltaTime, currentTime);

        // Update consumables (for active effect timers)
        if (this.consumables) {
            this.consumables.update(currentTime);
        }

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
            const systemEvent = this.systems.update(deltaTime, currentTime, this);
            if (systemEvent) {
                if (systemEvent.type === 'core-breach') {
                    // Core breach destroys hull
                    this.systems.hull.hp = 0;
                    this.systems.hull.updateStatus();
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

        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
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
                        // Apply consumable damage multiplier (energy cells)
                        if (this.consumables) {
                            projectile.damage *= this.consumables.getDamageMultiplier();
                        }
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Fire continuous beam weapons at target
     * Called continuously while LMB is held
     */
    fireContinuousBeams(targetX, targetY, currentTime) {
        if (!this.canFireWeapons()) return [];

        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
        }

        const projectiles = [];
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all continuous beam weapons that are currently firing and in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof ContinuousBeam && weapon.isFiring) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime);
                    if (projectile) {
                        // Apply consumable damage multiplier (energy cells)
                        if (this.consumables) {
                            projectile.damage *= this.consumables.getDamageMultiplier();
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
            return [];
        }

        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
        }

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all torpedo/plasma launchers that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof TorpedoLauncher || weapon instanceof DualTorpedoLauncher || weapon instanceof PlasmaTorpedo) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime, lockOnTarget);
                    if (projectile) {
                        // Apply consumable damage multiplier (energy cells)
                        if (this.consumables) {
                            projectile.damage *= this.consumables.getDamageMultiplier();
                        }
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
        // Apply nebula accuracy penalty if inside nebula
        if (this.inNebula && this.currentNebula) {
            const penalty = CONFIG.NEBULA_ACCURACY_PENALTY;
            targetX += (Math.random() - 0.5) * penalty * 2; // ±penalty pixels
            targetY += (Math.random() - 0.5) * penalty * 2;
        }

        if (!this.canFireWeapons()) {
            if (CONFIG.DEBUG_MODE && this.isPlayer) {
                console.log('Cannot fire weapons - weapons disabled');
            }
            return [];
        }

        // Apply consumable damage multiplier to charge damage
        if (this.consumables) {
            chargeDamage *= this.consumables.getDamageMultiplier();
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
     * Deploy mine (with variant types)
     * @param {string} mineType - 'standard', 'captor', 'phaser', or 'transporter'
     */
    deployMine(mineType = 'standard') {
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
        if (currentTime - this.lastDeploymentTime < CONFIG.DEPLOYMENT_COOLDOWN) return null;

        let mine = null;

        switch (mineType) {
            case 'captor':
                if (this.captorMines <= 0) return null;
                this.captorMines--;
                mine = new CaptorMine({
                    x: this.x,
                    y: this.y,
                    owner: this,
                    captureRange: 30,
                    captureDuration: 5.0
                });
                eventBus.emit('captor-mine-deployed', { ship: this });
                break;

            case 'phaser':
                if (this.phaserMines <= 0) return null;
                this.phaserMines--;
                mine = new PhaserMine({
                    x: this.x,
                    y: this.y,
                    owner: this,
                    phaserRange: 150,
                    phaserDamage: 1,
                    phaserCooldown: 2.0
                });
                eventBus.emit('phaser-mine-deployed', { ship: this });
                break;

            case 'transporter':
                if (this.transporterMines <= 0) return null;
                this.transporterMines--;
                mine = new TransporterMine({
                    x: this.x,
                    y: this.y,
                    owner: this,
                    transportRange: 40,
                    transportDuration: 3.0
                });
                eventBus.emit('transporter-mine-deployed', { ship: this });
                break;

            case 'standard':
            default:
                if (this.mines <= 0) return null;
                this.mines--;
                mine = new Mine(this.x, this.y, this);
                eventBus.emit('mine-deployed', { ship: this });
                break;
        }

        if (mine) {
            this.lastDeploymentTime = currentTime;
        }

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
        return this.weapons.filter(w => w instanceof TorpedoLauncher || w instanceof DualTorpedoLauncher || w instanceof PlasmaTorpedo);
    }

    /**
     * Cycle torpedo type selection
     */
    cycleTorpedoType() {
        const currentIndex = this.torpedoTypes.indexOf(this.selectedTorpedoType);
        const nextIndex = (currentIndex + 1) % this.torpedoTypes.length;
        this.selectedTorpedoType = this.torpedoTypes[nextIndex];

        eventBus.emit('torpedo-type-changed', {
            ship: this,
            torpedoType: this.selectedTorpedoType
        });

        return this.selectedTorpedoType;
    }

    /**
     * Deploy interceptor missile
     */
    deployInterceptor() {
        const currentTime = performance.now() / 1000;

        if (this.interceptors <= 0) return null;
        if (currentTime - this.lastDeploymentTime < CONFIG.DEPLOYMENT_COOLDOWN) return null;

        this.interceptors--;
        this.lastDeploymentTime = currentTime;

        // Get ship size for proper offset
        const shipSize = this.getShipSize();
        const offset = shipSize * 0.75;
        const worldRad = MathUtils.toRadians(this.rotation);

        // Create interceptor at ship position (forward offset)
        const interceptor = new InterceptorMissile({
            x: this.x + Math.sin(worldRad) * offset,
            y: this.y - Math.cos(worldRad) * offset,
            rotation: this.rotation,
            sourceShip: this,
            interceptRange: 200,
            speed: 300,
            lifetime: 15.0
        });

        eventBus.emit('interceptor-deployed', { ship: this });

        return interceptor;
    }

    /**
     * Activate boost
     */
    activateBoost(direction) {
        const currentTime = performance.now() / 1000;

        // Check if boost is on cooldown
        if (currentTime - this.lastBoostTime < this.boostCooldown) {
            const remainingCooldown = this.boostCooldown - (currentTime - this.lastBoostTime);
            console.log(`Boost on cooldown: ${remainingCooldown.toFixed(1)}s remaining`);
            return false;
        }

        // Check if systems are operational
        if (!this.systems || this.systems.power.hp <= 0) {
            console.log('Boost unavailable: Power system damaged');
            return false;
        }

        // Activate boost
        this.boostActive = true;
        this.boostStartTime = currentTime;
        this.boostDirection = direction;

        eventBus.emit('boost-started', { ship: this, direction: direction });
        console.log(`Boost activated! Direction: ${direction.toUpperCase()}`);

        return true;
    }

    /**
     * Update boost system
     */
    updateBoost(deltaTime, currentTime) {
        if (!this.boostActive) return;

        // Drain shields while boost is active (1 HP per second from all quadrants)
        if (this.shields) {
            const drainAmount = 1.0 * deltaTime; // 1 HP per second
            const quadrants = this.shields.getAllQuadrants();

            for (const quadrantName of ['fore', 'aft', 'port', 'starboard']) {
                const quadrant = quadrants[quadrantName];
                quadrant.current = Math.max(0, quadrant.current - drainAmount);

                // If any quadrant hits 0, deactivate boost
                if (quadrant.current <= 0) {
                    console.log(`Boost deactivated: ${quadrantName} shield depleted`);
                    this.deactivateBoost();
                    return;
                }
            }
        }

        // Check if boost duration has expired
        const boostElapsed = currentTime - this.boostStartTime;
        if (boostElapsed >= this.boostDuration) {
            this.deactivateBoost();
        }
    }

    /**
     * Deactivate boost
     */
    deactivateBoost() {
        if (!this.boostActive) return;

        const currentTime = performance.now() / 1000;
        this.boostActive = false;
        this.lastBoostTime = currentTime;
        this.boostDirection = null;

        eventBus.emit('boost-ended', { ship: this });
        console.log('Boost deactivated');
    }

    /**
     * Get boost multiplier for current movement
     */
    getBoostMultiplier() {
        return this.boostActive ? this.boostMultiplier : 1.0;
    }

    /**
     * Check if boost is available
     */
    canBoost() {
        const currentTime = performance.now() / 1000;
        return (currentTime - this.lastBoostTime >= this.boostCooldown) &&
               this.systems && this.systems.power.hp > 0;
    }

    /**
     * Get boost cooldown remaining
     */
    getBoostCooldownRemaining() {
        const currentTime = performance.now() / 1000;
        const remaining = this.boostCooldown - (currentTime - this.lastBoostTime);
        return Math.max(0, remaining);
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
     * Take damage (collision damage only - projectile damage handled in Engine.js)
     */
    takeDamage(damage, contactPoint) {
        let remainingDamage = damage;
        const currentTime = performance.now() / 1000;

        // Notify cloaking device if hit while cloaked
        if (this.systems && this.systems.cloak) {
            this.systems.cloak.onHit(currentTime);
        }

        // Calculate impact angle if contact point provided
        // NO SHIELDS while cloaked or in nebula!
        if (contactPoint && this.shields && !this.isCloaked() && !this.inNebula) {
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

        // Apply remaining damage to hull (collisions don't damage systems)
        if (remainingDamage > 0 && this.systems && this.systems.hull) {
            this.systems.hull.takeDamage(remainingDamage);

            // Add damage flash effect for ALL ships (not just player)
            this.damageFlashAlpha = 0.8;

            if (this.isPlayer) {
                eventBus.emit('player-damage', {
                    damage: remainingDamage,
                    hp: this.systems.hull.hp,
                    point: contactPoint
                });
            }
        }

        // Check if hull destroyed
        if (this.systems && this.systems.hull && this.systems.hull.destroyed) {
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





