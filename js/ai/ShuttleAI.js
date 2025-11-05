/**
 * Star Sea - Shuttle AI Controller
 * Handles AI behavior for all shuttle mission types
 */

const ShuttleAI = {
    /**
     * Attack Mission: Seek and destroy nearest enemy
     */
    attack: function(shuttle, deltaTime) {
        const entities = window.engine ? window.engine.entities : [];

        switch (shuttle.missionState) {
            case 'SEEK_TARGET':
                // Find nearest enemy
                shuttle.target = this.findNearestEnemy(shuttle, entities);

                if (shuttle.target && shuttle.target.active) {
                    shuttle.missionState = 'ENGAGE';
                    shuttle.stateTimer = 0;
                } else {
                    // No target, loiter near parent
                    this.loiterNearParent(shuttle, deltaTime);
                }
                break;

            case 'ENGAGE':
                if (!shuttle.target || !shuttle.target.active) {
                    shuttle.missionState = 'SEEK_TARGET';
                    shuttle.target = null;
                    break;
                }

                // Calculate distance to target
                const dx = shuttle.target.x - shuttle.x;
                const dy = shuttle.target.y - shuttle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Maintain optimal firing range (80% of weapon range)
                const optimalRange = shuttle.weapon.range * 0.8;

                if (distance > optimalRange + 30) {
                    // Too far - move closer
                    shuttle.moveTowards(shuttle.target.x, shuttle.target.y, deltaTime);
                } else if (distance < optimalRange - 30) {
                    // Too close - back away
                    const retreatX = shuttle.x - dx * 0.1;
                    const retreatY = shuttle.y - dy * 0.1;
                    shuttle.moveTowards(retreatX, retreatY, deltaTime);
                } else {
                    // Good range - circle strafe
                    const strafeAngle = Math.atan2(dy, dx) + Math.PI / 2;
                    const strafeX = shuttle.x + Math.cos(strafeAngle) * 50;
                    const strafeY = shuttle.y + Math.sin(strafeAngle) * 50;
                    shuttle.moveTowards(strafeX, strafeY, deltaTime);
                }

                // Fire weapon if in arc
                const projectile = shuttle.fireWeapon(shuttle.target.x, shuttle.target.y);
                if (projectile && window.engine) {
                    window.engine.entities.push(projectile);
                }
                break;

            case 'RETURNING':
                this.returnToParent(shuttle, deltaTime);
                break;
        }
    },

    /**
     * Defense Mission: Loiter near parent and intercept threats
     */
    defense: function(shuttle, deltaTime) {
        const entities = window.engine ? window.engine.entities : [];

        switch (shuttle.missionState) {
            case 'LOITER':
                // Stay within 200 units of parent
                if (!shuttle.parentShip || !shuttle.parentShip.active) {
                    shuttle.destroy();
                    return;
                }

                const dx = shuttle.parentShip.x - shuttle.x;
                const dy = shuttle.parentShip.y - shuttle.y;
                const distanceFromParent = Math.sqrt(dx * dx + dy * dy);

                if (distanceFromParent > 200) {
                    // Move back towards parent
                    shuttle.moveTowards(shuttle.parentShip.x, shuttle.parentShip.y, deltaTime);
                } else {
                    // Circle parent
                    const angle = Math.atan2(dy, dx) + deltaTime * 0.5;
                    const orbitX = shuttle.parentShip.x + Math.cos(angle) * 150;
                    const orbitY = shuttle.parentShip.y + Math.sin(angle) * 150;
                    shuttle.moveTowards(orbitX, orbitY, deltaTime);
                }

                // Scan for threats
                const threat = this.findNearestThreat(shuttle, entities);
                if (threat) {
                    shuttle.target = threat;
                    if (threat.type === 'torpedo' || threat.type === 'plasma-torpedo') {
                        shuttle.missionState = 'INTERCEPT_TORPEDO';
                    } else if (threat.type === 'shuttle') {
                        shuttle.missionState = 'INTERCEPT_SHUTTLE';
                    } else {
                        shuttle.missionState = 'ENGAGE_SHIP';
                    }
                    shuttle.stateTimer = 0;
                }
                break;

            case 'INTERCEPT_TORPEDO':
                if (!shuttle.target || !shuttle.target.active) {
                    shuttle.missionState = 'LOITER';
                    shuttle.target = null;
                    break;
                }

                // Move to intercept
                shuttle.moveTowards(shuttle.target.x, shuttle.target.y, deltaTime);

                // Fire at torpedo
                const torpProjectile = shuttle.fireWeapon(shuttle.target.x, shuttle.target.y);
                if (torpProjectile && window.engine) {
                    window.engine.entities.push(torpProjectile);
                }

                // Check if torpedo destroyed or out of range
                const torpDist = Math.sqrt((shuttle.target.x - shuttle.x) ** 2 + (shuttle.target.y - shuttle.y) ** 2);
                if (torpDist > 300) {
                    shuttle.missionState = 'LOITER';
                    shuttle.target = null;
                }
                break;

            case 'INTERCEPT_SHUTTLE':
                if (!shuttle.target || !shuttle.target.active) {
                    shuttle.missionState = 'LOITER';
                    shuttle.target = null;
                    break;
                }

                // Chase enemy shuttle
                shuttle.moveTowards(shuttle.target.x, shuttle.target.y, deltaTime);

                // Fire weapon
                const shuttleProjectile = shuttle.fireWeapon(shuttle.target.x, shuttle.target.y);
                if (shuttleProjectile && window.engine) {
                    window.engine.entities.push(shuttleProjectile);
                }
                break;

            case 'ENGAGE_SHIP':
                if (!shuttle.target || !shuttle.target.active) {
                    shuttle.missionState = 'LOITER';
                    shuttle.target = null;
                    break;
                }

                // Don't chase beyond 300 units from parent
                const parentDx = shuttle.parentShip.x - shuttle.x;
                const parentDy = shuttle.parentShip.y - shuttle.y;
                const parentDist = Math.sqrt(parentDx * parentDx + parentDy * parentDy);

                if (parentDist > 300) {
                    shuttle.missionState = 'LOITER';
                    shuttle.target = null;
                    break;
                }

                // Engage ship
                shuttle.moveTowards(shuttle.target.x, shuttle.target.y, deltaTime);

                const shipProjectile = shuttle.fireWeapon(shuttle.target.x, shuttle.target.y);
                if (shipProjectile && window.engine) {
                    window.engine.entities.push(shipProjectile);
                }
                break;

            case 'RETURNING':
                this.returnToParent(shuttle, deltaTime);
                break;
        }
    },

    /**
     * Wild Weasel Mission: Fly away and attract torpedoes
     */
    weasel: function(shuttle, deltaTime) {
        switch (shuttle.missionState) {
            case 'FLEE':
                if (!shuttle.parentShip || !shuttle.parentShip.active) {
                    shuttle.destroy();
                    return;
                }

                // Calculate vector away from parent
                const dx = shuttle.x - shuttle.parentShip.x;
                const dy = shuttle.y - shuttle.parentShip.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Fly away at maximum speed
                if (distance < 1000) {
                    const fleeX = shuttle.x + dx * 10;
                    const fleeY = shuttle.y + dy * 10;
                    shuttle.moveTowards(fleeX, fleeY, deltaTime);
                } else {
                    // Far enough, just maintain heading
                    shuttle.velocity.x = Math.cos(shuttle.rotation) * shuttle.maxSpeed;
                    shuttle.velocity.y = Math.sin(shuttle.rotation) * shuttle.maxSpeed;
                }

                // Emit torpedo attraction signal (handled by Engine)
                if (typeof eventBus !== 'undefined') {
                    eventBus.emit('weasel-active', { shuttle: shuttle });
                }
                break;

            case 'RETURNING':
                this.returnToParent(shuttle, deltaTime);
                break;
        }
    },

    /**
     * Suicide Mission: Ram nearest enemy
     */
    suicide: function(shuttle, deltaTime) {
        const entities = window.engine ? window.engine.entities : [];

        switch (shuttle.missionState) {
            case 'SEEK_TARGET':
                // Find nearest enemy ship
                shuttle.target = this.findNearestEnemy(shuttle, entities);

                if (shuttle.target && shuttle.target.active) {
                    shuttle.missionState = 'RAM';
                    shuttle.stateTimer = 0;
                } else {
                    // No target, wait
                    this.loiterNearParent(shuttle, deltaTime);
                }
                break;

            case 'RAM':
                if (!shuttle.target || !shuttle.target.active) {
                    shuttle.missionState = 'SEEK_TARGET';
                    shuttle.target = null;
                    break;
                }

                // Accelerate directly at target
                shuttle.moveTowards(shuttle.target.x, shuttle.target.y, deltaTime);

                // Boost speed for ram
                const boostFactor = 1.5;
                shuttle.velocity.x = Math.cos(shuttle.rotation) * shuttle.maxSpeed * boostFactor;
                shuttle.velocity.y = Math.sin(shuttle.rotation) * shuttle.maxSpeed * boostFactor;

                // Check if close enough to detonate
                const dx = shuttle.target.x - shuttle.x;
                const dy = shuttle.target.y - shuttle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 50) {
                    // DETONATE!
                    this.detonateShuttle(shuttle);
                }
                break;
        }
    },

    /**
     * Transport Mission: Move to location, pause, return
     */
    transport: function(shuttle, deltaTime) {
        switch (shuttle.missionState) {
            case 'MOVE_TO_TARGET':
                if (!shuttle.waypoint) {
                    // No waypoint, return
                    shuttle.missionState = 'RETURNING';
                    break;
                }

                const arrived = shuttle.moveTowards(shuttle.waypoint.x, shuttle.waypoint.y, deltaTime);

                if (arrived) {
                    shuttle.missionState = 'PAUSE';
                    shuttle.transportTimer = 0;
                }
                break;

            case 'PAUSE':
                // Stay at location for specified duration
                shuttle.transportTimer += deltaTime;

                const pauseDuration = shuttle.missionData.pauseDuration || 5; // Default 5 seconds

                if (shuttle.transportTimer >= pauseDuration) {
                    shuttle.missionState = 'RETURNING';
                    shuttle.transportTimer = 0;
                }
                break;

            case 'RETURNING':
                this.returnToParent(shuttle, deltaTime);
                break;
        }
    },

    /**
     * Helper: Find nearest enemy ship/station
     */
    findNearestEnemy: function(shuttle, entities) {
        let nearest = null;
        let nearestDist = Infinity;

        for (const entity of entities) {
            if (!entity.active) continue;

            // Check if entity is an enemy
            const isEnemy = (entity.type === 'ship' || entity.type === 'space-station') &&
                           entity.faction !== shuttle.faction &&
                           entity !== shuttle.parentShip;

            if (!isEnemy) continue;

            const dx = entity.x - shuttle.x;
            const dy = entity.y - shuttle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < nearestDist) {
                nearest = entity;
                nearestDist = dist;
            }
        }

        return nearest;
    },

    /**
     * Helper: Find nearest threat to parent ship
     */
    findNearestThreat: function(shuttle, entities) {
        if (!shuttle.parentShip) return null;

        let nearest = null;
        let nearestDist = Infinity;

        // Priority: Torpedoes homing on parent > Enemy shuttles > Enemy ships
        const priorities = [
            { types: ['torpedo', 'plasma-torpedo'], weight: 3 },
            { types: ['shuttle'], weight: 2 },
            { types: ['ship'], weight: 1 }
        ];

        for (const priority of priorities) {
            for (const entity of entities) {
                if (!entity.active) continue;

                // Check if entity is a threat
                const isThreat = priority.types.includes(entity.type) &&
                                entity.faction !== shuttle.faction;

                if (!isThreat) continue;

                // Check if threatening parent
                const dx = entity.x - shuttle.parentShip.x;
                const dy = entity.y - shuttle.parentShip.y;
                const distToParent = Math.sqrt(dx * dx + dy * dy);

                if (distToParent > 400) continue; // Too far to be immediate threat

                // Calculate distance from shuttle to threat
                const sdx = entity.x - shuttle.x;
                const sdy = entity.y - shuttle.y;
                const distToShuttle = Math.sqrt(sdx * sdx + sdy * sdy);

                const weightedDist = distToShuttle / priority.weight;

                if (weightedDist < nearestDist) {
                    nearest = entity;
                    nearestDist = weightedDist;
                }
            }

            // If we found something at this priority level, return it
            if (nearest) return nearest;
        }

        return nearest;
    },

    /**
     * Helper: Loiter near parent ship
     */
    loiterNearParent: function(shuttle, deltaTime) {
        if (!shuttle.parentShip || !shuttle.parentShip.active) {
            shuttle.destroy();
            return;
        }

        // Circle parent at 100 units
        const angle = performance.now() / 5000; // Slow orbit
        const orbitX = shuttle.parentShip.x + Math.cos(angle) * 100;
        const orbitY = shuttle.parentShip.y + Math.sin(angle) * 100;
        shuttle.moveTowards(orbitX, orbitY, deltaTime);
    },

    /**
     * Helper: Return shuttle to parent ship
     */
    returnToParent: function(shuttle, deltaTime) {
        if (!shuttle.parentShip || !shuttle.parentShip.active) {
            shuttle.destroy();
            return;
        }

        const arrived = shuttle.moveTowards(shuttle.parentShip.x, shuttle.parentShip.y, deltaTime);

        if (arrived || shuttle.isNearParent()) {
            // Attempt docking
            if (shuttle.returnToBay()) {
                // Successfully docked
                if (typeof eventBus !== 'undefined') {
                    eventBus.emit('shuttle-docked', { shuttle: shuttle, parentShip: shuttle.parentShip });
                }
            } else {
                // Bay full, continue loitering
                shuttle.missionState = 'LOITER';
            }
        }
    },

    /**
     * Helper: Detonate suicide shuttle
     */
    detonateShuttle: function(shuttle) {
        const entities = window.engine ? window.engine.entities : [];

        // Explosion damage = 2 heavy torpedoes
        const explosionDamage = 4; // 2 torpedoes × 2 damage each
        const explosionRadius = 80;

        // Damage all entities in radius
        for (const entity of entities) {
            if (!entity.active) continue;
            if (entity === shuttle) continue;

            const dx = entity.x - shuttle.x;
            const dy = entity.y - shuttle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < explosionRadius) {
                const damageFalloff = 1 - (distance / explosionRadius);
                const damage = explosionDamage * damageFalloff;

                if (entity.takeDamage) {
                    entity.takeDamage(damage, shuttle);
                }
            }
        }

        // Emit explosion event
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('shuttle-detonation', {
                x: shuttle.x,
                y: shuttle.y,
                radius: explosionRadius,
                damage: explosionDamage
            });
        }

        // Destroy shuttle
        shuttle.destroy();
    }
};
