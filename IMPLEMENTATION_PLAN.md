# Star Sea - Comprehensive Implementation Plan

## Executive Summary
Star Sea is a top-down space combat game featuring mission-based gameplay with branching narrative, Newtonian physics, detailed damage modeling, and AI-controlled enemies. This plan outlines the complete technical architecture and phased development approach.

---

## 1. Technical Architecture

### 1.1 Core Technologies
- **HTML5 Canvas 2D** - Primary rendering engine
- **planck.js (Box2D)** - Physics simulation
- **Vanilla JavaScript (ES6+)** - Game logic
- **Web Audio API** - Sound and music
- **LocalStorage + JSON** - Save/load system

### 1.2 Design Patterns
- **Entity-Component-System (ECS)** - Game object management
- **State Machine** - Game states (menu, briefing, combat, debriefing, pause)
- **Observer Pattern** - Event system for damage, destruction, mission objectives
- **Strategy Pattern** - AI behaviors per faction/ship class
- **Command Pattern** - Input handling and control failure system

### 1.3 Architecture Layers
```
┌─────────────────────────────────────┐
│     Presentation Layer (UI/HUD)     │
├─────────────────────────────────────┤
│   Game State Management (States)    │
├─────────────────────────────────────┤
│    Game Logic Layer (Systems)       │
│  - Combat  - AI  - Damage  - Warp   │
├─────────────────────────────────────┤
│   Entity Layer (Ships/Objects)      │
├─────────────────────────────────────┤
│   Physics Layer (planck.js)         │
├─────────────────────────────────────┤
│   Rendering Layer (Canvas 2D)       │
└─────────────────────────────────────┘
```

---

## 2. File Structure

```
star-sea/
├── index.html                  # Main entry point
├── CLAUDE.md                   # Project memory
├── memory_*.md                 # Session memories
├── bugs.md                     # Bug tracking
├── auditor.md                  # Error prevention
├── IMPLEMENTATION_PLAN.md      # This file
│
├── css/
│   ├── main.css               # Global styles
│   ├── ui.css                 # UI components
│   ├── hud.css                # In-game HUD
│   └── menus.css              # Menu screens
│
├── js/
│   ├── main.js                # Entry point, game loop
│   ├── config.js              # Global configuration
│   │
│   ├── core/
│   │   ├── Engine.js          # Core game engine
│   │   ├── GameLoop.js        # RequestAnimationFrame loop
│   │   ├── InputManager.js    # Keyboard/mouse handling
│   │   ├── StateManager.js    # Game state management
│   │   ├── EventBus.js        # Event system
│   │   └── Camera.js          # Camera/viewport management
│   │
│   ├── physics/
│   │   ├── PhysicsWorld.js    # planck.js wrapper
│   │   ├── CollisionHandler.js # Collision detection/response
│   │   └── GravityWell.js     # Collapsar gravity system
│   │
│   ├── entities/
│   │   ├── Entity.js          # Base entity class
│   │   ├── Ship.js            # Ship entity
│   │   ├── Projectile.js      # Beam/torpedo base
│   │   ├── Asteroid.js        # Asteroid entity
│   │   ├── Decoy.js           # Decoy entity
│   │   ├── Mine.js            # Mine entity
│   │   └── Environmental.js   # Collapsar, dust cloud, planet
│   │
│   ├── components/
│   │   ├── Transform.js       # Position, rotation, velocity
│   │   ├── Physics.js         # Physics body component
│   │   ├── Renderable.js      # Visual representation
│   │   ├── Health.js          # HP tracking
│   │   ├── Shield.js          # Shield quadrant system
│   │   ├── Weapon.js          # Weapon base component
│   │   ├── BeamWeapon.js      # Beam battery
│   │   ├── TorpedoLauncher.js # Torpedo launcher
│   │   ├── Engine.js          # Impulse/warp engines
│   │   ├── Sensors.js         # Detection system
│   │   ├── CommandControl.js  # C&C system
│   │   ├── Bay.js             # Decoy/mine storage
│   │   └── PowerPlant.js      # Main energizer
│   │
│   ├── systems/
│   │   ├── MovementSystem.js  # Ship movement (Newtonian/Non-Newtonian)
│   │   ├── CombatSystem.js    # Weapon firing, damage resolution
│   │   ├── DamageSystem.js    # Damage application, system failures
│   │   ├── ShieldSystem.js    # Shield hit detection, recovery
│   │   ├── RepairSystem.js    # Auto-repair logic
│   │   ├── DetectionSystem.js # Sensor/detection logic
│   │   ├── TargetingSystem.js # Lock-on system
│   │   ├── WarpSystem.js      # Warp charge/exit
│   │   └── ProjectileSystem.js # Beam/torpedo behavior
│   │
│   ├── ai/
│   │   ├── AIController.js    # Base AI controller
│   │   ├── PatrolBehavior.js  # Patrol mode
│   │   ├── CombatBehavior.js  # Combat tactics
│   │   ├── FactionBehaviors.js # Pirate/Scintilian/Trigon
│   │   ├── ShipClassTactics.js # FG/CL/CA/BC behaviors
│   │   └── FleeingBehavior.js # Retreat logic
│   │
│   ├── missions/
│   │   ├── MissionManager.js  # Mission loading/progression
│   │   ├── MissionData.js     # Mission definitions (JSON)
│   │   ├── ObjectiveSystem.js # Victory/failure conditions
│   │   └── BranchingLogic.js  # Outcome-based progression
│   │
│   ├── rendering/
│   │   ├── Renderer.js        # Main canvas renderer
│   │   ├── ShipRenderer.js    # Vector ship drawing
│   │   ├── EffectsRenderer.js # Explosions, particles
│   │   ├── EnvironmentRenderer.js # Asteroids, collapsar, etc.
│   │   ├── UIRenderer.js      # HUD overlay
│   │   └── MinimapRenderer.js # Minimap
│   │
│   ├── ui/
│   │   ├── HUD.js             # In-game HUD manager
│   │   ├── TacticalPanel.js   # Ship status panel
│   │   ├── Minimap.js         # Minimap component
│   │   ├── Reticle.js         # Targeting reticle
│   │   ├── MainMenu.js        # Main menu screen
│   │   ├── MissionBriefing.js # Pre-mission screen
│   │   ├── MissionDebriefing.js # Post-mission screen
│   │   ├── PauseMenu.js       # Pause overlay
│   │   └── SaveLoadUI.js      # Save/load interface
│   │
│   ├── audio/
│   │   ├── AudioManager.js    # Web Audio API wrapper
│   │   ├── SoundEffects.js    # SFX playback
│   │   └── MusicManager.js    # Music switching (ambient/combat)
│   │
│   └── utils/
│       ├── SaveManager.js     # LocalStorage + JSON export
│       ├── MathUtils.js       # Vector math, angles, etc.
│       ├── ShipFactory.js     # Ship creation from templates
│       ├── AssetLoader.js     # Audio/data loading
│       └── DebugTools.js      # Dev tools (optional)
│
├── data/
│   ├── ships/
│   │   ├── frigate.json       # FG ship template
│   │   ├── light_cruiser.json # CL ship template
│   │   ├── heavy_cruiser.json # CA ship template (player)
│   │   └── battle_cruiser.json # BC ship template
│   │
│   ├── missions/
│   │   ├── mission_01.json    # Mission 1 data
│   │   ├── mission_02.json    # Mission 2 data
│   │   └── ... (18 more)
│   │
│   └── config/
│       ├── game_constants.json # Tuning values
│       └── faction_data.json   # Faction behaviors
│
└── assets/
    ├── audio/
    │   ├── music/
    │   │   ├── ambient_space.ogg
    │   │   └── ambient_combat.ogg
    │   └── sfx/
    │       ├── beam_fire.ogg
    │       ├── torpedo_fire.ogg
    │       ├── explosion.ogg
    │       ├── shield_hit.ogg
    │       ├── lock_on.ogg
    │       ├── decoy_drop.ogg
    │       ├── mine_drop.ogg
    │       └── system_damage.ogg
    │
    └── fonts/ (if needed for vector text)
```

