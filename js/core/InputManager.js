/**
 * Star Sea - Input Manager
 * Handles keyboard and mouse input
 */

class InputManager {
    constructor() {
        this.keys = new Map();
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseButtons = new Map();
        this.spacebarPressTime = 0;
        this.spacebarReleased = true;

        this.init();
    }

    init() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Mouse events
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mouseup', (e) => this.onMouseUp(e));
        window.addEventListener('contextmenu', (e) => e.preventDefault());

        // Mouse wheel for zoom
        window.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false });
    }

    onKeyDown(e) {
        this.keys.set(e.key.toLowerCase(), true);

        // Handle spacebar press timing for mine deployment
        if (e.key === ' ' && this.spacebarReleased) {
            this.spacebarPressTime = performance.now();
            this.spacebarReleased = false;
        }

        eventBus.emit('keydown', { key: e.key.toLowerCase(), event: e });
    }

    onKeyUp(e) {
        this.keys.set(e.key.toLowerCase(), false);

        // Handle spacebar release for decoy vs mine
        if (e.key === ' ') {
            const pressDuration = performance.now() - this.spacebarPressTime;
            this.spacebarReleased = true;

            if (pressDuration < 500) {
                eventBus.emit('deploy-decoy');
            } else {
                eventBus.emit('deploy-mine');
            }
        }

        eventBus.emit('keyup', { key: e.key.toLowerCase(), event: e });
    }

    onMouseMove(e) {
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();

        // Calculate mouse position relative to CSS-scaled canvas
        const cssX = e.clientX - rect.left;
        const cssY = e.clientY - rect.top;

        // CRITICAL FIX: Scale mouse coordinates from CSS size to actual canvas dimensions
        // Canvas has actual size (canvas.width x canvas.height) but is rendered at CSS size (rect.width x rect.height)
        // Camera uses actual canvas size for transforms, so we must scale mouse coords to match
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        this.mouseX = cssX * scaleX;
        this.mouseY = cssY * scaleY;

        // Update reticle position - use CSS coordinates for DOM positioning
        const reticle = document.getElementById('reticle');
        if (reticle) {
            reticle.style.left = (rect.left + cssX) + 'px';
            reticle.style.top = (rect.top + cssY) + 'px';
        }

        eventBus.emit('mousemove', { x: this.mouseX, y: this.mouseY, event: e });
    }

    onMouseDown(e) {
        this.mouseButtons.set(e.button, true);

        if (e.button === 0) { // Left click - start beam hold-to-fire
            eventBus.emit('beam-fire-start', { x: this.mouseX, y: this.mouseY });
        } else if (e.button === 2) { // Right click - start torpedo charge/fire
            eventBus.emit('torpedo-fire-start', { x: this.mouseX, y: this.mouseY });
        }

        eventBus.emit('mousedown', { button: e.button, x: this.mouseX, y: this.mouseY, event: e });
    }

    onMouseUp(e) {
        this.mouseButtons.set(e.button, false);

        if (e.button === 0) { // Left mouse release - stop beam firing
            eventBus.emit('beam-fire-stop', { x: this.mouseX, y: this.mouseY });
        } else if (e.button === 2) { // Right mouse release - release torpedo/plasma
            eventBus.emit('torpedo-fire-release', { x: this.mouseX, y: this.mouseY });
        }

        eventBus.emit('mouseup', { button: e.button, x: this.mouseX, y: this.mouseY, event: e });
    }

    onMouseWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1; // 1 = zoom out, -1 = zoom in
        eventBus.emit('mouse-wheel', { delta, event: e });
    }

    isKeyDown(key) {
        return this.keys.get(key.toLowerCase()) || false;
    }

    isMouseButtonDown(button) {
        return this.mouseButtons.get(button) || false;
    }

    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }
}
