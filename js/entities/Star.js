/**
 * Star Sea - Star Entity
 * Gravitational body with damage radius and shallow gravity gradient
 */

class Star extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = 'star';
        this.radius = CONFIG.STAR_RADIUS;
        this.damageRadius = CONFIG.STAR_DAMAGE_RANGE;
        this.gravityStrength = CONFIG.STAR_GRAVITY_STRENGTH;
        this.gravityMaxRange = CONFIG.STAR_GRAVITY_MAX_RANGE;
        this.damagePerSecond = CONFIG.STAR_DAMAGE_PER_SECOND;

        // Visual properties
        this.glowPhase = 0;
        this.rotation = 0;
        this.rotationSpeed = 5; // slow rotation for visual effect

        // Damage tracking for nearby entities
        this.lastDamageTime = new Map(); // entity -> lastDamageTime
    }

    update(deltaTime) {
        // Animate glow
        this.glowPhase += deltaTime * 2;

        // Slow rotation
        this.rotation += this.rotationSpeed * deltaTime;
        this.rotation = MathUtils.normalizeAngle(this.rotation);
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

        // Gravitational force: F = G * m1 * m2 / r^2
        // Simplified: F = strength / r^2
        // Shallow gradient: inverse square law
        const forceMagnitude = this.gravityStrength / (distanceSquared + 1); // +1 prevents division by zero

        // Normalize direction and apply force
        const forceX = (dx / distance) * forceMagnitude;
        const forceY = (dy / distance) * forceMagnitude;

        return { x: forceX, y: forceY };
    }

    /**
     * Check if entity is within damage radius and apply damage
     * @param {Entity} entity - The entity to check
     * @param {number} currentTime - Current game time
     */
    checkDamage(entity, currentTime) {
        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Instant death on contact
        if (distance < this.radius) {
            if (entity.takeDamage) {
                entity.takeDamage(9999, { x: this.x, y: this.y });
            }
            return;
        }

        // Damage if within damage radius
        if (distance < this.damageRadius) {
            const lastDamage = this.lastDamageTime.get(entity) || 0;

            // Apply damage once per second
            if (currentTime - lastDamage >= 1.0) {
                if (entity.takeDamage) {
                    entity.takeDamage(this.damagePerSecond, { x: this.x, y: this.y });
                }
                this.lastDamageTime.set(entity, currentTime);
            }
        }
    }

    /**
     * Apply proximity damage (called per frame with deltaTime)
     * @param {Entity} entity - The entity to check
     * @param {number} deltaTime - Time since last frame
     * @returns {number} - Damage applied this frame
     */
    applyProximityDamage(entity, deltaTime) {
        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Instant death on contact with star surface
        if (distance < this.radius) {
            if (entity.takeDamage) {
                entity.takeDamage(9999, { x: this.x, y: this.y });
            }
            return 9999;
        }

        // Gradual heat damage within damage radius
        if (distance < this.damageRadius) {
            // Scale damage with distance (closer = more damage)
            const damageScale = 1.0 - (distance - this.radius) / (this.damageRadius - this.radius);
            const damageThisFrame = this.damagePerSecond * damageScale * deltaTime;

            if (entity.takeDamage && damageThisFrame > 0) {
                entity.takeDamage(damageThisFrame, { x: this.x, y: this.y });
            }

            return damageThisFrame;
        }

        return 0;
    }

    /**
     * Get visual glow intensity (for rendering)
     */
    getGlowIntensity() {
        return 0.5 + Math.sin(this.glowPhase) * 0.3;
    }
}
