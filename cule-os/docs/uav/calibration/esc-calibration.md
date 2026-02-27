# ESC Calibration Guide

## Overview

ESC (Electronic Speed Controller) calibration ensures all motors respond identically to throttle commands. This guide covers various calibration methods for different ESC types.

## ESC Protocols

### PWM (Standard)

```
Standard servo-style PWM signal:
- Frame rate: 50-400 Hz
- Pulse width: 1000-2000 µs
- 1000 µs = Stop
- 2000 µs = Full power

Compatibility: Universal
Latency: Higher (2-20ms)
```

### OneShot125

```
Faster variant of PWM:
- Pulse width: 125-250 µs (8x faster)
- Same resolution as PWM
- Reduced latency

Cule-OS: Automatically detected
Benefit: Better response
```

### DShot (Digital)

```
Digital protocol (no PWM):
- DShot150: 150 kbit/s
- DShot300: 300 kbit/s
- DShot600: 600 kbit/s
- DShot1200: 1200 kbit/s

Advantages:
- No calibration needed
- Built-in checksum
- Telemetry capability (DShot300+)
- Bi-directional (KISS ESCs)

Cule-OS: Protocol auto-detect
Recommended for new builds
```

### OneShot42 / Multishot

```
Very fast protocols:
- OneShot42: 42-84 µs pulses
- Multishot: 5-25 µs pulses

Used mainly for racing
Requires compatible ESCs

Cule-OS: Supported but DShot preferred
```

## ESC Types

### Standard ESCs

```
Separate ESCs (one per motor):
- SimonK firmware (older)
- BLHeli (common)
- BLHeli_S (better)
- BLHeli_32 (32-bit)

Features:
- PWM input
- Some support OneShot/DShot
- Programming via transmitter or tool
```

### 4-in-1 ESCs

```
Integrated 4 ESCs on one board:
- Compact wiring
- Often BLHeli_32
- Current sensing built-in
- Supports telemetry

Connection:
- ESC signal to FC PWM outputs
- Telemetry to UART
- Current to ADC

Cule-OS: Same calibration as individual ESCs
```

### CAN ESCs

```
DroneCAN/UAVCAN ESCs:
- Digital bus connection
- Individual addressing
- Telemetry included
- Examples: Hobbywing X-Rotor, Zubax Myxa

Cule-OS: Uses DroneCAN protocol
No calibration needed
```

## Calibration Methods

### Method 1: QGroundControl (Recommended)

```
Procedure:
1. Remove propellers
2. Connect battery
3. Open QGroundControl
4. Go to Power tab
5. Click "ESC Calibration"
6. Follow prompts:

   Step 1: Connect battery
   Step 2: Set throttle to maximum
   Step 3: Wait for beeps
   Step 4: Set throttle to minimum
   Step 5: Wait for confirmation beeps
   Step 6: Calibration complete

7. Verify all motors spin at same throttle
```

### Method 2: MAVLink Console

```bash
# ESC calibration command
pwm esc_cal

Procedure:
1. Remove props
2. Connect battery
3. Run command
4. Follow console instructions

Output:
ESC calibration started
Set throttle to MAX...
[Wait for beeps]
Set throttle to MIN...
[Wait for beeps]
Calibration complete
```

### Method 3: Manual Transmitter Calibration

```
For ESCs that don't support auto-cal:

1. Remove propellers
2. Turn on transmitter
3. Set throttle to maximum
4. Connect battery
5. Wait for startup beeps
6. Wait for calibration beeps (usually 2 beeps)
7. Lower throttle to minimum
8. Wait for confirmation beeps
9. Disconnect battery
10. Calibration complete

Note: Some ESCs require full throttle
before battery connection
```

### Method 4: USB Programmer (BLHeli)

