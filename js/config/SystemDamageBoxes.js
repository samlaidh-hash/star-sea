/**
 * Star Sea - System Damage Box Configurations
 * Maps grid-based system layouts to pixel coordinates for blast damage calculations
 */

const SYSTEM_DAMAGE_BOXES = {
    // Map Excel system names to game system property names
    SYSTEM_NAME_MAP: {
        'Forward Beam': 'forwardBeam',
        'Aft Beam': 'aftBeam',
        'Forward Torpedo': 'forwardTorpedo',
        'Aft Torpedo': 'aftTorpedo',
        'Forward/Aft Torpedo': 'dualTorpedo',
        'Forward Disruptor': 'forwardDisruptor',
        'Aft Disruptor': 'aftDisruptor',
        'Sensors': 'sensors',
        'C&C': 'cnc',
        'Impulse': 'impulse',
        'Power': 'power',
        'Bay': 'bay',
        'Left Warp': 'warp',
        'Right Warp': 'warp'
    },

    // Grid cell dimensions (in pixels)
    // These are approximate - boxes fit within ship outline
    CELL_SIZE: {
        width: 4,  // pixels
        height: 3  // pixels
    },

    /**
     * Get system damage boxes for a ship
     * @param {string} faction - 'PLAYER', 'TRIGON', 'SCINTILIAN'
     * @param {string} shipClass - 'FG', 'CL', 'CA', 'BC'
     * @returns {Array} Array of damage boxes with pixel coordinates
     */
    getSystemBoxes(faction, shipClass) {
        const key = this.getShipKey(faction, shipClass);
        const layout = this.LAYOUTS[key];

        if (!layout) {
            console.warn(`No system damage box layout for ${faction} ${shipClass}`);
            return [];
        }

        return layout.boxes.map(box => {
            return {
                system: this.SYSTEM_NAME_MAP[box.system] || box.system.toLowerCase(),
                x: this.gridToPixelX(box.grid_col, layout.gridRows),
                y: this.gridToPixelY(box.grid_row, layout.gridRows),
                width: this.CELL_SIZE.width,
                height: this.CELL_SIZE.height,
                gridRow: box.grid_row,
                gridCol: box.grid_col
            };
        });
    },

    getShipKey(faction, shipClass) {
        if (faction === 'PLAYER' || faction === 'FEDERATION') {
            return `Federation ${shipClass}`;
        } else if (faction === 'TRIGON') {
            return `Trigon ${shipClass}`;
        } else if (faction === 'SCINTILIAN') {
            // Scintilian ships use Federation layouts (Romulan-style)
            return `Federation ${shipClass}`;
        }
        return null;
    },

    /**
     * Convert grid column (0, 1, 2) to pixel x coordinate (relative to ship center)
     */
    gridToPixelX(col, totalRows) {
        // Column 0 = left, 1 = center, 2 = right
        const spacing = this.CELL_SIZE.width;
        return (col - 1) * spacing; // -1 for col 0, 0 for col 1, 1 for col 2
    },

    /**
     * Convert grid row to pixel y coordinate (relative to ship center)
     */
    gridToPixelY(row, totalRows) {
        // Center the grid vertically around ship center
        const spacing = this.CELL_SIZE.height;
        const centerRow = totalRows / 2;
        return (row - centerRow) * spacing;
    },

    // System damage box layouts extracted from Excel
    LAYOUTS: {
        'Federation BC': {
            gridRows: 9,
            boxes: [
                { system: 'Forward Beam', grid_row: 1, grid_col: 0 },
                { system: 'Forward Torpedo', grid_row: 1, grid_col: 1 },
                { system: 'Forward Beam', grid_row: 1, grid_col: 2 },
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Impulse', grid_row: 4, grid_col: 1 },
                { system: 'Aft Torpedo', grid_row: 5, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 0 },
                { system: 'Power', grid_row: 6, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 2 },
                { system: 'Left Warp', grid_row: 7, grid_col: 0 },
                { system: 'Bay', grid_row: 7, grid_col: 1 },
                { system: 'Right Warp', grid_row: 7, grid_col: 2 },
                { system: 'Left Warp', grid_row: 8, grid_col: 0 },
                { system: 'Aft Beam', grid_row: 8, grid_col: 1 },
                { system: 'Right Warp', grid_row: 8, grid_col: 2 }
            ]
        },

        'Federation CA': {
            gridRows: 10,
            boxes: [
                { system: 'Forward Beam', grid_row: 1, grid_col: 1 },
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Impulse', grid_row: 4, grid_col: 1 },
                { system: 'Forward Torpedo', grid_row: 5, grid_col: 1 },
                { system: 'Aft Torpedo', grid_row: 6, grid_col: 1 },
                { system: 'Left Warp', grid_row: 7, grid_col: 0 },
                { system: 'Power', grid_row: 7, grid_col: 1 },
                { system: 'Right Warp', grid_row: 7, grid_col: 2 },
                { system: 'Left Warp', grid_row: 8, grid_col: 0 },
                { system: 'Bay', grid_row: 8, grid_col: 1 },
                { system: 'Right Warp', grid_row: 8, grid_col: 2 },
                { system: 'Left Warp', grid_row: 9, grid_col: 0 },
                { system: 'Aft Beam', grid_row: 9, grid_col: 1 },
                { system: 'Right Warp', grid_row: 9, grid_col: 2 }
            ]
        },

        'Federation CL': {
            gridRows: 9,
            boxes: [
                { system: 'Forward Beam', grid_row: 1, grid_col: 1 },
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Power', grid_row: 4, grid_col: 1 },
                { system: 'Impulse', grid_row: 5, grid_col: 1 },
                { system: 'Left Warp', grid_row: 6, grid_col: 0 },
                { system: 'Forward/Aft Torpedo', grid_row: 6, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 2 },
                { system: 'Left Warp', grid_row: 7, grid_col: 0 },
                { system: 'Bay', grid_row: 7, grid_col: 1 },
                { system: 'Right Warp', grid_row: 7, grid_col: 2 },
                { system: 'Left Warp', grid_row: 8, grid_col: 0 },
                { system: 'Right Warp', grid_row: 8, grid_col: 2 }
            ]
        },

        'Federation FG': {
            gridRows: 7,
            boxes: [
                { system: 'Forward Beam', grid_row: 1, grid_col: 1 },
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Left Warp', grid_row: 4, grid_col: 0 },
                { system: 'Impulse', grid_row: 4, grid_col: 1 },
                { system: 'Right Warp', grid_row: 4, grid_col: 2 },
                { system: 'Left Warp', grid_row: 5, grid_col: 0 },
                { system: 'Power', grid_row: 5, grid_col: 1 },
                { system: 'Right Warp', grid_row: 5, grid_col: 2 },
                { system: 'Left Warp', grid_row: 6, grid_col: 0 },
                { system: 'Bay', grid_row: 6, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 2 }
            ]
        },

        'Trigon BC': {
            gridRows: 9,
            boxes: [
                { system: 'Forward Disruptor', grid_row: 1, grid_col: 1 },
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Forward Disruptor', grid_row: 4, grid_col: 0 },
                { system: 'Power', grid_row: 4, grid_col: 1 },
                { system: 'Forward Disruptor', grid_row: 4, grid_col: 2 },
                { system: 'Left Warp', grid_row: 5, grid_col: 0 },
                { system: 'Bay', grid_row: 5, grid_col: 1 },
                { system: 'Right Warp', grid_row: 5, grid_col: 2 },
                { system: 'Left Warp', grid_row: 6, grid_col: 0 },
                { system: 'Impulse', grid_row: 6, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 2 },
                { system: 'Left Warp', grid_row: 7, grid_col: 0 },
                { system: 'Aft Disruptor', grid_row: 7, grid_col: 1 },
                { system: 'Right Warp', grid_row: 7, grid_col: 2 },
                { system: 'Left Warp', grid_row: 8, grid_col: 0 },
                { system: 'Right Warp', grid_row: 8, grid_col: 2 }
            ]
        },

        'Trigon CA': {
            gridRows: 9,
            boxes: [
                { system: 'Forward Disruptor', grid_row: 1, grid_col: 1 },
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Power', grid_row: 4, grid_col: 1 },
                { system: 'Forward Disruptor', grid_row: 5, grid_col: 0 },
                { system: 'Bay', grid_row: 5, grid_col: 1 },
                { system: 'Forward Disruptor', grid_row: 5, grid_col: 2 },
                { system: 'Left Warp', grid_row: 6, grid_col: 0 },
                { system: 'Impulse', grid_row: 6, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 2 },
                { system: 'Left Warp', grid_row: 7, grid_col: 0 },
                { system: 'Right Warp', grid_row: 7, grid_col: 2 },
                { system: 'Left Warp', grid_row: 8, grid_col: 0 },
                { system: 'Right Warp', grid_row: 8, grid_col: 2 }
            ]
        },

        'Trigon CL': {
            gridRows: 8,
            boxes: [
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Power', grid_row: 4, grid_col: 1 },
                { system: 'Forward Disruptor', grid_row: 5, grid_col: 0 },
                { system: 'Bay', grid_row: 5, grid_col: 1 },
                { system: 'Forward Disruptor', grid_row: 5, grid_col: 2 },
                { system: 'Left Warp', grid_row: 6, grid_col: 0 },
                { system: 'Impulse', grid_row: 6, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 2 },
                { system: 'Left Warp', grid_row: 7, grid_col: 0 },
                { system: 'Right Warp', grid_row: 7, grid_col: 2 }
            ]
        },

        'Trigon FG': {
            gridRows: 8,
            boxes: [
                { system: 'Forward Disruptor', grid_row: 1, grid_col: 1 },
                { system: 'Sensors', grid_row: 2, grid_col: 1 },
                { system: 'C&C', grid_row: 3, grid_col: 1 },
                { system: 'Power', grid_row: 4, grid_col: 1 },
                { system: 'Bay', grid_row: 5, grid_col: 1 },
                { system: 'Left Warp', grid_row: 6, grid_col: 0 },
                { system: 'Impulse', grid_row: 6, grid_col: 1 },
                { system: 'Right Warp', grid_row: 6, grid_col: 2 },
                { system: 'Left Warp', grid_row: 7, grid_col: 0 },
                { system: 'Right Warp', grid_row: 7, grid_col: 2 }
            ]
        }
    }
};
