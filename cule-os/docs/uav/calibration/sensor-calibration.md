# Sensor Calibration Guide

## Overview

Proper sensor calibration is critical for safe and stable flight. This guide covers calibration procedures for all sensors in Cule-OS, from basic IMU calibration to advanced compass motor compensation.

## Pre-Calibration Checklist

### Before Starting

```
□ Battery fully charged (voltage affects IMU)
□ Remove propellers (safety + no vibration)
□ Remove gimbal/payload if possible
□ Find location away from metal structures
□ Ensure 5+ meter clearance in all directions
□ USB cable connected for console access
□ QGroundControl open (for visualization)
□ Backup current parameters (optional)
```

### Environment Requirements

```
Compass Calibration:
- Open area, no cars/buildings within 10m
- Away from underground power lines
- No metal in pockets
- Concrete OK, rebar may affect

IMU Calibration:
- Solid, level surface
- No vibration
- Stable temperature

Level Calibration:
- Precision bubble level on frame
- Gimbal/payload mounted (normal flight config)
```

## IMU Calibration

### Accelerometer Calibration

The accelerometer must be calibrated in 6 orientations to establish the gravity vector reference.

```bash
# Method 1: MAVLink console
commander calibrate accel

# Method 2: QGroundControl
Sensors tab → Accelerometer → Follow prompts

Procedure:
1. Place vehicle level (normal position)
   → Hold still, wait for beep
   
2. Place on LEFT side
   → Hold still, wait for beep
   
3. Place on RIGHT side
   → Hold still, wait for beep
   
4. Place NOSE DOWN
   → Hold still, wait for beep
   
5. Place NOSE UP
   → Hold still, wait for beep
   
6. Place UPSIDE DOWN
   → Hold still, wait for completion beep

Total time: ~2 minutes
```

#### Accelerometer Calibration Verification

```bash
# Check calibration quality
accel info

Expected output:
Accelerometer 0 (ICM-20689):
  Status: OK
  Raw: 0.12 -0.05 9.81
  Calibrated: 0.00 0.00 9.81
  Offsets: X: 0.05, Y: -0.02, Z: 0.12
  Scale:   X: 1.00, Y: 1.00, Z: 1.00

# Good calibration:
# - Offsets < 0.5 m/s²
# - Z reads ~9.81 m/s² when level
# - X and Y read ~0 when level
```

#### Troubleshooting Accel Calibration

```
Problem: "Calibration failed"
Solutions:
1. Keep vehicle perfectly still
2. Wait full duration on each position
3. Try on different surface (concrete better than wood)
4. Check for loose IMU mounting
5. Increase timeout: CAL_ACC_DELAY = 5

Problem: High offsets after calibration
Solutions:
1. IMU may be damaged
2. Check temperature (cold IMU drifts)
3. Try thermal calibration (Cube series)
4. Consider replacement if >1 m/s² offset
```

### Gyroscope Calibration

Gyro calibration establishes the zero-rate offset when stationary.

```bash
# Method 1: MAVLink console
commander calibrate gyro

# Method 2: QGroundControl
Sensors tab → Gyroscope

Procedure:
1. Place vehicle on solid surface
2. Do NOT move for 30 seconds
3. Wait for completion tone

Total time: ~30 seconds
```

#### Gyro Calibration Verification

```bash
# Verify calibration
gyro info

Expected output:
Gyroscope 0 (ICM-20689):
  Status: OK
  Raw: 0.003 -0.001 0.002
  Calibrated: 0.000 0.000 0.000
  Offsets: X: 0.003, Y: -0.001, Z: 0.002
  
# Good calibration:
# - All rates near zero when stationary
# - Offsets < 0.05 rad/s
# - Stable over time
```

### Thermal Calibration (Advanced)

For Cube and heated IMU systems, thermal calibration improves performance across temperature ranges.

