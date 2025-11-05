// Top-level Renderer - orchestrates drawing of world and entities
class Renderer {
    constructor(ctx, camera) {
        this.ctx = ctx;
        this.camera = camera;
        this.shipRenderer = new ShipRenderer(ctx);
        this.uiRenderer = new UIRenderer();
        this.environmentRenderer = new EnvironmentRenderer(ctx);
    }

    render(entities, warpProgress = 0, playerShip = null) {
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

        // Render tractor beam effect (if active)
        if (playerShip && playerShip.tractorBeam && playerShip.tractorBeam.isActive()) {
            this.renderTractorBeam(playerShip.tractorBeam, playerShip);
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

    renderTractorBeam(tractorBeam, ship) {
        const target = tractorBeam.getTarget();
        if (!target) return;

        // Get screen positions
        const shipScreen = this.camera.worldToScreen(ship.x, ship.y);
        const targetScreen = this.camera.worldToScreen(target.x, target.y);

        // Calculate beam properties
        const distance = MathUtils.distance(ship.x, ship.y, target.x, target.y);
        const efficiency = tractorBeam.calculateRangeEfficiency(distance);
        const lockProgress = tractorBeam.getLockProgress();

        // Beam color based on lock status
        const baseColor = lockProgress >= 1.0 ? '#00ffff' : '#ffff00';
        const alpha = 0.3 + (efficiency * 0.4) + (lockProgress * 0.3);

        this.ctx.save();

        // Draw main beam line
        this.ctx.strokeStyle = baseColor;
        this.ctx.globalAlpha = alpha;
        this.ctx.lineWidth = 2 * this.camera.zoom * (0.5 + efficiency * 0.5);
        this.ctx.beginPath();
        this.ctx.moveTo(shipScreen.x, shipScreen.y);
        this.ctx.lineTo(targetScreen.x, targetScreen.y);
        this.ctx.stroke();

        // Draw pulsing glow effect
        const pulsePhase = (performance.now() / 500) % 1.0;
        this.ctx.strokeStyle = baseColor;
        this.ctx.globalAlpha = alpha * (0.5 + Math.sin(pulsePhase * Math.PI * 2) * 0.5);
        this.ctx.lineWidth = 4 * this.camera.zoom * (0.5 + efficiency * 0.5);
        this.ctx.beginPath();
        this.ctx.moveTo(shipScreen.x, shipScreen.y);
        this.ctx.lineTo(targetScreen.x, targetScreen.y);
        this.ctx.stroke();

        // Draw lock indicator on target
        if (lockProgress >= 1.0) {
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.globalAlpha = 0.8;
            this.ctx.lineWidth = 2;
            const targetRadius = (target.radius || target.getShipSize?.() || 20) * this.camera.zoom;
            this.ctx.beginPath();
            this.ctx.arc(targetScreen.x, targetScreen.y, targetRadius + 5, 0, Math.PI * 2);
            this.ctx.stroke();
        } else {
            // Draw locking progress arc
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.globalAlpha = 0.6;
            this.ctx.lineWidth = 2;
            const targetRadius = (target.radius || target.getShipSize?.() || 20) * this.camera.zoom;
            this.ctx.beginPath();
            this.ctx.arc(targetScreen.x, targetScreen.y, targetRadius + 5, 0, Math.PI * 2 * lockProgress);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }
}