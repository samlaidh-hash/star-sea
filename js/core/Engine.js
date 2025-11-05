const SHIP_CLASS_LABELS = {
    FG: "Frigate",
    DD: "Destroyer",
    CL: "Light Cruiser",
    CA: "Heavy Cruiser",
    BC: "Battlecruiser"
};

const FACTION_DISPLAY_NAMES = {
    PLAYER: "Federation",
    FEDERATION: "Federation",
    TRIGON: "Trigon Empire",
    SCINTILIAN: "Scintilian Coalition",
    PIRATE: "Pirate Clans"
};

const PLAYER_SHIP_BASE_OPTIONS = [
    {
        id: "FED_FG",
        faction: "PLAYER",
        shipClass: "FG",
        name: "USS Sabre",
        label: "Federation Frigate (FG)",
        description: "Fast escort with dual torpedo arcs.",
        torpedo: { loaded: 2, stored: 20, hp: 4, summary: "Dual forward and aft 90-degree arcs" },
        special: "Agile glass cannon built for quick strikes."
    },
    {
        id: "FED_DD",
        faction: "PLAYER",
        shipClass: "DD",
        name: "USS Defiant",
        label: "Federation Destroyer (DD)",
        description: "Escort destroyer with reinforced torpedo pod.",
        torpedo: { loaded: 3, stored: 30, hp: 6, summary: "Dual forward and aft 90-degree arcs" },
        special: "Dual 90-degree torpedo arcs and improved durability."
    },
    {
        id: "FED_CL",
        faction: "PLAYER",
        shipClass: "CL",
        name: "USS Reliant",
        label: "Federation Light Cruiser (CL)",
        description: "Balanced cruiser with strong beams and dual arcs.",
        torpedo: { loaded: 4, stored: 40, hp: 8, summary: "Dual forward and aft 90-degree arcs" },
        special: "Dual 90-degree torpedo arcs with cruiser endurance."
    },
    {
        id: "FED_CA",
        faction: "PLAYER",
        shipClass: "CA",
        name: "USS Enterprise",
        label: "Federation Heavy Cruiser (CA)",
        description: "Galaxy-class heavy cruiser ready for any engagement.",
        torpedo: { loaded: 5, stored: 50, hp: 10, summary: "Dual forward and aft 90-degree arcs" },
        special: "Dual 90-degree torpedo arcs and flagship-grade systems."
    },
    {
        id: "FED_BC",
        faction: "PLAYER",
        shipClass: "BC",
        name: "USS Odyssey",
        label: "Federation Battlecruiser (BC)",
        description: "Heavy hitter with the largest torpedo magazine.",
        torpedo: { loaded: 6, stored: 60, hp: 12, summary: "Dual forward and aft 90-degree arcs" },
        special: "Maximum-capacity dual torpedo arcs."
    },
    {
        id: "TRI_FG",
        faction: "TRIGON",
        shipClass: "FG",
        name: "IKS Kravok",
        label: "Trigon Frigate (FG)",
        description: "Swift raider armed with disruptor cannons.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "120-degree forward disruptors and +20% turn rate."
    },
    {
        id: "TRI_DD",
        faction: "TRIGON",
        shipClass: "DD",
        name: "IKS K'Tinga",
        label: "Trigon Destroyer (DD)",
        description: "Destroyer that doubles down on disruptor firepower.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Twin disruptor mounts with +20% turn rate."
    },
    {
        id: "TRI_CL",
        faction: "TRIGON",
        shipClass: "CL",
        name: "IKS Vor'ta",
        label: "Trigon Light Cruiser (CL)",
        description: "Forward-swept cruiser built for relentless disruptor volleys.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Wide disruptor arcs and +20% turn rate."
    },
    {
        id: "TRI_CA",
        faction: "TRIGON",
        shipClass: "CA",
        name: "IKS Negh'var",
        label: "Trigon Heavy Cruiser (CA)",
        description: "Heavy cruiser with disruptor lattices covering the bow.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Heavy disruptor banks and +20% turn rate."
    },
    {
        id: "TRI_BC",
        faction: "TRIGON",
        shipClass: "BC",
        name: "IKS Vengeance",
        label: "Trigon Battlecruiser (BC)",
        description: "Battlecruiser with disruptor coverage fore and aft.",
        torpedo: { summary: "No torpedoes; disruptor cannons only" },
        special: "Forward and aft disruptors with +20% turn rate."
    },
    {
        id: "SCI_FG",
        faction: "SCINTILIAN",
        shipClass: "FG",
        name: "IRW Talon",
        label: "Scintilian Frigate (FG)",
        description: "Cloak-capable frigate using pulse beams.",
        torpedo: { summary: "No torpedoes; pulse beam only" },
        special: "Cloaking device with rapid pulse beams."
    },
    {
        id: "SCI_DD",
        faction: "SCINTILIAN",
        shipClass: "DD",
        name: "IRW Valdore",
        label: "Scintilian Destroyer (DD)",
        description: "Destroyer that wields chargeable plasma torpedoes.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedo launcher (forward 90-degree arc)" },
        special: "Cloaking device and charge-to-fire plasma torpedoes."
    },
    {
        id: "SCI_CL",
        faction: "SCINTILIAN",
        shipClass: "CL",
        name: "IRW Khazara",
        label: "Scintilian Light Cruiser (CL)",
        description: "Cruiser with forward and aft plasma launchers.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedoes fore and aft (90-degree arcs)" },
        special: "Cloaking device with dual plasma arcs."
    },
    {
        id: "SCI_CA",
        faction: "SCINTILIAN",
        shipClass: "CA",
        name: "IRW Haakona",
        label: "Scintilian Heavy Cruiser (CA)",
        description: "Heavy cruiser fielding cloaked plasma strikes.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedoes fore and aft (90-degree arcs)" },
        special: "Cloaking device with heavy plasma salvos."
    },
    {
        id: "SCI_BC",
        faction: "SCINTILIAN",
        shipClass: "BC",
        name: "IRW Praetor",
        label: "Scintilian Battlecruiser (BC)",
        description: "Flagship battlecruiser that rains plasma under cloak.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedoes fore and aft (90-degree arcs)" },
        special: "Cloaking device with dual plasma bombardment."
    },
    {
        id: "PIR_FG",
        faction: "PIRATE",
        shipClass: "FG",
        name: "ITS Marauder",
        label: "Pirate Frigate (FG)",
        description: "Raider with stolen Federation beam and torpedo trap.",
        torpedo: { loaded: 4, stored: 20, hp: 4, summary: "Forward 90-degree arc (standard torpedo)" },
        special: "Unpredictable pirate tech mixing beam and torpedo."
    },
    {
        id: "PIR_DD",
        faction: "PIRATE",
        shipClass: "DD",
        name: "ITS Corsair",
        label: "Pirate Destroyer (DD)",
        description: "Hybrid destroyer with aft torpedo pod for ambushes.",
        torpedo: { loaded: 4, stored: 20, hp: 4, summary: "Aft 90-degree arc (standard torpedo)" },
        special: "Aft-launched torpedoes paired with salvaged disruptor."
    },
    {
        id: "PIR_CL",
        faction: "PIRATE",
        shipClass: "CL",
        name: "ITS Tempest",
        label: "Pirate Light Cruiser (CL)",
        description: "Pirate cruiser with pulse beams and forward torpedo rack.",
        torpedo: { loaded: 4, stored: 20, hp: 4, summary: "Forward 90-degree arc (standard torpedo)" },
        special: "Pirate-modified pulse beams and torpedoes."
    },
    {
        id: "PIR_CA",
        faction: "PIRATE",
        shipClass: "CA",
        name: "ITS Wraith",
        label: "Pirate Heavy Cruiser (CA)",
        description: "Heavy pirate ship mounting a stolen plasma launcher.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedo launcher (aft 90-degree arc)" },
        special: "Hybrid Federation beam with black-market plasma."
    },
    {
        id: "PIR_BC",
        faction: "PIRATE",
        shipClass: "BC",
        name: "ITS Tyrant",
        label: "Pirate Battlecruiser (BC)",
        description: "Heaviest pirate hull wielding disruptor and plasma tech.",
        torpedo: { loaded: 1, stored: 0, hp: 4, summary: "Plasma torpedo launcher (aft 90-degree arc)" },
        special: "Disruptor cannon paired with stolen plasma warheads."
    }
];
/**
 * Star Sea - Game Engine
 * Main game engine that coordinates all systems
 */

