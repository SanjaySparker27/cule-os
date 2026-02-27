# Power Systems

Power distribution, battery monitoring, and power management for Cule OS vehicles.

## Power System Overview

```
Typical UAV Power System Architecture
══════════════════════════════════════════════════════════════════

                              Battery (4S-12S LiPo)
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
            ┌───────────────┐             ┌───────────────┐
            │   Main PDB    │             │  Power Module │
            │ (High Current)│             │  (Monitoring) │
            └───────┬───────┘             └───────┬───────┘
                    │                             │
        ┌───────────┼───────────┐                 │
        │           │           │                 │
        ▼           ▼           ▼                 ▼
   ┌────────┐  ┌────────┐  ┌────────┐      ┌──────────────┐
   │  ESC   │  │  ESC   │  │  ESC   │      │ Voltage/     │
   │Bank 1  │  │Bank 2  │  │Bank 3  │      │ Current to FC│
   └───┬────┘  └───┬────┘  └───┬────┘      └──────────────┘
       │           │           │
       ▼           ▼           ▼
   ┌────────┐  ┌────────┐  ┌────────┐
   │ Motor  │  │ Motor  │  │ Motor  │
   │   1    │  │   2    │  │   3    │
   └────────┘  └────────┘  └────────┘

        ┌─────────────────────────────────────────────┐
        │               BEC Outputs                    │
        │                                              │
        │   5V/6A    → Flight Controller, RX, GPS      │
        │   5V/10A   → Companion Computer, USB hub     │
        │   12V/3A   → Video Tx, Gimbal                │
        │   9V/3A    → VTX (video transmitter)         │
        │                                              │
        └─────────────────────────────────────────────┘
```

## Batteries

### LiPo Battery Specifications

| Cells | Nominal | Full | Empty | Use Case |
|-------|---------|------|-------|----------|
| 3S | 11.1V | 12.6V | 10.5V | Small quads, racing |
| 4S | 14.8V | 16.8V | 14.0V | 5-7 inch quads |
| 6S | 22.2V | 25.2V | 21.0V | Large UAVs, X8 |
| 12S | 44.4V | 50.4V | 42.0V | Heavy lift, industrial |

### Battery Capacity Planning

```
Flight Time Calculation
══════════════════════════════════════════════════════════════════

Formula:
Flight Time (min) = (Capacity (Ah) × 60 × Discharge) / Current (A)

Example:
- Battery: 6S 5000mAh (5Ah)
- Current draw: 30A hover
- Safe discharge: 80%

Flight Time = (5 × 60 × 0.8) / 30 = 8 minutes

With 20A cruise current: 12 minutes
With 50A aggressive: 4.8 minutes

Power Budget Example (6S Hexacopter):
┌─────────────────────┬──────────┬────────────┐
│ Component           │ Current  │ Power      │
├─────────────────────┼──────────┼────────────┤
│ 6x Motors (cruise)  │ 25A      │ 555W       │
│ Companion Computer  │ 3A @5V   │ 15W        │
│ Flight Controller   │ 0.5A @5V │ 2.5W       │
│ GPS + Compass       │ 0.1A @5V │ 0.5W       │
│ Telemetry Radio     │ 0.5A @5V │ 2.5W       │
│ Video Transmitter   │ 0.5A @12V│ 6W         │
│ Gimbal              │ 0.5A @12V│ 6W         │
├─────────────────────┼──────────┼────────────┤
│ Total               │ ~26A     │ ~588W      │
└─────────────────────┴──────────┴────────────┘

Recommended Battery: 6S 6000mAh (for 10+ min flight)
```

### Battery Safety

```
LiPo Safety Guidelines
══════════════════════════════════════════════════════════════════

Storage:
- Store at 3.8V/cell (storage voltage)
- Use fireproof bags or containers
- Temperature: 10-25°C
- Never leave fully charged for >48 hours

Charging:
- Use LiPo balance charger only
- Charge rate: 1C (e.g., 5A for 5000mAh)
- Never exceed 4.2V/cell
- Always balance charge
- Charge in fireproof location

Discharging:
- Never below 3.0V/cell (absolute minimum)
- Recommended landing: 3.5V/cell
- Physical damage → dispose safely
- Swelling → discontinue use

Transport:
- Carry in fireproof bag
- Remove from vehicle
- Partial charge for shipping (30%)
```

## Power Distribution Boards (PDB)

### PDB Functions

| Function | Description |
|----------|-------------|
| Power Distribution | Split battery to ESCs |
| Current Sensing | Measure total current |
| Voltage Regulation | BEC outputs for 5V/12V |
| Filtering | Reduce ESC noise |

### PDB Selection

| Current Rating | Use Case | Typical Wire |
|---------------|----------|--------------|
| 100A | 5-inch quad, 4S | 12AWG |
| 200A | 7-inch quad, 6S | 10AWG |
| 400A | X8 octo, 6S | 8AWG |
| 600A+ | Heavy lift, 12S | 6AWG |

### PDB Wiring Example

