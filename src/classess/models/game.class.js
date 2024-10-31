import { createLocationPacket } from "../../utils/notification/gameNotification.js";
import IntervalManager from "../managers/intervalManager.js";
import latencyManager from "../managers/latencyManager.js";

const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = "waiting"; // waiting , inProgress
    this.intervalManager = new IntervalManager();
    this.latencyManager = new latencyManager();
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error(`Game Session is full!`);
    }

    this.users.push(user);

    //this.intervalManager.addPlayer(user.id, user.ping.bind(user), 500);

    this.latencyManager.addUser(user.id, user.ping.bind(user), 500);
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  removeUser(id) {
    const index = this.users.findIndex((user) => user.id === id);

    if (this.users.length === 1) {
      this.latencyManager.clearAll();
    }
    //this.intervalManager.removePlayer(id);
    this.latencyManager.removeUser(this.users[index].id);
    if (this.users.length < MAX_PLAYERS) {
      this.state = "waiting";
    }

    return this.users.splice(index, 1)[0];
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }
  getAllLocation(id) {
    const maxLatency = this.getMaxLatency();

    const locations = this.users
      .filter((user) => user.id !== id)
      .map((user) => {
        const { x, y } = user.calculateLocation(maxLatency);

        return { id: user.id, playerId: user.playerId, x: x, y: y };
      });

    return createLocationPacket(locations);
  }
}

export default Game;
