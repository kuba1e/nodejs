import "reflect-metadata";
import { DataSource } from "typeorm";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../", ".env") });

const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER_NAME;
const password = process.env.DATABASE_USER_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);

export const AppDataSource = new DataSource({
  type: "postgres",
  host,
  port,
  username,
  password,
  database,
  synchronize: false,
  logging: true,
  cache: true,
  entities: ["dist/src/entity/**/*.js"],
  subscribers: [],
  migrations: ["dist/src/migration/**"],
});
