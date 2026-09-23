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
              },
            },
            {
              altText: {
                contains: search.trim(),
              },
            },
            {
              mimeType: {
                contains: search.trim(),
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

export async function deleteMedia(
  id: string,
  options?: { force?: boolean }
) {
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

  const usageDetails: string[] = [];
  if (mainArticleCount > 0) {
    usageDetails.push(
      `${mainArticleCount} article main image${mainArticleCount > 1 ? "s" : ""}`
    );
  }
  if (articleMediaCount > 0) {
    usageDetails.push(
      `${articleMediaCount} article gallery item${articleMediaCount > 1 ? "s" : ""}`
    );
  }
  if (videoThumbnailCount > 0) {
    usageDetails.push(
      `${videoThumbnailCount} video thumbnail${videoThumbnailCount > 1 ? "s" : ""}`
    );
  }
  if (homepageSectionCount > 0) {
    usageDetails.push(
      `${homepageSectionCount} homepage section${homepageSectionCount > 1 ? "s" : ""}`
    );
  }

  const isInUse = usageDetails.length > 0;

  if (isInUse && !options?.force) {
    const error = new Error(
      `This media file is currently in use (${usageDetails.join(", ")}).`
    );
    (error as Error & { isInUse?: boolean; usageDetails?: string[] }).isInUse = true;
    (error as Error & { isInUse?: boolean; usageDetails?: string[] }).usageDetails = usageDetails;
    throw error;
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