---

## 3. Core Systems Detail

### 3.1 Entity-Component-System (ECS)

**Entity**: Unique ID + collection of components
**Component**: Pure data container (no logic)
**System**: Logic that operates on entities with specific components

Example Ship Entity:
```javascript
{
  id: "player_ship_01",
  components: {
    transform: { x, y, rotation, velocity },
    physics: { body, fixture },
    renderable: { type: "ship", vertices, color },
    health: { current, max },
    shields: { fore, aft, port, starboard },
    weapons: [beamForward, beamAft, torpForward, torpAft],
    engines: [impulse1, impulse2, warpNacelle1, warpNacelle2],
    sensors: { radius, efficiency },
    commandControl: { failureChance },
    bay: { decoys, mines, lastDeploy },
    powerPlant: { hp, maxHp }
  }
}
```

### 3.2 Physics System (planck.js Integration)

**World Setup**:
- Zero gravity globally
- Custom gravity wells (collapsars)
- Collision categories: SHIP, PROJECTILE, ASTEROID, MINE, DECOY, ENVIRONMENT
- Contact listeners for damage application

**Body Types**:
- Dynamic: Ships, asteroids, torpedoes
- Static: Collapsars, dust clouds, planets
- Kinematic: Decoys (placed then static)

**Collision Handling**:
- Ship-Ship: Bounce + damage
- Ship-Asteroid: Bounce + damage (asteroid breaks)
- Ship-Projectile: No bounce, damage only
- Ship-Mine: Damage + mine destroyed
- Projectile-Decoy: Destroy both
- Ship-Collapsar: Instant destruction

### 3.3 Movement System

**Newtonian Mode**:
- Apply thrust forces in facing direction
- Velocity independent of facing
- No speed cap
- No drag (perfect vacuum)
- Rotation affects thrust direction only

**Non-Newtonian Mode**:
- Velocity always aligned with facing
- Speed capped per ship class
- Smooth transition when switching modes (velocity clamped to cap)

**Controls**:
- W: Forward thrust
- S: Backward thrust (reverse)
- A: Turn left
- D: Turn right
- Left Ctrl: Toggle Newtonian/Non-Newtonian

