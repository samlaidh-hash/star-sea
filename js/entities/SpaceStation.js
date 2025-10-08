// Space Station - static mission entity
class SpaceStation extends Entity {
    constructor({ id, x, y, hp = 300, radius = 120, faction = 'NEUTRAL', hostile = false, name = 'Space Station' }) {
        super(x, y);
        this.id = id || null;
        this.type = 'space-station';
        this.hp = hp;
        this.maxHp = hp;
        this.radius = radius;
        this.faction = faction;
        this.hostile = hostile;
        this.name = name;
        this.active = true;
    }

    takeDamage(dmg) {
        this.hp = Math.max(0, this.hp - (dmg || 0));
        if (this.hp <= 0) this.destroy();
    }

    update(deltaTime) {
        // Static station
    }

    render(ctx, camera) {
        const screen = camera.worldToScreen(this.x, this.y);
        ctx.save();
        ctx.fillStyle = '#444466';
        ctx.strokeStyle = '#8888aa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}