import { NextResponse } from "next/server";

import {
  createSession,
  setSessionCookie,
} from "@/lib/auth";
import { verifyPassword } from "@/lib/data/users";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function invalidCredentialsResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Incorrect email address or password.",
    },
    {
      status: 401,
    },
  );
}

/**
 * POST /api/auth/login
 *
 * Verifies the existing CMS user's scrypt password and sets an
 * opaque, HttpOnly database-session cookie.
 */
export async function POST(
  request: Request,
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Please enter your email address and password.",
      },
      {
        status: 400,
      },
    );
  }

  const email =
    body &&
    typeof body === "object" &&
    "email" in body &&
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    body &&
    typeof body === "object" &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";

  if (
    !email ||
    !password ||
    password.length > 1024
  ) {
    return invalidCredentialsResponse();
  }

  try {
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          passwordHash: true,
          role: true,
        },
      });

    if (
      !user ||
      !verifyPassword(
        password,
        user.passwordHash,
      )
    ) {
      return invalidCredentialsResponse();
    }

    const session = await createSession(
      user.id,
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    setSessionCookie(response, session);

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to sign in right now. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
