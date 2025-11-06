# Beam Collision Debug - Testing Instructions

## Changes Made

I've added debug logging to three critical points in the beam firing and collision system:

### 1. Beam Creation (Engine.js line 1603-1608)
**Logs:** When continuous beams are fired
**Output:** Shows each beam's properties:
- `type` - should be 'projectile'
- `projectileType` - should be 'beam'
- `active` - should be `true`
- `damage` - should be a number (usually 1-2)

**Example Output:**
```
🔫 Created 2 beam projectiles [{type: 'projectile', projectileType: 'beam', active: true, damage: 1}, ...]
```

### 2. Collision Detection Loop (Engine.js line 1885-1889)
**Logs:** How many active beam projectiles are being checked for collisions
**Output:** Count of beams vs total projectiles

**Example Output:**
```
🎯 Checking collisions for 4 active beam projectiles (total: 12)
```

### 3. Beam Hit Detection (Engine.js line 1920-1921)
**Logs:** When a beam actually hits an entity
**Output:** What was hit and how much damage

**Example Output:**
```
💥 BEAM HIT! Entity: ship (IKS Kahless), Damage: 1
```

---

## Testing Protocol

### Step 1: Reload the Game
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Start a new game
3. Open the browser console (F12)

### Step 2: Fire at Enemy Ship
1. Find an enemy ship
2. Hold LMB (left mouse button) aimed at the enemy
3. Watch the console output

### Step 3: Analyze Console Output

#### Scenario A: Beams ARE Being Created
**You should see:**
```
🔫 Created 2 beam projectiles [...]
```
**Every frame** while holding LMB.

**If you DON'T see this:**
- Problem is in ContinuousBeam.fire() or Ship.fireContinuousBeams()
- Beams aren't being created at all

#### Scenario B: Beams ARE in Collision Detection
**You should see:**
```
🎯 Checking collisions for X active beam projectiles (total: Y)
```

**If you see this:**
- Beams are being created and added to projectiles array
- Collision detection loop is processing them

**If you DON'T see this:**
- Beams might be filtered out before collision check
- Check if beams are being removed too quickly (lifetime issue)

#### Scenario C: Beams ARE Hitting
**You should see:**
```
💥 BEAM HIT! Entity: ship (...), Damage: 1
```

**If you see this:**
- **COLLISION DETECTION IS WORKING!**
- Problem might be with damage application
- Check if enemy HP is actually decreasing

**If you DON'T see this despite seeing beams in collision loop:**
- Distance check is failing
- Hit radius calculation is wrong
- Grace period is too long
- sourceShip check is blocking hits

---

## Diagnostic Scenarios

### Problem 1: No Beam Creation Logs
**Symptoms:** No "🔫 Created" messages
**Cause:** fireContinuousBeams() isn't returning projectiles
**Check:**
- Is isFiring true on the weapon?
- Does ContinuousBeam.fire() return a BeamProjectile?

### Problem 2: Beams Created But Not in Collision Loop
**Symptoms:** See "🔫 Created" but NOT "🎯 Checking"
**Cause:** Beams are being filtered out or destroyed before collision check
**Check:**
- Beam lifetime (CONFIG.BEAM_LIFETIME)
- Are beams being destroyed immediately?
- Filter on line 2197: `this.projectiles = this.projectiles.filter(p => p.active)`

### Problem 3: Beams in Loop But No Hits
**Symptoms:** See "🎯 Checking" but NOT "💥 BEAM HIT"
**Cause:** Distance check or grace period preventing hits
**Check:**
- Grace time (0.05 seconds for beams) - might be too long?
- Hit radius calculation
- sourceShip check blocking hits

### Problem 4: Beams Hit But No Damage
**Symptoms:** See "💥 BEAM HIT" but enemy HP doesn't decrease
**Cause:** Damage application broken
**Check:**
- Is entity.systems defined?
- Is shield absorption working correctly?
- Is hull HP actually decreasing?

---

## Quick Fix Reference

### If beams have wrong properties:
```javascript
// Check BeamProjectile constructor (BeamProjectile.js)
constructor(config) {
    super(config);
    this.projectileType = 'beam'; // MUST be 'beam'
    this.damage = config.damage || 1; // MUST have damage
}
```

### If beams destroyed too fast:
```javascript
// Check CONFIG.BEAM_LIFETIME (config.js)
BEAM_LIFETIME: 0.5, // Increase if too short
```

### If grace period too long:
```javascript
// Check Engine.js line 1897
const graceTime = (projectile.projectileType === 'beam') ? 0.05 : 0.25;
// Try reducing to 0.01 or 0
```

### If hit radius wrong:
```javascript
// Check Engine.js line 1915
const hitRadius = entity.radius || entity.getShipSize?.() || 20;
// Try increasing hitRadius for testing: hitRadius * 2
```

---

## Expected Behavior

**When beams are working correctly, you should see:**

1. **While holding LMB:**
```
🔫 Created 2 beam projectiles [...]
🎯 Checking collisions for 4 active beam projectiles (total: 12)
🔫 Created 2 beam projectiles [...]
🎯 Checking collisions for 6 active beam projectiles (total: 14)
💥 BEAM HIT! Entity: ship (IKS Kahless), Damage: 1
💥 BEAM HIT! Entity: ship (IKS Kahless), Damage: 1
[Audio: beam-hit sound]
[Visual: Blue impact particles]
```

2. **Enemy HP should visibly decrease**
3. **Systems should take damage** (see HUD if targeting enemy)
4. **Ship should eventually explode**

---

## Next Steps After Testing

1. **Copy the console output** (first 20-30 lines of beam firing)
2. **Report which scenario matches** (A, B, C, or 1-4)
3. **Note enemy HP behavior** - Does it decrease? Stay the same?

Based on the console output, we can pinpoint exactly where the beam collision system is breaking and apply the appropriate fix.
