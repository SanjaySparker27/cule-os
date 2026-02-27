# Barometer (Pressure Sensor)

## Overview

The barometer measures atmospheric pressure to determine altitude. It's critical for altitude hold and terrain following. Cule-OS supports multiple high-precision barometric pressure sensors.

## How Barometric Altitude Works

```
Barometric Formula:

Altitude = 44330 × (1 - (P/P₀)^(1/5.255))

Where:
- P = Current pressure (hPa)
- P₀ = Sea level pressure (1013.25 hPa)

Key characteristics:
- Higher altitude = Lower pressure
- 1 hPa ≈ 8.43 meters altitude change
- Weather changes affect readings

Standard atmosphere:
Sea level:     1013.25 hPa
1000m:         898.76 hPa
2000m:         794.98 hPa
5000m:         540.48 hPa
```

## Supported Barometer Sensors

### Bosch BMP280

```
Specifications:
- Pressure range: 300-1100 hPa
- Absolute accuracy: ±1 hPa
- Relative accuracy: ±0.12 hPa
- Temperature range: -40 to +85°C
- Interface: I2C (3.4 MHz), SPI (10 MHz)
- Current: 2.7 µA (low power)

Cule-OS Driver: bosch/bmp280

Parameters:
GND_BARO_TYPE    1       # Auto-detect
GND_BARO_FILTER  0       # No filtering (use EKF)
```

### Bosch BMP388

```
Specifications:
- Pressure range: 300-1250 hPa
- Absolute accuracy: ±0.4 hPa
- Relative accuracy: ±0.08 hPa
- Noise: 0.04 hPa RMS
- Temperature range: -40 to +85°C
- Interface: I2C (3.4 MHz), SPI (10 MHz)

Improvements over BMP280:
- Better accuracy
- Lower noise
- Wider pressure range
- FIFO buffer

Cule-OS Driver: bosch/bmp388
```

### Infineon DPS310

```
Specifications:
- Pressure range: 300-1200 hPa
- Absolute accuracy: ±1 hPa
- Relative accuracy: ±0.006 hPa
- Temperature accuracy: ±0.5°C
- Interface: I2C (3.4 MHz), SPI (8 MHz)
- Features: Temperature compensation

Common in:
- DAKE FPV flight controllers
- Budget Pixhawk clones

Cule-OS Driver: infineon/dps310
```

### TE MS5611

```
Specifications:
- Pressure range: 10-1200 mbar
- Absolute accuracy: ±1.5 mbar
- Resolution: 0.012 mbar
- Temperature range: -40 to +85°C
- Interface: I2C (400 kHz), SPI (20 MHz)

Common in:
- Pixhawk series
- Cube flight controllers

Cule-OS Driver: measurement_specialties/ms5611
```

## Cule-OS Barometer Configuration

### Basic Setup

```
# Primary barometer
GND_BARO_TYPE     1       # Auto-detect
GND_BARO_FILTER   0       # Raw data to EKF

# Primary altitude source
EKF2_BARO_CTRL    1       # Use baro for altitude
GND_ALT_OFFSET    0       # Altitude offset (m)
```

### Multiple Barometers

```
Many flight controllers have 2 barometers:
- Primary: MS5611 or BMP388
- Backup: BMP280 or DPS310

Cule-OS automatically uses both:
- Blends readings for accuracy
- Fails over on sensor fault

Parameters:
GND_BARO_PRIMARY  0       # Primary barometer index
GND_BARO2_TYPE    1       # Secondary auto-detect

# For triple redundancy (Cube Orange):
GND_BARO3_TYPE    1
```

### Altitude Calculation

```
# Sea level pressure reference
GND_BARO_STD_P    1013.25  # Standard pressure (hPa)

# Automatic ground pressure calibration:
GND_BARO_AUTO_CAL 1        # Calibrate on arm

# Manual altitude offset:
GND_ALT_OFFSET    0        # Additive offset (meters)

# Temperature compensation:
GND_BARO_TEMP_CMP 1        # Enable compensation
```

## Altitude Hold Tuning

### Barometer Noise and Filtering

```
Barometers are noisy due to:
1. Prop wash (turbulence)
2. Wind gusts
3. Temperature changes
4. Sensor noise

Filtering in EKF:
EKF2_BARO_GATE    5       # Innovation gate (sigma)
EKF2_BARO_NOISE   3.0     # Baro noise (m)

For noisy vehicles (large props):
EKF2_BARO_NOISE   5.0     # Increase noise estimate

For smooth vehicles (small props):
EKF2_BARO_NOISE   2.0     # Lower noise estimate
```

### Prop Wash Compensation

