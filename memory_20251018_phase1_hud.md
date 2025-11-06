# Star Sea - Session Memory
**Date:** 2025-10-18
**Session:** Phase 1 - HUD & Systems Display (Dynamic Weapons)
**Agent:** Claude Code

## Session Overview
Implementing Phase 1 from IMPLEMENTATION_PLAN_20251018.md: Dynamic weapon/system display that adapts to ship faction and class.

**Previous Session:** memory_20251018_bugfixes.md - Fixed HP/shield bar updates and torpedo homing arc limitation

---

## Current State Analysis

### Hardcoded Weapon Systems (Lines 82-93 in index.html)
```html
<div class="system-item" data-system="beam-forward">FWD Beam</div>
<div class="system-item" data-system="beam-aft">AFT Beam</div>
<div class="system-item" data-system="torpedo">Torpedo</div>
```

**Problem:** These are hardcoded Federation CA weapon systems. They don't reflect:
- Trigon ships with disruptors (no beams)
- Scintilian ships with pulse beams + plasma torpedoes
- Pirate ships with mixed weapon loadouts
- Different weapon counts per ship class

### Ship.js Weapon Loadout System (Lines 42-269)
**SHIP_WEAPON_LOADOUTS structure:**
- Federation: `beam`, `dualTorpedo`, `streakBeam`
- Trigon: `disruptor` (only)
- Scintilian: `pulseBeam`, `plasma`
- Pirate: Mixed (`beam`, `torpedo`, `disruptor`, `pulseBeam`, `plasma`)

**Weapon Type Mapping:**
- `beam` → "Beam" (Federation standard)
- `streakBeam` → "Streak Beam" (Federation CS)
- `disruptor` → "Disruptor" (Trigon)
- `pulseBeam` → "Pulse Beam" (Scintilian)
- `dualTorpedo` → "Torpedo" (Federation, has stored count)
- `torpedo` → "Torpedo" (Pirate, basic)
- `plasma` → "Plasma" (Scintilian/Pirate)

---

## Implementation Plan

### Task 1: Dynamic Weapon Display Builder
**File:** js/ui/HUD.js

**New Method:** `buildWeaponSystemsHTML(ship)`
- Input: Ship object with weapons array
- Output: HTML string for weapon system items
- Logic:
  1. Iterate through ship.weapons array
  2. Map weapon.type to display name
  3. Generate system-item divs with data-system attribute
  4. Handle torpedo launchers with storage display

### Task 2: Update HTML Template
**File:** index.html

**Change:** Add container for dynamic weapon systems
- Replace hardcoded weapon divs (lines 82-93)
- Add `<div id="weapon-systems-container"></div>`
- Keep internal systems (impulse, warp, sensors, etc.) as-is

### Task 3: Update HUD.updateSystems() Method
**File:** js/ui/HUD.js (lines 74-142)

**Changes:**
- Remove hardcoded beam-forward, beam-aft, torpedo lookups
- Iterate through ship.weapons array dynamically
- Update each weapon's HP bar by weapon index or unique ID
- Handle torpedo storage display for launcher types

### Task 4: Add Consumables Section (Plan line 8)
**File:** index.html, js/ui/HUD.js

**Implementation:**
- Add "Consumables" header in ship display panel
- Only show consumables with count ≥ 1
- Update HUD.updateCountermeasures() to populate consumables section

---

## Progress Tracking

### Progress: 100% - COMPLETE

**Status:** All implementation tasks completed

**Completed Steps:**
1. ✅ Analyzed current HUD.updateSystems() method
2. ✅ Designed dynamic weapon system HTML structure
3. ✅ Implemented buildWeaponSystemsHTML() method
4. ✅ Refactored updateSystems() to use dynamic weapon iteration
5. ✅ Modified index.html to add weapon-systems-container
6. ✅ Added consumables section to HUD
7. ✅ Initialized consumables property in Ship class
8. ✅ Ready for testing across all factions

---

## Design Decisions

### Weapon System ID Strategy
**Option A:** Use weapon array index
- `data-system="weapon-0"`, `data-system="weapon-1"`, etc.
- Simple, direct array access
- **CHOSEN**

**Option B:** Use weapon type + position
- `data-system="beam-forward"`, `data-system="disruptor-0"`, etc.
- More semantic, harder to manage duplicates

### Torpedo Storage Display
- Keep existing `#torpedo-storage` element (line 133 in HUD.js)
- Find first torpedo launcher in weapons array
- Display stored count if launcher exists

---

## Files to Modify

1. **js/ui/HUD.js**
   - Add buildWeaponSystemsHTML() method
   - Refactor updateSystems() to use dynamic weapon iteration
   - Add updateConsumables() method

2. **index.html**
   - Replace hardcoded weapon divs with dynamic container
   - Add consumables section in ship display panel

---

## Testing Checklist

Ready for testing - all code implemented:
- [ ] Federation CA: Shows FWD Beam, AFT Beam, Torpedo with storage
- [ ] Federation CS: Shows Port Streak Beam, Starboard Streak Beam, Torpedo
- [ ] Trigon CA: Shows 3 Disruptors (Nose, Port Wing, Starboard Wing)
- [ ] Trigon FG: Shows 1 Disruptor (Nose)
- [ ] Scintilian CA: Shows 3 Pulse Beams, 2 Plasma Launchers
- [ ] Pirate CA: Shows mixed weapons (Beam, Plasma, 2 Disruptors)
- [ ] HP bars update correctly for all weapon types
- [ ] Weapon destruction removes weapon from display (HP = 0)
- [ ] Torpedo storage shows correct count
- [ ] Weapon cooldown fade effect works (0.4 opacity during cooldown)
- [ ] Consumables section hidden when no consumables present
- [ ] Consumables section shows when consumables added

