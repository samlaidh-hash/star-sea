/**
 * Star Sea - Internal Systems Component
 * Ship subsystems with damage effects
 */

class InternalSystem {
    constructor(config) {
        this.name = config.name;
        this.hp = config.hp;
        this.maxHp = config.hp;
        this.position = config.position || { x: 0, y: 0 }; // Relative to ship center
        this.critical = config.critical || false; // Ship destroyed if system destroyed
        this.damaged = false; // HP <= 30%
        this.destroyed = false; // HP = 0
    }

    takeDamage(damage) {
        const actualDamage = Math.min(damage, this.hp);
        this.hp -= actualDamage;

        this.updateStatus();

        return damage - actualDamage; // Return overflow
    }

    repair(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.updateStatus();
    }

    /**
     * Auto-repair system (0.03 HP/sec until system reaches 0 HP, then stops)
     * Enhanced by Engineering crew skill
     */
    update(deltaTime, currentTime, ship) {
        // Auto-repair at 0.03 HP/sec if HP > 0 (enhanced by engineering skill)
        if (this.hp > 0 && this.hp < this.maxHp) {
            let repairRate = CONFIG.AUTO_REPAIR_RATE;

            // Apply engineering crew skill bonus
            if (ship && ship.crewSkills) {
                const bonuses = ship.crewSkills.getEngineeringBonuses();
                repairRate *= bonuses.repairMult;
            }

            this.repair(repairRate * deltaTime);
        }
    }

    updateStatus() {
        this.destroyed = this.hp <= 0;
        this.damaged = this.hp > 0 && this.hp <= this.maxHp * 0.3;
    }

    getEfficiency() {
        if (this.destroyed) return 0;
        return this.hp / this.maxHp;
    }

    isOperational() {
        return this.hp > 0;
    }
}

class ImpulseEngines extends InternalSystem {
    constructor(hp = CONFIG.SYSTEM_HP_IMPULSE) {
        super({
            name: 'Impulse Engines',
            hp: hp,
            position: { x: 0, y: 30 } // Aft section
        });
    }

    /**
     * Get speed multiplier based on damage
     * 100% HP = 1.0x speed
     * 50% HP = 0.5x speed
     * 0% HP = 0.1x speed (emergency thrusters)
     */
    getSpeedMultiplier() {
        if (this.destroyed) {
            return 0.1; // Emergency thrusters only
        }
        return Math.max(0.3, this.getEfficiency());
    }

    /**
     * Get turn rate multiplier
     */
    getTurnRateMultiplier() {
        if (this.destroyed) {
            return 0.2; // RCS thrusters only
        }
        return Math.max(0.4, this.getEfficiency());
    }
}

class WarpNacelles extends InternalSystem {
    constructor(hp = CONFIG.SYSTEM_HP_WARP) {
        super({
            name: 'Warp Nacelles',
            hp: hp,
            position: { x: 0, y: 0 } // Mid section
        });
        this.warpCharge = 0; // 0-100
        this.charging = false;
    }

    /**
     * Update warp charge (called each frame)
     */
    update(deltaTime) {
        // Call parent auto-repair
        super.update(deltaTime);

        if (this.destroyed) {
            this.charging = false;
            this.warpCharge = 0;
            return;
        }

        if (this.charging) {
            // Charge rate affected by damage
            const chargeRate = CONFIG.WARP_CHARGE_RATE * this.getEfficiency();
            this.warpCharge = Math.min(100, this.warpCharge + chargeRate * deltaTime);
        }
    }

    startCharging() {
        if (this.isOperational()) {
            this.charging = true;
        }
    }

    stopCharging() {
        this.charging = false;
    }

    canWarp() {
        return this.isOperational() && this.warpCharge >= 100;
    }

    consumeWarp() {
        this.warpCharge = 0;
        this.charging = false;
    }
}

