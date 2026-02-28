# Barometer (Pressure Sensor)

## Overview

The barometer measures atmospheric pressure to determine altitude. It's critical for altitude hold and terrain following.

## Supported Barometer Sensors

### Bosch BMP280
```
Specifications:
- Pressure range: 300-1100 hPa
- Absolute accuracy: ±1 hPa
- Interface: I2C, SPI

Cule-OS Driver: bosch/bmp280
```

### Bosch BMP388
```
Specifications:
- Pressure range: 300-1250 hPa
- Absolute accuracy: ±0.4 hPa
- Interface: I2C, SPI
```

### TE MS5611
```
Specifications:
- Pressure range: 10-1200 mbar
- Interface: I2C, SPI

Common in Pixhawk series
```

## Cule-OS Barometer Configuration

### Basic Setup

```
# Primary barometer
GND_BARO_TYPE     1       # Auto-detect
GND_BARO_FILTER   0       # Raw data to EKF

# Primary altitude source
EKF2_BARO_CTRL    1       # Use baro for altitude
```

### Altitude Hold Tuning

```
Filtering in EKF:
EKF2_BARO_GATE    5       # Innovation gate (sigma)
EKF2_BARO_NOISE   3.0     # Baro noise (m)

For noisy vehicles:
EKF2_BARO_NOISE   5.0     # Increase noise estimate
```

## Reference

- [BMP388 Datasheet](https://www.bosch-sensortec.com/)
