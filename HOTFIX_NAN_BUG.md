# HOTFIX: Ship NaN Position Bug

## Problem Identified
Ship position was NaN (Not a Number), breaking ALL game functionality:
- Ship can't move (NaN position)
- Nothing renders (can't draw at NaN coordinates)
- Weapons don't fire (NaN target positions)
- Physics broken (NaN velocity calculations)

## Root Cause
**Environmental entities** (Planets, Stars, Black Holes, Nebulas) were either:
1. Created with NaN positions, OR
2. Gravity calculations produced NaN forces that set ship velocity to NaN

## Temporary Fix Applied

### Disabled Environmental Entity Spawning
**File:** `js/core/Engine.js` lines 1104-1108
```javascript
// TEMPORARILY DISABLED TO FIX NaN BUG
// this.spawnPlanets();
// this.spawnStars(1);
// this.spawnBlackHoles(0.5, 1);
// this.spawnNebulas();
```

### Disabled Environmental Effects
**File:** `js/core/Engine.js` lines 1761-1764
```javascript
// TEMPORARILY DISABLED TO FIX NaN BUG
// this.applyEnvironmentalEffects(deltaTime);
```

## Testing Instructions

1. **Hard refresh the page** (Ctrl+Shift+R)
2. Start a new game
3. Test:
   - ✅ Ship should move with W/S keys
   - ✅ Enemies should be visible
   - ✅ Weapons should fire and be visible
   - ✅ Game should run smoothly

## If Game Works Now

The problem WAS environmental entities. Next steps:
1. Debug Planet.js, Star.js, BlackHole.js, Nebula.js constructors
2. Find which one creates entities with NaN x/y
3. Fix the constructor
4. Re-enable entities one by one

## Debugging Next Session

### Enable entities one at a time:

```javascript
// Test 1: Enable only planets
this.spawnPlanets();

// If that works, test 2: Add stars
this.spawnStars(1);

// If that works, test 3: Add black holes
this.spawnBlackHoles(0.5, 1);

// If that works, test 4: Add nebulas
this.spawnNebulas();
```

### Check entity constructors for NaN:

**Common causes:**
1. Math.cos(undefined) = NaN
2. Division by zero = Infinity or NaN
3. Math.sqrt(negative) = NaN
4. Accessing undefined properties in calculations

### Likely culprits:

**Nebula.js** - Complex constructor with many CONFIG properties
**BlackHole.js** - Math-heavy gravity calculations
**Planet.js** - Random position calculations might produce NaN

## Safety Checks Added

Added NaN validation in `applyEnvironmentalEffects()`:
- Checks deltaTime validity
- Checks entity positions before processing
- Checks gravity calculation results
- Resets velocity to 0 if NaN detected
- Logs errors for debugging

## Permanent Fix (TODO)

Once we find the culprit:
1. Fix the environmental entity constructor
2. Add position validation to Entity base class
3. Add Math utility function: `isValidNumber(n) => !isNaN(n) && isFinite(n)`
4. Use validation in all position calculations
5. Re-enable environmental entities
6. Re-enable environmental effects

## Status

**Current:** Environmental entities DISABLED, game should work
**Next:** Find which entity creates NaN, fix it, re-enable
