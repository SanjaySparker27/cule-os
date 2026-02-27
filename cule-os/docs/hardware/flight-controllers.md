# Flight Controllers

Flight controllers are the core of any autonomous vehicle, providing low-level control, sensor fusion, and real-time stabilization. Cule OS supports multiple flight controller platforms running ArduPilot or PX4 firmware.

## Supported Flight Controllers

### Professional Grade

| Controller | MCU | IMU | Baro | Status |
|------------|-----|-----|------|--------|
| Pixhawk 6X | STM32H753 | Triple ICM-20649/ICM-42688-P/ICM-45686 | DPS310 | ✅ Full |
| Pixhawk 6C | STM32H743 | ICM-42688-P | DPS310 | ✅ Full |
| Cube Orange+ | STM32H757 | ICM-45686 | DPS310 | ✅ Full |
| Cube Orange | STM32H743 | ICM-20948 | DPS310 | ✅ Full |

### Mid-Range

| Controller | MCU | IMU | Baro | Status |
|------------|-----|-----|------|--------|
| DAKEFPV H743 Pro | STM32H743 | Dual ICM-42688-P | SPL06 | ✅ Full |
| Holybro Kakute H7 | STM32H743 | ICM-42688-P | DPS310 | ✅ Full |
| Matek H743 | STM32H743 | ICM-42688-P | DPS310 | ✅ Full |
| SpeedyBee F7 V3 | STM32F722 | ICM-42688-P | SPL06 | ✅ Full |

### Budget/Educational

| Controller | MCU | IMU | Baro | Status |
|------------|-----|-----|------|--------|
| Pixhawk 4 | STM32F765 | ICM-20689 | MS5611 | ✅ Full |
| Pixhawk 4 Mini | STM32F765 | ICM-20689 | MS5611 | ✅ Full |
| mRo Pixracer | STM32F427 | ICM-20608 | MS5611 | ⚠️ Limited |

## Flight Controller Comparison

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Flight Controller Comparison                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Feature          Pixhawk 6X   Pixhawk 6C   Cube Orange+  DAKEFPV  │
│  ─────────────────────────────────────────────────────────────────  │
│  Processor        H753 480MHz  H743 480MHz  H757 480MHz   H743     │
│  Flash            2MB FRAM     2MB          2MB           16MB     │
│  RAM              1MB          1MB          1MB           512KB    │
│                                                                      │
│  IMU Count        3            1            1             2        │
│  IMU Isolation    Yes          Yes          Yes           No       │
│  Vibration Damp   Yes          Limited      Yes           No       │
│                                                                      │
│  PWM Outputs      16           16           14            13       │
│  DShot Support    Yes          Yes          Yes           Yes      │
│  CAN Bus          2x           1x           2x            1x       │
│                                                                      │
│  Power Input      4S-14S       4S-14S       4S-14S        4S-12S   │
│  Current Sensor   120A         120A         120A          130A     │
│  Power Ports      3            3            3             3        │
│                                                                      │
│  USB              USB-C        USB-C        Micro-USB     USB      │
│  SD Card          Yes          Yes          Yes           Yes      │
│  Ethernet         Optional     No            Optional      No       │
│                                                                      │
│  Price            $$$          $$           $$$           $        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Pixhawk 6X

### Specifications

```
┌────────────────────────────────────────┐
│         Pixhawk 6X                     │
├────────────────────────────────────────┤
│ Processor: STM32H753                   │
│   - ARM Cortex-M7 @ 480MHz             │
│   - 2MB Flash, 1MB RAM                 │
│                                        │
│ IMU (Triple Redundant):                │
│   - IMU1: ICM-20649 (SPI1)             │
│   - IMU2: ICM-42688-P (SPI2)           │
│   - IMU3: ICM-45686 (SPI4)             │
│                                        │
│ Barometer: DPS310 (I2C2)               │
│                                        │
│ Magnetometer: BMM150 (I2C2)            │
│                                        │
│ Interfaces:                            │
│   - 16x PWM outputs                    │
│   - 5x UART (TELEM1-4, GPS)            │
│   - 3x I2C                            │
│   - 2x SPI                            │
│   - 2x CAN FD                          │
│   - 1x Ethernet (100M)                │
│   - USB-C                             │
│   - SD Card                           │
│                                        │
│ Power Module:                          │
│   - Input: 4S-14S LiPo                │
│   - Current: 120A continuous          │
│   - 3x 5V/3A BEC outputs              │
│                                        │
│ Dimensions: 38x55x15mm                 │
│ Weight: 35g                            │
└────────────────────────────────────────┘
```

### Connector Pinout

