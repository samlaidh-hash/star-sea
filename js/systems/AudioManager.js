// AudioManager - lightweight wrapper around HTMLAudioElement
class AudioManager {
    constructor() {
        this.enabled = (typeof AUDIO_CONFIG !== 'undefined') ? AUDIO_CONFIG.enabled : false;
        this.volumeMaster = (typeof AUDIO_CONFIG !== 'undefined') ? AUDIO_CONFIG.volumeMaster : 1.0;
        this.buffers = new Map();
        this.initialized = false;
    }

    initialize() {
        // On first user interaction browsers allow audio playback
        if (this.initialized) return;
        this.initialized = true;

        if (!this.enabled) return;

        // Preload audio elements
        const sounds = (typeof AUDIO_CONFIG !== 'undefined' && AUDIO_CONFIG.sounds) ? AUDIO_CONFIG.sounds : {};
        for (const [name, cfg] of Object.entries(sounds)) {
            const audio = new Audio();
            audio.src = cfg.src;
            audio.preload = 'auto';
            audio.volume = this.volumeMaster * (cfg.volume || 1.0);
            this.buffers.set(name, audio);
        }
    }

    playSound(name, options = {}) {
        if (!this.enabled) return;
        const audio = this.buffers.get(name);
        if (!audio) return;

        // Clone to allow overlapping playback
        const instance = audio.cloneNode();
        const volume = options.volume !== undefined ? options.volume : (AUDIO_CONFIG.sounds[name]?.volume || 1.0);
        instance.volume = this.volumeMaster * volume;
        instance.play().catch(() => {
            // Ignore play errors (e.g., not triggered by user gesture)
        });
    }
}