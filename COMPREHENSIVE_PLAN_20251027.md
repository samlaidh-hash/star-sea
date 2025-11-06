# 🚀 COMPREHENSIVE IMPLEMENTATION PLAN
**Date:** 2025-10-27
**Methodology:** Highly Effective Debugging (from CLAUDE.md)
**Priority:** Systematic, Root-Cause Focused

---

## ⚠️ CRITICAL IMPLEMENTATION RULES

### **RULE 1: DELETE OLD CODE IMMEDIATELY**
**PROBLEM:** I have a habit of leaving old code in place, which blocks new code from working.

**SOLUTION:**
- ✅ **BEFORE adding new code:** Find and DELETE the old code it replaces
- ✅ **NO commenting out** - Delete it completely (git tracks history)
- ✅ **Search for ALL references** - Remove every call to old functions/variables
- ✅ **Example:** If replacing `oldFunction()`, search entire codebase for "oldFunction" and remove ALL occurrences

### **RULE 2: TEST IMMEDIATELY AFTER EACH FIX**
**PROBLEM:** Stacking untested fixes causes cascading failures.

**SOLUTION:**
- ✅ **Fix ONE issue** → Save files → Test in browser → Verify it works
- ✅ **Document test results** in session memory
- ✅ **DO NOT move to next issue** until current issue is confirmed working
- ✅ **If test fails:** Debug immediately, don't continue to next issue

### **RULE 3: CODE REPLACEMENT PROTOCOL**
When replacing existing functionality:

1. **SEARCH** - Find all instances of old code
2. **DELETE** - Remove old code completely (no comments)
3. **ADD** - Write new code in its place
4. **UPDATE DEPENDENCIES** - Fix all files that called old code
5. **TEST** - Verify new code works
6. **COMMIT** - Git commit with message describing replacement

---

## 📋 EXECUTIVE SUMMARY

**Total Issues:** 14 major systems requiring fixes
**Estimated Time:** 18-22 hours
**Approach:** Diagnose → Delete Old → Add New → Test → Document

**Critical Dependencies Discovered:**
- ⚠️ **PHYSICS DISABLED** (`CONFIG.DISABLE_PHYSICS: true`) - Impacts collisions, torpedoes, tractor beam
- ⚠️ **AUDIO DISABLED** (`AUDIO_CONFIG.enabled: false`) - Missing audio files causing delays
- ⚠️ **TAB KEY** - Currently power management, not target selection

---

## 🎯 PRIORITY ORDER (Dependencies First)

### **TIER 1: CRITICAL FOUNDATION** (5-6 hours)
Issues that block other systems from working

1. **Physics System Re-enablement** ⚡ BLOCKING
2. **Target Selection System (TAB)** ⚡ BLOCKING
3. **Lock-On System Fix** ⚡ BLOCKING

### **TIER 2: WEAPONS & COMBAT** (6-8 hours)
Core gameplay mechanics

4. **Torpedo Speed & Homing**
5. **Torpedo Load Tripling**
6. **Beam Collision Verification**
7. **Federation Beam Cooldown Fix**
8. **Ship Collision Physics**
9. **Pirate AI Weapon Selection**

### **TIER 3: SUPPORT SYSTEMS** (3-4 hours)
Secondary features

10. **Tractor Beam & Transporter**
11. **Audio System Restoration**

### **TIER 4: UI/UX ENHANCEMENTS** (4-5 hours)
User experience improvements

12. **New Throttle System (W/S/X)**
13. **Mission Briefing Loadout UI**
14. **Shuttle/Fighter/Drone Mechanics**

---

# 📊 DETAILED BREAKDOWN

---

## 🔴 TIER 1: CRITICAL FOUNDATION

---

### **ISSUE 1: Physics System Re-enablement**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** `CONFIG.DISABLE_PHYSICS: true` - Physics completely disabled
- **Impact:** Torpedoes stick to ship, collisions don't work, tractor beam can't function
- **Root Cause:** Previous session disabled physics due to performance (167ms lag)

#### **2. THREE MOST LIKELY CAUSES**
1. **Physics body creation overhead** - Too many objects with physics bodies
2. **Physics step calculation** - World.step() taking too long per frame
3. **Collision detection scale** - Too many collision pairs being checked

#### **3. SYSTEMATIC CHECK & FIX**
**File:** `js/config.js:22`

**Diagnosis Steps:**
- Check number of physics bodies in typical mission (should be <50)
- Profile Physics.step() with console.time()
- Review physics world bounds and scale

**Fix Strategy:**
- Re-enable physics: `DISABLE_PHYSICS: false`
- Add performance monitoring
- If lag returns, reduce physics iterations (currently 4 velocity, 2 position)
- Consider spatial partitioning for collisions

**Implementation Steps:**
1. **DELETE:** Nothing to delete, just changing config value
2. **MODIFY:** `js/config.js:22` - Set `DISABLE_PHYSICS: false`
3. **ADD:** Performance monitoring in `js/core/Engine.js`

**Files to Modify:**
- `js/config.js:22` - Set `DISABLE_PHYSICS: false`
- `js/core/Engine.js` - Add physics performance monitoring

#### **4. TEST IMMEDIATELY**
- [ ] Launch game, check FPS with physics enabled (should be >25 FPS)
- [ ] Fire torpedoes, verify they don't stick to ship (should launch forward)
- [ ] Fly into asteroid/ship, verify collision occurs
- [ ] Check console for physics performance logs

