/**
 * Star Sea - Interceptor Missile Entity
 * Intercepts and destroys incoming torpedoes
 */

class InterceptorMissile extends Projectile {
    constructor(config) {
        super(config);
        this.type = 'interceptor_missile';
        this.target = config.target || null;
        this.interceptRange = config.interceptRange || 100;
        this.speed = config.speed || CONFIG.TORPEDO_SPEED_MULTIPLIER * CONFIG.MAX_SPEED_CA * 1.5; // Faster than torpedoes
        this.lifetime = config.lifetime || 10.0; // 10 second lifetime
        this.damage = config.damage || 1;
        this.color = CONFIG.COLOR_INTERCEPTOR_MISSILE || '#00ff00';
        this.radius = 4;
    }

    update(deltaTime) {
        if (!this.active) return;

        // Sync position from physics
        if (this.physicsComponent) {
            this.physicsComponent.syncToEntity();
        }

        // Update lifetime
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.destroy();
            return;
        }

        // Find and intercept torpedoes
        this.findAndInterceptTarget();

        // Move towards target
        if (this.target) {
            this.moveTowardsTarget(deltaTime);
        } else {
            this.moveForward(deltaTime);
        }
    }

    findAndInterceptTarget() {
        if (!this.target || !this.target.active) {
            // Find nearest torpedo
            let nearestTorpedo = null;
            let nearestDistance = Infinity;

            for (const entity of window.game.entities) {
                if (entity.type === 'torpedo' && entity.active && entity !== this) {
                    const distance = MathUtils.distance(this.x, this.y, entity.x, entity.y);
                    if (distance <= this.interceptRange && distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestTorpedo = entity;
                    }
                }
            }

            if (nearestTorpedo) {
                this.target = nearestTorpedo;
            }
        }
    }

    moveTowardsTarget(deltaTime) {
        if (!this.target || !this.target.active) return;

        const angleToTarget = MathUtils.angleBetween(this.x, this.y, this.target.x, this.target.y);
        this.rotation = angleToTarget;

        // Move towards target
        const thrust = this.speed * deltaTime;
        const thrustVec = MathUtils.vectorFromAngle(this.rotation, thrust);
        
        if (this.physicsComponent) {
            this.physicsComponent.body.applyForceToCenter(
                planck.Vec2(thrustVec.x, thrustVec.y)
            );
        } else {
            this.x += thrustVec.x;
            this.y += thrustVec.y;
        }

        // Check if close enough to intercept
        const distance = MathUtils.distance(this.x, this.y, this.target.x, this.target.y);
        if (distance <= this.radius + this.target.radius) {
            this.interceptTarget();
        }
    }

    moveForward(deltaTime) {
        const thrust = this.speed * deltaTime;
        const thrustVec = MathUtils.vectorFromAngle(this.rotation, thrust);
        
        if (this.physicsComponent) {
            this.physicsComponent.body.applyForceToCenter(
                planck.Vec2(thrustVec.x, thrustVec.y)
            );
        } else {
            this.x += thrustVec.x;
            this.y += thrustVec.y;
        }
    }

    interceptTarget() {
        if (!this.target) return;

        // Destroy the target torpedo
        this.target.destroy();

        eventBus.emit('torpedo-intercepted', {
            interceptor: this,
            target: this.target,
            x: this.x,
            y: this.y
        });

        console.log('Torpedo intercepted by interceptor missile');

        // Destroy the interceptor
        this.destroy();
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw interceptor missile body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw interceptor indicator
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 1, 0, Math.PI * 2);
        ctx.stroke();

        // Draw trail
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(-this.radius * 2, 0);
        ctx.stroke();

        ctx.restore();
    }
}

