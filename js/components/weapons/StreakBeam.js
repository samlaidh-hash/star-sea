/**
 * Star Sea - Streak Beam Weapon (Strike Cruiser)
 * Fires two orange-red streaks in quick succession
 */

class StreakBeam extends BeamWeapon {
    constructor(config = {}) {
        super(config);

        this.range = config.range || CONFIG.STREAK_BEAM_RANGE;
        this.damage = config.damage || CONFIG.STREAK_BEAM_DAMAGE;
        this.cooldown = config.cooldown || CONFIG.STREAK_BEAM_COOLDOWN;
        this.shotInterval = CONFIG.STREAK_BEAM_SHOT_INTERVAL; // 0.2s between shots
        this.color = CONFIG.COLOR_STREAK_BEAM;

        // Streak firing state
        this.isFiringStreak = false;
        this.streakStartTime = 0;
        this.shotsFiredInStreak = 0;
        this.streakTarget = null;
    }

    canFire(currentTime) {
        if (!this.isOperational()) return false;

        // Can fire if cooldown is ready and not currently in a streak
        if (this.isFiringStreak) return false;

        return currentTime - this.lastFireTime >= this.cooldown;
    }

    /**
     * Fire streak beam sequence
     */
    fire(ship, targetX, targetY, currentTime) {
        if (!this.canFire(currentTime)) return null;

        // Start streak sequence
        this.isFiringStreak = true;
        this.streakStartTime = currentTime;
        this.shotsFiredInStreak = 0;
        this.lastFireTime = currentTime;
        this.streakTarget = { x: targetX, y: targetY };

        // Fire first shot immediately
        const firstShot = this.fireStreakShot(ship, targetX, targetY);
        this.shotsFiredInStreak = 1;

        return firstShot;
    }

    /**
     * Update - handles firing second shot in sequence
     */
    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle streak firing
        if (this.isFiringStreak && this.shotsFiredInStreak < 2) {
            const timeSinceStreakStart = currentTime - this.streakStartTime;

            // Fire second shot after interval
            if (timeSinceStreakStart >= this.shotInterval && this.shotsFiredInStreak === 1) {
                // Need to get the ship and target from somewhere
                // This will be handled in the game loop by calling getNextStreakShot
            }
        }

        // End streak after both shots fired
        if (this.isFiringStreak && this.shotsFiredInStreak >= 2) {
            this.isFiringStreak = false;
        }
    }

    /**
     * Get next streak shot (called by game loop)
     */
    getNextStreakShot(ship, currentTime) {
        if (!this.isFiringStreak) return null;
        if (this.shotsFiredInStreak >= 2) return null;

        const timeSinceStreakStart = currentTime - this.streakStartTime;

        // Fire second shot after interval
        if (timeSinceStreakStart >= this.shotInterval && this.shotsFiredInStreak === 1) {
            this.shotsFiredInStreak = 2;

            if (this.streakTarget) {
                return this.fireStreakShot(ship, this.streakTarget.x, this.streakTarget.y);
            }
        }

        return null;
    }

    /**
     * Fire a single streak shot
     */
    fireStreakShot(ship, targetX, targetY) {
        // Calculate firing point from weapon position
        const firingPoint = this.calculateFiringPoint(ship, targetX, targetY);

        // Create beam projectile with streak beam color
        const projectile = new BeamProjectile({
            x: firingPoint.x,
            y: firingPoint.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.damage,
            range: this.range,
            speed: CONFIG.BEAM_SPEED,
            lifetime: CONFIG.BEAM_LIFETIME,
            sourceShip: ship,
            sourceWeapon: this
        });

        // Set streak beam color
        projectile.color = this.color;
        projectile.projectileType = 'beam'; // Standard beam projectile

        return projectile;
    }

    /**
     * Get cooldown percentage
     */
    getCooldownPercentage(currentTime) {
        if (this.isFiringStreak) return 0; // Show as not ready during streak

        const timeSinceLastFire = currentTime - this.lastFireTime;
        return Math.min(timeSinceLastFire / this.cooldown, 1);
    }
}
