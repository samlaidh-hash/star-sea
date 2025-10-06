/**
 * Star Sea - Base Projectile Entity
 */

class Projectile extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'projectile';
        this.projectileType = config.projectileType || 'beam';
        this.damage = config.damage || 1;
        this.sourceShip = config.sourceShip;
        this.lifetime = config.lifetime || 2;
        this.creationTime = performance.now() / 1000;
        this.hitTargets = new Set(); // Track what we've hit (for penetration/multi-hit logic)
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Check lifetime
        const currentTime = performance.now() / 1000;
        if (currentTime - this.creationTime >= this.lifetime) {
            this.destroy();
        }
    }

    hasHit(entity) {
        return this.hitTargets.has(entity.id);
    }

    markAsHit(entity) {
        this.hitTargets.add(entity.id);
    }
}

/**
 * Beam Projectile - Instant line from firer to target with fade
 */
class BeamProjectile extends Projectile {
    constructor(config) {
        super(config);
        this.projectileType = 'beam';
        this.range = config.range || CONFIG.BEAM_RANGE_PIXELS;
        this.speed = config.speed || CONFIG.BEAM_SPEED;
        this.rotation = config.rotation || 0;
        this.targetX = config.targetX;
        this.targetY = config.targetY;
        this.firingPointX = config.firingPointX || config.x; // Point on ship where beam fires from
        this.firingPointY = config.firingPointY || config.y;
        this.color = CONFIG.COLOR_BEAM;
        this.lifetime = 0.5; // 0.5 second beam duration

        // Beam is a static line - calculate end point based on range
        const angle = MathUtils.angleBetween(this.firingPointX, this.firingPointY, this.targetX, this.targetY);
        const distanceToTarget = MathUtils.distance(this.firingPointX, this.firingPointY, this.targetX, this.targetY);

        // Beam extends toward target, stopping at range limit or target (whichever is closer)
        const distance = Math.min(distanceToTarget, this.range);
        const vec = MathUtils.vectorFromAngle(angle, distance);
        this.endX = this.firingPointX + vec.x;
        this.endY = this.firingPointY + vec.y;

        // DEBUG
        if (CONFIG.DEBUG_MODE) {
            console.log('Beam Created:', {
                firingPoint: { x: this.firingPointX.toFixed(1), y: this.firingPointY.toFixed(1) },
                target: { x: this.targetX.toFixed(1), y: this.targetY.toFixed(1) },
                endPoint: { x: this.endX.toFixed(1), y: this.endY.toFixed(1) },
                angle: angle.toFixed(1),
                distanceToTarget: distanceToTarget.toFixed(1),
                beamLength: distance.toFixed(1),
                maxRange: this.range.toFixed(1)
            });
        }

        // Position is at the end point for collision detection
        this.x = this.endX;
        this.y = this.endY;

        // No velocity - beam is static
        this.vx = 0;
        this.vy = 0;
    }

    update(deltaTime) {
        // Beam doesn't move - just check lifetime
        super.update(deltaTime);
    }

    getFadeProgress() {
        // Returns 0-1, where 0 is fresh and 1 is fully faded
        const currentTime = performance.now() / 1000;
        const age = currentTime - this.creationTime;
        return Math.min(age / this.lifetime, 1);
    }
}

/**
 * Torpedo Projectile - Slower, homing capability
 */
class TorpedoProjectile extends Projectile {
    constructor(config) {
        super(config);
        this.projectileType = 'torpedo';
        this.speed = config.speed || CONFIG.TORPEDO_SPEED_CA;
        this.blastRadius = config.blastRadius;
        this.lifetime = config.lifetime || CONFIG.TORPEDO_LIFETIME;
        this.lockOnTarget = config.lockOnTarget; // Fire-and-forget target
        this.targetX = config.targetX;
        this.targetY = config.targetY;
        this.color = CONFIG.COLOR_TORPEDO;
        this.terminalHoming = false; // True after halfway point

        // Calculate initial velocity
        const angle = MathUtils.angleBetween(this.x, this.y, this.targetX, this.targetY);
        const vec = MathUtils.vectorFromAngle(angle, this.speed);
        this.vx = vec.x;
        this.vy = vec.y;
        this.rotation = angle;

        // Track distance to target at creation
        this.initialDistance = this.lockOnTarget ?
            MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y) :
            MathUtils.distance(this.x, this.y, this.targetX, this.targetY);
    }

    update(deltaTime) {
        if (this.lockOnTarget && this.lockOnTarget.active) {
            // Homing behavior
            const distanceToTarget = MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);

            // Check if past halfway point (terminal homing)
            if (distanceToTarget < this.initialDistance / 2) {
                this.terminalHoming = true;
            }

            // Home in on target if locked or in terminal phase
            if (this.lockOnTarget || this.terminalHoming) {
                const targetAngle = MathUtils.angleBetween(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);
                const vec = MathUtils.vectorFromAngle(targetAngle, this.speed);
                this.vx = vec.x;
                this.vy = vec.y;
                this.rotation = targetAngle;
            }
        }

        // Move torpedo
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        super.update(deltaTime);
    }

    /**
     * Get all entities in blast radius
     */
    getEntitiesInBlast(entities) {
        const entitiesHit = [];
        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === this.sourceShip) continue; // Don't hit source

            const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
            if (distance <= this.blastRadius) {
                entitiesHit.push(entity);
            }
        }
        return entitiesHit;
    }
}

