# Star Sea - Session Memory: Fighter Beam Jamming + 90° Arc Restrictions
**Date:** 2025-10-28
**Session:** Add Beam Jamming to Fighters & Enforce 90° Forward Arc for All Craft
**Agent:** Claude Code

## Task Overview
1. **Add Beam Jamming to Fighter.js** (copy from Drone.js)
   - Add `jammingPower` property
   - Add `applyBeamJamming()` method
   - Call jamming when firing beams at ships

2. **Add 90° Forward Arc Restriction** to all craft that don't have it
   - Fighter.js
   - Bomber.js
   - Shuttle.js
   - (Drone.js already has it)

## Investigation

### 1. Drone.js Beam Jamming Implementation
**Source:** `js/entities/Drone.js`
- **Line 39**: `this.jammingPower = 0.3;` - Adds 0.3s cooldown to enemy beam weapons per hit
- **Lines 221-237**: `applyBeamJamming(targetShip)` method
  - Iterates through target ship's weapons
  - Finds beam weapons (type === 'beam' or weaponType === 'beam')
  - Adds `this.jammingPower` to weapon's `lastFireTime`
  - Displays console message if target is player
- **Lines 207-219**: `fireBeam(target)` method
  - Checks if target is a ship
  - Calls `this.applyBeamJamming(target)` if it is

### 2. Forward Arc Method in Drone.js
**Source:** `js/entities/Drone.js` lines 200-205
```javascript
isTargetInForwardArc(targetX, targetY) {
    const angleToTarget = MathUtils.angleBetween(this.x, this.y, targetX, targetY);
    const angleDiff = MathUtils.normalizeAngle(angleToTarget - this.rotation);
    return Math.abs(angleDiff) <= 45; // 90° arc total (±45°)
}
```

### 3. Current Craft Weapon Firing

#### Fighter.js (lines 136-139, 183-186)
- **Attack Mission (lines 136-139)**: Fires if `nearestDistance <= this.beamRange && this.weaponCooldown <= 0` - NO ARC CHECK
- **Defense Mission (lines 183-186)**: Fires if `nearestThreatDistance <= this.beamRange && this.weaponCooldown <= 0` - NO ARC CHECK
- **Fire Method (lines 276-291)**: `fireBeam(targetX, targetY)` - Creates BeamProjectile, no jamming

#### Bomber.js (lines 144-147, 149-153, 205-208, 210-213)
- **Attack Mission**: Fires beam (lines 144-147) and torpedo (lines 149-153) - NO ARC CHECK
- **Defense Mission**: Fires beam (lines 205-208) and torpedo (lines 210-213) - NO ARC CHECK
- **Fire Methods (lines 328-362)**: `fireBeam()` and `fireTorpedo()` - No jamming

#### Shuttle.js (lines 205-208, 251-254)
- **Attack Mission (lines 205-208)**: Fires if `nearestDistance <= this.beamRange && this.weaponCooldown <= 0` - NO ARC CHECK
- **Defense Mission (lines 251-254)**: Fires if `targetDistance <= this.beamRange && this.weaponCooldown <= 0` - NO ARC CHECK
- **Fire Method (lines 401-416)**: `fireBeam(targetX, targetY)` - Creates BeamProjectile, no jamming

## Implementation Plan

### Step 1: Add Beam Jamming to Fighter.js
1. Add `this.jammingPower = 0.3;` to constructor (after line 34)
2. Add `applyBeamJamming(targetShip)` method (copy from Drone.js)
3. Update `fireBeam(targetX, targetY)` to:
   - Accept `target` parameter (entity reference, not just coordinates)
   - Call `applyBeamJamming(target)` if target is a ship

### Step 2: Add Arc Check to Fighter.js
1. Add `isTargetInForwardArc(targetX, targetY)` method (copy from Drone.js)
2. Update firing in `executeAttackMission()` (line 136)
3. Update firing in `executeDefenseMission()` (line 183)

### Step 3: Add Arc Check to Bomber.js
1. Add `isTargetInForwardArc(targetX, targetY)` method
2. Update beam firing in `executeAttackMission()` (line 144)
3. Update torpedo firing in `executeAttackMission()` (line 150)
4. Update beam firing in `executeDefenseMission()` (line 205)
5. Update torpedo firing in `executeDefenseMission()` (line 210)

### Step 4: Add Arc Check to Shuttle.js
1. Add `isTargetInForwardArc(targetX, targetY)` method
2. Update firing in `executeAttackMission()` (line 205)
3. Update firing in `executeDefenseMission()` (line 251)

## Implementation Complete

### Fighter.js - Beam Jamming + Arc Restriction

**Lines Modified:**

