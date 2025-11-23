/**
 * Star Sea - Debug Game State with Playwright
 * Directly interrogates the game to see what's happening
 */

const { chromium } = require('playwright');
const path = require('path');

async function debugGameState() {
    console.log('🔍 Debugging Star Sea game state...\n');

    // Launch browser
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000 // Slow down for visibility
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Enable console logging
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            console.log(`❌ Console Error: ${text}`);
        } else if (type === 'log') {
            console.log(`📝 Console Log: ${text}`);
        }
    });

    try {
        // Load the game
        console.log('📂 Loading game...');
        await page.goto('http://localhost:8100/index.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Click New Game
        console.log('🎮 Clicking New Game...');
        await page.click('#new-game-btn');
        await page.waitForTimeout(2000);

        // Click Accept Mission
        console.log('📋 Clicking Accept Mission...');
        await page.click('#accept-mission-btn');
        await page.waitForTimeout(3000);

        // Interrogate game state
        console.log('\n🔍 Interrogating game state...');
        
        const gameState = await page.evaluate(() => {
            if (typeof window.game === 'undefined') {
                return { error: 'Game not found on window' };
            }

            const game = window.game;
            return {
                playerShip: game.playerShip ? {
                    exists: true,
                    x: game.playerShip.x,
                    y: game.playerShip.y,
                    active: game.playerShip.active
                } : { exists: false },
                enemyShips: game.enemyShips ? {
                    count: game.enemyShips.length,
                    ships: game.enemyShips.map(ship => ({
                        x: ship.x,
                        y: ship.y,
                        active: ship.active
                    }))
                } : { count: 0 },
                entities: game.entities ? {
                    count: game.entities.length,
                    types: game.entities.map(e => e.type || 'unknown')
                } : { count: 0 },
                camera: game.camera ? {
                    x: game.camera.x,
                    y: game.camera.y,
                    zoom: game.camera.zoom
                } : null
            };
        });

        console.log('📊 Game State Analysis:');
        console.log('======================');
        console.log(`Player Ship: ${gameState.playerShip.exists ? '✅ Found' : '❌ Missing'}`);
        if (gameState.playerShip.exists) {
            console.log(`  Position: (${Math.round(gameState.playerShip.x)}, ${Math.round(gameState.playerShip.y)})`);
            console.log(`  Active: ${gameState.playerShip.active}`);
        }

        console.log(`\nEnemy Ships: ${gameState.enemyShips.count}`);
        if (gameState.enemyShips.count > 0) {
            gameState.enemyShips.ships.forEach((ship, i) => {
                console.log(`  Enemy ${i + 1}: (${Math.round(ship.x)}, ${Math.round(ship.y)}) - Active: ${ship.active}`);
            });
        }

        console.log(`\nTotal Entities: ${gameState.entities.count}`);
        if (gameState.entities.count > 0) {
            console.log(`  Types: ${gameState.entities.types.join(', ')}`);
        }

        if (gameState.camera) {
            console.log(`\nCamera: (${Math.round(gameState.camera.x)}, ${Math.round(gameState.camera.y)}) Zoom: ${gameState.camera.zoom}`);
        }

        // Test movement
        console.log('\n🎮 Testing movement...');
        await page.keyboard.press('KeyW');
        await page.waitForTimeout(500);
        await page.keyboard.press('KeyA');
        await page.waitForTimeout(500);
        await page.keyboard.press('KeyS');
        await page.waitForTimeout(500);
        await page.keyboard.press('KeyD');
        await page.waitForTimeout(500);

        // Check if position changed
        const newPosition = await page.evaluate(() => {
            if (window.game && window.game.playerShip) {
                return {
                    x: window.game.playerShip.x,
                    y: window.game.playerShip.y
                };
            }
            return null;
        });

        if (newPosition) {
            console.log(`New Position: (${Math.round(newPosition.x)}, ${Math.round(newPosition.y)})`);
            if (newPosition.x !== gameState.playerShip.x || newPosition.y !== gameState.playerShip.y) {
                console.log('✅ Movement working!');
            } else {
                console.log('❌ Movement not working');
            }
        }

        // Take final screenshot
        await page.screenshot({
            path: path.join(__dirname, 'debug-screenshot.png'),
            fullPage: true
        });
        console.log('\n📸 Screenshot saved: debug-screenshot.png');

    } catch (error) {
        console.error('❌ Error during debugging:', error);
    } finally {
        await browser.close();
    }
}

// Run the debug
debugGameState().catch(console.error);


