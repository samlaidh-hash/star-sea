import openpyxl
import json

# Load the workbook
wb = openpyxl.load_workbook('System Chart.xlsx')
ws = wb['Sheet1']

# Define the ship layouts based on the merged cells
# Federation ships are in rows 2-12
# Trigon ships are in rows 16-25

ship_layouts = {
    'Federation BC': {'col_range': (1, 3), 'row_range': (2, 12)},
    'Federation CA': {'col_range': (5, 7), 'row_range': (2, 12)},
    'Federation CL': {'col_range': (10, 12), 'row_range': (2, 12)},
    'Federation FG': {'col_range': (14, 16), 'row_range': (2, 12)},
    'Trigon BC': {'col_range': (1, 3), 'row_range': (16, 25)},
    'Trigon CA': {'col_range': (5, 7), 'row_range': (16, 25)},
    'Trigon CL': {'col_range': (9, 11), 'row_range': (16, 25)},
    'Trigon FG': {'col_range': (13, 15), 'row_range': (16, 25)},
}

# Parse each ship layout
parsed_ships = {}

for ship_name, ranges in ship_layouts.items():
    col_start, col_end = ranges['col_range']
    row_start, row_end = ranges['row_range']

    ship_data = {
        'name': ship_name,
        'boxes': [],
        'grid': {}
    }

    # Parse the grid for this ship
    for row_idx in range(row_start, row_end + 1):
        for col_idx in range(col_start, col_end + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            if cell.value and row_idx > row_start:  # Skip title row
                # Calculate relative position (0-indexed from top-left of ship grid)
                rel_row = row_idx - row_start - 1  # -1 to skip title row
                rel_col = col_idx - col_start

                box = {
                    'system': str(cell.value),
                    'grid_row': rel_row,
                    'grid_col': rel_col,
                    'excel_cell': cell.coordinate
                }
                ship_data['boxes'].append(box)

                # Create grid representation
                if rel_row not in ship_data['grid']:
                    ship_data['grid'][rel_row] = {}
                ship_data['grid'][rel_row][rel_col] = str(cell.value)

    parsed_ships[ship_name] = ship_data

# Print formatted output
print("=" * 80)
print("SYSTEM DAMAGE BOX LAYOUTS")
print("=" * 80)

for ship_name, ship_data in parsed_ships.items():
    print(f"\n{'=' * 80}")
    print(f"SHIP: {ship_name}")
    print(f"{'=' * 80}")
    print(f"Total boxes: {len(ship_data['boxes'])}")

    # Print grid visualization
    print("\nGrid Layout (row, col):")
    print("-" * 60)

    if ship_data['grid']:
        max_row = max(ship_data['grid'].keys())
        max_col = max(max(row.keys()) for row in ship_data['grid'].values())

        # Header
        print("     ", end="")
        for col in range(max_col + 1):
            print(f"{col:3d}", end=" ")
        print()
        print("     " + "-" * (4 * (max_col + 1)))

        # Rows
        for row in range(max_row + 1):
            print(f"{row:3d} |", end=" ")
            for col in range(max_col + 1):
                cell_val = ship_data['grid'].get(row, {}).get(col, "")
                if cell_val:
                    # Abbreviate system names
                    abbrev = {
                        'Forward Beam': 'FB',
                        'Aft Beam': 'AB',
                        'Forward Torpedo': 'FT',
                        'Aft Torpedo': 'AT',
                        'Forward/Aft Torpedo': 'F/AT',
                        'Sensors': 'SEN',
                        'C&C': 'C&C',
                        'Impulse': 'IMP',
                        'Power': 'PWR',
                        'Left Warp': 'LW',
                        'Right Warp': 'RW',
                        'Bay': 'BAY',
                        'Forward Disruptor': 'FD',
                        'Aft Disruptor': 'AD'
                    }
                    print(f"{abbrev.get(cell_val, cell_val[:3]):3s}", end=" ")
                else:
                    print("   ", end=" ")
            print()

    # Print box list
    print("\nSystem Boxes:")
    print("-" * 60)

    # Group by system type
    systems = {}
    for box in ship_data['boxes']:
        sys_name = box['system']
        if sys_name not in systems:
            systems[sys_name] = []
        systems[sys_name].append(box)

    for sys_name in sorted(systems.keys()):
        boxes = systems[sys_name]
        print(f"\n  {sys_name}: ({len(boxes)} box{'es' if len(boxes) > 1 else ''})")
        for box in boxes:
            print(f"    - Position: ({box['grid_row']}, {box['grid_col']})")

# Save to JSON
output = {
    'ships': parsed_ships,
    'notes': {
        'coordinate_system': 'Grid positions are 0-indexed from top-left of each ship layout',
        'damage_rules': 'Box fully in blast = 2 HP damage, partially in blast = 1 HP damage'
    }
}

with open('ship_system_layouts.json', 'w') as f:
    json.dump(output, f, indent=2)

print("\n" + "=" * 80)
print("Complete data exported to: ship_system_layouts.json")
print("=" * 80)

# Create implementation-ready JavaScript format
print("\n" + "=" * 80)
print("JAVASCRIPT IMPLEMENTATION FORMAT")
print("=" * 80)

print("\nconst SHIP_SYSTEM_LAYOUTS = {")
for ship_name, ship_data in parsed_ships.items():
    js_name = ship_name.replace(' ', '_').replace('&', 'and').upper()
    print(f"  '{js_name}': {{")
    print(f"    name: '{ship_name}',")
    print(f"    boxes: [")

    for box in ship_data['boxes']:
        print(f"      {{ system: '{box['system']}', row: {box['grid_row']}, col: {box['grid_col']} }},")

    print(f"    ]")
    print(f"  }},")
print("};")
