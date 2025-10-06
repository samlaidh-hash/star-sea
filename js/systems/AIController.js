/**
 * Star Sea - AI Controller
 * Manages AI ship behavior and tactics
 */

class AIController {
    constructor(ship) {
        this.ship = ship;
        this.state = 'PATROL'; // PATROL, APPROACH, ATTACK, EVADE, PURSUE
        this.target = null;
        this.lastStateChange = 0;
        this.patrolAngle = Math.random() * 360;
        this.patrolChangeTime = 0;
        this.evadeTimer = 0;
        this.attackTimer = 0;
        this.lastFireTime = 0;

        // AI parameters based on faction
        this.aggressiveness = this.getAggressiveness();
        this.accuracy = this.getAccuracy();
        this.reactionTime = this.getReactionTime();
    }

    getAggressiveness() {
        switch (this.ship.faction) {
            case 'TRIGON': return 0.9; // Very aggressive
            case 'PIRATE': return 0.8; // Aggressive
            case 'SCINTILIAN': return 0.7; // Moderately aggressive
            default: return 0.5;
        }
    }

    getAccuracy() {
        switch (this.ship.faction) {
            case 'TRIGON': return 0.8;
            case 'SCINTILIAN': return 0.85;
            case 'PIRATE': return 0.6;
            default: return 0.7;
        }
    }

    getReactionTime() {
        switch (this.ship.faction) {
            case 'TRIGON': return 0.5; // Fast reactions
            case 'SCINTILIAN': return 0.4; // Very fast
            case 'PIRATE': return 0.8; // Slower
            default: return 0.6;
        }
    }

    update(deltaTime, currentTime, playerShip, allEntities) {
        if (!this.ship.active || this.ship.hp <= 0) return;

        // Apply system effects to accuracy
        const systemAccuracy = this.ship.systems ? this.ship.systems.sensors.getTargetingAccuracy() : 1.0;
        const effectiveAccuracy = this.accuracy * systemAccuracy;

        // Update target
        this.updateTarget(playerShip, allEntities);

        // Update AI state
        this.updateState(currentTime);

        // Execute current state behavior
        switch (this.state) {
            case 'PATROL':
                this.executePatrol(deltaTime, currentTime);
                break;
            case 'APPROACH':
                this.executeApproach(deltaTime, currentTime);
                break;
            case 'ATTACK':
                this.executeAttack(deltaTime, currentTime, effectiveAccuracy);
                break;
            case 'EVADE':
                this.executeEvade(deltaTime, currentTime);
                break;
            case 'PURSUE':
                this.executePursue(deltaTime, currentTime);
                break;
        }
    }

    updateTarget(playerShip, allEntities) {
        // For now, always target player
        // Future: could target other entities or choose tactical targets
        if (playerShip && playerShip.active) {
            this.target = playerShip;
        } else {
            this.target = null;
        }
    }

    updateState(currentTime) {
        if (!this.target) {
            this.state = 'PATROL';
            return;
        }

        const distance = MathUtils.distance(this.ship.x, this.ship.y, this.target.x, this.target.y);
        const detectionRadius = this.getDetectionRadius();
        const weaponRange = this.getWeaponRange();

        // State transitions
        switch (this.state) {
            case 'PATROL':
                if (distance < detectionRadius) {
                    this.changeState('APPROACH', currentTime);
                }
                break;

            case 'APPROACH':
                if (distance < weaponRange * 0.8) {
                    this.changeState('ATTACK', currentTime);
                } else if (distance > detectionRadius * 1.5) {
                    this.changeState('PATROL', currentTime);
                }
                break;

            case 'ATTACK':
                // Check if should evade (low HP or shields)
                const hpPercent = this.ship.hp / this.ship.maxHp;
                const shouldEvade = hpPercent < 0.3 && this.aggressiveness < 0.8;

                if (shouldEvade) {
                    this.changeState('EVADE', currentTime);
                } else if (distance > weaponRange * 1.5) {
                    this.changeState('PURSUE', currentTime);
                }
                break;

            case 'EVADE':
                this.evadeTimer -= 0.016; // Roughly deltaTime
                if (this.evadeTimer <= 0) {
                    // Check HP again
                    const newHpPercent = this.ship.hp / this.ship.maxHp;
                    if (newHpPercent > 0.5 || this.aggressiveness > 0.8) {
                        this.changeState('ATTACK', currentTime);
                    } else {
                        this.changeState('APPROACH', currentTime);
                    }
                }
                break;

            case 'PURSUE':
                if (distance < weaponRange * 0.8) {
                    this.changeState('ATTACK', currentTime);
                } else if (distance > detectionRadius * 2) {
                    this.changeState('PATROL', currentTime);
                }
                break;
        }
    }

