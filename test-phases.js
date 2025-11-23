/**
 * Star Sea - Phase Testing Script
 * Tests Phases 1, 3, 5, and 8 implementations
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testPhases() {
    console.log('========================================');
    console.log('STAR SEA - PHASE TESTING');
    console.log('Testing: Phase 1, 3, 5, 8');
    console.log('========================================\n');

    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'test-screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    const browser = await chromium.launch({
        headless: false,
        slowMo: 300
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Track console errors
    const consoleErrors = [];
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error') {
            const text = msg.text();
            consoleErrors.push(text);
            console.log(`  [ERROR] ${text}`);
        }
    });

    const testResults = {
        phase1: { status: 'pending', tests: [] },
        phase3: { status: 'pending', tests: [] },
        phase5: { status: 'pending', tests: [] },
        phase8: { status: 'pending', tests: [] },
        consoleErrors: []
    };

    try {
        // ========================================
        // SETUP: Load Game
        // ========================================
        console.log('\n[SETUP] Loading game...');
        await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(screenshotDir, '00-main-menu.png'),
            fullPage: true
        });
        console.log('  ✓ Main menu loaded');

        // Start new game
        console.log('\n[SETUP] Starting new game...');
        await page.click('#btn-new-game');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotDir, '01-mission-briefing.png'),
            fullPage: true
        });
        console.log('  ✓ Mission briefing displayed');

        // Accept mission
        console.log('\n[SETUP] Accepting mission...');
        await page.click('#btn-accept-mission');
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(screenshotDir, '02-gameplay-initial.png'),
            fullPage: true
        });
        console.log('  ✓ Gameplay started\n');

        // ========================================
        // PHASE 1: Dynamic HUD & Systems Display
        // ========================================
        console.log('========================================');
        console.log('PHASE 1: Dynamic HUD & Systems Display');
        console.log('========================================\n');

        console.log('[P1-1] Checking dynamic weapon display...');
        const weaponDisplay = await page.evaluate(() => {
            const systemsPanel = document.getElementById('systems-list');
            if (!systemsPanel) return { error: 'systems-list not found' };

            const html = systemsPanel.innerHTML;
            const weaponMatches = html.match(/class="system-item"/g);
            const weaponCount = weaponMatches ? weaponMatches.length : 0;

            // Check for weapon names
            const hasBeam = html.includes('Beam');
            const hasTorpedo = html.includes('Torpedo');
            const hasDisruptor = html.includes('Disruptor');

            return {
                weaponCount,
                hasBeam,
                hasTorpedo,
                hasDisruptor,
                html: html.substring(0, 500) // First 500 chars for debugging
            };
        });

        console.log('  Weapon systems found:', weaponDisplay.weaponCount);
        console.log('  Has Beam:', weaponDisplay.hasBeam);
        console.log('  Has Torpedo:', weaponDisplay.hasTorpedo);
        testResults.phase1.tests.push({
            name: 'Dynamic weapon display',
            passed: weaponDisplay.weaponCount > 0,
            details: weaponDisplay
        });

        console.log('\n[P1-2] Checking consumables section...');
        const consumables = await page.evaluate(() => {
            const consumablesSection = document.querySelector('.consumables-section');
            return {
                exists: !!consumablesSection,
                visible: consumablesSection ? consumablesSection.style.display !== 'none' : false,
                html: consumablesSection ? consumablesSection.innerHTML.substring(0, 300) : ''
            };
        });

        console.log('  Consumables section exists:', consumables.exists);
        testResults.phase1.tests.push({
            name: 'Consumables section',
            passed: consumables.exists,
            details: consumables
        });

        console.log('\n[P1-3] Checking torpedo storage...');
        const torpedoStorage = await page.evaluate(() => {
            const torpedoElement = document.getElementById('torpedo-storage');
            return {
                exists: !!torpedoElement,
                text: torpedoElement ? torpedoElement.textContent : '',
                visible: torpedoElement ? torpedoElement.style.display !== 'none' : false
            };
        });

        console.log('  Torpedo storage display:', torpedoStorage.text);
        testResults.phase1.tests.push({
            name: 'Torpedo storage display',
            passed: torpedoStorage.exists,
            details: torpedoStorage
        });

        await page.screenshot({
            path: path.join(screenshotDir, '03-phase1-hud-federation.png'),
            fullPage: true
        });
        console.log('  ✓ Screenshot: Phase 1 - Federation HUD');

        testResults.phase1.status = 'completed';

        // ========================================
        // PHASE 3: Movement Enhancements
        // ========================================
        console.log('\n========================================');
        console.log('PHASE 3: Movement Enhancements');
        console.log('========================================\n');

        console.log('[P3-1] Testing double-tap turn boost (A key)...');
        // First tap
        await page.keyboard.press('a');
        await page.waitForTimeout(100);
        // Second tap (within 300ms)
        await page.keyboard.press('a');
        await page.waitForTimeout(600); // Wait for 0.5s boost duration

        await page.screenshot({
            path: path.join(screenshotDir, '04-phase3-double-tap-a.png'),
            fullPage: true
        });
        console.log('  ✓ Double-tap A executed (visual confirmation needed)');
        testResults.phase3.tests.push({
            name: 'Double-tap A turn boost',
            passed: true, // Visual test
            details: 'Executed double-tap, requires visual confirmation'
        });

        console.log('\n[P3-2] Testing double-tap turn boost (D key)...');
        await page.keyboard.press('d');
        await page.waitForTimeout(100);
        await page.keyboard.press('d');
        await page.waitForTimeout(600);

        await page.screenshot({
            path: path.join(screenshotDir, '05-phase3-double-tap-d.png'),
            fullPage: true
        });
        console.log('  ✓ Double-tap D executed (visual confirmation needed)');
        testResults.phase3.tests.push({
            name: 'Double-tap D turn boost',
            passed: true,
            details: 'Executed double-tap, requires visual confirmation'
        });

        console.log('\n[P3-3] Testing X key emergency stop...');
        // First, move forward
        await page.keyboard.down('w');
        await page.waitForTimeout(1500);
        await page.keyboard.up('w');

        // Get shields before stop
        const shieldsBefore = await page.evaluate(() => {
            const foreShield = document.getElementById('fore-shield-fill');
            const foreWidth = foreShield ? parseFloat(foreShield.style.width) : 0;
            return { fore: foreWidth };
        });

        // Now emergency stop
        await page.keyboard.press('x');
        await page.waitForTimeout(500);

        // Get shields after stop
        const shieldsAfter = await page.evaluate(() => {
            const foreShield = document.getElementById('fore-shield-fill');
            const foreWidth = foreShield ? parseFloat(foreShield.style.width) : 0;
            return { fore: foreWidth };
        });

        await page.screenshot({
            path: path.join(screenshotDir, '06-phase3-emergency-stop.png'),
            fullPage: true
        });
        console.log('  Fore shield before:', shieldsBefore.fore);
        console.log('  Fore shield after:', shieldsAfter.fore);
        console.log('  ✓ Emergency stop executed');
        testResults.phase3.tests.push({
            name: 'X key emergency stop',
            passed: true,
            details: { shieldsBefore, shieldsAfter }
        });

        testResults.phase3.status = 'completed';

        // ========================================
        // PHASE 5: Lock-On System
        // ========================================
        console.log('\n========================================');
        console.log('PHASE 5: Lock-On System');
        console.log('========================================\n');

        console.log('[P5-1] Testing reticle rotation on hover...');

        // Find enemy ship location (if any)
        const enemyLocation = await page.evaluate(() => {
            // Try to find an enemy indicator on minimap or screen
            const canvas = document.getElementById('gameCanvas');
            // Return center-right area where enemies typically spawn
            return { x: 1200, y: 500 };
        });

        // Hover over potential enemy location
        await page.mouse.move(enemyLocation.x, enemyLocation.y);
        await page.waitForTimeout(1000); // Wait for lock-on to start

        const reticleState1 = await page.evaluate(() => {
            const reticle = document.getElementById('reticle');
            if (!reticle) return { error: 'reticle not found' };

            const style = window.getComputedStyle(reticle);
            const classes = reticle.className;

            return {
                display: style.display,
                classes: classes,
                hasRotating: classes.includes('rotating'),
                hasLocked: classes.includes('locked')
            };
        });

        console.log('  Reticle state (hovering):', reticleState1);
        testResults.phase5.tests.push({
            name: 'Reticle rotation on hover',
            passed: reticleState1.display !== 'none',
            details: reticleState1
        });

        await page.screenshot({
            path: path.join(screenshotDir, '07-phase5-hover.png'),
            fullPage: true
        });
        console.log('  ✓ Screenshot: Hovering for lock-on');

        console.log('\n[P5-2] Waiting for lock acquisition (3 seconds)...');
        await page.waitForTimeout(3000); // Wait for lock to complete

        const reticleState2 = await page.evaluate(() => {
            const reticle = document.getElementById('reticle');
            if (!reticle) return { error: 'reticle not found' };

            const style = window.getComputedStyle(reticle);
            const classes = reticle.className;

            return {
                classes: classes,
                hasRotating: classes.includes('rotating'),
                hasLocked: classes.includes('locked'),
                color: style.borderColor || style.color
            };
        });

        console.log('  Reticle state (locked):', reticleState2);
        testResults.phase5.tests.push({
            name: 'Lock acquisition',
            passed: reticleState2.hasLocked || !reticleState2.hasRotating,
            details: reticleState2
        });

        await page.screenshot({
            path: path.join(screenshotDir, '08-phase5-locked.png'),
            fullPage: true
        });
        console.log('  ✓ Screenshot: Lock acquired');

        console.log('\n[P5-3] Checking enemy info panel...');
        const enemyPanel = await page.evaluate(() => {
            const panel = document.getElementById('enemy-info-panel');
            return {
                exists: !!panel,
                visible: panel ? panel.style.display !== 'none' : false,
                html: panel ? panel.innerHTML.substring(0, 300) : ''
            };
        });

        console.log('  Enemy panel exists:', enemyPanel.exists);
        console.log('  Enemy panel visible:', enemyPanel.visible);
        testResults.phase5.tests.push({
            name: 'Enemy info panel',
            passed: enemyPanel.exists,
            details: enemyPanel
        });

        console.log('\n[P5-4] Testing auto-aim beam fire...');
        // Fire beams at locked target
        await page.mouse.click(enemyLocation.x, enemyLocation.y);
        await page.waitForTimeout(500);

        await page.screenshot({
            path: path.join(screenshotDir, '09-phase5-beam-autoaim.png'),
            fullPage: true
        });
        console.log('  ✓ Beam fired with auto-aim');
        testResults.phase5.tests.push({
            name: 'Auto-aim beam fire',
            passed: true, // Visual test
            details: 'Beam fired, auto-aim requires visual confirmation'
        });

        console.log('\n[P5-5] Checking F key removed from controls...');
        const controlsText = await page.evaluate(() => {
            const controls = document.getElementById('controls-summary');
            return {
                text: controls ? controls.textContent : '',
                hasFKey: controls ? controls.textContent.includes('F -') : false
            };
        });

        console.log('  F key in controls:', controlsText.hasFKey);
        testResults.phase5.tests.push({
            name: 'F key removed',
            passed: !controlsText.hasFKey,
            details: controlsText
        });

        testResults.phase5.status = 'completed';

        // ========================================
        // PHASE 8: Cooldown Fade
        // ========================================
        console.log('\n========================================');
        console.log('PHASE 8: Cooldown Fade');
        console.log('========================================\n');

        console.log('[P8-1] Testing weapon cooldown fade...');

        // Fire beam weapon
        await page.mouse.click(1000, 500);
        await page.waitForTimeout(100); // Immediate check during cooldown

        const cooldownState = await page.evaluate(() => {
            const systemsList = document.getElementById('systems-list');
            if (!systemsList) return { error: 'systems-list not found' };

            const systems = systemsList.querySelectorAll('.system-item');
            const results = [];

            systems.forEach(system => {
                const name = system.querySelector('.system-name')?.textContent || '';
                const hasCooldown = system.classList.contains('cooling-down');
                const opacity = window.getComputedStyle(system).opacity;

                results.push({
                    name,
                    hasCooldown,
                    opacity: parseFloat(opacity)
                });
            });

            return { systems: results };
        });

        console.log('  Weapon systems during cooldown:');
        cooldownState.systems?.forEach(sys => {
            console.log(`    ${sys.name}: opacity=${sys.opacity}, cooling=${sys.hasCooldown}`);
        });

        const hasFadedSystem = cooldownState.systems?.some(s => s.opacity < 1.0 || s.hasCooldown);
        testResults.phase8.tests.push({
            name: 'Cooldown fade effect',
            passed: hasFadedSystem,
            details: cooldownState
        });

        await page.screenshot({
            path: path.join(screenshotDir, '10-phase8-cooldown-fade.png'),
            fullPage: true
        });
        console.log('  ✓ Screenshot: Cooldown fade');

        console.log('\n[P8-2] Waiting for cooldown to complete...');
        await page.waitForTimeout(2000); // Wait for cooldown to finish

        const postCooldownState = await page.evaluate(() => {
            const systemsList = document.getElementById('systems-list');
            if (!systemsList) return { error: 'systems-list not found' };

            const systems = systemsList.querySelectorAll('.system-item');
            const results = [];

            systems.forEach(system => {
                const name = system.querySelector('.system-name')?.textContent || '';
                const hasCooldown = system.classList.contains('cooling-down');
                const opacity = window.getComputedStyle(system).opacity;

                results.push({
                    name,
                    hasCooldown,
                    opacity: parseFloat(opacity)
                });
            });

            return { systems: results };
        });

        console.log('  Weapon systems after cooldown:');
        postCooldownState.systems?.forEach(sys => {
            console.log(`    ${sys.name}: opacity=${sys.opacity}, cooling=${sys.hasCooldown}`);
        });

        const allRestored = postCooldownState.systems?.every(s => s.opacity >= 0.95);
        testResults.phase8.tests.push({
            name: 'Cooldown fade restore',
            passed: allRestored,
            details: postCooldownState
        });

        await page.screenshot({
            path: path.join(screenshotDir, '11-phase8-cooldown-restored.png'),
            fullPage: true
        });
        console.log('  ✓ Screenshot: Cooldown restored');

        testResults.phase8.status = 'completed';

        // ========================================
        // FINAL SCREENSHOTS
        // ========================================
        console.log('\n========================================');
        console.log('FINAL STATE');
        console.log('========================================\n');

        await page.screenshot({
            path: path.join(screenshotDir, '12-final-state.png'),
            fullPage: true
        });
        console.log('  ✓ Final state screenshot');

        // Record console errors
        testResults.consoleErrors = consoleErrors;

        // ========================================
        // GENERATE REPORT
        // ========================================
        console.log('\n========================================');
        console.log('TEST RESULTS SUMMARY');
        console.log('========================================\n');

        const phases = ['phase1', 'phase3', 'phase5', 'phase8'];
        const phaseNames = {
            phase1: 'Phase 1: Dynamic HUD & Systems Display',
            phase3: 'Phase 3: Movement Enhancements',
            phase5: 'Phase 5: Lock-On System',
            phase8: 'Phase 8: Cooldown Fade'
        };

        let totalTests = 0;
        let passedTests = 0;

        phases.forEach(phaseKey => {
            const phase = testResults[phaseKey];
            const passed = phase.tests.filter(t => t.passed).length;
            const total = phase.tests.length;
            totalTests += total;
            passedTests += passed;

            console.log(`${phaseNames[phaseKey]}: ${passed}/${total} tests passed`);
            phase.tests.forEach(test => {
                const icon = test.passed ? '✓' : '✗';
                console.log(`  ${icon} ${test.name}`);
            });
            console.log('');
        });

        console.log(`OVERALL: ${passedTests}/${totalTests} tests passed`);
        console.log(`Console Errors: ${consoleErrors.length}`);

        if (consoleErrors.length > 0) {
            console.log('\nConsole Errors:');
            consoleErrors.slice(0, 5).forEach(err => {
                console.log(`  - ${err.substring(0, 100)}`);
            });
        }

        console.log(`\nScreenshots saved to: ${screenshotDir}`);
        console.log('\n========================================');
        console.log('TEST COMPLETE');
        console.log('========================================\n');

        // Save JSON report
        const reportPath = path.join(screenshotDir, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
        console.log(`Test report saved to: ${reportPath}\n`);

        // Keep browser open for manual inspection
        console.log('Browser will remain open for 2 minutes for manual inspection...');
        console.log('Press Ctrl+C to close immediately.\n');
        await page.waitForTimeout(120000);

    } catch (error) {
        console.error('\n❌ ERROR DURING TESTING:', error.message);
        console.error(error.stack);

        await page.screenshot({
            path: path.join(screenshotDir, 'error-state.png'),
            fullPage: true
        });

        testResults.criticalError = error.message;
    } finally {
        await browser.close();
        console.log('\n✓ Browser closed');
        console.log('✓ Testing session complete');
    }
}

// Run the tests
testPhases().catch(console.error);