class SensorArray extends InternalSystem {
    constructor(hp = CONFIG.SYSTEM_HP_SENSORS) {
        super({
            name: 'Sensor Array',
            hp: hp,
            position: { x: 0, y: -20 } // Fore section
        });
    }

    /**
     * Get detection radius multiplier
     * 100% HP = 1.0x range
     * 0% HP = 0.2x range (visual only)
     */
    getDetectionMultiplier() {
        if (this.destroyed) {
            return 0.2; // Visual range only
        }
        return Math.max(0.5, this.getEfficiency());
    }

    /**
     * Get targeting accuracy multiplier
     */
    getTargetingAccuracy() {
        if (this.destroyed) {
            return 0.5; // 50% accuracy
        }
        return Math.max(0.7, this.getEfficiency());
    }

    /**
     * Can lock on to targets
     */
    canLockOn() {
        return this.hp > this.maxHp * 0.3; // Need >30% HP to lock
    }
}

class CommandAndControl extends InternalSystem {
    constructor(hp = CONFIG.SYSTEM_HP_CNC) {
        super({
            name: 'Command & Control',
            hp: hp,
            position: { x: 0, y: -10 } // Forward section
        });
        this.lastGlitchTime = 0;
    }

    /**
     * Check if control glitch occurs
     * Damaged C&C causes random input failures
     */
    checkControlGlitch(currentTime) {
        if (!this.damaged && !this.destroyed) return false;

        // 10% chance per second when damaged, 30% when critical
        const glitchChance = this.destroyed ? 0.5 : (this.damaged ? 0.3 : 0);
        const timeSinceLastGlitch = currentTime - this.lastGlitchTime;

        if (timeSinceLastGlitch > 1000 && Math.random() < glitchChance) {
            this.lastGlitchTime = currentTime;
            return true;
        }

        return false;
    }

    /**
     * Get weapon accuracy multiplier
     */
    getWeaponAccuracy() {
        if (this.destroyed) {
            return 0.5;
        }
        return Math.max(0.7, this.getEfficiency());
    }
}

class WeaponsBay extends InternalSystem {
    constructor(hp = CONFIG.SYSTEM_HP_BAY) {
        super({
            name: 'Weapons Bay',
            hp: hp,
            position: { x: 0, y: 10 } // Mid-aft section
        });
    }

    /**
     * Can deploy countermeasures
     */
    canDeployCountermeasures() {
        return this.hp > 0;
    }

    /**
     * Get reload rate multiplier for torpedoes
     */
    getReloadMultiplier() {
        if (this.destroyed) {
            return 0; // Can't reload
        }
        return Math.max(0.5, this.getEfficiency());
    }
}

class MainPower extends InternalSystem {
    constructor(hp = CONFIG.SYSTEM_HP_POWER) {
        super({
            name: 'Main Power',
            hp: hp,
            position: { x: 0, y: 0 }, // Center of ship
            critical: true // Ship destroyed if this is destroyed
        });
    }

    /**
     * Get power output multiplier
     * Affects all systems
     */
    getPowerOutput() {
        if (this.destroyed) {
            return 0; // Core breach
        }
        return Math.max(0.3, this.getEfficiency());
    }

    /**
     * Check if core breach occurs when taking damage
     */
    checkCoreBreach() {
        if (this.destroyed) {
            return true;
        }

        // Small chance of breach when critically damaged
        if (this.damaged && Math.random() < 0.05) {
            return true;
        }

        return false;
    }
}

class Hull extends InternalSystem {
    constructor(hp) {
        super({
            name: 'Hull',
            hp: hp,
            position: { x: 0, y: 0 }, // Center of ship
            critical: true // Ship destroyed if hull is destroyed
        });
    }

    /**
     * Hull integrity check
     * Returns structural integrity percentage
     */
    getIntegrity() {
        return this.getEfficiency();
    }

    /**
     * Check if hull breach occurs when taking damage
     */
    checkHullBreach() {
        if (this.destroyed) {
            return true;
        }

        // Small chance of breach when critically damaged
        if (this.damaged && Math.random() < 0.03) {
            return true;
        }

        return false;
    }
}

