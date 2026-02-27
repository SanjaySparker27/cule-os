# Sensors

Cule OS supports a wide range of sensors for autonomous navigation, environmental monitoring, and vehicle state estimation.

## Sensor Overview

### Required Sensors

| Sensor | Purpose | Update Rate | Accuracy |
|--------|---------|-------------|----------|
| IMU | Attitude, acceleration, rotation | 1-8 kHz | ±0.5° |
| Magnetometer | Heading/orientation | 100 Hz | ±1° |
| Barometer | Altitude | 50 Hz | ±0.1m |
| GPS/GNSS | Global position | 10 Hz | ±1-3m |

### Optional Sensors

| Sensor | Purpose | Use Case |
|--------|---------|----------|
| LiDAR | Obstacle detection, mapping | Indoor, obstacle avoidance |
| Rangefinder | Precision altitude | Landing, terrain following |
| Optical Flow | Velocity, position hold | Indoor, GPS-denied |
| Airspeed | True airspeed | Fixed-wing aircraft |
| Current/Voltage | Power monitoring | Battery management |
| Temperature | Motor/battery monitoring | Thermal management |

## IMU (Inertial Measurement Unit)

### Supported IMUs

| IMU | Gyro Range | Accel Range | Output Rate | Interface |
|-----|------------|-------------|-------------|-----------|
| ICM-42688-P | ±2000°/s | ±16g | 32 kHz | SPI/I2C |
| ICM-20649 | ±4000°/s | ±32g | 9 kHz | SPI/I2C |
| ICM-20948 | ±2000°/s | ±16g | 9 kHz | SPI/I2C |
| ICM-45686 | ±2000°/s | ±16g | 32 kHz | SPI/I2C |
| BMI088 | ±2000°/s | ±24g | 2 kHz | SPI/I2C |

### IMU Configuration

```
ArduPilot IMU Setup
══════════════════════════════════════════════════════════════════

# View IMU health
cule-fc-status

# Calibrate accelerometers
# Place vehicle on each axis:
sudo cule-calibrate accel

# Calibrate gyros (vehicle must be still)
sudo cule-calibrate gyro

# Enable fast sampling (if supported)
param set INS_GYRO_RATE 0  # 0=1kHz, 1=2kHz, 2=4kHz, 3=8kHz

# Configure notch filter for motor noise
param set INS_HNTCH_ENABLE 1
param set INS_HNTCH_FREQ 100  # Motor frequency
param set INS_HNTCH_BW 50     # Bandwidth
```

### Multi-IMU Systems

```
Triple IMU Configuration (Pixhawk 6X)
══════════════════════════════════════════════════════════════════

IMU1: ICM-20649 (Primary)
  - 9 kHz gyro
  - High vibration tolerance
  - Used for: Primary attitude

IMU2: ICM-42688-P (Secondary)
  - 32 kHz gyro
  - Low noise
  - Used for: Fast response

IMU3: ICM-45686 (Tertiary)
  - 32 kHz gyro
  - Temperature stable
  - Used for: Backup, validation

Voting System:
- If 2 IMUs agree: Use consensus
- If all differ: Use most recent + warning
- Switch IMU on fault detection
```

## GPS/GNSS

### Supported GPS Modules

| Module | Constellations | Accuracy | Rate | RTK | Interface |
|--------|---------------|----------|------|-----|-----------|
| u-blox NEO-M8N | GPS+GLONASS+Galileo | 2.5m CEP | 10Hz | No | UART/I2C |
| u-blox NEO-M9N | GPS+GLONASS+Galileo+BeiDou | 2.0m CEP | 25Hz | No | UART/I2C |
| u-blox ZED-F9P | Multi-GNSS | 2.0m CEP | 25Hz | Yes | UART/I2C/SPI |
| Septentrio Mosaic-X5 | Multi-GNSS | 1.0m CEP | 20Hz | Yes | UART/SPI |
| Here3 (u-blox) | GPS+GLONASS+Galileo+BeiDou | 2.0m CEP | 10Hz | Yes | CAN |

