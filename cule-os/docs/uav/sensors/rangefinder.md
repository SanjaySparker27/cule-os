# Rangefinders and LIDAR

## Overview

Rangefinders measure distance to the ground or obstacles using various technologies. They're essential for terrain following, precision landing, and obstacle avoidance. Cule-OS supports multiple rangefinder types.

## Rangefinder Technologies

### Ultrasonic

```
Principle: Time-of-flight of sound waves
Frequency: 40-200 kHz
Range: 0.2-10 meters
Update rate: 10-20 Hz

Advantages:
- Low cost
- Good for soft surfaces
- Works in darkness

Disadvantages:
- Affected by wind
- Limited range
- Beam spread (poor precision)

Cule-OS Support: Limited (mostly legacy)
```

### Infrared (IR)

```
Principle: Triangulation of IR light
Wavelength: 850-940 nm
Range: 0.1-1.5 meters
Update rate: 50-100 Hz

Advantages:
- Very fast update
- Good for indoor
- Small size

Disadvantages:
- Limited range
- Affected by surface color
- Sunlight interference

Examples: VL53L0X, VL53L1X
```

### LiDAR (Light Detection and Ranging)

```
Principle: Time-of-flight of laser light
Wavelength: 905 nm (eye-safe)
Range: 0-40+ meters
Update rate: 100-1000 Hz

Advantages:
- Long range
- High precision
- Sunlight resistant
- Fast update

Disadvantages:
- Higher cost
- Affected by fog/rain
- Reflective surface issues
```

### mmWave Radar

```
Principle: Frequency modulated continuous wave (FMCW)
Frequency: 60-77 GHz
Range: 0.3-200+ meters
Update rate: 50-200 Hz

Advantages:
- All-weather operation
- Penetrates light vegetation
- Long range

Disadvantages:
- Expensive
- Lower resolution
- Regulatory restrictions
```

## Supported Rangefinders

### Benewake TFmini Plus / S

```
Specifications (TFmini Plus):
- Range: 0.1-12m (90% reflectivity)
- Accuracy: ±5cm
- Resolution: 1cm
- Update rate: 100-1000 Hz
- Interface: UART, I2C, PWM
- FOV: 3.6°

Specifications (TFmini-S):
- Range: 0.1-12m
- Update rate: 100 Hz
- Lower cost

Cule-OS Setup:
RNGFND1_TYPE      20      # Benewake TFmini
RNGFND1_MIN_CM    10      # 10cm minimum
RNGFND1_MAX_CM    1200    # 12m maximum
RNGFND1_ORIENT    25      # Downward

Wiring (UART):
VCC → 5V
GND → GND
TX  → Serial RX (FC)
RX  → Serial TX (FC)
```

### LightWare LW20

```
Specifications:
- Range: 0-100m
- Accuracy: ±0.1m
- Resolution: 1cm
- Update rate: 100-388 Hz
- Interface: UART, I2C, PWM
- FOV: 0.5°

Models:
- LW20/C: 100m range
- LW20/B: 50m range

Cule-OS Setup:
RNGFND1_TYPE      8       # LightWare LW20
RNGFND1_MIN_CM    0
RNGFND1_MAX_CM    10000   # 100m
RNGFND1_ORIENT    25

Serial configuration:
SERIAL4_PROTOCOL  9       # Rangefinder
SERIAL4_BAUD      115200
```

### STM VL53L0X / VL53L1X

```
Specifications (VL53L0X):
- Range: 0.05-2m
- Accuracy: ±3%
- Update rate: 20-50 Hz
- Interface: I2C
- FOV: 25°

Specifications (VL53L1X):
- Range: 0.05-4m
- Update rate: 50 Hz
- Configurable FOV

Cule-OS Setup:
RNGFND1_TYPE      16      # VL53L0X
RNGFND1_MIN_CM    5
RNGFND1_MAX_CM    200     # 2m for VL53L0X
RNGFND1_ORIENT    25

I2C Address: 0x29 (default)
Can be changed via XSHUT pin
```

### Garmin LIDAR-Lite

```
Specifications:
- Range: 0-40m
- Accuracy: ±2.5cm
- Update rate: 50-500 Hz
- Interface: I2C, PWM
- FOV: ~3°

Models:
- LIDAR-Lite v3
- LIDAR-Lite v3HP

Cule-OS Setup:
RNGFND1_TYPE      15      # Garmin LIDAR-Lite
RNGFND1_MIN_CM    5
RNGFND1_MAX_CM    4000    # 40m
RNGFND1_ORIENT    25
```

## Cule-OS Rangefinder Configuration

### Basic Setup

```
# Enable rangefinder
RNGFND1_TYPE      20      # Sensor type (see list below)
RNGFND1_MIN_CM    10      # Minimum distance (cm)
RNGFND1_MAX_CM    1200    # Maximum distance (cm)
RNGFND1_ORIENT    25      # Orientation (25=down)
RNGFND1_PIN       -1      # PWM pin (-1 for serial/I2C)
RNGFND1_SCALING   1.0     # Scaling factor
RNGFND1_OFFSET    0       # Offset (cm)

# Orientation values:
# 0  = Forward
# 1  = Forward-Right
# 2  = Right
# ...
# 24 = Up
# 25 = Down
# 26 = Down-Left
```

### Multiple Rangefinders

