# MAVLink Protocol

## Overview

MAVLink (Micro Air Vehicle Link) is a lightweight messaging protocol for communicating with drones.

## Protocol Basics

### MAVLink Versions

```
MAVLink 1.0: Legacy, 8-byte header
MAVLink 2.0: Current, 10-byte header, signed messages

Cule-OS uses MAVLink 2.0 by default
```

### Component IDs

```
1   MAV_COMP_ID_AUTOPILOT1    # Main autopilot
2   MAV_COMP_ID_MISSIONPLANNER # Ground station
3   MAV_COMP_ID_QGROUNDCONTROL # QGC
5   MAV_COMP_ID_CAMERA        # Camera
154 MAV_COMP_ID_GIMBAL        # Gimbal
```

## Cule-OS MAVLink Configuration

### Serial Configuration

```
SERIAL1_PROTOCOL  2       # MAVLink 2
SERIAL1_BAUD      921600  # High speed
```

### Message Rates

```
SR0_ADSB         5       # ADS-B stream
SR0_EXTRA1       10      # Attitude
SR0_EXTRA2       10      # VFR_HUD
SR0_POSITION     3       # Position
```

## Common Messages

### HEARTBEAT (#0)

```
Purpose: System presence
Frequency: 1 Hz (required)

Fields:
- type: MAV_TYPE_QUADROTOR
- autopilot: MAV_AUTOPILOT_PX4
- base_mode: System mode
- system_status: MAV_STATE_ACTIVE
```

### ATTITUDE (#30)

```
Purpose: Vehicle orientation
Frequency: 10-50 Hz

Fields:
- roll, pitch, yaw: Angles (rad)
- rollspeed, pitchspeed, yawspeed: Rates (rad/s)
```

### GLOBAL_POSITION_INT (#33)

```
Purpose: GPS position
Frequency: 1-10 Hz

Fields:
- lat, lon: Latitude, Longitude (degE7)
- alt: Altitude MSL (mm)
- relative_alt: Altitude above home (mm)
```

## Reference

- [MAVLink Developer Guide](https://mavlink.io)
