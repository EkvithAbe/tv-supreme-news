import "server-only";

import { UserRole } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type AdminSearchResult = {
  id: string;
  type: "ARTICLE" | "VIDEO" | "CATEGORY" | "MEDIA" | "EDITOR" | "ACTIVITY";
  title: string;
  detail: string;
  href: string;
  createdAt: Date;
};

export async function searchAdminContent(
  user: {
    id: string;
    role: UserRole;
  },
  query: string,
) {
  const text = query.trim();

  if (!text) {
    return [] as AdminSearchResult[];
  }

  const [articleTranslations, videos] = await Promise.all([
    prisma.articleTranslation.findMany({
      where: {
        OR: [
          { title: { contains: text } },
          { summary: { contains: text } },
          { content: { contains: text } },
        ],
      },
      select: {
        article: {
          select: {
            id: true,
            slug: true,
            status: true,
            updatedAt: true,
          },
        },
        title: true,
      },
      take: 20,
      orderBy: {
        article: {
          updatedAt: "desc",
        },
      },
    }),
    prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: text } },
          { description: { contains: text } },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
      take: 20,
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  const contentResults: AdminSearchResult[] = [
    ...articleTranslations.map((translation) => ({
      id: `article-${translation.article.id}`,
      type: "ARTICLE" as const,
      title: translation.title,
      detail: `Article · ${translation.article.status}`,
      href: `/admin/news/edit/${translation.article.id}`,
      createdAt: translation.article.updatedAt,
    })),
    ...videos.map((video) => ({
      id: `video-${video.id}`,
      type: "VIDEO" as const,
      title: video.title,
      detail: `Video · ${video.status}`,
      href: "/admin/videos",
      createdAt: video.updatedAt,
    })),
  ];

  if (user.role !== UserRole.ADMIN) {
    return contentResults.sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
    );
  }

  const [categories, media, editors, activity] = await Promise.all([
    prisma.categoryTranslation.findMany({
      where: {
        OR: [
          { name: { contains: text } },
          { description: { contains: text } },
        ],
      },
      select: {
        category: {
          select: {
            id: true,
            slug: true,
            updatedAt: true,
          },
        },
        name: true,
      },
      take: 15,
      orderBy: {
        category: {
          updatedAt: "desc",
        },
      },
    }),
    prisma.media.findMany({
      where: {
        OR: [
          { filename: { contains: text } },
          { altText: { contains: text } },
        ],
      },
      select: {
        id: true,
        filename: true,
        updatedAt: true,
      },
      take: 15,
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.user.findMany({
      where: {
        role: UserRole.EDITOR,
        OR: [
          { name: { contains: text } },
          { email: { contains: text } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
      take: 15,
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.activityLog.findMany({
      where: {
        actor: {
          role: UserRole.EDITOR,
        },
        OR: [
          { summary: { contains: text } },
          { action: { contains: text } },
        ],
      },
      select: {
        id: true,
        summary: true,
        createdAt: true,
        actor: {
          select: {
            name: true,
          },
        },
      },
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return [
    ...contentResults,
    ...categories.map((category) => ({
      id: `category-${category.category.id}`,
      type: "CATEGORY" as const,
      title: category.name,
      detail: `Category · ${category.category.slug}`,
      href: "/admin/categories",
      createdAt: category.category.updatedAt,
    })),
    ...media.map((item) => ({
      id: `media-${item.id}`,
      type: "MEDIA" as const,
      title: item.filename,
      detail: "Media library",
      href: "/admin/media",
      createdAt: item.updatedAt,
    })),
    ...editors.map((editor) => ({
      id: `editor-${editor.id}`,
      type: "EDITOR" as const,
      title: editor.name,
      detail: editor.email,
      href: "/admin/users",
      createdAt: editor.updatedAt,
    })),
    ...activity.map((item) => ({
      id: `activity-${item.id}`,
      type: "ACTIVITY" as const,
      title: item.summary,
      detail: `Editor activity · ${item.actor.name}`,
      href: "/admin/users",
      createdAt: item.createdAt,
    })),
  ].sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}
