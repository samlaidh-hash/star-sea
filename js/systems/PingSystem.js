/**
 * Star Sea - Ping System
 * Handles sensor ping functionality:
 * - P key activates ping for 20 seconds
 * - Doubles sensor range during active ping
 * - Reveals mines and cloaked ships
 * - 60 second cooldown after ping ends
 */

class PingSystem {
    constructor() {
        this.ship = null;

        // Ping state
        this.isActive = false;
        this.activeDuration = 20; // 20 seconds active duration
        this.activeTimeRemaining = 0;

        // Cooldown state
        this.isCooldown = false;
        this.cooldownDuration = 60; // 60 seconds cooldown
        this.cooldownTimeRemaining = 0;

        // Sensor multiplier
        this.sensorRangeMultiplier = 2.0; // Doubles sensor range when active

        // Visual effect state
        this.pingWaveRadius = 0;
        this.pingWaveMaxRadius = 0;
        this.pingWaveActive = false;
        this.pingWaveSpeed = 5000; // pixels per second
    }

    /**
     * Initialize with ship reference
     */
    init(ship) {
        this.ship = ship;
    }

    /**
     * Update ping system state
     */
    update(deltaTime) {
        // Update active ping
        if (this.isActive) {
            this.activeTimeRemaining -= deltaTime;

            if (this.activeTimeRemaining <= 0) {
                this.deactivate();
            }
        }

        // Update cooldown
        if (this.isCooldown) {
            this.cooldownTimeRemaining -= deltaTime;

            if (this.cooldownTimeRemaining <= 0) {
                this.isCooldown = false;
                this.cooldownTimeRemaining = 0;
            }
        }

        // Update ping wave visual effect
        if (this.pingWaveActive) {
            this.pingWaveRadius += this.pingWaveSpeed * deltaTime;

            // Stop wave when it reaches max radius
            if (this.pingWaveRadius >= this.pingWaveMaxRadius) {
                this.pingWaveActive = false;
                this.pingWaveRadius = 0;
            }
        }
    }

    /**
     * Activate ping (P key pressed)
     * @returns {boolean} True if ping activated, false if on cooldown
     */
    activate() {
        // Can't activate if already active or on cooldown
        if (this.isActive || this.isCooldown) {
            return false;
        }

        this.isActive = true;
        this.activeTimeRemaining = this.activeDuration;

        // Start visual wave effect
        this.startPingWave();

        // Play ping sound
        if (window.audioSystem) {
            window.audioSystem.play('lock-acquired'); // Reuse existing sound
        }

        // Emit event
        eventBus.emit('ping-activated', {
            duration: this.activeDuration,
            rangeMultiplier: this.sensorRangeMultiplier
        });

        return true;
    }

    /**
     * Deactivate ping and start cooldown
     */
    deactivate() {
        this.isActive = false;
        this.activeTimeRemaining = 0;

        // Start cooldown
        this.isCooldown = true;
        this.cooldownTimeRemaining = this.cooldownDuration;

        // Emit event
        eventBus.emit('ping-deactivated', { cooldown: this.cooldownDuration });
    }

    /**
     * Start visual ping wave effect
     */
    startPingWave() {
        if (!this.ship) return;

        // Get current sensor range to determine max wave radius
        const baseDetectionRadius = this.getBaseDetectionRadius();
        this.pingWaveMaxRadius = baseDetectionRadius * this.sensorRangeMultiplier;
        this.pingWaveRadius = 0;
        this.pingWaveActive = true;
    }

    /**
     * Get base detection radius for current ship
     */
    getBaseDetectionRadius() {
        if (!this.ship) return CONFIG.DETECTION_RADIUS_CA_PIXELS;

        const detectionKey = `DETECTION_RADIUS_${this.ship.shipClass}_PIXELS`;
        return CONFIG[detectionKey] || CONFIG.DETECTION_RADIUS_CA_PIXELS;
    }

    /**
     * Get current sensor range (with ping multiplier if active)
     */
    getSensorRange() {
        const baseRange = this.getBaseDetectionRadius();
        return this.isActive ? baseRange * this.sensorRangeMultiplier : baseRange;
    }

    /**
     * Check if entity should be revealed by ping
     * Reveals mines and cloaked ships
     */
    isEntityRevealed(entity) {
        if (!this.isActive) return false;
        if (!this.ship) return false;

        // Calculate distance from ship to entity
        const distance = MathUtils.distance(this.ship.x, this.ship.y, entity.x, entity.y);
        const pingRange = this.getSensorRange();

        // Entity must be within ping range
        if (distance > pingRange) return false;

        // Reveal mines
        if (entity.type === 'mine') {
            return true;
        }

        // Reveal cloaked ships
        if (entity.cloaked === true) {
            return true;
        }

        return false;
    }

    /**
     * Get status for HUD display
     */
    getStatus() {
        return {
            isActive: this.isActive,
            activeTimeRemaining: this.activeTimeRemaining,
            isCooldown: this.isCooldown,
            cooldownTimeRemaining: this.cooldownTimeRemaining,
            cooldownProgress: this.isCooldown ?
                (this.cooldownDuration - this.cooldownTimeRemaining) / this.cooldownDuration : 1.0
        };
    }

    /**
     * Get ping wave data for rendering
     */
    getPingWaveData() {
        if (!this.pingWaveActive || !this.ship) return null;

        return {
            x: this.ship.x,
            y: this.ship.y,
            radius: this.pingWaveRadius,
            maxRadius: this.pingWaveMaxRadius,
            alpha: 1.0 - (this.pingWaveRadius / this.pingWaveMaxRadius) // Fade out as it expands
        };
    }
}