```
PDB Wiring Layout
══════════════════════════════════════════════════════════════════

                    Battery XT60
                         │
                         ▼
               ┌─────────────────┐
               │      PDB        │
               │                 │
               │  Batt+  Batt-   │
               └────┬──────┬─────┘
                    │      │
       ┌────────────┤      ├────────────┐
       │            │      │            │
       ▼            │      │            ▼
  ┌─────────┐       │      │       ┌─────────┐
  │ ESC 1   │       │      │       │ ESC 4   │
  │ Batt+   │       │      │       │ Batt+   │
  │ Batt-   │       │      │       │ Batt-   │
  └─────────┘       │      │       └─────────┘
       │            │      │            │
       ▼            │      │            ▼
  ┌─────────┐       │      │       ┌─────────┐
  │ ESC 2   │       │      │       │ ESC 3   │
  │ Batt+   │       │      │       │ Batt+   │
  │ Batt-   │       │      │       │ Batt-   │
  └─────────┘       │      │       └─────────┘
                    │      │
            ┌───────┴──────┴───────┐
            │      BEC Outputs      │
            │                       │
            │  5V/6A  12V/3A  GND   │
            └───────────────────────┘
```

## BEC (Battery Eliminator Circuit)

### BEC Types

| Type | Efficiency | Noise | Cost | Best For |
|------|------------|-------|------|----------|
| Linear | Low (40-60%) | Very low | $ | Low current, analog video |
| Switching | High (85-95%) | Medium | $$ | High current, digital |
| Isolated | High | Very low | $$$ | Sensitive electronics |

### BEC Ratings

| Output | Current | Use Case |
|--------|---------|----------|
| 5V | 3A | Flight controller, servos |
| 5V | 6A | FC + companion computer |
| 5V | 10A | High power SBC |
| 9V | 3A | VTX (video transmitters) |
| 12V | 3A | Gimbals, displays |
| 12V | 5A | Large gimbals, multiple devices |

### Multiple BEC Setup

```
Isolated Power Rails
══════════════════════════════════════════════════════════════════

Battery (6S)
    │
    ├─────────────────────────────────────────────┐
    │                                             │
    ▼                                             ▼
┌──────────┐                                ┌──────────┐
│ 5V/6A BEC│                                │ 5V/10A BEC│
│ (Servo)  │                                │ (Digital) │
└────┬─────┘                                └────┬─────┘
     │                                           │
     │    ┌──────────┐                           │    ┌──────────┐
     └───►│ Servos   │                           └───►│ Jetson   │
          │ RX       │                                │ Orin     │
          │ FC       │                                │ USB Hub  │
          └──────────┘                                │ CSI Cam  │
                                                    └──────────┘

Important: Do NOT tie BEC grounds together
Use opto-isolation between analog and digital sections
```

## Battery Monitoring

### Voltage Sensing

```
Voltage Divider Circuit
══════════════════════════════════════════════════════════════════

Battery Voltage (e.g., 22.2V)
        │
        ▼
    ┌───────┐
    │ 10kΩ  │
    └───┬───┘
        │
        ├───► To ADC (e.g., 3.3V max)
        │
    ┌───┴───┐
    │ 1.5kΩ │
    └───┬───┘
        │
       GND

Voltage Divider Ratio: (10k + 1.5k) / 1.5k = 7.67

22.2V input → 2.89V output (safe for 3.3V ADC)

ArduPilot Configuration:
param set BATT_VOLT_PIN 0      # Analog pin
param set BATT_VOLT_MULT 10.1  # Calibrate with multimeter
```

### Current Sensing

```
Hall Effect Current Sensor
══════════════════════════════════════════════════════════════════

    ┌─────────────────────────┐
    │     Current Sensor      │
    │                         │
Batt+ ●───[Hall Sensor]───● Batt+ (to ESCs)
    │                         │
    │      ┌───────┐          │
    │      │  Vout │─────────► To FC ADC
    │      └───────┘          │
    │                         │
    │      GND                │
    └─────────────────────────┘

Output: ~40mV per Amp (typical for 90A sensor)
At 30A: 1.2V output

ArduPilot Configuration:
param set BATT_CURR_PIN 1       # Analog pin
param set BATT_AMP_PERVLT 39.877 # Amps per volt
param set BATT_AMP_OFFSET 0     # Zero offset
```

### Power Module Calibration

```bash
# 1. Voltage calibration
# Connect fully charged battery
# Measure actual voltage with multimeter
# Compare with FC reported voltage

# Calculate multiplier
# MULT = Actual_Voltage / Reported_Voltage × Current_MULT
param set BATT_VOLT_MULT 10.1  # Adjust as needed

# 2. Current calibration
# Use calibrated power meter or clamp meter
# Hover at steady throttle, note current

# Calculate amps per volt
# AMP_PERVLT = Measured_Amps / Reported_Amps × Current_AMP_PERVLT
param set BATT_AMP_PERVLT 39.877  # Adjust as needed

# 3. Verify
# Hover current should match between meter and GCS
```

## Power Budget Calculator

