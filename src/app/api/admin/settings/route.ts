import { NextResponse } from "next/server";

import { requireAdminApiAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteSettingKeys } from "@/lib/data/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================================================
   TYPES
========================================================= */

type ThemeMode =
  | "Light"
  | "Dark"
  | "System";

type SettingsState = {
  siteName: string;
  tagline: string;
  websiteUrl: string;
  defaultLanguage: string;
  timezone: string;

  theme: ThemeMode;
  primaryColor: string;
  logoUrl: string;

  facebook: string;
  youtube: string;
  instagram: string;
  x: string;
  tiktok: string;

  metaTitle: string;
  metaDescription: string;
  keywords: string;

  maintenanceMode: boolean;
  commentsEnabled: boolean;
  analyticsEnabled: boolean;
  emailNotifications: boolean;
};

const defaultSettings: SettingsState = {
  siteName: "TV SUPREME",
  tagline:
    "Your trusted source for Sri Lankan and world news.",
  websiteUrl: "https://www.tvsupreme.lk",
  defaultLanguage: "English",
  timezone: "Asia/Colombo",

  theme: "System",
  primaryColor: "#EC008C",
  logoUrl: "/logo.png",

  facebook:
    "https://facebook.com/tvsupreme",
  youtube:
    "https://youtube.com/@tvsupreme",
  instagram:
    "https://instagram.com/tvsupreme",
  x: "https://x.com/tvsupreme",
  tiktok:
    "https://tiktok.com/@tvsupreme",

  metaTitle:
    "TV SUPREME | Sri Lanka News",
  metaDescription:
    "TV SUPREME delivers the latest Sri Lankan, world, political, business, sports, entertainment and technology news.",
  keywords:
    "Sri Lanka news, TV SUPREME, breaking news, world news, politics, business, sports",

  maintenanceMode: false,
  commentsEnabled: true,
  analyticsEnabled: true,
  emailNotifications: true,
};

/* =========================================================
   KEYS
========================================================= */

/*
 * Keep the public site-config keys for values that are already
 * consumed by the public header/footer.
 *
 * The remaining admin settings use dedicated SiteSetting keys.
 */
const keys = {
  siteName: "site_name",
  tagline: siteSettingKeys.tagline,
  websiteUrl: "website_url",
  defaultLanguage: "default_language",
  timezone: "timezone",

  theme: "site_theme",
  primaryColor: "primary_color",
  logoUrl: siteSettingKeys.logoUrl,

  facebook: siteSettingKeys.facebook,
  youtube: siteSettingKeys.youtube,
  instagram: siteSettingKeys.instagram,
  x: "social_x",
  tiktok: siteSettingKeys.tiktok,

  metaTitle: "meta_title",
  metaDescription:
    "meta_description",
  keywords: "meta_keywords",

  maintenanceMode:
    "maintenance_mode",
  commentsEnabled:
    "comments_enabled",
  analyticsEnabled:
    "analytics_enabled",
  emailNotifications:
    "email_notifications",
} as const;

const allKeys = Object.values(keys);

/* =========================================================
   HELPERS
========================================================= */

function parseBoolean(
  value: string | undefined,
  fallback: boolean,
) {
  if (value === undefined) {
    return fallback;
  }

  return value === "true";
}

function parseTheme(
  value: string | undefined,
): ThemeMode {
  if (
    value === "Light" ||
    value === "Dark" ||
    value === "System"
  ) {
    return value;
  }

  return defaultSettings.theme;
}

