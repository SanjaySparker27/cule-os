# Flight Controller Pinouts

Detailed pinout reference for all supported flight controllers.

## Pixhawk 6X

### Main Connector Layout

```
Pixhawk 6X Connector Layout (Top View)
══════════════════════════════════════════════════════════════════

                           ┌─────────────┐
                           │   USB-C     │
                           └─────────────┘

        [I2C]  [CAN1]  [CAN2]  [ETH]  [SPI]  [DSM]
         │      │       │       │      │      │

    [GPS1] [GPS2] [TELEM1] [TELEM2] [TELEM3] [TELEM4]
      │      │       │        │        │        │

                         [SD Card]

    [MAIN OUT]                                    [AUX OUT]
    1 2 3 4 5 6 7 8                              1 2 3 4 5 6
    │ │ │ │ │ │ │ │                              │ │ │ │ │ │

                   [POWER1]    [POWER2]
                     │           │
```

### Main Output (8 PWM)

| Pin | Color | Function | Default |
|-----|-------|----------|---------|
| 1 | Red | VCC | 5V output |
| 2 | Black | GND | Ground |
| 3 | White | Signal 1 | Motor 1 |
| 4 | White | Signal 2 | Motor 2 |
| 5 | White | Signal 3 | Motor 3 |
| 6 | White | Signal 4 | Motor 4 |
| 7 | White | Signal 5 | Motor 5/RC |
| 8 | White | Signal 6 | Motor 6/RC |
| 9 | White | Signal 7 | Motor 7/RC |
| 10 | White | Signal 8 | Motor 8/RC |

**Pin Functions**: Motor outputs (DShot capable), can be remapped for servos

### AUX Output (6 PWM)

| Pin | Color | Function | Default |
|-----|-------|----------|---------|
| 1 | Red | VCC | 5V output |
| 2 | Black | GND | Ground |
| 3 | White | Signal 1 | AUX 1 |
| 4 | White | Signal 2 | AUX 2 |
| 5 | White | Signal 3 | AUX 3 |
| 6 | White | Signal 4 | AUX 4 |
| 7 | White | Signal 5 | AUX 5 |
| 8 | White | Signal 6 | AUX 6 |

**Pin Functions**: Servo outputs, gimbal control, GPIO

### GPS1 Port (JST-GH 6-pin)

| Pin | Color | Function | Direction |
|-----|-------|----------|-----------|
| 1 | Red | 5V | Power out |
| 2 | Black | GND | Ground |
| 3 | Green | TX | FC → GPS |
| 4 | Yellow | RX | GPS → FC |
| 5 | Blue | SCL | I2C Clock |
| 6 | White | SDA | I2C Data |

### TELEM1 Port (Companion Computer)

| Pin | Color | Function | Notes |
|-----|-------|----------|-------|
| 1 | Red | 5V | Power out |
| 2 | Black | GND | Ground |
| 3 | Green | TX | FC → Companion |
| 4 | Yellow | RX | Companion → FC |
| 5 | Blue | CTS | Flow control |
| 6 | White | RTS | Flow control |

**Default**: MAVLink2 @ 921600 baud

### TELEM2 Port (GCS Radio)

| Pin | Color | Function | Notes |
|-----|-------|----------|-------|
| 1 | Red | 5V | Power out |
| 2 | Black | GND | Ground |
| 3 | Green | TX | FC → Radio |
| 4 | Yellow | RX | Radio → FC |
| 5 | Blue | CTS | Flow control |
| 6 | White | RTS | Flow control |

**Default**: MAVLink1 @ 57600 baud

### CAN1/CAN2 Port (JST-GH 4-pin)

| Pin | Color | Function |
|-----|-------|----------|
| 1 | Red | 5V |
| 2 | Black | GND |
| 3 | Green | CAN_H |
| 4 | Yellow | CAN_L |

### I2C Port (JST-GH 4-pin)

| Pin | Color | Function |
|-----|-------|----------|
| 1 | Red | 5V |
| 2 | Black | GND |
| 3 | Green | SCL |
| 4 | Yellow | SDA |

### POWER1/POWER2 Port

| Pin | Color | Function |
|-----|-------|----------|
| 1 | Red | VCC (Battery voltage) |
| 2 | Black | VCC (Battery voltage) |
| 3 | Black | GND |
| 4 | Black | GND |
| 5 | White | Current sense |
| 6 | Yellow | Voltage sense |

