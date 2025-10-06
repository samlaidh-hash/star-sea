/**
 * Star Sea - UI Renderer
 * Renders UI overlays like minimap
 */

class UIRenderer {
    constructor() {
        this.minimapCanvas = document.getElementById('minimap');
        this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;
    }

    renderMinimap(playerShip, entities, detectionRadius) {
        if (!this.minimapCtx || !playerShip) return;

        const ctx = this.minimapCtx;
        const width = this.minimapCanvas.width;
        const height = this.minimapCanvas.height;

        // Clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Scale: show 2x detection radius
        const worldRadius = detectionRadius * 2;
        const scale = Math.min(width, height) / (worldRadius * 2);

        // Center on player
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);

        // Draw detection radius circles
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1 / scale;
        ctx.beginPath();
        ctx.arc(0, 0, detectionRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, detectionRadius * 2, 0, Math.PI * 2);
        ctx.stroke();

        // Draw entities
        for (const entity of entities) {
            if (!entity.active) continue;

            const dx = entity.x - playerShip.x;
            const dy = entity.y - playerShip.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > worldRadius) continue; // Outside minimap range

            if (entity === playerShip) {
                // Player ship (triangle)
                ctx.save();
                ctx.translate(dx, dy);
                ctx.rotate(MathUtils.toRadians(entity.rotation));
                ctx.fillStyle = CONFIG.COLOR_PLAYER;
                ctx.beginPath();
                ctx.moveTo(0, -5 / scale);
                ctx.lineTo(-3 / scale, 3 / scale);
                ctx.lineTo(3 / scale, 3 / scale);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else if (entity.type === 'ship') {
                // Other ships
                const inDetection = dist <= detectionRadius;
                ctx.fillStyle = inDetection ? entity.color : '#0f0';
                ctx.beginPath();
                ctx.arc(dx, dy, inDetection ? 4 / scale : 6 / scale, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    /**
     * Render waypoint direction arrows on screen edges
     * @param {Object} playerShip - The player's ship
     * @param {Array} objectives - Active mission objectives
     * @param {Object} camera - Camera for world-to-screen conversion
     * @param {CanvasRenderingContext2D} ctx - Main canvas context
     */
    renderWaypointArrows(playerShip, objectives, camera, ctx) {
        if (!playerShip || !objectives) return;

        const canvas = ctx.canvas;
        const margin = 40; // Distance from screen edge

        for (const objective of objectives) {
            // Only show arrows for active 'reach' objectives
            if (objective.type !== 'reach' || objective.completed) continue;

            const dx = objective.x - playerShip.x;
            const dy = objective.y - playerShip.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Check if waypoint is off-screen
            const screenPos = camera.worldToScreen(objective.x, objective.y);

            // If waypoint is visible on screen, skip arrow
            if (screenPos.x >= 0 && screenPos.x <= canvas.width &&
                screenPos.y >= 0 && screenPos.y <= canvas.height) {
                continue;
            }

            // Calculate angle to waypoint
            const angle = Math.atan2(dx, -dy); // 0 = up, clockwise

            // Find intersection with screen edge
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Calculate direction from center
            const dirX = Math.sin(angle);
            const dirY = -Math.cos(angle);

            // Find which edge the arrow should be on
            let arrowX, arrowY;

            // Calculate intersection with screen bounds
            const maxX = canvas.width - margin;
            const maxY = canvas.height - margin;

            // Time to reach each edge
            const tRight = dirX > 0 ? (maxX - centerX) / (dirX * 1000) : Infinity;
            const tLeft = dirX < 0 ? (margin - centerX) / (dirX * 1000) : Infinity;
            const tBottom = dirY > 0 ? (maxY - centerY) / (dirY * 1000) : Infinity;
            const tTop = dirY < 0 ? (margin - centerY) / (dirY * 1000) : Infinity;

            const tMin = Math.min(tRight, tLeft, tBottom, tTop);

            if (tMin === Infinity) continue; // Shouldn't happen

            arrowX = centerX + dirX * 1000 * tMin;
            arrowY = centerY + dirY * 1000 * tMin;

            // Draw arrow
            ctx.save();
            ctx.translate(arrowX, arrowY);
            ctx.rotate(angle);

            // Arrow shape
            const arrowSize = 20;
            ctx.fillStyle = '#0ff'; // Cyan color
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;

            ctx.beginPath();
            ctx.moveTo(0, -arrowSize); // Point
            ctx.lineTo(-arrowSize * 0.5, arrowSize * 0.3);
            ctx.lineTo(0, 0);
            ctx.lineTo(arrowSize * 0.5, arrowSize * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Distance text
            ctx.rotate(-angle); // Un-rotate for text
            ctx.fillStyle = '#0ff';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const distText = Math.round(dist).toString();
            ctx.fillText(distText, 0, arrowSize + 15);

            ctx.restore();
        }
    }
}
