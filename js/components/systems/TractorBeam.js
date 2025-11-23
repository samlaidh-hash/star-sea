/**
 * Tractor Beam System Component
 *
 * Allows ships to pull or push entities using a tractor beam.
 * - Q key toggles on/off
 * - Auto-targets nearest entity with priority system
 * - Hold Shift for push mode instead of pull
 * - 20% penalty to speed/shields/beams while active
 * - Drains energy from power system
 */

class TractorBeam {
    constructor(ship) {
        this.ship = ship;
        this.active = false;
        this.target = null;

        // Range configuration
        this.maxRange = 400; // Maximum effective range
        this.optimalRange = 200; // Optimal performance range

        // Penalties while active (20% reduction)
        this.speedPenalty = 0.80; // 80% of normal speed
        this.shieldPenalty = 0.80; // 80% of normal shields
        this.beamPenalty = 0.80; // 80% of normal beam damage

        // Energy drain
        this.energyDrainRate = 2; // Energy units per second

        // Force strength
        this.pullForce = 150; // Pull force magnitude (N)
        this.pushForce = 150; // Push force magnitude (N)

        // Acquisition lock time
        this.lockTime = 0;
        this.lockRequired = 0.5; // 0.5 seconds to lock on
    }

    /**
     * Toggle tractor beam on/off
     */
    toggle() {
        this.active = !this.active;

        if (!this.active) {
            // Deactivate - clear target
            this.target = null;
            this.lockTime = 0;
        }

        eventBus.emit('tractor-beam-toggled', { active: this.active });
    }

    /**
     * Update tractor beam system
     * @param {number} deltaTime - Time since last update
     * @param {Array} entities - All game entities
     * @param {boolean} pushMode - True for push, false for pull
     */
    update(deltaTime, entities, pushMode = false) {
        if (!this.active) return;

        // Drain energy from ship's power system
        if (this.ship.systems && this.ship.systems.power) {
            const drained = this.ship.systems.power.drainEnergy(this.energyDrainRate * deltaTime);

            // Auto-disable if power too low
            if (this.ship.systems.power.getCurrentPower() < 10) {
                this.active = false;
                this.target = null;
                this.lockTime = 0;
                eventBus.emit('tractor-beam-power-failure');
                return;
            }
        }

        // Acquire or maintain target
        this.acquireTarget(entities, deltaTime);

        // Apply force to target if locked
        if (this.target && this.lockTime >= this.lockRequired) {
            this.applyTractorForce(pushMode, deltaTime);
        }
    }

    /**
     * Acquire or maintain lock on target
     * @param {Array} entities - All game entities
     * @param {number} deltaTime - Time since last update
     */
    acquireTarget(entities, deltaTime) {
        // If we have a target, check if it's still valid
        if (this.target) {
            const distance = MathUtils.distance(this.ship.x, this.ship.y, this.target.x, this.target.y);

            // Lost target if out of range or destroyed
            if (!this.target.active || distance > this.maxRange) {
                this.target = null;
                this.lockTime = 0;
                eventBus.emit('tractor-beam-lock-lost');
            } else {
                // Maintain lock - increase lock time
                this.lockTime = Math.min(this.lockTime + deltaTime, this.lockRequired);
            }
        }

        // Find new target if we don't have one
        if (!this.target) {
            const newTarget = this.findBestTarget(entities);
            if (newTarget) {
                this.target = newTarget;
                this.lockTime = 0;
                eventBus.emit('tractor-beam-lock-acquired', { target: this.target });
            }
        }
    }

    /**
     * Find best target based on priority system
     * Priority: mines/shuttles/torpedoes > ships/asteroids/stations
     * @param {Array} entities - All game entities
     * @returns {Entity|null} Best target or null
     */
    findBestTarget(entities) {
        const highPriority = [];
        const lowPriority = [];

        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === this.ship) continue;

            const distance = MathUtils.distance(this.ship.x, this.ship.y, entity.x, entity.y);
            if (distance > this.maxRange) continue;

