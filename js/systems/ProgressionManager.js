/**
 * Star Sea - Progression Manager
 * Manages player progression, upgrades, and rewards
 */

class ProgressionManager {
    constructor() {
        this.credits = 0;
        this.reputation = 0;
        this.achievements = [];
        this.upgrades = {
            hull: 0,           // +10 HP per level
            shields: 0,        // +5 HP per quadrant per level
            beamDamage: 0,     // +1 damage per level
            torpedoDamage: 0,  // +2 damage per level
            systemRepair: 0,   // +0.01 HP/sec per level
            decoyCapacity: 0,  // +2 capacity per level
            mineCapacity: 0    // +2 capacity per level
        };
        this.maxUpgradeLevel = 5;
    }

    /**
     * Award mission completion rewards
     * @param {Object} missionResult - Result from MissionManager
     * @returns {Object} - Rewards earned
     */
    awardMissionRewards(missionResult) {
        const { mission, result, objectives, time, enemiesDestroyed } = missionResult;

        if (result !== 'victory') {
            return { credits: 0, reputation: 0, rating: 'F' };
        }

        // Calculate mission rating
        const rating = this.calculateMissionRating(mission, objectives, time, enemiesDestroyed);

        // Calculate rewards based on rating
        const rewards = this.calculateRewards(mission, rating, objectives);

        // Apply rewards
        this.credits += rewards.credits;
        this.reputation += rewards.reputation;

        // Check for achievements
        this.checkAchievements(mission, rating, objectives, enemiesDestroyed);

        eventBus.emit('rewards-earned', {
            credits: rewards.credits,
            reputation: rewards.reputation,
            rating: rating,
            totalCredits: this.credits,
            totalReputation: this.reputation
        });

        return { ...rewards, rating };
    }

    /**
     * Calculate mission rating (S/A/B/C/D)
     * @returns {string} - Mission rating
     */
    calculateMissionRating(mission, objectives, time, enemiesDestroyed) {
        let score = 100;

        // Primary objectives completed (required for any rating)
        const primaryObjectives = objectives.filter(o => o.primary);
        const primaryCompleted = primaryObjectives.filter(o => o.completed).length;
        const primaryTotal = primaryObjectives.length;

        if (primaryCompleted < primaryTotal) {
            return 'F'; // Failed
        }

        // Optional objectives bonus
        const optionalObjectives = objectives.filter(o => !o.primary);
        const optionalCompleted = optionalObjectives.filter(o => o.completed).length;
        const optionalTotal = optionalObjectives.length;

        if (optionalTotal > 0) {
            score += (optionalCompleted / optionalTotal) * 20;
        }

        // Time bonus (if mission has expected completion time)
        const expectedTime = this.getExpectedMissionTime(mission);
        if (expectedTime && time) {
            if (time <= expectedTime * 0.75) {
                score += 20; // Very fast
            } else if (time <= expectedTime) {
                score += 10; // On time
            }
        }

        // Enemy destruction bonus
        const expectedEnemies = mission.enemies?.length || 0;
        if (expectedEnemies > 0 && enemiesDestroyed >= expectedEnemies) {
            score += 10;
        }

        // Convert score to rating
        if (score >= 140) return 'S';
        if (score >= 120) return 'A';
        if (score >= 100) return 'B';
        if (score >= 80) return 'C';
        return 'D';
    }

    /**
     * Calculate credit and reputation rewards
     */
    calculateRewards(mission, rating, objectives) {
        // Base rewards by mission number (later missions = more rewards)
        const missionNum = parseInt(mission.id.replace('mission-', ''));
        const baseCredits = 100 + (missionNum * 50);
        const baseReputation = 10 + (missionNum * 5);

        // Rating multipliers
        const ratingMultipliers = {
            'S': 2.0,
            'A': 1.5,
            'B': 1.0,
            'C': 0.75,
            'D': 0.5,
            'F': 0
        };

        const multiplier = ratingMultipliers[rating] || 1.0;

        // Optional objective bonuses
        const optionalBonus = objectives.filter(o => !o.primary && o.completed).length * 50;

        return {
            credits: Math.floor(baseCredits * multiplier) + optionalBonus,
            reputation: Math.floor(baseReputation * multiplier)
        };
    }

    /**
     * Get expected mission completion time
     */
    getExpectedMissionTime(mission) {
        // Expected times in seconds for each mission type
        const expectedTimes = {
            'mission-01': 180,  // 3 minutes
            'mission-02': 240,  // 4 minutes
            'mission-03': 300,  // 5 minutes
            'mission-04': 180,  // 3 minutes
            'mission-05': 360,  // 6 minutes
            'mission-06': 300,  // 5 minutes
            'mission-07': 420,  // 7 minutes (time limit)
            'mission-08': 240,  // 4 minutes
            'mission-09': 480,  // 8 minutes
            'mission-10': 600   // 10 minutes (time limit)
        };

        return expectedTimes[mission.id] || null;
    }

    /**
     * Purchase upgrade
     * @param {string} upgradeType - Type of upgrade
     * @returns {boolean} - Success status
     */
    purchaseUpgrade(upgradeType) {
        if (!this.upgrades.hasOwnProperty(upgradeType)) {
            console.error(`Unknown upgrade type: ${upgradeType}`);
            return false;
        }

        const currentLevel = this.upgrades[upgradeType];
        if (currentLevel >= this.maxUpgradeLevel) {
            console.log(`${upgradeType} already at max level`);
            return false;
        }

        const cost = this.getUpgradeCost(upgradeType, currentLevel);
        if (this.credits < cost) {
            console.log(`Insufficient credits. Need ${cost}, have ${this.credits}`);
            return false;
        }

        // Purchase upgrade
        this.credits -= cost;
        this.upgrades[upgradeType]++;

        eventBus.emit('upgrade-purchased', {
            type: upgradeType,
            level: this.upgrades[upgradeType],
            cost: cost,
            remainingCredits: this.credits
        });

        return true;
    }

