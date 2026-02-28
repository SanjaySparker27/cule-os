# PID Tuning Guide

## Overview

PID (Proportional-Integral-Derivative) tuning is essential for optimal flight performance. This guide covers tuning procedures for Cule-OS flight controllers.

## Understanding PID Control

### PID Basics

```
PID Controller Formula:

Output = P_error + I_integral + D_derivative

Where:
P = Kp × error           # Proportional response
I = Ki × ∫error dt       # Integral response  
D = Kd × d(error)/dt     # Derivative response

Error = Setpoint - Measured Value
```

### What Each Term Does

```
Proportional (P):
- Direct response to error
- Higher P = faster response
- Too high = oscillation
- Too low = sluggish response

Integral (I):
- Eliminates steady-state error
- Accumulates error over time
- Higher I = stronger correction
- Too high = overshoot, windup
- Too low = position drift

Derivative (D):
- Dampens response
- Reduces overshoot
- Higher D = more damping
- Too high = noise amplification
- Too low = oscillation
```

## Cule-OS PID Architecture

### Rate Controller (Inner Loop)

```
Controls angular rates:
- Roll rate (rollspeed)
- Pitch rate (pitchspeed)  
- Yaw rate (yawspeed)

Parameters:
MC_ROLLRATE_P     # Roll rate P gain
MC_ROLLRATE_I     # Roll rate I gain
MC_ROLLRATE_D     # Roll rate D gain
MC_ROLLRATE_FF    # Roll rate feedforward

MC_PITCHRATE_P    # Pitch rate P gain
MC_PITCHRATE_I    # Pitch rate I gain
MC_PITCHRATE_D    # Pitch rate D gain
MC_PITCHRATE_FF   # Pitch rate feedforward

MC_YAWRATE_P      # Yaw rate P gain
MC_YAWRATE_I      # Yaw rate I gain
MC_YAWRATE_D      # Yaw rate D gain (usually 0)
MC_YAWRATE_FF     # Yaw rate feedforward
```

### Attitude Controller (Outer Loop)

```
Controls attitude angles:
- Roll angle
- Pitch angle
- Yaw angle

Parameters:
MC_ROLL_P         # Roll attitude P gain
MC_PITCH_P        # Pitch attitude P gain
MC_YAW_P          # Yaw attitude P gain

These are simple P controllers:
- Higher P = tighter attitude hold
- Too high = oscillation
- Too low = loose control
```

### Velocity/Position Controller

```
For position-controlled modes:

Horizontal (X/Y):
MPC_XY_P          # Position P gain
MPC_XY_VEL_P      # Velocity P gain
MPC_XY_VEL_I      # Velocity I gain
MPC_XY_VEL_D      # Velocity D gain

Vertical (Z):
MPC_Z_P           # Altitude P gain
MPC_Z_VEL_P       # Vertical velocity P gain
MPC_Z_VEL_I       # Vertical velocity I gain
MPC_Z_VEL_D       # Vertical velocity D gain
```

## Tuning Procedure

### Pre-Tuning Checklist

```
□ Aircraft mechanically sound
□ Props balanced
□ No vibrations (check vibe levels)
□ Sensors calibrated
□ Default PID values loaded
□ Fresh battery
□ Open test area
□ Good weather (low wind)
□ Safety observer present
```

### Rate Controller Tuning

#### Step 1: P Gain (Roll and Pitch)

```
Starting point: Default values

Test procedure:
1. Arm in ANGLE/STABILIZE mode
2. Hover at eye level
3. Apply sharp roll input
4. Observe response:
   - Oscillates: P too high, reduce 10%
   - Soft/sluggish: P too low, increase 10%
   - Sharp stop: P is good

5. Repeat for pitch

Target: Quick response without oscillation
Typical values: 0.08 - 0.15
```

#### Step 2: D Gain (Roll and Pitch)

```
Starting point: Half of P gain

Test procedure:
1. Hover at eye level
2. Apply sharp roll input
3. Observe:
   - Oscillates after stop: D too low, increase
   - Noisy/motor heat: D too high, reduce
   - Clean stop: D is good

4. Repeat for pitch

Target: Damps oscillation without noise
Typical values: 0.001 - 0.005
```

