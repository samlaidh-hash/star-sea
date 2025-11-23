# 🚀 Star Sea - Local Server Setup Guide

## 🎯 Quick Start (Recommended)

### Windows Users
1. **Double-click `start_server.bat`**
2. The game will automatically open in your browser at `http://localhost:8000`
3. If it doesn't open automatically, manually go to `http://localhost:8000`

### macOS/Linux Users
1. **Open Terminal** in the Star Sea directory
2. **Run:** `chmod +x start_server.sh && ./start_server.sh`
3. The game will automatically open in your browser at `http://localhost:8000`

## 🛠️ Manual Setup

### Prerequisites
- **Python 3.6+** installed ([Download here](https://python.org))
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Step 1: Verify Python Installation
```bash
python --version
# Should show: Python 3.x.x
```

### Step 2: Start the Server
```bash
# Basic start
python server.py

# Custom port (if 8000 is busy)
python server.py --port 8080

# Don't open browser automatically
python server.py --no-browser
```

### Step 3: Open the Game
- **Automatic:** Browser should open automatically
- **Manual:** Go to `http://localhost:8000`

## 🎮 Game Controls

| Key | Function | System |
|-----|----------|--------|
| **WASD** | Movement | Core |
| **Mouse** | Aiming | Core |
| **Left Click** | Fire Beam | Combat |
| **Right Click** | Fire Torpedo | Combat |
| **Q** | Tractor Beam | Advanced |
| **T** | Transporter | Advanced |
| **TAB** | Power Management | Advanced |
| **1-6** | Shuttle Missions | Bay System |
| **7-8** | Fighter/Bomber | Bay System |
| **V** | Warp Drive | Core |
| **ESC** | Pause/Menu | Core |

## 🚀 Advanced Features

### Tractor Beam (Q Key)
- **Activate:** Press Q to toggle tractor beam
- **Target Priority:** Mines → Shuttles → Torpedoes → Ships
- **Effects:** 20% speed/shield/beam penalty while active
- **Visual:** Cyan beam with particle effects

### Power Management (TAB Key)
- **Cycle Modes:** Press TAB to cycle through 6 power modes
- **Reset:** Double-tap TAB to reset to balanced mode
- **Modes:**
  - All Systems Balanced (default)
  - Speed Focus (2x speed, 0.5x shields)
  - Shield Focus (0.5x speed, 2x shields)
  - Beam Focus (0.5x speed/shields, 2x beams)
  - Balanced Speed (1.5x speed, 0.5x beams)
  - Balanced Shield (1x speed, 0.5x beams)

### Bay System (1-8 Keys)
- **Shuttle Missions (1-6):**
  - 1: Attack Mission
  - 2: Defense Mission
  - 3: Wild Weasel Mission
  - 4: Suicide Mission
  - 5: Transport Mission
  - 6: Scan Mission
- **Fighter/Bomber (7-8):**
  - 7: Launch Fighter
  - 8: Launch Bomber

### Transporter (T Key)
- **Activate:** Press T to toggle transporter
- **Target Priority:** Mines → Shuttles → Torpedoes → Ships
- **Transport Time:** 3 seconds
- **Cooldown:** 5 seconds between uses

## 🧪 Testing & Debugging

### Run Tests
```bash
# Test server setup
python simple_test.py

# Run comprehensive tests (in-game)
# Press F12 in browser, then run:
# game.testingSystem.runAllTests()
```

### Debug Console
- **Open:** Press F12 in browser
- **Console:** Check for JavaScript errors
- **Network:** Monitor file loading

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Try different port
python server.py --port 8001
python server.py --port 8080
python server.py --port 9000
```

### Python Not Found
1. **Download Python** from [python.org](https://python.org)
2. **Install with "Add to PATH"** checked
3. **Restart terminal/command prompt**

### Game Doesn't Load
1. **Check browser console** (F12 → Console)
2. **Verify all files** are in the correct directory
3. **Try different browser** (Chrome, Firefox, Edge)
4. **Clear browser cache** (Ctrl+F5)

### Server Won't Start
1. **Check if port is free:** `netstat -an | findstr :8000`
2. **Run as administrator** (Windows)
3. **Check firewall settings**

## 📁 File Structure
```
star-sea/
├── index.html              # Main game file
├── server.py               # Python server
├── start_server.bat        # Windows launcher
├── start_server.sh         # macOS/Linux launcher
├── js/                     # JavaScript files
│   ├── main.js            # Game entry point
│   ├── core/              # Core systems
│   ├── entities/          # Game entities
│   ├── systems/           # Game systems
│   └── components/        # ECS components
└── README_SERVER.md        # This guide
```

## 🎯 Features Implemented

### ✅ Core Systems
- Physics engine (planck.js)
- Entity-Component-System (ECS)
- Input handling
- Audio system
- Save/load system

### ✅ Combat Systems
- Beam weapons
- Torpedo launchers
- Lock-on system
- Shield system
- Countermeasures

### ✅ Advanced Systems
- Tractor beam
- Power management
- Bay system
- Transporter system
- Sensor systems

### ✅ Environmental
- Asteroids with breaking
- Collapsars (gravity wells)
- Dust clouds
- Planets/moons

### ✅ AI Systems
- Advanced AI controller
- Faction-specific behavior
- Targeting system
- Pathfinding

### ✅ Testing & Balance
- Comprehensive test suite
- Balance monitoring
- Performance optimization
- Quality assurance

## 🎉 Ready to Play!

The Star Sea game is now fully implemented with all requested features. Enjoy exploring the galaxy with your advanced starship!

**Happy Gaming!** 🚀✨