```bash
# Enable thermal calibration
param set INS_TCAL_OPTIONS 1
param set INS_TCAL_GYRO 1
param set INS_TCAL_ACCEL 1

# Procedure:
1. Cold start (room temperature)
2. Allow heater to warm up
3. Perform accel calibration
4. Perform gyro calibration
5. Parameters automatically saved

# Verify:
sensors
# Look for temperature compensation active
```

## Compass Calibration

### Standard Compass Calibration

```bash
# Method 1: MAVLink console
commander calibrate mag

# Method 2: QGroundControl
Sensors tab → Compass

Procedure:
1. Hold vehicle away from metal
2. Rotate slowly around all 3 axes:
   - Yaw: 360° rotation (nose around)
   - Pitch: Nose up/down 360°
   - Roll: Side to side 360°
3. Watch progress indicator
4. Continue until 100% complete

Total time: ~2-3 minutes
Tips:
- Slower rotation is better
- Cover all orientations
- Keep away from body
```

### Large Vehicle Calibration

For vehicles too large to rotate manually:

```bash
# MAVLink console
commander calibrate mag large

Procedure:
1. Drive/fly in circle
2. Complete at least 360° rotation
3. Keep vehicle level during rotation
4. May need multiple circles
5. Auto-completes when enough data collected

Requirements:
- GPS lock required
- Clear area for maneuvering
- Consistent altitude
```

### Compass Calibration Verification

```bash
# Check calibration
compass info

Expected output:
Compass 0 (RM3100):
  Health: OK
  Device ID: 12345
  Board rotation: None
  External: Yes
  Field: 0.45 Gauss
  Field expected: 0.45 Gauss
  Offsets: X: 12, Y: -5, Z: 8
  Diagonal: 1.00, 1.00, 1.00
  Off-Diag: 0.00, 0.00, 0.00

# Good calibration:
# - Field strength matches local geomagnetic field
# - Check at: https://www.ngdc.noaa.gov/geomag/
# - Offsets < 500 (varies by sensor)
```

### Motor Interference Compensation

For vehicles with significant compass interference from motors/ESCs:

```bash
# Setup for interference learning
param set COMPASS_MOTCT 2      # Current-based compensation
param set COMPASS_LEARN 3      # Learn and save

# Procedure:
1. Calibrate compass without motors running
2. Secure vehicle (tie down)
3. Arm and slowly increase throttle
4. Observe compass offsets change
5. System learns compensation values
6. Auto-saves when disarmed

# Verify:
param show COMPASS_MOT_X
param show COMPASS_MOT_Y
param show COMPASS_MOT_Z
# Should show non-zero values after learning
```

## Level Horizon Calibration

### When to Calibrate Level

```
Required when:
- Vehicle consistently drifts in one direction in hover
- Horizon indicator tilted in QGroundControl
- After changing gimbal/payload
- After hard landing

Not required:
- Initial setup (accel cal includes level)
- Swapping batteries
- Normal sensor calibration
```

### Level Calibration Procedure

```bash
# Method 1: MAVLink console
commander calibrate level

# Method 2: QGroundControl
Sensors tab → Level Horizon

Prerequisites:
1. Vehicle on perfectly level surface
2. Use precision bubble level
3. Check in both roll and pitch axes
4. Gimbal/payload in normal flight position

Procedure:
1. Verify level with bubble level
2. Run calibration command
3. Wait for completion
4. Verify horizon in QGC is level
```

### Verification

```bash
# Check attitude when level
attitude

Expected output:
Roll: 0.0°
Pitch: 0.0°
Yaw: 45.0° (magnetic heading)

# Acceptable tolerance: ±1°
```

## Airspeed Calibration (Fixed-Wing)

### Pitot Tube Setup

```
Prerequisites:
- Pitot tube installed
- Differential pressure sensor connected
- No wind (indoor or calm day)
```

### Calibration Procedure

