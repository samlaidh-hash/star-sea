/**
 * Star Sea - Planet Entity
 * Gravitational body with landing mechanic
 */

class Planet extends Entity {
    constructor(x, y, config = {}) {
        super(x, y);
        this.type = 'planet';
        this.radius = config.radius || CONFIG.PLANET_RADIUS;
        this.gravityStrength = config.gravityStrength || CONFIG.PLANET_GRAVITY_STRENGTH;
        this.gravityMaxRange = config.gravityMaxRange || CONFIG.PLANET_GRAVITY_MAX_RANGE;
        this.landingSpeed = config.landingSpeed || CONFIG.PLANET_LANDING_SPEED;
        this.bounceDamage = config.bounceDamage || CONFIG.PLANET_BOUNCE_DAMAGE;

        // Visual properties
        this.rotation = 0;
        this.rotationSpeed = 10; // Slow rotation
        this.color = config.color || CONFIG.COLOR_PLANET;

        // Landing tracking
        this.landingShips = new Set(); // Ships currently landing
    }

    update(deltaTime) {
        // Rotate planet
        this.rotation += this.rotationSpeed * deltaTime;
        this.rotation = MathUtils.normalizeAngle(this.rotation);

        // Update landing ships (spiral animation handled by renderer)
    }

    /**
     * Apply gravitational force to an entity
     * @param {Entity} entity - The entity to apply gravity to
     * @returns {Object} - Gravity vector {x, y}
     */
    applyGravity(entity) {
        // Don't apply gravity to landing ships
        if (this.landingShips.has(entity)) {
            return { x: 0, y: 0 };
        }

        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);

        // No gravity beyond max range
        if (distance > this.gravityMaxRange) {
            return { x: 0, y: 0 };
        }

        // Gravitational force: similar to stars but weaker
        const forceMagnitude = this.gravityStrength / (distanceSquared + 1);

        // Normalize direction and apply force
        const forceX = (dx / distance) * forceMagnitude;
        const forceY = (dy / distance) * forceMagnitude;

        return { x: forceX, y: forceY };
    }

    /**
     * Check landing/collision with planet
     * @param {Entity} entity - The entity to check
     * @returns {string} - 'landed', 'bounced', or null
     */
    checkLanding(entity) {
        // Only ships can land
        if (!entity.type || entity.type !== 'ship') {
            return null;
        }

        // Check if already landing
        if (this.landingShips.has(entity)) {
            return null;
        }

        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check collision with planet surface
        if (distance < this.radius + (entity.getShipSize ? entity.getShipSize() : 20)) {
            // Calculate entity speed
            const speed = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);

            if (speed <= this.landingSpeed) {
                // SAFE LANDING - disengagement maneuver
                this.startLanding(entity);
                return 'landed';
            } else {
                // TOO FAST - bounce off and take damage
                if (entity.takeDamage) {
                    entity.takeDamage(this.bounceDamage, { x: this.x, y: this.y });
                }

                // Bounce entity away
                const bounceForce = 200;
                const angle = Math.atan2(entity.y - this.y, entity.x - this.x);
                entity.vx = Math.cos(angle) * bounceForce;
                entity.vy = Math.sin(angle) * bounceForce;

                if (entity.physicsComponent) {
                    entity.physicsComponent.setVelocity(entity.vx, entity.vy);
                }

                return 'bounced';
            }
        }

        return null;
    }

    /**
     * Start landing sequence for a ship
     * @param {Ship} ship - The ship landing
     */
    startLanding(ship) {
        this.landingShips.add(ship);

        // Mark ship as landing
        ship.landing = true;
        ship.landingStartTime = performance.now() / 1000;
        ship.landingDuration = 3.0; // 3 second spiral animation
        ship.landingPlanet = this;

        // Stop ship movement
        ship.vx = 0;
        ship.vy = 0;
        if (ship.physicsComponent) {
            ship.physicsComponent.setVelocity(0, 0);
        }

        // Emit event
        if (ship.isPlayer) {
            eventBus.emit('player-message', {
                message: 'LANDING ON PLANET - DISENGAGING',
                type: 'success'
            });
            eventBus.emit('player-landed', { planet: this });
        }
    }

    /**
     * Complete landing (remove ship from game)
     * @param {Ship} ship - The ship that finished landing
     */
    completeLanding(ship) {
        this.landingShips.delete(ship);
        ship.active = false; // Remove from game

        if (ship.isPlayer) {
            eventBus.emit('player-message', {
                message: 'LANDING COMPLETE - MISSION DISENGAGED',
                type: 'success'
            });
        }
    }
}
