# Filter Configuration

## Overview

Proper filtering is essential for clean sensor data and stable flight. This guide covers filter setup for IMU sensors in Cule-OS.

## Why Filtering Matters

```
Vibration Sources:
1. Propellers (primary)
   - Frequency = RPM × blade_count / 60
   - Example: 10,000 RPM, 2-blade = 333 Hz

2. Motors
   - Frequency = poles × RPM / 120
   - Example: 14 poles, 10,000 RPM = 1167 Hz

3. Mechanical resonance
   - Frame flex
   - Loose components

Effects of vibration:
- Noisy gyro readings
- Aliasing in sampling
- Motor heating
- Reduced battery life
- Poor flight performance
```

## Cule-OS Filter Types

### Low-Pass Filter

```
Standard first-order low-pass:

Parameters:
INS_GYRO_FILTER    20      # Gyro cutoff (Hz)
INS_ACCEL_FILTER   20      # Accel cutoff (Hz)

Behavior:
- Attenuates frequencies above cutoff
- Passes frequencies below cutoff
- Simple, effective

Setting guidelines:
- High vibration: 15-20 Hz
- Medium vibration: 20-30 Hz
- Low vibration: 30-50 Hz

Trade-off:
- Lower = smoother but more delay
- Higher = more responsive but noisier
```

### Harmonic Notch Filter

```
Targets specific frequencies:

Parameters:
INS_HNTCH_ENABLE   1       # Enable notch
INS_HNTCH_FREQ     100     # Center frequency (Hz)
INS_HNTCH_BW       20      # Bandwidth (Hz)
INS_HNTCH_ATT      40      # Attenuation (dB)

Mode selection:
INS_HNTCH_MODE     1       # Throttle-based
# 0 = Disabled
# 1 = Throttle-based
# 2 = RPM-based (ESC telemetry)
# 3 = ESC-based (ESC telemetry)
# 4 = FFT-based (automatic)

For throttle-based:
INS_HNTCH_REF      0.2     # Reference throttle
INS_HNTCH_FM_RAT   1.0     # Frequency/throttle ratio
```

### Dynamic Harmonic Notch

```
Multiple harmonics for complex setups:

Parameters:
INS_HNTCH_HMNCS    3       # Harmonics (1st + 2nd + 3rd)
# Bitmask: 1=1st, 2=2nd, 4=3rd, etc.

Example harmonics:
- Prop fundamental: 150 Hz
- 2nd harmonic: 300 Hz
- 3rd harmonic: 450 Hz

All filtered with one notch
```

## Filter Configuration by Vehicle

### Mini Quad (5-7 inch)

```
Typical prop frequency: 150-250 Hz

Settings:
INS_GYRO_FILTER    100     # Higher for responsiveness
INS_GYRO_FILTER_ODR  1     # 1st order
INS_HNTCH_ENABLE   1
INS_HNTCH_MODE     1       # Throttle-based
INS_HNTCH_FREQ     200     # Set to prop frequency
INS_HNTCH_BW       40
INS_HNTCH_ATT      40
INS_HNTCH_REF      0.25

For racing:
INS_GYRO_FILTER    150     # Maximum response
INS_HNTCH_ENABLE   0       # May disable notch for latency
```

### Cinema Drone

```
Typical prop frequency: 80-120 Hz

Settings:
INS_GYRO_FILTER    30      # Smooth for footage
INS_ACCEL_FILTER   20
INS_HNTCH_ENABLE   1
INS_HNTCH_MODE     1
INS_HNTCH_FREQ     100
INS_HNTCH_BW       20
INS_HNTCH_ATT      40

Additional:
- Enable both notch and low-pass
- Lower cutoff for gimbal smoothness
```

### Heavy Lifter (large props)

```
Typical prop frequency: 50-80 Hz

Settings:
INS_GYRO_FILTER    20      # Lower for large inertia
INS_ACCEL_FILTER   15
INS_HNTCH_ENABLE   1
INS_HNTCH_MODE     1
INS_HNTCH_FREQ     60      # Lower frequency
INS_HNTCH_BW       10      # Narrower notch
INS_HNTCH_ATT      40

Note: Large props = lower freq, narrower notch
```

### Fixed-Wing

```
Less vibration, different filtering:

Settings:
INS_GYRO_FILTER    30      # Standard
INS_ACCEL_FILTER   20
INS_HNTCH_ENABLE   0       # Often not needed

Or for high-RPM setups:
INS_HNTCH_ENABLE   1
INS_HNTCH_FREQ     [prop freq]
```

## Measuring Vibration

### Using Logs

```
Check vibration levels in logs:

Vibration metrics:
- VibeX: X-axis vibration (m/s/s)
- VibeY: Y-axis vibration (m/s/s)
- VibeZ: Z-axis vibration (m/s/s)
- Clip0-2: IMU clipping counts

Acceptable levels:
- X/Y: < 30 m/s/s
- Z: < 15 m/s/s
- Clip: 0

High vibration:
- X/Y: 30-60 m/s/s (investigate)
- X/Y: > 60 m/s/s (fix before flying)
```

### Real-Time Monitoring

```
MAVLink console:
vibration

QGroundControl:
Analyze → MAVLink Inspector → VIBRATION

Onboard:
- Vibration warnings
- Log messages
- LED indicators
```

## Vibration Reduction

### Mechanical Solutions

