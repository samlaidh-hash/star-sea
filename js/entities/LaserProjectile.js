/**
 * Star Sea - Laser Projectile
 * Fast-moving laser beam for Commonwealth laser batteries
 */

class LaserProjectile extends Projectile {
    constructor(config) {
        super(config.x, config.y);
        this.type = 'laser';
        this.damage = config.damage;
        this.range = config.range;
        this.speed = config.speed;
        this.sourceShip = config.sourceShip;
        this.firingPoint = config.firingPoint || 0;
        
        // Calculate direction to target
        const dx = config.targetX - config.x;
        const dy = config.targetY - config.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        } else {
            this.vx = 0;
            this.vy = 0;
        }
        
        // Visual properties
        this.color = '#00ff00'; // Green laser
        this.width = 2;
        this.trail = [];
        this.maxTrailLength = 5;
        
        // Lifetime
        this.lifetime = this.range / this.speed;
        this.creationTime = performance.now() / 1000;
    }

    update(deltaTime) {
        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Add to trail
        this.trail.push({ x: this.x, y: this.y, time: performance.now() / 1000 });
        
        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Check lifetime
        const currentTime = performance.now() / 1000;
        if (currentTime - this.creationTime >= this.lifetime) {
            this.destroy();
        }
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';

        // Draw main beam
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);

        // Draw trail
        if (this.trail.length > 1) {
            for (let i = 0; i < this.trail.length - 1; i++) {
                if (i === 0) {
                    ctx.moveTo(this.trail[i].x, this.trail[i].y);
                } else {
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                }
            }
        }

        ctx.stroke();
        
        // Draw firing point indicator (small circle)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
     * Handle collision with target
     */
    onHit(target) {
        if (target.takeDamage) {
            target.takeDamage(this.damage, { x: this.x, y: this.y });
        }
        
        // Emit hit event
        eventBus.emit('laser-hit', { 
            projectile: this, 
            target: target, 
            damage: this.damage 
        });
        
        this.destroy();
    }
}

