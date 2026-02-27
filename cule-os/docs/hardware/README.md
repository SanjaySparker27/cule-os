# Cule OS Hardware Documentation

Welcome to the Cule OS hardware documentation. This section covers all supported hardware components for autonomous vehicle platforms.

## Documentation Sections

### 🖥️ Companion Computers
- [Companion Computers Overview](./companion-computers.md) - NVIDIA Jetson, Raspberry Pi, and other SBCs
- [NVIDIA Jetson Guide](./jetson.md) - Jetson Orin Nano/NX/AGX, Xavier NX/AGX
- [Raspberry Pi Guide](./raspberry-pi.md) - Raspberry Pi 4, 5, and Compute Module 4

### 🎮 Flight Controllers
- [Flight Controllers Overview](./flight-controllers.md) - Supported FCs and configurations
- [Pixhawk Setup](./pixhawk.md) - Pixhawk 6X, 6C, and Cube Orange
- [DAKEFPV H743 Pro](./dakefpv-h743.md) - Custom H743-based flight controller
- [Pinout Reference](./pinouts.md) - Detailed pin mappings for all FCs

### 📡 Communication Systems
- [Telemetry Radios](./telemetry.md) - Long-range data links
- [Radio Modules](./radio-modules.md) - RFD900, SiK radios, 4G/LTE, WiFi
- [MAVLink Setup](./mavlink.md) - Protocol configuration

### 📷 Cameras & Vision
- [Camera Systems](./cameras.md) - Overview of camera options
- [CSI Cameras](./csi-cameras.md) - Raspberry Pi, IMX219, IMX477
- [USB Cameras](./usb-cameras.md) - UVC-compatible cameras
- [GMSL Cameras](./gmsl-cameras.md) - FPD-Link III / GMSL2 cameras

### 🔍 Sensors
- [Sensor Overview](./sensors.md) - All supported sensors
- [GPS/GNSS](./gps.md) - u-blox, Septentrio, and other GPS modules
- [IMU](./imu.md) - Inertial measurement units
- [LiDAR](./lidar.md) - 2D and 3D LiDAR integration
- [Rangefinders](./rangefinders.md) - Ultrasonic, IR, laser rangefinders

### ⚡ Power Systems
- [Power Systems](./power.md) - Power distribution and management
- [Battery Monitoring](./battery.md) - Voltage/current sensing
- [BECs and Regulators](./bec.md) - Power regulation

### 🔌 Wiring & Connections
- [Wiring Diagrams](./wiring.md) - Connection diagrams and schematics
- [Cable Reference](./cables.md) - Cable types and specifications
- [Connector Guide](./connectors.md) - JST, Molex, DF13, and others

## Quick Reference

### Companion Computer Comparison

| Platform | CPU | GPU | RAM | AI TOPS | Power | Best For |
|----------|-----|-----|-----|---------|-------|----------|
| Jetson Orin Nano | 6-core ARM | 1024-core | 4/8GB | 20/40 | 7-15W | Entry-level AI |
| Jetson Orin NX | 8-core ARM | 1024-core | 8/16GB | 70/100 | 10-25W | Mid-range AI |
| Jetson Orin AGX | 12-core ARM | 2048-core | 32/64GB | 200/275 | 15-60W | High-performance AI |
| Xavier NX | 6-core ARM | 384-core | 8GB | 21 | 10-20W | Legacy AI |
| Raspberry Pi 5 | 4-core ARM | VideoCore VII | 4/8GB | N/A | 5-8W | Budget/general |
| Raspberry Pi 4 | 4-core ARM | VideoCore VI | 2/4/8GB | N/A | 5-8W | Budget/general |

### Flight Controller Comparison

| Controller | MCU | IMU | Baro | Flash | PWM | Price |
|------------|-----|-----|------|-------|-----|-------|
| Pixhawk 6X | STM32H753 | ICM-20649 + ICM-42688-P | ICM-45686 | 2MB FRAM | 16 | $$$ |
| Pixhawk 6C | STM32H743 | ICM-42688-P | DPS310 | 512KB | 16 | $$ |
| Cube Orange+ | STM32H757 | ICM-45686 | DPS310 | 2MB | 14 | $$$ |
| DAKEFPV H743 | STM32H743 | ICM-42688-P (dual) | SPL06 | 16MB | 13 | $ |

