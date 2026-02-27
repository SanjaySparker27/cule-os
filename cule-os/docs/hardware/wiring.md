# Wiring Diagrams

Complete wiring diagrams and connection guides for Cule OS autonomous vehicles.

## Standard UAV Wiring

### Complete System Overview

```
                              Cule OS UAV System Wiring
═══════════════════════════════════════════════════════════════════════════════════

                                       Battery (4S-12S LiPo)
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
              ┌─────────┐           ┌─────────┐           ┌─────────┐
              │ Power   │           │ Power   │           │ Power   │
              │Module 1 │           │Module 2 │           │Module 3 │
              │  (ESC)  │           │  (BEC)  │           │  (BEC)  │
              └────┬────┘           └────┬────┘           └────┬────┘
                   │                     │                     │
        ┌──────────┼──────────┐          │                     │
        │          │          │          │                     │
        ▼          ▼          ▼          ▼                     ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐        ┌──────────┐
   │  ESC1  │ │  ESC2  │ │  ESC3  │ │  5V/6A   │        │ 12V/3A   │
   │ Motor1 │ │ Motor2 │ │ Motor3 │ │   BEC    │        │   BEC    │
   └────────┘ └────────┘ └────────┘ └────┬─────┘        └────┬─────┘
        │                     ...       │                   │
        │                               │                   │
        ▼                               ▼                   ▼
   ┌────────┐                      ┌───────────┐       ┌───────────┐
   │ Motor1 │                      │ Companion │       │   Video   │
   └────────┘                      │ Computer  │       │   Tx/Rx   │
        │                          │ (Jetson)  │       └───────────┘
        │                          └─────┬─────┘
        │                                │
        │              ┌─────────────────┼─────────────────┐
        │              │                 │                 │
        │              ▼                 ▼                 ▼
   ┌────────┐    ┌──────────┐      ┌──────────┐      ┌──────────┐
   │ Motor2 │    │  USB/UART │      │   CSI    │      │   USB    │
   └────────┘    │  (FC)     │      │  Camera  │      │  Camera  │
        │        └──────────┘      └──────────┘      └──────────┘
        │              │
        │              ▼
   ┌────────┐    ┌──────────────────────────────────────────────────┐
   │ Motor3 │    │              Flight Controller                    │
   └────────┘    │                                                    │
        │        │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  │
        │        │  │  IMU   │  │   GPS  │  │Telemetry│  │  PWM   │  │
        │        │  │ Fusion │  │  (UART)│  │ (UART)  │  │ Outputs│  │
        │        │  └────────┘  └────────┘  └────────┘  └────────┘  │
        │        └──────────────────────────────────────────────────┘
        │                     │    │          │
        │                     │    │          │
        ▼                     ▼    ▼          ▼
   ┌────────┐            ┌────────┐  ┌──────────┐  ┌──────────┐
   │ Motor4 │            │   GPS  │  │Telemetry │  │  Radio   │
   └────────┘            │ Module │  │  Radio   │  │ Receiver │
        │               └────────┘  └──────────┘  └──────────┘
        │
   ┌────────┐
   │  ...   │
   └────────┘
```

## Companion Computer to Flight Controller

### UART Connection (Recommended)

```
Jetson Orin / Raspberry Pi to Pixhawk 6X (UART)
══════════════════════════════════════════════════════════════════

Companion Computer Side              Flight Controller Side
═══════════════════════              ═══════════════════════

     ┌─────────────┐                      ┌─────────────┐
     │    Pi 5     │                      │  Pixhawk 6X │
     │   GPIO Header│                      │   TELEM1    │
     │             │                      │             │
     │  Pin 8 (TX) ●├──────────────────────┤● RX (pin 2) │
     │             │      Orange          │             │
     │             │      (Signal)        │             │
     │  Pin 10(RX) ●├──────────────────────┤● TX (pin 3) │
     │             │      Yellow          │             │
     │             │      (Signal)        │             │
     │  Pin 6 (GND)●├──────────────────────┤● GND(pin 6) │
     │             │      Black           │             │
     └─────────────┘      (Ground)        └─────────────┘

Pin Assignments:
┌────────────────┬──────────────┬────────────────┬──────────────┐
│ Pi 5           │ Wire Color   │ Pixhawk 6X     │ TELEM1 Pin   │
├────────────────┼──────────────┼────────────────┼──────────────┤
│ GPIO 14 (TX)   │ Orange       │ RX             │ Pin 2        │
│ GPIO 15 (RX)   │ Yellow       │ TX             │ Pin 3        │
│ GND (Pin 6)    │ Black        │ GND            │ Pin 6        │
└────────────────┴──────────────┴────────────────┴──────────────┘

Configuration:
- Baud Rate: 921600
- Protocol: MAVLink2
- Flow Control: None (optional CTS/RTS)
```

