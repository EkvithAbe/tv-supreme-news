import { NextResponse } from "next/server";

import { publishDueScheduledContent } from "@/lib/data/scheduled-publishing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasValidCronSecret(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  return authorization === `Bearer ${cronSecret}`;
}

/**
 * Call this endpoint once per minute from the production hosting cron service.
 * It intentionally has no cookie-based admin bypass: a private CRON_SECRET is
 * required on every request.
 */
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      {
        success: false,
        error: "CRON_SECRET is not configured.",
      },
      { status: 503 },
    );
  }

  if (!hasValidCronSecret(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized cron request.",
      },
      { status: 401 },
    );
  }

  try {
    const result = await publishDueScheduledContent();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Scheduled publishing cron failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to publish scheduled content.",
      },
      { status: 500 },
    );
  }
}
