/**
 * Star Sea - Plasma Torpedo Launcher (Scintilian faction)
 * 1 plasma torpedo per launcher with DP (Damage Potential) system
 */

class PlasmaTorpedo extends Weapon {
    constructor(config) {
        super(config);
        this.loaded = 1; // Only 1 plasma torp per launcher
        this.maxLoaded = 1;
        this.stored = 0; // No stored plasma torps (fired one at a time)
        this.speed = CONFIG.PLASMA_SPEED_CA; // 2/3 of normal torpedo speed
        this.lifetime = CONFIG.TORPEDO_LIFETIME;
        this.reloadDelay = CONFIG.TORPEDO_RELOAD_DELAY * 2; // 8 seconds (2x normal)
        this.reloadStartTime = 0;
        this.isReloading = false;
    }

    canFire(currentTime) {
        if (!super.canFire()) return false;
        return this.loaded > 0;
    }

    fire(ship, targetX, targetY, currentTime, lockOnTarget = null, chargeDamage = 0) {
        if (!this.canFire(currentTime)) return null;

        this.loaded = 0; // Fire the plasma torp
        this.lastFireTime = currentTime;

        // Start reload timer
        this.reloadStartTime = currentTime + this.reloadDelay;
        this.isReloading = false;

        // Use charged damage if provided, otherwise use default
        const damagePotential = chargeDamage > 0 ? chargeDamage : CONFIG.PLASMA_DAMAGE_POTENTIAL;

        // Create plasma torpedo projectile
        const plasmaTorp = new PlasmaTorpedoProjectile({
            x: ship.x,
            y: ship.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damagePotential: damagePotential, // Use charged damage
            speed: this.speed,
            lifetime: this.lifetime,
            sourceShip: ship,
            lockOnTarget: lockOnTarget // Auto-home to nearest target
        });

        return plasmaTorp;
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle reloading
        if (this.loaded < this.maxLoaded) {
            if (currentTime - this.lastFireTime >= this.reloadDelay) {
                if (!this.isReloading) {
                    this.isReloading = true;
                    this.reloadStartTime = currentTime;
                }

                // Reload 1 plasma torpedo after 8 seconds
                const timeSinceReloadStart = currentTime - this.reloadStartTime;
                if (timeSinceReloadStart >= 0) {
                    this.loaded = 1;
                    this.isReloading = false;
                }
            }
        } else {
            this.isReloading = false;
        }
    }

    getLoadedCount() {
        return this.loaded;
    }

    getStoredCount() {
        return 0; // No stored plasma torps
    }
}
