# Raspberry Pi Guide

Complete guide for setting up Raspberry Pi platforms with Cule OS.

## Supported Models

### Raspberry Pi 5 (Recommended)

| Model | RAM | CPU | Features |
|-------|-----|-----|----------|
| Pi 5 4GB | 4GB LPDDR4X | 2.4GHz Quad-core | Entry level |
| Pi 5 8GB | 8GB LPDDR4X | 2.4GHz Quad-core | **Recommended** |

### Raspberry Pi 4

| Model | RAM | CPU | Status |
|-------|-----|-----|--------|
| Pi 4 2GB | 2GB LPDDR4 | 1.8GHz Quad-core | Minimum |
| Pi 4 4GB | 4GB LPDDR4 | 1.8GHz Quad-core | Supported |
| Pi 4 8GB | 8GB LPDDR4 | 1.8GHz Quad-core | Supported |

### Compute Module 4

| Model | RAM | eMMC | Use Case |
|-------|-----|------|----------|
| CM4 4GB | 4GB | 8-32GB | Custom carriers |
| CM4 8GB | 8GB | 8-32GB | Production |
| CM4 Lite | 1-8GB | None (SD) | Cost-sensitive |

## Hardware Specifications

### Raspberry Pi 5

```
┌────────────────────────────────────────┐
│         Raspberry Pi 5                 │
├────────────────────────────────────────┤
│ CPU: Broadcom BCM2712                  │
│      Quad-core ARM Cortex-A76 @ 2.4GHz │
│ GPU: VideoCore VII @ 800MHz            │
│ RAM: 4GB/8GB LPDDR4X @ 4267 MT/s       │
│ Storage: MicroSD (UHS-I)               │
│        : PCIe 2.0 x1 (M.2 HAT)         │
│ USB: 2x USB 3.0, 2x USB 2.0            │
│ Network: Gigabit Ethernet, WiFi 5, BT 5│
│ Video: 2x micro-HDMI 2.0 (4K60)        │
│ GPIO: 40-pin header                    │
│ CSI: 2x 4-lane MIPI CSI-2              │
│ PCIe: M.2 HAT+ support                 │
│ Power: 5V/5A USB-C (PD)                │
└────────────────────────────────────────┘
```

### Raspberry Pi 4

```
┌────────────────────────────────────────┐
│         Raspberry Pi 4                 │
├────────────────────────────────────────┤
│ CPU: Broadcom BCM2711                  │
│      Quad-core ARM Cortex-A72 @ 1.8GHz │
│ GPU: VideoCore VI @ 500MHz             │
│ RAM: 2/4/8GB LPDDR4                    │
│ Storage: MicroSD (UHS-I)               │
│ USB: 2x USB 3.0, 2x USB 2.0            │
│ Network: Gigabit Ethernet, WiFi 5, BT 5│
│ Video: 2x micro-HDMI 2.0 (4K60)        │
│ GPIO: 40-pin header                    │
│ CSI: 1x 2-lane MIPI CSI-2              │
│ Power: 5V/3A USB-C                     │
└────────────────────────────────────────┘
```

## 40-Pin GPIO Header

### Pinout Diagram

