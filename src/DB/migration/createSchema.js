import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pools from "../database.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const executeSqlFile = async (pool, filepath) => {
  const sql = fs.readFileSync(filepath, "utf-8");

  const queries = sql
    .split(";")
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (const query of queries) {
    await pool.query(query);
  }
};

const createSchema = async () => {
  const sqlDir = path.join(dirname, "../sql");

  console.log(`풀입니다`, pools.USER_DB);
  try {
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, "user_DB.sql"));
  } catch (error) {
    console.error(`유저 테이블 생성중 오류가 발생했습니다.`, error);
  }
};

createSchema()
  .then(() => {
    console.log(`DB 마이그레이션에 완료했습니다.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`DB 마이그레이션에 실패했습니다.`, error);
    process.exit(1);
  });
