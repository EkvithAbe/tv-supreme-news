import { NextResponse } from "next/server";

import { requireAdminApiAccess } from "@/lib/auth";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItemById,
  getMenuItems,
  reorderMenuItems,
  saveMenuOrder,
  toggleMenuItemVisibility,
  updateMenuItem,
  supportedMenuLanguages,
  type MenuLanguage,
  type MenuType,
} from "@/lib/data/menu";

export const runtime = "nodejs";

/* ============================================================
   VALIDATION
============================================================ */

function isValidLanguage(
  value: unknown,
): value is MenuLanguage {
  return (
    typeof value === "string" &&
    supportedMenuLanguages.includes(
      value as MenuLanguage,
    )
  );
}

function isValidMenuType(
  value: unknown,
): value is MenuType {
  return (
    value === "Page" ||
    value === "Category" ||
    value === "Custom Link" ||
    value === "System"
  );
}

function parseBoolean(
  value: unknown,
  defaultValue?: boolean,
): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return defaultValue;
}

/* ============================================================
   GET
   GET /api/admin/menu
   GET /api/admin/menu?language=EN
   GET /api/admin/menu?id=...
   GET /api/admin/menu?all=true
============================================================ */

export async function GET(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const { searchParams } =
      new URL(request.url);

    const languageParam =
      searchParams.get("language");

    const id =
      searchParams.get("id");

    const all =
      searchParams.get("all") === "true";

    /* ---------------------------------------------------------
       Get one item
    --------------------------------------------------------- */

    if (id) {
      const item =
        await getMenuItemById(id);

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Menu item not found.",
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        item,
      });
    }

    /* ---------------------------------------------------------
       Get all languages
    --------------------------------------------------------- */

    if (all) {
      const items =
        await getAllMenuItems();

      return NextResponse.json({
        success: true,
        items,
      });
    }

    /* ---------------------------------------------------------
       Get language-specific menu
    --------------------------------------------------------- */

    let language: MenuLanguage =
      "EN";

    if (languageParam) {
      if (
        !isValidLanguage(
          languageParam,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid language. Use EN, SI or TA.",
          },
          { status: 400 },
        );
      }

      language = languageParam;
    }

    const items =
      await getMenuItems(language);

    return NextResponse.json({
      success: true,
      language,
      items,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/menu error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load menu items.",
      },
      { status: 500 },
    );
  }
}