**✅ DO NOT PROCEED TO ISSUE 2 UNTIL ALL TESTS PASS**

---

### **ISSUE 2: Target Selection System (TAB)**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** TAB key not cycling through targets
- **Impact:** Can't select targets to monitor their HP/shields, lock-on struggles
- **Current State:** TAB is used for power management (`js/core/Engine.js:1739-1741`)

#### **2. THREE MOST LIKELY CAUSES**
1. **Key binding conflict** - TAB bound to wrong system (power management)
2. **Missing target cycling function** - No cycleTarget() method exists
3. **Target list not maintained** - No array of targetable entities

#### **3. SYSTEMATIC CHECK & FIX**
**Primary File:** `js/core/Engine.js`

**Current Code (lines 1739-1741):**
```javascript
// Power Management (TAB key)
if (this.inputManager.isKeyDown('tab')) {
    this.powerManagementSystem.handleTabPress(currentTime);
}
```

**Diagnosis:**
- Search for existing target cycling code (likely commented out or removed)
- Check if target list exists in Engine.js or TargetingSystem.js
- Verify HUD can display target info panel

**Fix Strategy:**
1. **DELETE old TAB handler** - Remove power management TAB binding completely
2. **Re-bind TAB** to target cycling (move power management to P key)
3. **CREATE target list** - Filter ships by faction (enemies, neutrals, allies)
4. **IMPLEMENT cycleTarget()** method
5. **UPDATE HUD** to show selected target's data

**Implementation Steps:**
1. **DELETE:** `js/core/Engine.js:1739-1741` - Remove entire TAB power management block
2. **SEARCH:** Grep for "handleTabPress" and remove all references
3. **ADD:** New TAB handler for target cycling
4. **ADD:** cycleTarget() method in Engine.js
5. **ADD:** updateTargetInfo() in HUD.js

**Files to Modify:**
- `js/core/Engine.js:1739-1741` - **DELETE** old TAB handler, **ADD** target cycling
- `js/systems/TargetingSystem.js` - **ADD** getTargetList() method
- `js/ui/HUD.js` - **ADD** updateTargetInfo() method
- `css/hud.css` - **ADD** target info panel styles (if missing)

#### **4. TEST IMMEDIATELY**
- [ ] Press TAB, verify target name appears in HUD
- [ ] Press TAB again, verify it cycles to next enemy
- [ ] Press TAB 10 times, verify it cycles through all enemies and wraps around
- [ ] Verify target HP/shields update in real-time as you damage them
- [ ] Verify old power management doesn't trigger on TAB

**✅ DO NOT PROCEED TO ISSUE 3 UNTIL ALL TESTS PASS**

---

### **ISSUE 3: Lock-On System Fix**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Reticle spins near targets but never changes color to red
- **Impact:** Visual feedback missing, torpedoes may not get lock-on data
- **Expected:** Green → Spin while locking → Red when locked
- **Actual:** Green → Spin indefinitely, never turns red

#### **2. THREE MOST LIKELY CAUSES**
1. **Lock-on event not firing** - 'lock-acquired' event never emitted
2. **CSS class not applied** - Event fires but reticle class doesn't update
3. **Lock-on time infinite** - Timer logic broken, never completes

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/systems/TargetingSystem.js` - Lock-on logic
- `js/core/Engine.js` - Event listeners
- `css/hud.css` - Reticle styling

**Diagnosis Steps:**
1. Add console.log to TargetingSystem lock-on timer
2. Check if 'lock-acquired' event emits
3. Verify Engine.js has listener for 'lock-acquired'
4. Inspect reticle element classes during lock attempt

**Fix Strategy:**
- **If timer broken:** DELETE old timer code, ADD working timer
- **If event not firing:** ADD eventBus.emit('lock-acquired')
- **If CSS not applying:** DELETE old class toggle, ADD correct one

**Implementation Steps:**
1. **SEARCH:** Find all lock-on timer code in TargetingSystem.js
2. **DELETE:** Any broken timer logic
3. **ADD:** Working lock-on timer that completes after 3-5 seconds
4. **VERIFY:** Event emission exists
5. **VERIFY:** Engine.js listener applies correct CSS class

**Files to Modify:**
- `js/systems/TargetingSystem.js:XXX` - **DELETE** broken timer, **ADD** working logic
- `js/core/Engine.js:XXX` - **VERIFY** event listener exists and works
- Add 'lock-acquired' audio cue trigger

#### **4. TEST IMMEDIATELY**
- [ ] Hover reticle over enemy (green, not spinning)
- [ ] Keep reticle on enemy for 3-5 seconds (should spin green)
- [ ] After lock completes, verify reticle turns RED
- [ ] Verify lock-acquired sound plays
- [ ] Move reticle off target, verify lock degrades over 2-3 seconds
- [ ] Fire torpedo at locked target, verify it homes toward target

**✅ DO NOT PROCEED TO TIER 2 UNTIL ALL TIER 1 TESTS PASS**

---

## 🟠 TIER 2: WEAPONS & COMBAT

---

### **ISSUE 4: Torpedo Speed & Homing**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom 1:** Torpedoes too slow (need 50% increase)
- **Symptom 2:** Torpedoes occasionally stick inside firing ship
- **Symptom 3:** Limited homing on locked targets not working
- **Impact:** Torpedoes ineffective, frustrating gameplay

#### **2. THREE MOST LIKELY CAUSES**
1. **Speed values too low** - CONFIG.TORPEDO_SPEED_CA = 325 (needs 487.5)
2. **Physics disabled** - Torpedoes spawn inside ship's physics body (BLOCKING: Issue #1)
3. **Homing logic incomplete** - lockOnTarget not being read by torpedo update()

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/config.js` - Torpedo speed constants
- `js/entities/Projectile.js` - TorpedoProjectile class
- `js/entities/Ship.js` - Torpedo firing spawn position

