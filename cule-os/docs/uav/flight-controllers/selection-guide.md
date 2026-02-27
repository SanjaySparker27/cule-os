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
- ~$50-80

Key requirements:
- Size: 20x20mm or 30.5x30.5mm mounting
- Weight: <15g
- Gyro: ICM-42688-P or BMI270
- ESC compatibility: DShot 1200, PWM

#### Photography / Cinematography Drones
**Recommended: Pixhawk 6X or Cube Orange**
- Triple redundant IMU
- Multiple camera trigger outputs
- Gimbal control support
- SD card for logging
- Ethernet for HD video

Key requirements:
- Gimbal control (SBUS, UART)
- Camera trigger (PWM, GPIO, relay)
- Multiple GPS for accuracy
- Geotagging capability

#### Surveying / Mapping Drones
**Recommended: Cube Orange+ or Pixhawk 6X**
- RTK/PPK support
- High-rate logging (400Hz)
- Multiple IMU redundancy
- Ethernet for companion computer

Key requirements:
- RTK GPS support (ZED-F9P)
- Hotshoe trigger input
- Large log storage
- CAN bus for peripherals

#### Industrial / Commercial UAVs
**Recommended: Cube Orange+**
- Dual IMU heating
- Triple CAN bus
- Ethernet + USB
- Certified design (CE, FCC)

Key requirements:
- Redundancy (dual GPS, dual power)
- Long-range telemetry
- ADS-B integration
- Advanced failsafes

### 2. Processing Requirements

```
Application          CPU Load    Recommended
────────────────────────────────────────────
Basic stabilization   5-10%      Any F4/F7/H7
Altitude hold        10-15%      Any F7/H7
Position hold        15-25%      F7/H7
Autonomous missions  25-40%      H7 recommended
Computer vision      40-60%      H7 + companion
SLAM / AI onboard    60-100%     Companion computer
```

### 3. Sensor Redundancy Needs

| Application | IMU | GPS | Baro | Compass | Power |
|-------------|-----|-----|------|---------|-------|
| Hobby/Racing | 1 | 1 | 1 | 1 | 1 |
| Photography | 1-2 | 1 | 1 | 1 | 1 |
| Surveying | 2-3 | 2 | 2 | 1-2 | 1-2 |
| BVLOS Commercial | 3 | 2+ | 2 | 2 | 2 |
| Critical payload | 3 | 2+ | 2 | 2 | 2+ |

## Detailed Controller Analysis

### DAKE FPV H743 Pro

**Best for:** FPV racing, freestyle, budget builds

**Specifications:**
- MCU: STM32H743 (480MHz)
- Gyro: ICM-42688-P
- Baro: DPS310
- OSD: AT7456E
- Blackbox: 16MB flash
- BEC: 5V/2A, 9V/2A

**Pros:**
- Very affordable
- High-performance H7 processor
- Integrated OSD
- Good Betaflight/Cule-OS support

**Cons:**
- Single IMU (no redundancy)
- Limited UARTs (4)
- No CAN bus
- Consumer-grade reliability

**Typical Build:**
```
Frame: 5" freestyle
ESC: 45A 4-in-1
Motors: 2306 1750KV
Camera: Caddx Vista
Total cost: ~$300-400
```

### Pixhawk 4 Mini

