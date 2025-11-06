/**
 * Star Sea - Probe Entity
 * Unmanned sensor probe - flies towards target, extends ship sensors along path
 * Used for reconnaissance and mission victory conditions (proximity to objectives)
 */

class Probe extends Entity {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'probe';
        this.ownerShip = config.ownerShip;
        this.targetX = config.targetX || 0;
        this.targetY = config.targetY || 0;

        // Probe stats (fast, fragile, no combat ability)
        this.maxHp = 1;
        this.hp = 1;
        this.maxShield = 0; // No shields
        this.shield = 0;
        this.maxSpeed = this.ownerShip.maxSpeed * 1.0; // 100% - matches ship speed
        this.acceleration = this.ownerShip.acceleration * 1.5; // Quick acceleration
        this.turnRate = this.ownerShip.turnRate * 2.0; // Highly maneuverable

        // Visual properties (very small)
        this.radius = 4;
        this.color = '#00ffff'; // Cyan - sensor signature
        this.vertices = this.generateProbeVertices();

        // Mission parameters
        this.launchTime = performance.now() / 1000;
        this.flightDuration = 10; // Flies for 10 seconds past target
        this.reachedTarget = false;
        this.targetReachTime = 0;
        this.missionComplete = false;

        // Sensor extension
        this.sensorRange = this.ownerShip.getSensorRange ? this.ownerShip.getSensorRange() : 500;
        this.proximityObjects = []; // Track objects probe comes near (for victory conditions)

        // Flight state
        this.flightPhase = 'APPROACH'; // APPROACH -> EXTENDING -> EXPIRED

        // Physics
        this.physicsWorld = config.physicsWorld;
        if (this.physicsWorld) {
            this.createPhysicsBody();
        }
    }

    generateProbeVertices() {
        // Simple diamond shape
        const r = this.radius;
        return [
            { x: 0, y: -r },     // Top
            { x: r * 0.7, y: 0 }, // Right
            { x: 0, y: r },      // Bottom
            { x: -r * 0.7, y: 0 } // Left
        ];
    }

    update(deltaTime, currentTime, allEntities) {
        if (!this.active) return;

        const missionTime = currentTime - this.launchTime;

        // Execute flight behavior based on phase
        switch (this.flightPhase) {
            case 'APPROACH':
                this.approachTarget(deltaTime, currentTime);
                break;
            case 'EXTENDING':
                this.continueExtension(deltaTime, currentTime, missionTime);
                break;
            case 'EXPIRED':
                this.destroy();
                break;
        }

        // Track proximity to mission objectives
        this.trackProximityObjects(allEntities);

        // Extend sensors along flight path
        this.extendSensorCoverage();

        // Call parent update for physics
        if (this.physicsBody) {
            super.update(deltaTime);
        }
    }

    approachTarget(deltaTime, currentTime) {
        // Fly towards target location
        const angleToTarget = MathUtils.angleBetween(this.x, this.y, this.targetX, this.targetY);
        this.turnTowardsAngle(angleToTarget, deltaTime);
        this.applyThrust(1.0, deltaTime);

        // Check if reached target
        const distance = MathUtils.distance(this.x, this.y, this.targetX, this.targetY);
        if (distance < 50) { // Within 50 pixels of target
            this.reachedTarget = true;
            this.targetReachTime = currentTime;
            this.flightPhase = 'EXTENDING';
            console.log('Probe reached target, continuing for 10 seconds...');
        }
    }

    continueExtension(deltaTime, currentTime, missionTime) {
        // Continue flying in same direction for 10 seconds past target
        this.applyThrust(1.0, deltaTime);

        // Check if mission duration expired
        const extensionTime = currentTime - this.targetReachTime;
        if (extensionTime >= this.flightDuration) {
            this.flightPhase = 'EXPIRED';
            this.missionComplete = true;
            console.log('Probe mission complete, self-destructing...');
        }
    }

    turnTowardsAngle(targetAngle, deltaTime) {
        const angleDiff = MathUtils.normalizeAngle(targetAngle - this.rotation);
        const turnAmount = this.turnRate * deltaTime;

        if (Math.abs(angleDiff) < turnAmount) {
            this.rotation = targetAngle;
        } else if (angleDiff > 0) {
            this.rotation += turnAmount;
        } else {
            this.rotation -= turnAmount;
        }

        this.rotation = MathUtils.normalizeAngle(this.rotation);
    }

    applyThrust(power, deltaTime) {
        const thrustForce = this.acceleration * power;
        const thrustX = Math.cos(MathUtils.toRadians(this.rotation)) * thrustForce * deltaTime;
        const thrustY = Math.sin(MathUtils.toRadians(this.rotation)) * thrustForce * deltaTime;

        this.velocityX += thrustX;
        this.velocityY += thrustY;

        // Limit speed
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocityX *= scale;
            this.velocityY *= scale;
        }
    }

    extendSensorCoverage() {
        // This probe acts as a sensor extension for the owning ship
        // The actual sensor range extension would be calculated by the sensor system
        // For now, we just track that this probe is active and providing sensor data

        if (this.ownerShip && this.ownerShip.sensorSystem) {
            // Register this probe as an active sensor node
            // (Full implementation would require SensorSystem integration)
        }
    }

    trackProximityObjects(allEntities) {
        // Track objects the probe comes near (for mission victory conditions)
        const proximityRange = 100; // Detection radius around probe

        for (const entity of allEntities) {
            if (!entity.active) continue;

            const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
            if (distance <= proximityRange) {
                // Check if this object is new to our proximity list
                const alreadyTracked = this.proximityObjects.some(obj => obj.id === entity.id);
                if (!alreadyTracked) {
                    this.proximityObjects.push({
                        id: entity.id,
                        type: entity.type,
                        timestamp: performance.now() / 1000,
                        distance: distance
                    });

                    // Emit event for mission system to check victory conditions
                    if (typeof eventBus !== 'undefined') {
                        eventBus.emit('probe-proximity', {
                            probe: this,
                            entity: entity,
                            distance: distance
                        });
                    }

                    console.log(`Probe detected ${entity.type} at ${distance.toFixed(0)}px`);
                }
            }
        }
    }

    getSensorExtensionPath() {
        // Returns the line segment representing the sensor extension
        // Used by rendering system to show sensor coverage
        return {
            startX: this.ownerShip.x,
            startY: this.ownerShip.y,
            endX: this.x,
            endY: this.y,
            range: this.sensorRange
        };
    }

    createPhysicsBody() {
        // Create physics body for collisions
        // Probes are fragile - any collision destroys them
    }

    takeDamage(amount, source) {
        // Probes have no shields, any hit destroys them
        this.hp -= amount;
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.active = false;

        // Emit event that probe was destroyed/expired
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('probe-destroyed', {
                probe: this,
                missionComplete: this.missionComplete,
                proximityObjects: this.proximityObjects
            });
        }

        console.log(`Probe destroyed (mission ${this.missionComplete ? 'complete' : 'failed'})`);
    }
}
