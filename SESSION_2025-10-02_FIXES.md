# Star Sea - Development Session 2025-10-02

## Issues Addressed

### 1. ✅ FIXED: Projectiles Hitting Invisible Obstacles
**Problem**: Beams and torpedoes were hitting something immediately adjacent to the ship

**Root Cause**: Projectiles spawned at the same location (ship center) and were colliding with each other since they were all added to the `entities` array.

**Solution**: Added check in collision detection to skip projectile-vs-projectile collisions
- File: `js/core/Engine.js:594`
- Added: `if (entity.type === 'projectile') continue;`

**Result**: Projectiles now travel freely without hitting each other

---

### 2. ✅ FIXED: W/S Thrust Not Working
**Problem**: Ship would not move forward/backward despite thrust being applied. Console showed force being applied but velocity stayed at 0.00.

**Root Cause**:
- Original code used `applyForceToCenter()` which requires physics step to integrate
- After applying force, code immediately read velocity (still 0) and reset it based on movement mode
- This created a cycle where velocity never actually changed

**Solution**: Changed to direct velocity modification
- File: `js/entities/Ship.js:541-560`
- NEWTONIAN mode: Read current velocity, add thrust vector, set new velocity
- NON_NEWTONIAN mode: Calculate speed in facing direction

**Result**: Ship now responds immediately to W/S input

---

### 3. ✅ FIXED: Weapon Targeting Angle Offset
**Problem**: Beams and torpedoes firing at ~80° offset from cursor position

**Root Cause**: Beam rendering was calculating visual angle incorrectly
- Used `Math.atan2(projectile.vy, projectile.vx)` but coordinate system is different
- Should use `Math.atan2(projectile.vx, -projectile.vy)` to match game's 0°=up coordinate system

**Solution**: Fixed angle calculation in beam rendering
- File: `js/rendering/Renderer.js:150-152`
- Changed angle calculation to match coordinate system
- Changed start position calculation to use sin/cos correctly

**Result**: Beams now fire towards cursor position

---

### 4. ✅ IMPLEMENTED: Enhanced Projectile Visuals

**Beams** (js/rendering/Renderer.js:146-178)
- Long 150px streaks (increased from 20px)
- Gradient fade from tail (transparent red) to head (bright white)
- 6px outer red glow
- 2px bright white core
- Smooth rounded line caps
- Duration increased from 0.1s to 0.7s for visibility (js/entities/Projectile.js:51)

**Torpedoes & Plasma** (js/rendering/Renderer.js:180-222)
- Sparkly particle effects - 8 randomized particles
- Glowing radial gradient core (8px radius)
- Particles vary in size (2-4px) with random offsets
- Alpha fading from bright (front) to transparent (tail)
- Orange/yellow sparkle colors for fire-like effect
- Bright white tip point

**Disruptors** (js/rendering/Renderer.js:224-267)
- WiFi logo-style expanding shockwaves
- 3 concentric arcs that expand as projectile travels
- Arc angle widens over time (spreads out)
- Outer arcs fade faster than inner arcs
- Magenta/purple color scheme with glow
- Central bright point that fades with age

---

### 5. ⏳ IN PROGRESS: Torpedo Firing Debug
**Problem**: Torpedoes not firing (user report)

**Actions Taken**:
- Added debug logging to `Ship.fireTorpedoes()` - js/entities/Ship.js:729-749
- Added debug logging to `TorpedoLauncher.fire()` - js/components/weapons/TorpedoLauncher.js:26-46
- Logs will show:
  - If weapons are disabled
  - Weapon count
  - Target angle
  - Lock-on status
  - Torpedo loaded/stored counts
  - Reason for fire failure (disabled, no hp, no ammo)

**Status**: Waiting for user console output to diagnose

---

### 6. ⏳ PENDING: Beam Charge Bar Not Visible
**Problem**: Beam recharge bar not showing in HUD

**Code Status**: Logic appears correct
- HUD calls `weapon.getChargePercentage()` ✅
- BeamWeapon implements method correctly ✅
- updateBar() sets CSS width ✅

**Next Steps**: Need to check CSS styling for `.weapon-bar .bar-fill`

---

### 7. ⏳ PENDING: Torpedo HUD Display Issues
**Problem**: Torpedo display looking odd (user report)

