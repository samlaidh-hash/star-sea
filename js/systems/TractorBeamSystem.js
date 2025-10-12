/**
 * Star Sea - Tractor Beam System
 * Q key toggle, target pinning, performance penalties
 */

class TractorBeamSystem {
    constructor() {
        this.isActive = false;
        this.currentTarget = null;
        this.targetType = null; // 'mine', 'shuttle', 'torpedo', 'ship'
        this.beamLength = 0;
        this.maxBeamLength = 200; // Maximum beam length
        
        // Performance penalties
        this.speedPenalty = 0.2; // 20% speed reduction
        this.shieldPenalty = 0.2; // 20% shield reduction
        this.beamPenalty = 0.2; // 20% beam damage reduction
        
        // Visual effects
        this.beamParticles = [];
        this.beamAlpha = 0;
    }

    init(playerShip) {
        this.playerShip = playerShip;
        eventBus.on('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        if (event.key === 'q' && this.playerShip) {
            this.toggle(this.playerShip, game.entities);
        }
    }

    /**
     * Toggle tractor beam on/off
     */
    toggle(playerShip, allEntities) {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate(playerShip, allEntities);
        }
    }

    /**
     * Activate tractor beam
     */
    activate(playerShip, allEntities) {
        // Find target based on priority: mines/shuttles/torpedoes first, then ships
        const target = this.findTarget(playerShip, allEntities);
        
        if (target) {
            this.isActive = true;
            this.currentTarget = target;
            this.targetType = this.getTargetType(target);
            
            // Apply performance penalties to player ship
            this.applyPenalties(playerShip, true);
            
            // Emit activation event
            eventBus.emit('tractor-beam-activated', { 
                target: target, 
                targetType: this.targetType 
            });
            
            console.log(`Tractor beam activated on ${this.targetType}:`, target);
        } else {
            console.log('No valid target for tractor beam');
        }
    }

    /**
     * Deactivate tractor beam
     */
    deactivate() {
        if (this.isActive) {
            this.isActive = false;
            this.currentTarget = null;
            this.targetType = null;
            this.beamLength = 0;
            
            // Remove performance penalties
            eventBus.emit('tractor-beam-deactivated');
            
            console.log('Tractor beam deactivated');
        }
    }

    /**
     * Find best target for tractor beam
     */
    findTarget(playerShip, allEntities) {
        const targets = [];
        
        // Find all potential targets
        for (const entity of allEntities) {
            if (!entity.active) continue;
            
            // Priority 1: Mines, shuttles, torpedoes
            if (entity.type === 'mine' || entity.type === 'shuttle' || entity.type === 'torpedo') {
                const distance = MathUtils.distance(playerShip.x, playerShip.y, entity.x, entity.y);
                if (distance <= this.maxBeamLength) {
                    targets.push({
                        entity: entity,
                        distance: distance,
                        priority: 1,
                        type: entity.type
                    });
                }
            }
            // Priority 2: Ships (size-restricted)
            else if (entity.type === 'ship' && entity !== playerShip) {
                if (this.canTractorShip(playerShip, entity)) {
                    const distance = MathUtils.distance(playerShip.x, playerShip.y, entity.x, entity.y);
                    if (distance <= this.maxBeamLength) {
                        targets.push({
                            entity: entity,
                            distance: distance,
                            priority: 2,
                            type: 'ship'
                        });
                    }
                }
            }
        }
        
        // Sort by priority, then by distance
        targets.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return a.distance - b.distance;
        });
        
        return targets.length > 0 ? targets[0].entity : null;
    }

    /**
     * Check if player can tractor a ship (size restrictions)
     */
    canTractorShip(playerShip, targetShip) {
        const playerClass = playerShip.shipClass;
        const targetClass = targetShip.shipClass;
        
        // Size hierarchy: BC > CA > CL > FG
        const classHierarchy = { 'FG': 1, 'CL': 2, 'CA': 3, 'BC': 4 };
        const playerLevel = classHierarchy[playerClass] || 0;
        const targetLevel = classHierarchy[targetClass] || 0;
        
        return playerLevel > targetLevel;
    }

    /**
     * Get target type for categorization
     */
    getTargetType(target) {
        if (target.type === 'mine') return 'mine';
        if (target.type === 'shuttle') return 'shuttle';
        if (target.type === 'torpedo') return 'torpedo';
        if (target.type === 'ship') return 'ship';
        return 'unknown';
    }

    /**
     * Update tractor beam system
     */
    update(deltaTime, playerShip) {
        if (!this.isActive || !this.currentTarget) return;
        
        // Check if target is still valid
        if (!this.currentTarget.active) {
            this.deactivate();
            return;
        }
        
        // Update beam length
        const distance = MathUtils.distance(playerShip.x, playerShip.y, this.currentTarget.x, this.currentTarget.y);
        this.beamLength = Math.min(distance, this.maxBeamLength);
        
        // Check if target is too far away
        if (distance > this.maxBeamLength) {
            this.deactivate();
            return;
        }
        
        // Pin target in place relative to player
        this.pinTarget(playerShip, this.currentTarget, deltaTime);
        
        // Update visual effects
        this.updateVisualEffects(deltaTime);
    }

    /**
     * Pin target in place relative to player
     */
    pinTarget(playerShip, target, deltaTime) {
        if (!target.physicsComponent) return;
        
        // Calculate desired position (maintain relative position to player)
        const relativeX = target.x - playerShip.x;
        const relativeY = target.y - playerShip.y;
        
        // Apply force to maintain position
        const body = target.physicsComponent.body;
        const currentVel = body.getLinearVelocity();
        
        // Damping force to reduce movement
        const damping = 0.9;
        body.setLinearVelocity(
            currentVel.x * damping,
            currentVel.y * damping
        );
        
        // Apply corrective force if target drifts
        const driftThreshold = 10; // pixels
        const driftX = relativeX - (target.x - playerShip.x);
        const driftY = relativeY - (target.y - playerShip.y);
        const driftDistance = Math.sqrt(driftX * driftX + driftY * driftY);
        
        if (driftDistance > driftThreshold) {
            const correctiveForce = 100; // Force magnitude
            const forceX = (driftX / driftDistance) * correctiveForce;
            const forceY = (driftY / driftDistance) * correctiveForce;
            
            body.applyForceToCenter(planck.Vec2(forceX, forceY));
        }
    }

    /**
     * Apply performance penalties to player ship
     */
    applyPenalties(playerShip, apply) {
        if (apply) {
            // Reduce max speed
            playerShip.maxSpeed *= (1 - this.speedPenalty);
            
            // Reduce shield strength and recharge
            if (playerShip.shields) {
                const quadrants = playerShip.shields.getAllQuadrants();
                for (const [key, shield] of Object.entries(quadrants)) {
                    shield.max *= (1 - this.shieldPenalty);
                    shield.current = Math.min(shield.current, shield.max);
                }
            }
            
            // Reduce beam damage
            if (playerShip.weapons) {
                for (const weapon of playerShip.weapons) {
                    if (weapon.damage) {
                        weapon.damage *= (1 - this.beamPenalty);
                    }
                }
            }
        } else {
            // Restore original values
            // Note: This is simplified - in practice, you'd need to store original values
            playerShip.maxSpeed /= (1 - this.speedPenalty);
            
            if (playerShip.shields) {
                const quadrants = playerShip.shields.getAllQuadrants();
                for (const [key, shield] of Object.entries(quadrants)) {
                    shield.max /= (1 - this.shieldPenalty);
                }
            }
            
            if (playerShip.weapons) {
                for (const weapon of playerShip.weapons) {
                    if (weapon.damage) {
                        weapon.damage /= (1 - this.beamPenalty);
                    }
                }
            }
        }
    }

    /**
     * Update visual effects
     */
    updateVisualEffects(deltaTime) {
        // Update beam alpha (pulsing effect)
        this.beamAlpha += deltaTime * 3;
        
        // Generate beam particles
        if (Math.random() < 0.3) {
            this.beamParticles.push({
                x: Math.random() * this.beamLength,
                y: (Math.random() - 0.5) * 10,
                life: 1.0,
                speed: Math.random() * 50 + 20
            });
        }
        
        // Update particles
        for (let i = this.beamParticles.length - 1; i >= 0; i--) {
            const particle = this.beamParticles[i];
            particle.life -= deltaTime * 2;
            
            if (particle.life <= 0) {
                this.beamParticles.splice(i, 1);
            }
        }
    }

    /**
     * Render tractor beam
     */
    render(ctx, camera, playerShip) {
        if (!this.isActive || !this.currentTarget) return;
        
        const playerPos = camera.worldToScreen(playerShip.x, playerShip.y);
        const targetPos = camera.worldToScreen(this.currentTarget.x, this.currentTarget.y);
        
        ctx.save();
        
        // Draw beam
        const alpha = 0.7 + Math.sin(this.beamAlpha) * 0.3;
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(playerPos.x, playerPos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();
        
        // Draw particles
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        
        for (const particle of this.beamParticles) {
            const particleX = playerPos.x + (particle.x / this.beamLength) * (targetPos.x - playerPos.x);
            const particleY = playerPos.y + (particle.x / this.beamLength) * (targetPos.y - playerPos.y) + particle.y;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    /**
     * Get system status
     */
    getStatus() {
        return {
            active: this.isActive,
            target: this.currentTarget,
            targetType: this.targetType,
            beamLength: this.beamLength
        };
    }
}
