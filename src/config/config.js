import {
  DB1_HOST,
  DB1_NAME,
  DB1_PASSWORD,
  DB1_PORT,
  DB1_USER,
  DB2_HOST,
  DB2_NAME,
  DB2_PASSWORD,
  DB2_PORT,
  DB2_USER,
  HOST,
  PORT,
  VERSION,
} from "../constants/env.js";
import { PACKET_TYPE_LENGTH, TOTAL_LENTGTH } from "../constants/header.js";

export const config = {
  client: {
    VERSION: VERSION,
  },
  server: {
    HOST: HOST,
    PORT: PORT,
  },
  packet: {
    TOTAL_LENTGTH: TOTAL_LENTGTH,
    PACKET_TYPE_LENGTH: PACKET_TYPE_LENGTH,
  },
  DATABASE: {
    GAME_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      host: DB1_HOST,
      port: DB1_PORT,
      password: DB1_PASSWORD,
    },
    USER_DB: {
      name: DB2_NAME,
      user: DB2_USER,
      host: DB2_HOST,
      port: DB2_PORT,
      password: DB2_PASSWORD,
    },
  },
};
