"use client";

import {
  Search,
  Sun,
  Moon,
  Play,
  Menu,
  X,
  House,
  Newspaper,
  Globe2,
  Landmark,
  Briefcase,
  Trophy,
  Clapperboard,
  Cpu,
  Leaf,
  Video,
  Music2,
} from "lucide-react";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTheme } from "@/components/common/ThemeProvider";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

/* =========================================================
   TYPES
========================================================= */

type Locale = "en" | "si" | "ta";

type SupportedLanguage = "EN" | "SI" | "TA";

type MenuType =
  | "Page"
  | "Category"
  | "Custom Link"
  | "System";

type HeaderMenuItem = {
  id: string;
  language: SupportedLanguage;
  label: string;
  href: string;
  position: number;
  isVisible: boolean;
  type: MenuType;
  desktop: boolean;
  mobile: boolean;
  openNewTab: boolean;
  usesEnglishFallback?: boolean;
  createdAt: string;
  updatedAt: string;
};

type HeaderSiteConfig = {
  logoUrl: string;
  tagline: string;

  social: {
    facebook: string;
    youtube: string;
    instagram: string;
    tiktok: string;
  };
};

type HeaderApiResponse = {
  success: boolean;
  language: SupportedLanguage;
  menu: HeaderMenuItem[];
  site: HeaderSiteConfig;
};

/* =========================================================
   FALLBACK CONFIG
========================================================= */

const fallbackSiteConfig: HeaderSiteConfig = {
  logoUrl: "/logo.png",
  tagline: "NEWS • PEOPLE • A BRIGHTER TOMORROW",

  social: {
    facebook: "",
    youtube: "",
    instagram: "",
    tiktok: "",
  },
};

const fallbackMenuItems: HeaderMenuItem[] = [
  ["home", "Home", "/"],
  ["latest", "Latest", "/latest"],
  ["sri-lanka", "Sri Lanka", "/sri-lanka"],
  ["world", "World", "/world"],
  ["politics", "Politics", "/politics"],
  ["business", "Business", "/business"],
  ["sports", "Sports", "/sports"],
  ["entertainment", "Entertainment", "/entertainment"],
  ["technology", "Technology", "/technology"],
  ["lifestyle", "Lifestyle", "/lifestyle"],
  ["video", "Video", "/video"],
  ["watch-live", "Watch Live", "/watch-live"],
].map(([id, label, href], position) => ({
  id,
  language: "EN",
  label,
  href,
  position,
  isVisible: true,
  type: "Custom Link",
  desktop: true,
  mobile: true,
  openNewTab: false,
  createdAt: "",
  updatedAt: "",
}));

const navigationTranslationKeys: Record<string, string> = {
  "/": "home",
  "/latest": "latest",
  "/sri-lanka": "sriLanka",
  "/world": "world",
  "/politics": "politics",
  "/business": "business",
  "/sports": "sports",
  "/entertainment": "entertainment",
  "/technology": "technology",
  "/lifestyle": "lifestyle",
  "/video": "video",
  "/watch-live": "watchLive",
};

/* =========================================================
   LANGUAGE HELPERS
========================================================= */

function getLocaleFromPath(
  pathname: string
): Locale {
  const match = pathname.match(
    /^\/(en|si|ta)(?=\/|$)/
  );

  if (match?.[1] === "si") {
    return "si";
  }

  if (match?.[1] === "ta") {
    return "ta";
  }

  return "en";
}

function getApiLanguage(
  locale: Locale
): SupportedLanguage {
  switch (locale) {
    case "si":
      return "SI";

    case "ta":
      return "TA";

    default:
      return "EN";
  }
}

/* =========================================================
   URL HELPERS
========================================================= */

