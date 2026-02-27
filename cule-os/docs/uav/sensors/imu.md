# Inertial Measurement Unit (IMU)

## Overview

The Inertial Measurement Unit (IMU) is the core sensor of any flight controller, measuring angular rates and linear accelerations. Cule-OS supports a wide range of IMU sensors, from basic 6-axis units to advanced 9-axis solutions with internal fusion.

## IMU Fundamentals

### What IMU Measures

```
┌─────────────────────────────────────────┐
│              IMU Sensors                │
├─────────────────────────────────────────┤
│  Gyroscope (3-axis)                     │
│  ├── Roll rate  (ωₓ)  - rotation X      │
│  ├── Pitch rate (ωᵧ)  - rotation Y      │
│  └── Yaw rate   (ωᵤ)  - rotation Z      │
├─────────────────────────────────────────┤
│  Accelerometer (3-axis)                 │
│  ├── X accel (aₓ)                       │
│  ├── Y accel (aᵧ)                       │
│  └── Z accel (aᵤ)  - gravity + motion   │
└─────────────────────────────────────────┘

Sample rates:
- Consumer: 500-1000 Hz
- Professional: 1000-8000 Hz
- High-performance: 32000 Hz
```

### Coordinate Frame

```
           X (Forward)
            ↑
            │
    Y       │
    ←───────┼───────
   (Left)   │
            │
            ↓ Z (Down)

Standard aircraft body frame (FRD):
- X: Forward through nose
- Y: Right through starboard wing
- Z: Down toward ground

Note: Some sensors use different conventions.
Cule-OS automatically handles rotation matrices.
```

## Supported IMU Sensors

### 6-Axis IMUs (Gyro + Accel)

#### InvenSense/TDK ICM-20689
```
Specifications:
- Gyro range: ±250, ±500, ±1000, ±2000 °/s
- Accel range: ±2, ±4, ±8, ±16 g
- Gyro noise: 0.015 °/s/√Hz
- Accel noise: 200 µg/√Hz
- ODR: Up to 32 kHz
- Interface: SPI (20MHz), I2C (400kHz)

Cule-OS Support:
- Driver: invensense/icm20689
- Auto-detect: Yes
- Temperature calibration: Yes

Parameters:
INS_GYRO_RATE   1000    # Gyro update rate (Hz)
INS_ACCEL_RATE  1000    # Accel update rate (Hz)
INS_GYRO_FILTER 20      # Gyro low-pass (Hz)
INS_ACCEL_FILTER 20     # Accel low-pass (Hz)
```

#### InvenSense ICM-42688-P
```
Specifications:
- Gyro range: ±15.625 to ±2000 °/s
- Accel range: ±2 to ±16 g
- Gyro noise: 0.007 °/s/√Hz (low-noise mode)
- Accel noise: 70 µg/√Hz
- ODR: Up to 32 kHz
- Interface: SPI (24MHz), I2C (1MHz)
- Features: APEX motion processing

Cule-OS Support:
- Driver: invensense/icm42688p
- APEX features: Step detection, tilt, free-fall
- Notch filter: Configurable

Parameters:
INS_GYRO_RATE   2000    # Can run at 2kHz
INS_GYRO_FILTER 40      # Higher filter for 2kHz
```

#### Bosch BMI088
```
Specifications:
- Gyro range: ±125, ±250, ±500, ±1000, ±2000 °/s
- Accel range: ±3, ±6, ±12, ±24 g
- Gyro noise: 0.014 °/s/√Hz
- Accel noise: 120 µg/√Hz
- ODR: 2000 Hz (gyro), 1600 Hz (accel)
- Interface: SPI (10MHz), I2C (1MHz)
- Features: Automotive-grade reliability

Cule-OS Support:
- Driver: bosch/bmi088
- Excellent temperature stability
- Low cross-axis sensitivity

Parameters:
INS_GYRO_RATE   2000
INS_ACCEL_RATE  1600
```

### 9-Axis IMUs (Gyro + Accel + Magnetometer)

#### InvenSense ICM-20948
```
Specifications:
- Gyro/Accel: Same as ICM-20689
- Magnetometer: AK09916 (3-axis)
- Mag sensitivity: 0.15 µT/LSB
- Mag range: ±4900 µT
- Interface: SPI, I2C
- DMP: Digital Motion Processor

Cule-OS Support:
- Driver: invensense/icm20948
- Onboard fusion: Optional
- Compass available: Yes

Parameters:
INS_GYRO_RATE    1000
COMPASS_TYPEMASK 0      # Use internal AK09916
```

## Cule-OS IMU Configuration

### Basic Setup

