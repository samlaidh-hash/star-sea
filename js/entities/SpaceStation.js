/**
 * Star Sea - Space Station Entity
 * Static defensive structure with weapons
 */

// Space station weapon loadouts by faction
const STATION_WEAPON_LOADOUTS = {
    FEDERATION: [
        // Forward weapons
        { type: 'beam', name: 'Forward Beam Array', arc: 270, arcCenter: 0, position: { x: 0, y: -100 }, hp: 8 },
        { type: 'torpedo', name: 'Forward Torpedo Bay', arc: 90, arcCenter: 0, position: { x: 0, y: -90 }, hp: 8, loaded: 6, maxLoaded: 6, stored: 60 },
        // Aft weapons
        { type: 'beam', name: 'Aft Beam Array', arc: 270, arcCenter: 180, position: { x: 0, y: 100 }, hp: 8 },
        { type: 'torpedo', name: 'Aft Torpedo Bay', arc: 90, arcCenter: 180, position: { x: 0, y: 90 }, hp: 8, loaded: 6, maxLoaded: 6, stored: 60 }
    ],
    TRIGON: [
        // Forward disruptors (180° coverage each)
        { type: 'disruptor', name: 'Forward Port Disruptor', arc: 180, arcCenter: 0, position: { x: -40, y: -80 }, hp: 8 },
        { type: 'disruptor', name: 'Forward Starboard Disruptor', arc: 180, arcCenter: 0, position: { x: 40, y: -80 }, hp: 8 },
        // Aft disruptors (180° coverage each)
        { type: 'disruptor', name: 'Aft Port Disruptor', arc: 180, arcCenter: 180, position: { x: -40, y: 80 }, hp: 8 },
        { type: 'disruptor', name: 'Aft Starboard Disruptor', arc: 180, arcCenter: 180, position: { x: 40, y: 80 }, hp: 8 }
    ],
    SCINTILIAN: [
        // 360° pulse beams
        { type: 'pulseBeam', name: 'Port Pulse Beam', arc: 360, arcCenter: 0, position: { x: -80, y: 0 }, hp: 8, cooldown: 0.5, damage: 0.5 },
        { type: 'pulseBeam', name: 'Starboard Pulse Beam', arc: 360, arcCenter: 0, position: { x: 80, y: 0 }, hp: 8, cooldown: 0.5, damage: 0.5 },
        { type: 'pulseBeam', name: 'Dorsal Pulse Beam', arc: 360, arcCenter: 0, position: { x: 0, y: -80 }, hp: 8, cooldown: 0.5, damage: 0.5 },
        // 360° plasma torpedo
        { type: 'plasma', name: 'Plasma Torpedo Bay', arc: 360, arcCenter: 0, position: { x: 0, y: 0 }, hp: 8, loaded: 6, maxLoaded: 6, stored: 60 }
    ],
    PIRATE: [
        // Forward mount (mixed weapons)
        { type: 'beam', name: 'Salvaged Forward Beam', arc: 270, arcCenter: 0, position: { x: 0, y: -90 }, hp: 6 },
        { type: 'disruptor', name: 'Stolen Disruptor Cannon', arc: 120, arcCenter: 0, position: { x: 40, y: -80 }, hp: 6 },
        // Aft mount (mixed weapons)
        { type: 'torpedo', name: 'Contraband Torpedo Rack', arc: 90, arcCenter: 180, position: { x: 0, y: 90 }, hp: 6, loaded: 4, maxLoaded: 4, stored: 40 },
        { type: 'pulseBeam', name: 'Black Market Pulse Beam', arc: 270, arcCenter: 180, position: { x: -40, y: 80 }, hp: 6, cooldown: 0.6, damage: 0.6 }
    ],
    NEUTRAL: [
        // Minimal defensive weapons
        { type: 'beam', name: 'Point Defense Beam', arc: 360, arcCenter: 0, position: { x: 0, y: -80 }, hp: 4 }
    ]
};

// Weapon builder functions
const STATION_WEAPON_BUILDERS = {
    beam: spec => new BeamWeapon(spec),
    pulseBeam: spec => new PulseBeam(spec),
    torpedo: spec => new TorpedoLauncher(spec),
    plasma: spec => new PlasmaTorpedo(spec),
    disruptor: spec => new Disruptor(spec)
};