**Engine Damage Effects**:
```javascript
// Example for Heavy Cruiser (2 engines)
const activeEngines = engines.filter(e => e.hp > 0).length;
const speedMultiplier = activeEngines === 2 ? 1.0 :
                        activeEngines === 1 ? 0.67 : 0.0;
maxSpeed *= speedMultiplier;
thrust *= speedMultiplier;
turnRate *= speedMultiplier;
```

### 3.4 Combat System

**Beam Weapons**:
```javascript
class BeamWeapon {
  constructor() {
    this.damage = 1;
    this.range = 20; // ship lengths
    this.arc = 270; // degrees
    this.arcCenter = 0; // 0=ahead, 180=astern
    this.shotsRemaining = 3;
    this.maxShots = 3;
    this.fireRate = 1; // shot/second
    this.rechargeDelay = 2; // seconds after last shot
    this.rechargeRate = 1/3; // per 2 seconds
    this.lastFireTime = 0;
    this.rechargeStartTime = 0;
  }

  canFire(currentTime) {
    return this.shotsRemaining > 0;
  }

  fire(targetX, targetY, currentTime) {
    if (!this.canFire(currentTime)) return null;

    this.shotsRemaining--;
    this.lastFireTime = currentTime;

    // Schedule recharge start
    if (this.shotsRemaining === 0) {
      this.rechargeStartTime = currentTime + this.rechargeDelay;
    }

    return new BeamProjectile(this.damage, this.range, targetX, targetY);
  }

  update(currentTime) {
    // Recharge logic
    if (this.shotsRemaining < this.maxShots) {
      if (currentTime >= this.rechargeStartTime) {
        const elapsed = currentTime - this.rechargeStartTime;
        const shotRecharged = Math.floor(elapsed / 2) * this.rechargeRate;
        this.shotsRemaining = Math.min(this.maxShots, shotRecharged);
      }
    }
  }
}
```

**Torpedo Launchers**:
```javascript
class TorpedoLauncher {
  constructor() {
    this.damage = 1;
    this.blastRadius = 0.1; // 10% of CA length
    this.arc = 90;
    this.arcCenter = 0; // 0=ahead, 180=astern
    this.loaded = 4;
    this.maxLoaded = 4;
    this.stored = 20;
    this.reloadDelay = 4; // seconds of no firing
    this.reloadRate = 1; // torp per 4 seconds
    this.lastFireTime = 0;
    this.reloadStartTime = 0;
    this.speed = 6; // x ship max speed
    this.lifetime = 4; // seconds
  }

  canFire() {
    return this.loaded > 0;
  }

  fire(targetX, targetY, lockOnTarget, currentTime) {
    if (!this.canFire()) return null;

    this.loaded--;
    this.lastFireTime = currentTime;

    // Schedule reload start
    if (this.loaded < this.maxLoaded && this.stored > 0) {
      this.reloadStartTime = currentTime + this.reloadDelay;
    }

    return new Torpedo(this.damage, this.blastRadius,
                      targetX, targetY, lockOnTarget,
                      this.speed, this.lifetime);
  }

  update(currentTime) {
    // Reload logic
    if (currentTime - this.lastFireTime >= this.reloadDelay) {
      if (this.loaded < this.maxLoaded && this.stored > 0) {
        const elapsed = currentTime - this.reloadStartTime;
        const torpsToReload = Math.floor(elapsed / 4);
        const actualReload = Math.min(torpsToReload,
                                     this.maxLoaded - this.loaded,
                                     this.stored);
        this.loaded += actualReload;
        this.stored -= actualReload;
      }
    }
  }
}
```

**Lock-On System**:
```javascript
class TargetingSystem {
  constructor() {
    this.lockTime = 4; // seconds
    this.currentTarget = null;
    this.lockProgress = 0;
    this.driftTolerance = 50; // pixels
    this.isLocked = false;
  }

  update(reticleX, reticleY, entities, deltaTime) {
    const target = this.getTargetUnderReticle(reticleX, reticleY, entities);

    if (target) {
      if (this.currentTarget === target) {
        // Continue locking
        this.lockProgress += deltaTime;
        if (this.lockProgress >= this.lockTime && !this.isLocked) {
          this.isLocked = true;
          this.playLockSound();
        }
      } else {
        // New target, start over
        this.currentTarget = target;
        this.lockProgress = 0;
        this.isLocked = false;
      }
    } else if (this.currentTarget && this.isLocked) {
      // Check if within drift tolerance
      const dist = this.getDistanceToTarget(reticleX, reticleY, this.currentTarget);
      if (dist > this.driftTolerance) {
        this.breakLock();
      }
    } else {
      this.breakLock();
    }
  }

  breakLock() {
    this.currentTarget = null;
    this.lockProgress = 0;
    this.isLocked = false;
  }
}
```

### 3.5 Shield System