**Current Values:**
- `TORPEDO_SPEED_CA: 325` → **Change to 487** (325 × 1.5 = 487.5)
- `PLASMA_SPEED_CA: 217` → **Change to 326** (217 × 1.5 = 325.5)
- `DISRUPTOR_SPEED: 650` → **Change to 975** (650 × 1.5 = 975)

**Sticking Issue Fix:**
- Torpedoes spawn at ship center but have radius
- **Solution:** Spawn torpedoes 30-40 pixels forward of ship center
- **Check:** Ship.js torpedo firing methods (lines ~1260-1350)

**Homing Logic Fix:**
- **Check:** Projectile.js TorpedoProjectile.update() method
- **Verify:** lockOnTarget is passed to torpedo constructor
- **ADD:** Limited homing (gentle turn rate, not instant 180° turns)

**Implementation Steps:**
1. **MODIFY:** Config values - increase speeds by 50%
2. **SEARCH:** Ship.js for torpedo spawn code (createProjectile calls)
3. **DELETE:** Old spawn position calculation (if any)
4. **ADD:** Spawn offset (30-40 pixels forward)
5. **CHECK:** Projectile.js homing logic
6. **DELETE:** Old homing code if broken
7. **ADD:** Working homing with turn rate limit

**Files to Modify:**
- `js/config.js:112, 123, 128` - **MODIFY** torpedo/projectile speeds (+50%)
- `js/entities/Ship.js:~1260-1350` - **ADD** spawn offset for torpedoes
- `js/entities/Projectile.js:40-120` - **VERIFY/FIX** homing logic

#### **4. TEST IMMEDIATELY**
- [ ] Fire torpedo, verify it doesn't stick to ship (launches forward cleanly)
- [ ] Measure torpedo travel time across screen (should be 50% faster than before)
- [ ] Lock onto enemy, fire torpedo
- [ ] Verify torpedo curves gently toward locked target
- [ ] Verify torpedo doesn't do impossible turns (no 180° instant flips)
- [ ] Fire 5 torpedoes in rapid succession, all should launch cleanly

**✅ DO NOT PROCEED TO ISSUE 5 UNTIL ALL TESTS PASS**

---

### **ISSUE 5: Torpedo Load Tripling**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Torpedo storage too low for gameplay needs
- **Impact:** Players run out of torpedoes too quickly
- **Requirement:** Triple storage, launcher tops off after reload cooldown
- **Current:** TORPEDO_STORED: 16, TORPEDO_LOADED: 4

#### **2. THREE MOST LIKELY CAUSES**
1. **Config values too low** - Simple constant change needed
2. **Launcher reload logic incomplete** - Doesn't top off from storage
3. **Different ships have different configs** - Need to check per-ship overrides

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/config.js` - Torpedo storage constants
- `js/components/weapons/TorpedoLauncher.js` - Reload logic

**Current Values:**
- `TORPEDO_LOADED: 4` → **Keep at 4** (per user: do not change)
- `TORPEDO_STORED: 16` → **Change to 48** (16 × 3 = 48)

**Top-Off Logic:**
- **Current State:** Check TorpedoLauncher.update() method
- **Required Behavior:**
  1. Fire torpedo → loaded count decreases
  2. Wait TORPEDO_RELOAD_TIME (5 seconds)
  3. Transfer ONE torpedo from storage to loaded
  4. Repeat until loaded == 4
  5. **New:** If stored > 0 and loaded < 4, keep topping off

**Implementation Steps:**
1. **MODIFY:** `js/config.js:115` - `TORPEDO_STORED: 48`
2. **READ:** TorpedoLauncher.js reload logic
3. **DELETE:** Old reload logic if it doesn't top off correctly
4. **ADD:** New reload logic that tops off to max loaded

**Files to Modify:**
- `js/config.js:115` - **MODIFY** `TORPEDO_STORED: 48`
- `js/components/weapons/TorpedoLauncher.js` - **VERIFY/FIX** reload logic

#### **4. TEST IMMEDIATELY**
- [ ] Check HUD, verify torpedo storage shows 48
- [ ] Fire 1 torpedo
- [ ] Wait 5 seconds, verify it reloads to 4/48
- [ ] Fire all 4 torpedoes
- [ ] Wait 20 seconds, verify all 4 reload (should show 4/44)
- [ ] Fire 30 torpedoes over time, verify storage decrements correctly
- [ ] Verify you can fire 48 + 4 = 52 total torpedoes before running out

**✅ DO NOT PROCEED TO ISSUE 6 UNTIL ALL TESTS PASS**

---

### **ISSUE 6: Beam Collision Verification**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Uncertain if beams are hitting targets and dealing damage
- **Impact:** Can't tell if weapon is working, combat feels unresponsive
- **Expected:** Beam fires → target shields/hull decrease → visual feedback
- **Actual:** Uncertain due to lack of target selection (Issue #2)

#### **2. THREE MOST LIKELY CAUSES**
1. **Collision detection broken** - Beams not checking hit with ship hitboxes
2. **Damage not applied** - Collision detected but damage calculation skipped
3. **Visual feedback missing** - Damage works but no shield flash/outline

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/core/Engine.js` - Beam collision checking (lines ~1520-1550)
- `js/entities/Ship.js` - takeDamage() method
- `js/rendering/ShipRenderer.js` - Visual damage feedback

