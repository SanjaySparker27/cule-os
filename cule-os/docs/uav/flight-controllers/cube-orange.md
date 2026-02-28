# Cube Orange Flight Controller

## Overview

The Cube Orange is a professional-grade flight controller developed by Hex/ProfiCNC, featuring the STM32H743 processor and triple redundant IMU sensors. It's the flagship controller for commercial and industrial UAV applications.

## Specifications

| Feature | Specification |
|---------|---------------|
| Processor | STM32H743 (Cortex-M7, 480 MHz) |
| RAM | 1 MB |
| Flash | 2 MB |
| IMU Configuration | Triple redundant, vibration-isolated |
| Primary IMU | ICM-20948 (9-DOF) |
| Secondary IMU | ICM-20649 (6-DOF) |
| Tertiary IMU | BMI088 (6-DOF) |
| Barometers | 2x MS5611 |
| Magnetometer | RM3100 (external via GPS) |
| UART Ports | 5 (Serial 0-4) |
| CAN Bus | 2 |
| I2C Buses | 2 |
| SPI Buses | 1 (internal) |
| PWM Outputs | 14 (8 main + 6 aux) |
| Analog Inputs | 3 (battery, current, RSSI) |
| USB | Micro USB 2.0 |
| SD Card | Yes (up to 32GB) |
| Dimensions | 38.5mm x 38.5mm x 22.4mm (Cube only) |
| Weight | 38g (Cube only), ~100g (carrier board) |

## Hardware Architecture

### The Cube Concept

The Cube Orange follows a modular "Cube" design:

```
┌─────────────────────────────────────┐
│           Cube Module               │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │IMU0 │ │IMU1 │ │IMU2 │           │
│  │ICM  │ │ICM  │ │BMI  │           │
│  │20948│ │20649│ │088  │           │
│  └─────┘ └─────┘ └─────┘           │
│       STM32H743 Processor           │
│          480 MHz                    │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│        Carrier Board                │
│  Power, Connectors, Peripherals     │
│  PWM, UART, CAN, I2C, ADC, USB      │
└─────────────────────────────────────┘
```

This separation allows:
- **Easy IMU isolation** - Cube is vibration-dampened
- **Carrier flexibility** - Same Cube, different carriers for different vehicles
- **Thermal management** - Heated IMU for consistent performance
- **Future upgrades** - Swap Cube without rewiring

## Carrier Board Pinouts

### Standard Carrier Board

#### TELEM1 (JST GH 6-pin)
```
Pin  Signal    Description
1    VCC_5V    5V output (max 1A)
2    TX_3.3V   Serial TX (3.3V logic)
3    RX_3.3V   Serial TX (3.3V logic)
4    CTS       Hardware flow control
5    RTS       Hardware flow control
6    GND       Ground
```

#### POWER1 (DF13 6-pin)
```
Pin  Signal      Voltage Range    Description
1    VCC_5V      4.5-5.5V         Power input
2    VCC_5V      4.5-5.5V         Power input
3    CURRENT     0-3.3V           Current sense (90A max typical)
4    VOLTAGE     0-3.3V           Voltage sense (3S-6S typical)
5    GND         -                Ground
6    GND         -                Ground
```

## Cule-OS Configuration

### Building for Cube Orange

```bash
# Clean build
cd cule-os
make clean

# Build for Cube Orange
make BOARD=cubepilot_cubeorange
```

### IMU Configuration

```
# Enable all IMUs
INS_ENABLE_MASK    7      # Enable IMU 0,1,2
INS_USE            1      # Use IMU 1 for EKF
INS_USE2           1      # Use IMU 2 for EKF
INS_USE3           1      # Use IMU 3 for EKF

# Temperature control
BRD_HEAT_TARG      45     # Target temperature (Celsius)
BRD_HEAT_P         50     # Heater P gain
BRD_HEAT_I         0.2    # Heater I gain
```

## Reference

- [Cube Orange User Manual](https://docs.cubepilot.org/)
- [Hex ProfiCNC Product Page](https://www.cubepilot.org)