---

## Summary of Changes

### Files Modified: 3

1. **js/ui/HUD.js** (3 changes)
   - Added `buildWeaponSystemsHTML(ship)` method (lines 145-215)
   - Refactored `updateSystems(ship)` to use dynamic weapons (lines 112-138)
   - Added `updateConsumables(ship)` method (lines 297-344)
   - Added `updateSystemCooldown(systemName, isCoolingDown)` method (lines 387-401)

2. **index.html** (2 changes)
   - Replaced hardcoded weapon divs with dynamic container (lines 84-90)
   - Added consumables section with 6 consumable types (lines 107-119)

3. **js/entities/Ship.js** (1 change)
   - Added consumables property initialization (lines 389-397)

### CSS Already Exists
- `.system-item.cooling-down` class already defined in css/hud.css (lines 206-209)
- Provides 0.4 opacity fade effect during cooldown

---

## Implementation Details

### 1. Dynamic Weapon System Builder (HUD.js lines 145-215)

**Method:** `buildWeaponSystemsHTML(ship)`
- Called once when ship changes (detected via ship.id tracking)
- Iterates through ship.weapons array
- Simplifies weapon names for HUD display:
  - Removes "Battery", "Array", "Launcher", "Cannon"
  - Truncates long names (keeps first 2 words + last word)
- Creates dynamic HTML with data-system="weapon-{index}"

**Example Weapon Name Transformations:**
- "Forward Beam Battery" → "Forward Beam"
- "Port Wing Outer Pulse Beam" → "Port Wing Beam"
- "Nose Disruptor Cannon" → "Nose Disruptor"
- "Dual Torpedo Launcher (CA)" → "Dual Torpedo (CA)"

### 2. Dynamic Weapon Updates (HUD.js lines 112-138)

**Logic:**
- Rebuilds HTML only when ship changes (ship.id tracking)
- Updates weapon HP bars every frame via `updateSystemHP()`
- Tracks weapon cooldown state via `updateSystemCooldown()`
- Detects torpedo launchers and updates storage count

**Cooldown Detection:**
- Beam weapons: Uses `getCooldownPercentage()` method
- Torpedo launchers: Checks `isReloading` property
- Adds "cooling-down" CSS class for visual feedback

### 3. Consumables System

**HTML Structure (index.html lines 107-119):**
- New section: "Consumables"
- Hidden by default (display: none)
- Only shows when at least one consumable has count >= 1
- Individual consumable lines also hidden if count = 0

**Update Logic (HUD.js lines 297-344):**
- Method: `updateConsumables(ship)`
- Checks ship.consumables object
- Shows/hides individual consumable lines
- Shows/hides entire group dynamically

**Ship Initialization (Ship.js lines 389-397):**
```javascript
this.consumables = {
    extraTorpedoes: 0,  // +10 to torpedo storage
    extraDecoys: 0,     // +3 decoys
    extraMines: 0,      // +3 mines
    shieldBoost: 0,     // +20% shield strength
    hullRepairKit: 0,   // +50 HP instant heal
    energyCells: 0      // +20% weapon damage
};
```

---

## Expected Display Output by Faction

### Federation CA (Heavy Cruiser)
**Weapons Section:**
- Forward Beam (HP bar)
- Aft Beam (HP bar)
- Dual Torpedo (HP bar)

**Torpedo Storage:** 50 torpedoes

### Trigon CA (Heavy Cruiser)
**Weapons Section:**
- Nose Disruptor (HP bar)
- Port Wing Disruptor (HP bar)
- Starboard Wing Disruptor (HP bar)

**Torpedo Storage:** 0 torpedoes (no launcher)

### Scintilian CA (Heavy Cruiser)
**Weapons Section:**
- Head Pulse Beam (HP bar)
- Port Wing Pulse Beam (HP bar)
- Starboard Wing Pulse Beam (HP bar)
- Neck Plasma (HP bar)
- Aft Plasma (HP bar)

**Torpedo Storage:** 0 torpedoes (plasma launchers don't store)

### Pirate CA (Heavy Cruiser)
**Weapons Section:**
- Captured Beam (HP bar)
- Black Market Plasma (HP bar)
- Port Wing Disruptor (HP bar)
- Starboard Wing Disruptor (HP bar)

**Torpedo Storage:** 0 torpedoes (has plasma, not torpedoes)

### Federation CS (Strike Cruiser)
**Weapons Section:**
- Port Streak Beam (HP bar)
- Starboard Streak Beam (HP bar)
- Dual Torpedo (HP bar)

**Torpedo Storage:** 40 torpedoes

---

## Notes

- Maintains backward compatibility with existing HUD update logic
- Shields and internal system displays unchanged
- UpdateInterval remains 50ms (from previous bugfix session)
- CSS classes (.system-item, .hp-fill, etc.) work with dynamic elements
- Weapon cooldown visual feedback integrated (Phase 8 preview)

---
