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
- Sensitivity: -167 dBm
- Protocol: NMEA, UBX
- Interface: UART, I2C, SPI, USB
- Cost: $15-25

Cule-OS Parameters:
GPS_TYPE     1      # Auto-detect (u-blox)
GPS_RATE_MS  100    # 10Hz update
GPS_GNSS_MODE 0     # GPS+GLONASS (default)
```

#### u-blox NEO-M9N
```
Specifications:
- Constellations: GPS, GLONASS, Galileo, BeiDou
- Update rate: Up to 25Hz
- Accuracy: 1.5m CEP
- Sensitivity: -167 dBm
- Protocol: NMEA, UBX
- Interface: UART, I2C, DDC
- Cost: $20-35

Cule-OS Parameters:
GPS_TYPE     1      # Auto-detect (u-blox)
GPS_RATE_MS  40     # 25Hz update
GPS_GNSS_MODE 67    # All constellations
```

### Professional Level (RTK)

#### u-blox ZED-F9P
```
Specifications:
- Constellations: GPS, GLONASS, Galileo, BeiDou
- RTK: L1/L2 bands, multi-band
- Update rate: 20Hz RTK, 25Hz PVT
- Accuracy: 10mm + 1ppm (RTK), 1.5m (standalone)
- Protocol: NMEA, UBX, RTCM3
- Interface: UART x2, I2C, SPI, USB
- Cost: $150-250

Cule-OS Parameters:
GPS_TYPE          1      # u-blox
GPS_RATE_MS       50     # 20Hz
GPS_AUTO_CONFIG   1      # Auto-configure
GPS_SAVE_CFG      1      # Save configuration

# RTK base settings
GPS_INJECT_TO     127    # All GPS units
GPS_RTCM_FROM     1      # MAVLink source
```

### Compass Integration

Most GPS modules include an integrated magnetometer (compass):

```
GPS Module Compass Options:
- HMC5883L / QMC5883L (older modules)
- IST8310 (common in Here GPS)
- RM3100 (Cube GPS, high accuracy)
- AK09918 (LIS3MDL alternative)

Cule-OS Parameters:
COMPASS_TYPEMASK  0      # Enable all compasses
COMPASS_PRIO1_ID  0      # Auto-detect
COMPASS_USE       1      # Use compass 1
COMPASS_USE2      1      # Use compass 2 (if available)
```

## Wiring and Pinouts

### Standard GPS Module (6-pin JST GH)

```
Pin  Signal      Description
1    VCC_5V      Power input (5V ±5%)
2    TX_3.3V     Module TX → FC RX
3    RX_3.3V     Module RX ← FC TX
4    SCL_3.3V    Compass I2C clock
5    SDA_3.3V    Compass I2C data
6    GND         Ground

Typical wire colors:
- Red:    VCC
- Yellow: TX
- Green:  RX
- White:  SCL
- Blue:   SDA
- Black:  GND
```

### Multi-GNSS Antenna Requirements

```
Antenna Type          Bands          Use Case
────────────────────────────────────────────────
Passive patch         L1             Budget modules
Active patch          L1, L5         Standard GPS
Helical               L1, L2         RTK rover
Survey-grade          L1, L2, L5     RTK base

Active antenna power: 3.3V @ 15mA typical
DC bias: Provided by GPS module
Impedance: 50Ω
```

## Cule-OS GPS Configuration

### Basic Setup

```
# GPS type selection
GPS_TYPE     1      # Auto-detect
# 0  = None
# 1  = Auto-detect
# 2  = u-blox
# 5  = NMEA
# 6  = SiRF
# 9  = MTK
# 11 = u-blox moving baseline
# 19 = MSP

# Update rate
GPS_RATE_MS  100    # Milliseconds (100 = 10Hz)

# Protocol selection
GPS_PROTOCOL 1      # u-blox UBX
# 0 = NMEA
# 1 = UBX