```
# Enable IMU
INS_ENABLE_MASK  7      # Enable IMU 0,1,2 (bitmask)
# Bit 0 = IMU0, Bit 1 = IMU1, Bit 2 = IMU2

# Select which IMU for EKF
INS_USE          1      # Use IMU 1
INS_USE2         1      # Use IMU 2 (if available)
INS_USE3         1      # Use IMU 3 (if available)

# Update rates
INS_GYRO_RATE    1000   # Gyro rate (Hz)
INS_ACCEL_RATE   1000   # Accel rate (Hz)

# Filtering
INS_GYRO_FILTER  20     # Gyro low-pass filter (Hz)
INS_ACCEL_FILTER 20     # Accel low-pass filter (Hz)

# Notch filtering (for vibration)
INS_HNTCH_ENABLE 1      # Enable harmonic notch
INS_HNTCH_FREQ   100    # Notch frequency (Hz)
INS_HNTCH_BW     20     # Notch bandwidth (Hz)
INS_HNTCH_ATT    40     # Attenuation (dB)
```

### Multi-IMU Configuration

```
For flight controllers with multiple IMUs:

Triple Redundancy Setup:
INS_ENABLE_MASK  7      # 0b111 = All 3 IMUs
INS_USE          1      # Primary IMU for EKF
INS_USE2         1      # Secondary IMU
INS_USE3         1      # Tertiary IMU

EKF2_IMU_MASK    7      # Use all in EKF blending
# 0b001 = IMU1 only
# 0b010 = IMU2 only
# 0b011 = IMU1+IMU2
# 0b111 = All three

# Health checks
INS_HEALTH       1      # Healthy if 1+ IMU ok
```

### Temperature Calibration

```
# Temperature compensation
INS_TCAL_OPTIONS 1      # Enable thermal calibration
INS_TCAL_GYRO    1      # Calibrate gyro against temp
INS_TCAL_ACCEL   1      # Calibrate accel against temp

# Heater control (for Cube series)
BRD_HEAT_ENABLE  1      # Enable IMU heater
BRD_HEAT_TARG    45     # Target temperature (°C)
BRD_HEAT_P       50     # Proportional gain
BRD_HEAT_I       0.2    # Integral gain
```

## Vibration Analysis

### Understanding Vibration

```
Vibration sources:
1. Propellers (primary)
   - Frequency: RPM/60 (Hz per blade)
   - 2-blade at 10,000 RPM: 166 Hz
   - 3-blade at 8,000 RPM: 200 Hz

2. Motors
   - Frequency: Motor pole pairs × RPM/60
   - 14-pole motor at 8,000 RPM: 933 Hz

3. Mechanical resonance
   - Frame flex modes
   - Loose components

Acceptable levels:
- X/Y axis: < 30 m/s/s (good), < 60 (acceptable)
- Z axis: < 15 m/s/s (good), < 30 (acceptable)
```

### Measuring Vibration

```bash
# MAVLink console commands
vibration

# Sample output:
Vibration levels:
  Accel X: 12.5 m/s/s
  Accel Y: 15.2 m/s/s
  Accel Z: 8.3 m/s/s
  Clip 0: 0
  Clip 1: 0
  Clip 2: 0

Status: Good (all axes within limits)
```

### Vibration Mitigation

```
1. Mechanical isolation
   - Vibration dampening foam
   - O-ring mounting
   - Gel pads (Sorbothane)
   - Isolated IMU carrier (Cube)

2. Software filtering
   INS_GYRO_FILTER  20     # Reduce if high vibe
   INS_ACCEL_FILTER 20
   INS_HNTCH_ENABLE 1      # Notch filter
   INS_HNTCH_FREQ   150    # Set to prop freq

3. Hardware improvements
   - Balance propellers
   - Check motor mounting
   - Tighten all screws
   - Avoid contact between wires and FC
```

## Advanced Filtering

### Harmonic Notch Filter

```
The harmonic notch removes specific frequencies:

INS_HNTCH_ENABLE  1       # Enable notch
INS_HNTCH_MODE    1       # Throttle-based
INS_HNTCH_FREQ    100     # Base frequency
INS_HNTCH_BW      20      # Bandwidth
INS_HNTCH_ATT     40      # Attenuation (dB)

For fixed-wing or altitude-based:
INS_HNTCH_MODE    2       # RPM-based (ESC telemetry)
INS_HNTCH_REF     0.2     # Reference throttle
INS_HNTCH_FM_RAT  1.0     # Frequency/throttle ratio
```

### Low-Pass Filter Configuration

```
Filter type selection:
INS_GYRO_FILTER_TYPE  0   # 0=Low-pass, 1=Notch
INS_GYRO_FILTER       20  # Cutoff frequency

Filter order:
INS_GYRO_FILTER_ODR   1   # 1=1st order, 2=2nd order

Setting guidelines:
- Low vibration: 40-50 Hz
- Medium vibration: 20-30 Hz
- High vibration: 10-15 Hz (check mechanical first)

Trade-off:
- Higher cutoff = Better response, more noise
- Lower cutoff = Smoother, more delay
```

