// Space Station - static mission entity with weapons
class SpaceStation extends Entity {
    constructor({ id, x, y, hp = 300, radius = 120, faction = 'NEUTRAL', hostile = false, name = 'Space Station', rotation = 0 }) {
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
        this.rotation = rotation; // Station facing direction (radians)

        // Weapons
        this.weapons = this.createWeapons();
    }

    createWeapons() {
        // Neutral or unknown factions have no weapons
        if (!this.faction || this.faction === 'NEUTRAL') {
            return [];
        }

        const weapons = [];

        switch (this.faction) {
            case 'FEDERATION':
            case 'PLAYER':
                // Forward Beam Battery (270° forward)
                weapons.push(new BeamWeapon({
                    name: 'Forward Beam Array',
                    arc: 270,
                    arcCenter: 0,
                    damage: 1,
                    hp: 10,
                    maxHp: 10
                }));

                // Forward Torpedo Launcher (270° forward)
                weapons.push(new TorpedoLauncher({
                    name: 'Forward Torpedo Launcher',
                    arc: 270,
                    arcCenter: 0,
                    hp: 8,
                    maxHp: 8,
                    loaded: 4,
                    maxLoaded: 4,
                    stored: 40
                }));

                // Aft Beam Battery (270° aft)
                weapons.push(new BeamWeapon({
                    name: 'Aft Beam Array',
                    arc: 270,
                    arcCenter: 180,
                    damage: 1,
                    hp: 10,
                    maxHp: 10
                }));

                // Aft Torpedo Launcher (270° aft)
                weapons.push(new TorpedoLauncher({
                    name: 'Aft Torpedo Launcher',
                    arc: 270,
                    arcCenter: 180,
                    hp: 8,
                    maxHp: 8,
                    loaded: 4,
                    maxLoaded: 4,
                    stored: 40
                }));
                break;

            case 'TRIGON':
                // 2 Forward Disruptors (180° centered on 0°)
                weapons.push(new Disruptor({
                    name: 'Forward Disruptor Bank 1',
                    arc: 180,
                    arcCenter: 0,
                    damage: 2,
                    hp: 8,
                    maxHp: 8
                }));

                weapons.push(new Disruptor({
                    name: 'Forward Disruptor Bank 2',
                    arc: 180,
                    arcCenter: 0,
                    damage: 2,
                    hp: 8,
                    maxHp: 8
                }));

                // 2 Aft Disruptors (180° centered on 180°)
                weapons.push(new Disruptor({
                    name: 'Aft Disruptor Bank 1',
                    arc: 180,
                    arcCenter: 180,
                    damage: 2,
                    hp: 8,
                    maxHp: 8
                }));

                weapons.push(new Disruptor({
                    name: 'Aft Disruptor Bank 2',
                    arc: 180,
                    arcCenter: 180,
                    damage: 2,
                    hp: 8,
                    maxHp: 8
                }));
                break;

            case 'SCINTILIAN':
                // 3 Pulse Beam Batteries (360° each)
                weapons.push(new PulseBeam({
                    name: 'Pulse Beam Array 1',
                    arc: 360,
                    arcCenter: 0,
                    damage: 0.5,
                    cooldown: 0.5,
                    hp: 10,
                    maxHp: 10
                }));

                weapons.push(new PulseBeam({
                    name: 'Pulse Beam Array 2',
                    arc: 360,
                    arcCenter: 0,
                    damage: 0.5,
                    cooldown: 0.5,
                    hp: 10,
                    maxHp: 10
                }));

                weapons.push(new PulseBeam({
                    name: 'Pulse Beam Array 3',
                    arc: 360,
                    arcCenter: 0,
                    damage: 0.5,
                    cooldown: 0.5,
                    hp: 10,
                    maxHp: 10
                }));

                // 1 Plasma Torpedo Launcher (360°)
                weapons.push(new PlasmaTorpedo({
                    name: 'Plasma Torpedo Launcher',
                    arc: 360,
                    arcCenter: 0,
                    hp: 8,
                    maxHp: 8
                }));
                break;

            case 'PIRATE':
                // Forward Mount: Mixed weapon (beam)
                weapons.push(new BeamWeapon({
                    name: 'Stolen Forward Beam',
                    arc: 270,
                    arcCenter: 0,
                    damage: 1,
                    hp: 6,
                    maxHp: 6
                }));

                // Aft Mount: Mixed weapon (disruptor for variety)
                weapons.push(new Disruptor({
                    name: 'Jury-Rigged Aft Disruptor',
                    arc: 270,
                    arcCenter: 180,
                    damage: 2,
                    hp: 6,
                    maxHp: 6
                }));
                break;

            default:
                // Unknown faction - no weapons
                break;
        }

        return weapons;
    }