### USB Connection

```
Jetson Orin / Raspberry Pi to Pixhawk 6X (USB)
══════════════════════════════════════════════════════════════════

     ┌─────────────┐                      ┌─────────────┐
     │    Pi 5     │                      │  Pixhawk 6X │
     │             │      USB-C Cable     │             │
     │  USB Port   ●══════════════════════●   USB-C     │
     │  (USB 3.0)  │    (Data + Power)    │             │
     └─────────────┘                      └─────────────┘

Notes:
- USB provides both data and 5V power to FC
- FC must support USB MAVLink
- Simpler wiring but uses USB port
- Device appears as /dev/ttyACM0
```

## GPS Module Connection

### Standard GPS (u-blox NEO-M8N)

```
GPS Module to Flight Controller
══════════════════════════════════════════════════════════════════

     ┌─────────────┐                      ┌─────────────┐
     │ u-blox GPS  │                      │  Pixhawk    │
     │   Module    │                      │   GPS Port  │
     │             │                      │             │
     │  VCC (5V)   ●├──────────────────────┤●  5V        │
     │             │      Red             │             │
     │  GND        ●├──────────────────────┤●  GND       │
     │             │      Black           │             │
     │  TX (GPS)   ●├──────────────────────┤●  RX (FC)   │
     │             │      Green           │             │
     │  RX (GPS)   ●├──────────────────────┤●  TX (FC)   │
     │             │      Yellow          │             │
     │  SCL (I2C)  ●├──────────────────────┤●  SCL       │
     │             │      Blue            │             │
     │  SDA (I2C)  ●├──────────────────────┤●  SDA       │
     │             │      White           │             │
     └─────────────┘                      └─────────────┘

Wire Color Reference (Standard JST-GH 6-pin):
┌────────────┬─────────┬───────────────────────┐
│ Pin        │ Color   │ Function              │
├────────────┼─────────┼───────────────────────┤
│ 1          │ Red     │ 5V Power              │
│ 2          │ Black   │ Ground                │
│ 3          │ Green   │ TX (GPS → FC)         │
│ 4          │ Yellow  │ RX (FC → GPS)         │
│ 5          │ Blue    │ SCL (I2C Clock)       │
│ 6          │ White   │ SDA (I2C Data)        │
└────────────┴─────────┴───────────────────────┘
```

## Telemetry Radio Connection

### RFD900x to Flight Controller

```
RFD900x Radio Connection
══════════════════════════════════════════════════════════════════

     ┌─────────────┐                      ┌─────────────┐
     │   RFD900x   │                      │  Pixhawk    │
     │   Radio     │                      │  TELEM2     │
     │             │                      │             │
     │  5V         ●├──────────────────────┤●  5V        │
     │             │      Red             │             │
     │  GND        ●├──────────────────────┤●  GND       │
     │             │      Black           │             │
     │  TX (Radio) ●├──────────────────────┤●  RX (FC)   │
     │             │      Green           │             │
     │  RX (Radio) ●├──────────────────────┤●  TX (FC)   ││             │      Yellow          │             │
     │  CTS        ●├──────────────────────┤●  RTS (opt) │
     │             │      Blue            │             │
     │  RTS        ●├──────────────────────┤●  CTS (opt) │
     │             │      White           │             │
     └─────────────┘                      └─────────────┘

Note: RTS/CTS optional but recommended for high baud rates
Default Baud: 57600 (RFD900x)
```

## ESC and Motor Connections

### Standard ESC Wiring

