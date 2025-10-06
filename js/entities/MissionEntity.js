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
        eventBus.emit('mission-entity-destroyed', {
            entity: this,
            id: this.id,
            type: this.entityType
        });
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenPos = camera.worldToScreen(this.x, this.y);

        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);

        // Draw based on shape
        switch (this.shape) {
            case 'circle':
                this.renderCircle(ctx);
                break;
            case 'square':
                this.renderSquare(ctx);
                break;
            case 'diamond':
                this.renderDiamond(ctx);
                break;
            default:
                this.renderCircle(ctx);
        }

        // Draw HP bar if damaged
        if (this.hp < this.maxHp) {
            this.renderHealthBar(ctx);
        }

        ctx.restore();
    }

    renderCircle(ctx) {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.getFactionColor();
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    renderSquare(ctx) {
        const size = this.radius * 1.5;
        ctx.fillStyle = this.color;
        ctx.fillRect(-size/2, -size/2, size, size);
        ctx.strokeStyle = this.getFactionColor();
        ctx.lineWidth = 2;
        ctx.strokeRect(-size/2, -size/2, size, size);
    }

    renderDiamond(ctx) {
        const size = this.radius * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.lineTo(0, size/2);
        ctx.lineTo(-size/2, 0);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.getFactionColor();
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    renderHealthBar(ctx) {
        const barWidth = this.radius * 2;
        const barHeight = 6;
        const barY = this.radius + 10;

        // Background
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(-barWidth/2, barY, barWidth, barHeight);

        // Health
        const healthPercent = this.hp / this.maxHp;
        ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : (healthPercent > 0.25 ? '#ff0' : '#f00');
        ctx.fillRect(-barWidth/2, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(-barWidth/2, barY, barWidth, barHeight);
    }

    getFactionColor() {
        switch (this.faction) {
            case 'PLAYER': return '#00ff00';
            case 'TRIGON': return '#ff0000';
            case 'SCINTILIAN': return '#00ffff';
            case 'PIRATE': return '#ffaa00';
            case 'NEUTRAL': return '#888888';
            default: return '#ffffff';
        }
    }

    getShipSize() {
        // For compatibility with projectile collision code
        return this.radius;
    }
}

/**
 * Civilian Transport - Unarmed cargo/passenger ship
 */
class CivilianTransport extends MissionEntity {
    constructor(config) {
        super({
            ...config,
            type: 'civilian-transport',
            radius: 40,
            color: '#4488aa',
            shape: 'square',
            hp: config.hp || 50,
            faction: 'NEUTRAL'
        });

        this.name = config.name || 'SS Transport';
    }

    render(ctx, camera) {
        super.render(ctx, camera);

        // Add engine glow effect
        const screenPos = camera.worldToScreen(this.x, this.y);
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);

        // Engine glow
        ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(-this.radius - 5, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Space Station - Large stationary installation
 */
class SpaceStation extends MissionEntity {
    constructor(config) {
        super({
            ...config,
            type: 'space-station',
            radius: config.radius || 100,
            color: '#666666',
            shape: 'circle',
            hp: config.hp || 200,
            faction: config.faction || 'NEUTRAL',
            hostile: config.hostile || false
        });

        this.name = config.name || 'Station';
        this.rotationSpeed = 0.1; // Slow rotation
        this.rotation = 0;
    }

    update(deltaTime) {
        this.rotation += this.rotationSpeed * deltaTime;
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenPos = camera.worldToScreen(this.x, this.y);

        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        ctx.rotate(this.rotation);

        // Draw station structure
        const segments = 8;
        const innerRadius = this.radius * 0.3;
        const outerRadius = this.radius;

        // Outer ring
        ctx.strokeStyle = this.getFactionColor();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Spokes
        for (let i = 0; i < segments; i++) {
            const angle = (Math.PI * 2 / segments) * i;
            const x1 = Math.cos(angle) * innerRadius;
            const y1 = Math.sin(angle) * innerRadius;
            const x2 = Math.cos(angle) * outerRadius;
            const y2 = Math.sin(angle) * outerRadius;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Inner core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // Draw HP bar if damaged
        if (this.hp < this.maxHp) {
            ctx.save();
            ctx.translate(screenPos.x, screenPos.y);
            this.renderHealthBar(ctx);
            ctx.restore();
        }
    }
}

/**
 * Derelict - Abandoned ship or structure
 */
class Derelict extends MissionEntity {
    constructor(config) {
        super({
            ...config,
            type: 'derelict',
            radius: config.radius || 70,
            color: '#444444',
            shape: 'diamond',
            hp: config.hp || 500,
            faction: 'NEUTRAL',
            hostile: false
        });

        this.name = config.name || 'Derelict';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05; // Slow drift
    }

    update(deltaTime) {
        this.rotation += this.rotationSpeed * deltaTime;
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenPos = camera.worldToScreen(this.x, this.y);

        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        ctx.rotate(this.rotation);

        // Draw derelict hull (damaged ship outline)
        const size = this.radius;

        // Main hull
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(size * 0.3, size * 0.4);
        ctx.lineTo(-size * 0.8, size * 0.3);
        ctx.lineTo(-size, 0);
        ctx.lineTo(-size * 0.8, -size * 0.3);
        ctx.lineTo(size * 0.3, -size * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Damage marks
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, size * 0.2);
        ctx.lineTo(-size * 0.3, -size * 0.1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * 0.3);
        ctx.lineTo(size * 0.4, size * 0.1);
        ctx.stroke();

        // Faint power signature (dim glow)
        ctx.fillStyle = 'rgba(100, 150, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw HP bar if damaged
        if (this.hp < this.maxHp) {
            ctx.save();
            ctx.translate(screenPos.x, screenPos.y);
            this.renderHealthBar(ctx);
            ctx.restore();
        }
    }
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MissionEntity, CivilianTransport, SpaceStation, Derelict };
}