function normalizeInternalHref(
  href: string
): string {
  const trimmed = href.trim();

  if (!trimmed) {
    return "/";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  let normalized = trimmed;

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  /*
   * Remove locale prefix from Admin Menu URLs.
   *
   * /en/sports -> /sports
   * /si/sports -> /sports
   * /ta/sports -> /sports
   */
  normalized = normalized.replace(
    /^\/(en|si|ta)(?=\/|$)/,
    ""
  );

  return normalized || "/";
}

function isExternalUrl(
  href: string
): boolean {
  return /^https?:\/\//i.test(
    href.trim()
  );
}

/* =========================================================
   MENU ICONS
========================================================= */

function getMenuIcon(
  href: string,
  label: string
) {
  const normalizedHref =
    normalizeInternalHref(
      href
    ).toLowerCase();

  const normalizedLabel =
    label.trim().toLowerCase();

  if (
    normalizedHref === "/" ||
    normalizedLabel === "home"
  ) {
    return House;
  }

  if (
    normalizedHref === "/latest" ||
    normalizedLabel === "latest"
  ) {
    return Newspaper;
  }

  if (
    normalizedHref === "/sri-lanka" ||
    normalizedLabel === "sri lanka"
  ) {
    return House;
  }

  if (
    normalizedHref === "/world" ||
    normalizedLabel === "world"
  ) {
    return Globe2;
  }

  if (
    normalizedHref === "/politics" ||
    normalizedLabel === "politics"
  ) {
    return Landmark;
  }

  if (
    normalizedHref === "/business" ||
    normalizedLabel === "business"
  ) {
    return Briefcase;
  }

  if (
    normalizedHref === "/sports" ||
    normalizedLabel === "sports"
  ) {
    return Trophy;
  }

  if (
    normalizedHref === "/entertainment" ||
    normalizedLabel === "entertainment"
  ) {
    return Clapperboard;
  }

  if (
    normalizedHref === "/technology" ||
    normalizedLabel === "technology"
  ) {
    return Cpu;
  }

  if (
    normalizedHref === "/lifestyle" ||
    normalizedLabel === "lifestyle"
  ) {
    return Leaf;
  }

  if (
    normalizedHref === "/video" ||
    normalizedLabel === "video"
  ) {
    return Video;
  }

  return Menu;
}

/* =========================================================
   WATCH LIVE
========================================================= */

function isWatchLiveItem(
  item: HeaderMenuItem
): boolean {
  return (
    normalizeInternalHref(
      item.href
    ) === "/watch-live"
  );
}

function isHomeItem(
  item: HeaderMenuItem,
): boolean {
  return (
    normalizeInternalHref(
      item.href,
    ) === "/"
  );
}

/* =========================================================
   WEATHER
========================================================= */

function getWeatherText(
  code: number
): string {
  if (code === 0) {
    return "Clear";
  }

  if (
    code === 1 ||
    code === 2
  ) {
    return "Partly cloudy";
  }

  if (code === 3) {
    return "Cloudy";
  }

  if (
    code === 45 ||
    code === 48
  ) {
    return "Foggy";
  }

  if (
    code === 51 ||
    code === 53 ||
    code === 55
  ) {
    return "Drizzle";
  }

  if (
    code === 61 ||
    code === 63 ||
    code === 65
  ) {
    return "Rain";
  }

  if (
    code === 71 ||
    code === 73 ||
    code === 75 ||
    code === 77
  ) {
    return "Snow";
  }

  if (
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return "Rain showers";
  }

  if (
    code === 95 ||
    code === 96 ||
    code === 99
  ) {
    return "Thunderstorm";
  }

  return "Weather";
}

function getWeatherIcon(
  code: number
): string {
  if (code === 0) {
    return "☀️";
  }

  if (
    code === 1 ||
    code === 2
  ) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if (
    code === 45 ||
    code === 48
  ) {
    return "🌫️";
  }

  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return "🌧️";
  }

  if (
    code === 95 ||
    code === 96 ||
    code === 99
  ) {
    return "⛈️";
  }

  return "🌤️";
}

/* =========================================================
   MENU LINK
========================================================= */