```
Raspberry Pi 40-Pin Header (J8)
═══════════════════════════════════════════════════════

                      Ethernet Port
                           │
    ┌────────────────────────────────────────────────┐
    │  3.3V  (1) ●                              ● (2)  5V      │
    │  GPIO2 (3) ●                              ● (4)  5V      │
    │  GPIO3 (5) ●                              ● (6)  GND     │
    │  GPIO4 (7) ●                              ● (8)  GPIO14  │
    │  GND   (9) ●                              ● (10) GPIO15  │
    │  GPIO17(11)●                              ● (12) GPIO18  │
    │  GPIO27(13)●                              ● (14) GND     │
    │  GPIO22(15)●                              ● (16) GPIO23  │
    │  3.3V  (17)●                              ● (18) GPIO24  │
    │  GPIO10(19)●                              ● (20) GND     │
    │  GPIO9 (21)●                              ● (22) GPIO25  │
    │  GPIO11(23)●                              ● (24) GPIO8   │
    │  GND   (25)●                              ● (26) GPIO7   │
    │  ID_SD (27)●                              ● (28) ID_SC   │
    │  GPIO5 (29)●                              ● (30) GND     │
    │  GPIO6 (31)●                              ● (32) GPIO12  │
    │  GPIO13(33)●                              ● (34) GND     │
    │  GPIO19(35)●                              ● (36) GPIO16  │
    │  GPIO26(37)●                              ● (38) GPIO20  │
    │  GND   (39)●                              ● (40) GPIO21  │
    └────────────────────────────────────────────────┘
                           │
                      USB Ports

Legend:
  ● = Pin (1-40)
  GPIO2/3  = I2C1 (SDA/SCL)  - /dev/i2c-1
  GPIO14/15 = UART0 (TX/RX)  - /dev/ttyAMA0
  GPIO10/9/11/8/7 = SPI0 (MOSI/MISO/SCK/CE0/CE1)
  GPIO19/20/21 = SPI1 (MOSI/MISO/SCK)
  ID_SD/ID_SC = I2C0 (HAT EEPROM)
```

### Pin Function Reference

| Pin | Name | Function | Device | Default Use |
|-----|------|----------|--------|-------------|
| 3 | GPIO2 | I2C1_SDA | `/dev/i2c-1` | Sensors, Compass |
| 5 | GPIO3 | I2C1_SCL | `/dev/i2c-1` | Sensors, Compass |
| 8 | GPIO14 | UART0_TX | `/dev/ttyAMA0` | Flight Controller |
| 10 | GPIO15 | UART0_RX | `/dev/ttyAMA0` | Flight Controller |
| 19 | GPIO10 | SPI0_MOSI | `/dev/spidev0.0` | External devices |
| 21 | GPIO9 | SPI0_MISO | `/dev/spidev0.0` | External devices |
| 23 | GPIO11 | SPI0_SCK | `/dev/spidev0.0` | External devices |
| 24 | GPIO8 | SPI0_CE0 | `/dev/spidev0.0` | Chip select 0 |
| 26 | GPIO7 | SPI0_CE1 | `/dev/spidev0.1` | Chip select 1 |
| 27 | GPIO0 | I2C0_SDA | `/dev/i2c-0` | HAT EEPROM |
| 28 | GPIO1 | I2C0_SCL | `/dev/i2c-0` | HAT EEPROM |

## UART Configuration

### UART Port Mapping (Raspberry Pi 5)

| UART | GPIO Pins | Device | Alias | Use |
|------|-----------|--------|-------|-----|
| UART0 | 14/15 | `/dev/ttyAMA0` | `/dev/serial0` | Primary console/FC |
| UART1 | 8/10 | `/dev/ttyAMA1` | - | Bluetooth (default) |
| UART2 | 27/28 | `/dev/ttyAMA2` | - | Available |
| UART3 | 7/29 | `/dev/ttyAMA3` | - | Available |
| UART4 | 24/25 | `/dev/ttyAMA4` | - | Available |

### Enabling UART

```bash
# Edit config.txt
sudo nano /boot/firmware/config.txt

# Add/modify:
enable_uart=1
dtoverlay=uart0
dtoverlay=uart1
dtoverlay=uart2

# For Pi 4 (disable Bluetooth to use UART0):
dtoverlay=disable-bt

# Reboot
sudo reboot

# Verify
ls -la /dev/ttyAMA*
ls -la /dev/serial*
```

## CSI Camera Connectors

### Raspberry Pi 5 CSI Connectors