/**
 * Disruptor Projectile - Trigon faction weapon
 * Wave effect moving at 2x torpedo speed, 2 damage, no lock-on
 */
class DisruptorProjectile extends Projectile {
    constructor(config) {
        super(config);
        this.projectileType = 'disruptor';
        this.range = config.range || CONFIG.BEAM_RANGE_PIXELS;
        this.speed = config.speed || CONFIG.DISRUPTOR_SPEED; // 2x torpedo speed
        this.rotation = config.rotation || 0;
        this.startX = config.x;
        this.startY = config.y;
        this.color = CONFIG.COLOR_DISRUPTOR; // Magenta wave effect
        this.lifetime = 2; // 2 seconds max

        // Calculate velocity (straight line, no homing)
        const angle = this.rotation;
        const vec = MathUtils.vectorFromAngle(angle, this.speed);
        this.vx = vec.x;
        this.vy = vec.y;
    }

    update(deltaTime) {
        // Move disruptor
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Check if exceeded range
        const distanceTraveled = MathUtils.distance(this.startX, this.startY, this.x, this.y);
        if (distanceTraveled >= this.range) {
            this.destroy();
            return;
        }

        super.update(deltaTime);
    }
}

/**
 * Plasma Torpedo Projectile - Scintilian faction weapon
 * DP (Damage Potential) system with degrading blast radius
 */
class PlasmaTorpedoProjectile extends Projectile {
    constructor(config) {
        super(config);
        this.projectileType = 'plasma';
        this.speed = config.speed || CONFIG.PLASMA_SPEED_CA; // 2/3 of normal torpedo speed
        this.lifetime = config.lifetime || CONFIG.TORPEDO_LIFETIME;
        this.lockOnTarget = config.lockOnTarget; // Fire-and-forget target
        this.targetX = config.targetX;
        this.targetY = config.targetY;
        this.color = CONFIG.COLOR_PLASMA; // Green
        this.terminalHoming = false;

        // Damage Potential (DP) system
        this.damagePotential = config.damagePotential || CONFIG.PLASMA_DAMAGE_POTENTIAL; // Use charged damage if provided
        this.dpDecayRate = CONFIG.PLASMA_DP_DECAY_PER_SECOND; // DP lost per second of movement

        // Calculate initial velocity
        const angle = MathUtils.angleBetween(this.x, this.y, this.targetX, this.targetY);
        const vec = MathUtils.vectorFromAngle(angle, this.speed);
        this.vx = vec.x;
        this.vy = vec.y;
        this.rotation = angle;

        // Track distance to target at creation
        this.initialDistance = this.lockOnTarget ?
            MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y) :
            MathUtils.distance(this.x, this.y, this.targetX, this.targetY);
    }

    update(deltaTime) {
        // Degrade DP over time
        this.damagePotential = Math.max(10, this.damagePotential - (this.dpDecayRate * deltaTime));

        // Homing behavior (same as regular torpedo)
        if (this.lockOnTarget && this.lockOnTarget.active) {
            const distanceToTarget = MathUtils.distance(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);

            if (distanceToTarget < this.initialDistance / 2) {
                this.terminalHoming = true;
            }

            if (this.lockOnTarget || this.terminalHoming) {
                const targetAngle = MathUtils.angleBetween(this.x, this.y, this.lockOnTarget.x, this.lockOnTarget.y);
                const vec = MathUtils.vectorFromAngle(targetAngle, this.speed);
                this.vx = vec.x;
                this.vy = vec.y;
                this.rotation = targetAngle;
            }
        }

        // Move plasma torpedo
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        super.update(deltaTime);
    }

    /**
     * Reduce DP when hit by weapons
     */
    takeDamage(damage) {
        this.damagePotential = Math.max(10, this.damagePotential - damage);
    }

    /**
     * Calculate blast radius based on DP and target size
     * At 30 DP: 150% of target longest dimension
     * At 10 DP: 50% of target longest dimension
     * Formula: Radius = (Target longest dimension) × (0.50 + (DP × 0.05))
     */
    getBlastRadius(target) {
        const targetSize = target.getShipSize ? target.getShipSize() : (target.radius || 50);
        const multiplier = 0.50 + (this.damagePotential * 0.05);
        return targetSize * multiplier;
    }

    /**
     * Get all entities in blast radius
     */
    getEntitiesInBlast(entities, hitTarget) {
        const blastRadius = this.getBlastRadius(hitTarget);
        const entitiesHit = [];

        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === this.sourceShip) continue; // Don't hit source

            const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
            if (distance <= blastRadius) {
                entitiesHit.push(entity);
            }
        }

        return entitiesHit;
    }
}
