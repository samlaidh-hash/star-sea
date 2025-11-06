# STAR SEA - DESIGN DOCUMENT PART 3 IMPLEMENTATION PLAN

**Status:** ✅ APPROVED - Implementation In Progress
**Created:** 2025-10-11
**Updated:** 2025-10-12 (with user specifications)
**Estimated Total Implementation Time:** 20-30 hours

---

## CURRENT WEAPON RANGES (Extracted from Code)

**Energy Weapons:**
- **Beams** (Standard): 500 pixels = 7.14 ship lengths (CA class)
- **Plasma Beams** (Scintilian): 500 pixels = 7.14 ship lengths (CA class)
- **Laser Battery** (Commonwealth): 500 pixels = 7.14 ship lengths (CA class)
- **Disruptors** (Trigon): 500 pixels = 7.14 ship lengths (CA class)
- **Streak Beams** (NEW - Strike Cruiser): 500 pixels = 7.69 ship lengths (CS class)

**Projectile Weapons:**
- **Torpedoes**: 3250 pixels = 46.4 ship lengths (CA class) [Speed: 325 px/s × 10s lifetime]
- **Plasma Torpedoes** (Scintilian): 2170 pixels = 31 ship lengths (CA class) [Speed: 217 px/s × 10s lifetime]

---

## PHASE 1: GRAPHICS & VISUAL IMPROVEMENTS (High Priority)
*Estimated Time: 2-3 hours*

### 1.1 Plasma Weapon Graphics ✅ COMPLETED
- [x] Plasma torpedoes: Start small, expand with distance, brightness based on charge, dims over time
- [x] Plasma beams: Tight/bright near source, diffuses with distance
- **Status:** Already implemented in previous session (confirmed in summary)

### 1.2 Ship Destruction Particle Effects ✅ COMPLETED
- [x] Create particle explosion system for ship destruction
- [x] Implement particle cloud when ship is destroyed
- [x] For player ship: Show explosion before mission failed screen (2s delay)
- [x] Files modified: `js/rendering/ParticleSystem.js`, `js/core/Engine.js`
- **Implementation:** Added `createShipExplosion()` method with scaled particles, debris, shockwave. Player ship now explodes for 2 seconds before mission failed screen.

### 1.3 Shield Visual Fixes ✅ COMPLETED
- [x] Fix player ship shield bars not updating when hit
- [x] Ensure shields always appear when ship is hit
- [x] Debug ghost shield flashes when no attack present
- [x] Files verified: `js/ui/HUD.js`, `js/rendering/ShipRenderer.js`, `js/components/Shield.js`
- **Verification:** Code review shows shield system working correctly. HUD updates from `getAllQuadrants()`, visual effects set in `ShieldSystem.applyDamage()`, rendering triggers when `alpha > 0`. System appears functional.

---

## PHASE 2: NEW SHIP - FEDERATION STRIKE CRUISER (CS) (High Priority)
*Estimated Time: 3-4 hours*

### 2.1 Ship Class Definition
- [ ] Create `js/entities/FederationStrikeCruiser.js`
- [ ] **Ship Stats** (between CL and CA):
  - Ship Length: 65 pixels (CL=60, CA=70)
  - HP: 110 (CL=100, CA=120)
  - Max Speed: 115 (CL=120, CA=110)
  - Acceleration: 155 (CL=160, CA=150)
  - Turn Rate: 65°/sec (CL=70°, CA=60°)
  - Shields: Fore=19, Aft=17, Port=15, Starboard=15 (average of CL/CA)
- [ ] Load ship graphic: `Ship Icons\FED CS.png`
- [ ] Set up weapon mount positions (orange dot = dual launcher, red dots = streak beams)

### 2.2 Dual Torpedo Launcher
- [ ] Implement dual fore/aft torpedo launcher system (use existing DualTorpedoLauncher class)
- [ ] Configure: 4 torpedoes loaded, 40 stored
- [ ] Visual: Orange dot at mount position

### 2.3 Streak Beam Weapon System
- [ ] Create `js/components/weapons/StreakBeam.js`
- [ ] **Port Streak Beam (PSB):** 270° arc centered on bearing 270 (port side)
- [ ] **Starboard Streak Beam (SSB):** 270° arc centered on bearing 90 (starboard)
- [ ] Both beams can shoot safely across ship
- [ ] **Single LMB click** fires two orange-red streaks automatically (0.1s duration, 0.2s apart)
- [ ] Range: 500 pixels (same as other beams)
- [ ] Damage: 1 per streak (2 total per firing sequence)
- [ ] Cooldown: 1.5 seconds
- [ ] Visual: Red dots at mount positions that change color like beam firing bands during firing
- [ ] Color: Orange-red glowing streaks (`#ff8833` or similar)

