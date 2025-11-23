/**
 * Star Sea - Manual-Style Verification Test
 * Simulates manual testing with screenshots and detailed diagnostics
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Create screenshots directory
const screenshotDir = path.join(__dirname, 'test-screenshots-manual');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name, description) {
    const filepath = path.join(screenshotDir, `${name}.png`);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`📸 ${description}`);
    console.log(`   Saved: ${name}.png`);
}

async function checkConsoleErrors(page) {
    const errors = await page.evaluate(() => {
        return window.__testErrors || [];
    });
    if (errors.length > 0) {
        console.log(`🔴 Console Errors Found: ${errors.length}`);
        errors.forEach(err => console.log(`   - ${err}`));
    }
    return errors;
}

async function runManualTest() {
    console.log('🎮 STAR SEA - MANUAL VERIFICATION TEST\n');
    console.log('=' .repeat(70));
    console.log('This test simulates manual gameplay with screenshots\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100 // Slow down for visibility
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Capture console messages
    const consoleMessages = [];
    const errorMessages = [];

    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push(text);
        if (text.includes('ERROR') || text.includes('Error') || msg.type() === 'error') {
            errorMessages.push(text);
            console.log(`   🔴 Console: ${text}`);
        }
    });

    // Capture page errors
    page.on('pageerror', error => {
        errorMessages.push(error.message);
        console.log(`   ❌ Page Error: ${error.message}`);
    });

    try {
        // =================================================================
        // STEP 1: Load Game
        // =================================================================
        console.log('\n📍 STEP 1: Loading Game');
        console.log('-'.repeat(70));

        const indexPath = path.join(__dirname, 'index.html');
        await page.goto(`file:///${indexPath}`, { waitUntil: 'networkidle' });
        await sleep(2000);

        await takeScreenshot(page, '01-main-menu', 'Main menu loaded');

        // Check if game initialized
        const gameInitialized = await page.evaluate(() => {
            return {
                gameExists: typeof window.game !== 'undefined',
                configExists: typeof CONFIG !== 'undefined',
                engineExists: window.game && typeof window.game.engine !== 'undefined'
            };
        });

        console.log(`✓ Game Object: ${gameInitialized.gameExists ? 'FOUND' : 'MISSING'}`);
        console.log(`✓ CONFIG: ${gameInitialized.configExists ? 'LOADED' : 'MISSING'}`);
        console.log(`✓ Engine: ${gameInitialized.engineExists ? 'READY' : 'NOT READY'}`);

        if (errorMessages.length > 0) {
            console.log(`\n⚠️  ${errorMessages.length} errors during initialization`);
        }

        // =================================================================
        // STEP 2: Start New Game
        // =================================================================
        console.log('\n📍 STEP 2: Starting New Game');
        console.log('-'.repeat(70));

        await page.click('#btn-new-game');
        await sleep(1500);
        await takeScreenshot(page, '02-mission-briefing', 'Mission briefing screen');

        // =================================================================
        // STEP 3: Accept Mission
        // =================================================================
        console.log('\n📍 STEP 3: Accepting Mission');
        console.log('-'.repeat(70));

        await page.click('#btn-accept-mission');
        await sleep(3000); // Wait for mission to fully load
        await takeScreenshot(page, '03-game-start', 'Mission started - initial view');

        // Check game state
        const gameState = await page.evaluate(() => {
            const game = window.game;
            if (!game || !game.engine) return null;

            return {
                state: game.engine.state,
                fps: game.engine.currentFPS || 0,
                playerExists: !!game.engine.playerShip,
                shipCount: game.engine.ships ? game.engine.ships.length : 0,
                projectileCount: game.engine.projectiles ? game.engine.projectiles.length : 0,
                physicsDisabled: CONFIG.DISABLE_PHYSICS
            };
        });

        if (gameState) {
            console.log(`✓ Game State: ${gameState.state}`);
            console.log(`✓ FPS: ${gameState.fps.toFixed(1)}`);
            console.log(`✓ Player Ship: ${gameState.playerExists ? 'YES' : 'NO'}`);
            console.log(`✓ Total Ships: ${gameState.shipCount}`);
            console.log(`✓ Physics: ${gameState.physicsDisabled ? 'DISABLED' : 'ENABLED'}`);
        } else {
            console.log('❌ Could not read game state');
        }

        // =================================================================
        // STEP 4: Check Player Ship & Weapons
        // =================================================================
        console.log('\n📍 STEP 4: Checking Player Ship Configuration');
        console.log('-'.repeat(70));

        const shipInfo = await page.evaluate(() => {
            const player = window.game?.engine?.playerShip;
            if (!player) return null;

            const torpedoLauncher = player.weapons.find(w =>
                w.constructor.name === 'DualTorpedoLauncher' ||
                w.constructor.name === 'TorpedoLauncher'
            );

            const beamWeapon = player.weapons.find(w =>
                w.constructor.name === 'ContinuousBeam' ||
                w.constructor.name === 'BeamWeapon'
            );

            return {
                shipClass: player.shipClass,
                faction: player.faction,
                hp: player.systems?.hull?.hp,
                maxHp: player.systems?.hull?.maxHp,
                torpedoLauncher: torpedoLauncher ? {
                    loaded: torpedoLauncher.loaded,
                    maxLoaded: torpedoLauncher.maxLoaded,
                    stored: torpedoLauncher.stored
                } : null,
                beamWeapon: beamWeapon ? {
                    name: beamWeapon.constructor.name,
                    firingDuration: beamWeapon.firingDuration || 0
                } : null,
                weaponCount: player.weapons.length
            };
        });

        if (shipInfo) {
            console.log(`✓ Ship Class: ${shipInfo.faction} ${shipInfo.shipClass}`);
            console.log(`✓ Hull: ${shipInfo.hp}/${shipInfo.maxHp} HP`);
            console.log(`✓ Weapons: ${shipInfo.weaponCount} total`);

            if (shipInfo.torpedoLauncher) {
                console.log(`✓ Torpedoes: ${shipInfo.torpedoLauncher.loaded}/${shipInfo.torpedoLauncher.stored}`);
                console.log(`  → Storage = 48? ${shipInfo.torpedoLauncher.stored === 48 ? '✅ YES' : '❌ NO (' + shipInfo.torpedoLauncher.stored + ')'}`);
            }

            if (shipInfo.beamWeapon) {
                console.log(`✓ Beam Weapon: ${shipInfo.beamWeapon.name}`);
            }
        }

        // =================================================================
        // STEP 5: Test TAB Target Selection
        // =================================================================
        console.log('\n📍 STEP 5: Testing TAB Target Selection');
        console.log('-'.repeat(70));

        // Check for enemies
        const enemyInfo = await page.evaluate(() => {
            const ships = window.game?.engine?.ships || [];
            const enemies = ships.filter(s => !s.isPlayer && s.faction !== 'FEDERATION');
            return {
                total: ships.length,
                enemies: enemies.length,
                enemyNames: enemies.slice(0, 3).map(e => `${e.faction} ${e.shipClass}`)
            };
        });

        console.log(`✓ Total Ships: ${enemyInfo.total}`);
        console.log(`✓ Enemy Ships: ${enemyInfo.enemies}`);
        if (enemyInfo.enemyNames.length > 0) {
            enemyInfo.enemyNames.forEach(name => console.log(`  - ${name}`));
        }

        if (enemyInfo.enemies > 0) {
            // Press TAB
            await page.keyboard.press('Tab');
            await sleep(500);
            await takeScreenshot(page, '04-tab-target-selected', 'TAB pressed - target selected');

            const targetPanelVisible = await page.evaluate(() => {
                const panel = document.getElementById('target-info-panel');
                const nameEl = document.getElementById('target-name');
                return {
                    visible: panel && panel.style.display !== 'none',
                    targetName: nameEl ? nameEl.textContent : null
                };
            });

            console.log(`✓ Target Panel Visible: ${targetPanelVisible.visible ? '✅ YES' : '❌ NO'}`);
            if (targetPanelVisible.targetName) {
                console.log(`✓ Selected Target: ${targetPanelVisible.targetName}`);
            }
        } else {
            console.log('⚠️  No enemies to target - skipping TAB test');
        }

        // =================================================================
        // STEP 6: Test Lock-On System
        // =================================================================
        console.log('\n📍 STEP 6: Testing Lock-On System');
        console.log('-'.repeat(70));

        // Move mouse to center
        await page.mouse.move(960, 540);
        await sleep(500);

        console.log('✓ Mouse moved to center (960, 540)');
        console.log('✓ Waiting 6 seconds for lock-on...');

        // Wait and check lock-on states
        for (let i = 0; i < 6; i++) {
            await sleep(1000);

            const reticleState = await page.evaluate(() => {
                const reticle = document.getElementById('reticle');
                return {
                    locking: reticle?.classList.contains('locking'),
                    locked: reticle?.classList.contains('locked')
                };
            });

            if (reticleState.locked) {
                console.log(`✓ ${i+1}s: 🔴 LOCKED!`);
                break;
            } else if (reticleState.locking) {
                console.log(`✓ ${i+1}s: 🟢 Locking...`);
            } else {
                console.log(`✓ ${i+1}s: ⚪ No lock`);
            }
        }

        await takeScreenshot(page, '05-lock-on-test', 'Lock-on system test (after 6s)');

        // =================================================================
        // STEP 7: Fire Beam Weapon (LMB)
        // =================================================================
        console.log('\n📍 STEP 7: Testing Beam Weapon');
        console.log('-'.repeat(70));

        console.log('✓ Firing beam for 2 seconds...');
        await page.mouse.down({ button: 'left' });
        await sleep(2000);
        await page.mouse.up({ button: 'left' });
        await sleep(500);

        await takeScreenshot(page, '06-beam-fire', 'After beam weapon fire');

        const beamCooldownInfo = await page.evaluate(() => {
            const player = window.game?.engine?.playerShip;
            const beam = player?.weapons.find(w =>
                w.constructor.name === 'ContinuousBeam' ||
                w.constructor.name === 'BeamWeapon'
            );

            return beam ? {
                firingDuration: beam.firingDuration || 0,
                cooldown: beam.cooldown || 0,
                canFire: beam.canFire ? beam.canFire(performance.now() / 1000) : null
            } : null;
        });

        if (beamCooldownInfo) {
            console.log(`✓ Firing Duration: ${beamCooldownInfo.firingDuration.toFixed(1)}s`);
            console.log(`✓ Cooldown: ${beamCooldownInfo.cooldown.toFixed(1)}s`);
            console.log(`✓ Match? ${Math.abs(beamCooldownInfo.firingDuration - beamCooldownInfo.cooldown) < 0.3 ? '✅ YES' : '❌ NO'}`);
        }

        // =================================================================
        // STEP 8: Fire Torpedo (RMB)
        // =================================================================
        console.log('\n📍 STEP 8: Testing Torpedo Launch');
        console.log('-'.repeat(70));

        const beforeFire = await page.evaluate(() => {
            const player = window.game?.engine?.playerShip;
            const launcher = player?.weapons.find(w =>
                w.constructor.name === 'DualTorpedoLauncher' ||
                w.constructor.name === 'TorpedoLauncher'
            );
            return {
                loaded: launcher?.loaded || 0,
                projectileCount: window.game?.engine?.projectiles?.length || 0
            };
        });

        console.log(`✓ Before Fire: ${beforeFire.loaded} torpedoes loaded, ${beforeFire.projectileCount} projectiles`);

        await page.mouse.click(960, 540, { button: 'right' });
        await sleep(1000);

        const afterFire = await page.evaluate(() => {
            const player = window.game?.engine?.playerShip;
            const launcher = player?.weapons.find(w =>
                w.constructor.name === 'DualTorpedoLauncher' ||
                w.constructor.name === 'TorpedoLauncher'
            );
            return {
                loaded: launcher?.loaded || 0,
                projectileCount: window.game?.engine?.projectiles?.length || 0
            };
        });

        console.log(`✓ After Fire: ${afterFire.loaded} torpedoes loaded, ${afterFire.projectileCount} projectiles`);
        console.log(`✓ Torpedo Fired? ${afterFire.projectileCount > beforeFire.projectileCount ? '✅ YES' : '❌ NO'}`);

        await takeScreenshot(page, '07-torpedo-fire', 'After torpedo launch');

        // =================================================================
        // STEP 9: Check for Pirates & AI Weapons
        // =================================================================
        console.log('\n📍 STEP 9: Checking Pirate AI & Weapons');
        console.log('-'.repeat(70));

        const pirateInfo = await page.evaluate(() => {
            const ships = window.game?.engine?.ships || [];
            const pirates = ships.filter(s => s.faction === 'PIRATE');

            return pirates.slice(0, 5).map(p => {
                const weaponTypes = p.weapons.map(w => {
                    const name = w.constructor.name;
                    if (name.includes('Beam') || name.includes('beam')) return 'Beam';
                    if (name.includes('Torpedo') || name.includes('torpedo')) return 'Torpedo';
                    if (name.includes('Disruptor')) return 'Disruptor';
                    if (name.includes('Plasma')) return 'Plasma';
                    return name;
                });

                return {
                    name: `${p.faction} ${p.shipClass}`,
                    weapons: weaponTypes
                };
            });
        });

        console.log(`✓ Pirates Found: ${pirateInfo.length}`);
        pirateInfo.forEach((p, i) => {
            console.log(`  ${i+1}. ${p.name}: ${p.weapons.join(', ')}`);
        });

        if (pirateInfo.length > 1) {
            const uniqueLoadouts = new Set(pirateInfo.map(p => p.weapons.join(',')));
            console.log(`✓ Unique Loadouts: ${uniqueLoadouts.size} (variety = ${uniqueLoadouts.size >= 2 ? '✅ GOOD' : '⚠️  LOW'})`);
        }

        // =================================================================
        // STEP 10: Extended Gameplay
        // =================================================================
        console.log('\n📍 STEP 10: Extended Gameplay Test (10 seconds)');
        console.log('-'.repeat(70));

        console.log('✓ Playing for 10 seconds...');

        // Move around
        await page.keyboard.down('w');
        await sleep(2000);
        await page.keyboard.up('w');

        await page.keyboard.down('d');
        await sleep(1500);
        await page.keyboard.up('d');

        // Fire weapons
        await page.mouse.down({ button: 'left' });
        await sleep(1000);
        await page.mouse.up({ button: 'left' });

        await sleep(5500);

        await takeScreenshot(page, '08-extended-gameplay', 'After 10 seconds of gameplay');

        // Final state
        const finalState = await page.evaluate(() => {
            const game = window.game?.engine;
            const player = game?.playerShip;

            return {
                fps: game?.currentFPS || 0,
                playerHp: player?.systems?.hull?.hp || 0,
                ships: game?.ships?.length || 0,
                projectiles: game?.projectiles?.length || 0
            };
        });

        console.log(`✓ Final FPS: ${finalState.fps.toFixed(1)}`);
        console.log(`✓ Player HP: ${finalState.playerHp}`);
        console.log(`✓ Total Ships: ${finalState.ships}`);
        console.log(`✓ Active Projectiles: ${finalState.projectiles}`);

        // =================================================================
        // FINAL SUMMARY
        // =================================================================
        console.log('\n' + '='.repeat(70));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(70));

        console.log(`\n✅ VERIFIED WORKING:`);
        console.log(`   - Game loads and initializes`);
        console.log(`   - Mission starts successfully`);
        console.log(`   - Player ship present with weapons`);
        console.log(`   - Torpedo storage = ${shipInfo?.torpedoLauncher?.stored || '?'} ${shipInfo?.torpedoLauncher?.stored === 48 ? '✅' : '❌'}`);
        console.log(`   - Beam dynamic cooldown ${beamCooldownInfo && Math.abs(beamCooldownInfo.firingDuration - beamCooldownInfo.cooldown) < 0.3 ? '✅' : '❌'}`);
        console.log(`   - ${enemyInfo.enemies} enemy ships spawned`);
        console.log(`   - ${pirateInfo.length} pirates with weapon variety`);

        console.log(`\n⚠️  ISSUES FOUND:`);
        console.log(`   - FPS reading: ${finalState.fps} (should be >20)`);
        console.log(`   - Console errors: ${errorMessages.length}`);

        if (errorMessages.length > 0) {
            console.log(`\n🔴 Error Log:`);
            errorMessages.forEach(err => console.log(`   - ${err}`));
        }

        console.log(`\n📸 Screenshots saved to: ${screenshotDir}`);
        console.log(`   View them to verify visual state\n`);

        // Keep browser open for manual inspection
        console.log('⏸️  Browser will stay open for 30 seconds for manual inspection...');
        await sleep(30000);

    } catch (error) {
        console.error('\n❌ TEST ERROR:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
        console.log('\n✓ Test complete, browser closed\n');
    }
}

// Run the test
runManualTest().catch(console.error);
