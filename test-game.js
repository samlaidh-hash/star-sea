/**
 * Star Sea - Automated Game Testing with Playwright
 * Tests gameplay, takes screenshots, and identifies issues
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testStarSea() {
    console.log('🚀 Launching Star Sea for automated testing...\n');

    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }

    // Launch browser
    const browser = await chromium.launch({
        headless: false,
        slowMo: 500 // Slow down actions for visibility
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Enable console logging from the game
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error') {
            console.log(`❌ Console Error: ${msg.text()}`);
        }
    });

    try {
        // Step 1: Load the game
        console.log('📂 Loading index.html...');
        const indexPath = 'file://' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
        await page.goto(indexPath, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000); // Wait for game initialization

        await page.screenshot({
            path: path.join(screenshotDir, '01-main-menu.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Main Menu\n');

        // Step 2: Click "New Game"
        console.log('🎮 Clicking "New Game"...');
        await page.click('#btn-new-game');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotDir, '02-mission-briefing.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Mission Briefing\n');

        // Step 3: Accept Mission
        console.log('✔️ Accepting mission...');
        const acceptButton = await page.$('#btn-accept-mission');
        if (acceptButton) {
            await acceptButton.click();
            await page.waitForTimeout(2000); // Wait for mission to load
        }

        await page.screenshot({
            path: path.join(screenshotDir, '03-gameplay-initial.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Gameplay Initial State\n');

        // Step 4: Test W key (forward thrust)
        console.log('⌨️ Testing W key (forward thrust)...');
        await page.keyboard.down('w');
        await page.waitForTimeout(2000);
        await page.keyboard.up('w');

        await page.screenshot({
            path: path.join(screenshotDir, '04-after-thrust-w.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: After W thrust\n');

        // Step 5: Test A/D keys (rotation)
        console.log('⌨️ Testing D key (turn right)...');
        await page.keyboard.down('d');
        await page.waitForTimeout(1000);
        await page.keyboard.up('d');

        await page.screenshot({
            path: path.join(screenshotDir, '05-after-turn-d.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: After D turn\n');

        // Step 6: Test weapon firing (left click)
        console.log('🔫 Testing beam weapons (left click)...');
        await page.mouse.move(1200, 400); // Move cursor to upper right
        await page.mouse.click(1200, 400);
        await page.waitForTimeout(500);

        await page.screenshot({
            path: path.join(screenshotDir, '06-beam-fire.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Beam fire\n');

        // Step 7: Test torpedo firing (right click)
        console.log('🚀 Testing torpedoes (right click)...');
        await page.mouse.click(1200, 400, { button: 'right' });
        await page.waitForTimeout(500);

        await page.screenshot({
            path: path.join(screenshotDir, '07-torpedo-fire.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Torpedo fire\n');

        // Step 8: Observe HUD elements
        console.log('📊 Checking HUD elements...');

        const hudVisible = await page.evaluate(() => {
            const hud = document.getElementById('hud');
            const shields = document.getElementById('shields-panel');
            const weapons = document.getElementById('weapons-panel');
            const minimap = document.getElementById('minimap');

            return {
                hudExists: !!hud,
                hudVisible: hud ? hud.style.display !== 'none' : false,
                shieldsExists: !!shields,
                weaponsExists: !!weapons,
                minimapExists: !!minimap
            };
        });

        console.log('HUD Elements:', hudVisible);

        await page.screenshot({
            path: path.join(screenshotDir, '08-hud-check.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: HUD check\n');

        // Step 9: Check ship visuals
        console.log('🚢 Examining ship visuals...');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotDir, '09-ship-visuals.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Ship visuals\n');

        // Step 10: Check minimap
        console.log('🗺️ Examining minimap...');
        const minimapCanvas = await page.$('#minimap');
        if (minimapCanvas) {
            const minimapBox = await minimapCanvas.boundingBox();
            console.log('Minimap bounding box:', minimapBox);

            // Take close-up of minimap
            await page.screenshot({
                path: path.join(screenshotDir, '10-minimap-closeup.png'),
                clip: minimapBox
            });
            console.log('✅ Screenshot: Minimap close-up\n');
        }

        // Step 11: Extended play session
        console.log('🎮 Extended gameplay test (10 seconds)...');

        // Move ship around
        await page.keyboard.down('w');
        await page.waitForTimeout(2000);
        await page.keyboard.up('w');

        await page.keyboard.down('a');
        await page.waitForTimeout(1000);
        await page.keyboard.up('a');

        await page.keyboard.down('w');
        await page.waitForTimeout(2000);
        await page.keyboard.up('w');

        // Fire some weapons
        await page.mouse.move(800, 300);
        await page.mouse.click(800, 300);
        await page.waitForTimeout(500);

        await page.mouse.move(1100, 700);
        await page.mouse.click(1100, 700, { button: 'right' });

        await page.screenshot({
            path: path.join(screenshotDir, '11-extended-gameplay.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Extended gameplay\n');

        // Step 12: Final state
        console.log('📸 Capturing final state...');
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(screenshotDir, '12-final-state.png'),
            fullPage: true
        });
        console.log('✅ Screenshot: Final state\n');

        // Analyze game state
        console.log('\n📊 GAME STATE ANALYSIS:');
        const gameState = await page.evaluate(() => {
            return {
                canvasSize: {
                    width: document.getElementById('gameCanvas')?.width,
                    height: document.getElementById('gameCanvas')?.height
                },
                debugMode: typeof CONFIG !== 'undefined' ? CONFIG.DEBUG_MODE : 'unknown',
                hudPanels: {
                    shields: !!document.getElementById('shields-panel'),
                    weapons: !!document.getElementById('weapons-panel'),
                    systems: !!document.getElementById('systems-panel'),
                    minimap: !!document.getElementById('minimap')
                }
            };
        });

        console.log(JSON.stringify(gameState, null, 2));
        console.log('\n✅ All screenshots saved to:', screenshotDir);
        console.log('\n🎮 Test complete! Browser will remain open for manual inspection.');
        console.log('Press Ctrl+C to close when done.\n');

        // Keep browser open for manual inspection
        await page.waitForTimeout(300000); // 5 minutes

    } catch (error) {
        console.error('❌ Error during testing:', error);
        await page.screenshot({
            path: path.join(screenshotDir, 'error-state.png'),
            fullPage: true
        });
    } finally {
        // Don't close immediately - let user inspect
        // await browser.close();
    }
}

// Run the test
testStarSea().catch(console.error);
