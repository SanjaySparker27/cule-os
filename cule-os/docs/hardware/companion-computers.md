# Companion Computers

Companion computers provide high-level processing capabilities for autonomous vehicles, running Cule OS's agent system, computer vision, and AI/ML workloads.

## Overview

A companion computer sits alongside the flight controller, handling:
- **Computer Vision**: Object detection, tracking, SLAM
- **AI/ML Inference**: Neural network execution
- **Multi-Agent Coordination**: Swarm intelligence
- **Data Processing**: Sensor fusion, logging
- **Communications**: 4G/LTE, WiFi, satellite

## Supported Platforms

### NVIDIA Jetson Series

| Model | Status | Notes |
|-------|--------|-------|
| Jetson Orin Nano 4GB | ✅ Supported | Entry-level AI |
| Jetson Orin Nano 8GB | ✅ Supported | Recommended for CV |
| Jetson Orin NX 8GB | ✅ Supported | Mid-range AI |
| Jetson Orin NX 16GB | ✅ Supported | Recommended for AI |
| Jetson Orin AGX 32GB | ✅ Supported | High-performance |
| Jetson Orin AGX 64GB | ✅ Supported | Maximum performance |
| Jetson Xavier NX 8GB | ⚠️ Legacy | Supported, limited |
| Jetson Xavier AGX | ⚠️ Legacy | Supported, limited |

### Raspberry Pi Series

| Model | Status | Notes |
|-------|--------|-------|
| Raspberry Pi 5 (4GB) | ✅ Supported | Latest generation |
| Raspberry Pi 5 (8GB) | ✅ Recommended | Best Pi option |
| Raspberry Pi 4 (4GB) | ✅ Supported | Budget option |
| Raspberry Pi 4 (8GB) | ✅ Supported | Good value |
| Raspberry Pi CM4 | ✅ Supported | Custom carriers |
| Raspberry Pi 3B+ | ⚠️ Limited | Not recommended |

### Other Platforms

| Platform | Status | Notes |
|----------|--------|-------|
| Qualcomm RB5 | 🔄 In Development | Coming soon |
| Intel NUC | 🔄 In Development | x86 support |
| Khadas VIM4 | 🔄 In Development | Alternative ARM |

## Platform Selection Guide

### For Computer Vision

```
Recommended: Jetson Orin Nano 8GB
- 40 TOPS AI performance
- Hardware-accelerated encoding/decoding
- Native CSI camera support
- Excellent OpenCV + CUDA performance

Budget: Raspberry Pi 5 8GB
- Good for basic CV workloads
- Limited AI acceleration
- CSI and USB camera support
```

### For AI/ML Inference

```
Recommended: Jetson Orin NX 16GB
- 100 TOPS AI performance
- Large memory for big models
- TensorRT optimization
- Multi-model inference

High-Performance: Jetson Orin AGX 64GB
- 275 TOPS AI performance
- Maximum memory bandwidth
- Production deployment ready
```

### For Swarm/Multi-Agent

```
Recommended: Jetson Orin Nano 4GB or RPi 5 4GB
- Cost-effective per unit
- Sufficient for agent coordination
- Low power consumption
- Easy to deploy at scale
```

## Connection Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Companion Computer                        │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │   USB   │  │  UART   │  │   I2C   │  │   SPI   │        │
│  │  (x4)   │  │  (x3)   │  │  (x2)   │  │  (x2)   │        │
│  └───┬─────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│      │             │            │            │              │
│  ┌───┴─────┐  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐        │
│  │ Flight  │  │Telemetry│  │ Sensors │  │  SD Card│        │
│  │Controller│  │  Radio  │  │ (GPS,etc)│  │         │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │  CSI    │  │   USB   │  │  M.2    │                      │
│  │ Camera  │  │ Camera  │  │  (NVMe) │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Hardware Interface Mapping

### Jetson Orin Nano/NX

| Interface | Port | Cule OS Device | Default Use |
|-----------|------|----------------|-------------|
| USB 3.0 | J1 (USB-C) | `/dev/ttyACM0` | Flight Controller |
| USB 3.0 | J2 (USB-A) | `/dev/video*` | USB Camera |
| UART0 | 8/10 | `/dev/ttyTHS0` | Debug Console |
| UART1 | 27/28 | `/dev/ttyTHS1` | GPS Module |
| I2C0 | 3/5 | `/dev/i2c-0` | Sensors, Compass |
| SPI0 | 19-26 | `/dev/spidev0.x` | External SPI |
| CSI0 | CAM0 | `/dev/video0` | CSI Camera |
| CSI1 | CAM1 | `/dev/video1` | CSI Camera 2 |
| GPIO | 7-40 | `/sys/class/gpio` | Relays, LEDs |

### Raspberry Pi 5

| Interface | GPIO | Cule OS Device | Default Use |
|-----------|------|----------------|-------------|
| USB 3.0 | Blue ports | `/dev/ttyACM0` | Flight Controller |
| USB 2.0 | Black ports | `/dev/video*` | USB Camera |
| UART0 | 14/15 | `/dev/ttyAMA0` | Flight Controller |
| UART1 | 8/10 | `/dev/ttyAMA1` | GPS/Telemetry |
| UART2 | 27/28 | `/dev/ttyAMA2` | Sensors |
| I2C1 | 2/3 | `/dev/i2c-1` | Compass, Baro |
| SPI0 | 9-11 | `/dev/spidev0.x` | External devices |
| CSI0 | CAM0 | `/dev/video0` | CSI Camera |
| CSI1 | CAM1 | `/dev/video1` | CSI Camera 2 |
| PCIe | M.2 slot | `/dev/nvme*` | NVMe SSD |

