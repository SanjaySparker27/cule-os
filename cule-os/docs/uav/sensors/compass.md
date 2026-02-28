# Compass (Magnetometer)

## Overview

The compass (magnetometer) measures Earth's magnetic field to provide heading information. It's critical for navigation, especially when GPS is unavailable.

## Supported Compass Sensors

### RM3100 (PNI Sensor)
```
Specifications:
- Technology: Magneto-inductive
- Range: ±800 µT
- Resolution: 0.0001 µT
- Interface: SPI, I2C

Cule-OS Driver: pni/rm3100
```

### Honeywell HMC5883L / QMC5883L
```
Specifications:
- Range: ±0.88 to ±8.1 Gauss
- Interface: I2C

Cule-OS auto-detects variant
```

## Cule-OS Compass Configuration

### Basic Setup

```
# Enable compasses
COMPASS_ENABLE    1       # Master enable
COMPASS_TYPEMASK  0       # Enable all

# Priority order
COMPASS_PRIO1_ID  0       # External
COMPASS_PRIO2_ID  0       # Internal backup

# Usage in EKF
COMPASS_USE       1       # Use compass 1
COMPASS_USE2      1       # Use compass 2
```

### Orientation Configuration

```
# External compass orientation
COMPASS_ORIENT    0       # Rotation relative to FC
# 0 = None, 2 = Yaw 90, 4 = Yaw 180, 6 = Yaw 270
```

## Calibration

### Standard Calibration

```bash
# MAVLink console
commander calibrate mag

Procedure:
1. Hold vehicle away from metal
2. Rotate slowly around all 3 axes
3. Continue until progress reaches 100%
```

## Troubleshooting

### "Compass Variance" Warning

```
Solutions:
1. Disable internal compass if using external:
   COMPASS_TYPEMASK = 7

2. Or increase variance threshold:
   COMPASS_CHK_XY = 2.0
```

## Reference

- [NOAA Magnetic Field Calculator](https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml)
