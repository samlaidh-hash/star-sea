/**
 * Star Sea - Environmental Hazards
 * Collapsars (black holes), Dust Clouds, Planets
 */

class EnvironmentalHazard extends Entity {
    constructor(x, y, hazardType, config = {}) {
        super(x, y);
        this.type = hazardType; // 'collapsar', 'dust', 'planet'
        this.hazardType = hazardType;
        this.config = config;

        this.setupHazard();
    }

    setupHazard() {
        switch (this.hazardType) {
            case 'collapsar':
                this.setupCollapsar();
                break;
            case 'dust':
                this.setupDustCloud();
                break;
            case 'planet':
                this.setupPlanet();
                break;
        }
    }

    setupCollapsar() {
        this.radius = this.config.radius || 30;
        this.gravityRadius = this.radius * CONFIG.COLLAPSAR_GRAVITY_RADIUS_MULTIPLIER;
        this.color = '#000000';
        this.eventHorizonColor = '#4400ff';

        // Create gravity well
        this.gravityWell = new GravityWell(
            this.x,
            this.y,
            this.gravityRadius,
            CONFIG.COLLAPSAR_GRAVITY_PULL
        );

        // Particle system for visual effect
        this.particles = this.generateCollapsarParticles();
    }

    setupDustCloud() {
        this.radius = this.config.radius || 100;
        this.color = 'rgba(128, 128, 128, 0.3)';
        this.blocksBeams = true;

        // Particle system
        this.particles = this.generateDustParticles();
    }

    setupPlanet() {
        this.radius = this.config.radius || 150;
        this.color = this.config.color || '#8844aa';
        this.isMoon = this.config.isMoon || false;
    }

    generateCollapsarParticles() {
        const particles = [];
        const count = CONFIG.PARTICLE_COUNT_COLLAPSAR;

        for (let i = 0; i < count; i++) {
            const angle = MathUtils.random(0, 360);
            const distance = MathUtils.random(this.radius, this.gravityRadius);
            const speed = MathUtils.random(20, 60);

            particles.push({
                angle: angle,
                distance: distance,
                speed: speed,
                size: MathUtils.random(1, 3),
                brightness: MathUtils.random(0.3, 1.0)
            });
        }

        return particles;
    }

    generateDustParticles() {
        const particles = [];
        const count = CONFIG.PARTICLE_COUNT_DUST;

        for (let i = 0; i < count; i++) {
            const angle = MathUtils.random(0, 360);
            const distance = MathUtils.random(0, this.radius);
            const pos = MathUtils.pointAtAngle(0, 0, angle, distance);

            particles.push({
                x: pos.x,
                y: pos.y,
                size: MathUtils.random(1, 4),
                brightness: MathUtils.random(0.2, 0.6)
            });
        }

        return particles;
    }

    update(deltaTime) {
        // Update collapsar particles (orbital motion)
        if (this.hazardType === 'collapsar' && this.particles) {
            for (const particle of this.particles) {
                particle.angle += particle.speed * deltaTime;
                particle.angle = MathUtils.normalizeAngle(particle.angle);

                // Slowly pull particles inward
                particle.distance -= deltaTime * 5;
                if (particle.distance < this.radius) {
                    // Reset particle to outer edge
                    particle.distance = this.gravityRadius;
                    particle.angle = MathUtils.random(0, 360);
                }
            }
        }
    }

    /**
     * Apply gravity to entities (for collapsar)
     */
    applyGravity(entities, deltaTime) {
        if (this.gravityWell) {
            this.gravityWell.applyGravity(entities, deltaTime);
        }
    }

    /**
     * Check if point is inside dust cloud
     */
    isInDustCloud(x, y) {
        if (this.hazardType !== 'dust') return false;
        return MathUtils.distance(this.x, this.y, x, y) <= this.radius;
    }
}
