/**
 * Star Sea - Balance System
 * Manages game balance, testing, and performance optimization
 */

class BalanceSystem {
    constructor() {
        this.engine = null;
        this.balanceData = this.initializeBalanceData();
        this.performanceMetrics = this.initializePerformanceMetrics();
        this.testResults = [];
        this.lastWarningTime = 0;
        this.warningCooldown = 5000; // 5 seconds between warnings
    }

    init(engine) {
        this.engine = engine;
    }

    initializeBalanceData() {
        return {
            // Weapon balance
            weapons: {
                beam: { damage: 1, range: 100, cooldown: 1.0 },
                torpedo: { damage: 2, range: 200, cooldown: 3.0 },
                heavyTorpedo: { damage: 3, range: 300, cooldown: 5.0 },
                laser: { damage: 1.5, range: 150, cooldown: 0.5 }
            },
            // Ship balance
            ships: {
                FG: { hp: 10, speed: 100, turnRate: 90 },
                DD: { hp: 15, speed: 90, turnRate: 80 },
                CL: { hp: 25, speed: 80, turnRate: 70 },
                CA: { hp: 40, speed: 70, turnRate: 60 },
                BC: { hp: 60, speed: 60, turnRate: 50 },
                BB: { hp: 80, speed: 50, turnRate: 40 },
                DN: { hp: 100, speed: 40, turnRate: 30 },
                SD: { hp: 120, speed: 30, turnRate: 20 }
            },
            // Faction balance
            factions: {
                FEDERATION: { accuracy: 1.0, damage: 1.0, speed: 1.0 },
                TRIGON: { accuracy: 0.9, damage: 1.2, speed: 1.1 },
                SCINTILIAN: { accuracy: 1.1, damage: 0.9, speed: 1.2 },
                PIRATE: { accuracy: 0.8, damage: 1.3, speed: 1.0 },
                DHOJAN: { accuracy: 1.2, damage: 1.1, speed: 0.9 },
                ANDROMEDAN: { accuracy: 1.0, damage: 1.0, speed: 1.0 },
                COMMONWEALTH: { accuracy: 1.3, damage: 0.8, speed: 1.1 }
            }
        };
    }

    initializePerformanceMetrics() {
        return {
            frameRate: 0,
            entityCount: 0,
            memoryUsage: 0,
            updateTime: 0,
            renderTime: 0
        };
    }

    update(deltaTime, currentTime) {
        this.updatePerformanceMetrics(deltaTime, currentTime);
        this.checkBalanceIssues();
        this.optimizePerformance();
    }

    updatePerformanceMetrics(deltaTime, currentTime) {
        // Update FPS
        this.performanceMetrics.frameRate = 1 / deltaTime;
        
        // Update entity count - use engine reference if available
        if (this.engine && this.engine.entities) {
            this.performanceMetrics.entityCount = this.engine.entities.length;
        } else {
            this.performanceMetrics.entityCount = 0;
        }
        
        // Update memory usage (approximate)
        this.performanceMetrics.memoryUsage = this.estimateMemoryUsage();
        
        // Update timing metrics
        this.performanceMetrics.updateTime = deltaTime;
    }

    estimateMemoryUsage() {
        // Rough estimate of memory usage
        let memoryUsage = 0;
        
        // Entity memory - use engine reference if available
        if (this.engine && this.engine.entities) {
            memoryUsage += this.engine.entities.length * 1000; // ~1KB per entity
            
            // Physics bodies
            memoryUsage += this.engine.entities.length * 500; // ~500B per physics body
        }
        
        // Particle systems
        memoryUsage += 10000; // ~10KB for particle systems
        
        return memoryUsage;
    }

    checkBalanceIssues() {
        // Check for overpowered weapons
        this.checkWeaponBalance();
        
        // Check for underpowered ships
        this.checkShipBalance();
        
        // Check for faction imbalances
        this.checkFactionBalance();
    }

    checkWeaponBalance() {
        const weapons = this.balanceData.weapons;
        
        // Check if any weapon is too powerful
        for (const [weaponType, stats] of Object.entries(weapons)) {
            const dps = stats.damage / stats.cooldown;
            const rangeEfficiency = stats.range / 100;
            const powerLevel = dps * rangeEfficiency;
            
            if (powerLevel > 2.0 && this.shouldShowWarning()) {
                console.warn(`Weapon ${weaponType} may be overpowered (power level: ${powerLevel.toFixed(2)})`);
            }
        }
    }

    shouldShowWarning() {
        const currentTime = performance.now();
        if (currentTime - this.lastWarningTime > this.warningCooldown) {
            this.lastWarningTime = currentTime;
            return true;
        }
        return false;
    }

    checkShipBalance() {
        const ships = this.balanceData.ships;
        
        // Check if ship progression is balanced
        const shipClasses = Object.keys(ships);
        for (let i = 1; i < shipClasses.length; i++) {
            const current = ships[shipClasses[i]];
            const previous = ships[shipClasses[i-1]];
            
            const hpRatio = current.hp / previous.hp;
            const speedRatio = current.speed / previous.speed;
            
            if ((hpRatio < 1.2 || speedRatio < 0.8) && this.shouldShowWarning()) {
                console.warn(`Ship class ${shipClasses[i]} may be unbalanced relative to ${shipClasses[i-1]}`);
            }
        }
    }

    checkFactionBalance() {
        const factions = this.balanceData.factions;
        
        // Check if any faction is too powerful
        for (const [faction, stats] of Object.entries(factions)) {
            const powerLevel = stats.accuracy * stats.damage * stats.speed;
            
            if (powerLevel > 1.5) {
                console.warn(`Faction ${faction} may be overpowered (power level: ${powerLevel.toFixed(2)})`);
            } else if (powerLevel < 0.8) {
                console.warn(`Faction ${faction} may be underpowered (power level: ${powerLevel.toFixed(2)})`);
            }
        }
    }