## Installation

### Jetson Orin Setup

```bash
# 1. Flash Jetson OS with Cule OS image
# Download from: https://sanjaysparker27.github.io/cule-os/releases/

# 2. Boot and configure
sudo cule-config --platform jetson --model orin-nano

# 3. Verify hardware detection
sudo cule-detect --hardware

# 4. Install CUDA support (for AI workloads)
sudo apt update
sudo apt install nvidia-jetpack

# 5. Verify GPU
nvidia-smi
```

### Raspberry Pi Setup

```bash
# 1. Flash Raspberry Pi OS with Cule OS image
# Use Raspberry Pi Imager or:
wget https://sanjaysparker27.github.io/cule-os/releases/cule-os-axon-rpi-v1.0.img.xz
xzcat cule-os-axon-rpi-v1.0.img.xz | sudo dd of=/dev/sdX bs=4M

# 2. Boot and configure
sudo cule-config --platform raspberry-pi --model pi5

# 3. Enable interfaces
sudo raspi-config
# Interface Options -> Enable: I2C, SPI, Serial, Camera

# 4. Verify hardware
sudo cule-detect --hardware
```

## Power Requirements

### Jetson Orin Nano

| Mode | Voltage | Current | Power |
|------|---------|---------|-------|
| Idle | 5V | 0.5A | 2.5W |
| Typical | 5V | 1.5A | 7.5W |
| Max | 5V | 3A | 15W |
| AI Inference | 5V | 2.5A | 12.5W |

**Recommended Power Supply**: 5V/4A (20W) minimum

### Jetson Orin NX

| Mode | Voltage | Current | Power |
|------|---------|---------|-------|
| Idle | 5V | 0.7A | 3.5W |
| Typical | 5V | 2A | 10W |
| Max | 5V | 5A | 25W |
| AI Inference | 5V | 4A | 20W |

**Recommended Power Supply**: 5V/6A (30W) or 12V/3A with DC-DC

### Raspberry Pi 5

| Mode | Voltage | Current | Power |
|------|---------|---------|-------|
| Idle | 5V | 0.6A | 3W |
| Typical | 5V | 1A | 5W |
| Max | 5V | 2A | 10W |
| With Peripherals | 5V | 2.5A | 12.5W |

**Recommended Power Supply**: 5V/5A (25W) with active cooling

## Thermal Management

### Jetson Orin

```
Operating Temperature: -25°C to 80°C
Recommended: Active cooling for sustained loads

Cooling Options:
1. Passive heatsink (light loads only)
2. Active fan heatsink (recommended)
3. Liquid cooling (extreme workloads)

Temperature Monitoring:
watch -n 1 cat /sys/class/thermal/thermal_zone*/temp
```

### Raspberry Pi 5

```
Operating Temperature: 0°C to 85°C
Recommended: Active cooling for sustained loads

Cooling Options:
1. Passive case (very light loads)
2. Active cooler with fan (recommended)
3. Tower cooler (overclocking)

Temperature Monitoring:
vcgencmd measure_temp
```

## Storage

### Boot Media

| Platform | Recommended | Max Size | Speed |
|----------|-------------|----------|-------|
| Jetson Orin | NVMe SSD (M.2) | 2TB | 3GB/s |
| Jetson Orin | SD Card (UHS-I) | 1TB | 100MB/s |
| RPi 5 | NVMe SSD (M.2 HAT) | 2TB | 450MB/s |
| RPi 5 | SD Card (UHS-I) | 1TB | 100MB/s |

### Recommended Storage Configuration

```
OS + Applications:    32GB minimum, 64GB recommended
Data/Logs:           128GB minimum, 256GB recommended
AI Models:           16GB (Jetson Nano) to 64GB (Jetson AGX)
Mission Data:        Depends on mission length (1GB/hour typical)
```

## Expansion Options

### M.2 Key M (NVMe)
- High-speed storage
- Available on: Jetson Orin NX/AGX, RPi 5 with HAT

### M.2 Key E (WiFi/BT)
- Wireless connectivity
- Supported modules: Intel AX210, Realtek RTL8822CE

### PCIe
- High-speed peripherals
- Multi-port USB cards
- Additional Ethernet
- Frame grabbers

## Troubleshooting

### Common Issues

**Jetson won't boot**
```bash
# Check power supply voltage under load
# Verify NVMe/SPI boot configuration
sudo reboot --force forced-recovery
```

**Raspberry Pi undervoltage**
```bash
# Check for power warnings
vcgencmd get_throttled

# 0x0 = OK
# 0x50000 = Undervoltage occurred
# 0x50005 = Currently undervolted
```

**USB devices not detected**
```bash
# Check USB power budget
lsusb -t

# Check kernel messages
dmesg | grep -i usb
```

### Performance Tuning

**Jetson Performance Modes**
```bash
# List available modes
sudo nvpmodel -q

# Set to MAXN (maximum performance)
sudo nvpmodel -m 0

# Set to 15W mode (power saving)
sudo nvpmodel -m 8

# Apply jetson_clocks for maximum performance
sudo jetson_clocks
```

**Raspberry Pi Overclocking**
```bash
# Edit config.txt
sudo nano /boot/firmware/config.txt

# Add for Pi 5:
arm_freq=2800
gpu_freq=900
over_voltage=6

# Monitor temperature
watch -n 1 vcgencmd measure_temp
```

## See Also

- [NVIDIA Jetson Guide](./jetson.md) - Detailed Jetson setup
- [Raspberry Pi Guide](./raspberry-pi.md) - Detailed Pi setup
- [Power Systems](./power.md) - Power distribution
- [Wiring Diagrams](./wiring.md) - Connection diagrams