    /**
     * Get upgrade cost
     */
    getUpgradeCost(upgradeType, currentLevel) {
        const baseCosts = {
            hull: 200,
            shields: 150,
            beamDamage: 300,
            torpedoDamage: 400,
            systemRepair: 250,
            decoyCapacity: 100,
            mineCapacity: 100
        };

        const baseCost = baseCosts[upgradeType] || 200;
        // Cost increases exponentially: base * (level + 1) * 1.5
        return Math.floor(baseCost * (currentLevel + 1) * 1.5);
    }

    /**
     * Apply upgrades to ship
     * @param {Ship} ship - Player ship to upgrade
     */
    applyUpgradesToShip(ship) {
        if (!ship) return;

        // Hull upgrade
        const hullBonus = this.upgrades.hull * 10;
        ship.maxHp += hullBonus;
        ship.hp = Math.min(ship.hp + hullBonus, ship.maxHp);

        // Shield upgrade
        if (ship.shields) {
            const shieldBonus = this.upgrades.shields * 5;
            ['fore', 'aft', 'port', 'starboard'].forEach(quadrant => {
                if (ship.shields[quadrant]) {
                    ship.shields[quadrant].maxHp += shieldBonus;
                    ship.shields[quadrant].hp = Math.min(
                        ship.shields[quadrant].hp + shieldBonus,
                        ship.shields[quadrant].maxHp
                    );
                }
            });
        }

        // Weapon upgrades
        if (ship.weapons) {
            ship.weapons.forEach(weapon => {
                if (weapon.projectileType === 'beam') {
                    weapon.damage += this.upgrades.beamDamage;
                } else if (weapon.projectileType === 'torpedo') {
                    weapon.damage += this.upgrades.torpedoDamage * 2;
                }
            });
        }

        // System repair upgrade
        if (this.upgrades.systemRepair > 0) {
            CONFIG.AUTO_REPAIR_RATE += this.upgrades.systemRepair * 0.01;
        }

        // Countermeasure capacity
        ship.maxDecoys = 6 + (this.upgrades.decoyCapacity * 2);
        ship.maxMines = 6 + (this.upgrades.mineCapacity * 2);
        ship.decoys = Math.min(ship.decoys, ship.maxDecoys);
        ship.mines = Math.min(ship.mines, ship.maxMines);

        console.log('Upgrades applied to ship');
    }

    /**
     * Check and award achievements
     */
    checkAchievements(mission, rating, objectives, enemiesDestroyed) {
        const achievements = [];

        // First mission completion
        if (mission.id === 'mission-01' && !this.hasAchievement('first-mission')) {
            achievements.push(this.unlockAchievement('first-mission', 'First Steps', 'Complete your first mission', 100));
        }

        // S-rank achievement
        if (rating === 'S' && !this.hasAchievement('s-rank')) {
            achievements.push(this.unlockAchievement('s-rank', 'Perfect Commander', 'Earn an S-rank on any mission', 200));
        }

        // All objectives achievement
        if (objectives.every(o => o.completed) && objectives.length >= 4 && !this.hasAchievement('perfectionist')) {
            achievements.push(this.unlockAchievement('perfectionist', 'Perfectionist', 'Complete all objectives in a mission', 150));
        }

        // Enemy hunter achievements
        if (enemiesDestroyed >= 10 && !this.hasAchievement('ace-pilot')) {
            achievements.push(this.unlockAchievement('ace-pilot', 'Ace Pilot', 'Destroy 10 enemies in one mission', 150));
        }

        // Campaign milestones
        if (mission.id === 'mission-05' && !this.hasAchievement('phase-1-complete')) {
            achievements.push(this.unlockAchievement('phase-1-complete', 'Phase One Complete', 'Complete the introduction arc', 300));
        }

        if (mission.id === 'mission-10' && !this.hasAchievement('phase-2-complete')) {
            achievements.push(this.unlockAchievement('phase-2-complete', 'War Hero', 'Complete the war campaign', 500));
        }

        return achievements;
    }

    /**
     * Unlock achievement
     */
    unlockAchievement(id, name, description, creditReward) {
        const achievement = {
            id,
            name,
            description,
            creditReward,
            unlockedAt: Date.now()
        };

        this.achievements.push(achievement);
        this.credits += creditReward;

        eventBus.emit('achievement-unlocked', achievement);

        return achievement;
    }

    /**
     * Check if achievement is unlocked
     */
    hasAchievement(id) {
        return this.achievements.some(a => a.id === id);
    }

    /**
     * Get progression summary
     */
    getProgressionSummary() {
        return {
            credits: this.credits,
            reputation: this.reputation,
            achievements: this.achievements.length,
            upgrades: { ...this.upgrades },
            totalUpgrades: Object.values(this.upgrades).reduce((a, b) => a + b, 0)
        };
    }

    /**
     * Save progression data
     */
    getSaveData() {
        return {
            credits: this.credits,
            reputation: this.reputation,
            achievements: this.achievements,
            upgrades: { ...this.upgrades }
        };
    }

    /**
     * Restore progression data
     */
    loadSaveData(saveData) {
        if (!saveData) return;

        this.credits = saveData.credits || 0;
        this.reputation = saveData.reputation || 0;
        this.achievements = saveData.achievements || [];
        if (saveData.upgrades) {
            Object.keys(saveData.upgrades).forEach(key => {
                if (this.upgrades.hasOwnProperty(key)) {
                    this.upgrades[key] = saveData.upgrades[key];
                }
            });
        }
    }
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressionManager };
}
