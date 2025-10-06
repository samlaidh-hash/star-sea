# Star Sea - Top-Down Space Combat Game

## Phase 1 Implementation - Complete! ✓

### Current Status
The core engine and basic rendering are now functional. You can fly a Galaxy-class Heavy Cruiser around with basic movement controls.

### How to Play (Current Build)

1. **Start the Server** (already running):
   - Server is running at: http://localhost:8000
   - Open this URL in your web browser

2. **Controls**:
   - **New Game Button**: Click to start and spawn your ship
   - **W**: Forward thrust
   - **S**: Backward thrust (reverse)
   - **A**: Turn left
   - **D**: Turn right
   - **Left Ctrl**: Toggle between Newtonian and Non-Newtonian movement modes
   - **ESC**: Pause/Unpause game
   - **Mouse**: Move targeting reticle (weapons not yet implemented)

3. **Movement Modes**:
   - **NEWTONIAN**: Realistic space physics - unlimited speed, drift/momentum independent of facing
   - **NON-NEWTONIAN**: Arcade mode - speed capped, ship always moves in facing direction

### What's Working

✓ **Core Engine**:
- 60 FPS game loop with fixed timestep
- Responsive canvas rendering (1920x1080 base, scales to window)
- Player-centered camera (ship stays in center, world scrolls around it)

✓ **Ship Systems**:
- Galaxy-class Heavy Cruiser with vector graphics
- Faction-specific ship designs (ready for AI enemies)
- Dual movement modes (Newtonian/Non-Newtonian)
- Smooth turning and acceleration

✓ **Visuals**:
- Parallax starfield background
- Vector-drawn ships with color-coded factions
- HUD framework (tactical panel, minimap placeholder)
- Menu system

✓ **Input**:
- Keyboard controls (WASD, Ctrl, ESC)
- Mouse tracking for reticle
- Event-driven input system

### What's Working (Updated - Phase 2 Complete!)

✓ **Physics System** (NEW!):
- planck.js (Box2D) fully integrated
- Realistic collisions with bounce and damage
- Zero-gravity space physics
- Custom gravity wells for black holes

✓ **Asteroids** (NEW!):
- Large, medium, and small asteroids
- Irregular shapes with rotation
- Breaking mechanics: large→medium→small→destroyed
- Dynamic physics-based movement
- Collision damage: 3 (large), 2 (medium), 1 (small)

✓ **Environmental Hazards** (NEW!):
- **Collapsar (Black Hole)**: Gravity well pulls ships in, instant death on contact
- **Dust Clouds**: Particle effects (will block beams in Phase 3)
- **Planets**: Large static bodies, collision damage

✓ **Combat Feedback** (NEW!):
- Hull HP tracking (100 HP)
- Damage from collisions
- Critical event log showing damage
- Game over on ship destruction
- Visual HP indicators in HUD

### What to Test

1. **Fly around and hit asteroids** - They should bounce you back and break into smaller pieces
2. **Approach the collapsar** (purple swirling particles) - Feel the gravity pull
3. **Watch your HP** in the top-left HUD - Collisions cause damage
4. **Let your ship get destroyed** - Game over triggers
5. **Movement modes** - Try both Newtonian (drift) and Non-Newtonian (arcade) with Left Ctrl

### What's Working (Updated - Phase 3 Complete!)

✓ **Beam Weapons** (NEW!):
- **Left-click** to fire all beams in arc
- 3-shot burst (1 per second)
- Recharges 1/3 per 2 seconds after 2-sec delay
- 270° forward and aft arcs
- Very fast red laser bolts
- Charge bars show in HUD

✓ **Torpedoes** (NEW!):
- **Right-click** to fire all torpedoes in arc
- 4 loaded, 20 stored per launcher
- **Lock-on system**: Hold reticle on target for 4 seconds
  - Reticle spins yellow while locking
  - Reticle turns red when locked
  - Fire-and-forget homing
  - Terminal homing at halfway point
- Reload: 1 torpedo per 4 seconds after 4-sec delay
- Yellow projectiles with trails
- Can be shot down with beams (hard!)

✓ **Decoys & Mines** (NEW!):
- **Spacebar tap** = Deploy decoy (cyan pulsing circle)
  - 6 decoys, 10-second lifetime
  - Confuses torpedoes
  - Blocks beam weapons
- **Spacebar long-press** = Deploy mine (orange blinking diamond)
  - 6 mines, infinite lifetime
  - 10 damage on contact
  - Invisible to enemies
- 6-second cooldown between deployments

✓ **Combat Features**:
- Weapons only fire if target in arc
- Live HUD updates (charge bars, torp counts, decoy/mine counts)
- Projectile collision detection
- Damage feedback
- Torpedoes home in on locked targets
- Can destroy asteroids with weapons

