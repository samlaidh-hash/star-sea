/**
 * Star Sea - HUD Manager
 * Updates HUD elements based on game state
 */

class HUD {
    constructor() {
        this.uiRenderer = new UIRenderer();
        this.lastUpdate = 0;
        this.updateInterval = 100; // Update every 100ms
    }

    update(playerShip, entities = []) {
        const now = performance.now();
        if (now - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = now;

        if (!playerShip) return;

        this.updateShipHeader(playerShip);

        // Update shields
        this.updateShields(playerShip);

        // Update systems (now includes weapons)
        this.updateSystems(playerShip);

        // Update countermeasures
        this.updateCountermeasures(playerShip);

        // Update warp charge
        this.updateWarpCharge(playerShip);

        // Update boost status
        this.updateBoostStatus(playerShip);

        // Update speed bar
        this.updateSpeedBar(playerShip);

        // Update minimap
        let detectionRadius = CONFIG.DETECTION_RADIUS_CA_PIXELS;
        const detectionKey = `DETECTION_RADIUS_${playerShip.shipClass}_PIXELS`;
        if (typeof CONFIG !== 'undefined' && CONFIG[detectionKey] !== undefined) {
            detectionRadius = CONFIG[detectionKey];
        }
        this.uiRenderer.renderMinimap(playerShip, entities, detectionRadius);
    }

    updateShipHeader(ship) {
        if (!this.shipHeaderElement || !ship) return;
        const classLabel = HUD.CLASS_LABELS[ship.shipClass] || ship.shipClass;
        const factionLabel = HUD.FACTION_LABELS[ship.faction] || ship.faction;
        const shipName = ship.name || `${factionLabel} ${classLabel}`;
        this.shipHeaderElement.textContent = `${shipName} - ${factionLabel} ${classLabel}`;
    }
    updateShields(ship) {
        if (!ship || !ship.shields) {
            this.updateBar('shield-fore', 0);
            this.updateBar('shield-port', 0);
            this.updateBar('shield-starboard', 0);
            this.updateBar('shield-aft', 0);
            return;
        }

        const quadrants = ship.shields.getAllQuadrants();
        this.updateBar('shield-fore', quadrants.fore.getPercentage());
        this.updateBar('shield-port', quadrants.port.getPercentage());
        this.updateBar('shield-starboard', quadrants.starboard.getPercentage());
        this.updateBar('shield-aft', quadrants.aft.getPercentage());
    }

    // REMOVED: updateWeapons() - now integrated into updateSystems()

    updateSystems(ship) {
        // Update hull HP
        const hpElement = document.getElementById('ship-hp');
        if (hpElement && ship) {
            hpElement.textContent = `${Math.round(ship.hp)}/${ship.maxHp}`;

            const hullItem = hpElement.closest('.system-item');
            if (hullItem) {
                if (ship.hp === 0) {
                    hullItem.classList.add('damaged');
                    hullItem.classList.remove('warning');
                } else if (ship.hp <= ship.maxHp * 0.3) {
                    hullItem.classList.add('warning');
                    hullItem.classList.remove('damaged');
                } else {
                    hullItem.classList.remove('damaged', 'warning');
                }
            }
        }

        // Update internal systems
        if (!ship || !ship.systems) {
            this.updateSystemHP('impulse', 0, 16);
            this.updateSystemHP('warp', 0, 20);
            this.updateSystemHP('sensors', 0, 6);
            this.updateSystemHP('cnc', 0, 6);
            this.updateSystemHP('bay', 0, 6);
            this.updateSystemHP('power', 0, 12);
            this.updateSystemHP('beam-forward', 0, 1);
            this.updateSystemHP('beam-aft', 0, 1);
            this.updateSystemHP('torpedo', 0, 1);
            return;
        }

        this.updateSystemHP('impulse', ship.systems.impulse.hp, ship.systems.impulse.maxHp);
        this.updateSystemHP('warp', ship.systems.warp.hp, ship.systems.warp.maxHp);
        this.updateSystemHP('sensors', ship.systems.sensors.hp, ship.systems.sensors.maxHp);
        this.updateSystemHP('cnc', ship.systems.cnc.hp, ship.systems.cnc.maxHp);
        this.updateSystemHP('bay', ship.systems.bay.hp, ship.systems.bay.maxHp);
        this.updateSystemHP('power', ship.systems.power.hp, ship.systems.power.maxHp);

        // Update weapon systems (now integrated with other systems)
        if (ship.weapons) {
            const beamWeapons = ship.getBeamWeapons();
            const torpedoLaunchers = ship.getTorpedoLaunchers();

            // Forward beam
            const forwardBeam = beamWeapons.find(w => w.arcCenter === 0);
            this.updateSystemHP('beam-forward', forwardBeam ? forwardBeam.hp : 0, forwardBeam ? forwardBeam.maxHp : 1);

            // Aft beam
            const aftBeam = beamWeapons.find(w => w.arcCenter === 180);
            this.updateSystemHP('beam-aft', aftBeam ? aftBeam.hp : 0, aftBeam ? aftBeam.maxHp : 1);

            // Torpedo launcher
            const torpedoLauncher = torpedoLaunchers[0];
            this.updateSystemHP('torpedo', torpedoLauncher ? torpedoLauncher.hp : 0, torpedoLauncher ? torpedoLauncher.maxHp : 1);

            // Update torpedo storage count in inventory section
            const storageElement = document.getElementById('torpedo-storage');
            if (storageElement && torpedoLauncher) {
                storageElement.textContent = torpedoLauncher.getStoredCount();
            }
        } else {
            this.updateSystemHP('beam-forward', 0, 1);
            this.updateSystemHP('beam-aft', 0, 1);
            this.updateSystemHP('torpedo', 0, 1);
        }
    }

    updateCountermeasures(ship) {
        if (!ship) return;

        const decoyElement = document.getElementById('decoy-count');
        const mineElement = document.getElementById('mine-count');
        const captorMineElement = document.getElementById('captor-mine-count');
        const phaserMineElement = document.getElementById('phaser-mine-count');
        const transporterMineElement = document.getElementById('transporter-mine-count');
        const interceptorElement = document.getElementById('interceptor-count');
        const torpedoTypeElement = document.getElementById('torpedo-type');

        if (decoyElement) decoyElement.textContent = ship.decoys || 0;
        if (mineElement) mineElement.textContent = ship.mines || 0;
        if (captorMineElement) captorMineElement.textContent = ship.captorMines || 0;
        if (phaserMineElement) phaserMineElement.textContent = ship.phaserMines || 0;
        if (transporterMineElement) transporterMineElement.textContent = ship.transporterMines || 0;
        if (interceptorElement) interceptorElement.textContent = ship.interceptors || 0;

        // Update torpedo type indicator
        if (torpedoTypeElement) {
            const torpType = ship.selectedTorpedoType || 'standard';
            const torpTypeLabels = {
                'standard': 'STD',
                'heavy': 'HVY',
                'quantum': 'QTM',
                'gravity': 'GRV'
            };
            torpedoTypeElement.textContent = torpTypeLabels[torpType] || 'STD';
        }

        // Update shuttle/fighter/bomber counts from BaySystem
        if (window.game && window.game.baySystem) {
            const baySystem = window.game.baySystem;

            const shuttleCountElement = document.getElementById('shuttle-count');
            const shuttleMaxElement = document.getElementById('shuttle-max');
            const fighterCountElement = document.getElementById('fighter-count');
            const fighterMaxElement = document.getElementById('fighter-max');
            const bomberCountElement = document.getElementById('bomber-count');
            const bomberMaxElement = document.getElementById('bomber-max');
            const baySpaceElement = document.getElementById('bay-space');
            const bayMaxElement = document.getElementById('bay-max');

            if (shuttleCountElement) shuttleCountElement.textContent = baySystem.launchedShuttles.filter(s => s.active).length;
            if (fighterCountElement) fighterCountElement.textContent = baySystem.launchedFighters.filter(f => f.active).length;
            if (bomberCountElement) bomberCountElement.textContent = baySystem.launchedBombers.filter(b => b.active).length;
            if (baySpaceElement) baySpaceElement.textContent = baySystem.baySpace;
            if (bayMaxElement) bayMaxElement.textContent = baySystem.maxBaySpace;

            // Get max counts from default loadouts
            const faction = ship.faction || 'FEDERATION';
            const shipClass = ship.shipClass || 'CA';
            const loadout = baySystem.defaultLoadouts[faction]?.[shipClass] || { shuttles: 0, fighters: 0, bombers: 0 };

            if (shuttleMaxElement) shuttleMaxElement.textContent = loadout.shuttles || 0;
            if (fighterMaxElement) fighterMaxElement.textContent = loadout.fighters || 0;
            if (bomberMaxElement) bomberMaxElement.textContent = loadout.bombers || 0;
        }
    }

    updateWarpCharge(ship) {
        const fillElement = document.getElementById('warp-charge-fill');
        if (!fillElement || !ship || !ship.systems || !ship.systems.warp) return;

        const warpCharge = ship.systems.warp.warpCharge || 0;
        fillElement.style.width = `${warpCharge}%`;
    }

    updateBoostStatus(ship) {
        if (!ship) return;

        const boostGroup = document.getElementById('boost-status-group');
        const boostLabel = document.getElementById('boost-label');
        const boostFill = document.getElementById('boost-fill');

        if (!boostGroup || !boostLabel || !boostFill) return;

        if (ship.boostActive) {
            // Boost is active - show timer
            boostGroup.style.display = 'block';
            const currentTime = performance.now() / 1000;
            const elapsed = currentTime - ship.boostStartTime;
            const remaining = ship.boostDuration - elapsed;
            const percentage = (remaining / ship.boostDuration) * 100;

            boostLabel.textContent = 'BOOST';
            boostLabel.style.color = '#0ff'; // Cyan when active
            boostFill.style.width = `${Math.max(0, percentage)}%`;
            boostFill.style.background = 'linear-gradient(90deg, #0ff, #0af)';
        } else {
            // Boost is on cooldown or ready
            const cooldownRemaining = ship.getBoostCooldownRemaining();

            if (cooldownRemaining > 0) {
                // Show cooldown
                boostGroup.style.display = 'block';
                const cooldownPercentage = ((ship.boostCooldown - cooldownRemaining) / ship.boostCooldown) * 100;

                boostLabel.textContent = `COOLDOWN ${Math.ceil(cooldownRemaining)}s`;
                boostLabel.style.color = '#888'; // Gray when on cooldown
                boostFill.style.width = `${cooldownPercentage}%`;
                boostFill.style.background = 'linear-gradient(90deg, #444, #666)';
            } else {
                // Boost ready - hide indicator
                boostGroup.style.display = 'none';
            }
        }
    }

    weaponCoversArc(weapon, arcCenter) {
        if (!weapon) return false;
        const centers = weapon.arcCenters && weapon.arcCenters.length > 0
            ? weapon.arcCenters
            : [weapon.arcCenter !== undefined ? weapon.arcCenter : 0];
        return centers.some(center => MathUtils.normalizeAngle(center) === arcCenter);
    }

    findLauncherForArc(launchers, arcCenter, exclude = null) {
        if (!launchers || launchers.length === 0) return null;
        for (const launcher of launchers) {
            if (exclude && launcher === exclude) continue;
            if (this.weaponCoversArc(launcher, arcCenter)) {
                return launcher;
            }
        }
        return null;
    }
    updateBar(elementId, percentage) {
        const element = document.querySelector(`#${elementId} .bar-fill`);
        if (element) {
            // Round to avoid floating point issues
            const roundedPercent = Math.round(percentage * 100);
            element.style.width = `${roundedPercent}%`;

            // Set color class based on charge state
            if (roundedPercent >= 100) {
                element.classList.add('charged');
                element.classList.remove('recharging');
            } else {
                element.classList.remove('charged');
                element.classList.add('recharging');
            }
        }
    }

    // REMOVED: updateTorpedoCount() - legacy method no longer used
    // REMOVED: updateWeaponHP() - legacy method no longer used
    // Weapons now use updateSystemHP() like all other systems
    updateSystemHP(systemName, current, max) {
        const systemItem = document.querySelector(`[data-system="${systemName}"]`);
        if (!systemItem) return;

        const hpFill = systemItem.querySelector('.hp-fill');
        if (hpFill) {
            const percentage = (current / max) * 100;
            hpFill.style.width = `${percentage}%`;
        }

        // Update visual state
        if (current === 0) {
            systemItem.classList.add('damaged');
            systemItem.classList.remove('warning');
        } else if (current <= max * 0.3) {
            systemItem.classList.add('warning');
            systemItem.classList.remove('damaged');
        } else {
            systemItem.classList.remove('damaged', 'warning');
        }
    }

    
    addCriticalMessage(message, duration = 5000) {
        const logElement = document.getElementById('log-messages');
        if (!logElement) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'log-message';
        messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

        logElement.insertBefore(messageElement, logElement.firstChild);

        // Remove after duration
        setTimeout(() => {
            messageElement.classList.add('fading');
            setTimeout(() => messageElement.remove(), 500);
        }, duration);

        // Keep only last 5 messages
        while (logElement.children.length > 5) {
            logElement.lastChild.remove();
        }
    }

    /**
     * Show mission objectives panel
     */
    showObjectives() {
        const panel = document.getElementById('objectives-panel');
        if (panel) {
            panel.classList.add('active');
        }
    }

    /**
     * Hide mission objectives panel
     */
    hideObjectives() {
        const panel = document.getElementById('objectives-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    /**
     * Update mission objectives display
     * @param {Array} objectives - Array of objective objects from MissionManager
     */
    updateObjectives(objectives) {
        const display = document.getElementById('objectives-display');
        if (!display) return;

        // Clear existing objectives
        display.innerHTML = '';

        if (!objectives || objectives.length === 0) {
            this.hideObjectives();
            return;
        }

        this.showObjectives();

        // Create objective elements
        for (const objective of objectives) {
            const objectiveElement = document.createElement('div');
            objectiveElement.className = 'objective-item';
            objectiveElement.dataset.objectiveId = objective.id;

            // Add classes based on objective state
            if (objective.primary) {
                objectiveElement.classList.add('primary');
            }
            if (objective.completed) {
                objectiveElement.classList.add('completed');
            }
            if (objective.failed) {
                objectiveElement.classList.add('failed');
            }

            // Description
            const description = document.createElement('div');
            description.className = 'objective-description';
            description.textContent = objective.description;
            objectiveElement.appendChild(description);

            // Progress indicator (if applicable)
            if (!objective.completed && !objective.failed) {
                const progress = this.getObjectiveProgress(objective);
                if (progress !== null) {
                    const progressText = document.createElement('div');
                    progressText.className = 'objective-progress';
                    progressText.textContent = progress.text;
                    objectiveElement.appendChild(progressText);

                    // Progress bar (if percentage available)
                    if (progress.percentage !== null) {
                        const progressBar = document.createElement('div');
                        progressBar.className = 'objective-progress-bar';
                        const progressFill = document.createElement('div');
                        progressFill.className = 'objective-progress-fill';
                        progressFill.style.width = `${progress.percentage * 100}%`;
                        progressBar.appendChild(progressFill);
                        objectiveElement.appendChild(progressBar);
                    }
                }
            }

            display.appendChild(objectiveElement);
        }
    }

    /**
     * Get progress information for an objective
     * @param {Object} objective - Objective object
     * @returns {Object|null} - Progress info with text and percentage
     */
    getObjectiveProgress(objective) {
        switch (objective.type) {
            case 'destroy':
                return {
                    text: `${objective.progress || 0} / ${objective.target}`,
                    percentage: (objective.progress || 0) / objective.target
                };

            case 'survive':
                const minutes = Math.floor(objective.progress / 60);
                const seconds = Math.floor(objective.progress % 60);
                const targetMinutes = Math.floor(objective.target / 60);
                const targetSeconds = Math.floor(objective.target % 60);
                return {
                    text: `${minutes}:${seconds.toString().padStart(2, '0')} / ${targetMinutes}:${targetSeconds.toString().padStart(2, '0')}`,
                    percentage: objective.progress / objective.target
                };

            case 'protect':
                return {
                    text: objective.progress > 0 ? 'Protected' : 'Failed',
                    percentage: null
                };

            case 'reach':
                const percent = Math.min(1, objective.progress || 0);
                return {
                    text: `${Math.round(percent * 100)}%`,
                    percentage: percent
                };

            case 'scan':
                const scanPercent = Math.min(1, objective.progress || 0);
                return {
                    text: `Scanning... ${Math.round(scanPercent * 100)}%`,
                    percentage: scanPercent
                };

            default:
                return null;
        }
    }

    updateSpeedBar(ship) {
        if (!ship) return;

        const forwardBar = document.getElementById('speed-bar-forward');
        const reverseBar = document.getElementById('speed-bar-reverse');

        if (!forwardBar || !reverseBar) return;

        // Calculate percentage of max speed
        if (ship.currentSpeed >= 0) {
            // Moving forward
            const forwardPercent = (ship.currentSpeed / ship.maxSpeed) * 100;
            forwardBar.style.width = `${forwardPercent}%`;
            reverseBar.style.width = '0%';
        } else {
            // Moving backward
            const reversePercent = (Math.abs(ship.currentSpeed) / ship.maxReverseSpeed) * 100;
            reverseBar.style.width = `${reversePercent}%`;
            forwardBar.style.width = '0%';
        }
    }

    updateTooltip(mouseX, mouseY, hoveredShip) {
        const tooltip = document.getElementById('ship-tooltip');
        if (!tooltip) return;

        if (!hoveredShip || hoveredShip.isPlayer) {
            tooltip.style.display = 'none';
            return;
        }

        // Show tooltip near mouse
        tooltip.style.display = 'block';
        tooltip.style.left = (mouseX + 15) + 'px';
        tooltip.style.top = (mouseY + 15) + 'px';

        // Update header
        const header = tooltip.querySelector('.tooltip-header');
        const classLabel = HUD.CLASS_LABELS[hoveredShip.shipClass] || hoveredShip.shipClass;
        const factionLabel = HUD.FACTION_LABELS[hoveredShip.faction] || hoveredShip.faction;
        header.textContent = `${factionLabel} ${classLabel}`;

        // Update shields
        if (hoveredShip.shields) {
            const quadrants = hoveredShip.shields.getAllQuadrants();
            tooltip.querySelector('[data-shield="fore"]').textContent = `${Math.round(quadrants.fore.current)}/${quadrants.fore.max}`;
            tooltip.querySelector('[data-shield="port"]').textContent = `${Math.round(quadrants.port.current)}/${quadrants.port.max}`;
            tooltip.querySelector('[data-shield="starboard"]').textContent = `${Math.round(quadrants.starboard.current)}/${quadrants.starboard.max}`;
            tooltip.querySelector('[data-shield="aft"]').textContent = `${Math.round(quadrants.aft.current)}/${quadrants.aft.max}`;
        }

        // Update systems
        const systemsDiv = tooltip.querySelector('.tooltip-systems');
        if (hoveredShip.systems) {
            const systemsHTML = [];
            systemsHTML.push(`HP: ${Math.round(hoveredShip.hp)}/${hoveredShip.maxHp}`);
            systemsHTML.push(`Impulse: ${Math.round((hoveredShip.systems.impulse.hp / hoveredShip.systems.impulse.maxHp) * 100)}%`);
            systemsHTML.push(`Weapons: ${Math.round((hoveredShip.systems.power.hp / hoveredShip.systems.power.maxHp) * 100)}%`);
            systemsDiv.innerHTML = systemsHTML.join('<br>');
        }
    }
}
HUD.CLASS_LABELS = {
    FG: 'Frigate',
    DD: 'Destroyer',
    CL: 'Light Cruiser',
    CA: 'Heavy Cruiser',
    BC: 'Battlecruiser'
};

HUD.FACTION_LABELS = {
    PLAYER: 'Federation',
    FEDERATION: 'Federation',
    TRIGON: 'Trigon Empire',
    SCINTILIAN: 'Scintilian Coalition',
    PIRATE: 'Pirate Clans'
};



