import { NextResponse } from "next/server";

import {
  createSession,
  setSessionCookie,
} from "@/lib/auth";
import { verifyPassword } from "@/lib/data/users";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type AttemptRecord = {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
};

// In-memory sliding window rate limiter
const loginAttempts = new Map<string, AttemptRecord>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "client"
  );
}

function checkRateLimit(key: string): { isLocked: boolean; remainingSeconds: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { isLocked: false, remainingSeconds: 0 };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  if (now - record.lastAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.delete(key);
    return { isLocked: false, remainingSeconds: 0 };
  }

  return { isLocked: false, remainingSeconds: 0 };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, lastAttempt: now };

  if (now - record.lastAttempt > LOCKOUT_WINDOW_MS) {
    record.count = 0;
  }

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
  }

  loginAttempts.set(key, record);
}

function clearRateLimit(key: string) {
  loginAttempts.delete(key);
}

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
 * Verifies the existing CMS user's scrypt password with anti-brute-force rate limiting
 * and sets an opaque, HttpOnly database-session cookie.
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

  const clientIp = getClientIp(request);
  const ipKey = `ip:${clientIp}`;
  const emailKey = `email:${email}`;

  const ipLimit = checkRateLimit(ipKey);
  const emailLimit = checkRateLimit(emailKey);

  if (ipLimit.isLocked || emailLimit.isLocked) {
    const seconds = Math.max(ipLimit.remainingSeconds, emailLimit.remainingSeconds);
    const minutes = Math.max(1, Math.ceil(seconds / 60));
    return NextResponse.json(
      {
        success: false,
        error: `Too many failed sign-in attempts. Please try again in ${minutes} minute(s).`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(seconds),
        },
      },
    );
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

    const isMatch = user
      ? await verifyPassword(
          password,
          user.passwordHash,
        )
      : false;

    if (!user || !isMatch) {
      recordFailedAttempt(ipKey);
      recordFailedAttempt(emailKey);
      return invalidCredentialsResponse();
    }

    // Clear failed attempts upon successful login
    clearRateLimit(ipKey);
    clearRateLimit(emailKey);

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
