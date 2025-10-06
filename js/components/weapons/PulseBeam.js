/**
 * Star Sea - Pulse Beam Weapon Component (Scintilian faction)
 * Rapid-fire beam variant with reduced damage per shot.
 */

class PulseBeam extends BeamWeapon {
    constructor(config = {}) {
        super(config);

        const defaultDamage = (typeof CONFIG !== 'undefined' && CONFIG.PULSE_BEAM_DAMAGE !== undefined)
            ? CONFIG.PULSE_BEAM_DAMAGE
            : 0.5;
        const defaultCooldown = (typeof CONFIG !== 'undefined' && CONFIG.PULSE_BEAM_COOLDOWN !== undefined)
            ? CONFIG.PULSE_BEAM_COOLDOWN
            : 0.5;
        const defaultRange = (typeof CONFIG !== 'undefined' && CONFIG.PULSE_BEAM_RANGE_PIXELS !== undefined)
            ? CONFIG.PULSE_BEAM_RANGE_PIXELS
            : this.range;

        this.damage = config.damage ?? defaultDamage;
        this.cooldown = config.cooldown ?? defaultCooldown;
        this.range = config.range ?? defaultRange;
        this.name = config.name || 'Pulse Beam';
    }

    fire(ship, targetX, targetY, currentTime) {
        const projectile = super.fire(ship, targetX, targetY, currentTime);
        if (projectile) {
            projectile.color = (typeof CONFIG !== 'undefined' && CONFIG.COLOR_PULSE_BEAM)
                ? CONFIG.COLOR_PULSE_BEAM
                : '#00ffff';
        }
        return projectile;
    }
}