```javascript
class ShieldSystem {
  constructor(fore, aft, port, starboard) {
    this.shields = {
      fore: { current: fore, max: fore, lastHit: 0, recovering: false },
      aft: { current: aft, max: aft, lastHit: 0, recovering: false },
      port: { current: port, max: port, lastHit: 0, recovering: false },
      starboard: { current: starboard, max: starboard, lastHit: 0, recovering: false }
    };
    this.recoveryDelay = 5; // seconds
    this.recoveryRate = 1; // HP per second
  }

  applyDamage(quadrant, damage, currentTime) {
    const shield = this.shields[quadrant];
    const actualDamage = Math.min(damage, shield.current);
    shield.current -= actualDamage;
    shield.lastHit = currentTime;
    shield.recovering = false;

    return damage - actualDamage; // Overflow damage to hull
  }

  update(currentTime, deltaTime) {
    for (const [key, shield] of Object.entries(this.shields)) {
      if (shield.current < shield.max) {
        if (currentTime - shield.lastHit >= this.recoveryDelay) {
          if (!shield.recovering) {
            shield.recovering = true;
          }
          shield.current = Math.min(shield.max,
                                    shield.current + this.recoveryRate * deltaTime);
        }
      }
    }
  }

  getQuadrantFromAngle(angle) {
    // angle: 0=ahead, 90=port, 180=astern, 270=starboard
    const normalized = ((angle % 360) + 360) % 360;
    if (normalized >= 315 || normalized < 45) return 'fore';
    if (normalized >= 45 && normalized < 135) return 'port';
    if (normalized >= 135 && normalized < 225) return 'aft';
    return 'starboard';
  }
}
```

### 3.6 Damage System

```javascript
class DamageSystem {
  applyDamageToShip(ship, damage, impactPoint, currentTime) {
    // 1. Calculate shield quadrant
    const angle = this.getAngleFromImpact(ship, impactPoint);
    const quadrant = ship.shields.getQuadrantFromAngle(angle);

    // 2. Apply to shield first
    let remainingDamage = ship.shields.applyDamage(quadrant, damage, currentTime);

    // 3. If shields down, hit internal systems
    if (remainingDamage > 0) {
      this.applyHullDamage(ship, remainingDamage, impactPoint);
    }
  }

  applyHullDamage(ship, damage, impactPoint) {
    // Find system(s) under impact point
    const hitSystems = this.getSystemsAtPoint(ship, impactPoint);

    if (hitSystems.length === 0) {
      // Hit empty space, reduce space frame
      ship.spaceFrame -= damage;
      if (ship.spaceFrame <= 0) {
        this.destroyShip(ship);
      }
      return;
    }

    // Apply damage to each hit system
    for (const system of hitSystems) {
      if (system.hp > 0) {
        system.hp = Math.max(0, system.hp - damage);
        if (system.hp === 0) {
          this.disableSystem(ship, system);
        }
      } else {
        // System already destroyed, damage space frame
        ship.spaceFrame -= damage;
      }
    }

    // Check for main power destruction
    if (ship.powerPlant.hp === 0) {
      this.destroyShip(ship);
    }

    // Check space frame
    if (ship.spaceFrame <= 0) {
      this.destroyShip(ship);
    }
  }

  disableSystem(ship, system) {
    system.disabled = true;
    this.triggerSystemFailureEffects(ship, system);
    EventBus.emit('system_damaged', { ship, system });
  }
}
```

### 3.7 Auto-Repair System

```javascript
class RepairSystem {
  update(entities, deltaTime) {
    for (const entity of entities) {
      if (!entity.components.weapons) continue;

      // Repair all systems
      const systems = this.getAllSystems(entity);
      for (const system of systems) {
        if (system.hp > 0 && system.hp < system.maxHp) {
          system.hp = Math.min(system.maxHp,
                              system.hp + 0.03 * deltaTime);

          // Re-enable if repaired above 0
          if (system.disabled && system.hp > 0) {
            system.disabled = false;
          }
        }
        // If hp === 0, no repair
      }
    }
  }
}
```

### 3.8 AI System

```javascript
class AIController {
  constructor(ship, faction, shipClass) {
    this.ship = ship;
    this.faction = faction; // 'pirate', 'scintilian', 'trigon'
    this.shipClass = shipClass; // 'FG', 'CL', 'CA', 'BC'
    this.state = 'patrol'; // 'patrol', 'combat', 'fleeing'
    this.target = null;
    this.patrolWaypoints = [];
    this.currentWaypoint = 0;
  }

  update(playerShip, enemyShips, deltaTime) {
    // State transitions
    this.updateState(playerShip, enemyShips);

    // Execute behavior based on state
    switch (this.state) {
      case 'patrol':
        this.executePatrol(deltaTime);
        break;
      case 'combat':
        this.executeCombat(playerShip, deltaTime);
        break;
      case 'fleeing':
        this.executeFlee(playerShip, enemyShips, deltaTime);
        break;
    }
  }

  updateState(playerShip, enemyShips) {
    const distToPlayer = this.getDistance(this.ship, playerShip);
    const detectionRadius = this.getDetectionRadius();

    // Check for fleeing condition
    if (this.shouldFlee(playerShip, enemyShips)) {
      this.state = 'fleeing';
      return;
    }

    // Check for combat
    if (distToPlayer <= detectionRadius) {
      this.state = 'combat';
      this.target = playerShip;
    } else if (this.state === 'combat' && distToPlayer > detectionRadius * 2) {
      // Lost contact
      this.state = 'patrol';
      this.target = null;
    }
  }

  shouldFlee(playerShip, enemyShips) {
    // Check if badly damaged
    const hullPercent = this.getHullIntegrity(this.ship);
    if (hullPercent < 0.3) {
      // Check if can disengage (>2x detection radius from all ships)
      const detectionRadius = this.getDetectionRadius();
      const distToPlayer = this.getDistance(this.ship, playerShip);

      if (distToPlayer > detectionRadius * 2) {
        let canDisengage = true;
        for (const enemy of enemyShips) {
          if (enemy === this.ship) continue;
          const dist = this.getDistance(this.ship, enemy);
          if (dist <= detectionRadius * 2) {
            canDisengage = false;
            break;
          }
        }
        return canDisengage;
      }
    }
    return false;
  }

  executeCombat(playerShip, deltaTime) {
    // Faction-specific behavior
    const behavior = this.getFactionBehavior(this.faction);

    // Ship class-specific tactics
    const tactics = this.getShipClassTactics(this.shipClass);

    // Execute combined behavior
    behavior.execute(this.ship, playerShip, tactics, deltaTime);
  }

  getFactionBehavior(faction) {
    switch (faction) {
      case 'pirate':
        return new AggressiveBehavior(); // Close range, charge
      case 'scintilian':
        return new DefensiveBehavior(); // Maintain distance, kite
      case 'trigon':
        return new BalancedBehavior(); // Mix of both
    }
  }

  getShipClassTactics(shipClass) {
    switch (shipClass) {
      case 'FG':
      case 'CL':
        return { preferredPosition: 'rear_arc', range: 'close' };
      case 'CA':
      case 'BC':
        return { preferredPosition: 'broadside', range: 'medium' };
    }
  }
}
```

