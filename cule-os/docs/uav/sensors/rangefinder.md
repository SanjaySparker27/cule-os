# Rangefinders and LIDAR

## Overview

Rangefinders measure distance to the ground or obstacles using various technologies. They're essential for terrain following, precision landing, and obstacle avoidance.

## Supported Rangefinders

### Benewake TFmini Plus / S
```
Specifications (TFmini Plus):
- Range: 0.1-12m
- Accuracy: ±5cm
- Update rate: 100-1000 Hz
- Interface: UART, I2C, PWM

Cule-OS Setup:
RNGFND1_TYPE      20      # Benewake TFmini
RNGFND1_MIN_CM    10      # 10cm minimum
RNGFND1_MAX_CM    1200    # 12m maximum
```

### LightWare LW20
```
Specifications:
- Range: 0-100m
- Accuracy: ±10cm
- Update rate: 100-388 Hz

Cule-OS Setup:
RNGFND1_TYPE      8       # LightWare LW20
RNGFND1_MAX_CM    10000   # 100m
```

## Use Cases

### Terrain Following

```
Maintain constant height above terrain:

EKF2_HGT_MODE     2       # Rangefinder primary
RNGFND1_MAX_CM    6000    # Max terrain follow height
```

### Precision Landing

```
Accurate landing with rangefinder:

LAND_DETECTOR     1       # Enable
LAND_SPEED        0.5     # Slow descent
LAND_ALT_LOW      2000    # Switch to rangefinder (20m)
```

## Reference

- [TFmini Datasheet](https://en.benewake.com/support)
