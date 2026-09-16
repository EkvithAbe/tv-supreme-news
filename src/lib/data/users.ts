import "server-only";

import {
  createHash,
  randomBytes,
  scryptSync,
} from "node:crypto";

import { prisma } from "@/lib/prisma";
import {
  UserRole,
} from "../../../generated/prisma/client";

export type CmsUserRole =
  | "ADMIN"
  | "EDITOR"
  | "JOURNALIST"
  | "VIDEO_EDITOR"
  | "PHOTOGRAPHER";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: CmsUserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: CmsUserRole;
}

function getRoleEnum(
  role: CmsUserRole,
): UserRole {
  return UserRole[role];
}

function normalizeEmail(
  email: string,
): string {
  return email.trim().toLowerCase();
}

function normalizeName(
  name: string,
): string {
  return name.trim();
}

/**
 * Hash a password with Node.js scrypt.
 *
 * Format:
 * scrypt:salt:hash
 */
function hashPassword(
  password: string,
): string {
  const salt =
    randomBytes(16).toString("hex");

  const hash = scryptSync(
    password,
    salt,
    64,
  ).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

/**
 * Hash used for a password comparison.
 */
function hashPasswordWithSalt(
  password: string,
  salt: string,
): string {
  return scryptSync(
    password,
    salt,
    64,
  ).toString("hex");
}

/**
 * Verify a plain password against
 * the stored scrypt value.
 */
export function verifyPassword(
  password: string,
  storedHash: string,
): boolean {
  const parts =
    storedHash.split(":");

  if (
    parts.length !== 3 ||
    parts[0] !== "scrypt"
  ) {
    return false;
  }

  const salt = parts[1];
  const expectedHash = parts[2];

  const actualHash =
    hashPasswordWithSalt(
      password,
      salt,
    );

  return createHash("sha256")
    .update(actualHash)
    .digest("hex") ===
    createHash("sha256")
      .update(expectedHash)
      .digest("hex");
}

/**
 * Public user object.
 *
 * NEVER return passwordHash to the browser.
 */
function publicUser(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    articles: number;
  };
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    articleCount:
      user._count?.articles ?? 0,
  };
}

/**
 * Get all CMS users.
 */
export async function getUsers() {
  const users =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

  return users.map(publicUser);
}

/**
 * Get users who can be selected
 * as article authors.
 */
export async function getArticleAuthors() {
  const users =
    await prisma.user.findMany({
      where: {
        role: {
          in: [
            UserRole.ADMIN,
            UserRole.EDITOR,
            UserRole.JOURNALIST,
          ],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

  return users;
}

/**
 * Get one user by ID.
 */
export async function getUserById(
  id: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

  if (!user) {
    return null;
  }

  return publicUser(user);
}

/**
 * Create a new CMS user.
 */
export async function createUser(
  input: CreateUserInput,
) {
  const name =
    normalizeName(input.name);

  const email =
    normalizeEmail(input.email);

  const password =
    input.password;

  const role =
    input.role ?? "JOURNALIST";

  if (!name) {
    throw new Error(
      "User name is required.",
    );
  }

  if (!email) {
    throw new Error(
      "Email address is required.",
    );
  }

  if (!email.includes("@")) {
    throw new Error(
      "Please enter a valid email address.",
    );
  }

  if (
    password.length < 8
  ) {
    throw new Error(
      "Password must contain at least 8 characters.",
    );
  }

  const existing =
    await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

  if (existing) {
    throw new Error(
      "A user with this email address already exists.",
    );
  }

  const passwordHash =
    hashPassword(password);

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role:
          getRoleEnum(role),
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

  return publicUser(user);
}

/**
 * Update a CMS user.
 */
export async function updateUser(
  id: string,
  input: UpdateUserInput,
) {
  const existing =
    await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
      },
    });

  if (!existing) {
    throw new Error(
      "User not found.",
    );
  }

  const data: {
    name?: string;
    email?: string;
    passwordHash?: string;
    role?: UserRole;
  } = {};

  if (
    input.name !== undefined
  ) {
    const name =
      normalizeName(input.name);

    if (!name) {
      throw new Error(
        "User name is required.",
      );
    }

    data.name = name;
  }

  if (
    input.email !== undefined
  ) {
    const email =
      normalizeEmail(input.email);

    if (!email.includes("@")) {
      throw new Error(
        "Please enter a valid email address.",
      );
    }

    const duplicate =
      await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      });

    if (duplicate) {
      throw new Error(
        "A user with this email address already exists.",
      );
    }

    data.email = email;
  }

  if (
    input.password !== undefined &&
    input.password !== ""
  ) {
    if (
      input.password.length < 8
    ) {
      throw new Error(
        "Password must contain at least 8 characters.",
      );
    }

    data.passwordHash =
      hashPassword(
        input.password,
      );
  }

  if (
    input.role !== undefined
  ) {
    data.role =
      getRoleEnum(input.role);
  }

  const user =
    await prisma.user.update({
      where: {
        id,
      },
      data,
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

  return publicUser(user);
}

/**
 * Delete a CMS user.
 *
 * We prevent deletion when the user
 * has authored articles because
 * Article.authorId is required.
 */
export async function deleteUser(
  id: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

  if (!user) {
    throw new Error(
      "User not found.",
    );
  }

  if (user._count.articles > 0) {
    throw new Error(
      "This user cannot be deleted because they have authored articles.",
    );
  }

  return prisma.user.delete({
    where: {
      id,
    },
  });
}