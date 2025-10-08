// Top-level Renderer - orchestrates drawing of world and entities
class Renderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
        this.shipRenderer = new ShipRenderer(ctx);
        this.uiRenderer = new UIRenderer();
        this.environmentRenderer = new EnvironmentRenderer(ctx);
    }

    render(entities, warpProgress = 0) {
        // Apply camera transform
        this.camera.applyTransform(this.ctx);

        // Render entities
        for (const entity of entities) {
            if (!entity.active) continue;

            switch (entity.type) {
                case 'ship':
                    this.shipRenderer.render(entity);
                    break;
                case 'asteroid':
                case 'environment':
                    this.environmentRenderer.render(entity);
                    break;
                case 'projectile':
                    this.renderProjectile(entity);
                    break;
                case 'decoy':
                case 'mine':
                    this.renderSimpleMarker(entity);
                    break;
                default:
                    // Generic entity with render method
                    if (typeof entity.render === 'function') {
                        entity.render(this.ctx, this.camera);
                    } else {
                        this.renderGenericEntity(entity);
                    }
                    break;
            }
        }

        // Remove camera transform
        this.camera.removeTransform(this.ctx);
    }

    renderProjectile(p) {
        // Simple projectile rendering if no custom method
        const screen = this.camera.worldToScreen(p.x, p.y);
        this.ctx.save();
        this.ctx.fillStyle = (p.projectileType === 'plasma') ? '#00ff88'
                           : (p.projectileType === 'torpedo') ? '#ffaa00'
                           : (p.projectileType === 'disruptor') ? '#ff00ff'
                           : '#ff5555';
        const size = (p.projectileType === 'torpedo' || p.projectileType === 'plasma') ? 3 : 2;
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, size * this.camera.zoom, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderSimpleMarker(e) {
        const screen = this.camera.worldToScreen(e.x, e.y);
        this.ctx.save();
        this.ctx.strokeStyle = (e.type === 'decoy') ? '#00ffff' : '#ff9900';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, 6 * this.camera.zoom, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    renderGenericEntity(e) {
        const screen = this.camera.worldToScreen(e.x, e.y);
        this.ctx.save();
        this.ctx.fillStyle = '#cccccc';
        const r = (e.radius || 12) * this.camera.zoom;
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}