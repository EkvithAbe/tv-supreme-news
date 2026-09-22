export type MysqlPoolConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

type DatabaseConnection =
  | { kind: "mysql-config"; config: MysqlPoolConfig }
  | { kind: "legacy-url"; url: string };

const mysqlEnvironmentKeys = [
  "MYSQL_HOST",
  "MYSQL_PORT",
  "MYSQL_DATABASE",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
] as const;

function optionalEnvironmentValue(name: string) {
  return process.env[name]?.trim();
}

function requiredEnvironmentValue(name: string) {
  const value = optionalEnvironmentValue(name);

  if (!value) {
    throw new Error(`${name} is required for the MySQL connection.`);
  }

  return value;
}

function hasIndividualMysqlConfiguration() {
  return mysqlEnvironmentKeys.some((name) => process.env[name] !== undefined);
}

/**
 * Returns the readable MySQL environment configuration, if it has been set.
 * An empty MYSQL_PASSWORD is allowed for local MySQL installations that use no
 * password, but host, database, and user are always required.
 */
export function getMysqlPoolConfig(): MysqlPoolConfig | null {
  if (!hasIndividualMysqlConfiguration()) {
    return null;
  }

  const rawPort = optionalEnvironmentValue("MYSQL_PORT") || "3306";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("MYSQL_PORT must be a number between 1 and 65535.");
  }

  return {
    host: requiredEnvironmentValue("MYSQL_HOST"),
    port,
    database: requiredEnvironmentValue("MYSQL_DATABASE"),
    user: requiredEnvironmentValue("MYSQL_USER"),
    password: process.env.MYSQL_PASSWORD ?? "",
  };
}

/** Creates a Prisma CLI connection string in memory; it is never stored in .env. */
export function createMysqlDatabaseUrl(config: MysqlPoolConfig) {
  const url = new URL("mysql://localhost");
  url.hostname = config.host;
  url.port = String(config.port);
  url.username = config.user;
  url.password = config.password;
  url.pathname = `/${encodeURIComponent(config.database)}`;

  return url.toString();
}

/**
 * DATABASE_URL is retained only as a temporary fallback for an existing local
 * setup. New installations should use the separate MYSQL_* fields instead.
 */
export function getDatabaseConnection(): DatabaseConnection {
  const mysqlConfig = getMysqlPoolConfig();

  if (mysqlConfig) {
    return { kind: "mysql-config", config: mysqlConfig };
  }

  const legacyUrl = optionalEnvironmentValue("DATABASE_URL");

  if (legacyUrl) {
    return { kind: "legacy-url", url: legacyUrl };
  }

  throw new Error(
    "MySQL is not configured. Add MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD to .env.",
  );
}