class CloakingDevice extends InternalSystem {
    constructor(hp = CONFIG.SYSTEM_HP_SENSORS) {
        super({
            name: 'Cloaking Device',
            hp: hp,
            position: { x: 0, y: 0 } // Center
        });
        this.cloaked = false;
        this.lastToggleTime = 0;
        this.decloakTime = 0; // When ship last decloaked
        this.cooldownTime = CONFIG.CLOAK_COOLDOWN; // 30 seconds
        this.weaponDelay = CONFIG.CLOAK_WEAPON_DELAY; // 5 seconds
        this.hitFlashTime = 0; // For visual flash when hit
        this.hitFlashDuration = 0.5; // Flash for 0.5 seconds
    }

    update(deltaTime, currentTime) {
        super.update(deltaTime, currentTime);

        // Fade hit flash
        if (this.hitFlashTime > 0) {
            this.hitFlashTime = Math.max(0, this.hitFlashTime - deltaTime);
        }
    }

    canToggleCloak(currentTime) {
        if (!this.isOperational()) return false;
        const timeSinceToggle = currentTime - this.lastToggleTime;
        return timeSinceToggle >= this.cooldownTime;
    }

    engageCloak(currentTime) {
        if (!this.canToggleCloak(currentTime)) return false;
        this.cloaked = true;
        this.lastToggleTime = currentTime;
        return true;
    }

    disengageCloak(currentTime) {
        if (!this.cloaked) return false;
        this.cloaked = false;
        this.lastToggleTime = currentTime;
        this.decloakTime = currentTime;
        return true;
    }

    canFireWeapons(currentTime) {
        // Can't fire while cloaked or within weapon delay after decloaking
        if (this.cloaked) return false;
        const timeSinceDecloak = currentTime - this.decloakTime;
        return timeSinceDecloak >= this.weaponDelay;
    }

    onHit(currentTime) {
        // Flash visible when hit while cloaked
        if (this.cloaked) {
            this.hitFlashTime = this.hitFlashDuration;
        }
    }

    shouldBeVisible() {
        // Visible if not cloaked, or if hit flash is active
        return !this.cloaked || this.hitFlashTime > 0;
    }

    getVisibilityAlpha() {
        if (!this.cloaked) return 1.0;
        if (this.hitFlashTime > 0) {
            // Flash effect: fade in and out
            return this.hitFlashTime / this.hitFlashDuration;
        }
        return 0; // Invisible
    }
}

class SystemManager {
    constructor(config = {}) {
        this.impulse = new ImpulseEngines(config.impulseHP);
        this.warp = new WarpNacelles(config.warpHP);
        this.sensors = new SensorArray(config.sensorsHP);
        this.cnc = new CommandAndControl(config.cncHP);
        this.bay = new WeaponsBay(config.bayHP);
        this.power = new MainPower(config.powerHP);
        this.hull = new Hull(config.hullHP); // Hull system (replaces ship.hp)

        // Cloaking device (Scintilian only)
        this.cloak = config.hasCloak ? new CloakingDevice(config.cloakHP) : null;

        // Weapon systems (beam batteries and torpedo launchers)
        // These are passed in from Ship.js after weapon creation
        this.weapons = config.weapons || [];
    }

    /**
     * Set weapon systems (called from Ship.js after weapons are created)
     */
    setWeapons(weapons) {
        this.weapons = weapons;
    }

    /**
     * Get all systems as array (including weapons, cloak, and hull)
     */
    getAllSystems() {
        const systems = [
            this.impulse,
            this.warp,
            this.sensors,
            this.cnc,
            this.bay,
            this.power,
            this.hull
        ];

        if (this.cloak) systems.push(this.cloak);

        systems.push(...this.weapons); // Include weapon systems

        return systems;
    }

