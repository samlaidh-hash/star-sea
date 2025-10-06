# Star Sea- Project Memory

- You are an expert software developer with decades of experience and specific expertise in game development

## Project Overview
**Project Name:** Star Sea
**Type:** Vibe coding project  
**Tech Stack:** HTML, CSS, JavaScript, Three.js
**Architecture:** Modular design with HTML calling JS functions  

## Key Principles
- Keep code modular (HTML calls JS functions)
- Maintain separation of concerns
- Regular memory updates in memory.md
- Track bugs and errors in bugs.md
- Use predictive modeling in predict.md to prevent recurring mistakes

## File Structure
- `CLAUDE.md` - This project memory file
- `memory.md` - Regular progress and decision tracking
- `bugs.md` - Error and bug tracking
- `predict.md` - Predictive error modeling

/
├── index.html           # Main game file (HTML)
├── css/           # CSS
└── js/             # Javascript
```


## Commands to Remember
- Lint: (TBD - to be determined based on project setup)
- Test: (TBD - to be determined based on project setup)
- Build: (TBD - to be determined based on project setup)

## Highly Effective Debugging Methodology
**ALWAYS use this systematic approach for ANY coding issue:**

1. **Define Problem Precisely** - Get exact symptoms from user
2. **Identify 3 Most Likely Causes** - Use logical deduction, don't guess
3. **Check Causes Systematically** - One at a time, in order of likelihood
4. **Think Through Code Flow** - Trace execution path line by line
5. **NO RANDOM DEBUGGING** - No console.log spam, no trial-and-error
6. **FIX ROOT CAUSE** - Don't just patch symptoms

**Example Success (Ghost Movement + Execution Crash):**
- Ghost not moving: 3 causes → Hull cache issue (cause 2) → Fix cache key
- Execution crash: 3 causes → Console spam (cause 1) → Remove logging
- Result: Both fixed efficiently without debug noise

**This methodology prevents:**
- Wasted time on debugging logs
- Trial-and-error approaches  
- Fixing symptoms instead of causes
- Creating new problems while fixing old ones

## Notes
- Focus on clean, modular code
- HTML should primarily handle structure and call JS functions
- CSS for styling and visual effects
- JavaScript for all logic and interactivity

- Use Playwright for testing
- Live Server extension for local development

## Automated Testing with Playwright
**Purpose:** Systematically test game behavior through automated browser interactions

**Setup:**
```bash
npm init -y
npm install --save-dev playwright
npx playwright install chromium
```

**Test Script:** `test-game.js` provides:
- Automated game launch and navigation (New Game → Accept Mission)
- Keyboard input simulation (W/A/S/D for movement)
- Mouse interaction (clicks for weapons, cursor movement)
- Screenshot capture at each step for visual verification
- HUD element verification
- Extended gameplay sessions

**Usage:**
```bash
node test-game.js
```

**Screenshots saved to:** `./screenshots/`
- 01-main-menu.png
- 02-mission-briefing.png
- 03-gameplay-initial.png
- 04-after-thrust-w.png
- 05-after-turn-d.png
- 06-beam-fire.png
- 07-torpedo-fire.png
- 08-hud-check.png
- 09-ship-visuals.png
- 10-minimap-closeup.png
- 11-extended-gameplay.png
- 12-final-state.png

**Benefits:**
- Visual verification of game state
- Reproducible test cases
- Non-intrusive observation (no code instrumentation needed)
- Can test user experience (UI/UX flow)
- Captures rendering issues, HUD problems, visual glitches

## Code Style Guidelines
- Use descriptive variable and function names
- Keep functions small and focused
- Add comments for complex game logic
- Use const/let instead of var
- Prefer arrow functions for callbacks
- Use template literals for string interpolation

## HTML5 Game Development Patterns
- Single-file architecture with embedded CSS and JavaScript
- Three.js for 3D rendering and scene management
- Event-driven input handling (keyboard, mouse)
- Modular JavaScript with object-oriented approach
- CSS for UI panels and HUD elements
- RequestAnimationFrame for smooth game loop

## CRITICAL Workflow Requirements

### Session Memory Management - MANDATORY FIRST STEP
- **STEP 1: ALWAYS read the most recent memory file in the working directory FIRST** - Use Glob to find latest `memory_*.md` file and read it completely for full context of previous work
- **STEP 2: Create new session memory file** - Use format: `memory_YYYYMMDD_HHMMSS.md` after reading previous session
- **ALWAYS record session activities** - Document decisions, progress, and current state in session memory file  
- **ALWAYS update session memory periodically** - Record activity every 15-30 minutes during work
- **NEVER start work without reading previous session memory** - Critical for understanding current state and avoiding rework

### Error Prevention & Tracking  
- **ALWAYS check bugs.md before coding** - Review recent errors and patterns to avoid repeating mistakes
- **ALWAYS check auditor.md before coding** - Review active prevention rules and error detection patterns
- **ALWAYS record errors in bugs.md** - Document any bugs or errors encountered during development
- **ALWAYS update auditor.md** - When patterns emerge from bugs.md, enhance the auditor agent's detection rules

### Progress Management
- **ALWAYS show progress percentage** - Display "Progress: X%" during task execution and update as work progresses
- **ALWAYS record prompts in a separate file** - Called Prompts.md

### Code Replacement & Refactoring Rules - CRITICAL
- **NEVER create duplicate code** - Always check if functionality already exists before creating new code
- **ALWAYS analyze existing codebase first** - Review what's implemented to prevent duplicate work
- **When replacing existing code:**
  1. Comment out the old code first with a clear note: `// COMMENTED OUT: [reason] - Replaced by [new implementation]`
  2. Add the new code immediately after the commented section
  3. **CRITICAL: Update ALL dependencies** - Search for and update every file that references the old code
  4. **CRITICAL: Update ALL children** - Ensure no code is left calling the old, commented-out functions
  5. Test that all references have been updated and nothing breaks
- **Document code changes** - Note in session memory when code is replaced and why 

## META-PROMPT: INSTRUCTION FOR AI
Before providing a direct answer to the preceding question, you must first perform and present a structured analysis. This analysis will serve as the foundation for your final response.

Part 1: Initial Question Deconstruction First, deconstruct the user's query using the following five steps. Your analysis here should be concise.

    UNDERSTAND: What is the core question being asked?

    ANALYZE: What are the key factors, concepts, and components involved in the question?

    REASON: What logical connections, principles, or causal chains link these components?

    SYNTHESIZE: Based on the analysis, what is the optimal strategy to structure a comprehensive answer?

    CONCLUDE: What is the most accurate and helpful format for the final response (e.g., a list, a step-by-step guide, a conceptual explanation)?

Part 2: Answer Structuring Mandate After presenting the deconstruction, you will provide the full, comprehensive answer to the user's original question. This answer must be structured according to the following seven levels of Bloom's cognitive taxonomy. For each level, you must: a) Define the cognitive task as it relates to the question. b) Explain the practical application or concept at that level. c) Provide a specific, illustrative example.

The required structure is:

    Level 1: Remember (Knowledge)

    Level 2: Understand (Comprehension)

    Level 3: Apply (Application)

    Level 4: Analyze

    Level 5: Synthesize

    Level 6: Evaluate

    Level 7: Create

Part 3: Final Execution Execute Part 1 and Part 2 in order. Do not combine them. Present the deconstruction first, followed by the detailed, multi-level answer.