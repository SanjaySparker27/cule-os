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

#### TELEM2, GPS, SERIAL4/5 (JST GH 6-pin)
Same pinout as TELEM1

#### I2C (JST GH 4-pin)
```
Pin  Signal      Description
1    VCC_5V      5V output (max 1A)
2    SDA_3.3V    I2C data
3    SCL_3.3V    I2C clock
4    GND         Ground
```

#### CAN1, CAN2 (JST GH 4-pin)
```
Pin  Signal      Description
1    VCC_5V      5V output (max 1A)
2    CAN_H       CAN high signal
3    CAN_L       CAN low signal
4    GND         Ground
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

#### PWM Outputs (2.54mm headers)
```
Main Outputs (8 channels):
┌─────────────────────────────┐
│ 1  2  3  4  5  6  7  8  GND │
│ S  S  S  S  S  S  S  S   -  │
│ +  +  +  +  +  +  +  +   -  │
└─────────────────────────────┘
S = Signal, + = 5V (optional), GND = Ground

AUX Outputs (6 channels):
┌─────────────────────────┐
│ 9  10 11 12 13 14  GND  │
│ S  S  S  S  S  S    -   │
│ +  +  +  +  +  +    -   │
└─────────────────────────┘
```

#### ADC Inputs (3-pin header)
```
Pin  Signal    Description
1    VCC_5V    5V reference
2    ADC_IN    Analog input (0-3.3V)
3    GND       Ground

ADC channels:
- ADC6: Pin 15 on main servo rail
- ADC7: Pin 14 on aux servo rail
- RSSI: Dedicated RSSI input
```

#### USB Port
- Micro USB 2.0
- Used for firmware flashing and MAVLink connection
- Power: 5V from USB
- Data rate: Up to 12 Mbps

### Edison Carrier Board (Advanced)

The Edison carrier adds:
- Intel Edison compute module socket
- Additional UART ports
- HDMI output support
- Ethernet (via USB adapter)

## IMU Configuration

### Triple Redundancy Modes

```
Mode 0: Primary only (ICM-20948)
Mode 1: Auto-failover (switch on fault detection)
Mode 2: Voting (2 of 3 consensus)
Mode 3: Blended (weighted average of all three)
```

### Cule-OS Configuration

```
# IMU selection
INS_ENABLE_MASK    7      # Enable all 3 IMUs
INS_USE            1      # Use IMU 1 for EKF
INS_USE2           1      # Use IMU 2 for EKF
INS_USE3           1      # Use IMU 3 for EKF

# Sampling rates
INS_GYRO_RATE      1000   # 1kHz gyro sampling
INS_ACCEL_RATE     1000   # 1kHz accel sampling

# Vibration isolation
INS_GYRO_FILTER    20     # Gyro low-pass filter (Hz)
INS_ACCEL_FILTER   20     # Accel low-pass filter (Hz)

# Temperature control
BRD_HEAT_TARG      45     # Target temperature (Celsius)
BRD_HEAT_P         50     # Heater P gain
BRD_HEAT_I         0.2    # Heater I gain
```

### IMU Vibration Analysis

Check vibration levels:
```bash
# In MAVLink console
vibration

# Expected values:
# Vibe X: < 30 (good), < 60 (acceptable), > 60 (investigate)
# Vibe Y: < 30 (good), < 60 (acceptable), > 60 (investigate)
# Vibe Z: < 15 (good), < 30 (acceptable), > 30 (investigate)
```

## Power System

### Power Brick Configuration

The Cube uses the standard Pixhawk power brick:

```
Specifications:
- Input voltage: 2S-6S LiPo (7.4V - 25.2V)
- Max continuous current: 90A
- Current sense resolution: ~60mA/bit
- Voltage sense resolution: ~52mV/bit
```

Calibration procedure:
```bash
# Measure actual battery voltage with multimeter
# Enter measured value in QGroundControl
# Or set parameters:
BAT1_VOLT_MULT    10.1     # Adjust for voltage accuracy
BAT1_AMP_PERVLT   24.0     # Adjust for current accuracy

