# Sensor Calibration Guide

## Overview

Proper sensor calibration is critical for safe and stable flight.

## Accelerometer Calibration

```bash
# MAVLink console
commander calibrate accel

Procedure:
1. Place vehicle level
2. Place on LEFT side
3. Place on RIGHT side
4. Place NOSE DOWN
5. Place NOSE UP
6. Place UPSIDE DOWN
```

## Gyroscope Calibration

```bash
# MAVLink console
commander calibrate gyro

Procedure:
1. Place vehicle on solid surface
2. Do NOT move for 30 seconds
3. Wait for completion tone
```

## Compass Calibration

```bash
# MAVLink console
commander calibrate mag

Procedure:
1. Hold vehicle away from metal
2. Rotate slowly around all 3 axes
3. Continue until 100% complete
```

## Complete Calibration Sequence

```
Step 1: IMU Calibration
  □ Calibrate accelerometer (6 positions)
  □ Calibrate gyroscope (stationary)

Step 2: Compass Calibration
  □ Move to open area
  □ Calibrate all compasses

Step 3: Level Calibration
  □ Set on level surface
  □ Calibrate level horizon
```
