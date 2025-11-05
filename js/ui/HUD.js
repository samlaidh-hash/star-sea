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

        // Update weapons
        this.updateWeapons(playerShip);

        // Update systems
        this.updateSystems(playerShip);

        // Update countermeasures
        this.updateCountermeasures(playerShip);

        // Update warp charge
        this.updateWarpCharge(playerShip);

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

    updateWeapons(ship) {
        if (!ship || !ship.weapons) return;

        const beamWeapons = ship.getBeamWeapons();
        const torpedoLaunchers = ship.getTorpedoLaunchers();
        const currentTime = performance.now() / 1000;

        if (beamWeapons.length >= 1) {
            const weapon = beamWeapons[0];
            const cooldown = weapon.getCooldownPercentage ? weapon.getCooldownPercentage(currentTime) : 1.0;
            this.updateBar('beam-forward', cooldown);
            this.updateWeaponHP('beam-forward', weapon.hp, weapon.maxHp);
        } else {
            this.updateBar('beam-forward', 0);
            this.updateWeaponHP('beam-forward', null, null);
        }

        if (beamWeapons.length >= 2) {
            const weapon = beamWeapons[1];
            const cooldown = weapon.getCooldownPercentage ? weapon.getCooldownPercentage(currentTime) : 1.0;
            this.updateBar('beam-aft', cooldown);
            this.updateWeaponHP('beam-aft', weapon.hp, weapon.maxHp);
        } else {
            this.updateBar('beam-aft', 0);
            this.updateWeaponHP('beam-aft', null, null);
        }

        const forwardLauncher = this.findLauncherForArc(torpedoLaunchers, 0);
        let aftLauncher = this.findLauncherForArc(torpedoLaunchers, 180, forwardLauncher);

        if (!aftLauncher && forwardLauncher && this.weaponCoversArc(forwardLauncher, 180)) {
            aftLauncher = forwardLauncher;
        }

        this.updateTorpedoCount(
            'torp-forward',
            forwardLauncher ? forwardLauncher.getLoadedCount() : null,
            forwardLauncher ? forwardLauncher.getStoredCount() : null
        );
        this.updateWeaponHP(
            'torp-forward',
            forwardLauncher ? forwardLauncher.hp : null,
            forwardLauncher ? forwardLauncher.maxHp : null
        );

        this.updateTorpedoCount(
            'torp-aft',
            aftLauncher ? aftLauncher.getLoadedCount() : null,
            aftLauncher ? aftLauncher.getStoredCount() : null
        );
        this.updateWeaponHP(
            'torp-aft',
            aftLauncher ? aftLauncher.hp : null,
            aftLauncher ? aftLauncher.maxHp : null
        );
    }

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
            return;
        }

        this.updateSystemHP('impulse', ship.systems.impulse.hp, ship.systems.impulse.maxHp);
        this.updateSystemHP('warp', ship.systems.warp.hp, ship.systems.warp.maxHp);
        this.updateSystemHP('sensors', ship.systems.sensors.hp, ship.systems.sensors.maxHp);
        this.updateSystemHP('cnc', ship.systems.cnc.hp, ship.systems.cnc.maxHp);
        this.updateSystemHP('bay', ship.systems.bay.hp, ship.systems.bay.maxHp);
        this.updateSystemHP('power', ship.systems.power.hp, ship.systems.power.maxHp);
    }

    updateCountermeasures(ship) {
        if (!ship) return;

        const decoyElement = document.getElementById('decoy-count');
        const mineElement = document.getElementById('mine-count');
        const bayElement = document.getElementById('bay-status');

        // Count items in bay
        const decoyCount = ship.bayContents ? ship.bayContents.filter(item => item.type === 'decoy').length : ship.decoys || 0;
        const mineCount = ship.bayContents ? ship.bayContents.filter(item => item.type === 'mine').length : ship.mines || 0;
        const shuttleCount = ship.bayContents ? ship.bayContents.filter(item => item.type === 'shuttle').length : 0;

        if (decoyElement) decoyElement.textContent = decoyCount;
        if (mineElement) mineElement.textContent = mineCount;

        // Update bay status (if element exists)
        if (bayElement && ship.bayContents && ship.bayCapacity) {
            const bayUsed = ship.bayContents.length;
            bayElement.textContent = `${bayUsed}/${ship.bayCapacity}`;

            // Add color coding based on bay fullness
            if (bayUsed === ship.bayCapacity) {
                bayElement.style.color = '#ff4444'; // Red when full
            } else if (bayUsed > ship.bayCapacity * 0.7) {
                bayElement.style.color = '#ffaa44'; // Orange when mostly full
            } else {
                bayElement.style.color = '#44ff44'; // Green when space available
            }
        }
    }

    updateWarpCharge(ship) {
        const fillElement = document.getElementById('warp-charge-fill');
        if (!fillElement || !ship || !ship.systems || !ship.systems.warp) return;

        const warpCharge = ship.systems.warp.warpCharge || 0;
        fillElement.style.width = `${warpCharge}%`;
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

    updateTorpedoCount(elementId, loaded, stored) {
        const element = document.querySelector(`#${elementId} .torp-count`);
        if (element) {
            if (loaded === null || loaded === undefined || stored === null || stored === undefined) {
                element.textContent = "--/--";
            } else {
                element.textContent = `${loaded}/${stored}`;
            }
        }
    }
    updateWeaponHP(weaponName, current, max) {
        const element = document.querySelector(`[data-weapon="${weaponName}"] .hp`);
        if (!element) return;

        // Handle missing values
        if (current === null || current === undefined || max === null || max === undefined) {
            element.textContent = "--";
            const parentElement = element.closest('.weapon-item');
            if (parentElement) parentElement.classList.remove('damaged', 'warning');
            return;
        }

        element.textContent = `${Math.round(current)}/${Math.round(max)}`;

        const parentElement = element.closest('.weapon-item');
        if (parentElement) {
            if (current === 0) {
                parentElement.classList.add('damaged');
                parentElement.classList.remove('warning');
            } else if (current <= max * 0.3) {
                parentElement.classList.add('warning');
                parentElement.classList.remove('damaged');
            } else {
                parentElement.classList.remove('damaged', 'warning');
            }
        }
    }
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



