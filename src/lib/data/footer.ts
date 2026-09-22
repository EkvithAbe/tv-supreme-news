// src/lib/data/footer.ts

import { prisma } from "@/lib/prisma";
import {
  getSiteConfig,
  siteSettingKeys,
  type SocialLinks,
} from "@/lib/data/site-config";

/* =========================================================
   TYPES
========================================================= */

export const footerLanguages = [
  "EN",
  "SI",
  "TA",
] as const;

export type FooterLanguage =
  (typeof footerLanguages)[number];

export type FooterLinkLabels = {
  EN: string;
  SI: string;
  TA: string;
};

export type FooterLink = {
  id: string;
  labels: FooterLinkLabels;
  href: string;
  position: number;
  isVisible: boolean;
  openNewTab: boolean;
};

export type FooterSettings = {
  logoUrl: string;
  tagline: string;
  description: string;

  telephone: string;
  address: string;
  mapUrl: string;

  copyrightText: string;

  social: SocialLinks;

  links: FooterLink[];
};

/* =========================================================
   SITE SETTING KEYS
========================================================= */

export const footerSettingKeys = {
  description: "footer_description",
  telephone: "footer_telephone",
  address: "footer_address",
  mapUrl: "footer_map_url",
  copyrightText: "footer_copyright_text",
  menu: "footer_menu",
} as const;

/* =========================================================
   DEFAULT FOOTER LINKS
   These are bootstrap defaults only.
   Once saved through Admin, MySQL becomes the source
   of truth.
========================================================= */

const defaultFooterLinks: FooterLink[] = [
  {
    id: "footer-about",
    labels: {
      EN: "About Us",
      SI: "",
      TA: "",
    },
    href: "/about",
    position: 0,
    isVisible: true,
    openNewTab: false,
  },

  {
    id: "footer-contact",
    labels: {
      EN: "Contact Us",
      SI: "",
      TA: "",
    },
    href: "/contact",
    position: 1,
    isVisible: true,
    openNewTab: false,
  },

  {
    id: "footer-advertise",
    labels: {
      EN: "Advertise",
      SI: "",
      TA: "",
    },
    href: "/advertise",
    position: 2,
    isVisible: true,
    openNewTab: false,
  },

  {
    id: "footer-privacy",
    labels: {
      EN: "Privacy Policy",
      SI: "",
      TA: "",
    },
    href: "/legal/privacy-policy",
    position: 3,
    isVisible: true,
    openNewTab: false,
  },

  {
    id: "footer-terms",
    labels: {
      EN: "Terms of Use",
      SI: "",
      TA: "",
    },
    href: "/legal/terms-of-use",
    position: 4,
    isVisible: true,
    openNewTab: false,
  },
];

/* =========================================================
   DEFAULT FOOTER CONTENT
========================================================= */

const defaultFooterContent = {
  description:
    "TV SUPREME brings you real news, real people and stories that matter. Stay informed with the latest developments from Sri Lanka and around the world.",

  telephone:
    "+94 11 2330 433",

  address:
    "No. 58, Srimath Anagarika Dharmapala Mw, Colombo 07",

  mapUrl:
    "https://maps.app.goo.gl/dtFoQi9TEwfrqhJE7",

  copyrightText:
    "© 2026 TV SUPREME. All Rights Reserved.",
};

/* =========================================================
   HELPERS
========================================================= */

function isFooterLanguage(
  value: string,
): value is FooterLanguage {
  return footerLanguages.includes(
    value as FooterLanguage,
  );
}

function safeString(
  value: unknown,
  fallback = "",
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

function normalizeHref(
  value: string,
): string {
  const href = value.trim();

  if (!href) {
    return "";
  }

  if (
    href.startsWith("/") ||
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href) ||
    /^tel:/i.test(href)
  ) {
    return href;
  }

  return `/${href}`;
}

function normalizeFooterLink(
  value: unknown,
  index: number,
): FooterLink | null {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const raw =
    value as Record<
      string,
      unknown
    >;

  const rawLabels =
    raw.labels &&
    typeof raw.labels ===
      "object"
      ? (raw.labels as Record<
          string,
          unknown
        >)
      : {};

  const href = normalizeHref(
    safeString(
      raw.href,
    ),
  );

  if (!href) {
    return null;
  }

  const id =
    safeString(
      raw.id,
    ) ||
    `footer-link-${index + 1}`;

  const position =
    typeof raw.position ===
      "number" &&
    Number.isFinite(
      raw.position,
    )
      ? raw.position
      : index;

  return {
    id,

    labels: {
      EN: safeString(
        rawLabels.EN,
      ),
      SI: safeString(
        rawLabels.SI,
      ),
      TA: safeString(
        rawLabels.TA,
      ),
    },

    href,

    position,

    isVisible:
      raw.isVisible !==
      false,

    openNewTab:
      raw.openNewTab ===
      true,
  };
}

