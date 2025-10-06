/**
 * Star Sea - Physics Component
 * Attaches a physics body to an entity
 */

class PhysicsComponent {
    constructor(entity, body, physicsWorld) {
        this.entity = entity;
        this.body = body;
        this.physicsWorld = physicsWorld;

        // Register entity with physics world
        physicsWorld.registerEntity(body, entity);
    }

    /**
     * Sync entity transform with physics body
     */
    syncToEntity() {
        if (!this.body) return;

        const pos = this.body.getPosition();
        const angle = this.body.getAngle();

        this.entity.transform.x = pos.x;
        this.entity.transform.y = pos.y;
        this.entity.transform.rotation = MathUtils.toDegrees(angle);

        const vel = this.body.getLinearVelocity();
        this.entity.transform.vx = vel.x;
        this.entity.transform.vy = vel.y;
    }

    /**
     * Sync physics body with entity transform
     */
    syncFromEntity() {
        if (!this.body) return;

        this.body.setPosition(planck.Vec2(this.entity.x, this.entity.y));
        this.body.setAngle(MathUtils.toRadians(this.entity.rotation));
        this.body.setLinearVelocity(planck.Vec2(this.entity.vx, this.entity.vy));
    }

    /**
     * Apply force to body
     */
    applyForce(forceX, forceY, worldPoint = null) {
        if (!this.body) return;
        this.physicsWorld.applyForce(this.body, forceX, forceY, worldPoint);
    }

    /**
     * Apply impulse to body
     */
    applyImpulse(impulseX, impulseY, worldPoint = null) {
        if (!this.body) return;
        this.physicsWorld.applyImpulse(this.body, impulseX, impulseY, worldPoint);
    }

    /**
     * Set velocity
     */
    setVelocity(vx, vy) {
        if (!this.body) return;
        this.body.setLinearVelocity(planck.Vec2(vx, vy));
    }

    /**
     * Get velocity
     */
    getVelocity() {
        if (!this.body) return { x: 0, y: 0 };
        const vel = this.body.getLinearVelocity();
        return { x: vel.x, y: vel.y };
    }

    /**
     * Destroy physics body
     */
    destroy() {
        if (this.body) {
            this.physicsWorld.destroyBody(this.body);
            this.body = null;
        }
    }
}
