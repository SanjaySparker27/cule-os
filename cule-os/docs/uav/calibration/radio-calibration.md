# RC Transmitter Calibration

## Overview

RC calibration ensures the flight controller correctly interprets stick positions.

## Binding the Receiver

### FrSky (SBUS)

```
Procedure:
1. Hold bind button on receiver
2. Power on receiver
3. Put Taranis in bind mode (D16)
4. LED goes green when bound

Cule-OS Setup:
RC_PROTOCOL = 5      # SBUS
```

## RC Calibration Procedure

```bash
# MAVLink console
commander calibrate rc

Procedure:
1. Ensure transmitter bound
2. Follow stick prompts
3. Move all sticks through full range
4. Move switches through positions
```

## Flight Modes

```
Configure mode switch:

Position 1: Stabilize/Manual
Position 2: Altitude Hold
Position 3: Position Hold
```
