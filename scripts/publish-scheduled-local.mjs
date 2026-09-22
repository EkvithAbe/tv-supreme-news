import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const envPath = join(projectRoot, ".env");
const endpoint =
  "http://127.0.0.1:3000/api/cron/publish-scheduled";

function getEnvironmentValue(content, key) {
  const match = content.match(
    new RegExp(`^${key}=(.*)$`, "m"),
  );

  if (!match) {
    return "";
  }

  const value = match[1].trim();

  return value.startsWith('"') && value.endsWith('"')
    ? value.slice(1, -1)
    : value.startsWith("'") && value.endsWith("'")
      ? value.slice(1, -1)
      : value;
}

try {
  const envContent = await readFile(envPath, "utf8");
  const cronSecret = getEnvironmentValue(
    envContent,
    "CRON_SECRET",
  );

  if (!cronSecret) {
    throw new Error("CRON_SECRET is missing from the local .env file.");
  }

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Scheduler endpoint returned ${response.status}.`,
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error("Scheduler endpoint reported a failure.");
  }

  const articleCount = result.publishedArticles?.length ?? 0;
  const videoCount = result.publishedVideos?.length ?? 0;

  if (articleCount || videoCount) {
    console.log(
      `Published ${articleCount} article(s) and ${videoCount} video(s).`,
    );
  }
} catch (error) {
  const connectionRefused =
    error instanceof TypeError &&
    error.cause?.code === "ECONNREFUSED";

  // The local development server is expected to be offline sometimes.
  if (!connectionRefused) {
    console.error(
      error instanceof Error
        ? error.message
        : "Scheduled publishing failed.",
    );
    process.exitCode = 1;
  }
}