### GPS Configuration

```bash
# Auto-detect GPS
param set GPS_TYPE 1  # Auto

# Or specify module:
param set GPS_TYPE 2  # u-blox NMEA
param set GPS_TYPE 5  # NMEA
param set GPS_TYPE 6  # u-blox
param set GPS_TYPE 9  # Septentrio

# Enable multiple constellations
param set GPS_GNSS_MODE 65  # GPS+GLONASS+Galileo

# Set update rate
param set GPS_RATE_MS 100  # 10Hz

# SBAS (WAAS/EGNOS)
param set GPS_SBAS_MODE 2  # Enabled
```

### RTK GPS Setup

```
RTK GPS Configuration
══════════════════════════════════════════════════════════════════

Base Station                    Rover (Vehicle)
───────────                     ───────────────

┌──────────┐                    ┌──────────┐
│  ZED-F9P │                    │  ZED-F9P │
│   Base   │                    │   Rover  │
└────┬─────┘                    └────┬─────┘
     │                               │
     │ RTCM3 corrections             │
     └──────────────┐                │
                    │                │
              ┌─────┴─────┐          │
              │ Radio/WiFi│          │
              │  Link     │◄─────────┤
              └─────┬─────┘          │
                    │                │
                    ▼                ▼
              ┌─────────────────────────┐
              │      Ground Station      │
              │    (Mission Planner)     │
              └─────────────────────────┘

Accuracy:
- Standard GPS: 2-3m
- RTK Fixed: 2cm + 1ppm

Base Requirements:
- Known position survey
- RTCM3 output
- Correction link (900MHz/2.4GHz radio, WiFi, 4G)
```

## Magnetometer (Compass)

### Supported Magnetometers

| Sensor | Range | Resolution | Interface | Notes |
|--------|-------|------------|-----------|-------|
| IST8310 | ±4800µT | 0.3µT | I2C | Common, reliable |
| QMC5883L | ±8000µT | 2mG | I2C | Budget option |
| RM3100 | ±800µT | 4nT | SPI/I2C | High precision |
| BMM150 | ±1300µT | 0.3µT | I2C | On Pixhawk 6X |
| AK09916 | ±4900µT | 0.15µT | I2C | ICM-20948 internal |

### Compass Calibration

```bash
# Compass calibration - essential for accurate heading
sudo cule-calibrate compass

# Process:
# 1. Hold vehicle level
# 2. Rotate 360° around vertical axis
# 3. Tilt nose up 45°, rotate 360°
# 4. Tilt nose down 45°, rotate 360°
# 5. Place on side, rotate 360°
# 6. Place on other side, rotate 360°

# Verify calibration
param show COMPASS_OFS*
param show COMPASS_DIA*
param show COMPASS_ODI*

# Enable compass use
param set COMPASS_USE 1
param set COMPASS_USE2 1  # Second compass
param set COMPASS_USE3 1  # Third compass

# Set declination (auto or manual)
param set COMPASS_DEC 0.15  # Radians, ~8.6°
# Or enable auto-declination
param set COMPASS_AUTODEC 1
```

### Compass Interference

```
Magnetic Interference Sources
══════════════════════════════════════════════════════════════════

Avoid placing compass near:
- Power wires (high current)
- ESCs (switching noise)
- Motors (magnets)
- Metal structures
- Video transmitters

Best Practices:
1. Mount GPS/compass on mast
2. Distance: 10-15cm from power wires
3. Use external GPS+compass module
4. Separate power and signal grounds
5. Use shielded cables

Interference Detection:
- COMPASS_* health in Cule OS
- Compare internal vs external compass
- Large difference indicates interference
```

## Barometer

### Supported Barometers

