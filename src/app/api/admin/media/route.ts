import { NextResponse } from "next/server";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";

import {
  createMedia,
  deleteMedia,
  getMedia,
  updateMedia,
  type MediaTypeValue,
} from "@/lib/data/media";

export const runtime = "nodejs";

function getMediaType(mimeType: string): MediaTypeValue {
  if (mimeType.startsWith("image/")) {
    return "IMAGE";
  }

  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  if (mimeType.startsWith("audio/")) {
    return "AUDIO";
  }

  return "DOCUMENT";
}

function safeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * GET /api/admin/media
 *
 * Query parameters:
 * ?search=
 * ?type=IMAGE|VIDEO|AUDIO|DOCUMENT
 * ?page=1
 * ?pageSize=50
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const typeParam = searchParams.get("type");

    const pageParam = Number(searchParams.get("page") ?? "1");
    const pageSizeParam = Number(
      searchParams.get("pageSize") ?? "50"
    );

    const page = Number.isFinite(pageParam)
      ? pageParam
      : 1;

    const pageSize = Number.isFinite(pageSizeParam)
      ? pageSizeParam
      : 50;

    const validTypes: MediaTypeValue[] = [
      "IMAGE",
      "VIDEO",
      "AUDIO",
      "DOCUMENT",
    ];

    const type = validTypes.includes(
      typeParam as MediaTypeValue
    )
      ? (typeParam as MediaTypeValue)
      : undefined;

    const result = await getMedia({
      search,
      type,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("GET /api/admin/media error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load media.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/admin/media
 *
 * Multipart form data:
 * file
 * altText
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const altTextValue = formData.get("altText");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No file was uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded file is empty.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "media"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const timestamp = Date.now();
    const safeName = safeFilename(file.name);

    const storedFilename = `${timestamp}-${safeName}`;

    const filePath = path.join(
      uploadDirectory,
      storedFilename
    );

    await writeFile(filePath, bytes);

    const publicUrl = `/uploads/media/${storedFilename}`;

    const media = await createMedia({
      filename: file.name,
      url: publicUrl,
      type: getMediaType(file.type),
      mimeType: file.type || null,
      size: file.size,
      altText:
        typeof altTextValue === "string"
          ? altTextValue
          : null,
    });

    return NextResponse.json(
      {
        success: true,
        media,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/admin/media error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload media.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PUT /api/admin/media
 *
 * JSON body:
 * {
 *   id: string,
 *   altText?: string | null,
 *   filename?: string
 * }
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id
        : "";

    const altText =
      body.altText === null ||
      typeof body.altText === "string"
        ? body.altText
        : undefined;

    const filename =
      typeof body.filename === "string"
        ? body.filename
        : undefined;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Media ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const media = await updateMedia(id, {
      altText,
      filename,
    });

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error) {
    console.error("PUT /api/admin/media error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update media.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      }
    );
  }
}

/**
 * DELETE /api/admin/media?id=MEDIA_ID
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Media ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await deleteMedia(id);

    /*
     * Delete the physical file only when it belongs
     * to our local media upload directory.
     */
    if (result.media.url.startsWith("/uploads/media/")) {
      const filename = path.basename(result.media.url);

      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "media",
        filename
      );

      try {
        await unlink(filePath);
      } catch (fileError) {
        /*
         * The database record has already been deleted.
         * A missing physical file should not make the
         * API request fail.
         */
        console.warn(
          "Could not remove physical media file:",
          fileError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/media error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete media.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      }
    );
  }
}