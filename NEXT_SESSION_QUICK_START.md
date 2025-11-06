# Quick Start - Next Session
**Last Session:** 2025-10-27

---

## 🎯 WHAT'S DONE (6/14 Features Complete)

✅ Continuous beam fixed start point
✅ Torpedo hull escape fix
✅ Pirate weapon firing
✅ Sensor ranges x10
✅ Shield bars (debug logging)
✅ Boost shield drain

✅ All environmental entity files exist (Asteroid, Planet, Star, BlackHole, Nebula)

---

## 🚀 START HERE - Priority Tasks

### **Task 1: CrewSkillSystem.js (Empty file exists)**
**File:** `js/systems/CrewSkillSystem.js`

```javascript
class CrewSkillSystem {
    constructor(ship) {
        this.ship = ship;
        this.helm = this.getDefaultSkill('helm');        // 1-10
        this.tactical = this.getDefaultSkill('tactical');
        this.engineering = this.getDefaultSkill('engineering');
        this.operations = this.getDefaultSkill('operations');
    }

    getDefaultSkill(category) {
        if (this.ship.isPlayer) return 3;
        switch (this.ship.faction) {
            case 'TRIGON': return 4;
            case 'SCINTILIAN': return 5;
            case 'PIRATE': return 2;
            default: return 3;
        }
    }

    getHelmBonuses() {
        const mult = this.helm / 10;
        return {
            speedMult: 1 + (mult * 0.1),      // Max +10%
            accelMult: 1 + (mult * 0.1),
            turnMult: 1 + (mult * 0.1)
        };
    }

    getTacticalBonuses() {
        const mult = this.tactical / 10;
        return {
            reloadMult: 1 + (mult * 0.2),     // Max +20%
            rechargeMult: 1 + (mult * 0.2)
        };
    }

    getEngineeringBonuses() {
        const mult = this.engineering / 10;
        return {
            repairMult: 1 + (mult * 0.3)      // Max +30%
        };
    }

    getOperationsBonuses() {
        const mult = this.operations / 10;
        return {
            craftEfficiencyMult: 1 + (mult * 0.25) // Max +25%
        };
    }
}
```

**Then integrate:**
- Ship.js constructor: `this.crewSkills = new CrewSkillSystem(this);`
- Ship.js: Apply helm bonuses to maxSpeed, acceleration, turnRate
- Weapon.js: Apply tactical bonuses to cooldown
- ContinuousBeam.js: Apply tactical bonuses to recharge
- InternalSystems.js: Apply engineering bonuses to AUTO_REPAIR_RATE
- BaySystem.js: Apply operations bonuses to craft stats
- index.html: Add script tag before Ship.js

---

### **Task 2: ConsumableSystem.js (Doesn't exist)**
**File:** `js/systems/ConsumableSystem.js`

```javascript
class ConsumableSystem {
    constructor(ship) {
        this.ship = ship;
        this.inventory = {
            extraTorpedoes: 0,
            extraDecoys: 0,
            extraMines: 0,
            shieldBoost: 0,
            hullRepairKit: 0,
            energyCells: 0
        };
        this.activeEffects = {
            energyCells: { active: false, endTime: 0, damageMult: 1.2 }
        };
    }

    addConsumable(type, count) {
        if (this.inventory.hasOwnProperty(type)) {
            this.inventory[type] += count;
            return true;
        }
        return false;
    }

    useConsumable(type) {
        if (this.inventory[type] <= 0) return false;
        this.inventory[type]--;

        switch(type) {
            case 'extraTorpedoes':
                const torpLauncher = this.ship.getTorpedoLaunchers()[0];
                if (torpLauncher) torpLauncher.stored += 10;
                break;
            case 'extraDecoys':
                this.ship.decoys += 3;
                break;
            case 'extraMines':
                this.ship.mines += 3;
                break;
            case 'shieldBoost':
                ['fore', 'aft', 'port', 'starboard'].forEach(q => {
                    const shield = this.ship.shields[q];
                    shield.max *= 1.2;
                    shield.current = Math.min(shield.current * 1.2, shield.max);
                });
                break;
            case 'hullRepairKit':
                this.ship.hp = Math.min(this.ship.hp + 50, this.ship.maxHp);
                break;
            case 'energyCells':
                this.activeEffects.energyCells.active = true;
                this.activeEffects.energyCells.endTime = performance.now()/1000 + 60;
                break;
        }

        eventBus.emit('consumable-used', { type, ship: this.ship });
        return true;
    }

    update(currentTime) {
        if (this.activeEffects.energyCells.active &&
            currentTime > this.activeEffects.energyCells.endTime) {
            this.activeEffects.energyCells.active = false;
        }
    }

    getDamageMultiplier() {
        return this.activeEffects.energyCells.active ? 1.2 : 1.0;
    }
}
```