| Sensor | Range | Resolution | Accuracy | Interface |
|--------|-------|------------|----------|-----------|
| DPS310 | 300-1200hPa | 0.002hPa | ±0.006hPa | I2C/SPI |
| BMP388 | 300-1250hPa | 0.002hPa | ±0.008hPa | I2C/SPI |
| MS5611 | 10-1200hPa | 0.012hPa | ±0.05hPa | I2C/SPI |
| SPL06 | 300-1100hPa | 0.002hPa | ±0.006hPa | I2C/SPI |

### Barometer Configuration

```bash
# Primary altitude source
param set BARO_PRIMARY 0  # First barometer

# Enable filtering
param set BARO_EXT_BUS -1  # Internal
param set BARO_SPEC_GRAV 9.80665

# Altitude offset (if needed)
param set BARO_ALT_OFFSET 0

# Ground effect compensation
param set BARO_GND_EFFECT 1  # Enabled
```

## Rangefinders

### Supported Rangefinders

| Sensor | Range | Accuracy | Rate | Interface | Price |
|--------|-------|----------|------|-----------|-------|
| VL53L1X | 4m | ±5% | 50Hz | I2C | $ |
| TFMini Plus | 12m | ±5% | 100Hz | UART/I2C | $$ |
| TFMini-S | 12m | ±5% | 100Hz | UART/I2C | $$ |
| SF11/C | 120m | ±0.1m | 10Hz | UART/I2C | $$$ |
| LW20/C | 100m | ±0.1m | 20Hz | UART/I2C | $$$ |
| Garmin Lidar-Lite v3 | 40m | ±2.5cm | 270Hz | I2C/PWM | $$ |

### Rangefinder Setup

```bash
# Enable rangefinder
param set RNGFND1_TYPE 20  # TFMini-S
param set RNGFND1_TYPE 8   # LightWare SF11

# Serial configuration (for UART sensors)
param set SERIAL3_BAUD 115
param set SERIAL3_PROTOCOL 9  # Rangefinder

# I2C address (for I2C sensors)
param set RNGFND1_ADDR 0x29  # VL53L1X

# Min/Max range (meters)
param set RNGFND1_MIN_CM 20
param set RNGFND1_MAX_CM 1200  # 12m

# Orientation
param set RNGFND1_ORIENT 25  # Downward
# 0=Forward, 2=Back, 4=Up, 6=Down, 24-33=Custom

# Use for terrain following
param set TERRAIN_FOLLOW 1
param set WPNAV_RFND_USE 1  # Use in missions
```

## Optical Flow

### Supported Flow Sensors

| Sensor | Resolution | Range | Interface | Notes |
|--------|------------|-------|-----------|-------|
| PMW3901 | Motion tracking | 80mm - ∞ | SPI | Requires rangefinder |
| HereFlow | Motion + Lidar | 0.3-12m | CAN | All-in-one |
| PX4Flow | 752x480px | 0.3-4m | I2C/UART | Camera + flow |

### Optical Flow Setup

```bash
# Enable optical flow
param set FLOW_TYPE 7  # PMW3901

# Must have rangefinder for altitude
param set RNGFND1_TYPE 20  # TFMini-S
param set RNGFND1_ORIENT 25  # Down

# Calibrate flow sensor
# Place over textured surface, move manually

# Enable position hold without GPS
param set EK3_SRC1_POSXY 3  # Flow
param set EK3_SRC1_VELXY 3  # Flow
param set EK3_SRC1_POSZ 1   # Baro
param set EK3_SRC1_VELZ 3   # Flow
```

## Airspeed Sensors

### Supported Sensors

| Sensor | Range | Accuracy | Interface | Heating |
|--------|-------|----------|-----------|---------|
| MS4525DO | ±1psi | ±2.5% | I2C | No |
| MS5525 | ±1psi | ±1% | I2C | No |
| SDP33 | Differential | ±0.2% | I2C | No |
| EagleTree Airspeed v3 | ±1psi | ±1% | I2C | Optional |

### Airspeed Setup

