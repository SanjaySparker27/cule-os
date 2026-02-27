# NVIDIA Jetson Guide

Complete guide for setting up NVIDIA Jetson platforms with Cule OS.

## Supported Models

### Jetson Orin Series (Recommended)

| Model | AI Perf | Memory | Power | Best For |
|-------|---------|--------|-------|----------|
| Orin Nano 4GB | 20 TOPS | 4GB | 7-15W | Entry CV, Education |
| Orin Nano 8GB | 40 TOPS | 8GB | 7-15W | Mid-range CV |
| Orin NX 8GB | 70 TOPS | 8GB | 10-25W | AI Inference |
| Orin NX 16GB | 100 TOPS | 16GB | 10-25W | Production AI |
| Orin AGX 32GB | 200 TOPS | 32GB | 15-60W | Research, Robotics |
| Orin AGX 64GB | 275 TOPS | 64GB | 15-60W | Maximum Performance |

### Jetson Xavier Series (Legacy)

| Model | AI Perf | Memory | Power | Status |
|-------|---------|--------|-------|--------|
| Xavier NX 8GB | 21 TOPS | 8GB | 10-20W | Limited support |
| Xavier AGX | 32 TOPS | 32GB | 10-30W | Limited support |

## Hardware Specifications

### Jetson Orin Nano

```
┌────────────────────────────────────────┐
│         Jetson Orin Nano               │
├────────────────────────────────────────┤
│ CPU: 6-core ARM Cortex-A78AE @ 1.5GHz  │
│ GPU: 1024-core NVIDIA Ampere           │
│      with 32 Tensor Cores              │
│ AI:  20/40 TOPS (INT8)                 │
│ RAM: 4GB/8GB 64-bit LPDDR5 @ 68GB/s    │
│ Storage: SD Card + NVMe (via M.2)      │
│ Video: 4K60 encode/decode (H.265)      │
│ Display: 1x HDMI 2.1, 3x DP 1.4        │
│ USB: 4x USB 3.2, 1x USB 2.0            │
│ PCIe: 1x M.2 Key M (x4)                │
│ Network: Gigabit Ethernet              │
│ GPIO: 40-pin header                    │
│ CSI: 2x 4-lane MIPI CSI-2              │
└────────────────────────────────────────┘
```

### Jetson Orin NX

```
┌────────────────────────────────────────┐
│         Jetson Orin NX                 │
├────────────────────────────────────────┤
│ CPU: 8-core ARM Cortex-A78AE @ 2.0GHz  │
│ GPU: 1024-core NVIDIA Ampere           │
│      with 32 Tensor Cores              │
│ AI:  70/100 TOPS (INT8)                │
│ RAM: 8GB/16GB 128-bit LPDDR5 @ 102GB/s │
│ Storage: eMMC + NVMe (M.2)             │
│ Video: 4K60 encode/decode (H.265)      │
│ Display: 1x HDMI 2.1, 3x DP 1.4        │
│ USB: 3x USB 3.2, 4x USB 2.0            │
│ PCIe: 1x M.2 Key M (x4), 1x M.2 Key E  │
│ Network: Gigabit Ethernet              │
│ GPIO: 40-pin header                    │
│ CSI: 2x 4-lane MIPI CSI-2              │
└────────────────────────────────────────┘
```

## 40-Pin GPIO Header

### Pinout Diagram

```
Jetson Orin 40-Pin Header (J12)
═══════════════════════════════════════════════════════

                      USB-C Power
                           │
    ┌────────────────────────────────────────────────┐
    │  3.3V  (1) ●                              ● (2)  5V      │
    │  I2C2_SDA (3) ●                              ● (4)  5V      │
    │  I2C2_SCL (5) ●                              ● (6)  GND     │
    │  GPIO07 (7) ●                              ● (8)  UART1_TX │
    │  GND    (9) ●                              ● (10) UART1_RX │
    │  GPIO00 (11)●                              ● (12) I2S0_SCLK│
    │  GPIO01 (13)●                              ● (14) GND      │
    │  GPIO02 (15)●                              ● (16) GPIO03   │
    │  3.3V   (17)●                              ● (18) GPIO04   │
    │  SPI0_MOSI(19)●                            ● (20) GND      │
    │  SPI0_MISO(21)●                            ● (22) GPIO05   │
    │  SPI0_SCK(23)●                             ● (24) SPI0_CS0 │
    │  GND    (25)●                              ● (26) SPI0_CS1 │
    │  I2C1_SDA(27)●                             ● (28) I2C1_SCL │
    │  GPIO06 (29)●                              ● (30) GND      │
    │  GPIO08 (31)●                              ● (32) GPIO09   │
    │  GPIO10 (33)●                              ● (34) GND      │
    │  I2S0_FS (35)●                             ● (36) GPIO11   │
    │  GPIO12 (37)●                              ● (38) I2S0_SDIN│
    │  GND    (39)●                              ● (40) I2S0_SDOUT│
    └────────────────────────────────────────────────┘
                           │
                    Ethernet / USB

Legend:
  ● = Pin (1-40)
  UART1 = /dev/ttyTHS0
  I2C2  = /dev/i2c-2  (Pins 3,5)
  I2C1  = /dev/i2c-1  (Pins 27,28)
  SPI0  = /dev/spidev0.0, /dev/spidev0.1
```

