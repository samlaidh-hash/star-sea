// Civilian Transport - simple mission entity
class CivilianTransport extends Entity {
    constructor({ id, x, y, hp = 50, name = 'Civilian Transport' }) {
        super(x, y);
        this.id = id || null;
        this.type = 'civilian-transport';
        this.hp = hp;
        this.maxHp = hp;
        this.name = name;
        this.radius = 20;
        this.color = '#cccccc';
    }

    takeDamage(dmg) {
        this.hp = Math.max(0, this.hp - (dmg || 0));
        if (this.hp <= 0) this.destroy();
    }

    update(deltaTime) {
        // Idle transport for now
    }

    render(ctx, camera) {
        const screen = camera.worldToScreen(this.x, this.y);
        ctx.save();
        ctx.fillStyle = '#bbbbbb';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}