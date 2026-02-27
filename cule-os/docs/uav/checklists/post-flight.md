# Post-Flight Checklist

## Overview

A proper post-flight procedure ensures data preservation, equipment longevity, and identification of any issues before the next flight.

## Immediate Post-Landing

### After Touchdown

```
□ Disarm immediately
  - Throttle to minimum
  - Hold disarm (if required)
  - Verify motors stopped

□ Check for damage
  - Visual inspection
  - Unusual sounds
  - Smoke or smell

□ Record landing time
  - Stop flight timer
  - Note actual flight duration

□ Secure aircraft
  - Stay clear of props
  - Position for inspection
  - Apply brake if applicable
```

### Initial Inspection

```
□ Visual damage check
  - Props: cracks, chips, loose
  - Frame: cracks, bent arms
  - Gimbal: level, no errors
  - Landing gear: intact

□ Temperature check
  - Motors: warm is OK, hot is not
  - ESCs: should not be burning hot
  - Battery: check for swelling

□ Debris check
  - Props clean
  - Motors clean
  - Camera lens clean

□ Connection check
  - Battery connector tight
  - Antennas secure
  - Cables intact
```

## Data Management

### Flight Log Downloads

```
□ Download onboard logs
  - Remove SD card
  - Copy .ulg files to computer
  - Verify file integrity
  - Reinsert SD card

□ Export QGroundControl logs
  - Telemetry log (.tlog)
  - GPS track (.gpx)
  - Video geotags (if applicable)

□ Backup strategy
  - Local copy
  - Cloud backup
  - Mission folder organization
```

### Flight Log Review

```
□ Check for warnings
  - Open in Flight Review/PX4 logs
  - Review error messages
  - Check vibration levels
  - Verify GPS quality

□ Performance metrics
  - Maximum speed
  - Maximum altitude
  - Battery consumption
  - Flight time

□ Anomaly review
  - Any unexpected behavior
  - Control issues
  - Sensor warnings
  - Communication drops
```

## Battery Care

### Post-Flight Battery State

```
□ Check voltage
  - Note per-cell voltage
  - Should be > 3.5V/cell
  - Record in log

□ Check temperature
  - Warm is normal
  - Hot requires investigation
  - Allow to cool before charging

□ Physical inspection
  - No swelling
  - No damage
  - Leads intact
  - Connector clean
```

### Storage Preparation

```
□ Storage charge (if not flying soon)
  - 3.8V per cell (approx 50%)
  - Use storage mode on charger
  - Store in cool, dry place

□ Flight ready (if flying again soon)
  - Can remain fully charged 24-48h
  - Monitor voltage
  - Avoid high temperatures

□ Label battery
  - Flight count
  - Any issues noted
  - Date of first use
```

## Equipment Storage

### Aircraft Storage

```
□ Clean aircraft
  - Remove dirt/debris
  - Clean camera lens
  - Check motor vents

□ Secure moving parts
  - Gimbal lock installed
  - Props removed or secured
  - Payload removed

□ Protection
  - Gimbal cover
  - Lens cap
  - Transport case

□ Environmental considerations
  - Avoid direct sunlight
  - Avoid high humidity
  - Avoid temperature extremes
```

### Accessory Storage

```
□ Battery storage
  - Fireproof bag recommended
  - Separated from aircraft
  - Partial charge for long storage

□ Transmitter
  - Antenna retracted
  - Battery charged or removed
  - Carrying case

□ Ground station
  - Laptop/tablet charged
  - Cables organized
  - Telemetry radios stored
```

## Documentation

### Flight Log Entry

```
Required information:

Date: ___________
Location: ___________
Pilot: ___________

Pre-flight:
  Battery voltage: ___________
  GPS satellites: ___________
  Weather: ___________

Flight:
  Duration: ___________ minutes
  Max altitude: ___________ m
  Distance: ___________ km
  Flight modes used: ___________

Post-flight:
  Battery remaining: ___________
  Issues: ___________
  Damage: ___________
  Maintenance needed: ___________

Signature: ___________
```

### Issues and Maintenance Log

