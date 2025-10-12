/**
 * Star Sea - Transporter Mine Entity
 * Transports ships to random locations
 */

class TransporterMine extends Mine {
    constructor(config) {
        super(config);
        this.type = 'transporter_mine';
        this.transportRange = config.transportRange || 40;
        this.transportDuration = config.transportDuration || 3.0; // 3 seconds to transport
        this.transportProgress = 0;
        this.transportTarget = null;
        this.isTransporting = false;
        this.color = CONFIG.COLOR_TRANSPORTER_MINE || '#aa00ff';
    }

    update(deltaTime, currentTime, allEntities) {
        if (!this.active) return;

        // Sync position from physics
        if (this.physicsComponent) {
            this.physicsComponent.syncToEntity();
        }

        // Check for ships to transport
        if (!this.isTransporting) {
            this.checkForTransportTargets(allEntities);
        } else {
            this.updateTransport(deltaTime, currentTime);
        }

        // Update lifetime
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.destroy();
        }
    }

    checkForTransportTargets(allEntities) {
        for (const entity of allEntities) {
            if (entity.type === 'ship' && entity.active && entity !== this.owner) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance <= this.transportRange) {
                    this.startTransport(entity);
                    break;
                }
            }
        }
    }

    startTransport(ship) {
        this.transportTarget = ship;
        this.isTransporting = true;
        this.transportProgress = 0;
        console.log(`Transporter mine starting transport of ${ship.name || ship.type}`);
    }

    updateTransport(deltaTime, currentTime) {
        if (!this.transportTarget || !this.transportTarget.active) {
            this.stopTransport();
            return;
        }

        // Check if ship is still in range
        const distance = MathUtils.distance(this.x, this.y, this.transportTarget.x, this.transportTarget.y);
        if (distance > this.transportRange * 1.5) {
            this.stopTransport();
            return;
        }

        // Update transport progress
        this.transportProgress += deltaTime;

        // Apply transport effects to ship
        this.applyTransportEffects(deltaTime);

        // Check if transport is complete
        if (this.transportProgress >= this.transportDuration) {
            this.completeTransport();
        }
    }

    applyTransportEffects(deltaTime) {
        if (!this.transportTarget) return;

        // Reduce ship's speed
        if (this.transportTarget.physicsComponent) {
            const body = this.transportTarget.physicsComponent.body;
            const currentVel = body.getLinearVelocity();
            const damping = 0.9; // Reduce velocity
            body.setLinearVelocity(planck.Vec2(currentVel.x * damping, currentVel.y * damping));
        }

        // Disable weapons
        if (this.transportTarget.weapons) {
            for (const weapon of this.transportTarget.weapons) {
                weapon.disabled = true;
            }
        }
    }

    completeTransport() {
        if (!this.transportTarget) return;

        // Transport ship to random location
        const angle = MathUtils.random(0, 360);
        const distance = MathUtils.random(200, 500);
        const newX = this.x + Math.cos(MathUtils.toRadians(angle)) * distance;
        const newY = this.y + Math.sin(MathUtils.toRadians(angle)) * distance;

        this.transportTarget.x = newX;
        this.transportTarget.y = newY;

        // Restore ship's capabilities
        this.restoreShipCapabilities();

        eventBus.emit('ship-transported-by-mine', { 
            mine: this, 
            ship: this.transportTarget, 
            newLocation: { x: newX, y: newY } 
        });

        console.log(`Ship ${this.transportTarget.name || this.transportTarget.type} transported to new location`);
        
        this.destroy(); // Mine is consumed
    }

    restoreShipCapabilities() {
        if (!this.transportTarget) return;

        // Re-enable weapons
        if (this.transportTarget.weapons) {
            for (const weapon of this.transportTarget.weapons) {
                weapon.disabled = false;
            }
        }
    }

    stopTransport() {
        this.isTransporting = false;
        this.transportTarget = null;
        this.transportProgress = 0;
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

        // Draw transport indicator if transporting
        if (this.isTransporting) {
            const progressPercent = this.transportProgress / this.transportDuration;
            const indicatorRadius = this.radius + 5;
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, indicatorRadius, 0, Math.PI * 2 * progressPercent);
            ctx.stroke();
        }

        // Draw transport range when active
        if (this.isTransporting) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.arc(0, 0, this.transportRange, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.restore();
    }
}