1. **Line 36-37** - Added `jammingPower` property:
   ```javascript
   // Special ability: Beam Jamming (like Drones)
   this.jammingPower = 0.3; // Adds 0.3s to target ship beam cooldown per hit
   ```

2. **Lines 138-144** - Updated Attack Mission firing with arc check:
   ```javascript
   // Fire at enemy if in range and in forward arc
   if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
       if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
           this.fireBeam(nearestEnemy.x, nearestEnemy.y, nearestEnemy);
           this.weaponCooldown = 0.5; // Fast firing rate
       }
   }
   ```

3. **Lines 188-193** - Updated Defense Mission firing with arc check:
   ```javascript
   if (nearestThreatDistance <= this.beamRange && this.weaponCooldown <= 0) {
       if (this.isTargetInForwardArc(nearestThreat.x, nearestThreat.y)) {
           this.fireBeam(nearestThreat.x, nearestThreat.y, nearestThreat);
           this.weaponCooldown = 0.5;
       }
   }
   ```

4. **Lines 283-288** - Added `isTargetInForwardArc()` method:
   ```javascript
   isTargetInForwardArc(targetX, targetY) {
       const angleToTarget = MathUtils.angleBetween(this.x, this.y, targetX, targetY);
       const angleDiff = MathUtils.normalizeAngle(angleToTarget - this.rotation);
       return Math.abs(angleDiff) <= 45; // 90° arc total (±45°)
   }
   ```

5. **Lines 290-310** - Updated `fireBeam()` to accept target and apply jamming:
   ```javascript
   fireBeam(targetX, targetY, target = null) {
       // Create beam projectile
       const beam = new BeamProjectile({
           x: this.x,
           y: this.y,
           rotation: this.rotation,
           targetX: targetX,
           targetY: targetY,
           damage: this.beamDamage,
           range: this.beamRange,
           speed: CONFIG.BEAM_SPEED,
           sourceShip: this
       });

       // Apply beam jamming if target is a ship
       if (target && target.type === 'ship') {
           this.applyBeamJamming(target);
       }

       eventBus.emit('fighter-fired-beam', { fighter: this, projectile: beam });
   }
   ```

6. **Lines 312-328** - Added `applyBeamJamming()` method:
   ```javascript
   applyBeamJamming(targetShip) {
       // Add cooldown delay to target ship's beam weapons
       if (targetShip.weapons) {
           for (const weapon of targetShip.weapons) {
               if (weapon.type === 'beam' || weapon.weaponType === 'beam') {
                   // Add jamming delay to weapon cooldown
                   if (weapon.lastFireTime !== undefined) {
                       weapon.lastFireTime += this.jammingPower;
                   }
               }
           }
           // Visual feedback for jammed ship (could add indicator)
           if (targetShip.isPlayer) {
               console.log('⚡ Ship beams jammed by Fighter! (+0.3s cooldown)');
           }
       }
   }
   ```

---

### Bomber.js - Arc Restriction

**Lines Modified:**

1. **Lines 143-157** - Updated Attack Mission with arc checks for beam and torpedo:
   ```javascript
   // Fire beam if in range and in forward arc
   if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
       if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
           this.fireBeam(nearestEnemy.x, nearestEnemy.y);
           this.weaponCooldown = 1.0; // Slower firing rate than fighters
       }
   }

   // Fire torpedo if in range and cooldown ready and in forward arc
   if (nearestDistance <= this.torpedoRange && this.torpedoCooldown <= 0) {
       if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
           this.fireTorpedo(nearestEnemy.x, nearestEnemy.y, nearestEnemy);
           this.torpedoCooldown = 3.0; // 3 second torpedo cooldown
       }
   }
   ```

2. **Lines 209-221** - Updated Defense Mission with arc checks for beam and torpedo:
   ```javascript
   if (distance <= this.beamRange && this.weaponCooldown <= 0) {
       if (this.isTargetInForwardArc(highestPriorityThreat.x, highestPriorityThreat.y)) {
           this.fireBeam(highestPriorityThreat.x, highestPriorityThreat.y);
           this.weaponCooldown = 1.0;
       }
   }

   if (distance <= this.torpedoRange && this.torpedoCooldown <= 0 && highestPriorityThreat.type === 'ship') {
       if (this.isTargetInForwardArc(highestPriorityThreat.x, highestPriorityThreat.y)) {
           this.fireTorpedo(highestPriorityThreat.x, highestPriorityThreat.y, highestPriorityThreat);
           this.torpedoCooldown = 3.0;
       }
   }
   ```

3. **Lines 336-341** - Added `isTargetInForwardArc()` method:
   ```javascript
   isTargetInForwardArc(targetX, targetY) {
       const angleToTarget = MathUtils.angleBetween(this.x, this.y, targetX, targetY);
       const angleDiff = MathUtils.normalizeAngle(angleToTarget - this.rotation);
       return Math.abs(angleDiff) <= 45; // 90° arc total (±45°)
   }
   ```

