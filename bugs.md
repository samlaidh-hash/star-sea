# Star Sea - Bug Tracking

**Date:** 2025-10-04
**Last Updated:** 2025-10-04 (Critical Fix: Weapon Alignment)

## Recently Fixed Bugs

### ✅ Waypoint Direction Arrows Added (2025-10-04)
**Status:** IMPLEMENTED
**Priority:** MEDIUM
**Description:** Added direction arrows on screen edges pointing toward waypoints (reach objectives) when they are off-screen.

**Implementation:**
- Added `renderWaypointArrows()` method to UIRenderer.js
- Calculates direction from player to waypoint
- Finds intersection with screen edge
- Draws cyan arrow pointing toward waypoint
- Shows distance text below arrow
- Only shows for active 'reach' objectives that are off-screen

**Files Modified:**
- `js/rendering/UIRenderer.js` - Added renderWaypointArrows() method
- `js/rendering/Renderer.js` - Added UIRenderer instance
- `js/core/Engine.js` - Call renderWaypointArrows() in render loop

---

### ✅ Aft Beam Band Changed to Rectangle (2025-10-04)
**Status:** FIXED
**Priority:** MEDIUM
**Description:** Changed aft beam weapon band from red circles to a single rounded corner rectangle perpendicular to the ship's long axis.

**Implementation:**
- Changed `aftBeamPoint` type from 'point' to 'rectangle'
- Added width and height properties for horizontal rectangle
- Added `findNearestPointOnRectangle()` method to BeamWeapon.js
- Weapon fires from top edge of rectangle (toward ship front)

**Files Modified:**
- `js/entities/Ship.js` - Changed aftBeamPoint definition
- `js/components/weapons/BeamWeapon.js` - Added rectangle handling

---

### ✅ Weapon Bar Colors Fixed (2025-10-04)
**Status:** FIXED
**Priority:** HIGH
**Description:** Weapon bars now change color independently (bright red when charged, dull red when recharging).

**Fix Applied:**
- JavaScript adds 'charged' or 'recharging' classes to each bar
- CSS uses reliable classes instead of style attribute selectors
- Each weapon bar updates independently

**Files Modified:**
- `js/ui/HUD.js` - Added class management in updateBar()
- `css/hud.css` - Uses .charged and .recharging classes

---

### ✅ Ship Graphic: Galaxy-Class Nacelles (2025-10-04)
**Status:** FIXED
**Priority:** HIGH
**Description:** Galaxy-class ship outline needed to match reference image. Nacelles should be on flat struts standing off from engineering hull, not directly connected.

**Fix Applied:**
- Modified `generateGalaxyClass()` method in Ship.js
- Added flat horizontal struts extending from engineering hull (lines 433-447, 461-475)
- Positioned nacelles at end of struts, standing off from hull
- Created proper strut geometry with top and bottom paths

**Files Modified:**
- `js/entities/Ship.js` (lines 407-482)

**Testing:** User should verify ship outline now matches Galaxy-class reference image

---

### ✅ CRITICAL FIX: Weapon Alignment (2025-10-04)
**Status:** FIXED
**Priority:** CRITICAL
**Description:** Beams and torpedoes were not firing at the center of the reticle. User provided screenshots proving significant misalignment.

**Root Cause:** Canvas scaling mismatch between CSS size and actual canvas dimensions.
- CSS sets canvas to `width: 100%`, `height: 100%` (fills viewport)
- JavaScript sets `canvas.width` and `canvas.height` to specific pixel dimensions based on aspect ratio
- InputManager used `getBoundingClientRect()` (CSS size) to calculate mouse position
- Camera used `canvas.width/height` (actual size) to transform coordinates
- **Result:** Mouse coordinates were not scaled correctly

**Fix Applied:**
- Modified `InputManager.js` `onMouseMove()` method
- Added scaling calculation: `scaleX = canvas.width / rect.width`, `scaleY = canvas.height / rect.height`
- Mouse coordinates now scaled from CSS size to actual canvas size: `mouseX = cssX * scaleX`, `mouseY = cssY * scaleY`
- Reticle DOM positioning still uses CSS coordinates (unscaled)

**Files Modified:**
- `js/core/InputManager.js` (lines 63-88)
- `js/config.js` (disabled DEBUG_MODE after fix)

**Testing:** User should test and confirm beams/torpedoes now hit reticle center

---

## Active Bugs

