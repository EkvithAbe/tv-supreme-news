"use client";

import { ArrowUp, Music2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

/* =========================================================
   TYPES
========================================================= */

type Locale = "en" | "si" | "ta";

type SupportedLanguage = "EN" | "SI" | "TA";

type FooterSiteConfig = {
  logoUrl: string;
  tagline: string;
  social: {
    facebook: string;
    youtube: string;
    instagram: string;
    tiktok: string;
  };
};

type FooterApiResponse = {
  success: boolean;
  language: SupportedLanguage;
  menu?: unknown[];
  site?: FooterSiteConfig;
};

/* =========================================================
   FALLBACK CONFIG
========================================================= */

const fallbackConfig: FooterSiteConfig = {
  logoUrl: "/logo.png",
  tagline: "NEWS • PEOPLE • A BRIGHTER TOMORROW",
  social: {
    facebook: "",
    youtube: "",
    instagram: "",
    tiktok: "",
  },
};

/* =========================================================
   FOOTER LINKS
========================================================= */

const footerLinks = [
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
  {
    name: "Advertise",
    href: "/advertise",
  },
  {
    name: "Privacy Policy",
    href: "/legal/privacy-policy",
  },
  {
    name: "Terms of Use",
    href: "/legal/terms-of-use",
  },
];

/* =========================================================
   LOCALE HELPER
========================================================= */

function getLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(en|si|ta)(?=\/|$)/);

  if (match?.[1] === "si") {
    return "si";
  }

  if (match?.[1] === "ta") {
    return "ta";
  }

  return "en";
}

/* =========================================================
   SOCIAL ICON
   Small inline SVG/text marks keep the footer lightweight
   while matching the compact reference design.
========================================================= */

