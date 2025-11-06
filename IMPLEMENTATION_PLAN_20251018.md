# IMPLEMENTATION PLAN - Star Sea Game Enhancement

## Executive Summary

Based on analysis of the 20251018 PLAN.txt file and current codebase, this plan organizes 54 discrete tasks into 10 logical phases. The plan prioritizes quick wins, addresses critical bugs, and structures complex feature additions for systematic implementation.

**Completed Tasks:** 2/54 (Speed/acceleration rebalance, Weapon range adjustments)
**Remaining:** 52 tasks across 10 phases
**Estimated Total Time:** 30-40 hours

---

## PHASE 1: HUD & Systems Display (HIGH PRIORITY)
**Difficulty:** Complex | **Time Estimate:** 4-6 hours
**Dependencies:** None

### Tasks:
1. **Dynamic Weapon/System Display** (Plan lines 3-6)
   - Remove hardcoded Federation CA weapon systems from HUD
   - Build dynamic HTML elements based on ship faction/class
   - Files: `js/ui/HUD.js` (updateSystems method ~line 74-142)
   - Implementation: Add `buildWeaponSystems()` method that reads from `Ship.weapons` array and creates appropriate UI elements

2. **Consumables Section** (Plan line 8)
   - Add "Consumables" header under Systems section in HUD
   - Files: `index.html` (ship display panel), `js/ui/HUD.js`
   - Only show items with count ≥ 1

3. **Torpedo Storage Display** (Plan lines 9-11)
   - Show "Torpedoes Stored: X" for ships with torpedo launchers
   - Handle "Extra Torpedoes" consumable adding to stored value
   - Files: `js/ui/HUD.js` (already has torpedo-storage element at line 133)

**Approach:**
- Start by analyzing current weapon loadout system in `Ship.js` (SHIP_WEAPON_LOADOUTS, lines 42-269)
- Create mapping from weapon types to UI display format
- Faction-specific rendering: Federation (beams/torpedoes), Trigon (disruptors), Scintilian (pulse beams/plasma), Pirate (mixed)

---

## PHASE 2: Mission Briefing Loadout System (HIGH PRIORITY)
**Difficulty:** Medium | **Time Estimate:** 3-4 hours
**Dependencies:** Phase 1 (consumables display)

### Tasks:
1. **Loadout Selection UI** (Plan lines 13-16)
   - Create loadout panel in mission briefing screen
   - LMB = add consumable, RMB = remove consumable
   - Display selected consumables list
   - Enforce ship-specific maximum consumables
   - Files: `index.html` (mission-briefing section), `js/ui/MissionUI.js`, CSS for styling

2. **Consumable Types**
   - Extra Torpedoes (+10 to torpedo storage)
   - Extra Decoys (+3)
   - Extra Mines (+3)
   - Shield Boost (+20% shield strength)
   - Hull Repair Kit (+50 HP)
   - Energy Cells (+20% weapon damage)

**Approach:**
- Add loadout data structure to Ship class
- Create UI in mission briefing with consumable buttons
- Implement consumable effects in Ship initialization

---

## PHASE 3: Movement & Input Enhancements (MEDIUM PRIORITY)
**Difficulty:** Quick-Medium | **Time Estimate:** 2-3 hours
**Dependencies:** None

### Tasks:
1. **Double-Tap Turn Rate Boost** (Plan line 18)
   - Detect double-tap on A or D keys
   - Multiply turn rate by 3x for 0.5 seconds
   - Files: `js/core/InputManager.js`, `js/core/Engine.js` (handlePlayerInput ~line 1599)
   - Implementation: Add timestamp tracking, detect double-tap within 300ms window

2. **X Key Emergency Stop** (Plan lines 52-53)
   - Full stop (zero velocity)
   - Temporarily boost forward shield if moving forward, aft shield if moving backward
   - Allow boost above normal maximum (e.g., 120% of max shield)
   - Files: `js/core/Engine.js` (add event handler), `js/entities/Ship.js` (add emergencyStop method)

**Approach:**
- Add double-tap detection to InputManager
- Emit 'emergency-stop' event on X key
- Calculate shield boost based on movement direction
- Apply temporary shield boost with decay timer

---

## PHASE 4: Weapon Firing Points & Visual Feedback (MEDIUM PRIORITY)
**Difficulty:** Medium | **Time Estimate:** 3-4 hours
**Dependencies:** None

### Tasks:
1. **Visual Firing Points** (Plan lines 20-22)
   - Beams: Orange circles (already exist for Fed CA/CS)
   - Torpedoes: Red circles below orange "loaded" indicators
   - Disruptors: Blue circles
   - Pulse Beams: Hollow green circles
   - Plasma Torpedoes: Filled green circles
   - Files: `js/rendering/ShipRenderer.js`, `js/rendering/ShipGraphics.js`

2. **Weapon Destruction Visual** (Plan line 20)
   - Delete firing point graphics when weapon HP = 0
   - Files: `js/rendering/ShipRenderer.js` (check weapon.hp in render loop)

