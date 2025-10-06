/**
 * Star Sea - Gravity Well
 * Applies gravitational pull for collapsars (black holes)
 */

class GravityWell {
    constructor(x, y, radius, pullForce) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.pullForce = pullForce; // pixels/sec towards center
    }

    /**
     * Apply gravity to all entities in range
     */
    applyGravity(entities, deltaTime) {
        for (const entity of entities) {
            if (!entity.active || !entity.physicsComponent) continue;

            const dx = this.x - entity.x;
            const dy = this.y - entity.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only apply if within gravity radius
            if (distance <= this.radius && distance > 0) {
                // Linear falloff
                const strength = 1 - (distance / this.radius);
                const pullMagnitude = this.pullForce * strength * deltaTime;

                // Calculate pull direction (towards center)
                const nx = dx / distance;
                const ny = dy / distance;

                // Apply force via physics body
                const body = entity.physicsComponent.body;
                if (body) {
                    const forceX = nx * pullMagnitude * body.getMass();
                    const forceY = ny * pullMagnitude * body.getMass();
                    body.applyForceToCenter(planck.Vec2(forceX, forceY));
                }
            }
        }
    }

    /**
     * Check if position is within gravity well
     */
    isInWell(x, y) {
        const distance = MathUtils.distance(this.x, this.y, x, y);
        return distance <= this.radius;
    }

    /**
     * Get gravity strength at position (0-1)
     */
    getStrengthAt(x, y) {
        const distance = MathUtils.distance(this.x, this.y, x, y);
        if (distance >= this.radius) return 0;
        return 1 - (distance / this.radius);
    }
}