```
Prop wash affects barometer readings:
- Low pressure above props
- Creates false altitude increase
- Worse in hover, better in forward flight

Solutions:
1. Mount barometer away from props
2. Use foam shielding
3. Software compensation:

GND_BARO_FF_FILT  5.0     # Feedforward filter

# Or use GPS as primary when available:
EKF2_HGT_MODE     1       # GPS primary, baro backup
# 0 = Baro primary
# 1 = GPS primary
# 2 = Range finder primary
# 3 = GPS primary, range backup
```

## Temperature Compensation

### Why Temperature Matters

```
Barometers drift with temperature:
- Cold: Reads high (appears to climb)
- Hot: Reads low (appears to descend)
- Rate: ~1-2m per 10°C

Temperature compensation:
- Sensor has built-in temperature sensor
- Factory calibration curves
- Real-time compensation in software
```

### Cule-OS Temperature Handling

```
# Enable compensation
GND_BARO_TEMP_CMP  1

# For heated IMUs (Cube):
BRD_HEAT_TARG      45     # Keep constant temp
BRD_HEAT_ENABLE    1

# This keeps baro at consistent temperature
# Improves altitude hold stability
```

## Calibration

### Ground Pressure Calibration

```bash
# Automatic (recommended)
# Set GND_BARO_AUTO_CAL = 1
# Calibrates to zero on each arm

# Manual calibration
commander calibrate baro

Procedure:
1. Leave vehicle at launch position for 10 seconds
2. Command calibrates ground pressure
3. Altitude reads zero at current position
```

### Temperature Calibration

```
Some barometers benefit from temperature calibration:

1. Cold soak test:
   - Leave vehicle in cold environment
   - Log baro vs temperature
   - Check for drift

2. Hot soak test:
   - Leave in warm environment
   - Monitor for drift

3. Adjust parameters:
   GND_BARO_TEMP_CMP = 1 (usually sufficient)
```

## Troubleshooting

### Altitude Drift

```
Symptoms: Altitude slowly changes while stationary

Causes:
1. Weather changes
   - Normal: ~5-10m/hour variation
   - Solution: Use GPS as primary

2. Temperature drift
   - Allow warmup time
   - Enable heater if available

3. Prop wash
   - Shield barometer
   - Move away from props

4. Calibration drift
   - Recalibrate ground pressure
   - Check GND_BARO_AUTO_CAL = 1
```

### Erratic Altitude Readings

```
Symptoms: Altitude jumps around rapidly

Causes:
1. Prop wash turbulence
   - Shield with foam
   - Mount on mast
   - Increase EKF2_BARO_NOISE

2. Sensor failure
   - Check baro health
   - Switch to backup baro

3. I2C noise
   - Check wiring
   - Reduce I2C length
   - Add pull-up resistors

4. Vibration coupling
   - Isolate barometer
   - Check mounting screws
```

### Baro Not Detected

```
Symptoms: "Baro not healthy" warning

Causes:
1. Driver not loaded
   - Check Cule-OS build config
   - Verify GND_BARO_TYPE

2. I2C issue
   - Check SDA/SCL connections
   - Verify address (check datasheet)
   - Common addresses:
     BMP280: 0x76 or 0x77
     BMP388: 0x76 or 0x77
     DPS310: 0x76 or 0x77
     MS5611: 0x76 or 0x77

3. Hardware failure
   - Test with I2C scanner
   - Replace sensor
```

## Use Cases

### Altitude Hold

```
Primary use: Maintain constant altitude

Tuning:
MPC_ALT_P         1.0     # Altitude P gain
MPC_ALT_I         0.1     # Altitude I gain
MPC_Z_P           0.2     # Vertical position P
MPC_Z_VEL_P       0.1     # Vertical velocity P

For smooth hold:
- Lower gains if oscillating
- Check baro noise levels
- Consider GPS primary if accurate
```

### Terrain Following

```
Use rangefinder + baro for terrain following:

EKF2_HGT_MODE     2       # Range finder primary
RNGFND_MIN_CM     30      # Minimum altitude (cm)
RNGFND_MAX_CM     6000    # Maximum altitude (cm)

Baro backup:
- Used when rangefinder fails
- Used above RNGFND_MAX_CM
```

### Landing Detection

```
Ground contact detection uses baro:

LAND_DETECTOR     1       # Enable
LAND_SPEED        0.7     # Landing descent rate
LAND_ALT1         10.0    # Altitude for slowdown
LAND_ALT2         5.0     # Altitude for final descent

Baro is checked against accelerometer:
- No descent + low throttle = landed
```

## Reference

- [BMP388 Datasheet](https://www.bosch-sensortec.com/products/environmental-sensors/pressure-sensors/bmp388/)
- [DPS310 Datasheet](https://www.infineon.com/cms/en/product/sensor/pressure-sensors/pressure-sensors-for-iot/dps310/)
- [Barometric Formula](https://en.wikipedia.org/wiki/Barometric_formula)
