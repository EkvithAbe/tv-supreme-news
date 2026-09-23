import "server-only";

import {
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

import { prisma } from "@/lib/prisma";
import {
  UserRole,
} from "../../../generated/prisma/client";

export type CmsUserRole =
  | "ADMIN"
  | "EDITOR";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: CmsUserRole;
  phone?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
  profileImageId?: string | null;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
  profileImageId?: string | null;
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
 * Hash a password with Node.js scrypt asynchronously.
 *
 * Format:
 * scrypt:salt:hash
 */
export async function hashPassword(
  password: string,
): Promise<string> {
  const salt =
    randomBytes(16).toString("hex");

  const hash = (await scryptAsync(
    password,
    salt,
    64,
  )) as Buffer;

  return `scrypt:${salt}:${hash.toString("hex")}`;
}

/**
 * Verify a plain password against
 * the stored scrypt value asynchronously.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
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

  try {
    const actualHash = (await scryptAsync(
      password,
      salt,
      64,
    )) as Buffer;

    const expected = Buffer.from(
      expectedHash,
      "hex",
    );

    if (
      actualHash.length === 0 ||
      actualHash.length !== expected.length
    ) {
      return false;
    }

    return timingSafeEqual(
      actualHash,
      expected,
    );
  } catch {
    return false;
  }
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
  phone?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
  profileImageId?: string | null;
  profileImage?: {
    id: string;
    filename: string;
    url: string;
    altText: string | null;
  } | null;
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
    phone: user.phone ?? null,
    jobTitle: user.jobTitle ?? null,
    bio: user.bio ?? null,
    profileImageId: user.profileImageId ?? null,
    profileImage: user.profileImage ?? null,
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
        profileImage: {
          select: {
            id: true,
            filename: true,
            url: true,
            altText: true,
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
        profileImage: {
          select: {
            id: true,
            filename: true,
            url: true,
            altText: true,
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
    input.role ?? "EDITOR";

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
    await hashPassword(password);

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role:
          getRoleEnum(role),
        phone:
          input.phone?.trim() ||
          null,
        jobTitle:
          input.jobTitle?.trim() ||
          null,
        bio:
          input.bio?.trim() ||
          null,
        profileImageId:
          input.profileImageId ||
          null,
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
        profileImage: {
          select: {
            id: true,
            filename: true,
            url: true,
            altText: true,
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
    phone?: string | null;
    jobTitle?: string | null;
    bio?: string | null;
    profileImageId?: string | null;
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
      await hashPassword(
        input.password,
      );
  }

  if (input.phone !== undefined) {
    data.phone = input.phone?.trim() || null;
  }

  if (input.jobTitle !== undefined) {
    data.jobTitle =
      input.jobTitle?.trim() || null;
  }

  if (input.bio !== undefined) {
    data.bio = input.bio?.trim() || null;
  }

  if (input.profileImageId !== undefined) {
    data.profileImageId =
      input.profileImageId || null;
  }

  const passwordWasChanged =
    data.passwordHash !== undefined;

  const user = await prisma.$transaction(
    async (transaction) => {
      const updated =
        await transaction.user.update({
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
            profileImage: {
              select: {
                id: true,
                filename: true,
                url: true,
                altText: true,
              },
            },
          },
        });

      if (passwordWasChanged) {
        await transaction.session.deleteMany({
          where: {
            userId: id,
          },
        });
      }

      return updated;
    },
  );

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
        profileImage: {
          select: {
            id: true,
            filename: true,
            url: true,
            altText: true,
          },
        },
      },
    });

  if (!user) {
    throw new Error(
      "User not found.",
    );
  }

  if (user.role === UserRole.ADMIN) {
    throw new Error(
      "The administrator account cannot be deleted.",
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
