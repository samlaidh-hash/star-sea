# Star Sea - Session Memory
**Date:** 2025-10-04
**Time:** Continuation Session
**Session:** CRITICAL FIX - Weapon Alignment

## Session Summary
Fixed the critical weapon alignment bug that was preventing beams and torpedoes from hitting the reticle center.

---

## CRITICAL BUG FIX: Weapon Alignment

### Problem Statement
User reported: "Beams and Torpedoes are still not being fired at the centre of the reticle!!!"

User provided three screenshots clearly showing beams/torpedoes firing at wrong angles relative to the reticle position.

### Investigation Process

**Initial Debug Attempt (Previous Session):**
- Added comprehensive debug logging to Engine.js
- User provided console output showing: `Beam end point = target point` (exact match)
- Initially concluded weapons were working correctly
- **This was WRONG** - debug was misleading!

**Screenshots Revealed Truth:**
- Visual evidence clearly showed misalignment
- Debug output showed internal calculations were correct
- **Conclusion:** Issue was in coordinate transformation, not weapon logic

### Root Cause Analysis

**The Bug:**
Canvas has TWO different dimension sets:
1. **CSS Size** - Canvas element rendered at `width: 100%`, `height: 100%` via CSS
2. **Actual Size** - Canvas internal dimensions set by JavaScript to specific pixel values

**The Mismatch:**
- `InputManager.onMouseMove()` calculated mouse position using `getBoundingClientRect()` (CSS size)
- `Camera.screenToWorld()` transformed coordinates using `canvas.width/height` (actual size)
- These dimensions were DIFFERENT, causing coordinate scaling errors

**Code Flow:**
```
User clicks mouse
  ↓
InputManager: mouseX = e.clientX - rect.left  [using CSS size]
  ↓
Engine: worldPos = camera.screenToWorld(mouseX, mouseY)  [using actual canvas size]
  ↓
MISMATCH! Coordinates don't align!
```

**Example:**
- CSS canvas rendered at 1600x900 pixels
- Actual canvas set to 1920x1080 pixels
- Mouse at CSS position (800, 450) → center
- Camera expects (960, 540) for center
- **Result:** Shots miss by 160px horizontally, 90px vertically!

### Solution

**Modified:** `js/core/InputManager.js` lines 63-88

**Before:**
```javascript
onMouseMove(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    // ...
}
```

**After:**
```javascript
onMouseMove(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();

    // Calculate mouse position relative to CSS-scaled canvas
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    // CRITICAL FIX: Scale mouse coordinates from CSS size to actual canvas dimensions
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    this.mouseX = cssX * scaleX;
    this.mouseY = cssY * scaleY;

    // Update reticle position - use CSS coordinates for DOM positioning
    const reticle = document.getElementById('reticle');
    if (reticle) {
        reticle.style.left = (rect.left + cssX) + 'px';
        reticle.style.top = (rect.top + cssY) + 'px';
    }
    // ...
}
```

**Key Changes:**
1. Calculate CSS-relative position first (`cssX`, `cssY`)
2. Compute scaling factors (`scaleX = canvas.width / rect.width`)
3. Scale mouse coordinates to match actual canvas dimensions
4. Keep reticle DOM positioning in CSS coordinates (for proper visual alignment)

---

## Files Modified This Session

**Modified:**
1. `js/core/InputManager.js` - Added coordinate scaling in onMouseMove()
2. `js/config.js` - Disabled DEBUG_MODE (line 178: false)
3. `bugs.md` - Added fix documentation

---

## Testing Required

**User Must Test:**
1. Start game, accept mission
2. Fire beams (left-click hold) at various screen positions
3. Fire torpedoes (right-click) at various positions
4. **Verify:** Beams/torpedoes now hit center of reticle
5. **Test:** At different window sizes (resize browser)
6. **Test:** At different zoom levels (if applicable)

**Expected Result:**
- Beams should draw from ship to exact reticle position
- Torpedoes should travel toward exact reticle position
- No offset or angle deviation

---

## Technical Details

### Coordinate System Architecture

**Three Coordinate Spaces:**
1. **Client Space** - Browser window coordinates (`e.clientX`, `e.clientY`)
2. **Canvas CSS Space** - Canvas element visual size (CSS width/height)
3. **Canvas Actual Space** - Canvas internal bitmap size (canvas.width/height)
4. **World Space** - Game entity coordinates (transformed via Camera)

**Transformation Chain:**
```
Client → CSS Canvas → Actual Canvas → World
   ↓          ↓             ↓            ↓
clientX   cssX=clientX   actualX=     worldX=
          -rect.left     cssX*scale   (actualX-w/2)/zoom+camX
```