### 2.4 Integration
- [ ] Add Strike Cruiser to ship selection menu
- [ ] Add CS ship length constant to CONFIG: `SHIP_LENGTH_CS: 65`
- [ ] Add CS stats to CONFIG (speed, acceleration, turn rate, HP, shields)
- [ ] Test all weapon systems
- [ ] Verify graphics and weapon positioning

---

## PHASE 3: BAY SYSTEM IMPROVEMENTS (Medium Priority)
*Estimated Time: 2-3 hours*

### 3.1 Bay Size Verification
- [ ] Verify bay sizes are correct: FG:2, DD:3, CL:4, CA:5, BC:6, BB:7, DN:8, SD:9
- [ ] Files to check: `js/systems/BaySystem.js`, ship class definitions

### 3.2 Default Bay Contents & Randomization
- [ ] **Default (always present):**
  - 1 Shuttle (or 1 Drone for Trigons)
  - 1 Mine
- [ ] **Randomizable Bay Items** (fill remaining slots):
  - Extra Torpedoes (20 per slot)
  - Extra Shuttles
  - Extra Drones
  - Extra Decoys
  - Extra Mines
  - Marine Teams (2 per slot - for boarding attack/defense)
  - Repair Bots (auto-repairs 20 damage at 1pt/5 seconds, then disappears)
  - Scatter Mine Pack (drops trail of 10 micro-mines, 1 damage each on contact)
  - *(Additional creative items to be designed during implementation)*
- [ ] **Shuttle vs Drone Differences:**
  - Drones: Cannot perform recovery missions, 30% effective at science missions vs shuttles
  - Drones: Faster, tougher, more heavily armed than shuttles
  - Different names and graphics

### 3.3 UI Cleanup
- [ ] Remove munitions items showing 0 count from UI display
- [ ] Files to modify: `js/ui/HUD.js`, `js/ui/MissionUI.js`

---

## PHASE 4: CONTROL SYSTEM OVERHAUL (High Priority)
*Estimated Time: 2-3 hours*

### 4.1 Pause System Changes
- [ ] **ESC:** Pause to main screen (existing behavior)
- [ ] **SPACE:** Action pause - freeze game but keep tooltips working
- [ ] Files to modify: `js/core/InputManager.js`, `js/core/Engine.js`

### 4.2 Warp Out Key Change
- [ ] Change warp out to **Y key** (from current key)
- [ ] Update HUD display to show new key binding
- [ ] Files to modify: `js/core/InputManager.js`, `js/ui/HUD.js`

### 4.3 All Stop (X Key)
- [ ] **X key:** Drop speed to zero instantly
- [ ] **If moving forward:** Add 50% of dropped speed to fore shield (temporary boost)
- [ ] **If moving backward:** Add 100% of dropped speed to aft shield (temporary boost)
- [ ] **Temporary shield boost:** Bleeds off at 1pt/second
- [ ] Files to modify: `js/core/InputManager.js`, `js/entities/Ship.js`

### 4.4 Boost Mode System
- [ ] Check if boost mode exists, update to match new specifications if found
- [ ] **Double-tap detection:** 0.4 second window between taps
- [ ] **Double-tap W:**
  - Double current forward speed
  - Drain 1pt/sec from ALL shields while active
  - End when any shield reaches 0
- [ ] **Double-tap S:**
  - Double current backward speed
  - Drain 1pt/sec from ALL shields while active
  - End when any shield reaches 0
- [ ] **Double-tap A:**
  - Snap turn port at 3× normal turn rate
  - Hold after second tap to continue turning
  - Drain 3pts/sec from ALL shields while turning
  - End when any shield reaches 0
- [ ] **Double-tap D:**
  - Snap turn starboard at 3× normal turn rate
  - Hold after second tap to continue turning
  - Drain 3pts/sec from ALL shields while turning
  - End when any shield reaches 0
- [ ] Files to modify: `js/core/InputManager.js`, `js/entities/Ship.js`

---

## PHASE 5: TARGETING & COMBAT SYSTEMS (High Priority)
*Estimated Time: 3-4 hours*

### 5.1 Lock-On System (Update Existing)
- [ ] **Update existing lock-on system** with new specifications
- [ ] Allow lock-on to any ship in any direction
- [ ] **Lock-on timing:**
  - Dead center on target: 2 seconds to lock
  - Partially on target: 3-4 seconds to lock
- [ ] **New Reticle Visual:**
  - Remove straight lines, just center dot
  - Green circle reticle (default state)
  - Blinks red/green while locking on
  - Solid red when lock achieved