    optimizePerformance() {
        // Optimize if performance is poor
        if (this.performanceMetrics.frameRate < 30) {
            this.optimizeLowPerformance();
        }
        
        // Optimize if too many entities
        if (this.performanceMetrics.entityCount > 100) {
            this.optimizeEntityCount();
        }
    }

    optimizeLowPerformance() {
        // Reduce particle effects
        if (this.engine && this.engine.particleSystem) {
            this.engine.particleSystem.maxParticles = Math.max(50, this.engine.particleSystem.maxParticles * 0.8);
        }
        
        // Reduce update frequency for distant entities
        this.optimizeDistantEntities();
    }

    optimizeEntityCount() {
        // Remove inactive entities
        this.cleanupInactiveEntities();
        
        // Reduce AI update frequency
        this.optimizeAIUpdates();
    }

    cleanupInactiveEntities() {
        if (this.engine && this.engine.entities) {
            const activeEntities = this.engine.entities.filter(e => e.active);
            if (activeEntities.length < this.engine.entities.length) {
                this.engine.entities = activeEntities;
                console.log(`Cleaned up ${this.engine.entities.length - activeEntities.length} inactive entities`);
            }
        }
    }

    optimizeDistantEntities() {
        // Reduce update frequency for entities far from player
        if (this.engine && this.engine.playerShip && this.engine.entities) {
            for (const entity of this.engine.entities) {
                if (entity !== this.engine.playerShip && entity.active) {
                    const distance = MathUtils.distance(
                        this.engine.playerShip.x, this.engine.playerShip.y,
                        entity.x, entity.y
                    );
                    
                    if (distance > 500) {
                        // Reduce update frequency for distant entities
                        entity.updateFrequency = Math.max(0.1, entity.updateFrequency || 1.0);
                    }
                }
            }
        }
    }

    optimizeAIUpdates() {
        // Reduce AI update frequency for non-critical entities
        if (this.engine && this.engine.entities) {
            for (const entity of this.engine.entities) {
                if (entity.type === 'ship' && entity !== this.engine.playerShip) {
                    if (!entity.aiController) continue;
                    
                    // Reduce AI update frequency based on distance from player
                    const distance = this.engine.playerShip ? 
                        MathUtils.distance(this.engine.playerShip.x, this.engine.playerShip.y, entity.x, entity.y) : 0;
                    
                    if (distance > 300) {
                        entity.aiController.updateFrequency = 0.5; // Update every other frame
                    }
                }
            }
        }
    }

    runBalanceTests() {
        console.log('Running balance tests...');
        
        // Test weapon effectiveness
        this.testWeaponEffectiveness();
        
        // Test ship survivability
        this.testShipSurvivability();
        
        // Test faction balance
        this.testFactionBalance();
        
        console.log('Balance tests completed');
    }

    testWeaponEffectiveness() {
        // Test each weapon against different ship types
        const weapons = this.balanceData.weapons;
        const ships = this.balanceData.ships;
        
        for (const [weaponType, weaponStats] of Object.entries(weapons)) {
            for (const [shipType, shipStats] of Object.entries(ships)) {
                const timeToKill = shipStats.hp / (weaponStats.damage / weaponStats.cooldown);
                const effectiveness = 100 / timeToKill; // Higher is better
                
                this.testResults.push({
                    test: 'weapon_effectiveness',
                    weapon: weaponType,
                    target: shipType,
                    effectiveness: effectiveness,
                    timeToKill: timeToKill
                });
            }
        }
    }

    testShipSurvivability() {
        // Test ship survivability against different threats
        const ships = this.balanceData.ships;
        
        for (const [shipType, shipStats] of Object.entries(ships)) {
            const survivability = shipStats.hp * shipStats.speed / 100; // Higher is better
            
            this.testResults.push({
                test: 'ship_survivability',
                ship: shipType,
                survivability: survivability,
                hp: shipStats.hp,
                speed: shipStats.speed
            });
        }
    }

    testFactionBalance() {
        // Test faction power levels
        const factions = this.balanceData.factions;
        
        for (const [faction, stats] of Object.entries(factions)) {
            const powerLevel = stats.accuracy * stats.damage * stats.speed;
            
            this.testResults.push({
                test: 'faction_balance',
                faction: faction,
                powerLevel: powerLevel,
                accuracy: stats.accuracy,
                damage: stats.damage,
                speed: stats.speed
            });
        }
    }

    getBalanceReport() {
        return {
            performance: this.performanceMetrics,
            balance: this.balanceData,
            testResults: this.testResults,
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Performance recommendations
        if (this.performanceMetrics.frameRate < 30) {
            recommendations.push('Consider reducing particle effects or entity count');
        }
        
        if (this.performanceMetrics.entityCount > 100) {
            recommendations.push('Consider implementing entity culling or LOD system');
        }
        
        // Balance recommendations
        const weaponTests = this.testResults.filter(r => r.test === 'weapon_effectiveness');
        const overpoweredWeapons = weaponTests.filter(r => r.effectiveness > 50);
        
        if (overpoweredWeapons.length > 0) {
            recommendations.push('Consider nerfing overpowered weapons');
        }
        
        const factionTests = this.testResults.filter(r => r.test === 'faction_balance');
        const imbalancedFactions = factionTests.filter(r => r.powerLevel > 1.5 || r.powerLevel < 0.8);
        
        if (imbalancedFactions.length > 0) {
            recommendations.push('Consider rebalancing faction stats');
        }
        
        return recommendations;
    }
}

