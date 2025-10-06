/**
 * Star Sea - Mission Data
 * Campaign missions with objectives, briefings, and victory conditions
 */

const MISSIONS = {
    // =====================================================================
    // MISSION 1: PATROL DUTY
    // Tutorial mission - Basic combat and controls
    // =====================================================================
    'mission-01': {
        id: 'mission-01',
        title: 'Patrol Duty',
        sector: 'Alpha Centauri Sector',

        briefing: {
            title: 'Routine Patrol',
            text: `Captain, your orders are simple: conduct a routine patrol of the Alpha Centauri border region.

Intelligence suggests pirate activity in this sector, but nothing our newest heavy cruiser can't handle. Consider this a shakedown cruise for the USS Enterprise.

Your objectives:
• Patrol the designated coordinates
• Engage any hostile contacts
• Return to base

This should be straightforward, Captain. Show us what the Enterprise can do.`,
            officer: 'Admiral Chen - Starfleet Command'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Reach patrol coordinates',
                primary: true,
                x: 2000,
                y: 0,
                radius: 500
            },
            {
                id: 'obj-02',
                type: 'destroy',
                description: 'Destroy all pirate vessels',
                primary: true,
                target: 3,
                faction: 'PIRATE'
            },
            {
                id: 'obj-03',
                type: 'survive',
                description: 'Survive for 60 seconds (Optional)',
                primary: false,
                target: 60
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            // Player death is always a defeat condition (handled by MissionManager)
        ],

        enemies: [
            { faction: 'PIRATE', class: 'FG', position: { x: 2500, y: -500 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 2500, y: 500 } },
            { faction: 'PIRATE', class: 'CL', position: { x: 3000, y: 0 } } // Squadron leader
        ],

        debriefing: {
            victory: `Excellent work, Captain. The pirate threat has been neutralized and the sector is secure.

Your performance in this engagement has been noted. The Enterprise performed admirably - all systems operating within expected parameters.

Starfleet Command has new orders for you. Report to briefing room when ready.`,
            defeat: `Mission failed. The Enterprise has been lost.

Analysis of the engagement suggests tactical errors. Review combat logs and prepare for reassignment.`
        },

        nextMission: 'mission-02'
    },

    // =====================================================================
    // MISSION 2: DISTRESS CALL
    // Protect objective - defend civilian transport
    // =====================================================================
    'mission-02': {
        id: 'mission-02',
        title: 'Distress Call',
        sector: 'Beta Hydri Sector',

        briefing: {
            title: 'Emergency Response',
            text: `Captain, we've received a distress call from the civilian transport SS Meridian. They're under attack by Trigon raiders in the Beta Hydri sector.

The Meridian is carrying 2,000 colonists and has minimal defensive capabilities. Your orders are to reach their position and defend them until they can escape to warp.

Intelligence reports indicate this is a Trigon destroyer supported by fighters. The Trigon Empire has been increasingly aggressive along our borders.

Time is critical, Captain. Those colonists are counting on you.`,
            officer: 'Commander Sarah Chen - Operations'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Reach the SS Meridian',
                primary: true,
                x: 3000,
                y: 1000,
                radius: 800
            },
            {
                id: 'obj-02',
                type: 'protect',
                description: 'Protect SS Meridian',
                primary: true,
                targetId: 'transport-meridian'
            },
            {
                id: 'obj-03',
                type: 'destroy',
                description: 'Destroy all Trigon vessels',
                primary: true,
                target: 2,
                faction: 'TRIGON'
            },
            {
                id: 'obj-04',
                type: 'destroy',
                description: 'Zero casualties (Optional)',
                primary: false,
                target: 0,
                description: 'Complete mission without Meridian taking damage'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            // Transport destroyed will fail protect objective
        ],

        entities: [
            {
                id: 'transport-meridian',
                type: 'civilian-transport',
                position: { x: 3000, y: 1000 },
                hp: 50,
                faction: 'NEUTRAL'
            }
        ],

        enemies: [
            { faction: 'TRIGON', class: 'DD', position: { x: 3500, y: 1200 } },
            { faction: 'TRIGON', class: 'FG', position: { x: 3200, y: 800 } }
        ],

        debriefing: {
            victory: `Outstanding work, Captain. The SS Meridian and all 2,000 colonists are safe.

The Trigon Empire has lodged a formal protest, claiming the attack was justified retaliation for border violations. Starfleet Command is investigating, but tensions are rising.

This may be the beginning of something larger, Captain. Stay alert.`,
            defeat: `Mission failed. The SS Meridian has been destroyed with all hands.

2,000 civilian casualties. This is unacceptable. A full inquiry will be conducted.`
        },

        nextMission: 'mission-03'
    },

    // =====================================================================
    // MISSION 3: RECONNAISSANCE
    // Scan objective - gather intelligence without engagement
    // =====================================================================
    'mission-03': {
        id: 'mission-03',
        title: 'Silent Running',
        sector: 'Trigon Border Zone',

        briefing: {
            title: 'Intelligence Gathering',
            text: `Captain, after the Meridian incident, Starfleet Command needs intelligence on Trigon military movements.

Your mission is to infiltrate the Trigon border zone and scan their military installation at coordinates Gamma-7. We need detailed sensor readings of their defensive capabilities.

This is a reconnaissance mission, Captain. Avoid engagement if possible. The Trigon will consider your presence an act of war - if they detect you.

Use stealth and precision. Get in, scan the target, and get out. No heroics.`,
            officer: 'Admiral Marcus - Starfleet Intelligence'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Enter Trigon border zone',
                primary: true,
                x: 4000,
                y: -1500,
                radius: 1000
            },
            {
                id: 'obj-02',
                type: 'scan',
                description: 'Scan Trigon installation',
                primary: true,
                targetId: 'trigon-base',
                scanRange: 300,
                target: 10 // 10 seconds of scanning
            },
            {
                id: 'obj-03',
                type: 'reach',
                description: 'Return to Federation space',
                primary: true,
                x: 0,
                y: 0,
                radius: 500
            },
            {
                id: 'obj-04',
                type: 'destroy',
                description: 'Complete without destroying enemies (Optional)',
                primary: false,
                target: 0,
                description: 'Ghost mission - no enemy casualties'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            { type: 'time', value: 600 } // 10 minute time limit
        ],

        entities: [
            {
                id: 'trigon-base',
                type: 'space-station',
                position: { x: 4000, y: -1500 },
                hp: 200,
                faction: 'TRIGON',
                hostile: false // Doesn't attack unless provoked
            }
        ],

        enemies: [
            { faction: 'TRIGON', class: 'FG', position: { x: 3800, y: -1800 }, patrol: true },
            { faction: 'TRIGON', class: 'FG', position: { x: 4200, y: -1200 }, patrol: true },
            { faction: 'TRIGON', class: 'DD', position: { x: 4000, y: -2000 }, patrol: true }
        ],

        debriefing: {
            victory: `Excellent work, Captain. Your sensor data confirms our worst fears - the Trigon are amassing a significant fleet along the border.

The installation you scanned is one of twelve similar bases. They're preparing for something big.

The Federation Council is meeting in emergency session. War may be inevitable.`,
            defeat: `Mission failed. You either failed to gather the intelligence or were detected and destroyed.

Without this data, the Federation is blind to Trigon intentions. This is a critical intelligence failure.`
        },

        nextMission: 'mission-04'
    },

    // =====================================================================
    // MISSION 4: FIRST CONTACT
    // Multiple objectives - first encounter with Scintilians
    // =====================================================================
    'mission-04': {
        id: 'mission-04',
        title: 'First Contact',
        sector: 'Romulan Neutral Zone',

        briefing: {
            title: 'Unknown Contact',
            text: `Captain, long-range sensors have detected an unknown vessel near the Romulan Neutral Zone. The signature doesn't match any known configuration.

The Federation Council has authorized a first contact protocol. Your mission is to:
1. Approach and hail the unknown vessel
2. Establish peaceful communication if possible
3. Defend yourself if attacked

Intelligence suggests this may be the first encounter with the Scintilian Empire - a powerful civilization that has remained neutral in galactic affairs. How you handle this contact could determine the fate of the Federation.

Proceed with caution and diplomacy, Captain.`,
            officer: 'Ambassador T\'Pral - Federation Diplomatic Corps'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Approach unknown vessel',
                primary: true,
                x: 2000,
                y: 2000,
                radius: 600
            },
            {
                id: 'obj-02',
                type: 'scan',
                description: 'Scan unknown vessel',
                primary: true,
                targetId: 'scintilian-warbird',
                scanRange: 400,
                target: 5
            },
            {
                id: 'obj-03',
                type: 'survive',
                description: 'Survive Scintilian attack',
                primary: true,
                target: 120 // 2 minutes
            },
            {
                id: 'obj-04',
                type: 'destroy',
                description: 'Disable Scintilian vessel (Optional)',
                primary: false,
                target: 1,
                faction: 'SCINTILIAN',
                description: 'Reduce to 25% hull without destroying'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            { type: 'damage', value: 20 } // Fail if hull below 20%
        ],

        entities: [
            {
                id: 'scintilian-warbird',
                type: 'ship',
                faction: 'SCINTILIAN',
                class: 'CA',
                position: { x: 2000, y: 2000 },
                aggressive: true,
                hasCloak: true
            }
        ],

        enemies: [
            // Scintilian warbird from entities array
            // Additional enemies spawn if player is too aggressive
        ],

        debriefing: {
            victory: `Remarkable, Captain. You've survived first contact with the Scintilian Empire - and that warbird was just a scout vessel.

Analysis of your sensor data reveals sophisticated cloaking technology and plasma weapons far beyond our current capabilities. The Scintilians are formidable.

More concerning: the warbird transmitted your position before retreating. The Scintilians now know we've discovered them.

This changes everything.`,
            defeat: `Mission failed. The Scintilian vessel has either destroyed you or inflicted critical damage.

First contact protocols have failed. The Scintilian Empire now views the Federation as hostile.`
        },

        nextMission: 'mission-05'
    },

    // =====================================================================
    // MISSION 5: TRIANGLE OF POWER
    // Multi-faction battle - all three enemies at once
    // =====================================================================
    'mission-05': {
        id: 'mission-05',
        title: 'Triangle of Power',
        sector: 'Disputed Territory - Junction Point',

        briefing: {
            title: 'Three-Way Conflict',
            text: `Captain, intelligence has identified a critical situation developing in the Junction Point sector - a region claimed by the Trigon Empire, the Scintilian Imperium, AND infested with pirate warlords.

All three factions are converging on an ancient derelict at the sector's center. Long-range scans suggest it contains technology of immense value - possibly ancient weapons.

Your orders are to reach the derelict first, scan it, and deny it to all hostile factions. You'll be fighting on three fronts simultaneously.

This is the most dangerous mission you've faced, Captain. All three enemy factions will be present, and they'll all want you dead. The Enterprise will be tested like never before.

Expect cloaked Scintilian ambushes, Trigon disruptor fire, and pirate swarm tactics. Use every weapon and system at your disposal.

Good hunting, Captain. The Federation is counting on you.`,
            officer: 'Admiral Chen - Starfleet Command'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Reach the ancient derelict',
                primary: true,
                x: 5000,
                y: 0,
                radius: 400
            },
            {
                id: 'obj-02',
                type: 'scan',
                description: 'Scan ancient derelict',
                primary: true,
                targetId: 'ancient-derelict',
                scanRange: 300,
                target: 15
            },
            {
                id: 'obj-03',
                type: 'destroy',
                description: 'Destroy all hostile vessels',
                primary: true,
                target: 6 // 2 Trigon, 2 Scintilian, 2 Pirate
            },
            {
                id: 'obj-04',
                type: 'survive',
                description: 'Complete with 50% hull remaining (Optional)',
                primary: false,
                target: 0,
                description: 'Tactical excellence bonus'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            { type: 'time', value: 900 } // 15 minute time limit
        ],

        entities: [
            {
                id: 'ancient-derelict',
                type: 'derelict',
                position: { x: 5000, y: 0 },
                hp: 500,
                faction: 'NEUTRAL',
                hostile: false
            }
        ],

        enemies: [
            // Trigon forces
            { faction: 'TRIGON', class: 'CL', position: { x: 4500, y: 1000 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 4300, y: 1200 } },

            // Scintilian forces (start cloaked)
            { faction: 'SCINTILIAN', class: 'CA', position: { x: 5500, y: -1000 }, cloaked: true },
            { faction: 'SCINTILIAN', class: 'DD', position: { x: 5700, y: -800 }, cloaked: true },

            // Pirate forces
            { faction: 'PIRATE', class: 'FG', position: { x: 5000, y: 1500 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 5000, y: -1500 } }
        ],

        debriefing: {
            victory: `Incredible work, Captain. Against impossible odds, you've secured the ancient technology and eliminated three separate hostile fleets.

Preliminary analysis of the derelict reveals technology thousands of years old - energy weapons, shield enhancements, and propulsion systems beyond our understanding.

But there's a problem. The Trigon, Scintilians, and Pirates all know what you found. And they all want it.

This victory may have just started a war, Captain. Three wars, actually.

*NEW ORDERS RECEIVED - CAMPAIGN PHASE TWO*`,
            defeat: `Mission failed. The ancient derelict has been claimed by enemy forces.

Whatever technology it contained is now in hostile hands. The balance of power has shifted dramatically - and not in our favor.`
        },

        nextMission: 'mission-06' // Campaign continues...
    },

    // =====================================================================
    // MISSIONS 6-20: CAMPAIGN OUTLINE
    // Detailed implementations to be added in future development
    // =====================================================================

    'mission-06': {
        id: 'mission-06',
        title: 'Trigon Offensive',
        sector: 'Federation Border - Starbase 12',

        briefing: {
            title: 'Under Siege',
            text: `Captain, we have a crisis. The Trigon Empire has declared war on the Federation.

Starbase 12 is under direct assault by a Trigon battlegroup - two battlecruisers and three destroyers. The starbase shields are holding but they won't last long.

Your orders: reach Starbase 12 immediately and eliminate the Trigon threat. The starbase must survive, Captain. It's our critical supply depot for the entire sector.

If Starbase 12 falls, we lose the border. The Trigon will have a direct route into Federation core systems.

This is the beginning of a war we didn't want. Show them the Federation doesn't back down.`,
            officer: 'Admiral Chen - Starfleet Command'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Reach Starbase 12',
                primary: true,
                x: 4000,
                y: 2000,
                radius: 800
            },
            {
                id: 'obj-02',
                type: 'protect',
                description: 'Defend Starbase 12',
                primary: true,
                targetId: 'starbase-12'
            },
            {
                id: 'obj-03',
                type: 'destroy',
                description: 'Destroy Trigon battlegroup',
                primary: true,
                target: 5,
                faction: 'TRIGON'
            },
            {
                id: 'obj-04',
                type: 'survive',
                description: 'Complete mission in under 5 minutes (Optional)',
                primary: false,
                target: 300,
                description: 'Speed bonus'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            // Starbase destruction will fail protect objective
        ],

        entities: [
            {
                id: 'starbase-12',
                type: 'space-station',
                position: { x: 4000, y: 2000 },
                hp: 300,
                radius: 120,
                faction: 'PLAYER',
                name: 'Starbase 12'
            }
        ],

        enemies: [
            // Reduced from 2 BCs to 1 BC + 1 CA for better difficulty progression
            { faction: 'TRIGON', class: 'BC', position: { x: 4500, y: 2500 } },
            { faction: 'TRIGON', class: 'CA', position: { x: 4500, y: 1500 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 3500, y: 2700 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 3500, y: 1300 } }
        ],

        debriefing: {
            victory: `Outstanding work, Captain! Starbase 12 is secure and the Trigon battlegroup has been destroyed.

Your timely arrival saved hundreds of lives and prevented a strategic disaster. The starbase commander sends his personal thanks.

But this was just the opening salvo. Intelligence reports indicate the Trigon are massing even larger fleets along the border. They're not giving up.

We need to take the fight to them. Prepare for deep-space operations.`,
            defeat: `Mission failed. Starbase 12 has been destroyed.

The loss of this strategic asset is catastrophic. The Trigon now have an open path to Federation core worlds.

Emergency reinforcements are being scrambled to contain the breach.`
        },

        nextMission: 'mission-07'
    },

    'mission-07': {
        id: 'mission-07',
        title: 'Behind Enemy Lines',
        sector: 'Trigon Space - Gamma Orionis Shipyard',

        briefing: {
            title: 'Surgical Strike',
            text: `Captain, we're taking the offensive. Intelligence has located the main Trigon shipyard in the Gamma Orionis system - it's producing the battlecruisers they're using against us.

Your mission: infiltrate deep into Trigon space and destroy that shipyard. This will cripple their ability to replace losses and buy us time to reinforce our defenses.

This is a high-risk operation. You'll be alone, deep in enemy territory, with no backup. The shipyard is heavily defended by patrol squadrons.

Get in, destroy the shipyard, and get out before their fleet arrives. Time is critical - you'll have a narrow window before reinforcements arrive.

Good luck, Captain. The Federation is counting on you.`,
            officer: 'Commander Sarah Chen - Operations'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Reach Trigon shipyard',
                primary: true,
                x: 8000,
                y: -3000,
                radius: 600
            },
            {
                id: 'obj-02',
                type: 'destroy',
                description: 'Destroy shipyard',
                primary: true,
                target: 1,
                targetId: 'trigon-shipyard'
            },
            {
                id: 'obj-03',
                type: 'destroy',
                description: 'Destroy patrol ships',
                primary: true,
                target: 4,
                faction: 'TRIGON'
            },
            {
                id: 'obj-04',
                type: 'destroy',
                description: 'Zero hull damage (Optional)',
                primary: false,
                target: 0,
                description: 'Perfect run bonus'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            { type: 'time', value: 420 } // 7 minute time limit before reinforcements
        ],

        entities: [
            {
                id: 'trigon-shipyard',
                type: 'space-station',
                position: { x: 8000, y: -3000 },
                hp: 500,
                radius: 150,
                faction: 'TRIGON',
                hostile: true,
                name: 'Gamma Orionis Shipyard'
            }
        ],

        enemies: [
            { faction: 'TRIGON', class: 'CL', position: { x: 7500, y: -3300 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 8500, y: -2700 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 7400, y: -2800 } },
            { faction: 'TRIGON', class: 'FG', position: { x: 8200, y: -3400 } }
        ],

        debriefing: {
            victory: `Excellent work, Captain! The Trigon shipyard has been destroyed in spectacular fashion.

Intelligence estimates this will reduce their battlecruiser production by 60% for the next six months. You've bought us critical time.

The Trigon High Command is furious - they've put a bounty on the Enterprise. You're now the most wanted ship in the Empire.

But there's an unexpected development. The Scintilians have reached out with an offer...`,
            defeat: `Mission failed. Either you were destroyed or the time limit expired.

The shipyard remains operational and continues producing Trigon warships. The strategic situation has not improved.`
        },

        nextMission: 'mission-08'
    },

    'mission-08': {
        id: 'mission-08',
        title: 'Scintilian Gambit',
        sector: 'Neutral Zone - Theta Eridani',

        briefing: {
            title: 'Uneasy Alliance',
            text: `Captain, we have an unusual situation. The Scintilian Imperium has requested a diplomatic meeting - they propose an alliance against the Trigon.

Ambassador T'Pral believes this could be genuine. The Scintilians and Trigons have been historic rivals. An alliance would shift the balance of power dramatically.

However, this could also be a trap. Our first encounter with the Scintilians involved them attacking us unprovoked. Trust is... not easily earned.

Your orders: proceed to the neutral zone meeting coordinates and assess the Scintilian offer. Remain on high alert. If this is an ambush, defend yourself and escape.

The fate of the war may hinge on this meeting, Captain. But don't take unnecessary risks.`,
            officer: 'Ambassador T\'Pral - Diplomatic Corps'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Reach meeting coordinates',
                primary: true,
                x: 6000,
                y: 4000,
                radius: 600
            },
            {
                id: 'obj-02',
                type: 'scan',
                description: 'Scan Scintilian warbird',
                primary: true,
                targetId: 'scintilian-envoy',
                scanRange: 400,
                target: 15
            },
            {
                id: 'obj-03',
                type: 'survive',
                description: 'Survive diplomatic encounter',
                primary: true,
                target: 180
            },
            {
                id: 'obj-04',
                type: 'destroy',
                description: 'Escape without firing (Optional)',
                primary: false,
                target: 0,
                description: 'Peaceful resolution bonus'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            { type: 'damage', value: 20 } // Fail if hull drops below 20%
        ],

        entities: [
            {
                id: 'scintilian-envoy',
                type: 'ship',
                faction: 'SCINTILIAN',
                class: 'CA',
                position: { x: 6000, y: 4000 },
                hp: 120,
                hostile: false,
                name: 'IRW Diplomatic Envoy'
            }
        ],

        enemies: [
            // Ambush forces decloak after scan objective starts
            { faction: 'SCINTILIAN', class: 'DD', position: { x: 5500, y: 4500 }, cloaked: true },
            { faction: 'SCINTILIAN', class: 'DD', position: { x: 6500, y: 3500 }, cloaked: true },
            { faction: 'SCINTILIAN', class: 'FG', position: { x: 5700, y: 3700 }, cloaked: true }
        ],

        debriefing: {
            victory: `You survived, Captain. Barely. Ambassador T'Pral's analysis was correct - it was a trap.

The Scintilians used the diplomatic meeting as cover for an ambush. They wanted to eliminate you and claim the ancient technology you recovered.

However, your sensor logs of their cloaked ambush positions have proven invaluable. We now have detailed scans of Scintilian cloaking signatures.

The Scintilians have shown their hand. They're not interested in peace - they want domination. We'll have to fight them too.

But first, we need to deal with the pirate problem...`,
            defeat: `Mission failed. The Scintilian trap succeeded.

The diplomatic channel is now closed. The Scintilians have proven they cannot be trusted.`
        },

        nextMission: 'mission-09'
    },

    'mission-09': {
        id: 'mission-09',
        title: 'Pirate Haven',
        sector: 'Asteroid Belt Omega',

        briefing: {
            title: 'Clean Sweep',
            text: `Captain, while we're fighting the Trigon and Scintilians, pirates have been raiding our supply convoys. They're taking advantage of the war to hit undefended targets.

This ends now. We've tracked the pirates to Asteroid Belt Omega - a lawless region they've been using as a haven for decades.

Your mission: locate their hidden base within the asteroid field and eliminate the pirate threat. We believe they're using a hollowed-out asteroid as their headquarters.

You'll need to scan asteroids to find the base, then destroy it along with their fleet. Expect heavy resistance - these aren't amateurs.

Clean out this nest of vipers, Captain. Our supply lines depend on it.`,
            officer: 'Admiral Marcus - Strategic Operations'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Enter asteroid field',
                primary: true,
                x: 7000,
                y: 5000,
                radius: 1000
            },
            {
                id: 'obj-02',
                type: 'scan',
                description: 'Locate pirate base',
                primary: true,
                targetId: 'pirate-base',
                scanRange: 400,
                target: 20
            },
            {
                id: 'obj-03',
                type: 'destroy',
                description: 'Destroy pirate base',
                primary: true,
                target: 1,
                targetId: 'pirate-base'
            },
            {
                id: 'obj-04',
                type: 'destroy',
                description: 'Destroy all pirate vessels',
                primary: true,
                target: 8,
                faction: 'PIRATE'
            },
            {
                id: 'obj-05',
                type: 'survive',
                description: 'No asteroid collisions (Optional)',
                primary: false,
                target: 0,
                description: 'Careful navigation bonus'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [],

        entities: [
            {
                id: 'pirate-base',
                type: 'space-station',
                position: { x: 7200, y: 5300 },
                hp: 400,
                radius: 100,
                faction: 'PIRATE',
                hostile: true,
                name: 'Pirate Haven Base'
            }
        ],

        enemies: [
            { faction: 'PIRATE', class: 'CL', position: { x: 7000, y: 5500 } }, // Squadron leader
            { faction: 'PIRATE', class: 'FG', position: { x: 6800, y: 5000 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 7400, y: 4800 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 7100, y: 5200 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 7300, y: 5400 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 6900, y: 5300 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 7500, y: 5100 } },
            { faction: 'PIRATE', class: 'FG', position: { x: 7200, y: 4900 } }
        ],

        debriefing: {
            victory: `Spectacular work, Captain! The pirate haven has been destroyed and their fleet eliminated.

Our supply convoys report they're no longer being harassed. Commerce routes are reopening. The economic impact of this victory cannot be overstated.

But your sensors detected something unusual during the battle - strange energy signatures in deep space. Automated vessels of unknown origin.

Science Officer T'Lara has a troubling theory. The ancient technology you recovered may have activated something... something that's been dormant for millennia.

Prepare yourself, Captain. A new threat is emerging.`,
            defeat: `Mission failed. The pirate base remains operational.

Supply convoy raids continue. The economic strain on the Federation war effort is increasing.`
        },

        nextMission: 'mission-10'
    },

    'mission-10': {
        id: 'mission-10',
        title: 'The Vanguard',
        sector: 'Deep Space - Sector 001',

        briefing: {
            title: 'Ancient Threat',
            text: `Captain, this is Science Officer T'Lara. My analysis of the ancient derelict was correct - it was a beacon.

Automated vessels are approaching Federation space. They don't respond to hails. Their technology is thousands of years old, but still functional. And they're armed.

We're detecting a command vessel surrounded by autonomous drones. They're heading directly for Earth.

Your mission: intercept the vanguard, scan the command vessel to understand their intent, and neutralize the drone fleet. We need that data - if more are coming, we need to know what we're facing.

Captain, these vessels predate all known civilizations. Whatever activated them... we may have awakened something that was dormant for a reason.

Be careful. We don't know what they're capable of.`,
            officer: 'Science Officer T\'Lara - Xenobiology'
        },

        objectives: [
            {
                id: 'obj-01',
                type: 'reach',
                description: 'Intercept ancient vanguard',
                primary: true,
                x: 9000,
                y: -4000,
                radius: 800
            },
            {
                id: 'obj-02',
                type: 'scan',
                description: 'Scan ancient command vessel',
                primary: true,
                targetId: 'ancient-vessel',
                scanRange: 500,
                target: 15
            },
            {
                id: 'obj-03',
                type: 'destroy',
                description: 'Destroy ancient drones',
                primary: true,
                target: 10,
                faction: 'ANCIENT'
            },
            {
                id: 'obj-04',
                type: 'survive',
                description: 'Complete without using torpedoes (Optional)',
                primary: false,
                target: 0,
                description: 'Energy weapons only challenge'
            }
        ],

        victoryConditions: [
            { type: 'objectives' }
        ],

        defeatConditions: [
            { type: 'time', value: 600 } // 10 minute limit before they reach Earth
        ],

        entities: [
            {
                id: 'ancient-vessel',
                type: 'derelict',
                position: { x: 9000, y: -4000 },
                hp: 800,
                radius: 120,
                faction: 'NEUTRAL',
                name: 'Ancient Command Vessel',
                scannable: true
            }
        ],

        enemies: [
            // Ancient drones - use TRIGON faction as placeholder for automated enemies
            { faction: 'TRIGON', class: 'FG', position: { x: 8600, y: -4200 } },
            { faction: 'TRIGON', class: 'FG', position: { x: 8600, y: -3800 } },
            { faction: 'TRIGON', class: 'FG', position: { x: 9400, y: -4200 } },
            { faction: 'TRIGON', class: 'FG', position: { x: 9400, y: -3800 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 8800, y: -4300 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 8800, y: -3700 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 9200, y: -4300 } },
            { faction: 'TRIGON', class: 'DD', position: { x: 9200, y: -3700 } },
            { faction: 'TRIGON', class: 'CL', position: { x: 8700, y: -4000 } },
            { faction: 'TRIGON', class: 'CL', position: { x: 9300, y: -4000 } }
        ],

        debriefing: {
            victory: `Captain, your sensor data is... disturbing. T'Lara here.

The ancient command vessel was a guardian - part of an automated defense network protecting something. When we took the artifact from the derelict, we triggered a response.

These aren't random ships - they're programmed to protect ancient technology. And they're converging on whoever possesses it. That's you.

The drone fleet has been neutralized, but this was just a vanguard. Main fleet analysis suggests hundreds more vessels awakening across the galaxy.

We need allies. The Federation can't face this alone. It's time to set aside old grievances.

*CAMPAIGN PHASE THREE BEGINS*`,
            defeat: `Mission failed. The ancient vanguard has breached Federation defenses.

Earth is under direct threat. Emergency protocols enacted.`
        },

        nextMission: 'mission-11'
    },

    'mission-11': {
        id: 'mission-11',
        title: 'Desperate Alliance',
        sector: 'Joint Task Force Assembly',
        briefing: {
            title: 'United Front',
            text: 'Federation, Trigon, and Scintilian forces must unite against the ancient threat.',
            officer: 'Admiral Chen - Starfleet Command'
        },
        objectives: [
            { id: 'obj-01', type: 'protect', description: 'Protect allied fleet', primary: true, targetId: 'allied-fleet' },
            { id: 'obj-02', type: 'destroy', description: 'Destroy ancient warships', primary: true, target: 6 }
        ],
        nextMission: 'mission-12'
    },

    'mission-12': {
        id: 'mission-12',
        title: 'The Source',
        sector: 'Ancient Homeworld',
        briefing: {
            title: 'Final Discovery',
            text: 'Track the ancient vessels to their source. What you find will change everything.',
            officer: 'Science Officer T\'Lara - Xenobiology'
        },
        objectives: [
            { id: 'obj-01', type: 'reach', description: 'Reach ancient homeworld', primary: true, x: 15000, y: 8000, radius: 1000 },
            { id: 'obj-02', type: 'scan', description: 'Scan planetary surface', primary: true, targetId: 'ancient-world', scanRange: 800, target: 30 }
        ],
        nextMission: 'mission-13'
    },

    'mission-13': {
        id: 'mission-13',
        title: 'Betrayal',
        sector: 'Ancient Homeworld Orbit',
        briefing: {
            title: 'Double Cross',
            text: 'The Scintilians have betrayed the alliance. They want the ancient technology for themselves.',
            officer: 'Commander Sarah Chen - Operations'
        },
        objectives: [
            { id: 'obj-01', type: 'destroy', description: 'Destroy Scintilian ambush', primary: true, target: 4, faction: 'SCINTILIAN' },
            { id: 'obj-02', type: 'protect', description: 'Protect Trigon flagship', primary: true, targetId: 'trigon-flagship' }
        ],
        nextMission: 'mission-14'
    },

    'mission-14': {
        id: 'mission-14',
        title: 'The Artifact',
        sector: 'Ancient Homeworld Surface',
        briefing: {
            title: 'Ground Assault',
            text: 'Lead a strike team to the surface. Secure the central artifact before the Scintilians.',
            officer: 'Admiral Chen - Starfleet Command'
        },
        objectives: [
            { id: 'obj-01', type: 'reach', description: 'Reach artifact site', primary: true, x: 20000, y: 10000, radius: 300 },
            { id: 'obj-02', type: 'destroy', description: 'Destroy Scintilian ground forces', primary: true, target: 8, faction: 'SCINTILIAN' }
        ],
        nextMission: 'mission-15'
    },

    'mission-15': {
        id: 'mission-15',
        title: 'Exodus',
        sector: 'Ancient Homeworld',
        briefing: {
            title: 'Cataclysm',
            text: 'The artifact activation is destabilizing the planet. Evacuate all forces immediately.',
            officer: 'Science Officer T\'Lara - Xenobiology'
        },
        objectives: [
            { id: 'obj-01', type: 'protect', description: 'Protect evacuation ships', primary: true, targetId: 'evac-fleet' },
            { id: 'obj-02', type: 'reach', description: 'Escape blast radius', primary: true, x: 0, y: 0, radius: 500 }
        ],
        victoryConditions: [{ type: 'objectives' }],
        defeatConditions: [{ type: 'time', value: 300 }], // 5 minute escape time
        nextMission: 'mission-16'
    },

    'mission-16': {
        id: 'mission-16',
        title: 'New Power',
        sector: 'Federation Space',
        briefing: {
            title: 'Transformation',
            text: 'The artifact has enhanced the Enterprise. But the Scintilians are coming for it.',
            officer: 'Admiral Chen - Starfleet Command'
        },
        objectives: [
            { id: 'obj-01', type: 'destroy', description: 'Destroy Scintilian strike force', primary: true, target: 10, faction: 'SCINTILIAN' },
            { id: 'obj-02', type: 'survive', description: 'Test new systems', primary: true, target: 240 }
        ],
        nextMission: 'mission-17'
    },

    'mission-17': {
        id: 'mission-17',
        title: 'Scintilian Imperium',
        sector: 'Scintilian Space',
        briefing: {
            title: 'Strike at the Heart',
            text: 'End this war. Attack the Scintilian homeworld and force a surrender.',
            officer: 'Admiral Marcus - Strategic Operations'
        },
        objectives: [
            { id: 'obj-01', type: 'reach', description: 'Reach Scintilian homeworld', primary: true, x: 25000, y: -15000, radius: 1500 },
            { id: 'obj-02', type: 'destroy', description: 'Destroy orbital defenses', primary: true, target: 15 }
        ],
        nextMission: 'mission-18'
    },

    'mission-18': {
        id: 'mission-18',
        title: 'The Praetor',
        sector: 'Scintilian Throne World',
        briefing: {
            title: 'Face to Face',
            text: 'The Scintilian Praetor challenges you to single combat. Winner takes all.',
            officer: 'Ambassador T\'Pral - Diplomatic Corps'
        },
        objectives: [
            { id: 'obj-01', type: 'destroy', description: 'Defeat the Praetor\'s flagship', primary: true, target: 1, targetId: 'praetor-flagship' }
        ],
        victoryConditions: [{ type: 'objectives' }],
        defeatConditions: [{ type: 'damage', value: 10 }], // Must keep hull above 10%
        nextMission: 'mission-19'
    },

    'mission-19': {
        id: 'mission-19',
        title: 'Galactic Summit',
        sector: 'Neutral Space',
        briefing: {
            title: 'Peace Conference',
            text: 'Representatives from all factions gather to forge a new galactic order.',
            officer: 'Admiral Chen - Starfleet Command'
        },
        objectives: [
            { id: 'obj-01', type: 'protect', description: 'Protect summit location', primary: true, targetId: 'summit-station' },
            { id: 'obj-02', type: 'destroy', description: 'Destroy rogue elements', primary: true, target: 6 }
        ],
        nextMission: 'mission-20'
    },

    'mission-20': {
        id: 'mission-20',
        title: 'New Horizons',
        sector: 'Unexplored Space',
        briefing: {
            title: 'Final Mission',
            text: 'The war is over. The galaxy is at peace. Now, the real journey begins - exploring the unknown.',
            officer: 'Admiral Chen - Starfleet Command'
        },
        objectives: [
            { id: 'obj-01', type: 'reach', description: 'Explore the galactic rim', primary: true, x: 30000, y: 30000, radius: 2000 },
            { id: 'obj-02', type: 'scan', description: 'Scan anomaly', primary: true, targetId: 'unknown-anomaly', scanRange: 1000, target: 60 }
        ],
        victoryConditions: [{ type: 'objectives' }],
        defeatConditions: [],
        debriefing: {
            victory: `Captain, you've led the Enterprise through impossible challenges and emerged victorious.

The Federation stands stronger than ever. The Trigon Empire has become an ally. Even the Scintilians have joined the galactic community.

But this is not the end - it's a new beginning. The galaxy is vast, and there are wonders yet to discover.

Your mission, as it has always been, is to explore strange new worlds. To seek out new life and new civilizations.

To boldly go where no one has gone before.

*CAMPAIGN COMPLETE*
*FINAL SCORE CALCULATED*
*NEW GAME+ UNLOCKED*`,
            defeat: 'How did you even lose the final mission? It\'s basically a cutscene. Start over.'
        },
        nextMission: null // Campaign complete
    }
};

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MISSIONS };
}
