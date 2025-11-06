# 🚀 Star Sea - Local Development Server

## Quick Start

### Windows
1. Double-click `start_server.bat`
2. The game will open in your browser at `http://localhost:8000`

### macOS/Linux
1. Open terminal in the Star Sea directory
2. Run: `chmod +x start_server.sh && ./start_server.sh`
3. The game will open in your browser at `http://localhost:8000`

### Manual Start
```bash
python3 server.py
```

## Server Options

```bash
# Custom port
python3 server.py --port 8080

# Custom host
python3 server.py --host 0.0.0.0

# Don't open browser automatically
python3 server.py --no-browser
```

## Game Controls

| Key | Function |
|-----|----------|
| **WASD** | Movement |
| **Mouse** | Aiming |
| **Left Click** | Fire Beam |
| **Right Click** | Fire Torpedo |
| **Q** | Tractor Beam |
| **T** | Transporter |
| **TAB** | Power Management |
| **1-6** | Shuttle Missions |
| **7-8** | Fighter/Bomber |
| **V** | Warp Drive |
| **ESC** | Pause/Menu |

## Troubleshooting

### Port Already in Use
If port 8000 is busy, try:
```bash
python3 server.py --port 8001
```

### Python Not Found
Install Python 3.6+ from [python.org](https://python.org)

### Browser Doesn't Open
Manually open: `http://localhost:8000`

### Game Doesn't Load
1. Check browser console for errors (F12)
2. Ensure all files are in the correct directory
3. Try a different browser

## Development

The server includes:
- ✅ CORS headers for development
- ✅ Correct MIME types for JavaScript/CSS
- ✅ Automatic browser opening
- ✅ Error handling and logging

## Features

- 🌐 Local HTTP server
- 🎮 Complete Star Sea game
- 🚀 All advanced systems implemented
- 🧪 Testing and balance systems
- 📊 Performance monitoring

