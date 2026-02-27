# RC Transmitter Calibration

## Overview

RC (Radio Control) calibration ensures the flight controller correctly interprets stick positions from your transmitter. This guide covers binding, calibration, and failsafe setup.

## Transmitter Types

### Supported Protocols

```
Cule-OS supports multiple RC protocols:

1. PWM (Pulse Width Modulation)
   - Traditional analog signal
   - One wire per channel
   - Range: 1000-2000 µs

2. PPM (Pulse Position Modulation)
   - All channels on one wire
   - Sequential pulse train
   - Reduces wiring

3. SBUS (Futaba)
   - Digital serial protocol
   - 16 channels on one wire
   - Inverted signal

4. DSM/DSM2/DSMX (Spektrum)
   - Serial protocol
   - Bind to satellite receiver
   - Up to 12 channels

5. CRSF (Crossfire/TBS)
   - Long-range protocol
   - Bidirectional telemetry
   - Up to 12 channels

6. GHST (ImmersionRC)
   - Ghost protocol
   - Low latency
   - Telemetry support
```

### Receiver Connection

```
Connection by protocol:

PWM (6+ wires):
RC IN ──── CH1 (Roll)
          CH2 (Pitch)
          CH3 (Throttle)
          CH4 (Yaw)
          CH5 (Mode)
          CH6 (Aux)

PPM (1 wire + ground):
RC IN ──── PPM Signal
       ─── GND

SBUS/DSM/CRSF/GHST (3 wires):
RC IN ──── Signal (UART RX)
       ─── 5V (power)
       ─── GND

Note: SBUS is inverted, requires inverter or UART with inversion
```

## Binding the Receiver

### Spektrum DSM/X

```
Procedure:
1. Plug bind plug into receiver BIND port
2. Power on receiver (LED flashes)
3. Put transmitter in bind mode
4. LED goes solid when bound
5. Remove bind plug
6. Power cycle both

Cule-OS Setup:
RC_PROTOCOL = 3      # DSM

Note: Some receivers auto-bind, no plug needed
```

### FrSky (SBUS)

```
Procedure (X8R, X4R, etc.):
1. Hold bind button on receiver
2. Power on receiver
3. Release bind button (LED red)
4. Put Taranis in bind mode (D16)
5. LED goes green when bound
6. Power cycle

Cule-OS Setup:
RC_PROTOCOL = 5      # SBUS
SERIAL5_PROTOCOL = 23 # RC input

Note: Set receiver to "No telemetry" if sharing UART
```

### Crossfire (CRSF)

```
Procedure:
1. Put module in bind mode
2. Power on receiver
3. Wait for solid LED
4. Done

Cule-OS Setup:
RC_PROTOCOL = 9      # CRSF
SERIAL5_PROTOCOL = 23 # RC input
SERIAL5_BAUD = 115200

Note: CRSF provides telemetry back to transmitter
```

## RC Calibration Procedure

### Step-by-Step Calibration

```bash
# Method 1: MAVLink console
commander calibrate rc

# Method 2: QGroundControl
Radio tab → Calibrate

Procedure:
1. Ensure transmitter bound to receiver
2. Open calibration in QGC
3. Click "Calibrate"
4. Follow on-screen prompts:

   Center all sticks and trims
   ├── Move throttle to full down
   ├── Move throttle to full up
   ├── Move yaw to full left
   ├── Move yaw to full right
   ├── Move roll to full left
   ├── Move roll to full right
   ├── Move pitch to full up
   ├── Move pitch to full down
   ├── Move mode switch to all positions
   └── Move aux channels through range

5. Click "Next" to save
```

### Channel Mapping

```
Standard channel assignments:

Channel  Function     Stick/Switch
──────────────────────────────────
CH1      Roll         Right stick H
CH2      Pitch        Right stick V
CH3      Throttle     Left stick V
CH4      Yaw          Left stick H
CH5      Flight Mode  3-position switch
CH6      Aux/Switch   Toggle or pot
CH7+     Additional   Extra functions

Note: Some transmitters use different defaults
Always verify in Radio tab after calibration
```

### Verifying Calibration

