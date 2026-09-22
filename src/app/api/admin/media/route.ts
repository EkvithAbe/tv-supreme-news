import { NextResponse } from "next/server";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";

import {
  isAdmin,
  requireAdminApiAccess,
  requireContentApiAccess,
} from "@/lib/auth";
import {
  createMedia,
  deleteMedia,
  getMedia,
  updateMedia,
  type MediaTypeValue,
} from "@/lib/data/media";

export const runtime = "nodejs";

const EDITOR_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EDITOR_IMAGE_MAX_BYTES =
  10 * 1024 * 1024;

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

function hasExpectedImageSignature(
  bytes: Buffer,
  mimeType: string,
) {
  if (mimeType === "image/jpeg") {
    return (
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (mimeType === "image/png") {
    return (
      bytes.length >= 8 &&
      bytes.subarray(0, 8).equals(
        Buffer.from([
          0x89,
          0x50,
          0x4e,
          0x47,
          0x0d,
          0x0a,
          0x1a,
          0x0a,
        ]),
      )
    );
  }

  if (mimeType === "image/gif") {
    return (
      bytes.length >= 6 &&
      (bytes.subarray(0, 6).equals(
        Buffer.from("GIF87a"),
      ) ||
        bytes.subarray(0, 6).equals(
          Buffer.from("GIF89a"),
        ))
    );
  }

  if (mimeType === "image/webp") {
    return (
      bytes.length >= 12 &&
      bytes.subarray(0, 4).equals(
        Buffer.from("RIFF"),
      ) &&
      bytes.subarray(8, 12).equals(
        Buffer.from("WEBP"),
      )
    );
  }

  return false;
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
  const access =
    await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

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

    const type = isAdmin(access.user)
      ? validTypes.includes(
          typeParam as MediaTypeValue,
        )
        ? (typeParam as MediaTypeValue)
        : undefined
      : "IMAGE";

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
  const access =
    await requireContentApiAccess();

  if (access.response) {
    return access.response;
  }

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

    if (!isAdmin(access.user)) {
      if (
        !EDITOR_IMAGE_MIME_TYPES.has(
          file.type,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Editors may upload JPEG, PNG, WebP or GIF images only.",
          },
          {
            status: 403,
          },
        );
      }

      if (
        file.size >
        EDITOR_IMAGE_MAX_BYTES
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Images must be 10 MB or smaller.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !hasExpectedImageSignature(
          bytes,
          file.type,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The uploaded file is not a valid image.",
          },
          {
            status: 400,
          },
        );
      }
    }

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
      type: isAdmin(access.user)
        ? getMediaType(file.type)
        : "IMAGE",
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
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

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
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

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
