# Failsafe Configuration

## RC Signal Loss

```
Configuration:
COM_RC_LOSS_T     0.5     # Timeout in seconds
NAV_RCL_ACT       2       # Action on RC loss

Actions:
0 = Disabled
1 = Hold
2 = Return to launch (Recommended)
3 = Land
4 = Offboard
5 = Terminate
```

## Battery Failsafe

```
Thresholds:
BAT_LOW_THR       0.25    # 25% remaining
BAT_CRIT_THR      0.10    # 10% remaining

Actions:
BAT_LOW_ACTION    0       # 0=Warning, 1=RTL, 2=Land
BAT_CRIT_ACTION   2       # Land
```

## Geofence

```
GF_MAX_HOR_DIST   1000    # Max radius from home (m)
GF_MAX_VER_DIST   120     # Max altitude (m)
GF_ACTION         3       # Return on breach
```

## Return to Launch

```
RTL_RETURN_ALT    30      # Return altitude (m)
RTL_MIN_DIST      5.0     # Minimum RTL distance
RTL_LOITER_TIME   5.0     # Loiter at home (s)
```
