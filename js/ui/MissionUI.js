/**
 * Star Sea - Mission UI Handler
 * Manages briefing and debriefing screens
 */

class MissionUI {
    constructor() {
        this.briefingScreen = document.getElementById('briefing-screen');
        this.debriefingScreen = document.getElementById('debriefing-screen');
        this.currentMission = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Briefing screen buttons
        const acceptBtn = document.getElementById('btn-accept-mission');
        const declineBtn = document.getElementById('btn-decline-mission');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.onAcceptMission());
        }
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.onDeclineMission());
        }

        // Debriefing screen buttons
        const nextMissionBtn = document.getElementById('btn-next-mission');
        const returnBaseBtn = document.getElementById('btn-return-base');

        if (nextMissionBtn) {
            nextMissionBtn.addEventListener('click', () => this.onNextMission());
        }
        if (returnBaseBtn) {
            returnBaseBtn.addEventListener('click', () => this.onReturnToBase());
        }
    }

    /**
     * Show mission briefing
     * @param {Object} mission - Mission data from MISSIONS
     */
    showBriefing(mission) {
        if (!mission || !this.briefingScreen) return;

        this.currentMission = mission;

        // Populate briefing data
        const titleElement = document.getElementById('briefing-title');
        const sectorElement = document.getElementById('mission-sector');
        const missionNumberElement = document.getElementById('mission-number');
        const subtitleElement = document.getElementById('briefing-subtitle');
        const descriptionElement = document.getElementById('briefing-description');
        const officerElement = document.getElementById('briefing-officer-name');
        const objectivesList = document.getElementById('objectives-list');

        if (titleElement) titleElement.textContent = 'MISSION BRIEFING';
        if (sectorElement) sectorElement.textContent = `Sector: ${mission.sector || 'Unknown'}`;
        if (missionNumberElement) {
            const missionNum = mission.id.replace('mission-', '');
            missionNumberElement.textContent = `Mission ${parseInt(missionNum)}`;
        }
        if (subtitleElement) subtitleElement.textContent = mission.title;
        if (descriptionElement) descriptionElement.textContent = mission.briefing.text;
        if (officerElement) officerElement.textContent = mission.briefing.officer;

        // Populate objectives
        if (objectivesList) {
            objectivesList.innerHTML = '';
            for (const objective of mission.objectives) {
                const li = document.createElement('li');
                li.textContent = objective.description;
                if (objective.primary) {
                    li.classList.add('primary');
                }
                objectivesList.appendChild(li);
            }
        }

        // Show the screen
        this.briefingScreen.classList.remove('hidden');
        eventBus.emit('game-paused');
    }

    /**
     * Hide briefing screen
     */
    hideBriefing() {
        if (this.briefingScreen) {
            this.briefingScreen.classList.add('hidden');
        }
    }

    /**
     * Show mission debriefing
     * @param {Object} missionData - Mission result data from MissionManager
     */
    showDebriefing(missionData) {
        if (!missionData || !this.debriefingScreen) return;

        const { mission, result, objectives, time, enemiesDestroyed } = missionData;

        // Populate debriefing data
        const resultElement = document.getElementById('debriefing-result');
        const missionTitleElement = document.getElementById('debriefing-mission-title');
        const descriptionElement = document.getElementById('debriefing-description');
        const objectivesList = document.getElementById('debriefing-objectives-list');

        // Result header
        if (resultElement) {
            resultElement.textContent = result === 'victory' ? 'MISSION COMPLETE - VICTORY' : 'MISSION FAILED';
            resultElement.className = result; // Add victory/defeat class
        }

        // Mission title
        if (missionTitleElement) {
            missionTitleElement.textContent = mission.title;
        }

        // Debriefing text
        if (descriptionElement) {
            const debriefingText = result === 'victory'
                ? mission.debriefing.victory
                : mission.debriefing.defeat;
            descriptionElement.textContent = debriefingText;
        }

        // Statistics
        this.updateDebriefingStats(time, enemiesDestroyed, objectives);

        // Objectives list
        if (objectivesList) {
            objectivesList.innerHTML = '';
            for (const objective of objectives) {
                const li = document.createElement('li');
                li.textContent = objective.description;

                if (objective.primary) {
                    li.classList.add('primary');
                }
                if (objective.completed) {
                    li.classList.add('completed');
                } else if (objective.failed) {
                    li.classList.add('failed');
                }

                objectivesList.appendChild(li);
            }
        }

        // Show/hide next mission button based on result and next mission availability
        const nextMissionBtn = document.getElementById('btn-next-mission');
        if (nextMissionBtn) {
            if (result === 'victory' && mission.nextMission) {
                nextMissionBtn.style.display = 'block';
            } else {
                nextMissionBtn.style.display = 'none';
            }
        }

        // Show the screen
        this.debriefingScreen.classList.remove('hidden');
        eventBus.emit('game-paused');
    }

    /**
     * Update debriefing statistics
     */
    updateDebriefingStats(time, enemiesDestroyed, objectives) {
        // Format time
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const timeElement = document.getElementById('stat-time');
        const enemiesElement = document.getElementById('stat-enemies');
        const objectivesElement = document.getElementById('stat-objectives');

        if (timeElement) timeElement.textContent = timeString;
        if (enemiesElement) enemiesElement.textContent = enemiesDestroyed;

        if (objectivesElement) {
            const completed = objectives.filter(o => o.completed).length;
            const total = objectives.filter(o => o.primary).length;
            objectivesElement.textContent = `${completed}/${total}`;
        }
    }

    /**
     * Hide debriefing screen
     */
    hideDebriefing() {
        if (this.debriefingScreen) {
            this.debriefingScreen.classList.add('hidden');
        }
    }

    /**
     * Handle accept mission button
     */
    onAcceptMission() {
        this.hideBriefing();
        eventBus.emit('mission-accepted', { mission: this.currentMission });
        eventBus.emit('game-resumed');
    }

    /**
     * Handle decline mission button
     */
    onDeclineMission() {
        this.hideBriefing();
        eventBus.emit('mission-declined');
        eventBus.emit('game-resumed');
    }

    /**
     * Handle next mission button
     */
    onNextMission() {
        this.hideDebriefing();

        if (this.currentMission && this.currentMission.nextMission) {
            const nextMission = MISSIONS[this.currentMission.nextMission];
            if (nextMission) {
                eventBus.emit('load-next-mission', { missionId: this.currentMission.nextMission });
            }
        }

        eventBus.emit('game-resumed');
    }

    /**
     * Handle return to base button
     */
    onReturnToBase() {
        this.hideDebriefing();
        eventBus.emit('return-to-base');
        eventBus.emit('game-resumed');
    }
}
