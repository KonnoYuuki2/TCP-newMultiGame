const userQueries = {
  SELECT_USER_BY_Id: "SELECT * FROM user WHERE id = ?",
  SELECT_USER_BY_device_id: "SELECT * FROM user WHERE deviceid = ?",
  UPDATE_USER_Location: "UPDATE user SET x = ? , y = ? WHERE deviceid = ?",
  UPDATE_USER_Login:
    "UPDATE user SET Last_login = CURRENT_TIMESTAMP  WHERE deviceid = ?",
  CREATE_USER: "INSERT INTO user (id, deviceid) VALUES (?, ?)",
};

export default userQueries;
