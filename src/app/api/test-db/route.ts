import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
