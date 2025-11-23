# EMERGENCY DIAGNOSTIC - Game Completely Broken

## Symptoms
1. ❌ Ship throttle bar moves but ship doesn't move
2. ❌ S key does nothing (should decrease throttle)
3. ❌ All weapon projectiles invisible
4. ❌ Enemy ships invisible
5. ❌ Whistling sound looping

## Critical Check: JavaScript Errors

**FIRST STEP:** Open browser console (F12) and look for RED error messages.

### Common Error Patterns:

#### Pattern 1: Constructor Error
```
TypeError: Cannot read property 'X' of undefined
  at new Nebula
  at Engine.spawnNebulas
```
**Cause:** Nebula constructor accessing undefined property
**Fix:** Check CONFIG constants or constructor parameters

#### Pattern 2: Rendering Error
```
TypeError: Cannot read property 'render' of null
  at Renderer.render
```
**Cause:** Renderer broken or entities malformed
**Fix:** Check entity structure

#### Pattern 3: Update Loop Error
```
TypeError: entity.update is not a function
  at Engine.update
```
**Cause:** Entity missing update method
**Fix:** Check entity class definitions

#### Pattern 4: Transform Error
```
TypeError: Cannot read property 'x' of undefined
  at Ship.updateThrottle
```
**Cause:** Transform or physics broken
**Fix:** Check Ship initialization

---

## Likely Causes (Priority Order)

### 1. Environmental Entity Constructor Error (MOST LIKELY)
**Why:** We just added Nebula, Planet, Star spawning
**Check:** Nebula.js constructor line 10-15
**Issue:** CONFIG properties might not match

**Nebula expects:**
- CONFIG.NEBULA_RADIUS
- CONFIG.NEBULA_DRAG_COEFFICIENT
- CONFIG.NEBULA_SHIELD_INTERFERENCE
- CONFIG.NEBULA_SENSOR_INTERFERENCE
- CONFIG.NEBULA_BEAM_INTERFERENCE
- CONFIG.NEBULA_TORPEDO_DRAG
- CONFIG.NEBULA_ALPHA
- CONFIG.COLOR_NEBULA

**Did we add all of these to config.js?**

### 2. Rendering System Broken
**Why:** Nothing visible (projectiles, enemies)
**Check:** Renderer.js or EnvironmentRenderer.js
**Issue:** Render loop might be throwing errors

### 3. Physics/Transform Broken
**Why:** Ship not moving despite throttle
**Check:** Ship.updateThrottle() or PhysicsComponent
**Issue:** Velocity not being applied

### 4. Game Loop Crash
**Why:** Everything frozen/non-functional
**Check:** Engine.update() or Engine.render()
**Issue:** Exception in update loop stopping everything

---

## Emergency Console Commands

Open browser console (F12) and run these commands:

### Check if game is running:
```javascript
window.game.stateManager.currentState
// Should return: "playing"
```

### Check player ship:
```javascript
window.game.playerShip
// Should return: Ship object
```

### Check ship position:
```javascript
{x: window.game.playerShip.x, y: window.game.playerShip.y}
// Should return: {x: number, y: number}
```

### Check ship throttle:
```javascript
window.game.playerShip.throttle
// Should return: 0.0 to 1.0
```

### Check ship velocity:
```javascript
{vx: window.game.playerShip.vx, vy: window.game.playerShip.vy}
// Should return: {vx: number, vy: number}
```

### Check entities:
```javascript
window.game.entities.length
// Should return: number > 1
```

### Check active entities:
```javascript
window.game.entities.filter(e => e.active).length
// Should return: number > 0
```

### Check projectiles:
```javascript
window.game.projectiles.length
// Should return: number (when firing)
```

### Force stop audio:
```javascript
window.game.audioManager.stopAllSounds()
// Should stop whistling
```

---

## Quick Rollback Test

If there's a JavaScript error with environmental entities, try this console command to bypass spawning:

```javascript
// Reload page, then BEFORE starting new game, run:
window.SKIP_ENV_SPAWN = true;
```

Then start a new game. If it works, the problem is in environmental entity spawning.

---

## Most Likely Culprit

Based on symptoms, I suspect **Nebula.js constructor** is throwing an error because it's trying to access a CONFIG property that doesn't exist or is misspelled.

Check config.js lines 216-226 for these properties:
- NEBULA_RADIUS ✓
- NEBULA_DRAG_COEFFICIENT ✓
- NEBULA_SHIELD_INTERFERENCE ✓
- NEBULA_SENSOR_INTERFERENCE ✓
- NEBULA_BEAM_INTERFERENCE ✓
- NEBULA_TORPEDO_DRAG ✓
- NEBULA_ALPHA ✓
- NEBULA_SENSOR_REDUCTION ✓
- NEBULA_ACCURACY_PENALTY ✓
- COLOR_NEBULA ✓

---

## What To Report Back

1. **Console Errors:** Copy/paste any RED error messages
2. **Game State:** Result of `window.game.stateManager.currentState`
3. **Entity Count:** Result of `window.game.entities.length`
4. **Ship Position:** Result of ship x,y check
5. **Ship Velocity:** Result of ship vx,vy check

This will tell us exactly where the failure is occurring.
