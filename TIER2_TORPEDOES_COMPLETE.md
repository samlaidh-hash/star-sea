# TIER 2 Torpedo Improvements - COMPLETE

## Summary

Successfully implemented Issues #4 and #5 from COMPREHENSIVE_PLAN_20251027.md:
- Torpedo speeds increased by 50%
- Torpedo storage tripled to 48
- Top-off reload system implemented (1 torpedo per 5 seconds)
- Spawn offset verified (prevents sticking)
- Homing logic verified (works with lock-on)

## Changes Made

### 1. Speed Increases
**File:** `js/config.js`
- TORPEDO_SPEED_CA: 325 → 487 (+50%)
- PLASMA_SPEED_CA: 217 → 326 (+50%)
- DISRUPTOR_SPEED: 650 → 975 (+50%)

### 2. Storage Increase
**File:** `js/config.js`
- TORPEDO_STORED: 16 → 48 (tripled)
- Total capacity: 52 torpedoes (48 stored + 4 loaded)

### 3. Top-Off Reload System
**Files:**
- `js/components/weapons/TorpedoLauncher.js`
- `js/components/weapons/DualTorpedoLauncher.js`

**Old Behavior:**
- Reload timer started only when loaded == 0
- Reloaded all 4 torpedoes at once after 5 seconds

**New Behavior:**
- Reload timer starts after firing any torpedo
- Reloads ONE torpedo every 5 seconds
- Continues automatically until loaded == 4 or storage empty
- Example: Fire all 4 → wait 20 seconds → all 4 reloaded

### 4. Verified Existing Features
- Spawn offset already implemented (150% of ship size forward)
- Homing logic already implemented (gentle turn toward locked target)
- All weapon classes use CONFIG constants correctly
- Speed changes propagate through entire system

## Testing Checklist for User

### Basic Functionality
- [ ] Torpedoes don't stick to ship when fired
- [ ] Torpedoes appear visibly faster (50% increase)
- [ ] HUD shows 48 torpedoes in storage
- [ ] Can fire 52 total torpedoes (48 + 4)

### Reload System
- [ ] Fire 1 torpedo → wait 5 sec → reloads to 4/47
- [ ] Fire all 4 → wait 20 sec → reloads to 4/44
- [ ] Fire 2 → wait 10 sec → reloads to 4/46
- [ ] Reload happens automatically without input

### Homing
- [ ] Lock onto enemy (red reticle)
- [ ] Fire torpedo → curves toward target
- [ ] No impossible 180° turns
- [ ] If misses, continues forward (doesn't turn back)

## Dependencies

⚠️ **Physics must be enabled** for torpedoes to work properly:
- Check `CONFIG.DISABLE_PHYSICS` in `js/config.js` (line 22)
- If `true`, torpedoes may still stick to ship
- TIER 1 Issue #1 must be completed first

## Files Modified

1. `js/config.js` - Speed and storage constants
2. `js/components/weapons/TorpedoLauncher.js` - Reload logic
3. `js/components/weapons/DualTorpedoLauncher.js` - Reload logic

## Next Steps

1. User must test all functionality in browser
2. If tests pass → Mark Issues #4 and #5 complete
3. If tests fail → Debug specific failures
4. Move to TIER 2 Issue #6 (Beam Collision Verification)

## Implementation Notes

- Code deletion rule followed (old code removed, not commented)
- Both TorpedoLauncher and DualTorpedoLauncher updated identically
- All weapon classes use CONFIG constants (no hardcoded speeds)
- Changes propagate through entire torpedo system automatically

**Status:** READY FOR USER TESTING
**Date:** 2025-10-27
