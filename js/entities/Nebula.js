/**
 * Star Sea - Nebula Entity
 * Large area effect that applies drag and interference
 */

class Nebula extends Entity {
    constructor(x, y, config = {}) {
        super(x, y);
        this.type = 'nebula';
        this.radius = config.radius || CONFIG.NEBULA_RADIUS;
        this.dragCoefficient = config.dragCoefficient || CONFIG.NEBULA_DRAG_COEFFICIENT;
        this.shieldInterference = config.shieldInterference || CONFIG.NEBULA_SHIELD_INTERFERENCE;
        this.sensorInterference = config.sensorInterference || CONFIG.NEBULA_SENSOR_INTERFERENCE;
        this.beamInterference = config.beamInterference || CONFIG.NEBULA_BEAM_INTERFERENCE;
        this.torpedoDrag = config.torpedoDrag || CONFIG.NEBULA_TORPEDO_DRAG;

        // Visual properties
        this.color = config.color || CONFIG.COLOR_NEBULA;
        this.alpha = config.alpha || CONFIG.NEBULA_ALPHA;
        this.swirls = this.generateSwirls();
        this.animationPhase = 0;
    }

    /**
     * Generate random swirl patterns for visual effect
     */
    generateSwirls() {
        const swirls = [];
        const swirlCount = 5 + Math.floor(Math.random() * 3);

        for (let i = 0; i < swirlCount; i++) {
            swirls.push({
                offsetX: (Math.random() - 0.5) * this.radius * 1.5,
                offsetY: (Math.random() - 0.5) * this.radius * 1.5,
                radius: this.radius * (0.3 + Math.random() * 0.4),
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 20
            });
        }

        return swirls;
    }

    update(deltaTime) {
        // Animate swirls
        this.animationPhase += deltaTime;

        for (const swirl of this.swirls) {
            swirl.rotation += swirl.rotationSpeed * deltaTime;
            swirl.rotation = MathUtils.normalizeAngle(swirl.rotation);
        }
    }

    /**
     * Check if entity is inside nebula
     * @param {Entity} entity - The entity to check
     * @returns {boolean}
     */
    isInside(entity) {
        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius;
    }

    /**
     * Apply drag force to entity (proportional to speed)
     * @param {Entity} entity - The entity to apply drag to
     * @param {number} deltaTime - Time step
     */
    applyDrag(entity, deltaTime) {
        if (!this.isInside(entity)) {
            return;
        }

        // Drag force proportional to velocity
        const speed = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);

        if (speed > 0.1) {
            // Calculate drag force: F_drag = -k * v * speed (quadratic drag)
            const dragForce = this.dragCoefficient * speed * deltaTime;
            const dragRatio = Math.max(0, 1 - dragForce);

            entity.vx *= dragRatio;
            entity.vy *= dragRatio;

            // Update physics if present
            if (entity.physicsComponent) {
                entity.physicsComponent.setVelocity(entity.vx, entity.vy);
            }
        }
    }

    /**
     * Get interference multipliers for entity inside nebula
     * @param {Entity} entity - The entity to check
     * @returns {Object} - Interference multipliers {shield, sensor, beam, torpedo}
     */
    getInterference(entity) {
        if (!this.isInside(entity)) {
            return {
                shield: 1.0,
                sensor: 1.0,
                beam: 1.0,
                torpedo: 1.0
            };
        }

        return {
            shield: this.shieldInterference,
            sensor: this.sensorInterference,
            beam: this.beamInterference,
            torpedo: this.torpedoDrag
        };
    }

    /**
     * Apply nebula effects to ship
     * @param {Ship} ship - The ship to affect
     */
    affectShip(ship) {
        if (!this.isInside(ship)) {
            // Clear nebula effects if ship left
            if (ship.inNebula) {
                ship.inNebula = false;
                ship.nebulaInterference = null;
            }
            return;
        }

        // Mark ship as in nebula
        ship.inNebula = true;
        ship.nebulaInterference = this.getInterference(ship);

        // Apply interference to shields
        if (ship.shields) {
            ship.shields.nebulaInterference = this.shieldInterference;
        }
    }

    /**
     * Apply nebula effects to torpedo
     * @param {Entity} torpedo - The torpedo to affect
     * @param {number} deltaTime - Time step
     */
    affectTorpedo(torpedo, deltaTime) {
        if (!this.isInside(torpedo)) {
            return;
        }

        // Reduce torpedo speed
        const speedMultiplier = 1 - (1 - this.torpedoDrag) * deltaTime * 2;
        torpedo.vx *= speedMultiplier;
        torpedo.vy *= speedMultiplier;

        if (torpedo.physicsComponent) {
            torpedo.physicsComponent.setVelocity(torpedo.vx, torpedo.vy);
        }

        // Reduce torpedo endurance (lifetime)
        if (torpedo.lifetime) {
            torpedo.lifetime -= deltaTime * (1 - this.torpedoDrag);
        }
    }

    /**
     * Get nebula density at point (for rendering particles)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {number} - Density 0-1
     */
    getDensityAt(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.radius) {
            return 0;
        }

        // Density falls off toward edges
        return 1 - (distance / this.radius);
    }
}