## IMU Calibration

### Accelerometer Calibration

```bash
# MAVLink console
commander calibrate accel

Procedure:
1. Place vehicle level
2. Follow instructions for all 6 orientations:
   - Level (normal position)
   - Left side down
   - Right side down
   - Nose down
   - Nose up
   - Upside down

# Verify calibration
accel info

Expected:
Offsets: X: 0.05, Y: -0.02, Z: 0.12
Scales:  X: 1.00, Y: 1.00, Z: 1.00
```

### Gyroscope Calibration

```bash
# MAVLink console
commander calibrate gyro

Procedure:
1. Keep vehicle completely still
2. Wait for calibration complete (30 seconds)

# Verify calibration
gyro info

Expected:
Offsets: X: 0.003, Y: -0.001, Z: 0.002
# Should be near zero when stationary
```

### Temperature Calibration

```bash
# For heated IMUs (Cube series)
# Allow warmup to target temperature first

commander calibrate level

# This calibrates accelerometer at operating temp
# Compensates for temperature drift
```

## Troubleshooting

### High Vibration Warnings

```
Symptoms: "High vibration" warnings, unstable flight

Diagnosis:
1. Check vibration levels: vibration
2. Look for clipping: Clip 0/1/2 > 0

Solutions:
1. Balance propellers
   - Use prop balancer
   - Sand heavy side

2. Check motor mounting
   - Tighten screws
   - Use threadlock

3. Add isolation
   - Foam tape under FC
   - O-ring mount

4. Check wiring
   - No wires touching FC
   - Secure loose cables

5. Reduce filter if acceptable vibe:
   INS_GYRO_FILTER = 15
   INS_ACCEL_FILTER = 15
```

### IMU Temperature Warnings

```
Symptoms: "IMU temp high/low" warnings

Diagnosis:
1. Check current temp: sensors
2. Compare to BRD_HEAT_TARG

Solutions:
1. Cold environment (< 0°C):
   - Increase BRD_HEAT_TARG to 50
   - Wait for warmup
   - Pre-heat in warm vehicle

2. Hot environment (> 60°C):
   - Improve ventilation
   - Add heat sinks
   - Reduce BRD_HEAT_TARG to 40
   - Shade from direct sun

3. Heater failure:
   - Check BRD_HEAT_ENABLE = 1
   - Verify Cube is getting warm
   - Replace if no heating
```

### IMU Consistency Errors

```
Symptoms: "IMU inconsistent" warning, failsafe triggered

Diagnosis:
1. Check multiple IMU readings
2. Look for one IMU with different values

Solutions:
1. Recalibrate all IMUs
   - commander calibrate accel
   - commander calibrate gyro

2. Disable faulty IMU:
   INS_ENABLE_MASK = 6  # Disable IMU0, keep 1,2

3. Check for hardware damage
   - Visual inspection
   - Swap IMU carriers if possible
```

## Performance Optimization

### Sampling Rate Selection

```
Guidelines by vehicle type:

Racing/Mini Quad:
INS_GYRO_RATE    8000    # Maximum rate
INS_ACCEL_RATE   1000    # Standard
INS_GYRO_FILTER  100     # Higher cutoff

Cinema Drone:
INS_GYRO_RATE    1000    # Smooth motion
INS_ACCEL_RATE   1000
INS_GYRO_FILTER  30      # Smooth response

Survey/Mapping:
INS_GYRO_RATE    1000    # Accurate logging
INS_ACCEL_RATE   1000
INS_GYRO_FILTER  20      # Clean data

High-speed Fixed-wing:
INS_GYRO_RATE    2000    # Fast dynamics
INS_ACCEL_RATE   1000
INS_GYRO_FILTER  40
```

### EKF Configuration for IMU

```
# EKF uses IMU data for state estimation
EKF2_IMU_MASK    7       # Which IMUs to use

# IMU noise parameters
EKF2_GYR_NOISE   0.015   # Gyro noise (rad/s)
EKF2_ACC_NOISE   0.35    # Accel noise (m/s²)

# Process noise
EKF2_GYR_B_NOISE 0.001   # Gyro bias noise
EKF2_ACC_B_NOISE 0.003   # Accel bias noise

# For high-vibration vehicles:
EKF2_GYR_NOISE   0.03    # Increase gyro noise
EKF2_ACC_NOISE   0.7     # Increase accel noise
```

## Reference

- [InvenSense IMU Datasheets](https://invensense.tdk.com/products/motion-tracking/)
- [BMI088 Datasheet](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/)
- [Vibration Analysis Guide](https://docs.px4.io/main/en/advanced_config/vibration_isolation.html)
