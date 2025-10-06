/**
 * Star Sea - Ship Renderer
 * Renders ships as vector graphics with internal systems
 */

class ShipRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render(ship) {
        // Check if ship is cloaked
        const alpha = this.getVisibilityAlpha(ship);
        if (alpha <= 0) return; // Completely invisible, skip rendering

        this.ctx.save();

        // Apply cloaking alpha
        this.ctx.globalAlpha = alpha;

        // Translate to ship position
        this.ctx.translate(ship.x, ship.y);

        // Rotate to ship facing
        this.ctx.rotate(MathUtils.toRadians(ship.rotation));

        // Draw ship hull
        this.drawHull(ship);

        // Draw weapon firing points and indicators (if player ship)
        if (ship.isPlayer && ship.weaponPoints) {
            this.drawWeaponPoints(ship);
        }

        // Draw shields (only if not cloaked) - ALL SHIPS
        if (!ship.isCloaked()) {
            this.drawShields(ship);
        }

        // Draw internal systems - ALL SHIPS (scaled down for enemies)
        if (ship.systems) {
            this.drawInternalSystems(ship);
        }

        // Draw damage flash effect if ship was recently hit
        if (ship.damageFlashAlpha && ship.damageFlashAlpha > 0) {
            this.ctx.globalAlpha = ship.damageFlashAlpha;
            this.ctx.strokeStyle = '#f00';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            if (ship.vertices && ship.vertices.length > 0) {
                this.ctx.moveTo(ship.vertices[0].x, ship.vertices[0].y);
                for (let i = 1; i < ship.vertices.length; i++) {
                    this.ctx.lineTo(ship.vertices[i].x, ship.vertices[i].y);
                }
                this.ctx.closePath();
            }
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
        }

        this.ctx.restore();

        // HP bars removed - using internal system damage visualization instead

