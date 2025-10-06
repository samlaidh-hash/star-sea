# Star Sea Agent Guidelines

## Project Overview
Project Name: Star Sea
Type: Vibe coding project
Tech Stack: HTML, CSS, JavaScript, Three.js
Architecture: Modular design with HTML calling JS functions.

## Key Principles
- Keep code modular with HTML invoking JavaScript functions.
- Maintain separation of concerns between structure, styling, and logic.
- Record decisions and progress in memory.md.
- Track bugs in bugs.md and predictive notes in predict.md.

## File Structure
- index.html - Main game file.
- css/ - Presentation styles.
- js/ - Gameplay and engine code.
  - js/core/ - Engine services.
  - js/entities/ - Ship systems.
  - js/components/ - Ship subsystems.
  - js/ui/ - HUD logic.
  - js/rendering/ - Canvas layers.
  - js/config/ - Shared data and configuration flags.
- system_chart_data.json - Star system data.
- parse_system_chart.py - Regenerates derived data from system_chart_data.json.
- ASSETS/ - Layered source art.
- Ship Icons/ - Exported sprites ready for HUD integration.
- screenshots/ - Captured evidence from automated or manual runs.
- memory_*.md - Session memory files.
- bugs.md - Bug and error log.
- predict.md - Predictive modeling notes.
- auditor.md - Prevention rules and detection patterns.
- prompts.md - Running prompt log.

## Build, Test, and Development Commands
- npm install
- npx http-server . -p 8000 or python -m http.server 8000, then open http://localhost:8000
- node test-game.js (downloads Playwright browsers on first run)
- Live Server or equivalent tooling may be used for local previews when appropriate.

## Coding Style and Naming
- Four-space indentation, semicolons, and const or let instead of var.
- Classes in js/core/ and js/entities/ use PascalCase (for example Engine.js).
- Utilities and config exports use lowerCamelCase.
- CSS selectors, asset names, and files stay in kebab-case.
- Use descriptive names, small focused functions, and comments only for complex logic.
- Prefer arrow functions for callbacks and template literals for string interpolation.
- Keep HTML focused on structure while CSS handles visuals and JavaScript manages interactivity.

## Debugging Methodology
1. Define the problem precisely and capture exact symptoms.
2. Identify the three most likely causes using logical deduction.
3. Check each cause systematically, one at a time.
4. Trace the execution flow line by line before changing code.
5. Avoid random debugging; skip uncontrolled console logging or trial and error.
6. Fix the root cause and remove temporary instrumentation after verification.

## Workflow Requirements
### Session Memory Management
- Always read the most recent memory_*.md before starting work.
- Create a new session memory file (memory_YYYYMMDD_HHMMSS.md) after reviewing the latest entry.
- Record decisions, progress, and current state throughout the session.
- Update session memory every 15-30 minutes during active work.

### Error Prevention and Tracking
- Review bugs.md before coding to understand recent issues.
- Review auditor.md for active prevention rules and detection patterns.
- Log any new bugs in bugs.md and update auditor.md when patterns emerge.

### Progress Management
- Display progress percentage while executing tasks.
- Record prompts and interactions in Prompts.md.

### Code Replacement and Refactoring
1. Search the codebase to ensure functionality does not already exist.
2. Comment out code being replaced with // COMMENTED OUT: [reason] - Replaced by [new implementation].
3. Add the new implementation immediately after the commented block.
4. Update all dependencies and callers to reference the new code.
5. Verify no code references the deprecated implementation and run appropriate tests.
6. Document the change in the current session memory entry.

## Testing Guidelines
- Extend Playwright flows inside test-game.js.
- Each scenario should assert HUD state or capture screenshots for evidence.
- Use Playwright for automated coverage without intrusive instrumentation.
- When modifying physics, document expectations in TESTING_REQUIRED.txt and log observations in the latest memory_*.md.
- Maintain deterministic behavior by seeding randomness or gating debug tools behind CONFIG.DEBUG_MODE.

## Automated Testing with Playwright
Setup:
```bash
npm init -y
npm install --save-dev playwright
npx playwright install chromium
```
Usage:
```bash
node test-game.js
```
The script drives New Game -> Accept Mission, simulates input, captures screenshots (01-main-menu.png through 12-final-state.png) into ./screenshots/, and verifies HUD elements.

## Commands to Remember
- Lint: TBD based on project setup.
- Test: TBD based on project setup.
- Build: TBD based on project setup.

## Asset and Data Handling
- Keep layered source art in Ship Icons/ or .pdn files; export flattened PNGs for HUD integration.
- Regenerate system_chart_data.json derivatives via parse_system_chart.py and commit source spreadsheets.
- Avoid editing node_modules/ directly; rely on npm update for third-party changes and document fixes in BUGFIXES_*.md.

## HTML5 Game Development Patterns
- Use requestAnimationFrame for the main game loop.
- Employ Three.js for scene management and rendering.
- Handle input via event-driven keyboard and mouse listeners.
- Keep code modular and object-oriented.

## AI Response Protocol
- Before answering, perform a structured analysis covering Understand, Analyze, Reason, Synthesize, and Conclude.
- Provide responses structured across Bloom's taxonomy: Remember, Understand, Apply, Analyze, Synthesize, Evaluate, and Create.
- Keep answers modular, traceable, and aligned with the debugging methodology above.