```
ESC to Flight Controller and Motors
══════════════════════════════════════════════════════════════════

     ┌─────────────┐                      ┌─────────────┐
     │    ESC      │                      │   Motor     │
     │  (4-in-1)   │                      │             │
     │             │                      │             │
     │  Motor 1    ●──────────────────────●  Phase A    │
     │  Output     │                      │  Phase B    │
     │             │                      │  Phase C    │
     │  Motor 2    ●──────────────────────●             │
     │  Output     │                      │             │
     │  Motor 3    ●──────────────────────●             │
     │  Output     │                      │             │
     │  Motor 4    ●──────────────────────●             │
     │  Output     │                      │             │
     │             │                      │             │
     │  VBAT+      ●──────────────────────┤● Battery +  │
     │  VBAT-      ●──────────────────────┤● Battery -  │
     │             │                      │             │
     │  Signal 1   ●├─────────────────────┤● FC PWM 1   │
     │  Signal 2   ●├─────────────────────┤● FC PWM 2   │
     │  Signal 3   ●├─────────────────────┤● FC PWM 3   │
     │  Signal 4   ●├─────────────────────┤● FC PWM 4   │
     │  GND        ●├─────────────────────┤● FC GND     │
     │             │                      │             │
     │  Current    ●├─────────────────────┤● FC Current │
     │  Sensor     │                      │  Input      │
     │             │                      │             │
     └─────────────┘                      └─────────────┘

Motor Direction (Quadcopter X):
        Front
          ▲
    M1(CCW) M2(CW)
         \\   /
          \\ /
           X
          / \\
         /   \\
    M4(CW) M3(CCW)
```

### DShot Wiring

```
DShot ESC Connection (Single Wire Protocol)
══════════════════════════════════════════════════════════════════

     ┌─────────────┐                      ┌─────────────┐
     │    FC       │                      │    ESC      │
     │  (Pixhawk)  │                      │ (BLHeli_32) │
     │             │                      │             │
     │  PWM 1      ●══════════════════════●  Signal 1   │
     │  PWM 2      ●══════════════════════●  Signal 2   │
     │  PWM 3      ●══════════════════════●  Signal 3   │
     │  PWM 4      ●══════════════════════●  Signal 4   │
     │             │                      │             │
     │  GND        ●──────────────────────●  GND        │
     │             │      (Common ground) │             │
     └─────────────┘                      └─────────────┘

DShot Advantages:
- No ESC calibration needed
- Digital protocol (noise immune)
- Telemetry feedback
- Bi-directional DShot for RPM data

DShot150/300/600/1200 available
Recommended: DShot600 for 3-6S builds
```

## Camera Connections

### CSI Camera (Raspberry Pi Camera)

```
Raspberry Pi CSI Camera Connection
══════════════════════════════════════════════════════════════════

     ┌─────────────────┐                  ┌─────────────────┐
     │   Raspberry Pi  │   CSI Ribbon     │   Pi Camera     │
     │     CSI Port    │◄════════════════►│   Module V2     │
     │                 │   (15-pin)       │    (IMX219)     │
     │  ┌───────────┐  │                  │                 │
     │  │1 3 5 7 9  │  │                  │  ┌───────────┐  │
     │  │2 4 6 8 10 │  │                  │  │1 3 5 7 9  │  │
     │  └───────────┘  │                  │  │2 4 6 8 10 │  │
     │       ...       │                  │  └───────────┘  │
     │  ┌───────────┐  │                  │       ...       │
     │  │    ...    │  │                  │  ┌───────────┐  │
     │  │13 14 15   │  │                  │  │13 14 15   │  │
     │  └───────────┘  │                  │  └───────────┘  │
     └─────────────────┘                  └─────────────────┘

Ribbon Cable Pinout (15-pin CSI-2):
┌────┬────────────────────────────────────┐
│ Pin│ Function                           │
├────┼────────────────────────────────────┤
│ 1  │ GND                                │
│ 2  │ D0_N (Data Lane 0 Negative)        │
│ 3  │ D0_P (Data Lane 0 Positive)        │
│ 4  │ GND                                │
│ 5  │ D1_N (Data Lane 1 Negative)        │
│ 6  │ D1_P (Data Lane 1 Positive)        │
│ 7  │ GND                                │
│ 8  │ CK_N (Clock Negative)              │
│ 9  │ CK_P (Clock Positive)              │
│ 10 │ GND                                │
│ 11 │ SCL (I2C Clock)                    │
│ 12 │ SDA (I2C Data)                     │
│ 13 │ 3.3V Power                         │
│ 14 │ 3.3V Power                         │
│ 15 │ GND                                │
└────┴────────────────────────────────────┘

Note: Cable must be inserted with blue/white side facing up
      on Pi, and metal contacts facing PCB on camera module.
```

