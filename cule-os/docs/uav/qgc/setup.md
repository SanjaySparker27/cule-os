# QGroundControl Setup

## Installation

### Download

```
Official: https://qgroundcontrol.com

Windows: QGroundControl-installer.exe
macOS: QGroundControl.dmg
Linux: AppImage
```

## Initial Setup

### Connection

```
USB:
1. Connect vehicle via USB
2. QGC auto-detects
3. Vehicle appears in toolbar

Serial:
1. Connect telemetry radio
2. Select COM port
3. Set baud rate (57600)
```

## Vehicle Configuration

### Firmware Flashing

```
1. Connect vehicle via USB
2. Go to Vehicle Setup → Firmware
3. Select "Custom firmware file"
4. Browse to cule-os.px4
5. Click Flash
```

### Sensor Calibration

```
Accelerometer:
- Place in 6 positions
- Hold still at each

Gyroscope:
- Keep vehicle still
- Wait 30 seconds

Compass:
- Rotate in all directions
- Reach 100%
```

## Mission Planning

```
1. Click Plan tab
2. Add takeoff waypoint
3. Add mission waypoints
4. Add landing
5. Upload to vehicle
```

## Reference

- [QGroundControl User Guide](https://docs.qgroundcontrol.com)