**Approach:**
- Extend WEAPON_POSITIONS in Ship.js with firing point metadata
- Add renderFiringPoints method to ShipRenderer
- Check weapon.hp > 0 before rendering each point
- Use color/shape based on weapon type

---

## PHASE 5: Lock-On System Fixes (HIGH PRIORITY - BUG FIX)
**Difficulty:** Medium | **Time Estimate:** 2-3 hours
**Dependencies:** None

### Tasks:
1. **Reticle Rotation Behavior** (Plan line 36)
   - Only rotate when near eligible target
   - Speed up rotation as lock progresses
   - Stop and turn red when lock achieved (2-3 seconds)
   - Files: `js/systems/TargetingSystem.js`, `js/core/Engine.js` (lines 1122-1130 already have partial implementation)
   - Fix: Reticle CSS currently always rotating

2. **Auto-Aim Bonuses** (Plan line 36)
   - Torpedoes: Home in on locked target, up to 15°/second course correction
   - Beams/Disruptors: Deviate up to 15° from center reticle to score hits
   - Files: `js/entities/projectiles/Torpedo.js`, `js/components/weapons/BeamWeapon.js`, `js/components/weapons/Disruptor.js`

3. **Enemy Info Panel** (Plan lines 36, 38-39)
   - Show locked target info in bottom-left panel
   - Player panel: Green header (top-left)
   - Enemy panel: Red header (bottom-left)
   - Files: `index.html` (add enemy-info-panel), `js/ui/HUD.js` (add updateEnemyInfo method)

4. **Remove F Key** (Plan line 34)
   - Remove "F - Lock Target" from controls summary
   - Lock-on is now automatic via mouse hover
   - Files: `index.html` (controls panel)

**Approach:**
- Fix CSS animation in index.html (add/remove classes dynamically)
- Implement homing logic in Torpedo.update()
- Add auto-aim deviation to weapon fire methods
- Create enemy info panel mirroring player panel structure

---

## PHASE 6: Craft Launch System Overhaul (MEDIUM PRIORITY)
**Difficulty:** Medium | **Time Estimate:** 2-3 hours
**Dependencies:** None

### Tasks:
1. **Drone/Fighter/Bomber Key Bindings** (Plan lines 24-26)
   - SHIFT + 1-6: Select Drone mission, second press launches
   - CTRL + 1-6: Select Fighter mission, second press launches
   - ALT + 1-6: Select Bomber mission, second press launches
   - Files: `js/core/InputManager.js`, `js/systems/BaySystem.js`, `js/core/Engine.js`

**Approach:**
- Extend InputManager to detect modifier keys (shift/ctrl/alt)
- Add mission selection state to BaySystem
- Implement two-press launch system (select → confirm)
- Display selected mission in HUD before launch

---

## PHASE 7: Tractor Beam Improvements (MEDIUM PRIORITY)
**Difficulty:** Medium | **Time Estimate:** 2-3 hours
**Dependencies:** None

### Tasks:
1. **Fix Static Hold** (Plan line 28)
   - Tractor beam should hold target static in relation to player ship
   - Currently not working correctly
   - Files: `js/systems/TractorBeamSystem.js`

2. **Tractor Beam Timer Bar** (Plan line 28)
   - Add bar below target ship showing time remaining
   - Empties from full (right) to empty (left)
   - Shows cooldown before tractor can be reactivated
   - Files: `js/systems/TractorBeamSystem.js` (render method), `js/rendering/Renderer.js`

**Approach:**
- Review TractorBeamSystem physics application
- Add relative position locking (target position = player position + offset)
- Render timer bar in world space below target ship

---

## PHASE 8: System Damage Visual Feedback (QUICK WIN)
**Difficulty:** Quick | **Time Estimate:** 1 hour
**Dependencies:** None

### Tasks:
1. **Cooldown Fade Effect** (Plan line 30)
   - When system is on cooldown, fade out its title and HP bar in ship display
   - Files: `js/ui/HUD.js` (add CSS class 'cooling-down'), CSS file
   - Implementation: Add opacity: 0.4 style when system is cooling down

**Approach:**
- Add cooldown tracking to SystemManager
- Update HUD.updateSystems() to add 'cooling-down' class
- Add CSS fade effect for .cooling-down class

---

## PHASE 9: Bug Fixes (HIGH PRIORITY)
**Difficulty:** Quick-Medium | **Time Estimate:** 2-3 hours
**Dependencies:** None

### Tasks:
1. **HP/Shield Bar Updates** (Plan line 50)
   - Damage not reducing HP bars and shield bars in Display panel
   - Files: `js/ui/HUD.js` (updateShields ~line 56, updateSystems ~line 74)
   - Root cause: Check if event listeners are properly connected, verify HUD update frequency

2. **Torpedo Homing Arc Limit** (Plan lines 42-43)
   - Torpedoes should not home in once target is behind them (rear 270° arc)
   - Files: `js/entities/projectiles/Torpedo.js` (update method)
   - Add angle check before applying homing force

**Approach:**
- Debug HP/shield update flow from takeDamage → eventBus → HUD
- Add rear arc detection to Torpedo homing logic
- Test with locked torpedoes chasing maneuvering targets