### GPIO Pin Functions

| Pin | Name | Function | Cule OS Device |
|-----|------|----------|----------------|
| 3 | I2C2_SDA | I2C Data | `/dev/i2c-2` |
| 5 | I2C2_SCL | I2C Clock | `/dev/i2c-2` |
| 8 | UART1_TX | Serial TX | `/dev/ttyTHS0` |
| 10 | UART1_RX | Serial RX | `/dev/ttyTHS0` |
| 19 | SPI0_MOSI | SPI Data Out | `/dev/spidev0.x` |
| 21 | SPI0_MISO | SPI Data In | `/dev/spidev0.x` |
| 23 | SPI0_SCK | SPI Clock | `/dev/spidev0.x` |
| 24 | SPI0_CS0 | SPI CS 0 | `/dev/spidev0.0` |
| 26 | SPI0_CS1 | SPI CS 1 | `/dev/spidev0.1` |
| 27 | I2C1_SDA | I2C Data | `/dev/i2c-1` |
| 28 | I2C1_SCL | I2C Clock | `/dev/i2c-1` |

## CSI Camera Connectors

### CSI Camera Pinout (J21)

```
Jetson Orin Nano CSI Connector (CAM0/CAM1)
═══════════════════════════════════════════════════════

        ┌─────────────────────────────────────┐
   CAM0 │ ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● │
        │ G D D C C 1 0 1 0 2 2 2 2 3 3 3 │
        │ N D D K K 2 3 0 1 8 7 6 5 4 3 2 │
        │ D 3 2 D C 2 1 1 1 1 1 1 1 1 1 1 │
        │     3 C 1 3 2 2 2 1 0 9 8 7 6 5 │
        └─────────────────────────────────────┘
          1 2 3 4 5 6 7 8 9 10111213141516

Pin Assignment:
    Pin 1  - GND
    Pin 2  - D3-  (Lane 3 Data-)
    Pin 3  - D3+  (Lane 3 Data+)
    Pin 4  - D2-  (Lane 2 Data-)
    Pin 5  - D2+  (Lane 2 Data+)
    Pin 6  - CK-  (Clock-)
    Pin 7  - CK+  (Clock+)
    Pin 8  - D1-  (Lane 1 Data-)
    Pin 9  - D1+  (Lane 1 Data+)
    Pin 10 - D0-  (Lane 0 Data-)
    Pin 11 - D0+  (Lane 0 Data+)
    Pin 12 - 1V8  (1.8V Power)
    Pin 13 - 1V8
    Pin 14 - 3V3  (3.3V Power)
    Pin 15 - 3V3
    Pin 16 - GND

Compatible Cameras:
- Raspberry Pi Camera Module V2 (IMX219)
- Raspberry Pi Camera Module 3 (IMX708)
- Arducam IMX477 (HQ Camera)
- Arducam IMX519
- Leopard Imaging cameras
```

## Cule OS Installation

### Method 1: Pre-built Image (Recommended)

```bash
# 1. Download Cule OS for Jetson
wget https://sanjaysparker27.github.io/cule-os/releases/\
    cule-os-axon-jetson-orin-v1.0.img.xz

# 2. Flash to SD Card (or NVMe with adapter)
# Linux/Mac:
xzcat cule-os-axon-jetson-orin-v1.0.img.xz | \
    sudo dd of=/dev/sdX bs=4M status=progress

# 3. Boot Jetson with SD card
# 4. Complete first-boot setup
```

### Method 2: Install on Existing Jetson OS

```bash
# 1. Install Cule OS package
sudo apt update
wget -qO - https://sanjaysparker27.github.io/cule-os/gpg.key | sudo apt-key add -
echo "deb https://sanjaysparker27.github.io/cule-os/repo stable main" | \
    sudo tee /etc/apt/sources.list.d/cule-os.list

sudo apt update
sudo apt install cule-os-axon

# 2. Configure for Jetson
sudo cule-config --platform jetson --model orin-nano

# 3. Install JetPack components
sudo apt install nvidia-jetpack

# 4. Reboot
sudo reboot
```

