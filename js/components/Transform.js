/**
 * Star Sea - Transform Component
 * Stores position, rotation, and velocity
 */

class Transform {
    constructor(x = 0, y = 0, rotation = 0) {
        this.x = x;
        this.y = y;
        this.rotation = rotation; // degrees, 0 = pointing up/north
        this.vx = 0; // velocity x
        this.vy = 0; // velocity y
    }

    /**
     * Update position based on velocity
     */
    updatePosition(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }

    /**
     * Get speed (magnitude of velocity)
     */
    getSpeed() {
        return MathUtils.magnitude(this.vx, this.vy);
    }

    /**
     * Set velocity from angle and speed
     */
    setVelocityFromAngle(angle, speed) {
        const vec = MathUtils.vectorFromAngle(angle, speed);
        this.vx = vec.x;
        this.vy = vec.y;
    }

    /**
     * Add velocity from angle and magnitude
     */
    addVelocity(angle, magnitude) {
        const vec = MathUtils.vectorFromAngle(angle, magnitude);
        this.vx += vec.x;
        this.vy += vec.y;
    }

    /**
     * Clamp velocity to max speed
     */
    clampVelocity(maxSpeed) {
        const speed = this.getSpeed();
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }
}