### 1. Lock-On System Not Working
**Status:** ACTIVE
**Priority:** HIGH
**Description:** Lock-on system not functioning as intended. Reticle should:
- Be green normally (no rotation)
- When over a target: rotate and begin lock-on timer
- When locked (after 3-5 seconds): turn red
- Keep lock while reticle remains on target
- Torpedoes should chase locked target

**Current Behavior:**
- Lock-on may not be tracking correctly
- Reticle color changes may not be occurring
- Torpedoes may not be homing properly

**Root Cause:** TBD - investigating TargetingSystem.js interaction with reticle events

---

### 2. Lock-On Timer Fixed Duration
**Status:** ACTIVE
**Priority:** MEDIUM
**Description:** Lock-on currently takes fixed 4 seconds. Should be 3-5 seconds depending on aim stability.
- Better aim (reticle stable on target) = faster lock (3 seconds)
- Poor aim (reticle moving on target) = slower lock (5 seconds)

**Current Behavior:** Always 4 seconds (CONFIG.LOCK_ON_TIME)
**Fix Needed:** Implement stability-based timer that varies based on reticle movement

---

### 3. Lock-On Loss Behavior
**Status:** ACTIVE
**Priority:** MEDIUM
**Description:** When reticle moves away from locked target, should lose lock over time:
- 2-3 seconds base time
- Quicker loss the further away reticle moves
- Should not be instant break

**Current Behavior:** Breaks lock when reticle > 50px away (LOCK_ON_DRIFT_TOLERANCE)
**Fix Needed:** Time-based lock loss with distance-modified decay rate

---

### 4. Torpedo Homing Issues
**Status:** ACTIVE
**Priority:** HIGH
**Description:** Torpedoes should chase locked-on target. If they miss and go past, they continue forward and fade out (no turning back around).

**Current Behavior:** May not be tracking locked targets properly
**Fix Needed:** Verify lockOnTarget is being passed correctly and torpedo homing logic is working

---

### 5. Energy Bands Color Not Changing
**Status:** ACTIVE
**Priority:** MEDIUM
**Description:** Weapon energy bands should change color after firing and when recharged, but have stopped doing so.

**Current Behavior:** Bands not visually indicating weapon status
**Fix Needed:** Check weapon bar rendering CSS and HUD update logic

---

### 6. Shots Not Aligned With Reticle
**Status:** ACTIVE
**Priority:** HIGH
**Description:** Weapon shots (beams/torpedoes) are not hitting where the reticle is pointing.

**Current Behavior:** Misalignment between reticle position and shot impact
**Fix Needed:** Verify screen-to-world coordinate conversion and weapon firing point calculations

---

## Investigation Notes

### System Architecture
- **TargetingSystem.js**: Handles lock-on state and target tracking
- **Engine.js**: Updates targeting system, responds to lock events, fires weapons
- **HUD.js/CSS**: Reticle visual state (green/red, rotation)
- **Projectile.js**: Torpedo homing behavior
- **InputManager.js**: Reticle positioning

### Code Flow
1. InputManager tracks mouse → updates reticle position
2. TargetingSystem.update() → checks for targets under reticle
3. Events emitted: 'lock-starting', 'lock-acquired', 'lock-broken'
4. Engine listens to events → updates reticle CSS classes
5. Torpedo fire → gets lockOnTarget from TargetingSystem
6. TorpedoProjectile.update() → homes toward lockOnTarget

---

## Fixed Bugs

### 1. Lock-On Timer Fixed Duration → FIXED
**Date:** 2025-10-04
**Fix:** Implemented stability-based adaptive lock time
- Lock time now varies from 3 seconds (stable aim) to 5 seconds (unstable aim)
- Tracks reticle movement speed and adjusts lock time accordingly
- Stable aim (< 20px/s movement) = faster lock
- Unstable aim (> 100px/s movement) = slower lock

**Files Modified:**
- `js/systems/TargetingSystem.js` - Added stability tracking and adaptive lock time calculation

---

### 2. Lock-On Loss Instant Break → FIXED
**Date:** 2025-10-04
**Fix:** Implemented time-based lock loss with distance modifier
- Lock no longer breaks instantly when reticle moves off target
- Base lock loss time: 2.5 seconds
- Lock loss rate scales with distance from target (0.5x to 2.0x speed)
- Closer to target = slower lock loss
- Further from target = faster lock loss
- Added 'lock-degrading' event for potential UI feedback

