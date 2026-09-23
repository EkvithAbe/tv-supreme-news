// src/app/api/public/header/route.ts

import { NextResponse } from "next/server";

import {
  getPublicMenuItems,
  supportedMenuLanguages,
  type MenuLanguage,
} from "@/lib/data/menu";

import { getSiteConfig } from "@/lib/data/site-config";

export const dynamic = "force-dynamic";

function isSupportedLanguage(
  value: string
): value is MenuLanguage {
  return supportedMenuLanguages.includes(
    value as MenuLanguage
  );
}

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const requestedLanguage =
      searchParams
        .get("language")
        ?.toUpperCase() || "EN";

    const language: MenuLanguage =
      isSupportedLanguage(
        requestedLanguage
      )
        ? requestedLanguage
        : "EN";

    const [
      menuItems,
      siteConfig,
    ] = await Promise.all([
      getPublicMenuItems(language),
      getSiteConfig(),
    ]);

    const visibleMenuItems =
      menuItems
        .filter(
          (item) => item.isVisible
        )
        .sort(
          (a, b) =>
            a.position - b.position
        );

    return NextResponse.json(
      {
        success: true,
        language,
        menu: visibleMenuItems,
        site: siteConfig,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET /api/public/header failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load header configuration.",
      },
      {
        status: 500,
      }
    );
  }
}
