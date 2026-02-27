# Pixhawk Flight Controllers

## Overview

The Pixhawk series represents the industry standard for open-source autopilot hardware. Cule-OS provides full support for Pixhawk 4, 4 Mini, 6X, and 6C flight controllers.

## Pixhawk 4 / 4 Mini

### Specifications

| Feature | Pixhawk 4 | Pixhawk 4 Mini |
|---------|-----------|----------------|
| Processor | FMUv5 (STM32F765) | FMUv5 (STM32F765) |
| Clock Speed | 216 MHz | 216 MHz |
| RAM | 512 KB | 512 KB |
| Flash | 2 MB | 2 MB |
| IMU Redundancy | Triple | Dual |
| Barometer | 2x | 1x |
| UART Ports | 5 | 4 |
| CAN Bus | 2 | 1 |
| PWM Outputs | 8 main + 8 aux | 8 main + 6 aux |
| Dimensions | 44x84x12mm | 43x66x11mm |
| Weight | 33g | 25g |

### Pinout Reference

#### Main PWM Outputs (8 channels)
```
Pin  Signal    Voltage    Description
---  ------    ---------  -----------
1    PWM1      3.3V       Motor 1 / Aileron
2    PWM2      3.3V       Motor 2 / Elevator
3    PWM3      3.3V       Motor 3 / Throttle
4    PWM4      3.3V       Motor 4 / Rudder
5    PWM5      3.3V       Aux / Gear
6    PWM6      3.3V       Aux / Flaps
7    PWM7      3.3V       Aux
8    PWM8      3.3V       Aux
```

#### AUX PWM Outputs (8 channels on PH4, 6 on PH4 Mini)
```
Pin  Signal    Voltage    Description
---  ------    ---------  -----------
1    AUX1      3.3V       Camera trigger / Additional motor
2    AUX2      3.3V       Camera trigger
3    AUX3      3.3V       Camera trigger
4    AUX4      3.3V       Camera trigger
5    AUX5      3.3V       GPIO / Serial
6    AUX6      3.3V       GPIO / Serial
7    AUX7      3.3V       GPIO (PH4 only)
8    AUX8      3.3V       GPIO (PH4 only)
```

#### Power Port (6-pin)
```
Pin  Signal    Voltage    Description
---  ------    ---------  -----------
1    VCC       5V         Power input
2    VCC       5V         Power input
3    CURRENT   Analog     Current sense (3.3V = 120A)
4    VOLTAGE   Analog     Voltage sense (3.3V = 60V)
5    GND       GND        Ground
6    GND       GND        Ground
```

### Wiring Guide

#### Standard Quadcopter Setup
```
Motor Layout (Quad X configuration):

     Front
       ↑
   1 (CW)    2 (CCW)
       \\      /
        \\  /
         \\/
         /\\
       /    \\
   4 (CCW)   3 (CW)

PWM connections:
- Motor 1 (CW)  → Main Out 1
- Motor 2 (CCW) → Main Out 2
- Motor 3 (CCW) → Main Out 3
- Motor 4 (CW)  → Main Out 4
```

#### GPS/Compass Module
```
GPS1 Port (6-pin JST GH):
Pin  Signal        Connection
1    VCC_5V        Module 5V
2    GPS_TX        Module RX
3    GPS_RX        Module TX
4    SCL_3.3V      Compass SCL
5    SDA_3.3V      Compass SDA
6    GND           Ground
```

## Pixhawk 6X / 6C

### Specifications

| Feature | Pixhawk 6X | Pixhawk 6C |
|---------|------------|------------|
| Processor | FMUv6X (STM32H753) | FMUv6C (STM32H743) |
| Clock Speed | 480 MHz | 480 MHz |
| RAM | 1 MB | 1 MB |
| Flash | 2 MB | 2 MB |
| IMU Redundancy | Triple isolated | Triple |
| IMU Sensors | ICM-20649, ICM-42688-P, ICM-42670-P | ICM-45686, ICM-42688-P |
| Barometer | 2x (ICP-20100, BMP388) | 2x (ICP-20100, BMP388) |
| Ethernet | Yes (10/100M) | No |
| UART Ports | 8 | 7 |
| CAN Bus | 3 | 2 |
| PWM Outputs | 8 main + 8 aux | 8 main + 8 aux |

