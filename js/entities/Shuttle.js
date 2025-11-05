/**
 * Star Sea - Shuttle Entity
 * Small auxiliary craft launched from ship bays
 */

class Shuttle extends Entity {
    constructor({ x, y, parentShip, missionType = 'defense', missionData = null, faction = 'PLAYER' }) {
        super(x, y);

        this.type = 'shuttle';
        this.faction = faction;
        this.parentShip = parentShip;
        this.active = true;

        // Mission parameters
        this.missionType = missionType; // 'attack', 'defense', 'weasel', 'suicide', 'transport'
        this.missionData = missionData || {};
        this.missionState = 'INITIALIZING';

        // Physical properties
        this.rotation = parentShip ? parentShip.rotation : 0;
        this.velocity = { x: 0, y: 0 };
        this.maxSpeed = 55; // 50% of CA speed (110 * 0.5)
        this.acceleration = 90; // Half of CA acceleration
        this.turnRate = 120; // More agile than parent ship
        this.radius = 8; // Small craft

        // Combat properties
        this.maxShields = 3;
        this.shields = 3;
        this.shieldRecharge = 1; // 1pt per second
        this.shieldDelay = 2; // 2 second delay after hit
        this.lastShieldHitTime = 0;

        this.maxHp = 2;
        this.hp = 2;

        // Weapon
        this.weapon = this.createWeapon();

        // AI state
        this.target = null;
        this.waypoint = null;
        this.stateTimer = 0;

        // For transport missions
        this.transportTimer = 0;

        // Initialize mission
        this.initializeMission();
    }

    createWeapon() {
        // Simple beam weapon: 120° forward arc, 20% of ship beam range
        return new BeamWeapon({
            name: 'Shuttle Phaser',
            arc: 120,
            arcCenter: 0,
            damage: 0.5, // Half damage of ship beam
            range: 200, // Reduced range (20% of typical ship range)
            cooldown: 1.0,
            hp: 1,
            maxHp: 1
        });
    }

    initializeMission() {
        switch (this.missionType) {
            case 'attack':
                this.missionState = 'SEEK_TARGET';
                break;
            case 'defense':
                this.missionState = 'LOITER';
                break;
            case 'weasel':
                this.missionState = 'FLEE';
                break;
            case 'suicide':
                this.missionState = 'SEEK_TARGET';
                break;
            case 'transport':
                this.missionState = 'MOVE_TO_TARGET';
                this.waypoint = this.missionData.targetLocation || { x: this.x + 500, y: this.y };
                break;
            default:
                this.missionState = 'LOITER';
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        // Update shields
        this.updateShields(deltaTime);

        // Update weapon
        if (this.weapon && this.weapon.update) {
            this.weapon.update(deltaTime);
        }

        // Update AI based on mission type
        this.updateAI(deltaTime);

        // Apply movement
        this.applyMovement(deltaTime);

        // Update timers
        this.stateTimer += deltaTime;
    }

    updateShields(deltaTime) {
        const currentTime = performance.now() / 1000;

        // Recharge shields if delay has passed
        if (this.shields < this.maxShields) {
            if (currentTime - this.lastShieldHitTime >= this.shieldDelay) {
                this.shields = Math.min(this.maxShields, this.shields + this.shieldRecharge * deltaTime);
            }
        }
    }

    updateAI(deltaTime) {
        // AI logic will be handled by ShuttleAI class
        // For now, basic placeholder
        if (typeof ShuttleAI !== 'undefined' && ShuttleAI[this.missionType]) {
            ShuttleAI[this.missionType](this, deltaTime);
        }
    }

    applyMovement(deltaTime) {
        // Update position based on velocity
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        // Clamp velocity to max speed
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }
    }

    /**
     * Move towards a target position
     */
    moveTowards(targetX, targetY, deltaTime) {
        // Calculate direction to target
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) return true; // Reached target

        // Calculate desired angle
        const targetAngle = Math.atan2(dy, dx);

        // Turn towards target
        this.turnTowards(targetAngle, deltaTime);

        // Accelerate forward
        const thrust = this.acceleration * deltaTime;
        this.velocity.x += Math.cos(this.rotation) * thrust;
        this.velocity.y += Math.sin(this.rotation) * thrust;