        // Draw debug info
        if (CONFIG.DEBUG_MODE) {
            this.drawDebugInfo(ship);
        }
    }

    drawHPBar(ship) {
        const size = ship.getShipSize();
        const barWidth = size * 1.2;
        const barHeight = 4;
        const barY = -size - 25; // Above ship and torpedo indicators

        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);

        // Background
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);

        // HP fill
        const hpPercent = ship.hp / ship.maxHp;
        const fillWidth = barWidth * hpPercent;

        // Color based on HP
        let color;
        if (hpPercent > 0.6) {
            color = '#0f0'; // Green
        } else if (hpPercent > 0.3) {
            color = '#ff0'; // Yellow
        } else {
            color = '#f00'; // Red
        }

        this.ctx.fillStyle = color;
        this.ctx.fillRect(-barWidth / 2, barY, fillWidth, barHeight);

        // Border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);

        this.ctx.restore();
    }

    getVisibilityAlpha(ship) {
        if (ship.systems && ship.systems.cloak) {
            return ship.systems.cloak.getVisibilityAlpha();
        }
        return 1.0; // Fully visible
    }

    drawHull(ship) {
        if (!ship.vertices || ship.vertices.length === 0) return;

        this.ctx.strokeStyle = ship.color;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

        // Draw hull polygon
        this.ctx.beginPath();
        this.ctx.moveTo(ship.vertices[0].x, ship.vertices[0].y);

        for (let i = 1; i < ship.vertices.length; i++) {
            this.ctx.lineTo(ship.vertices[i].x, ship.vertices[i].y);
        }

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Forward indicator removed per user request

        // Draw engine glow at rear (if moving)
        const size = ship.getShipSize();
        const speed = Math.abs(ship.vx) + Math.abs(ship.vy);
        if (speed > 10) {
            const glowIntensity = Math.min(speed / 100, 1.0);
            const glowSize = 6 * glowIntensity;

            // Create radial gradient for engine glow
            const gradient = this.ctx.createRadialGradient(0, size, 0, 0, size, glowSize + 10);
            gradient.addColorStop(0, `rgba(100, 150, 255, ${glowIntensity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(100, 150, 255, ${glowIntensity * 0.4})`);
            gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, size, glowSize + 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawWeaponPoints(ship) {
        const wp = ship.weaponPoints;

        this.ctx.save();

        // Draw forward beam battery band (red elliptical arc)
        if (wp.forwardBeamBand) {
            const band = wp.forwardBeamBand;

            // Check if beam weapons are ready to fire (glow effect for player ship)
            const beamReady = ship.isPlayer && this.isBeamWeaponReady(ship);

            if (beamReady) {
                // Beam ready - bright glow
                this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                this.ctx.shadowBlur = 8;
            } else {
                // Beam on cooldown - dim
                this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 0;
            }

            this.ctx.beginPath();
            this.ctx.ellipse(
                band.centerX,
                band.centerY,
                band.radiusX,
                band.radiusY,
                0, // rotation
                MathUtils.toRadians(band.startAngle),
                MathUtils.toRadians(band.endAngle)
            );
            this.ctx.stroke();

            // Reset shadow
            this.ctx.shadowBlur = 0;

            // Draw forward torpedo indicators (4 dots) behind the beam band
            this.drawTorpedoIndicators(ship, 'forward', band);
        }

        // Draw aft beam battery (rounded rectangle or point)
        if (wp.aftBeamPoint) {
            const point = wp.aftBeamPoint;

            // Check if beam weapons are ready to fire
            const beamReady = ship.isPlayer && this.isBeamWeaponReady(ship);

            if (point.type === 'rectangle') {
                // Draw as rounded rectangle perpendicular to ship axis
                const halfWidth = point.width / 2;
                const halfHeight = point.height / 2;
                const cornerRadius = Math.min(halfWidth, halfHeight) * 0.3; // Rounded corners

                if (beamReady) {
                    this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                    this.ctx.fillStyle = 'rgba(255, 50, 50, 0.5)';
                    this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                    this.ctx.shadowBlur = 8;
                    this.ctx.lineWidth = 3;
                } else {
                    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                    this.ctx.shadowBlur = 0;
                    this.ctx.lineWidth = 2;
                }

                // Draw rounded rectangle
                this.ctx.beginPath();
                this.ctx.roundRect(
                    point.x - halfWidth,
                    point.y - halfHeight,
                    point.width,
                    point.height,
                    cornerRadius
                );
                this.ctx.fill();
                this.ctx.stroke();

                // Reset shadow
                this.ctx.shadowBlur = 0;

                // Draw aft torpedo indicators (4 dots) just below the rectangle
                this.drawTorpedoIndicators(ship, 'aft', { centerX: point.x, centerY: point.y, radiusY: halfHeight });
            } else {
                // Draw as point (legacy support)
                if (beamReady) {
                    this.ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
                    this.ctx.fillStyle = 'rgba(255, 50, 50, 0.6)';
                    this.ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
                    this.ctx.shadowBlur = 6;
                } else {
                    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                    this.ctx.shadowBlur = 0;
                }

                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();

                // Reset shadow
                this.ctx.shadowBlur = 0;

                // Draw aft beam arc indicator
                this.ctx.strokeStyle = beamReady ? 'rgba(255, 50, 50, 0.5)' : 'rgba(255, 0, 0, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
                this.ctx.stroke();

                // Draw aft torpedo indicators (4 dots) just above the beam point
                this.drawTorpedoIndicators(ship, 'aft', { centerX: point.x, centerY: point.y, radiusY: 8 });
            }
        }

        // Large yellow torpedo origin dots removed - torpedo count shown by small dots instead

        this.ctx.restore();
    }

    drawInternalSystems(ship) {
        const size = ship.getShipSize();
        const systems = ship.systems;

        // System label mapping
        const systemLabels = {
            sensors: 'S',
            cnc: 'C',
            impulse: 'I',
            warp: 'W',
            power: 'H', // Hull/Main Power
            bay: 'B',
            cloak: 'K'
        };

        // Define system positions inside ship hull (relative to center)
        // Galaxy-class layout: saucer systems forward, engineering aft
        const systemLayouts = {
            // Saucer section systems
            sensors: { x: 0, y: -size * 0.3, w: size * 0.3, h: size * 0.15 },
            cnc: { x: 0, y: -size * 0.1, w: size * 0.35, h: size * 0.15 },

            // Engineering section systems
            warp: { x: 0, y: size * 0.5, w: size * 0.25, h: size * 0.3 },
            impulse: { x: 0, y: size * 0.75, w: size * 0.2, h: size * 0.2 },
            power: { x: 0, y: size * 0.25, w: size * 0.2, h: size * 0.2 },
            bay: { x: 0, y: size * 0.05, w: size * 0.15, h: size * 0.15 }
        };

        // Add cloak if ship has it
        if (systems && systems.cloak) {
            systemLayouts.cloak = { x: 0, y: -size * 0.5, w: size * 0.2, h: size * 0.1 };
        }

        // Draw each system
        for (const [systemName, layout] of Object.entries(systemLayouts)) {
            if (!systems[systemName]) continue;

            const system = systems[systemName];
            const damagePercent = 1 - (system.hp / system.maxHp); // 0 = healthy, 1 = destroyed

            this.ctx.save();

            // Draw system box
            const x = layout.x - layout.w / 2;
            const y = layout.y - layout.h / 2;

            // Background (dark)
            this.ctx.fillStyle = 'rgba(20, 20, 40, 0.6)';
            this.ctx.fillRect(x, y, layout.w, layout.h);

            // Damage fill (red, from LEFT to RIGHT)
            if (damagePercent > 0) {
                const damageWidth = layout.w * damagePercent;

                // Red gradient (left to right, darker to brighter)
                const gradient = this.ctx.createLinearGradient(x, y, x + damageWidth, y);
                gradient.addColorStop(0, `rgba(255, 50, 50, ${0.3 + damagePercent * 0.5})`);
                gradient.addColorStop(1, `rgba(255, 0, 0, ${0.6 + damagePercent * 0.4})`);

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, y, damageWidth, layout.h);
            }

            // Border
            this.ctx.strokeStyle = ship.color;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, layout.w, layout.h);

            // Draw system letter label in center
            const label = systemLabels[systemName] || '?';
            this.ctx.fillStyle = '#0f0';
            this.ctx.font = `${layout.h * 0.6}px monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(label, layout.x, layout.y);

            this.ctx.restore();
        }
    }

    drawShields(ship) {
        if (!ship.shields) return;

        const size = ship.getShipSize();
        const shieldRadius = size * 1.2; // Shield bubble slightly larger than ship
        const visualEffects = ship.shields.visualEffects;

        // Draw shield arcs for each quadrant that was recently hit
        const quadrants = ['fore', 'aft', 'port', 'starboard'];
        for (const quadrant of quadrants) {
            const effect = visualEffects[quadrant];
            if (effect.alpha > 0) {
                this.ctx.save();

                // Determine arc angles for each quadrant
                let startAngle, endAngle;
                switch (quadrant) {
                    case 'fore':
                        startAngle = -135; // -45° rotated by -90° (ship reference)
                        endAngle = -45;
                        break;
                    case 'starboard':
                        startAngle = -45;
                        endAngle = 45;
                        break;
                    case 'aft':
                        startAngle = 45;
                        endAngle = 135;
                        break;
                    case 'port':
                        startAngle = 135;
                        endAngle = 225;
                        break;
                }

                // Convert to radians
                const startRad = MathUtils.toRadians(startAngle);
                const endRad = MathUtils.toRadians(endAngle);

                // Draw shield arc with glow
                const gradient = this.ctx.createRadialGradient(0, 0, shieldRadius - 10, 0, 0, shieldRadius + 5);
                gradient.addColorStop(0, `rgba(0, 150, 255, 0)`);
                gradient.addColorStop(0.8, `rgba(0, 150, 255, ${effect.alpha * 0.4})`);
                gradient.addColorStop(1, `rgba(100, 200, 255, ${effect.alpha * 0.8})`);

                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 8;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, shieldRadius, startRad, endRad);
                this.ctx.stroke();

                this.ctx.restore();
            }
        }
    }

    drawDebugInfo(ship) {
        this.ctx.save();

        // REMOVED: Yellow velocity vector line
        // User requested removal - was distracting visual element
        // (Velocity vector drawing commented out)

        // Draw firing arcs (if enabled)
        if (CONFIG.DEBUG_SHOW_ARCS) {
            this.drawFiringArcs(ship);
        }

        this.ctx.restore();
    }

    drawFiringArcs(ship) {
        this.ctx.save();
        this.ctx.translate(ship.x, ship.y);

        // Example: forward 270° arc
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, ship.getShipSize() * 2,
                    MathUtils.toRadians(ship.rotation - 135),
                    MathUtils.toRadians(ship.rotation + 135));
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Check if beam weapons are ready to fire (off cooldown)
     */
    isBeamWeaponReady(ship) {
        if (!ship.weapons) return false;

        const currentTime = performance.now() / 1000;

        // Check if any beam weapon is ready
        for (const weapon of ship.weapons) {
            if ((weapon instanceof BeamWeapon || weapon instanceof PulseBeam) && weapon.canFire(currentTime)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Draw torpedo count indicators (4 orangey-yellow dots)
     * @param {Ship} ship - The ship
     * @param {string} facing - 'forward' or 'aft'
     * @param {Object} band - The beam band or point object (not used, kept for compatibility)
     */
    drawTorpedoIndicators(ship, facing, band) {
        if (!ship.weapons) return;

        // Find torpedo launcher for this facing
        let torpedoLauncher = null;
        const normalizeFacingAngle = (angle) => MathUtils.normalizeAngle(angle);

        for (const weapon of ship.weapons) {
            if (weapon instanceof TorpedoLauncher || weapon instanceof PlasmaTorpedo) {
                const centers = weapon.arcCenters && weapon.arcCenters.length > 0 ? weapon.arcCenters : [weapon.arcCenter !== undefined ? weapon.arcCenter : 0];
                const hasForward = centers.some(center => normalizeFacingAngle(center) === 0);
                const hasAft = centers.some(center => normalizeFacingAngle(center) === 180);

                if ((facing === 'forward' && hasForward) || (facing === 'aft' && hasAft)) {
                    torpedoLauncher = weapon;
                    break;
                }
            }
        }

        if (!torpedoLauncher) return;

        const loaded = torpedoLauncher.getLoadedCount();
        const maxLoaded = torpedoLauncher.maxLoaded || 4;
        const size = ship.getShipSize();

        // Position dots at top (forward) or bottom (aft) of ship
        const dotRadius = 2; // Slightly larger
        const dotSpacing = 6;
        const totalWidth = (maxLoaded - 1) * dotSpacing;
        const startX = -totalWidth / 2; // Center horizontally

        // Y position: at very top or bottom of ship
        const dotY = facing === 'forward' ? -size - 10 : size + 10;

        // Draw 4 dots
        for (let i = 0; i < maxLoaded; i++) {
            const dotX = startX + i * dotSpacing;

            if (i < loaded) {
                // Loaded torpedo - bright orangey-yellow
                this.ctx.fillStyle = 'rgba(255, 180, 0, 0.9)';
                this.ctx.strokeStyle = 'rgba(255, 140, 0, 1.0)';
            } else {
                // Empty slot - dim gray
                this.ctx.fillStyle = 'rgba(100, 100, 100, 0.4)';
                this.ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
            }

            this.ctx.lineWidth = 0.8;
            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
}



