/**
 * Star Sea - Base Entity Class
 */

class Entity {
    constructor(x, y) {
        this.id = this.generateId();
        this.transform = new Transform(x, y, 0);
        this.active = true;
        this.type = 'entity';
    }

    generateId() {
        return `entity_${Math.random().toString(36).substr(2, 9)}`;
    }

    get x() { return this.transform.x; }
    set x(value) { this.transform.x = value; }

    get y() { return this.transform.y; }
    set y(value) { this.transform.y = value; }

    get rotation() { return this.transform.rotation; }
    set rotation(value) { this.transform.rotation = value; }

    get vx() { return this.transform.vx; }
    set vx(value) { this.transform.vx = value; }

    get vy() { return this.transform.vy; }
    set vy(value) { this.transform.vy = value; }

    update(deltaTime) {
        // Override in subclasses
    }

    destroy() {
        this.active = false;
    }
}