        return false;
    }

    /**
     * Turn towards a target angle
     */
    turnTowards(targetAngle, deltaTime) {
        // Normalize angles
        let angleDiff = targetAngle - this.rotation;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Turn rate in radians per second
        const turnSpeed = (this.turnRate * Math.PI / 180) * deltaTime;

        if (Math.abs(angleDiff) < turnSpeed) {
            this.rotation = targetAngle;
        } else {
            this.rotation += Math.sign(angleDiff) * turnSpeed;
        }

        // Normalize rotation
        while (this.rotation > Math.PI) this.rotation -= Math.PI * 2;
        while (this.rotation < -Math.PI) this.rotation += Math.PI * 2;
    }

    /**
     * Fire weapon at target
     */
    fireWeapon(targetX, targetY) {
        if (!this.weapon) return null;

        const currentTime = performance.now() / 1000;

        // Check if weapon can fire
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        if (this.weapon.isInArc(targetAngle, this.rotation)) {
            return this.weapon.fire(this, targetX, targetY, currentTime);
        }

        return null;
    }

    /**
     * Take damage
     */
    takeDamage(damage, source = null) {
        const currentTime = performance.now() / 1000;

        if (damage <= 0) return;

        // Shields absorb damage first
        if (this.shields > 0) {
            const shieldDamage = Math.min(this.shields, damage);
            this.shields -= shieldDamage;
            damage -= shieldDamage;
            this.lastShieldHitTime = currentTime;
        }

        // Remaining damage to hull
        if (damage > 0) {
            this.hp -= damage;

            if (this.hp <= 0) {
                this.hp = 0;
                this.destroy();
            }
        }

        // Flash effect
        this.damageFlashAlpha = 1.0;
    }

    /**
     * Destroy shuttle
     */
    destroy() {
        this.active = false;

        // Emit event for explosion effect
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('shuttle-destroyed', {
                shuttle: this,
                x: this.x,
                y: this.y
            });
        }
    }

    /**
     * Recall shuttle to parent ship
     */
    recall() {
        if (this.missionType === 'transport') {
            // Transport missions can be recalled
            this.missionType = 'defense';
            this.missionState = 'RETURNING';
        } else {
            // All other missions switch to returning
            this.missionState = 'RETURNING';
        }

        this.target = null;
        this.waypoint = null;
    }

    /**
     * Check if shuttle is close to parent ship (for docking)
     */
    isNearParent() {
        if (!this.parentShip) return false;

        const dx = this.x - this.parentShip.x;
        const dy = this.y - this.parentShip.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < 50; // Within 50 units
    }

    /**
     * Return shuttle to bay (docking complete)
     */
    returnToBay() {
        if (!this.parentShip || !this.parentShip.bayContents) return false;

        // Check if bay has space
        if (this.parentShip.bayContents.length >= this.parentShip.bayCapacity) {
            return false; // Bay full
        }

        // Add shuttle back to bay
        this.parentShip.bayContents.push({
            type: 'shuttle',
            missionType: null
        });

        // Remove shuttle from game
        this.active = false;

        return true;
    }

    /**
     * Render shuttle
     */
    render(ctx, camera) {
        if (!this.active) return;

        const screen = camera.worldToScreen(this.x, this.y);

        ctx.save();

        // Draw shuttle (simple triangle)
        ctx.translate(screen.x, screen.y);
        ctx.rotate(this.rotation);
        ctx.scale(camera.zoom, camera.zoom);

        // Shuttle color based on faction
        let color = '#00ccff'; // Player blue
        if (this.faction === 'TRIGON') color = '#ff4444';
        else if (this.faction === 'SCINTILIAN') color = '#00ff88';
        else if (this.faction === 'PIRATE') color = '#ff8800';

        // Shuttle body (triangle pointing forward)
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(this.radius, 0);
        ctx.lineTo(-this.radius * 0.6, this.radius * 0.5);
        ctx.lineTo(-this.radius * 0.6, -this.radius * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shield indicator
        if (this.shields > 0) {
            const shieldAlpha = this.shields / this.maxShields;
            ctx.strokeStyle = `rgba(0, 200, 255, ${shieldAlpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Damage flash
        if (this.damageFlashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 0, 0, ${this.damageFlashAlpha})`;
            ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
            this.damageFlashAlpha -= 0.05;
        }

        ctx.restore();
    }
}
