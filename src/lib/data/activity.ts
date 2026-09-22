import "server-only";

import { prisma } from "@/lib/prisma";

type NotificationInput = {
  kind: string;
  title: string;
  message: string;
  href?: string;
};

type RecordActivityInput = {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  summary: string;
  notifyAdmins?: NotificationInput;
  notifyUser?: {
    userId: string;
    notification: NotificationInput;
  };
};

function toNotificationData(
  userId: string,
  notification: NotificationInput,
) {
  return {
    userId,
    kind: notification.kind,
    title: notification.title,
    message: notification.message,
    href: notification.href ?? null,
  };
}

/**
 * Records a CMS action. Editors can only read their own history; admin-only
 * screens can read editor history when managing that editor.
 */
export async function recordActivity(
  input: RecordActivityInput,
) {
  const activity = await prisma.activityLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      summary: input.summary,
    },
  });

  const notificationTasks: Promise<unknown>[] = [];

  if (input.notifyAdmins) {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    const recipientIds = admins
      .map((admin) => admin.id)
      .filter((id) => id !== input.actorId);

    if (recipientIds.length > 0) {
      notificationTasks.push(
        prisma.notification.createMany({
          data: recipientIds.map((userId) =>
            toNotificationData(
              userId,
              input.notifyAdmins as NotificationInput,
            ),
          ),
        }),
      );
    }
  }

  if (input.notifyUser) {
    notificationTasks.push(
      prisma.notification.create({
        data: toNotificationData(
          input.notifyUser.userId,
          input.notifyUser.notification,
        ),
      }),
    );
  }

  await Promise.all(notificationTasks);

  return activity;
}

export async function getActivityForUser(
  userId: string,
  take = 50,
) {
  return prisma.activityLog.findMany({
    where: {
      actorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: Math.min(Math.max(take, 1), 100),
    select: {
      id: true,
      action: true,
      resourceType: true,
      resourceId: true,
      summary: true,
      createdAt: true,
    },
  });
}

export async function getNotificationsForUser(
  userId: string,
  take = 20,
) {
  const [items, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(Math.max(take, 1), 50),
    }),
    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
  ]);

  return {
    items,
    unreadCount,
  };
}

export async function markNotificationsRead(
  userId: string,
  ids?: string[],
) {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
      ...(ids?.length
        ? {
            id: {
              in: ids,
            },
          }
        : {}),
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}