**DEPENDENCY:** ⚠️ **Requires Issue #2 (TAB target selection) to test properly**

**Diagnosis Steps:**
1. Enable Issue #2 (TAB target selection) first
2. Select enemy target
3. Fire beams at target while watching HUD
4. Check if target HP/shields decrease

**Fix Strategy:**
- **If not hitting:** DELETE old hitbox code, ADD correct beam-to-circle collision
- **If not damaging:** DELETE old damage call, ADD correct takeDamage() call
- **If no visual:** ADD shield flash effect to ShipRenderer

**Implementation Steps:**
1. **SEARCH:** Engine.js for beam collision code
2. **DELETE:** Old/broken collision detection
3. **ADD:** Working beam-to-ship collision (point/line to circle)
4. **VERIFY:** takeDamage() call exists and passes correct damage value
5. **CHECK:** ShipRenderer has shield flash effect
6. **ADD:** Shield flash if missing

**Files to Modify:**
- `js/core/Engine.js:~1520-1550` - **DELETE** old collision, **ADD** working logic
- `js/entities/Ship.js` - **VERIFY** takeDamage() processes beam damage
- `js/rendering/ShipRenderer.js` - **ADD** shield flash effect if missing

#### **4. TEST IMMEDIATELY**
- [ ] Select enemy target with TAB
- [ ] Fire beam at enemy for 3 seconds
- [ ] Verify target shields decrease by ~3 HP (BEAM_DAMAGE: 1/sec)
- [ ] Verify shield quadrant flashes when hit
- [ ] Fire beam until shields down
- [ ] Verify hull HP decreases when shields gone
- [ ] Verify ship outline flashes red when hull hit

**✅ DO NOT PROCEED TO ISSUE 7 UNTIL ALL TESTS PASS**

---

### **ISSUE 7: Federation Beam Cooldown Fix**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Federation beam cooldown not matching firing duration
- **Impact:** Cooldown feels unfair (too long or too short)
- **Required:** Fire 1 sec → Cooldown 1 sec, Fire 3 sec → Cooldown 3 sec
- **Current:** Unknown (need to check BeamWeapon.js or ContinuousBeam.js)

#### **2. THREE MOST LIKELY CAUSES**
1. **Fixed cooldown** - Uses CONFIG.BEAM_COOLDOWN (1.0s) regardless of duration
2. **Cooldown not tracking fire duration** - No variable to store how long beam fired
3. **Wrong cooldown calculation** - Formula exists but is incorrect

#### **3. SYSTEMATIC CHECK & FIX**
**Primary File:** `js/components/weapons/ContinuousBeam.js` (or BeamWeapon.js)

**Diagnosis Steps:**
1. Search for cooldown logic in beam weapon classes
2. Check if firing duration is tracked
3. Test: Fire beam for 1 sec, measure cooldown time

**Fix Strategy:**
- **DELETE:** Fixed cooldown assignment
- **ADD:** Dynamic cooldown based on firing duration

**Implementation Steps:**
1. **SEARCH:** ContinuousBeam.js for cooldown code
2. **DELETE:** `this.cooldown = CONFIG.BEAM_COOLDOWN;` or similar
3. **ADD:** `this.cooldown = this.firingDuration;`
4. **VERIFY:** firingDuration is tracked correctly

**Files to Modify:**
- `js/components/weapons/ContinuousBeam.js` - **DELETE** fixed cooldown, **ADD** dynamic

#### **4. TEST IMMEDIATELY**
- [ ] Hold LMB for exactly 1 second, release
- [ ] Try to fire again immediately (should be blocked)
- [ ] Wait exactly 1 second, fire again (should work)
- [ ] Hold LMB for exactly 3 seconds, release
- [ ] Try to fire again immediately (should be blocked)
- [ ] Wait exactly 3 seconds, fire again (should work)
- [ ] Fire max duration (3 sec), verify 3 second cooldown

**✅ DO NOT PROCEED TO ISSUE 8 UNTIL ALL TESTS PASS**

---

### **ISSUE 8: Ship Collision Physics**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Ships pass through each other instead of bumping
- **Impact:** No collision avoidance, unrealistic, can't ram enemies
- **Expected:** Ship A hits Ship B → Both take damage, bounce off
- **Actual:** Ships overlap with no interaction

