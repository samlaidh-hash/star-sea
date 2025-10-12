/**
 * Star Sea - Dual Torpedo Launcher Component
 * Fires torpedoes into both forward and aft 90-degree arcs
 */

class DualTorpedoLauncher extends Weapon {
    constructor(config) {
        super(config);
        this.loaded = config.loaded || CONFIG.TORPEDO_LOADED;
        this.maxLoaded = config.maxLoaded || CONFIG.TORPEDO_LOADED;
        this.stored = config.stored || CONFIG.TORPEDO_STORED;
        this.blastRadius = config.blastRadius || CONFIG.TORPEDO_BLAST_RADIUS_PIXELS;
        this.speed = config.speed || CONFIG.TORPEDO_SPEED_CA;
        this.lifetime = CONFIG.TORPEDO_LIFETIME;
        this.reloadTime = CONFIG.TORPEDO_RELOAD_TIME; // 5 seconds to reload all
        this.reloadStartTime = 0;
        this.isReloading = false;
        this.damage = CONFIG.TORPEDO_DAMAGE;

        // Dual launcher can fire forward or aft
        this.arcCenters = config.arcCenters || [0, 180]; // Forward and aft arcs
    }

    canFire(currentTime) {
        if (!super.canFire()) return false;
        return this.loaded > 0;
    }

    fire(ship, targetX, targetY, currentTime, lockOnTarget = null) {
        if (!this.canFire(currentTime)) {
            if (CONFIG.DEBUG_MODE && ship.isPlayer) {
                console.log('Dual Torpedo cannot fire:', {
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
            console.log('Dual Torpedo fired!', {
                loaded: this.loaded,
                stored: this.stored
            });
        }

        // Start reload timer when we run out of loaded torpedoes
        if (this.loaded === 0 && this.stored > 0 && !this.isReloading) {
            this.reloadStartTime = currentTime;
            this.isReloading = true;
        }

        // Determine which arc to fire from based on target direction
        const angleToTarget = MathUtils.angleBetween(ship.x, ship.y, targetX, targetY);
        const relativeAngle = MathUtils.angleDifference(ship.rotation, angleToTarget);
        
        // Choose the closest arc (forward or aft)
        let firingArc = 0; // Default to forward
        let minAngleDiff = Math.abs(relativeAngle);
        
        for (const arcCenter of this.arcCenters) {
            const angleDiff = Math.abs(MathUtils.angleDifference(arcCenter, relativeAngle));
            if (angleDiff < minAngleDiff) {
                minAngleDiff = angleDiff;
                firingArc = arcCenter;
            }
        }

        // Calculate firing point offset from ship center
        const firingPoint = this.calculateFiringPoint(ship);

        // Determine torpedo type based on ship selection
        const torpedoType = ship.selectedTorpedoType || 'standard';
        let torpedo = null;

        switch (torpedoType) {
            case 'heavy':
                torpedo = new HeavyTorpedo({
                    x: firingPoint.x,
                    y: firingPoint.y,
                    rotation: ship.rotation,
                    targetX: targetX,
                    targetY: targetY,
                    damage: 3,
                    blastRadius: this.blastRadius * 1.5,
                    speed: this.speed * 0.8,
                    lifetime: this.lifetime * 1.2,
                    sourceShip: ship,
                    lockOnTarget: lockOnTarget,
                    firingArc: firingArc
                });
                break;

            case 'quantum':
                torpedo = new QuantumTorpedo({
                    x: firingPoint.x,
                    y: firingPoint.y,
                    rotation: ship.rotation,
                    targetX: targetX,
                    targetY: targetY,
                    damage: this.damage,
                    blastRadius: this.blastRadius,
                    speed: this.speed,
                    lifetime: this.lifetime,
                    sourceShip: ship,
                    lockOnTarget: lockOnTarget,
                    firingArc: firingArc
                });
                break;

            case 'gravity':
                torpedo = new GravityTorpedo({
                    x: firingPoint.x,
                    y: firingPoint.y,
                    rotation: ship.rotation,
                    targetX: targetX,
                    targetY: targetY,
                    damage: this.damage,
                    blastRadius: this.blastRadius,
                    speed: this.speed,
                    lifetime: this.lifetime,
                    sourceShip: ship,
                    lockOnTarget: lockOnTarget,
                    firingArc: firingArc,
                    gravityWellDuration: 10.0,
                    gravityWellStrength: 0.3
                });
                break;

            case 'standard':
            default:
                torpedo = new TorpedoProjectile({
                    x: firingPoint.x,
                    y: firingPoint.y,
                    rotation: ship.rotation,
                    targetX: targetX,
                    targetY: targetY,
                    damage: this.damage,
                    blastRadius: this.blastRadius,
                    speed: this.speed,
                    lifetime: this.lifetime,
                    sourceShip: ship,
                    lockOnTarget: lockOnTarget,
                    firingArc: firingArc
                });
                break;
        }

        return torpedo;
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);

        // Handle reloading - reload all torpedoes at once after 5 seconds
        if (this.isReloading && this.stored > 0) {
            const timeSinceReloadStart = currentTime - this.reloadStartTime;

            if (timeSinceReloadStart >= this.reloadTime) {
                // Reload all torpedoes at once
                const torpsToReload = Math.min(this.maxLoaded, this.stored);
                this.loaded = torpsToReload;
                this.stored -= torpsToReload;
                this.isReloading = false;

                if (CONFIG.DEBUG_MODE) {
                    console.log('Dual Torpedoes reloaded:', {
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

    /**
     * Check if target is in firing arc (either forward or aft)
     */
    isInArc(targetAngle, shipRotation) {
        const relativeAngle = MathUtils.angleDifference(shipRotation, targetAngle);
        
        // Check if target is in any of the allowed arcs
        for (const arcCenter of this.arcCenters) {
            const arcStart = arcCenter - 45; // 90-degree arc centered on arcCenter
            const arcEnd = arcCenter + 45;
            
            if (this.isAngleInRange(relativeAngle, arcStart, arcEnd)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Helper to check if angle is within range (handles wraparound)
     */
    isAngleInRange(angle, start, end) {
        // Normalize angles to 0-360
        angle = ((angle % 360) + 360) % 360;
        start = ((start % 360) + 360) % 360;
        end = ((end % 360) + 360) % 360;

        if (start <= end) {
            return angle >= start && angle <= end;
        } else {
            // Handle wraparound case
            return angle >= start || angle <= end;
        }
    }

    /**
     * Calculate torpedo firing point from weapon mount position
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
            const forwardOffset = shipSize * 0.6; // 60% of ship size forward
            const totalX = this.position.x;
            const totalY = this.position.y - forwardOffset; // Negative Y = forward

            const worldX = ship.x + (totalX * worldCos - totalY * worldSin);
            const worldY = ship.y + (totalX * worldSin + totalY * worldCos);
            return { x: worldX, y: worldY };
        }

        // Fallback: offset forward from ship center (large offset to clear ship)
        const offset = shipSize * 0.75; // 75% of ship size forward
        const worldRad = MathUtils.toRadians(ship.rotation);
        return {
            x: ship.x + Math.sin(worldRad) * offset,
            y: ship.y - Math.cos(worldRad) * offset
        };
    }
}

