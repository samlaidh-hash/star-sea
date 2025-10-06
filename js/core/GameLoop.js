/**
 * Star Sea - Game Loop
 * Manages the main game loop with fixed timestep
 */

class GameLoop {
    constructor(updateCallback, renderCallback) {
        this.updateCallback = updateCallback;
        this.renderCallback = renderCallback;
        this.running = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.fixedDeltaTime = 1 / CONFIG.TARGET_FPS;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsUpdateTime = 0;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop() {
        this.running = false;
    }

    loop(currentTime) {
        if (!this.running) return;

        // Calculate delta time in seconds
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Add to accumulator
        this.accumulator += deltaTime;

        // Fixed timestep updates
        while (this.accumulator >= this.fixedDeltaTime) {
            this.updateCallback(this.fixedDeltaTime);
            this.accumulator -= this.fixedDeltaTime;
        }

        // Render
        this.renderCallback(deltaTime);

        // FPS counter
        this.frameCount++;
        if (currentTime - this.fpsUpdateTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;

            if (CONFIG.DEBUG_MODE) {
                console.log(`FPS: ${this.fps}`);
            }
        }

        // Continue loop
        requestAnimationFrame((time) => this.loop(time));
    }

    getFPS() {
        return this.fps;
    }
}
