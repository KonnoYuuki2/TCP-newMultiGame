import User from "../../classess/models/user.class.js";

export const userSessions = [];

export const addUser = async (socket, uuid, playerId, latency, payload) => {
  const user = new User(uuid, socket, playerId, latency, payload);
  userSessions.push(user);
};

export const removeUser = (socket) => {
  const removeIndex = userSessions.findIndex((user) => {
    user.socket === socket;
  });

  if (removeIndex !== -1) {
    return userSessions.splice(removeIndex, 1)[0];
  }
};

export const nextSequence = (id) => {
  const user = getUserById(id);

  if (user) {
    return user.getNextSequence();
  } else {
    return null;
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};
export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getOtherUser = (userId) => {
  return userSessions.find((user) => {
    return user.id !== userId;
  });
};

export const getAllUser = () => {
  return userSessions;
};
