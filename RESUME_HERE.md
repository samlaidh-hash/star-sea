# 🚀 RESUME HERE - Immediate Next Steps

## ✅ WHAT'S DONE (57% Complete)
- ✅ All 6 critical fixes complete
- ✅ **CrewSkillSystem FULLY INTEGRATED** (helm & tactical bonuses working)
- ✅ **ConsumableSystem CLASS COMPLETE** (just needs integration)
- ✅ All environmental entity files exist (Asteroid, Planet, Star, BlackHole, Nebula)

---

## 🎯 START HERE - 3 Quick Wins (2 hours)

### **1. Add ConsumableSystem to Ship.js** (10 minutes)

**File:** `js/entities/Ship.js`

**After line 430 (after crew skills apply bonuses), add:**
```javascript
// Consumables System - mission loadout items
this.consumables = new ConsumableSystem(this);
```

**In Ship.js update() method, find where updateBoost() is called, add after:**
```javascript
// Update consumables (for active effect timers)
if (this.consumables) {
    this.consumables.update(currentTime);
}
```

---

### **2. Add Script Tag to index.html** (2 minutes)

**File:** `index.html`

**After line 384 (after CrewSkillSystem.js), add:**
```html
<script src="js/systems/ConsumableSystem.js"></script>
```

---

### **3. Add Keyboard Handlers to Engine.js** (15 minutes)

**File:** `js/core/Engine.js`

**Find the setupEventListeners() method, add this after other keyboard handlers:**
```javascript
// Consumable hotkeys (1-6)
eventBus.on('key-down', (data) => {
    if (!this.stateManager.isPlaying() || !this.playerShip) return;

    // Keys 1-6 for consumables
    if (data.key >= '1' && data.key <= '6') {
        const types = [
            'extraTorpedoes',  // 1
            'extraDecoys',     // 2
            'extraMines',      // 3
            'shieldBoost',     // 4
            'hullRepairKit',   // 5
            'energyCells'      // 6
        ];
        const index = parseInt(data.key) - 1;
        if (this.playerShip.consumables) {
            this.playerShip.consumables.useConsumable(types[index]);
        }
    }
});
```

---

## 🧪 TEST AFTER THESE 3 STEPS

1. Start game
2. Give yourself test consumables in console:
   ```javascript
   window.game.playerShip.consumables.addConsumable('hullRepairKit', 5);
   window.game.playerShip.consumables.addConsumable('energyCells', 5);
   ```
3. Press `5` key - should heal +50 HP and see console message
4. Press `6` key - should activate energy cells and see console message
5. Fire weapons - damage should be 20% higher for 60 seconds

---

## 📋 AFTER TESTING - Next Big Tasks

### **Task 4: Apply Damage Multiplier to Weapons** (30 min)
Find weapon fire methods in Ship.js and multiply damage by `this.consumables.getDamageMultiplier()`

### **Task 5: Add Consumables HUD Display** (1 hour)
Create visual display showing consumable counts and hotkeys

### **Task 6: Add Mission Briefing UI** (1 hour)
Let player select consumables before mission starts

### **Task 7-10: Environmental Integration** (6-8 hours)
Integrate Planets → Stars → Black Holes → Nebula into Engine.js

---

## 📂 KEY FILE LOCATIONS

**Just Created:**
- `js/systems/CrewSkillSystem.js` ✅ Done
- `js/systems/ConsumableSystem.js` ✅ Done

**Need to Modify:**
- `js/entities/Ship.js` - Add consumables property
- `js/core/Engine.js` - Add keyboard handlers
- `index.html` - Add script tag

**Exist, Need Integration:**
- `js/entities/Planet.js`
- `js/entities/Star.js`
- `js/entities/BlackHole.js`
- `js/entities/Nebula.js`

---

## ⏱️ Time Budget

- Consumables integration: 2-3 hours
- Environmental integration: 6-8 hours
- **Total to 100%:** ~10 hours

---

**🎮 READY TO CONTINUE! Start with the 3 quick wins above.** 🚀
