import "server-only";

import {
  Language,
  VideoStatus,
} from "../../../generated/prisma/client";

import { prisma } from "@/lib/prisma";

export type VideoLanguageValue =
  | "EN"
  | "SI"
  | "TA";

export type VideoStatusValue =
  | "DRAFT"
  | "REVIEW"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

export type VideoItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  language: VideoLanguageValue;
  status: VideoStatusValue;
  categoryId: string | null;
  categoryName: string | null;
  thumbnailId: string | null;
  thumbnailUrl: string | null;
  videoUrl: string;
  duration: number | null;
  views: number;
  isFeatured: boolean;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GetVideosOptions = {
  search?: string;
  status?: VideoStatusValue;
  categoryId?: string;
  language?: VideoLanguageValue;
  page?: number;
  pageSize?: number;
};

export type CreateVideoInput = {
  slug?: string;
  title: string;
  description?: string | null;
  language?: VideoLanguageValue;
  status?: VideoStatusValue;
  categoryId?: string | null;
  thumbnailId?: string | null;
  videoUrl: string;
  duration?: number | null;
  isFeatured?: boolean;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
};

export type UpdateVideoInput = {
  slug?: string;
  title?: string;
  description?: string | null;
  language?: VideoLanguageValue;
  status?: VideoStatusValue;
  categoryId?: string | null;
  thumbnailId?: string | null;
  videoUrl?: string;
  duration?: number | null;
  isFeatured?: boolean;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
};

function toVideoLanguage(
  value: Language,
): VideoLanguageValue {
  return value as VideoLanguageValue;
}

function toVideoStatus(
  value: VideoStatus,
): VideoStatusValue {
  return value as VideoStatusValue;
}

function mapVideo(
  video: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    language: Language;
    status: VideoStatus;
    categoryId: string | null;
    thumbnailId: string | null;
    videoUrl: string;
    duration: number | null;
    views: number;
    isFeatured: boolean;
    publishedAt: Date | null;
    scheduledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  categoryName: string | null,
  thumbnailUrl: string | null,
): VideoItem {
  return {
    id: video.id,
    slug: video.slug,
    title: video.title,
    description: video.description,
    language: toVideoLanguage(video.language),
    status: toVideoStatus(video.status),
    categoryId: video.categoryId,
    categoryName,
    thumbnailId: video.thumbnailId,
    thumbnailUrl,
    videoUrl: video.videoUrl,
    duration: video.duration,
    views: video.views,
    isFeatured: video.isFeatured,
    publishedAt: video.publishedAt,
    scheduledAt: video.scheduledAt,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
  };
}

async function getCategoryNames(
  categoryIds: string[],
  language: VideoLanguageValue,
) {
  if (categoryIds.length === 0) {
    return new Map<string, string>();
  }

  const categories =
    await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
      },
    });

  const translations =
    await prisma.categoryTranslation.findMany({
      where: {
        categoryId: {
          in: categories.map(
            (category) => category.id,
          ),
        },
        language: language as Language,
      },
      select: {
        categoryId: true,
        name: true,
      },
    });

  return new Map(
    translations.map((translation) => [
      translation.categoryId,
      translation.name,
    ]),
  );
}

async function getThumbnailUrls(
  thumbnailIds: string[],
) {
  if (thumbnailIds.length === 0) {
    return new Map<string, string>();
  }

  const media =
    await prisma.media.findMany({
      where: {
        id: {
          in: thumbnailIds,
        },
      },
      select: {
        id: true,
        url: true,
      },
    });

  return new Map(
    media.map((item) => [
      item.id,
      item.url,
    ]),
  );
}

function createSlug(
  title: string,
): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

