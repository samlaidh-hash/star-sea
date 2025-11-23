/**
 * Star Sea - Black Hole Entity
 * Gravitational body with event horizon and steep gravity gradient
 */

class BlackHole extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = 'blackhole';
        this.radius = CONFIG.BLACK_HOLE_RADIUS;
        this.eventHorizon = CONFIG.BLACK_HOLE_EVENT_HORIZON;
        this.gravityStrength = CONFIG.BLACK_HOLE_GRAVITY_STRENGTH;
        this.gravityMaxRange = CONFIG.BLACK_HOLE_GRAVITY_MAX_RANGE;

        // Visual properties
        this.accretionRotation = 0;
        this.accretionSpeed = 30; // Fast rotation for accretion disk
        this.pulsePhase = 0;
    }

    update(deltaTime) {
        // Animate accretion disk
        this.accretionRotation += this.accretionSpeed * deltaTime;
        this.accretionRotation = MathUtils.normalizeAngle(this.accretionRotation);

        // Pulse effect
        this.pulsePhase += deltaTime * 3;
    }

    /**
     * Apply gravitational force to an entity
     * @param {Entity} entity - The entity to apply gravity to
     * @returns {Object} - Gravity vector {x, y}
     */
    applyGravity(entity) {
        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);

        // No gravity beyond max range
        if (distance > this.gravityMaxRange) {
            return { x: 0, y: 0 };
        }

        // Steep gradient: inverse cube law for more dramatic pull
        // This makes gravity increase very rapidly as you get closer
        const forceMagnitude = this.gravityStrength / (distanceSquared * Math.max(distance, 1));

        // Normalize direction and apply force
        const forceX = (dx / distance) * forceMagnitude;
        const forceY = (dy / distance) * forceMagnitude;

        return { x: forceX, y: forceY };
    }

    /**
     * Check if entity crossed event horizon (instant death)
     * @param {Entity} entity - The entity to check
     */
    checkEventHorizon(entity) {
        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Instant death if within event horizon
        if (distance < this.eventHorizon) {
            if (entity.takeDamage) {
                entity.takeDamage(9999, { x: this.x, y: this.y });
            }
            if (entity.isPlayer) {
                eventBus.emit('player-message', {
                    message: 'SHIP DESTROYED BY BLACK HOLE',
                    type: 'critical'
                });
            }
        }
    }

    /**
     * Get accretion disk pulse intensity (for rendering)
     */
    getPulseIntensity() {
        return 0.6 + Math.sin(this.pulsePhase) * 0.4;
    }
}