### USB Camera

```
USB Camera Connection
══════════════════════════════════════════════════════════════════

     ┌─────────────┐                      ┌─────────────┐
     │    Pi 5     │                      │  USB Camera │
     │             │      USB Cable       │             │
     │  USB 3.0    ●══════════════════════●  USB Type-A │
     │  (Blue)     │                      │  or Type-C  │
     └─────────────┘                      └─────────────┘

Power Budget:
- USB 2.0 Port: 500mA max
- USB 3.0 Port: 900mA max
- Powered Hub: Recommended for multiple cameras

Device Detection:
$ lsusb
Bus 001 Device 002: ID 046d:0825 Logitech, Inc. Webcam C270

Video Device:
$ ls /dev/video*
/dev/video0  /dev/video1
```

## Power Distribution

### Power Distribution Board (PDB) Wiring

```
Standard PDB Power Distribution
══════════════════════════════════════════════════════════════════

                              Battery (4S-12S)
                                   │
                                   ▼
                          ┌───────────────┐
                          │     XT60      │
                          │   Connector   │
                          └───────┬───────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌───────────┐ ┌───────────┐ ┌───────────┐
            │  PDB      │ │  PDB      │ │  PDB      │
            │  Input    │ │  Input    │ │  Input    │
            └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                  │             │             │
       ┌──────────┼──────────┐  │             │
       │          │          │  │             │
       ▼          ▼          ▼  │             │
   ┌───────┐  ┌───────┐  ┌───────┐          │
   │ ESC 1 │  │ ESC 2 │  │ ESC 3 │          │
   │ Batt+ │  │ Batt+ │  │ Batt+ │          │
   │ Batt- │  │ Batt- │  │ Batt- │          │
   └───────┘  └───────┘  └───────┘          │
                                            │
                                 ┌──────────┼──────────┐
                                 │          │          │
                                 ▼          ▼          ▼
                            ┌────────┐ ┌────────┐ ┌────────┐
                            │ 5V BEC │ │12V BEC │ │12V BEC │
                            │  6A    │ │  3A    │ │  3A    │
                            └───┬────┘ └───┬────┘ └───┬────┘
                                │          │          │
                    ┌───────────┤          │          │
                    │           │          │          │
                    ▼           ▼          ▼          ▼
               ┌────────┐  ┌────────┐ ┌────────┐ ┌────────┐
               │ Flight │  │Companion│ │Video  │ │Peripherals│
               │Control │  │Computer │ │Tx/Rx  │ │(GPS,etc) │
               │  5V/3A │  │  5V/4A  │ │12V/2A │ │  5V/1A   │
               └────────┘  └────────┘ └────────┘ └────────┘
```

### Dual BEC Configuration

```
Recommended Power Setup for Jetson + Pixhawk
══════════════════════════════════════════════════════════════════

Battery (6S 22.2V)
    │
    ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Power Distribution                           │
│                                                                   │
│   ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│   │  5V/10A BEC      │  │  5V/6A BEC       │  │  12V/5A BEC   │  │
│   │  (Companion)     │  │  (Flight Ctrl)   │  │  (Peripherals)│  │
│   │                  │  │                  │  │               │  │
│   │  Output: 5V/10A  │  │  Output: 5V/6A   │  │  Output:12V/5A│  │
│   │  Input: 6S-12S   │  │  Input: 6S-12S   │  │  Input:6S-12S │  │
│   │  Type: Switching │  │  Type: Switching │  │  Type:Switch  │  │
│   └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘  │
└────────────┼─────────────────────┼────────────────────┼──────────┘
             │                     │                    │
    ┌────────┴────────┐   ┌────────┴────────┐  ┌────────┴────────┐
    ▼                 ▼   ▼                 ▼  ▼                 ▼
┌─────────┐     ┌─────────┐ ┌─────────┐ ┌─────────┐  ┌─────────┐
│ Jetson  │     │ USB Hub │ │ Pixhawk │ │  Video  │  │  GPS    │
│ Orin    │     │  + Hub  │ │   6X    │ │  Tx/Rx  │  │ Module  │
│  5V/5A  │     │  5V/2A  │ │ 5V/3A   │ │ 12V/2A  │  │ 5V/0.5A │
└─────────┘     └─────────┘ └─────────┘ └─────────┘  └─────────┘
    │
    ▼
┌─────────┐
│  CSI    │
│ Camera  │
│ 5V/1A   │
└─────────┘

Power Budget Calculation:
┌────────────────────┬──────────┬─────────┐
│ Component          │ Voltage  │ Current │
├────────────────────┼──────────┼─────────┤
│ Jetson Orin NX     │ 5V       │ 4A      │
│ CSI Camera         │ 5V       │ 0.5A    │
│ USB Hub            │ 5V       │ 1A      │
│ Pixhawk 6X         │ 5V       │ 0.5A    │
│ GPS Module         │ 5V       │ 0.1A    │
│ Telemetry Radio    │ 5V       │ 0.5A    │
│ Video Tx           │ 12V      │ 0.5A    │
├────────────────────┼──────────┼─────────┤
│ 5V Total           │          │ 6.6A    │
│ 12V Total          │          │ 0.5A    │
└────────────────────┴──────────┴─────────┘

Safety Margin: Add 20% to calculated values
5V BEC: 6.6A × 1.2 = 7.9A → Use 10A BEC
12V BEC: 0.5A × 1.2 = 0.6A → Use 3A BEC
```

