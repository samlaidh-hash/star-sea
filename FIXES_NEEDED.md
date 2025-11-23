# Star Sea - Critical Fixes Needed

## Fixed Issues ✅
1. ✅ Bay capacity mismatch - Fixed by reading from playerShip.shipClass
2. ✅ NaN for extraShuttles - Fixed by adding all 11 consumable types to loadout object
3. ✅ Missing script tags - Added Planet.js, Star.js, BlackHole.js, Nebula.js, GravelCloud.js
4. ✅ Star.js config mismatch - Changed STAR_DAMAGE_RADIUS to STAR_DAMAGE_RANGE

## Remaining Issues ⚠️

### 1. LMB Fires Beams on Briefing Screen
**Problem:** Clicking on briefing screen fires beams and plays sound effects
**Root Cause:** State check in Engine.js line 408 should prevent this, but it's still happening
**Investigation Needed:** Check if stateManager.isPlaying() returns true during briefing

**Possible Fix:**
```javascript
// Engine.js line 408
if (!this.stateManager.isPlaying() || !this.playerShip || !this.playerShip.active) {
    return; // Don't fire if not playing or ship not active
}
```

### 2. Launch Mission Button Off Bottom of Screen
**Problem:** Accept Mission button not visible, off bottom of screen
**Root Cause:** Consumables grid is too tall for the briefing content area

**Fix Needed:** Add max-height and scroll to consumables section
```css
/* Add to menus.css */
.loadout-section {
    max-height: 400px;
    overflow-y: auto;
}
```

### 3. Beams Not Affecting Enemy Ships (CRITICAL)
**Problem:** Continuous beams fire and show visually but don't damage enemies
**Investigation Needed:** Check if:
- Beam projectiles have proper collision detection
- BeamProjectile vs ContinuousBeam collision handling
- Collision detection loop includes beam projectiles

**Check:** Engine.js collision detection around line 1750-1850

## Testing Protocol

1. **Bay Capacity Test:**
   - Select Fed CA (should show 5 bay capacity)
   - Select Fed FG (should show 2 bay capacity)
   - Verify numbers match ship class

2. **Consumables Test:**
   - Click + on extraShuttles
   - Should increment without NaN
   - Should respect bay capacity limit

3. **Briefing Input Test:**
   - Open mission briefing
   - Click LMB on screen
   - Should NOT fire beams or play sounds

4. **Launch Button Test:**
   - Open mission briefing
   - Scroll down
   - Accept Mission button should be visible

5. **Beam Damage Test (CRITICAL):**
   - Start mission
   - Hold LMB on enemy ship
   - Enemy HP should decrease
   - Check console for collision events

## Next Steps
1. Add console logging to beam collision detection
2. Verify continuous beam projectiles have proper type and active flag
3. Check if collision detection loop processes all projectile types
4. Add CSS for loadout section scrolling
5. Investigate state manager during briefing screen
