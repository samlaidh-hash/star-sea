/**
 * Star Sea - Save Manager
 * Handles saving and loading campaign progress
 */

class SaveManager {
    constructor() {
        this.saveKey = 'star-sea-save';
        this.autoSaveInterval = 120000; // Auto-save every 2 minutes
        this.lastAutoSave = 0;
    }

    /**
     * Save current game state
     * @param {Object} gameState - Current game state
     * @returns {boolean} - Success status
     */
    saveGame(gameState) {
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                campaign: this.saveCampaignState(gameState),
                player: this.savePlayerState(gameState.playerShip),
                mission: this.saveMissionState(gameState.missionManager),
                progression: gameState.progressionManager ? gameState.progressionManager.getSaveData() : null,
                settings: this.saveSettings()
            };

            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Load saved game state
     * @returns {Object|null} - Loaded save data or null if none exists
     */
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.saveKey);
            if (!savedData) {
                console.log('No save data found');
                return null;
            }

            const saveData = JSON.parse(savedData);
            console.log('Game loaded successfully');
            return saveData;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    /**
     * Check if save data exists
     * @returns {boolean}
     */
    hasSaveData() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    /**
     * Delete save data
     */
    deleteSave() {
        localStorage.removeItem(this.saveKey);
        console.log('Save data deleted');
    }

    /**
     * Get save info without loading full data
     * @returns {Object|null} - Basic save information
     */
    getSaveInfo() {
        try {
            const savedData = localStorage.getItem(this.saveKey);
            if (!savedData) return null;

            const saveData = JSON.parse(savedData);
            return {
            name: playerShip.name || null,
                timestamp: saveData.timestamp,
                currentMission: saveData.campaign?.currentMissionId,
                missionTitle: MISSIONS[saveData.campaign?.currentMissionId]?.title || 'Unknown',
                missionsCompleted: saveData.campaign?.missionsCompleted?.length || 0,
                playerHP: saveData.player?.hp || 0,
                playerMaxHP: saveData.player?.maxHp || 100
            };
        } catch (error) {
            console.error('Failed to get save info:', error);
            return null;
        }
    }

    /**
     * Auto-save if enough time has passed
     * @param {Object} gameState
     */
    autoSave(gameState) {
        const now = Date.now();
        if (now - this.lastAutoSave >= this.autoSaveInterval) {
            if (this.saveGame(gameState)) {
                this.lastAutoSave = now;
                eventBus.emit('auto-save-complete');
            }
        }
    }

    /**
     * Save campaign progress
     */
    saveCampaignState(gameState) {
        return {
            currentMissionId: gameState.missionManager?.currentMission?.id || null,
            missionsCompleted: gameState.missionManager?.missionsCompleted || [],
            campaignPhase: this.determineCampaignPhase(gameState.missionManager)
        };
    }

    /**
     * Save player ship state
     */
    savePlayerState(playerShip) {
        if (!playerShip) return null;

        return {
            hp: playerShip.hp,
            maxHp: playerShip.maxHp,
            x: playerShip.x,
            y: playerShip.y,
            rotation: playerShip.rotation,
            shipClass: playerShip.shipClass,
            faction: playerShip.faction,

            // Weapons state
            weapons: playerShip.weapons?.map(w => ({
                hp: w.hp,
                maxHp: w.maxHp,
                loadedTorpedoes: w.loaded ?? w.loadedTorpedoes,
                maxLoadedTorpedoes: w.maxLoaded ?? w.maxLoadedTorpedoes,
                storedTorpedoes: w.stored ?? w.storedTorpedoes,
                shotsRemaining: w.shotsRemaining
            })) || [],

            // Systems state
            systems: playerShip.systems ? {
                impulse: { hp: playerShip.systems.impulse.hp, maxHp: playerShip.systems.impulse.maxHp },
                warp: { hp: playerShip.systems.warp.hp, maxHp: playerShip.systems.warp.maxHp },
                sensors: { hp: playerShip.systems.sensors.hp, maxHp: playerShip.systems.sensors.maxHp },
                cnc: { hp: playerShip.systems.cnc.hp, maxHp: playerShip.systems.cnc.maxHp },
                bay: { hp: playerShip.systems.bay.hp, maxHp: playerShip.systems.bay.maxHp },
                power: { hp: playerShip.systems.power.hp, maxHp: playerShip.systems.power.maxHp }
            } : null,

            // Shields state
            shields: playerShip.shields ? {
                fore: playerShip.shields.fore.hp,
                aft: playerShip.shields.aft.hp,
                port: playerShip.shields.port.hp,
                starboard: playerShip.shields.starboard.hp
            } : null,

            // Countermeasures
            decoys: playerShip.decoys || 0,
            mines: playerShip.mines || 0
        };
    }

    /**
     * Save mission state
     */
    saveMissionState(missionManager) {
        if (!missionManager) return null;

        return {
            missionActive: missionManager.missionActive,
            missionTime: missionManager.missionTime,
            enemiesDestroyed: missionManager.enemiesDestroyed,
            objectives: missionManager.objectives?.map(obj => ({
                id: obj.id,
                completed: obj.completed,
                failed: obj.failed,
                progress: obj.progress
            })) || []
        };
    }

    /**
     * Save settings
     */
    saveSettings() {
        return {
            debugMode: CONFIG.DEBUG_MODE || false
        };
    }

    /**
     * Restore game state from save data
     * @param {Object} saveData
     * @param {Object} gameState - Current game state to restore into
     */
    restoreGameState(saveData, gameState) {
        // Restore campaign progress
        if (saveData.campaign) {
            if (gameState.missionManager) {
                gameState.missionManager.missionsCompleted = saveData.campaign.missionsCompleted || [];
            }
        }

        // Restore player ship
        if (saveData.player && gameState.playerShip) {
            this.restorePlayerState(saveData.player, gameState.playerShip);
        }

        // Restore mission state
        if (saveData.mission && gameState.missionManager) {
            this.restoreMissionState(saveData.mission, gameState.missionManager);
        }

        // Restore progression
        if (saveData.progression && gameState.progressionManager) {
            gameState.progressionManager.loadSaveData(saveData.progression);
        }

        console.log('Game state restored');
    }

    /**
     * Restore player ship state
     */
    restorePlayerState(savedPlayer, playerShip) {
        playerShip.name = savedPlayer.name || playerShip.name;
        // HP and position
        playerShip.hp = savedPlayer.hp;
        playerShip.maxHp = savedPlayer.maxHp;
        playerShip.x = savedPlayer.x;
        playerShip.y = savedPlayer.y;
        playerShip.rotation = savedPlayer.rotation;

        // Weapons
        if (savedPlayer.weapons && playerShip.weapons) {
            savedPlayer.weapons.forEach((savedWeapon, index) => {
                const weapon = playerShip.weapons[index];
                if (!weapon) return;
                weapon.hp = savedWeapon.hp;
                weapon.maxHp = savedWeapon.maxHp;
                if (savedWeapon.loadedTorpedoes !== undefined && weapon.loaded !== undefined) {
                    weapon.loaded = savedWeapon.loadedTorpedoes;
                }
                if (savedWeapon.maxLoadedTorpedoes !== undefined && weapon.maxLoaded !== undefined) {
                    weapon.maxLoaded = savedWeapon.maxLoadedTorpedoes;
                }
                if (savedWeapon.storedTorpedoes !== undefined) {
                    if (weapon.stored !== undefined) {
                        weapon.stored = savedWeapon.storedTorpedoes;
                    } else {
                        weapon.storedTorpedoes = savedWeapon.storedTorpedoes;
                    }
                }
                if (savedWeapon.shotsRemaining !== undefined) {
                    weapon.shotsRemaining = savedWeapon.shotsRemaining;
                }
            });
        }
        // Systems
        if (savedPlayer.systems && playerShip.systems) {
            Object.keys(savedPlayer.systems).forEach(systemName => {
                if (playerShip.systems[systemName]) {
                    playerShip.systems[systemName].hp = savedPlayer.systems[systemName].hp;
                    playerShip.systems[systemName].maxHp = savedPlayer.systems[systemName].maxHp;
                }
            });
        }

        // Shields
        if (savedPlayer.shields && playerShip.shields) {
            playerShip.shields.fore.hp = savedPlayer.shields.fore;
            playerShip.shields.aft.hp = savedPlayer.shields.aft;
            playerShip.shields.port.hp = savedPlayer.shields.port;
            playerShip.shields.starboard.hp = savedPlayer.shields.starboard;
        }

        // Countermeasures
        playerShip.decoys = savedPlayer.decoys || 0;
        playerShip.mines = savedPlayer.mines || 0;
    }

    /**
     * Restore mission state
     */
    restoreMissionState(savedMission, missionManager) {
        missionManager.missionTime = savedMission.missionTime || 0;
        missionManager.enemiesDestroyed = savedMission.enemiesDestroyed || 0;

        // Restore objective progress
        if (savedMission.objectives && missionManager.objectives) {
            savedMission.objectives.forEach((savedObj, index) => {
                if (missionManager.objectives[index]) {
                    missionManager.objectives[index].completed = savedObj.completed;
                    missionManager.objectives[index].failed = savedObj.failed;
                    missionManager.objectives[index].progress = savedObj.progress;
                }
            });
        }
    }

    /**
     * Determine campaign phase from mission ID
     */
    determineCampaignPhase(missionManager) {
        if (!missionManager?.currentMission) return 1;

        const missionId = missionManager.currentMission.id;
        const missionNum = parseInt(missionId.replace('mission-', ''));

        if (missionNum <= 5) return 1; // Introduction
        if (missionNum <= 10) return 2; // Three-way war
        if (missionNum <= 20) return 3; // Ancient threat
        return 4; // Post-campaign
    }

    /**
     * Get formatted save date
     * @param {number} timestamp
     * @returns {string}
     */
    getFormattedSaveDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveManager };
}