function buildStationWeaponFromSpec(spec) {
    const builder = STATION_WEAPON_BUILDERS[spec.type];
    if (!builder) {
        console.warn(`Unknown weapon type for station: ${spec.type}`);
        return null;
    }

    const { type, position, ...rest } = spec;
    const config = { ...rest };

    // Clone position to avoid reference issues
    if (position) {
        config.position = { x: position.x, y: position.y };
    }

    return builder(config);
}

class SpaceStation extends Entity {
    constructor({ id, x, y, hp = 300, radius = 120, faction = 'NEUTRAL', hostile = false, name = 'Space Station', rotation = 0 }) {
        super(x, y);
        this.id = id || null;
        this.type = 'space-station';
        this.hp = hp;
        this.maxHp = hp;
        this.radius = radius;
        this.faction = faction;
        this.hostile = hostile;
        this.name = name;
        this.active = true;
        this.rotation = rotation; // Fixed rotation (stations don't turn)

        // Weapon system
        this.weapons = this.createWeapons();
        this.fireInterval = 2.0; // Fire every 2 seconds
        this.lastFireTime = 0;
        this.detectionRange = 400; // Detection range for targeting
        this.currentTarget = null;
    }

    createWeapons() {
        const factionKey = this.faction.toUpperCase();
        const loadoutSpecs = STATION_WEAPON_LOADOUTS[factionKey] || STATION_WEAPON_LOADOUTS.NEUTRAL;

        const weapons = [];
        for (const spec of loadoutSpecs) {
            const weapon = buildStationWeaponFromSpec(spec);
            if (weapon) {
                weapons.push(weapon);
            }
        }

        return weapons;
    }

    /**
     * Get beam weapons
     */
    getBeamWeapons() {
        return this.weapons.filter(w => w instanceof BeamWeapon || w instanceof PulseBeam || w instanceof Disruptor);
    }

    /**
     * Get torpedo launchers
     */
    getTorpedoLaunchers() {
        return this.weapons.filter(w => w instanceof TorpedoLauncher || w instanceof PlasmaTorpedo);
    }

    /**
     * Update station (weapon recharge, targeting, firing)
     */
    update(deltaTime, entities = []) {
        if (!this.active || !this.hostile) return;

        const currentTime = performance.now() / 1000;

        // Update all weapons (recharge/reload)
        for (const weapon of this.weapons) {
            weapon.update(deltaTime, currentTime);
        }

        // Update target selection
        this.updateTarget(entities);

        // Fire at target if available
        if (this.currentTarget && currentTime - this.lastFireTime >= this.fireInterval) {
            this.fireAtTarget(this.currentTarget, currentTime);
            this.lastFireTime = currentTime;
        }
    }

    /**
     * Update current target (find nearest hostile in range)
     */
    updateTarget(entities) {
        if (!entities || entities.length === 0) {
            this.currentTarget = null;
            return;
        }

        // Find all hostile ships in range
        const hostiles = entities.filter(entity => {
            if (entity === this || !entity.active) return false;
            if (entity.type !== 'ship') return false;

            // Check if hostile based on faction
            const isHostile = this.isHostileTo(entity);
            if (!isHostile) return false;

            // Check range
            const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
            return distance <= this.detectionRange;
        });

        if (hostiles.length === 0) {
            this.currentTarget = null;
            return;
        }

        // Target nearest hostile
        let nearest = hostiles[0];
        let nearestDist = MathUtils.distance(this.x, this.y, nearest.x, nearest.y);

        for (let i = 1; i < hostiles.length; i++) {
            const dist = MathUtils.distance(this.x, this.y, hostiles[i].x, hostiles[i].y);
            if (dist < nearestDist) {
                nearest = hostiles[i];
                nearestDist = dist;
            }
        }

        this.currentTarget = nearest;
    }

