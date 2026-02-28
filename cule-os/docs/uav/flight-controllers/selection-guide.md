# Flight Controller Selection Guide

## Overview

Choosing the right flight controller is critical for mission success. This guide helps you select the optimal hardware for your specific application.

## Quick Reference Table

| Controller | Processor | Best For | Price Range | Difficulty |
|------------|-----------|----------|-------------|------------|
| DAKE FPV H743 Pro | H743 | Racing, freestyle | $ | Easy |
| Pixhawk 4 Mini | F765 | Mini quads, entry level | $$ | Easy |
| Pixhawk 4 | F765 | General purpose, research | $$ | Medium |
| Cube Orange | H743 | Commercial, mapping | $$$ | Medium |
| Cube Orange+ | H743 | Industrial, BVLOS | $$$$ | Advanced |
| Pixhawk 6X | H753 | Professional, redundant | $$$ | Advanced |

## Selection Criteria

### 1. Vehicle Type

#### Racing / Freestyle Drones (5"-7")
**Recommended: DAKE FPV H743 Pro**
- Compact design (30.5x30.5mm)
- Integrated ESC support
- 480MHz H7 processor
- Direct Betaflight/Cule-OS support

#### Photography / Cinematography Drones
**Recommended: Pixhawk 6X or Cube Orange**
- Triple redundant IMU
- Multiple camera trigger outputs
- Gimbal control support
- SD card for logging

#### Surveying / Mapping Drones
**Recommended: Cube Orange+ or Pixhawk 6X**
- RTK/PPK support
- High-rate logging (400Hz)
- Multiple IMU redundancy
- Ethernet for companion computer

#### Industrial / Commercial UAVs
**Recommended: Cube Orange+**
- Dual IMU heating
- Triple CAN bus
- Ethernet + USB
- Certified design (CE, FCC)

## Cule-OS Compatibility Matrix

| Feature | DAKE H743 | PH4 Mini | PH4 | Cube Orange | PH6X |
|---------|-----------|----------|-----|-------------|------|
| Full Support | ✅ | ✅ | ✅ | ✅ | ✅ |
| SD Logging | ⚠️ 16MB | ✅ | ✅ | ✅ | ✅ |
| Ethernet | ❌ | ❌ | ❌ | ✅+ | ✅ |
| CAN Bus | ❌ | ❌ | ✅ | ✅ | ✅ |
| Triple IMU | ❌ | ⚠️ Dual | ✅ | ✅ | ✅ |
| Heated IMU | ❌ | ❌ | ❌ | ✅ | ❌ |

## Next Steps

After selecting your flight controller:

1. [Install QGroundControl](../qgc/setup.md)
2. [Flash Cule-OS firmware](../flight-controllers/pixhawk.md#flashing-firmware)
3. [Configure sensors](../calibration/sensor-calibration.md)
4. [Perform pre-flight checks](../checklists/pre-flight.md)