            // High priority targets (small, fast-moving threats)
            if (entity.type === 'mine' || entity.type === 'shuttle' ||
                entity.type === 'projectile' || entity.type === 'decoy') {
                highPriority.push({ entity, distance });
            }
            // Low priority targets (large, slow-moving targets)
            else if (entity.type === 'ship' || entity.type === 'asteroid' ||
                     entity.type === 'space-station' || entity.type === 'civilian-transport') {
                lowPriority.push({ entity, distance });
            }
        }

        // Sort by distance (closest first)
        highPriority.sort((a, b) => a.distance - b.distance);
        lowPriority.sort((a, b) => a.distance - b.distance);

        // Return closest high priority, or closest low priority
        if (highPriority.length > 0) {
            return highPriority[0].entity;
        } else if (lowPriority.length > 0) {
            return lowPriority[0].entity;
        }

        return null;
    }

    /**
     * Apply tractor beam force to target
     * @param {boolean} pushMode - True for push, false for pull
     * @param {number} deltaTime - Time since last update
     */
    applyTractorForce(pushMode, deltaTime) {
        if (!this.target) return;

        const dx = this.target.x - this.ship.x;
        const dy = this.target.y - this.ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        // Normalize direction
        const dirX = dx / distance;
        const dirY = dy / distance;

        // Calculate force strength (stronger at optimal range)
        const rangeEfficiency = this.calculateRangeEfficiency(distance);
        const force = pushMode ? -this.pushForce : this.pullForce;
        const effectiveForce = force * rangeEfficiency;

        // Apply force to target (if it has velocity)
        if (this.target.vx !== undefined && this.target.vy !== undefined) {
            // Get target mass (default to 1.0 if not specified)
            const mass = this.target.mass || this.getMassFromEntity(this.target);

            // Calculate acceleration (F = ma, so a = F/m)
            const acceleration = effectiveForce / mass;

            // Apply acceleration to velocity
            this.target.vx += dirX * acceleration * deltaTime;
            this.target.vy += dirY * acceleration * deltaTime;
        }
    }

    /**
     * Get estimated mass from entity type
     * @param {Entity} entity - Entity to estimate mass for
     * @returns {number} Estimated mass
     */
    getMassFromEntity(entity) {
        if (entity.type === 'ship') {
            // Ship classes have different masses
            const shipClass = entity.shipClass || 'CA';
            const masses = {
                'FG': 0.5,
                'DD': 0.7,
                'CL': 1.0,
                'CA': 1.5,
                'BC': 2.0
            };
            return masses[shipClass] || 1.0;
        } else if (entity.type === 'asteroid') {
            // Asteroids are heavy
            const sizes = { 'small': 0.5, 'medium': 1.5, 'large': 3.0 };
            return sizes[entity.size] || 1.0;
        } else if (entity.type === 'projectile' || entity.type === 'mine' ||
                   entity.type === 'shuttle' || entity.type === 'decoy') {
            // Small objects are light
            return 0.1;
        } else if (entity.type === 'space-station') {
            // Stations are extremely heavy (almost immovable)
            return 10.0;
        }

        return 1.0; // Default mass
    }

    /**
     * Calculate tractor beam efficiency based on range
     * @param {number} distance - Distance to target
     * @returns {number} Efficiency multiplier (0.0 to 1.0)
     */
    calculateRangeEfficiency(distance) {
        // 100% efficiency at optimal range, drops off at edges
        if (distance <= this.optimalRange) {
            return 1.0;
        } else {
            // Linear falloff from optimal to max range
            const falloff = (this.maxRange - distance) / (this.maxRange - this.optimalRange);
            return Math.max(0, falloff);
        }
    }

    /**
     * Get speed multiplier penalty
     * @returns {number} Speed multiplier (0.8 when active, 1.0 when inactive)
     */
    getSpeedMultiplier() {
        return this.active ? this.speedPenalty : 1.0;
    }

    /**
     * Get shield multiplier penalty
     * @returns {number} Shield multiplier (0.8 when active, 1.0 when inactive)
     */
    getShieldMultiplier() {
        return this.active ? this.shieldPenalty : 1.0;
    }

    /**
     * Get beam damage multiplier penalty
     * @returns {number} Beam damage multiplier (0.8 when active, 1.0 when inactive)
     */
    getBeamMultiplier() {
        return this.active ? this.beamPenalty : 1.0;
    }

    /**
     * Check if tractor beam is active
     * @returns {boolean} True if active
     */
    isActive() {
        return this.active;
    }

    /**
     * Get current target
     * @returns {Entity|null} Current target or null
     */
    getTarget() {
        return this.target;
    }

    /**
     * Check if target is locked
     * @returns {boolean} True if locked on target
     */
    isLocked() {
        return this.target !== null && this.lockTime >= this.lockRequired;
    }

    /**
     * Get lock progress (0.0 to 1.0)
     * @returns {number} Lock progress
     */
    getLockProgress() {
        if (!this.target) return 0;
        return Math.min(this.lockTime / this.lockRequired, 1.0);
    }

    /**
     * Get maximum range
     * @returns {number} Maximum effective range
     */
    getMaxRange() {
        return this.maxRange;
    }

    /**
     * Get optimal range
     * @returns {number} Optimal performance range
     */
    getOptimalRange() {
        return this.optimalRange;
    }
}