**Next Steps**: Need to inspect HUD layout and torpedo counter display

---

### 8. ⏳ PENDING: Ship Visual Improvement
**Problem**: Ship doesn't look like USS Enterprise from Star Trek

**Current Implementation**: js/entities/Ship.js `generateGalaxyClass()`
- Has saucer section, neck, engineering hull
- May need further refinement for better resemblance

**Next Steps**: Review and enhance ship vertices for more accurate Enterprise-D silhouette

---

## Files Modified This Session

1. **js/core/Engine.js**
   - Line 594: Skip projectile-vs-projectile collisions

2. **js/entities/Ship.js**
   - Lines 541-560: Fixed thrust to use direct velocity modification
   - Lines 604-621: Added debug logging for velocity tracking
   - Lines 700-708: Added debug logging for beam firing angles
   - Lines 729-749: Added debug logging for torpedo firing

3. **js/entities/Projectile.js**
   - Line 51: Increased beam lifetime from 0.1s to 0.7s

4. **js/rendering/Renderer.js**
   - Lines 143-270: Complete rewrite of `renderProjectile()` method
     - Enhanced beam visuals with long streaks and gradients
     - Added sparkly torpedo effects
     - Added WiFi-style disruptor waves

5. **js/components/weapons/TorpedoLauncher.js**
   - Lines 26-46: Added debug logging for torpedo fire attempts

6. **CLAUDE.md**
   - Added Playwright automated testing documentation

7. **test-game.js** (NEW)
   - Created automated Playwright test script for systematic game testing

8. **package.json** (NEW)
   - Initialized npm package with Playwright devDependency

---

## Testing Instructions

### Test W/S Movement
1. Start game, accept mission
2. Press and hold W for 2 seconds
3. Ship should accelerate forward
4. Console should show velocity increasing (if DEBUG_MODE enabled)

### Test Beam Targeting
1. Position cursor at various angles from ship
2. Left-click to fire beams
3. Console shows: shipPos, targetPos, shipRotation, targetAngle, angleDiff
4. Beams should fire directly towards cursor

### Test Torpedoes
1. Right-click to fire torpedoes
2. Check console for debug output:
   - "Fire Torpedoes" log with weaponCount and targetAngle
   - "Torpedo fired!" or "Torpedo cannot fire" with ammo counts

---

## Known Issues / Next Steps

1. **Torpedoes not firing** - Debug output added, awaiting user console logs
2. **Beam charge bar not visible** - Need CSS investigation
3. **Torpedo HUD display odd** - Need visual inspection
4. **Ship visual needs improvement** - Need better Enterprise-D resemblance
5. **Minimap distorted** - User reported, not yet investigated

---

## Debug Mode

Set `DEBUG_MODE: true` in `js/config.js` (already enabled)

Console outputs:
- Thrust application and velocity changes
- Weapon firing angles and positions
- Torpedo ammo status and fire attempts
- Force application details

---

## Automated Testing

Playwright test script created: `test-game.js`

**Setup:**
```bash
npm install --save-dev playwright
npx playwright install chromium
```

**Run:**
```bash
node test-game.js
```

**Captures:**
- Screenshots at each game state
- Automated input simulation (keyboard, mouse)
- HUD verification
- Visual regression testing capability

---

## Technical Notes

### Coordinate System
- 0° = Up (North)
- 90° = Right (East)
- 180° = Down (South)
- 270° = Left (West)
- Clockwise rotation

### Angle Conversions
- `angleBetween(x1, y1, x2, y2)`: Returns degrees
- `vectorFromAngle(angle, magnitude)`: Takes degrees, converts internally
- Returns: `{ x: Math.sin(rad) * mag, y: -Math.cos(rad) * mag }`

### Physics
- Ships use Planck.js physics with circular bodies
- Linear damping = 0 (no friction in space)
- Angular damping = 0 (free rotation)
- Direct velocity manipulation for responsive controls

---

## Session Summary

**Major Fixes:** 3 critical bugs resolved (projectile collision, thrust, weapon targeting)

**Enhancements:** 3 visual improvements (beams, torpedoes, disruptors), automated testing

**In Progress:** 4 issues being debugged (torpedoes, HUD displays, ship visual, minimap)

**Total Files Modified:** 8 files (5 code, 3 new/documentation)
