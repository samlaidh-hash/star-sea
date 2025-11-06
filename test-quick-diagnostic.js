/**
 * Quick diagnostic - just check if game starts
 */

const { chromium } = require('playwright');
const path = require('path');

async function quickTest() {
    console.log('🔍 QUICK DIAGNOSTIC TEST\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    const errors = [];
    page.on('console', msg => {
        const text = msg.text();
        console.log(`   📝 ${text}`);
        if (text.includes('ERROR') || text.includes('Error')) {
            errors.push(text);
        }
    });

    page.on('pageerror', error => {
        console.log(`   ❌ ${error.message}`);
        errors.push(error.message);
    });

    try {
        const indexPath = path.join(__dirname, 'index.html');
        await page.goto(`file:///${indexPath}`, { waitUntil: 'networkidle' });

        console.log('\n✓ Page loaded\n');
        await page.waitForTimeout(2000);

        // Click new game
        console.log('Clicking New Game...');
        await page.click('#btn-new-game');
        await page.waitForTimeout(1000);

        console.log('Clicking Accept Mission...');
        await page.click('#btn-accept-mission');
        await page.waitForTimeout(3000);

        // Check game state
        const state = await page.evaluate(() => {
            return {
                gameExists: !!window.game,
                engineExists: !!(window.game?.engine),
                playerExists: !!(window.game?.engine?.playerShip),
                gameState: window.game?.engine?.state,
                ships: window.game?.engine?.ships?.length || 0,
                errors: window.__errors || []
            };
        });

        console.log('\n📊 GAME STATE:');
        console.log(`   Game object: ${state.gameExists ? '✅' : '❌'}`);
        console.log(`   Engine: ${state.engineExists ? '✅' : '❌'}`);
        console.log(`   Player ship: ${state.playerExists ? '✅' : '❌'}`);
        console.log(`   State: ${state.gameState}`);
        console.log(`   Ships: ${state.ships}`);

        if (errors.length > 0) {
            console.log(`\n🔴 ERRORS: ${errors.length}`);
            errors.forEach(e => console.log(`   - ${e}`));
        } else {
            console.log('\n✅ No errors detected!');
        }

        console.log('\n⏸️  Keeping browser open for 15 seconds for manual inspection...');
        await page.waitForTimeout(15000);

    } catch (error) {
        console.error('\n❌ TEST ERROR:', error.message);
    } finally {
        await browser.close();
        console.log('\n✓ Done\n');
    }
}

quickTest().catch(console.error);
