import Game from "../../classess/models/game.class.js";

export const gameSessions = [];

export const addGameSession = async (id) => {
  try {
    const session = new Game(id);
    gameSessions.push(session);
    return session;
  } catch (error) {
    console.error(error);
  }
};

export const removeGameSession = (id) => {
  const removeIndex = gameSessions.findIndex((game) => game.id === id);

  if (removeIndex !== -1) {
    return gameSessions.splice(removeIndex, 1);
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((game) => game.id === id);
};