## Wire Gauge Reference

```
Recommended Wire Gauges by Current
══════════════════════════════════════════════════════════════════

┌────────────────┬────────────┬─────────────────────────────────────┐
│ Current (A)    │ AWG        │ Typical Use                         │
├────────────────┼────────────┼─────────────────────────────────────┤
│ 0.1 - 0.5      │ 26-28      │ Signal wires, I2C, SPI              │
│ 0.5 - 1.0      │ 24-26      │ UART, small sensors                 │
│ 1.0 - 3.0      │ 22-24      │ GPS, telemetry radio, flight ctrl   │
│ 3.0 - 5.0      │ 20-22      │ Companion computer (5V)             │
│ 5.0 - 10       │ 18-20      │ Main BEC output, high power devices │
│ 10 - 20        │ 16-18      │ ESC power, battery leads            │
│ 20 - 40        │ 14-16      │ Battery to PDB                      │
│ 40 - 100       │ 10-12      │ High current ESCs, large batteries  │
└────────────────┴────────────┴─────────────────────────────────────┘

Voltage Drop Consideration:
- Keep main power leads under 30cm if possible
- Use larger gauge for longer runs
- Twisted pair for signal wires (reduces EMI)
```

## Connector Reference

```
Common Connectors in UAV Wiring
══════════════════════════════════════════════════════════════════

JST-GH (1.25mm pitch) - Pixhawk standard
┌─────────────────────────────────────────┐
│ 1.25mm spacing, polarized, locking      │
│                                         │
│   [●] [●] [●] [●] [●] [●]              │
│    1   2   3   4   5   6               │
│                                         │
│ Common: 6-pin for GPS, 4-pin for I2C   │
│ Rated: 1A per pin                       │
└─────────────────────────────────────────┘

DF13 (1.25mm pitch) - Older Pixhawk
┌─────────────────────────────────────────┐
│ Similar to JST-GH but different keying  │
│ Being phased out, use JST-GH for new    │
└─────────────────────────────────────────┘

Molex Micro-Fit (3.0mm pitch) - Power
┌─────────────────────────────────────────┐
│ 3.0mm spacing, high current capable     │
│                                         │
│   [●] [●] [●] [●]                      │
│                                         │
│ Common: 2-6 pins for power distribution │
│ Rated: 8.5A per pin                     │
└─────────────────────────────────────────┘

XT60 - Battery connector
┌─────────────────────────────────────────┐
│ High current, polarized                 │
│                                         │
│    [+ round]  [- square]                │
│                                         │
│ Rated: 60A continuous                   │
│ Common: 3S-6S batteries                 │
└─────────────────────────────────────────┘

Dupont (2.54mm pitch) - Servo style
┌─────────────────────────────────────────┐
│ 2.54mm spacing, common servo connector  │
│                                         │
│   [●] [●] [●]                          │
│   GND +V Signal                         │
│                                         │
│ Common: ESC signal, PWM outputs         │
│ Rated: 3A per pin                       │
└─────────────────────────────────────────┘
```

## See Also

- [Companion Computers](./companion-computers.md) - Computer setup
- [Flight Controllers](./flight-controllers.md) - FC configuration
- [Power Systems](./power.md) - Power distribution details
- [Cables](./cables.md) - Cable specifications