```bash
# Enable airspeed sensor
param set ARSPD_TYPE 1  # Analog or I2C

# For MS4525 (I2C)
param set ARSPD_BUS 1
param set ARSPD_PIN -1

# Tube connection:
# Static → Static port (side of pitot)
# Dynamic → Dynamic port (front of pitot)

# Calibrate (vehicle still, no wind)
param set ARSPD_AUTOCAL 1  # Auto-zero

# Use for flight
param set ARSPD_USE 1  # Use in control
param set ARSPD_FBW_MIN 9  # Min speed (m/s)
param set ARSPD_FBW_MAX 22  # Max speed (m/s)
```

## Power Monitoring

### Battery Monitor Setup

```bash
# Analog voltage/current
param set BATT_MONITOR 4  # Voltage and current

# For Pixhawk power module
param set BATT_VOLT_PIN 0  # Pin 0 for Pixhawk
param set BATT_CURR_PIN 1  # Pin 1 for Pixhawk

# Voltage divider calibration
# Measure actual voltage with multimeter
# param set BATT_VOLT_MULT = measured / reported
param set BATT_VOLT_MULT 10.1  # Default for most modules

# Current sensor calibration
# Use amp meter during hover
param set BATT_AMP_PERVLT 39.877  # Default

# Battery capacity
param set BATT_CAPACITY 5000  # mAh
param set BATT_CRT_VOLT 14.0  # Critical (3.5V/cell)
param set BATT_LOW_VOLT 14.4  # Low (3.6V/cell)

# Failsafe actions
param set BATT_FS_LOW_ACT 2  # RTL
param set BATT_FS_CRT_ACT 1  # Land
```

## Sensor Calibration Checklist

```
Pre-Flight Sensor Calibration
══════════════════════════════════════════════════════════════════

□ Accelerometer
  - Vehicle on level surface
  - Calibrate on all 6 faces
  - Verify level indication in QGC

□ Compass
  - Away from metal objects
  - 6-axis rotation (level, nose up/down, sides)
  - Verify heading matches known direction

□ Gyro
  - Vehicle stationary
  - Auto-calibrates on boot

□ Barometer
  - Automatic, no user action
  - Verify altitude reads near 0 on ground

□ GPS
  - 3D fix required (8+ satellites)
  - Verify position on map

□ Rangefinder (if installed)
  - Clear view to ground
  - Verify distance reading

□ Optical Flow (if installed)
  - Textured surface below
  - Move vehicle manually, verify flow

□ Airspeed (fixed-wing)
  - Pitot tubes connected correctly
  - Calibrate at zero wind
```

## Troubleshooting

### Sensor Health Checks

```bash
# View all sensor status
cule-sensor-status

# Output example:
# IMU 1: HEALTHY, 1000Hz, Temp 45°C
# IMU 2: HEALTHY, 1000Hz, Temp 47°C
# Compass 1: HEALTHY, heading 245°
# GPS: 3D Fix, 12 sats, HDOP 0.8
# Barometer: HEALTHY, 1013.2 hPa

# Check specific sensor
mavproxy.py --master=/dev/ttyACM0
sensor status
```

### Common Issues

**Accelerometer calibration fails**
```
Solution:
1. Ensure vehicle is perfectly still on each face
2. Try slower rotation between positions
3. Check for loose IMU mounting
```

**Compass interference**
```
Solution:
1. Move GPS/compass away from power wires
2. Use external compass only
3. Disable internal compass
   param set COMPASS_USE 0
   param set COMPASS_USE2 1  # External only
```

**GPS no fix**
```
Solution:
1. Wait 2-3 minutes for cold start
2. Ensure clear view of sky
3. Check antenna connection
4. Verify GPS module is powered (LED)
```

## See Also

- [GPS/GNSS](./gps.md) - Detailed GPS documentation
- [IMU](./imu.md) - Inertial measurement units
- [LiDAR](./lidar.md) - LiDAR integration
- [Rangefinders](./rangefinders.md) - Distance sensors