### Key Improvements over Pixhawk 4

1. **Triple Redundant IMU** with isolated power domains (6X only)
2. **Dual Redundant Barometer** for reliable altitude hold
3. **Ethernet connectivity** for high-bandwidth applications (6X only)
4. **Triple CAN bus** for complex CAN architectures
5. **H7 processor** - 2.2x faster than F7
6. **Improved temperature stability** with heating element

### Ethernet Configuration (6X only)

Enable Ethernet in Cule-OS:
```bash
# In cule-os/config/board/pixhawk6x.config
CONFIG_NET=y
CONFIG_NET_IPV4=y
CONFIG_NET_UDP=y
CONFIG_NET_TCP=y
CONFIG_NET_MAVLINK=y
```

Network settings:
```
IP Address: 192.168.1.10 (default)
Subnet: 255.255.255.0
Gateway: 192.168.1.1
MAVLink port: 14550 (UDP)
```

## Cule-OS Configuration

### Building for Pixhawk

```bash
# Pixhawk 4
cd cule-os
make clean
make BOARD=px4_fmu-v5_default

# Pixhawk 4 Mini
make BOARD=px4_fmu-v5x_default

# Pixhawk 6X
make BOARD=px4_fmu-v6x_default

# Pixhawk 6C
make BOARD=px4_fmu-v6c_default
```

### Flashing Firmware

#### Via USB (DFU mode)
```bash
# Enter DFU mode: Hold BOOT button, connect USB, release BOOT
# Or via MAVLink console: reboot -b

dfu-util -a 0 -D build/px4_fmu-v5_default/cule-os.px4
dfu-util -a 0 -e
```

#### Via QGroundControl
1. Connect Pixhawk via USB
2. Open QGroundControl → Firmware tab
3. Select "Custom firmware file"
4. Browse to `build/px4_fmu-v5_default/cule-os.px4`
5. Click Flash

### Parameter Configuration

Essential parameters for Pixhawk:

```
# Vehicle type
SYS_AUTOSTART    4001    # Generic quadcopter

# Sensor priorities (for triple IMU)
SENS_IMU_MODE    1       # Auto-switch on failure
EKF2_IMU_MASK    7       # Use IMU 0,1,2

# RC configuration
RC_MAP_THROTTLE  1
RC_MAP_ROLL      2
RC_MAP_PITCH     3
RC_MAP_YAW       4
RC_MAP_MODE_SW   5
RC_MAP_KILL_SW   6

# Safety
COM_DISARM_LAND  2       # Auto-disarm after 2s on ground
NAV_RCL_ACT      2       # Return to land on RC loss
BAT_CRIT_THR     0.07    # Critical battery threshold
```

## Troubleshooting

### No Power / LED Off
- Check power module connection to Power1 port
- Verify 5V on power port pins 1-2
- Test with USB power only

### Can't Connect via USB
- Try different USB cable (data cable, not charge-only)
- Check driver installation (Windows)
- Verify port permissions (Linux): `sudo usermod -a -G dialout $USER`

### GPS Not Detected
- Verify GPS module powered (LED on module)
- Check GPS1 port connection
- Verify correct baud rate (default 115200)
- Test with `gps status` in MAVLink console

### IMU Calibration Fails
- Ensure vehicle is completely still
- Check for magnetic interference
- Verify temperature (calibrate after warmup)
- Try `commander calibrate accel` multiple times

## Reference Materials

- [Pixhawk 4 Datasheet](https://docs.holybro.com/pixhawk-4/)
- [Pixhawk 6X/6C Datasheet](https://docs.holybro.com/pixhawk-6x/)
- [PX4 Hardware Reference](https://docs.px4.io/main/en/flight_controller/pixhawk_series.html)