function buildSettings(
  rows: Array<{
    key: string;
    value: string;
  }>,
): SettingsState {
  const values = new Map(
    rows.map((row) => [
      row.key,
      row.value,
    ]),
  );

  return {
    siteName:
      values.get(keys.siteName) ??
      defaultSettings.siteName,

    tagline:
      values.get(keys.tagline) ??
      defaultSettings.tagline,

    websiteUrl:
      values.get(keys.websiteUrl) ??
      defaultSettings.websiteUrl,

    defaultLanguage:
      values.get(keys.defaultLanguage) ??
      defaultSettings.defaultLanguage,

    timezone:
      values.get(keys.timezone) ??
      defaultSettings.timezone,

    theme: parseTheme(
      values.get(keys.theme),
    ),

    primaryColor:
      values.get(keys.primaryColor) ??
      defaultSettings.primaryColor,

    logoUrl:
      values.get(keys.logoUrl) ??
      defaultSettings.logoUrl,

    facebook:
      values.get(keys.facebook) ??
      defaultSettings.facebook,

    youtube:
      values.get(keys.youtube) ??
      defaultSettings.youtube,

    instagram:
      values.get(keys.instagram) ??
      defaultSettings.instagram,

    x:
      values.get(keys.x) ??
      defaultSettings.x,

    tiktok:
      values.get(keys.tiktok) ??
      defaultSettings.tiktok,

    metaTitle:
      values.get(keys.metaTitle) ??
      defaultSettings.metaTitle,

    metaDescription:
      values.get(keys.metaDescription) ??
      defaultSettings.metaDescription,

    keywords:
      values.get(keys.keywords) ??
      defaultSettings.keywords,

    maintenanceMode:
      parseBoolean(
        values.get(
          keys.maintenanceMode,
        ),
        defaultSettings.maintenanceMode,
      ),

    commentsEnabled:
      parseBoolean(
        values.get(
          keys.commentsEnabled,
        ),
        defaultSettings.commentsEnabled,
      ),

    analyticsEnabled:
      parseBoolean(
        values.get(
          keys.analyticsEnabled,
        ),
        defaultSettings.analyticsEnabled,
      ),

    emailNotifications:
      parseBoolean(
        values.get(
          keys.emailNotifications,
        ),
        defaultSettings.emailNotifications,
      ),
  };
}

function cleanSettings(
  input: unknown,
): SettingsState {
  if (
    !input ||
    typeof input !== "object"
  ) {
    throw new Error(
      "Invalid settings payload.",
    );
  }

  const data =
    input as Record<
      string,
      unknown
    >;

  const theme =
    data.theme === "Light" ||
    data.theme === "Dark" ||
    data.theme === "System"
      ? data.theme
      : defaultSettings.theme;

  return {
    siteName:
      typeof data.siteName ===
      "string"
        ? data.siteName.trim()
        : defaultSettings.siteName,

    tagline:
      typeof data.tagline ===
      "string"
        ? data.tagline.trim()
        : defaultSettings.tagline,

    websiteUrl:
      typeof data.websiteUrl ===
      "string"
        ? data.websiteUrl.trim()
        : defaultSettings.websiteUrl,

    defaultLanguage:
      typeof data.defaultLanguage ===
      "string"
        ? data.defaultLanguage.trim()
        : defaultSettings.defaultLanguage,

    timezone:
      typeof data.timezone ===
      "string"
        ? data.timezone.trim()
        : defaultSettings.timezone,

    theme,

    primaryColor:
      typeof data.primaryColor ===
      "string"
        ? data.primaryColor.trim()
        : defaultSettings.primaryColor,

    logoUrl:
      typeof data.logoUrl ===
      "string"
        ? data.logoUrl.trim()
        : defaultSettings.logoUrl,

    facebook:
      typeof data.facebook ===
      "string"
        ? data.facebook.trim()
        : defaultSettings.facebook,

    youtube:
      typeof data.youtube ===
      "string"
        ? data.youtube.trim()
        : defaultSettings.youtube,

    instagram:
      typeof data.instagram ===
      "string"
        ? data.instagram.trim()
        : defaultSettings.instagram,

    x:
      typeof data.x ===
      "string"
        ? data.x.trim()
        : defaultSettings.x,

    tiktok:
      typeof data.tiktok ===
      "string"
        ? data.tiktok.trim()
        : defaultSettings.tiktok,

    metaTitle:
      typeof data.metaTitle ===
      "string"
        ? data.metaTitle.trim()
        : defaultSettings.metaTitle,

    metaDescription:
      typeof data.metaDescription ===
      "string"
        ? data.metaDescription.trim()
        : defaultSettings.metaDescription,

    keywords:
      typeof data.keywords ===
      "string"
        ? data.keywords.trim()
        : defaultSettings.keywords,

    maintenanceMode:
      typeof data.maintenanceMode ===
      "boolean"
        ? data.maintenanceMode
        : defaultSettings.maintenanceMode,

    commentsEnabled:
      typeof data.commentsEnabled ===
      "boolean"
        ? data.commentsEnabled
        : defaultSettings.commentsEnabled,

    analyticsEnabled:
      typeof data.analyticsEnabled ===
      "boolean"
        ? data.analyticsEnabled
        : defaultSettings.analyticsEnabled,

    emailNotifications:
      typeof data.emailNotifications ===
      "boolean"
        ? data.emailNotifications
        : defaultSettings.emailNotifications,
  };
}

