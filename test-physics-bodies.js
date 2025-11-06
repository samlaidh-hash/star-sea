/**
 * Check how many physics bodies exist
 */
const { chromium } = require('playwright');
const path = require('path');

async function checkPhysics() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        const indexPath = path.join(__dirname, 'index.html');
        await page.goto(`file:///${indexPath}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        await page.click('#btn-new-game');
        await page.waitForTimeout(1000);
        await page.click('#btn-accept-mission');
        await page.waitForTimeout(3000);

        const physicsInfo = await page.evaluate(() => {
            const engine = window.game?.engine;
            if (!engine) return null;

            return {
                entities: engine.entities?.length || 0,
                ships: engine.ships?.length || 0,
                projectiles: engine.projectiles?.length || 0,
                physicsBodies: engine.physicsWorld?.bodies?.length || 0,
                physicsEnabled: !CONFIG.DISABLE_PHYSICS
            };
        });

        console.log('📊 PHYSICS ANALYSIS:');
        console.log(`   Physics Enabled: ${physicsInfo.physicsEnabled}`);
        console.log(`   Entities: ${physicsInfo.entities}`);
        console.log(`   Ships: ${physicsInfo.ships}`);
        console.log(`   Projectiles: ${physicsInfo.projectiles}`);
        console.log(`   Physics Bodies: ${physicsInfo.physicsBodies}`);
        console.log(`\n   ⚠️  If bodies > 50, that's the problem!`);

        await page.waitForTimeout(5000);
    } finally {
        await browser.close();
    }
}

checkPhysics().catch(console.error);
