/**
 * Star Sea - Fighter Entity
 * Fast, maneuverable, light weapons
 */

class Fighter extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'fighter';
        this.ownerShip = config.ownerShip;
        this.faction = config.faction || 'FEDERATION';
        
        // Fighter stats
        this.maxHp = 1;
        this.hp = 1;
        this.maxShield = 1;
        this.shield = 1;
        this.maxSpeed = this.ownerShip.maxSpeed * 0.8; // 80% of ship speed
        this.acceleration = this.ownerShip.acceleration * 1.2; // More responsive
        this.turnRate = this.ownerShip.turnRate * 2.0; // Much more maneuverable
        
        // Visual properties
        this.radius = 6;
        this.color = this.getFighterColor();
        this.vertices = this.generateFighterVertices();
        
        // AI behavior
        this.aiState = 'PATROL';
        this.target = null;
        this.lastStateChange = 0;
        this.weaponCooldown = 0;
        this.beamRange = this.ownerShip.getBeamRange() * 0.3; // 30% of ship beam range
        this.beamDamage = 0.5; // Half damage of ship beams
        
        // Physics
        this.physicsWorld = config.physicsWorld;
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }
    }

    getFighterColor() {
        switch (this.faction) {
            case 'FEDERATION': return '#4444ff';
            case 'TRIGON': return '#ff4444';
            case 'SCINTILIAN': return '#44ff44';
            case 'PIRATE': return '#ffaa44';
            default: return '#ffffff';
        }
    }

    generateFighterVertices() {
        // Small, sleek fighter shape
        return [
            { x: 0, y: -6 },   // Nose
            { x: -3, y: 3 },   // Port wing
            { x: 3, y: 3 }     // Starboard wing
        ];
    }

    createPhysicsBody() {
        const body = this.physicsWorld.createCircleBody(this.x, this.y, this.radius, {
            type: 'dynamic',
            density: 0.3,
            restitution: 0.9,
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

        // Update weapon cooldown
        if (this.weaponCooldown > 0) {
            this.weaponCooldown -= deltaTime;
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

            // Fire at enemy if in range
            if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
                this.fireBeam(nearestEnemy.x, nearestEnemy.y);
                this.weaponCooldown = 0.5; // Fast firing rate
            }
        } else {
            // Patrol around owner
            this.patrolAroundOwner(deltaTime);
        }
    }

    patrolAroundOwner(deltaTime) {
        const angleToOwner = MathUtils.angleBetween(this.x, this.y, this.ownerShip.x, this.ownerShip.y);
        const patrolAngle = angleToOwner + 45; // Orbit 45 degrees offset
        this.turnTowardsAngle(patrolAngle, deltaTime);
        this.applyThrust(0.7, deltaTime);
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

        eventBus.emit('fighter-fired-beam', { fighter: this, projectile: beam });
    }

    updateShieldRecovery(deltaTime, currentTime) {
        // Shield recovery after 1 second of no damage
        if (this.shield < this.maxShield) {
            this.shield = Math.min(this.maxShield, this.shield + deltaTime);
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