    changeState(newState, currentTime) {
        this.state = newState;
        this.lastStateChange = currentTime;

        if (newState === 'EVADE') {
            this.evadeTimer = 3 + Math.random() * 2; // Evade for 3-5 seconds
        }
    }

    executePatrol(deltaTime, currentTime) {
        // Change patrol direction periodically
        if (currentTime - this.patrolChangeTime > 5 + Math.random() * 5) {
            this.patrolAngle = Math.random() * 360;
            this.patrolChangeTime = currentTime;
        }

        // Turn towards patrol angle
        this.turnTowardsAngle(this.patrolAngle, deltaTime);

        // Move forward at 50% thrust
        this.applyThrust(0.5);
    }

    executeApproach(deltaTime, currentTime) {
        if (!this.target) return;

        const angleToTarget = MathUtils.angleBetween(this.ship.x, this.ship.y, this.target.x, this.target.y);

        // Turn towards target
        this.turnTowardsAngle(angleToTarget, deltaTime);

        // Full thrust towards target
        this.applyThrust(1.0);
    }

    executeAttack(deltaTime, currentTime, accuracy) {
        if (!this.target) return;

        const distance = MathUtils.distance(this.ship.x, this.ship.y, this.target.x, this.target.y);
        const angleToTarget = MathUtils.angleBetween(this.ship.x, this.ship.y, this.target.x, this.target.y);
        const weaponRange = this.getWeaponRange();

        // Maintain optimal range (70-80% of max range)
        const optimalRange = weaponRange * 0.75;

        if (distance < optimalRange * 0.8) {
            // Too close, back away
            this.turnTowardsAngle(angleToTarget + 180, deltaTime);
            this.applyThrust(0.5);
        } else if (distance > optimalRange * 1.2) {
            // Too far, approach
            this.turnTowardsAngle(angleToTarget, deltaTime);
            this.applyThrust(0.8);
        } else {
            // Optimal range, strafe
            const strafeAngle = angleToTarget + (Math.random() > 0.5 ? 90 : -90);
            this.turnTowardsAngle(angleToTarget, deltaTime);

            // Apply some lateral drift
            if (this.ship.physicsComponent) {
                const strafeVec = MathUtils.vectorFromAngle(strafeAngle, this.ship.maxSpeed * 0.3);
                const currentVel = this.ship.physicsComponent.body.getLinearVelocity();
                this.ship.physicsComponent.body.setLinearVelocity(
                    planck.Vec2(currentVel.x + strafeVec.x * 0.1, currentVel.y + strafeVec.y * 0.1)
                );
            }
        }

        // Fire weapons
        this.fireWeapons(currentTime, accuracy);
    }

    executeEvade(deltaTime, currentTime) {
        if (!this.target) return;

        const angleToTarget = MathUtils.angleBetween(this.ship.x, this.ship.y, this.target.x, this.target.y);

        // Turn perpendicular to target
        const evadeAngle = angleToTarget + (Math.random() > 0.5 ? 90 : -90);
        this.turnTowardsAngle(evadeAngle, deltaTime);

        // Full thrust away
        this.applyThrust(1.0);

        // Deploy decoys if available
        if (this.ship.decoys > 0 && Math.random() < 0.1) {
            eventBus.emit('ai-deploy-decoy', { ship: this.ship });
        }
    }