# GNSS constellation selection
GPS_GNSS_MODE 0     # Auto (module default)
# Bitmask: 1=GPS, 4=GLONASS, 8=BeiDou, 16=Galileo, 64=QZSS
# GPS+GLONASS = 5
# GPS+Galileo = 17
# GPS+GLONASS+Galileo+BeiDou = 29
```

### Advanced Configuration

```
# Auto-configuration
GPS_AUTO_CONFIG  1      # Enable automatic config
GPS_SAVE_CFG     1      # Save to module flash
GPS_SBAS_MODE    2      # Enable SBAS

# Dual GPS setup
GPS_TYPE2        1      # Second GPS
GPS_BLEND_MASK   5      # Blend on position and speed
GPS_BLEND_TC     10     # Time constant (seconds)

# RTK injection
GPS_RTCM_FROM    1      # MAVLink RTCM source
GPS_RTCM_CUTOFF  5      # Minimum satellite count
```

## GPS Accuracy and Performance

### Accuracy Metrics

```
Standalone (no corrections):
- GPS only:        3-5 meters CEP
- Multi-GNSS:      2-3 meters CEP
- With SBAS:       1-2 meters CEP

RTK (corrections applied):
- Float solution:  0.5-2 meters
- Fixed solution:  1-3 centimeters

CEP = Circular Error Probable (50% of measurements)
```

### Factors Affecting Accuracy

```
1. Satellite geometry (DOP - Dilution of Precision)
   HDOP < 1.0  = Excellent
   HDOP 1-2    = Good
   HDOP 2-5    = Fair
   HDOP > 5    = Poor (do not fly)

2. Multipath (signal reflection)
   - Avoid flying near buildings
   - Keep away from metal surfaces
   - Use ground planes on antennas

3. Atmospheric conditions
   - Ionospheric delay (daytime worse)
   - Tropospheric delay (humidity)
   - Cannot be fully corrected

4. Receiver quality
   - Chipset architecture
   - Number of tracking channels
   - Antenna quality
```

## RTK (Real-Time Kinematic)

### RTK Setup for Cule-OS

#### Base Station Configuration

```
Hardware requirements:
- u-blox ZED-F9P module
- Survey-grade antenna
- Clear sky view
- Known position or auto-survey

Cule-OS Base Parameters:
GPS_TYPE         1       # u-blox
GPS_RATE_MS      50      # 20Hz
GPS_INJECT_TO    0       # Do not inject (this is base)
GPS_RTCM_FROM    1       # Output RTCM

# Survey-in mode (for base position)
GPS_BASE_POS_X   0       # Auto-survey or enter ECEF
GPS_BASE_POS_Y   0
GPS_BASE_POS_Z   0
GPS_BASE_STDY    60      # Survey-in time (seconds)
GPS_BASE_ACCUR   2000    # Target accuracy (mm)
```

#### Rover Configuration

```
Cule-OS Rover Parameters:
GPS_TYPE         1       # u-blox
GPS_RATE_MS      50      # 20Hz
GPS_INJECT_TO    127     # Inject to this GPS

# Moving baseline (dual GPS on same vehicle)
GPS_TYPE2        11      # u-blox moving baseline
GPS_MB1_TYPE     1       # Rover role
GPS_MB2_TYPE     2       # Base role
```

### RTCM Correction Sources

```
1. Local base station (most accurate)
   - Range: 10-20km typical
   - Setup: Base at known location
   - Latency: <1 second

2. NTRIP caster service
   - Examples: RTK2GO, Emlid Caster, local CORS
   - Range: Varies by network
   - Cost: Free to subscription

3. L-band correction (e.g., PointPerfect)
   - Coverage: Continental
   - Accuracy: 3-5cm
   - Cost: Subscription
```

## Dual GPS Setup

### Benefits of Dual GPS

```
1. Redundancy
   - Failover if one GPS fails
   - Blended solution for accuracy

2. Yaw estimation (moving baseline)
   - Calculate heading without compass
   - Immune to magnetic interference

3. RTK + Standard backup
   - RTK for precision
   - Standard GPS as fallback
```

### Dual GPS Configuration

```
Physical setup:
- GPS1 (primary): Default location
- GPS2 (secondary): Offset by known distance