function SocialMark({
  type,
}: {
  type: "facebook" | "youtube" | "instagram" | "tiktok";
}) {
  if (type === "facebook") {
    return (
      <span
        aria-hidden="true"
        className="text-[16px] font-black leading-none"
      >
        f
      </span>
    );
  }

  if (type === "youtube") {
    return (
      <span
        aria-hidden="true"
        className="flex items-center justify-center text-[11px] leading-none"
      >
        ▶
      </span>
    );
  }

  if (type === "instagram") {
    return (
      <span
        aria-hidden="true"
        className="text-[17px] font-bold leading-none"
      >
        ◎
      </span>
    );
  }

  return <Music2 aria-hidden="true" size={15} strokeWidth={2.2} />;
}

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear()
  );

  const [siteConfig, setSiteConfig] =
    useState<FooterSiteConfig>(fallbackConfig);

  /* =======================================================
     LOAD SITE CONFIG
  ======================================================== */

  useEffect(() => {
    const controller = new AbortController();

    async function loadFooterConfig() {
      try {
        const pathname = window.location.pathname;
        const locale = getLocaleFromPath(pathname);

        const language: SupportedLanguage =
          locale === "si"
            ? "SI"
            : locale === "ta"
              ? "TA"
              : "EN";

        const response = await fetch(
          `/api/public/header?language=${language}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load site configuration."
          );
        }

        const data =
          (await response.json()) as FooterApiResponse;

        if (data.success && data.site) {
          setSiteConfig({
            logoUrl:
              data.site.logoUrl ||
              fallbackConfig.logoUrl,

            tagline:
              data.site.tagline ||
              fallbackConfig.tagline,

            social: {
              facebook:
                data.site.social?.facebook || "",

              youtube:
                data.site.social?.youtube || "",

              instagram:
                data.site.social?.instagram || "",

              tiktok:
                data.site.social?.tiktok || "",
            },
          });
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to load footer configuration:",
          error
        );
      }
    }

    loadFooterConfig();

    return () => {
      controller.abort();
    };
  }, []);

  /* =======================================================
     YEAR
  ======================================================== */

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  /* =======================================================
     BACK TO TOP
  ======================================================== */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SOCIAL LINKS
  ======================================================== */

  const socialLinks = [
    {
      name: "Facebook",
      href: siteConfig.social.facebook,
      type: "facebook" as const,
      iconClass:
        "bg-[#1877F2] text-white",
    },
    {
      name: "YouTube",
      href: siteConfig.social.youtube,
      type: "youtube" as const,
      iconClass:
        "bg-[#FF0000] text-white",
    },
    {
      name: "Instagram",
      href: siteConfig.social.instagram,
      type: "instagram" as const,
      iconClass:
        "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
    },
    {
      name: "TikTok",
      href: siteConfig.social.tiktok,
      type: "tiktok" as const,
      iconClass:
        "bg-[#111827] text-white",
    },
  ];

  const visibleSocialLinks =
    socialLinks.filter((social) => Boolean(social.href));

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
          FOOTER CONTENT
      ====================================================== */}

      <div className="w-full px-6 pb-6 pt-7 sm:px-8 lg:px-16 xl:px-20">
        <div
          className="
            mx-auto
            flex
            w-full
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-8
          "
        >
          {/* =================================================
              BRAND
          ================================================== */}

          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="TV Supreme Home"
              className="
                shrink-0
                transition-opacity
                hover:opacity-85
              "
            >
              <img
                src={
                  siteConfig.logoUrl ||
                  "/logo.png"
                }
                alt="TV Supreme"
                className="
                  h-12
                  w-auto
                  max-w-[140px]
                  object-contain
                  sm:h-13
                  sm:max-w-[150px]
                  lg:h-14
                  lg:max-w-[160px]
                "
              />
            </Link>

            <div className="min-w-0">
              <Link
                href="/"
                className="
                  block
                  text-[20px]
                  font-extrabold
                  tracking-tight
                  text-[#5F19C8]
                  transition
                  hover:text-[#ec008c]
                  sm:text-[21px]
                  lg:text-[22px]
                "
              >
                TV SUPREME
              </Link>

              <p
                className="
    mt-0.5
    whitespace-nowrap
    text-[12px]
    font-medium
    leading-4
    text-slate-400
    sm:text-[13px]
    lg:text-[14px]
  "
              >
                {siteConfig.tagline ||
                  "NEWS • PEOPLE • A BRIGHTER TOMORROW"}
              </p>
            </div>
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <nav
            aria-label="Footer navigation"
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-4
              gap-y-2
              lg:flex-1
            "
          >
            {footerLinks.map(
              (link, index) => (
                <div
                  key={link.name}
                  className="flex items-center gap-2.5"
                >
                  <Link
                    href={link.href}
                    className="
                      whitespace-nowrap
                      text-[14px]
                      font-semibold
                      text-slate-500
                      transition
                      hover:text-[#ec008c]
                      sm:text-[15px]
                      lg:text-[16px]
                    "
                  >
                    {link.name}
                  </Link>

                  {index <
                    footerLinks.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="
                        text-[14px]
                        font-medium
                        text-slate-300
                        dark:text-slate-600
                      "
                      >
                        |
                      </span>
                    )}
                </div>
              )
            )}
          </nav>

          {/* =================================================
              SOCIAL
          ================================================== */}

          <div className="flex shrink-0 items-center justify-center gap-3">
            <span
              className="
                mr-1
                whitespace-nowrap
                text-[14px]
                font-bold
                text-[#111d4a]
                sm:text-[15px]
                lg:text-[16px]
                dark:text-white
              "
            >
              Follow Us
            </span>

            {visibleSocialLinks.map(
              (social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    transition
                    hover:scale-110
                    hover:opacity-85
                    sm:h-[22px]
                    sm:w-[22px]
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
                      ${social.iconClass}
                    `}
                  >
                    <SocialMark
                      type={social.type}
                    />
                  </span>
                </a>
              )
            )}

          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div
        className="
          border-t
          border-slate-100
          bg-white
          dark:border-[#30374e]
          dark:bg-[#111628]
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            flex-col
            gap-2
            px-6
            py-4
            sm:px-8
            md:flex-row
            md:items-center
            md:justify-between
            lg:px-16
            xl:px-20
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
            © {currentYear} TV SUPREME. All Rights Reserved.
          </p>

          {/* DESIGNED FOR */}

          <div
            className="
              flex
              items-center
              gap-2
              text-[13px]
              font-medium
              text-slate-400
              sm:text-[14px]
              lg:text-[15px]
            "
          >
            <span>
              Designed for a More Informed Sri Lanka
            </span>

            <span
              aria-hidden="true"
              className="
                h-[2px]
                w-3
                rounded-full
                bg-[#ec008c]
                sm:w-5
              "
            />

            <span
              aria-hidden="true"
              className="
                h-[2px]
                w-4
                rounded-full
                bg-[#6a1b9a]
                sm:w-7
              "
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          BACK TO TOP
      ====================================================== */}

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
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
        <ArrowUp size={19} />
      </button>
    </footer>
  );
}