- [ ] **Auto-aim for beams:** Deviate up to 15° from reticle center to hit locked target
- [ ] **Torpedoes:** Slight homing (up to 15°/sec) toward locked target
- [ ] Files to modify: `js/systems/TargetingSystem.js`, `js/rendering/Renderer.js` (reticle), beam/torpedo weapons

### 5.2 Beam System Targeting (Shields Down)
- [ ] **When shields down:** Beams hit system that reticle is over
- [ ] **If not directly over system:** Hit nearest system still inside ship outline
- [ ] **Outside ship outline:** Always miss (no damage)
- [ ] Files to modify: `js/components/weapons/BeamWeapon.js`, collision detection

### 5.3 Torpedo Damage Changes
- [ ] Keep 1 damage to shields (unchanged)
- [ ] **When shields down:** 4 damage randomly allocated to systems
- [ ] Multiple hits to same system possible (can roll same system multiple times)
- [ ] **System Classification for Bias:**
  - **Fore systems:** Weapons with "fore" in title, Sensors, Command & Control
  - **Aft systems:** Weapons with "aft" in title, Bay, Impulse
  - **Side systems:** Everything else
- [ ] **Damage Bias (70/30 split):**
  - **Fore hit:** 70% fore systems, 30% other systems
  - **Aft hit:** 70% aft systems, 30% other systems
  - **Port/Starboard hit:** No bias (equal chance all systems)
- [ ] Files to modify: `js/entities/Projectile.js` (TorpedoProjectile), collision handling

### 5.4 Anti-Mine/Cloak Weapons
- [ ] **Beams and torpedoes** can destroy mines
- [ ] **Torpedoes:** Explode on invisible targets (cloaked ships, mines) and deal damage
- [ ] **Beams:** Only hit invisible targets if reticle directly over target
- [ ] Files to modify: Projectile collision detection, mine systems

---

## PHASE 6: FACTION-SPECIFIC UI (Medium Priority)
*Estimated Time: 2 hours*

### 6.1 Trigon Player Ship Fixes
- [ ] Fix disruptor fire visibility for Trigon player ships
- [ ] Modify side panel for faction-specific displays
- [ ] Trigon panel: Show Disruptor HP bars, hide torpedo/beam displays
- [ ] Files to modify: `js/ui/HUD.js`, `js/ui/MissionUI.js`

### 6.2 Dynamic UI System
- [ ] Create faction-specific UI templates
- [ ] Show weapons/systems relevant to player's faction/ship
- [ ] Hide weapons/systems not present on player's ship

---

## PHASE 7: ENVIRONMENTAL HAZARDS (Medium-High Priority)
*Estimated Time: 4-5 hours*

### 7.1 Asteroids Restoration
- [ ] Restore asteroids to game
- [ ] Make asteroids destructible
- [ ] Spawn asteroids moving slowly
- [ ] Breaking asteroids speeds up child fragments
- [ ] **Always spawn in multiples** with full range of sizes (fields, not single asteroids)
- [ ] Files to check: `js/entities/Asteroid.js`, spawning system

### 7.2 Dust/Gas Clouds
- [ ] Create `js/entities/DustCloud.js`
- [ ] **Size:** 300 pixels diameter, irregular smooth polygon shape
- [ ] **Effect - Ship Speed:** Slightly slow ships inside cloud
- [ ] **Effect - Weapon Range:** Significantly reduce all weapon firing ranges
- [ ] **Effect - Shields:** Reduce to 50% max strength while inside
- [ ] **Effect - Shield Recharge:** 1pt/3 seconds (instead of normal 1pt/1sec) after no-hit period
- [ ] Visual: Semi-transparent cloud with particle effects

### 7.3 Stars
- [ ] Create `js/entities/Star.js`
- [ ] **Size:** 200 pixels diameter (larger than planets)
- [ ] **Gravitational pull:** Linear force/range (strong, but escapable with normal thrust)
- [ ] **Gravity affects:** Ships AND torpedoes
- [ ] **Block all attacks** (projectiles cannot pass through)
- [ ] **Contact:** Fatal (instant destruction)
- [ ] **Proximity Damage:**
  - 5 damage/sec at 200px from center
  - 0.5 damage/sec at 1000px from center
  - Linear scaling between distances
- [ ] **Damage application:** Hits facing shield first, then all systems equally when shield down
- [ ] Visual: Bright glowing sphere with animated corona

