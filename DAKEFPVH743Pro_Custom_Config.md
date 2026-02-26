# ATHENA H743 PRO (DAKEFPV H743 PRO) Custom Configuration

## Overview

This configuration is for the **ATHENA H743 PRO** (compatible with DAKEFPV H743 PRO) flight controller, configured for:
- **HEXA X** frame with custom pusher motor
- **Pusher motor** (7th motor) controlled via RCIN8 (left slider)
- **Flight mode switching** via RC8 slider: 0-16% = Loiter, >16% = Stabilize

## Hardware Specifications

### ATHENA H743 PRO / DAKEFPV H743 PRO
- **MCU**: STM32H743 32-bit processor running at 480 MHz
- **IMU**: Dual ICM42688
- **Barometer**: SPL06
- **OSD**: AT7456E
- **Onboard Flash**: 16MByte
- **UARTs**: 8x
- **CAN**: 1x CAN port
- **PWM Outputs**: 13 (8 motors + 4 servos + LED)
- **Battery Input**: 4S-12S
- **BEC**: 3.3V 0.5A, 5V 3A, 12V 3A (VTX power)

## Parameter Configuration

### 1. Frame Configuration

```
FRAME_CLASS    2      # Hexa
FRAME_TYPE     13     # X configuration
```

### 2. Motor Outputs (HEXA X + Pusher)

Standard HEXA X motor layout on outputs 1-6:
```
SERVO1_FUNCTION  33   # Motor1
SERVO2_FUNCTION  34   # Motor2
SERVO3_FUNCTION  35   # Motor3
SERVO4_FUNCTION  36   # Motor4
SERVO5_FUNCTION  37   # Motor5
SERVO6_FUNCTION  38   # Motor6
```

**Pusher Motor Configuration** (RCIN8 passthrough):
```
SERVO7_FUNCTION  216  # Mount2 Roll (passthrough for RCIN8)
RC8_OPTION       0    # Do Nothing (use as throttle input)
```

### 3. RC Configuration for Flight Mode Switching

To achieve the custom flight mode switching with RC8:

**Method A: Using FLTMODE_CH = 8**
```
FLTMODE_CH     8
FLTMODE1       5      # Loiter (for 0-16% range)
FLTMODE2       5      # Loiter
FLTMODE3       0      # Stabilize (for >16% range)
FLTMODE4       0      # Stabilize
FLTMODE5       0      # Stabilize
FLTMODE6       0      # Stabilize
```

**Note**: Standard ArduPilot uses 6-position mode switch. For true slider-based mode switching (0-16% = Loiter, >16% = Stabilize), use **Method B** with Lua scripting.

### 4. Lua Script for Custom Mode Switching (Recommended)

Create file `mode_switch.lua` in the `/APM/scripts/` folder on SD card:

```lua
-- Custom Mode Switch Script for ATHENA H743 PRO
-- RC Channel 8 (left slider) controls flight mode
-- 0-16% slider = Loiter Mode
-- >16% slider = Stabilize Mode

local last_mode = 5  -- Start with Loiter
local LOITER_MODE = 5
local STABILIZE_MODE = 0

function update()
    local rc8_percent = rc:get_pwm(8)  -- Get RC8 PWM value
    
    -- Convert PWM to percentage (assuming 1000-2000 range)
    local percent = (rc8_percent - 1000) / 10  -- 0-100%
    
    -- Determine desired mode
    local desired_mode
    if percent <= 16 then
        desired_mode = LOITER_MODE
    else
        desired_mode = STABILIZE_MODE
    end
    
    -- Switch mode if changed
    if desired_mode ~= last_mode then
        if vehicle:set_mode(desired_mode) then
            last_mode = desired_mode
            gcs:send_text(6, "Mode switched via slider: " .. percent .. "%")
        end
    end
    
    return update, 100  -- Run at 10Hz
end

return update, 100
```

### 5. Pusher Motor Configuration

**For RC8 throttle passthrough to Motor 7:**

```
# Set RC8 to pass through to Servo7
SERVO7_FUNCTION  216  # Mount2 Roll (passthrough)
RC8_OPTION       0    # Do Nothing

# Set RC8 range
RC8_MIN          1000
RC8_MAX          2000
RC8_TRIM         1000  # Low stick = idle

# Motor 7 output (pusher)
SERVO7_MIN       1000
SERVO7_MAX       2000
SERVO7_TRIM      1000
```

**Alternative: Using RCIN8 directly:**
```
SERVO7_FUNCTION  51   # RCIN8 passthrough
```

### 6. Complete Parameter File

Save as `athena_h743pro_params.param`:

