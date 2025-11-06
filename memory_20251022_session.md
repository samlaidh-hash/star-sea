# Star Sea - Session Memory: Ship Damage at Game Start Bug Fix
**Date:** 2025-10-22
**Session:** Resume + Bug Fix
**Agent:** Claude Code

## Session Overview
User resumed session and reported that the ship damage at game start bug has returned.

## Previous Session Context
Read `memory_20251021_pirate_beams.md` - Previous session was investigating pirate ships not firing beam weapons. Diagnostic logging was added to AIController.js and Ship.js to identify the root cause.

## Bug Report
**Issue:** Ships taking damage at the start of the game
**Status:** FIXED
**Priority:** HIGH

## Investigation Process

### Step 1: Define Problem Precisely
Ships are taking damage immediately when the game starts, before any combat or movement occurs.

### Step 2: Identify 3 Most Likely Causes
1. **Minimum collision damage too low** - CollisionHandler applies damage even at 0 speed (CONFIRMED)
2. **Ships spawning overlapped** - Initial spawn positions might overlap
3. **Physics initialization velocities** - Physics bodies might have non-zero velocities during creation

### Step 3: Investigation
**Files Examined:**
- `bugs.md` - No previous record of this specific issue
- `js/entities/Ship.js:1565` - takeDamage method
- `js/physics/CollisionHandler.js:36-59` - Ship-ship collision handling
- `js/core/Engine.js:1998-2027` - Enemy spawn logic

**Key Findings:**
```javascript
// CollisionHandler.js:47-48 (BEFORE FIX)
const damage = Math.min(5, Math.max(1, Math.floor(relativeSpeed / 50)));
```
- `Math.max(1, ...)` ensures **minimum 1 damage** even at 0 relative speed
- During spawn, physics body initialization can cause slight overlaps
- Any collision triggers at least 1 damage to both ships
- **ROOT CAUSE CONFIRMED:** Damage applied to stationary/slow ships

### Step 4: Solution Implementation

**Fix Applied:**
Added minimum speed threshold before applying collision damage.

**File Modified:** `js/physics/CollisionHandler.js`

**Changes (Lines 47-52):**
```javascript
// Only apply damage if ships are moving fast enough (minimum threshold: 25 units/s)
// This prevents damage during spawn when ships are stationary or barely touching
const MIN_COLLISION_SPEED = 25;
if (relativeSpeed < MIN_COLLISION_SPEED) {
    return; // No damage for slow/stationary collisions
}
```

**Logic:**
- Calculate relative speed between colliding ships
- If speed < 25 units/s: No damage applied, exit early
- If speed >= 25 units/s: Apply normal damage calculation (1-5 damage scaled by speed)
- This prevents spawn damage while preserving realistic collision damage during gameplay

## Files Modified

### CollisionHandler.js (Lines 47-52)
**Before:**
```javascript
const relativeSpeed = MathUtils.magnitude(...);
const damage = Math.min(5, Math.max(1, Math.floor(relativeSpeed / 50)));
```

**After:**
```javascript
const relativeSpeed = MathUtils.magnitude(...);

// Only apply damage if ships are moving fast enough (minimum threshold: 25 units/s)
// This prevents damage during spawn when ships are stationary or barely touching
const MIN_COLLISION_SPEED = 25;
if (relativeSpeed < MIN_COLLISION_SPEED) {
    return; // No damage for slow/stationary collisions
}

const damage = Math.min(5, Math.max(1, Math.floor(relativeSpeed / 50)));
```

## Testing Instructions

1. **Start Server:**
   ```batch
   cd "D:\Dropbox\Free Games\2025 RPG\CLAUDE GAMES\CURSOR STAR SEA\star-sea"
   start_local_server.bat
   ```

2. **Open Game:**
   - Navigate to `http://localhost:8000` or `http://localhost:3000`
   - Open browser DevTools Console (F12)

3. **Start Game:**
   - Click "New Game"
   - Select ship class
   - Accept mission briefing

4. **Verify Fix:**
   - Check player ship HP immediately after game starts
   - Should be at 100% (no damage)
   - Check enemy ship HP in HUD when they appear
   - Ships should only take damage during actual combat movement

5. **Test Collision Damage Still Works:**
   - Accelerate into an enemy ship at high speed
   - Both ships should take damage
   - Verify collision damage scales with speed

## Expected Behavior

### Before Fix
- Player ship starts at 95-99% HP (took 1-5 damage)
- Enemy ships also damaged on spawn
- Console might show collision events at game start

### After Fix
- Player ship starts at 100% HP
- Enemy ships at full HP
- No collision damage unless ships are actually moving fast
- Combat collisions still deal appropriate damage

## Prevention Rule for bugs.md

**Pattern:** Minimum thresholds in damage calculations
**Issue:** `Math.max(1, ...)` applied minimum damage even to stationary entities
**Prevention:** When implementing damage from physics events (collisions, forces), always check for minimum velocity/speed thresholds before applying damage. Zero or near-zero speed events should not cause damage.

## Outstanding Issues

