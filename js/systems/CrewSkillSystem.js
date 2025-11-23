/**
 * Star Sea - Crew Skills System
 * Four skill categories affecting ship performance
 *
 * HELM: Speed, acceleration, turn rate (+10% max at skill 10)
 * TACTICAL: Weapon reload/recharge rates (+20% max at skill 10)
 * ENGINEERING: Damage control speed (+30% max at skill 10)
 * OPERATIONS: Fighter/bomber/shuttle efficiency (+25% max at skill 10)
 */

class CrewSkillSystem {
    constructor(ship) {
        this.ship = ship;

        // Skill ratings 1-10 (start based on faction/player status)
        this.helm = this.getDefaultSkill('helm');
        this.tactical = this.getDefaultSkill('tactical');
        this.engineering = this.getDefaultSkill('engineering');
        this.operations = this.getDefaultSkill('operations');

        // XP tracking for skill progression
        this.xp = {
            helm: 0,
            tactical: 0,
            engineering: 0,
            operations: 0
        };

        // XP required per level
        this.xpPerLevel = CONFIG.CREW_SKILL_XP_PER_LEVEL || 100;
    }

    /**
     * Get default skill level based on faction
     */
    getDefaultSkill(category) {
        // Player starts at skill level 3
        if (this.ship.isPlayer) return 3;

        // AI skills vary by faction
        switch (this.ship.faction) {
            case 'TRIGON':
                // Trigon: High tactical, medium others
                return category === 'tactical' ? 5 : 4;

            case 'SCINTILIAN':
                // Scintilian: High engineering and operations, good tactical
                if (category === 'engineering') return 6;
                if (category === 'operations') return 5;
                if (category === 'tactical') return 4;
                return 3;

            case 'PIRATE':
                // Pirates: Poor engineering, varied others
                if (category === 'engineering') return 1;
                if (category === 'tactical') return 3;
                return 2;

            default:
                return 3;
        }
    }

    /**
     * Get helm bonuses (speed, acceleration, turn rate)
     * Affects ship movement performance
     */
    getHelmBonuses() {
        const mult = this.helm / 10; // 0.1 to 1.0 at skill 1-10
        return {
            speedMult: 1 + (mult * 0.1),      // Max +10% at skill 10
            accelMult: 1 + (mult * 0.1),      // Max +10% at skill 10
            turnMult: 1 + (mult * 0.1)        // Max +10% at skill 10
        };
    }

    /**
     * Get tactical bonuses (reload/recharge rates)
     * Affects weapon firing frequency
     */
    getTacticalBonuses() {
        const mult = this.tactical / 10;
        return {
            reloadMult: 1 + (mult * 0.2),     // Max +20% faster at skill 10
            rechargeMult: 1 + (mult * 0.2)    // Max +20% faster at skill 10
        };
    }

    /**
     * Get engineering bonuses (repair speed)
     * Affects auto-repair rate
     */
    getEngineeringBonuses() {
        const mult = this.engineering / 10;
        return {
            repairMult: 1 + (mult * 0.3)      // Max +30% faster repairs at skill 10
        };
    }

    /**
     * Get operations bonuses (craft efficiency)
     * Affects fighters, bombers, shuttles, drones
     */
    getOperationsBonuses() {
        const mult = this.operations / 10;
        return {
            craftEfficiencyMult: 1 + (mult * 0.25) // Max +25% craft boost at skill 10
        };
    }

    /**
     * Add XP to a skill category
     * @param {string} category - 'helm', 'tactical', 'engineering', 'operations'
     * @param {number} amount - XP amount to add
     */
    addXP(category, amount) {
        if (!this.xp.hasOwnProperty(category)) return;

        this.xp[category] += amount;

        // Check for level up
        const currentSkill = this[category];
        const xpForNextLevel = currentSkill * this.xpPerLevel;

        if (this.xp[category] >= xpForNextLevel && currentSkill < 10) {
            this[category]++;
            this.xp[category] -= xpForNextLevel;

            // Emit level up event
            eventBus.emit('crew-skill-level-up', {
                ship: this.ship,
                category: category,
                newLevel: this[category]
            });

            console.log(`<“ Crew skill level up! ${category}: ${this[category]}`);
        }
    }

    /**
     * Get XP progress for a skill (0-1 for UI display)
     */
    getXPProgress(category) {
        if (!this.xp.hasOwnProperty(category)) return 0;

        const currentSkill = this[category];
        if (currentSkill >= 10) return 1; // Max level

        const xpForNextLevel = currentSkill * this.xpPerLevel;
        return this.xp[category] / xpForNextLevel;
    }

    /**
     * Award XP based on player actions
     */
    awardXPForAction(action, amount = null) {
        if (!this.ship.isPlayer) return; // Only player earns XP

        switch (action) {
            case 'helm-maneuver':
                this.addXP('helm', amount || 1);
                break;

            case 'weapon-hit':
                this.addXP('tactical', amount || 2);
                break;

            case 'repair-complete':
                this.addXP('engineering', amount || 5);
                break;

            case 'craft-launched':
                this.addXP('operations', amount || 3);
                break;

            case 'combat-victory':
                // Award XP to all categories
                this.addXP('helm', 5);
                this.addXP('tactical', 10);
                this.addXP('engineering', 5);
                this.addXP('operations', 5);
                break;
        }
    }

    /**
     * Get summary of all skills for display
     */
    getSkillSummary() {
        return {
            helm: {
                level: this.helm,
                xp: this.xp.helm,
                progress: this.getXPProgress('helm'),
                bonuses: this.getHelmBonuses()
            },
            tactical: {
                level: this.tactical,
                xp: this.xp.tactical,
                progress: this.getXPProgress('tactical'),
                bonuses: this.getTacticalBonuses()
            },
            engineering: {
                level: this.engineering,
                xp: this.xp.engineering,
                progress: this.getXPProgress('engineering'),
                bonuses: this.getEngineeringBonuses()
            },
            operations: {
                level: this.operations,
                xp: this.xp.operations,
                progress: this.getXPProgress('operations'),
                bonuses: this.getOperationsBonuses()
            }
        };
    }
}
