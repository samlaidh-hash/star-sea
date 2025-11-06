/**
 * Star Sea - Beam Weapon Component
 */

class BeamWeapon extends Weapon {
    constructor(config) {
        super(config);
        this.range = config.range || CONFIG.BEAM_RANGE_PIXELS;
        this.speed = CONFIG.BEAM_SPEED;
        this.damage = config.damage || CONFIG.BEAM_DAMAGE; // 1 damage
        this.cooldown = config.cooldown || CONFIG.BEAM_COOLDOWN; // 1 second
    }

    canFire(currentTime, ship = null) {
        if (!super.canFire()) return false;

        // Apply crew skill tactical bonus to cooldown (faster reload)
        let effectiveCooldown = this.cooldown;
        if (ship && ship.crewSkills) {
            const bonuses = ship.crewSkills.getTacticalBonuses();
            effectiveCooldown = this.cooldown / bonuses.reloadMult;
        }

        // Check cooldown (1 second between shots by default)
        if (currentTime - this.lastFireTime < effectiveCooldown) return false;

        return true;
    }

    fire(ship, targetX, targetY, currentTime) {
        if (!this.canFire(currentTime, ship)) return null;

        this.lastFireTime = currentTime;

        // Calculate firing point based on weapon position and ship weapon points
        const firingPoint = this.calculateFiringPoint(ship, targetX, targetY);

        // Create beam projectile starting at the firing point
        const beam = new BeamProjectile({
            x: firingPoint.x, // Start at calculated firing point
            y: firingPoint.y,
            rotation: ship.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.damage,
            range: this.range,
            speed: this.speed,
            sourceShip: ship,
            sourceWeapon: this
        });

        return beam;
    }

    calculateFiringPoint(ship, targetX, targetY) {
        // Debug logging
        if (isNaN(ship.x) || isNaN(ship.y) || isNaN(ship.rotation)) {
            console.error('🔴 Ship has NaN values:', {
                x: ship.x,
                y: ship.y,
                rotation: ship.rotation
            });
        }

        // Determine which weapon band to use based on weapon arc
        let band = null;

        if (this.arcCenter === 0 && ship.weaponPoints.forwardBeamBand) {
            // Forward-facing weapon
            band = ship.weaponPoints.forwardBeamBand;
        } else if (this.arcCenter === 180 && ship.weaponPoints.aftBeamPoint) {
            // Aft-facing weapon
            band = ship.weaponPoints.aftBeamPoint;
        } else if (this.arcCenter === 270 && ship.weaponPoints.portBeamPoint) {
            // Port-facing weapon (Strike Cruiser)
            band = ship.weaponPoints.portBeamPoint;
        } else if (this.arcCenter === 90 && ship.weaponPoints.starboardBeamPoint) {
            // Starboard-facing weapon (Strike Cruiser)
            band = ship.weaponPoints.starboardBeamPoint;
        }

        // Handle different band types
        if (!band) {
            return { x: ship.x, y: ship.y };
        }

        if (band.type === 'ellipse') {
            return this.findNearestPointOnEllipse(band, ship.x, ship.y, ship.rotation, targetX, targetY);
        } else if (band.type === 'rectangle') {
            return this.findNearestPointOnRectangle(band, ship.x, ship.y, ship.rotation, targetX, targetY);
        } else if (band.type === 'point') {
            // Calculate point in world space
            const worldRad = MathUtils.toRadians(ship.rotation);
            const worldCos = Math.cos(worldRad);
            const worldSin = Math.sin(worldRad);
            const worldX = ship.x + (band.x * worldCos - band.y * worldSin);
            const worldY = ship.y + (band.x * worldSin + band.y * worldCos);
            return { x: worldX, y: worldY };
        }

        // Default to ship center
        return { x: ship.x, y: ship.y };
    }

