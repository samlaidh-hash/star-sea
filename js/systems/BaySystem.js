/**
 * Star Sea - Bay System
 * Manages shuttle and fighter/bomber launches, bay space limits
 */

class BaySystem {
    constructor() {
        this.playerShip = null;
        this.baySpace = 0;
        this.maxBaySpace = 0;
        this.launchedShuttles = [];
        this.launchedFighters = [];
        this.launchedBombers = [];
        this.defaultLoadouts = this.initializeDefaultLoadouts();
    }

    init(playerShip) {
        this.playerShip = playerShip;
        this.maxBaySpace = this.calculateMaxBaySpace();
        this.baySpace = this.maxBaySpace;
        this.loadDefaultLoadout();
    }

    calculateMaxBaySpace() {
        // Bay space based on ship class
        const shipClass = this.playerShip.shipClass;
        switch (shipClass) {
            case 'FG': return 2; // 2 bay spaces
            case 'DD': return 4; // 4 bay spaces
            case 'CL': return 6; // 6 bay spaces
            case 'CA': return 8; // 8 bay spaces
            case 'BC': return 10; // 10 bay spaces
            case 'BB': return 12; // 12 bay spaces
            case 'DN': return 14; // 14 bay spaces
            case 'SD': return 16; // 16 bay spaces
            default: return 2;
        }
    }

    initializeDefaultLoadouts() {
        return {
            'FEDERATION': {
                'FG': { shuttles: 1, fighters: 0, bombers: 0 },
                'DD': { shuttles: 2, fighters: 1, bombers: 0 },
                'CL': { shuttles: 3, fighters: 2, bombers: 1 },
                'CA': { shuttles: 4, fighters: 3, bombers: 2 },
                'BC': { shuttles: 5, fighters: 4, bombers: 3 },
                'BB': { shuttles: 6, fighters: 5, bombers: 4 },
                'DN': { shuttles: 7, fighters: 6, bombers: 5 },
                'SD': { shuttles: 8, fighters: 7, bombers: 6 }
            },
            'TRIGON': {
                'FG': { shuttles: 1, fighters: 1, bombers: 0 },
                'DD': { shuttles: 2, fighters: 2, bombers: 1 },
                'CL': { shuttles: 3, fighters: 3, bombers: 2 },
                'CA': { shuttles: 4, fighters: 4, bombers: 3 },
                'BC': { shuttles: 5, fighters: 5, bombers: 4 },
                'BB': { shuttles: 6, fighters: 6, bombers: 5 },
                'DN': { shuttles: 7, fighters: 7, bombers: 6 },
                'SD': { shuttles: 8, fighters: 8, bombers: 7 }
            },
            'SCINTILIAN': {
                'FG': { shuttles: 0, fighters: 2, bombers: 0 },
                'DD': { shuttles: 1, fighters: 3, bombers: 1 },
                'CL': { shuttles: 2, fighters: 4, bombers: 2 },
                'CA': { shuttles: 3, fighters: 5, bombers: 3 },
                'BC': { shuttles: 4, fighters: 6, bombers: 4 },
                'BB': { shuttles: 5, fighters: 7, bombers: 5 },
                'DN': { shuttles: 6, fighters: 8, bombers: 6 },
                'SD': { shuttles: 7, fighters: 9, bombers: 7 }
            },
            'PIRATE': {
                'FG': { shuttles: 1, fighters: 1, bombers: 0 },
                'DD': { shuttles: 2, fighters: 2, bombers: 1 },
                'CL': { shuttles: 3, fighters: 3, bombers: 2 },
                'CA': { shuttles: 4, fighters: 4, bombers: 3 },
                'BC': { shuttles: 5, fighters: 5, bombers: 4 },
                'BB': { shuttles: 6, fighters: 6, bombers: 5 },
                'DN': { shuttles: 7, fighters: 7, bombers: 6 },
                'SD': { shuttles: 8, fighters: 8, bombers: 7 }
            }
        };
    }

    loadDefaultLoadout() {
        const faction = this.playerShip.faction;
        const shipClass = this.playerShip.shipClass;
        
        if (this.defaultLoadouts[faction] && this.defaultLoadouts[faction][shipClass]) {
            const loadout = this.defaultLoadouts[faction][shipClass];
            this.baySpace = this.maxBaySpace - this.calculateLoadoutSpace(loadout);
        }
    }

    calculateLoadoutSpace(loadout) {
        return (loadout.shuttles || 0) + (loadout.fighters || 0) + (loadout.bombers || 0);
    }

    canLaunchShuttle(missionType) {
        return this.baySpace >= 1;
    }

    canLaunchFighter() {
        return this.baySpace >= 1;
    }

    canLaunchBomber() {
        return this.baySpace >= 2; // Bombers take 2 bay spaces
    }

