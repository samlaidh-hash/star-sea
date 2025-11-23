// Derelict - neutral scannable entity
class Derelict extends Entity {
    constructor({ id, x, y, hp = 200, radius = 100, name = 'Derelict' }) {
        super(x, y);
        this.id = id || null;
        this.type = 'derelict';
        this.hp = hp;
        this.maxHp = hp;
        this.radius = radius;
        this.name = name;
        this.active = true;
    }

    takeDamage(dmg) {
        this.hp = Math.max(0, this.hp - (dmg || 0));
        if (this.hp <= 0) this.destroy();
    }

    update(deltaTime) {
        // Static derelict
    }

    render(ctx, camera) {
        // Note: Camera transform already applied, use world coords directly
        ctx.save();
        ctx.fillStyle = '#555555';
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}