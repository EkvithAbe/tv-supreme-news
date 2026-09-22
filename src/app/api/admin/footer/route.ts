// src/app/api/admin/footer/route.ts

import { NextResponse } from "next/server";

import { requireAdminApiAccess } from "@/lib/auth";
import {
  createFooterLink,
  deleteFooterLink,
  getFooterForLanguage,
  getFooterSettings,
  reorderFooterLinks,
  saveFooterSettings,
  toggleFooterLink,
  updateFooterLink,
  type FooterLanguage,
  type FooterLink,
  type SaveFooterSettingsInput,
} from "@/lib/data/footer";

/* =========================================================
   CONFIG
========================================================= */

export const dynamic =
  "force-dynamic";

/* =========================================================
   HELPERS
========================================================= */

function isLanguage(
  value: unknown,
): value is FooterLanguage {
  return (
    value === "EN" ||
    value === "SI" ||
    value === "TA"
  );
}

function isObject(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function parseBoolean(
  value: unknown,
  fallback: boolean,
): boolean {
  if (
    typeof value ===
    "boolean"
  ) {
    return value;
  }

  return fallback;
}

function parseFooterLink(
  value: unknown,
): FooterLink | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    typeof value.id !==
    "string" ||
    typeof value.href !==
    "string"
  ) {
    return null;
  }

  const rawLabels =
    isObject(
      value.labels,
    )
      ? value.labels
      : {};

  return {
    id: value.id,

    labels: {
      EN:
        typeof rawLabels.EN ===
        "string"
          ? rawLabels.EN.trim()
          : "",

      SI:
        typeof rawLabels.SI ===
        "string"
          ? rawLabels.SI.trim()
          : "",

      TA:
        typeof rawLabels.TA ===
        "string"
          ? rawLabels.TA.trim()
          : "",
    },

    href:
      value.href.trim(),

    position:
      typeof value.position ===
        "number" &&
      Number.isFinite(
        value.position,
      )
        ? value.position
        : 0,

    isVisible:
      parseBoolean(
        value.isVisible,
        true,
      ),

    openNewTab:
      parseBoolean(
        value.openNewTab,
        false,
      ),
  };
}

function parseSaveInput(
  body: Record<
    string,
    unknown
  >,
): SaveFooterSettingsInput {
  const input: SaveFooterSettingsInput =
    {};

  if (
    typeof body.description ===
    "string"
  ) {
    input.description =
      body.description.trim();
  }

  if (
    typeof body.telephone ===
    "string"
  ) {
    input.telephone =
      body.telephone.trim();
  }

  if (
    typeof body.address ===
    "string"
  ) {
    input.address =
      body.address.trim();
  }

  if (
    typeof body.mapUrl ===
    "string"
  ) {
    input.mapUrl =
      body.mapUrl.trim();
  }

  if (
    typeof body.copyrightText ===
    "string"
  ) {
    input.copyrightText =
      body.copyrightText.trim();
  }

  if (
    typeof body.logoUrl ===
    "string"
  ) {
    input.logoUrl =
      body.logoUrl.trim();
  }

  if (
    typeof body.tagline ===
    "string"
  ) {
    input.tagline =
      body.tagline.trim();
  }

  if (
    isObject(
      body.social,
    )
  ) {
    input.social = {};

    if (
      typeof body.social.facebook ===
      "string"
    ) {
      input.social.facebook =
        body.social.facebook.trim();
    }

    if (
      typeof body.social.youtube ===
      "string"
    ) {
      input.social.youtube =
        body.social.youtube.trim();
    }

    if (
      typeof body.social.instagram ===
      "string"
    ) {
      input.social.instagram =
        body.social.instagram.trim();
    }

    if (
      typeof body.social.tiktok ===
      "string"
    ) {
      input.social.tiktok =
        body.social.tiktok.trim();
    }
  }

  if (
    Array.isArray(
      body.links,
    )
  ) {
    const links =
      body.links
        .map(
          parseFooterLink,
        )
        .filter(
          (
            item,
          ): item is FooterLink =>
            item !== null,
        )
        .map(
          (
            item,
            position,
          ) => ({
            ...item,
            position,
          }),
        );

    input.links =
      links;
  }

  return input;
}

/* =========================================================
   GET
========================================================= */

/*
 * GET /api/admin/footer
 *
 * Optional:
 *
 * ?language=EN
 * ?language=SI
 * ?language=TA
 */
