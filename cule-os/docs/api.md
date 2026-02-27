# Cule OS API Documentation

Complete API reference for the ATHENA H743 PRO flight controller integration with Cule OS and companion computer systems.

## Table of Contents
- [Python API](#python-api)
  - [Mally System](#mally-system)
  - [Communication Agent](#communication-agent)
  - [Perception Agent](#perception-agent)
  - [Navigation Agent](#navigation-agent)
  - [Planning Agent](#planning-agent)
  - [Swarm Orchestrator](#swarm-orchestrator)
- [MAVLink API](#mavlink-api)
  - [Connection Setup](#connection-setup)
  - [Command Long](#command-long)
  - [Mission Protocol](#mission-protocol)
  - [Parameter Protocol](#parameter-protocol)
- [ROS2 Topics](#ros2-topics)
  - [Published Topics](#published-topics)
  - [Subscribed Topics](#subscribed-topics)
- [CLI Commands](#cli-commands)
  - [System Commands](#system-commands)
  - [Mission Commands](#mission-commands)
- [Integration Examples](#integration-examples)
  - [Arming and Takeoff](#arming-and-takeoff)
  - [Waypoint Navigation](#waypoint-navigation)
  - [Mode Switching](#mode-switching)
  - [Landing](#landing)

---

## Python API

### Mally System

The `MallySystem` is the main orchestrator for the multi-agent system.

```python
from mally.main import MallySystem

# Initialize system
system = MallySystem(config_path="config/mally.yaml")

# Start system
await system.initialize()
await system.run()
```

#### Constructor

```python
MallySystem(config_path: Optional[str] = None)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `config_path` | `str` | Path to YAML/JSON configuration file |

#### Methods

##### `initialize() -> bool`
Initializes all agents and the message bus. Returns `True` on success.

```python
success = await system.initialize()
if not success:
    print("Failed to initialize")
```

##### `get_system_status() -> Dict`
Returns complete system status including all agents and metrics.

```python
status = await system.get_system_status()
print(f"Running: {status['running']}")
print(f"Agents: {status['agents']}")
```

##### `send_command(target, command, params) -> bool`
Sends a command to a specific agent.

```python
await system.send_command(
    target="communication_001",
    command="ARM_VEHICLE",
    params={"arm": True}
)
```

##### `shutdown() -> bool`
Gracefully shuts down the system.

```python
await system.shutdown()
```

---

### Communication Agent

Handles MAVLink and SATCOM communication for telemetry and command/control.

```python
from mally.agents.communication.communication_agent import CommunicationAgent
from mally.utils.config import CommunicationConfig

config = CommunicationConfig(
    mavlink_port="/dev/ttyTHS1",
    mavlink_baudrate=921600,
    mavlink_sysid=1,
    mavlink_compid=1
)

comm = CommunicationAgent("comm_001", config, message_bus)
await comm.initialize()
```

#### Configuration

```python
class CommunicationConfig:
    mavlink_port: str = "/dev/ttyUSB0"
    mavlink_baudrate: int = 921600
    mavlink_sysid: int = 1
    mavlink_compid: int = 1
    satcom_enabled: bool = False
    satcom_endpoint: str = "iridium"
    satcom_imei: str = ""
    heartbeat_interval: float = 1.0  # seconds
    telemetry_rate: float = 10.0     # Hz
    command_ack_timeout: float = 5.0 # seconds
    max_reconnect_attempts: int = 5
    udp_listen_port: int = 14550
    udp_send_port: int = 14551
```

#### Methods

##### `send_mavlink_command(command: str, **kwargs)`
Sends a MAVLink command to the vehicle.

```python
# Arm vehicle
await comm.send_mavlink_command("COMPONENT_ARM_DISARM", arm=True)

# Set mode
await comm.send_mavlink_command(
    "DO_SET_MODE",
    base_mode=1,
    custom_mode=0  # LOITER
)

# Takeoff
await comm.send_mavlink_command(
    "NAV_TAKEOFF",
    altitude=10.0
)
```

##### `send_satcom(data: bytes) -> bool`
Sends data via satellite communication.

```python
data = json.dumps({"position": [lat, lon, alt]}).encode()
success = await comm.send_satcom(data)
```

##### `broadcast_heartbeat()`
Broadcasts MAVLink heartbeat to maintain connection.

```python
await comm.broadcast_heartbeat()
```

#### TelemetryData Structure

```python
@dataclass
class TelemetryData:
    position: Dict[str, float]  # lat, lon, alt
    attitude: Dict[str, float]  # roll, pitch, yaw
    velocity: Dict[str, float]  # vx, vy, vz
    battery: Dict[str, float]   # voltage, current, remaining
    gps: Dict[str, Any]         # fix_type, satellites, hdop
    timestamp: float
```

---

### Perception Agent

YOLO/ONNX-based object detection for UAV/USV/UGV.

```python
from mally.agents.perception.perception_agent import PerceptionAgent
from mally.utils.config import PerceptionConfig

config = PerceptionConfig(
    camera_source="/dev/video0",
    model_path="models/yolov8n.onnx",
    detection_threshold=0.5,
    onnx_runtime="cuda",
    tracking_enabled=True
)

perception = PerceptionAgent("perception_001", config, message_bus)
await perception.initialize()
```

#### Configuration

```python
class PerceptionConfig:
    camera_source: str = "0"
    model_path: str = "models/yolov8n.onnx"
    detection_threshold: float = 0.5
    onnx_runtime: str = "cuda"  # cpu, cuda, tensorrt
    input_size: tuple = (640, 640)
    classes_of_interest: List[str] = ["person", "vehicle", "obstacle"]
    inference_interval: float = 0.033  # 30 FPS
    max_detections: int = 100
    tracking_enabled: bool = True
    track_history: int = 30
```

#### Methods

##### `detect(frame: np.ndarray) -> DetectionFrame`
Runs YOLO inference on a frame.

```python
import cv2
cap = cv2.VideoCapture(0)
ret, frame = cap.read()

if ret:
    detections = await perception.detect(frame)
    print(f"Found {len(detections.detections)} objects")
    for det in detections.detections:
        print(f"  {det.class_name}: {det.confidence:.2f}")
```

##### `start_detection_loop(camera_source: str = None)`
Starts continuous detection loop.

```python
await perception.start_detection_loop("/dev/video0")
```

##### `stop_detection_loop()`
Stops continuous detection loop.

```python
await perception.stop_detection_loop()
```

##### `get_detections() -> Optional[DetectionFrame]`
Returns latest detections.

```python
det_frame = await perception.get_detections()
if det_frame:
    for det in det_frame.detections:
        print(f"{det.class_name} at {det.center}")
```

#### Detection Structure

```python
@dataclass
class Detection:
    bbox: Tuple[float, float, float, float]  # x1, y1, x2, y2 (normalized)
    class_id: int
    class_name: str
    confidence: float
    tracking_id: Optional[int] = None
    timestamp: float
```

---

### Navigation Agent

ORB-SLAM3 integration for GPS-denied navigation.

```python
from mally.agents.navigation.navigation_agent import NavigationAgent
from mally.utils.config import NavigationConfig

config = NavigationConfig(
    slam_config_path="config/orb_slam3.yaml",
    map_save_path="maps/",
    use_gps_denied=True,
    localization_rate=10.0
)

nav = NavigationAgent("nav_001", config, message_bus)
await nav.initialize()
```

#### Configuration

```python
class NavigationConfig:
    slam_config_path: str = "config/orb_slam3.yaml"
    map_save_path: str = "maps/"
    use_gps_denied: bool = True
    visual_odometry: bool = True
    imu_topic: str = "/imu/data"
    camera_topic: str = "/camera/image_raw"
    gps_topic: str = "/gps/fix"
    voxel_size: float = 0.05
    localization_rate: float = 10.0  # Hz
    loop_closure_enabled: bool = True
    map_update_rate: float = 1.0     # Hz
```

#### Methods

##### `get_current_pose() -> Optional[Pose]`
Returns current camera pose in world frame.

```python
pose = await nav.get_current_pose()
if pose:
    print(f"Position: {pose.position}")
    print(f"Orientation: {pose.orientation}")
```

##### `get_trajectory() -> List[Pose]`
Returns estimated trajectory.

```python
trajectory = await nav.get_trajectory()
print(f"Trajectory length: {len(trajectory)} poses")
```

##### `set_relocalization_map(map_path: str) -> bool`
Loads existing map for relocalization.

```python
success = await nav.set_relocalization_map("maps/office.map")
```

##### `reset_slam() -> bool`
Resets the SLAM system.

```python
success = await nav.reset_slam()
```

#### Pose Structure

```python
@dataclass
class Pose:
    position: np.ndarray      # x, y, z
    orientation: np.ndarray   # quaternion x, y, z, w
    covariance: np.ndarray    # 6x6 covariance matrix
    timestamp: float
    frame_id: str
```

---

### Planning Agent

Model Predictive Control (MPC) for autonomous vehicles.

```python
from mally.agents.planning.planning_agent import PlanningAgent
from mally.utils.config import PlanningConfig

config = PlanningConfig(
    mpc_horizon=20,
    control_frequency=50.0,
    constraints={
        "max_velocity": 15.0,
        "max_acceleration": 5.0,
        "max_angular_rate": 2.0,
        "min_altitude": 2.0,
        "max_altitude": 120.0,
        "safety_margin": 1.0
    }
)

planning = PlanningAgent("planning_001", config, message_bus)
await planning.initialize()
```

#### Configuration

```python
class PlanningConfig:
    mpc_horizon: int = 20
    control_frequency: float = 50.0  # Hz
    prediction_horizon: float = 2.0  # seconds
    constraints: Dict[str, Any] = {
        "max_velocity": 15.0,      # m/s
        "max_acceleration": 5.0,   # m/s²
        "max_angular_rate": 2.0,   # rad/s
        "min_altitude": 2.0,       # m
        "max_altitude": 120.0,     # m
        "safety_margin": 1.0       # m
    }
    cost_weights: Dict[str, float] = {
        "position_error": 1.0,
        "velocity_error": 0.5,
        "control_effort": 0.1,
        "obstacle_avoidance": 10.0
    }
    replan_threshold: float = 0.5  # m
    path_smoothing: bool = True
```

#### Methods

##### `plan_path(start, goal, obstacles) -> Trajectory`
Generates collision-free trajectory.

```python
import numpy as np

start = np.array([0, 0, 0])
goal = np.array([10, 5, -5])
obstacles = [
    Obstacle(position=np.array([5, 2, -2]), radius=1.0),
    Obstacle(position=np.array([7, 3, -3]), radius=0.5)
]

trajectory = await planning.plan_path(start, goal, obstacles)
print(f"Trajectory cost: {trajectory.cost}")
print(f"Trajectory length: {trajectory.length}")
```

##### `compute_control(current_state, reference) -> Tuple[Trajectory, Control]`
Computes optimal control using MPC.

```python
from mally.agents.planning.planning_agent import State, Control

current_state = State(
    position=np.array([0, 0, -5]),
    velocity=np.array([0, 0, 0]),
    orientation=np.array([0, 0, 0, 1])
)

trajectory, control = await planning.compute_control(current_state, reference)
print(f"Control: thrust={control.thrust}, roll={control.roll_rate}")
```

##### `update_constraints(constraints: Dict[str, Any])`
Updates dynamic constraints.

```python
await planning.update_constraints({
    "max_velocity": 10.0,
    "safety_margin": 2.0
})
```

#### State and Control Structures

```python
@dataclass
class State:
    position: np.ndarray       # x, y, z
    velocity: np.ndarray       # vx, vy, vz
    orientation: np.ndarray    # quaternion w, x, y, z
    angular_velocity: np.ndarray  # wx, wy, wz
    timestamp: float

@dataclass
class Control:
    thrust: float           # N or throttle 0-1
    roll_rate: float        # rad/s
    pitch_rate: float       # rad/s
    yaw_rate: float         # rad/s
    timestamp: float
```

---

### Swarm Orchestrator

Multi-vehicle coordination with Raft consensus.

```python
from mally.agents.swarm.swarm_orchestrator import SwarmOrchestrator
from mally.utils.config import SwarmConfig

config = SwarmConfig(
    consensus_algorithm="raft",
    election_timeout=1.0,
    heartbeat_interval=0.5,
    swarm_id="swarm_001"
)

swarm = SwarmOrchestrator("swarm_001", config, message_bus)
await swarm.initialize()
```

#### Configuration

```python
class SwarmConfig:
    consensus_algorithm: str = "raft"  # raft, pbft, paxos
    neighbor_discovery: str = "broadcast"
    formation_config: Dict[str, Any] = {
        "type": "leader_follower",
        "spacing": 5.0,          # m
        "alignment": "grid",     # grid, line, circle
        "max_neighbors": 10
    }
    election_timeout: float = 1.0      # seconds
    heartbeat_interval: float = 0.5    # seconds
    consensus_timeout: float = 5.0     # seconds
    fault_tolerance: int = 1           # max faulty nodes
    swarm_id: str = "swarm_001"
    leader_id: Optional[str] = None
```

#### Methods

##### `add_agent(agent_info: Dict[str, Any]) -> bool`
Adds an agent to the swarm.

```python
success = await swarm.add_agent({
    "agent_id": "uav_002",
    "agent_type": "uav",
    "capabilities": ["perception", "planning"]
})
```

##### `remove_agent(agent_id: str) -> bool`
Removes an agent from the swarm.

```python
success = await swarm.remove_agent("uav_002")
```

##### `form_formation(formation_type: str)`
Executes formation control.

```python
# Available formations: "line", "grid", "circle", "leader_follower"
await swarm.form_formation("grid")
```

##### `broadcast_command(command: Dict[str, Any])`
Broadcasts command to all swarm members.

```python
await swarm.broadcast_command({
    "type": "mission_update",
    "phase": "search_and_rescue",
    "target_zone": [10, 10, -5]
})
```

##### `reach_consensus(proposal: Dict[str, Any]) -> bool`
Proposes and reaches consensus on a value.

```python
success = await swarm.reach_consensus({
    "type": "formation_change",
    "formation_type": "circle"
})
```

#### SwarmMember Structure

```python
@dataclass
class SwarmMember:
    agent_id: str
    agent_type: str
    role: NodeRole
    last_heartbeat: float
    is_healthy: bool
    position: Optional[Tuple[float, float, float]]
    capabilities: List[str]
```

---

## MAVLink API

### Connection Setup

```python
from pymavlink import mavutil

# Serial connection (Jetson to FC)
master = mavutil.mavlink_connection('/dev/ttyTHS1', baud=921600)

# UDP connection (for simulation)
master = mavutil.mavlink_connection('udp:127.0.0.1:14550')

# TCP connection
master = mavutil.mavlink_connection('tcp:192.168.1.10:5760')

# Wait for heartbeat
master.wait_heartbeat()
print(f"Connected to system {master.target_system}")
```

### Command Long

The `COMMAND_LONG` message is used for most vehicle commands.

```python
# Command structure
master.mav.command_long_send(
    target_system,      # Usually master.target_system
    target_component,   # Usually master.target_component
    command_id,         # MAV_CMD_* constant
    confirmation,       # 0 for first transmission
    param1, param2, param3, param4, param5, param6, param7
)
```

#### Common Commands

##### Arm/Disarm
```python
# Arm
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
    0,  # confirmation
    1,  # param1: 1=arm, 0=disarm
    0, 0, 0, 0, 0, 0
)

# Force arm (skip checks)
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
    0,
    1, 21196, 0, 0, 0, 0, 0  # param2=21196 forces arm
)
```

##### Set Mode
```python
# Mode mapping for ArduPilot Copter
# 0 = STABILIZE, 2 = ALT_HOLD, 3 = AUTO, 4 = GUIDED
# 5 = LOITER, 6 = RTL, 9 = LAND, 16 = POSHOLD

mode_id = 5  # LOITER
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_DO_SET_MODE,
    0,
    1,      # param1: base mode
    mode_id,# param2: custom mode
    0, 0, 0, 0, 0
)
```

##### Takeoff
```python
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
    0,
    0, 0, 0, 0, 0, 0,
    10.0    # param7: altitude in meters
)
```

##### Waypoint Navigation
```python
# Navigate to GPS coordinate
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
    0,
    0,      # param1: hold time
    5,      # param2: acceptance radius
    0, 0,
    lat,    # param5: latitude
    lon,    # param6: longitude
    alt     # param7: altitude
)
```

##### Return to Launch (RTL)
```python
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH,
    0, 0, 0, 0, 0, 0, 0, 0
)
```

##### Land
```python
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_NAV_LAND,
    0,
    0, 0, 0, 0, 0, 0, 0
)
```

### Mission Protocol

Upload and execute waypoint missions.

```python
from pymavlink import mavutil

# Clear existing mission
master.mav.mission_clear_all_send(master.target_system, master.target_component)

# Define waypoints
waypoints = [
    # Home waypoint
    mavutil.mavlink.MAVLink_mission_item_message(
        master.target_system,
        master.target_component,
        seq=0,
        frame=mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
        command=mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
        current=1,
        autocontinue=1,
        param1=0,       # hold time
        param2=5,       # acceptance radius
        param3=0,
        param4=0,
        x=37.7749,      # latitude
        y=-122.4194,    # longitude
        z=10            # altitude
    ),
    # Takeoff
    mavutil.mavlink.MAVLink_mission_item_message(
        master.target_system,
        master.target_component,
        seq=1,
        frame=mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
        command=mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
        current=0,
        autocontinue=1,
        param1=0, param2=0, param3=0, param4=0,
        x=0, y=0, z=10
    ),
    # Waypoint 1
    mavutil.mavlink.MAVLink_mission_item_message(
        master.target_system,
        master.target_component,
        seq=2,
        frame=mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
        command=mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
        current=0,
        autocontinue=1,
        param1=0, param2=5, param3=0, param4=0,
        x=37.7750, y=-122.4195, z=15
    ),
    # Land
    mavutil.mavlink.MAVLink_mission_item_message(
        master.target_system,
        master.target_component,
        seq=3,
        frame=mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
        command=mavutil.mavlink.MAV_CMD_NAV_LAND,
        current=0,
        autocontinue=1,
        param1=0, param2=0, param3=0, param4=0,
        x=37.7749, y=-122.4194, z=0
    )
]

# Send waypoint count
master.mav.mission_count_send(
    master.target_system,
    master.target_component,
    len(waypoints)
)

# Upload each waypoint
for wp in waypoints:
    master.mav.send(wp)

# Start mission
master.mav.command_long_send(
    master.target_system,
    master.target_component,
    mavutil.mavlink.MAV_CMD_MISSION_START,
    0, 0, 0, 0, 0, 0, 0, 0
)
```

### Parameter Protocol

Read and write flight controller parameters.

```python
# Read parameter
master.mav.param_request_read_send(
    master.target_system,
    master.target_component,
    b'FRAME_CLASS',  # Parameter name as bytes
    -1               # -1 to search by name
)

# Wait for response
msg = master.recv_match(type='PARAM_VALUE', blocking=True, timeout=5)
if msg:
    print(f"{msg.param_id} = {msg.param_value}")

# Write parameter
master.mav.param_set_send(
    master.target_system,
    master.target_component,
    b'WPNAV_SPEED',
    1500.0,  # Value
    mavutil.mavlink.MAV_PARAM_TYPE_REAL32
)

# Request all parameters
master.mav.param_request_list_send(
    master.target_system,
    master.target_component
)
```

---

## ROS2 Topics

Cule OS publishes and subscribes to standard ROS2 topics for integration with ROS2-based systems.

### Published Topics

| Topic | Message Type | Rate | Description |
|-------|-------------|------|-------------|
| `/vehicle/attitude` | `geometry_msgs/PoseStamped` | 100Hz | Vehicle attitude |
| `/vehicle/velocity` | `geometry_msgs/TwistStamped` | 50Hz | Linear/angular velocity |
| `/vehicle/position` | `sensor_msgs/NavSatFix` | 10Hz | GPS position |
| `/vehicle/battery` | `sensor_msgs/BatteryState` | 1Hz | Battery status |
| `/vehicle/status` | `cule_os/VehicleStatus` | 1Hz | System status |
| `/perception/detections` | `vision_msgs/Detection2DArray` | 30Hz | Object detections |
| `/planning/trajectory` | `nav_msgs/Path` | 50Hz | Planned trajectory |
| `/planning/obstacles` | `geometry_msgs/PoseArray` | 30Hz | Detected obstacles |
| `/navigation/pose` | `geometry_msgs/PoseStamped` | 30Hz | SLAM pose estimate |
| `/communication/telemetry` | `cule_os/Telemetry` | 10Hz | MAVLink telemetry |

### Subscribed Topics

| Topic | Message Type | Description |
|-------|-------------|-------------|
| `/vehicle/cmd_position` | `geometry_msgs/PoseStamped` | Position setpoint |
| `/vehicle/cmd_velocity` | `geometry_msgs/Twist` | Velocity command |
| `/vehicle/cmd_attitude` | `geometry_msgs/Quaternion` | Attitude setpoint |
| `/vehicle/arm` | `std_msgs/Bool` | Arm/disarm command |
| `/vehicle/mode` | `std_msgs/String` | Flight mode command |
| `/perception/enable` | `std_msgs/Bool` | Enable/disable perception |
| `/planning/goal` | `geometry_msgs/PoseStamped` | Navigation goal |
| `/planning/constraints` | `cule_os/Constraints` | Dynamic constraints |

### Topic Usage Examples

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import NavSatFix
from std_msgs.msg import Bool

class VehicleController(Node):
    def __init__(self):
        super().__init__('vehicle_controller')
        
        # Subscribe to position
        self.position_sub = self.create_subscription(
            NavSatFix,
            '/vehicle/position',
            self.position_callback,
            10
        )
        
        # Publish arm command
        self.arm_pub = self.create_publisher(Bool, '/vehicle/arm', 10)
    
    def position_callback(self, msg):
        self.get_logger().info(f"Position: {msg.latitude}, {msg.longitude}")
    
    def arm_vehicle(self):
        msg = Bool()
        msg.data = True
        self.arm_pub.publish(msg)

# Initialize
rclpy.init()
node = VehicleController()
rclpy.spin(node)
```

---

## CLI Commands

Cule OS provides command-line tools for system management and mission control.

### System Commands

#### `cule-config`
Configure Cule OS system settings.

```bash
# Interactive configuration
sudo cule-config

# Configure specific vehicle type
sudo cule-config --vehicle uav --type quadcopter

# Configure camera
sudo cule-config --camera /dev/video0 --resolution 1920x1080

# Configure MAVLink connection
sudo cule-config --mavlink /dev/ttyTHS1 --baud 921600
```

#### `cule-status`
Check system status.

```bash
# Full system status
cule-status

# Check specific agent
cule-status --agent perception
cule-status --agent communication

# Check MAVLink connection
cule-status --mavlink

# JSON output
cule-status --json
```

#### `cule-service`
Manage Cule OS services.

```bash
# Start/stop/restart services
sudo cule-service start mally
sudo cule-service stop mally
sudo cule-service restart mally

# Check service status
sudo cule-service status mally

# View logs
sudo cule-service logs mally --follow
```

#### `cule-logs`
View and manage system logs.

```bash
# View recent logs
cule-logs

# View specific agent logs
cule-logs --agent planning

# Filter by severity
cule-logs --level ERROR
cule-logs --level WARNING

# Export logs
cule-logs --export /path/to/export.log
```

### Mission Commands

#### `cule-mission`
Mission planning and execution.

```bash
# Upload mission from file
cule-mission upload mission.json

# Start mission
cule-mission start

# Pause mission
cule-mission pause

# Resume mission
cule-mission resume

# Abort mission
cule-mission abort

# Get mission status
cule-mission status

# Clear mission
cule-mission clear
```

**Mission File Format (JSON):**
```json
{
  "name": "Survey Mission",
  "waypoints": [
    {"lat": 37.7749, "lon": -122.4194, "alt": 10, "action": "TAKEOFF"},
    {"lat": 37.7750, "lon": -122.4195, "alt": 15, "action": "WAYPOINT"},
    {"lat": 37.7751, "lon": -122.4196, "alt": 15, "action": "WAYPOINT"},
    {"lat": 37.7749, "lon": -122.4194, "alt": 0, "action": "LAND"}
  ],
  "speed": 5.0,
  "acceptance_radius": 2.0
}
```

#### `cule-control`
Direct vehicle control.

```bash
# Arm vehicle
cule-control arm

# Disarm vehicle
cule-control disarm

# Set mode
cule-control mode LOITER
cule-control mode STABILIZE
cule-control mode GUIDED
cule-control mode AUTO

# Takeoff
cule-control takeoff --altitude 10

# Land
cule-control land

# RTL (Return to Launch)
cule-control rtl

# Send position command
cule-control goto --lat 37.7750 --lon -122.4195 --alt 15

# Send velocity command
cule-control velocity --vx 1.0 --vy 0.0 --vz 0.0
```

#### `cule-telemetry`
View real-time telemetry.

```bash
# Show all telemetry
cule-telemetry

# Show specific data
cule-telemetry --position
cule-telemetry --attitude
cule-telemetry --battery
cule-telemetry --gps

# Stream to file
cule-telemetry --record telemetry.csv --duration 60

# Display rate
cule-telemetry --rate 10
```

#### `cule-perception`
Manage perception system.

```bash
# Start detection
cule-perception start --camera /dev/video0

# Stop detection
cule-perception stop

# Set detection classes
cule-perception classes person,vehicle,obstacle

# View detections
cule-perception view

# Export detections
cule-perception export detections.json
```

#### `cule-slam`
Manage SLAM/navigation system.

```bash
# Start SLAM
cule-slam start

# Stop SLAM
cule-slam stop

# Reset SLAM
cule-slam reset

# Save map
cule-slam save map_name

# Load map
cule-slam load map_name

# Get pose
cule-slam pose
```

---

## Integration Examples

### Arming and Takeoff

```python
#!/usr/bin/env python3
"""
Complete arming and takeoff sequence using Cule OS Python API.
"""

import asyncio
import time
from pymavlink import mavutil
from mally.main import MallySystem

async def arm_and_takeoff(altitude=10.0):
    """Arm vehicle and takeoff to specified altitude."""
    
    # Initialize Mally system
    system = MallySystem("config/mally.yaml")
    await system.initialize()
    
    # Get communication agent
    comm_agent = system.agents.get("communication")
    if not comm_agent:
        print("Communication agent not found")
        return False
    
    # Wait for GPS fix
    print("Waiting for GPS fix...")
    await asyncio.sleep(2)
    
    # Set LOITER mode (recommended before arming)
    print("Setting LOITER mode...")
    await comm_agent.send_mavlink_command(
        "DO_SET_MODE",
        base_mode=1,
        custom_mode=5  # LOITER
    )
    await asyncio.sleep(1)
    
    # Arm vehicle
    print("Arming vehicle...")
    await comm_agent.send_mavlink_command(
        "COMPONENT_ARM_DISARM",
        arm=1
    )
    
    # Wait for arm confirmation
    await asyncio.sleep(2)
    
    # Takeoff
    print(f"Taking off to {altitude}m...")
    await comm_agent.send_mavlink_command(
        "NAV_TAKEOFF",
        altitude=altitude
    )
    
    # Wait to reach altitude
    print("Climbing...")
    await asyncio.sleep(10)
    
    print("Takeoff complete!")
    return True

# Run
if __name__ == "__main__":
    asyncio.run(arm_and_takeoff(altitude=10.0))
```

### Waypoint Navigation

```python
#!/usr/bin/env python3
"""
Waypoint navigation example using Cule OS Python API.
"""

import asyncio
import numpy as np
from mally.main import MallySystem
from mally.agents.planning.planning_agent import State, Obstacle

async def navigate_waypoints(waypoints):
    """Navigate through a list of waypoints."""
    
    # Initialize system
    system = MallySystem("config/mally.yaml")
    await system.initialize()
    
    comm = system.agents.get("communication")
    planning = system.agents.get("planning")
    
    if not comm or not planning:
        print("Required agents not initialized")
        return
    
    current_wp_index = 0
    
    while current_wp_index < len(waypoints):
        waypoint = waypoints[current_wp_index]
        print(f"Navigating to waypoint {current_wp_index + 1}: {waypoint}")
        
        # Get current state
        current_state = State(
            position=np.array([0, 0, -5]),  # Current position
            velocity=np.array([0, 0, 0])
        )
        
        # Plan path to waypoint
        goal = np.array([waypoint['x'], waypoint['y'], waypoint['z']])
        obstacles = []  # Could be populated from perception
        
        trajectory = await planning.plan_path(
            current_state.position,
            goal,
            obstacles
        )
        
        print(f"Planned trajectory with {len(trajectory.states)} points")
        
        # Send waypoint to vehicle
        await comm.send_mavlink_command(
            "NAV_WAYPOINT",
            param1=0,       # hold time
            param2=2,       # acceptance radius
            param3=0, param4=0,
            param5=waypoint['lat'],
            param6=waypoint['lon'],
            param7=waypoint['alt']
        )
        
        # Wait for waypoint reached
        print("Flying to waypoint...")
        await asyncio.sleep(15)  # Simplified - should check actual position
        
        print(f"Reached waypoint {current_wp_index + 1}")
        current_wp_index += 1
    
    print("All waypoints complete!")

# Define waypoints
mission_waypoints = [
    {'lat': 37.7749, 'lon': -122.4194, 'alt': 10, 'x': 0, 'y': 0, 'z': -10},
    {'lat': 37.7750, 'lon': -122.4195, 'alt': 15, 'x': 10, 'y': 0, 'z': -15},
    {'lat': 37.7751, 'lon': -122.4196, 'alt': 15, 'x': 10, 'y': 10, 'z': -15},
    {'lat': 37.7749, 'lon': -122.4194, 'alt': 10, 'x': 0, 'y': 0, 'z': -10},
]

if __name__ == "__main__":
    asyncio.run(navigate_waypoints(mission_waypoints))
```

### Mode Switching

```python
#!/usr/bin/env python3
"""
Mode switching example demonstrating all flight modes.
"""

import asyncio
from pymavlink import mavutil
from mally.main import MallySystem

# ArduPilot mode IDs
FLIGHT_MODES = {
    'STABILIZE': 0,
    'ACRO': 1,
    'ALT_HOLD': 2,
    'AUTO': 3,
    'GUIDED': 4,
    'LOITER': 5,
    'RTL': 6,
    'CIRCLE': 7,
    'LAND': 9,
    'DRIFT': 11,
    'SPORT': 13,
    'FLIP': 14,
    'AUTOTUNE': 15,
    'POSHOLD': 16,
    'BRAKE': 17,
    'THROW': 18,
    'AVOID_ADSB': 19,
    'GUIDED_NOGPS': 20,
    'SMART_RTL': 21
}

async def set_mode(system, mode_name):
    """Set vehicle flight mode."""
    comm = system.agents.get("communication")
    if not comm:
        print("Communication agent not available")
        return False
    
    mode_id = FLIGHT_MODES.get(mode_name.upper())
    if mode_id is None:
        print(f"Unknown mode: {mode_name}")
        return False
    
    print(f"Setting mode to {mode_name} (ID: {mode_id})...")
    
    await comm.send_mavlink_command(
        "DO_SET_MODE",
        base_mode=1,
        custom_mode=mode_id
    )
    
    await asyncio.sleep(1)
    print(f"Mode set to {mode_name}")
    return True

async def mode_switching_demo():
    """Demonstrate mode switching."""
    
    system = MallySystem("config/mally.yaml")
    await system.initialize()
    
    # Arm first
    await set_mode(system, 'LOITER')
    await asyncio.sleep(1)
    
    print("\n=== Mode Switching Demo ===\n")
    
    # Start in STABILIZE
    await set_mode(system, 'STABILIZE')
    await asyncio.sleep(3)
    
    # Switch to ALT_HOLD
    await set_mode(system, 'ALT_HOLD')
    await asyncio.sleep(3)
    
    # Switch to LOITER (requires GPS)
    await set_mode(system, 'LOITER')
    await asyncio.sleep(3)
    
    # Switch to GUIDED (for autonomous control)
    await set_mode(system, 'GUIDED')
    await asyncio.sleep(3)
    
    # Return to LOITER
    await set_mode(system, 'LOITER')
    
    print("\n=== Mode switching demo complete ===")

if __name__ == "__main__":
    asyncio.run(mode_switching_demo())
```

### Landing

```python
#!/usr/bin/env python3
"""
Safe landing sequence with descent monitoring.
"""

import asyncio
import time
from pymavlink import mavutil
from mally.main import MallySystem

async def safe_land():
    """Execute safe landing sequence."""
    
    system = MallySystem("config/mally.yaml")
    await system.initialize()
    
    comm = system.agents.get("communication")
    if not comm:
        print("Communication agent not available")
        return False
    
    print("=== Initiating Landing Sequence ===\n")
    
    # 1. Ensure we're in a position-controlled mode
    print("Step 1: Setting LOITER mode...")
    await comm.send_mavlink_command(
        "DO_SET_MODE",
        base_mode=1,
        custom_mode=5  # LOITER
    )
    await asyncio.sleep(2)
    
    # 2. Reduce altitude slowly before landing
    print("Step 2: Descending to 5m...")
    await comm.send_mavlink_command(
        "NAV_WAYPOINT",
        param1=0, param2=2, param3=0, param4=0,
        param5=0, param6=0, param7=5  # 5m altitude
    )
    await asyncio.sleep(10)
    
    # 3. Switch to LAND mode
    print("Step 3: Initiating landing...")
    await comm.send_mavlink_command(
        "NAV_LAND",
        param1=0, param2=0, param3=0, param4=0,
        param5=0, param6=0, param7=0
    )
    
    # 4. Monitor landing
    print("Step 4: Monitoring descent...")
    start_time = time.time()
    max_land_time = 60  # seconds
    
    while time.time() - start_time < max_land_time:
        # In real implementation, check altitude from telemetry
        await asyncio.sleep(1)
        
        # Check if landed (simplified)
        elapsed = time.time() - start_time
        if elapsed > 20:  # Assume landed after 20 seconds
            print("Vehicle landed")
            break
    
    # 5. Disarm
    print("Step 5: Disarming...")
    await asyncio.sleep(3)  # Wait for propellers to stop
    await comm.send_mavlink_command(
        "COMPONENT_ARM_DISARM",
        arm=0
    )
    
    print("\n=== Landing Complete ===")
    print("Vehicle safely on ground and disarmed")
    
    return True

async def rtl_and_land():
    """Return to launch and land."""
    
    system = MallySystem("config/mally.yaml")
    await system.initialize()
    
    comm = system.agents.get("communication")
    if not comm:
        return False
    
    print("=== Return to Launch ===\n")
    
    # Trigger RTL
    await comm.send_mavlink_command(
        "NAV_RETURN_TO_LAUNCH",
        param1=0, param2=0, param3=0, param4=0,
        param5=0, param6=0, param7=0
    )
    
    print("RTL initiated. Vehicle will:")
    print("  1. Climb to RTL altitude")
    print("  2. Return to launch position")
    print("  3. Descend and land")
    print("  4. Disarm automatically")
    
    # Monitor RTL
    await asyncio.sleep(60)  # Wait for RTL to complete
    
    print("\nRTL complete")
    return True

if __name__ == "__main__":
    # Run direct landing
    # asyncio.run(safe_land())
    
    # Or run RTL
    asyncio.run(rtl_and_land())
```

---

## Error Handling

### Common Errors and Solutions

```python
import asyncio
from pymavlink import mavutil

async def robust_command_send(comm_agent, command, max_retries=3):
    """Send command with retry logic."""
    
    for attempt in range(max_retries):
        try:
            await comm_agent.send_mavlink_command(command)
            
            # Wait for acknowledgment
            ack = await asyncio.wait_for(
                wait_for_ack(comm_agent, command),
                timeout=5.0
            )
            
            if ack:
                return True
                
        except asyncio.TimeoutError:
            print(f"Command timeout (attempt {attempt + 1})")
        except Exception as e:
            print(f"Command error: {e}")
        
        await asyncio.sleep(1)
    
    return False

async def wait_for_ack(comm_agent, command, timeout=5.0):
    """Wait for command acknowledgment."""
    # Implementation depends on message handling
    return True
```

---

## References

- [MAVLink Protocol Documentation](https://mavlink.io/)
- [ArduPilot MAVLink Interface](https://ardupilot.org/dev/docs/mavlink-basics.html)
- [DroneKit Python](https://dronekit-python.readthedocs.io/)
- [Cule OS GitHub](https://github.com/sanjaysparker27/cule-os)
- [ORB-SLAM3 Documentation](https://github.com/UZ-SLAMLab/ORB_SLAM3)
- [YOLOv8 Documentation](https://docs.ultralytics.com/)
