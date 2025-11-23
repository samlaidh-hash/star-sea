/**
 * Star Sea - BeamProjectile Gradient Error Fix Test
 *
 * Purpose: Verify that the finite value validation (BeamProjectile.js lines 71-74)
 * eliminates the "non-finite value in createLinearGradient" console errors
 *
 * Previous state: 365 gradient errors in 4 minutes
 * Expected result: ZERO gradient errors
 */

const { chromium } = require('playwright');
const path = require('path');

async function testBeamGradientFix() {
    console.log('='.repeat(80));
    console.log('BEAM PROJECTILE GRADIENT ERROR FIX - VERIFICATION TEST');
    console.log('='.repeat(80));
    console.log('\nTest Configuration:');
    console.log('- Duration: 3 minutes of beam combat');
    console.log('- Previous error count: 365 errors in 4 minutes');
    console.log('- Expected result: 0 errors');
    console.log('- Fix location: BeamProjectile.js lines 71-74');
    console.log('\n' + '='.repeat(80) + '\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 50
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();

    // Track console errors
    let gradientErrors = 0;
    let nonFiniteErrors = 0;
    let otherErrors = 0;
    let errorLog = [];

    // Monitor console for errors
    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();

        if (type === 'error') {
            // Check for gradient errors
            if (text.includes('createLinearGradient') || text.includes('gradient')) {
                gradientErrors++;
                errorLog.push({ time: new Date().toISOString(), type: 'GRADIENT', text });
                console.error(`[GRADIENT ERROR #${gradientErrors}] ${text}`);
            }
            // Check for non-finite errors
            else if (text.includes('non-finite') || text.includes('NaN') || text.includes('Infinity')) {
                nonFiniteErrors++;
                errorLog.push({ time: new Date().toISOString(), type: 'NON-FINITE', text });
                console.error(`[NON-FINITE ERROR #${nonFiniteErrors}] ${text}`);
            }
            // Track other errors
            else {
                otherErrors++;
                errorLog.push({ time: new Date().toISOString(), type: 'OTHER', text });
                console.error(`[OTHER ERROR #${otherErrors}] ${text}`);
            }
        }
    });

    // Navigate to game
    console.log('Starting test...\n');
    console.log('[STEP 1] Navigating to game...');
    await page.goto('http://localhost:8000/index.html');
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({ path: './screenshots/beam-fix-test-01-menu.png', fullPage: true });
    console.log('✓ Screenshot saved: beam-fix-test-01-menu.png');

    // Click New Game
    console.log('\n[STEP 2] Starting new game...');
    await page.click('button:has-text("New Game")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: './screenshots/beam-fix-test-02-briefing.png', fullPage: true });
    console.log('✓ Screenshot saved: beam-fix-test-02-briefing.png');

    // Accept mission
    console.log('\n[STEP 3] Accepting mission...');
    await page.click('button:has-text("Accept Mission")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: './screenshots/beam-fix-test-03-gameplay.png', fullPage: true });
    console.log('✓ Screenshot saved: beam-fix-test-03-gameplay.png');

    console.log('\n' + '='.repeat(80));
    console.log('BEAM COMBAT TEST - 3 MINUTE DURATION');
    console.log('='.repeat(80));
    console.log('\nTest Plan:');
    console.log('1. Close-range beam firing (0-30 seconds)');
    console.log('2. Maximum-range beam firing (30-60 seconds)');
    console.log('3. Beam firing while moving (60-90 seconds)');
    console.log('4. Rapid-fire beam spam (90-120 seconds)');
    console.log('5. Combat with moving targets (120-180 seconds)');
    console.log('\nMonitoring console errors...\n');

    const testStartTime = Date.now();
    let lastStatusUpdate = testStartTime;

    // Test Scenario 1: Close-range beam firing (0-30 seconds)
    console.log('[SCENARIO 1] Close-range beam firing...');
    const scenario1End = testStartTime + 30000;
    while (Date.now() < scenario1End) {
        // Move forward toward enemy
        await page.keyboard.down('w');
        await page.waitForTimeout(100);
        await page.keyboard.up('w');

        // Fire beams (hold left mouse button)
        const box = await page.locator('#gameCanvas').boundingBox();
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.waitForTimeout(500);
        await page.mouse.up();

        // Status update every 10 seconds
        if (Date.now() - lastStatusUpdate > 10000) {
            const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
            console.log(`  [${elapsed}s] Gradient errors: ${gradientErrors}, Non-finite: ${nonFiniteErrors}, Other: ${otherErrors}`);
            lastStatusUpdate = Date.now();
        }
    }
    await page.screenshot({ path: './screenshots/beam-fix-test-04-scenario1.png', fullPage: true });
    console.log('✓ Scenario 1 complete');

    // Test Scenario 2: Maximum-range beam firing (30-60 seconds)
    console.log('\n[SCENARIO 2] Maximum-range beam firing...');
    const scenario2End = testStartTime + 60000;
    while (Date.now() < scenario2End) {
        // Move backward to maintain distance
        await page.keyboard.down('s');
        await page.waitForTimeout(100);
        await page.keyboard.up('s');

        // Fire beams at maximum range
        const box = await page.locator('#gameCanvas').boundingBox();
        const farX = box.x + box.width * 0.8;
        const farY = box.y + box.height * 0.3;
        await page.mouse.move(farX, farY);
        await page.mouse.down();
        await page.waitForTimeout(500);
        await page.mouse.up();

        // Status update
        if (Date.now() - lastStatusUpdate > 10000) {
            const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
            console.log(`  [${elapsed}s] Gradient errors: ${gradientErrors}, Non-finite: ${nonFiniteErrors}, Other: ${otherErrors}`);
            lastStatusUpdate = Date.now();
        }
    }
    await page.screenshot({ path: './screenshots/beam-fix-test-05-scenario2.png', fullPage: true });
    console.log('✓ Scenario 2 complete');

    // Test Scenario 3: Beam firing while moving (60-90 seconds)
    console.log('\n[SCENARIO 3] Beam firing while moving...');
    const scenario3End = testStartTime + 90000;
    while (Date.now() < scenario3End) {
        // Strafe and fire
        await page.keyboard.down('a');
        await page.mouse.down();
        await page.waitForTimeout(250);
        await page.keyboard.up('a');

        await page.keyboard.down('d');
        await page.waitForTimeout(250);
        await page.keyboard.up('d');
        await page.mouse.up();

        // Status update
        if (Date.now() - lastStatusUpdate > 10000) {
            const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
            console.log(`  [${elapsed}s] Gradient errors: ${gradientErrors}, Non-finite: ${nonFiniteErrors}, Other: ${otherErrors}`);
            lastStatusUpdate = Date.now();
        }
    }
    await page.screenshot({ path: './screenshots/beam-fix-test-06-scenario3.png', fullPage: true });
    console.log('✓ Scenario 3 complete');

    // Test Scenario 4: Rapid-fire beam spam (90-120 seconds)
    console.log('\n[SCENARIO 4] Rapid-fire beam spam...');
    const scenario4End = testStartTime + 120000;
    while (Date.now() < scenario4End) {
        // Rapid clicking across screen
        const box = await page.locator('#gameCanvas').boundingBox();
        for (let i = 0; i < 10; i++) {
            const randomX = box.x + Math.random() * box.width;
            const randomY = box.y + Math.random() * box.height;
            await page.mouse.move(randomX, randomY);
            await page.mouse.click(randomX, randomY);
            await page.waitForTimeout(50);
        }

        // Status update
        if (Date.now() - lastStatusUpdate > 10000) {
            const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
            console.log(`  [${elapsed}s] Gradient errors: ${gradientErrors}, Non-finite: ${nonFiniteErrors}, Other: ${otherErrors}`);
            lastStatusUpdate = Date.now();
        }
    }
    await page.screenshot({ path: './screenshots/beam-fix-test-07-scenario4.png', fullPage: true });
    console.log('✓ Scenario 4 complete');

    // Test Scenario 5: Combat with moving targets (120-180 seconds)
    console.log('\n[SCENARIO 5] Combat with moving targets...');
    const scenario5End = testStartTime + 180000;
    while (Date.now() < scenario5End) {
        // Circle strafe while firing
        await page.keyboard.down('w');
        await page.keyboard.down('a');
        await page.mouse.down();
        await page.waitForTimeout(200);
        await page.keyboard.up('a');

        await page.keyboard.down('d');
        await page.waitForTimeout(200);
        await page.keyboard.up('d');
        await page.keyboard.up('w');
        await page.mouse.up();

        // Status update
        if (Date.now() - lastStatusUpdate > 10000) {
            const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
            console.log(`  [${elapsed}s] Gradient errors: ${gradientErrors}, Non-finite: ${nonFiniteErrors}, Other: ${otherErrors}`);
            lastStatusUpdate = Date.now();
        }
    }
    await page.screenshot({ path: './screenshots/beam-fix-test-08-scenario5.png', fullPage: true });
    console.log('✓ Scenario 5 complete');

    // Final screenshot
    await page.screenshot({ path: './screenshots/beam-fix-test-09-final.png', fullPage: true });
    console.log('✓ Screenshot saved: beam-fix-test-09-final.png');

    // Calculate test duration
    const testDuration = (Date.now() - testStartTime) / 1000;

    // Print final report
    console.log('\n' + '='.repeat(80));
    console.log('BEAM GRADIENT ERROR FIX - TEST RESULTS');
    console.log('='.repeat(80));
    console.log('\nTest Summary:');
    console.log(`- Test duration: ${testDuration.toFixed(1)} seconds`);
    console.log(`- Total gradient errors: ${gradientErrors}`);
    console.log(`- Total non-finite errors: ${nonFiniteErrors}`);
    console.log(`- Total other errors: ${otherErrors}`);
    console.log(`- Total errors: ${gradientErrors + nonFiniteErrors + otherErrors}`);

    console.log('\nComparison:');
    console.log(`- Previous error rate: 365 errors in 240 seconds (1.52 errors/sec)`);
    console.log(`- Current error rate: ${gradientErrors} errors in ${testDuration.toFixed(1)} seconds (${(gradientErrors / testDuration).toFixed(2)} errors/sec)`);

    console.log('\nTest Result:');
    if (gradientErrors === 0 && nonFiniteErrors === 0) {
        console.log('✓✓✓ PASS - FIX SUCCESSFUL ✓✓✓');
        console.log('Zero gradient errors detected. The finite value validation is working correctly.');
    } else {
        console.log('✗✗✗ FAIL - FIX INCOMPLETE ✗✗✗');
        console.log(`Still encountering ${gradientErrors + nonFiniteErrors} errors.`);
    }

    if (errorLog.length > 0) {
        console.log('\nError Log (first 10 entries):');
        errorLog.slice(0, 10).forEach((err, idx) => {
            console.log(`  ${idx + 1}. [${err.type}] ${err.text}`);
        });
        if (errorLog.length > 10) {
            console.log(`  ... and ${errorLog.length - 10} more errors`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('Test complete. Press Ctrl+C to close browser.');
    console.log('='.repeat(80) + '\n');

    // Keep browser open for manual inspection
    await page.waitForTimeout(10000);

    await browser.close();

    // Return test results
    return {
        success: gradientErrors === 0 && nonFiniteErrors === 0,
        gradientErrors,
        nonFiniteErrors,
        otherErrors,
        duration: testDuration
    };
}

// Run the test
testBeamGradientFix()
    .then(results => {
        process.exit(results.success ? 0 : 1);
    })
    .catch(error => {
        console.error('Test failed with error:', error);
        process.exit(1);
    });
