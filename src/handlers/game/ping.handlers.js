import { getUserById } from "../../sessions/user/userSessions.js";

export const pingHandler = ({ socket, userId, payload }) => {
  const user = getUserById(userId);

  user.pong(payload);
};
