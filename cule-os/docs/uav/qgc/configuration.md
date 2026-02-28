# QGroundControl Configuration

## Application Settings

### General

```
Offline Maps:
- Download maps for operation areas
- Select zoom levels

Units:
- Metric or Imperial
- Mix units as needed
```

### Video

```
Source: UDP/RTSP/TCP
UDP Port: 5600 (typical)
Recording: Enable and set directory
```

## MAVLink Configuration

### Stream Rates

```
USB (high bandwidth):
- ATTITUDE: 50 Hz
- POSITION: 10 Hz

Radio (low bandwidth):
- ATTITUDE: 4 Hz
- POSITION: 1 Hz
```

## Tuning

```
Vehicle Setup → PID Tuning:
- Adjust P, I, D gains
- Test flight between changes
- Save when complete
```

## Reference

- [QGroundControl Settings](https://docs.qgroundcontrol.com)
