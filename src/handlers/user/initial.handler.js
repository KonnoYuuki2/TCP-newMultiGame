import {
  HANDLER_IDS,
  RESPONSE_SUCCESS_CODE,
} from "../../constants/handlerIds.js";
import {
  createUser,
  findUserByDeviceId,
  updateUserLogin,
} from "../../DB/user/user_db.js";
import { gameId } from "../../init/index.js";
import {
  gameSessions,
  getGameSession,
} from "../../sessions/game/gameSessions.js";
import { addUser, getUserById } from "../../sessions/user/userSessions.js";
import { handlerError } from "../../utils/error/errorHandler.js";
import createResponse from "../../utils/response/createResponse.js";

export const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;

    // 현재 DB에 유저가 존재유무에 따라 구별
    if (!(await findUserByDeviceId(deviceId))) {
      await createUser(deviceId);
      await addUser(socket, userId, playerId, latency, payload);
    } else {
      await updateUserLogin(deviceId);
      const dbUser = await findUserByDeviceId(deviceId);

      await addUser(socket, userId, playerId, latency, dbUser);
    }

    const user = await getUserById(userId);

    const gameSession = getGameSession(gameId);
    await gameSession.addUser(user);

    // 위치 변경까지 시작합시다.
    const response = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      {
        deviceId: user.id,
        playerId: user.playerId,
        latency: user.latency,
        x: user.x,
        y: user.y,
      }
    );

    socket.write(response);
  } catch (error) {
    handlerError(socket, error);
  }
};