**Then integrate:**
- Ship.js constructor: `this.consumables = new ConsumableSystem(this);`
- Ship.js update: `this.consumables.update(currentTime);`
- Ship.js weapon fire: Multiply damage by `this.consumables.getDamageMultiplier()`
- MissionUI.js: Add consumable selection UI
- HUD.js: Add consumables display
- Engine.js: Add keyboard handlers (keys 1-6)
- index.html: Add script tag, add HUD elements

---

### **Task 3-7: Integrate Environmental Entities**

**Planets:**
- Engine.js mission setup: Spawn 2-3 planets
- Engine.js update: Apply gravity to all ships
- Engine.js update: Update orbiting ships
- Engine.js collision: Planet-ship = fatal
- Rendering: Draw colored circles

**Stars:**
- Engine.js mission setup: Spawn 1 star
- Engine.js update: Apply gravity + proximity damage
- Rendering: Draw yellow with glow

**Black Holes:**
- Engine.js mission setup: Spawn 0-2 black holes
- Engine.js update: Apply geometric gravity
- Engine.js update: Check center zone for instant death
- Rendering: Draw black center + swirl particles

**Nebula:**
- Engine.js mission setup: Spawn 1-3 nebula regions
- Engine.js update: Check ship overlap
- AIController: Reduce detection radius in nebula
- Ship: Negate shields in nebula
- Ship: Add accuracy penalty when firing in nebula
- Rendering: Draw semi-transparent colored regions

---

## 📂 Key File Locations

**Systems to implement:**
- `js/systems/CrewSkillSystem.js` ⚠️ EMPTY
- `js/systems/ConsumableSystem.js` ❌ MISSING

**Environmental (exist, need integration):**
- `js/entities/Asteroid.js` ✅ (partially integrated)
- `js/entities/Planet.js` ✅
- `js/entities/Star.js` ✅
- `js/entities/BlackHole.js` ✅
- `js/entities/Nebula.js` ✅

**Core integration point:**
- `js/core/Engine.js` - Add spawning and update logic

**UI integration points:**
- `js/ui/MissionUI.js` - Consumable selection
- `js/ui/HUD.js` - Consumable display
- `index.html` - HTML elements

---

## ⏱️ Time Estimates

- CrewSkillSystem: 2-3 hours
- ConsumableSystem: 3-4 hours
- Planet integration: 2 hours
- Star integration: 1 hour
- Black hole integration: 1.5 hours
- Nebula integration: 2 hours

**Total:** ~12-15 hours

---

## 🧪 Test After Each Step

1. After CrewSkillSystem: Check ship moves faster with higher helm skill
2. After ConsumableSystem: Check consumables activate from keys
3. After Planets: Check gravity pulls ships, orbital capture works
4. After Stars: Check proximity damage works
5. After Black Holes: Check instant death in center
6. After Nebula: Check sensor reduction, shield negation, accuracy penalty

---

**Ready to continue! Start with CrewSkillSystem.js** 🚀