    /**
     * Check if entity is hostile to this station
     */
    isHostileTo(entity) {
        if (!entity.faction) return false;

        // Player is hostile to pirate stations
        if (this.faction === 'PIRATE' && (entity.faction === 'PLAYER' || entity.faction === 'FEDERATION')) {
            return true;
        }

        // Federation stations hostile to pirates, Trigon, Scintilian
        if (this.faction === 'FEDERATION' || this.faction === 'PLAYER') {
            return entity.faction === 'PIRATE' || entity.faction === 'TRIGON' || entity.faction === 'SCINTILIAN';
        }

        // Trigon stations hostile to Federation and player
        if (this.faction === 'TRIGON') {
            return entity.faction === 'PLAYER' || entity.faction === 'FEDERATION';
        }

        // Scintilian stations hostile to Federation and player
        if (this.faction === 'SCINTILIAN') {
            return entity.faction === 'PLAYER' || entity.faction === 'FEDERATION';
        }

        return false;
    }

    /**
     * Fire weapons at target
     */
    fireAtTarget(target, currentTime) {
        if (!target || !target.active) return;

        // Fire beam weapons
        const beamProjectiles = this.fireBeams(target.x, target.y, currentTime);
        if (beamProjectiles.length > 0 && typeof eventBus !== 'undefined') {
            eventBus.emit('ai-fired-beams', {
                ship: this,
                projectiles: beamProjectiles
            });
        }

        // Fire torpedoes (less frequently - only if ready)
        if (Math.random() < 0.3) { // 30% chance to fire torpedoes
            const torpedoProjectiles = this.fireTorpedoes(target.x, target.y, target, currentTime);
            if (torpedoProjectiles.length > 0 && typeof eventBus !== 'undefined') {
                eventBus.emit('ai-fired-torpedoes', {
                    ship: this,
                    projectiles: torpedoProjectiles
                });
            }
        }
    }

    /**
     * Fire beam weapons at target
     */
    fireBeams(targetX, targetY, currentTime) {
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all beam weapons that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof BeamWeapon || weapon instanceof Disruptor || weapon instanceof PulseBeam) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime);
                    if (projectile) {
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
    fireTorpedoes(targetX, targetY, lockOnTarget, currentTime) {
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

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
     * Take damage
     */
    takeDamage(dmg, contactPoint) {
        this.hp = Math.max(0, this.hp - (dmg || 0));

        if (this.hp <= 0) {
            this.destroy();
        }
    }

    /**
     * Destroy station
     */
    destroy() {
        super.destroy();

        // Emit station destroyed event for mission tracking
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('station-destroyed', {
                station: this,
                faction: this.faction
            });
        }
    }

    /**
     * Render station
     */
    render(ctx, camera) {
        // Note: Camera transform already applied, use world coords directly
        ctx.save();

        // Main station body
        ctx.fillStyle = this.getFactionColor();
        ctx.strokeStyle = this.hp > 0 ? '#8888aa' : '#444444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Weapon hardpoints (visual indicators)
        if (this.hp > 0 && this.weapons) {
            ctx.fillStyle = '#00ffff';
            for (const weapon of this.weapons) {
                if (weapon.position && weapon.hp > 0) {
                    const rad = MathUtils.toRadians(this.rotation);
                    const cos = Math.cos(rad);
                    const sin = Math.sin(rad);

                    // Rotate weapon position
                    const rx = weapon.position.x * cos - weapon.position.y * sin;
                    const ry = weapon.position.x * sin + weapon.position.y * cos;

                    ctx.beginPath();
                    ctx.arc(this.x + rx, this.y + ry, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // HP bar above station
        if (this.hp < this.maxHp) {
            const barWidth = this.radius * 2;
            const barHeight = 8;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.radius - 20;

            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // HP fill
            const hpPercent = this.hp / this.maxHp;
            ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
            ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

            // Border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }

        ctx.restore();
    }

    /**
     * Get faction color
     */
    getFactionColor() {
        switch (this.faction) {
            case 'FEDERATION':
            case 'PLAYER':
                return '#4466cc';
            case 'TRIGON':
                return '#cc4444';
            case 'SCINTILIAN':
                return '#44cc44';
            case 'PIRATE':
                return '#cc8844';
            default:
                return '#444466';
        }
    }
}
