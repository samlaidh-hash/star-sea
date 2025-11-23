/**
 * Star Sea - Collision Handler
 * Processes collisions between entities
 */

class CollisionHandler {
    constructor(physicsWorld) {
        this.physicsWorld = physicsWorld;
    }

    handleCollision(entityA, entityB, contact) {
        if (!entityA || !entityB || !entityA.active || !entityB.active) return;

        // Get collision velocity for damage calculation
        const velocity = contact.getManifold().localNormal;

        // Determine collision types
        if (entityA.type === 'ship' && entityB.type === 'ship') {
            this.handleShipShipCollision(entityA, entityB, contact);
        } else if (entityA.type === 'ship' && entityB.type === 'asteroid') {
            this.handleShipAsteroidCollision(entityA, entityB, contact);
        } else if (entityA.type === 'asteroid' && entityB.type === 'ship') {
            this.handleShipAsteroidCollision(entityB, entityA, contact);
        } else if (entityA.type === 'asteroid' && entityB.type === 'asteroid') {
            this.handleAsteroidAsteroidCollision(entityA, entityB, contact);
        } else if (this.isShipEnvironmentCollision(entityA, entityB)) {
            this.handleShipEnvironmentCollision(entityA, entityB, contact);
        }

        // Log collision in debug mode
        if (CONFIG.DEBUG_MODE) {
            console.log(`Collision: ${entityA.type} <-> ${entityB.type}`);
        }
    }

    handleShipShipCollision(shipA, shipB, contact) {
        // Both ships take damage from collision
        // Damage based on relative velocity
        const velA = shipA.physicsComponent.body.getLinearVelocity();
        const velB = shipB.physicsComponent.body.getLinearVelocity();

        const relativeSpeed = MathUtils.magnitude(
            velA.x - velB.x,
            velA.y - velB.y
        );

        // Only apply damage if ships are moving fast enough (minimum threshold: 25 units/s)
        // This prevents damage during spawn when ships are stationary or barely touching
        const MIN_COLLISION_SPEED = 25;
        if (relativeSpeed < MIN_COLLISION_SPEED) {
            return; // No damage for slow/stationary collisions
        }

        // Scale damage by speed (minimum 1, maximum 5)
        const damage = Math.min(5, Math.max(1, Math.floor(relativeSpeed / 50)));

        // Apply damage to both ships
        if (shipA.takeDamage) {
            shipA.takeDamage(damage, contact.getManifold().points[0]);
        }
        if (shipB.takeDamage) {
            shipB.takeDamage(damage, contact.getManifold().points[0]);
        }

        eventBus.emit('ship-collision', { shipA, shipB, damage });
    }

    handleShipAsteroidCollision(ship, asteroid, contact) {
        // Ship takes damage based on asteroid size
        let damage = 0;
        switch (asteroid.size) {
            case 'large':
                damage = CONFIG.ASTEROID_DAMAGE_LARGE;
                break;
            case 'medium':
                damage = CONFIG.ASTEROID_DAMAGE_MEDIUM;
                break;
            case 'small':
                damage = CONFIG.ASTEROID_DAMAGE_SMALL;
                break;
        }

        // Apply damage to ship
        if (ship.takeDamage) {
            const contactPoint = contact.getWorldManifold(null).points[0];
            ship.takeDamage(damage, contactPoint);
        }

        // Break asteroid
        if (asteroid.size !== 'small') {
            asteroid.shouldBreak = true;
            asteroid.breakPosition = {
                x: asteroid.x,
                y: asteroid.y
            };
        } else {
            // Destroy small asteroid
            asteroid.destroy();
        }

        eventBus.emit('ship-asteroid-collision', { ship, asteroid, damage });
    }

    handleAsteroidAsteroidCollision(asteroidA, asteroidB, contact) {
        // Asteroids just bounce off each other, no special handling needed
        // The physics engine handles the bounce automatically
    }

    isShipEnvironmentCollision(entityA, entityB) {
        return (entityA.type === 'ship' && entityB.type === 'collapsar') ||
               (entityA.type === 'collapsar' && entityB.type === 'ship') ||
               (entityA.type === 'ship' && entityB.type === 'planet') ||
               (entityA.type === 'planet' && entityB.type === 'ship');
    }

    handleShipEnvironmentCollision(entityA, entityB, contact) {
        const ship = entityA.type === 'ship' ? entityA : entityB;
        const environment = entityA.type === 'ship' ? entityB : entityA;

        if (environment.type === 'collapsar') {
            // Ship destroyed by collapsar
            ship.destroy();
            eventBus.emit('ship-destroyed', { ship, cause: 'collapsar' });
        } else if (environment.type === 'planet') {
            // Ship takes massive damage from planet collision
            if (ship.takeDamage) {
                ship.takeDamage(10, contact.getWorldManifold(null).points[0]);
            }
            eventBus.emit('ship-planet-collision', { ship, planet: environment });
        }
    }

    /**
     * Check if projectile hit something
     */
    handleProjectileCollision(projectile, target, contact) {
        // Apply damage
        if (target.takeDamage) {
            const contactPoint = contact.getWorldManifold(null).points[0];
            target.takeDamage(projectile.damage, contactPoint);
        }

        // Destroy projectile
        projectile.destroy();

        eventBus.emit('projectile-hit', { projectile, target });
    }
}
