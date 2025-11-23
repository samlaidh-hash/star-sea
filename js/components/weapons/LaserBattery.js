/**
 * Star Sea - Laser Battery (Commonwealth faction)
 * 10 firing points, ripple pattern, minimal accuracy loss, damage falloff with range
 */

class LaserBattery extends Weapon {
    constructor(config) {
        super(config);
        this.range = config.range || CONFIG.BEAM_RANGE_PIXELS;
        this.speed = CONFIG.BEAM_SPEED;
        this.damage = config.damage || CONFIG.LASER_DAMAGE; // Base damage per shot
        this.firingPoints = 10; // 10 firing points
        this.shotInterval = 0.2; // 0.2 seconds between shots
        this.rechargeTime = 4; // 4 seconds to recharge each firing point
        this.ripplePattern = true; // Fire in ripple pattern
        
        // Firing point states
        this.firingPointStates = [];
        for (let i = 0; i < this.firingPoints; i++) {
            this.firingPointStates.push({
                ready: true,
                lastFireTime: 0
            });
        }
        
        this.lastFireTime = 0;
        this.isFiring = false;
        this.currentFiringPoint = 0;
    }

    canFire(currentTime) {
        if (!super.canFire()) return false;
        
        // Check if any firing point is ready
        return this.firingPointStates.some(point => point.ready);
    }

    fire(ship, targetX, targetY, currentTime) {
        if (!this.canFire(currentTime)) return null;

        // Find next ready firing point
        let firingPoint = -1;
        for (let i = 0; i < this.firingPointStates.length; i++) {
            if (this.firingPointStates[i].ready) {
                firingPoint = i;
                break;
            }
        }

        if (firingPoint === -1) return null;

        // Mark firing point as used
        this.firingPointStates[firingPoint].ready = false;
        this.firingPointStates[firingPoint].lastFireTime = currentTime;

        // Calculate damage with range falloff
        const distance = MathUtils.distance(ship.x, ship.y, targetX, targetY);
        const rangeFalloff = this.calculateRangeFalloff(distance);
        const actualDamage = this.damage * rangeFalloff;

        // Calculate accuracy spread (minimal loss with range)
        const accuracySpread = this.calculateAccuracySpread(distance);

        // Add random spread to target
        const spreadX = (Math.random() - 0.5) * accuracySpread;
        const spreadY = (Math.random() - 0.5) * accuracySpread;
        const finalTargetX = targetX + spreadX;
        const finalTargetY = targetY + spreadY;

        // Create laser projectile
        const laser = new LaserProjectile({
            x: ship.x,
            y: ship.y,
            rotation: ship.rotation,
            targetX: finalTargetX,
            targetY: finalTargetY,
            damage: actualDamage,
            range: this.range,
            speed: this.speed,
            sourceShip: ship,
            firingPoint: firingPoint
        });

        this.lastFireTime = currentTime;
        return laser;
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Update firing point recharge
        for (let i = 0; i < this.firingPointStates.length; i++) {
            const point = this.firingPointStates[i];
            if (!point.ready) {
                const timeSinceFire = currentTime - point.lastFireTime;
                if (timeSinceFire >= this.rechargeTime) {
                    point.ready = true;
                }
            }
        }
    }

    /**
     * Calculate damage falloff with range
     * Damage decreases with range (not accuracy)
     */
    calculateRangeFalloff(distance) {
        const maxRange = this.range;
        const falloffStart = maxRange * 0.5; // Start falloff at 50% range
        
        if (distance <= falloffStart) {
            return 1.0; // Full damage at close range
        }
        
        if (distance >= maxRange) {
            return 0.1; // Minimum 10% damage at max range
        }
        
        // Linear falloff from 50% to 100% range
        const falloffRange = maxRange - falloffStart;
        const falloffDistance = distance - falloffStart;
        const falloffRatio = falloffDistance / falloffRange;
        
        return 1.0 - (falloffRatio * 0.9); // 100% to 10% damage
    }

    /**
     * Calculate accuracy spread (minimal loss with range)
     */
    calculateAccuracySpread(distance) {
        const maxRange = this.range;
        const baseSpread = 5; // Base spread in pixels
        const maxSpread = 15; // Maximum spread at max range
        
        if (distance >= maxRange) {
            return maxSpread;
        }
        
        // Minimal increase with range
        const spreadRatio = distance / maxRange;
        return baseSpread + (spreadRatio * (maxSpread - baseSpread));
    }

    /**
     * Get firing point status for UI
     */
    getFiringPointStatus() {
        return this.firingPointStates.map((point, index) => ({
            index: index,
            ready: point.ready,
            rechargeProgress: point.ready ? 1.0 : 
                Math.min(1.0, (performance.now() / 1000 - point.lastFireTime) / this.rechargeTime)
        }));
    }

    /**
     * Get number of ready firing points
     */
    getReadyFiringPoints() {
        return this.firingPointStates.filter(point => point.ready).length;
    }
}

