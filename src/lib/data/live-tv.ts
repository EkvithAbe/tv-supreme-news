import "server-only";

import { prisma } from "@/lib/prisma";

export type LiveStreamTypeValue = "HLS" | "MP4" | "EMBED" | "OTHER";

export interface LiveTVSettings {
  id: string;
  channelName: string;
  streamUrl: string;
  streamType: LiveStreamTypeValue;
  isLive: boolean;
  isEnabled: boolean;
  playerTitle: string;
  fallbackUrl: string;
  autoPlay: boolean;
  showChat: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SETTING_KEYS = {
  PLAYER_TITLE: "live_tv_player_title",
  FALLBACK_URL: "live_tv_fallback_url",
  AUTOPLAY: "live_tv_autoplay",
  SHOW_CHAT: "live_tv_show_chat",
} as const;

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) {
    return fallback;
  }

  return value === "true";
}

function mapStreamType(
  value: string,
): LiveStreamTypeValue {
  switch (value) {
    case "HLS":
      return "HLS";

    case "MP4":
      return "MP4";

    case "EMBED":
      return "EMBED";

    case "OTHER":
      return "OTHER";

    default:
      return "HLS";
  }
}

async function getSettingsMap(): Promise<Map<string, string>> {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          SETTING_KEYS.PLAYER_TITLE,
          SETTING_KEYS.FALLBACK_URL,
          SETTING_KEYS.AUTOPLAY,
          SETTING_KEYS.SHOW_CHAT,
        ],
      },
    },
  });

  return new Map(settings.map((setting) => [setting.key, setting.value]));
}

async function getActiveOrLatestStream() {
  const stream = await prisma.liveStream.findFirst({
    where: {
      isEnabled: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (stream) {
    return stream;
  }

  return prisma.liveStream.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getLiveTVSettings(): Promise<LiveTVSettings | null> {
  const [stream, settings] = await Promise.all([
    getActiveOrLatestStream(),
    getSettingsMap(),
  ]);

  if (!stream) {
    return null;
  }

  return {
    id: stream.id,
    channelName: stream.channelName,
    streamUrl: stream.streamUrl,
    streamType: mapStreamType(stream.streamType),
    isLive: stream.isLive,
    isEnabled: stream.isEnabled,

    playerTitle:
      settings.get(SETTING_KEYS.PLAYER_TITLE) ??
      "TV SUPREME Live",

    fallbackUrl:
      settings.get(SETTING_KEYS.FALLBACK_URL) ??
      "",

    autoPlay: parseBoolean(
      settings.get(SETTING_KEYS.AUTOPLAY) ?? null,
      true,
    ),

    showChat: parseBoolean(
      settings.get(SETTING_KEYS.SHOW_CHAT) ?? null,
      false,
    ),

    createdAt: stream.createdAt,
    updatedAt: stream.updatedAt,
  };
}

export interface SaveLiveTVInput {
  channelName: string;
  streamUrl: string;
  streamType: LiveStreamTypeValue;
  isLive: boolean;
  isEnabled: boolean;
  playerTitle: string;
  fallbackUrl: string;
  autoPlay: boolean;
  showChat: boolean;
}

async function upsertSetting(
  key: string,
  value: string,
): Promise<void> {
  await prisma.siteSetting.upsert({
    where: {
      key,
    },
    update: {
      value,
    },
    create: {
      key,
      value,
    },
  });
}

export async function saveLiveTVSettings(
  input: SaveLiveTVInput,
): Promise<LiveTVSettings> {
  const streamType = mapStreamType(input.streamType);

  const existingStream = await prisma.liveStream.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  const stream = existingStream
    ? await prisma.liveStream.update({
        where: {
          id: existingStream.id,
        },
        data: {
          channelName: input.channelName.trim(),
          streamUrl: input.streamUrl.trim(),
          streamType,
          isLive: input.isLive,
          isEnabled: input.isEnabled,
        },
      })
    : await prisma.liveStream.create({
        data: {
          channelName: input.channelName.trim(),
          streamUrl: input.streamUrl.trim(),
          streamType,
          isLive: input.isLive,
          isEnabled: input.isEnabled,
        },
      });

  await Promise.all([
    upsertSetting(
      SETTING_KEYS.PLAYER_TITLE,
      input.playerTitle.trim() || "TV SUPREME Live",
    ),

    upsertSetting(
      SETTING_KEYS.FALLBACK_URL,
      input.fallbackUrl.trim(),
    ),

    upsertSetting(
      SETTING_KEYS.AUTOPLAY,
      String(input.autoPlay),
    ),

    upsertSetting(
      SETTING_KEYS.SHOW_CHAT,
      String(input.showChat),
    ),
  ]);

  const saved = await getLiveTVSettings();

  if (!saved) {
    throw new Error("Failed to load saved Live TV settings.");
  }

  return saved;
}

export async function setLiveStatus(
  isLive: boolean,
): Promise<LiveTVSettings> {
  const stream = await prisma.liveStream.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!stream) {
    throw new Error("No Live TV stream has been configured.");
  }

  await prisma.liveStream.update({
    where: {
      id: stream.id,
    },
    data: {
      isLive,
    },
  });

  const updated = await getLiveTVSettings();

  if (!updated) {
    throw new Error("Failed to load Live TV status.");
  }

  return updated;
}

export async function setLiveTVEnabled(
  isEnabled: boolean,
): Promise<LiveTVSettings> {
  const stream = await prisma.liveStream.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!stream) {
    throw new Error("No Live TV stream has been configured.");
  }

  await prisma.liveStream.update({
    where: {
      id: stream.id,
    },
    data: {
      isEnabled,
    },
  });

  const updated = await getLiveTVSettings();

  if (!updated) {
    throw new Error("Failed to load Live TV settings.");
  }

  return updated;
}

export async function deleteLiveTVSettings(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const streams = await tx.liveStream.findMany({
      select: {
        id: true,
      },
    });

    if (streams.length > 0) {
      await tx.liveStream.deleteMany({
        where: {
          id: {
            in: streams.map((stream) => stream.id),
          },
        },
      });
    }

    await tx.siteSetting.deleteMany({
      where: {
        key: {
          in: [
            SETTING_KEYS.PLAYER_TITLE,
            SETTING_KEYS.FALLBACK_URL,
            SETTING_KEYS.AUTOPLAY,
            SETTING_KEYS.SHOW_CHAT,
          ],
        },
      },
    });
  });
}