```
1. Propeller balance
   - Use prop balancer
   - Sand heavy side
   - Critical for smooth flight

2. Motor mounting
   - Tight screws
   - Threadlock recommended
   - Check for looseness

3. FC mounting
   - Vibration dampening
   - O-ring mounting
   - Foam tape (3M VHB)
   - Gel mounts (Sorbothane)

4. Frame integrity
   - Tighten all screws
   - Check for cracks
   - Remove loose items

5. Wiring
   - Secure all wires
   - No contact with FC
   - Twist power wires
```

### Propeller Selection

```
Lower vibration props:
- Higher quality materials
- Better manufacturing tolerances
- Balanced from factory

Recommendations:
- T-Motor Carbon
- HQProp
- Gemfan
- Avoid cheap unbalanced props
```

## Troubleshooting

### High Vibration Warnings

```
Symptoms: Constant vibration warnings

Solutions:
1. Check prop balance
2. Check motor mounts
3. Add FC isolation
4. Lower filter cutoff
5. Enable/adjust notch filter
6. Check for damaged props
```

### Hot Motors

```
Symptoms: Motors overheating

Causes:
1. High D term
   → Reduce MC_ROLLRATE_D
   → Reduce filter cutoff

2. Vibration
   → Mechanical fixes
   → Better filtering

3. Undersized motors
   → Check motor ratings
   → Reduce AUW

4. Bent shafts
   → Replace motors
```

### Delayed Response

```
Symptoms: Sluggish feel, delayed response

Causes:
1. Filters too low
   → Increase INS_GYRO_FILTER
   → Reduce notch attenuation

2. Sampling rate
   → Increase INS_GYRO_RATE
   → Use 2kHz or 4kHz

3. PID D term too high
   → Compensating for noise
   → Fix source of noise
```

### Oscillation After Filtering

```
Symptoms: Still oscillates with good filters

Check:
1. Mechanical resonance
   → Different frame stiffness
   → Change prop size

2. Control loop instability
   → Reduce P gains
   → Increase D gains

3. Sampling aliasing
   → Higher gyro rate
   → Lower filter cutoff

4. ESC issues
   → Try different protocol
   → Adjust PWM frequency
```

## Advanced Filtering

### Second-Order Filters

```
Steeper roll-off:

INS_GYRO_FILTER_ODR  2      # 2nd order
INS_GYRO_FILTER      30      # Can use higher cutoff

Benefits:
- Better attenuation
- Sharper cutoff
- Less delay than lower 1st order

Trade-off:
- More phase delay
- May affect responsiveness
```

### Multi-Notch Filters

```
Multiple notches for complex setups:

INS_HNTCH_HMNCS    7       # 1st + 2nd + 3rd harmonic
INS_HNTCH_OPTS     1       # Dynamic harmonics

For different prop sizes:
- Large props: Lower fundamental
- Different RPM ranges
- Auto-adjusts
```

### FFT-Based Filtering

```
Automatic frequency detection:

INS_HNTCH_MODE     4       # FFT-based
INS_HNTCH_FREQ     100     # Initial guess
INS_HNTCH_BW       20
INS_HNTCH_ATT      40

Benefits:
- Automatically finds peak frequency
- Adapts to changing conditions
- No manual tuning needed

Requirements:
- Processing power
- May add slight delay
```

## Sampling Rate

### Gyro Sampling

```
Set sampling rate:
INS_GYRO_RATE      1000    # 1 kHz
INS_ACCEL_RATE     1000    # 1 kHz

Options:
- 500 Hz: Minimum
- 1000 Hz: Standard
- 2000 Hz: High performance
- 4000 Hz: Maximum (H7 processors)

Trade-off:
- Higher = better resolution
- Higher = more processing
- Higher = more logging data
```

### Anti-Aliasing

```
Nyquist theorem:
- Sample rate must be > 2× highest frequency
- 1000 Hz sampling = max 500 Hz signal

If vibration > 500 Hz:
- Increase sampling rate
- Or improve mechanical filtering

Cule-OS IMUs:
- Most support 1-8 kHz sampling
- On-chip anti-aliasing filters
- Software filters additional
```

## Parameter Reference

```
Filter parameters:

# Low-pass
INS_GYRO_FILTER       20    # Gyro cutoff (Hz)
INS_GYRO_FILTER_ODR   1     # Filter order
INS_ACCEL_FILTER      20    # Accel cutoff (Hz)

# Notch
INS_HNTCH_ENABLE      0     # Enable notch
INS_HNTCH_MODE        0     # Notch mode
INS_HNTCH_FREQ        80    # Center freq (Hz)
INS_HNTCH_BW          20    # Bandwidth (Hz)
INS_HNTCH_ATT         40    # Attenuation (dB)
INS_HNTCH_REF         0.0   # Reference value
INS_HNTCH_FM_RAT      1.0   # Freq ratio
INS_HNTCH_HMNCS       1     # Harmonics
INS_HNTCH_OPTS        0     # Options

# Sampling
INS_GYRO_RATE         1000  # Gyro rate (Hz)
INS_ACCEL_RATE        1000  # Accel rate (Hz)
```

## Reference

- [Digital Filter Design](https://en.wikipedia.org/wiki/Digital_filter)
- [Butterworth Filter](https://en.wikipedia.org/wiki/Butterworth_filter)
- [Notch Filter](https://en.wikipedia.org/wiki/Band-stop_filter)
- [PX4 Vibration Isolation](https://docs.px4.io/main/en/advanced_config/vibration_isolation.html)
