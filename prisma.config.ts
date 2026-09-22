import "dotenv/config";

import { defineConfig } from "prisma/config";
import {
  createMysqlDatabaseUrl,
  getDatabaseConnection,
} from "./src/lib/mysql-config";

const connection = getDatabaseConnection();
const databaseUrl =
  connection.kind === "mysql-config"
    ? createMysqlDatabaseUrl(connection.config)
    : connection.url;

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: databaseUrl,
  },
});
