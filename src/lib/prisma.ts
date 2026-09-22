import "server-only";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { getDatabaseConnection } from "./mysql-config";

const createPrismaClient = () => {
  const connection = getDatabaseConnection();

  return new PrismaClient({
    adapter: new PrismaMariaDb(
      connection.kind === "mysql-config" ? connection.config : connection.url,
    ),
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
