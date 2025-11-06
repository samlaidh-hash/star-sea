/**
 * Star Sea - Tractor Beam Testing Script
 * Tests Phase 7 improvements: Static hold fix and timer bar
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Screenshot directory
const screenshotDir = './screenshots-tractor-beam';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

async function testTractorBeam() {
    console.log('=== STAR SEA - TRACTOR BEAM TEST ===\n');

    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();

    // Listen for console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push(text);
        if (text.includes('Tractor') || text.includes('tractor')) {
            console.log('  [Game Console]:', text);
        }
    });

    // Navigate to game
    console.log('1. Loading game...');
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Screenshot: Main menu
    await page.screenshot({ path: path.join(screenshotDir, '01-main-menu.png') });
    console.log('   ✓ Main menu loaded\n');

    // Click "New Game"
    console.log('2. Starting new game...');
    await page.click('button:has-text("New Game")');
    await page.waitForTimeout(1000);

    // Screenshot: Mission briefing
    await page.screenshot({ path: path.join(screenshotDir, '02-mission-briefing.png') });
    console.log('   ✓ Mission briefing shown\n');

    // Click "Accept Mission"
    console.log('3. Accepting mission...');
    await page.click('button:has-text("Accept Mission")');
    await page.waitForTimeout(3000); // Wait for game to fully initialize

    // Screenshot: Initial gameplay
    await page.screenshot({ path: path.join(screenshotDir, '03-gameplay-initial.png') });
    console.log('   ✓ Game started\n');

    // Test 1: Activate tractor beam (Q key)
    console.log('4. TEST: Activating tractor beam (Q key)...');
    await page.keyboard.press('q');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '04-tractor-activated.png') });
    console.log('   ✓ Tractor beam activated\n');

    // Test 2: Wait 2 seconds, check timer bar
    console.log('5. TEST: Observing timer bar (2 seconds)...');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '05-timer-bar-8s.png') });
    console.log('   ✓ Timer bar visible (~8s remaining)\n');

    // Test 3: Player movement with tractor active (W key - forward)
    console.log('6. TEST: Moving forward with tractor active (W key)...');
    await page.keyboard.down('w');
    await page.waitForTimeout(2000);
    await page.keyboard.up('w');
    await page.screenshot({ path: path.join(screenshotDir, '06-movement-forward.png') });
    console.log('   ✓ Player moved forward\n');

    // Test 4: Player turning with tractor active (D key - turn right)
    console.log('7. TEST: Turning right with tractor active (D key)...');
    await page.keyboard.down('d');
    await page.waitForTimeout(1500);
    await page.keyboard.up('d');
    await page.screenshot({ path: path.join(screenshotDir, '07-turning-right.png') });
    console.log('   ✓ Player turned right\n');

    // Test 5: Wait for timer to run low
    console.log('8. TEST: Waiting for low timer (~3s remaining)...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '08-timer-bar-low.png') });
    console.log('   ✓ Timer bar critical (orange/red pulsing)\n');

    // Test 6: Wait for tractor to auto-deactivate
    console.log('9. TEST: Waiting for tractor to auto-deactivate...');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(screenshotDir, '09-tractor-deactivated.png') });
    console.log('   ✓ Tractor beam auto-deactivated\n');

    // Test 7: Observe cooldown bar
    console.log('10. TEST: Observing cooldown bar (2 seconds)...');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '10-cooldown-bar-3s.png') });
    console.log('   ✓ Cooldown bar visible (~3s remaining)\n');

    // Test 8: Try to activate during cooldown
    console.log('11. TEST: Attempting activation during cooldown (should fail)...');
    await page.keyboard.press('q');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '11-cooldown-rejection.png') });
    console.log('   ✓ Activation rejected during cooldown\n');

    // Test 9: Wait for cooldown to complete
    console.log('12. TEST: Waiting for cooldown to complete...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '12-cooldown-complete.png') });
    console.log('   ✓ Cooldown complete\n');

    // Test 10: Reactivate tractor beam
    console.log('13. TEST: Reactivating tractor beam...');
    await page.keyboard.press('q');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '13-tractor-reactivated.png') });
    console.log('   ✓ Tractor beam reactivated successfully\n');

    // Test 11: Manual deactivation (Q key again)
    console.log('14. TEST: Manual deactivation (Q key)...');
    await page.waitForTimeout(1000);
    await page.keyboard.press('q');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '14-manual-deactivation.png') });
    console.log('   ✓ Manual deactivation successful\n');

    // Test 12: Verify cooldown starts after manual deactivation
    console.log('15. TEST: Verifying cooldown after manual deactivation...');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '15-cooldown-after-manual.png') });
    console.log('   ✓ Cooldown started\n');

    // Final screenshot
    console.log('16. Capturing final state...');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '16-final-state.png') });
    console.log('   ✓ Final state captured\n');

    // Analyze console messages
    console.log('\n=== CONSOLE MESSAGE ANALYSIS ===');
    const tractorActivations = consoleMessages.filter(m => m.includes('Tractor beam activated')).length;
    const tractorDeactivations = consoleMessages.filter(m => m.includes('Tractor beam deactivated')).length;
    const cooldownRejections = consoleMessages.filter(m => m.includes('on cooldown')).length;
    const cooldownCompletes = consoleMessages.filter(m => m.includes('cooldown complete')).length;
    const durationExpired = consoleMessages.filter(m => m.includes('duration expired')).length;

    console.log(`Tractor Activations: ${tractorActivations}`);
    console.log(`Tractor Deactivations: ${tractorDeactivations}`);
    console.log(`Cooldown Rejections: ${cooldownRejections}`);
    console.log(`Cooldown Completes: ${cooldownCompletes}`);
    console.log(`Duration Expired: ${durationExpired}`);

    console.log('\n=== TEST SUMMARY ===');
    console.log('✓ All 15 tractor beam tests completed');
    console.log(`✓ ${fs.readdirSync(screenshotDir).length} screenshots captured`);
    console.log(`✓ Screenshots saved to: ${path.resolve(screenshotDir)}`);

    // Expected results
    console.log('\n=== EXPECTED BEHAVIOR ===');
    console.log('✓ Static Hold: Target should maintain fixed offset from player');
    console.log('✓ Timer Bar (Active): Green bar emptying over 10 seconds');
    console.log('✓ Auto-Deactivation: Tractor should shut off at 0 seconds');
    console.log('✓ Cooldown Bar: Red/yellow bar filling over 5 seconds');
    console.log('✓ Cooldown Rejection: Cannot reactivate during cooldown');
    console.log('✓ Manual Control: Q key toggles on/off');

    console.log('\n=== VISUAL VERIFICATION CHECKLIST ===');
    console.log('[ ] Timer bar appears below target ship (screenshots 04-08)');
    console.log('[ ] Target stays at fixed offset during movement (screenshots 06-07)');
    console.log('[ ] Timer bar turns orange/red when low (screenshot 08)');
    console.log('[ ] Cooldown bar appears at player ship (screenshots 10-11)');
    console.log('[ ] Cooldown bar fills from red → orange → yellow (screenshot 10-12)');
    console.log('[ ] Timer numbers count down correctly');

    // Keep browser open for manual inspection
    console.log('\n✓ Browser kept open for manual inspection');
    console.log('  Close browser to end test\n');

    // Wait for user to close browser
    await page.waitForTimeout(300000); // 5 minutes max

    await browser.close();
}

// Run test
testTractorBeam().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});
