/**
 * Star Sea - Mission Manager
 * Manages campaign missions, objectives, and victory conditions
 */

class MissionManager {
    constructor() {
        this.currentMission = null;
        this.missionActive = false;
        this.objectives = [];
        this.missionTime = 0;
        this.enemiesDestroyed = 0;
        this.missionResult = null; // 'victory', 'defeat', null
        this.missionsCompleted = []; // Track completed mission IDs
    }

    /**
     * Load and start a mission
     */
    startMission(missionId) {
        const mission = MISSIONS[missionId];
        if (!mission) {
            console.error(`Mission ${missionId} not found`);
            return false;
        }

        this.currentMission = mission;
        this.missionActive = true;
        this.missionTime = 0;
        this.enemiesDestroyed = 0;
        this.missionResult = null;

        // Initialize objectives
        this.objectives = mission.objectives.map(obj => ({
            ...obj,
            completed: false,
            progress: 0,
            target: obj.target || 1
        }));

        eventBus.emit('mission-started', { mission: this.currentMission });
        return true;
    }

    /**
     * Update mission state
     */
    update(deltaTime, gameState) {
        if (!this.missionActive || this.missionResult) return;

        this.missionTime += deltaTime;

        // Update objectives
        this.updateObjectives(gameState);

        // Check victory conditions
        if (this.checkVictoryConditions(gameState)) {
            this.completeMission('victory');
            return;
        }

        // Check defeat conditions
        if (this.checkDefeatConditions(gameState)) {
            this.completeMission('defeat');
            return;
        }
    }

    /**
     * Update objective progress
     */
    updateObjectives(gameState) {
        for (const objective of this.objectives) {
            if (objective.completed) continue;

            switch (objective.type) {
                case 'destroy':
                    // Tracked via event system (see handleEnemyDestroyed)
                    objective.progress = gameState.enemiesDestroyed || 0;
                    if (objective.progress >= objective.target) {
                        this.completeObjective(objective);
                    }
                    break;

                case 'survive':
                    objective.progress = this.missionTime;
                    if (objective.progress >= objective.target) {
                        this.completeObjective(objective);
                    }
                    break;

                case 'protect':
                    // Check if protected entity still alive
                    const protectedShip = gameState.entities.find(e =>
                        e.id === objective.targetId && e.active
                    );
                    if (protectedShip) {
                        objective.progress = 1; // Still alive
                    } else {
                        // Protected ship destroyed - mission may fail
                        objective.failed = true;
                    }
                    break;

                case 'reach':
                    // Check if player reached destination
                    if (gameState.playerShip) {
                        const distance = MathUtils.distance(
                            gameState.playerShip.x,
                            gameState.playerShip.y,
                            objective.x,
                            objective.y
                        );
                        objective.progress = Math.max(0, 1 - (distance / objective.radius));
                        if (distance <= objective.radius) {
                            this.completeObjective(objective);
                        }
                    }
                    break;

                case 'scan':
                    // Check if player scanned object (near it for X seconds)
                    if (gameState.playerShip) {
                        const scanTarget = gameState.entities.find(e => e.id === objective.targetId);
                        if (scanTarget) {
                            const distance = MathUtils.distance(
                                gameState.playerShip.x,
                                gameState.playerShip.y,
                                scanTarget.x,
                                scanTarget.y
                            );
                            if (distance <= objective.scanRange) {
                                objective.scanTime = (objective.scanTime || 0) + 1/60; // Assume 60fps
                                objective.progress = objective.scanTime / objective.target;
                                if (objective.scanTime >= objective.target) {
                                    this.completeObjective(objective);
                                }
                            } else {
                                objective.scanTime = 0;
                                objective.progress = 0;
                            }
                        }
                    }
                    break;
            }
        }
    }

    /**
     * Complete an objective
     */
    completeObjective(objective) {
        objective.completed = true;
        objective.progress = objective.target;
        eventBus.emit('objective-completed', { objective });
    }

    /**
     * Check if all victory conditions met
     */
    checkVictoryConditions(gameState) {
        if (!this.currentMission) return false;

        // Primary condition: All primary objectives complete
        const primaryObjectives = this.objectives.filter(obj => obj.primary);
        const allPrimaryComplete = primaryObjectives.every(obj => obj.completed);

        // Secondary conditions from mission config
        const victoryConditions = this.currentMission.victoryConditions || [];
        const allConditionsMet = victoryConditions.every(condition => {
            switch (condition.type) {
                case 'objectives':
                    return allPrimaryComplete;
                case 'time':
                    return this.missionTime >= condition.value;
                case 'enemies':
                    return gameState.enemiesDestroyed >= condition.value;
                default:
                    return true;
            }
        });

        return allPrimaryComplete && allConditionsMet;
    }

    /**
     * Check if any defeat conditions met
     */
    checkDefeatConditions(gameState) {
        if (!this.currentMission) return false;

        // Primary condition: Player destroyed
        if (!gameState.playerShip || !gameState.playerShip.active) {
            return true;
        }

        // Check for failed protect objectives
        const failedProtect = this.objectives.some(obj =>
            obj.type === 'protect' && obj.primary && obj.failed
        );
        if (failedProtect) return true;

        // Secondary conditions from mission config
        const defeatConditions = this.currentMission.defeatConditions || [];
        return defeatConditions.some(condition => {
            switch (condition.type) {
                case 'time':
                    return this.missionTime >= condition.value;
                case 'damage':
                    return gameState.playerShip.hp <= condition.value;
                default:
                    return false;
            }
        });
    }

    /**
     * Complete mission with result
     */
    completeMission(result) {
        this.missionResult = result;
        this.missionActive = false;

        // Track completed missions
        if (result === 'victory' && this.currentMission) {
            if (!this.missionsCompleted.includes(this.currentMission.id)) {
                this.missionsCompleted.push(this.currentMission.id);
            }
        }

        eventBus.emit('mission-completed', {
            mission: this.currentMission,
            result: result,
            objectives: this.objectives,
            time: this.missionTime,
            enemiesDestroyed: this.enemiesDestroyed
        });
    }

    /**
     * Handle enemy destroyed event
     */
    handleEnemyDestroyed(enemy) {
        if (!this.missionActive) return;

        this.enemiesDestroyed++;

        // Check if this enemy was part of a destroy objective
        for (const objective of this.objectives) {
            if (objective.type === 'destroy' && !objective.completed) {
                if (!objective.faction || enemy.faction === objective.faction) {
                    objective.progress++;
                }
            }
        }
    }

    /**
     * Get current objectives for HUD display
     */
    getActiveObjectives() {
        return this.objectives.filter(obj => !obj.completed);
    }

    /**
     * Get mission progress summary
     */
    getMissionStatus() {
        return {
            mission: this.currentMission,
            active: this.missionActive,
            result: this.missionResult,
            time: this.missionTime,
            objectives: this.objectives,
            primaryComplete: this.objectives.filter(o => o.primary).every(o => o.completed),
            secondaryComplete: this.objectives.filter(o => !o.primary).every(o => o.completed)
        };
    }
}
