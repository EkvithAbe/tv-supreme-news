import dotenv from "dotenv";
dotenv.config();
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const config = {
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  database: process.env.MYSQL_DATABASE || "supremenews",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD ?? "",
};

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(config),
});

const STREAM_URL = "https://player.castr.com/live_3b18e370d0f011efa5904f4336ecbf7e";

async function main() {
  console.log("Setting Live TV URL:", STREAM_URL);

  const existingStream = await prisma.liveStream.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  let stream;
  if (existingStream) {
    stream = await prisma.liveStream.update({
      where: { id: existingStream.id },
      data: {
        channelName: "TV SUPREME",
        streamUrl: STREAM_URL,
        streamType: "EMBED",
        isLive: true,
        isEnabled: true,
      },
    });
    console.log("Updated existing LiveStream record:", stream);
  } else {
    stream = await prisma.liveStream.create({
      data: {
        channelName: "TV SUPREME",
        streamUrl: STREAM_URL,
        streamType: "EMBED",
        isLive: true,
        isEnabled: true,
      },
    });
    console.log("Created new LiveStream record:", stream);
  }

  // Update site settings
  const settingsToUpsert = [
    { key: "live_tv_player_title", value: "TV SUPREME Live" },
    { key: "live_tv_fallback_url", value: "" },
    { key: "live_tv_autoplay", value: "true" },
    { key: "live_tv_show_chat", value: "false" },
  ];

  for (const s of settingsToUpsert) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  console.log("Live TV settings saved successfully!");
}

main()
  .catch((e) => {
    console.error("Error setting Live TV:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
