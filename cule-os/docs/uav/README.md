# UAV Documentation

Welcome to the comprehensive UAV (Unmanned Aerial Vehicle) documentation for Cule-OS. This guide covers everything needed to build, configure, and operate professional-grade drones using Cule-OS.

## Table of Contents

1. [Flight Controllers](./flight-controllers/)
   - [Pixhawk Series](./flight-controllers/pixhawk.md)
   - [Cube Orange](./flight-controllers/cube-orange.md)
   - [Hardware Selection Guide](./flight-controllers/selection-guide.md)

2. [Sensors](./sensors/)
   - [GPS/GNSS](./sensors/gps.md)
   - [IMU](./sensors/imu.md)
   - [Compass](./sensors/compass.md)
   - [Barometer](./sensors/barometer.md)
   - [LIDAR & Rangefinders](./sensors/rangefinder.md)

3. [Calibration](./calibration/)
   - [Sensor Calibration](./calibration/sensor-calibration.md)
   - [Radio Calibration](./calibration/radio-calibration.md)
   - [ESC Calibration](./calibration/esc-calibration.md)

4. [Checklists](./checklists/)
   - [Pre-flight Checklist](./checklists/pre-flight.md)
   - [Post-flight Checklist](./checklists/post-flight.md)

5. [Emergency Procedures](./emergency/)
   - [Emergency Procedures](./emergency/emergency-procedures.md)
   - [Failsafe Configuration](./emergency/failsafe.md)

6. [MAVLink Integration](./mavlink/)
   - [MAVLink Protocol](./mavlink/protocol.md)
   - [Message Reference](./mavlink/messages.md)

7. [QGroundControl](./qgc/)
   - [Setup Guide](./qgc/setup.md)
   - [Configuration](./qgc/configuration.md)

8. [Tuning Guides](./tuning/)
   - [PID Tuning](./tuning/pid-tuning.md)
   - [Filter Configuration](./tuning/filters.md)

## Quick Start

New to Cule-OS UAV? Start here:

1. [Hardware Selection Guide](./flight-controllers/selection-guide.md) - Choose the right flight controller
2. [QGroundControl Setup](./qgc/setup.md) - Install and configure ground control software
3. [Sensor Calibration](./calibration/sensor-calibration.md) - Calibrate your drone's sensors
4. [Pre-flight Checklist](./checklists/pre-flight.md) - Essential pre-flight checks
5. [PID Tuning Basics](./tuning/pid-tuning.md) - Optimize flight performance

## Supported Hardware

### Flight Controllers
- Pixhawk 4 / 4 Mini
- Pixhawk 6X / 6C
- Cube Orange / Orange+
- Cube Blue H7
- DAKE FPV H743 Pro
- Custom H743-based boards

### Sensors
- u-blox NEO-M8N, NEO-M9N, ZED-F9P
- RM3100, IST8310, AK09918 compasses
- BMP280, BMP388, DPS310 barometers
- ICM-20689, ICM-42688-P, BMI088 IMUs
- TFmini, LW20, VL53L0X rangefinders

## Getting Help

- [Cule-OS GitHub Issues](https://github.com/cule-os/issues)
- [MAVLink Documentation](https://mavlink.io)
- [PX4 User Guide](https://docs.px4.io)
- [ArduPilot Wiki](https://ardupilot.org)

## Safety Notice

⚠️ **Always follow local regulations and safety guidelines when operating UAVs. Maintain visual line of sight, respect no-fly zones, and ensure proper insurance coverage.**