function saveSetting(
  key: string,
  value: string,
) {
  return prisma.siteSetting.upsert({
    where: { key },
    create: {
      key,
      value,
    },
    update: {
      value,
    },
  });
}

/* =========================================================
   GET
========================================================= */

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const rows =
      await prisma.siteSetting.findMany({
        where: {
          key: {
            in: allKeys,
          },
        },
        select: {
          key: true,
          value: true,
        },
      });

    return NextResponse.json({
      success: true,
      settings: buildSettings(rows),
    });
  } catch (error) {
    console.error(
      "GET /api/admin/settings failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load settings.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   PUT
========================================================= */

export async function PUT(
  request: Request,
) {
  const access = await requireAdminApiAccess();

  if (access.response) {
    return access.response;
  }

  try {
    const body =
      await request.json();

    const settings =
      cleanSettings(body);

    await prisma.$transaction(
      allKeys.map((key) => {
        let value = "";

        switch (key) {
          case keys.siteName:
            value = settings.siteName;
            break;

          case keys.tagline:
            value = settings.tagline;
            break;

          case keys.websiteUrl:
            value = settings.websiteUrl;
            break;

          case keys.defaultLanguage:
            value =
              settings.defaultLanguage;
            break;

          case keys.timezone:
            value = settings.timezone;
            break;

          case keys.theme:
            value = settings.theme;
            break;

          case keys.primaryColor:
            value =
              settings.primaryColor;
            break;

          case keys.logoUrl:
            value = settings.logoUrl;
            break;

          case keys.facebook:
            value = settings.facebook;
            break;

          case keys.youtube:
            value = settings.youtube;
            break;

          case keys.instagram:
            value = settings.instagram;
            break;

          case keys.x:
            value = settings.x;
            break;

          case keys.tiktok:
            value = settings.tiktok;
            break;

          case keys.metaTitle:
            value = settings.metaTitle;
            break;

          case keys.metaDescription:
            value =
              settings.metaDescription;
            break;

          case keys.keywords:
            value = settings.keywords;
            break;

          case keys.maintenanceMode:
            value = String(
              settings.maintenanceMode,
            );
            break;

          case keys.commentsEnabled:
            value = String(
              settings.commentsEnabled,
            );
            break;

          case keys.analyticsEnabled:
            value = String(
              settings.analyticsEnabled,
            );
            break;

          case keys.emailNotifications:
            value = String(
              settings.emailNotifications,
            );
            break;
        }

        return saveSetting(
          key,
          value,
        );
      }),
    );

    const rows =
      await prisma.siteSetting.findMany({
        where: {
          key: {
            in: allKeys,
          },
        },
        select: {
          key: true,
          value: true,
        },
      });

    return NextResponse.json({
      success: true,
      settings: buildSettings(rows),
      message:
        "Settings saved successfully.",
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/settings failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save settings.",
      },
      { status: 500 },
    );
  }
}