```
For obstacle avoidance in multiple directions:

RNGFND1_TYPE      20      # Forward
RNGFND1_ORIENT    0
RNGFND1_MIN_CM    10
RNGFND1_MAX_CM    1200

RNGFND2_TYPE      20      # Down (terrain following)
RNGFND2_ORIENT    25
RNGFND2_MIN_CM    10
RNGFND2_MAX_CM    1200

RNGFND3_TYPE      20      # Backward
RNGFND3_ORIENT    4
RNGFND3_MIN_CM    10
RNGFND3_MAX_CM    1200

Up to 10 rangefinders supported
```

### Serial Rangefinder Setup

```
For UART-based rangefinders:

1. Configure serial port:
SERIAL4_PROTOCOL  9       # Rangefinder
SERIAL4_BAUD      115200  # Match sensor

2. Set rangefinder type:
RNGFND1_TYPE      20      # Benewake
RNGFND1_ORIENT    25      # Downward
```

### I2C Rangefinder Setup

```
For I2C-based rangefinders:

1. Connect to I2C bus:
   - SDA → I2C SDA
   - SCL → I2C SCL
   - VCC → 3.3V or 5V
   - GND → GND

2. Set parameters:
RNGFND1_TYPE      16      # VL53L0X
RNGFND1_ORIENT    25

3. Check address:
RNGFND1_ADDR      0x29    # Default VL53L0X
```

## Use Cases

### Terrain Following

```
Maintain constant height above terrain:

EKF2_HGT_MODE     2       # Rangefinder primary
RNGFND1_MAX_CM    6000    # Max terrain follow height
RNGFND1_MIN_CM    50      # Minimum height

Limitations:
- Only works below RNGFND_MAX_CM
- Needs baro backup above max range

When rangefinder exceeds max:
- Automatically switches to baro
- Maintains absolute altitude
```

### Precision Landing

```
Accurate landing with rangefinder:

LAND_DETECTOR     1       # Enable
LAND_SPEED        0.5     # Slow descent
LAND_ALT_LOW      2000    # Switch to rangefinder (20m)

Rangefinder provides:
- Exact ground distance
- Landing detection
- Final approach altitude

Procedure:
1. Descend using GPS/baro
2. At 20m, switch to rangefinder
3. Slow descent to 0.5 m/s
4. Land when rangefinder < 30cm
```

### Obstacle Avoidance

```
Simple avoidance with multiple rangefinders:

RNGFND1_ORIENT    0       # Forward
RNGFND2_ORIENT    4       # Backward
RNGFND3_ORIENT    6       # Left
RNGFND4_ORIENT    2       # Right

Simple Avoidance (in Loiter):
AVOID_ENABLE      3       # Enable stop and slide
AVOID_DIST_MAX    450     # Max avoidance distance (4.5m)
AVOID_MARGIN      2.0     # Safety margin (m)

Behavior:
- Stops before obstacles
- Allows sliding along obstacle
- Returns control when clear
```

## Mounting Considerations

### Optical Isolation

```
Critical for LiDAR performance:

1. Avoid prop wash
   - Mount on mast
   - Distance: 100mm+ from props
   - Point away from turbulence

2. Sunlight protection
   - Shade sensor
   - Some have built-in sun filters

3. Vibration isolation
   - Use soft mounts
   - Rigid connection causes noise

4. Clean lens
   - Check for dust/mud
   - Clean with lens cloth
```

### Orientation Guidelines

```
Standard Orientations:

Downward (25):
- Terrain following
- Landing
- Ground speed measurement

Forward (0):
- Obstacle detection
- Terrain mapping

Multi-directional:
- 0°  = Forward
- 2°  = Right-Forward
- 4°  = Backward
- 6°  = Left
- 8°  = Left-Forward
- 25° = Down
```

## Troubleshooting

### Inaccurate Readings

```
Symptoms: Distance doesn't match actual

Causes:
1. Wrong scaling
   → Adjust RNGFND1_SCALING
   → Measure known distance

2. Temperature drift
   → Allow warmup
   → Some sensors need temp compensation

3. Reflective surfaces
   → LiDAR can fail on mirrors/water
   → Use multiple rangefinders

4. Out of range
   → Check RNGFND1_MIN_CM/MAX_CM
   → Verify actual distance in range
```

### No Readings

```
Symptoms: Always 0 or max distance

Causes:
1. Wiring issue
   → Check power (LED on?)
   → Verify TX/RX not swapped
   → Check I2C address

2. Wrong type
   → Verify RNGFND1_TYPE matches sensor
   → Check protocol version

3. Port not configured
   → Set SERIALn_PROTOCOL = 9
   → Match baud rate

4. Orientation wrong
   → Check RNGFND1_ORIENT
   → Sensor pointing correct way?
```

### Erratic Readings

```
Symptoms: Distance jumps around

Causes:
1. Prop wash
   → Move sensor away from props
   → Add wind shield

2. Vibration
   → Soften mounting
   → Check for loose screws

3. Interference
   → Other LiDARs on same frequency
   → Sunlight (for IR sensors)

4. Ground texture
   → Grass absorbs LiDAR
   → Use multiple samples
```

## Sensor Comparison

| Sensor | Range | Accuracy | Rate | Cost | Best For |
|--------|-------|----------|------|------|----------|
| VL53L0X | 2m | ±3% | 50Hz | $ | Indoor, landing |
| TFmini Plus | 12m | ±5cm | 100Hz | $$ | Terrain follow |
| LW20 | 100m | ±10cm | 100Hz | $$$ | Surveying |
| LIDAR-Lite | 40m | ±2.5cm | 50Hz | $$ | General use |

## Reference

- [TFmini Datasheet](https://en.benewake.com/support)
- [LightWare Documentation](https://lightwarelidar.com)
- [VL53L1X Datasheet](https://www.st.com/en/imaging-and-photonics-solutions/vl53l1x.html)
