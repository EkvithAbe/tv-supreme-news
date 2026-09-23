"use client";

import {
  ArrowUp,
  MapPin,
  Music2,
  Phone,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "@/i18n/navigation";
import {
  getStaticTranslator,
  type StaticPageTranslations,
} from "@/lib/static-page-translations";
import { usePathname } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type Locale = "en" | "si" | "ta";

type SupportedLanguage =
  | "EN"
  | "SI"
  | "TA";

type FooterSocial = {
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
};

type FooterLink = {
  id: string;
  label: string;
  href: string;
  position: number;
  openNewTab: boolean;
};

type FooterData = {
  language: SupportedLanguage;

  logoUrl: string;
  tagline: string;
  description: string;

  telephone: string;
  address: string;
  mapUrl: string;

  copyrightText: string;

  social: FooterSocial;

  links: FooterLink[];
};

type FooterApiResponse = {
  success: boolean;
  language?: SupportedLanguage;
  footer?: FooterData;
  message?: string;
};

/* =========================================================
   FALLBACK
========================================================= */

const fallbackFooter: FooterData = {
  language: "EN",

  logoUrl: "/logo.png",

  tagline:
    "NEWS • PEOPLE • A BRIGHTER TOMORROW",

  description: "",

  telephone: "",

  address: "",

  mapUrl: "",

  copyrightText: "",

  social: {
    facebook: "",
    youtube: "",
    instagram: "",
    tiktok: "",
  },

  links: [],
};

const footerTranslations: StaticPageTranslations = {
  si: {
    "NEWS • PEOPLE • A BRIGHTER TOMORROW": "ප්‍රවෘත්ති • ජනතාව • වඩාත් දීප්තිමත් හෙටක්",
    "Your trusted source for Sri Lankan and world news.": "ශ්‍රී ලංකාවේ සහ ලෝකයේ පුවත් සඳහා ඔබගේ විශ්වාසනීය මූලාශ්‍රය.",
    "About Us": "අප ගැන",
    "Contact Us": "අප සමඟ සම්බන්ධ වන්න",
    Advertise: "දැන්වීම් පළ කරන්න",
    "Privacy Policy": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
    "Terms of Use": "භාවිත කොන්දේසි",
    "Loading...": "පූරණය වෙමින්...",
    "Follow Us": "අප අනුගමනය කරන්න",
    "Footer navigation": "පාදක සැරිසැරුම",
    "TV Supreme Home": "TV SUPREME මුල් පිටුව",
    "Designed for a More Informed Sri Lanka": "වඩාත් දැනුවත් ශ්‍රී ලංකාවක් සඳහා නිර්මාණය කරන ලදී",
    "Back to top": "ඉහළට යන්න",
    "All Rights Reserved.": "සියලු හිමිකම් ඇවිරිණි.",
  },
  ta: {
    "NEWS • PEOPLE • A BRIGHTER TOMORROW": "செய்திகள் • மக்கள் • பிரகாசமான நாளை",
    "Your trusted source for Sri Lankan and world news.": "இலங்கை மற்றும் உலகச் செய்திகளுக்கான உங்கள் நம்பகமான ஆதாரம்.",
    "About Us": "எங்களைப் பற்றி",
    "Contact Us": "எங்களைத் தொடர்புகொள்ளுங்கள்",
    Advertise: "விளம்பரப்படுத்துங்கள்",
    "Privacy Policy": "தனியுரிமைக் கொள்கை",
    "Terms of Use": "பயன்பாட்டு விதிமுறைகள்",
    "Loading...": "ஏற்றப்படுகிறது...",
    "Follow Us": "எங்களைப் பின்தொடருங்கள்",
    "Footer navigation": "அடிப்பக வழிசெலுத்தல்",
    "TV Supreme Home": "TV SUPREME முகப்பு",
    "Designed for a More Informed Sri Lanka": "மேலும் தகவலறிந்த இலங்கைக்காக வடிவமைக்கப்பட்டது",
    "Back to top": "மேலே செல்லவும்",
    "All Rights Reserved.": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
};

/* =========================================================
   LOCALE
========================================================= */

function getLocaleFromPath(
  pathname: string,
): Locale {
  const match =
    pathname.match(
      /^\/(en|si|ta)(?=\/|$)/,
    );

  if (
    match?.[1] === "si"
  ) {
    return "si";
  }

  if (
    match?.[1] === "ta"
  ) {
    return "ta";
  }

  return "en";
}

function getLanguageFromLocale(
  locale: Locale,
): SupportedLanguage {
  if (locale === "si") {
    return "SI";
  }

  if (locale === "ta") {
    return "TA";
  }

  return "EN";
}

/* =========================================================
   FOOTER LINK FALLBACK
   Normal footer links are loaded from Admin → Footer.
   These five are used only if the API is unavailable.
========================================================= */

const fallbackFooterLinks: FooterLink[] = [
  {
    id: "footer-about",
    label: "About Us",
    href: "/about",
    position: 0,
    openNewTab: false,
  },
  {
    id: "footer-contact",
    label: "Contact Us",
    href: "/contact",
    position: 1,
    openNewTab: false,
  },
  {
    id: "footer-advertise",
    label: "Advertise",
    href: "/advertise",
    position: 2,
    openNewTab: false,
  },
  {
    id: "footer-privacy",
    label: "Privacy Policy",
    href: "/legal/privacy-policy",
    position: 3,
    openNewTab: false,
  },
  {
    id: "footer-terms",
    label: "Terms of Use",
    href: "/legal/terms-of-use",
    position: 4,
    openNewTab: false,
  },
];

/* =========================================================
   LOCALIZED FOOTER URL
   Admin stores one canonical internal path.
   The public footer prefixes the active locale.
========================================================= */

function getFooterHref(
  href: string,
  locale: Locale,
): string {
  const trimmed = href.trim();

  if (!trimmed) {
    return "#";
  }

  if (
    /^(https?:\/\/|mailto:|tel:)/i.test(
      trimmed,
    )
  ) {
    return trimmed;
  }

  let normalized = trimmed.startsWith("/")
    ? trimmed
    : `/${trimmed}`;

  normalized = normalized.replace(
    /^\/(en|si|ta)(?=\/|$)/i,
    "",
  );

  if (!normalized) {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

/* =========================================================
   SOCIAL MARK
========================================================= */

function SocialMark({
  type,
}: {
  type:
    | "facebook"
    | "youtube"
    | "instagram"
    | "tiktok";
}) {
  if (
    type === "facebook"
  ) {
    return (
      <span
        aria-hidden="true"
        className="text-[18px] font-black leading-none"
      >
        f
      </span>
    );
  }

  if (
    type === "youtube"
  ) {
    return (
      <span
        aria-hidden="true"
        className="text-[11px] font-bold leading-none"
      >
        ▶
      </span>
    );
  }

  if (
    type === "instagram"
  ) {
    return (
      <span
        aria-hidden="true"
        className="text-[18px] font-bold leading-none"
      >
        ◎
      </span>
    );
  }

  return (
    <Music2
      aria-hidden="true"
      size={17}
      strokeWidth={2.2}
    />
  );
}

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const pathname =
    usePathname() || "/";

  const locale =
    getLocaleFromPath(
      pathname,
    );

  const language =
    getLanguageFromLocale(
      locale,
    );

  const staticText = getStaticTranslator(
    locale,
    footerTranslations,
  );

  /* =======================================================
     STATE
  ======================================================== */

  const [
    footer,
    setFooter,
  ] = useState<FooterData>(
    fallbackFooter,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    currentYear,
    setCurrentYear,
  ] = useState(
    new Date().getFullYear(),
  );

  /* =======================================================
     LOAD FOOTER FROM PUBLIC API
  ======================================================== */

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadFooter() {
      try {
        setIsLoading(true);

        /*
         * Add a timestamp so the browser doesn't
         * accidentally reuse an old response while
         * working in development.
         */
        const response =
          await fetch(
            `/api/public/footer?language=${language}`,
            {
              method: "GET",
              signal:
                controller.signal,
            },
          );

        if (!response.ok) {
          throw new Error(
            `Footer API returned ${response.status}`,
          );
        }

        const data =
          (await response.json()) as FooterApiResponse;

        if (
          !data.success ||
          !data.footer
        ) {
          throw new Error(
            data.message ||
              "Invalid footer API response.",
          );
        }

        /*
         * Normalize the returned data.
         */
        setFooter({
          language:
            data.language ||
            language,

          logoUrl:
            data.footer.logoUrl ||
            fallbackFooter.logoUrl,

          tagline:
            data.footer.tagline ||
            "",

          description:
            data.footer.description ||
            "",

          telephone:
            data.footer.telephone ||
            "",

          address:
            data.footer.address ||
            "",

          mapUrl:
            data.footer.mapUrl ||
            "",

          copyrightText:
            data.footer
              .copyrightText ||
            "",

          social: {
            facebook:
              data.footer.social
                ?.facebook ||
              "",

            youtube:
              data.footer.social
                ?.youtube ||
              "",

            instagram:
              data.footer.social
                ?.instagram ||
              "",

            tiktok:
              data.footer.social
                ?.tiktok ||
              "",
          },

          links:
            Array.isArray(
              data.footer.links,
            )
              ? [
                  ...data.footer.links,
                ].sort(
                  (a, b) =>
                    a.position -
                    b.position,
                )
              : [],
        });
      } catch (error) {
        if (
          error instanceof
            DOMException &&
          error.name ===
            "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to load public footer:",
          error,
        );

        /*
         * Keep the current footer instead of
         * replacing it with a hard-coded menu.
         */
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setIsLoading(false);
        }
      }
    }

    void loadFooter();

    return () => {
      controller.abort();
    };
  }, [language]);

  /* =======================================================
     SOCIAL LINKS
  ======================================================== */

  const socialLinks =
    useMemo(() => {
      return [
        {
          name: "Facebook",
          href:
            footer.social
              .facebook,

          type:
            "facebook" as const,
        },

        {
          name: "YouTube",
          href:
            footer.social
              .youtube,

          type:
            "youtube" as const,
        },

        {
          name: "Instagram",
          href:
            footer.social
              .instagram,

          type:
            "instagram" as const,
        },

        {
          name: "TikTok",
          href:
            footer.social
              .tiktok,

          type:
            "tiktok" as const,
        },
      ].filter(
        (item) =>
          Boolean(
            item.href,
          ),
      );
    }, [
      footer.social,
    ]);

  /* =======================================================
     FOOTER LINKS
     Loaded from the Public Footer API.
     The API returns the label for the active language.
  ======================================================== */

  const visibleLinks = useMemo(() => {
    const links = Array.isArray(footer.links)
      ? footer.links
          .filter(
            (link) =>
              Boolean(link.label?.trim()) &&
              Boolean(link.href?.trim()),
          )
          .sort(
            (a, b) =>
              a.position - b.position,
          )
      : [];

    return links.length > 0
      ? links
      : fallbackFooterLinks;
  }, [footer.links]);

  /* =======================================================
     BACK TO TOP
  ======================================================== */

  const scrollToTop =
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <footer
      className="
        relative
        mt-12
        w-full
        border-t border-slate-200
        bg-white
        dark:border-[#30374e]
        dark:bg-[#151a2d]
      "
    >

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div
        className="
          w-full
          px-6
          pb-7
          pt-8
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-16
          2xl:px-20
        "
      >

        {/* NO max-width HERE.
            This intentionally uses the full viewport width. */}

        <div
          className="
            flex
            w-full
            flex-col
            gap-8
            xl:flex-row
            xl:items-center
            xl:justify-between
            xl:gap-10
          "
        >

          {/* =================================================
              BRAND
          ================================================== */}

          <div
            className="
              flex
              min-w-0
              shrink-0
              items-center
              gap-4
            "
          >

            <Link
              href="/"
              aria-label={staticText("TV Supreme Home")}
              className="
                shrink-0
                transition-opacity
                hover:opacity-85
              "
            >

              <img
                src={
                  footer.logoUrl ||
                  "/logo.png"
                }
                alt="TV Supreme"
                className="
                  h-14
                  w-auto
                  max-w-[180px]
                  object-contain
                  sm:h-16
                  sm:max-w-[200px]
                "
              />

            </Link>

            <div
              className="
                min-w-0
                hidden
                lg:block
              "
            >

              <Link
                href="/"
                className="
                  block
                  text-[21px]
                  font-extrabold
                  tracking-tight
                  text-[#5F19C8]
                  transition
                  hover:text-[#ec008c]
                  sm:text-[22px]
                  xl:text-[24px]
                "
              >
                TV SUPREME
              </Link>

              {footer.tagline && (
                <p
                  className="
                    mt-1
                    whitespace-nowrap
                    text-[13px]
                    font-medium
                    leading-5
                    text-slate-400
                    sm:text-[14px]
                    xl:text-[15px]
                  "
                >
                  {staticText(footer.tagline)}
                </p>
              )}

            </div>

          </div>

          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <nav
            aria-label={staticText("Footer navigation")}
            className="
              flex
              min-w-0
              flex-1
              flex-wrap
              items-center
              justify-start
              gap-x-4
              gap-y-3
              xl:justify-center
            "
          >

            {isLoading ? (
              <span className="text-sm text-slate-400">
                {staticText("Loading...")}
              </span>
            ) : (
              visibleLinks.map(
                (link, index) => {
                  const href =
                    getFooterHref(
                      link.href,
                      locale,
                    );

                  const external =
                    /^(https?:\/\/|mailto:|tel:)/i.test(
                      href,
                    );

                  return (
                    <div
                      key={link.id}
                      className="
                        flex
                        items-center
                        gap-2.5
                        sm:gap-4
                      "
                    >
                      <a
                        href={href}
                        target={
                          external || link.openNewTab
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          external || link.openNewTab
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="
                          text-[14px]
                          font-semibold
                          text-slate-600
                          transition
                          hover:text-[#ec008c]
                          sm:whitespace-nowrap
                          sm:text-[16px]
                          dark:text-slate-300
                          dark:hover:text-[#ec008c]
                        "
                      >
                        {staticText(link.label)}
                      </a>

                      {index <
                        visibleLinks.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="
                            hidden
                            text-[16px]
                            font-medium
                            text-slate-300
                            sm:inline
                            dark:text-slate-600
                          "
                        >
                          |
                        </span>
                      )}
                    </div>
                  );
                },
              )
            )}

          </nav>

          {/* =================================================
              SOCIAL
          ================================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-start
              gap-3
              xl:justify-end
            "
          >

            {socialLinks.length >
              0 && (
              <span
                className="
                  mr-1
                  whitespace-nowrap
                  text-[15px]
                  font-bold
                  text-[#111d4a]
                  sm:text-[16px]
                  dark:text-white
                "
              >
                {staticText("Follow Us")}
              </span>
            )}

            {socialLinks.map(
              (social) => (
                <a
                  key={
                    social.name
                  }
                  href={
                    social.href
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    social.name
                  }
                  title={
                    social.name
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    transition
                    hover:scale-110
                    hover:opacity-85
                  "
                >

                  <span
                    className={`
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      rounded-full
                      ${
                        social.type ===
                        "facebook"
                          ? "bg-[#1877F2] text-white"
                          : social.type ===
                              "youtube"
                            ? "bg-[#FF0000] text-white"
                            : social.type ===
                                "instagram"
                              ? "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white"
                              : "bg-[#111827] text-white"
                      }
                    `}
                  >

                    <SocialMark
                      type={
                        social.type
                      }
                    />

                  </span>

                </a>
              ),
            )}

          </div>

        </div>

        {/* ===================================================
            CONTACT INFORMATION
        ==================================================== */}

        {(footer.telephone ||
          footer.address) && (
          <div
            className="
              mt-7
              flex
              w-full
              flex-col
              items-start
              justify-center
              gap-4
              border-t
              border-slate-100
              pt-5
              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:gap-5
              dark:border-[#30374e]
            "
          >

            {/* PHONE */}

            {footer.telephone && (
              <a
                href={`tel:${footer.telephone.replace(
                  /[^\d+]/g,
                  "",
                )}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-slate-500
                  transition
                  hover:text-[#ec008c]
                  dark:text-slate-400
                "
              >
                <Phone
                  size={16}
                />

                <span>
                  {
                    footer.telephone
                  }
                </span>
              </a>
            )}

            {/* SEPARATOR */}

            {footer.telephone &&
              footer.address && (
              <span className="hidden text-slate-300 sm:inline dark:text-slate-600">
                |
              </span>
            )}

            {/* ADDRESS */}

            {footer.address && (
              <a
                href={
                  footer.mapUrl ||
                  undefined
                }
                target={
                  footer.mapUrl
                    ? "_blank"
                    : undefined
                }
                rel={
                  footer.mapUrl
                    ? "noopener noreferrer"
                    : undefined
                }
                className="
                  inline-flex
                  items-start
                  gap-2
                  text-sm
                  font-medium
                  text-slate-500
                  transition
                  hover:text-[#ec008c]
                  dark:text-slate-400
                "
              >

                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {
                    footer.address
                  }
                </span>

              </a>
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div
        className="
          w-full
          border-t
          border-slate-100
          bg-slate-50
          dark:border-[#30374e]
          dark:bg-[#111628]
        "
      >

        <div
          className="
            flex
            w-full
            flex-col
            gap-3
            px-6
            py-5
            sm:px-8
            md:flex-row
            md:items-center
            md:justify-between
            lg:px-12
            xl:px-16
            2xl:px-20
          "
        >

          {/* COPYRIGHT */}

          <p
            className="
              text-[13px]
              font-medium
              text-slate-400
              sm:text-[14px]
              lg:text-[15px]
            "
          >
            {footer.copyrightText
              ? footer.copyrightText.replace(
                  /All Rights Reserved\.?$/i,
                  staticText("All Rights Reserved."),
                )
              : `© ${currentYear} TV SUPREME. ${staticText("All Rights Reserved.")}`}
          </p>

          {/* CENTER MESSAGE */}

          <p
            className="
              text-[13px]
              font-medium
              text-slate-400
              sm:text-[14px]
              lg:text-[15px]
            "
          >
            {staticText(
              "Designed for a More Informed Sri Lanka",
            )}
          </p>

          {/* LEGAL */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              text-[13px]
              font-semibold
              sm:text-[14px]
              lg:text-[15px]
            "
          >

            {visibleLinks
              .filter((link) =>
                link.href.includes(
                  "/legal/privacy-policy",
                ),
              )
              .slice(0, 1)
              .map((link) => (
                <a
                  key={link.id}
                  href={getFooterHref(
                    link.href,
                    locale,
                  )}
                  className="
                    text-slate-500
                    transition
                    hover:text-[#ec008c]
                    dark:text-slate-400
                    dark:hover:text-[#ec008c]
                  "
                >
                  {staticText(link.label)}
                </a>
              ))}

            {visibleLinks.some((link) =>
              link.href.includes(
                "/legal/privacy-policy",
              ),
            ) &&
              visibleLinks.some((link) =>
                link.href.includes(
                  "/legal/terms-of-use",
                ),
              ) && (
                <span className="text-slate-300 dark:text-slate-600">
                  |
                </span>
              )}

            {visibleLinks
              .filter((link) =>
                link.href.includes(
                  "/legal/terms-of-use",
                ),
              )
              .slice(0, 1)
              .map((link) => (
                <a
                  key={link.id}
                  href={getFooterHref(
                    link.href,
                    locale,
                  )}
                  className="
                    text-slate-500
                    transition
                    hover:text-[#ec008c]
                    dark:text-slate-400
                    dark:hover:text-[#ec008c]
                  "
                >
                  {staticText(link.label)}
                </a>
              ))}

          </div>

        </div>

      </div>

      {/* =====================================================
          BACK TO TOP
      ====================================================== */}

      <button
        type="button"
        onClick={
          scrollToTop
        }
        aria-label={staticText("Back to top")}
        title={staticText("Back to top")}
        className="
          fixed
          bottom-5
          right-5
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-gradient-to-r
          from-[#6a1b9a]
          to-[#ec008c]
          text-white
          shadow-lg
          transition
          hover:scale-105
          hover:shadow-xl
        "
      >
        <ArrowUp
          size={19}
        />
      </button>

    </footer>
  );
}
