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

        // Calculate firing point offset from ship center
        const firingPoint = this.calculateFiringPoint(ship);

        // Create plasma torpedo projectile
        const plasmaTorp = new PlasmaTorpedoProjectile({
            x: firingPoint.x,
            y: firingPoint.y,
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

    /**
     * Calculate plasma torpedo firing point from weapon mount position
     */
    calculateFiringPoint(ship) {
        // Get ship size for proper offset calculation
        const shipSize = ship.getShipSize ? ship.getShipSize() : 40;

        // Use weapon position if available
        if (this.position) {
            const worldRad = MathUtils.toRadians(ship.rotation);
            const worldCos = Math.cos(worldRad);
            const worldSin = Math.sin(worldRad);

            // Apply weapon mount position with additional forward offset to clear ship hull
            const forwardOffset = shipSize * 0.9; // 90% of ship size forward (increased from 60%)
            const totalX = this.position.x;
            const totalY = this.position.y - forwardOffset; // Negative Y = forward

            const worldX = ship.x + (totalX * worldCos - totalY * worldSin);
            const worldY = ship.y + (totalX * worldSin + totalY * worldCos);
            return { x: worldX, y: worldY };
        }

        // Fallback: offset forward from ship center (large offset to clear ship)
        const offset = shipSize * 1.1; // 110% of ship size forward (increased from 75%)
        const worldRad = MathUtils.toRadians(ship.rotation);
        return {
            x: ship.x + Math.sin(worldRad) * offset,
            y: ship.y - Math.cos(worldRad) * offset
        };
    }
}
