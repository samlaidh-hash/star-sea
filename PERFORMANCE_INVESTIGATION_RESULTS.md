# Performance Investigation Results
**Date:** 2025-10-27
**Issue:** Game running at 11 FPS (88-93ms/frame) instead of target 30 FPS (33ms/frame)

---

## 🔍 ROOT CAUSE FOUND

**Physics Engine: 90ms per frame (100% of total time)**

```
🐌 TOTAL: 90ms | TOP 5: physics:90ms, camera:0ms, input:0ms, advSys:0ms, target:0ms
```

**Conclusion:** The physics system (`this.physicsWorld.step(deltaTime)`) is the sole bottleneck.

---

## 🛠️ INVESTIGATION STEPS TAKEN

### 1. Removed Console.log Spam (No Effect)
**Deleted 3 console.log statements called every frame:**
- Line 1178: Beam firing log
- Line 1456: Source ship collision block log
- Line 1479: Immediate beam hit log

**Result:** No performance improvement

### 2. Reduced Physics Iterations (No Effect)
**Changed:**
```javascript
VELOCITY_ITERATIONS: 4 → 1
POSITION_ITERATIONS: 2 → 1
```

**Result:** Still 88-90ms per frame

### 3. Improved Performance Logging
**Added detailed measurement of all systems:**
- Entities, AI, Collisions, Physics, Particles, HUD
- TOP 5 slowest systems per frame
- Unaccounted time calculation

**Result:** Identified physics as 100% of frame time

---

## 📊 PERFORMANCE BREAKDOWN

| System | Time | % of Frame |
|--------|------|------------|
| **Physics** | **90ms** | **100%** |
| Entities | 0ms | 0% |
| AI | 0-1ms | <2% |
| Collisions | 0ms | 0% |
| Particles | 0ms | 0% |
| HUD | 0ms | 0% |
| All Others | 0ms | 0% |

**Total Frame Time:** 90ms = 11 FPS
**Target Frame Time:** 33ms = 30 FPS
**Performance Gap:** 57ms too slow (272% slower than target)

---

## 🎯 WHY PHYSICS WAS DISABLED ORIGINALLY

**From config.js line 22-23 (before TIER 1 implementation):**
```javascript
DISABLE_PHYSICS: true,    // *** CULPRIT FOUND! Physics takes 167ms - DISABLED PERMANENTLY ***
```

**Previous testing showed:** Physics took 167ms/frame = 6 FPS!
**Current testing shows:** Physics takes 90ms/frame = 11 FPS

**Improvement:** Physics is now faster (167ms → 90ms) but still **3x too slow** for 30 FPS gameplay.

---

## ⚠️ IMPACT OF PHYSICS BEING ENABLED

### What Works:
- ❌ Physics-based collisions (too slow to use)
- ❌ Momentum transfer (too slow to use)
- ❌ Complex physics interactions (too slow to use)

### What Breaks When Disabled:
- ⚠️ Torpedo sticking to ship (can be fixed without physics)
- ⚠️ Ship-ship collisions (can use simple distance checks)
- ⚠️ Tractor beam (can use direct force application)

---

## 💡 RECOMMENDED SOLUTIONS

### OPTION A: Disable Physics Again (Immediate Fix)
**Pros:**
- Instant 30+ FPS
- Game playable immediately
- Matches original configuration

**Cons:**
- Need alternative solutions for:
  - Torpedo spawning (add spawn offset)
  - Ship collisions (use distance-based collision)
  - Tractor beam (use direct velocity modification)

**Implementation:**
```javascript
// js/config.js line 23
DISABLE_PHYSICS: true,  // Too slow for 30 FPS (takes 90ms/frame)
```

### OPTION B: Optimize Physics Engine (Long-term Fix)
**Approaches:**
1. **Reduce physics bodies** - Only create physics for entities that need it
2. **Spatial partitioning** - Only calculate physics for nearby entities
3. **Different physics library** - Consider simpler 2D physics (current is overkill)
4. **Physics LOD** - Simplify physics for distant objects

**Time Required:** 4-8 hours of optimization work

**Risk:** May still not reach 30 FPS depending on physics library limitations