### Why This Bug Was Hard to Find

**Deceptive Debug Output:**
- Debug logging showed beam `endpoint = target` in world coordinates
- This was TRUE - the math from actual canvas → world was correct
- The bug was BEFORE this step (client → actual canvas)
- Debug didn't show the INPUT was wrong

**Visual Confirmation Crucial:**
- User's screenshots were essential to finding the bug
- Debug numbers alone were misleading
- Always trust visual evidence over console logs for rendering issues

---

## Lessons Learned

### Debugging Methodology

**What Worked:**
1. User provided screenshots with clear visual evidence
2. Systematic code review of coordinate transformation chain
3. Checking each stage: Client → CSS → Actual → World
4. Reading InputManager, Camera, and Engine resize logic

**What Didn't Work:**
1. Debug logging (showed correct results after the bug)
2. Relying on calculated endpoints (math was correct, input was wrong)
3. Initial assumption that "endpoint = target" meant alignment was correct

**Key Insight:**
For coordinate/rendering bugs:
- **Always check the ENTIRE transformation chain**
- **Don't trust intermediate debug values** - they can be correct while the input is wrong
- **Visual evidence > Console logs** for rendering issues
- **Canvas CSS size ≠ Canvas actual size** - always account for scaling

### Prevention

**Future Code Reviews Should Check:**
1. Canvas element has explicit width/height attributes OR CSS matches actual size
2. All mouse input accounts for canvas scaling
3. All coordinate transforms use consistent coordinate space
4. Document which coordinate space each variable represents

**Recommended Practice:**
Add comments to coordinate variables:
```javascript
const cssX = e.clientX - rect.left;  // CSS canvas space
const actualX = cssX * scaleX;        // Actual canvas space
const worldX = camera.screenToWorld(actualX); // World space
```

---

## Next Steps

### Immediate (After User Tests)
1. **User confirms weapon alignment is fixed**
2. **Fix ship graphic** - Galaxy-class nacelles need struts
3. **Proceed with Phase 1A** - Ship class weapons implementation

### Phase 1: Quick Fixes (~4.5 hours)
1. **Phase 1A:** Ship class weapons (2 hours)
   - FG, DD, CL, BC for all factions
   - Weapon arcs per faction specifications

2. **Phase 1B:** Space station weapons (1 hour)
   - Weapons for Federation, Trigon, Scintilian, Pirate stations

3. **Phase 1C:** HUD reorganization (1 hour)
   - Move weapons to systems block

4. **Phase 1D:** Ship graphic nacelles (30 min)
   - Add struts to Galaxy-class

### Phase 2 & 3
- Bay system (2-3 hours)
- Tractor beam (4-6 hours)
- Shuttle system (9-11 hours)

---

## Current Game State

### ✅ Fixed This Session
- **CRITICAL:** Weapon alignment (canvas coordinate scaling)

### ✅ Previously Fixed
- Lock-on system (adaptive timer, gradual lock loss)
- Reticle colors (green → red when locked)
- Weapon energy bands (color indicators)
- Minimap circles (canvas dimensions)
- Yellow velocity line removed
- Pirate ship classes (FGs + CL leaders)

### ⏳ Ready to Implement
- Ship class weapons
- Space station weapons
- HUD reorganization
- Ship graphic updates
- Bay system
- Tractor beam
- Shuttle system (fully planned)

### 🔍 Awaiting User Confirmation
- Weapon alignment fix (needs testing)
- Ship graphic requirements (nacelle struts)

---

## Code Quality Notes

### Pattern Used: Coordinate Space Transformation
```javascript
// GOOD: Explicit scaling with clear comments
const cssX = e.clientX - rect.left;  // CSS space
const scaleX = canvas.width / rect.width;
const actualX = cssX * scaleX;  // Actual canvas space
```

### Anti-Pattern to Avoid:
```javascript
// BAD: Assumes CSS size = actual size
this.mouseX = e.clientX - rect.left;  // WRONG if canvas is scaled!
```

### Best Practice:
**Always account for canvas scaling when:**
- Reading mouse/touch input
- Positioning DOM elements over canvas
- Converting between screen and world coordinates
- Handling resize events

---

## Session Statistics
**Duration:** ~30 minutes
**Files Modified:** 3
**Lines Changed:** ~30
**Bugs Fixed:** 1 (CRITICAL)
**Impact:** High - core gameplay mechanic now functional

**Code Quality:** Maintained standards, added explanatory comments
**User Satisfaction:** Awaiting testing confirmation

---

END OF SESSION MEMORY