# Battery monitoring setup
BAT1_MONITOR      4        # Analog voltage and current
BAT1_VOLT_PIN     14       # ADC pin for voltage
BAT1_CURR_PIN     15       # ADC pin for current
BAT1_CAPACITY     5000     # Battery capacity (mAh)
BAT1_VOLT_DIV     10.1     # Voltage divider
BAT1_AMP_PER_VOLT 24.0     # Amps per volt
```

### Dual Power Supply

The Cube supports redundant power:

```
Primary: POWER1 port (power brick)
Backup: USB power OR servo rail power (5V)

Automatic failover: If primary drops below 4.5V,
the Cube switches to backup power source.
```

## Building Cule-OS for Cube Orange

```bash
# Clean build
cd cule-os
make clean

# Build for Cube Orange
make BOARD=cubepilot_cubeorange

# Build with specific bootloader
make BOARD=cubepilot_cubeorange_bootloader
```

### Build Options

```bash
# Debug build with logging
make BOARD=cubepilot_cubeorange CFLAGS="-DDEBUG_BUILD"

# Optimized release build
make BOARD=cubepilot_cubeorange CFLAGS="-O3 -DNDEBUG"

# With specific drivers
make BOARD=cubepilot_cubeorange DRIVERS="gps ubx magnetometer rm3100"
```

## Companion Computer Integration

### UART to Raspberry Pi

```
Cube TELEM2 → Raspberry Pi GPIO

Cube            Pi
-----------     ---------
TX (pin 2)  →   RX (GPIO 15/UART0_RX)
RX (pin 3)  →   TX (GPIO 14/UART0_TX)
GND (pin 6) →   GND (pin 6)
5V (pin 1)  →   5V (pin 2) - Optional power

# Cule-OS parameters
SERIAL2_PROTOCOL  2       # MAVLink2
SERIAL2_BAUD      921600  # High speed link
```

### Ethernet via USB (Cube Orange+)

Cube Orange+ includes native Ethernet:

```
# Enable ethernet
NET_ENABLED       1
NET_IPADDR0       192
NET_IPADDR1       168
NET_IPADDR2       1
NET_IPADDR3       10

# MAVLink over UDP
NET_P1_TYPE       1       # MAVLink server
NET_P1_PROTOCOL   2       # MAVLink2
NET_P1_PORT       14550   # Standard MAVLink port
```

## Troubleshooting

### Cube Not Detected
```
1. Check USB cable (data capable, not charge-only)
2. Verify carrier board connections (all pins seated)
3. Try DFU mode: Hold Cube button, connect USB, release
4. Check Windows drivers (install Cube drivers)
```

### IMU Temperature Warnings
```
1. Allow warmup time (2-3 minutes in cold weather)
2. Check BRD_HEAT_TARG parameter
3. Verify heater is functioning (Cube gets warm to touch)
4. Increase heater power if needed: BRD_HEAT_P = 80
```

### GPS Not Locking
```
1. Verify GPS connected to GPS port (not TELEM)
2. Check GPS LED: solid = 3D fix, blinking = acquiring
3. Clear view of sky required
4. Cold start can take 5+ minutes
5. Try: gps reset hot
```

### High Vibration Levels
```
1. Check propeller balance
2. Verify motor mounting (no loose screws)
3. Add foam tape under Cube carrier
4. Reduce filter cutoff: INS_GYRO_FILTER = 15
5. Check for contact between Cube and frame
```

## Performance Comparison

| Metric | Pixhawk 4 | Cube Orange | Improvement |
|--------|-----------|-------------|-------------|
| CPU Speed | 216 MHz | 480 MHz | 2.2x |
| RAM | 512 KB | 1 MB | 2x |
| IMU Redundancy | Triple | Triple+Heated | Better |
| Flight Stack | ~30% | ~15% | 2x headroom |
| Log Rate | 50 Hz | 400 Hz | 8x |
| EKF Rate | 250 Hz | 400 Hz | 1.6x |

## Reference Documents

- [Cube Orange User Manual](https://docs.cubepilot.org/user-guides/autopilot/the-cube-module-overview)
- [Cube Carrier Boards](https://docs.cubepilot.org/user-guides/carrier-boards)
- [Hex ProfiCNC Product Page](https://www.cubepilot.org)
