# Compass (Magnetometer)

## Overview

The compass (magnetometer) measures Earth's magnetic field to provide heading information. It's critical for navigation, especially when GPS is unavailable or during hover. Cule-OS supports multiple compass types with automatic failover capabilities.

## How Compass Works

```
Earth's Magnetic Field:

    Magnetic North
         ↑
         │  Declination
         │  (varies by location)
    True North
         ↑
         │
    ═════╧═════  ← Horizontal component (used for heading)
        ╱ ╲
       ╱   ╲
      ╱  ↓  ╲    Vertical component (inclination)
     ╱  Field ╲

Heading calculation:
heading = atan2(magnetic_y, magnetic_x)
```

## Supported Compass Sensors

### RM3100 (PNI Sensor)

```
Specifications:
- Technology: Magneto-inductive
- Range: ±800 µT
- Resolution: 0.0001 µT (26-bit ADC)
- Noise: 0.002 µT RMS
- Max sample rate: 1000 Hz
- Interface: SPI (up to 10 MHz), I2C (up to 400 kHz)

Advantages:
- Highest accuracy available
- Excellent temperature stability
- Very low noise
- No temperature drift

Cule-OS Driver: pni/rm3100
Parameters:
COMPASS_TYPEMASK  0       # Enable RM3100
COMPASS_PRIO1_ID  0       # Auto-detect ID
```

### Honeywell HMC5883L / QMC5883L

```
Specifications (HMC5883L):
- Technology: Anisotropic magnetoresistive (AMR)
- Range: ±0.88 to ±8.1 Gauss
- Resolution: 2 milli-gauss
- Interface: I2C (400 kHz)

Specifications (QMC5883L - Chinese clone):
- Range: ±8 Gauss
- Resolution: 2 milli-gauss
- Interface: I2C (400 kHz)

Notes:
- QMC5883L is not compatible with HMC5883L software
- Cule-OS auto-detects the correct variant
- Lower accuracy than RM3100 but widely available

Cule-OS Parameters:
COMPASS_TYPEMASK  0
```

### InvenSense AK09916

```
Specifications:
- Technology: Hall effect
- Range: ±4900 µT
- Resolution: 0.15 µT/LSB
- Interface: I2C (400 kHz)
- Integrated in: ICM-20948 IMU

Advantages:
- Integrated with IMU (reduces wiring)
- Good accuracy for consumer applications
- Low power consumption

Cule-OS Parameters:
COMPASS_TYPEMASK  0       # Use if in ICM-20948
```

### iSentek IST8310

```
Specifications:
- Technology: AMR
- Range: ±4800 µT
- Resolution: 0.3 µT
- Interface: I2C (400 kHz)
- Sample rate: Up to 100 Hz

Common in:
- Here GPS modules
- Holybro GPS units

Cule-OS Parameters:
COMPASS_TYPEMASK  0
```

## Cule-OS Compass Configuration

### Basic Setup

```
# Enable compasses
COMPASS_ENABLE    1       # Master enable
COMPASS_TYPEMASK  0       # Enable all (bitmask of disabled)

# Priority order (try to use best first)
COMPASS_PRIO1_ID  0       # External (usually RM3100)
COMPASS_PRIO2_ID  0       # External backup
COMPASS_PRIO3_ID  0       # Internal (if available)

# Usage in EKF
COMPASS_USE       1       # Use compass 1
COMPASS_USE2      1       # Use compass 2
COMPASS_USE3      1       # Use compass 3
```

### Orientation Configuration

```
# External compass orientation
COMPASS_ORIENT    0       # Rotation relative to FC
# 0 = None
# 2 = Yaw 90
# 4 = Yaw 180
# 6 = Yaw 270
# 8 = Roll 180
# 24 = Pitch 180

# Common orientations:
# Arrow forward, upright: 0
# Arrow forward, inverted: 8
# Arrow right, upright: 2
# Arrow left, upright: 6

# For Cube internal compass:
COMPASS_ORIENT2   34      # Roll 180, Pitch 180 (internal)

# Auto-rotation detection:
COMPASS_AUTO_ROT  2       # Enabled (check rotation on cal)
```