```
# ATHENA H743 PRO Configuration
# HEXA X with Pusher Motor

# Frame
FRAME_CLASS,2
FRAME_TYPE,13

# RC8 for mode switching and pusher control
FLTMODE_CH,8
RC8_OPTION,0
SERVO7_FUNCTION,51

# Motor outputs
SERVO1_FUNCTION,33
SERVO2_FUNCTION,34
SERVO3_FUNCTION,35
SERVO4_FUNCTION,36
SERVO5_FUNCTION,37
SERVO6_FUNCTION,38

# Flight modes (standard 6-pos switch)
FLTMODE1,5    # Loiter
FLTMODE2,5    # Loiter  
FLTMODE3,0    # Stabilize
FLTMODE4,0    # Stabilize
FLTMODE5,0    # Stabilize
FLTMODE6,0    # Stabilize

# Safety
ARMING_CHECK,0
FS_THR_ENABLE,1
```

## Flashing Instructions

### Step 1: Flash Bootloader (First Time Only)
1. Download DAKEFPVH743Pro bootloader: `DAKEFPVH743Pro_bl.bin`
2. Hold BOOT button while connecting USB
3. Flash using STM32CubeProgrammer or dfu-util
4. Unplug and replug without BOOT button

### Step 2: Flash ArduCopter Firmware
1. Download latest DAKEFPVH743Pro firmware from:
   https://firmware.ardupilot.org/Copter/latest/DAKEFPVH743Pro/
2. Connect to Mission Planner / QGroundControl
3. Go to "Install Firmware" tab
4. Select "Load custom firmware" and choose `arducopter.apj`

### Step 3: Configure Parameters
1. Connect to Mission Planner
2. Go to "Config/Tuning" → "Full Parameter List"
3. Click "Load from file" and select the parameter file
4. Write parameters and reboot

### Step 4: Upload Lua Script (Optional)
1. Create `/APM/scripts/` folder on SD card
2. Copy `mode_switch.lua` to this folder
3. Set `SCR_ENABLE,1` parameter
4. Reboot to start the script

## Pinout Reference

### Motor Outputs (M1-M8)
| Output | Function | Pin |
|--------|----------|-----|
| M1 | Motor 1 | PA0 |
| M2 | Motor 2 | PA1 |
| M3 | Motor 3 | PA2 |
| M4 | Motor 4 | PA3 |
| M5 | Motor 5 | PE9 |
| M6 | Motor 6 | PE11 |
| M7 | Pusher Motor | PC8 |
| M8 | Spare | PC9 |

### UART Mapping
| Serial | Port | Function |
|--------|------|----------|
| SERIAL0 | USB | MAVLink |
| SERIAL1 | UART1 | GPS |
| SERIAL2 | UART2 | MAVLink2 |
| SERIAL3 | UART3 | ESC Telemetry |
| SERIAL4 | UART4 | DisplayPort |
| SERIAL5 | UART5 | RC Input |
| SERIAL6 | UART6 | User |
| SERIAL7 | UART7 | User |
| SERIAL8 | UART8 | User |

## Important Notes

1. **Pusher Motor Safety**: The pusher motor (M7) is controlled directly by RC8. Ensure proper failsafe settings to prevent unintended throttle when switching modes.

2. **Mode Switching**: With the Lua script, modes switch at 16% threshold. Without the script, use standard 6-position mode switch.

3. **RC Calibration**: Calibrate RC8 (left slider) in Mission Planner before flight.

4. **Motor Test**: Use Mission Planner's "Motor Test" to verify correct motor order and direction.

5. **Failsafe**: Set up radio failsafe properly for the pusher motor channel.

## Custom Firmware Changes

The following code modifications were made to support custom mode switching:

### RC_Channel.cpp
Added `custom_slider_mode_switch()` function that monitors RC8 and switches modes based on slider percentage.

### Copter.cpp
Modified `rc_loop()` to call custom mode switch when `FLTMODE_CH = 8`.

These changes are optional - the standard firmware works fine with the Lua scripting approach.

## Troubleshooting

### Pusher motor not responding to RC8
- Check `SERVO7_FUNCTION` is set correctly (51 or 216)
- Verify RC8 is calibrated and responding in RC calibration
- Check RC8_OPTION is set to 0

### Mode not switching with slider
- Verify Lua script is running (check Messages tab)
- Check `FLTMODE_CH` is set to 8
- Ensure RC8 range is 1000-2000

### Motors not spinning
- Check `ARMING_CHECK` is 0 or all checks pass
- Verify frame type and motor order
- Check safety switch is pressed (if equipped)

## Support

For issues with:
- **ArduPilot configuration**: https://discuss.ardupilot.org/
- **DAKEFPV H743 Pro hardware**: Contact DAKEFPV support
- **Custom configuration**: Refer to this document

## Firmware Files

Generated firmware files:
- `arducopter.apj` - Main firmware (flash via GCS)
- `arducopter_with_bl.hex` - With bootloader (DFU flash)
- `athena_h743pro_params.param` - Configuration parameters
- `mode_switch.lua` - Lua script for custom mode switching
