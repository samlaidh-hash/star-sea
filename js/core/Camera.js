/**
 * Star Sea - Camera
 * Handles viewport and world-to-screen transformations
 * Player ship is locked in center, world scrolls around it
 */

class Camera {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = 0; // World position that camera is centered on
        this.y = 0;
        this.zoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 2.0;
    }

    /**
     * Update camera to follow target (player ship)
     */
    follow(targetX, targetY) {
        this.x = targetX;
        this.y = targetY;
    }

    /**
     * Apply camera transform to canvas context
     */
    applyTransform(ctx) {
        ctx.save();
        // Translate to center of screen
        ctx.translate(this.width / 2, this.height / 2);
        // Apply zoom
        ctx.scale(this.zoom, this.zoom);
        // Translate by negative camera position (world scrolls opposite to player movement)
        ctx.translate(-this.x, -this.y);
    }

    /**
     * Remove camera transform from canvas context
     */
    removeTransform(ctx) {
        ctx.restore();
    }

    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.width / 2) / this.zoom + this.x,
            y: (screenY - this.height / 2) / this.zoom + this.y
        };
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.x) * this.zoom + this.width / 2,
            y: (worldY - this.y) * this.zoom + this.height / 2
        };
    }

    /**
     * Check if world point is visible on screen
     */
    isVisible(worldX, worldY, margin = 100) {
        const screen = this.worldToScreen(worldX, worldY);
        return screen.x >= -margin &&
               screen.x <= this.width + margin &&
               screen.y >= -margin &&
               screen.y <= this.height + margin;
    }

    /**
     * Get viewport bounds in world coordinates
     */
    getViewportBounds() {
        const halfWidth = this.width / (2 * this.zoom);
        const halfHeight = this.height / (2 * this.zoom);
        return {
            left: this.x - halfWidth,
            right: this.x + halfWidth,
            top: this.y - halfHeight,
            bottom: this.y + halfHeight
        };
    }

    /**
     * Adjust zoom level
     * @param {number} delta - Positive for zoom out, negative for zoom in
     */
    adjustZoom(delta) {
        const zoomSpeed = 0.1;
        this.zoom -= delta * zoomSpeed;
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    }
}
