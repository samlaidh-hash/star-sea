/**
 * Star Sea - Captor Mine Entity
 * Captures ships instead of destroying them
 */

class CaptorMine extends Mine {
    constructor(config) {
        super(config);
        this.type = 'captor_mine';
        this.captureRange = config.captureRange || 30;
        this.captureDuration = config.captureDuration || 5.0; // 5 seconds to capture
        this.captureProgress = 0;
        this.capturedShip = null;
        this.isCapturing = false;
        this.color = CONFIG.COLOR_CAPTOR_MINE || '#ffaa00';
    }

    update(deltaTime, currentTime, allEntities) {
        if (!this.active) return;

        // Sync position from physics
        if (this.physicsComponent) {
            this.physicsComponent.syncToEntity();
        }

        // Check for ships to capture
        if (!this.isCapturing) {
            this.checkForCaptureTargets(allEntities);
        } else {
            this.updateCapture(deltaTime, currentTime);
        }

        // Update lifetime
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.destroy();
        }
    }

    checkForCaptureTargets(allEntities) {
        for (const entity of allEntities) {
            if (entity.type === 'ship' && entity.active && entity !== this.owner) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance <= this.captureRange) {
                    this.startCapture(entity);
                    break;
                }
            }
        }
    }

    startCapture(ship) {
        this.capturedShip = ship;
        this.isCapturing = true;
        this.captureProgress = 0;
        console.log(`Captor mine starting capture of ${ship.name || ship.type}`);
    }

    updateCapture(deltaTime, currentTime) {
        if (!this.capturedShip || !this.capturedShip.active) {
            this.stopCapture();
            return;
        }

        // Check if ship is still in range
        const distance = MathUtils.distance(this.x, this.y, this.capturedShip.x, this.capturedShip.y);
        if (distance > this.captureRange * 1.5) {
            this.stopCapture();
            return;
        }

        // Update capture progress
        this.captureProgress += deltaTime;

        // Apply capture effects to ship
        this.applyCaptureEffects(deltaTime);

        // Check if capture is complete
        if (this.captureProgress >= this.captureDuration) {
            this.completeCapture();
        }
    }

    applyCaptureEffects(deltaTime) {
        if (!this.capturedShip) return;

        // Reduce ship's speed and turn rate
        if (this.capturedShip.physicsComponent) {
            const body = this.capturedShip.physicsComponent.body;
            const currentVel = body.getLinearVelocity();
            const damping = 0.8; // Reduce velocity
            body.setLinearVelocity(planck.Vec2(currentVel.x * damping, currentVel.y * damping));
        }

        // Disable weapons
        if (this.capturedShip.weapons) {
            for (const weapon of this.capturedShip.weapons) {
                weapon.disabled = true;
            }
        }
    }

    completeCapture() {
        if (!this.capturedShip) return;

        // Change ship's owner to mine owner
        this.capturedShip.owner = this.owner;
        this.capturedShip.faction = this.owner.faction;

        // Restore ship's capabilities
        this.restoreShipCapabilities();

        eventBus.emit('ship-captured', { 
            mine: this, 
            ship: this.capturedShip, 
            newOwner: this.owner 
        });

        console.log(`Ship ${this.capturedShip.name || this.capturedShip.type} captured by ${this.owner.name || this.owner.type}`);
        
        this.destroy(); // Mine is consumed
    }

    restoreShipCapabilities() {
        if (!this.capturedShip) return;

        // Re-enable weapons
        if (this.capturedShip.weapons) {
            for (const weapon of this.capturedShip.weapons) {
                weapon.disabled = false;
            }
        }
    }

    stopCapture() {
        this.isCapturing = false;
        this.capturedShip = null;
        this.captureProgress = 0;
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw mine body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw capture indicator if capturing
        if (this.isCapturing) {
            const progressPercent = this.captureProgress / this.captureDuration;
            const indicatorRadius = this.radius + 5;
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, indicatorRadius, 0, Math.PI * 2 * progressPercent);
            ctx.stroke();
        }

        // Draw capture range when active
        if (this.isCapturing) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.arc(0, 0, this.captureRange, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.restore();
    }
}