**Best for:** Mini quads (<7"), education, prototyping

**Specifications:**
- MCU: STM32F765 (216MHz)
- IMU: Dual ICM-20689
- Baro: 1x MS5611
- PWM: 14 outputs
- UART: 4 ports

**Pros:**
- Compact (43x66mm)
- PX4/Cule-OS native support
- Good documentation
- Moderate price

**Cons:**
- Limited processing power
- No Ethernet
- Only dual IMU
- Limited expansion

**Typical Build:**
```
Frame: 450mm quad
Motors: 2212 920KV
Props: 10x4.5
Battery: 4S 5000mAh
Total cost: ~$400-600
```

### Pixhawk 4

**Best for:** Research, general aviation, hobby projects

**Specifications:**
- MCU: STM32F765 (216MHz)
- IMU: Triple ICM-20689
- Baro: 2x MS5611
- PWM: 16 outputs
- CAN: 2 ports

**Pros:**
- Triple IMU
- Dual barometer
- Good peripheral support
- Established ecosystem

**Cons:**
- F7 processor (older)
- No native Ethernet
- Larger than mini options

### Cube Orange

**Best for:** Commercial operations, mapping, cinematography

**Specifications:**
- MCU: STM32H743 (480MHz)
- IMU: Triple (ICM-20948, ICM-20649, BMI088)
- Baro: 2x MS5611
- Heated IMU
- Modular design

**Pros:**
- Triple redundant IMU
- Vibration isolation
- Temperature-controlled
- Excellent reliability

**Cons:**
- Higher cost
- Requires carrier board
- Complex setup

**Typical Build:**
```
Frame: Matrice 600 class
Motors: U8 KV100
Props: 28"
Payload: 5kg
Endurance: 45min
Total cost: ~$5000-8000
```

### Cube Orange+

**Best for:** BVLOS operations, industrial inspection, cargo delivery

**Specifications:**
- MCU: STM32H743 (480MHz)
- IMU: Triple + heating
- Ethernet: 10/100M
- USB: USB-C
- Triple CAN

**Pros:**
- Native Ethernet
- Advanced connectivity
- Best-in-class redundancy
- Future-proof

**Cons:**
- Expensive
- Overkill for hobby use
- Complex configuration

### Pixhawk 6X

**Best for:** Professional applications needing Ethernet

**Specifications:**
- MCU: STM32H753 (480MHz)
- IMU: Triple isolated
- Ethernet: Yes
- CAN: 3 ports

**Pros:**
- Triple IMU with isolation
- Ethernet built-in
- 3x CAN bus
- Competitive price

**Cons:**
- Less vibration isolation than Cube
- Newer (less community support)

## Cule-OS Compatibility Matrix

| Feature | DAKE H743 | PH4 Mini | PH4 | Cube Orange | PH6X |
|---------|-----------|----------|-----|-------------|------|
| Full Support | ✅ | ✅ | ✅ | ✅ | ✅ |
| SD Logging | ⚠️ 16MB | ✅ | ✅ | ✅ | ✅ |
| Ethernet | ❌ | ❌ | ❌ | ✅+ | ✅ |
| CAN Bus | ❌ | ❌ | ✅ | ✅ | ✅ |
| Triple IMU | ❌ | ⚠️ Dual | ✅ | ✅ | ✅ |
| Heated IMU | ❌ | ❌ | ❌ | ✅ | ❌ |
| Lua Scripting | ✅ | ✅ | ✅ | ✅ | ✅ |

## Decision Flowchart

```
Start
  │
  ▼
Budget < $100? ──Yes──► DAKE FPV H743 Pro
  │ No
  ▼
Need Ethernet? ──Yes──► Cube Orange+ or Pixhawk 6X
  │ No
  ▼
Commercial operation? ──Yes──► Cube Orange
  │ No
  ▼
Need redundancy? ──Yes──► Pixhawk 4 or 6X
  │ No
  ▼
Size constraint? ──Yes──► Pixhawk 4 Mini
  │ No
  ▼
Research/Education? ──Yes──► Pixhawk 4
  │ No
  ▼
FPV Racing? ──Yes──► DAKE FPV H743 Pro
  │
  ▼
Default: Pixhawk 4
```

## Vendor Links

- **Holybro** (Pixhawk): https://holybro.com
- **Hex/ProfiCNC** (Cube): https://www.cubepilot.org
- **DAKE FPV**: https://dakefpv.com
- **mRobotics**: https://mrobotics.io
- **CUAV**: https://www.cuav.net

## Next Steps

After selecting your flight controller:

1. [Install QGroundControl](../qgc/setup.md)
2. [Flash Cule-OS firmware](../flight-controllers/pixhawk.md#flashing-firmware)
3. [Configure sensors](../calibration/sensor-calibration.md)
4. [Perform pre-flight checks](../checklists/pre-flight.md)
