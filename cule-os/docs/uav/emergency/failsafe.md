# Failsafe Configuration

## Overview

Failsafes are automated responses to system failures that protect the aircraft, people, and property. Proper configuration is essential for safe autonomous operations.

## Failsafe Types

### RC Signal Loss

```
Trigger: No valid RC signal for COM_RC_LOSS_T seconds
Default: 0.5 seconds

Configuration:
COM_RC_LOSS_T     0.5     # Timeout in seconds
NAV_RCL_ACT       2       # Action on RC loss

Actions (NAV_RCL_ACT):
0 = Disabled        - Continue mission (dangerous)
1 = Hold            - Hold position/altitude
2 = Return          - Return to launch (RTL)
3 = Land            - Land at current position
4 = Offboard        - Use offboard control (if available)
5 = Terminate       - Kill motors immediately

Recommended: 2 (Return to launch)
```

### GPS Loss

```
Trigger: No 3D GPS fix or HDOP > threshold

Configuration:
EKF2_GPS_CHECK    7       # GPS checks to pass
# Bitmask: 1=Fix, 2=PDOP, 4=Sat count, 8=H/V accuracy

Fallback behavior:
- Position modes disabled
- Falls back to altitude mode
- Dead reckoning continues briefly

Pilot must take manual control
```

### Battery Failsafe

```
Three threshold levels:

Low Battery (Warning):
BAT_LOW_THR       0.25    # 25% capacity remaining
BAT_LOW_VOLT      14.0    # Or voltage threshold
Action: Warning only, pilot must land

Critical Battery (Action):
BAT_CRIT_THR      0.10    # 10% capacity
BAT_CRIT_VOLT     13.5    # Or voltage threshold
Action: Return to land automatically

Emergency Battery (Forced):
BAT_EMERGEN_THR   0.05    # 5% capacity
BAT_EMERGEN_VOLT  13.0
Action: Immediate landing, cannot override

Behavior Configuration:
BAT_LOW_ACTION    2       # 0=Warning, 1=RTL, 2=Land
BAT_CRIT_ACTION   2       # 0=Warning, 1=RTL, 2=Land
```

### Geofence

```
Creates virtual boundaries for the aircraft.

Types:
1. Max Altitude
   GF_MAX_HOR_DIST   0       # 0 = disabled
   GF_MAX_VER_DIST   100     # Maximum altitude (m)

2. Cylinder Boundary
   GF_MAX_HOR_DIST   500     # Radius from home (m)
   GF_MAX_VER_DIST   120     # Maximum altitude (m)

3. Inclusion/Exclusion Zones
   GF_COUNT          4       # Number of fence points
   GF_ACTION         1       # Action on breach

Actions (GF_ACTION):
0 = None/Log only
1 = Warning
2 = Hold mode
3 = Return mode
4 = Terminate

Recommended Settings:
GF_ACTION         3       # Return to home
GF_MAX_HOR_DIST   1000    # 1km radius
GF_MAX_VER_DIST   120     # 120m altitude
GF_SOURCE         0       # 0=Global, 1=GPS only
```

### Data Link Loss (GCS)

```
Trigger: No MAVLink heartbeat for timeout period

Configuration:
COM_DL_LOSS_T     10      # Timeout in seconds
NAV_DLL_ACT       0       # Action on data link loss

Actions (NAV_DLL_ACT):
0 = Disabled        - Continue mission
1 = Hold            - Loiter at current position
2 = Return          - Return to launch
3 = Land            - Land at current position
4 = Continue        - Continue mission (rely on RC)

Note: Often set to 0 (disabled) for BVLOS missions
where GCS link may be intermittent
```

### External System Failsafe

```
For companion computers or offboard systems:

COM_OBL_ACT       0       # Action on offboard loss
COM_OBL_RC_ACT    0       # Action if RC available

Actions:
0 = Position mode
1 = Altitude mode
2 = Manual mode
3 = Return mode
4 = Land mode
```

## Failsafe Priority

### Priority Order