    findNearestPointOnRectangle(band, shipX, shipY, shipRotation, targetX, targetY) {
        // Convert target to local ship space
        const worldRad = MathUtils.toRadians(shipRotation);
        const worldCos = Math.cos(worldRad);
        const worldSin = Math.sin(worldRad);

        const relX = targetX - shipX;
        const relY = targetY - shipY;
        const localTargetX = relX * worldCos + relY * worldSin;
        const localTargetY = -relX * worldSin + relY * worldCos;

        // Calculate angle to target
        const dx = localTargetX - band.x;
        const dy = localTargetY - band.y;

        // Rectangle dimensions
        const halfWidth = band.width / 2;
        const halfHeight = band.height / 2;

        // Find nearest point on rectangle edge
        // For a horizontal rectangle at the aft, we want points along the top edge
        let localX = band.x;
        let localY = band.y;

        // Clamp X to rectangle bounds
        if (Math.abs(dx) > 0.01) {
            localX = Math.max(band.x - halfWidth, Math.min(band.x + halfWidth, localTargetX));
        }

        // Use top edge of rectangle (toward front of ship)
        localY = band.y - halfHeight;

        // Convert back to world coordinates
        const worldX = shipX + (localX * worldCos - localY * worldSin);
        const worldY = shipY + (localX * worldSin + localY * worldCos);

        return { x: worldX, y: worldY };
    }

    findNearestPointOnEllipse(band, shipX, shipY, shipRotation, targetX, targetY) {
        // Step 1: Convert target from world space to ship's local space
        const worldRad = MathUtils.toRadians(shipRotation);
        const worldCos = Math.cos(worldRad);
        const worldSin = Math.sin(worldRad);

        // Translate target relative to ship, then rotate into ship's frame
        const relX = targetX - shipX;
        const relY = targetY - shipY;
        const localTargetX = relX * worldCos + relY * worldSin;
        const localTargetY = -relX * worldSin + relY * worldCos;

        // Step 2: Calculate angle from ellipse center to target (in local space)
        // Use game's angle convention: atan2(dx, -dy) where 0° = up, clockwise
        const dx = localTargetX - band.centerX;
        const dy = localTargetY - band.centerY;
        const angleToTargetDeg = Math.atan2(dx, -dy) * 180 / Math.PI;
        const angleToTarget = MathUtils.toRadians(angleToTargetDeg);

        // Step 3: Convert to standard angle for polar equation (0° = right, counterclockwise)
        // Game uses 0° = up, clockwise; Standard uses 0° = right, counterclockwise
        // Conversion: standardAngle = 90° - gameAngle
        const standardAngle = MathUtils.toRadians(90 - angleToTargetDeg);

        // Use polar equation to find point on ellipse at this angle
        // r(θ) = (rx * ry) / sqrt((ry*cos(θ))² + (rx*sin(θ))²)
        const rx = band.radiusX;
        const ry = band.radiusY;
        const cosAngle = Math.cos(standardAngle);
        const sinAngle = Math.sin(standardAngle);
        const r = (rx * ry) / Math.sqrt((ry * cosAngle) ** 2 + (rx * sinAngle) ** 2);

        // Calculate point on ellipse along this ray (relative to ellipse center)
        // Use standard angle for x,y calculation
        // Note: Flip y because canvas has +y down, but standard coords have +y up
        const localX = band.centerX + r * cosAngle;
        const localY = band.centerY - r * sinAngle;

        // Step 4: Convert back to world coordinates
        const worldX = shipX + (localX * worldCos - localY * worldSin);
        const worldY = shipY + (localX * worldSin + localY * worldCos);

        if (isNaN(worldX) || isNaN(worldY)) {
            console.error('🔴 Ellipse calculation produced NaN:', {
                shipX, shipY, shipRotation,
                localX, localY,
                worldCos, worldCos,
                worldSin,
                worldX, worldY,
                band
            });
        }

        return { x: worldX, y: worldY };
    }

    update(deltaTime, currentTime) {
        // Call parent auto-repair
        super.update(deltaTime, currentTime);
    }

    getCooldownPercentage(currentTime) {
        // Returns 0-1, where 1 = ready to fire, 0 = just fired
        const timeSinceLastFire = currentTime - this.lastFireTime;
        return Math.min(timeSinceLastFire / this.cooldown, 1);
    }
}
