import "server-only";

import { prisma } from "@/lib/prisma";

export const supportedMenuLanguages = [
  "EN",
  "SI",
  "TA",
] as const;

export type MenuLanguage =
  (typeof supportedMenuLanguages)[number];

export type MenuType =
  | "Page"
  | "Category"
  | "Custom Link"
  | "System";

export interface MenuItemMetadata {
  type: MenuType;
  desktop: boolean;
  mobile: boolean;
  openNewTab: boolean;
}

export interface MenuItemRecord {
  id: string;
  language: MenuLanguage;
  label: string;
  href: string;
  position: number;
  isVisible: boolean;

  type: MenuType;
  desktop: boolean;
  mobile: boolean;
  openNewTab: boolean;

  /**
   * True only when this locale has no menu rows and the English menu is
   * being shown as a safe fallback.
   */
  usesEnglishFallback?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuItemInput {
  language?: MenuLanguage;
  label: string;
  href: string;
  type?: MenuType;
  isVisible?: boolean;
  desktop?: boolean;
  mobile?: boolean;
  openNewTab?: boolean;
  position?: number;
}

export interface UpdateMenuItemInput {
  id: string;
  language?: MenuLanguage;
  label?: string;
  href?: string;
  type?: MenuType;
  isVisible?: boolean;
  desktop?: boolean;
  mobile?: boolean;
  openNewTab?: boolean;
  position?: number;
}

/*
 * The existing Prisma MenuItem model intentionally stays simple:
 *
 * id
 * language
 * label
 * href
 * position
 * isVisible
 *
 * The current admin UI has additional presentation fields:
 *
 * type
 * desktop
 * mobile
 * openNewTab
 *
 * We store those extra UI settings as JSON in SiteSetting.
 * This avoids an unnecessary Prisma schema change.
 */

const MENU_METADATA_KEY =
  "menu_item_metadata";

type MetadataMap = Record<
  string,
  MenuItemMetadata
>;

const defaultMetadata: MenuItemMetadata = {
  type: "Custom Link",
  desktop: true,
  mobile: true,
  openNewTab: false,
};

/* ============================================================
   HELPERS
============================================================ */

function isValidLanguage(
  value: string,
): value is MenuLanguage {
  return supportedMenuLanguages.includes(
    value as MenuLanguage,
  );
}

function isValidMenuType(
  value: string,
): value is MenuType {
  return (
    value === "Page" ||
    value === "Category" ||
    value === "Custom Link" ||
    value === "System"
  );
}

function cleanHref(
  href: string,
): string {
  return href.trim();
}

function cleanLabel(
  label: string,
): string {
  return label.trim();
}

/* ============================================================
   METADATA
============================================================ */

async function getMetadataMap(): Promise<MetadataMap> {
  const setting =
    await prisma.siteSetting.findUnique({
      where: {
        key: MENU_METADATA_KEY,
      },
    });

  if (!setting?.value) {
    return {};
  }

  try {
    const parsed =
      JSON.parse(setting.value) as unknown;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return parsed as MetadataMap;
  } catch {
    return {};
  }
}

async function saveMetadataMap(
  metadataMap: MetadataMap,
): Promise<void> {
  await prisma.siteSetting.upsert({
    where: {
      key: MENU_METADATA_KEY,
    },
    update: {
      value: JSON.stringify(
        metadataMap,
      ),
    },
    create: {
      key: MENU_METADATA_KEY,
      value: JSON.stringify(
        metadataMap,
      ),
    },
  });
}

/* ============================================================
   BUILD RECORDS
============================================================ */

function buildMenuRecords(
  items: Array<{
    id: string;
    language: MenuLanguage;
    label: string;
    href: string;
    position: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>,
  metadataMap: MetadataMap,
  usesEnglishFallback: boolean | ReadonlySet<string> = false,
): MenuItemRecord[] {
  return items.map((item) => {
    const metadata =
      metadataMap[item.id] ??
      defaultMetadata;

    const itemUsesEnglishFallback =
      typeof usesEnglishFallback === "boolean"
        ? usesEnglishFallback
        : usesEnglishFallback.has(item.id);

    return {
      ...item,

      type: isValidMenuType(
        metadata.type,
      )
        ? metadata.type
        : defaultMetadata.type,

      desktop:
        typeof metadata.desktop ===
        "boolean"
          ? metadata.desktop
          : true,

      mobile:
        typeof metadata.mobile ===
        "boolean"
          ? metadata.mobile
          : true,

      openNewTab:
        typeof metadata.openNewTab ===
        "boolean"
          ? metadata.openNewTab
          : false,
      ...(itemUsesEnglishFallback
        ? { usesEnglishFallback: true }
        : {}),
    };
  });
}

function getMenuHrefKey(href: string): string {
  const normalized = cleanHref(href)
    .replace(/^\/(en|si|ta)(?=\/|$)/i, "")
    .replace(/\/+$/, "");

  return normalized || "/";
}

/**
 * Published custom pages are real public destinations, so they belong in the
 * visitor navigation without an administrator having to create a duplicate
 * MenuItem by hand. A page appears only in a locale that has its own
 * translation; that avoids linking Sinhala or Tamil visitors to a 404 page.
 */
async function getPublishedPageMenuItems(
  language: MenuLanguage,
  startingPosition: number,
): Promise<MenuItemRecord[]> {
  const pages = await prisma.page.findMany({
    where: {
      status: "PUBLISHED",
      translations: {
        some: {
          language,
        },
      },
    },
    select: {
      id: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      translations: {
        where: {
          language,
        },
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return pages.flatMap((page, index) => {
    const translation = page.translations[0];

    if (!translation) {
      return [];
    }

    return [
      {
        id: `page-${page.id}-${translation.id}`,
        language,
        label: translation.title,
        href: `/${page.slug}`,
        position: startingPosition + index,
        isVisible: true,
        type: "Page" as const,
        desktop: true,
        mobile: true,
        openNewTab: false,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    ];
  });
}

async function appendPublishedPageMenuItems(
  items: MenuItemRecord[],
  language: MenuLanguage,
): Promise<MenuItemRecord[]> {
  const pageItems = await getPublishedPageMenuItems(
    language,
    items.reduce(
      (largestPosition, item) =>
        Math.max(largestPosition, item.position),
      -1,
    ) + 1,
  );
  const configuredHrefKeys = new Set(
    items.map((item) => getMenuHrefKey(item.href)),
  );

  return [
    ...items,
    ...pageItems.filter(
      (item) =>
        !configuredHrefKeys.has(
          getMenuHrefKey(item.href),
        ),
    ),
  ];
}

/* ============================================================
   GET MENU ITEMS
============================================================ */

export async function getMenuItems(
  language: MenuLanguage = "EN",
): Promise<MenuItemRecord[]> {
  const [items, metadataMap] =
    await Promise.all([
      prisma.menuItem.findMany({
        where: {
          language,
        },
        orderBy: {
          position: "asc",
        },
      }),
      getMetadataMap(),
    ]);

  const usesEnglishFallback =
    items.length === 0 && language !== "EN";

  const fallbackItems =
    usesEnglishFallback
      ? await prisma.menuItem.findMany({
          where: {
            language: "EN",
          },
          orderBy: {
            position: "asc",
          },
        })
      : items;

  return buildMenuRecords(
    fallbackItems.map((item) => ({
      id: item.id,
      // A locale with no menu records falls back to the English navigation
      // rather than leaving visitors with an empty header.
      language,
      label: item.label,
      href: item.href,
      position: item.position,
      isVisible: item.isVisible,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    metadataMap,
    usesEnglishFallback,
  );
}

/* ============================================================
   GET PUBLIC MENU ITEMS

   English owns the menu structure. Public Sinhala and Tamil
   navigation merges that structure with any saved local labels, so
   administrators do not have to recreate each standard menu item.
============================================================ */

export async function getPublicMenuItems(
  language: MenuLanguage = "EN",
): Promise<MenuItemRecord[]> {
  if (language === "EN") {
    return appendPublishedPageMenuItems(
      await getMenuItems("EN"),
      language,
    );
  }

  const [englishItems, localizedItems, metadataMap] =
    await Promise.all([
      prisma.menuItem.findMany({
        where: { language: "EN" },
        orderBy: { position: "asc" },
      }),
      prisma.menuItem.findMany({
        where: { language },
        orderBy: { position: "asc" },
      }),
      getMetadataMap(),
    ]);

  const localizedByHref = new Map(
    localizedItems.map((item) => [
      getMenuHrefKey(item.href),
      item,
    ]),
  );
  const usedLocalizedIds = new Set<string>();
  const englishFallbackIds = new Set<string>();

  const mergedItems = englishItems.map((englishItem) => {
    const localizedItem = localizedByHref.get(
      getMenuHrefKey(englishItem.href),
    );

    if (localizedItem) {
      usedLocalizedIds.add(localizedItem.id);
    } else {
      englishFallbackIds.add(englishItem.id);
    }

    return {
      id: englishItem.id,
      language,
      label: localizedItem?.label || englishItem.label,
      href: englishItem.href,
      position: englishItem.position,
      isVisible: englishItem.isVisible,
      createdAt: englishItem.createdAt,
      updatedAt: englishItem.updatedAt,
    };
  });

  const localeOnlyItems = localizedItems
    .filter((item) => !usedLocalizedIds.has(item.id))
    .map((item, index) => ({
      id: item.id,
      language,
      label: item.label,
      href: item.href,
      position: englishItems.length + index,
      isVisible: item.isVisible,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

  const menuItems = buildMenuRecords(
    [...mergedItems, ...localeOnlyItems],
    metadataMap,
    englishFallbackIds,
  );

  return appendPublishedPageMenuItems(
    menuItems,
    language,
  );
}

/* ============================================================
   GET ALL LANGUAGES
============================================================ */

export async function getAllMenuItems(): Promise<
  MenuItemRecord[]
> {
  const [items, metadataMap] =
    await Promise.all([
      prisma.menuItem.findMany({
        orderBy: [
          {
            language: "asc",
          },
          {
            position: "asc",
          },
        ],
      }),
      getMetadataMap(),
    ]);

  return buildMenuRecords(
    items.map((item) => ({
      id: item.id,
      language:
        item.language as MenuLanguage,
      label: item.label,
      href: item.href,
      position: item.position,
      isVisible: item.isVisible,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    metadataMap,
  );
}

/* ============================================================
   GET ONE MENU ITEM
============================================================ */

export async function getMenuItemById(
  id: string,
): Promise<MenuItemRecord | null> {
  const [item, metadataMap] =
    await Promise.all([
      prisma.menuItem.findUnique({
        where: {
          id,
        },
      }),
      getMetadataMap(),
    ]);

  if (!item) {
    return null;
  }

  return buildMenuRecords(
    [
      {
        id: item.id,
        language:
          item.language as MenuLanguage,
        label: item.label,
        href: item.href,
        position: item.position,
        isVisible:
          item.isVisible,
        createdAt:
          item.createdAt,
        updatedAt:
          item.updatedAt,
      },
    ],
    metadataMap,
  )[0];
}

/* ============================================================
   CREATE
============================================================ */

export async function createMenuItem(
  input: CreateMenuItemInput,
): Promise<MenuItemRecord> {
  const language =
    input.language ?? "EN";

  if (!isValidLanguage(language)) {
    throw new Error(
      "Invalid menu language.",
    );
  }

  const label =
    cleanLabel(input.label);

  const href =
    cleanHref(input.href);

  if (!label) {
    throw new Error(
      "Menu label is required.",
    );
  }

  if (!href) {
    throw new Error(
      "Menu URL is required.",
    );
  }

  const type =
    input.type ?? "Custom Link";

  if (!isValidMenuType(type)) {
    throw new Error(
      "Invalid menu item type.",
    );
  }

  const existingItems =
    await prisma.menuItem.findMany({
      where: {
        language,
      },
      select: {
        position: true,
      },
      orderBy: {
        position: "desc",
      },
    });

  const nextPosition =
    input.position ??
    (existingItems.length > 0
      ? existingItems[0].position + 1
      : 0);

  const item =
    await prisma.menuItem.create({
      data: {
        language,
        label,
        href,
        position: nextPosition,
        isVisible:
          input.isVisible ?? true,
      },
    });

  const metadataMap =
    await getMetadataMap();

  metadataMap[item.id] = {
    type,
    desktop:
      input.desktop ?? true,
    mobile:
      input.mobile ?? true,
    openNewTab:
      input.openNewTab ?? false,
  };

  await saveMetadataMap(
    metadataMap,
  );

  const result =
    await getMenuItemById(
      item.id,
    );

  if (!result) {
    throw new Error(
      "Failed to load created menu item.",
    );
  }

  return result;
}

/* ============================================================
   UPDATE
============================================================ */

export async function updateMenuItem(
  input: UpdateMenuItemInput,
): Promise<MenuItemRecord> {
  const existing =
    await prisma.menuItem.findUnique({
      where: {
        id: input.id,
      },
    });

  if (!existing) {
    throw new Error(
      "Menu item not found.",
    );
  }

  const data: {
    language?: MenuLanguage;
    label?: string;
    href?: string;
    position?: number;
    isVisible?: boolean;
  } = {};

  if (
    typeof input.language ===
    "string"
  ) {
    if (
      !isValidLanguage(
        input.language,
      )
    ) {
      throw new Error(
        "Invalid menu language.",
      );
    }

    data.language =
      input.language;
  }

  if (
    typeof input.label ===
    "string"
  ) {
    const label =
      cleanLabel(input.label);

    if (!label) {
      throw new Error(
        "Menu label is required.",
      );
    }

    data.label = label;
  }

  if (
    typeof input.href ===
    "string"
  ) {
    const href =
      cleanHref(input.href);

    if (!href) {
      throw new Error(
        "Menu URL is required.",
      );
    }

    data.href = href;
  }

  if (
    typeof input.position ===
    "number"
  ) {
    data.position =
      input.position;
  }

  if (
    typeof input.isVisible ===
    "boolean"
  ) {
    data.isVisible =
      input.isVisible;
  }

  await prisma.menuItem.update({
    where: {
      id: input.id,
    },
    data,
  });

  const metadataMap =
    await getMetadataMap();

  const currentMetadata =
    metadataMap[input.id] ??
    defaultMetadata;

  if (
    input.type !== undefined
  ) {
    if (
      !isValidMenuType(
        input.type,
      )
    ) {
      throw new Error(
        "Invalid menu item type.",
      );
    }

    currentMetadata.type =
      input.type;
  }

  if (
    input.desktop !== undefined
  ) {
    currentMetadata.desktop =
      input.desktop;
  }

  if (
    input.mobile !== undefined
  ) {
    currentMetadata.mobile =
      input.mobile;
  }

  if (
    input.openNewTab !==
    undefined
  ) {
    currentMetadata.openNewTab =
      input.openNewTab;
  }

  metadataMap[input.id] =
    currentMetadata;

  await saveMetadataMap(
    metadataMap,
  );

  const result =
    await getMenuItemById(
      input.id,
    );

  if (!result) {
    throw new Error(
      "Failed to load updated menu item.",
    );
  }

  return result;
}

/* ============================================================
   DELETE
============================================================ */

export async function deleteMenuItem(
  id: string,
): Promise<void> {
  const item =
    await prisma.menuItem.findUnique({
      where: {
        id,
      },
    });

  if (!item) {
    throw new Error(
      "Menu item not found.",
    );
  }

  const metadataMap =
    await getMetadataMap();

  const metadata =
    metadataMap[id];

  /*
   * System items remain protected.
   */
  if (
    metadata?.type === "System"
  ) {
    throw new Error(
      "System menu items cannot be deleted.",
    );
  }

  await prisma.menuItem.delete({
    where: {
      id,
    },
  });

  delete metadataMap[id];

  await saveMetadataMap(
    metadataMap,
  );

  /*
   * Close the position gap after deletion.
   */
  const remaining =
    await prisma.menuItem.findMany({
      where: {
        language: item.language,
      },
      orderBy: {
        position: "asc",
      },
    });

  await prisma.$transaction(
    remaining.map(
      (menuItem, index) =>
        prisma.menuItem.update({
          where: {
            id: menuItem.id,
          },
          data: {
            position: index,
          },
        }),
    ),
  );
}

/* ============================================================
   TOGGLE VISIBILITY
============================================================ */

export async function toggleMenuItemVisibility(
  id: string,
): Promise<MenuItemRecord> {
  const item =
    await prisma.menuItem.findUnique({
      where: {
        id,
      },
    });

  if (!item) {
    throw new Error(
      "Menu item not found.",
    );
  }

  await prisma.menuItem.update({
    where: {
      id,
    },
    data: {
      isVisible:
        !item.isVisible,
    },
  });

  const result =
    await getMenuItemById(id);

  if (!result) {
    throw new Error(
      "Failed to load menu item.",
    );
  }

  return result;
}

/* ============================================================
   REORDER
============================================================ */

export async function reorderMenuItems(
  ids: string[],
): Promise<MenuItemRecord[]> {
  if (!Array.isArray(ids)) {
    throw new Error(
      "Menu item IDs must be an array.",
    );
  }

  const items =
    await prisma.menuItem.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

  if (
    items.length !== ids.length
  ) {
    throw new Error(
      "One or more menu items could not be found.",
    );
  }

  const languages = new Set(
    items.map(
      (item) => item.language,
    ),
  );

  if (languages.size > 1) {
    throw new Error(
      "Menu items from different languages cannot be reordered together.",
    );
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.menuItem.update({
        where: {
          id,
        },
        data: {
          position: index,
        },
      }),
    ),
  );

  const language =
    items[0].language as MenuLanguage;

  return getMenuItems(language);
}

/* ============================================================
   SAVE COMPLETE MENU ORDER
============================================================ */

export async function saveMenuOrder(
  items: Array<{
    id: string;
    position: number;
  }>,
): Promise<void> {
  if (!Array.isArray(items)) {
    throw new Error(
      "Menu items must be an array.",
    );
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.menuItem.update({
        where: {
          id: item.id,
        },
        data: {
          position:
            item.position,
        },
      }),
    ),
  );
}