```
Power Budget Template
══════════════════════════════════════════════════════════════════

Vehicle Configuration: ________________
Battery: ____S ____mAh

Component List:
┌─────────────────────┬─────────┬──────────┬─────────┐
│ Component           │ Voltage │ Current  │ Power   │
├─────────────────────┼─────────┼──────────┼─────────┤
│ Motors (hover)      │ __._V   │ __._A    │ ___W    │
│ Flight Controller   │ 5V      │ _.__A    │ __W    │
│ Companion Computer  │ 5V      │ __._A    │ ___W    │
│ GPS Module          │ 5V      │ _.__A    │ __W    │
│ Telemetry Radio     │ 5V      │ _.__A    │ __W    │
│ Cameras (CSI)       │ 5V      │ _.__A    │ __W    │
│ Cameras (USB)       │ 5V      │ _.__A    │ __W    │
│ Video Transmitter   │ 12V     │ _.__A    │ __W    │
│ Gimbal              │ 12V     │ _.__A    │ __W    │
│ LiDAR               │ 12V/5V  │ _.__A    │ __W    │
│ LED Lights          │ 12V     │ _.__A    │ __W    │
│ Other: _______      │ __V     │ _.__A    │ __W    │
│ Other: _______      │ __V     │ _.__A    │ __W    │
├─────────────────────┼─────────┼──────────┼─────────┤
│ TOTAL               │         │          │ ___W    │
└─────────────────────┴─────────┴──────────┴─────────┘

5V Rail Total: __._A → Need BEC rated for __A + 20%
12V Rail Total: __._A → Need BEC rated for __A + 20%

Hover Time Estimate:
Total Current: __._A
Battery: ____mAh @ __% discharge = ____mAh usable
Time: (____mAh / __._A) × 60 = ____ minutes
```

## Power Failsafe

### Low Battery Actions

```bash
# Set voltage thresholds (6S example)
# Cell voltages: 3.5V/cell critical, 3.6V/cell low

param set BATT_LOW_VOLT 21.0  # 3.5V/cell
param set BATT_CRT_VOLT 21.6  # 3.6V/cell

# Actions
param set BATT_FS_LOW_ACT 2   # Return to Launch
param set BATT_FS_CRT_ACT 1   # Land immediately

# For second battery
param set BATT2_LOW_VOLT 21.0
param set BATT2_FS_LOW_ACT 2
```

### Power Loss Detection

```
Power Redundancy Options
══════════════════════════════════════════════════════════════════

Option 1: Dual Battery
- Two batteries with redundancy
- Automatic failover
- Higher weight, cost

Option 2: Backup BEC
- Main BEC + backup BEC
- Diode OR-ing
- Continues if one fails

Option 3: Servo Power Separate
- Servos on separate BEC
- Critical flight systems isolated
- If servo BEC fails, FC still powered
```

## Thermal Management

### Heat Dissipation

```
BEC Thermal Considerations
══════════════════════════════════════════════════════════════════

Linear BEC:
Power Loss = (Vin - Vout) × Iout
Example: 22.2V → 5V @ 2A
Loss = (22.2 - 5) × 2 = 34.4W (LOTS of heat!)

Switching BEC:
Efficiency ~90%
Loss = (Vout × Iout) / 0.9 - (Vout × Iout)
Example: 5V @ 2A
Out = 10W, In = 11.1W, Loss = 1.1W (manageable)

Cooling Requirements:
- 5W+ losses: Heatsink required
- 10W+ losses: Fan + heatsink
- 20W+ losses: Large heatsink + good airflow
```

## Troubleshooting

### Power Issues

```bash
# Check voltage in real-time
cule-status --power

# Output:
# Battery: 22.4V (94%)
# Current: 12.3A
# Power: 275W
# Time remaining: 18 min

# High current draw
# Check:
# 1. Motor/prop balance
# 2. ESC calibration
# 3. Binding in drivetrain
# 4. Heavy payload

# Voltage sag under load
# Causes:
# 1. Battery too small (C-rating)
# 2. Old battery (high internal resistance)
# 3. Poor connections
# 4. Undersized wires

# BEC overheating
# Solutions:
# 1. Add heatsink
# 2. Improve airflow
# 3. Reduce load
# 4. Use switching BEC
```

### EMI/RFI Reduction

```
Noise Reduction Techniques
══════════════════════════════════════════════════════════════════

1. Separate power and signal grounds
   - Star grounding at single point
   - Avoid ground loops

2. Filter switching noise
   - Add capacitors at BEC output
   - Use ferrite beads on power leads

3. Shield sensitive signals
   - Shielded cable for video
   - Twisted pair for UART

4. Keep high-current paths short
   - Battery to ESC wires short
   - Use appropriate wire gauge

5. Isolated BECs
   - Separate analog (video) and digital (FC)
   - Use opto-isolators where possible
```

## See Also

- [Wiring Diagrams](./wiring.md) - Connection diagrams
- [Battery Monitoring](./battery.md) - Detailed battery docs
- [BECs and Regulators](./bec.md) - Voltage regulation
- [Cable Reference](./cables.md) - Wire specifications
