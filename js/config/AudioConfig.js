// Simple audio mapping for game sounds
const AUDIO_CONFIG = {
    enabled: false, // DISABLED - audio files missing, causing massive delays
    volumeMaster: 0.8,
    sounds: {
        'beam-fire':      { src: 'ASSETS/AUDIO/beam_fire.mp3', volume: 0.6 },
        'beam-hit':       { src: 'ASSETS/AUDIO/beam_hit.mp3', volume: 0.6 },
        'disruptor-fire': { src: 'ASSETS/AUDIO/disruptor_fire.mp3', volume: 0.6 },
        'torpedo-fire':   { src: 'ASSETS/AUDIO/torpedo_fire.mp3', volume: 0.7 },
        'torpedo-explosion': { src: 'ASSETS/AUDIO/torpedo_explosion.mp3', volume: 0.8 },
        'plasma-fire':    { src: 'ASSETS/AUDIO/plasma_fire.mp3', volume: 0.7 },
        'plasma-explosion': { src: 'ASSETS/AUDIO/plasma_explosion.mp3', volume: 0.8 },
        'explosion-small':  { src: 'ASSETS/AUDIO/explosion_small.mp3', volume: 0.7 },
        'explosion-medium': { src: 'ASSETS/AUDIO/explosion_medium.mp3', volume: 0.8 },
        'explosion-large':  { src: 'ASSETS/AUDIO/explosion_large.mp3', volume: 0.9 },
        'shield-hit':     { src: 'ASSETS/AUDIO/shield_hit.mp3', volume: 0.6 },
        'hull-breach':    { src: 'ASSETS/AUDIO/hull_breach.mp3', volume: 0.7 },
        'alert-warning':  { src: 'ASSETS/AUDIO/alert_warning.mp3', volume: 0.8 },
        'objective-complete': { src: 'ASSETS/AUDIO/objective_complete.mp3', volume: 0.8 },
        'lock-acquired':  { src: 'ASSETS/AUDIO/lock_acquired.mp3', volume: 0.7 },
        'decoy-deploy':   { src: 'ASSETS/AUDIO/decoy_deploy.mp3', volume: 0.6 },
        'mine-deploy':    { src: 'ASSETS/AUDIO/mine_deploy.mp3', volume: 0.6 }
    }
};