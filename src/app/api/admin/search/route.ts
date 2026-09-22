import { NextResponse } from "next/server";

import { requireContentApiAccess } from "@/lib/auth";
import { searchAdminContent } from "@/lib/data/admin-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await requireContentApiAccess();

  if (access.response) return access.response;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return NextResponse.json({
      success: true,
      results: [],
    });
  }

  try {
    const results = await searchAdminContent(access.user, query.slice(0, 120));

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("GET /api/admin/search:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to search the CMS.",
      },
      { status: 500 },
    );
  }
}
