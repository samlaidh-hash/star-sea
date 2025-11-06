/**
 * Star Sea - Gravel Cloud Entity
 * Short-lived particle effect created when small asteroids are destroyed
 */

class GravelCloud extends Entity {
    constructor(x, y, vx, vy) {
        super(x, y);
        this.type = 'gravel-cloud';
        this.vx = vx;
        this.vy = vy;

        // Lifetime
        this.lifetime = 2.0; // seconds
        this.age = 0;

        // Particle cloud properties
        this.particleCount = 20;
        this.particles = [];
        this.expansionRate = 50; // pixels per second

        // Create particles
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * this.expansionRate;

            this.particles.push({
                x: 0, // Relative to cloud center
                y: 0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1 + Math.random() * 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 180
            });
        }
    }

    update(deltaTime) {
        this.age += deltaTime;

        // Move cloud center
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Update particles
        for (const particle of this.particles) {
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.rotation += particle.rotationSpeed * deltaTime;
        }

        // Destroy when lifetime expires
        if (this.age >= this.lifetime) {
            this.destroy();
        }
    }

    /**
     * Get alpha based on age (fade out)
     */
    getAlpha() {
        return Math.max(0, 1 - (this.age / this.lifetime));
    }

    /**
     * No collision detection for gravel clouds
     */
    takeDamage() {
        // Gravel clouds are just visual effects - no damage
        return null;
    }
}