---

## 4. Development Phases

### Phase 1: Core Engine & Rendering (Week 1)
**Goal**: Get a basic game loop running with rendering

**Tasks**:
1. Set up project structure and HTML/CSS foundation
2. Implement GameLoop with requestAnimationFrame (60 FPS)
3. Create Canvas rendering system with camera/viewport
4. Implement basic Entity system with Transform component
5. Create vector ship renderer (simple triangle placeholder)
6. Implement InputManager for keyboard/mouse
7. Add starfield background renderer
8. Create basic HUD overlay

**Deliverable**: Ship renders in center of screen, background scrolls, controls responsive

**Test**: Ship triangle rotates with A/D, background scrolls with movement simulation

---

### Phase 2: Physics & Movement (Week 1-2)
**Goal**: Integrate planck.js and implement movement systems

**Tasks**:
1. Integrate planck.js into project
2. Create PhysicsWorld wrapper class
3. Implement ship physics body with collision fixture
4. Create MovementSystem with thrust/rotation
5. Implement Newtonian movement mode
6. Implement Non-Newtonian movement mode
7. Add mode toggle (Left Ctrl)
8. Create asteroid entities with physics bodies
9. Implement collision detection and bounce response
10. Add basic collision damage

**Deliverable**: Ship moves with realistic physics, asteroids bounce off ship

**Test**:
- Newtonian mode: Ship drifts, can fly sideways
- Non-Newtonian: Ship speed caps, always faces movement direction
- Toggle switches modes correctly
- Asteroids collide and bounce

---

### Phase 3: Combat & Weapons (Week 2-3)
**Goal**: Implement all weapon systems and combat mechanics

**Tasks**:
1. Create Weapon component base class
2. Implement BeamWeapon with charge bar system
3. Implement TorpedoLauncher with reload system
4. Create Projectile entities (Beam, Torpedo)
5. Implement arc-based firing (check reticle in arc)
6. Create targeting reticle renderer
7. Implement TargetingSystem with lock-on (4 sec)
8. Add lock-on visual (spinning reticle) and audio
9. Implement torpedo homing behavior (fire-and-forget)
10. Create ProjectileSystem for torpedo travel/lifetime
11. Implement beam hit detection (raycast)
12. Implement torpedo explosion with blast radius
13. Add weapon charging/reloading UI to HUD
14. Implement Decoy deployment (spacebar tap)
15. Implement Mine deployment (spacebar long-press)
16. Add Decoy torpedo confusion logic
17. Add Decoy/Mine beam blocking

**Deliverable**: All weapons functional, lock-on works, decoys/mines deploy

**Test**:
- Beams fire 3 shots, recharge correctly
- Torpedoes reload after 4 seconds
- Lock-on takes 4 seconds, maintains with drift
- Torpedoes home when locked
- Decoys confuse torpedoes
- Mines damage ships on contact

---

### Phase 4: Ship Systems & Damage Model (Week 3-4)
**Goal**: Implement detailed ship internals and damage system

**Tasks**:
1. Create Shield component with 4 quadrants
2. Implement ShieldSystem with recovery logic
3. Create ship system components (engines, sensors, C&C, bay, etc.)
4. Design Heavy Cruiser layout with system positions
5. Implement DamageSystem with shield penetration
6. Add hull damage to specific systems under impact
7. Implement system disabling at 0 HP
8. Add Space Frame as damage overflow
9. Implement RepairSystem with 0.03 HP/sec
10. Add engine damage effects (speed reduction)
11. Add sensor damage (detection radius reduction)
12. Add C&C damage (control failure chance)
13. Add bay damage (no more decoys/mines)
14. Implement warp drive charging system
15. Add main power destruction = ship explosion
16. Create TacticalPanel UI showing all systems
17. Add shield visualization (white curves on hit)
18. Add system status indicators (red when disabled)

