import React, { Component } from "react";
import Config from "../scripts/config";
import "../bootstrap/Teleoperation.css"; // Import the custom CSS file for styling

class Teleoperation extends Component {
  state = { ros: null };

  constructor() {
    super();
    this.init_connection();

    this.handleMove = this.handleMove.bind(this);
    this.handleStop = this.handleStop.bind(this);
    
  }
  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection", () => {
      console.log("connection established in Teleoperation Component!");
      console.log(this.state.ros);
      this.setState({ connected: true });
    });

    this.state.ros.on("close", () => {
      console.log("connection is closed!");
      this.setState({ connected: false });
      //try to reconnect every 3 seconds
      setTimeout(() => {
        try {
          this.state.ros.connect(
            "ws://" +
              Config.ROSBRIDGE_SERVER_IP +
              ":" +
              Config.ROSBRIDGE_SERVER_PORT +
              ""
          );
        } catch (error) {
          console.log("connection problem ");
        }
      }, Config.RECONNECTION_TIMER);
    });

    try {
      this.state.ros.connect(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
    } catch (error) {
      console.log(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
      console.log("connection problem ");
    }
  }

  handleMove(direction) {
    console.log("handle move", direction);

    // Set linear and angular velocities based on the direction
    let linearVel = 0;
    let angularVel = 0;

    switch (direction) {
      case "up":
        linearVel = 0.5; // Set the desired linear velocity
        break;
      case "down":
        linearVel = -0.5; // Set the desired linear velocity
        break;
      case "left":
        angularVel = 1.0; // Set the desired angular velocity
        break;
      case "right":
        angularVel = -1.0; // Set the desired angular velocity
        break;
      default:
        break;
    }

    // Create the twist message to be published to rosbridge
    const twist = new window.ROSLIB.Message({
      linear: {
        x: linearVel,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: angularVel,
      },
    });

    // Create a ROS publisher on the topic cmd_vel
    const cmdVelTopic = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.CMD_VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });

    // Publish the twist message on the cmd_vel topic
    cmdVelTopic.publish(twist);
  }

  handleStop() {
    console.log("handle stop");

    // Create a twist message with zero velocities to stop the motion
    const twist = new window.ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });

    // Create a ROS publisher on the topic cmd_vel
    const cmdVelTopic = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.CMD_VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });

    // Publish the twist message on the cmd_vel topic to stop the motion
    cmdVelTopic.publish(twist);
  }

render() {
    return (
      <div className="teleoperation-container">
        <div className="button-container">
          <button
            className="direction-button up"
            onMouseDown={() => this.handleMove("up")}
            onMouseUp={this.handleStop}
          >
            Up
          </button>
        </div>
        <div className="button-container">
          <button
            className="direction-button left"
            onMouseDown={() => this.handleMove("left")}
            onMouseUp={this.handleStop}
          >
            Left
          </button>
          <button
            className="direction-button right"
            onMouseDown={() => this.handleMove("right")}
            onMouseUp={this.handleStop}
          >
            Right
          </button>
        </div>
        <div className="button-container">
          <button
            className="direction-button down"
            onMouseDown={() => this.handleMove("down")}
            onMouseUp={this.handleStop}
          >
            Down
          </button>
        </div>
      </div>
    );
  }
}

export default Teleoperation;