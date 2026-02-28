# Inertial Measurement Unit (IMU)

## Overview

The Inertial Measurement Unit (IMU) is the core sensor of any flight controller, measuring angular rates and linear accelerations. Cule-OS supports a wide range of IMU sensors.

## Supported IMU Sensors

### 6-Axis IMUs (Gyro + Accel)

#### InvenSense/TDK ICM-20689
```
Specifications:
- Gyro range: ±250, ±500, ±1000, ±2000 °/s
- Accel range: ±2, ±4, ±8, ±16 g
- Interface: SPI (20MHz), I2C (400kHz)

Cule-OS Support:
- Driver: invensense/icm20689
- Auto-detect: Yes

Parameters:
INS_GYRO_RATE   1000    # Gyro update rate (Hz)
INS_ACCEL_RATE  1000    # Accel update rate (Hz)
INS_GYRO_FILTER 20      # Gyro low-pass (Hz)
```

#### InvenSense ICM-42688-P
```
Specifications:
- Gyro range: ±15.625 to ±2000 °/s
- Accel range: ±2 to ±16 g
- ODR: Up to 32 kHz
- Interface: SPI (24MHz)

Cule-OS Support:
- Driver: invensense/icm42688p
- Can run at 2kHz
```

## Cule-OS IMU Configuration

### Basic Setup

```
# Enable IMU
INS_ENABLE_MASK  7      # Enable IMU 0,1,2 (bitmask)

# Select which IMU for EKF
INS_USE          1      # Use IMU 1
INS_USE2         1      # Use IMU 2
INS_USE3         1      # Use IMU 3

# Update rates
INS_GYRO_RATE    1000   # Gyro rate (Hz)
INS_ACCEL_RATE   1000   # Accel rate (Hz)

# Filtering
INS_GYRO_FILTER  20     # Gyro low-pass filter (Hz)
INS_ACCEL_FILTER 20     # Accel low-pass filter (Hz)
```

### Vibration Mitigation

```
1. Mechanical isolation
   - Vibration dampening foam
   - O-ring mounting
   - Gel pads (Sorbothane)

2. Software filtering
   INS_GYRO_FILTER  20     # Reduce if high vibe
   INS_HNTCH_ENABLE 1      # Notch filter
   INS_HNTCH_FREQ   150    # Set to prop freq

3. Hardware improvements
   - Balance propellers
   - Check motor mounting
   - Tighten all screws
```

## Reference

- [InvenSense IMU Datasheets](https://invensense.tdk.com/products/motion-tracking/)
