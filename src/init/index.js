import { addGameSession } from "../sessions/game/gameSessions.js";
import { loadProto } from "./loadProto.js";
import { v4 as uuidv4 } from "uuid";

export const gameId = uuidv4(); // 게임 서버 구분을 위한 uuid

const initServer = async () => {
  try {
    // 서버 시작시, 하나의 게임 서버를 가져야만 한다.
    await loadProto();

    await addGameSession(gameId);
  } catch (error) {}
};

export default initServer;
