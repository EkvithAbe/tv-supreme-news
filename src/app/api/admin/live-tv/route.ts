import { NextResponse } from "next/server";

import {
  getLiveTVSettings,
  saveLiveTVSettings,
  setLiveStatus,
  setLiveTVEnabled,
  type LiveStreamTypeValue,
} from "@/lib/data/live-tv";

export const runtime = "nodejs";

const validStreamTypes = ["HLS", "MP4", "EMBED", "OTHER"] as const;

function isValidStreamType(
  value: string,
): value is LiveStreamTypeValue {
  return validStreamTypes.includes(
    value as LiveStreamTypeValue,
  );
}

function parseBoolean(
  value: unknown,
  defaultValue = false,
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  return defaultValue;
}

/* ============================================================
   GET
   Load current Live TV configuration
============================================================ */

export async function GET() {
  try {
    const settings = await getLiveTVSettings();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("GET /api/admin/live-tv error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Live TV settings.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
   POST
   Create or save Live TV configuration
============================================================ */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      channelName,
      streamUrl,
      streamType,
      isLive,
      isEnabled,
      playerTitle,
      fallbackUrl,
      autoPlay,
      showChat,
    } = body;

    if (
      typeof channelName !== "string" ||
      !channelName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel name is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof streamUrl !== "string" ||
      !streamUrl.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Stream URL is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof streamType !== "string" ||
      !isValidStreamType(streamType)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid stream type.",
        },
        { status: 400 },
      );
    }

    const settings = await saveLiveTVSettings({
      channelName: channelName.trim(),
      streamUrl: streamUrl.trim(),
      streamType,
      isLive: parseBoolean(isLive, false),
      isEnabled: parseBoolean(isEnabled, true),
      playerTitle:
        typeof playerTitle === "string"
          ? playerTitle
          : "TV SUPREME Live",
      fallbackUrl:
        typeof fallbackUrl === "string"
          ? fallbackUrl
          : "",
      autoPlay: parseBoolean(autoPlay, true),
      showChat: parseBoolean(showChat, false),
    });

    return NextResponse.json(
      {
        success: true,
        settings,
        message: "Live TV settings saved successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/live-tv error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save Live TV settings.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
   PUT
   Update Live TV configuration
============================================================ */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      channelName,
      streamUrl,
      streamType,
      isLive,
      isEnabled,
      playerTitle,
      fallbackUrl,
      autoPlay,
      showChat,
    } = body;

    if (
      typeof channelName !== "string" ||
      !channelName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel name is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof streamUrl !== "string" ||
      !streamUrl.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Stream URL is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof streamType !== "string" ||
      !isValidStreamType(streamType)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid stream type.",
        },
        { status: 400 },
      );
    }

    const settings = await saveLiveTVSettings({
      channelName: channelName.trim(),
      streamUrl: streamUrl.trim(),
      streamType,
      isLive: parseBoolean(isLive, false),
      isEnabled: parseBoolean(isEnabled, true),
      playerTitle:
        typeof playerTitle === "string"
          ? playerTitle
          : "TV SUPREME Live",
      fallbackUrl:
        typeof fallbackUrl === "string"
          ? fallbackUrl
          : "",
      autoPlay: parseBoolean(autoPlay, true),
      showChat: parseBoolean(showChat, false),
    });

    return NextResponse.json({
      success: true,
      settings,
      message: "Live TV settings updated successfully.",
    });
  } catch (error) {
    console.error("PUT /api/admin/live-tv error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Live TV settings.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
   PATCH
   Update live status or enabled status
============================================================ */

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { action, isLive, isEnabled } = body;

    if (action === "LIVE") {
      const settings = await setLiveStatus(true);

      return NextResponse.json({
        success: true,
        settings,
        message: "Broadcast started.",
      });
    }

    if (action === "OFFLINE") {
      const settings = await setLiveStatus(false);

      return NextResponse.json({
        success: true,
        settings,
        message: "Broadcast ended.",
      });
    }

    if (action === "SET_LIVE") {
      const settings = await setLiveStatus(
        parseBoolean(isLive, false),
      );

      return NextResponse.json({
        success: true,
        settings,
        message: `Broadcast status changed to ${
          settings.isLive ? "LIVE" : "OFFLINE"
        }.`,
      });
    }

    if (action === "ENABLE") {
      const settings = await setLiveTVEnabled(true);

      return NextResponse.json({
        success: true,
        settings,
        message: "Live TV enabled.",
      });
    }

    if (action === "DISABLE") {
      const settings = await setLiveTVEnabled(false);

      return NextResponse.json({
        success: true,
        settings,
        message: "Live TV disabled.",
      });
    }

    if (action === "SET_ENABLED") {
      const settings = await setLiveTVEnabled(
        parseBoolean(isEnabled, true),
      );

      return NextResponse.json({
        success: true,
        settings,
        message: `Live TV ${
          settings.isEnabled ? "enabled" : "disabled"
        }.`,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid action. Use LIVE, OFFLINE, SET_LIVE, ENABLE, DISABLE or SET_ENABLED.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("PATCH /api/admin/live-tv error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Live TV status.",
      },
      { status: 500 },
    );
  }
}