```
For BLHeli ESCs with configuration:

1. Download BLHeliSuite or BLHeli Configurator
2. Connect ESC signal wire to USB adapter
3. Read ESC settings
4. Set min/max throttle values:
   - PPM Min Throttle: 1000
   - PPM Max Throttle: 2000
5. Save settings
6. Repeat for all ESCs

Note: Requires USB linker or FC passthrough
```

## Verifying Calibration

### Motor Test in QGroundControl

```
Procedure:
1. Remove propellers
2. Connect battery
3. Go to Motors tab
4. Slide safety switch
5. Test each motor:
   - Click "A" slider, verify motor A spins
   - Should start at same slider position
   - Should increase smoothly
6. Repeat for B, C, D...

All motors should:
- Start at same throttle level
- Spin same direction
- Have similar speed response
```

### MAVLink Console Test

```bash
# Test individual motors
pwm test -c 1 -p 1100    # Motor 1 at 10%
pwm test -c 2 -p 1100    # Motor 2 at 10%
pwm test -c 3 -p 1100    # Motor 3 at 10%
pwm test -c 4 -p 1100    # Motor 4 at 10%

# Should all start together
# Increase to verify linear response:
pwm test -c 1 -p 1500    # 50%
pwm test -c 1 -p 2000    # 100%

# Stop all
pwm test -c 1234 -p 0
```

### Direction Check

```bash
# Verify motor directions
# Motors should spin:

Quadcopter X configuration:
    Front
      ↑
  CW ↻   ↺ CCW
      \\ /
       X
      / \\
 CCW ↺   ↻ CW

Commands to test:
pwm test -c 1 -p 1200   # Should spin CW
pwm test -c 2 -p 1200   # Should spin CCW
pwm test -c 3 -p 1200   # Should spin CCW
pwm test -c 4 -p 1200   # Should spin CW

# Reverse any wrong motors
# (swap two motor wires for BLDC)
```

## Spin Direction Configuration

### Changing Motor Direction

```
Method 1: Swap motor wires
- Swap any two of three motor wires
- Reverses rotation
- Simple but requires disassembly

Method 2: BLHeli configuration
- Connect ESC to configurator
- Change motor direction setting
- Save and repeat
- No hardware changes

Method 3: Cule-OS parameter
- For some ESC protocols
- Set MOT_SLEW_DN parameter
- Less common
```

### BLHeli_32 Direction Change

```
Using BLHeliSuite32:

1. Connect ESC via USB linker
2. Read setup
3. Change "Motor Direction"
   - Normal → Reversed
4. Write setup
5. Verify direction

Benefits:
- No soldering
- Can reverse via switch in flight
- Individual control per ESC
```

## DShot Configuration

### Why DShot Needs No Calibration

```
DShot is digital:
- Values sent as numbers
- No pulse width variation
- Identical on all ESCs

Benefits:
- Skip calibration entirely
- More reliable
- Built-in checksum
- Telemetry feedback
```

### Setting Up DShot

```
Hardware:
- DShot-capable ESCs (BLHeli_S or BLHeli_32)
- Signal wire to FC PWM output

Cule-OS Configuration:
PWM_MAIN_RATE    0       # DShot auto-configures
PWM_MIN          0       # DShot uses 0-2000
PWM_MAX          2000

Protocol selection:
DSHOT_CONFIG     150     # DShot150
# DSHOT_CONFIG   300     # DShot300
# DSHOT_CONFIG   600     # DShot600
# DSHOT_CONFIG   1200    # DShot1200

# Telemetry (requires telemetry wire)
DSHOT_TLM_CFG    1       # Enable telemetry
SERIAL5_PROTOCOL 16      # ESC telemetry
SERIAL5_BAUD     115200
```

### DShot Commands