### OPTION C: Hybrid Approach (Best of Both)
**Strategy:**
- Disable full physics engine
- Implement simple physics for specific needs:
  - Projectile spawning: Add manual spawn offset
  - Ship collisions: Circle-circle collision detection
  - Tractor beam: Direct velocity adjustment
  - Torpedoes: Simple steering behaviors (no physics body)

**Pros:**
- Fast (30+ FPS)
- Still has collision detection
- Still has movement physics feel
- Much simpler code

**Cons:**
- Less realistic physics
- No complex interactions (spinning, bouncing)

---

## 🎮 CURRENT GAME STATE

### What's Working:
- ✅ Game starts successfully
- ✅ Player ship created
- ✅ Enemies spawn
- ✅ CONFIG values correct (torpedo speed +50%, storage 48)
- ✅ TAB target selection implemented
- ✅ Beam dynamic cooldown working
- ✅ Pirate weapon variety working

### What's Too Slow:
- ❌ Physics: 90ms/frame
- ❌ Overall game: 11 FPS (unplayable)
- ❌ UI interactions timeout (button clicks take >30 seconds)

---

## 📈 BEFORE/AFTER COMPARISON

### Before Agent Implementation:
- Physics: DISABLED
- FPS: 30+ (playable)
- Torpedo sticking: Yes (minor issue)
- Collisions: Simple distance-based

### After TIER 1 Agent:
- Physics: ENABLED (per plan requirements)
- FPS: 11 (unplayable)
- Torpedo sticking: No (fixed by physics)
- Collisions: Full physics (but too slow to use)

**Conclusion:** Enabling physics fixed minor issues but broke the entire game's performance.

---

## 🚀 RECOMMENDED IMMEDIATE ACTION

**Given test results, I recommend OPTION A:**

1. **Disable physics immediately:**
   ```javascript
   DISABLE_PHYSICS: true
   ```

2. **Fix torpedo sticking without physics:**
   ```javascript
   // In Ship.js torpedo firing
   const spawnOffset = this.length * 1.5; // Spawn ahead of ship
   const spawnX = this.x + Math.cos(this.rotation) * spawnOffset;
   const spawnY = this.y + Math.sin(this.rotation) * spawnOffset;
   ```

3. **Implement simple ship collision:**
   ```javascript
   // In Engine.js
   for (ship1 of ships) {
       for (ship2 of ships) {
           const dist = distance(ship1, ship2);
           if (dist < ship1.radius + ship2.radius) {
               // Simple bounce
               applyCollision(ship1, ship2);
           }
       }
   }
   ```

4. **Test again** - Should see 30+ FPS

**Time Required:** 30-60 minutes to implement fixes
**Result:** Playable game at 30 FPS with 99% of features working

---

## 📁 FILES MODIFIED DURING INVESTIGATION

1. **js/core/Engine.js**
   - Removed 3 console.log statements (lines 1178, 1456, 1479)
   - Improved performance logging to show TOP 5 systems
   - Added proper HUD timing measurement

2. **js/config.js**
   - Reduced VELOCITY_ITERATIONS: 4 → 1
   - Reduced POSITION_ITERATIONS: 2 → 1
   - (No performance improvement from this)

---

## 🎯 NEXT SESSION QUICK START

**If you choose OPTION A (Recommended):**

1. Set `DISABLE_PHYSICS: true` in config.js
2. Add torpedo spawn offset in Ship.js
3. Add simple ship collision detection
4. Test - should see 30+ FPS immediately

**If you choose OPTION B (Optimize Physics):**

1. Profile physics body creation
2. Implement spatial partitioning
3. Consider alternative physics libraries
4. Expect 4-8 hours of work

**If you choose OPTION C (Hybrid):**

1. Disable physics
2. Implement simple collision system
3. Add basic velocity/momentum simulation
4. Test features incrementally

---

**Session Status:** Performance investigation complete
**Root Cause:** Physics engine (90ms/frame)
**Recommendation:** Disable physics, implement simple alternatives
**Estimated Fix Time:** 30-60 minutes

**Awaiting user decision on which option to pursue.**