#### **2. THREE MOST LIKELY CAUSES**
1. **Physics disabled** - BLOCKING: Issue #1 must be fixed first
2. **Collision masks wrong** - Ships not set to collide with each other
3. **CollisionHandler not called** - Event listener missing or broken

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/physics/CollisionHandler.js` - Ship collision damage calculation
- `js/core/Engine.js` - Physics world setup and collision listeners

**DEPENDENCY:** ⚠️ **Requires Issue #1 (Physics Re-enablement) to be fixed first**

**Diagnosis Steps:**
1. After enabling physics, create two ships near each other
2. Fly one into the other
3. Check console for collision events
4. Check if physics bodies have correct collision groups

**Fix Strategy:**
- **If physics body missing:** ADD physics bodies to all ships
- **If collision mask wrong:** DELETE old mask, ADD correct ship-to-ship collision
- **If handler not firing:** ADD collision event listener in Engine.js

**Implementation Steps:**
1. **VERIFY:** All ships have physics bodies created
2. **CHECK:** Collision groups/masks in physics body creation
3. **DELETE:** Old collision handler code if broken
4. **ADD:** Working collision event listener
5. **VERIFY:** CollisionHandler.js damage calculation works

**Files to Modify:**
- `js/entities/Ship.js:~150` - **VERIFY** physics body creation
- `js/core/Engine.js` - **ADD/VERIFY** collision event listeners
- `js/physics/CollisionHandler.js` - **VERIFY** damage calculation works

#### **4. TEST IMMEDIATELY**
- [ ] Fly player ship directly into pirate ship at full speed
- [ ] Verify both ships take damage (check HP values)
- [ ] Verify damage scales with speed (faster = more damage)
- [ ] Verify ships bounce off each other (momentum transfer)
- [ ] Verify MIN_COLLISION_SPEED threshold (25 units/s) works
- [ ] Spawn new ships very close, verify NO spawn damage at 0 speed

**✅ DO NOT PROCEED TO ISSUE 9 UNTIL ALL TESTS PASS**

---

### **ISSUE 9: Pirate AI Weapon Selection**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Pirates only use torpedoes, not beams
- **Impact:** Combat lacks variety, pirates too predictable
- **Expected:** Pirates randomly equipped with 1-2 weapon types, mix usage
- **Actual:** Pirates spam torpedoes only

#### **2. THREE MOST LIKELY CAUSES**
1. **Weapon loadout generation** - Pirates only get torpedoes assigned
2. **AI weapon choice logic** - Pirates have beams but AI only fires torpedoes
3. **Weapon system initialization** - Beam weapons not added to pirate ships

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/entities/Ship.js` - Pirate ship weapon initialization
- `js/systems/AIController.js` - AI weapon firing logic
- `js/core/Engine.js` - Enemy ship spawning

**Diagnosis Steps:**
1. Add console.log to pirate ship creation, log weapon systems
2. Check if pirates have beam weapons in their weapon arrays
3. Check AIController.js for weapon selection logic

**Fix Strategy:**
- **DELETE:** Fixed pirate weapon loadout
- **ADD:** Random weapon selection (max 2 different types)
- **ADD:** AI logic to use both weapons based on range/situation

**Implementation Steps:**
1. **SEARCH:** Ship.js for pirate weapon initialization
2. **DELETE:** Fixed torpedo-only loadout
3. **ADD:** Random weapon generation (2 types max)
4. **SEARCH:** AIController.js for weapon firing logic
5. **DELETE:** Torpedo-only firing code
6. **ADD:** Smart weapon selection (range-based, random mix)

**Files to Modify:**
- `js/entities/Ship.js` - **DELETE** fixed loadout, **ADD** random generation
- `js/systems/AIController.js` - **DELETE** torpedo-only, **ADD** weapon choice
- `js/core/Engine.js` - **VERIFY** pirate spawning calls weapon generation

#### **4. TEST IMMEDIATELY**
- [ ] Spawn 10 pirate ships
- [ ] Verify weapon variety: beams+torpedoes, disruptors+plasma, etc.
- [ ] Engage pirate at close range (<200 px)
- [ ] Verify pirate uses beams more often at close range
- [ ] Move to long range (>500 px)
- [ ] Verify pirate uses torpedoes more often at long range
- [ ] Fight 5 different pirates, verify they all have different loadouts

**✅ DO NOT PROCEED TO TIER 3 UNTIL ALL TIER 2 TESTS PASS**

---

## 🟡 TIER 3: SUPPORT SYSTEMS

---

### **ISSUE 10: Tractor Beam & Transporter**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom 1:** Tractor beam does nothing when activated
- **Symptom 2:** Transporter (T key) does nothing
- **Impact:** Support systems non-functional
- **Expected:**
  - Tractor: Pulls target ship toward player (10 ship lengths range)
  - Transporter: Toggle, fires when target close + no shields, drops player shield

