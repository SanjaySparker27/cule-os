# MAVLink Message Reference

## Essential Messages

| ID | Message | Rate | Description |
|----|---------|------|-------------|
| 0 | HEARTBEAT | 1 Hz | System presence |
| 1 | SYS_STATUS | 1 Hz | System health |
| 30 | ATTITUDE | 10-50 Hz | Vehicle attitude |
| 33 | GLOBAL_POSITION_INT | 1-10 Hz | GPS position |
| 74 | VFR_HUD | 4 Hz | Flight data |
| 147 | BATTERY_STATUS | 1 Hz | Battery info |

## Message Details

### SYS_STATUS (#1)

```
Fields:
- onboard_control_sensors_health: Sensor health
- voltage_battery: mV
- current_battery: cA
- battery_remaining: %
```

### COMMAND_LONG (#76)

```
Purpose: Send commands

Example - Arm:
command: MAV_CMD_COMPONENT_ARM_DISARM (400)
param1: 1 (arm)

Example - Disarm:
command: MAV_CMD_COMPONENT_ARM_DISARM (400)
param1: 0 (disarm)
param2: 21196 (force)
```

## Reference

- [MAVLink Message IDs](https://mavlink.io/en/messages/common.html)