### Interference Compensation

```
# Motor interference compensation
COMPASS_MOTCT     0       # Compensation type
# 0 = None
# 1 = Throttle-based
# 2 = Current-based

# When using current-based (more accurate):
COMPASS_MOTCT     2
COMPASS_MOT_X     0.0     # X axis compensation
COMPASS_MOT_Y     0.0     # Y axis compensation
COMPASS_MOT_Z     0.0     # Z axis compensation

# Learn compensation automatically:
COMPASS_LEARN     3       # Learn and save
```

## Magnetic Interference

### Sources of Interference

```
High Interference Sources:
1. Power distribution boards (PDB)
   - High current paths
   - Distance: 50mm minimum

2. ESCs (Electronic Speed Controllers)
   - Switching noise
   - Distance: 100mm minimum

3. Motors
   - Strong magnets
   - Distance: 150mm minimum

4. Camera gimbals
   - Motor magnets
   - Distance: 100mm minimum

5. External payloads
   - Ferrous metals
   - Magnets (speakers, etc.)

6. Wiring
   - Current loops
   - Solution: Twist power wires
```

### Mounting Best Practices

```
External Compass Module Mounting:

1. Location:
   - On GPS mast (ideal)
   - Top of vehicle
   - Away from power components

2. Distance requirements:
   - ESCs: >100mm
   - PDB: >50mm
   - Motors: >150mm
   - Power wires: >30mm

3. Ground plane:
   - Use metal plate under GPS
   - Size: 50mm x 50mm minimum
   - Material: Copper or aluminum

4. Cable routing:
   - Keep I2C wires short
   - Shield if >100mm
   - Separate from power wires
```

## Calibration Procedures

### Large Vehicle Calibration

```bash
# For vehicles too large to rotate easily
commander calibrate mag large

Procedure:
1. Drive vehicle in circle (car) or fly in circle (drone)
2. Complete at least one 360° rotation
3. Keep each axis level during rotation
4. May need multiple rotations
```

### Standard Calibration

```bash
# MAVLink console
commander calibrate mag

Procedure:
1. Rotate vehicle around all 3 axes
2. Continue until progress reaches 100%
3. Keep away from metal objects
4. Watch for "bad orientation" warnings

# Auto-accept:
commander calibrate mag force
```

### Calibration Verification

```bash
# Check calibration quality
compass info

Expected output:
Compass 0: RM3100
  Health: OK
  Field strength: 0.45 Gauss (Earth: 0.25-0.65)
  Offsets: X: 12, Y: -5, Z: 8
  Diagonals: 1.0, 1.0, 1.0
  Off-diagonals: 0, 0, 0

# Field strength should match local geomagnetic field
# Check at: https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml
```

## Dual Compass Setup

### GPS Module + Internal Compass

```
Common configuration:
- Compass 1: External (GPS module) - RM3100 or IST8310
- Compass 2: Internal (flight controller) - AK09918 or LIS3MDL

Cule-OS Setup:
COMPASS_PRIO1_ID  0       # External (auto-detect)
COMPASS_PRIO2_ID  0       # Internal (auto-detect)
COMPASS_USE       1       # Use external
COMPASS_USE2      1       # Use internal as backup

Benefits:
- Redundancy if one fails
- Can detect interference (comparison)
- EKF can blend multiple sources
```

### Three Compass Configuration

```
Some flight controllers support 3 compasses:
- GPS external compass
- FC internal compass 1
- FC internal compass 2

Cule-OS Setup:
COMPASS_ENABLE    1
COMPASS_USE       1
COMPASS_USE2      1
COMPASS_USE3      1

# EKF will use best available
# Auto-switch on failure
```

## Troubleshooting