```bash
# Pre-flight calibration
airspeed cal

Procedure:
1. Cover pitot tube completely
2. Run calibration command
3. Wait for zero pressure reading
4. Remove cover
5. Blow gently into tube
6. Verify positive reading

Parameters:
ARSP_TYPE      1      # Auto-detect
ARSP_USE       1      # Use for flight control
ARSP_OFFSET    0      # Auto-calibrated
```

## ESC Calibration

See [ESC Calibration Guide](./esc-calibration.md) for detailed procedures.

Quick reference:
```bash
# ESC calibration via QGroundControl
Power tab → ESC Calibration

# Or via console
pwm esc_cal
```

## RC Transmitter Calibration

See [Radio Calibration Guide](./radio-calibration.md) for detailed procedures.

Quick reference:
```bash
# RC calibration
commander calibrate rc

# Follow stick prompts
```

## Complete Calibration Sequence

### New Vehicle Setup

```
Step 1: Hardware Setup
  □ Install flight controller
  □ Connect all sensors
  □ Verify wiring
  □ Install props (off for calibration)

Step 2: Initial Boot
  □ Connect battery
  □ Connect USB
  □ Open QGroundControl
  □ Verify all sensors detected

Step 3: IMU Calibration
  □ Calibrate accelerometer (6 positions)
  □ Calibrate gyroscope (stationary)
  □ Verify in sensors tab

Step 4: Compass Calibration
  □ Move to open area
  □ Calibrate all compasses
  □ Verify field strength

Step 5: Level Calibration
  □ Set on level surface
  □ Calibrate level horizon
  □ Verify attitude display

Step 6: Radio Calibration
  □ Bind transmitter
  □ Calibrate endpoints
  □ Set flight modes

Step 7: ESC Calibration
  □ Calibrate ESCs
  □ Test motor spin direction
  □ Verify throttle response

Step 8: Verification
  □ Install props
  □ Arm without props (check directions)
  □ Review all parameters
  □ First flight in manual mode
```

### Periodic Recalibration

```
Recalibrate when:
- Compass: After moving to new location (>500km)
- Compass: After adding/removing metal
- IMU: After hard impacts
- Level: After payload changes
- All: Monthly for commercial ops
- All: When flight performance degrades

Don't recalibrate:
- Working system without issues
- Just for maintenance
- Unless sensor replaced
```

## Troubleshooting Calibration Issues

### General Tips

```
1. Temperature matters
   - Let IMU warm up
   - Cold sensors drift
   - Use heater if available

2. Movement matters
   - Stay still for gyro
   - Move slowly for compass
   - Be precise for accel positions

3. Environment matters
   - Away from metal
   - Solid surface
   - No vibrations

4. Software matters
   - Latest firmware
   - Reset to defaults if stuck
   - Check for hardware faults
```

### Common Error Messages

```
"Calibration failed":
- Timeout too short: Increase CAL_*_DELAY
- Movement detected: Hold more still
- Sensor fault: Check health

"Bad rotation":
- Compass orientation wrong
- Check COMPASS_ORIENT
- Try auto-rotation detection

"Compass variance":
- Interference during cal
- Move away from metal
- Calibrate in open area

"IMU inconsistent":
- One IMU failed
- Check INS_HEALTH
- Disable faulty IMU temporarily
```

## Parameter Reference

```
Calibration-related parameters:

# Accelerometer
CAL_ACC_DELAY     2      # Delay between positions (sec)
CAL_ACC_ID        0      # Calibrated device ID

# Gyroscope
CAL_GYRO_DELAY    2      # Delay (sec)
CAL_GYRO_ID       0      # Calibrated device ID

# Compass
CAL_MAG_DELAY     2      # Delay (sec)
CAL_MAG_ROT_AUTO  1      # Auto-detect rotation

# Level
SENS_BOARD_X_OFF  0      # Roll offset (deg)
SENS_BOARD_Y_OFF  0      # Pitch offset (deg)
SENS_BOARD_Z_OFF  0      # Yaw offset (deg)
```