### Telemetry Range Comparison

| Radio | Frequency | Range | Data Rate | Power | Cost |
|-------|-----------|-------|-----------|-------|------|
| RFD900x | 900MHz | 40+ km | 250kbps | 1W | $$ |
| SiK 915MHz | 915MHz | 5-10 km | 57kbps | 100mW | $ |
| SiK 433MHz | 433MHz | 10-15 km | 57kbps | 100mW | $ |
| Herelink | 2.4GHz | 20 km | HD Video | 1W | $$$ |
| 4G/LTE | Cellular | Unlimited* | 10+ Mbps | Variable | $$/mo |

## Hardware Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cule OS Hardware Stack                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Sensors    │  │   Cameras    │  │    LiDAR     │           │
│  │  GPS/IMU/Baro│  │  CSI/USB/GMSL│  │  2D/3D/TOF   │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│  ┌──────▼─────────────────▼─────────────────▼───────┐           │
│  │            Companion Computer                      │           │
│  │      (Jetson Orin / Raspberry Pi / Xavier)        │           │
│  │                                                   │           │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐           │           │
│  │  │  AI/ML  │  │  Vision │  │  Cule   │           │           │
│  │  │ Inference│  │ Processing│  │  Agents │           │           │
│  │  └─────────┘  └─────────┘  └─────────┘           │           │
│  └──────────────┬───────────────────────────────────┘           │
│                 │                                                │
│              USB/UART/CAN/SPI/I2C                                │
│                 │                                                │
│  ┌──────────────▼───────────────────────────────────┐           │
│  │           Flight Controller                       │           │
│  │    (Pixhawk / DAKEFPV / Custom)                   │           │
│  │                                                   │           │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐           │           │
│  │  │  ArduPilot│  │  Sensors │  │  PWM/ESC │           │           │
│  │  │  PX4    │  │  Fusion  │  │  Control │           │           │
│  │  └─────────┘  └─────────┘  └─────────┘           │           │
│  └────────────────────┬─────────────────────────────┘           │
│                       │                                          │
│              ┌────────┴────────┐                                 │
│              ▼                 ▼                                 │
│       ┌──────────┐      ┌──────────┐                            │
│       │   ESCs   │      │ Telemetry│                            │
│       │  Motors  │      │   Radio  │                            │
│       └──────────┘      └──────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Getting Started

### 1. Choose Your Platform

Select a companion computer based on your requirements:
- **AI/Computer Vision**: NVIDIA Jetson Orin series
- **Budget/Educational**: Raspberry Pi 5 or 4
- **Legacy/Low Power**: Jetson Xavier NX or Raspberry Pi 4

### 2. Select Flight Controller

Choose based on your vehicle complexity:
- **Research/Professional**: Pixhawk 6X or Cube Orange+
- **Hobby/Racing**: DAKEFPV H743 Pro
- **Custom builds**: Any STM32H7-based FC

### 3. Plan Your Wiring

See [Wiring Diagrams](./wiring.md) for:
- Connection diagrams
- Cable length recommendations
- Power budget calculations
- EMI/RFI considerations

### 4. Power Planning

Calculate your power budget:
```
Jetson Orin Nano:     10W  average, 15W peak
Pixhawk 6X:           3W   average
GPS Module:           0.5W
Telemetry Radio:      1W   (100mW TX)
Camera (CSI):         1W
Camera (GMSL):        2W
LiDAR (Ouster OS1):   15W
----------------------------------------
Total:               ~30W average, 35W peak

Recommended: 5V/10A BEC or 7.4V/6A BEC with regulators
```

## Support

- **Hardware Issues**: [GitHub Issues](https://github.com/SanjaySparker27/cule-os/issues)
- **Community Forum**: https://discussion.cule-os.io
- **Chat**: #cule-os:matrix.org

## See Also

- [UAV Quick Start](../uav/quickstart.md) - Get flying in 30 minutes
- [UGV Quick Start](../ugv/quickstart.md) - Get driving in 30 minutes
- [USV Quick Start](../usv/quickstart.md) - Get sailing in 30 minutes
