/**
 * Star Sea - Shield Component
 * Four independent shield quadrants with recovery
 */

class ShieldQuadrant {
    constructor(maxStrength, generatorHP) {
        this.current = maxStrength;
        this.max = maxStrength;
        this.generatorHP = generatorHP;
        this.generatorMaxHP = generatorHP;
        this.lastHitTime = 0;
        this.recovering = false;
    }

    takeDamage(damage, currentTime) {
        const actualDamage = Math.min(damage, this.current);
        this.current -= actualDamage;
        this.lastHitTime = currentTime;
        this.recovering = false;
        return damage - actualDamage; // Return overflow damage
    }

    update(deltaTime, currentTime) {
        // Update max strength based on generator HP
        if (this.generatorHP <= 0) {
            this.max = 0;
            this.current = 0;
            return;
        }

        // Calculate max strength proportional to generator HP
        const generatorEfficiency = this.generatorHP / this.generatorMaxHP;
        const baseMax = this.generatorMaxHP === 8 ?
            (this.generatorMaxHP === 8 && this.max > 15 ? 20 : 15) : 10;
        this.max = Math.floor(baseMax * generatorEfficiency);
        this.current = Math.min(this.current, this.max);

        // Check if can start recovering
        if (this.current < this.max) {
            const timeSinceHit = currentTime - this.lastHitTime;
            if (timeSinceHit >= CONFIG.SHIELD_RECOVERY_DELAY) {
                if (!this.recovering) {
                    this.recovering = true;
                }
                // Recover shield strength
                this.current = Math.min(this.max, this.current + CONFIG.SHIELD_RECOVERY_RATE * deltaTime);
            }
        } else {
            this.recovering = false;
        }
    }

    getPercentage() {
        return this.max > 0 ? this.current / this.max : 0;
    }
}

class ShieldSystem {
    constructor(config) {
        this.fore = new ShieldQuadrant(
            config.fore?.strength || CONFIG.SHIELD_STRENGTH_FORE_CA,
            config.fore?.generatorHP || CONFIG.SYSTEM_HP_SHIELD_GEN
        );
        this.aft = new ShieldQuadrant(
            config.aft?.strength || CONFIG.SHIELD_STRENGTH_AFT_CA,
            config.aft?.generatorHP || CONFIG.SYSTEM_HP_SHIELD_GEN
        );
        this.port = new ShieldQuadrant(
            config.port?.strength || CONFIG.SHIELD_STRENGTH_PORT_CA,
            config.port?.generatorHP || CONFIG.SYSTEM_HP_SHIELD_GEN
        );
        this.starboard = new ShieldQuadrant(
            config.starboard?.strength || CONFIG.SHIELD_STRENGTH_STARBOARD_CA,
            config.starboard?.generatorHP || CONFIG.SYSTEM_HP_SHIELD_GEN
        );

        this.visualEffects = {
            fore: { alpha: 0, hitTime: 0 },
            aft: { alpha: 0, hitTime: 0 },
            port: { alpha: 0, hitTime: 0 },
            starboard: { alpha: 0, hitTime: 0 }
        };
    }

    /**
     * Apply damage to appropriate quadrant based on hit angle
     */
    applyDamage(shipRotation, impactAngle, damage, currentTime) {
        const quadrant = this.getQuadrantFromAngle(shipRotation, impactAngle);
        const shield = this[quadrant];

        // Visual effect
        this.visualEffects[quadrant].alpha = 1.0;
        this.visualEffects[quadrant].hitTime = currentTime;

        // Apply damage and return overflow
        return shield.takeDamage(damage, currentTime);
    }

    /**
     * Determine which quadrant is hit based on angles
     */
    getQuadrantFromAngle(shipRotation, impactAngle) {
        // Calculate relative angle (impact relative to ship facing)
        let relativeAngle = impactAngle - shipRotation;
        while (relativeAngle < 0) relativeAngle += 360;
        while (relativeAngle >= 360) relativeAngle -= 360;

        // Quadrants: 0° = fore, 90° = starboard, 180° = aft, 270° = port
        if (relativeAngle >= 315 || relativeAngle < 45) {
            return 'fore';
        } else if (relativeAngle >= 45 && relativeAngle < 135) {
            return 'starboard';
        } else if (relativeAngle >= 135 && relativeAngle < 225) {
            return 'aft';
        } else {
            return 'port';
        }
    }

    update(deltaTime, currentTime) {
        this.fore.update(deltaTime, currentTime);
        this.aft.update(deltaTime, currentTime);
        this.port.update(deltaTime, currentTime);
        this.starboard.update(deltaTime, currentTime);

        // Update visual effects (fade out)
        for (const quadrant in this.visualEffects) {
            const effect = this.visualEffects[quadrant];
            if (effect.alpha > 0) {
                effect.alpha = Math.max(0, effect.alpha - deltaTime * 2);
            }
        }
    }

    /**
     * Get all quadrants
     */
    getAllQuadrants() {
        return {
            fore: this.fore,
            aft: this.aft,
            port: this.port,
            starboard: this.starboard
        };
    }
}