```bash
# Check raw RC values
rc status

Expected output:
RC Input:
  CH1 (Roll):     1500 (center)
  CH2 (Pitch):    1500 (center)
  CH3 (Throttle): 1000 (min)
  CH4 (Yaw):      1500 (center)
  CH5 (Mode):     1000 (pos1), 1500 (pos2), 2000 (pos3)

Values:
- Center: 1500 µs
- Min:    1000 µs (or lower)
- Max:    2000 µs (or higher)
- Deadband: ±20 µs acceptable
```

## Channel Configuration

### RC Channel Mapping Parameters

```
Map transmitter channels to functions:

RC_MAP_ROLL       1      # Aileron channel
RC_MAP_PITCH      2      # Elevator channel
RC_MAP_THROTTLE   3      # Throttle channel
RC_MAP_YAW        4      # Rudder channel

RC_MAP_MODE_SW    5      # Flight mode channel
RC_MAP_KILL_SW    6      # Emergency stop channel
RC_MAP_ARM_SW     7      # Arm/disarm switch
RC_MAP_OFFB_SW    8      # Offboard mode

RC_MAP_AUX1       9      # Auxiliary 1
RC_MAP_AUX2      10      # Auxiliary 2
RC_MAP_AUX3      11      # Auxiliary 3
```

### Flight Mode Switch Setup

```
Configure mode switch positions:

RC_MAP_MODE_SW    5      # Channel 5 for modes

Position 1 (1000 µs):    Manual/Stabilize
Position 2 (1500 µs):    Altitude Hold
Position 3 (2000 µs):    Position Hold/Mission

Parameters:
COM_FLTMODE1      0      # Mode for position 1
COM_FLTMODE2      1      # Mode for position 2
COM_FLTMODE3      2      # Mode for position 3
COM_FLTMODE4      3      # Mode for position 4
COM_FLTMODE5      4      # Mode for position 5
COM_FLTMODE6      5      # Mode for position 6

Mode numbers:
0 = Manual
1 = Altitude
2 = Position
3 = Mission
4 = Hold
5 = Return
6 = Acro
7 = Offboard
8 = Stabilize
9 = Rattitude
10 = Takeoff
11 = Land
12 = Follow Me
13 = Precision Land
```

### Throttle Configuration

```
Throttle exponential (for smooth hover):
RC_THR_EXPO       0.3     # Expo curve (-1 to 1)
RC_THR_HOVER      0.5     # Hover throttle (0-1)

Throttle failsafe:
RC_THR_FAILS      975     # Failsafe threshold
# When throttle < 975, trigger failsafe

Deadzone (prevents drift):
RC_THR_DZ         10      # ±10 µs deadzone
```

### Stick Deadzones

```
Prevent drift when sticks centered:

RC_DZ             10      # Default deadzone (µs)
RC_ROLL_DZ        10      # Roll deadzone
RC_PITCH_DZ       10      # Pitch deadzone
RC_YAW_DZ         10      # Yaw deadzone
RC_THR_DZ         10      # Throttle deadzone

Recommended:
- Mini quads: 5-10 µs
- Cinema drones: 10-15 µs
- Fixed-wing: 15-20 µs
```

## Failsafe Configuration

### RC Failsafe Detection

```
When transmitter signal is lost:

1. Receiver enters failsafe mode
2. Outputs preset positions or stops
3. Flight controller detects signal loss
4. Failsafe action triggered

Detection methods:
- No signal on RC channels
- Throttle channel < RC_THR_FAILS
- Timeout on RC reception
```

### Setting Up Failsafe

```
Step 1: Configure transmitter failsafe
- Turn off transmitter while observing QGC
- Check what values receiver outputs
- Set to: Throttle 900, Mode RTL

Step 2: Set failsafe threshold
RC_THR_FAILS      975     # Just above failsafe output

Step 3: Configure failsafe action
NAV_RCL_ACT       2       # Return to land
# 0 = Disabled
# 1 = Hold
# 2 = Return to land
# 3 = Land at current position
# 4 = Use offboard mode
# 5 = Terminate

Step 4: Set failsafe timeout
COM_RC_LOSS_T     0.5     # Seconds before failsafe
```

### Failsafe Testing

```
Test procedure (SAFE LOCATION):

1. Arm in manual mode
2. Hover at 5m altitude
3. Turn off transmitter
4. Verify:
   - Return to land initiated
   - GCS shows "RC Loss"
   - Vehicle returns and lands

5. Turn on transmitter
6. Switch to manual mode
7. Verify control regained

⚠️ WARNING: Only test in open area
⚠️ Have second transmitter ready
```

