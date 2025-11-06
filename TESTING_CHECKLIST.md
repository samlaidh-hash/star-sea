# 🧪 TESTING CHECKLIST - Implementation Verification
**Date:** 2025-10-27
**Status:** Awaiting User Test Results

---

## 📋 HOW TO USE THIS CHECKLIST

1. **Start the game** - Use Live Server or open index.html
2. **Test each section** in order (TIER 1 → TIER 2)
3. **Mark results** - ✅ PASS or ❌ FAIL for each test
4. **Note details** - Write what happened if test fails
5. **Report back** - Tell me which tests failed and what you observed

---

## 🔴 TIER 1: CRITICAL FOUNDATION (Test First)

### **TEST 1.1: Physics System**
**File Modified:** `js/config.js:22` - `DISABLE_PHYSICS: false`

**Steps:**
1. Start game, accept mission
2. Check browser console for any physics errors
3. Observe FPS counter (if visible)

**Expected Results:**
- [ ] Game loads without errors
- [ ] FPS stays above 25 (check console or feel responsiveness)
- [ ] No lag spikes when moving ship

**If FAIL:** Note exact FPS value and when lag occurs

---

### **TEST 1.2: Physics - Torpedo Launch**
**Dependency:** Physics must be enabled

**Steps:**
1. Fire a torpedo (RMB or torpedo key)
2. Watch torpedo as it leaves ship

**Expected Results:**
- [ ] Torpedo launches cleanly forward
- [ ] Torpedo does NOT stick inside ship
- [ ] Torpedo does NOT appear inside ship hull

**If FAIL:** Describe torpedo behavior (stuck, spawns inside, etc.)

---

### **TEST 1.3: Physics - Ship Collision**
**Dependency:** Physics must be enabled

**Steps:**
1. Fly player ship directly into an enemy ship at full speed
2. Observe collision