```
When multiple failsafes trigger, priority is:

1. Emergency Battery (forced landing)
2. Geofence breach
3. Kill switch (pilot commanded)
4. Critical Battery
5. RC Loss
6. Data Link Loss
7. Low Battery (warning only)
8. GPS Loss (mode degradation)

Higher priority overrides lower priority
```

### Failsafe Interaction

```
Example: RC Loss during mission

Initial: Mission mode active
Trigger: RC signal lost
Action: NAV_RCL_ACT = 2 (Return)
Result: Return to home initiated

If during return:
- Battery goes critical
- Higher priority triggers
- Switches to emergency landing
- Overrides return mode
```

## Advanced Failsafe

### Delayed Failsafe

```
Add delay before failsafe activates:

COM_RC_LOSS_T     5.0     # 5 second delay

Use case:
- Brief signal loss (terrain)
- Don't abort mission for momentary glitch
- Risk: Longer reaction time

Recommended: Keep default 0.5s unless specific need
```

### Return to Launch (RTL) Configuration

```
RTL behavior settings:

RTL_RETURN_ALT    30      # Return altitude (m)
# 0 = Current altitude
# -1 = Minimum altitude (home + RTL_MIN_DIST)

RTL_MIN_DIST      5.0     # RTL minimum distance (m)
# Only RTL if beyond this distance

RTL_LOITER_TIME   5.0     # Loiter time at home (s)
RTL_DESCEND_ALT   10      # Descent altitude (m)
RTL_LAND_DELAY    0.0     # Delay before landing
RTL_LAND_TYPE     0       # 0=Home, 1=Rally point, 2=Closest

Conical RTL (fuel/energy efficient):
RTL_CONE_ANG      45      # Cone half-angle (degrees)
# Lower angle = more direct return
# Higher angle = higher return altitude
```

### Land Mode Configuration

```
Precision landing:
LAND_DETECTOR     1       # Enable landing detection
LAND_SPEED        0.7     # Landing descent rate (m/s)
LAND_ALT1         10.0    # Altitude to slow down (m)
LAND_ALT2         5.0     # Final altitude (m)

For precision landing with rangefinder:
LAND_SPEED_W      0.5     # Final landing speed
LAND_TYPE         0       # 0=Normal, 1=Opportunity, 2=Precision
```

## Failsafe Testing

### Safe Testing Procedures

```
Test in this order:

1. Simulation (SITL)
   - Configure failsafes
   - Test scenarios
   - Verify behavior
   - Zero risk

2. Bench Test
   - Props removed
   - Armed on bench
   - Simulate RC loss (turn off TX)
   - Verify failsafe indication
   - Disarm

3. Tethered Test
   - Props on
   - Vehicle secured
   - Lift slightly
   - Test RC loss
   - Verify response
   - Land

4. Field Test
   - Open area
   - Low altitude
   - Brief RC loss test
   - Verify RTL or land
   - Resume control
   - Land
```

### Test Scenarios

```
Test Checklist:

□ RC Loss
  - Turn off transmitter
  - Verify RTL initiated
  - Turn on transmitter
  - Regain control
  - Cancel RTL

□ GPS Loss
  - Cover GPS antenna
  - Verify mode change
  - Remove cover
  - Verify recovery

□ Low Battery
  - Set threshold artificially high
  - Verify warning/RTL
  - Restore threshold

□ Geofence
  - Fly to boundary
  - Verify fence triggers
  - Verify return action

□ Kill Switch
  - Activate kill switch
  - Motors stop
  - Re-arm procedure
  - Verify restart
```

## Special Configurations

### Racing/Acro Failsafe

```
For racing drones where immediate stop is needed:

NAV_RCL_ACT       5       # Terminate on RC loss
COM_RC_LOSS_T     0.3     # Fast reaction

Use with:
- GPS disabled
- Manual modes only
- FPV flying
- Racing environment

⚠️ Only for experienced pilots in controlled environment
```

### Long-Range FPV Failsafe

```
For long-range flights:

NAV_RCL_ACT       2       # Return to home
RTL_RETURN_ALT    100     # High return altitude
COM_RC_LOSS_T     2.0     # Allow for brief dropouts

Additional safety:
- Dual control links
- GPS + GLONASS + Galileo
- Long-range telemetry
- Automatic failsafe
- Emergency buzzer
```