---

### Shuttle.js - Arc Restriction

**Lines Modified:**

1. **Lines 204-210** - Updated Attack Mission with arc check:
   ```javascript
   // Fire at enemy if in range and in forward arc
   if (nearestDistance <= this.beamRange && this.weaponCooldown <= 0) {
       if (this.isTargetInForwardArc(nearestEnemy.x, nearestEnemy.y)) {
           this.fireBeam(nearestEnemy.x, nearestEnemy.y);
           this.weaponCooldown = 1.0; // 1 second cooldown
       }
   }
   ```

2. **Lines 252-258** - Updated Defense Mission with arc check:
   ```javascript
   // Fire at target if in range and in forward arc
   if (targetDistance <= this.beamRange && this.weaponCooldown <= 0) {
       if (this.isTargetInForwardArc(target.x, target.y)) {
           this.fireBeam(target.x, target.y);
           this.weaponCooldown = 1.0;
       }
   }
   ```

3. **Lines 405-410** - Added `isTargetInForwardArc()` method:
   ```javascript
   isTargetInForwardArc(targetX, targetY) {
       const angleToTarget = MathUtils.angleBetween(this.x, this.y, targetX, targetY);
       const angleDiff = MathUtils.normalizeAngle(angleToTarget - this.rotation);
       return Math.abs(angleDiff) <= 45; // 90° arc total (±45°)
   }
   ```

---

## Summary of Changes

### Files Modified: 3

1. **Fighter.js** (7 changes)
   - Added `jammingPower = 0.3` property (line 37)
   - Added `isTargetInForwardArc()` method (lines 283-288)
   - Added `applyBeamJamming()` method (lines 312-328)
   - Updated `fireBeam()` to accept target parameter and apply jamming (lines 290-310)
   - Updated Attack Mission firing with arc check (lines 138-144)
   - Updated Defense Mission firing with arc check (lines 188-193)

2. **Bomber.js** (3 changes)
   - Added `isTargetInForwardArc()` method (lines 336-341)
   - Updated Attack Mission with arc checks for beam + torpedo (lines 143-157)
   - Updated Defense Mission with arc checks for beam + torpedo (lines 209-221)

3. **Shuttle.js** (3 changes)
   - Added `isTargetInForwardArc()` method (lines 405-410)
   - Updated Attack Mission with arc check (lines 204-210)
   - Updated Defense Mission with arc check (lines 252-258)

---

## Verification Checklist

### Fighter Beam Jamming:
- ✅ Property `jammingPower = 0.3` added to constructor
- ✅ Method `applyBeamJamming(targetShip)` added
- ✅ Method `fireBeam()` updated to accept target parameter
- ✅ Jamming applied when target is a ship
- ✅ Console message displayed when player ship is jammed

### 90° Forward Arc Restrictions:
- ✅ Fighter.js has `isTargetInForwardArc()` method
- ✅ Bomber.js has `isTargetInForwardArc()` method
- ✅ Shuttle.js has `isTargetInForwardArc()` method
- ✅ Drone.js already had `isTargetInForwardArc()` method (no changes needed)

### Firing Logic Updated:
- ✅ Fighter Attack Mission checks arc before firing
- ✅ Fighter Defense Mission checks arc before firing
- ✅ Bomber Attack Mission checks arc before firing beams
- ✅ Bomber Attack Mission checks arc before firing torpedoes
- ✅ Bomber Defense Mission checks arc before firing beams
- ✅ Bomber Defense Mission checks arc before firing torpedoes
- ✅ Shuttle Attack Mission checks arc before firing
- ✅ Shuttle Defense Mission checks arc before firing

---

## Testing Instructions

### Test 1: Fighter Beam Jamming
1. Start game and launch fighters
2. Let fighters engage enemy ships
3. Watch console for message: "⚡ Ship beams jammed by Fighter! (+0.3s cooldown)"
4. Verify player ship beam cooldown increases when hit by enemy fighters

### Test 2: Arc Restrictions
1. Observe fighters/bombers/shuttles in combat
2. Verify they only fire when facing target (within 90° forward arc)
3. If craft is pointed away from target (>45° off-axis), it should NOT fire
4. Craft should turn toward target before firing

### Test 3: Bomber Torpedo Arc
1. Launch bombers against enemy ships
2. Verify bombers only fire torpedoes when facing target
3. Bombers should turn to face target before launching torpedoes

---

## Progress: 100%

**Status:** COMPLETE - All craft now have 90° forward arc restrictions, Fighters have beam jamming