**Expected Results:**
- [ ] Ships collide (don't pass through each other)
- [ ] Both ships take damage (check HP)
- [ ] Ships bounce off each other (momentum transfer)

**If FAIL:** Note if ships pass through, or no damage, or no bounce

---

### **TEST 1.4: TAB Target Selection**
**Files Modified:** Engine.js, HUD.js, index.html, hud.css

**Steps:**
1. Press TAB key once
2. Look at top-right corner of screen (below minimap)

**Expected Results:**
- [ ] Cyan panel appears labeled "Selected Target"
- [ ] Panel shows target name (e.g., "Pirate Raider")
- [ ] Panel shows shields, hull HP, distance

**If FAIL:** Describe what you see (no panel, wrong location, etc.)

---

### **TEST 1.5: TAB Target Cycling**
**Dependency:** TAB panel must appear first

**Steps:**
1. Press TAB multiple times (5-10 times)
2. Watch target name change in panel

**Expected Results:**
- [ ] Target name changes each press
- [ ] Cycles through all enemy ships
- [ ] Eventually wraps back to first target

**If FAIL:** Note if target name doesn't change or errors appear

---

### **TEST 1.6: Target Info Real-Time Update**
**Dependency:** TAB selection working

**Steps:**
1. Select enemy with TAB
2. Fire weapons at selected enemy
3. Watch HP/shields in target panel

**Expected Results:**
- [ ] Shield values decrease when you hit target
- [ ] Hull HP decreases when shields gone
- [ ] Distance updates as you move closer/farther

**If FAIL:** Note which values don't update (shields, hull, distance)

---

### **TEST 1.7: Lock-On Visual**
**File Modified:** TargetingSystem.js (timer 3-5 seconds)

**Steps:**
1. Hover reticle over enemy ship
2. Keep reticle steady on enemy for 5 seconds
3. Watch reticle color and rotation

**Expected Results:**
- [ ] Reticle starts GREEN (not spinning)
- [ ] After 1-2 seconds: Reticle SPINS and stays GREEN
- [ ] After 3-5 seconds: Reticle turns RED (locked)
- [ ] Lock-acquired sound plays

**If FAIL:** Note reticle behavior (never spins, never turns red, wrong color)

---

### **TEST 1.8: Lock-On Loss**
**Dependency:** Lock-on must work first

**Steps:**
1. Lock onto enemy (reticle turns red)
2. Move reticle away from enemy
3. Wait 2-3 seconds

**Expected Results:**
- [ ] Lock degrades over time (not instant)
- [ ] Reticle eventually turns back to GREEN
- [ ] Takes 2-3 seconds to lose lock completely

**If FAIL:** Note if lock breaks instantly or never breaks

---

## 🟠 TIER 2: TORPEDOES

### **TEST 2.1: Torpedo Speed Increase**
**File Modified:** config.js - TORPEDO_SPEED_CA: 487 (+50%)

**Steps:**
1. Fire torpedo
2. Observe travel speed compared to before

**Expected Results:**
- [ ] Torpedoes noticeably faster than before
- [ ] Estimate: 50% speed increase visible

**If FAIL:** Note if torpedoes seem same speed as before

---

### **TEST 2.2: Torpedo Storage Tripled**
**File Modified:** config.js - TORPEDO_STORED: 48

**Steps:**
1. Start mission
2. Check HUD torpedo counter

**Expected Results:**
- [ ] Torpedo counter shows "4 / 48"
- [ ] Storage is 48 (not 16)

**If FAIL:** Note actual storage value shown

---

### **TEST 2.3: Torpedo Top-Off Reload**
**Files Modified:** TorpedoLauncher.js, DualTorpedoLauncher.js

**Steps:**
1. Fire 1 torpedo (should show 3/47)
2. Wait exactly 5 seconds
3. Check torpedo counter

**Expected Results:**
- [ ] After 5 seconds: Counter shows "4 / 47"
- [ ] Automatically reloaded 1 torpedo from storage

**If FAIL:** Note counter value after 5 seconds

---

### **TEST 2.4: Torpedo Top-Off Multiple**
**Dependency:** Single reload must work first

**Steps:**
1. Fire all 4 torpedoes (should show 0/44)
2. Wait 20 seconds (4 torpedoes × 5 sec each)
3. Check torpedo counter

**Expected Results:**
- [ ] After 20 seconds: Counter shows "4 / 44"
- [ ] All 4 torpedoes reloaded automatically

**If FAIL:** Note counter value and time waited

---

### **TEST 2.5: Torpedo Total Capacity**
**Steps:**
1. Fire torpedoes continuously
2. Count total fired before empty

**Expected Results:**
- [ ] Can fire 52 total torpedoes (48 + 4)
- [ ] Counter shows "0 / 0" when empty

**If FAIL:** Note total torpedoes fired before empty

---

### **TEST 2.6: Torpedo Homing**
**Dependency:** Lock-on must work

**Steps:**
1. Lock onto enemy (reticle red)
2. Fire torpedo
3. Watch torpedo flight path

**Expected Results:**
- [ ] Torpedo curves toward locked target
- [ ] Turn rate is gentle (not instant 180°)
- [ ] Continues forward if it misses (doesn't turn back)

**If FAIL:** Note torpedo behavior (straight line, wrong target, etc.)

---

## 🟠 TIER 2: BEAMS

### **TEST 2.7: Beam Dynamic Cooldown - 1 Second**
**File Modified:** ContinuousBeam.js

**Steps:**
1. Hold LMB (beam fire) for exactly 1 second
2. Release LMB
3. Immediately try to fire again
4. Wait exactly 1 second
5. Try to fire again

**Expected Results:**
- [ ] Cannot fire immediately after release
- [ ] After 1 second wait: CAN fire again
- [ ] Cooldown = firing duration (1 second)

**If FAIL:** Note actual cooldown time

---

### **TEST 2.8: Beam Dynamic Cooldown - 3 Seconds**
**Dependency:** 1-second test must work

**Steps:**
1. Hold LMB for exactly 3 seconds (max duration)
2. Release LMB
3. Immediately try to fire again
4. Wait exactly 3 seconds
5. Try to fire again

**Expected Results:**
- [ ] Cannot fire immediately after release
- [ ] After 3 seconds wait: CAN fire again
- [ ] Cooldown = firing duration (3 seconds)

**If FAIL:** Note actual cooldown time

---

### **TEST 2.9: Beam Weapon Bar Visual**
**Dependency:** Dynamic cooldown working

**Steps:**
1. Fire beam for 2 seconds
2. Watch weapon energy bar during cooldown

**Expected Results:**
- [ ] Weapon bar depletes during firing
- [ ] Weapon bar recharges over 2 seconds
- [ ] Bar full = ready to fire again

**If FAIL:** Note bar behavior (wrong timing, doesn't deplete, etc.)

---

### **TEST 2.10: Beam Collision Damage**
**Dependency:** TAB target selection must work

**Steps:**
1. Select enemy with TAB
2. Note enemy shield value (e.g., 20/20)
3. Fire beam at enemy for exactly 3 seconds
4. Check enemy shield value

**Expected Results:**
- [ ] Enemy shields decrease by ~3 HP (1 HP per second)
- [ ] Shield quadrant flashes when hit
- [ ] Visible damage numbers or effect

**If FAIL:** Note if shields don't decrease or wrong amount

---

### **TEST 2.11: Beam Shield Flash**
**Dependency:** Beam damage must work

**Steps:**
1. Fire beam at enemy
2. Watch enemy ship when beam hits

**Expected Results:**
- [ ] Shield arc flashes/glows when hit
- [ ] Flash appears on correct quadrant (facing you)
- [ ] Flash fades over ~0.5 seconds

**If FAIL:** Note if no flash or flash in wrong location

---

## 🟠 TIER 2: PIRATE AI

### **TEST 2.12: Pirate Weapon Variety**
**Files Modified:** Ship.js, AIController.js

**Steps:**
1. Spawn/engage 10 different pirate ships
2. Note what weapons each pirate uses

**Expected Results:**
- [ ] Pirates have different weapon combinations
- [ ] See at least 3 different weapon types total
- [ ] Examples: beam+torpedo, disruptor+plasma, torpedo only, etc.

**If FAIL:** Note if all pirates use same weapons (e.g., all torpedoes)

---

### **TEST 2.13: Pirate Close Range Behavior**
**Dependency:** Weapon variety must work

**Steps:**
1. Engage pirate at very close range (<300 pixels / 5 ship lengths)
2. Observe weapons pirate uses over 30 seconds
3. Count beam vs torpedo fires

**Expected Results:**
- [ ] Pirate uses BEAMS more often (~80% of time)
- [ ] Pirate occasionally uses torpedoes (~20%)
- [ ] Clear preference for beams at close range

**If FAIL:** Note weapon usage (only torpedoes, 50/50, etc.)

---

### **TEST 2.14: Pirate Long Range Behavior**
**Dependency:** Close range test must work

**Steps:**
1. Engage pirate at long range (>600 pixels / 10 ship lengths)
2. Observe weapons pirate uses over 30 seconds
3. Count beam vs torpedo fires

**Expected Results:**
- [ ] Pirate uses TORPEDOES more often (~80% of time)
- [ ] Pirate occasionally uses beams (~20%)
- [ ] Clear preference for torpedoes at long range

**If FAIL:** Note weapon usage (only torpedoes, only beams, etc.)

---

### **TEST 2.15: Pirate Medium Range Balance**
**Dependency:** Long range test must work

**Steps:**
1. Engage pirate at medium range (300-600 pixels / 5-10 ship lengths)
2. Observe weapons pirate uses over 30 seconds
3. Count beam vs torpedo fires

**Expected Results:**
- [ ] Pirate uses beams and torpedoes roughly equally (~50/50)
- [ ] Mixes weapon types throughout combat

**If FAIL:** Note weapon usage pattern

---

## 📊 RESULTS SUMMARY

### TIER 1 Foundation (8 tests)
- Passed: __ / 8
- Failed: __ / 8

### TIER 2 Torpedoes (6 tests)
- Passed: __ / 6
- Failed: __ / 6

### TIER 2 Beams (5 tests)
- Passed: __ / 5
- Failed: __ / 5

### TIER 2 Pirate AI (4 tests)
- Passed: __ / 4
- Failed: __ / 4

### **TOTAL**
- **Passed: __ / 23**
- **Failed: __ / 23**

---

## 🐛 FAILURE REPORTING FORMAT

For each failed test, please report:

```
TEST #: [Test name]
STATUS: ❌ FAIL
EXPECTED: [What should happen]
ACTUAL: [What actually happened]
CONSOLE ERRORS: [Any red errors in browser console]
SCREENSHOT: [If visual issue]
```

**Example:**
```
TEST 1.4: TAB Target Selection
STATUS: ❌ FAIL
EXPECTED: Cyan panel appears top-right with target info
ACTUAL: No panel appears at all when pressing TAB
CONSOLE ERRORS: "Cannot read property 'style' of null"
SCREENSHOT: (attach if needed)
```

---

## 🚀 AFTER TESTING

**Once you've completed all tests:**

1. **Report results** - Tell me:
   - How many tests PASSED
   - Which specific tests FAILED
   - Details for each failure (using format above)

2. **I will debug** - I'll:
   - Analyze each failure
   - Identify root cause
   - Apply fixes using debugging methodology
   - Test fixes before continuing

3. **Retest** - You verify fixes work

4. **Continue** - Once all tests PASS, launch next batch of agents for remaining issues

---

**Ready to begin testing! 🧪**
