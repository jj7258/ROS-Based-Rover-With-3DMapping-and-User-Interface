const Config = {
  ROSBRIDGE_SERVER_IP: "192.168.192.90",
  ROSBRIDGE_SERVER_PORT: "9090",
  RECONNECTION_TIMER: 3000,
  CMD_VEL_TOPIC: "/cmd_vel",
  ODOM_TOPIC: "/odom",
  POSE_TOPIC: "/robot_pose",

  MAX_LINEAR_VELOCITY: 5,
  MAX_ANGULAR_VELOCITY: 5,
};

export default Config;