```
Pixhawk 6X Top View (Connectors)
══════════════════════════════════════════════════════════════════

                            USB-C
                              │
    ┌──────────────────────────────────────────────────────────┐
    │                                                          │
    │   [I2C]  [CAN1]  [CAN2]  [ETH]  [SPI]  [DSM/SBUS]       │
    │                                                          │
    │    [GPS]  [TELEM1]  [TELEM2]  [TELEM3]  [TELEM4]        │
    │                                                          │
    │              [SD Card]          [Debug]                  │
    │                                                          │
    │   [MAIN OUT]                      [AUX OUT]              │
    │   1 2 3 4 5 6 7 8                 1 2 3 4 5 6           │
    │                                                          │
    │              [POWER1]    [POWER2]                        │
    │                                                          │
    └──────────────────────────────────────────────────────────┘
                              │
                          POWER IN

Main Output (Servo/Motor): 8 channels, supports DShot
Auxiliary Output: 6 channels, supports DShot
```

### UART Port Mapping

| Port | Default Function | DMA | Pins |
|------|------------------|-----|------|
| TELEM1 | MAVLink (Companion) | Yes | TX/RX/GND |
| TELEM2 | MAVLink (GCS) | Yes | TX/RX/CTS/RTS/GND |
| TELEM3 | GPS | Yes | TX/RX/GND |
| TELEM4 | OSD/Peripheral | Yes | TX/RX/GND |
| GPS | GPS Module | Yes | TX/RX/SCL/SDA/GND |
| USB | USB-C | N/A | USB Data |

## DAKEFPV H743 Pro

### Specifications

```
┌────────────────────────────────────────┐
│       DAKEFPV H743 Pro                 │
├────────────────────────────────────────┤
│ Processor: STM32H743                   │
│   - ARM Cortex-M7 @ 480MHz             │
│   - 2MB Flash, 1MB RAM                 │
│                                        │
│ IMU (Dual):                            │
│   - IMU1: ICM-42688-P (SPI1)           │
│   - IMU2: ICM-42688-P (SPI4)           │
│                                        │
│ Barometer: SPL06 (I2C2)                │
│   - External compass via I2C           │
│                                        │
│ OSD: AT7456E (SPI2)                    │
│                                        │
│ Interfaces:                            │
│   - 13x PWM outputs                    │
│   - 8x UART ports                      │
│   - 1x I2C (SCL/SDA)                  │
│   - 4x SPI                            │
│   - 1x CAN                            │
│   - USB (Micro)                       │
│   - 16MB Flash for logging            │
│                                        │
│ Video:                                 │
│   - Dual camera inputs (CAM1/CAM2)    │
│   - Switchable via GPIO               │
│   - 12V VTX power (3A)                │
│                                        │
│ BEC:                                   │
│   - 5V/3A (servos)                    │
│   - 10V/3A (VTX)                      │
│                                        │
│ Input: 4S-12S LiPo                   │
│ Current: 130A                         │
└────────────────────────────────────────┘
```

### UART Mapping

| ArduPilot | Hardware | Default Use | DMA |
|-----------|----------|-------------|-----|
| SERIAL0 | USB | MAVLink | - |
| SERIAL1 | UART1 | GPS | Yes |
| SERIAL2 | UART2 | MAVLink2 (Companion) | No |
| SERIAL3 | UART3 | ESC Telemetry | No |
| SERIAL4 | UART4 | DisplayPort (MSP) | Yes |
| SERIAL5 | UART5 | RC Input | Yes (RX) |
| SERIAL6 | USART6 | User/Peripheral | Yes |
| SERIAL7 | UART7 | User/Peripheral | Yes |
| SERIAL8 | UART8 | User/Peripheral | No |

### PWM Output Groups

```
DAKEFPV H743 Pro PWM Output Groups
═══════════════════════════════════════════════════════

Groups must use same protocol (DShot/PWM):

Group 1: M1, M2, M3, M4 (TIM2)
Group 2: M5, M6, M7, M8 (TIM4)
Group 3: S1, S2 (TIM3)
Group 4: S3, S4 (TIM1)
Group 5: LED (TIM5)
Group 6: Camera Control (TIM8)

DShot Capable:
- M1-M8, S1, S2 (Bi-directional DShot supported)
- S3, S4 (DShot only)

Default Pin Functions:
  M1-M8  - Motor outputs
  S1-S4  - Servo outputs
  LED    - WS2812 LED strip
```

## Firmware Selection

### ArduPilot vs PX4

| Feature | ArduPilot | PX4 |
|---------|-----------|-----|
| UAV Types | Copter/Plane/Rover | Multicopter/Fixed-wing/VTOL |
| Maturity | Very mature | Modern architecture |
| Autotune | Excellent | Good |
| Terrain following | Excellent | Good |
| LUA scripting | Yes | No |
| Cule OS Integration | ✅ Full | ⚠️ Partial |
| **Recommended** | **✓ Yes** | - |

### Installing ArduPilot

```bash
# Method 1: Via Mission Planner/QGroundControl
# 1. Connect FC via USB
# 2. Open GCS software
# 3. Select firmware version
# 4. Click Install

# Method 2: Command line (Linux)
# Install required tools
sudo apt install dfu-util

# Download firmware
wget https://firmware.ardupilot.org/Copter/latest/\
    PIXHAWK6X/bin/arducopter.apj

# Flash firmware
python3 -m pip install dronecan
python3 -m dronecan.uavcan.tools.ardupilot_fw \
    --file arducopter.apj --port /dev/ttyACM0

# Method 3: SD Card (for boards with bootloader)
# Copy .apj file to SD card root
# Insert SD and power on
# Bootloader will auto-update
```

