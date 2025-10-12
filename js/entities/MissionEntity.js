/**
 * Star Sea - Mission Entities
 * Non-combat entities for mission objectives (transports, stations, derelicts)
 */

class MissionEntity extends Entity {
    constructor(config) {
        super(config.x, config.y);

        this.id = config.id;
        this.entityType = config.type; // 'civilian-transport', 'space-station', 'derelict', etc.
        this.faction = config.faction || 'NEUTRAL';
        this.hostile = config.hostile || false;

        // Visual properties
        this.radius = config.radius || 60;
        this.color = config.color || '#888';
        this.shape = config.shape || 'circle'; // 'circle', 'square', 'diamond'

        // Health
        this.hp = config.hp || 100;
        this.maxHp = config.hp || 100;

        // Physics (stationary by default)
        this.vx = 0;
        this.vy = 0;
        this.mass = config.mass || 10;

        // State
        this.active = true;
        this.scannable = config.scannable !== false; // True by default
    }

    update(deltaTime) {
        // Most mission entities are stationary, but can be extended
    }

    takeDamage(damage, source) {
        if (!this.active) return;

        this.hp -= damage;

        if (this.hp <= 0) {
            this.hp = 0;
            this.destroy();
        }
    }

    destroy() {
        this.active = false;
        eventBus.emit('mission-entity-destroyed', { entity: this });
    }

    render(ctx, camera) {
        if (!this.active) return;

        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(MathUtils.toRadians(this.rotation));

        // Draw based on shape
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        switch (this.shape) {
            case 'square':
                ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
                ctx.strokeRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -this.radius);
                ctx.lineTo(this.radius, 0);
                ctx.lineTo(0, this.radius);
                ctx.lineTo(-this.radius, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'circle':
            default:
                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
        }

        ctx.restore();
    }
}