```
Track all issues for maintenance planning:

Issue #001:
  Date: 2024-01-15
  Description: Motor 3 running hot
  Severity: Medium
  Action: Check mounting screws, inspect bearings
  Status: Resolved

Issue #002:
  Date: 2024-01-15
  Description: Compass variance warning at takeoff
  Severity: Low
  Action: Re-calibrate compass
  Status: Pending
```

## Preventive Maintenance Triggers

### Flight Hour Based

```
Every 10 flights:
□ Check all fasteners
□ Inspect propellers
□ Clean airframe
□ Check gimbal balance

Every 25 flights:
□ Motor bearing check
□ ESC inspection
□ Wiring inspection
□ Connector cleaning

Every 50 flights:
□ Full parameter review
□ Compass re-calibration
□ IMU thermal calibration
□ Replace consumables (props, etc.)

Every 100 flights:
□ Professional inspection
□ Motor replacement (if high-wear)
□ Cable replacement
□ Software updates
```

### Condition Based

```
Immediate maintenance required:
□ Hard landing
□ Crash or collision
□ Water exposure
□ Smoke or burning smell
□ Unusual vibrations
□ Failed components
□ GPS issues persist after calibration
```

## Battery Log

```
Track battery health over time:

Battery ID: A001
Purchased: 2024-01-01
Cycles: 45

Date        Pre-V   Post-V  Cap%    Notes
2024-01-15  16.8V   14.8V   25%     Normal
2024-01-14  16.8V   14.6V   22%     Slight puffing noted

Replacement criteria:
□ Capacity < 80% of rated
□ Visible puffing
□ Internal resistance increased >50%
□ More than 200 cycles
```

## Debrief

### Flight Review

```
□ Mission objectives met?
  - Primary goals achieved
  - Data collected
  - Photos/video quality

□ Operational notes
  - What went well
  - What needs improvement
  - Lessons learned

□ Site notes
  - Access issues
  - Hazards identified
  - Permission status
```

### Equipment Notes

```
□ Performance observations
  - Flight characteristics
  - Control response
  - Autonomous behavior
  - Payload performance

□ Issues to monitor
  - Intermittent problems
  - Wear indicators
  - Software glitches

□ Upgrade considerations
  - Equipment limitations
  - New requirements
  - Technology updates
```

## Next Flight Preparation

### Immediate Preparation

```
If flying again same day:

□ Battery charging
  - Start charging immediately
  - Monitor charge progress
  - Prepare spare batteries

□ Data offload
  - Copy media from cameras
  - Clear SD cards
  - Format if necessary

□ Quick inspection
  - Props still secure
  - No damage from last flight
  - Ready for next mission
```

### Long-term Preparation

```
□ Maintenance scheduling
  - Book inspections
  - Order spare parts
  - Plan upgrades

□ Regulatory compliance
  - Log flight hours
  - Update maintenance records
  - Renew permits if needed

□ Skill development
  - Training needs
  - Certification renewal
  - New procedures
```

## Troubleshooting Guide

### Post-Flight Issues

```
Issue: Battery won't charge
→ Check voltage with multimeter
→ Try different charger
→ May need replacement if <2.5V/cell

Issue: Hot motor
→ Check for debris
→ Verify prop balance
→ Check mounting screws
→ May be normal after hard flight

Issue: Gimbal error
→ Power cycle
→ Check balance
→ Inspect cables
→ Calibrate if persistent

Issue: Log file corrupt
→ Check SD card health
→ Use recovery tools
→ Format and retry
→ Replace SD card if recurring
```

## Storage Checklist

### Short-term (1-7 days)

```
□ Aircraft in case or safe location
□ Batteries at storage charge (if >3 days)
□ Props removed or secured
□ Gimbal locked
□ Equipment organized
```

### Long-term (>7 days)

```
□ Batteries at storage charge (3.8V/cell)
□ Batteries in fireproof container
□ Aircraft in climate-controlled space
□ Desiccant in storage case
□ Periodic battery voltage check
□ Software/firmware updates reviewed
```

## Reference

- [Battery University - LiPo Storage](http://batteryuniversity.com)
- [FAA Aircraft Maintenance](https://www.faa.gov)
- [Manufacturer maintenance schedules](https://docs.cubepilot.org)
