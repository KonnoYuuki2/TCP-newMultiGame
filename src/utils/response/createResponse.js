import { config } from "../../config/config.js";
import { PACKET_TYPE } from "../../constants/header.js";
import { getProtoMessage } from "../../init/loadProto.js";

const createResponse = (
  handlerId,
  responseCode,
  data = null // 데이터가 없을 수 도 있기 때문
) => {
  const protoMessage = getProtoMessage();

  const response = protoMessage.response.Response;

  const initial = protoMessage.initial.initialPayload;

  // 이니셜로 encode하여 유니티에서 이를 해독하지 못하는 문제를 해결했다.
  const initialData = initial.encode(data).finish();

  const responsePayload = {
    handlerId,
    responseCode,
    timestamp: Date.now(),
    // 데이터를 미리 버퍼화하여 넣어둬야지만 데이터 버퍼를 풀 수 있다.
    data: data ? Buffer.from(initialData) : null,
  };

  const buffer = response.encode(responsePayload).finish();

  const packetLength = Buffer.alloc(config.packet.TOTAL_LENTGTH);
  packetLength.writeUInt32BE(
    config.packet.TOTAL_LENTGTH +
      config.packet.PACKET_TYPE_LENGTH +
      buffer.length
  );

  const packetTypeLength = Buffer.alloc(config.packet.PACKET_TYPE_LENGTH);
  packetTypeLength.writeUInt8(PACKET_TYPE.NORMAL, 0);

  return Buffer.concat([packetLength, packetTypeLength, buffer]);
};

export default createResponse;
