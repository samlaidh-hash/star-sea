/**
 * Star Sea - Asteroid Entity
 */

class Asteroid extends Entity {
    constructor(x, y, size, physicsWorld) {
        super(x, y);
        this.type = 'asteroid';
        this.size = size; // 'large', 'medium', 'small'
        this.physicsWorld = physicsWorld;

        // Visuals
        this.radius = this.getRadius();
        this.vertices = this.generateVertices();
        this.rotationSpeed = MathUtils.random(-30, 30); // degrees per second

        // Physics
        this.createPhysicsBody();

        // Set initial velocity
        const speed = this.getSpeed();
        const angle = MathUtils.random(0, 360);
        const vec = MathUtils.vectorFromAngle(angle, speed);
        this.vx = vec.x;
        this.vy = vec.y;
        this.physicsComponent.setVelocity(vec.x, vec.y);

        // Breaking
        this.shouldBreak = false;
        this.breakPosition = null;
    }

    getRadius() {
        switch (this.size) {
            case 'large': return 40;
            case 'medium': return 25;
            case 'small': return 15;
            default: return 25;
        }
    }

    getSpeed() {
        switch (this.size) {
            case 'large': return CONFIG.ASTEROID_SPEED_LARGE;
            case 'medium': return CONFIG.ASTEROID_SPEED_MEDIUM;
            case 'small': return CONFIG.ASTEROID_SPEED_SMALL;
            default: return CONFIG.ASTEROID_SPEED_MEDIUM;
        }
    }

    generateVertices() {
        // Create irregular asteroid shape
        const vertices = [];
        const points = 8 + Math.floor(Math.random() * 4); // 8-11 points

        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radiusVariation = this.radius * MathUtils.random(0.7, 1.0);
            vertices.push({
                x: Math.cos(angle) * radiusVariation,
                y: Math.sin(angle) * radiusVariation
            });
        }

        return vertices;
    }

    createPhysicsBody() {
        // Create simplified circular physics body
        const body = this.physicsWorld.createCircleBody(this.x, this.y, this.radius, {
            type: 'dynamic',
            density: 2.0,
            restitution: 0.8,
            category: this.physicsWorld.CATEGORY.ASTEROID,
            mask: 0xFFFF
        });

        this.physicsComponent = new PhysicsComponent(this, body, this.physicsWorld);
    }

    update(deltaTime) {
        // Sync position from physics
        this.physicsComponent.syncToEntity();

        // Rotate asteroid
        this.rotation += this.rotationSpeed * deltaTime;
        this.rotation = MathUtils.normalizeAngle(this.rotation);
    }

    /**
     * Break asteroid into smaller pieces
     */
    break() {
        if (this.size === 'small') {
            this.destroy();
            return [];
        }

        const newSize = this.size === 'large' ? 'medium' : 'small';
        const fragments = [];

        // Create two fragments
        for (let i = 0; i < 2; i++) {
            const offset = i === 0 ? -20 : 20;
            const fragment = new Asteroid(
                this.breakPosition.x + offset,
                this.breakPosition.y + offset,
                newSize,
                this.physicsWorld
            );

            // Give fragments velocity based on parent
            const angle = MathUtils.random(0, 360);
            const speed = fragment.getSpeed();
            const vec = MathUtils.vectorFromAngle(angle, speed);
            fragment.physicsComponent.setVelocity(vec.x + this.vx * 0.5, vec.y + this.vy * 0.5);

            fragments.push(fragment);
        }

        this.destroy();
        return fragments;
    }

    destroy() {
        super.destroy();
        if (this.physicsComponent) {
            this.physicsComponent.destroy();
        }
    }
}
