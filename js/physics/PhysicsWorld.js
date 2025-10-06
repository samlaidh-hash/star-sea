/**
 * Star Sea - Physics World
 * Wrapper for planck.js physics engine
 */

class PhysicsWorld {
    constructor() {
        // Create planck world with zero gravity (space!)
        this.world = planck.World({
            gravity: planck.Vec2(0, 0)
        });

        // Collision categories (bitflags)
        this.CATEGORY = {
            SHIP: 0x0001,
            PROJECTILE: 0x0002,
            ASTEROID: 0x0004,
            MINE: 0x0008,
            DECOY: 0x0010,
            ENVIRONMENT: 0x0020
        };

        // Collision handler
        this.collisionHandler = null;

        // Setup contact listener
        this.setupContactListener();

        // Map of physics bodies to game entities
        this.bodyToEntity = new Map();
    }

    setupContactListener() {
        this.world.on('begin-contact', (contact) => {
            const fixtureA = contact.getFixtureA();
            const fixtureB = contact.getFixtureB();
            const bodyA = fixtureA.getBody();
            const bodyB = fixtureB.getBody();

            const entityA = this.bodyToEntity.get(bodyA);
            const entityB = this.bodyToEntity.get(bodyB);

            if (entityA && entityB && this.collisionHandler) {
                this.collisionHandler.handleCollision(entityA, entityB, contact);
            }
        });
    }

    setCollisionHandler(handler) {
        this.collisionHandler = handler;
    }

    /**
     * Create a circular body
     */
    createCircleBody(x, y, radius, options = {}) {
        const body = this.world.createBody({
            type: options.type || 'dynamic',
            position: planck.Vec2(x, y),
            angle: MathUtils.toRadians(options.rotation || 0),
            linearDamping: 0, // No friction in space
            angularDamping: 0,
            bullet: options.bullet || false,
            userData: options.userData || {}
        });

        const fixture = body.createFixture({
            shape: planck.Circle(radius),
            density: options.density || 1.0,
            friction: options.friction || 0,
            restitution: options.restitution || 0.8, // Bounciness
            filterCategoryBits: options.category || this.CATEGORY.SHIP,
            filterMaskBits: options.mask || 0xFFFF
        });

        return body;
    }

    /**
     * Create a polygon body
     */
    createPolygonBody(x, y, vertices, options = {}) {
        const body = this.world.createBody({
            type: options.type || 'dynamic',
            position: planck.Vec2(x, y),
            angle: MathUtils.toRadians(options.rotation || 0),
            linearDamping: 0,
            angularDamping: 0,
            bullet: options.bullet || false,
            userData: options.userData || {}
        });

        // Convert vertices to planck format
        const planckVertices = vertices.map(v => planck.Vec2(v.x, v.y));

        const fixture = body.createFixture({
            shape: planck.Polygon(planckVertices),
            density: options.density || 1.0,
            friction: options.friction || 0,
            restitution: options.restitution || 0.8,
            filterCategoryBits: options.category || this.CATEGORY.SHIP,
            filterMaskBits: options.mask || 0xFFFF
        });

        return body;
    }

    /**
     * Create a box body
     */
    createBoxBody(x, y, width, height, options = {}) {
        const body = this.world.createBody({
            type: options.type || 'dynamic',
            position: planck.Vec2(x, y),
            angle: MathUtils.toRadians(options.rotation || 0),
            linearDamping: 0,
            angularDamping: 0,
            bullet: options.bullet || false,
            userData: options.userData || {}
        });

        const fixture = body.createFixture({
            shape: planck.Box(width / 2, height / 2),
            density: options.density || 1.0,
            friction: options.friction || 0,
            restitution: options.restitution || 0.8,
            filterCategoryBits: options.category || this.CATEGORY.SHIP,
            filterMaskBits: options.mask || 0xFFFF
        });

        return body;
    }

    /**
     * Register entity with physics body
     */
    registerEntity(body, entity) {
        this.bodyToEntity.set(body, entity);
    }

    /**
     * Unregister entity
     */
    unregisterEntity(body) {
        this.bodyToEntity.delete(body);
    }

    /**
     * Destroy a body
     */
    destroyBody(body) {
        this.unregisterEntity(body);
        this.world.destroyBody(body);
    }

    /**
     * Step the physics simulation
     */
    step(deltaTime) {
        // Use fixed timestep for stability
        this.world.step(deltaTime, CONFIG.VELOCITY_ITERATIONS, CONFIG.POSITION_ITERATIONS);
    }

    /**
     * Apply force to body
     */
    applyForce(body, forceX, forceY, worldPoint = null) {
        const force = planck.Vec2(forceX, forceY);
        const point = worldPoint ? planck.Vec2(worldPoint.x, worldPoint.y) : body.getWorldCenter();
        body.applyForce(force, point);
    }

    /**
     * Apply impulse to body (instant force)
     */
    applyImpulse(body, impulseX, impulseY, worldPoint = null) {
        const impulse = planck.Vec2(impulseX, impulseY);
        const point = worldPoint ? planck.Vec2(worldPoint.x, worldPoint.y) : body.getWorldCenter();
        body.applyLinearImpulse(impulse, point);
    }

    /**
     * Get all bodies in radius
     */
    getBodiesInRadius(x, y, radius) {
        const bodies = [];
        const searchAABB = planck.AABB(
            planck.Vec2(x - radius, y - radius),
            planck.Vec2(x + radius, y + radius)
        );

        this.world.queryAABB(searchAABB, (fixture) => {
            const body = fixture.getBody();
            const pos = body.getPosition();
            const dist = MathUtils.distance(x, y, pos.x, pos.y);
            if (dist <= radius) {
                bodies.push(body);
            }
            return true; // Continue query
        });

        return bodies;
    }

    /**
     * Raycast
     */
    rayCast(x1, y1, x2, y2, callback) {
        const point1 = planck.Vec2(x1, y1);
        const point2 = planck.Vec2(x2, y2);

        this.world.rayCast(point1, point2, (fixture, point, normal, fraction) => {
            const body = fixture.getBody();
            const entity = this.bodyToEntity.get(body);

            return callback(entity, point, normal, fraction);
        });
    }
}