## DAKEFPV H743 Pro

### Board Layout

```
DAKEFPV H743 Pro Board Layout (Top View)
══════════════════════════════════════════════════════════════════

                    [USB] (Micro)
                     │
    ┌──────────────────────────────────────────────────────┐
    │                                                      │
    │  [GPS]  [R1]  [R2]  [R3]  [R4]  [R5]  [R6]  [R7] [R8]│
    │                                                      │
    │     M1  M2  M3  M4  M5  M6  M7  M8                  │
    │     ●   ●   ●   ●   ●   ●   ●   ●                   │
    │                                                      │
    │     S1  S2  S3  S4                                   │
    │     ●   ●   ●   ●                                    │
    │                                                      │
    │  [VTx] [CAM1] [CAM2] [CURR] [5V] [9V]                │
    │                                                      │
    │  [I2C/SDA] [I2C/SCL]                                 │
    │                                                      │
    └──────────────────────────────────────────────────────┘
                    │
              [Battery Input]
```

### Motor Outputs (M1-M8)

| Pad | Name | Timer | Group | Protocol |
|-----|------|-------|-------|----------|
| M1 | Motor 1 | TIM2_CH1 | Group 1 | DShot/PWM |
| M2 | Motor 2 | TIM2_CH2 | Group 1 | DShot/PWM |
| M3 | Motor 3 | TIM2_CH3 | Group 1 | DShot/PWM |
| M4 | Motor 4 | TIM2_CH4 | Group 1 | DShot/PWM |
| M5 | Motor 5 | TIM4_CH1 | Group 2 | DShot/PWM |
| M6 | Motor 6 | TIM4_CH2 | Group 2 | DShot/PWM |
| M7 | Motor 7 | TIM4_CH3 | Group 2 | DShot/PWM |
| M8 | Motor 8 | TIM4_CH4 | Group 2 | DShot/PWM |

**Note**: Motors in same group must use same protocol

### Servo Outputs (S1-S4)

| Pad | Name | Timer | Group | Protocol |
|-----|------|-------|-------|----------|
| S1 | Servo 1 | TIM3_CH1 | Group 3 | DShot/PWM |
| S2 | Servo 2 | TIM3_CH2 | Group 3 | DShot/PWM |
| S3 | Servo 3 | TIM1_CH1 | Group 4 | PWM only |
| S4 | Servo 4 | TIM1_CH2 | Group 4 | PWM only |

### UART Ports (R1-R8 = UART1-8)

```
UART Pinout (Standard for all ports):

[TX] [RX] [5V] [GND] - 4-pin connector per UART

UART Mapping:
┌─────────┬────────────┬─────────────┬────────┐
│ Label   │ ArduPilot  │ Default Use │ DMA    │
├─────────┼────────────┼─────────────┼────────┤
│ R1      │ SERIAL1    │ GPS         │ Yes    │
│ R2      │ SERIAL2    │ MAVLink2    │ No     │
│ R3      │ SERIAL3    │ ESC Telemet │ No     │
│ R4      │ SERIAL4    │ DisplayPort │ Yes    │
│ R5      │ SERIAL5    │ RC Input    │ Yes(RX)│
│ R6      │ SERIAL6    │ User        │ Yes    │
│ R7      │ SERIAL7    │ User        │ Yes    │
│ R8      │ SERIAL8    │ User        │ No     │
└─────────┴────────────┴─────────────┴────────┘
```

### I2C Port

| Pad | Function | Notes |
|-----|----------|-------|
| SDA | I2C Data | External compass, baro |
| SCL | I2C Clock | External compass, baro |

**Note**: Internal baro uses I2C, external compass should be added on same bus

### Power Connections

| Pad | Function | Voltage | Max Current |
|-----|----------|---------|-------------|
| VBAT | Battery input | 4S-12S | 130A (measured) |
| 5V | 5V output | 5V | 3A |
| 9V | VTX power | 9V (BEC) | 3A |
| CURR | Current sense | Analog | 130A max |

### Video Connections

| Pad | Function | Notes |
|-----|----------|-------|
| CAM1 | Video input 1 | Analog camera |
| CAM2 | Video input 2 | Analog camera |
| VTx | Video output | To video transmitter |
| 9V | VTX power | 9V 3A BEC |

**Camera Switching**: GPIO controlled, CAM1 default

