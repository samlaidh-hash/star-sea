# Star Sea - Diagnostic Mode

## Issue: Game freezing after accepting mission

## How to diagnose:

1. **Open Browser Console** (F12 or Right-click > Inspect > Console)

2. **Start the game** and click "New Game" then "Accept Mission"

3. **Watch the console output** - it will show step-by-step what's happening:
   - 🎯 Starting mission
   - 📋 Starting mission in MissionManager
   - ✅ Mission started in MissionManager
   - 🔧 Applying upgrades
   - 🧹 Clearing entities
   - 🎭 Spawning enemies
   - 🏭 Spawning mission entities
   - 📋 Showing objectives
   - ✅ Mission start complete!

4. **If it freezes**, note which step it freezes on:
   - If it freezes before "Mission start complete!" - there's an error in mission loading
   - If it freezes after "Mission start complete!" - there's an error in the game loop

5. **Look for error messages**:
   - Red text starting with "❌ CRITICAL ERROR"
   - "ERROR IN RENDER:"
   - "Error updating entities:"
   - "Error in AI controller update:"
   - "⚠️ Slow update detected!"

6. **Report back** which error you see (copy the full error message including stack trace)

## Common issues and fixes:

### Issue: "Cannot read property 'x' of undefined"
**Cause:** Entity not properly initialized
**Fix:** Will need to add null checks to that specific entity type

### Issue: "Maximum call stack size exceeded"
**Cause:** Infinite loop or recursive function
**Fix:** Will need to find and break the recursion

### Issue: Freezes during "Spawning enemies"
**Cause:** Error in Ship class or AI controller initialization
**Fix:** Will need to add error handling to Ship constructor

### Issue: Freezes during render
**Cause:** Renderer trying to draw entity with missing properties
**Fix:** Will add null checks to renderer

### Issue: "⚠️ Slow update" messages keep appearing
**Cause:** One of the update methods is taking too long
**Fix:** Will optimize or disable that specific system

## Quick Test:

If you want to test without a mission, you can open console and type:
```javascript
window.game.testingSystem.runBasicTest()
```

This should create a simple test scenario without loading a full mission.