    executePursue(deltaTime, currentTime) {
        if (!this.target) return;

        const angleToTarget = MathUtils.angleBetween(this.ship.x, this.ship.y, this.target.x, this.target.y);

        // Turn towards target
        this.turnTowardsAngle(angleToTarget, deltaTime);

        // Full thrust
        this.applyThrust(1.0);
    }

    turnTowardsAngle(targetAngle, deltaTime) {
        let angleDiff = targetAngle - this.ship.rotation;

        // Normalize to -180 to 180
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;

        const turnSpeed = this.ship.turnRate * deltaTime;

        if (Math.abs(angleDiff) < turnSpeed) {
            this.ship.rotation = targetAngle;
        } else {
            this.ship.rotation += Math.sign(angleDiff) * turnSpeed;
        }

        // Normalize rotation
        while (this.ship.rotation >= 360) this.ship.rotation -= 360;
        while (this.ship.rotation < 0) this.ship.rotation += 360;

        // Update physics body rotation if it exists
        if (this.ship.physicsComponent) {
            this.ship.physicsComponent.body.setAngle(MathUtils.toRadians(this.ship.rotation));
        }
    }

    applyThrust(thrustPercent) {
        if (!this.ship.physicsComponent) return;

        const thrust = this.ship.acceleration * thrustPercent;
        const thrustVec = MathUtils.vectorFromAngle(this.ship.rotation, thrust);

        // Apply force
        this.ship.physicsComponent.body.applyForceToCenter(
            planck.Vec2(thrustVec.x, thrustVec.y)
        );
    }

    fireWeapons(currentTime, accuracy) {
        if (!this.target) return;

        // Rate limit firing
        if (currentTime - this.lastFireTime < this.reactionTime) return;

        // Calculate lead target position based on target velocity
        const leadTarget = this.calculateLeadTarget();

        // Add accuracy spread
        const spread = (1 - accuracy) * 50; // Max 50 pixel spread at 0 accuracy
        const targetX = leadTarget.x + (Math.random() - 0.5) * spread;
        const targetY = leadTarget.y + (Math.random() - 0.5) * spread;

        // Fire beams - pass currentTime explicitly
        if (this.ship.fireBeams) {
            const beamProjectiles = this.ship.fireBeams(targetX, targetY, currentTime);
            if (beamProjectiles && beamProjectiles.length > 0) {
                eventBus.emit('ai-fired-beams', { ship: this.ship, projectiles: beamProjectiles });
                this.lastFireTime = currentTime;
            }
        }

        // Fire torpedoes (less frequently) - pass currentTime explicitly
        if (Math.random() < 0.2 && this.ship.fireTorpedoes) { // Increased from 0.1 to 0.2
            const torpProjectiles = this.ship.fireTorpedoes(targetX, targetY, null, currentTime); // No lock-on for AI
            if (torpProjectiles && torpProjectiles.length > 0) {
                eventBus.emit('ai-fired-torpedoes', { ship: this.ship, projectiles: torpProjectiles });
                this.lastFireTime = currentTime;
            }
        }
    }

    calculateLeadTarget() {
        if (!this.target) return { x: 0, y: 0 };

        // Simple lead calculation
        const targetVX = this.target.vx || 0;
        const targetVY = this.target.vy || 0;
        const projectileSpeed = CONFIG.BEAM_SPEED_PIXELS;
        const distance = MathUtils.distance(this.ship.x, this.ship.y, this.target.x, this.target.y);
        const timeToImpact = distance / projectileSpeed;

        return {
            x: this.target.x + targetVX * timeToImpact,
            y: this.target.y + targetVY * timeToImpact
        };
    }

    getDetectionRadius() {
        if (!this.ship.systems) return CONFIG.DETECTION_RADIUS_CA_PIXELS;

        const baseRadius = CONFIG.DETECTION_RADIUS_CA_PIXELS;
        return baseRadius * this.ship.systems.getDetectionMultiplier();
    }

    getWeaponRange() {
        // Return the maximum weapon range of this ship
        return CONFIG.BEAM_RANGE_PIXELS; // For now, use beam range
    }
}
