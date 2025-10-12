/**
 * Star Sea - Phaser Mine Entity
 * Fires phaser beams at nearby ships
 */

class PhaserMine extends Mine {
    constructor(config) {
        super(config);
        this.type = 'phaser_mine';
        this.phaserRange = config.phaserRange || 150;
        this.phaserDamage = config.phaserDamage || 1;
        this.phaserCooldown = config.phaserCooldown || 2.0; // 2 seconds between shots
        this.lastPhaserTime = 0;
        this.phaserBeamDuration = 0.5; // Beam lasts 0.5 seconds
        this.activeBeam = null;
        this.color = CONFIG.COLOR_PHASER_MINE || '#00ffaa';
    }

    update(deltaTime, currentTime, allEntities) {
        if (!this.active) return;

        // Sync position from physics
        if (this.physicsComponent) {
            this.physicsComponent.syncToEntity();
        }

        // Update active beam
        if (this.activeBeam) {
            this.activeBeam.lifetime -= deltaTime;
            if (this.activeBeam.lifetime <= 0) {
                this.activeBeam = null;
            }
        }

        // Check for targets to fire at
        if (currentTime - this.lastPhaserTime >= this.phaserCooldown) {
            this.checkForTargets(allEntities, currentTime);
        }

        // Update lifetime
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.destroy();
        }
    }

    checkForTargets(allEntities, currentTime) {
        let nearestTarget = null;
        let nearestDistance = Infinity;

        for (const entity of allEntities) {
            if (entity.type === 'ship' && entity.active && entity !== this.owner) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance <= this.phaserRange && distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestTarget = entity;
                }
            }
        }

        if (nearestTarget) {
            this.firePhaser(nearestTarget, currentTime);
        }
    }

    firePhaser(target, currentTime) {
        this.lastPhaserTime = currentTime;

        // Create phaser beam
        this.activeBeam = {
            target: target,
            startTime: currentTime,
            lifetime: this.phaserBeamDuration,
            damage: this.phaserDamage
        };

        // Apply damage to target
        target.takeDamage(this.phaserDamage);

        eventBus.emit('phaser-mine-fired', { 
            mine: this, 
            target: target, 
            damage: this.phaserDamage 
        });

        console.log(`Phaser mine fired at ${target.name || target.type}`);
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

        // Draw phaser range
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(0, 0, this.phaserRange, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw active beam
        if (this.activeBeam && this.activeBeam.target) {
            const beamAngle = MathUtils.angleBetween(this.x, this.y, this.activeBeam.target.x, this.activeBeam.target.y);
            
            ctx.save();
            ctx.rotate(MathUtils.toRadians(beamAngle));
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.phaserRange, 0);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
    }
}

