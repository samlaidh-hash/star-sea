/**
 * Star Sea - Transporter System
 * Handles beaming objects between ships and locations
 */

class TransporterSystem {
    constructor() {
        this.playerShip = null;
        this.isActive = false;
        this.transportTarget = null;
        this.transportProgress = 0;
        this.transportDuration = 3.0; // 3 seconds to transport
        this.transportRange = 200; // Transport range in pixels
        this.lastTransportTime = 0;
        this.transportCooldown = 5.0; // 5 second cooldown between transports
    }

    init(playerShip) {
        this.playerShip = playerShip;
        eventBus.on('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        if (event.key === 't' && this.playerShip) {
            this.toggleTransporter();
        }
    }

    toggleTransporter() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    activate() {
        if (!this.playerShip || !this.playerShip.isOperational()) return;

        // Find transportable target
        this.transportTarget = this.findTransportTarget();

        if (this.transportTarget) {
            this.isActive = true;
            this.transportProgress = 0;
            eventBus.emit('transporter-activated', { target: this.transportTarget });
            console.log(`Transporter activated on ${this.transportTarget.name || this.transportTarget.type}`);
        } else {
            console.log('No valid target for transporter.');
        }
    }

    deactivate() {
        if (this.isActive) {
            this.isActive = false;
            this.transportProgress = 0;
            eventBus.emit('transporter-deactivated', { target: this.transportTarget });
            console.log('Transporter deactivated.');
        }
        this.transportTarget = null;
    }

    findTransportTarget() {
        // Priority: mines, shuttles, torpedoes, small ships
        const entitiesInRange = window.game.entities.filter(e =>
            e.active &&
            e !== this.playerShip &&
            MathUtils.distance(this.playerShip.x, this.playerShip.y, e.x, e.y) <= this.transportRange
        );

        // Sort by priority and distance
        entitiesInRange.sort((a, b) => {
            const priorityA = this.getTransportPriority(a);
            const priorityB = this.getTransportPriority(b);

            if (priorityA !== priorityB) {
                return priorityB - priorityA; // Higher priority first
            }
            return MathUtils.distance(this.playerShip.x, this.playerShip.y, a.x, a.y) -
                   MathUtils.distance(this.playerShip.x, this.playerShip.y, b.x, b.y); // Closer first
        });

        for (const entity of entitiesInRange) {
            if (this.canTransport(entity)) {
                return entity;
            }
        }
        return null;
    }

    getTransportPriority(entity) {
        switch (entity.type) {
            case 'mine': return 4;
            case 'shuttle': return 3;
            case 'torpedo': return 2;
            case 'ship': return 1;
            default: return -1;
        }
    }

    canTransport(entity) {
        switch (entity.type) {
            case 'mine':
            case 'shuttle':
            case 'torpedo':
                return true;
            case 'ship':
                // Can only transport ships smaller than player
                return this.playerShip.getShipSizeValue() > entity.getShipSizeValue();
            default:
                return false;
        }
    }

    update(deltaTime, currentTime) {
        if (!this.isActive || !this.transportTarget || !this.playerShip || !this.playerShip.active) {
            this.deactivate();
            return;
        }

        // Check if target is still valid
        if (!this.transportTarget.active ||
            MathUtils.distance(this.playerShip.x, this.playerShip.y, this.transportTarget.x, this.transportTarget.y) > this.transportRange * 1.2) {
            this.deactivate();
            return;
        }

        // Update transport progress
        this.transportProgress += deltaTime;

        // Check if transport is complete
        if (this.transportProgress >= this.transportDuration) {
            this.completeTransport();
        }
    }

    completeTransport() {
        if (!this.transportTarget) return;

        const target = this.transportTarget;
        this.lastTransportTime = performance.now() / 1000;

        // Handle different transport types
        switch (target.type) {
            case 'mine':
                this.transportMine(target);
                break;
            case 'shuttle':
                this.transportShuttle(target);
                break;
            case 'torpedo':
                this.transportTorpedo(target);
                break;
            case 'ship':
                this.transportShip(target);
                break;
        }

        this.deactivate();
    }

    transportMine(mine) {
        // Transport mine to a random location near player
        const angle = MathUtils.random(0, 360);
        const distance = MathUtils.random(50, 100);
        const newX = this.playerShip.x + Math.cos(MathUtils.toRadians(angle)) * distance;
        const newY = this.playerShip.y + Math.sin(MathUtils.toRadians(angle)) * distance;

        mine.x = newX;
        mine.y = newY;
        mine.owner = this.playerShip; // Change ownership

        eventBus.emit('mine-transported', { mine: mine, newLocation: { x: newX, y: newY } });
        console.log('Mine transported to new location');
    }

    transportShuttle(shuttle) {
        // Transport shuttle to player's bay
        if (this.playerShip.baySystem) {
            this.playerShip.baySystem.recoverShuttle(shuttle);
            eventBus.emit('shuttle-transported', { shuttle: shuttle });
            console.log('Shuttle transported to bay');
        }
    }

    transportTorpedo(torpedo) {
        // Transport torpedo to a random location (disarm it)
        const angle = MathUtils.random(0, 360);
        const distance = MathUtils.random(100, 200);
        const newX = this.playerShip.x + Math.cos(MathUtils.toRadians(angle)) * distance;
        const newY = this.playerShip.y + Math.sin(MathUtils.toRadians(angle)) * distance;

        torpedo.x = newX;
        torpedo.y = newY;
        torpedo.lifetime = 0; // Disarm torpedo

        eventBus.emit('torpedo-transported', { torpedo: torpedo });
        console.log('Torpedo transported and disarmed');
    }

    transportShip(ship) {
        // Transport ship to a random location
        const angle = MathUtils.random(0, 360);
        const distance = MathUtils.random(150, 300);
        const newX = this.playerShip.x + Math.cos(MathUtils.toRadians(angle)) * distance;
        const newY = this.playerShip.y + Math.sin(MathUtils.toRadians(angle)) * distance;

        ship.x = newX;
        ship.y = newY;

        eventBus.emit('ship-transported', { ship: ship, newLocation: { x: newX, y: newY } });
        console.log('Ship transported to new location');
    }

    canUseTransporter() {
        const currentTime = performance.now() / 1000;
        return currentTime - this.lastTransportTime >= this.transportCooldown;
    }

    getTransportStatus() {
        return {
            isActive: this.isActive,
            target: this.transportTarget,
            progress: this.transportProgress,
            duration: this.transportDuration,
            canUse: this.canUseTransporter()
        };
    }

    render(ctx, camera) {
        if (!this.isActive || !this.transportTarget || !this.playerShip) return;

        const playerScreenPos = camera.worldToScreen(this.playerShip.x, this.playerShip.y);
        const targetScreenPos = camera.worldToScreen(this.transportTarget.x, this.transportTarget.y);

        // Draw transport beam
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(playerScreenPos.x, playerScreenPos.y);
        ctx.lineTo(targetScreenPos.x, targetScreenPos.y);
        ctx.strokeStyle = CONFIG.COLOR_TRANSPORTER_BEAM;
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]); // Dashed line
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
        ctx.restore();

        // Draw progress indicator
        const progressPercent = this.transportProgress / this.transportDuration;
        const progressBarWidth = 100;
        const progressBarHeight = 10;
        const progressBarX = targetScreenPos.x - progressBarWidth / 2;
        const progressBarY = targetScreenPos.y - 30;

        ctx.save();
        ctx.fillStyle = '#333333';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        
        ctx.fillStyle = CONFIG.COLOR_TRANSPORTER_BEAM;
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth * progressPercent, progressBarHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.restore();
    }
}

