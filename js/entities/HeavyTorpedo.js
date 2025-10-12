/**
 * Star Sea - Heavy Torpedo Entity
 * More damage and blast radius than regular torpedoes
 */

class HeavyTorpedo extends TorpedoProjectile {
    constructor(config) {
        super(config);
        this.type = 'heavy_torpedo';
        this.damage = config.damage || 3; // 3 damage vs 2 for regular torpedoes
        this.blastRadius = config.blastRadius || CONFIG.TORPEDO_BLAST_RADIUS_PIXELS * 1.5; // 1.5x blast radius
        this.speed = config.speed || CONFIG.TORPEDO_SPEED_MULTIPLIER * CONFIG.MAX_SPEED_CA * 0.8; // Slightly slower
        this.lifetime = config.lifetime || CONFIG.TORPEDO_LIFETIME * 1.2; // Longer lifetime
        this.color = CONFIG.COLOR_HEAVY_TORPEDO || '#ff6600';
        this.radius = 6; // Larger than regular torpedoes

        // Heavy torpedoes require 3 beam hits to destroy
        this.hitsToDestroy = 3;
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw heavy torpedo body (larger than regular)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw heavy torpedo indicator
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
        ctx.stroke();

        // Draw trail
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(-this.radius * 2, 0);
        ctx.stroke();

        ctx.restore();
    }

    explode() {
        // Create larger explosion
        eventBus.emit('heavy-torpedo-exploded', {
            x: this.x,
            y: this.y,
            damage: this.damage,
            blastRadius: this.blastRadius,
            sourceShip: this.sourceShip
        });

        this.destroy();
    }
}

