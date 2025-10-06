/**
 * Star Sea - Torpedo Launcher Component
 */

class TorpedoLauncher extends Weapon {
    constructor(config) {
        super(config);
        this.loaded = config.loaded || CONFIG.TORPEDO_LOADED;
        this.maxLoaded = config.maxLoaded || CONFIG.TORPEDO_LOADED;
        this.stored = config.stored || CONFIG.TORPEDO_STORED;
        this.blastRadius = config.blastRadius || CONFIG.TORPEDO_BLAST_RADIUS_PIXELS;
        this.speed = config.speed || (CONFIG.TORPEDO_SPEED_MULTIPLIER * CONFIG.MAX_SPEED_CA);
        this.lifetime = CONFIG.TORPEDO_LIFETIME;
        this.reloadTime = CONFIG.TORPEDO_RELOAD_TIME; // 5 seconds to reload all 4
        this.reloadStartTime = 0;
        this.isReloading = false;
        this.damage = CONFIG.TORPEDO_DAMAGE;
    }

    canFire(currentTime) {
        if (!super.canFire()) return false;
        return this.loaded > 0;
    }

    fire(ship, targetX, targetY, currentTime, lockOnTarget = null) {
        if (!this.canFire(currentTime)) {
            if (CONFIG.DEBUG_MODE && ship.isPlayer) {
                console.log('Torpedo cannot fire:', {
                    disabled: this.disabled,
                    hp: this.hp,
                    loaded: this.loaded,
                    stored: this.stored
                });
            }
            return null;
        }

        this.loaded--;
        this.lastFireTime = currentTime;

        if (CONFIG.DEBUG_MODE && ship.isPlayer) {
            console.log('Torpedo fired!', {
                loaded: this.loaded,
                stored: this.stored
            });
        }

        // Start reload timer when we run out of loaded torpedoes
        if (this.loaded === 0 && this.stored > 0 && !this.isReloading) {
            this.reloadStartTime = currentTime;
            this.isReloading = true;
        }

        // Create torpedo projectile
        const torpedo = new TorpedoProjectile({
            x: ship.x,
            y: ship.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.damage,
            blastRadius: this.blastRadius,
            speed: this.speed,
            lifetime: this.lifetime,
            sourceShip: ship,
            lockOnTarget: lockOnTarget // Fire-and-forget
        });

        return torpedo;
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle reloading - reload all 4 torpedoes at once after 5 seconds
        if (this.isReloading && this.stored > 0) {
            const timeSinceReloadStart = currentTime - this.reloadStartTime;

            if (timeSinceReloadStart >= this.reloadTime) {
                // Reload all torpedoes at once
                const torpsToReload = Math.min(this.maxLoaded, this.stored);
                this.loaded = torpsToReload;
                this.stored -= torpsToReload;
                this.isReloading = false;

                if (CONFIG.DEBUG_MODE) {
                    console.log('Torpedoes reloaded:', {
                        loaded: this.loaded,
                        stored: this.stored
                    });
                }
            }
        }
    }

    getLoadedCount() {
        return this.loaded;
    }

    getStoredCount() {
        return this.stored;
    }
}
