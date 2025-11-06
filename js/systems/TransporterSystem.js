/**
 * Star Sea - Transporter System
 * T key toggles mode, auto-fires when close + target shields down
 * Instantly transports crew, drops player's facing shield
 */

class TransporterSystem {
    constructor(ship) {
        this.ship = ship;
        this.modeActive = false; // T key toggles this
        this.maxRange = 0; // Will be set based on ship length
        this.lastTransportTime = 0;
        this.transportCooldown = 5.0; // 5 second cooldown
        this.transportEffect = 0; // Visual effect timer
    }

    /**
     * Initialize system with ship reference
     */
    init(ship) {
        this.ship = ship;
    }

    /**
     * Toggle transporter mode on/off
     */
    toggle() {
        this.modeActive = !this.modeActive;
        console.log(`Transporter mode: ${this.modeActive ? 'ON' : 'OFF'}`);
    }

    /**
     * Attempt transport if conditions are met
     */
    attemptTransport(entities, currentTime) {
        if (!this.modeActive) return;
        if (!this.canUseTransporter(currentTime)) return;

        // Set range based on ship length
        this.maxRange = this.ship.length * 10;

        // Find nearest enemy ship
        const target = this.findNearestEnemyShip(entities);
        if (!target) return;

        // Calculate distance
        const dx = target.x - this.ship.x;
        const dy = target.y - this.ship.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Check conditions: within range AND target shields are down
        if (dist <= this.maxRange && target.shields && target.shields.getTotal() === 0) {
            this.executeTransport(target, currentTime);
        }
    }

    /**
     * Find nearest enemy ship
     */
    findNearestEnemyShip(entities) {
        let nearest = null;
        let nearestDist = Infinity;

        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === this.ship) continue;
            if (entity.type !== 'ship') continue;
            if (entity.faction === this.ship.faction) continue; // Skip allies

            const dx = entity.x - this.ship.x;
            const dy = entity.y - this.ship.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.maxRange && dist < nearestDist) {
                nearest = entity;
                nearestDist = dist;
            }
        }

        return nearest;
    }

    /**
     * Execute instant transport
     */
    executeTransport(target, currentTime) {
        // Drop player's facing shield
        if (this.ship.shields) {
            this.ship.shields.dropFacingShield();
        }

        // Transport crew (for now, just damage target)
        if (target.hp) {
            const transportDamage = 20; // Crew transport damage
            target.hp -= transportDamage;
            console.log(`Transported crew to ${target.name || target.faction}, dealt ${transportDamage} damage`);
        }

        // Play transporter sound
        if (window.audioManager) {
            window.audioManager.playSound('transporter');
        }

        // Visual effect
        this.transportEffect = 1.0;

        // Set cooldown
        this.lastTransportTime = currentTime;
    }

    /**
     * Check if transporter is off cooldown
     */
    canUseTransporter(currentTime) {
        return (currentTime - this.lastTransportTime) >= this.transportCooldown;
    }

    /**
     * Update transporter system
     */
    update(deltaTime, entities, currentTime) {
        // Try to auto-fire if mode is active
        this.attemptTransport(entities, currentTime);

        // Update visual effect
        if (this.transportEffect > 0) {
            this.transportEffect -= deltaTime * 2;
            if (this.transportEffect < 0) this.transportEffect = 0;
        }
    }

    /**
     * Render transporter effect (optional visual indicator)
     */
    render(ctx, camera) {
        if (this.transportEffect <= 0) return;

        const playerPos = camera.worldToScreen(this.ship.x, this.ship.y);

        ctx.save();

        // Draw pulsing circle around player ship
        const radius = 30 + (1 - this.transportEffect) * 50;
        const alpha = this.transportEffect * 0.8;

        ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(playerPos.x, playerPos.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Get system status
     */
    getStatus() {
        return {
            modeActive: this.modeActive,
            range: this.maxRange,
            cooldownReady: this.transportEffect === 0
        };
    }
}