async function makeUniqueSlug(
  title: string,
  existingId?: string,
): Promise<string> {
  const baseSlug =
    createSlug(title) || "video";

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing =
      await prisma.video.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      });

    if (
      !existing ||
      existing.id === existingId
    ) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function getVideos(
  options: GetVideosOptions = {},
) {
  const {
    search = "",
    status,
    categoryId,
    language,
    page = 1,
    pageSize = 50,
  } = options;

  const safePage = Math.max(
    1,
    page,
  );

  const safePageSize = Math.min(
    Math.max(1, pageSize),
    100,
  );

  const where = {
    ...(status
      ? {
          status:
            status as VideoStatus,
        }
      : {}),
    ...(categoryId
      ? {
          categoryId,
        }
      : {}),
    ...(language
      ? {
          language:
            language as Language,
        }
      : {}),
    ...(search.trim()
      ? {
          OR: [
            {
              title: {
                contains:
                  search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains:
                  search.trim(),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [
    videos,
    total,
  ] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip:
        (safePage - 1) *
        safePageSize,
      take: safePageSize,
    }),

    prisma.video.count({
      where,
    }),
  ]);

  const categoryIds = [
    ...new Set(
      videos
        .map(
          (video) =>
            video.categoryId,
        )
        .filter(
          (
            value,
          ): value is string =>
            Boolean(value),
        ),
    ),
  ];

  const thumbnailIds = [
    ...new Set(
      videos
        .map(
          (video) =>
            video.thumbnailId,
        )
        .filter(
          (
            value,
          ): value is string =>
            Boolean(value),
        ),
    ),
  ];

  const categoryNames =
    await getCategoryNames(
      categoryIds,
      language ?? "EN",
    );

  const thumbnailUrls =
    await getThumbnailUrls(
      thumbnailIds,
    );

  return {
    items: videos.map((video) =>
      mapVideo(
        video,
        video.categoryId
          ? categoryNames.get(
              video.categoryId,
            ) ?? null
          : null,
        video.thumbnailId
          ? thumbnailUrls.get(
              video.thumbnailId,
            ) ?? null
          : null,
      ),
    ),

    total,

    page: safePage,

    pageSize: safePageSize,

    totalPages: Math.ceil(
      total / safePageSize,
    ),
  };
}

export async function getVideoById(
  id: string,
) {
  const video =
    await prisma.video.findUnique({
      where: {
        id,
      },
    });

  if (!video) {
    return null;
  }

  const categoryNames =
    video.categoryId
      ? await getCategoryNames(
          [video.categoryId],
          toVideoLanguage(
            video.language,
          ),
        )
      : new Map<
          string,
          string
        >();

  const thumbnailUrls =
    video.thumbnailId
      ? await getThumbnailUrls([
          video.thumbnailId,
        ])
      : new Map<
          string,
          string
        >();

  return mapVideo(
    video,
    video.categoryId
      ? categoryNames.get(
          video.categoryId,
        ) ?? null
      : null,
    video.thumbnailId
      ? thumbnailUrls.get(
          video.thumbnailId,
        ) ?? null
      : null,
  );
}

export async function getVideoBySlug(
  slug: string,
) {
  const video =
    await prisma.video.findUnique({
      where: {
        slug,
      },
    });

  if (!video) {
    return null;
  }

  const categoryNames =
    video.categoryId
      ? await getCategoryNames(
          [video.categoryId],
          toVideoLanguage(
            video.language,
          ),
        )
      : new Map<
          string,
          string
        >();

  const thumbnailUrls =
    video.thumbnailId
      ? await getThumbnailUrls([
          video.thumbnailId,
        ])
      : new Map<
          string,
          string
        >();

  return mapVideo(
    video,
    video.categoryId
      ? categoryNames.get(
          video.categoryId,
        ) ?? null
      : null,
    video.thumbnailId
      ? thumbnailUrls.get(
          video.thumbnailId,
        ) ?? null
      : null,
  );
}

export async function createVideo(
  input: CreateVideoInput,
) {
  const title =
    input.title.trim();

  if (!title) {
    throw new Error(
      "Video title is required.",
    );
  }

  if (!input.videoUrl.trim()) {
    throw new Error(
      "Video URL is required.",
    );
  }

  const slug =
    input.slug?.trim()
      ? createSlug(input.slug)
      : await makeUniqueSlug(
          title,
        );

  const language =
    input.language ?? "EN";

  const status =
    input.status ?? "DRAFT";

  const publishedAt =
    status === "PUBLISHED"
      ? input.publishedAt ??
        new Date()
      : input.publishedAt ??
        null;

  const scheduledAt =
    status === "SCHEDULED"
      ? input.scheduledAt ??
        null
      : null;

  const video =
    await prisma.video.create({
      data: {
        slug,

        title,

        description:
          input.description?.trim() ||
          null,

        language:
          language as Language,

        status:
          status as VideoStatus,

        categoryId:
          input.categoryId || null,

        thumbnailId:
          input.thumbnailId || null,

        videoUrl:
          input.videoUrl.trim(),

        duration:
          input.duration ?? null,

        isFeatured:
          input.isFeatured ?? false,

        publishedAt,

        scheduledAt,
      },
    });

  return getVideoById(
    video.id,
  );
}

export async function updateVideo(
  id: string,
  input: UpdateVideoInput,
) {
  const existing =
    await prisma.video.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

  if (!existing) {
    throw new Error(
      "Video not found.",
    );
  }

  const data: {
    slug?: string;
    title?: string;
    description?: string | null;
    language?: Language;
    status?: VideoStatus;
    categoryId?: string | null;
    thumbnailId?: string | null;
    videoUrl?: string;
    duration?: number | null;
    isFeatured?: boolean;
    publishedAt?: Date | null;
    scheduledAt?: Date | null;
  } = {};

  if (
    input.title !== undefined
  ) {
    const cleanTitle =
      input.title.trim();

    if (!cleanTitle) {
      throw new Error(
        "Video title is required.",
      );
    }

    data.title = cleanTitle;
  }

  if (
    input.slug !== undefined
  ) {
    data.slug =
      await makeUniqueSlug(
        input.slug ||
          input.title ||
          existing.title,
        id,
      );
  }

  if (
    input.description !==
    undefined
  ) {
    data.description =
      input.description?.trim() ||
      null;
  }

  if (
    input.language !==
    undefined
  ) {
    data.language =
      input.language as Language;
  }

  if (
    input.status !== undefined
  ) {
    data.status =
      input.status as VideoStatus;
  }

  if (
    input.categoryId !==
    undefined
  ) {
    data.categoryId =
      input.categoryId || null;
  }

  if (
    input.thumbnailId !==
    undefined
  ) {
    data.thumbnailId =
      input.thumbnailId || null;
  }

  if (
    input.videoUrl !==
    undefined
  ) {
    if (!input.videoUrl.trim()) {
      throw new Error(
        "Video URL is required.",
      );
    }

    data.videoUrl =
      input.videoUrl.trim();
  }

  if (
    input.duration !==
    undefined
  ) {
    data.duration =
      input.duration;
  }

  if (
    input.isFeatured !==
    undefined
  ) {
    data.isFeatured =
      input.isFeatured;
  }

  const nextStatus =
    input.status ??
    existing.status;

  if (
    nextStatus === "PUBLISHED"
  ) {
    data.publishedAt =
      input.publishedAt ??
      new Date();

    data.scheduledAt =
      null;
  } else if (
    nextStatus === "SCHEDULED"
  ) {
    data.scheduledAt =
      input.scheduledAt ??
      null;
  } else {
    data.scheduledAt =
      null;

    if (
      input.publishedAt !==
      undefined
    ) {
      data.publishedAt =
        input.publishedAt;
    }
  }

  await prisma.video.update({
    where: {
      id,
    },
    data,
  });

  return getVideoById(id);
}

export async function deleteVideo(
  id: string,
) {
  const video =
    await prisma.video.findUnique({
      where: {
        id,
      },
    });

  if (!video) {
    throw new Error(
      "Video not found.",
    );
  }

  await prisma.video.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    video: mapVideo(
      video,
      null,
      null,
    ),
  };
}

export async function updateVideoStatus(
  id: string,
  status: VideoStatusValue,
  scheduledAt?: Date | null,
) {
  const data: {
    status: VideoStatus;
    publishedAt?: Date | null;
    scheduledAt?: Date | null;
  } = {
    status:
      status as VideoStatus,
  };

  if (status === "PUBLISHED") {
    data.publishedAt =
      new Date();

    data.scheduledAt = null;
  } else if (
    status === "SCHEDULED"
  ) {
    data.scheduledAt =
      scheduledAt ?? null;
  } else {
    data.scheduledAt = null;
  }

  await prisma.video.update({
    where: {
      id,
    },
    data,
  });

  return getVideoById(id);
}

export async function incrementVideoViews(
  id: string,
) {
  return prisma.video.update({
    where: {
      id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    select: {
      id: true,
      views: true,
    },
  });
}

export async function getVideoCategories(
  language: VideoLanguageValue = "EN",
) {
  const categories =
    await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  const translations =
    await prisma.categoryTranslation.findMany({
      where: {
        categoryId: {
          in: categories.map(
            (category) =>
              category.id,
          ),
        },
        language:
          language as Language,
      },
      select: {
        categoryId: true,
        name: true,
      },
    });

  const translationMap =
    new Map(
      translations.map(
        (translation) => [
          translation.categoryId,
          translation.name,
        ],
      ),
    );

  return categories.map(
    (category) => ({
      id: category.id,
      slug: category.slug,
      name:
        translationMap.get(
          category.id,
        ) ??
        category.slug,
    }),
  );
}