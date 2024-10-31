import mysql from "mysql2/promise";
import { config } from "../config/config.js";

const { DATABASE } = config;

export const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    database: dbConfig.name,
    user: dbConfig.user,
    host: dbConfig.host,
    password: dbConfig.password,
    port: dbConfig.port,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const originQuery = pool.query;

  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${date}] Executing query: ${sql} ${
        params
          ? `,
        ${JSON.stringify(params)}`
          : ``
      }`
    );

    return originQuery.call(pool, sql, params);
  };

  return pool;
};

const pools = {
  GAME_DB: createPool(DATABASE.GAME_DB),
  USER_DB: createPool(DATABASE.USER_DB),
};

export default pools;