## Connector Types Reference

### JST-GH (1.25mm)

```
JST-GH 6-pin connector (Side view)

      ┌─────────────────────┐
      │ 1  2  3  4  5  6    │
      │ ●  ●  ●  ●  ●  ●    │
      │ │  │  │  │  │  │    │
      └─────────────────────┘
        1.25mm pitch

Pin 1: VCC (Red)
Pin 2: GND (Black)
Pin 3: Signal 1
Pin 4: Signal 2
Pin 5: Signal 3
Pin 6: Signal 4
```

### Servo/Dupont (2.54mm)

```
Servo 3-pin connector

      ┌───────────┐
      │ 1  2  3   │
      │ │  │  │   │
      │ │  │  │   │
      GND VCC Signal
      (Black/Red/White or Brown/Red/Yellow)
```

## Pin Mapping Quick Reference

### Pixhawk 6X Default Mapping

```
┌─────────────────────────────────────────────────────────────┐
│                    Pixhawk 6X Pin Map                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PWM Outputs:                                                │
│  MAIN1-4: Motors 1-4 (Quad)                                  │
│  MAIN5-8: Motors 5-8 (Hex/Octo) or AUX functions             │
│  AUX1-6:  Servos, gimbal, parachute, etc.                    │
│                                                              │
│  Serial Ports:                                               │
│  SERIAL1: TELEM1 → MAVLink (Companion) @ 921600              │
│  SERIAL2: TELEM2 → MAVLink (GCS) @ 57600                     │
│  SERIAL3: GPS1 → u-blox GPS @ 115200                         │
│  SERIAL4: TELEM3 → OSD/peripheral                            │
│  SERIAL5: TELEM4 → Peripheral                                │
│  SERIAL6: USB → MAVLink                                      │
│  SERIAL7: GPS2 → Secondary GPS                               │
│  SERIAL8: ETH → Ethernet MAVLink                             │
│                                                              │
│  I2C:                                                        │
│  I2C1: GPS1 (SCL/SDA) → Compass                              │
│  I2C2: I2C port → External sensors                           │
│  I2C3: Internal → IMU temp, etc.                             │
│                                                              │
│  SPI: Internal → IMU, FRAM                                   │
│                                                              │
│  CAN:                                                        │
│  CAN1: UAVCAN peripherals                                    │
│  CAN2: UAVCAN peripherals                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### DAKEFPV H743 Pro Default Mapping

```
┌─────────────────────────────────────────────────────────────┐
│                 DAKEFPV H743 Pro Pin Map                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PWM Outputs:                                                │
│  M1-M4:  Motors 1-4 (Quad) - Group 1 (TIM2)                  │
│  M5-M8:  Motors 5-8 (Hex/Octo) - Group 2 (TIM4)              │
│  S1-S2:  Servos or additional motors - Group 3 (TIM3)        │
│  S3-S4:  Servos (PWM only) - Group 4 (TIM1)                  │
│  LED:    WS2812 LED strip - Group 5 (TIM5)                   │
│                                                              │
│  Serial Ports:                                               │
│  SERIAL1 (R1) → GPS @ 115200                                 │
│  SERIAL2 (R2) → MAVLink2 (Companion) @ 921600                │
│  SERIAL3 (R3) → ESC Telemetry                                │
│  SERIAL4 (R4) → DisplayPort/MSP                              │
│  SERIAL5 (R5) → RC Input (SBUS/CRSF/etc)                     │
│  SERIAL6 (R6) → User/Available                               │
│  SERIAL7 (R7) → User/Available                               │
│  SERIAL8 (R8) → User/Available                               │
│  SERIAL0 (USB) → MAVLink                                     │
│                                                              │
│  I2C:                                                        │
│  I2C2: SDA/SCL pads → External compass                       │
│                                                              │
│  SPI: Internal → IMU (x2), OSD, Flash                        │
│                                                              │
│  CAN:                                                        │
│  CAN1: Available on separate pads                            │
│                                                              │
│  GPIO:                                                       │
│  GPIO81: Camera switch (CAM1/CAM2)                           │
│  GPIO82: VTX power control                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## See Also

- [Flight Controllers](./flight-controllers.md) - FC overview
- [Wiring Diagrams](./wiring.md) - Connection diagrams
- [MAVLink Setup](./mavlink.md) - Protocol configuration
