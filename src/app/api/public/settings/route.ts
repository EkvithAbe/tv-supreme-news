import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { siteSettingKeys } from "@/lib/data/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const keys = {
  theme: "site_theme",
  primaryColor: "primary_color",
  logoUrl: siteSettingKeys.logoUrl,
} as const;

type PublicThemeMode = "Light" | "Dark" | "System";

const defaults = {
  theme: "System" as PublicThemeMode,
  primaryColor: "#EC008C",
  logoUrl: "/logo.png",
};

function parseTheme(value: string | undefined): PublicThemeMode {
  if (value === "Light" || value === "Dark" || value === "System") {
    return value;
  }

  return defaults.theme;
}

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: Object.values(keys),
        },
      },
      select: {
        key: true,
        value: true,
      },
    });

    const values = new Map(
      rows.map((row) => [row.key, row.value])
    );

    return NextResponse.json(
      {
        success: true,
        settings: {
          theme: parseTheme(values.get(keys.theme)),
          primaryColor:
            values.get(keys.primaryColor) ||
            defaults.primaryColor,
          logoUrl:
            values.get(keys.logoUrl) ||
            defaults.logoUrl,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET /api/public/settings failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load public site settings.",
      },
      { status: 500 }
    );
  }
}
