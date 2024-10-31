import { onData } from "./onData.js";
import { onEnd } from "./onEnd.js";
import { onError } from "./onError.js";

export const onConnection = (socket) => {
  try {
    console.log(
      `Client connected from ${socket.remoteAddress}:${socket.remotePort}`
    );

    // 각 클라이언트마다 고유의 버퍼를 유지하기 위해서 사용
    socket.buffer = Buffer.alloc(0);

    socket.on("data", onData(socket));

    socket.on("end", onEnd(socket));

    socket.on("error", onError(socket));
  } catch (error) {
    console.error(`온 커넥션에러`, error);
  }
};
