import { config } from "../../config/config.js";
import { getProtoTypeByHandlerId } from "../../handlers/index.js";
import { getProtoMessage } from "../../init/loadProto.js";
import CustomError from "../error/customError.js";
import { ErrorCodes } from "../error/errorCodes.js";

export const packetParser = (data) => {
  const protoMessage = getProtoMessage();

  const Packet = protoMessage.common.Packet;

  let decodedPacket;

  try {
    decodedPacket = Packet.decode(data);
  } catch (error) {
    console.error(`패킷 디코딩에 실패하였습니다!`, error);
  }

  const handlerId = decodedPacket.handlerId;
  const userId = decodedPacket.userId;
  const version = decodedPacket.version;

  if (version !== config.client.VERSION) {
    console.error(`클라이언트 버전이 일치하지 않습니다.`);
  }

  let payload;
  //console.log(`client Version: ${version}`);

  //console.log(`핸들러 아이디`, handlerId);
  const protoTypeName = getProtoTypeByHandlerId(handlerId);

  if (!protoTypeName) {
    throw new Error();
  }

  const [nameSpace, typeName] = protoTypeName.split(".");

  const payloadType = protoMessage[nameSpace][typeName];
  try {
    payload = payloadType.decode(decodedPacket.payload);
  } catch (error) {
    throw new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,
      `패킷 디코딩 중 에러 발생`,
      error
    );
  }

  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter(
    (field) => !actualFields.includes(field)
  );

  if (missingFields > 0) {
    throw new CustomError(ErrorCodes.MISSING_FIELDS, `없는 필드가 존재합니다.`);
  }
  return { handlerId, userId, payload };
};