**Deliverable**: Full damage model, shields work, systems fail realistically

**Test**:
- Shields absorb damage, recover after 5 seconds
- Systems take damage when shields down
- Engines affect speed proportionally
- Main power destruction kills ship
- Tactical panel shows correct status

---

### Phase 5: AI & Enemy Behavior (Week 4-5)
**Goal**: Implement enemy ships with AI

**Tasks**:
1. Create AIController base class
2. Implement PatrolBehavior with waypoints
3. Implement detection radius system (FG/CL/CA/BC)
4. Create faction behaviors (Pirate/Scintilian/Trigon)
5. Implement ship class tactics (small=rear, large=broadside)
6. Add enemy weapon firing logic
7. Implement target leading for enemy weapons
8. Create FleeingBehavior for damaged ships
9. Add identification system (full vs blob)
10. Implement enemy shield/damage system
11. Create enemy ship templates (FG/CL/CA/BC)
12. Add enemy system damage effects
13. Implement enemy auto-repair
14. Add enemy decoy/mine usage
15. Test AI in various scenarios

**Deliverable**: Enemy ships patrol, fight, flee realistically

**Test**:
- Enemies patrol when no targets detected
- Enemies engage when player in range
- Pirates aggressive, Scintilians defensive
- Small ships go for rear arc
- Damaged ships flee when able

---

### Phase 6: Mission System (Week 5-6)
**Goal**: Implement mission framework and progression

**Tasks**:
1. Create MissionManager class
2. Design mission JSON schema
3. Implement mission loading from JSON
4. Create ObjectiveSystem for victory/failure conditions
5. Implement scenario spawning (enemies, asteroids, etc.)
6. Add mission briefing screen UI
7. Add mission debriefing screen UI
8. Implement BranchingLogic for outcome-based progression
9. Create mission transition system
10. Add special objective types (scan, protect, survive, etc.)
11. Implement time limit objectives
12. Add warp exit victory condition
13. Create save game system (mid-mission support)
14. Implement difficulty-based save slots (0-3)
15. Add autosave on key objectives
16. Create manual save/load UI
17. Implement mission skip after 6 failures

**Deliverable**: Mission framework complete, can load/play/complete missions

**Test**:
- Mission loads with correct enemies/environment
- Objectives tracked correctly
- Victory/failure conditions trigger
- Branching works based on outcomes
- Save/load preserves mid-mission state

---

### Phase 7: UI, Audio & Polish (Week 6-7)
**Goal**: Complete all UI, audio, and visual polish

**Tasks**:
1. Create MainMenu screen with mission selection
2. Implement PauseMenu (ESC to toggle)
3. Create Minimap with 2x detection radius range
4. Add minimap contact rendering (friendly/enemy/unknown)
5. Integrate Web Audio API (AudioManager)
6. Implement SoundEffects system
7. Add all weapon SFX (beam, torpedo, explosion, etc.)
8. Create MusicManager with ambient/combat switching
9. Source/create orchestral music tracks
10. Add lock-on sound effect
11. Implement volume control (master only)
12. Create visual effects system
13. Add expanding circle explosions
14. Create particle system for dust clouds
15. Add swirling particle effect for collapsar
16. Implement shield hit visual (white curves, fade)
17. Add beam weapon visual (fast streak)
18. Create asteroid break animation
19. Add torpedo trail effect
20. Implement damage flash on systems (tactical panel)
21. Add critical message log to tactical panel
22. Create responsive layout (1920x1080 base)
23. Add loading screen
24. Polish all UI elements

**Deliverable**: Complete game with all audio/visual elements

**Test**:
- All sounds play correctly
- Music switches ambient/combat smoothly
- Minimap shows correct contacts
- Visual effects look good
- UI responsive and readable

---

### Phase 8: Mission Content Creation (Week 7-9)
**Goal**: Create all 20 missions with branching narrative

**Tasks**:
1. Design branching mission flowchart
2. Write mission briefing texts
3. Create Mission 1 (tutorial-style)
4. Create Missions 2-5 (early campaign)
5. Create Missions 6-10 (mid campaign)
6. Create Missions 11-15 (late campaign)
7. Create Missions 16-20 (final missions)
8. Design mission-specific special rules
9. Implement unique objectives per mission
10. Balance enemy difficulty progression
11. Test all mission paths
12. Write debriefing texts
13. Implement branching transitions
14. Test save/load in each mission

**Deliverable**: 20 complete missions with branching story

**Test**:
- All missions playable start to finish
- Branching works correctly
- Difficulty curve feels good
- Special objectives function

---

### Phase 9: Testing & Bug Fixes (Week 9-10)
**Goal**: Polish and fix all bugs

**Tasks**:
1. Comprehensive playthrough of all missions
2. Test all branching paths
3. Balance pass on weapons/shields/HP
4. Balance pass on enemy AI
5. Performance profiling and optimization
6. Fix any collision bugs
7. Fix any AI pathfinding issues
8. Fix any save/load bugs
9. Test edge cases (all systems destroyed, etc.)
10. Polish game feel (timing, feedback)
11. Add debug mode for testing
12. Final audio mix
13. Final visual polish
14. Accessibility improvements (if time)

**Deliverable**: Polished, bug-free game

---

## 5. Data Structures