### 7.4 Planets
- [ ] Create `js/entities/Planet.js`
- [ ] **Size:** 50 pixels diameter
- [ ] **Gravitational pull:** Linear force/range (moderate, escapable with normal thrust)
- [ ] **Gravity affects:** Ships AND torpedoes
- [ ] **Solid collision:** Ships cannot move over them
- [ ] **Block all attacks** (projectiles cannot pass through)
- [ ] **Collision:** Instant destruction, no effect on planet
- [ ] Visual: Textured sphere (procedural or sprite-based)

### 7.5 Black Holes
- [ ] Create `js/entities/BlackHole.js`
- [ ] **Size:** 10 pixel black center, 20 pixel accretion disk/vortex
- [ ] **Stationary:** Don't move
- [ ] **Gravitational pull:** Geometric force/range (VERY strong - requires boost mode to escape when close)
- [ ] **Gravity affects:** Ships AND torpedoes
- [ ] **Contact with black center:** Instant destruction
- [ ] Visual: Black center (10px) with animated swirling accretion disk (20px total diameter)

### 7.6 Spawning Rules
- [ ] **General:** Usually only one hazard type per scenario
- [ ] **Exception:** Asteroids always spawn in multiples (fields)
- [ ] **Binary Systems:** 5% chance stars/planets/black holes spawn in pairs
- [ ] **Scenario-specific rules:** Allow multiple hazard types under special conditions
- [ ] Files to modify: `js/systems/MissionManager.js`, spawn logic

### 7.7 Physics Integration
- [ ] Implement gravitational force system for all gravity objects
- [ ] **Linear force (Stars, Planets):** Force decreases linearly with distance
- [ ] **Geometric force (Black Holes):** Force decreases geometrically (inverse square or similar)
- [ ] **Force strength:**
  - Strong enough to affect trajectories significantly
  - Weak enough to escape with normal thrust (except black holes - need boost)
  - Black holes: Very strong, must use boost mode to escape when close
- [ ] **Apply to:** Ships AND torpedoes
- [ ] Update physics/movement systems to apply environmental forces each frame

---

## PHASE 8: SENSOR & DETECTION SYSTEMS (Medium Priority)
*Estimated Time: 2-3 hours*

### 8.1 PING Mode
- [ ] Reintroduce PING mode
- [ ] Effect: Double sensor range
- [ ] Effect: Alert enemies (make them aware of player)
- [ ] Effect: Make hidden items visible (mines)
- [ ] Effect: Cloaked ships become visible, fade out over 20 seconds
- [ ] Cooldown: 1 minute
- [ ] Visual: Expanding ring effect from player ship
- [ ] Files to modify: `js/systems/SensorSystem.js`, `js/core/InputManager.js`

### 8.2 Mine Visibility
- [ ] Ensure mines are removed from map once activated
- [ ] PING reveals hidden mines temporarily

---

## PHASE 9: DEMO & TESTING (High Priority)
*Estimated Time: 1-2 hours*

### 9.1 Demo Game Setup
- [ ] Create demo game mode: "Faction Showcase"
- [ ] **Ship Setup:**
  - One ship per faction
  - All CA class (Cruiser)
  - Positioned for display (arranged in formation or circle)
- [ ] **Behavior:**
  - Ships are passive until attacked
  - If player attacks any ship, that ship activates and attacks back
  - Other ships remain passive until also attacked
- [ ] Files to modify: `js/systems/MissionManager.js`

### 9.2 Weapon Range Documentation ✅ COMPLETED
- [x] Compile list of current weapon ranges
- [x] Document in markdown file for reference
- [x] Added to top of PLAN 3.md for reference

---

## IMPLEMENTATION ORDER (Recommended)

**Phase 1 - Immediate:**
1. Phase 1.2-1.3: Visual fixes (shield bars, destruction effects)
2. Phase 2: Strike Cruiser ship (high priority, user request)
3. Phase 9.2: Document weapon ranges (quick task)

**Phase 2 - Core Systems:**
4. Phase 4: Control system overhaul (X stop, boost, pause)
5. Phase 5: Targeting & combat systems (lock-on, beam targeting, torpedo damage)

**Phase 3 - Polish & Features:**
6. Phase 3: Bay system improvements
7. Phase 6: Faction-specific UI
8. Phase 8: Sensor & detection (PING)

**Phase 4 - Content:**
9. Phase 7: Environmental hazards (asteroids, clouds, stars, planets, black holes)
10. Phase 9.1: Demo game setup

---

## RISK ASSESSMENT

**High Risk Items (May Need Significant Refactoring):**
- Lock-on system with auto-aim (complex targeting logic)
- Environmental physics (gravitational forces)
- Faction-specific UI (may require UI architecture changes)
- Beam targeting when shields down (precise collision detection)

