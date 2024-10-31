import { HANDLER_IDS } from "../constants/handlerIds.js";
import CustomError from "../utils/error/customError.js";
import { ErrorCodes } from "../utils/error/errorCodes.js";
import { locationHandler } from "./game/location.handlers.js";
import { pingHandler } from "./game/ping.handlers.js";
import { initialHandler } from "./user/initial.handler.js";

export const handler = {
  [HANDLER_IDS.INITIAL]: {
    // 로그인시 오는 패킷 처리
    handler: initialHandler,
    protoType: "initial.initialPacket",
  },
  [HANDLER_IDS.LOCATION]: {
    // 위치 업데이트시 오는 패킷 처리
    handler: locationHandler,
    protoType: "location.LocationUpdatePayload",
  },
  [HANDLER_IDS.Ping]: {
    // 핑 패킷 처리
    handler: pingHandler,
    protoType: "common.Pong",
  },
};

// 핸들러 아이디 얻기
export const getHandlerByHandlerId = (handlerId) => {
  if (!handler[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러 아이디를 찾을 수 없습니다.`
    );
  }

  return handler[handlerId].handler;
};
// 프로토 타입 얻기
export const getProtoTypeByHandlerId = (handlerId) => {
  if (!handler[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러 아이디를 찾을 수 없습니다.`
    );
  }

  return handler[handlerId].protoType;
};