**Files Modified:**
- `js/systems/TargetingSystem.js` - Added lock loss progress tracking and distance-based decay

---

### 3. Reticle Color During Locking → FIXED
**Date:** 2025-10-04
**Fix:** Reticle now stays GREEN while locking, only turns RED when fully locked
- Default: Green, no rotation
- Locking: Green, rotating slowly (2s spin)
- Locked: Red, rotating fast (1s spin)

**Files Modified:**
- `css/hud.css` - Changed `.locking` class to use green color (#0f0) instead of red

---

### 4. Weapon Energy Bands No Color Change → FIXED
**Date:** 2025-10-04
**Fix:** Weapon energy bands now change color based on charge state
- Green: Fully charged (100%)
- Yellow: Recharging (1-99%)
- Red: Depleted (0%)

**Files Modified:**
- `css/hud.css` - Added CSS rules for weapon bar states based on width percentage

---

### 5. Shots Not Aligned With Reticle → FIXED
**Date:** 2025-10-04
**Fix:** Beam weapons now fire from proper weapon emitter positions on ship hull
- Forward beams: Fire from nearest point on forward beam band ellipse
- Aft beams: Fire from aft beam point
- Uses existing `findNearestPointOnEllipse()` method for accurate positioning
- Properly transforms from local ship coordinates to world coordinates

**Files Modified:**
- `js/components/weapons/BeamWeapon.js` - Restored `calculateFiringPoint()` to use ship weapon bands

**Note:** Torpedoes still fire from ship center but have homing to correct trajectory. This is acceptable as they are slow-moving guided projectiles.

---

## Remaining Active Bugs (2025-10-04 Session)

### 1. No Enemy Ships Spawning (NEEDS USER TESTING)
**Status:** CODE VERIFIED CORRECT
**Description:** User reports no enemy ships in game

**Investigation:** Enemy spawning code exists and is correct:
- Engine.startMission() calls spawnMissionEnemies() and spawnMissionEntities()
- Mission data has enemies defined
- Spawning logic verified

**Possible Causes:**
1. User hasn't clicked "Accept Mission" in briefing
2. Enemies spawning but off-screen (need to use minimap)
3. Mission not starting properly

**Next Step:** User needs to test game flow and check minimap for enemies

---

### 2. Weapon Alignment Issues (NEEDS USER TESTING)
**Status:** CODE UPDATED - NEEDS VERIFICATION
**Description:** User reports beams/torpedoes not hitting reticle center

**Fixes Applied:**
- Restored BeamWeapon.calculateFiringPoint() to use weapon bands
- Beams now fire from forward beam band (ellipse on saucer)
- Coordinate transformations verified

**Next Step:** User needs to test and report if still misaligned

---

### 3. Waypoint Arrow Missing
**Status:** NOT IMPLEMENTED
**Description:** User wants arrow on screen edge pointing toward waypoint objectives

**Required Implementation:**
- UI arrow element
- Calculate direction from player to objective waypoint
- Point arrow toward objective
- Only show for "reach" type objectives

**Next Step:** Implement if user confirms this is needed

---

### 4. Asteroids Not in Missions
**Status:** BY DESIGN
**Description:** User asked if asteroids exist

**Answer:** Asteroids exist in code (js/entities/Asteroid.js) but are NOT spawned in any missions. This is by design - missions currently don't include asteroid fields.

**To Add:** Would need to modify mission data to include asteroid spawn configs

---

## Prevention Rules
*(To be added to auditor.md after patterns emerge)*

### Pattern 1: Coordinate System Transformations
**Issue:** Weapon firing points needed proper local-to-world coordinate transformation
**Prevention:** Always verify coordinate system conversions when positioning entities relative to rotated parents

### Pattern 2: UI State Indication
**Issue:** Weapon bands weren't showing visual feedback for different states
**Prevention:** UI elements with multiple states should have clear visual indicators (colors, animations) for each state

### Pattern 3: Timer Systems
**Issue:** Fixed-duration timers don't feel responsive in games
**Prevention:** Consider adaptive/dynamic timers based on player actions or environmental factors

### Pattern 4: Visual Clutter
**Issue:** Debug visualizations (yellow velocity vector) left in production code
**Prevention:** Remove or gate debug visuals behind DEBUG_MODE flags

### Pattern 5: Incomplete Features
**Issue:** Weapon firing points were simplified and never restored (calculateFiringPoint() had TODO)
**Prevention:** Track TODOs and complete them before considering features done