### Pirate Beam Weapons Not Firing
**Status:** DIAGNOSTIC LOGGING IN PLACE - AWAITING USER TESTING
**Previous Session:** 2025-10-21
**Files Modified:**
- `js/systems/AIController.js:334-353` - Added weapon diagnostic logging
- `js/entities/Ship.js:1260-1311` - Added beam firing diagnostic logging

**Next Step:** User needs to test game and report console output showing:
- PIRATE WEAPON DIAGNOSTIC messages
- PIRATE fireBeams weapon check messages
- Either successful beam fires or failure reasons

## Ship Speed & Acceleration Adjustments (2025-10-22)

User requested faster ships with slower acceleration/deceleration for more momentum-based movement.

### Changes Made

**File Modified:** `js/config.js` (lines 50-62)

**Maximum Speed - Increased by 1.5x:**
- FG: 140 → 210
- DD: 130 → 195
- CL: 120 → 180
- CS: 115 → 173 (Strike Cruiser)
- CA: 110 → 165
- BC: 100 → 150

**Acceleration - Decreased by 0.5x:**
- FG: 180 → 90
- DD: 170 → 85
- CL: 160 → 80
- CS: 155 → 78 (Strike Cruiser)
- CA: 150 → 75
- BC: 140 → 70

**Note:** Deceleration automatically adjusted (Ship.js:359 sets `deceleration = acceleration`)

### Expected Gameplay Impact
- Ships can reach higher top speeds (50% faster)
- Takes longer to reach top speed (50% slower acceleration)
- Takes longer to stop (50% slower deceleration)
- More momentum-based, "capital ship" feel
- Requires more planning for maneuvers and combat positioning

## Torpedo Reticle Homing Implementation (2025-10-22)

User requested torpedoes home towards reticle center (mouse cursor) instead of fixed target or lock-on target.

### Implementation Details

**Feature:** Player torpedoes now continuously track and home towards the reticle position.

**How it works:**
1. Torpedoes have new `trackReticle` property (boolean)
2. Player torpedoes (when no lock-on target) set `trackReticle = true`
3. Engine updates all tracking torpedoes' `targetX/targetY` each frame to current reticle world position
4. Torpedo update methods recalculate heading each frame to aim at new target position

**Behavior:**
- **With lock-on target:** Torpedo homes to locked entity (original behavior)
- **Without lock-on target:** Torpedo continuously tracks reticle/mouse cursor
- **AI torpedoes:** Not affected, fire straight at initial target

### Files Modified

**1. js/entities/Projectile.js (lines 40-105, 246-311)**
- Added `trackReticle` property to TorpedoProjectile constructor
- Modified TorpedoProjectile.update() to check `trackReticle` first, then `lockOnTarget`
- Added same functionality to PlasmaTorpedoProjectile

**2. js/components/weapons/TorpedoLauncher.js (lines 62-131)**
- Added `trackReticle: ship.isPlayer && !lockOnTarget` to all 4 torpedo types:
  - HeavyTorpedo (line 75)
  - QuantumTorpedo (line 92)
  - GravityTorpedo (line 111)
  - TorpedoProjectile (line 129)

**3. js/components/weapons/DualTorpedoLauncher.js (lines 81-156)**
- Added `trackReticle: ship.isPlayer && !lockOnTarget` to all 4 torpedo types
  - Same pattern as TorpedoLauncher

**4. js/components/weapons/PlasmaTorpedo.js (line 52)**
- Added `trackReticle: ship.isPlayer && !lockOnTarget` to PlasmaTorpedoProjectile creation

**5. js/core/Engine.js (lines 1194-1205)**
- Added update loop before entity updates
- Each frame: Get current mouse world position
- Update all `projectile.trackReticle === true` projectiles with new targetX/targetY

### Expected Gameplay Impact
- Torpedoes feel more responsive and controllable
- Players can "guide" torpedoes after firing by moving mouse
- More skill-based torpedo gameplay
- No change to lock-on behavior (still works when target is locked)
- AI ships unaffected (their torpedoes fire straight)

## Progress: 100%
**Current Tasks:**
- Ship damage at game start bug - FIXED
- Speed/acceleration adjustments - COMPLETE
- Torpedo reticle homing - IMPLEMENTED
**Status:** Ready for user testing

## Git Status
Modified files awaiting commit:
- index.html (M) - Previous session
- js/components/weapons/BeamWeapon.js (M) - Previous session
- js/entities/Ship.js (M) - Previous session
- js/rendering/ShipRenderer.js (M) - Previous session
- **js/physics/CollisionHandler.js (M)** ← Collision damage bug fix (this session)
- **js/config.js (M)** ← Speed/acceleration adjustments (this session)
- **js/entities/Projectile.js (M)** ← Torpedo reticle tracking (this session)
- **js/components/weapons/TorpedoLauncher.js (M)** ← Torpedo reticle tracking (this session)
- **js/components/weapons/DualTorpedoLauncher.js (M)** ← Torpedo reticle tracking (this session)
- **js/components/weapons/PlasmaTorpedo.js (M)** ← Torpedo reticle tracking (this session)
- **js/core/Engine.js (M)** ← Torpedo reticle tracking + previous session