    /**
     * Get targetable systems (all EXCEPT hull - hull only damaged by overflow)
     */
    getTargetableSystems() {
        const systems = [
            this.impulse,
            this.warp,
            this.sensors,
            this.cnc,
            this.bay,
            this.power
        ];

        if (this.cloak) systems.push(this.cloak);

        systems.push(...this.weapons); // Include weapon systems

        return systems;
    }

    /**
     * Update all systems (including auto-repair)
     */
    update(deltaTime, currentTime, ship) {
        // Auto-repair all systems (with crew skill bonus if ship provided)
        for (const system of this.getAllSystems()) {
            if (system.update) {
                system.update(deltaTime, currentTime, ship);
            }
        }

        // Check for control glitches
        if (this.cnc.checkControlGlitch(currentTime)) {
            return { type: 'control-glitch' };
        }

        // Check for core breach
        if (this.power.checkCoreBreach()) {
            return { type: 'core-breach' };
        }

        return null;
    }

    /**
     * Apply damage to nearest system based on hit location (BEAMS)
     * New flow: All damage to single nearest system
     * If system destroyed, overflow goes to HULL
     */
    applyDamageToNearestSystem(hitX, hitY, damage) {
        let nearestSystem = null;
        let minDistance = Infinity;

        // Only target non-hull systems
        for (const system of this.getTargetableSystems()) {
            const distance = Math.sqrt(
                Math.pow(hitX - system.position.x, 2) +
                Math.pow(hitY - system.position.y, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestSystem = system;
            }
        }

        if (nearestSystem) {
            const overflow = nearestSystem.takeDamage(damage);

            // Overflow from destroyed system goes to HULL
            if (overflow > 0) {
                this.hull.takeDamage(overflow);
            }

            return {
                system: nearestSystem,
                damage: damage - overflow,
                overflow: 0 // No overflow past hull (hull absorbs it)
            };
        }

        // No targetable systems - damage hull directly
        this.hull.takeDamage(damage);
        return { system: this.hull, damage: damage, overflow: 0 };
    }

    /**
     * Apply torpedo damage to 2-3 nearest systems (TORPEDOES)
     * New flow: Spread damage across 2-3 systems based on distance
     * Any overflow from destroyed systems goes to HULL
     */
    applyTorpedoToMultipleSystems(hitX, hitY, damage) {
        const systems = this.getTargetableSystems();

        // Calculate distances to all systems
        const systemDistances = systems.map(system => ({
            system,
            distance: Math.sqrt(
                Math.pow(hitX - system.position.x, 2) +
                Math.pow(hitY - system.position.y, 2)
            )
        }));

        // Sort by distance (nearest first)
        systemDistances.sort((a, b) => a.distance - b.distance);

        // Target 2-3 nearest systems
        const targetCount = Math.min(3, Math.max(2, systemDistances.length));
        const targetsToHit = systemDistances.slice(0, targetCount);

        // Distribute damage: nearest gets more damage
        // Pattern: 50%, 30%, 20% for 3 systems OR 60%, 40% for 2 systems
        const damageDistribution = targetCount === 3 ? [0.5, 0.3, 0.2] : [0.6, 0.4];

        const damagedSystems = [];
        let totalOverflow = 0;

        for (let i = 0; i < targetsToHit.length; i++) {
            const systemDamage = damage * damageDistribution[i];
            const overflow = targetsToHit[i].system.takeDamage(systemDamage);
            totalOverflow += overflow;

            damagedSystems.push({
                system: targetsToHit[i].system,
                damage: systemDamage - overflow
            });
        }

        // All overflow goes to HULL
        if (totalOverflow > 0) {
            this.hull.takeDamage(totalOverflow);
            damagedSystems.push({
                system: this.hull,
                damage: totalOverflow
            });
        }

        return damagedSystems;
    }

    /**
     * OLD METHOD - Apply torpedo damage to 4 random systems (biased toward impact point)
     * DEPRECATED - Kept for backwards compatibility
     */
    applyTorpedoDamageToSystems(hitX, hitY, damage) {
        const systems = this.getAllSystems();
        const hitCount = CONFIG.TORPEDO_SYSTEM_HIT_COUNT; // 4 systems
        const damagePerHit = damage / hitCount; // Split damage across hits

        // Calculate distances and weights for each system
        const systemWeights = systems.map(system => {
            const distance = Math.sqrt(
                Math.pow(hitX - system.position.x, 2) +
                Math.pow(hitY - system.position.y, 2)
            );
            // Closer systems have higher weight (inverse distance)
            // Add 1 to avoid division by zero
            const weight = 1 / (distance + 1);
            return { system, weight };
        });

        // Calculate total weight for normalization
        const totalWeight = systemWeights.reduce((sum, sw) => sum + sw.weight, 0);

        // Select 4 random systems (with replacement, biased by distance)
        const damagedSystems = [];
        for (let i = 0; i < hitCount; i++) {
            let random = Math.random() * totalWeight;
            let selectedSystem = null;

            // Weighted random selection
            for (const sw of systemWeights) {
                random -= sw.weight;
                if (random <= 0) {
                    selectedSystem = sw.system;
                    break;
                }
            }

            if (selectedSystem) {
                selectedSystem.takeDamage(damagePerHit);
                damagedSystems.push(selectedSystem);
            }
        }

        return damagedSystems;
    }

    /**
     * Apply blast radius damage to systems based on damage boxes
     * Used for torpedoes and area weapons
     * @param {number} blastX - Blast center X in ship-local coordinates
     * @param {number} blastY - Blast center Y in ship-local coordinates
     * @param {number} blastRadius - Radius of blast in pixels
     * @param {string} faction - Ship faction
     * @param {string} shipClass - Ship class
     */
    applyBlastDamageToSystems(blastX, blastY, blastRadius, faction, shipClass) {
        // Get system damage boxes for this ship type
        const boxes = SYSTEM_DAMAGE_BOXES.getSystemBoxes(faction, shipClass);

        if (boxes.length === 0) {
            // Fallback to old system if no boxes defined
            return this.applyTorpedoDamageToSystems(blastX, blastY, 1);
        }

        const damagedSystems = [];

        for (const box of boxes) {
            // Check if box intersects with blast circle
            const intersection = this.checkBoxCircleIntersection(
                box.x, box.y, box.width, box.height,
                blastX, blastY, blastRadius
            );

            if (intersection === 'full') {
                // Box fully within blast - 2 HP damage
                const system = this.getSystemByName(box.system);
                if (system) {
                    system.takeDamage(2);
                    damagedSystems.push({ system, damage: 2 });
                }
            } else if (intersection === 'partial') {
                // Box partially within blast - 1 HP damage
                const system = this.getSystemByName(box.system);
                if (system) {
                    system.takeDamage(1);
                    damagedSystems.push({ system, damage: 1 });
                }
            }
        }

        return damagedSystems;
    }

    /**
     * Check if a rectangular box intersects with a circle
     * @returns {string} 'none', 'partial', or 'full'
     */
    checkBoxCircleIntersection(boxX, boxY, boxWidth, boxHeight, circleX, circleY, radius) {
        // Box corners (centered at boxX, boxY)
        const halfW = boxWidth / 2;
        const halfH = boxHeight / 2;
        const corners = [
            { x: boxX - halfW, y: boxY - halfH }, // Top-left
            { x: boxX + halfW, y: boxY - halfH }, // Top-right
            { x: boxX - halfW, y: boxY + halfH }, // Bottom-left
            { x: boxX + halfW, y: boxY + halfH }  // Bottom-right
        ];

        // Check how many corners are inside the circle
        let cornersInside = 0;
        for (const corner of corners) {
            const dist = Math.sqrt(
                Math.pow(corner.x - circleX, 2) +
                Math.pow(corner.y - circleY, 2)
            );
            if (dist <= radius) {
                cornersInside++;
            }
        }

        if (cornersInside === 4) {
            return 'full'; // All corners inside
        } else if (cornersInside > 0) {
            return 'partial'; // Some corners inside
        }

        // Check if circle center is inside box
        if (circleX >= boxX - halfW && circleX <= boxX + halfW &&
            circleY >= boxY - halfH && circleY <= boxY + halfH) {
            return 'partial';
        }

        // Check if circle intersects any box edge
        const closestX = Math.max(boxX - halfW, Math.min(circleX, boxX + halfW));
        const closestY = Math.max(boxY - halfH, Math.min(circleY, boxY + halfH));
        const dist = Math.sqrt(
            Math.pow(closestX - circleX, 2) +
            Math.pow(closestY - circleY, 2)
        );

        if (dist <= radius) {
            return 'partial';
        }

        return 'none';
    }

    /**
     * Get system by mapped name
     */
    findWeaponByFacing(constructors, targetFacing) {
        if (!this.weapons || this.weapons.length === 0) {
            return null;
        }

        const normalize = (angle) => {
            if (typeof MathUtils !== 'undefined' && typeof MathUtils.normalizeAngle === 'function') {
                return MathUtils.normalizeAngle(angle);
            }
            const mod = angle % 360;
            return mod >= 0 ? mod : mod + 360;
        };

        const normalizedTarget = normalize(targetFacing);
        let fallback = null;

        for (const weapon of this.weapons) {
            for (const ctor of constructors) {
                if (weapon instanceof ctor) {
                    if (!fallback) {
                        fallback = weapon;
                    }

                    const centers = weapon.arcCenters && weapon.arcCenters.length > 0
                        ? weapon.arcCenters
                        : [weapon.arcCenter !== undefined ? weapon.arcCenter : 0];

                    for (const center of centers) {
                        const normalizedArcCenter = normalize(center);
                        if (Math.abs(normalizedArcCenter - normalizedTarget) <= 1) {
                            return weapon;
                        }
                    }
                }
            }
        }

        return fallback;
    }
    getSystemByName(name) {
        switch (name) {
            case 'forwardBeam':
                return this.findWeaponByFacing([BeamWeapon, PulseBeam], 0);
            case 'aftBeam':
                return this.findWeaponByFacing([BeamWeapon, PulseBeam], 180);
            case 'forwardTorpedo':
                return this.findWeaponByFacing([TorpedoLauncher, PlasmaTorpedo], 0);
            case 'aftTorpedo':
                return this.findWeaponByFacing([TorpedoLauncher, PlasmaTorpedo], 180);
            case 'dualTorpedo':
                return this.findWeaponByFacing([TorpedoLauncher, PlasmaTorpedo], 0) ||
                    this.findWeaponByFacing([TorpedoLauncher, PlasmaTorpedo], 180);
            case 'forwardDisruptor':
                return this.findWeaponByFacing([Disruptor], 0);
            case 'aftDisruptor':
                return this.findWeaponByFacing([Disruptor], 180);
            case 'sensors':
                return this.sensors;
            case 'cnc':
                return this.cnc;
            case 'impulse':
                return this.impulse;
            case 'power':
                return this.power;
            case 'bay':
                return this.bay;
            case 'warp':
                return this.warp;
            default:
                return null;
        }
    }

    /**
     * Get aggregate speed multiplier
     */
    getSpeedMultiplier() {
        return this.impulse.getSpeedMultiplier() * this.power.getPowerOutput();
    }

    /**
     * Get aggregate turn rate multiplier
     */
    getTurnRateMultiplier() {
        return this.impulse.getTurnRateMultiplier() * this.power.getPowerOutput();
    }

    /**
     * Get detection radius multiplier
     */
    getDetectionMultiplier() {
        return this.sensors.getDetectionMultiplier() * this.power.getPowerOutput();
    }
}