```
Raspberry Pi 5 CSI Connectors (CAM0/CAM1)
═══════════════════════════════════════════════════════

    CAM1 (CSI1)              CAM0 (CSI0)
    ┌─────────┐              ┌─────────┐
    │ ● ● ● ● │              │ ● ● ● ● │
    │ 2 4 6 8 │              │ 2 4 6 8 │
    │ 1 3 5 7 │              │ 1 3 5 7 │
    └─────────┘              └─────────┘
    
    Near USB ports           Near Ethernet

Pin Assignment (standard Raspberry Pi CSI):
    Pin 1 - 3.3V (Orange)
    Pin 2 - GPIO (SDA/I2C)
    Pin 3 - GPIO (SCL/I2C)
    Pin 4 - GPIO (shutdown/LED)
    Pin 5 - D0_N (Data 0-)
    Pin 6 - D0_P (Data 0+)
    Pin 7 - GND
    Pin 8 - D1_N (Data 1-)
    Pin 9 - D1_P (Data 1+)
    Pin 10 - GND
    Pin 11 - CK_N (Clock-)
    Pin 12 - CK_P (Clock+)
    Pin 13 - GND
    Pin 14 - D2_N (Data 2-)
    Pin 15 - D2_P (Data 2+)

Compatible Cameras:
- Raspberry Pi Camera Module V2 (IMX219)
- Raspberry Pi Camera Module 3 (IMX708)
- Raspberry Pi HQ Camera (IMX477)
- Raspberry Pi Global Shutter (IMX296)
- Arducam cameras
```

### Enabling Camera

```bash
# Method 1: raspi-config
sudo raspi-config
# Interface Options -> Camera -> Enable

# Method 2: config.txt
sudo nano /boot/firmware/config.txt
# Add:
camera_auto_detect=1
# or for specific camera:
dtoverlay=imx219

# Reboot
sudo reboot

# Test
camera-hello
camera-vid -t 10000 -o test.h264
```

## Cule OS Installation

### Method 1: Pre-built Image (Recommended)

```bash
# 1. Download Cule OS for Raspberry Pi
wget https://sanjaysparker27.github.io/cule-os/releases/\
    cule-os-axon-rpi-v1.0.img.xz

# 2. Flash to SD Card
# Linux/Mac:
xzcat cule-os-axon-rpi-v1.0.img.xz | \
    sudo dd of=/dev/sdX bs=4M status=progress

# Windows: Use Raspberry Pi Imager or BalenaEtcher

# 3. Insert SD card and boot
# 4. Complete first-boot setup
```

### Method 2: Install on Raspberry Pi OS

```bash
# 1. Update system
sudo apt update && sudo apt full-upgrade -y

# 2. Add Cule OS repository
wget -qO - https://sanjaysparker27.github.io/cule-os/gpg.key | sudo apt-key add -
echo "deb https://sanjaysparker27.github.io/cule-os/repo stable main" | \
    sudo tee /etc/apt/sources.list.d/cule-os.list

sudo apt update

# 3. Install Cule OS
sudo apt install cule-os-axon

# 4. Configure
sudo cule-config --platform raspberry-pi --model pi5

# 5. Enable interfaces
sudo raspi-config
# Interface Options -> Enable: I2C, SPI, Serial, Camera

# 6. Reboot
sudo reboot
```

### Post-Installation Setup

```bash
# 1. Verify installation
cule-status

# 2. Check for updates
sudo cule-update

# 3. Enable GPU memory (for camera/video)
sudo raspi-config
# Performance Options -> GPU Memory -> 128

# 4. Configure for flight controller
sudo cule-config --fc-type pixhawk --connection uart

# 5. Test flight controller connection
cule-mavlink-test

# 6. Start Cule OS services
sudo systemctl enable cule-agent
echo "cule-agent started"
```

## Flight Controller Connection

### UART Connection (Recommended)

```
Raspberry Pi 5           Pixhawk 6X
══════════════           ══════════

Pin 8 (GPIO14/UART0_TX) ────→ TELEM1_RX
Pin 10 (GPIO15/UART0_RX) ←──── TELEM1_TX
Pin 6 (GND) ─────────────────── GND

Baud Rate: 921600
Protocol: MAVLink2

Wiring Reference:
┌─────────────────────────────────────────────┐
│ Pi GPIO        Wire Color      Pixhawk     │
├─────────────────────────────────────────────┤
│ Pin 8 (TX)     Orange          TELEM1 RX   │
│ Pin 10 (RX)    Yellow          TELEM1 TX   │
│ Pin 6 (GND)    Black           GND         │
└─────────────────────────────────────────────┘

Connection Diagram:
     ┌─────────┐                    ┌──────────┐
     │   Pi 5  │                    │ Pixhawk  │
     │         │      UART          │          │
     │    TX ●─├──────Orange────────┤─● RX     │
     │    RX ●─├──────Yellow────────┤─● TX     │
     │   GND ●─├──────Black─────────┤─● GND    │
     └─────────┘                    └──────────┘
```

