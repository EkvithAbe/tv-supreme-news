import "server-only";

import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/data/activity";

type PublishedItem = {
  id: string;
  title: string;
  authorId?: string;
};

export type ScheduledPublishingResult = {
  publishedArticles: PublishedItem[];
  publishedVideos: PublishedItem[];
  processedAt: Date;
};

/**
 * Publishes only items whose scheduled timestamp has passed. Every row is
 * conditionally updated, so concurrent cron invocations cannot publish an
 * item twice or create duplicate activity records.
 */
export async function publishDueScheduledContent(): Promise<ScheduledPublishingResult> {
  const processedAt = new Date();

  const [dueArticles, dueVideos] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: processedAt,
        },
      },
      select: {
        id: true,
        authorId: true,
        translations: {
          where: {
            language: "EN",
          },
          select: {
            title: true,
          },
          take: 1,
        },
      },
      take: 100,
    }),
    prisma.video.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: processedAt,
        },
      },
      select: {
        id: true,
        title: true,
      },
      take: 100,
    }),
  ]);

  const publishedArticles: PublishedItem[] = [];
  const publishedVideos: PublishedItem[] = [];

  for (const article of dueArticles) {
    const update = await prisma.article.updateMany({
      where: {
        id: article.id,
        status: "SCHEDULED",
        scheduledAt: {
          lte: processedAt,
        },
      },
      data: {
        status: "PUBLISHED",
        publishedAt: processedAt,
        scheduledAt: null,
      },
    });

    if (update.count === 0) {
      continue;
    }

    const title =
      article.translations[0]?.title ||
      "Scheduled article";

    publishedArticles.push({
      id: article.id,
      title,
      authorId: article.authorId,
    });

    await recordActivity({
      actorId: article.authorId,
      action: "ARTICLE_PUBLISHED_SCHEDULED",
      resourceType: "ARTICLE",
      resourceId: article.id,
      summary: `Scheduled article published: ${title}`,
      notifyAdmins: {
        kind: "SCHEDULED_ARTICLE_PUBLISHED",
        title: "Scheduled article published",
        message: title,
        href: `/admin/news/edit/${article.id}`,
      },
      notifyUser: {
        userId: article.authorId,
        notification: {
          kind: "SCHEDULED_ARTICLE_PUBLISHED",
          title: "Your scheduled article is live",
          message: title,
          href: `/admin/news/edit/${article.id}`,
        },
      },
    });
  }

  for (const video of dueVideos) {
    const update = await prisma.video.updateMany({
      where: {
        id: video.id,
        status: "SCHEDULED",
        scheduledAt: {
          lte: processedAt,
        },
      },
      data: {
        status: "PUBLISHED",
        publishedAt: processedAt,
        scheduledAt: null,
      },
    });

    if (update.count === 0) {
      continue;
    }

    publishedVideos.push({
      id: video.id,
      title: video.title,
    });
  }

  return {
    publishedArticles,
    publishedVideos,
    processedAt,
  };
}
