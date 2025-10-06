/**
 * Star Sea - Base Weapon Component
 */

class Weapon {
    constructor(config) {
        this.name = config.name || 'Weapon';
        this.hp = config.hp || 4;
        this.maxHp = config.hp || 4;
        this.position = config.position || { x: 0, y: 0 }; // Local position on ship
        this.arc = config.arc || 270; // Degrees
        this.arcCenter = config.arcCenter !== undefined ? config.arcCenter : 0; // 0=ahead, 90=starboard, 180=astern, 270=port
        this.arcCenters = Array.isArray(config.arcCenters) && config.arcCenters.length > 0 ? config.arcCenters.slice() : null;
        this.damage = config.damage || 1;
        this.disabled = false;
        this.lastFireTime = 0;
    }

    /**
     * Check if target angle is within firing arc
     */
    isInArc(targetAngle, shipRotation) {
        const centers = this.arcCenters && this.arcCenters.length > 0 ? this.arcCenters : [this.arcCenter];
        for (const center of centers) {
            const absoluteArcCenter = MathUtils.normalizeAngle(shipRotation + center);
            if (MathUtils.isInArc(targetAngle, absoluteArcCenter, this.arc)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Take damage
     */
    takeDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
        if (this.hp === 0) {
            this.disabled = true;
        }
    }

    /**
     * Repair (auto-repair system)
     */
    repair(amount) {
        if (this.hp > 0) {
            this.hp = Math.min(this.maxHp, this.hp + amount);
            if (this.hp > 0) {
                this.disabled = false;
            }
        }
    }

    /**
     * Auto-repair (0.03 HP/sec until system reaches 0 HP, then stops)
     */
    autoRepair(deltaTime) {
        if (this.hp > 0 && this.hp < this.maxHp) {
            this.repair(CONFIG.AUTO_REPAIR_RATE * deltaTime);
        }
    }

    canFire() {
        return !this.disabled && this.hp > 0;
    }

    isOperational() {
        return this.hp > 0;
    }

    update(deltaTime, currentTime) {
        // Auto-repair first
        this.autoRepair(deltaTime);
        // Override in subclasses for additional behavior
    }

    fire(ship, targetX, targetY, currentTime) {
        // Override in subclasses
        return null;
    }
}




