# Star Sea - Audio Setup Guide

## Overview
The audio system has been implemented and integrated with all game events. You now need to provide the actual sound files.

## Required Folder Structure

Create the following folder structure in your project:

```
STAR SEA/
├── assets/
│   └── audio/
│       ├── sfx/          # Sound effects
│       └── music/        # Music tracks
```

## Required Sound Files

### Sound Effects (assets/audio/sfx/)

**Weapons (8 files):**
- `beam-fire.mp3` - Beam weapon firing
- `torpedo-fire.mp3` - Torpedo launch
- `disruptor-fire.mp3` - Disruptor firing (Trigon weapon)
- `plasma-fire.mp3` - Plasma torpedo launch (Scintilian weapon)
- `beam-hit.mp3` - Beam impact
- `torpedo-explosion.mp3` - Torpedo explosion
- `plasma-explosion.mp3` - Plasma torpedo explosion
- `shield-hit.mp3` - Shield impact

**Ship/Damage (5 files):**
- `explosion-small.mp3` - Small ship explosion (Frigates)
- `explosion-medium.mp3` - Medium ship explosion (Cruisers)
- `explosion-large.mp3` - Large ship explosion (Battlecruisers)
- `system-damage.mp3` - System hit sound
- `hull-breach.mp3` - Hull damage sound

**Systems (4 files):**
- `warp-jump.mp3` - Warp activation
- `engine-thrust.mp3` - Engine thrust (optional)
- `cloak-activate.mp3` - Cloak activation (optional)
- `cloak-deactivate.mp3` - Cloak deactivation (optional)

**Countermeasures (3 files):**
- `decoy-deploy.mp3` - Decoy launch
- `mine-deploy.mp3` - Mine deployment
- `mine-detonate.mp3` - Mine explosion (optional)

**UI (5 files):**
- `ui-click.mp3` - Button click
- `ui-confirm.mp3` - Confirmation sound
- `ui-cancel.mp3` - Cancel sound
- `lock-acquired.mp3` - Torpedo lock-on
- `alert-warning.mp3` - Critical warning

**Mission (3 files):**
- `objective-complete.mp3` - Objective completed
- `mission-complete.mp3` - Mission victory
- `mission-failed.mp3` - Mission defeat

### Music Tracks (assets/audio/music/)

**Required (8 tracks):**
- `main-menu.mp3` - Main menu theme
- `briefing.mp3` - Mission briefing music
- `combat-1.mp3` - Combat music (track 1)
- `combat-2.mp3` - Combat music (track 2)
- `combat-3.mp3` - Combat music (track 3)
- `victory.mp3` - Victory fanfare
- `defeat.mp3` - Defeat music
- `ambient.mp3` - Ambient space music

## Sound Duration Trimming

The audio system supports playing only part of a sound file. This is useful if you have long sound files and only want to use a portion.

**Current trim settings are in `AudioConfig.js`:**

```javascript
playbackConfig: {
    'explosion-large': { volume: 1.0, duration: 3.0 },  // Only play 3 seconds
    'beam-fire': { volume: 0.6, duration: 0.5 },       // Only play 0.5 seconds
    // ... etc
}
```

You can adjust these values based on your actual sound files.

## Finding Free Sound Effects

Here are some resources for free space game sounds:

### Sound Effects:
1. **Freesound.org** - https://freesound.org/
   - Search: "laser", "explosion", "sci-fi", "space"
   - License: Various (check individual sounds)

2. **OpenGameArt.org** - https://opengameart.org/
   - Search: "space shooter", "sci-fi weapons"
   - License: Public Domain, CC0, CC-BY

3. **Sonniss Game Audio GDC Bundles** - https://sonniss.com/gameaudiogdc
   - Free annual bundles with professional sounds
   - License: Royalty-free

4. **ZapSplat** - https://www.zapsplat.com/
   - Search: "sci-fi", "laser", "explosion"
   - License: Free with attribution

### Music:
1. **Incompetech** - https://incompetech.com/music/royalty-free/
   - Genre: Sci-Fi, Ambient, Action
   - License: CC-BY (free with credit)

2. **Purple Planet Music** - https://www.purple-planet.com/
   - Genre: Sci-Fi, Space
   - License: CC-BY (free with credit)

3. **FreeSound.org** - Also has music loops

4. **ccMixter** - http://ccmixter.org/
   - License: Various Creative Commons

## Loading Custom Sounds

Once you have your sound files, the audio system will automatically try to load them when the game starts. If a file is missing, you'll see a console warning but the game will still work (just without that sound).

## Volume Controls

The audio system has three volume levels:
- **Master Volume**: Controls everything (default: 1.0)
- **SFX Volume**: Controls sound effects (default: 0.7)
- **Music Volume**: Controls music (default: 0.5)

These can be adjusted in the code or via UI (not yet implemented).

## Testing

To test if sounds are loading:
1. Open browser console (F12)
2. Start a new game
3. Look for "Loaded sound: [name]" messages
4. If you see errors, check the file paths

## File Format Support

The audio system supports:
- **MP3** - Best compatibility, recommended
- **OGG** - Good compression, good support
- **WAV** - Uncompressed, large files
- **M4A** - Good compression, good support

**Recommendation:** Use MP3 for maximum browser compatibility.

## Notes

- The audio context initializes on first user interaction (browser requirement)
- Sounds won't play until the player clicks "New Game" or another button
- If sounds aren't playing, check browser console for errors
- Make sure file paths match exactly (case-sensitive on some servers)

## Quick Start

**Minimum viable audio setup (5 files):**
1. `beam-fire.mp3` - For weapons
2. `torpedo-explosion.mp3` - For all explosions
3. `shield-hit.mp3` - For impacts
4. `objective-complete.mp3` - For objectives
5. `combat-1.mp3` - For music

These 5 files will cover the most important audio feedback. You can add more sounds later.