### 5.1 Ship Template (JSON)
```json
{
  "class": "heavy_cruiser",
  "displayName": "Heavy Cruiser",
  "hull": {
    "vertices": [
      // Vector coordinates for ship outline
    ]
  },
  "stats": {
    "maxSpeed": 100,
    "acceleration": 50,
    "turnRate": 90,
    "mass": 1000,
    "spaceFrame": 12
  },
  "systems": {
    "powerPlant": { "hp": 12, "position": [0, 10] },
    "impulseEngines": [
      { "hp": 8, "position": [-5, 15] },
      { "hp": 8, "position": [5, 15] }
    ],
    "warpNacelles": [
      { "hp": 10, "position": [-10, -5] },
      { "hp": 10, "position": [10, -5] }
    ],
    "sensors": { "hp": 6, "position": [0, -10], "baseRadius": 30 },
    "commandControl": { "hp": 6, "position": [0, -5] },
    "bay": { "hp": 6, "position": [0, 5], "decoys": 6, "mines": 6 },
    "weapons": [
      {
        "type": "beam",
        "name": "Forward Beam Battery",
        "hp": 4,
        "position": [0, -15],
        "arc": 270,
        "arcCenter": 0,
        "damage": 1,
        "range": 20,
        "shots": 3
      },
      {
        "type": "beam",
        "name": "Aft Beam Battery",
        "hp": 4,
        "position": [0, 15],
        "arc": 270,
        "arcCenter": 180,
        "damage": 1,
        "range": 20,
        "shots": 3
      },
      {
        "type": "torpedo",
        "name": "Forward Torpedo Launcher",
        "hp": 4,
        "position": [-3, -12],
        "arc": 90,
        "arcCenter": 0,
        "loaded": 4,
        "stored": 20,
        "damage": 1,
        "blastRadius": 10
      },
      {
        "type": "torpedo",
        "name": "Aft Torpedo Launcher",
        "hp": 4,
        "position": [3, 12],
        "arc": 90,
        "arcCenter": 180,
        "loaded": 4,
        "stored": 20,
        "damage": 1,
        "blastRadius": 10
      }
    ],
    "shields": {
      "fore": { "hp": 8, "maxStrength": 20, "position": [0, -12] },
      "aft": { "hp": 8, "maxStrength": 10, "position": [0, 12] },
      "port": { "hp": 8, "maxStrength": 15, "position": [-8, 0] },
      "starboard": { "hp": 8, "maxStrength": 15, "position": [8, 0] }
    }
  }
}
```

### 5.2 Mission Definition (JSON)
```json
{
  "id": "mission_01",
  "title": "Patrol Duty",
  "briefing": {
    "text": "Routine patrol of sector 7. Intel suggests pirate activity...",
    "objectives": [
      "Patrol all waypoints",
      "Eliminate any hostile contacts",
      "Return to base via warp"
    ]
  },
  "environment": {
    "asteroids": [
      { "type": "large", "position": [100, 200], "velocity": [5, 0] },
      { "type": "medium", "position": [-50, 150], "velocity": [-3, 2] }
    ],
    "collapsars": [
      { "position": [500, -300], "gravityRadius": 200 }
    ],
    "dustClouds": [
      { "position": [0, 400], "radius": 100 }
    ],
    "planets": []
  },
  "enemies": [
    {
      "class": "frigate",
      "faction": "pirate",
      "position": [300, 100],
      "patrolWaypoints": [[300, 100], [300, 200], [400, 200]]
    },
    {
      "class": "light_cruiser",
      "faction": "pirate",
      "position": [350, 150],
      "patrolWaypoints": [[350, 150], [450, 150]]
    }
  ],
  "objectives": {
    "victory": [
      { "type": "destroy_all_enemies" },
      { "type": "warp_exit" }
    ],
    "failure": [
      { "type": "player_destroyed" }
    ],
    "optional": [
      { "type": "complete_under_time", "time": 180, "reward": "bonus_1" }
    ]
  },
  "specialRules": [],
  "nextMissions": {
    "success": ["mission_02", "mission_03"],
    "failure": ["mission_01_retry"]
  },
  "debriefing": {
    "success": "Well done! The sector is clear. Command has new orders...",
    "failure": "Mission failed. The pirates remain a threat..."
  }
}
```

### 5.3 Save Game Structure
```json
{
  "version": "1.0.0",
  "timestamp": 1234567890,
  "difficulty": 2,
  "currentMission": "mission_05",
  "completedMissions": ["mission_01", "mission_02", "mission_03", "mission_04"],
  "availableMissions": ["mission_05", "mission_06"],
  "playerShip": {
    "class": "heavy_cruiser",
    "systems": {
      // Current HP of all systems
    },
    "shields": {
      // Current shield values
    },
    "warpCharge": 0.75,
    "position": [100, 200],
    "velocity": [10, 5],
    "rotation": 45
  },
  "missionState": {
    "enemies": [
      // Current state of all enemies
    ],
    "objectives": {
      "completed": ["waypoint_1", "waypoint_2"],
      "remaining": ["destroy_all_enemies"]
    },
    "elapsedTime": 123.5
  }
}
```

---

## 6. Technical Challenges & Solutions

### Challenge 1: Performance with Many Objects
**Problem**: 60 FPS with unlimited objects, including physics and rendering

