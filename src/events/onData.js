import { config } from "../config/config.js";
import { PACKET_TYPE } from "../constants/header.js";
import { packetParser } from "../utils/parser/packetParser.js";
import { getHandlerByHandlerId } from "../handlers/index.js";

export const onData = (socket) => async (data) => {
  // 버퍼에서 조금씩 보내지는 데이터를 저장
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 총 헤더 길이
  const totalHeaderLength =
    config.packet.TOTAL_LENTGTH + config.packet.PACKET_TYPE_LENGTH;

  while (socket.buffer.length >= totalHeaderLength) {
    // length = 메시지의 총 길이를 담고 있다.
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.TOTAL_LENTGTH);

    if (socket.buffer.length >= length) {
      // 총 헤더 길이부터 메시지 길이(length)만큼 짜름
      const packet = socket.buffer.subarray(totalHeaderLength, length);

      // packetType + message
      socket.buffer = socket.buffer.subarray(length);

      try {
        switch (packetType) {
          case PACKET_TYPE.NORMAL: {
            const { handlerId, userId, payload } = packetParser(packet);

            const handler = getHandlerByHandlerId(handlerId);
            await handler({ socket, userId, payload });
          }
        }
      } catch (error) {
        console.error(`패킷 변환중 에러 발생`, error);
      }
    }
  }
};