/* ============================================================
   POST
   Create menu item

   POST /api/admin/menu
============================================================ */

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

    const {
      language,
      label,
      href,
      type,
      isVisible,
      visible,
      desktop,
      mobile,
      openNewTab,
      position,
    } = body;

    const menuLanguage =
      language ?? "EN";

    if (
      !isValidLanguage(
        menuLanguage,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid language. Use EN, SI or TA.",
        },
        { status: 400 },
      );
    }

    if (
      typeof label !== "string" ||
      !label.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Menu label is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof href !== "string" ||
      !href.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Menu URL is required.",
        },
        { status: 400 },
      );
    }

    const menuType =
      type ?? "Custom Link";

    if (
      !isValidMenuType(
        menuType,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid menu item type.",
        },
        { status: 400 },
      );
    }

    const parsedVisible =
      parseBoolean(
        isVisible ??
          visible,
        true,
      );

    const parsedDesktop =
      parseBoolean(
        desktop,
        true,
      );

    const parsedMobile =
      parseBoolean(
        mobile,
        true,
      );

    const parsedOpenNewTab =
      parseBoolean(
        openNewTab,
        false,
      );

    const created =
      await createMenuItem({
        language: menuLanguage,
        label:
          label.trim(),
        href:
          href.trim(),
        type: menuType,
        isVisible:
          parsedVisible ?? true,
        desktop:
          parsedDesktop ?? true,
        mobile:
          parsedMobile ?? true,
        openNewTab:
          parsedOpenNewTab ?? false,
        position:
          typeof position ===
          "number"
            ? position
            : undefined,
      });

    return NextResponse.json(
      {
        success: true,
        item: created,
        message:
          "Menu item created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/menu error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create menu item.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}

/* ============================================================
   PUT
   Update menu item

   PUT /api/admin/menu
============================================================ */

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

    const {
      id,
      itemId,
      language,
      label,
      href,
      type,
      isVisible,
      visible,
      desktop,
      mobile,
      openNewTab,
      position,
    } = body;

    const menuItemId =
      id ?? itemId;

    if (
      typeof menuItemId !==
        "string" ||
      !menuItemId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Menu item ID is required.",
        },
        { status: 400 },
      );
    }

    if (
      language !== undefined &&
      !isValidLanguage(language)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid language. Use EN, SI or TA.",
        },
        { status: 400 },
      );
    }

    if (
      type !== undefined &&
      !isValidMenuType(type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid menu item type.",
        },
        { status: 400 },
      );
    }

    if (
      label !== undefined &&
      (typeof label !== "string" ||
        !label.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Menu label cannot be empty.",
        },
        { status: 400 },
      );
    }

    if (
      href !== undefined &&
      (typeof href !== "string" ||
        !href.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Menu URL cannot be empty.",
        },
        { status: 400 },
      );
    }

    const parsedVisible =
      isVisible !== undefined ||
      visible !== undefined
        ? parseBoolean(
            isVisible ?? visible,
          )
        : undefined;

    const parsedDesktop =
      desktop !== undefined
        ? parseBoolean(desktop)
        : undefined;

    const parsedMobile =
      mobile !== undefined
        ? parseBoolean(mobile)
        : undefined;

    const parsedOpenNewTab =
      openNewTab !== undefined
        ? parseBoolean(openNewTab)
        : undefined;

    const updated =
      await updateMenuItem({
        id: menuItemId.trim(),

        ...(language !== undefined
          ? {
              language,
            }
          : {}),

        ...(label !== undefined
          ? {
              label:
                label.trim(),
            }
          : {}),

        ...(href !== undefined
          ? {
              href:
                href.trim(),
            }
          : {}),

        ...(type !== undefined
          ? {
              type,
            }
          : {}),

        ...(parsedVisible !==
        undefined
          ? {
              isVisible:
                parsedVisible,
            }
          : {}),

        ...(parsedDesktop !==
        undefined
          ? {
              desktop:
                parsedDesktop,
            }
          : {}),

        ...(parsedMobile !==
        undefined
          ? {
              mobile:
                parsedMobile,
            }
          : {}),

        ...(parsedOpenNewTab !==
        undefined
          ? {
              openNewTab:
                parsedOpenNewTab,
            }
          : {}),

        ...(typeof position ===
        "number"
          ? {
              position,
            }
          : {}),
      });

    return NextResponse.json({
      success: true,
      item: updated,
      message:
        "Menu item updated successfully.",
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/menu error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update menu item.";

    const statusCode =
      message
        .toLowerCase()
        .includes("not found")
        ? 404
        : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}

/* ============================================================
   DELETE
   DELETE /api/admin/menu?id=...
============================================================ */

export async function DELETE(
  request: Request,
) {
  const access =
    await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const { searchParams } =
      new URL(request.url);

    const id =
      searchParams.get("id") ??
      searchParams.get("itemId");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Menu item ID is required.",
        },
        { status: 400 },
      );
    }

    await deleteMenuItem(id);

    return NextResponse.json({
      success: true,
      message:
        "Menu item deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/menu error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete menu item.";

    const statusCode =
      message
        .toLowerCase()
        .includes("not found")
        ? 404
        : message
            .toLowerCase()
            .includes("system")
          ? 400
          : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}

/* ============================================================
   PATCH
   Actions:
     TOGGLE_VISIBILITY
     REORDER
     SAVE_ORDER
============================================================ */

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

    const {
      action,
      id,
      itemId,
      ids,
      items,
      isVisible,
    } = body;

    /* ---------------------------------------------------------
       Toggle visibility
    --------------------------------------------------------- */

    if (
      action ===
      "TOGGLE_VISIBILITY"
    ) {
      const menuItemId =
        id ?? itemId;

      if (
        typeof menuItemId !==
          "string" ||
        !menuItemId.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Menu item ID is required.",
          },
          { status: 400 },
        );
      }

      /*
       * If an explicit isVisible value was supplied,
       * update it using PUT-style logic.
       * Otherwise toggle the current value.
       */
      if (
        typeof isVisible ===
        "boolean"
      ) {
        const updated =
          await updateMenuItem({
            id: menuItemId.trim(),
            isVisible,
          });

        return NextResponse.json({
          success: true,
          item: updated,
          message:
            "Menu item visibility updated successfully.",
        });
      }

      const updated =
        await toggleMenuItemVisibility(
          menuItemId.trim(),
        );

      return NextResponse.json({
        success: true,
        item: updated,
        message:
          "Menu item visibility updated successfully.",
      });
    }

    /* ---------------------------------------------------------
       Reorder using ID array
    --------------------------------------------------------- */

    if (
      action === "REORDER"
    ) {
      if (
        !Array.isArray(ids) ||
        ids.some(
          (value: unknown) =>
            typeof value !==
            "string",
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "ids must be an array of menu item IDs.",
          },
          { status: 400 },
        );
      }

      const reordered =
        await reorderMenuItems(
          ids,
        );

      return NextResponse.json({
        success: true,
        items: reordered,
        message:
          "Menu order updated successfully.",
      });
    }

    /* ---------------------------------------------------------
       Save complete order using:
       [{ id, position }]
    --------------------------------------------------------- */

    if (
      action === "SAVE_ORDER"
    ) {
      if (
        !Array.isArray(items)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "items must be an array.",
          },
          { status: 400 },
        );
      }

      const validItems =
        items.every(
          (item: unknown) => {
            if (
              !item ||
              typeof item !==
                "object"
            ) {
              return false;
            }

            const value =
              item as Record<
                string,
                unknown
              >;

            return (
              typeof value.id ===
                "string" &&
              typeof value.position ===
                "number"
            );
          },
        );

      if (!validItems) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Each order item requires an id and numeric position.",
          },
          { status: 400 },
        );
      }

      await saveMenuOrder(
        items as Array<{
          id: string;
          position: number;
        }>,
      );

      return NextResponse.json({
        success: true,
        message:
          "Menu order saved successfully.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid action. Use TOGGLE_VISIBILITY, REORDER or SAVE_ORDER.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error(
      "PATCH /api/admin/menu error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update menu.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