#### **2. THREE MOST LIKELY CAUSES**
1. **Systems not integrated** - TractorBeamSystem.js & TransporterSystem.js exist but not called
2. **Key bindings missing** - No event listeners for tractor/transporter keys
3. **Physics disabled** - BLOCKING: Issue #1, tractor needs physics for force application

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/systems/TractorBeamSystem.js` - Tractor beam logic
- `js/systems/TransporterSystem.js` - Transporter logic
- `js/core/Engine.js` - System initialization and key listeners
- `js/entities/Ship.js` - Add system instances

**DEPENDENCY:** ⚠️ **Requires Issue #1 (Physics) for tractor beam force application**

**Implementation Steps:**
1. **CHECK:** Ship.js for tractorBeam and transporter instances
2. **DELETE:** Old tractor/transporter code if it exists and is broken
3. **ADD:** System instances in Ship.js constructor
4. **SEARCH:** Engine.js for tractor/transporter key handlers
5. **DELETE:** Old key handlers if broken
6. **ADD:** Working key handlers with correct logic

**Files to Modify:**
- `js/entities/Ship.js` - **ADD** tractorBeam and transporter instances
- `js/core/Engine.js` - **DELETE** old handlers, **ADD** new key listeners
- `js/systems/TractorBeamSystem.js` - **VERIFY/ADD** activate() method
- `js/systems/TransporterSystem.js` - **VERIFY/ADD** toggle() and attemptTransport()

#### **4. TEST IMMEDIATELY - TRACTOR BEAM**
- [ ] Get within 10 ship lengths of enemy
- [ ] Press G key (or assigned tractor key)
- [ ] Verify visual beam appears between ships
- [ ] Verify enemy ship starts moving toward player
- [ ] Verify tractor beam sound plays
- [ ] Move out of range (>10 ship lengths), verify beam deactivates

#### **4. TEST IMMEDIATELY - TRANSPORTER**
- [ ] Press T key, verify transporter mode toggles ON
- [ ] Get close to enemy WITH shields up
- [ ] Verify transporter does NOT fire (shields block it)
- [ ] Destroy enemy shields (bring to 0)
- [ ] Get within 10 ship lengths
- [ ] Verify transporter fires automatically
- [ ] Verify player's facing shield drops
- [ ] Verify transporter sound/effect plays

**✅ DO NOT PROCEED TO ISSUE 11 UNTIL ALL TESTS PASS**

---

### **ISSUE 11: Audio System Restoration**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** No sound at all in game
- **Impact:** Game feels lifeless, no audio feedback for actions
- **Root Cause:** `AUDIO_CONFIG.enabled: false` (disabled due to missing files causing delays)

#### **2. THREE MOST LIKELY CAUSES**
1. **Audio files missing** - Most audio files don't exist in ASSETS/AUDIO/
2. **Audio disabled in config** - AUDIO_CONFIG.enabled: false
3. **File paths wrong** - Audio files exist but paths incorrect

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/config/AudioConfig.js` - Audio configuration
- `ASSETS/AUDIO/` - Audio file directory

**Known Existing Files:**
- ✅ Fed-Beam.mp3
- ✅ pirate_torpedo.mp3
- ✅ streak-beam.wav
- ✅ tractor_beam.mp3
- ✅ transporter.mp3

**Fix Strategy - Quick Enable:**
- Map existing files to multiple sound events
- Leave missing sounds silent (no error)
- Enable audio with partial sounds

**Implementation Steps:**
1. **DELETE:** Old audio path mappings that point to missing files
2. **ADD:** New mappings using only existing files
3. **MODIFY:** `enabled: true`
4. **TEST:** Each audio file loads without errors

**Files to Modify:**
- `js/config/AudioConfig.js:3` - **MODIFY** `enabled: true`
- `js/config/AudioConfig.js:5-22` - **DELETE** missing paths, **ADD** existing files

#### **4. TEST IMMEDIATELY**
- [ ] Start game, check console for audio loading errors (should be none)
- [ ] Fire beam weapon → Should hear Fed-Beam.mp3
- [ ] Fire torpedo → Should hear pirate_torpedo.mp3
- [ ] Activate tractor → Should hear tractor_beam.mp3
- [ ] Activate transporter → Should hear transporter.mp3
- [ ] Pause game, verify audio settings UI exists
- [ ] Adjust volume slider, verify sound volume changes

**✅ DO NOT PROCEED TO TIER 4 UNTIL ALL TIER 3 TESTS PASS**

---

## 🟢 TIER 4: UI/UX ENHANCEMENTS

---

### **ISSUE 12: New Throttle System (W/S/X)**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Current system: hold W = accelerate, release = coast
- **Impact:** Tedious to maintain speed, hand fatigue
- **Required:**
  - W/S move throttle caret on speed bar
  - Ship accelerates/decelerates to throttle setting
  - Double-tap W/S for temporary boost
  - X = emergency stop (rapid decel + shield boost for 7 sec)