## Flight Controller Configuration

### Initial Setup

```bash
# Connect to Cule OS
# Flight controller is auto-detected

# View FC status
cule-fc-status

# Output:
# Flight Controller: Pixhawk 6X
# Firmware: ArduCopter 4.4.4
# Frame: QUAD
# Armed: False
# Flight Mode: STABILIZE
# Battery: 16.2V (94%)

# Calibrate sensors
cule-calibrate accel
cule-calibrate compass
cule-calibrate level

# Configure for vehicle type
sudo cule-config --vehicle-type copter --frame quad
```

### Parameter Configuration

```bash
# Connect via MAVProxy
mavproxy.py --master=/dev/ttyACM0 --baudrate=921600

# Change parameters
param set SERIAL1_BAUD 921600
param set SERIAL1_PROTOCOL 2  # MAVLink2
param set GPS_TYPE 1  # Auto detect
param set COMPASS_USE 1  # Enable compass

# Save parameters
param save

# Reboot required for some changes
reboot
```

## Safety Features

### Arming Checks

```
Pre-arm checks (default):
- Hardware safety switch
- Battery level
- GPS lock (if required)
- Compass health
- Accelerometer calibration
- RC calibration
- Barometer health
- Airspeed (planes only)
```

### Failsafe Actions

| Trigger | Action | Parameter |
|---------|--------|-----------|
| RC Loss | RTL/Land/Continue | FS_THR_ENABLE |
| GCS Loss | RTL/Land/Continue | FS_GCS_ENABLE |
| Battery Low | RTL/Land | BATT_FS_LOW_ACT |
| GPS Loss | Land/Alt Hold | FS_EKF_ACTION |
| Terrain Fail | RTL/Land | TERRAIN_FOLLOW |

## Integration with Cule OS

### MAVLink Connection

```
Companion Computer ←MAVLink→ Flight Controller
════════════════════════════════════════════════

Data Flow:
┌─────────────────┐      ┌─────────────────┐
│   Cule OS       │      │  Flight Ctrl    │
│                 │      │                 │
│ ┌─────────────┐ │      │ ┌─────────────┐ │
│ │ Mally Agent │ │      │ │ ArduPilot   │ │
│ │   System    │ │      │ │   Firmware  │ │
│ └──────┬──────┘ │      │ └──────┬──────┘ │
│        │        │      │        │        │
│ ┌──────▼──────┐ │      │ ┌──────▼──────┐ │
│ │ MAVLink     │◄├──────┤►│ MAVLink     │ │
│ │ Interface   │ │ UART │ │ Protocol    │ │
│ └─────────────┘ │      │ └─────────────┘ │
└─────────────────┘      └─────────────────┘

Message Types:
- HEARTBEAT: System status
- ATTITUDE: Vehicle attitude
- GLOBAL_POSITION_INT: GPS position
- VFR_HUD: Speed, altitude, heading
- SYS_STATUS: Battery, sensors
- MISSION_ITEM: Waypoints
- COMMAND_LONG: Commands
```

### Cule OS Services

```bash
# Enable flight controller service
sudo systemctl enable cule-fc-mavlink
sudo systemctl start cule-fc-mavlink

# View logs
sudo journalctl -u cule-fc-mavlink -f

# Check connection status
cule-mavlink-status

# Output:
# MAVLink Connection: Active
# Protocol: MAVLink2
# Baudrate: 921600
# Messages/sec: 50
# Latency: 12ms
```

## Troubleshooting

### Boot Issues

```bash
# Check bootloader
# Power on with BOOT button held
# Device appears as USB DFU

# Flash bootloader (if needed)
dfu-util -a 0 -D bootloader.bin -s 0x08000000

# Verify firmware
cule-fc-verify

# Reset to defaults
param reset
reboot
```

### Calibration Issues

```bash
# Accelerometer stuck during cal
# Solution: Keep FC completely still

# Compass calibration fails
# Solution: Move away from metal objects
# Use large figure-8 motions

# ESC calibration issues
# Solution: Use DShot protocol (no calibration needed)
param set MOT_PWM_TYPE 6  # DShot600
```

### Connection Issues

```bash
# No MAVLink connection
# Check 1: Verify baudrate matches
param show SERIAL1_BAUD

# Check 2: Verify protocol
param show SERIAL1_PROTOCOL

# Check 3: Check wiring
# Loopback test on TX/RX

# Check 4: Permissions
sudo usermod -a -G dialout $USER
# Log out and back in

# High latency
# Increase baudrate
param set SERIAL1_BAUD 921600

# Check for errors
dmesg | grep ttyACM
```

## See Also

- [Pixhawk Setup](./pixhawk.md) - Detailed Pixhawk configuration
- [DAKEFPV H743 Pro](./dakefpv-h743.md) - Custom H743 setup
- [Wiring Diagrams](./wiring.md) - Connection diagrams
- [MAVLink Setup](./mavlink.md) - Protocol configuration
