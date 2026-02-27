# Pre-Flight Checklist

## Overview

A thorough pre-flight checklist is essential for safe UAV operations. This checklist covers all critical items before every flight, organized by category for efficient workflow.

## Pre-Flight Preparation

### Weather Assessment

```
□ Wind speed < vehicle rating
  - Mini quad: < 15 m/s
  - Cinema drone: < 12 m/s
  - Fixed-wing: < 10 m/s

□ Visibility > 3 km (VLOS requirement)

□ No precipitation

□ Temperature within battery limits
  - LiPo: 0°C to 60°C
  - Li-ion: -20°C to 60°C

□ Check NOTAMs and airspace

□ Cloud base > 150m (500ft) above flight altitude
```

### Site Assessment

```
□ Clear area for takeoff (5m radius minimum)

□ Clear flight path identified

□ Landing zone designated

□ Obstacles identified and avoided
  - Power lines
  - Buildings
  - Trees
  - People
  - Animals

□ Emergency landing areas noted

□ Permission obtained (if on private property)

□ Bystanders at safe distance (> 30m)
```

## Physical Inspection

### Airframe

```
□ Visual inspection complete
  - No cracks in frame
  - No loose fasteners
  - Arms straight and secure
  - Landing gear secure

□ Propellers
  - Correct size and pitch
  - No cracks or chips
  - Securely attached
  - Correct rotation direction
  - Spin freely by hand

□ Motors
  - Secure mounting
  - No loose screws
  - Bell spins freely
  - No debris in vents
  - Leads secure

□ Battery
  - Properly secured
  - Velcro/strap tight
  - Connector clean
  - Balance lead accessible
```

### Payload and Gimbal

```
□ Gimbal
  - Powered on successfully
  - Initializes level
  - Responds to control
  - No error messages

□ Camera
  - SD card inserted
  - Battery charged
  - Lens clean
  - Recording tested

□ Additional payload
  - Securely mounted
  - Within CG limits
  - Within weight limits
  - Cables managed
```

## Power System

### Battery Checks

```
□ Voltage check
  - Main battery > 3.7V/cell (storage)
  - Main battery > 4.0V/cell (flight)
  - Check with multimeter or GCS

□ Capacity check
  - Verify sufficient for mission
  - Reserve 30% minimum
  - Consider wind consumption

□ Physical inspection
  - No swelling
  - No punctures
  - Leads intact
  - Connector secure

□ Temperature
  - Ambient temperature OK
  - Warm up cold batteries
```

### Power Distribution

```
□ Power module
  - Voltage reading correct
  - Current reading zero
  - Connection secure

□ ESCs
  - Powered on correctly
  - No error tones
  - Arms beep sequence correct

□ BEC output
  - 5V rail stable
  - Servos respond (if applicable)
```

## Electronics Check

### Flight Controller

```
□ LED status
  - Main LED: appropriate color
  - GPS LED: blinking or solid
  - No error codes

□ SD card
  - Inserted
  - Has free space
  - Logging enabled

□ USB port
  - Cover installed
  - No debris

□ GPS module
  - LED indicating fix
  - Clear view of sky
  - Secure mounting
```

### Radio and Telemetry

```
□ RC transmitter
  - Battery charged
  - Antenna extended
  - Sticks centered
  - Switches in known positions
  - Range check passed

□ Receiver
  - Bound to transmitter
  - RSSI good
  - Failsafe set

□ Telemetry radio
  - Powered on
  - Link established
  - Ground station receiving
```

## Software Verification

### Ground Control Station

```
□ QGroundControl connected

□ Vehicle recognized

□ Firmware version correct

□ Parameter check
  - No red parameters
  - Recent changes reviewed

□ Flight modes configured
  - Switch positions verified
  - Mode transitions tested

□ Failsafe settings
  - Return to land configured
  - Geofence enabled
  - Battery failsafe set
```

### Sensor Status

```
□ GPS
  - 3D fix or better
  - HDOP < 2.0
  - 8+ satellites
  - Position matches location

□ Compass
  - Healthy
  - No variance warnings
  - Heading correct

□ IMU
  - No vibration warnings
  - Temperature stable
  - Calibration valid

□ Battery
  - Voltage correct
  - Current reading zero
  - Percentage accurate
```

## Control Checks

### Pre-Arm Checks

```
□ Attempt arm (without props if first flight)

□ Verify pre-arm checks pass:
  - Safety switch pressed
  - No errors in QGC
  - Green status indicators

□ If arm fails:
  - Read error message
  - Address issue
  - Retry arm
```

### Control Surface Verification (Fixed-Wing)

```
□ Ailerons
  - Right stick right → right aileron up
  - Right stick left → left aileron up

□ Elevator
  - Right stick back → elevator up
  - Right stick forward → elevator down

□ Rudder
  - Left stick left → rudder left
  - Left stick right → rudder right

□ Throttle
  - Left stick forward → throttle increases
  - Cut on arm (safety feature)
```