    takeDamage(dmg) {
        this.hp = Math.max(0, this.hp - (dmg || 0));
        if (this.hp <= 0) this.destroy();
    }

    update(deltaTime) {
        // Stations are static but weapons still need updates
        // Update weapon cooldowns, reload times, etc.
        if (this.weapons) {
            for (const weapon of this.weapons) {
                if (weapon.update) {
                    weapon.update(deltaTime);
                }
            }
        }
    }

    /**
     * Fire beam weapons at target
     */
    fireBeams(targetX, targetY) {
        if (!this.weapons || !this.hostile) return [];

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all beam weapons that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof BeamWeapon || weapon instanceof PulseBeam) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime);
                    if (projectile) {
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Fire torpedoes at target
     */
    fireTorpedoes(targetX, targetY, lockOnTarget = null) {
        if (!this.weapons || !this.hostile) return [];

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Calculate angle to target
        const targetAngle = MathUtils.angleBetween(this.x, this.y, targetX, targetY);

        // Fire all torpedo/plasma launchers that have target in arc
        for (const weapon of this.weapons) {
            if (weapon instanceof TorpedoLauncher || weapon instanceof PlasmaTorpedo) {
                if (weapon.isInArc(targetAngle, this.rotation)) {
                    const projectile = weapon.fire(this, targetX, targetY, currentTime, lockOnTarget);
                    if (projectile) {
                        projectiles.push(projectile);
                    }
                }
            }
        }

        return projectiles;
    }

    /**
     * Get disruptor burst shots (for Trigon stations)
     */
    getDisruptorBurstShots(targetX, targetY) {
        if (!this.weapons || !this.hostile) return [];

        const currentTime = performance.now() / 1000;
        const projectiles = [];

        // Check all disruptors for burst shots
        for (const weapon of this.weapons) {
            if (weapon instanceof Disruptor) {
                const projectile = weapon.getNextBurstShot(this, targetX, targetY, currentTime);
                if (projectile) {
                    projectiles.push(projectile);
                }
            }
        }

        return projectiles;
    }

    /**
     * Check if weapon can fire (not destroyed)
     */
    canFireWeapons() {
        // Stations can always fire if they have HP
        return this.hp > 0;
    }

    render(ctx, camera) {
        const screen = camera.worldToScreen(this.x, this.y);
        ctx.save();

        // Station color based on faction
        let fillColor = '#444466';
        let strokeColor = '#8888aa';

        if (this.hostile) {
            switch (this.faction) {
                case 'TRIGON':
                    fillColor = '#662222';
                    strokeColor = '#ff4444';
                    break;
                case 'SCINTILIAN':
                    fillColor = '#226644';
                    strokeColor = '#00ff88';
                    break;
                case 'PIRATE':
                    fillColor = '#664422';
                    strokeColor = '#ff8800';
                    break;
                default:
                    fillColor = '#662222';
                    strokeColor = '#ff4444';
            }
        } else {
            // Friendly stations - blueish
            fillColor = '#224466';
            strokeColor = '#00ccff';
        }

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, this.radius * camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw orientation marker (shows station facing)
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const markerLength = this.radius * camera.zoom * 0.8;
        const markerX = screen.x + Math.cos(this.rotation) * markerLength;
        const markerY = screen.y + Math.sin(this.rotation) * markerLength;
        ctx.moveTo(screen.x, screen.y);
        ctx.lineTo(markerX, markerY);
        ctx.stroke();

        ctx.restore();
    }
}