function MenuLink({
  item,
  children,
  className,
  onClick,
}: {
  item: HeaderMenuItem;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const href =
    normalizeInternalHref(
      item.href
    );

  /*
   * External URL
   */
  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target={
          item.openNewTab
            ? "_blank"
            : undefined
        }
        rel={
          item.openNewTab
            ? "noopener noreferrer"
            : undefined
        }
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  /*
   * Internal localized URL
   */
  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

/* =========================================================
   HEADER
========================================================= */

export default function Header() {
  const translate = useTranslations();
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const pathname =
    usePathname() || "/";

  const locale =
    getLocaleFromPath(pathname);

  const language =
    getApiLanguage(locale);

  const localizedFallbackMenu = useMemo(
    () =>
      fallbackMenuItems.map((item) => {
        const translationKey =
          navigationTranslationKeys[
            normalizeInternalHref(item.href)
          ];

        return {
          ...item,
          language,
          label:
            translationKey && language !== "EN"
              ? translate(`Navigation.${translationKey}`)
              : item.label,
        };
      }),
    [language, translate],
  );

  const homeMenuItem = useMemo<HeaderMenuItem>(
    () => ({
      id: "system-home",
      language,
      label: translate("Navigation.home"),
      href: "/",
      position: -1,
      isVisible: true,
      type: "System",
      desktop: true,
      mobile: true,
      openNewTab: false,
      createdAt: "",
      updatedAt: "",
    }),
    [language, translate],
  );

  /* =======================================================
     STATE
  ======================================================== */

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    currentDate,
    setCurrentDate,
  ] = useState("");

  const [
    temperature,
    setTemperature,
  ] = useState<number | null>(
    null
  );

  const [
    weatherIcon,
    setWeatherIcon,
  ] = useState("🌤️");

  const [
    weatherText,
    setWeatherText,
  ] = useState(
    "Loading weather..."
  );

  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(true);

  const [
    menuItems,
    setMenuItems,
  ] = useState<
    HeaderMenuItem[]
  >(localizedFallbackMenu);

  const [
    siteConfig,
    setSiteConfig,
  ] = useState<HeaderSiteConfig>(
    fallbackSiteConfig
  );

  const [
    headerLoading,
    setHeaderLoading,
  ] = useState(false);

  const darkMode =
    theme === "dark";

  /* =======================================================
     LOAD HEADER CONFIG
  ======================================================== */

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadHeader() {
      try {
        const response =
          await fetch(
            `/api/public/header?language=${language}`,
            {
              method: "GET",
              cache: "no-store",
              signal:
                controller.signal,
            }
          );

        if (!response.ok) {
          throw new Error(
            "Header API request failed"
          );
        }

        const data =
          (await response.json()) as HeaderApiResponse;

        if (
          !data.success ||
          !Array.isArray(
            data.menu
          )
        ) {
          throw new Error(
            "Invalid header API response"
          );
        }

        setMenuItems(
          data.menu.map((item) => {
            const translationKey =
              navigationTranslationKeys[
                normalizeInternalHref(item.href)
              ];

            return {
              ...item,
              label:
                translationKey &&
                item.usesEnglishFallback &&
                data.language !== "EN"
                  ? translate(`Navigation.${translationKey}`)
                  : item.label,
            };
          }),
        );

        if (data.site) {
          setSiteConfig({
            logoUrl:
              data.site.logoUrl ||
              fallbackSiteConfig.logoUrl,

            tagline:
              data.site.tagline ||
              fallbackSiteConfig.tagline,

            social: {
              facebook:
                data.site.social?.facebook ||
                "",

              youtube:
                data.site.social?.youtube ||
                "",

              instagram:
                data.site.social?.instagram ||
                "",

              tiktok:
                data.site.social?.tiktok ||
                "",
            },
          });
        }
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
          "Failed to load header configuration:",
          error
        );
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setHeaderLoading(
            false
          );
        }
      }
    }

    loadHeader();

    return () => {
      controller.abort();
    };
  }, [language, translate]);

  /* =======================================================
     DATE
  ======================================================== */

  useEffect(() => {
    const updateDate = () => {
      const now =
        new Date();

      const formattedDate =
        new Intl.DateTimeFormat(
          "en-GB",
          {
            weekday:
              "long",
            day: "2-digit",
            month:
              "long",
            year: "numeric",
            timeZone:
              "Asia/Colombo",
          }
        ).format(now);

      setCurrentDate(
        formattedDate
      );
    };

    updateDate();

    const interval =
      setInterval(
        updateDate,
        60 * 1000
      );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     WEATHER
  ======================================================== */

  useEffect(() => {
    let cancelled =
      false;

    async function loadWeather() {
      try {
        setWeatherLoading(true);

        const response =
          await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current=temperature_2m,weather_code&timezone=Asia%2FColombo",
            {
              cache:
                "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Weather request failed"
          );
        }

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        const temp =
          data?.current
            ?.temperature_2m;

        const code =
          data?.current
            ?.weather_code;

        if (
          typeof temp ===
          "number"
        ) {
          setTemperature(
            Math.round(temp)
          );
        }

        if (
          typeof code ===
          "number"
        ) {
          setWeatherIcon(
            getWeatherIcon(
              code
            )
          );

          setWeatherText(
            getWeatherText(
              code
            )
          );
        }
      } catch {
        if (!cancelled) {
          setTemperature(null);

          setWeatherIcon(
            "🌤️"
          );

          setWeatherText(
            "Weather unavailable"
          );
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(
            false
          );
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================== */

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    window.location.href =
      `/${locale}/search?q=${encodeURIComponent(
        query
      )}`;

    setSearchQuery("");

    setMobileMenuOpen(
      false
    );
  };

  /* =======================================================
     LANGUAGE SWITCH
  ======================================================== */

  const changeLanguage = (
    nextLocale: Locale
  ) => {
    const currentPath =
      window.location.pathname;

    /*
     * Remove only the existing locale.
     */
    const cleanPath =
      currentPath.replace(
        /^\/(en|si|ta)(?=\/|$)/,
        ""
      );

    const finalPath =
      `/${nextLocale}${
        cleanPath &&
        cleanPath !== "/"
          ? cleanPath
          : ""
      }`;

    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }

    window.location.href =
      finalPath;

    setMobileMenuOpen(
      false
    );
  };

  /* =======================================================
     MENU
  ======================================================== */

  const desktopMenuItems =
    useMemo(() => {
      const remainingItems = [...menuItems]
        .filter(
          (item) =>
            item.isVisible &&
            item.desktop &&
            !isWatchLiveItem(item) &&
            !isHomeItem(item),
        )
        .sort(
          (a, b) =>
            a.position -
            b.position
        );

      return [homeMenuItem, ...remainingItems];
    }, [homeMenuItem, menuItems]);

  const mobileMenuItems =
    useMemo(() => {
      const remainingItems = [...menuItems]
        .filter(
          (item) =>
            item.isVisible &&
            item.mobile &&
            !isWatchLiveItem(item) &&
            !isHomeItem(item),
        )
        .sort(
          (a, b) =>
            a.position -
            b.position
        );

      return [homeMenuItem, ...remainingItems];
    }, [homeMenuItem, menuItems]);

  const watchLiveItem =
    useMemo(() => {
      return menuItems.find(
        (item) =>
          item.isVisible &&
          isWatchLiveItem(
            item
          )
      );
    }, [menuItems]);

  /* =======================================================
     ACTIVE MENU
  ======================================================== */

  function isMenuActive(
    href: string
  ): boolean {
    if (isExternalUrl(href)) {
      return false;
    }

    const normalizedHref =
      normalizeInternalHref(
        href
      );

    const currentPath =
      pathname.replace(
        /^\/(en|si|ta)(?=\/|$)/,
        ""
      ) || "/";

    return (
      normalizedHref ===
        currentPath ||
      (
        normalizedHref !== "/" &&
        currentPath.startsWith(
          `${normalizedHref}/`
        )
      )
    );
  }

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <header className="w-full bg-white dark:bg-[#151a2d]">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="w-full bg-gradient-to-r from-[#ec008c] via-[#b20aa5] to-[#4b168c] text-white">

        <div className="flex min-h-[42px] w-full items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap">

            <span className="truncate text-sm font-medium lg:text-[15px] xl:text-base">
              {currentDate ||
                "TV SUPREME"}
            </span>

            <span className="opacity-50">
              |
            </span>

            <span className="text-sm font-medium lg:text-[15px] xl:text-base">
              Colombo{" "}
              {weatherLoading
                ? "..."
                : temperature !==
                    null
                  ? `${temperature}°C`
                  : "--°C"}
            </span>

            <span
              className="text-base"
              title={
                weatherText
              }
              aria-label={
                weatherText
              }
            >
              {weatherIcon}
            </span>

          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-3">

            {/* LANGUAGE */}

            <div className="hidden items-center gap-1 md:flex">

              <button
                type="button"
                onClick={() =>
                  changeLanguage(
                    "si"
                  )
                }
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition lg:text-[15px] xl:text-base ${
                  locale === "si"
                    ? "bg-white/20 font-bold"
                    : "hover:bg-white/10"
                }`}
              >
                සිංහල
              </button>

              <button
                type="button"
                onClick={() =>
                  changeLanguage(
                    "ta"
                  )
                }
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition lg:text-[15px] xl:text-base ${
                  locale === "ta"
                    ? "bg-white/20 font-bold"
                    : "hover:bg-white/10"
                }`}
              >
                தமிழ்
              </button>

              <button
                type="button"
                onClick={() =>
                  changeLanguage(
                    "en"
                  )
                }
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition lg:text-[15px] xl:text-base ${
                  locale === "en"
                    ? "bg-white/20 font-bold"
                    : "hover:bg-white/10"
                }`}
              >
                English
              </button>

            </div>

            {/* THEME */}

            <button
              type="button"
              onClick={
                toggleTheme
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex h-8 items-center gap-0.5 rounded-full border border-white/40 bg-white/10 px-1"
            >

              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  !darkMode
                    ? "bg-white text-orange-500"
                    : "text-white"
                }`}
              >
                <Sun
                  size={13}
                />
              </span>

              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  darkMode
                    ? "bg-white text-indigo-700"
                    : "text-white"
                }`}
              >
                <Moon
                  size={13}
                />
              </span>

            </button>

            {/* SOCIAL MEDIA */}

            <div className="hidden items-center gap-3 lg:flex">

              {siteConfig.social
                .facebook && (
                <a
                  href={
                    siteConfig
                      .social
                      .facebook
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-sm font-bold transition hover:opacity-70"
                >
                  f
                </a>
              )}

              {siteConfig.social
                .youtube && (
                <a
                  href={
                    siteConfig
                      .social
                      .youtube
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-xs font-bold transition hover:opacity-70"
                >
                  ▶
                </a>
              )}

              {siteConfig.social
                .instagram && (
                <a
                  href={
                    siteConfig
                      .social
                      .instagram
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-sm font-bold transition hover:opacity-70"
                >
                  ◎
                </a>
              )}

              {siteConfig.social
                .tiktok && (
                <a
                  href={
                    siteConfig
                      .social
                      .tiktok
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="transition hover:opacity-70"
                >
                  <Music2
                    size={16}
                  />
                </a>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BRAND / SEARCH ROW
      ====================================================== */}

      <div className="w-full border-b border-slate-200 bg-white dark:border-[#30374e] dark:bg-[#151a2d]">

        <div className="flex min-h-[82px] w-full items-center gap-8 px-6 sm:px-8 lg:px-12 xl:px-16">

          {/* LOGO */}

          <Link
            href="/"
            aria-label="TV Supreme Home"
            className="shrink-0 transition-opacity hover:opacity-90"
          >
            <img
              src={
                siteConfig.logoUrl ||
                "/logo.png"
              }
              alt="TV Supreme"
              className="h-14 w-auto max-w-[210px] object-contain sm:h-16 sm:max-w-[225px]"
            />
          </Link>

          {/* TAGLINE */}

          <div className="hidden min-w-0 flex-1 lg:block">

            {siteConfig.tagline && (
              <p className="truncate text-xs font-medium tracking-wide text-slate-400 lg:text-sm xl:text-base">
                {
                  siteConfig.tagline
                }
              </p>
            )}

          </div>

          {/* DESKTOP SEARCH */}

          <div className="hidden w-full max-w-[460px] flex-1 lg:flex">

            <form
              onSubmit={
                handleSearch
              }
              className="flex w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-[#30374e] dark:bg-[#1c2238]"
            >

              <input
                type="search"
                value={
                  searchQuery
                }
                onChange={(event) =>
                  setSearchQuery(
                    event.target
                      .value
                  )
                }
                placeholder="Search news, videos..."
                aria-label="Search news and videos"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[14px] text-[#111d4a] outline-none placeholder:text-slate-400 lg:text-[15px] xl:text-base dark:text-white"
              />

              <button
                type="submit"
                aria-label="Search"
                className="flex w-12 items-center justify-center bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] text-white transition hover:opacity-90"
              >
                <Search
                  size={20}
                />
              </button>

            </form>

          </div>

          {/* WATCH LIVE */}

          <MenuLink
            item={
              watchLiveItem ?? {
                id: "watch-live-fallback",
                language,
                label: "Watch Now",
                href: "/watch-live",
                position: 0,
                isVisible: true,
                type: "System",
                desktop: true,
                mobile: true,
                openNewTab: false,
                createdAt: "",
                updatedAt: "",
              }
            }
            className="hidden shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] px-5 py-3.5 text-sm font-bold !text-white shadow-sm transition hover:opacity-90 lg:flex lg:text-[15px] xl:px-6 xl:py-4 xl:text-base"
          >

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 !text-white">

              <Play
                size={13}
                fill="currentColor"
              />

            </span>

            <span className="!text-white">
              {watchLiveItem?.label || "Watch Now"}
            </span>

          </MenuLink>

          {/* MOBILE */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (value) =>
                  !value
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={
              mobileMenuOpen
            }
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#111d4a] transition hover:border-[#ec008c] hover:text-[#ec008c] lg:hidden dark:border-[#30374e] dark:bg-[#1c2238] dark:text-white"
          >
            {mobileMenuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

      </div>

      {/* =====================================================
          DESKTOP NAVIGATION
      ====================================================== */}

      <nav className="hidden w-full border-b border-slate-200 bg-white dark:border-[#30374e] dark:bg-[#151a2d] lg:block">

        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">

          <div className="flex min-h-[48px] items-center overflow-x-auto">

            {headerLoading ? (
              <div className="py-3 text-sm text-slate-400">
                Loading navigation...
              </div>
            ) : desktopMenuItems.length ===
              0 ? (
              <div className="py-3 text-sm text-slate-400">
                No navigation items configured.
              </div>
            ) : (
              desktopMenuItems.map(
                (item) => {
                  const active =
                    isMenuActive(
                      item.href
                    );

                  return (
                    <MenuLink
                      key={item.id}
                      item={item}
                      className={`relative shrink-0 whitespace-nowrap px-5 py-3 text-[14px] font-semibold transition lg:px-5 lg:text-[15px] xl:px-6 xl:text-base ${
                        active
                          ? "text-[#ec008c]"
                          : "text-[#111d4a] hover:text-[#ec008c]"
                      } dark:text-white dark:hover:text-[#ec008c]`}
                    >

                      {item.label}

                      <span
                        className={`absolute bottom-0 left-5 right-5 h-[3px] rounded-full bg-[#ec008c] ${
                          active
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                    </MenuLink>
                  );
                }
              )
            )}

          </div>

        </div>

      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white shadow-lg dark:border-[#30374e] dark:bg-[#151a2d] lg:hidden">

          <div className="w-full px-6 py-5">

            {/* SEARCH */}

            <form
              onSubmit={
                handleSearch
              }
              className="mb-5 flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-[#30374e] dark:bg-[#1c2238]"
            >

              <input
                type="search"
                value={
                  searchQuery
                }
                onChange={(event) =>
                  setSearchQuery(
                    event.target
                      .value
                  )
                }
                placeholder="Search news, videos..."
                aria-label="Search news and videos"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#111d4a] outline-none placeholder:text-slate-400 dark:text-white"
              />

              <button
                type="submit"
                aria-label="Search"
                className="flex w-12 items-center justify-center bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] text-white"
              >
                <Search
                  size={19}
                />
              </button>

            </form>

            {/* MOBILE NAV */}

            <nav className="space-y-1">

              {mobileMenuItems.map(
                (item) => {
                  const Icon =
                    getMenuIcon(
                      item.href,
                      item.label
                    );

                  const active =
                    isMenuActive(
                      item.href
                    );

                  return (
                    <MenuLink
                      key={item.id}
                      item={item}
                      onClick={() =>
                        setMobileMenuOpen(
                          false
                        )
                      }
                      className={`group flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-semibold transition ${
                        active
                          ? "bg-fuchsia-50 text-[#ec008c]"
                          : "text-[#111d4a] hover:bg-fuchsia-50 hover:text-[#ec008c]"
                      } dark:text-white dark:hover:bg-[#242044]`}
                    >

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                          active
                            ? "bg-[#ec008c] text-white"
                            : "bg-fuchsia-50 text-[#ec008c] group-hover:bg-[#ec008c] group-hover:text-white"
                        } dark:bg-[#242044]`}
                      >
                        <Icon
                          size={20}
                          strokeWidth={2}
                        />
                      </span>

                      <span>
                        {
                          item.label
                        }
                      </span>

                    </MenuLink>
                  );
                }
              )}

            </nav>

            {/* LANGUAGE */}

            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-[#30374e]">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Language
              </p>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage(
                      "si"
                    )
                  }
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    locale === "si"
                      ? "bg-[#ec008c] text-white"
                      : "bg-fuchsia-50 text-fuchsia-700 dark:bg-[#35172c] dark:text-fuchsia-300"
                  }`}
                >
                  සිංහල
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage(
                      "ta"
                    )
                  }
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    locale === "ta"
                      ? "bg-[#ec008c] text-white"
                      : "bg-fuchsia-50 text-fuchsia-700 dark:bg-[#35172c] dark:text-fuchsia-300"
                  }`}
                >
                  தமிழ்
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage(
                      "en"
                    )
                  }
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    locale === "en"
                      ? "bg-[#ec008c] text-white"
                      : "bg-fuchsia-50 text-fuchsia-700 dark:bg-[#35172c] dark:text-fuchsia-300"
                  }`}
                >
                  English
                </button>

              </div>

            </div>

            {/* MOBILE WATCH LIVE */}

            {watchLiveItem && (
              <MenuLink
                item={
                  watchLiveItem
                }
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] px-4 py-3.5 text-sm font-bold !text-white shadow-sm transition hover:opacity-90"
              >

                <Play
                  size={15}
                  fill="currentColor"
                />

                <span className="!text-white">
                  {watchLiveItem.label}
                </span>

              </MenuLink>
            )}

          </div>

        </div>
      )}

    </header>
  );
}