#### Step 3: I Gain (Roll and Pitch)

```
Starting point: Same as P gain

Test procedure:
1. Hover hands-off
2. Observe drift:
   - Drifts: I too low, increase
   - Oscillates: I too high, reduce
   - Holds position: I is good

3. Apply constant disturbance (wind)
4. Should return to level

Target: No drift, no oscillation
Typical values: 0.08 - 0.15
```

#### Step 4: Yaw Tuning

```
Yaw is different (slower response OK):

Test procedure:
1. Hover
2. Apply yaw stick
3. Should spin smoothly
4. Release stick
5. Should stop cleanly

Parameters:
MC_YAWRATE_P: 0.1 - 0.3
MC_YAWRATE_I: 0.1 - 0.3  
MC_YAWRATE_D: 0.0 (usually)

Note: High yaw P can cause thrust loss
```

### Attitude Controller Tuning

```
Simpler than rate tuning:

Test procedure:
1. Hover in ANGLE mode
2. Release sticks
3. Should return to level quickly
4. Watch for:
   - Overshoot: reduce P
   - Slow recovery: increase P

Roll attitude:
MC_ROLL_P: 6.5 (default)
Range: 4.0 - 10.0

Pitch attitude:  
MC_PITCH_P: 6.5 (default)
Range: 4.0 - 10.0

Yaw attitude:
MC_YAW_P: 2.8 (default)
Range: 1.0 - 5.0
```

## Tuning by Vehicle Type

### Mini Quad (Racing)

```
Goals: Fast response, some overshoot OK

Rate PIDs:
MC_ROLLRATE_P:  0.12 - 0.18
MC_ROLLRATE_I:  0.12 - 0.18
MC_ROLLRATE_D:  0.002 - 0.004
MC_ROLLRATE_FF: 0.0

MC_PITCHRATE_P: 0.12 - 0.18
MC_PITCHRATE_I: 0.12 - 0.18
MC_PITCHRATE_D: 0.002 - 0.004
MC_PITCHRATE_FF: 0.0

MC_YAWRATE_P:   0.15 - 0.25
MC_YAWRATE_I:   0.15 - 0.25

Attitude:
MC_ROLL_P:      8.0 - 12.0
MC_PITCH_P:     8.0 - 12.0
```

### Cinema Drone

```
Goals: Smooth response, no overshoot

Rate PIDs:
MC_ROLLRATE_P:  0.08 - 0.12
MC_ROLLRATE_I:  0.08 - 0.12
MC_ROLLRATE_D:  0.001 - 0.003
MC_ROLLRATE_FF: 0.0

MC_PITCHRATE_P: 0.08 - 0.12
MC_PITCHRATE_I: 0.08 - 0.12
MC_PITCHRATE_D: 0.001 - 0.003
MC_PITCHRATE_FF: 0.0

Setpoint weighting for smoothness:
MC_ROLLRATE_K:  1.0  # Full setpoint
MC_PITCHRATE_K: 1.0
```

### Heavy Lifter

```
Goals: Stable, slow response acceptable

Rate PIDs:
MC_ROLLRATE_P:  0.06 - 0.10
MC_ROLLRATE_I:  0.06 - 0.10
MC_ROLLRATE_D:  0.001 - 0.002
MC_ROLLRATE_FF: 0.0

MC_PITCHRATE_P: 0.06 - 0.10
MC_PITCHRATE_I: 0.06 - 0.10
MC_PITCHRATE_D: 0.001 - 0.002
MC_PITCHRATE_FF: 0.0

Note: Lower gains for inertia
```

### Fixed-Wing

```
Different parameter names:

Roll axis:
FW_ROLLR_P:     0.05 - 0.15
FW_ROLLR_I:     0.01 - 0.05
FW_ROLLR_D:     0.0 - 0.01
FW_ROLLR_FF:    0.3 - 0.8

Pitch axis:
FW_PITCHR_P:    0.05 - 0.15
FW_PITCHR_I:    0.01 - 0.05
FW_PITCHR_D:    0.0 - 0.01
FW_PITCHR_FF:   0.3 - 0.8

Yaw axis (coordinated turn):
FW_YAWR_P:      0.05 - 0.15
FW_YAWR_I:      0.01 - 0.05
FW_YAWR_FF:     0.0 - 0.5
```

