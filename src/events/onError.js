import { updateEndLocation } from "../DB/user/user_db.js";
import { gameId } from "../init/index.js";
import { getGameSession } from "../sessions/game/gameSessions.js";
import { getUserBySocket, removeUser } from "../sessions/user/userSessions.js";

export const onError = (socket) => async (error) => {
  console.error(`socket.on 중 에러 발생`, error);
  const user = getUserBySocket(socket);

  const game = getGameSession(gameId);

  await updateEndLocation(user.x, user.y, user.id);
  game.removeUser(user.id);
  removeUser(socket);
};