```
Special commands via Cule-OS:

ESC beep (find crashed drone):
DSHOT_CMD_BEEP1  1       # Low beep
DSHOT_CMD_BEEP2  1       # Medium beep
DSHOT_CMD_BEEP3  1       # High beep
DSHOT_CMD_BEEP4  1       # Chirp

ESC info:
DSHOT_CMD_ESC_INFO  1    # Request ESC info

Direction reverse (BLHeli_32):
DSHOT_CMD_ROT_NORM  1    # Normal direction
DSHOT_CMD_ROT_REVS  1    # Reverse direction
```

## Troubleshooting

### Motor Not Spinning

```
Symptoms: One or more motors don't spin

Causes:
1. ESC not receiving signal
   → Check PWM wire connection
   → Verify PWM output assigned
   → Test with servo tester

2. ESC not powered
   → Check ESC power input
   → Verify battery voltage
   → Check for damaged ESC

3. Wrong protocol
   → PWM ESC with DShot output
   → Set correct protocol in Cule-OS

4. Safety switch engaged
   → Hold safety switch
   → Or disable: CBRK_IO_SAFETY = 22027

5. Arm switch required
   → Arm via transmitter
   → Or check ARMING_REQUIRE
```

### Motors Spin at Different Rates

```
Symptoms: Uneven throttle response

Causes:
1. Calibration mismatch
   → Re-calibrate all ESCs
   → Use same method for all

2. Different ESC firmware
   → Flash same version to all
   → Match settings in BLHeli

3. Different motor KV
   → Should use identical motors
   → Check motor specs

4. Mechanical binding
   → Check prop mounts
   → Verify free rotation
   → Check for bent shafts

5. Damaged ESC
   → Swap ESC to test
   → Replace if confirmed
```

### Jerky or Non-Linear Response

```
Symptoms: Motors stutter or jump

Causes:
1. Sync loss
   → Increase PWM frequency
   → Lower timing advance
   → Check for desync in BLHeli

2. Signal noise
   → Shorten signal wires
   → Add ferrite ring
   → Use shielded cable

3. Power supply issues
   → Check battery health
   → Verify adequate wire gauge
   → Check for voltage sag

4. Wrong protocol settings
   → Verify DShot vs PWM
   → Check protocol autodetect
```

### ESC Overheating

```
Symptoms: ESCs hot after flight

Causes:
1. Over-propped
   → Reduce propeller size
   → Check motor/ESC ratings

2. High timing advance
   → Lower in BLHeli config
   → Reduces efficiency but heat

3. Insufficient cooling
   → Add airflow
   → Mount with heatsink exposed
   → Avoid enclosed spaces

4. Damaged ESC
   → Check for shorts
   → Replace if damaged
```

## Parameter Reference

```
ESC-related parameters:

# Output configuration
PWM_MAIN_DIS     900     # Disarmed PWM value
PWM_MAIN_MIN     1000    # Minimum PWM
PWM_MAIN_MAX     2000    # Maximum PWM
PWM_MAIN_RATE    400     # Output rate (Hz)

# DShot configuration
DSHOT_CONFIG     0       # 0=Disabled, 150/300/600/1200
DSHOT_TLM_CFG    0       # Telemetry configuration
DSHOT_TLM_STATS  0       # Telemetry statistics

# Safety
COM_PWM_MIN      1000    # PWM limit
MOT_SLEW_UP      0       # Throttle slew up
MOT_SLEW_DN      0       # Throttle slew down

# Spin direction
MOT_SPOOL_TIME   0.5     # Spool up time (sec)
```

## ESC Selection Guide

```
By Application:

Racing/Mini Quad:
- BLHeli_32 35-60A
- DShot1200
- Weight <10g
- Cost: $15-25 each

Cinema Drone:
- BLHeli_32 40-80A
- DShot600
- Smooth start
- Cost: $20-40 each

Heavy Lifter:
- Hobbywing X-Rotor 80A
- PWM or CAN
- Active cooling
- Cost: $50-100 each

Fixed-Wing:
- Any standard ESC
- PWM 50Hz
- BEC for servos
- Cost: $10-30 each
```