#### **2. THREE MOST LIKELY CAUSES**
1. **No throttle system exists** - Current controls are direct acceleration
2. **No boost mechanic** - No double-tap detection or boost timer
3. **No emergency stop** - X key not bound

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/core/Engine.js` - Input handling for W/S/X
- `js/entities/Ship.js` - Add throttle property and boost state
- `js/ui/HUD.js` - Render throttle caret on speed bar
- `js/core/InputManager.js` - Double-tap detection

**Implementation Steps:**
1. **SEARCH:** Engine.js for W/S/X key handling
2. **DELETE:** Old acceleration code (hold W = accelerate)
3. **ADD:** Throttle system (W/S adjust throttle value)
4. **SEARCH:** InputManager.js for double-tap detection
5. **ADD:** Double-tap detection if missing
6. **ADD:** Ship.js throttle properties and boost system
7. **ADD:** HUD.js throttle caret rendering

**Files to Modify:**
- `js/core/InputManager.js` - **ADD** double-tap detection
- `js/entities/Ship.js` - **ADD** throttle, boost, emergency stop
- `js/core/Engine.js` - **DELETE** old acceleration, **ADD** throttle input
- `js/ui/HUD.js` - **ADD** throttle caret rendering
- `css/hud.css` - **ADD** throttle caret styles

#### **4. TEST IMMEDIATELY**
- [ ] Press W once, verify throttle increases 10% (visual caret moves right)
- [ ] Release W, verify ship accelerates TO throttle speed and maintains
- [ ] Press S once, verify throttle decreases 10%
- [ ] Release S, verify ship decelerates TO throttle speed and maintains
- [ ] Set throttle to 50%, verify ship holds at 50% max speed
- [ ] Double-tap W while holding, verify boost activates (+50 speed for 3 sec)
- [ ] Release W, verify ship returns to throttle setting after boost expires
- [ ] Press X at full speed, verify rapid stop + shield flare effect
- [ ] Verify emergency stop gives +shield boost for 7 seconds

**✅ DO NOT PROCEED TO ISSUE 13 UNTIL ALL TESTS PASS**

---

### **ISSUE 13: Mission Briefing Loadout UI**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** No way to select consumables before mission
- **Impact:** Can't use consumable system (already implemented)
- **Required:** UI in mission briefing to select consumables, limited by bay size

#### **2. THREE MOST LIKELY CAUSES**
1. **UI doesn't exist** - No HTML elements for consumable selection
2. **MissionUI.js doesn't handle it** - No code to process selection
3. **Bay size not exposed** - Can't calculate available slots

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `index.html` - Mission briefing panel HTML
- `js/ui/MissionUI.js` - Mission briefing logic
- `js/entities/Ship.js` - Bay size property
- `css/hud.css` - Loadout UI styling

**Implementation Steps:**
1. **SEARCH:** index.html for mission briefing section
2. **ADD:** Loadout selection HTML inside briefing panel
3. **SEARCH:** MissionUI.js for loadout handling
4. **DELETE:** Old loadout code if it exists but is broken
5. **ADD:** Working loadout selection with +/- buttons
6. **ADD:** Bay capacity calculation and limits
7. **ADD:** LocalStorage persistence for loadout

**Files to Modify:**
- `index.html` - **ADD** loadout selection UI to mission briefing
- `js/ui/MissionUI.js` - **DELETE** old loadout, **ADD** working selection
- `css/hud.css` - **ADD** loadout UI styles
- `js/entities/Ship.js` - **ADD** getBaySize() method if missing

#### **4. TEST IMMEDIATELY**
- [ ] Open mission briefing screen
- [ ] Verify loadout selection UI appears
- [ ] Click + on Hull Repair Kits, verify count increases
- [ ] Verify bay capacity shows (e.g., 5/10)
- [ ] Fill bay to max, verify + buttons disable
- [ ] Click - to decrease count, verify it works
- [ ] Accept mission, start game
- [ ] Press F5 (hull repair hotkey), verify consumable activates
- [ ] Return to briefing, verify loadout persists from last mission

**✅ DO NOT PROCEED TO ISSUE 14 UNTIL ALL TESTS PASS**

---

### **ISSUE 14: Shuttle/Fighter/Drone Mechanics**

#### **1. DEFINE PROBLEM PRECISELY**
- **Symptom:** Shuttles, fighters, drones not functional
- **Impact:** Bay system only half-implemented
- **Required:**
  - Keys 1-6: Tap to assign mission, tap again to launch
  - SHIFT+1-6: Launch fighters/drones with mission
  - AI-controlled craft with mission-based behavior

#### **2. THREE MOST LIKELY CAUSES**
1. **Classes don't exist** - Need to create Shuttle, Fighter, Drone entity classes
2. **Bay system incomplete** - Ship.js has bay HP but not craft storage
3. **Mission assignment UI missing** - No way to assign attack/defend/passive missions

#### **3. SYSTEMATIC CHECK & FIX**
**Primary Files:**
- `js/entities/Shuttle.js` - Create if missing
- `js/entities/Fighter.js` - Create if missing
- `js/entities/Drone.js` - Create if missing
- `js/systems/BaySystem.js` - Create if missing
- `js/core/Engine.js` - Add bay launch logic

**Implementation Steps:**
1. **SEARCH:** Check if Shuttle.js, Fighter.js, Drone.js exist
2. **CREATE:** Entity classes if missing
3. **SEARCH:** Check if BaySystem.js exists
4. **CREATE:** BaySystem.js if missing
5. **ADD:** Ship.js baySystem instance
6. **SEARCH:** Engine.js for bay key handlers (1-6, SHIFT+1-6)
7. **DELETE:** Old bay code if broken
8. **ADD:** Working bay key handling with mission cycling
9. **ADD:** AIController mission execution modes

**Files to Modify:**
- **CREATE** `js/entities/Shuttle.js` - Shuttle class extending Ship
- **CREATE** `js/entities/Fighter.js` - Fighter class extending Ship
- **CREATE** `js/entities/Drone.js` - Drone class extending Ship
- **CREATE** `js/systems/BaySystem.js` - Bay management system
- `js/entities/Ship.js` - **ADD** baySystem property
- `js/core/Engine.js` - **DELETE** old bay handlers, **ADD** new logic
- `js/systems/AIController.js` - **ADD** mission execution modes
- `index.html` - **ADD** script tags for new entity files

#### **4. TEST IMMEDIATELY - MISSION ASSIGNMENT**
- [ ] Press 1 key, verify mission indicator appears (e.g., "Attack" mission)
- [ ] Press 1 again, verify mission cycles (Attack → Defend → Passive → Recon)
- [ ] Press 1 third time, verify fighter launches with assigned mission
- [ ] Verify bay count decreases (e.g., 4/4 → 3/4 fighters)

#### **4. TEST IMMEDIATELY - FIGHTER BEHAVIOR**
- [ ] Launch fighter with "Attack" mission
- [ ] Verify fighter seeks out nearest enemy and engages
- [ ] Launch fighter with "Defend" mission
- [ ] Verify fighter orbits player ship and intercepts attackers
- [ ] Launch fighter with "Passive" mission
- [ ] Verify fighter follows player but avoids combat

#### **4. TEST IMMEDIATELY - SHIFT LAUNCH**
- [ ] Hold SHIFT, press 2
- [ ] Verify fighter launches immediately with default attack mission
- [ ] Verify quick launch doesn't require mission cycling

**✅ ALL TIER 4 TESTS COMPLETE = IMPLEMENTATION FINISHED**

---

## 📂 FILE MODIFICATION SUMMARY

### **Files to MODIFY (Existing Code)**

**Config:**
- `js/config.js` - Physics enable, torpedo speeds, storage

**Core Systems:**
- `js/core/Engine.js` - DELETE old handlers, ADD target cycling, throttle, bays, tractor, transporter
- `js/core/InputManager.js` - ADD double-tap detection

**Entities:**
- `js/entities/Ship.js` - ADD throttle, boost, systems integration
- `js/entities/Projectile.js` - ADD spawn offset, VERIFY homing

**Systems:**
- `js/systems/TargetingSystem.js` - FIX lock-on completion
- `js/systems/AIController.js` - ADD weapon selection, mission modes
- `js/systems/TractorBeamSystem.js` - ADD activation logic
- `js/systems/TransporterSystem.js` - ADD toggle and transport logic

**Weapons:**
- `js/components/weapons/ContinuousBeam.js` - DELETE fixed cooldown, ADD dynamic
- `js/components/weapons/TorpedoLauncher.js` - VERIFY top-off reload

**UI:**
- `js/ui/HUD.js` - ADD target info, throttle caret
- `js/ui/MissionUI.js` - ADD loadout selection
- `index.html` - ADD loadout UI, ADD script tags
- `css/hud.css` - ADD reticle lock, target panel, throttle, loadout styles

**Audio:**
- `js/config/AudioConfig.js` - DELETE missing paths, ADD existing files, enable

**Physics:**
- `js/physics/CollisionHandler.js` - VERIFY logic works

### **Files to CREATE (New)**

- `js/entities/Shuttle.js`
- `js/entities/Fighter.js`
- `js/entities/Drone.js`
- `js/systems/BaySystem.js`

---

## 🧪 COMPREHENSIVE TESTING PROTOCOL

### **TESTING RULES:**
1. ✅ **Test IMMEDIATELY after each fix** - Don't stack untested changes
2. ✅ **All tests must PASS** - Don't proceed if even one test fails
3. ✅ **Document results** - Note what worked, what didn't
4. ✅ **If test fails** - Debug immediately, don't continue

### **TIER 1 Tests (Foundation):**
- [ ] Physics enabled, FPS stable (>25 FPS)
- [ ] TAB cycles through 3+ enemy targets
- [ ] Target info displays in HUD with real-time HP/shields
- [ ] Lock-on: Reticle green → spin → red after 3-5 seconds
- [ ] Lock-on sound plays when locked

### **TIER 2 Tests (Combat):**
- [ ] Torpedoes 50% faster, don't stick to ship
- [ ] Fire 30 torpedoes, verify storage works (48 stored)
- [ ] Lock target, fire beam 3 seconds, verify 3 HP damage
- [ ] Fire beam 1 sec = 1 sec cooldown; 3 sec = 3 sec cooldown
- [ ] Ram pirate ship at high speed, both take damage and bounce
- [ ] Fight 5 pirates, verify weapon variety (beams, torpedoes, mix)

### **TIER 3 Tests (Support):**
- [ ] Tractor beam pulls enemy ship toward player
- [ ] Transporter fires when close + no shields
- [ ] Audio plays for all actions (beam, torpedo, tractor, transporter)

### **TIER 4 Tests (UI/UX):**
- [ ] W increases throttle, ship accelerates and maintains speed
- [ ] Double-tap W, boost activates for 3 seconds
- [ ] Press X, emergency stop + shield boost for 7 seconds
- [ ] Mission briefing loadout selection works
- [ ] Launch fighter with attack mission, verifies it attacks enemies

---

## ⏱️ TIME ESTIMATES

| Tier | Issues | Estimated Time |
|------|--------|----------------|
| **TIER 1** | Physics, TAB Select, Lock-On | 5-6 hours |
| **TIER 2** | Torpedoes, Beams, Collisions, AI | 6-8 hours |
| **TIER 3** | Tractor, Transporter, Audio | 3-4 hours |
| **TIER 4** | Throttle, Loadout UI, Craft | 4-5 hours |
| **TOTAL** | 14 Issues | **18-23 hours** |

---

## 🚀 NEXT STEPS

1. **Review this plan** - Confirm approach and priorities
2. **Start with TIER 1, ISSUE 1** - Physics System Re-enablement
3. **DELETE old code FIRST** - Before adding new code
4. **TEST after EACH issue** - Don't stack untested fixes
5. **Update bugs.md** - Document fixes and patterns
6. **Update session memory** - Track progress every hour

---

## ⚠️ FINAL REMINDER

**CRITICAL RULES TO FOLLOW:**

1. ❌ **DO NOT comment out old code** - DELETE it completely
2. ❌ **DO NOT skip testing** - Test immediately after each fix
3. ❌ **DO NOT proceed if tests fail** - Debug first
4. ❌ **DO NOT leave broken code** - Fix or remove it
5. ✅ **DO search for all references** - Update dependencies
6. ✅ **DO delete old handlers** - Before adding new ones
7. ✅ **DO test in browser** - After every single change
8. ✅ **DO commit working code** - Git commit after each issue fixed

---

**Ready to begin implementation?**
**Start with TIER 1, ISSUE #1: Physics System Re-enablement**