### USB Connection

```
Raspberry Pi ──USB──→ Pixhawk (USB)

Note: Use USB 2.0 port for better compatibility with some FCs

Setup:
1. Connect USB cable
2. Check device: ls /dev/ttyACM*
3. Should appear as /dev/ttyACM0
```

## Performance Optimization

### Overclocking (Pi 5)

```bash
# Edit config.txt
sudo nano /boot/firmware/config.txt

# Add overclock settings:
arm_freq=2800        # 2.8GHz (up from 2.4GHz)
gpu_freq=900         # 900MHz GPU
over_voltage=6       # Increase voltage
force_turbo=1        # Disable frequency scaling

# Optional: enable PCIE Gen 3
dtparam=pciex1_gen3

# Monitor temperature
watch -n 1 vcgencmd measure_temp

# If temp > 85°C, reduce overclock or improve cooling
```

### Cooling Solutions

```
Temperature Guidelines:
- < 60°C: Optimal
- 60-80°C: Normal operation
- > 80°C: Throttling begins
- > 85°C: Critical, reduce load

Cooling Options:
1. Active Cooler (official) - Good for most use
2. Tower Cooler - Best for overclocking
3. Passive case - Only for light loads
4. Custom fan + heatsink - Flexible

Fan Control:
# Automatic based on temperature
echo 1 | sudo tee /sys/class/thermal/cooling_device0/cur_state
```

### Storage Optimization

```bash
# Using NVMe (Pi 5 with M.2 HAT)
# 1. Install M.2 HAT+
# 2. Boot from SD, clone to NVMe:
sudo apt install rpi-clone
sudo rpi-clone sda

# 3. Boot from NVMe
# Remove SD card and reboot

# Check NVMe speed:
sudo apt install nvme-cli
sudo nvme list
sudo hdparm -t /dev/nvme0n1
```

## Troubleshooting

### Boot Issues

```bash
# Check boot logs
sudo dmesg | less

# Check for undervoltage
vcgencmd get_throttled
# 0x0 = OK
# 0x50000 = Undervoltage occurred
# 0x50005 = Currently undervolted

# Fix: Use official 5V/5A power supply

# Check boot partition
lsblk
sudo fsck /dev/mmcblk0p2
```

### UART Issues

```bash
# Check UART mapping
ls -la /dev/ttyAMA*
ls -la /dev/serial*

# Check device tree
dtoverlay -l

# Verify config.txt settings
grep -E "enable_uart|dtoverlay.*uart" /boot/firmware/config.txt

# Test UART
# Connect TX to RX (loopback)
stty -F /dev/ttyAMA0 921600
echo "test" > /dev/ttyAMA0
cat /dev/ttyAMA0
```

### Camera Issues

```bash
# List cameras
libcamera-hello --list-cameras

# Check detection
dmesg | grep -i imx

# Test with libcamera
libcamera-hello -t 0

# Check camera stack
rpicam-hello --version

# Legacy camera support
sudo raspi-config
# Interface Options -> Legacy Camera -> Enable
```

### I2C Issues

```bash
# Detect I2C devices
sudo apt install i2c-tools
sudo i2cdetect -y 1

# Check bus speed
cat /sys/class/i2c-adapter/i2c-1/clock_frequency

# Speed up I2C (if devices support it)
echo 400000 | sudo tee /sys/class/i2c-adapter/i2c-1/clock_frequency
```

## See Also

- [Companion Computers](./companion-computers.md) - Overview
- [NVIDIA Jetson Guide](./jetson.md) - Alternative platform
- [CSI Cameras](./csi-cameras.md) - Camera setup
- [Wiring Diagrams](./wiring.md) - Connection diagrams