---

## PHASE 10: Advanced Features (LOW PRIORITY)
**Difficulty:** Complex | **Time Estimate:** 8-12 hours total
**Dependencies:** Various

### Tasks:
1. **Transporter System** (Plan line 32)
   - T key toggles transporters on/off
   - Auto-execute transport attack when eligible target with shields down in range
   - Add Transporter status to information panel (On/Off)
   - Files: `js/systems/TransporterSystem.js` (already exists), `js/core/Engine.js`, `js/ui/HUD.js`

2. **Sensor Ping** (Plan line 44)
   - P key pings sensors
   - Double range for 10 seconds
   - Reveal cloaked ships on mini-map when ping radiates past them
   - Ships fade out after 10 seconds
   - Files: `js/core/Engine.js`, `js/ui/UIRenderer.js` (renderMinimap), `js/entities/Ship.js`

3. **Scintilian Cloaking System** (Plan lines 46-49)
   - F toggles cloak on/off
   - 30-second cooldown after cloaking/decloaking
   - Cloaked: Invisible, 0 shields, cannot fire or lock-on
   - Can charge plasma torpedoes while cloaked (RMB hold)
   - Release RMB while cloaked = torpedo fizzles (lost with no effect)
   - Files: `js/systems/CloakingSystem.js` (may need creation), `js/entities/Ship.js`

4. **Weapon Range Adjustments** ✅ COMPLETED
   - Doubled disruptor ranges
   - Increased beam ranges by 50%
   - Files: `js/config.js`

5. **Speed/Acceleration Rebalance** ✅ COMPLETED
   - Reduced all ship accelerations/decelerations by 30%
   - Doubled maximum forward and rearward speed limits
   - Files: `js/config.js`

**Approach:**
- Transporter: Add auto-target detection loop, check shield status, execute boarding action
- Sensor Ping: Create expanding circle animation, temporarily add cloaked ships to minimap
- Cloaking: Implement state machine (cloaked/decloaked/cooldown), disable shields/weapons when cloaked

---

## FILES TO MODIFY (Summary)

### Core Game Files:
- `js/core/Engine.js` - Input handling, advanced systems integration
- `js/core/InputManager.js` - Double-tap detection, modifier keys

### Ship & Combat:
- `js/entities/Ship.js` - Consumables, emergency stop, cloaking
- `js/entities/projectiles/Torpedo.js` - Homing arc limits, auto-aim
- `js/components/weapons/BeamWeapon.js` - Auto-aim deviation
- `js/components/weapons/Disruptor.js` - Auto-aim deviation

### UI & Display:
- `js/ui/HUD.js` - Dynamic weapon display, enemy info panel, consumables, cooldown fade
- `js/ui/MissionUI.js` - Loadout selection interface
- `js/rendering/UIRenderer.js` - Sensor ping visualization
- `js/rendering/ShipRenderer.js` - Firing points, weapon destruction visuals
- `js/rendering/ShipGraphics.js` - Faction-specific firing point rendering

### Systems:
- `js/systems/TargetingSystem.js` - Reticle rotation, lock-on timing
- `js/systems/TractorBeamSystem.js` - Static hold fix, timer bar
- `js/systems/BaySystem.js` - Craft launch key bindings
- `js/systems/TransporterSystem.js` - Auto-attack mode
- `js/systems/CloakingSystem.js` - (May need creation for Scintilian cloak)

### HTML/CSS:
- `index.html` - Enemy info panel, consumables section, loadout UI, controls update
- `css/main.css` - Cooldown fade, firing point colors, enemy panel styling

---

## RECOMMENDED IMPLEMENTATION ORDER

1. **Phase 9** (Bug Fixes) - Fix critical HP/shield display issues
2. **Phase 5** (Lock-On) - High-priority gameplay enhancement
3. **Phase 1** (HUD/Systems) - Foundation for other features
4. **Phase 3** (Movement) - Quick wins for better feel
5. **Phase 4** (Firing Points) - Visual polish
6. **Phase 8** (Cooldown Fade) - Quick win
7. **Phase 2** (Loadout System) - Requires Phase 1 complete
8. **Phase 7** (Tractor Beam) - Medium priority fixes
9. **Phase 6** (Craft Launch) - Nice-to-have enhancement
10. **Phase 10** (Advanced Features) - Complex, low priority, implement as time allows

---

## TESTING STRATEGY

After each phase:
1. Manual testing of affected features
2. Verify no regressions in related systems
3. Check console for errors
4. Test across different ship classes and factions
5. Validate HUD updates correctly

**High-Risk Areas:**
- Phase 1 (Dynamic HUD) - Could break existing weapon displays
- Phase 5 (Lock-On) - Critical for combat gameplay
- Phase 10 (Cloaking) - Complex state management

**Recommended Testing Tool:**
- Use existing Playwright test script (`test-game.js`) to automate basic flow testing

---

This plan provides a structured approach to implementing all 54 tasks from the plan file. Each phase is self-contained with clear dependencies, allowing for incremental progress and testing.