### Commercial BVLOS

```
Beyond Visual Line of Sight requirements:

Failsafe redundancy:
- Dual GPS
- Dual compasses
- Dual batteries
- Geofence mandatory
- Parachute system

Configuration:
NAV_RCL_ACT       2       # Always RTL
NAV_DLL_ACT       2       # RTL on comm loss
BAT_LOW_ACTION    2       # Land on low battery
GF_ACTION         3       # Return on geofence
GF_MAX_HOR_DIST   [mission appropriate]

Parachute:
-CBRK_FLIGHTTERM  0       # Enable flight termination
-FLT_TMO          0.5     # Fast trigger
```

## Troubleshooting Failsafes

### Failsafe Not Triggering

```
Problem: RC loss doesn't trigger failsafe

Causes:
1. Receiver still outputting signal
   → Check receiver failsafe mode
   → Set to "No Pulses" or "Low Throttle"

2. Wrong threshold
   → Check RC_THR_FAILS
   → Verify below failsafe output

3. Wrong parameter
   → Check NAV_RCL_ACT > 0
   → Check COM_RC_LOSS_T

4. Wrong RC protocol
   → Verify RC_PROTOCOL setting
   → Check driver loaded
```

### Failsafe Triggering Unexpectedly

```
Problem: Aircraft enters failsafe without apparent cause

Causes:
1. Loose connections
   → Check receiver wiring
   → Antenna connections
   → Power connections

2. Interference
   → Check for noise sources
   → Improve antenna placement
   → Change frequency

3. Sensitive threshold
   → Increase COM_RC_LOSS_T
   → Adjust RC_THR_FAILS

4. Power issues
   → Check battery voltage
   → Brownout causes reset
```

### RTL Not Working

```
Problem: Return to launch fails

Causes:
1. No GPS fix
   → Verify GPS healthy
   → Check satellite count

2. Geofence conflict
   → RTL path crosses exclusion zone
   → Adjust geofence

3. Navigation issues
   → Check EKF status
   → Verify compass healthy

4. Wrong altitude
   → RTL_RETURN_ALT too low
   → Obstructions in path
```

## Parameter Reference

```
Complete failsafe parameters:

# RC Loss
COM_RC_LOSS_T     0.5     # RC loss timeout (s)
RC_THR_FAILS      975     # Failsafe PWM value
NAV_RCL_ACT       2       # RC loss action
RC_RSSI_PWM       1       # RSSI via PWM
RC_RSSI_CHAN      16      # RSSI channel

# Data Link
COM_DL_LOSS_T     10      # Data link timeout (s)
NAV_DLL_ACT       0       # Data link loss action

# Battery
BAT_LOW_THR       0.25    # Low capacity threshold
BAT_LOW_VOLT      14.0    # Low voltage threshold
BAT_LOW_ACTION    0       # Low battery action
BAT_CRIT_THR      0.10    # Critical threshold
BAT_CRIT_VOLT     13.5    # Critical voltage
BAT_CRIT_ACTION   2       # Critical action
BAT_EMERGEN_THR   0.05    # Emergency threshold
BAT_EMERGEN_VOLT  13.0    # Emergency voltage

# Geofence
GF_ACTION         1       # Geofence action
GF_MAX_HOR_DIST   0       # Max horizontal distance
GF_MAX_VER_DIST   0       # Max vertical distance
GF_ALTMODE        0       # Altitude mode
GF_SOURCE         0       # Position source
GF_COUNT          0       # Fence vertex count

# Return to Launch
RTL_RETURN_ALT    30      # Return altitude
RTL_MIN_DIST      5.0     # Minimum RTL distance
RTL_LOITER_TIME   5.0     # Loiter at home (s)
RTL_DESCEND_ALT   10      # Descent altitude
RTL_LAND_DELAY    0.0     # Landing delay
RTL_LAND_TYPE     0       # Landing type
RTL_CONE_ANG      0       # Cone angle (0=disabled)

# Offboard
COM_OBL_ACT       0       # Offboard loss action
COM_OBL_RC_ACT    0       # Offboard loss with RC
```
