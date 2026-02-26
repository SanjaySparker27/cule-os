# ZEX ATHENA H743 PRO Custom Firmware Package

## Overview

This package contains the custom configuration for **ZEX ATHENA H743 PRO** flight controller (compatible with DAKEFPV H743 PRO), configured for:

- **HEXA X** frame configuration
- **Pusher motor** (7th motor) controlled via RCIN8 (left slider)
- **Flight mode switching** via RC8 slider:
  - **0-16%** slider position → **Loiter Mode**
  - **>16%** slider position → **Stabilize Mode**

## Package Contents

### Firmware Files
| File | Description |
|------|-------------|
| `arducopter_dakefph743pro.apj` | ArduCopter firmware for DAKEFPVH743Pro |
| `arducopter_dakefph743pro_bl.hex` | Firmware with bootloader (for DFU flashing) |

### Configuration Files
| File | Description |
|------|-------------|
| `athena_h743pro_params.param` | Parameter file for HEXA X + pusher setup |
| `mode_switch.lua` | Lua script for custom slider-based mode switching |
| `DAKEFPVH743Pro_Custom_Config.md` | Detailed configuration documentation |

## Quick Start

### 1. Flash Firmware

#### Option A: Using Mission Planner (Recommended)
1. Connect flight controller to PC via USB
2. Open Mission Planner → "Install Firmware" tab
3. Click "Load custom firmware"
4. Select `arducopter_dakefph743pro.apj`

#### Option B: DFU Flashing (First Time)
1. Hold **BOOT** button while connecting USB
2. Use STM32CubeProgrammer or dfu-util to flash `arducopter_dakefph743pro_bl.hex`
3. Disconnect and reconnect without BOOT button

### 2. Configure Parameters

1. Connect to Mission Planner
2. Go to **Config/Tuning** → **Full Parameter List**
3. Click **Load from file** → Select `athena_h743pro_params.param`
4. Click **Write Params** and reboot

### 3. Install Lua Script (Optional but Recommended)

1. Insert SD card into computer
2. Create folder `/APM/scripts/`
3. Copy `mode_switch.lua` to `/APM/scripts/`
4. Insert SD card into flight controller
5. Enable scripting:
   - Set parameter `SCR_ENABLE = 1`
   - Set parameter `SCR_HEAP_SIZE = 102400`
6. Reboot

### 4. Verify Setup

1. **RC Calibration**: Calibrate RC8 (left slider) in Mission Planner
2. **Motor Test**: Use "Motor Test" to verify correct motor order
3. **Mode Switching**: Move slider to test Loiter (0-16%) and Stabilize (>16%) modes

## Hardware Specifications (ZEX ATHENA H743 PRO)

| Feature | Specification |
|---------|--------------|
| MCU | STM32H743 @ 480 MHz |
| IMU | Dual ICM42688 |
| Barometer | SPL06 |
| OSD | AT7456E |
| Flash | 16MB |
| UARTs | 8x |
| CAN | 1x |
| PWM Outputs | 13 (8 motors + 4 servos + LED) |
| Battery | 4S-12S |
| BEC | 3.3V/0.5A, 5V/3A, 12V/3A (VTX) |

## Motor Layout (HEXA X + Pusher)

```
      Front
        ↑
   (5)     (6)
     \     /
      \   /
   (3)  ↑  (4)
        |
   (1)     (2)
        
   [Pusher] (7)
```

- **M1-M6**: HEXA X configuration motors
- **M7 (Output 7)**: Pusher motor controlled by RCIN8

## RC Channel Mapping

| Channel | Function | Configuration |
|---------|----------|---------------|
| CH1 | Roll | Standard |
| CH2 | Pitch | Standard |
| CH3 | Throttle | Standard |
| CH4 | Yaw | Standard |
| CH5 | Flight Mode | (Optional) |
| CH6 | Tuning | (Optional) |
| CH7 | Aux | (Optional) |
| CH8 | **Pusher + Mode Switch** | **Slider 0-16%=Loiter, >16%=Stabilize** |

## Parameter Summary

Key parameters configured:

```
FRAME_CLASS = 2          # Hexa
FRAME_TYPE = 13          # X configuration
SERVO7_FUNCTION = 51     # RCIN8 passthrough (pusher motor)
FLTMODE_CH = 8           # Use RC8 for mode switching
```

## Troubleshooting

### Pusher motor not responding
- Check `SERVO7_FUNCTION = 51`
- Verify RC8 is calibrated (1000-2000 range)
- Check RC8_OPTION = 0

### Mode not switching
- Verify Lua script is loaded (check "Messages" tab)
- Check `FLTMODE_CH = 8`
- Ensure RC8 slider moves full range

### Motors not spinning
- Check `ARMING_CHECK` = 0 or all checks pass
- Verify frame class and motor order
- Check safety switch is pressed

## Support

- **ArduPilot Documentation**: https://ardupilot.org/copter/
- **ArduPilot Forums**: https://discuss.ardupilot.org/
- **ZEX/DAKEFPV Support**: Contact manufacturer

## License

This configuration package is provided as-is for educational and development purposes. ArduPilot is licensed under GPLv3.
