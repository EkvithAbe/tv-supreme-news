// src/lib/data/site-config.ts

import { prisma } from "@/lib/prisma";

export const siteSettingKeys = {
  logoUrl: "site_logo_url",
  tagline: "site_tagline",

  facebook: "social_facebook",
  youtube: "social_youtube",
  instagram: "social_instagram",
  tiktok: "social_tiktok",
} as const;

export type SocialLinks = {
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
};

export type SiteConfig = {
  logoUrl: string;
  tagline: string;
  social: SocialLinks;
};

/*
 * Safe fallback values.
 *
 * These are only used when the corresponding
 * SiteSetting does not exist yet.
 *
 * Admin Settings values always take priority.
 */
const defaultSiteConfig: SiteConfig = {
  logoUrl: "/logo.png",

  tagline: "NEWS • PEOPLE • A BRIGHTER TOMORROW",

  social: {
    facebook:
      "https://www.facebook.com/tvsupremenews/",

    youtube:
      "https://www.youtube.com/@tvsupremenews",

    instagram:
      "https://www.instagram.com/tvsupremenews.lk/",

    tiktok:
      "https://www.tiktok.com/@tvsupremenews",
  },
};

export async function getSiteConfig(): Promise<SiteConfig> {
  const settings =
    await prisma.siteSetting.findMany({
      where: {
        key: {
          in: Object.values(siteSettingKeys),
        },
      },
    });

  const values = new Map(
    settings.map((setting) => [
      setting.key,
      setting.value,
    ])
  );

  return {
    logoUrl:
      values.get(
        siteSettingKeys.logoUrl
      )?.trim() ||
      defaultSiteConfig.logoUrl,

    tagline:
      values.get(
        siteSettingKeys.tagline
      )?.trim() ||
      defaultSiteConfig.tagline,

    social: {
      facebook:
        values.get(
          siteSettingKeys.facebook
        )?.trim() ||
        defaultSiteConfig.social.facebook,

      youtube:
        values.get(
          siteSettingKeys.youtube
        )?.trim() ||
        defaultSiteConfig.social.youtube,

      instagram:
        values.get(
          siteSettingKeys.instagram
        )?.trim() ||
        defaultSiteConfig.social.instagram,

      tiktok:
        values.get(
          siteSettingKeys.tiktok
        )?.trim() ||
        defaultSiteConfig.social.tiktok,
    },
  };
}