function parseFooterLinks(
  value: string | undefined,
): FooterLink[] {
  if (!value) {
    return defaultFooterLinks;
  }

  try {
    const parsed =
      JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return defaultFooterLinks;
    }

    const links = parsed
      .map(
        (
          item,
          index,
        ) =>
          normalizeFooterLink(
            item,
            index,
          ),
      )
      .filter(
        (
          item,
        ): item is FooterLink =>
          item !== null,
      )
      .sort(
        (a, b) =>
          a.position -
          b.position,
      )
      .map(
        (
          item,
          index,
        ) => ({
          ...item,
          position:
            index,
        }),
      );

    return links;
  } catch (error) {
    console.error(
      "Failed to parse footer menu:",
      error,
    );

    return defaultFooterLinks;
  }
}

function serializeFooterLinks(
  links: FooterLink[],
): string {
  const normalized =
    links
      .map(
        (
          link,
          index,
        ) => ({
          ...link,
          href: normalizeHref(
            link.href,
          ),
          position:
            index,
        }),
      )
      .filter(
        (link) =>
          Boolean(
            link.href,
          ),
      );

  return JSON.stringify(
    normalized,
  );
}

function getLocalizedLabel(
  link: FooterLink,
  language: FooterLanguage,
): string {
  const localized =
    link.labels[
      language
    ]?.trim();

  if (localized) {
    return localized;
  }

  /*
   * Safe fallback:
   * Sinhala/Tamil uses English until the
   * administrator enters the translation.
   */
  return (
    link.labels.EN ||
    ""
  );
}

/* =========================================================
   GET ALL FOOTER SETTINGS
========================================================= */

export async function getFooterSettings(): Promise<FooterSettings> {
  const [
    settings,
    siteConfig,
  ] = await Promise.all([
    prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            footerSettingKeys.description,
            footerSettingKeys.telephone,
            footerSettingKeys.address,
            footerSettingKeys.mapUrl,
            footerSettingKeys.copyrightText,
            footerSettingKeys.menu,
          ],
        },
      },
    }),

    getSiteConfig(),
  ]);

  const values = new Map(
    settings.map(
      (
        setting,
      ) => [
        setting.key,
        setting.value,
      ],
    ),
  );

  const links =
    parseFooterLinks(
      values.get(
        footerSettingKeys.menu,
      ),
    );

  return {
    logoUrl:
      siteConfig.logoUrl ||
      "/logo.png",

    tagline:
      siteConfig.tagline ||
      "NEWS • PEOPLE • A BRIGHTER TOMORROW",

    description:
      values.get(
        footerSettingKeys.description,
      ) ||
      defaultFooterContent.description,

    telephone:
      values.get(
        footerSettingKeys.telephone,
      ) ||
      defaultFooterContent.telephone,

    address:
      values.get(
        footerSettingKeys.address,
      ) ||
      defaultFooterContent.address,

    mapUrl:
      values.get(
        footerSettingKeys.mapUrl,
      ) ||
      defaultFooterContent.mapUrl,

    copyrightText:
      values.get(
        footerSettingKeys.copyrightText,
      ) ||
      defaultFooterContent.copyrightText,

    social:
      siteConfig.social,

    links,
  };
}

/* =========================================================
   GET FOOTER FOR ONE LANGUAGE
========================================================= */

export async function getFooterForLanguage(
  language: FooterLanguage = "EN",
) {
  const settings =
    await getFooterSettings();

  return {
    ...settings,

    language,

    links:
      settings.links
        .filter(
          (link) =>
            link.isVisible,
        )
        .sort(
          (a, b) =>
            a.position -
            b.position,
        )
        .map(
          (link) => ({
            id: link.id,

            label:
              getLocalizedLabel(
                link,
                language,
              ),

            href: link.href,

            position:
              link.position,

            openNewTab:
              link.openNewTab,
          }),
        ),
  };
}

/* =========================================================
   SAVE FOOTER SETTINGS
========================================================= */

export type SaveFooterSettingsInput = {
  description?: string;
  telephone?: string;
  address?: string;
  mapUrl?: string;
  copyrightText?: string;

  logoUrl?: string;
  tagline?: string;

  social?: Partial<SocialLinks>;

  links?: FooterLink[];
};