### Post-Installation Setup

```bash
# 1. Verify installation
cule-status

# 2. Set performance mode
sudo nvpmodel -m 0  # MAXN mode
sudo jetson_clocks

# 3. Configure camera
cule-camera-setup --csi imx219 --lane 4

# 4. Test camera
nvgstcapture-1.0 --sensor-id=0

# 5. Verify GPU
cuda-samples/deviceQuery
```

## Flight Controller Connection

### USB Connection (Recommended)

```
Jetson Orin ──USB-C──→ Pixhawk 6X (USB)

Advantages:
- Plug and play
- No wiring needed
- Good for bench testing

Setup:
1. Connect USB-C to Pixhawk USB
2. Device appears as /dev/ttyACM0
3. Set Cule OS to use this device
```

### UART Connection (Flight Ready)

```
Jetson Orin                Pixhawk 6X
═══════════                ══════════

Pin 8 (UART1_TX) ────────→ TELEM1_RX
Pin 10 (UART1_RX) ←──────── TELEM1_TX
Pin 9 (GND) ─────────────── GND

Baud Rate: 921600 (default)
Protocol: MAVLink2

Wiring:
┌─────────────────────────────────────────────┐
│ Jetson 40-pin    Wire Color    Pixhawk     │
├─────────────────────────────────────────────┤
│ Pin 8 (TX)       Orange        TELEM1 RX   │
│ Pin 10 (RX)      Yellow        TELEM1 TX   │
│ Pin 9 (GND)      Black         GND         │
└─────────────────────────────────────────────┘
```

## AI/ML Setup

### TensorRT Installation

```bash
# Install TensorRT
sudo apt install tensorrt

# Verify installation
/usr/src/tensorrt/bin/trtexec --version

# Optimize a model
/usr/src/tensorrt/bin/trtexec \
    --onnx=model.onnx \
    --saveEngine=model.trt \
    --fp16
```

### Running AI Models

```python
import tensorrt as trt
import pycuda.driver as cuda
import numpy as np

# Load TensorRT engine
with open("model.trt", "rb") as f:
    runtime = trt.Runtime(trt.Logger())
    engine = runtime.deserialize_cuda_engine(f.read())

# Create execution context
context = engine.create_execution_context()

# Allocate buffers and run inference
# See Cule OS vision examples for complete code
```

## DeepStream Setup

```bash
# Install DeepStream
sudo apt install deepstream-6.3

# Test with sample app
deepstream-app -c /opt/nvidia/deepstream/samples/configs/\
    deepstream-app/source4_1080p_dec_infer-resnet_tracker_sgie_tiled_display_int8.txt
```

## Performance Optimization

### Power Modes

```bash
# Check current mode
sudo nvpmodel -q

# Available modes for Orin Nano:
# 0: MAXN (15W) - Maximum performance
# 1: 7W mode - Power saving

# Set to maximum performance
sudo nvpmodel -m 0
sudo jetson_clocks

# Check clocks
sudo jetson_clocks --show

# Monitor temperatures
tegrastats
```

### Jetson Stats

```bash
# Install jetson-stats
sudo pip3 install jetson-stats

# Run jtop
jtop

# Information displayed:
# - CPU/GPU usage and temperatures
# - RAM usage
# - Power consumption
# - JetPack version
```

## Troubleshooting

### Boot Issues

```bash
# Force recovery mode
# 1. Power off
# 2. Connect FC REC pin to GND
# 3. Power on
# 4. Flash via USB

# Check boot logs
sudo dmesg | grep -i jetson

# Verify eMMC/SD card
lsblk
```

### Camera Issues

```bash
# List video devices
ls -la /dev/video*

# Check camera detection
dmesg | grep -i imx

# Test with v4l2
v4l2-ctl --list-devices
v4l2-ctl -d /dev/video0 --all

# GStreamer test
gst-launch-1.0 nvarguscamerasrc ! 'video/x-raw(memory:NVMM),\
    width=1920, height=1080' ! nvvidconv ! xvimagesink
```

### USB Device Issues

```bash
# Check USB power
cat /sys/kernel/debug/usb/devices | grep "Bus\|Pow"

# Reset USB
echo 0 > /sys/bus/usb/rescan

# Check device tree
dtc -I fs /proc/device-tree
```

## See Also

- [Companion Computers](./companion-computers.md) - Overview
- [Raspberry Pi Guide](./raspberry-pi.md) - Alternative platform
- [CSI Cameras](./csi-cameras.md) - Camera setup
- [Wiring Diagrams](./wiring.md) - Connection diagrams
