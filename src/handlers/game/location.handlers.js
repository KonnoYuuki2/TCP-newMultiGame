import { gameId } from "../../init/index.js";
import { getGameSession } from "../../sessions/game/gameSessions.js";
import { getUserById } from "../../sessions/user/userSessions.js";
import CustomError from "../../utils/error/customError.js";
import { ErrorCodes } from "../../utils/error/errorCodes.js";

export const locationHandler = ({ socket, userId, payload }) => {
  const { x, y } = payload;

  const user = getUserById(userId);

  if (!user) {
    throw new CustomError(
      ErrorCodes.USER_NOT_FOUND,
      `유저를 찾을 수 없습니다.`
    );
  }

  user.updatePosition(x, y);

  //console.log(`현재 유저의 위치: ${user.x}, ${user.y}`);

  const game = getGameSession(gameId);

  socket.write(game.getAllLocation(userId));

  // 현재 유저 외에 모든 유저의 위치
};
