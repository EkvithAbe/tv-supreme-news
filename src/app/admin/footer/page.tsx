"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Globe2,
  GripVertical,
  Image as ImageIcon,
  Languages,
  Link2,
  MapPin,
  Menu as MenuIcon,
  Music2,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type FooterLanguage =
  | "EN"
  | "SI"
  | "TA";

type FooterLinkLabels = {
  EN: string;
  SI: string;
  TA: string;
};

type FooterLink = {
  id: string;
  labels: FooterLinkLabels;
  href: string;
  position: number;
  isVisible: boolean;
  openNewTab: boolean;
};

type SocialLinks = {
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
};

type FooterSettings = {
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

type FooterApiResponse = {
  success: boolean;
  footer?: FooterSettings;
  language?: FooterLanguage;
  message?: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const languages = [
  {
    code: "EN" as FooterLanguage,
    name: "English",
    nativeName: "English",
  },
  {
    code: "SI" as FooterLanguage,
    name: "Sinhala",
    nativeName: "සිංහල",
  },
  {
    code: "TA" as FooterLanguage,
    name: "Tamil",
    nativeName: "தமிழ்",
  },
];

const defaultFooterSettings: FooterSettings = {
  logoUrl: "/logo.png",

  tagline:
    "NEWS • PEOPLE • A BRIGHTER TOMORROW",

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

  links: [
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
  ],
};

/* =========================================================
   HELPERS
========================================================= */

function cloneSettings(
  settings: FooterSettings,
): FooterSettings {
  return {
    ...settings,

    social: {
      ...settings.social,
    },

    links: settings.links.map(
      (link) => ({
        ...link,

        labels: {
          ...link.labels,
        },
      }),
    ),
  };
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

function getLanguageName(
  language: FooterLanguage,
): string {
  return (
    languages.find(
      (item) =>
        item.code === language,
    )?.name ?? language
  );
}

function getLanguageNativeName(
  language: FooterLanguage,
): string {
  return (
    languages.find(
      (item) =>
        item.code === language,
    )?.nativeName ?? language
  );
}

function getLocalizedLabel(
  link: FooterLink,
  language: FooterLanguage,
): string {
  const translated =
    link.labels[
      language
    ]?.trim();

  if (translated) {
    return translated;
  }

  return (
    link.labels.EN?.trim() ||
    ""
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function FooterAdminPage() {
  /* =======================================================
     MAIN STATE
  ======================================================== */

  const [
    settings,
    setSettings,
  ] = useState<FooterSettings>(
    cloneSettings(
      defaultFooterSettings,
    ),
  );

  const [
    savedSettings,
    setSavedSettings,
  ] = useState<FooterSettings>(
    cloneSettings(
      defaultFooterSettings,
    ),
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =======================================================
     UI STATE
  ======================================================== */

  const [
    activeLanguage,
    setActiveLanguage,
  ] = useState<FooterLanguage>(
    "EN",
  );

  const [
    showLinkModal,
    setShowLinkModal,
  ] = useState(false);

  const [
    editingLink,
    setEditingLink,
  ] = useState<FooterLink | null>(
    null,
  );

  const [
    linkForm,
    setLinkForm,
  ] = useState<FooterLink>({
    id: "",
    labels: {
      EN: "",
      SI: "",
      TA: "",
    },
    href: "",
    position: 0,
    isVisible: true,
    openNewTab: false,
  });

  /* =======================================================
     UNSAVED CHANGES
  ======================================================== */

  const hasUnsavedChanges =
    useMemo(
      () =>
        JSON.stringify(
          settings,
        ) !==
        JSON.stringify(
          savedSettings,
        ),
      [settings, savedSettings],
    );

  /* =======================================================
     LOAD FOOTER
  ======================================================== */

  const loadFooter =
    useCallback(
      async () => {
        try {
          setIsLoading(true);
          setError("");

          const response =
            await fetch(
              "/api/admin/footer",
              {
                method: "GET",
                cache: "no-store",
              },
            );

          const data: FooterApiResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success ||
            !data.footer
          ) {
            throw new Error(
              data.message ||
                "Failed to load footer settings.",
            );
          }

          const loaded =
            cloneSettings(
              data.footer,
            );

          setSettings(
            loaded,
          );

          setSavedSettings(
            cloneSettings(
              loaded,
            ),
          );
        } catch (loadError) {
          console.error(
            "Failed to load footer:",
            loadError,
          );

          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Failed to load footer settings.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadFooter();
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [loadFooter]);

  /* =======================================================
     UPDATE SETTINGS
  ======================================================== */

  const updateSettings =
    <K extends keyof FooterSettings>(
      key: K,
      value: FooterSettings[K],
    ) => {
      setSettings(
        (current) => ({
          ...current,
          [key]: value,
        }),
      );

      setSuccessMessage("");
    };

  /* =======================================================
     UPDATE SOCIAL
  ======================================================== */

  const updateSocial = (
    key: keyof SocialLinks,
    value: string,
  ) => {
    setSettings(
      (current) => ({
        ...current,

        social: {
          ...current.social,
          [key]: value,
        },
      }),
    );

    setSuccessMessage("");
  };

  /* =======================================================
     SAVE ALL
  ======================================================== */

  const saveFooter =
    async () => {
      try {
        setIsSaving(true);
        setError("");
        setSuccessMessage("");

        const payload: FooterSettings =
          {
            ...settings,

            logoUrl:
              settings.logoUrl.trim(),

            tagline:
              settings.tagline.trim(),

            description:
              settings.description.trim(),

            telephone:
              settings.telephone.trim(),

            address:
              settings.address.trim(),

            mapUrl:
              settings.mapUrl.trim(),

            copyrightText:
              settings.copyrightText.trim(),

            social: {
              facebook:
                settings.social.facebook.trim(),

              youtube:
                settings.social.youtube.trim(),

              instagram:
                settings.social.instagram.trim(),

              tiktok:
                settings.social.tiktok.trim(),
            },

            links:
              settings.links.map(
                (
                  link,
                  position,
                ) => ({
                  ...link,

                  href:
                    normalizeHref(
                      link.href,
                    ),

                  position,

                  labels: {
                    EN:
                      link.labels.EN.trim(),

                    SI:
                      link.labels.SI.trim(),

                    TA:
                      link.labels.TA.trim(),
                  },
                }),
              ),
          };

        const response =
          await fetch(
            "/api/admin/footer",
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                payload,
              ),
            },
          );

        const data: FooterApiResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.footer
        ) {
          throw new Error(
            data.message ||
              "Failed to save footer settings.",
          );
        }

        const saved =
          cloneSettings(
            data.footer,
          );

        setSettings(
          saved,
        );

        setSavedSettings(
          cloneSettings(
            saved,
          ),
        );

        setSuccessMessage(
          "Footer settings saved successfully.",
        );
      } catch (saveError) {
        console.error(
          "Failed to save footer:",
          saveError,
        );

        setError(
          saveError instanceof
            Error
            ? saveError.message
            : "Failed to save footer settings.",
        );
      } finally {
        setIsSaving(false);
      }
    };

  /* =======================================================
     ADD LINK
  ======================================================== */

  const openAddLink =
    () => {
      setError("");
      setSuccessMessage("");

      setEditingLink(null);

      setLinkForm({
        id: `footer-${Date.now()}`,
        labels: {
          EN: "",
          SI: "",
          TA: "",
        },
        href: "",
        position:
          settings.links.length,
        isVisible: true,
        openNewTab: false,
      });

      setShowLinkModal(
        true,
      );
    };

  /* =======================================================
     EDIT LINK
  ======================================================== */

  const openEditLink =
    (link: FooterLink) => {
      setError("");
      setSuccessMessage("");

      setEditingLink(
        link,
      );

      setLinkForm({
        ...link,

        labels: {
          ...link.labels,
        },
      });

      setShowLinkModal(
        true,
      );
    };

  /* =======================================================
     CLOSE LINK MODAL
  ======================================================== */

  const closeLinkModal =
    () => {
      if (isSaving) {
        return;
      }

      setShowLinkModal(
        false,
      );

      setEditingLink(null);
    };

  /* =======================================================
     SAVE LINK MODAL
  ======================================================== */

  const saveLink =
    () => {
      const cleanHref =
        normalizeHref(
          linkForm.href,
        );

      const cleanLabels: FooterLinkLabels =
        {
          EN:
            linkForm.labels.EN.trim(),

          SI:
            linkForm.labels.SI.trim(),

          TA:
            linkForm.labels.TA.trim(),
        };

      if (!cleanLabels.EN) {
        setError(
          "English footer link label is required.",
        );
        return;
      }

      if (!cleanHref) {
        setError(
          "Footer link URL is required.",
        );
        return;
      }

      const normalizedLink: FooterLink =
        {
          ...linkForm,

          href: cleanHref,

          labels:
            cleanLabels,
        };

      setSettings(
        (current) => {
          let nextLinks: FooterLink[];

          if (editingLink) {
            nextLinks =
              current.links.map(
                (link) =>
                  link.id ===
                  editingLink.id
                    ? normalizedLink
                    : link,
              );
          } else {
            nextLinks = [
              ...current.links,
              normalizedLink,
            ];
          }

          return {
            ...current,

            links:
              nextLinks.map(
                (
                  link,
                  position,
                ) => ({
                  ...link,
                  position,
                }),
              ),
          };
        },
      );

      setShowLinkModal(
        false,
      );

      setEditingLink(null);

      setSuccessMessage(
        editingLink
          ? "Footer link updated locally. Click Save Footer to publish the change."
          : "Footer link added locally. Click Save Footer to publish the change.",
      );
    };

  /* =======================================================
     DELETE LINK
  ======================================================== */

  const deleteLink =
    (link: FooterLink) => {
      const confirmed =
        window.confirm(
          `Remove "${link.labels.EN}" from the footer?`,
        );

      if (!confirmed) {
        return;
      }

      setSettings(
        (current) => ({
          ...current,

          links:
            current.links
              .filter(
                (item) =>
                  item.id !==
                  link.id,
              )
              .map(
                (
                  item,
                  position,
                ) => ({
                  ...item,
                  position,
                }),
              ),
        }),
      );

      setSuccessMessage(
        "Footer link removed locally. Click Save Footer to publish the change.",
      );
    };

  /* =======================================================
     TOGGLE LINK
  ======================================================== */

  const toggleLink =
    (linkId: string) => {
      setSettings(
        (current) => ({
          ...current,

          links:
            current.links.map(
              (link) =>
                link.id ===
                linkId
                  ? {
                      ...link,
                      isVisible:
                        !link.isVisible,
                    }
                  : link,
            ),
        }),
      );

      setSuccessMessage("");
    };

  /* =======================================================
     MOVE LINK
  ======================================================== */

  const moveLink =
    (
      linkId: string,
      direction: "up" | "down",
    ) => {
      setSettings(
        (current) => {
          const links =
            [...current.links].sort(
              (a, b) =>
                a.position -
                b.position,
            );

          const index =
            links.findIndex(
              (link) =>
                link.id ===
                linkId,
            );

          if (index === -1) {
            return current;
          }

          const targetIndex =
            direction ===
            "up"
              ? index - 1
              : index + 1;

          if (
            targetIndex <
              0 ||
            targetIndex >=
              links.length
          ) {
            return current;
          }

          const temp =
            links[index];

          links[index] =
            links[
              targetIndex
            ];

          links[
            targetIndex
          ] = temp;

          return {
            ...current,

            links:
              links.map(
                (
                  link,
                  position,
                ) => ({
                  ...link,
                  position,
                }),
              ),
          };
        },
      );

      setSuccessMessage("");
    };

  /* =======================================================
     LANGUAGE COMPLETENESS
  ======================================================== */

  const translationStats =
    useMemo(() => {
      const total =
        settings.links.length;

      const si =
        settings.links.filter(
          (link) =>
            link.labels.SI.trim()
              .length > 0,
        ).length;

      const ta =
        settings.links.filter(
          (link) =>
            link.labels.TA.trim()
              .length > 0,
        ).length;

      return {
        total,
        si,
        ta,
      };
    }, [settings.links]);

  /* =======================================================
     ACTIVE LANGUAGE LINKS
  ======================================================== */

  const displayedLinks =
    useMemo(() => {
      return [
        ...settings.links,
      ].sort(
        (a, b) =>
          a.position -
          b.position,
      );
    }, [settings.links]);

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

        <div>

          <p className="text-sm font-semibold text-pink-600">
            Website Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Footer
          </h1>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the public TV SUPREME
            footer, contact information,
            social media and multilingual
            footer navigation.
          </p>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              void loadFooter()
            }
            disabled={
              isLoading ||
              isSaving
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isLoading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              void saveFooter()
            }
            disabled={
              isLoading ||
              isSaving ||
              !hasUnsavedChanges
            }
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Save
                  size={17}
                />
                Save Footer
              </>
            )}

          </button>

        </div>

      </div>

      {/* =====================================================
          UNSAVED INDICATOR
      ====================================================== */}

      {hasUnsavedChanges && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          You have unsaved footer changes.
          Click <strong>Save Footer</strong>{" "}
          to publish them.
        </div>
      )}

      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {/* =====================================================
          LANGUAGE OVERVIEW
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Languages
                size={20}
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Footer Languages
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage the same footer
                navigation across English,
                Sinhala and Tamil.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-2">

            <LanguageCard
              code="EN"
              title="English"
              value={
                translationStats.total
              }
              total={
                translationStats.total
              }
              active={
                activeLanguage ===
                "EN"
              }
              onClick={() =>
                setActiveLanguage(
                  "EN",
                )
              }
            />

            <LanguageCard
              code="SI"
              title="Sinhala"
              value={
                translationStats.si
              }
              total={
                translationStats.total
              }
              active={
                activeLanguage ===
                "SI"
              }
              onClick={() =>
                setActiveLanguage(
                  "SI",
                )
              }
            />

            <LanguageCard
              code="TA"
              title="Tamil"
              value={
                translationStats.ta
              }
              total={
                translationStats.total
              }
              active={
                activeLanguage ===
                "TA"
              }
              onClick={() =>
                setActiveLanguage(
                  "TA",
                )
              }
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          GENERAL FOOTER SETTINGS
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <MenuIcon
                size={19}
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Footer Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Control the information
                displayed beside the footer
                navigation.
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-2">

          {/* =================================================
              LOGO
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Logo URL
            </label>

            <div className="flex gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {settings.logoUrl ? (
                  <img
                    src={
                      settings.logoUrl
                    }
                    alt="Footer logo preview"
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <ImageIcon
                    size={19}
                    className="text-slate-400"
                  />
                )}
              </div>

              <input
                type="text"
                value={
                  settings.logoUrl
                }
                onChange={(
                  event,
                ) =>
                  updateSettings(
                    "logoUrl",
                    event.target
                      .value,
                  )
                }
                placeholder="/logo.png"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Recommended:
              <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5">
                /logo.png
              </code>
            </p>

          </div>

          {/* =================================================
              TAGLINE
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tagline
            </label>

            <input
              type="text"
              value={
                settings.tagline
              }
              onChange={(
                event,
              ) =>
                updateSettings(
                  "tagline",
                  event.target
                    .value,
                )
              }
              placeholder="NEWS • PEOPLE • A BRIGHTER TOMORROW"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            />

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <div className="lg:col-span-2">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Footer Description
            </label>

            <textarea
              rows={4}
              value={
                settings.description
              }
              onChange={(
                event,
              ) =>
                updateSettings(
                  "description",
                  event.target
                    .value,
                )
              }
              placeholder="Describe TV SUPREME..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            />

          </div>

          {/* =================================================
              TELEPHONE
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Telephone
            </label>

            <div className="relative">

              <Phone
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={
                  settings.telephone
                }
                onChange={(
                  event,
                ) =>
                  updateSettings(
                    "telephone",
                    event.target
                      .value,
                  )
                }
                placeholder="+94 11 2330 433"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
              />

            </div>

          </div>

          {/* =================================================
              COPYRIGHT
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Copyright Text
            </label>

            <input
              type="text"
              value={
                settings.copyrightText
              }
              onChange={(
                event,
              ) =>
                updateSettings(
                  "copyrightText",
                  event.target
                    .value,
                )
              }
              placeholder="© 2026 TV SUPREME. All Rights Reserved."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            />

          </div>

          {/* =================================================
              ADDRESS
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Street Address
            </label>

            <textarea
              rows={3}
              value={
                settings.address
              }
              onChange={(
                event,
              ) =>
                updateSettings(
                  "address",
                  event.target
                    .value,
                )
              }
              placeholder="No. 58, Srimath Anagarika Dharmapala Mw, Colombo 07"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            />

          </div>

          {/* =================================================
              MAP
          ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Google Maps URL
            </label>

            <div className="relative">

              <MapPin
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={
                  settings.mapUrl
                }
                onChange={(
                  event,
                ) =>
                  updateSettings(
                    "mapUrl",
                    event.target
                      .value,
                  )
                }
                placeholder="https://maps.app.goo.gl/..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
              />

            </div>

            {settings.mapUrl && (
              <a
                href={
                  settings.mapUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700"
              >
                Open map
                <ExternalLink
                  size={12}
                />
              </a>
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          SOCIAL MEDIA
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Globe2
                size={19}
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Social Media
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These links are used by the
                public footer and other site
                components.
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">

          {/* FACEBOOK */}

          <SocialInput
            label="Facebook"
            value={
              settings.social
                .facebook
            }
            placeholder="https://www.facebook.com/..."
            mark="f"
            onChange={(
              value,
            ) =>
              updateSocial(
                "facebook",
                value,
              )
            }
          />

          {/* YOUTUBE */}

          <SocialInput
            label="YouTube"
            value={
              settings.social
                .youtube
            }
            placeholder="https://www.youtube.com/..."
            mark="▶"
            onChange={(
              value,
            ) =>
              updateSocial(
                "youtube",
                value,
              )
            }
          />

          {/* INSTAGRAM */}

          <SocialInput
            label="Instagram"
            value={
              settings.social
                .instagram
            }
            placeholder="https://www.instagram.com/..."
            mark="◎"
            onChange={(
              value,
            ) =>
              updateSocial(
                "instagram",
                value,
              )
            }
          />

          {/* TIKTOK */}

          <SocialInput
            label="TikTok"
            value={
              settings.social
                .tiktok
            }
            placeholder="https://www.tiktok.com/..."
            icon
            onChange={(
              value,
            ) =>
              updateSocial(
                "tiktok",
                value,
              )
            }
          />

        </div>

      </section>

      {/* =====================================================
          FOOTER NAVIGATION
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-5">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <Link2
                  size={19}
                />
              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Footer Navigation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage footer links and
                  their English, Sinhala and
                  Tamil labels.
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              {languages.map(
                (language) => (
                  <button
                    key={
                      language.code
                    }
                    type="button"
                    onClick={() =>
                      setActiveLanguage(
                        language.code,
                      )
                    }
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeLanguage ===
                      language.code
                        ? "bg-pink-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-pink-300 hover:text-pink-600"
                    }`}
                  >
                    {
                      language.nativeName
                    }
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={
                  openAddLink
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <Plus
                  size={16}
                />
                Add Footer Link
              </button>

            </div>

          </div>

        </div>

        {/* LINK LIST */}

        <div className="divide-y divide-slate-100">

          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">

              <div className="text-center">

                <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading footer...
                </p>

              </div>

            </div>
          ) : displayedLinks.length >
            0 ? (
            displayedLinks.map(
              (
                link,
                index,
              ) => {

                const currentLabel =
                  getLocalizedLabel(
                    link,
                    activeLanguage,
                  );

                const hasEnglish =
                  Boolean(
                    link.labels.EN.trim(),
                  );

                const hasSinhala =
                  Boolean(
                    link.labels.SI.trim(),
                  );

                const hasTamil =
                  Boolean(
                    link.labels.TA.trim(),
                  );

                return (
                  <div
                    key={
                      link.id
                    }
                    className={`p-5 ${
                      link.isVisible
                        ? "bg-white"
                        : "bg-slate-50"
                    }`}
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                      {/* LEFT */}

                      <div className="flex min-w-0 flex-1 items-start gap-3">

                        <div className="hidden pt-2 text-slate-300 sm:block">
                          <GripVertical
                            size={18}
                          />
                        </div>

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            link.isVisible
                              ? "bg-pink-50 text-pink-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 items-start gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                            <Link2
                              size={17}
                            />
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3
                                className={`text-sm font-bold sm:text-base ${
                                  link.isVisible
                                    ? "text-slate-800"
                                    : "text-slate-400"
                                }`}
                              >
                                {
                                  currentLabel
                                }
                              </h3>

                              {!link.isVisible && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                                  Hidden
                                </span>
                              )}

                            </div>

                            <p className="mt-1 truncate text-xs text-slate-400">
                              {
                                link.href
                              }
                            </p>

                            {/* TRANSLATION STATUS */}

                            <div className="mt-3 flex flex-wrap gap-2">

                              <TranslationStatus
                                code="EN"
                                label="English"
                                complete={
                                  hasEnglish
                                }
                              />

                              <TranslationStatus
                                code="SI"
                                label="Sinhala"
                                complete={
                                  hasSinhala
                                }
                              />

                              <TranslationStatus
                                code="TA"
                                label="Tamil"
                                complete={
                                  hasTamil
                                }
                              />

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-1 lg:justify-end">

                        {/* UP */}

                        <button
                          type="button"
                          onClick={() =>
                            moveLink(
                              link.id,
                              "up",
                            )
                          }
                          disabled={
                            index ===
                            0
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25"
                          title="Move up"
                        >
                          <ArrowUp
                            size={15}
                          />
                        </button>

                        {/* DOWN */}

                        <button
                          type="button"
                          onClick={() =>
                            moveLink(
                              link.id,
                              "down",
                            )
                          }
                          disabled={
                            index ===
                            displayedLinks.length -
                              1
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25"
                          title="Move down"
                        >
                          <ArrowDown
                            size={15}
                          />
                        </button>

                        {/* VISIBILITY */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleLink(
                              link.id,
                            )
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            link.isVisible
                              ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              : "text-pink-600 hover:bg-pink-50"
                          }`}
                          title={
                            link.isVisible
                              ? "Hide link"
                              : "Show link"
                          }
                        >
                          {link.isVisible ? (
                            <EyeOff
                              size={15}
                            />
                          ) : (
                            <Eye
                              size={15}
                            />
                          )}
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            openEditLink(
                              link,
                            )
                          }
                          className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-500 transition hover:bg-pink-50 hover:text-pink-600"
                        >
                          <Edit3
                            size={14}
                          />
                          <span className="hidden sm:inline">
                            Edit
                          </span>
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteLink(
                              link,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              },
            )
          ) : (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex max-w-md flex-col items-center">

                <div className="rounded-2xl bg-slate-50 p-5">
                  <Link2
                    size={36}
                    className="text-slate-300"
                  />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-700">
                  No footer links
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Add a footer navigation
                  link to get started.
                </p>

                <button
                  type="button"
                  onClick={
                    openAddLink
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-100"
                >
                  <Plus
                    size={15}
                  />
                  Add Footer Link
                </button>

              </div>

            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          FOOTER PREVIEW
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Eye
                size={19}
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Footer Preview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preview how the current footer
                configuration will appear on
                the website.
              </p>

            </div>

          </div>

        </div>

        <div className="bg-slate-100 p-5 sm:p-8">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* =================================================
                PREVIEW MAIN
            ================================================== */}

            <div className="px-6 py-8">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                {/* BRAND */}

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white">

                    {settings.logoUrl ? (
                      <img
                        src={
                          settings.logoUrl
                        }
                        alt="TV Supreme"
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <ImageIcon
                        size={22}
                        className="text-slate-300"
                      />
                    )}

                  </div>

                  <div className="min-w-0">

                    <p className="text-xl font-extrabold text-[#5F19C8]">
                      TV SUPREME
                    </p>

                    <p className="mt-1 truncate text-xs font-medium text-slate-400 sm:text-sm">
                      {settings.tagline ||
                        "NEWS • PEOPLE • A BRIGHTER TOMORROW"}
                    </p>

                  </div>

                </div>

                {/* LINKS */}

                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">

                  {settings.links
                    .filter(
                      (
                        link,
                      ) =>
                        link.isVisible,
                    )
                    .sort(
                      (a, b) =>
                        a.position -
                        b.position,
                    )
                    .map(
                      (
                        link,
                        index,
                      ) => (
                        <div
                          key={
                            link.id
                          }
                          className="flex items-center gap-3"
                        >

                          <span className="text-xs font-medium text-slate-500">
                            {
                              getLocalizedLabel(
                                link,
                                activeLanguage,
                              )
                            }
                          </span>

                          {index <
                            settings.links.filter(
                              (
                                item,
                              ) =>
                                item.isVisible,
                            ).length -
                              1 && (
                            <span className="text-slate-300">
                              |
                            </span>
                          )}

                        </div>
                      ),
                    )}

                </div>

                {/* SOCIAL */}

                <div className="flex shrink-0 items-center justify-center gap-2">

                  <span className="mr-1 text-xs font-bold text-slate-600">
                    Follow Us
                  </span>

                  {settings.social
                    .facebook && (
                    <PreviewSocial mark="f" />
                  )}

                  {settings.social
                    .youtube && (
                    <PreviewSocial mark="▶" />
                  )}

                  {settings.social
                    .instagram && (
                    <PreviewSocial mark="◎" />
                  )}

                  {settings.social
                    .tiktok && (
                    <PreviewSocial icon />
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                PREVIEW BOTTOM
            ================================================== */}

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">

              <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                <span>
                  {
                    settings.copyrightText
                  }
                </span>

                <span>
                  Designed for a More
                  Informed Sri Lanka
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          LINK MODAL
      ====================================================== */}

      {showLinkModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div>

                <p className="text-sm font-semibold text-pink-600">
                  Footer Navigation
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingLink
                    ? "Edit Footer Link"
                    : "Add Footer Link"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Add all available language
                  labels to the same footer
                  link.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeLinkModal
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X
                  size={19}
                />
              </button>

            </div>

            {/* BODY */}

            <div className="space-y-6 p-6">

              {/* URL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  URL
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={
                    linkForm.href
                  }
                  onChange={(
                    event,
                  ) =>
                    setLinkForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        href:
                          event.target
                            .value,
                      }),
                    )
                  }
                  placeholder="/about"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Example:
                  <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5">
                    /about
                  </code>
                </p>

              </div>

              {/* ENGLISH */}

              <TranslationField
                code="EN"
                title="English"
                value={
                  linkForm.labels.EN
                }
                placeholder="About Us"
                required
                onChange={(
                  value,
                ) =>
                  setLinkForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      labels: {
                        ...current.labels,
                        EN: value,
                      },
                    }),
                  )
                }
              />

              {/* SINHALA */}

              <TranslationField
                code="SI"
                title="Sinhala"
                value={
                  linkForm.labels.SI
                }
                placeholder="අප ගැන"
                onChange={(
                  value,
                ) =>
                  setLinkForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      labels: {
                        ...current.labels,
                        SI: value,
                      },
                    }),
                  )
                }
              />

              {/* TAMIL */}

              <TranslationField
                code="TA"
                title="Tamil"
                value={
                  linkForm.labels.TA
                }
                placeholder="எங்களைப் பற்றி"
                onChange={(
                  value,
                ) =>
                  setLinkForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      labels: {
                        ...current.labels,
                        TA: value,
                      },
                    }),
                  )
                }
              />

              {/* SETTINGS */}

              <div className="space-y-3">

                <ToggleRow
                  title="Visible on website"
                  description="Show this link in the footer."
                  enabled={
                    linkForm.isVisible
                  }
                  onToggle={() =>
                    setLinkForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        isVisible:
                          !current.isVisible,
                      }),
                    )
                  }
                />

                <ToggleRow
                  title="Open in new tab"
                  description="Open the footer link in a separate browser tab."
                  enabled={
                    linkForm.openNewTab
                  }
                  onToggle={() =>
                    setLinkForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        openNewTab:
                          !current.openNewTab,
                      }),
                    )
                  }
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={
                  closeLinkModal
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  saveLink
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >

                <Check
                  size={16}
                />

                {editingLink
                  ? "Update Link"
                  : "Add Link"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   LANGUAGE CARD
========================================================= */

function LanguageCard({
  code,
  title,
  value,
  total,
  active,
  onClick,
}: {
  code: FooterLanguage;
  title: string;
  value: number;
  total: number;
  active: boolean;
  onClick: () => void;
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (value / total) *
            100,
        );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[90px] rounded-xl border px-3 py-3 text-left transition ${
        active
          ? "border-pink-300 bg-pink-50"
          : "border-slate-200 bg-white hover:border-pink-200"
      }`}
    >

      <div className="flex items-center justify-between gap-2">

        <span
          className={`text-[10px] font-bold ${
            active
              ? "text-pink-600"
              : "text-slate-400"
          }`}
        >
          {code}
        </span>

        <span className="text-xs font-bold text-slate-700">
          {value}/{total}
        </span>

      </div>

      <p className="mt-1 text-xs font-semibold text-slate-600">
        {title}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-600 to-purple-600"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </button>
  );
}

/* =========================================================
   SOCIAL INPUT
========================================================= */

function SocialInput({
  label,
  value,
  placeholder,
  mark,
  icon = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  mark?: string;
  icon?: boolean;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-sm font-bold text-slate-600">

          {icon ? (
            <Music2
              size={18}
            />
          ) : (
            mark
          )}

        </div>

        <input
          type="url"
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          placeholder={
            placeholder
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
        />

      </div>

    </div>
  );
}

/* =========================================================
   TRANSLATION STATUS
========================================================= */

function TranslationStatus({
  code,
  label,
  complete,
}: {
  code: FooterLanguage;
  label: string;
  complete: boolean;
}) {
  return (
    <span
      title={`${label}: ${
        complete
          ? "Translated"
          : "Not translated"
      }`}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${
        complete
          ? "bg-emerald-50 text-emerald-600"
          : "bg-slate-100 text-slate-400"
      }`}
    >

      {complete ? (
        <Check
          size={10}
        />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {code}

    </span>
  );
}

/* =========================================================
   TRANSLATION FIELD
========================================================= */

function TranslationField({
  code,
  title,
  value,
  placeholder,
  required = false,
  onChange,
}: {
  code: FooterLanguage;
  title: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center gap-2">

        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-[10px] font-bold text-pink-600">
          {code}
        </span>

        <label className="text-sm font-semibold text-slate-700">
          {title}

          {required && (
            <span className="ml-1 text-pink-600">
              *
            </span>
          )}
        </label>

      </div>

      <input
        type="text"
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
      />

    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">

      <div>

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>

      </div>

      <button
        type="button"
        role="switch"
        aria-checked={
          enabled
        }
        onClick={
          onToggle
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-gradient-to-r from-pink-600 to-purple-600"
            : "bg-slate-200"
        }`}
      >

        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-[22px]"
              : "left-0.5"
          }`}
        />

      </button>

    </div>
  );
}

/* =========================================================
   PREVIEW SOCIAL
========================================================= */

function PreviewSocial({
  mark,
  icon = false,
}: {
  mark?: string;
  icon?: boolean;
}) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">

      {icon ? (
        <Music2
          size={12}
        />
      ) : (
        mark
      )}

    </span>
  );
}
