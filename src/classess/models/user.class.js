import { createPingPacket } from "../../utils/notification/gameNotification.js";

class User {
  constructor(id, socket, playerId, latency, payload) {
    this.id = id;
    this.socket = socket;
    this.x = payload.x;
    this.y = payload.y;
    this.lastX = payload.x;
    this.lastY = payload.y;
    this.speed = 3;
    this.playerId = playerId;
    this.latency = latency;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    // 마지막 위치를 저장 -> 레이턴시의 방향을 계산하기 위함
    this.lastX = this.x;
    this.lastY = this.y;

    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  calculateLocation(latency) {
    // (현재 시간 - 위치의 마지막 업데이트 시간 + 레이턴시) / 1000
    const timeDiff = Math.floor(
      (Date.now() - this.lastUpdateTime + latency) / 1000
    );

    const distance = timeDiff * this.speed;

    const directionX = Math.sign(this.x - this.lastX);
    const directionY = Math.sign(this.y - this.lastY);

    return {
      x: this.x + directionX * distance,
      y: this.y + directionY * distance,
    };
  }

  ping() {
    const now = Date.now();

    //console.log(`${this.id} ping`);
    return this.socket.write(createPingPacket(now));
  }

  pong(data) {
    const now = Date.now();

    //console.log(`${this.id} Pong`);

    // 1. seconds 부분을 밀리초 단위로 변환
    const secondsInMillis = data.timestamp.seconds.low * 1000;

    // 2. nanos 부분을 밀리초 단위로 변환
    const nanosInMillis = data.timestamp.nanos / 1000000;

    // 3. 두 값을 합쳐 최종 밀리초 단위 타임스탬프 생성
    const timestampInMillis = secondsInMillis + nanosInMillis;

    this.latency = Math.floor((now - timestampInMillis) / 2);
    // console.log(`this latency`, this.latency);
    // console.log(`패킷 레이턴시`, data.latency);
  }
}

export default User;
