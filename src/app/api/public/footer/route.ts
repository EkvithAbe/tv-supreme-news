// src/app/api/public/footer/route.ts

import { NextResponse } from "next/server";

import {
  getFooterForLanguage,
  footerLanguages,
  type FooterLanguage,
} from "@/lib/data/footer";

export const dynamic = "force-dynamic";

/* =========================================================
   LANGUAGE VALIDATION
========================================================= */

function isSupportedLanguage(
  value: string,
): value is FooterLanguage {
  return footerLanguages.includes(
    value as FooterLanguage,
  );
}

/* =========================================================
   GET PUBLIC FOOTER
========================================================= */

export async function GET(
  request: Request,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const requestedLanguage =
      searchParams
        .get("language")
        ?.toUpperCase() || "EN";

    const language: FooterLanguage =
      isSupportedLanguage(
        requestedLanguage,
      )
        ? requestedLanguage
        : "EN";

    /*
     * Load only the public footer data
     * needed by Footer.tsx.
     */
    const footer =
      await getFooterForLanguage(
        language,
      );

    return NextResponse.json(
      {
        success: true,
        language,
        footer,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "GET /api/public/footer failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load footer configuration.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }
}