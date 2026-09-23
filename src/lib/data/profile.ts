import "server-only";

import {
  ProfileChangeRequestStatus,
  ProfileChangeRequestType,
  UserRole,
} from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/data/activity";
import {
  hashPassword,
  updateUser,
} from "@/lib/data/users";

export type ProfileDetailsInput = {
  name?: string;
  phone?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
  profileImageId?: string | null;
  email?: string;
  password?: string;
};

function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

function cleanOptionalText(value?: string | null) {
  return value?.trim() || null;
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      jobTitle: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      profileImage: {
        select: {
          id: true,
          filename: true,
          url: true,
          altText: true,
        },
      },
      changeRequests: {
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
        select: {
          id: true,
          type: true,
          requestedEmail: true,
          status: true,
          reviewNote: true,
          createdAt: true,
          reviewedAt: true,
        },
      },
      activityLogs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        select: {
          id: true,
          action: true,
          resourceType: true,
          resourceId: true,
          summary: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

export async function updateOwnProfile(
  userId: string,
  role: UserRole,
  input: ProfileDetailsInput,
) {
  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      phone: true,
      jobTitle: true,
      bio: true,
      profileImageId: true,
    },
  });

  if (!current) {
    throw new Error("User not found.");
  }

  const user = await updateUser(userId, {
    ...(input.name !== undefined
      ? { name: input.name }
      : {}),
    ...(input.phone !== undefined
      ? { phone: cleanOptionalText(input.phone) }
      : {}),
    ...(input.jobTitle !== undefined
      ? { jobTitle: cleanOptionalText(input.jobTitle) }
      : {}),
    ...(input.bio !== undefined
      ? { bio: cleanOptionalText(input.bio) }
      : {}),
    ...(input.profileImageId !== undefined
      ? { profileImageId: input.profileImageId }
      : {}),
    ...(role === UserRole.ADMIN && input.email !== undefined
      ? { email: input.email }
      : {}),
    ...(role === UserRole.ADMIN && input.password
      ? { password: input.password }
      : {}),
  });

  await recordActivity({
    actorId: userId,
    action: "PROFILE_UPDATED",
    resourceType: "PROFILE",
    resourceId: userId,
    summary: "Updated own profile details.",
  });

  return user;
}

export async function requestProfileCredentialChange(
  userId: string,
  type: "EMAIL" | "PASSWORD",
  value: string,
) {
  if (type === "EMAIL") {
    const email = normaliseEmail(value);

    if (!email || !email.includes("@")) {
      throw new Error("Enter a valid new email address.");
    }

    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
      select: { id: true },
    });

    if (existing) {
      throw new Error("That email address is already in use.");
    }

    const request = await prisma.profileChangeRequest.create({
      data: {
        userId,
        type: ProfileChangeRequestType.EMAIL,
        requestedEmail: email,
      },
    });

    await recordActivity({
      actorId: userId,
      action: "EMAIL_CHANGE_REQUESTED",
      resourceType: "PROFILE_CHANGE_REQUEST",
      resourceId: request.id,
      summary: "Requested an email address change.",
      notifyAdmins: {
        kind: "PROFILE_CHANGE_REQUEST",
        title: "Editor email change request",
        message: "An editor requested an email address change.",
        href: "/admin/profile",
      },
    });

    return request;
  }

  if (value.length < 8) {
    throw new Error("New password must contain at least 8 characters.");
  }

  const request = await prisma.profileChangeRequest.create({
    data: {
      userId,
      type: ProfileChangeRequestType.PASSWORD,
      requestedPasswordHash: await hashPassword(value),
    },
  });

  await recordActivity({
    actorId: userId,
    action: "PASSWORD_CHANGE_REQUESTED",
    resourceType: "PROFILE_CHANGE_REQUEST",
    resourceId: request.id,
    summary: "Requested a password change.",
    notifyAdmins: {
      kind: "PROFILE_CHANGE_REQUEST",
      title: "Editor password change request",
      message: "An editor requested a password change.",
      href: "/admin/profile",
    },
  });

  return request;
}

export async function getPendingProfileChangeRequests() {
  return prisma.profileChangeRequest.findMany({
    where: {
      status: ProfileChangeRequestStatus.PENDING,
      user: {
        role: UserRole.EDITOR,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function reviewProfileChangeRequest(
  requestId: string,
  adminId: string,
  decision: "APPROVE" | "REJECT",
  reviewNote?: string,
) {
  const request = await prisma.profileChangeRequest.findUnique({
    where: { id: requestId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!request) {
    throw new Error("Profile change request not found.");
  }

  if (request.status !== ProfileChangeRequestStatus.PENDING) {
    throw new Error("This profile change request has already been reviewed.");
  }

  if (request.user.role !== UserRole.EDITOR) {
    throw new Error("Only editor requests can be reviewed here.");
  }

  const approved = decision === "APPROVE";

  await prisma.$transaction(async (transaction) => {
    if (approved && request.type === ProfileChangeRequestType.EMAIL) {
      const email = request.requestedEmail;

      if (!email) {
        throw new Error("Requested email is missing.");
      }

      const duplicate = await transaction.user.findFirst({
        where: {
          email,
          NOT: { id: request.userId },
        },
        select: { id: true },
      });

      if (duplicate) {
        throw new Error("That email address is now in use.");
      }

      await transaction.user.update({
        where: { id: request.userId },
        data: { email },
      });
    }

    if (approved && request.type === ProfileChangeRequestType.PASSWORD) {
      if (!request.requestedPasswordHash) {
        throw new Error("Requested password is missing.");
      }

      await transaction.user.update({
        where: { id: request.userId },
        data: {
          passwordHash: request.requestedPasswordHash,
        },
      });

      await transaction.session.deleteMany({
        where: { userId: request.userId },
      });
    }

    await transaction.profileChangeRequest.update({
      where: { id: requestId },
      data: {
        status: approved
          ? ProfileChangeRequestStatus.APPROVED
          : ProfileChangeRequestStatus.REJECTED,
        reviewedById: adminId,
        reviewedAt: new Date(),
        reviewNote: cleanOptionalText(reviewNote),
      },
    });
  });

  const typeLabel =
    request.type === ProfileChangeRequestType.EMAIL
      ? "email address"
      : "password";

  await recordActivity({
    actorId: adminId,
    action: approved
      ? "PROFILE_CHANGE_APPROVED"
      : "PROFILE_CHANGE_REJECTED",
    resourceType: "PROFILE_CHANGE_REQUEST",
    resourceId: request.id,
    summary: `${approved ? "Approved" : "Rejected"} ${request.user.name}'s ${typeLabel} change request.`,
    notifyUser: {
      userId: request.userId,
      notification: {
        kind: "PROFILE_CHANGE_REVIEWED",
        title: `Your ${typeLabel} change was ${approved ? "approved" : "rejected"}`,
        message: reviewNote?.trim() || "Open your profile to view the request status.",
        href: "/admin/profile",
      },
    },
  });
}
