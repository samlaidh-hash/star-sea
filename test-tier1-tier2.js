/**
 * Star Sea - Automated Testing for TIER 1 & TIER 2 Implementations
 * Tests physics, TAB targeting, lock-on, torpedoes, beams, and pirate AI
 */

const { chromium } = require('playwright');
const path = require('path');

// Test results tracking
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${name}`);
    if (details) console.log(`   ${details}`);

    results.tests.push({ name, passed, details });
    if (passed) results.passed++;
    else results.failed++;
}

async function runTests() {
    console.log('🚀 Starting Star Sea TIER 1 & TIER 2 Tests\n');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Enable console logging from the page
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('ERROR') || text.includes('Error')) {
            console.log(`   🔴 Console Error: ${text}`);
        }
    });

    try {
        // Navigate to game with cache disabled
        const indexPath = path.join(__dirname, 'index.html');
        await page.goto(`file:///${indexPath}`, {
            waitUntil: 'networkidle'
        });
        console.log('📄 Loaded index.html\n');

        // Force reload to clear cache
        await page.reload({ waitUntil: 'networkidle' });
        console.log('🔄 Reloaded page to clear cache\n');

        await page.waitForTimeout(2000); // Wait for game to initialize

        // =================================================================
        // TIER 1: FOUNDATION TESTS
        // =================================================================
        console.log('\n🔴 TIER 1: FOUNDATION TESTS');
        console.log('=' .repeat(60));

        // TEST 1.1: Physics System Enabled
        console.log('\nTEST 1.1: Physics System');
        const configCheck = await page.evaluate(() => {
            return {
                configExists: typeof CONFIG !== 'undefined',
                physicsDisabled: (typeof CONFIG !== 'undefined') ? CONFIG.DISABLE_PHYSICS : null,
                torpedoSpeed: (typeof CONFIG !== 'undefined') ? CONFIG.TORPEDO_SPEED_CA : null
            };
        });
        console.log(`   CONFIG exists: ${configCheck.configExists}`);
        console.log(`   DISABLE_PHYSICS: ${configCheck.physicsDisabled}`);
        console.log(`   TORPEDO_SPEED_CA: ${configCheck.torpedoSpeed}`);

        logTest('Physics System Enabled', configCheck.physicsDisabled === false,
                configCheck.physicsDisabled ? 'DISABLE_PHYSICS is true' : 'DISABLE_PHYSICS is false');

        // Start game
        await page.click('#btn-new-game');
        await page.waitForTimeout(1000);
        await page.click('#btn-accept-mission');
        await page.waitForTimeout(2000);
        console.log('✓ Game started, mission accepted\n');

        // TEST 1.2: Check FPS
        console.log('\nTEST 1.2: FPS Check');
        const fps = await page.evaluate(() => {
            return window.game && window.game.engine ?
                   window.game.engine.currentFPS || 0 : 0;
        });
        logTest('FPS Above 20', fps > 20, `Current FPS: ${fps.toFixed(1)}`);

        // TEST 1.3: TAB Target Selection Panel
        console.log('\nTEST 1.3: TAB Target Selection');

        // Check if target panel exists in HTML
        const targetPanelExists = await page.evaluate(() => {
            return document.getElementById('target-info-panel') !== null;
        });
        logTest('Target Info Panel Exists in HTML', targetPanelExists);

        // Press TAB key
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500);

        // Check if panel is visible and has content
        const targetPanelVisible = await page.evaluate(() => {
            const panel = document.getElementById('target-info-panel');
            const nameEl = document.getElementById('target-name');
            return panel &&
                   panel.style.display !== 'none' &&
                   nameEl &&
                   nameEl.textContent !== '-';
        });
        logTest('TAB Key Shows Target Panel', targetPanelVisible,
                targetPanelVisible ? 'Panel visible with target data' : 'Panel not visible or empty');

        // TEST 1.4: TAB Cycling
        console.log('\nTEST 1.4: TAB Target Cycling');
        const firstTarget = await page.evaluate(() => {
            return document.getElementById('target-name')?.textContent || '';
        });

        await page.keyboard.press('Tab');
        await page.waitForTimeout(300);

        const secondTarget = await page.evaluate(() => {
            return document.getElementById('target-name')?.textContent || '';
        });

        logTest('TAB Cycles Targets', firstTarget !== secondTarget && secondTarget !== '-',
                `Target 1: "${firstTarget}" → Target 2: "${secondTarget}"`);

        // TEST 1.5: Lock-On System
        console.log('\nTEST 1.5: Lock-On System');

        // Get reticle element
        const reticleExists = await page.evaluate(() => {
            return document.getElementById('reticle') !== null;
        });
        logTest('Reticle Element Exists', reticleExists);

        if (reticleExists) {
            // Check initial reticle state (should be green, not locked)
            const initialReticleState = await page.evaluate(() => {
                const reticle = document.getElementById('reticle');
                return {
                    hasLockedClass: reticle.classList.contains('locked'),
                    hasLockingClass: reticle.classList.contains('locking')
                };
            });

            logTest('Reticle Starts Unlocked', !initialReticleState.hasLockedClass,
                    `Locked: ${initialReticleState.hasLockedClass}, Locking: ${initialReticleState.hasLockingClass}`);

            // Move mouse to center (where an enemy might be)
            await page.mouse.move(960, 540);
            await page.waitForTimeout(1000);

            // Check if locking has started
            const lockingState = await page.evaluate(() => {
                const reticle = document.getElementById('reticle');
                return {
                    hasLockingClass: reticle.classList.contains('locking'),
                    hasLockedClass: reticle.classList.contains('locked')
                };
            });

            logTest('Lock-On Can Start', lockingState.hasLockingClass || lockingState.hasLockedClass,
                    `Locking: ${lockingState.hasLockingClass}, Locked: ${lockingState.hasLockedClass}`);
        }

        // =================================================================
        // TIER 2: TORPEDO TESTS
        // =================================================================
        console.log('\n\n🟠 TIER 2: TORPEDO TESTS');
        console.log('=' .repeat(60));

        // TEST 2.1: Torpedo Storage
        console.log('\nTEST 2.1: Torpedo Storage Tripled');
        const torpedoStorage = await page.evaluate(() => {
            const player = window.game?.playerShip;
            if (!player) return { stored: 0, loaded: 0 };

            const torpedoLauncher = player.weapons.find(w =>
                w.constructor.name === 'TorpedoLauncher' ||
                w.constructor.name === 'DualTorpedoLauncher'
            );

            return torpedoLauncher ? {
                stored: torpedoLauncher.stored,
                loaded: torpedoLauncher.loaded
            } : { stored: 0, loaded: 0 };
        });

        logTest('Torpedo Storage = 48', torpedoStorage.stored === 48,
                `Stored: ${torpedoStorage.stored}, Loaded: ${torpedoStorage.loaded}`);

        // TEST 2.2: Torpedo Speed
        console.log('\nTEST 2.2: Torpedo Speed +50%');
        const torpedoSpeed = await page.evaluate(() => {
            return window.CONFIG ? window.CONFIG.TORPEDO_SPEED_CA : 0;
        });
        logTest('Torpedo Speed = 487', torpedoSpeed === 487,
                `CONFIG.TORPEDO_SPEED_CA = ${torpedoSpeed} (expected 487)`);

        // TEST 2.3: Fire Torpedo (no sticking)
        console.log('\nTEST 2.3: Torpedo Launch (No Sticking)');
        const initialProjectileCount = await page.evaluate(() => {
            return window.game?.engine?.projectiles?.length || 0;
        });

        // Fire torpedo (RMB)
        await page.mouse.click(960, 540, { button: 'right' });
        await page.waitForTimeout(500);

        const projectileCountAfterFire = await page.evaluate(() => {
            return window.game?.engine?.projectiles?.length || 0;
        });

        const torpedoFired = projectileCountAfterFire > initialProjectileCount;
        logTest('Torpedo Fires Successfully', torpedoFired,
                `Projectiles: ${initialProjectileCount} → ${projectileCountAfterFire}`);

        if (torpedoFired) {
            await page.waitForTimeout(200);

            // Check torpedo position relative to player ship
            const torpedoStatus = await page.evaluate(() => {
                const player = window.game?.playerShip;
                const projectiles = window.game?.engine?.projectiles || [];
                const torpedo = projectiles[projectiles.length - 1];

                if (!player || !torpedo) return { stuck: true, distance: 0 };

                const dx = torpedo.x - player.x;
                const dy = torpedo.y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                return {
                    stuck: distance < player.length * 0.5,
                    distance: distance.toFixed(1),
                    playerLength: player.length
                };
            });

            logTest('Torpedo Not Stuck in Ship', !torpedoStatus.stuck,
                    `Distance from ship: ${torpedoStatus.distance}px (ship length: ${torpedoStatus.playerLength}px)`);
        }

        // TEST 2.4: Torpedo Reload
        console.log('\nTEST 2.4: Torpedo Top-Off Reload');

        // Fire one more torpedo
        await page.mouse.click(960, 540, { button: 'right' });
        await page.waitForTimeout(500);

        const loadedBeforeReload = await page.evaluate(() => {
            const player = window.game?.playerShip;
            const torpedoLauncher = player?.weapons.find(w =>
                w.constructor.name === 'TorpedoLauncher' ||
                w.constructor.name === 'DualTorpedoLauncher'
            );
            return torpedoLauncher ? torpedoLauncher.loaded : 0;
        });

        console.log(`   Waiting 6 seconds for reload (loaded: ${loadedBeforeReload})...`);
        await page.waitForTimeout(6000);

        const loadedAfterReload = await page.evaluate(() => {
            const player = window.game?.playerShip;
            const torpedoLauncher = player?.weapons.find(w =>
                w.constructor.name === 'TorpedoLauncher' ||
                w.constructor.name === 'DualTorpedoLauncher'
            );
            return torpedoLauncher ? torpedoLauncher.loaded : 0;
        });

        logTest('Torpedo Auto-Reloads', loadedAfterReload > loadedBeforeReload,
                `Loaded: ${loadedBeforeReload} → ${loadedAfterReload} (should increase by 1)`);

        // =================================================================
        // TIER 2: BEAM TESTS
        // =================================================================
        console.log('\n\n🟠 TIER 2: BEAM TESTS');
        console.log('=' .repeat(60));

        // TEST 2.5: Beam Cooldown Check
        console.log('\nTEST 2.5: Beam Dynamic Cooldown');

        // Fire beam for 1 second
        await page.mouse.down({ button: 'left' });
        const beamStartTime = Date.now();
        await page.waitForTimeout(1000);
        await page.mouse.up({ button: 'left' });
        const beamDuration = Date.now() - beamStartTime;

        // Check beam weapon cooldown
        const beamCooldown = await page.evaluate(() => {
            const player = window.game?.playerShip;
            const beamWeapon = player?.weapons.find(w =>
                w.constructor.name === 'ContinuousBeam' ||
                w.constructor.name === 'BeamWeapon'
            );
            return beamWeapon ? {
                cooldown: beamWeapon.cooldown || 0,
                firingDuration: beamWeapon.firingDuration || 0,
                canFire: beamWeapon.canFire ? beamWeapon.canFire(Date.now() / 1000) : false
            } : null;
        });

        if (beamCooldown) {
            const cooldownMatchesDuration = Math.abs(beamCooldown.firingDuration - beamDuration / 1000) < 0.5;
            logTest('Beam Cooldown = Firing Duration', cooldownMatchesDuration,
                    `Fired: ${(beamDuration/1000).toFixed(1)}s, Cooldown: ${beamCooldown.firingDuration.toFixed(1)}s`);

            logTest('Beam Cannot Fire Immediately', !beamCooldown.canFire,
                    `canFire: ${beamCooldown.canFire}`);
        } else {
            logTest('Beam Weapon Found', false, 'No ContinuousBeam or BeamWeapon found on player ship');
        }

        // =================================================================
        // TIER 2: PIRATE AI TESTS
        // =================================================================
        console.log('\n\n🟠 TIER 2: PIRATE AI TESTS');
        console.log('=' .repeat(60));

        // TEST 2.6: Pirate Weapon Variety
        console.log('\nTEST 2.6: Pirate Weapon Variety');

        const pirateWeapons = await page.evaluate(() => {
            const ships = window.game?.engine?.ships || [];
            const pirates = ships.filter(s => s.faction === 'PIRATE' && !s.isPlayer);

            return pirates.map(p => {
                const weaponTypes = p.weapons.map(w => w.constructor.name);
                return {
                    name: p.name || 'Pirate',
                    weapons: weaponTypes
                };
            });
        });

        if (pirateWeapons.length > 0) {
            const uniqueLoadouts = new Set(pirateWeapons.map(p => p.weapons.join(',')));
            logTest('Pirates Have Weapon Variety', uniqueLoadouts.size >= 2,
                    `Found ${pirateWeapons.length} pirates with ${uniqueLoadouts.size} unique loadouts`);

            pirateWeapons.slice(0, 5).forEach(p => {
                console.log(`   - ${p.name}: ${p.weapons.join(', ')}`);
            });
        } else {
            logTest('Pirates Found in Mission', false, 'No pirate ships found');
        }

        // =================================================================
        // FINAL SUMMARY
        // =================================================================
        await page.waitForTimeout(2000);
        console.log('\n\n' + '=' .repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('=' .repeat(60));
        console.log(`✅ PASSED: ${results.passed}`);
        console.log(`❌ FAILED: ${results.failed}`);
        console.log(`📈 SUCCESS RATE: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

        console.log('\n\n📋 DETAILED RESULTS:');
        results.tests.forEach((test, i) => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${i + 1}. ${status} ${test.name}`);
            if (test.details) console.log(`   ${test.details}`);
        });

        // Take final screenshot
        const screenshotPath = path.join(__dirname, 'test-results-final.png');
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`\n📸 Screenshot saved: ${screenshotPath}`);

    } catch (error) {
        console.error('\n❌ TEST ERROR:', error.message);
        console.error(error.stack);
    } finally {
        await page.waitForTimeout(2000);
        await browser.close();
        console.log('\n✓ Tests complete, browser closed\n');
    }
}

// Run tests
runTests().catch(console.error);