### What to Test (Updated!)

1. **Fire beams** (left-click) - Watch the 3-shot burst and recharge
2. **Fire torpedoes** (right-click) - Try both locked and unlocked
3. **Lock-on an asteroid** - Hold mouse over it for 4 seconds, watch reticle spin
4. **Deploy decoys** (spacebar tap) - See them pulse, try to confuse a torpedo
5. **Deploy mines** (spacebar hold) - Watch them blink, run an asteroid into one
6. **Destroy asteroids with weapons** - Beams and torps both work!
7. **Watch torpedo homing** - Lock an asteroid, fire, watch it chase

### What's Working (Updated - Phase 4 Complete!)

✓ **Shield System** (NEW!):
- Four independent shield quadrants (fore/aft/port/starboard)
- Each quadrant recovers independently after 5 seconds without being hit
- Shield strength based on generator HP
- Visual shield arcs when hit (blue glow effect)
- Shield damage shows in HUD with live status bars

✓ **Internal Systems** (NEW!):
- **Impulse Engines** - Damage reduces ship speed and turn rate
- **Warp Nacelles** - Charge warp drive (future feature for mission exit)
- **Sensor Array** - Damage reduces detection range and targeting accuracy
- **Command & Control** - Damage causes random control glitches
- **Weapons Bay** - Damage reduces torpedo reload rate, destruction prevents countermeasures
- **Main Power** - Damage reduces all system efficiency, destruction causes core breach (ship destroyed)

✓ **Enhanced Damage Model** (NEW!):
- Damage flows through shields first
- Overflow damage hits nearest internal system based on impact location
- System damage causes specific failures (speed loss, sensor degradation, etc.)
- Remaining damage goes to hull HP
- Critical event log shows all damage with system names and efficiency

### What to Test (Updated for Phase 4!)

1. **Shields** - Ram asteroids and watch shield quadrants light up blue, then recover after 5 seconds
2. **System Damage** - Watch HUD system status as different areas get hit
3. **Impulse Damage** - Get hit in the aft section, notice speed reduction
4. **Sensor Damage** - Get hit in the fore section, targeting may be affected
5. **Power System** - If Main Power is destroyed, ship explodes (core breach)
6. **Control Glitches** - If C&C is damaged, random control malfunctions may occur
7. **Shield Recovery** - After taking hits, shields slowly recover (watch HUD bars)

### What's Next (Phase 5)

**Phase 5: AI & Enemy Behavior**:
- Enemy ships that fight back
- Faction-specific weapons (Disruptors, Plasma Torpedoes)
- AI combat tactics
- Patrol and combat behaviors

### Development Progress

**Completed**:
- Phase 1 - Core Engine & Rendering ✓
- Phase 2 - Physics & Movement Systems ✓
- Phase 3 - Combat & Weapons Systems ✓
- Phase 4 - Ship Systems & Damage Model ✓

**Current**: Phase 4 Complete, Ready for Phase 5
**Next**: AI & Enemy Behavior

### File Structure
```
star-sea/
├── index.html              # Main game page
├── css/                    # Stylesheets
│   ├── main.css
│   ├── hud.css
│   ├── menus.css
│   └── ui.css
├── js/
│   ├── config.js           # Game constants
│   ├── main.js             # Entry point
│   ├── core/               # Core engine
│   ├── entities/           # Game objects
│   ├── components/         # Entity components
│   ├── rendering/          # Renderers
│   ├── ui/                 # UI managers
│   └── utils/              # Utilities
├── CLAUDE.md               # Project instructions
├── IMPLEMENTATION_PLAN.md  # Full development plan
└── memory_*.md             # Session memory
```

### Debug Mode

Debug mode is enabled by default (`CONFIG.DEBUG_MODE = true`). This shows:
- FPS counter
- Entity count
- Player position
- Player rotation
- Velocity magnitude
- Current movement mode

Access the game engine in console: `window.game`

### Known Limitations (Phase 1)

- No physics collisions yet (planck.js integration in Phase 2)
- No weapons yet (Phase 3)
- No damage model yet (Phase 4)
- No AI enemies yet (Phase 5)
- No missions yet (Phase 6)
- No audio yet (Phase 7)

### Testing Checklist

- [x] Main menu displays
- [ ] "New Game" button spawns player ship
- [ ] Ship renders in center of screen
- [ ] Starfield scrolls when ship moves
- [ ] WASD controls move ship
- [ ] Movement mode toggle works (Left Ctrl)
- [ ] ESC pauses game
- [ ] Minimap shows player ship
- [ ] Debug info displays (FPS, position, etc.)

### Browser Compatibility

Tested on:
- Chrome/Edge (recommended)
- Firefox
- Safari (may have minor rendering differences)

Requires ES6+ support.
