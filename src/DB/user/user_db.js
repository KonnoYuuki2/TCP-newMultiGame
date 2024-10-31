import pools from "../database.js";
import userQueries from "./user.queries.js";
import { v4 as uuidv4 } from "uuid";

export const findUserByDeviceId = async (deviceId) => {
  try {
    const [rows] = await pools.USER_DB.query(
      userQueries.SELECT_USER_BY_device_id,
      [deviceId]
    );

    return rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const findUserByDBId = async (dbId) => {
  try {
    const [rows] = await pools.USER_DB.query(userQueries.SELECT_USER_BY_Id, [
      dbId,
    ]);

    return rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const createUser = async (deviceId) => {
  try {
    const id = uuidv4();
    await pools.USER_DB.query(userQueries.CREATE_USER, [id, deviceId]);

    return { id, deviceId };
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserLogin = async (deviceId) => {
  try {
    await pools.USER_DB.query(userQueries.UPDATE_USER_Login, [deviceId]);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateEndLocation = async (x, y, deviceId) => {
  try {
    await pools.USER_DB.query(userQueries.UPDATE_USER_Location, [
      x,
      y,
      deviceId,
    ]);
  } catch (error) {
    throw new Error(error);
  }
};