## Advanced Tuning

### Feedforward (FF)

```
Adds direct stick-to-motor response:

MC_ROLLRATE_FF:  0.0 - 0.5
MC_PITCHRATE_FF: 0.0 - 0.5

When to use:
- Racing/acro: Higher FF for direct feel
- Cinema: Lower FF for smoothness
- Fixed-wing: Higher FF (0.3-0.8)

Effect:
- Bypasses PID for direct response
- Reduces lag
- May reduce stability
```

### Setpoint Weighting

```
Balances setpoint vs measurement:

MC_ROLLRATE_K:  0.0 - 1.0
MC_PITCHRATE_K: 0.0 - 1.0

1.0 = Full setpoint (crisp)
0.5 = Balanced
0.0 = Measurement only (soft)

Use for:
- Reducing overshoot
- Softening response
```

### Integral Limits

```
Prevents integral windup:

MC_ROLLRATE_MAX:  220°/s  # Max roll rate
MC_PITCHRATE_MAX: 220°/s  # Max pitch rate
MC_YAWRATE_MAX:   200°/s  # Max yaw rate

MC_RR_INT_LIM:    0.3     # Integral limit
MC_PR_INT_LIM:    0.3
MC_YR_INT_LIM:    0.3

Lower for:
- Preventing overshoot
- Reducing recovery time
```

## Autotune

### Using Autotune

```
Some Cule-OS versions include autotune:

Procedure:
1. Open test area
2. Arm and hover
3. Enable autotune:
   - RC switch or
   - MAVLink command

4. System will:
   - Excite each axis
   - Measure response
   - Calculate optimal gains

5. Wait for completion
6. Review new gains
7. Test fly
8. Save if good

⚠️ Requires large open area
⚠️ Monitor for oscillation
```

## Troubleshooting

### Oscillation

```
Symptoms: Vehicle oscillates in hover

Causes:
1. P gain too high
   → Reduce MC_ROLLRATE_P, MC_PITCHRATE_P

2. D gain too low
   → Increase MC_ROLLRATE_D, MC_PITCHRATE_D

3. Mechanical vibration
   → Check props, balance
   → Check mounting

4. Filter too high
   → Reduce INS_GYRO_FILTER
```

### Sluggish Response

```
Symptoms: Slow to respond, feels heavy

Causes:
1. P gain too low
   → Increase rate P gains

2. I gain too low
   → Increase rate I gains

3. Attitude P too low
   → Increase MC_ROLL_P, MC_PITCH_P

4. Filters too low
   → Increase filter cutoff
```

### Overshoot

```
Symptoms: Vehicle overshoots, then corrects

Causes:
1. P gain too high
   → Reduce rate P

2. I gain too high
   → Reduce rate I

3. D gain too low
   → Increase rate D

4. Attitude P too high
   → Reduce MC_ROLL_P, MC_PITCH_P
```

### Drift

```
Symptoms: Vehicle drifts in hover

Causes:
1. I gain too low
   → Increase rate I

2. Trim issue
   → Calibrate level
   → Adjust transmitter trim

3. IMU issue
   → Re-calibrate accelerometer
   → Check vibration levels

4. Wind
   → Normal, use position mode
```

## Tools

### Log Analysis

```
Review logs for tuning:

1. Download log from SD card
2. Open in Flight Review/PX4 tools
3. Look at:
   - Rate setpoint vs actual
   - Attitude tracking
   - Control output saturation

Good tuning:
- Setpoint follows actual closely
- Minimal overshoot
- No saturation
```

### Real-Time Tuning

```
Via QGroundControl:

1. Connect to vehicle
2. Go to PID Tuning
3. Adjust gains in flight
4. Observe response
5. Save when good

⚠️ Only small adjustments in flight
⚠️ Be ready to switch to safe mode
```

## Reference

- [PID Controller Theory](https://en.wikipedia.org/wiki/PID_controller)
- [PX4 Tuning Guide](https://docs.px4.io/main/en/config_mc/pid_tuning_guide_multicopter.html)
- [Betaflight Tuning](https://github.com/betaflight/betaflight/wiki/PID-Tuning-Guide)