export async function saveFooterSettings(
  input: SaveFooterSettingsInput,
): Promise<FooterSettings> {
  const current =
    await getFooterSettings();

  const links =
    input.links
      ? input.links
          .map(
            (
              link,
              index,
            ) => ({
              ...link,

              id:
                safeString(
                  link.id,
                ) ||
                `footer-link-${index + 1}`,

              href:
                normalizeHref(
                  link.href,
                ),

              position:
                index,

              labels: {
                EN:
                  safeString(
                    link.labels.EN,
                  ),

                SI:
                  safeString(
                    link.labels.SI,
                  ),

                TA:
                  safeString(
                    link.labels.TA,
                  ),
              },
            }),
          )
          .filter(
            (link) =>
              Boolean(
                link.href,
              ),
          )
      : current.links;

  /*
   * Footer-specific settings
   */
  await Promise.all([
    prisma.siteSetting.upsert({
      where: {
        key: footerSettingKeys.description,
      },

      create: {
        key:
          footerSettingKeys.description,

        value:
          input.description ??
          current.description,
      },

      update: {
        value:
          input.description ??
          current.description,
      },
    }),

    prisma.siteSetting.upsert({
      where: {
        key: footerSettingKeys.telephone,
      },

      create: {
        key:
          footerSettingKeys.telephone,

        value:
          input.telephone ??
          current.telephone,
      },

      update: {
        value:
          input.telephone ??
          current.telephone,
      },
    }),

    prisma.siteSetting.upsert({
      where: {
        key: footerSettingKeys.address,
      },

      create: {
        key:
          footerSettingKeys.address,

        value:
          input.address ??
          current.address,
      },

      update: {
        value:
          input.address ??
          current.address,
      },
    }),

    prisma.siteSetting.upsert({
      where: {
        key: footerSettingKeys.mapUrl,
      },

      create: {
        key:
          footerSettingKeys.mapUrl,

        value:
          input.mapUrl ??
          current.mapUrl,
      },

      update: {
        value:
          input.mapUrl ??
          current.mapUrl,
      },
    }),

    prisma.siteSetting.upsert({
      where: {
        key:
          footerSettingKeys.copyrightText,
      },

      create: {
        key:
          footerSettingKeys.copyrightText,

        value:
          input.copyrightText ??
          current.copyrightText,
      },

      update: {
        value:
          input.copyrightText ??
          current.copyrightText,
      },
    }),

    prisma.siteSetting.upsert({
      where: {
        key:
          footerSettingKeys.menu,
      },

      create: {
        key:
          footerSettingKeys.menu,

        value:
          serializeFooterLinks(
            links,
          ),
      },

      update: {
        value:
          serializeFooterLinks(
            links,
          ),
      },
    }),
  ]);

  /*
   * General site settings
   */
  const siteUpdates: Promise<unknown>[] =
    [];

  if (
    input.logoUrl !==
    undefined
  ) {
    siteUpdates.push(
      prisma.siteSetting.upsert({
        where: {
          key:
            siteSettingKeys.logoUrl,
        },

        create: {
          key:
            siteSettingKeys.logoUrl,

          value:
            safeString(
              input.logoUrl,
            ),
        },

        update: {
          value:
            safeString(
              input.logoUrl,
            ),
        },
      }),
    );
  }

  if (
    input.tagline !==
    undefined
  ) {
    siteUpdates.push(
      prisma.siteSetting.upsert({
        where: {
          key:
            siteSettingKeys.tagline,
        },

        create: {
          key:
            siteSettingKeys.tagline,

          value:
            safeString(
              input.tagline,
            ),
        },

        update: {
          value:
            safeString(
              input.tagline,
            ),
        },
      }),
    );
  }

  if (
    input.social
  ) {
    const social =
      input.social;

    if (
      social.facebook !==
      undefined
    ) {
      siteUpdates.push(
        prisma.siteSetting.upsert({
          where: {
            key:
              siteSettingKeys.facebook,
          },

          create: {
            key:
              siteSettingKeys.facebook,

            value:
              safeString(
                social.facebook,
              ),
          },

          update: {
            value:
              safeString(
                social.facebook,
              ),
          },
        }),
      );
    }

    if (
      social.youtube !==
      undefined
    ) {
      siteUpdates.push(
        prisma.siteSetting.upsert({
          where: {
            key:
              siteSettingKeys.youtube,
          },

          create: {
            key:
              siteSettingKeys.youtube,

            value:
              safeString(
                social.youtube,
              ),
          },

          update: {
            value:
              safeString(
                social.youtube,
              ),
          },
        }),
      );
    }

    if (
      social.instagram !==
      undefined
    ) {
      siteUpdates.push(
        prisma.siteSetting.upsert({
          where: {
            key:
              siteSettingKeys.instagram,
          },

          create: {
            key:
              siteSettingKeys.instagram,

            value:
              safeString(
                social.instagram,
              ),
          },

          update: {
            value:
              safeString(
                social.instagram,
              ),
          },
        }),
      );
    }

    if (
      social.tiktok !==
      undefined
    ) {
      siteUpdates.push(
        prisma.siteSetting.upsert({
          where: {
            key:
              siteSettingKeys.tiktok,
          },

          create: {
            key:
              siteSettingKeys.tiktok,

            value:
              safeString(
                social.tiktok,
              ),
          },

          update: {
            value:
              safeString(
                social.tiktok,
              ),
          },
        }),
      );
    }
  }

  if (
    siteUpdates.length >
    0
  ) {
    await Promise.all(
      siteUpdates,
    );
  }

  return getFooterSettings();
}