## Advanced Configuration

### RC Signal Quality

```
Monitor signal quality:

RC_RSSI_PWM       1       # Enable RSSI via PWM
RC_RSSI_CHAN      16      # RSSI on channel 16

For CRSF telemetry:
RC_RSSI_TYPE      1       # Use telemetry RSSI

Check levels:
- RSSI > 70%: Good
- RSSI 50-70%: Fair
- RSSI < 50%: Poor (land soon)
```

### Smoothing and Filtering

```
RC input filtering:
RC_FLT_SMP_RATE   50      # Sample rate (Hz)
RC_FLT_CUTOFF     10      # Low-pass filter (Hz)

Lower cutoff = smoother but more delay
Higher cutoff = more responsive but noisy
```

### Trim and Subtrim

```
Software trim (if transmitter trim not available):
RC_ROLL_TRIM      0       # Roll trim (µs)
RC_PITCH_TRIM     0       # Pitch trim (µs)
RC_YAW_TRIM       0       # Yaw trim (µs)

Use physical transmitter trim instead:
- More intuitive
- Adjustable in flight
- Standard practice
```

## Troubleshooting

### No RC Input

```
Symptoms: "No RC receiver" message

Causes:
1. Receiver not bound
   → Re-bind transmitter
   → Check receiver LED

2. Wrong protocol
   → Check RC_PROTOCOL parameter
   → Verify with receiver manual

3. Wiring issue
   → Check signal wire
   → Verify ground connection
   → Check for 5V if needed

4. UART not configured
   → Set SERIALn_PROTOCOL = 23
   → Match baud rate

5. SBUS inversion
   → Some boards need inverter
   → Check board documentation
```

### Erratic RC Values

```
Symptoms: Values jumping, noisy input

Causes:
1. Poor signal quality
   → Check antenna placement
   → Extend receiver antenna
   → Move away from interference

2. Low RSSI
   → Reduce range
   → Check transmitter battery
   → Replace receiver

3. Electrical noise
   → Separate from power wires
   → Add ferrite choke
   → Shield cable

4. Wrong calibration
   → Re-calibrate
   → Check endpoints
```

### Channel Mismatch

```
Symptoms: Pitch controls roll, etc.

Solutions:
1. Check RC_MAP_* parameters
2. Verify transmitter channel order
3. Re-calibrate with correct stick movements
4. Use QGC Radio tab to verify mapping

Common issue:
AETR vs TAER channel order
→ Aileron, Elevator, Throttle, Rudder
→ Throttle, Aileron, Elevator, Rudder

Match with RC_MAP_* parameters
```

### Failsafe Not Working

```
Symptoms: No response to TX off

Causes:
1. Receiver not outputting failsafe values
   → Configure receiver failsafe
   → Set throttle to 900
   → Set mode to RTL

2. Threshold too low
   → Check RC_THR_FAILS
   → Should be above failsafe output

3. Failsafe disabled
   → Check NAV_RCL_ACT > 0
   → Check COM_RC_LOSS_T

4. Flight mode overrides
   → Some modes ignore RC failsafe
   → Check mode-specific settings
```

## Transmitter Recommendations

### For Multirotors

```
Recommended transmitters:

Entry Level ($50-100):
- FlySky FS-i6X
- Radiolink AT9S
- Turnigy Evolution

Mid Range ($150-300):
- FrSky Taranis Q X7
- Jumper T-Lite
- RadioMaster TX12

High End ($300-600):
- FrSky Taranis X9D+
- RadioMaster TX16S
- Jumper T-Pro

Professional ($600+):
- Futaba T16IZ
- Jeti DS-24
- Graupner MZ-32
```

### For Fixed-Wing

```
Additional features useful:
- More switches for flight modes
- Slider controls for flaps
- Telemetry support
- Long range (CRSF/Crossfire)

Recommended:
- FrSky Taranis series
- RadioMaster TX16S
- Jeti DS series
```

## Reference

- [FrSky Binding Guide](https://www.frsky-rc.com)
- [Spektrum Manuals](https://www.spektrumrc.com)
- [Crossfire Documentation](https://www.team-blacksheep.com)