    launchShuttle(missionType, target = null) {
        if (!this.canLaunchShuttle(missionType)) {
            console.log('Not enough bay space to launch shuttle');
            return null;
        }

        // Calculate launch position (behind ship)
        const launchDistance = this.playerShip.radius + 20;
        const launchAngle = this.playerShip.rotation + 180; // Behind ship
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const shuttle = new Shuttle({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            missionType: missionType,
            missionTarget: target,
            physicsWorld: this.playerShip.physicsWorld
        });

        this.launchedShuttles.push(shuttle);
        this.baySpace -= 1;

        eventBus.emit('shuttle-launched', { shuttle: shuttle, missionType: missionType });
        return shuttle;
    }

    launchFighter() {
        if (!this.canLaunchFighter()) {
            console.log('Not enough bay space to launch fighter');
            return null;
        }

        // Calculate launch position (port side of ship)
        const launchDistance = this.playerShip.radius + 15;
        const launchAngle = this.playerShip.rotation + 90; // Port side
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const fighter = new Fighter({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            faction: this.playerShip.faction,
            physicsWorld: this.playerShip.physicsWorld
        });

        this.launchedFighters.push(fighter);
        this.baySpace -= 1;

        eventBus.emit('fighter-launched', { fighter: fighter });
        return fighter;
    }

    launchBomber() {
        if (!this.canLaunchBomber()) {
            console.log('Not enough bay space to launch bomber');
            return null;
        }

        // Calculate launch position (starboard side of ship)
        const launchDistance = this.playerShip.radius + 15;
        const launchAngle = this.playerShip.rotation - 90; // Starboard side
        const launchX = this.playerShip.x + Math.cos(MathUtils.toRadians(launchAngle)) * launchDistance;
        const launchY = this.playerShip.y + Math.sin(MathUtils.toRadians(launchAngle)) * launchDistance;

        const bomber = new Bomber({
            x: launchX,
            y: launchY,
            ownerShip: this.playerShip,
            faction: this.playerShip.faction,
            physicsWorld: this.playerShip.physicsWorld
        });

        this.launchedBombers.push(bomber);
        this.baySpace -= 2; // Bombers take 2 bay spaces

        eventBus.emit('bomber-launched', { bomber: bomber });
        return bomber;
    }

    recoverShuttle(shuttle) {
        const index = this.launchedShuttles.indexOf(shuttle);
        if (index !== -1) {
            this.launchedShuttles.splice(index, 1);
            this.baySpace += 1;
            eventBus.emit('shuttle-recovered', { shuttle: shuttle });
        }
    }

    recoverFighter(fighter) {
        const index = this.launchedFighters.indexOf(fighter);
        if (index !== -1) {
            this.launchedFighters.splice(index, 1);
            this.baySpace += 1;
            eventBus.emit('fighter-recovered', { fighter: fighter });
        }
    }

    recoverBomber(bomber) {
        const index = this.launchedBombers.indexOf(bomber);
        if (index !== -1) {
            this.launchedBombers.splice(index, 1);
            this.baySpace += 2; // Bombers take 2 bay spaces
            eventBus.emit('bomber-recovered', { bomber: bomber });
        }
    }

    update(deltaTime, currentTime, allEntities) {
        // Update launched shuttles
        for (let i = this.launchedShuttles.length - 1; i >= 0; i--) {
            const shuttle = this.launchedShuttles[i];
            if (!shuttle.active) {
                this.recoverShuttle(shuttle);
            } else {
                shuttle.update(deltaTime, currentTime, allEntities);
            }
        }

        // Update launched fighters
        for (let i = this.launchedFighters.length - 1; i >= 0; i--) {
            const fighter = this.launchedFighters[i];
            if (!fighter.active) {
                this.recoverFighter(fighter);
            } else {
                fighter.update(deltaTime, currentTime, allEntities);
            }
        }

        // Update launched bombers
        for (let i = this.launchedBombers.length - 1; i >= 0; i--) {
            const bomber = this.launchedBombers[i];
            if (!bomber.active) {
                this.recoverBomber(bomber);
            } else {
                bomber.update(deltaTime, currentTime, allEntities);
            }
        }
    }

    getBayStatus() {
        return {
            baySpace: this.baySpace,
            maxBaySpace: this.maxBaySpace,
            launchedShuttles: this.launchedShuttles.length,
            launchedFighters: this.launchedFighters.length,
            launchedBombers: this.launchedBombers.length,
            canLaunchShuttle: this.canLaunchShuttle(),
            canLaunchFighter: this.canLaunchFighter(),
            canLaunchBomber: this.canLaunchBomber()
        };
    }

    getShuttleMissions() {
        return [
            'ATTACK',
            'DEFENSE', 
            'WILD_WEASEL',
            'SUICIDE',
            'TRANSPORT',
            'SCAN'
        ];
    }
}