### Motor Verification (Multirotor)

```
□ Remove propellers first!

□ Arm vehicle

□ Test each motor individually
  - Low throttle
  - Verify correct direction
  - All motors spin at same rate

□ Throttle test
  - Smooth increase
  - No stuttering
  - Linear response

□ Disarm

□ Install propellers
  - Correct direction
  - Secure tight
```

### Mode Switch Check

```
□ Position 1 (e.g., Stabilize/Manual)
  - Switch to position
  - Verify mode change in QGC
  - Vehicle responds correctly

□ Position 2 (e.g., Altitude Hold)
  - Switch to position
  - Verify mode change
  - Altitude hold engages

□ Position 3 (e.g., Position Hold)
  - Switch to position
  - Verify GPS mode active
  - Position lock acquired

□ Return to previous mode
```

## Final Pre-Flight

### Position and Orientation

```
□ Vehicle positioned for takeoff
  - Clear area
  - Level surface
  - Pointing appropriate direction

□ Gimbal initialized
  - Camera level
  - No gimbal errors

□ Payload secure
  - All mounts tight
  - Balanced

□ Antennas positioned
  - GPS clear view
  - RC antenna clear
  - Telemetry antenna oriented
```

### Communication Check

```
□ Radio communication test
  - "Takeoff in 30 seconds"
  - Acknowledge from crew

□ Emergency procedures reviewed
  - Who calls emergency services
  - Landing zone clear
  - Safety observer ready

□ Flight plan communicated
  - Route described
  - Altitudes stated
  - Duration estimated
```

### Documentation

```
□ Flight log started
  - QGC recording
  - Onboard SD logging
  - Camera recording

□ Pre-flight notes recorded
  - Battery voltage
  - GPS satellite count
  - Weather conditions
  - Any anomalies

□ Timer started
  - For battery management
  - Flight time tracking
```

## Takeoff Checklist

### Immediate Pre-Takeoff

```
□ Final visual scan
  - Area clear
  - No new obstacles
  - Weather unchanged

□ GCS recording confirmed

□ RC control verified
  - Sticks respond
  - Switches function

□ Arm vehicle
  - Safety switch
  - Throttle down
  - Rudder right (if required)

□ Listen for errors
  - Tone alerts
  - GCS warnings

□ Increase throttle smoothly
  - Verify lift-off
  - Check for drift
  - Confirm control response
```

### First 10 Seconds

```
□ Hover at 3 meters
  - Stable position
  - No drift
  - Controls responsive

□ Check telemetry
  - Battery voltage stable
  - Current draw normal
  - GPS lock maintained

□ Listen to motors
  - Smooth sound
  - No unusual noises

□ Verify orientation
  - Nose direction correct
  - No compass issues

□ If any issues:
  - Land immediately
  - Investigate problem
  - Do not continue flight
```

## Emergency Pre-Flight Items

### Emergency Equipment

```
□ Fire extinguisher nearby (for battery fire)

□ First aid kit accessible

□ Phone charged and accessible

□ Emergency contact numbers ready

□ Sun protection

□ Water available
```

### Contingency Planning

```
□ Lost link procedure reviewed

□ Flyaway procedure reviewed

□ Emergency landing procedure reviewed

□ Battery failure procedure reviewed

□ Controlled airspace exit plan
```

## Abbreviated Checklist (Experienced Pilots)

```
For routine flights by experienced operators:

□ Weather OK
□ Site clear
□ Battery charged and secured
□ Props on, tight
□ GPS 3D fix
□ Sensors healthy
□ RC link good
□ GCS connected
□ Arm and test hover
□ Fly mission
```

⚠️ **Use full checklist for:**
- New vehicle
- Modified vehicle
- First flight of day
- New location
- After maintenance
- Commercial operations

## Documentation Template

```
Pre-Flight Log:

Date: ___________
Location: ___________
Pilot: ___________
Observer: ___________

Vehicle ID: ___________
Battery #1: ___________ V
Battery #2: ___________ V (if applicable)

Weather:
  Wind: ___________ m/s
  Temp: ___________ °C
  Visibility: ___________ km

GPS Status:
  Sats: ___________
  HDOP: ___________

Flight Plan:
  Duration: ___________ min
  Max altitude: ___________ m
  Area: ___________

Notes: ___________

□ Full checklist completed
□ Emergency procedures reviewed

Pilot signature: ___________
Time: ___________
```

## Reference

- [FAA Pre-Flight Checklist](https://www.faa.gov)
- [CASA Drone Safety](https://www.casa.gov.au)
- [EASA Drone Regulations](https://www.easa.europa.eu)
