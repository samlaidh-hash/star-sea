// EnvironmentRenderer - draws asteroids, hazards, planets, dust clouds
class EnvironmentRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render(entity) {
        if (entity.type === 'asteroid') {
            this.renderAsteroid(entity);
        } else if (entity instanceof EnvironmentalHazard || entity.type === 'environment') {
            this.renderHazard(entity);
        } else {
            // Fallback: simple circle
            this.ctx.save();
            this.ctx.fillStyle = '#888';
            this.ctx.beginPath();
            this.ctx.arc(entity.x, entity.y, (entity.radius || 20), 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    renderAsteroid(asteroid) {
        this.ctx.save();
        this.ctx.translate(asteroid.x, asteroid.y);
        this.ctx.rotate(MathUtils.toRadians(asteroid.rotation || 0));
        this.ctx.fillStyle = '#666666';
        this.ctx.strokeStyle = '#999999';
        this.ctx.lineWidth = 1;

        if (asteroid.vertices && asteroid.vertices.length > 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
            for (let i = 1; i < asteroid.vertices.length; i++) {
                this.ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            // Simple circle
            const r = asteroid.radius || 20;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    renderHazard(hazard) {
        if (hazard.hazardType === 'planet') {
            this.renderPlanet(hazard);
        } else if (hazard.hazardType === 'dust') {
            this.renderDustCloud(hazard);
        } else if (hazard.hazardType === 'collapsar') {
            this.renderCollapsar(hazard);
        } else {
            // Generic
            this.ctx.save();
            this.ctx.fillStyle = hazard.color || '#444';
            this.ctx.beginPath();
            this.ctx.arc(hazard.x, hazard.y, (hazard.radius || 30), 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    renderPlanet(planet) {
        this.ctx.save();
        this.ctx.fillStyle = planet.color || '#8844aa';
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius || 150, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderDustCloud(cloud) {
        this.ctx.save();
        this.ctx.fillStyle = cloud.color || 'rgba(128,128,128,0.3)';
        this.ctx.beginPath();
        this.ctx.arc(cloud.x, cloud.y, cloud.radius || 100, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderCollapsar(collapsar) {
        // Draw event horizon
        this.ctx.save();
        const r = collapsar.radius || 30;
        const color = collapsar.eventHorizonColor || '#4400ff';
        const gradient = this.ctx.createRadialGradient(collapsar.x, collapsar.y, r * 0.6, collapsar.x, collapsar.y, r * 1.2);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(0.7, color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(collapsar.x, collapsar.y, r * 1.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}