**Medium Risk Items:**
- Boost mode (double-tap detection, shield drain timing)
- Torpedo damage distribution with facing bias (complex logic)
- Black hole vortex visual effect (animated graphics)

**Low Risk Items:**
- Strike Cruiser ship implementation (standard ship setup)
- Bay system fixes (data validation)
- PING mode (sensor range modification)
- All Stop key (simple velocity manipulation)

---

## TESTING CHECKLIST

After each phase, test the following:
- [ ] All controls work as expected
- [ ] No console errors
- [ ] Performance is acceptable (30 FPS target)
- [ ] Visual effects render correctly
- [ ] Player ship behaves correctly
- [ ] AI ships behave correctly
- [ ] No game-breaking bugs

---

## NOTES

- Plasma graphics (Phase 1.1) already completed in previous session
- Some systems may already exist and just need verification/fixes (boost mode, lock-on)
- Environmental hazards (Phase 7) is the most complex phase - may need to be broken into sub-phases
- Demo game (Phase 9.1) should be done last to showcase all features

---

## DETAILED SPECIFICATIONS SUMMARY (From Q&A)

### Strike Cruiser (CS) Specifications
- **Class:** Between CL and CA
- **Ship Length:** 65 pixels
- **HP:** 110
- **Max Speed:** 115
- **Acceleration:** 155
- **Turn Rate:** 65°/sec
- **Shields:** Fore=19, Aft=17, Port=15, Starboard=15
- **Torpedo Launcher:** Dual fore/aft, 4 loaded, 40 stored
- **Streak Beams:** Two shots per click, 0.2s apart, 1 damage each, 500px range, 1.5s cooldown

### Control System Specifications
- **Warp Out:** Y key
- **All Stop (X):** Temporary shield boost (50% forward, 100% backward), bleeds at 1pt/sec
- **Double-tap Window:** 0.4 seconds
- **Boost W/S:** 2× speed, drain 1pt/sec all shields
- **Boost A/D:** 3× turn rate, drain 3pt/sec all shields
- **Space Bar:** Action pause (freeze, tooltips still work)

### Lock-On Specifications
- **Lock Time:** 2s dead center, 3-4s partial coverage
- **Reticle:** Green circle (no lines), blinks red/green when locking, solid red when locked
- **Beam Auto-aim:** Deviate up to 15° from reticle center to hit locked target
- **Torpedo Homing:** Up to 15°/sec when locked

### Torpedo Damage Specifications
- **Shields Up:** 1 damage to shields
- **Shields Down:** 4 damage to systems (randomly allocated, can hit same system multiple times)
- **System Classification:**
  - Fore: "fore" weapons, Sensors, Command & Control
  - Aft: "aft" weapons, Bay, Impulse
  - Side: Everything else
- **Bias (70/30):** Fore hit = 70% fore systems, Aft hit = 70% aft systems, Side hit = no bias

### Bay System Specifications
- **Bay Sizes:** FG=2, DD=3, CL=4, CA=5, BC=6, BB=7, DN=8, SD=9
- **Default:** 1 Shuttle/Drone + 1 Mine (always)
- **Randomizable Items:**
  - Extra Torpedoes (20/slot)
  - Extra Shuttles, Drones, Decoys, Mines
  - Marine Teams (2/slot - boarding)
  - Repair Bots (20 damage @ 1pt/5sec)
  - Scatter Mine Pack (10 micro-mines @ 1 damage each)
- **Drones vs Shuttles:** No recovery missions, 30% science effectiveness, but faster/tougher/armed

### Environmental Hazard Specifications
- **Stars:** 200px diameter, linear gravity, 5 damage/sec @ 200px → 0.5 damage/sec @ 1000px, fatal contact
- **Planets:** 50px diameter, linear gravity, solid collision, instant destruction on contact
- **Black Holes:** 10px center + 20px vortex, geometric gravity (needs boost to escape), instant destruction
- **Dust Clouds:** 300px irregular polygon, slow ships, reduce weapon range, 50% max shields, 1pt/3sec recharge
- **Asteroids:** Multiple spawns (fields), destructible, fragments speed up
- **Spawning:** Usually one type per scenario, 5% chance binary systems (pairs), asteroids always multiple

### Demo Game Specifications
- **Ships:** One per faction, all CA class
- **Positioning:** Display formation (circle or line)
- **Behavior:** Passive until attacked, then activate and fight back

---

**AWAITING USER APPROVAL TO BEGIN IMPLEMENTATION**

Once approved, I will implement each phase sequentially, marking items as complete in this document before proceeding to the next phase.
