# GPS/GNSS Sensors

## Overview

GPS (Global Positioning System) and GNSS (Global Navigation Satellite System) sensors provide critical position, velocity, and timing data for UAV operations. Cule-OS supports a wide range of receivers from basic navigation to centimeter-accurate RTK systems.

## Supported GNSS Systems

| System | Constellation | Coverage | Best For |
|--------|--------------|----------|----------|
| GPS (USA) | 31 satellites | Global | General use |
| GLONASS (Russia) | 24 satellites | Global | High latitudes |
| Galileo (EU) | 30 satellites | Global | Accuracy |
| BeiDou (China) | 35 satellites | Asia-Pacific | Dense coverage |
| QZSS (Japan) | 4 satellites | Asia-Oceania | Urban canyons |
| SBAS | WAAS/EGNOS | Regional | Free corrections |

## GPS Module Selection

### Entry Level (Navigation only)

#### u-blox NEO-M8N
```
Specifications:
- Constellations: GPS, GLONASS, Galileo, BeiDou
- Update rate: Up to 10Hz
- Accuracy: 2.5m CEP
- Cost: $15-25

Cule-OS Parameters:
GPS_TYPE     1      # Auto-detect (u-blox)
GPS_RATE_MS  100    # 10Hz update
```

### Professional Level (RTK)

#### u-blox ZED-F9P
```
Specifications:
- Constellations: GPS, GLONASS, Galileo, BeiDou
- RTK: L1/L2 bands, multi-band
- Update rate: 20Hz RTK, 25Hz PVT
- Accuracy: 10mm + 1ppm (RTK), 1.5m (standalone)
- Cost: $150-250

Cule-OS Parameters:
GPS_TYPE          1      # u-blox
GPS_RATE_MS       50     # 20Hz
GPS_AUTO_CONFIG   1      # Auto-configure
```

## Cule-OS GPS Configuration

### Basic Setup

```
# GPS type selection
GPS_TYPE     1      # Auto-detect
GPS_RATE_MS  100    # Milliseconds (100 = 10Hz)

# GNSS constellation selection
GPS_GNSS_MODE 0     # Auto (module default)
```

### RTK Setup

```
# RTK base settings
GPS_INJECT_TO     127    # All GPS units
GPS_RTCM_FROM     1      # MAVLink source
```

## Troubleshooting

### No GPS Fix

```
Causes & Solutions:
1. Antenna not connected
   → Check antenna connector

2. First boot (cold start)
   → Wait 5-15 minutes for almanac download

3. Indoor operation
   → GPS requires outdoor sky view

4. Configuration issue
   → Reset to defaults: gps reset cold
```

## Reference

- [u-blox ZED-F9P Integration Manual](https://www.u-blox.com/en/product/zed-f9p-module)