**Solutions**:
- Spatial partitioning (quadtree) for collision detection
- Object pooling for projectiles
- Culling: Don't render/update objects far from player
- Efficient Canvas rendering: batch draws, minimize state changes
- planck.js optimization: Limit physics step iterations

### Challenge 2: Smooth Camera with Fixed Player
**Problem**: Player in center, world scrolls smoothly

**Solutions**:
- Translate canvas context by -player position
- Render world coordinates relative to player
- Minimap uses separate coordinate system

### Challenge 3: Accurate Hit Detection for Systems
**Problem**: Torpedoes hit specific systems based on blast radius

**Solutions**:
- Store system positions in ship local coordinates
- Transform to world coordinates for hit testing
- Use point-in-circle test for each system vs blast center
- Visualize system hitboxes in debug mode

### Challenge 4: AI Pathfinding & Tactics
**Problem**: AI needs to navigate, avoid obstacles, use tactics

**Solutions**:
- Simple steering behaviors (seek, flee, arrive)
- Obstacle avoidance using raycasts
- Tactical positioning based on ship class
- State machine for behavior switching

### Challenge 5: Mission Branching State Management
**Problem**: Track completion, outcomes, available missions

**Solutions**:
- Mission graph data structure (nodes + edges)
- Save completed missions + outcomes
- Calculate available missions on load
- Validate progression logic during development

---

## 7. Testing Strategy

### 7.1 Unit Tests (Playwright)
- Physics calculations (angle, distance, collision)
- Weapon charge/reload timers
- Shield recovery logic
- Damage calculation
- AI state transitions

### 7.2 Integration Tests
- Player movement in both modes
- Weapon firing and hit detection
- Enemy AI behavior
- Mission objectives triggering
- Save/load game state

### 7.3 Manual Testing Checklist
- [ ] All controls responsive
- [ ] All weapons function correctly
- [ ] Lock-on works reliably
- [ ] Shields recover properly
- [ ] Systems disable when HP = 0
- [ ] Auto-repair works
- [ ] Enemy AI behaves correctly per faction
- [ ] Missions load without errors
- [ ] Objectives complete correctly
- [ ] Branching works
- [ ] Save/load preserves state
- [ ] Audio plays correctly
- [ ] Visual effects render properly
- [ ] Performance stable at 60 FPS
- [ ] No memory leaks

### 7.4 Balance Testing
- Player weapon effectiveness
- Enemy difficulty curve
- Shield/hull HP values
- Repair rate feel
- Mission time limits
- Warp charge time

---

## 8. Timeline Summary

| Phase | Duration | Focus |
|-------|----------|-------|
| 1. Core Engine | 1 week | Game loop, rendering, input |
| 2. Physics | 1 week | planck.js, movement, collisions |
| 3. Combat | 1 week | Weapons, targeting, projectiles |
| 4. Damage Model | 1 week | Shields, systems, damage logic |
| 5. AI | 1 week | Enemy behavior, tactics |
| 6. Missions | 1 week | Mission framework, objectives |
| 7. Polish | 1 week | UI, audio, visual effects |
| 8. Content | 2 weeks | 20 missions, narrative |
| 9. Testing | 1 week | Bug fixes, balance |
| **Total** | **10 weeks** | **Full game** |

---

## 9. Risk Mitigation

### Risk 1: planck.js Integration Complexity
- **Mitigation**: Prototype early (Phase 2), test thoroughly
- **Fallback**: Simplified collision with manual response

### Risk 2: AI Too Complex/Buggy
- **Mitigation**: Start simple, iterate, test each behavior in isolation
- **Fallback**: Simplified AI with basic attack patterns

### Risk 3: Performance Issues
- **Mitigation**: Profile early, optimize hotspots, use object pooling
- **Fallback**: Reduce visual effects, limit object count

### Risk 4: Mission Content Takes Too Long
- **Mitigation**: Create mission template/tools, reuse enemy patterns
- **Fallback**: Reduce to 10-15 missions, add more later

### Risk 5: Save/Load Bugs
- **Mitigation**: Test frequently, validate JSON schemas, version saves
- **Fallback**: Between-mission saves only (no mid-mission)

---

## 10. Success Criteria

### Minimum Viable Product (MVP)
- ✓ Player ship with full controls
- ✓ Newtonian/Non-Newtonian movement
- ✓ All weapons functional (beams, torpedoes, decoys, mines)
- ✓ Enemy ships with basic AI
- ✓ Damage model with shields and systems
- ✓ 5 playable missions
- ✓ Basic UI and audio
- ✓ Save/load system

### Full Release
- ✓ All MVP features
- ✓ 20 missions with branching narrative
- ✓ Advanced AI with faction behaviors
- ✓ Complete audio (music + SFX)
- ✓ Polished visual effects
- ✓ Full UI (briefing, debriefing, menus)
- ✓ Mid-mission saves
- ✓ 60 FPS performance
- ✓ Comprehensive testing

---

## 11. Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Set up project structure** - Create files and folders
3. **Begin Phase 1** - Core engine and rendering
4. **Iterate and test** - Regular testing throughout development
5. **Track progress** - Update memory files, use TodoWrite tool

---

**End of Implementation Plan**
