import "server-only";

import { MediaType } from "../../../generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type MediaTypeValue =
  | "IMAGE"
  | "VIDEO"
  | "AUDIO"
  | "DOCUMENT";

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  type: MediaTypeValue;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GetMediaOptions = {
  search?: string;
  type?: MediaTypeValue;
  page?: number;
  pageSize?: number;
};

function mapMedia(media: {
  id: string;
  filename: string;
  url: string;
  type: MediaType;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: Date;
  updatedAt: Date;
}): MediaItem {
  return {
    id: media.id,
    filename: media.filename,
    url: media.url,
    type: media.type as MediaTypeValue,
    mimeType: media.mimeType,
    size: media.size,
    width: media.width,
    height: media.height,
    altText: media.altText,
    createdAt: media.createdAt,
    updatedAt: media.updatedAt,
  };
}

export async function getMedia(options: GetMediaOptions = {}) {
  const {
    search = "",
    type,
    page = 1,
    pageSize = 50,
  } = options;

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const where = {
    ...(type ? { type: type as MediaType } : {}),
    ...(search.trim()
      ? {
          OR: [
            {
              filename: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              altText: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              mimeType: {
                contains: search.trim(),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),
    prisma.media.count({
      where,
    }),
  ]);

  return {
    items: items.map(mapMedia),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize),
  };
}

export async function getMediaById(id: string) {
  const media = await prisma.media.findUnique({
    where: {
      id,
    },
  });

  if (!media) {
    return null;
  }

  return mapMedia(media);
}

export async function createMedia(input: {
  filename: string;
  url: string;
  type: MediaTypeValue;
  mimeType?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
}) {
  const media = await prisma.media.create({
    data: {
      filename: input.filename,
      url: input.url,
      type: input.type as MediaType,
      mimeType: input.mimeType ?? null,
      size: input.size ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      altText: input.altText ?? null,
    },
  });

  return mapMedia(media);
}

export async function updateMedia(
  id: string,
  input: {
    altText?: string | null;
    filename?: string;
  }
) {
  const media = await prisma.media.update({
    where: {
      id,
    },
    data: {
      ...(input.altText !== undefined
        ? {
            altText: input.altText,
          }
        : {}),
      ...(input.filename !== undefined
        ? {
            filename: input.filename,
          }
        : {}),
    },
  });

  return mapMedia(media);
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({
    where: {
      id,
    },
  });

  if (!media) {
    throw new Error("Media not found");
  }

  const [
    mainArticleCount,
    articleMediaCount,
    videoThumbnailCount,
    homepageSectionCount,
  ] = await Promise.all([
    prisma.article.count({
      where: {
        mainImageId: id,
      },
    }),
    prisma.articleMedia.count({
      where: {
        mediaId: id,
      },
    }),
    prisma.video.count({
      where: {
        thumbnailId: id,
      },
    }),
    prisma.homepageSection.count({
      where: {
        mediaId: id,
      },
    }),
  ]);

  const isInUse =
    mainArticleCount > 0 ||
    articleMediaCount > 0 ||
    videoThumbnailCount > 0 ||
    homepageSectionCount > 0;

  if (isInUse) {
    throw new Error(
      "This media file is currently being used and cannot be deleted."
    );
  }

  await prisma.media.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    media: mapMedia(media),
  };
}