class Engine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Core systems
        this.inputManager = new InputManager();
        this.stateManager = new StateManager();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.renderer = new Renderer(this.ctx, this.camera);
        this.playerShipOptions = this.createPlayerShipOptions();
        this.playerShipSelection = null;
        this.playerShipSelectionId = null;
        this.shipSelectElement = null;
        this.shipSummaryElements = {};
        this.shipSelectionHighlightTimeout = null;
        this.hud = new HUD();

        // Performance tracking
        this.trailFrameCounter = 0;

        // Weapon firing state
        this.beamFiring = false;
        this.torpedoCharging = false;
        this.plasmaChargeStart = 0;
        this.plasmaChargeDamage = 0;

        // Mission system
        this.missionManager = new MissionManager();
        this.missionUI = new MissionUI();

        // Save system
        this.saveManager = new SaveManager();

        // Progression system
        this.progressionManager = new ProgressionManager();

        // Particle system
        this.particleSystem = new ParticleSystem();

        // Audio system
        this.audioManager = new AudioManager();

        // Physics
        this.physicsWorld = new PhysicsWorld();
        this.collisionHandler = new CollisionHandler(this.physicsWorld);
        this.physicsWorld.setCollisionHandler(this.collisionHandler);

        // Game entities
        this.entities = [];
        this.playerShip = null;
        this.enemyShips = [];
        this.environmentalHazards = [];
        this.projectiles = [];

        // Targeting system
        this.targetingSystem = new TargetingSystem();

        // Warp sequence
        this.warpingOut = false;
        this.warpSequenceTime = 0;
        this.warpSequenceDuration = 3; // 3 seconds

        // Game loop
        this.gameLoop = new GameLoop(
            (dt) => this.update(dt),
            (dt) => this.render(dt)
        );

        // Setup
        this.setupEventListeners();
        this.setupMenuButtons();
        this.setupGameEvents();
        this.setupShipSelectionUI();
    }

    resize() {
        // Maintain aspect ratio while fitting window
        const aspectRatio = CONFIG.CANVAS_WIDTH / CONFIG.CANVAS_HEIGHT;
        const windowRatio = window.innerWidth / window.innerHeight;

        if (windowRatio > aspectRatio) {
            // Window is wider
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerHeight * aspectRatio;
        } else {
            // Window is taller
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerWidth / aspectRatio;
        }

        // Update camera
        if (this.camera) {
            this.camera.width = this.canvas.width;
            this.camera.height = this.canvas.height;
        }
    }

    setupEventListeners() {
        // ESC to pause/unpause
        eventBus.on('keydown', (data) => {
            if (data.key === 'escape') {
                this.stateManager.togglePause();
            }
            // V key to initiate warp (when charged)
            if (data.key === 'v' && this.playerShip) {
                this.initiateWarp();
            }
        });

        // Mouse wheel zoom
        eventBus.on('mouse-wheel', (data) => {
            this.camera.adjustZoom(data.delta);
        });

        // Weapon firing - new hold-to-fire system
        eventBus.on('beam-fire-start', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;
            this.beamFiring = true;
        });

        eventBus.on('beam-fire-stop', (data) => {
            this.beamFiring = false;
        });

        eventBus.on('torpedo-fire-start', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            // Check if player has plasma torpedoes (Scintilian)
            if (this.playerShip.faction === 'SCINTILIAN') {
                // Start charging plasma torpedo
                this.torpedoCharging = true;
                this.plasmaChargeStart = performance.now() / 1000;
                this.plasmaChargeDamage = 0;
            } else {
                // Standard torpedo - fire immediately on click
                const worldPos = this.camera.screenToWorld(data.x, data.y);
                const lockOnTarget = this.targetingSystem.getLockedTarget();
                const projectiles = this.playerShip.fireTorpedoes(worldPos.x, worldPos.y, lockOnTarget);
                if (projectiles && projectiles.length > 0) {
                    this.projectiles.push(...projectiles);
                    this.entities.push(...projectiles);
                    this.audioManager.playSound('torpedo-fire');
                }
            }
        });

        eventBus.on('torpedo-fire-release', (data) => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            // Release plasma torpedo if charging
            if (this.torpedoCharging) {
                this.torpedoCharging = false;

                // Fire plasma torpedo with accumulated charge
                const worldPos = this.camera.screenToWorld(data.x, data.y);
                const nearestTarget = this.findNearestTargetToReticle(worldPos.x, worldPos.y);
                const projectiles = this.playerShip.firePlasma(worldPos.x, worldPos.y, nearestTarget, this.plasmaChargeDamage);
                if (projectiles && projectiles.length > 0) {
                    this.projectiles.push(...projectiles);
                    this.entities.push(...projectiles);
                    this.audioManager.playSound('plasma-fire');
                }

                this.plasmaChargeDamage = 0;
            }
        });

        // Decoy/mine deployment
        eventBus.on('deploy-decoy', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            const decoy = this.playerShip.deployDecoy();
            if (decoy) {
                this.entities.push(decoy);
                this.audioManager.playSound('decoy-deploy');
            }
        });

        eventBus.on('deploy-mine', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            const mine = this.playerShip.deployMine();
            if (mine) {
                this.entities.push(mine);
                this.audioManager.playSound('mine-deploy');
            }
        });

        // Shuttle control events
        eventBus.on('cycle-shuttle-mission', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            this.playerShip.cycleShuttleMission();
        });

        eventBus.on('launch-shuttle', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            const shuttle = this.playerShip.launchShuttle();
            if (shuttle) {
                this.entities.push(shuttle);
                // Audio for shuttle launch (if available)
                // this.audioManager.playSound('shuttle-launch');
            }
        });

        eventBus.on('recall-shuttles', () => {
            if (!this.stateManager.isPlaying() || !this.playerShip) return;

            this.playerShip.recallShuttles();
        });

        // Lock-on events for reticle visuals
        eventBus.on('lock-acquired', (data) => {
            const reticle = document.getElementById('reticle');
            if (reticle) reticle.classList.add('locked');
            this.audioManager.playSound('lock-acquired');
        });

        eventBus.on('lock-starting', (data) => {
            const reticle = document.getElementById('reticle');
            if (reticle) {
                reticle.classList.remove('locked');
                reticle.classList.add('locking');
            }
        });

        eventBus.on('lock-broken', (data) => {
            const reticle = document.getElementById('reticle');
            if (reticle) {
                reticle.classList.remove('locked', 'locking');
            }
        });
    }

    setupMenuButtons() {
        const bindClick = (id, handler) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', handler);
            }
        };

        const highlightSelection = () => this.highlightShipSelectionPanel();

        // Main menu
        bindClick('btn-new-game', () => this.startNewGame());
        bindClick('btn-load-game', () => this.loadSavedGame());
        bindClick('btn-options', highlightSelection);

        // Pause menu
        bindClick('btn-resume', () => this.stateManager.setState('PLAYING'));
        bindClick('btn-save', () => this.saveCurrentGame());
        bindClick('btn-load', () => this.loadSavedGame());
        bindClick('btn-options-pause', highlightSelection);
        bindClick('btn-main-menu', () => {
            if (confirm('Return to main menu? Unsaved progress will be lost.')) {
                this.stateManager.setState('MAIN_MENU');
            }
        });
    }

    setupGameEvents() {
        // Player damage
        eventBus.on('player-damage', (data) => {
            this.hud.addCriticalMessage(`Hull breach! ${Math.round(data.damage)} damage taken. HP: ${Math.round(data.hp)}`);
            this.audioManager.playSound('hull-breach');
        });

        // Shield hit
        eventBus.on('shield-hit', (data) => {
            this.hud.addCriticalMessage(`Shields absorbed ${Math.round(data.damage)} damage!`);
            // Shield impact effect
            if (data.position) {
                this.particleSystem.createShieldImpact(data.position.x, data.position.y, {
                    color: data.ship?.isPlayer ? '#00ffff' : '#ff6600'
                });
            }
            this.audioManager.playSound('shield-hit');
        });

        // System damage
        eventBus.on('system-damage', (data) => {
            const efficiency = Math.round((data.hp / data.maxHp) * 100);
            this.hud.addCriticalMessage(`${data.system} hit! ${Math.round(data.damage)} damage (${efficiency}% operational)`);

            // Damage sparks
            if (data.ship) {
                this.particleSystem.createDamageSparks(data.ship.x, data.ship.y, 3);
            }

            this.audioManager.playSound('system-damage');

            if (data.hp === 0) {
                this.hud.addCriticalMessage(`WARNING: ${data.system} DESTROYED!`);
                // More sparks for destroyed system
                if (data.ship) {
                    this.particleSystem.createDamageSparks(data.ship.x, data.ship.y, 8);
                }
                this.audioManager.playSound('alert-warning');
            }
        });

        // Control glitch from damaged C&C
        eventBus.on('control-glitch', () => {
            this.hud.addCriticalMessage('CONTROL SYSTEMS MALFUNCTION!');
        });

        // Player destroyed
        eventBus.on('player-destroyed', () => {
            this.hud.addCriticalMessage('SHIP DESTROYED!');
            // Large explosion for player ship
            if (this.playerShip) {
                this.particleSystem.createExplosion(this.playerShip.x, this.playerShip.y, {
                    particleCount: 50,
                    size: 2.0,
                    color: '#ff6600',
                    speed: 150
                });
                this.audioManager.playSound('explosion-large');
            }
            setTimeout(() => {
                alert('Game Over! Your ship was destroyed.');
                this.stateManager.setState('MAIN_MENU');
            }, 1000);
        });

        // Ship-asteroid collision
        eventBus.on('ship-asteroid-collision', (data) => {
            if (data.ship.isPlayer) {
                this.hud.addCriticalMessage(`Asteroid collision! Size: ${data.asteroid.size}`);
            }
        });

        // Ship destroyed by collapsar
        eventBus.on('ship-destroyed', (data) => {
            if (data.ship && data.ship.isPlayer && data.cause === 'collapsar') {
                this.hud.addCriticalMessage('PULLED INTO COLLAPSAR!');
            }
        });

        // AI weapon firing events
        eventBus.on('ai-fired-beams', (data) => {
            if (data.projectiles) {
                this.projectiles.push(...data.projectiles);
                this.entities.push(...data.projectiles);

                // Play appropriate weapon sound based on projectile type
                if (data.projectiles.length > 0) {
                    const projectileType = data.projectiles[0].projectileType;
                    if (projectileType === 'disruptor') {
                        this.audioManager.playSound('disruptor-fire', { volume: 0.5 });
                    } else {
                        this.audioManager.playSound('beam-fire', { volume: 0.5 });
                    }
                }
            }
        });

        eventBus.on('ai-fired-torpedoes', (data) => {
            if (data.projectiles) {
                this.projectiles.push(...data.projectiles);
                this.entities.push(...data.projectiles);

                // Play appropriate torpedo sound
                if (data.projectiles.length > 0) {
                    const projectileType = data.projectiles[0].projectileType;
                    if (projectileType === 'plasma') {
                        this.audioManager.playSound('plasma-fire', { volume: 0.5 });
                    } else {
                        this.audioManager.playSound('torpedo-fire', { volume: 0.5 });
                    }
                }
            }
        });

        eventBus.on('ai-deploy-decoy', (data) => {
            if (data.ship) {
                const decoy = data.ship.deployDecoy();
                if (decoy) {
                    this.entities.push(decoy);
                }
            }
        });

        // Mission events
        eventBus.on('mission-accepted', (data) => {
            this.startMission(data.mission.id);
        });

        eventBus.on('mission-completed', (data) => {
            // Award mission rewards
            const rewards = this.progressionManager.awardMissionRewards(data);

            // Add rewards to debriefing data
            data.rewards = rewards;

            this.missionUI.showDebriefing(data);
        });

        eventBus.on('load-next-mission', (data) => {
            this.loadMission(data.missionId);
        });

        eventBus.on('objective-completed', (data) => {
            this.hud.addCriticalMessage(`Objective Complete: ${data.objective.description}`);
            this.audioManager.playSound('objective-complete');
        });

        eventBus.on('enemy-destroyed', (data) => {
            if (this.missionManager.missionActive) {
                this.missionManager.handleEnemyDestroyed(data.enemy);
            }
            // Explosion for enemy ship
            if (data.enemy) {
                const shipSize = data.enemy.getShipSize ? data.enemy.getShipSize() / 50 : 1.0;
                this.particleSystem.createExplosion(data.enemy.x, data.enemy.y, {
                    particleCount: 30 + Math.floor(shipSize * 20),
                    size: shipSize,
                    color: '#ff6600',
                    speed: 100
                });

                // Play appropriate explosion sound based on ship size
                if (shipSize > 1.2) {
                    this.audioManager.playSound('explosion-large');
                } else if (shipSize > 0.8) {
                    this.audioManager.playSound('explosion-medium');
                } else {
                    this.audioManager.playSound('explosion-small');
                }
            }
        });
    }

    createPlayerShipOptions() {
        return PLAYER_SHIP_BASE_OPTIONS.map((base) => {
            const option = { ...base };
            option.classLabel = SHIP_CLASS_LABELS[option.shipClass] || option.shipClass;
            option.factionLabel = FACTION_DISPLAY_NAMES[option.faction] || option.faction;
            const stats = this.getClassStats(option.shipClass);
            option.hull = stats.hull;
            option.speed = stats.speed;
            return option;
        });
    }

    getClassStats(shipClass) {
        const fallback = { hull: undefined, speed: undefined };
        if (typeof CONFIG === 'undefined') {
            return fallback;
        }
        const hpKey = `SHIP_HP_${shipClass}`;
        const speedKey = `MAX_SPEED_${shipClass}`;
        return {
            hull: CONFIG[hpKey] !== undefined ? CONFIG[hpKey] : fallback.hull,
            speed: CONFIG[speedKey] !== undefined ? CONFIG[speedKey] : fallback.speed
        };
    }

    loadPlayerShipSelectionId() {
        try {
            return typeof window !== 'undefined' && window.localStorage
                ? localStorage.getItem('star-sea-player-ship')
                : null;
        } catch (error) {
            console.warn('Unable to load player ship selection', error);
            return null;
        }
    }

    savePlayerShipSelectionId(id) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('star-sea-player-ship', id);
            }
        } catch (error) {
            console.warn('Unable to persist player ship selection', error);
        }
    }

    findPlayerShipOptionById(id) {
        if (!id) return null;
        return this.playerShipOptions.find(option => option.id === id) || null;
    }

    findPlayerShipOptionByShip(faction, shipClass) {
        if (!faction || !shipClass) return null;
        return this.playerShipOptions.find(option => option.faction === faction && option.shipClass === shipClass) || null;
    }

    applyPlayerShipOption(option, { skipSave = false, skipUI = false } = {}) {
        if (!option) return;
        this.playerShipSelection = { ...option };
        this.playerShipSelectionId = option.id;

        if (!skipUI && this.shipSelectElement) {
            this.shipSelectElement.value = option.id;
        }

        this.updateShipSelectionSummary(option);

        if (!skipSave) {
            this.savePlayerShipSelectionId(option.id);
        }

        if (!skipUI) {
            this.highlightShipSelectionPanel();
        }
    }



    setupShipSelectionUI() {
        const select = document.getElementById('player-ship-select');
        this.shipSummaryElements = {
            role: document.getElementById('ship-summary-role'),
            description: document.getElementById('ship-summary-description'),
            stats: document.getElementById('ship-summary-stats'),
            torpedoes: document.getElementById('ship-summary-torpedoes'),
            special: document.getElementById('ship-summary-special')
        };

        const storedId = this.loadPlayerShipSelectionId();
        let selectedOption = this.findPlayerShipOptionById(storedId) || this.playerShipOptions[0];
        this.applyPlayerShipOption(selectedOption, { skipSave: true, skipUI: true });

        if (!select) {
            this.savePlayerShipSelectionId(selectedOption.id);
            return;
        }

        this.shipSelectElement = select;
        select.innerHTML = '';
        for (const option of this.playerShipOptions) {
            const opt = document.createElement('option');
            opt.value = option.id;
            opt.textContent = option.label;
            select.appendChild(opt);
        }

        select.value = selectedOption.id;
        this.updateShipSelectionSummary(selectedOption);
        this.savePlayerShipSelectionId(selectedOption.id);

        select.addEventListener('change', (event) => {
            const option = this.findPlayerShipOptionById(event.target.value);
            if (option) {
                this.applyPlayerShipOption(option);
                this.updateShipSelectionSummary(option);
            }
        });

        this.highlightShipSelectionPanel();
    }

    updateShipSelectionSummary(option) {
        if (!option || !this.shipSummaryElements) return;

        const { role, description, stats, torpedoes, special } = this.shipSummaryElements;

        if (role) {
            const shipName = option.name || option.label;
            role.textContent = `${shipName} - ${option.factionLabel} ${option.classLabel}`;
        }
        if (description) {
            description.textContent = option.description || '';
        }
        if (stats) {
            const hullText = option.hull !== undefined ? option.hull : '?';
            const speedText = option.speed !== undefined ? Math.round(option.speed) : '?';
            stats.textContent = `Hull ${hullText} HP | Max speed ${speedText}`;
        }
        if (torpedoes) {
            if (option.torpedo) {
                if (option.torpedo.loaded !== undefined && option.torpedo.stored !== undefined) {
                    let summary = `Torpedoes: ${option.torpedo.loaded} loaded / ${option.torpedo.stored} reserve`;
                    if (option.torpedo.summary) {
                        summary += ` | ${option.torpedo.summary}`;
                    }
                    torpedoes.textContent = summary;
                } else {
                    torpedoes.textContent = `Torpedoes: ${option.torpedo.summary || 'None'}`;
                }
            } else {
                torpedoes.textContent = 'Torpedoes: None';
            }
        }
        if (special) {
            if (option.special) {
                special.textContent = `Special: ${option.special}`;
                special.style.display = '';
            } else {
                special.textContent = '';
                special.style.display = 'none';
            }
        }
    }

    highlightShipSelectionPanel() {
        const panel = document.getElementById('ship-selection-panel');
        if (!panel) return;
        panel.classList.add('highlight');
        if (this.shipSelectionHighlightTimeout) {
            clearTimeout(this.shipSelectionHighlightTimeout);
        }
        this.shipSelectionHighlightTimeout = setTimeout(() => {
            panel.classList.remove('highlight');
        }, 800);
    }
    startNewGame() {
        // Initialize audio on first interaction (required by browsers)
        this.audioManager.initialize();

        // Clear entities
        this.entities = [];
        this.enemyShips = [];
        this.environmentalHazards = [];
        this.projectiles = [];

        // Clear particle system
        this.particleSystem.clear();

        const selectedOption = this.findPlayerShipOptionById(this.playerShipSelectionId) || this.playerShipOptions[0];
        this.applyPlayerShipOption(selectedOption, { skipSave: false, skipUI: true });

        // Create player ship based on selection
        this.playerShip = new Ship({
            x: 0,
            y: 0,
            shipClass: selectedOption.shipClass,
            faction: selectedOption.faction,
            name: selectedOption.name,
            isPlayer: true,
            physicsWorld: this.physicsWorld
        });

        this.entities.push(this.playerShip);

        // Start game loop
        this.stateManager.setState('PLAYING');
        if (!this.gameLoop.running) {
            this.gameLoop.start();
        }

        // Load first mission
        this.loadMission('mission-01');
    }
    spawnTestAsteroids() {
        // Spawn a few test asteroids around the player
        const asteroidConfigs = [
            { x: 300, y: 200, size: 'large' },
            { x: -400, y: -150, size: 'large' },
            { x: 500, y: -300, size: 'medium' },
            { x: -200, y: 400, size: 'medium' },
            { x: 150, y: -250, size: 'small' },
            { x: -350, y: 150, size: 'small' }
        ];

        for (const config of asteroidConfigs) {
            const asteroid = new Asteroid(config.x, config.y, config.size, this.physicsWorld);
            this.entities.push(asteroid);
        }
    }

    spawnTestEnvironment() {
        // Spawn a collapsar (black hole)
        const collapsar = new EnvironmentalHazard(600, -400, 'collapsar', { radius: 30 });
        this.entities.push(collapsar);
        this.environmentalHazards.push(collapsar);

        // Spawn a dust cloud
        const dustCloud = new EnvironmentalHazard(-500, 300, 'dust', { radius: 120 });
        this.entities.push(dustCloud);
        this.environmentalHazards.push(dustCloud);

        // Spawn a planet
        const planet = new EnvironmentalHazard(800, 600, 'planet', { radius: 180, color: '#4488cc' });
        this.entities.push(planet);
        this.environmentalHazards.push(planet);
    }

    spawnTestEnemies() {
        // Spawn test enemy ships
        const enemyConfigs = [
            { x: -400, y: -300, shipClass: 'CL', faction: 'TRIGON', name: 'IKS Kahless' },
            { x: 500, y: 400, shipClass: 'CA', faction: 'SCINTILIAN', name: 'IRW Valdore' },
            { x: -600, y: 500, shipClass: 'FG', faction: 'PIRATE', name: 'ITS Raider' }
        ];

        for (const config of enemyConfigs) {
            const enemyShip = new Ship({
                x: config.x,
                y: config.y,
                shipClass: config.shipClass,
                faction: config.faction,
                name: config.name,
                isPlayer: false,
                physicsWorld: this.physicsWorld
            });

            // Create AI controller for enemy ship
            enemyShip.aiController = new AIController(enemyShip);

            this.entities.push(enemyShip);
            this.enemyShips.push(enemyShip);
        }
    }

    update(deltaTime) {
        if (!this.stateManager.isPlaying()) return;

        // Update camera to follow player
        if (this.playerShip) {
            this.camera.follow(this.playerShip.x, this.playerShip.y);
        }

        // Handle input for player ship
        if (this.playerShip && !this.warpingOut) {
            this.handlePlayerInput(deltaTime);
        }

        // Update warp sequence
        this.updateWarpSequence(deltaTime);

        // Update targeting system (disable during warp)
        if (!this.warpingOut) {
            const mousePos = this.inputManager.getMousePosition();
            this.targetingSystem.update(mousePos.x, mousePos.y, this.entities, this.camera, deltaTime);
        }

        // Handle continuous beam firing
        if (this.beamFiring && this.playerShip && !this.warpingOut) {
            const mousePos = this.inputManager.getMousePosition();
            const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);
            const currentTime = performance.now() / 1000;

            // DEBUG: Weapon alignment - logs only when DEBUG_MODE is true
            if (CONFIG.DEBUG_MODE) {
                console.log('=== WEAPON FIRE DEBUG ===');
                console.log('Mouse (screen):', `x=${mousePos.x.toFixed(1)}, y=${mousePos.y.toFixed(1)}`);
                console.log('Target (world):', `x=${worldPos.x.toFixed(1)}, y=${worldPos.y.toFixed(1)}`);
                console.log('Ship (world):', `x=${this.playerShip.x.toFixed(1)}, y=${this.playerShip.y.toFixed(1)}, rotation=${this.playerShip.rotation.toFixed(1)}ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°`);
                console.log('Camera:', `x=${this.camera.x.toFixed(1)}, y=${this.camera.y.toFixed(1)}, zoom=${this.camera.zoom.toFixed(2)}`);
            }

            const projectiles = this.playerShip.fireBeams(worldPos.x, worldPos.y, currentTime);
            if (projectiles && projectiles.length > 0) {
                this.projectiles.push(...projectiles);
                this.entities.push(...projectiles);

                // DEBUG: Log beam endpoints
                if (CONFIG.DEBUG_MODE && projectiles.length > 0) {
                    projectiles.forEach((p, i) => {
                        console.log(`Beam ${i}:`, {
                            firing: `(${p.firingPointX.toFixed(1)}, ${p.firingPointY.toFixed(1)})`,
                            end: `(${p.endX.toFixed(1)}, ${p.endY.toFixed(1)})`,
                            target: `(${p.targetX.toFixed(1)}, ${p.targetY.toFixed(1)})`
                        });
                    });
                }

                // Only play sound for first beam fired per frame to avoid audio spam
                if (projectiles.length > 0) {
                    this.audioManager.playSound('beam-fire');
                }
            }
        }

        // Handle disruptor burst shots (for player and AI)
        for (const entity of this.entities) {
            if (entity.type === 'ship' && entity.active) {
                // Get target (player targets mouse, AI targets their current target)
                let targetX, targetY;
                if (entity.isPlayer) {
                    const mousePos = this.inputManager.getMousePosition();
                    const worldPos = this.camera.screenToWorld(mousePos.x, mousePos.y);
                    targetX = worldPos.x;
                    targetY = worldPos.y;
                } else if (entity.target) {
                    targetX = entity.target.x;
                    targetY = entity.target.y;
                } else {
                    continue; // No target, skip
                }

                const burstShots = entity.getDisruptorBurstShots(targetX, targetY);
                if (burstShots && burstShots.length > 0) {
                    this.projectiles.push(...burstShots);
                    this.entities.push(...burstShots);
                    if (entity.isPlayer) {
                        this.audioManager.playSound('disruptor-fire');
                    }
                }
            }
        }

        // Handle plasma charge accumulation
        if (this.torpedoCharging && this.playerShip && !this.warpingOut) {
            const currentTime = performance.now() / 1000;
            const chargeTime = currentTime - this.plasmaChargeStart;

            // Get charge rate based on ship class
            let chargeRate = CONFIG.PLASMA_CHARGE_RATE_CA; // Default
            if (this.playerShip.shipClass === 'FG') chargeRate = CONFIG.PLASMA_CHARGE_RATE_FG;
            else if (this.playerShip.shipClass === 'CL') chargeRate = CONFIG.PLASMA_CHARGE_RATE_CL;
            else if (this.playerShip.shipClass === 'BC') chargeRate = CONFIG.PLASMA_CHARGE_RATE_BC;

            // Calculate damage: damage/second * time, max 5 seconds
            const cappedTime = Math.min(chargeTime, CONFIG.PLASMA_MAX_CHARGE_TIME);
            this.plasmaChargeDamage = chargeRate * cappedTime;
        }

        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime);
            }
        }

        // Create engine trails for moving ships (throttled for performance)
        this.trailFrameCounter++;
        if (this.trailFrameCounter >= 3) { // Only create trails every 3rd frame
            this.trailFrameCounter = 0;
            for (const entity of this.entities) {
                if (entity.type === 'ship' && entity.active) {
                    const speed = MathUtils.magnitude(entity.vx || 0, entity.vy || 0);
                    if (speed > 20) { // Only create trails when moving above threshold
                        const trailIntensity = Math.min(speed / 100, 1.0);
                        // Calculate trail position at rear of ship
                        const shipSize = entity.getShipSize ? entity.getShipSize() : 40;
                        const rearOffset = shipSize * 0.6;
                        const rearAngle = entity.rotation + Math.PI;
                        const trailX = entity.x + Math.cos(rearAngle) * rearOffset;
                        const trailY = entity.y + Math.sin(rearAngle) * rearOffset;

                        // Faction-specific trail colors
                        let trailColor = '#4488ff'; // Default blue
                        if (entity.faction === 'TRIGON') trailColor = '#ff4444';
                        if (entity.faction === 'SCINTILIAN') trailColor = '#00ff88';
                        if (entity.faction === 'PIRATE') trailColor = '#ff8800';

                        this.particleSystem.createEngineTrail(trailX, trailY, rearAngle, {
                            color: trailColor,
                            size: 0.8,
                            intensity: trailIntensity
                        });
                    }
                }
            }
        }

        // Update AI controllers
        const currentTime = performance.now() / 1000;
        for (const enemyShip of this.enemyShips) {
            if (enemyShip.aiController && enemyShip.active) {
                enemyShip.aiController.update(deltaTime, currentTime, this.playerShip, this.entities);
            }
        }

        // Update mission system
        if (this.missionManager.missionActive) {
            const gameState = {
                playerShip: this.playerShip,
                entities: this.entities,
                enemiesDestroyed: this.missionManager.enemiesDestroyed
            };
            this.missionManager.update(deltaTime, gameState);
        }

        // Handle projectile collisions
        this.handleProjectileCollisions();

        // Handle decoy confusion
        this.handleDecoyConfusion();

        // Handle mine triggers
        this.handleMineTriggers();

        // Apply gravity from collapsars
        for (const hazard of this.environmentalHazards) {
            if (hazard.type === 'collapsar' && hazard.applyGravity) {
                hazard.applyGravity(this.entities, deltaTime);
            }
        }

        // Step physics simulation
        this.physicsWorld.step(deltaTime);

        // Handle asteroid breaking
        this.handleAsteroidBreaking();

        // Clean up inactive shuttles
        if (this.playerShip) {
            this.playerShip.cleanupShuttles();
        }

        // Remove destroyed entities
        this.cleanupEntities();

        // Update particle system
        this.particleSystem.update(deltaTime);

        // Update HUD
        this.hud.update(this.playerShip, this.entities);

        // Update mission objectives in HUD
        if (this.missionManager.missionActive) {
            this.hud.updateObjectives(this.missionManager.objectives);
        } else {
            this.hud.hideObjectives();
        }
    }

    handleProjectileCollisions() {
        for (const projectile of this.projectiles) {
            if (!projectile.active) continue;

            // Check collision with ships and asteroids
            for (const entity of this.entities) {
                if (!entity.active) continue;
                if (entity === projectile.sourceShip) continue; // Don't hit source
                if (entity.type === 'projectile') continue; // Don't hit other projectiles
                if (projectile.hasHit(entity)) continue; // Already hit this entity

                // Check if projectile is close to entity
                const distance = MathUtils.distance(projectile.x, projectile.y, entity.x, entity.y);
                const hitRadius = entity.radius || entity.getShipSize?.() || 20;

                if (distance <= hitRadius) {
                    // Hit!
                    if (projectile.projectileType === 'beam' || projectile.projectileType === 'disruptor') {
                        // Beam/Disruptor hit
                        if (entity.takeDamage) {
                            entity.takeDamage(projectile.damage, { x: projectile.x, y: projectile.y });
                        }
                        // Impact effect
                        const impactAngle = Math.atan2(projectile.vy, projectile.vx);
                        const color = projectile.projectileType === 'beam' ? '#00aaff' : '#ff00ff';
                        this.particleSystem.createImpact(projectile.x, projectile.y, impactAngle, {
                            color: color,
                            size: 0.8
                        });
                        this.audioManager.playSound('beam-hit');
                        projectile.destroy();
                    } else if (projectile.projectileType === 'torpedo') {
                        // Torpedo hit - use blast radius damage system
                        const impactAngle = MathUtils.angleBetween(entity.x, entity.y, projectile.x, projectile.y);

                        if (entity.type === 'ship' && entity.systems) {
                            // Convert contact point to ship-relative coordinates
                            const dx = projectile.x - entity.x;
                            const dy = projectile.y - entity.y;
                            const rad = MathUtils.toRadians(-entity.rotation);
                            const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
                            const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

                            // Check if shields are down for this impact facing
                            const shieldsDown = entity.areShieldsDown && entity.areShieldsDown(impactAngle, entity.rotation);

                            if (shieldsDown) {
                                // Shields down - apply blast damage to system boxes
                                const damagedSystems = entity.systems.applyBlastDamageToSystems(
                                    localX, localY,
                                    CONFIG.TORPEDO_BLAST_RADIUS_PIXELS,
                                    entity.faction,
                                    entity.shipClass
                                );

                                // Emit events for player ship
                                if (entity.isPlayer) {
                                    for (const damageInfo of damagedSystems) {
                                        eventBus.emit('system-damage', {
                                            system: damageInfo.system.name,
                                            damage: damageInfo.damage,
                                            hp: damageInfo.system.hp,
                                            maxHp: damageInfo.system.maxHp
                                        });
                                    }
                                }
                            } else {
                                // Shields up - normal damage to shields/hull
                                if (entity.takeDamage) {
                                    entity.takeDamage(projectile.damage, { x: projectile.x, y: projectile.y });
                                }
                            }
                        } else {
                            // Not a ship or no systems - normal damage
                            if (entity.takeDamage) {
                                entity.takeDamage(projectile.damage, { x: projectile.x, y: projectile.y });
                            }
                        }

                        // Torpedo explosion
                        this.particleSystem.createExplosion(projectile.x, projectile.y, {
                            particleCount: 25,
                            size: 1.0,
                            color: '#ff6600',
                            speed: 120
                        });
                        this.audioManager.playSound('torpedo-explosion');

                        // Break asteroid if hit
                        if (entity.type === 'asteroid') {
                            entity.shouldBreak = true;
                            entity.breakPosition = { x: entity.x, y: entity.y };
                        }

                        projectile.destroy();
                    } else if (projectile.projectileType === 'plasma') {
                        // Plasma torpedo hit - apply full DP to shields, then blast to hull
                        if (entity.takeDamage) {
                            // Apply full DP as direct damage (shields absorb first)
                            entity.takeDamage(projectile.damagePotential, { x: projectile.x, y: projectile.y });
                        }

                        // Large plasma explosion
                        this.particleSystem.createExplosion(projectile.x, projectile.y, {
                            particleCount: 40,
                            size: 1.5,
                            color: '#00ff88',
                            speed: 150
                        });
                        this.audioManager.playSound('plasma-explosion');

                        // Apply blast damage to all entities in radius
                        const entitiesInBlast = projectile.getEntitiesInBlast(this.entities, entity);
                        for (const blastEntity of entitiesInBlast) {
                            if (blastEntity !== entity && blastEntity.takeDamage) {
                                // Blast damage applies to hull (bypasses shields)
                                const blastDamage = projectile.damagePotential * 0.5; // 50% to blast area
                                blastEntity.takeDamage(blastDamage, { x: projectile.x, y: projectile.y });
                            }
                        }

                        // Break asteroid if hit
                        if (entity.type === 'asteroid') {
                            entity.shouldBreak = true;
                            entity.breakPosition = { x: entity.x, y: entity.y };
                        }

                        projectile.destroy();
                    }

                    projectile.markAsHit(entity);
                }
            }
        }
    }

    handleDecoyConfusion() {
        const decoys = this.entities.filter(e => e.active && e.type === 'decoy');
        const torpedoes = this.projectiles.filter(p => p.active && p.projectileType === 'torpedo');

        for (const decoy of decoys) {
            for (const torpedo of torpedoes) {
                if (decoy.tryConfuseTorpedo(torpedo)) {
                    // Torpedo confused
                    eventBus.emit('torpedo-confused', { torpedo, decoy });
                }
            }
        }
    }

    handleMineTriggers() {
        const mines = this.entities.filter(e => e.active && e.type === 'mine');

        for (const mine of mines) {
            for (const entity of this.entities) {
                if (!entity.active) continue;
                if (entity.type !== 'ship') continue;

                if (mine.checkTrigger(entity)) {
                    mine.detonate(entity);
                }
            }
        }
    }

    handleAsteroidBreaking() {
        const newAsteroids = [];

        for (const entity of this.entities) {
            if (entity.type === 'asteroid' && entity.shouldBreak) {
                const fragments = entity.break();
                newAsteroids.push(...fragments);
            }
        }

        // Add new asteroid fragments
        this.entities.push(...newAsteroids);
    }

    cleanupEntities() {
        this.entities = this.entities.filter(e => e.active);
        this.enemyShips = this.enemyShips.filter(e => e.active);
        this.environmentalHazards = this.environmentalHazards.filter(e => e.active);
        this.projectiles = this.projectiles.filter(p => p.active);
    }

    handlePlayerInput(deltaTime) {
        const ship = this.playerShip;

        // Movement (WASD)
        const wPressed = this.inputManager.isKeyDown('w');
        const sPressed = this.inputManager.isKeyDown('s');

        if (wPressed) {
            ship.thrust(1, deltaTime);
        } else if (sPressed) {
            ship.thrust(-1, deltaTime);
        } else {
            // No thrust input - apply natural deceleration
            ship.applyDeceleration(deltaTime);
        }

        const aPressed = this.inputManager.isKeyDown('a');
        const dPressed = this.inputManager.isKeyDown('d');

        if (aPressed) {
            ship.turn(-1, deltaTime);
        } else if (dPressed) {
            ship.turn(1, deltaTime);
        } else {
            // Stop rotation when no turn input
            ship.stopRotation();
        }
    }

    initiateWarp() {
        if (!this.playerShip || !this.playerShip.systems || !this.playerShip.systems.warp) return;

        // Check if warp is ready
        if (!this.playerShip.systems.warp.canWarp()) {
            console.log('Warp drive not fully charged');
            return;
        }

        // Start warp sequence
        this.warpingOut = true;
        this.warpSequenceTime = 0;
        this.playerShip.systems.warp.initiateWarp();

        console.log('Warp sequence initiated');
    }

    updateWarpSequence(deltaTime) {
        if (!this.warpingOut) return;

        this.warpSequenceTime += deltaTime;
        const progress = this.warpSequenceTime / this.warpSequenceDuration;

        if (this.playerShip) {
            // Accelerate ship upward (in screen space, this is negative Y in world space)
            const warpAcceleration = 500 * progress;
            this.playerShip.y -= warpAcceleration * deltaTime;
        }

        // End sequence after duration
        if (this.warpSequenceTime >= this.warpSequenceDuration) {
            this.completeWarpSequence();
        }
    }

    completeWarpSequence() {
        this.warpingOut = false;
        this.warpSequenceTime = 0;

        // Show debriefing/end scenario screen
        if (this.missionManager && this.missionManager.currentMission) {
            this.missionManager.completeMission(true); // Success
            this.missionUI.showDebriefing(this.missionManager.getMissionStats());
        }
    }

    render(deltaTime) {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.stateManager.isPlaying() && !this.stateManager.isPaused()) {
            return; // Don't render game when in menu
        }

        // Apply screen shake
        const shake = this.particleSystem.getScreenShake();
        this.ctx.save();
        this.ctx.translate(shake.x, shake.y);

        // Calculate warp progress
        const warpProgress = this.warpingOut ? (this.warpSequenceTime / this.warpSequenceDuration) : 0;

        // Render game world
        this.renderer.render(this.entities, warpProgress);

        // Render particle effects
        this.particleSystem.render(this.ctx, this.camera);

        this.ctx.restore();

        // Render waypoint arrows (after screen shake is removed)
        if (this.missionManager.missionActive && this.playerShip) {
            this.renderer.uiRenderer.renderWaypointArrows(
                this.playerShip,
                this.missionManager.objectives,
                this.camera,
                this.ctx
            );
        }

        // Debug info
        if (CONFIG.DEBUG_MODE) {
            this.renderDebugInfo();
        }
    }

    renderDebugInfo() {
        this.ctx.save();
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.gameLoop.getFPS()}`, 10, 20);
        this.ctx.fillText(`Entities: ${this.entities.length}`, 10, 35);
        if (this.playerShip) {
            this.ctx.fillText(`Player: (${Math.round(this.playerShip.x)}, ${Math.round(this.playerShip.y)})`, 10, 50);
            this.ctx.fillText(`Rotation: ${Math.round(this.playerShip.rotation)}ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°`, 10, 65);
            this.ctx.fillText(`Velocity: ${Math.round(MathUtils.magnitude(this.playerShip.vx, this.playerShip.vy))}`, 10, 80);
            this.ctx.fillText(`Mode: ${this.playerShip.movementMode}`, 10, 95);
        }
        this.ctx.restore();
    }

    /**
     * Load mission and show briefing
     * @param {string} missionId - Mission ID (e.g., 'mission-01')
     */
    loadMission(missionId) {
        const mission = MISSIONS[missionId];
        if (!mission) {
            console.error(`Mission ${missionId} not found`);
            return;
        }

        // Show mission briefing
        this.missionUI.showBriefing(mission);
    }

    /**
     * Start mission after briefing accepted
     * @param {string} missionId - Mission ID (e.g., 'mission-01')
     */
    startMission(missionId) {
        // Start mission in MissionManager
        const success = this.missionManager.startMission(missionId);
        if (!success) {
            console.error(`Failed to start mission ${missionId}`);
            return;
        }

        // Apply upgrades to player ship
        if (this.playerShip && this.progressionManager) {
            this.progressionManager.applyUpgradesToShip(this.playerShip);
        }

        // Clear existing entities (except player)
        this.entities = this.entities.filter(e => e.isPlayer);
        this.enemyShips = [];
        this.environmentalHazards = [];
        this.projectiles = [];

        // Spawn mission entities
        const mission = MISSIONS[missionId];
        if (mission.enemies) {
            this.spawnMissionEnemies(mission.enemies);
        }
        if (mission.entities) {
            this.spawnMissionEntities(mission.entities);
        }

        // Show objectives panel
        this.hud.showObjectives();
        this.hud.addCriticalMessage(`Mission Started: ${mission.title}`);
    }

    /**
     * Spawn enemy ships for mission
     * @param {Array} enemyConfigs - Array of enemy configurations
     */
    spawnMissionEnemies(enemyConfigs) {
        for (const config of enemyConfigs) {
            const enemyShip = new Ship({
                x: config.position.x,
                y: config.position.y,
                shipClass: config.class,
                faction: config.faction,
                isPlayer: false,
                physicsWorld: this.physicsWorld
            });

            // Set cloak state if specified
            if (config.cloaked && enemyShip.systems?.cloak) {
                enemyShip.systems.cloak.activate();
            }

            // Create AI controller for enemy ship
            enemyShip.aiController = new AIController(enemyShip);

            this.entities.push(enemyShip);
            this.enemyShips.push(enemyShip);
        }
    }

    /**
     * Spawn mission entities (stations, transports, etc.)
     * @param {Array} entityConfigs - Array of entity configurations
     */
    spawnMissionEntities(entityConfigs) {
        for (const config of entityConfigs) {
            let entity = null;

            switch (config.type) {
                case 'civilian-transport':
                    entity = new CivilianTransport({
                        id: config.id,
                        x: config.position.x,
                        y: config.position.y,
                        hp: config.hp,
                        name: config.name
                    });
                    break;

                case 'space-station':
                    entity = new SpaceStation({
                        id: config.id,
                        x: config.position.x,
                        y: config.position.y,
                        hp: config.hp,
                        radius: config.radius,
                        faction: config.faction,
                        hostile: config.hostile,
                        name: config.name
                    });
                    break;

                case 'derelict':
                    entity = new Derelict({
                        id: config.id,
                        x: config.position.x,
                        y: config.position.y,
                        hp: config.hp,
                        radius: config.radius,
                        name: config.name
                    });
                    break;

                default:
                    console.warn(`Unknown entity type: ${config.type}`);
                    break;
            }

            if (entity) {
                this.entities.push(entity);
            }
        }
    }

    /**
     * Save current game state
     */
    saveCurrentGame() {
        const gameState = {
            playerShip: this.playerShip,
            missionManager: this.missionManager,
            entities: this.entities
        };

        if (this.saveManager.saveGame(gameState)) {
            this.hud.addCriticalMessage('Game saved successfully');
        } else {
            this.hud.addCriticalMessage('ERROR: Failed to save game');
        }
    }

    /**
     * Load saved game
     */
    loadSavedGame() {
        const saveData = this.saveManager.loadGame();
        if (!saveData) {
            alert('No saved game found.');
            return;
        }

        // Clear current state
        this.entities = [];
        this.enemyShips = [];
        this.environmentalHazards = [];
        this.projectiles = [];

        const savedPlayer = saveData.player || {};
        const savedOption = this.findPlayerShipOptionByShip(savedPlayer.faction, savedPlayer.shipClass);
        const fallbackOption = this.findPlayerShipOptionById(this.playerShipSelectionId) || this.playerShipOptions[0];
        const selectedOption = savedOption || fallbackOption;
        this.applyPlayerShipOption(selectedOption, { skipSave: !savedOption, skipUI: false });

        this.playerShip = new Ship({
            x: savedPlayer.x || 0,
            y: savedPlayer.y || 0,
            shipClass: savedPlayer.shipClass || selectedOption.shipClass,
            faction: savedPlayer.faction || selectedOption.faction,
            name: savedPlayer.name || selectedOption.name,
            isPlayer: true,
            physicsWorld: this.physicsWorld
        });

        this.entities.push(this.playerShip);

        const gameState = {
            playerShip: this.playerShip,
            missionManager: this.missionManager,
            entities: this.entities
        };
        this.saveManager.restoreGameState(saveData, gameState);

        // Start game
        this.stateManager.setState('PLAYING');
        if (!this.gameLoop.running) {
            this.gameLoop.start();
        }

        // Load the saved mission
        if (saveData.campaign?.currentMissionId) {
            this.loadMission(saveData.campaign.currentMissionId);
        }

        this.hud.addCriticalMessage('Game loaded successfully');
    }

    /**
     * Find nearest targetable ship to reticle position (for plasma auto-homing)
     */
    findNearestTargetToReticle(reticleX, reticleY) {
        let nearestTarget = null;
        let nearestDistance = Infinity;

        for (const entity of this.entities) {
            if (!entity.active) continue;
            if (entity.type !== 'ship') continue;
            if (entity === this.playerShip) continue; // Don't target self
            if (entity.isCloaked && entity.isCloaked()) continue; // Skip cloaked ships

            const distance = MathUtils.distance(reticleX, reticleY, entity.x, entity.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestTarget = entity;
            }
        }

        return nearestTarget;
    }

    start() {
        this.gameLoop.start();
    }
}









