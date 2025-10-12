/**
 * Star Sea - Bomber Entity
 * Slower than fighters, heavier punch, more shields/armor
 */

class Bomber extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'bomber';
        this.ownerShip = config.ownerShip;
        this.faction = config.faction || 'FEDERATION';
        
        // Bomber stats (slower, heavier punch, more shields/armor)
        this.maxHp = 3; // More armor than fighters
        this.hp = 3;
        this.maxShield = 2; // More shields than fighters
        this.shield = 2;
        this.maxSpeed = this.ownerShip.maxSpeed * 0.4; // Slower than fighters
        this.acceleration = this.ownerShip.acceleration * 0.6; // Less responsive
        this.turnRate = this.ownerShip.turnRate * 1.2; // Less maneuverable
        
        // Visual properties
        this.radius = 10;
        this.color = this.getBomberColor();
        this.vertices = this.generateBomberVertices();
        
        // AI behavior
        this.aiState = 'PATROL';
        this.target = null;
        this.lastStateChange = 0;
        this.weaponCooldown = 0;
        this.torpedoCooldown = 0;
        this.beamRange = this.ownerShip.getBeamRange() * 0.4; // 40% of ship beam range
        this.beamDamage = 1.0; // Full damage beams
        this.torpedoDamage = 2.0; // Heavy torpedo damage
        this.torpedoRange = 200; // Torpedo range
        
        // Physics
        this.physicsWorld = config.physicsWorld;
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }
    }

    getBomberColor() {
        switch (this.faction) {
            case 'FEDERATION': return '#6666ff';
            case 'TRIGON': return '#ff6666';
            case 'SCINTILIAN': return '#66ff66';
            case 'PIRATE': return '#ffcc66';
            default: return '#cccccc';
        }
    }

    generateBomberVertices() {
        // Larger, bulkier bomber shape
        return [
            { x: 0, y: -8 },   // Nose
            { x: -5, y: 2 },   // Port wing
            { x: -3, y: 6 },   // Port wing tip
            { x: 3, y: 6 },    // Starboard wing tip
            { x: 5, y: 2 }     // Starboard wing
        ];
    }

    createPhysicsBody() {
        const body = this.physicsWorld.createCircleBody(this.x, this.y, this.radius, {
            type: 'dynamic',
            density: 0.8,
            restitution: 0.7,
            category: this.physicsWorld.CATEGORY.SHIP,
            mask: 0xFFFF
        });

        this.physicsComponent = new PhysicsComponent(this, body, this.physicsWorld);
    }

    update(deltaTime, currentTime, allEntities) {
        if (!this.active) return;

        // Sync position from physics
        if (this.physicsComponent) {
            this.physicsComponent.syncToEntity();
        }

        // Execute AI behavior
        this.executeAI(deltaTime, currentTime, allEntities);

        // Update shield recovery
        this.updateShieldRecovery(deltaTime, currentTime);

        // Update weapon cooldowns
        if (this.weaponCooldown > 0) {
            this.weaponCooldown -= deltaTime;
        }
        if (this.torpedoCooldown > 0) {
            this.torpedoCooldown -= deltaTime;
        }
    }

    executeAI(deltaTime, currentTime, allEntities) {
        // Find nearest enemy
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        for (const entity of allEntities) {
            if (entity.type === 'ship' && entity !== this.ownerShip && entity.active) {
                const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = entity;
                }
            }
        }

        if (nearestEnemy) {
            // Attack enemy
            const angleToEnemy = MathUtils.angleBetween(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
            this.turnTowardsAngle(angleToEnemy, deltaTime);
            this.applyThrust(1.0, deltaTime);

            // Fire beam if in range
            if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
                this.fireBeam(nearestEnemy.x, nearestEnemy.y);
                this.weaponCooldown = 1.0; // Slower firing rate than fighters
            }

            // Fire torpedo if in range and cooldown ready
            if (nearestDistance <= this.torpedoRange && this.torpedoCooldown <= 0) {
                this.fireTorpedo(nearestEnemy.x, nearestEnemy.y, nearestEnemy);
                this.torpedoCooldown = 3.0; // 3 second torpedo cooldown
            }
        } else {
            // Patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    patrolAroundOwner(deltaTime) {
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const patrolAngle = angleToOwner + 60; // Orbit 60 degrees offset
        this.turnTowardsAngle(patrolAngle, deltaTime);
        this.applyThrust(0.6, deltaTime);
    }

    turnTowardsAngle(targetAngle, deltaTime) {
        let angleDiff = targetAngle - this.rotation;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;

        const turnSpeed = this.turnRate * deltaTime;
        if (Math.abs(angleDiff) < turnSpeed) {
            this.rotation = targetAngle;
        } else {
            this.rotation += Math.sign(angleDiff) * turnSpeed;
        }

        // Normalize rotation
        while (this.rotation >= 360) this.rotation -= 360;
        while (this.rotation < 0) this.rotation += 360;
    }

    applyThrust(thrustPercent, deltaTime) {
        if (!this.physicsComponent) return;

        const thrust = this.acceleration * thrustPercent;
        const thrustVec = MathUtils.vectorFromAngle(this.rotation, thrust);
        
        this.physicsComponent.body.applyForceToCenter(
            planck.Vec2(thrustVec.x, thrustVec.y)
        );
    }

    fireBeam(targetX, targetY) {
        // Create beam projectile
        const beam = new BeamProjectile({
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.beamDamage,
            range: this.beamRange,
            speed: CONFIG.BEAM_SPEED,
            sourceShip: this
        });

        eventBus.emit('bomber-fired-beam', { bomber: this, projectile: beam });
    }

    fireTorpedo(targetX, targetY, target) {
        // Create torpedo projectile
        const torpedo = new TorpedoProjectile({
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            targetX: targetX,
            targetY: targetY,
            damage: this.torpedoDamage,
            blastRadius: CONFIG.TORPEDO_BLAST_RADIUS_PIXELS * 1.5,
            speed: CONFIG.TORPEDO_SPEED_MULTIPLIER * CONFIG.MAX_SPEED_CA * 0.8,
            lifetime: CONFIG.TORPEDO_LIFETIME * 1.2,
            sourceShip: this.ownerShip,
            lockOnTarget: target
        });

        eventBus.emit('bomber-fired-torpedo', { bomber: this, projectile: torpedo });
    }

    updateShieldRecovery(deltaTime, currentTime) {
        // Shield recovery after 1.5 seconds of no damage
        if (this.shield < this.maxShield) {
            this.shield = Math.min(this.maxShield, this.shield + deltaTime * 0.7);
        }
    }

    takeDamage(damage) {
        // Apply to shields first
        if (this.shield > 0) {
            const shieldDamage = Math.min(damage, this.shield);
            this.shield -= shieldDamage;
            damage -= shieldDamage;
        }

        // Apply remaining damage to hull
        if (damage > 0) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.destroy();
            }
        }
    }
}

