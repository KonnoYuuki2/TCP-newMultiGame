import { updateEndLocation, updateUserLogin } from "../DB/user/user_db.js";
import { gameId } from "../init/index.js";
import { getGameSession } from "../sessions/game/gameSessions.js";
import { getUserBySocket, removeUser } from "../sessions/user/userSessions.js";

export const onEnd = (socket) => async (data) => {
  try {
    const game = getGameSession(gameId);

    const user = getUserBySocket(socket);

    await updateEndLocation(user.x, user.y, user.id);

    game.removeUser(user.id);
    removeUser(socket);
  } catch (error) {
    console.error(`error`, error);
  }
};