### "Compass Variance" Warning

```
Symptoms: Warning during flight, EKF unhappy

Causes:
1. Different compass orientations
   → Check COMPASS_ORIENT matches physical

2. Interference
   → Move compass away from power
   → Check for new payloads
   → Verify motor compensation

3. Calibration drift
   → Recalibrate all compasses
   → Check for nearby metal

4. One compass failed
   → Check COMPASS_HEALTH
   → Disable faulty compass

Solution:
1. Disable internal compass if using external:
   COMPASS_TYPEMASK = 7  # Disable internal compasses

2. Or increase variance threshold:
   COMPASS_CHK_XY = 2.0  # Default 1.0
   COMPASS_CHK_Z = 2.0
```

### Toilet Bowling (Circular Flight Pattern)

```
Symptoms: Vehicle flies in circles instead of straight

Causes:
1. Incorrect declination
   → Set COMPASS_DEC automatically or manually
   → Check at: https://www.magnetic-declination.com/

2. Compass interference
   → Check for metal nearby
   → Move compass farther from motors

3. Wrong orientation
   → Verify COMPASS_ORIENT
   → Check arrow on compass module

4. Bad calibration
   → Recalibrate away from metal
   → Use large vehicle cal if needed

5. Motor interference not compensated
   → Enable COMPASS_MOTCT = 2
   → Learn compensation in flight
```

### Compass Not Detected

```
Symptoms: Only 0 or 1 compass showing

Causes:
1. Wiring issue
   → Check SDA/SCL connections
   → Verify pull-up resistors present

2. Address conflict
   → Some modules have configurable address
   → Default: 0x1E (HMC5883L), 0x0D (QMC5883L)

3. Driver not loaded
   → Check COMPASS_TYPEMASK
   → Verify in build configuration

4. Hardware failure
   → Test with known good module
   → Check with I2C scanner
```

## Declination and Inclination

### Magnetic Declination

```
Declination is the angle between true north and magnetic north.

True North (geographic)    Magnetic North
       ↑                        ↑
       │                        │
       │     Declination        │
       │        ↙               │
       └───────╱────────────────┘
              ╱

Example values:
- Los Angeles: +12° (E)
- New York: -13° (W)
- London: -1° (W)
- Sydney: +12° (E)

Cule-OS automatically sets declination based on GPS position.
Manual override: COMPASS_DEC (radians)
```

### Magnetic Inclination

```
Inclination (dip) is the angle of field lines into the Earth.

At equator: 0° (horizontal)
At poles: 90° (vertical)

Compass should ideally be level for best accuracy.
External GPS/compass masts help maintain level orientation.
```

## Compass-Less Operation

### When to Disable Compass

```
Some applications can operate without compass:
1. Indoor flight (GPS denied anyway)
2. Fixed-wing (use GPS course)
3. Applications with heavy interference

Cule-OS Setup:
COMPASS_USE       0       # Disable compass in EKF
AHRS_GPS_USE      2       # Use GPS for yaw

Limitations:
- No position hold without GPS
- Must be moving for GPS yaw (fixed-wing)
- Less accurate heading
```

### GPS Yaw (Moving Baseline)

```
For multi-GPS setups, calculate yaw from GPS positions:

GPS_TYPE2         11      # u-blox moving baseline
GPS_MB1_TYPE      1       # Rover
GPS_MB2_TYPE      2       # Base (offset 300mm forward)

COMPASS_USE       0       # Disable magnetic compass
AHRS_GPS_USE      2       # Use GPS yaw

Requirements:
- Dual ZED-F9P modules
- 300mm+ separation
- Clear sky view

Benefits:
- Immune to magnetic interference
- Accurate to ~1°
- Works near power lines
```

## Reference

- [NOAA Magnetic Field Calculator](https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml)
- [RM3100 Datasheet](https://www.pnicorp.com/rm3100/)
- [Magnetic Declination Map](https://www.magnetic-declination.com/)
