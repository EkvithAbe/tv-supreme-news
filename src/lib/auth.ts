import "server-only";

import {
  createHash,
  randomBytes,
} from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { UserRole } from "../../generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const AUTH_SESSION_COOKIE =
  "tv_supreme_session";

const SESSION_DURATION_MS =
  7 * 24 * 60 * 60 * 1000;

const SESSION_DURATION_SECONDS =
  SESSION_DURATION_MS / 1000;

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: {
    id: string;
    url: string;
    altText: string | null;
  } | null;
};

type SessionDetails = {
  token: string;
  expiresAt: Date;
};

type ApiAccessResult =
  | {
      user: AuthenticatedUser;
      response?: never;
    }
  | {
      user?: never;
      response: NextResponse;
    };

function hashSessionToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function getSessionCookieOptions(
  expiresAt?: Date,
) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure:
      process.env.NODE_ENV ===
      "production",
    path: "/",
    ...(expiresAt
      ? {
          expires: expiresAt,
          maxAge:
            SESSION_DURATION_SECONDS,
        }
      : {
          maxAge: 0,
        }),
  };
}

/**
 * Creates an opaque session token. Only its SHA-256 hash
 * is stored in MySQL; the raw value lives in an HttpOnly cookie.
 */
export async function createSession(
  userId: string,
): Promise<SessionDetails> {
  const token = randomBytes(32).toString(
    "base64url",
  );

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_MS,
  );

  await prisma.$transaction([
    prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    }),
    prisma.session.create({
      data: {
        tokenHash: hashSessionToken(token),
        userId,
        expiresAt,
      },
    }),
  ]);

  return {
    token,
    expiresAt,
  };
}

export function setSessionCookie(
  response: NextResponse,
  session: SessionDetails,
) {
  response.cookies.set(
    AUTH_SESSION_COOKIE,
    session.token,
    getSessionCookieOptions(
      session.expiresAt,
    ),
  );
}

export function clearSessionCookie(
  response: NextResponse,
) {
  response.cookies.set(
    AUTH_SESSION_COOKIE,
    "",
    getSessionCookieOptions(),
  );
}

export async function revokeSession(
  token: string | undefined,
) {
  if (!token || token.length > 512) {
    return;
  }

  await prisma.session.deleteMany({
    where: {
      tokenHash: hashSessionToken(token),
    },
  });
}

/**
 * Returns the signed-in CMS user, if the request has a valid,
 * unexpired database session. Never return password hashes here.
 */
export async function getCurrentUser(): Promise<
  AuthenticatedUser | null
> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_SESSION_COOKIE,
  )?.value;

  if (!token || token.length > 512) {
    return null;
  }

  const session =
    await prisma.session.findUnique({
      where: {
        tokenHash: hashSessionToken(token),
      },
      select: {
        id: true,
        expiresAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profileImage: {
              select: {
                id: true,
                url: true,
                altText: true,
              },
            },
          },
        },
      },
    });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.deleteMany({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session.user;
}

/**
 * Route-handler guard. Keep this close to every API mutation or
 * sensitive read; page and navigation checks are not security checks.
 */
export async function requireApiAccess(
  allowedRoles: readonly UserRole[],
): Promise<ApiAccessResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      response: NextResponse.json(
        {
          success: false,
          error:
            "You must sign in to access the CMS.",
        },
        {
          status: 401,
        },
      ),
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      response: NextResponse.json(
        {
          success: false,
          error:
            "You do not have permission to perform this action.",
        },
        {
          status: 403,
        },
      ),
    };
  }

  return {
    user,
  };
}

export function isAdmin(
  user: AuthenticatedUser,
) {
  return user.role === UserRole.ADMIN;
}

export function requireAdminApiAccess() {
  return requireApiAccess([
    UserRole.ADMIN,
  ]);
}

export function requireContentApiAccess() {
  return requireApiAccess([
    UserRole.ADMIN,
    UserRole.EDITOR,
  ]);
}

export async function requireCmsUserPage(): Promise<
  AuthenticatedUser
> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdminPage(): Promise<
  AuthenticatedUser
> {
  const user = await requireCmsUserPage();

  if (user.role !== UserRole.ADMIN) {
    redirect("/admin/news");
  }

  return user;
}