Cule-OS Parameters:
GPS_TYPE         1       # Primary GPS
GPS_TYPE2        1       # Secondary GPS

# Blending options
GPS_BLEND_MASK   5       # Blend position and speed
# Bitmask: 1=position, 2=velocity, 4=speed accuracy

GPS_AUTO_SWITCH  1       # Auto switch on failure
# 0 = Use best
# 1 = Blend
# 2 = Use primary unless fails
```

## GPS Health Monitoring

### MAVLink Status Messages

```
Check GPS health:
# In QGroundControl MAVLink console
gps status

Expected output:
GPS 1: u-blox
  status: OK
  satellites: 18
  HDOP: 0.8
  position: 33.1234567 -117.1234567 100.5
  velocity: 0.0 0.0 0.0
  course: 0.0

GPS 2: u-blox
  status: OK
  satellites: 16
  HDOP: 1.0
```

### LED Indicators

```
Module LED Behavior:
- Off:      No power
- Solid:    Searching satellites
- Blinking: 3D fix acquired
- Fast blink: RTK fixed

Standard Here GPS:
- Blue solid:  Power on, no fix
- Blue blink:  2D fix
- Green blink: 3D fix
- White blink: RTK float
- Green solid: RTK fixed
```

## Troubleshooting

### No GPS Fix

```
Symptoms: GPS shows 0 satellites, "No GPS"

Causes & Solutions:
1. Antenna not connected
   → Check antenna connector (u.fl or SMA)

2. First boot (cold start)
   → Wait 5-15 minutes for almanac download
   → Keep clear sky view

3. Indoor operation
   → GPS requires outdoor sky view
   → May get 2D fix near windows

4. Damaged antenna
   → Test with known good antenna
   → Check for kinks in cable

5. Configuration issue
   → Reset to defaults: gps reset cold
   → Check GPS_TYPE parameter
```

### Poor Accuracy / High HDOP

```
Symptoms: HDOP > 5, position jumps

Causes & Solutions:
1. Poor satellite visibility
   → Check for obstructions
   → Move to open area
   → Wait for better geometry

2. Interference
   → Keep GPS away from cameras
   → Distance from VTX (100mm+)
   → Shield with copper tape

3. Multipath
   → Avoid flying near buildings
   → Use choke ring antenna

4. Bad antenna
   → Replace antenna
   → Check ground plane
```

### Compass Interference

```
Symptoms: Compass variance warnings, toilet bowling

Causes & Solutions:
1. GPS module too close to power wires
   → Maintain 50mm+ from ESCs
   → Twist power wires

2. Metal interference
   → Check for carbon fiber nearby
   → Keep away from motors

3. Calibration needed
   → Perform compass calibration
   → Check COMPASS_OFFS values

4. Bad compass in GPS module
   → Disable: COMPASS_TYPEMASK += bitmask
   → Use external compass only
```

## Integration Examples

### Standard Quad Setup

```
GPS Module Mounting:
- Position: Top of frame, center
- Height: 100mm+ above electronics
- Orientation: Arrow forward, level
- Clearance: No obstructions 30° from vertical

Wiring:
GPS Module ────────► Flight Controller
VCC (red)    ───► 5V
GND (black)  ───► GND
TX (green)   ───► GPS_RX
RX (yellow)  ───► GPS_TX
SCL (blue)   ───► SCL
SDA (white)  ───► SDA
```

### RTK Mapping Setup

```
Base Station:
- Position: Known survey point
- Antenna: Tripod mounted, 2m height
- Radio: 915MHz/433MHz telemetry
- Power: Battery or AC adapter

Rover (Drone):
- GPS1: ZED-F9P for position
- GPS2: ZED-F9P for yaw (offset 300mm)
- Telemetry: Receive RTCM from base
- Logging: Full rate for PPK backup
```

## Reference

- [u-blox ZED-F9P Integration Manual](https://www.u-blox.com/en/product/zed-f9p-module)
- [RTKLIB Manual](http://www.rtklib.com)
- [CORS Network Information](https://www.ngs.noaa.gov/CORS/)