/* =========================================================
   CREATE FOOTER LINK
========================================================= */

export type CreateFooterLinkInput = {
  labels?: Partial<FooterLinkLabels>;
  href: string;
  isVisible?: boolean;
  openNewTab?: boolean;
};

export async function createFooterLink(
  input: CreateFooterLinkInput,
): Promise<FooterLink> {
  const current =
    await getFooterSettings();

  const newLink: FooterLink = {
    id: `footer-${Date.now()}`,

    labels: {
      EN:
        safeString(
          input.labels?.EN,
        ),

      SI:
        safeString(
          input.labels?.SI,
        ),

      TA:
        safeString(
          input.labels?.TA,
        ),
    },

    href:
      normalizeHref(
        input.href,
      ),

    position:
      current.links.length,

    isVisible:
      input.isVisible !==
      false,

    openNewTab:
      input.openNewTab ===
      true,
  };

  if (!newLink.href) {
    throw new Error(
      "Footer link URL is required.",
    );
  }

  await saveFooterSettings({
    links: [
      ...current.links,
      newLink,
    ],
  });

  return newLink;
}

/* =========================================================
   UPDATE FOOTER LINK
========================================================= */

export type UpdateFooterLinkInput =
  FooterLink;

export async function updateFooterLink(
  input: UpdateFooterLinkInput,
): Promise<FooterLink> {
  const current =
    await getFooterSettings();

  const index =
    current.links.findIndex(
      (link) =>
        link.id ===
        input.id,
    );

  if (index === -1) {
    throw new Error(
      "Footer link not found.",
    );
  }

  const updated: FooterLink = {
    ...input,

    href:
      normalizeHref(
        input.href,
      ),

    labels: {
      EN:
        safeString(
          input.labels.EN,
        ),

      SI:
        safeString(
          input.labels.SI,
        ),

      TA:
        safeString(
          input.labels.TA,
        ),
    },

    position:
      index,
  };

  if (!updated.href) {
    throw new Error(
      "Footer link URL is required.",
    );
  }

  const nextLinks =
    [...current.links];

  nextLinks[index] =
    updated;

  await saveFooterSettings({
    links:
      nextLinks,
  });

  return updated;
}

/* =========================================================
   DELETE FOOTER LINK
========================================================= */

export async function deleteFooterLink(
  id: string,
): Promise<void> {
  const current =
    await getFooterSettings();

  const filtered =
    current.links
      .filter(
        (link) =>
          link.id !==
          id,
      )
      .map(
        (
          link,
          position,
        ) => ({
          ...link,
          position,
        }),
      );

  if (
    filtered.length ===
    current.links.length
  ) {
    throw new Error(
      "Footer link not found.",
    );
  }

  await saveFooterSettings({
    links:
      filtered,
  });
}

/* =========================================================
   TOGGLE FOOTER LINK
========================================================= */

export async function toggleFooterLink(
  id: string,
): Promise<FooterLink> {
  const current =
    await getFooterSettings();

  const link =
    current.links.find(
      (item) =>
        item.id ===
        id,
    );

  if (!link) {
    throw new Error(
      "Footer link not found.",
    );
  }

  const updated = {
    ...link,
    isVisible:
      !link.isVisible,
  };

  await updateFooterLink(
    updated,
  );

  return updated;
}

/* =========================================================
   REORDER FOOTER LINKS
========================================================= */

export async function reorderFooterLinks(
  ids: string[],
): Promise<FooterLink[]> {
  const current =
    await getFooterSettings();

  const linkMap =
    new Map(
      current.links.map(
        (link) => [
          link.id,
          link,
        ],
      ),
    );

  const ordered: FooterLink[] =
    [];

  for (const id of ids) {
    const link =
      linkMap.get(id);

    if (link) {
      ordered.push(link);
      linkMap.delete(id);
    }
  }

  /*
   * Preserve anything not included in the
   * requested ordering.
   */
  for (const link of linkMap.values()) {
    ordered.push(link);
  }

  const normalized =
    ordered.map(
      (
        link,
        position,
      ) => ({
        ...link,
        position,
      }),
    );

  await saveFooterSettings({
    links:
      normalized,
  });

  return normalized;
}