export async function GET(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const url =
      new URL(
        request.url,
      );

    const languageParam =
      url.searchParams
        .get("language")
        ?.toUpperCase();

    if (
      languageParam &&
      isLanguage(
        languageParam,
      )
    ) {
      const footer =
        await getFooterForLanguage(
          languageParam,
        );

      return NextResponse.json({
        success: true,
        language:
          languageParam,
        footer,
      });
    }

    const footer =
      await getFooterSettings();

    return NextResponse.json({
      success: true,
      footer,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/footer failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load footer settings.",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   POST
========================================================= */

/*
 * POST /api/admin/footer
 *
 * Creates a new footer navigation link.
 */
export async function POST(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    if (
      !isObject(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request body.",
        },
        {
          status: 400,
        },
      );
    }

    const labels =
      isObject(
        body.labels,
      )
        ? body.labels
        : {};

    const href =
      typeof body.href ===
      "string"
        ? body.href.trim()
        : "";

    if (!href) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Footer link URL is required.",
        },
        {
          status: 400,
        },
      );
    }

    const item =
      await createFooterLink({
        href,

        labels: {
          EN:
            typeof labels.EN ===
            "string"
              ? labels.EN
              : undefined,

          SI:
            typeof labels.SI ===
            "string"
              ? labels.SI
              : undefined,

          TA:
            typeof labels.TA ===
            "string"
              ? labels.TA
              : undefined,
        },

        isVisible:
          parseBoolean(
            body.isVisible,
            true,
          ),

        openNewTab:
          parseBoolean(
            body.openNewTab,
            false,
          ),
      });

    return NextResponse.json(
      {
        success: true,
        item,
        message:
          "Footer link created successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/footer failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof
          Error
            ? error.message
            : "Failed to create footer link.",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   PUT
========================================================= */

/*
 * PUT /api/admin/footer
 *
 * Saves footer settings.
 */
export async function PUT(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    if (
      !isObject(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request body.",
        },
        {
          status: 400,
        },
      );
    }

    const input =
      parseSaveInput(
        body,
      );

    const footer =
      await saveFooterSettings(
        input,
      );

    return NextResponse.json({
      success: true,
      footer,
      message:
        "Footer settings saved successfully.",
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/footer failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof
          Error
            ? error.message
            : "Failed to save footer settings.",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   PATCH
========================================================= */

/*
 * Supported actions:
 *
 * UPDATE_LINK
 * TOGGLE_LINK
 * DELETE_LINK
 * REORDER_LINKS
 */
export async function PATCH(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    if (
      !isObject(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request body.",
        },
        {
          status: 400,
        },
      );
    }

    const action =
      typeof body.action ===
      "string"
        ? body.action.toUpperCase()
        : "";

    /* =====================================================
       UPDATE LINK
    ====================================================== */

    if (
      action ===
      "UPDATE_LINK"
    ) {
      const item =
        parseFooterLink(
          body.item,
        );

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid footer link.",
          },
          {
            status: 400,
          },
        );
      }

      const updated =
        await updateFooterLink(
          item,
        );

      return NextResponse.json({
        success: true,
        item: updated,
        message:
          "Footer link updated successfully.",
      });
    }

    /* =====================================================
       TOGGLE LINK
    ====================================================== */

    if (
      action ===
      "TOGGLE_LINK"
    ) {
      const id =
        typeof body.id ===
        "string"
          ? body.id
          : "";

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Footer link ID is required.",
          },
          {
            status: 400,
          },
        );
      }

      const updated =
        await toggleFooterLink(
          id,
        );

      return NextResponse.json({
        success: true,
        item: updated,
        message:
          "Footer link visibility updated successfully.",
      });
    }

    /* =====================================================
       DELETE LINK
    ====================================================== */

    if (
      action ===
      "DELETE_LINK"
    ) {
      const id =
        typeof body.id ===
        "string"
          ? body.id
          : "";

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Footer link ID is required.",
          },
          {
            status: 400,
          },
        );
      }

      await deleteFooterLink(
        id,
      );

      return NextResponse.json({
        success: true,
        message:
          "Footer link deleted successfully.",
      });
    }

    /* =====================================================
       REORDER LINKS
    ====================================================== */

    if (
      action ===
      "REORDER_LINKS"
    ) {
      if (
        !Array.isArray(
          body.ids,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A list of footer link IDs is required.",
          },
          {
            status: 400,
          },
        );
      }

      const ids =
        body.ids.filter(
          (
            id,
          ): id is string =>
            typeof id ===
            "string" &&
            id.trim()
              .length >
              0,
        );

      const links =
        await reorderFooterLinks(
          ids,
        );

      return NextResponse.json({
        success: true,
        links,
        message:
          "Footer link order updated successfully.",
      });
    }

    /* =====================================================
       SAVE SETTINGS
    ====================================================== */

    if (
      action ===
      "SAVE_SETTINGS"
    ) {
      const input =
        parseSaveInput(
          body,
        );

      const footer =
        await saveFooterSettings(
          input,
        );

      return NextResponse.json({
        success: true,
        footer,
        message:
          "Footer settings saved successfully.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unsupported footer action.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error(
      "PATCH /api/admin/footer failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof
          Error
            ? error.message
            : "Footer operation failed.",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   DELETE
========================================================= */

/*
 * DELETE /api/admin/footer?id=footer-about
 */
export async function DELETE(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const url =
      new URL(
        request.url,
      );

    const id =
      url.searchParams.get(
        "id",
      );

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Footer link ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    await deleteFooterLink(
      id,
    );

    return NextResponse.json({
      success: true,
      message:
        "Footer link deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/footer failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof
          Error
            ? error.message
            : "Failed to delete footer link.",
      },
      {
        status: 500,
      },
    );
  }
}
