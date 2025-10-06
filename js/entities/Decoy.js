/**
 * Star Sea - Decoy Entity
 */

class Decoy extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = 'decoy';
        this.lifetime = CONFIG.DECOY_LIFETIME; // 10 seconds
        this.creationTime = performance.now() / 1000;
        this.radius = 10;
        this.color = CONFIG.COLOR_DECOY;
        this.pulsePhase = 0;
    }

    update(deltaTime) {
        // Check lifetime
        const currentTime = performance.now() / 1000;
        if (currentTime - this.creationTime >= this.lifetime) {
            this.destroy();
            return;
        }

        // Pulse animation
        this.pulsePhase += deltaTime * 3;
    }

    /**
     * Attempt to confuse torpedo
     * Returns true if torpedo is confused
     */
    tryConfuseTorpedo(torpedo) {
        const distance = MathUtils.distance(this.x, this.y, torpedo.x, torpedo.y);

        // Closer torpedoes are more likely to be confused
        const maxConfusionDistance = 200;
        if (distance > maxConfusionDistance) return false;

        // Chance increases as torpedo gets closer
        const confusionChance = 1 - (distance / maxConfusionDistance);

        if (Math.random() < confusionChance) {
            // Redirect torpedo to decoy
            torpedo.lockOnTarget = this;
            torpedo.targetX = this.x;
            torpedo.targetY = this.y;
            return true;
        }

        return false;
    }

    /**
     * Block beam
     */
    canBlockBeam() {
        return true;
    }
}
