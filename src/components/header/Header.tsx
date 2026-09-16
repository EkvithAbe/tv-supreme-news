"use client";

import {
  Search,
  Sun,
  Moon,
  Music2,
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
} from "lucide-react";

import { FormEvent, useEffect, useState } from "react";

import { useTheme } from "@/components/common/ThemeProvider";
import { Link } from "@/i18n/navigation";

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: House,
  },
  {
    name: "Latest",
    href: "/latest",
    icon: Newspaper,
  },
  {
    name: "Sri Lanka",
    href: "/sri-lanka",
    icon: House,
  },
  {
    name: "World",
    href: "/world",
    icon: Globe2,
  },
  {
    name: "Politics",
    href: "/politics",
    icon: Landmark,
  },
  {
    name: "Business",
    href: "/business",
    icon: Briefcase,
  },
  {
    name: "Sports",
    href: "/sports",
    icon: Trophy,
  },
  {
    name: "Entertainment",
    href: "/entertainment",
    icon: Clapperboard,
  },
  {
    name: "Technology",
    href: "/technology",
    icon: Cpu,
  },
  {
    name: "Lifestyle",
    href: "/lifestyle",
    icon: Leaf,
  },
  {
    name: "Video",
    href: "/video",
    icon: Video,
  },
];

/* =========================================================
   WEATHER
========================================================= */

function getWeatherText(code: number) {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";

  if ([45, 48].includes(code)) {
    return "Foggy";
  }

  if ([51, 53, 55].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65].includes(code)) {
    return "Rain";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(code)) {
    return "Rain showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Weather";
}

function getWeatherIcon(code: number) {
  if (code === 0) return "☀️";

  if (code === 1 || code === 2) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if ([45, 48].includes(code)) {
    return "🌫️";
  }

  if (
    [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
  ) {
    return "🌧️";
  }

  if ([95, 96, 99].includes(code)) {
    return "⛈️";
  }

  return "🌤️";
}

/* =========================================================
   HEADER
========================================================= */

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentDate, setCurrentDate] =
    useState("");

  const [temperature, setTemperature] =
    useState<number | null>(null);

  const [weatherIcon, setWeatherIcon] =
    useState("🌤️");

  const [weatherText, setWeatherText] =
    useState("Loading weather...");

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  const darkMode = theme === "dark";

  /* =========================================================
     CURRENT DATE
  ========================================================= */

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();

      const formattedDate = new Intl.DateTimeFormat(
        "en-GB",
        {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Colombo",
        }
      ).format(now);

      setCurrentDate(formattedDate);
    };

    updateDate();

    const interval = setInterval(
      updateDate,
      60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     CURRENT COLOMBO WEATHER
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        setWeatherLoading(true);

        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current=temperature_2m,weather_code&timezone=Asia%2FColombo",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Weather request failed"
          );
        }

        const data = await response.json();

        if (cancelled) return;

        const temp =
          data?.current?.temperature_2m;

        const code =
          data?.current?.weather_code;

        if (typeof temp === "number") {
          setTemperature(
            Math.round(temp)
          );
        }

        if (typeof code === "number") {
          setWeatherIcon(
            getWeatherIcon(code)
          );

          setWeatherText(
            getWeatherText(code)
          );
        }
      } catch {
        if (!cancelled) {
          setTemperature(null);
          setWeatherIcon("🌤️");
          setWeatherText(
            "Weather unavailable"
          );
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    /*
      Search is relative to the current locale.

      We manually build the path so the current
      language is preserved correctly.

      /en        -> /en/search?q=...
      /si        -> /si/search?q=...
      /ta        -> /ta/search?q=...
    */

    const currentPath =
      window.location.pathname;

    const localeMatch =
      currentPath.match(
        /^\/(en|si|ta)(?=\/|$)/
      );

    const locale =
      localeMatch?.[1] || "en";

    window.location.href =
      `/${locale}/search?q=${encodeURIComponent(query)}`;

    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  /* =========================================================
     LANGUAGE SWITCHER
  ========================================================= */

  const changeLanguage = (
    locale: "en" | "si" | "ta"
  ) => {
    const currentPath =
      window.location.pathname;

    /*
      Remove ONLY the existing locale from
      the beginning of the URL.

      Examples:

      /en
        -> /

      /en/latest
        -> /latest

      /en/sports
        -> /sports

      /ta/latest
        -> /latest
    */

    const cleanPath =
      currentPath.replace(
        /^\/(en|si|ta)(?=\/|$)/,
        ""
      );

    const nextPath =
      cleanPath || "/";

    /*
      Add exactly one locale.
    */

    const finalPath =
      `/${locale}${
        nextPath === "/"
          ? ""
          : nextPath
      }`;

    /*
      Use the browser navigation directly.
      This guarantees the URL becomes:

      /en/...
      /si/...
      /ta/...

      and NEVER:

      /en/ta/...
      /si/en/...
    */

    window.location.href =
      finalPath;

    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white dark:bg-[#151a2d]">
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="bg-gradient-to-r from-[#ec008c] via-[#b20aa5] to-[#4b168c] text-white">
        <div className="tv-container flex min-h-[40px] items-center justify-between gap-3 text-sm">

          {/* DATE + WEATHER */}

          <div className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="truncate">
              {currentDate ||
                "Loading date..."}
            </span>

            <span className="hidden opacity-60 sm:inline">
              |
            </span>

            <span className="hidden sm:inline">
              Colombo{" "}
              {weatherLoading
                ? "Loading..."
                : temperature !== null
                  ? `${temperature}°C`
                  : "--°C"}
            </span>

            <span
              title={weatherText}
              aria-label={weatherText}
            >
              {weatherIcon}
            </span>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex shrink-0 items-center gap-3">

            {/* LANGUAGES */}

            <div className="hidden items-center gap-4 sm:flex">
              <button
                type="button"
                onClick={() =>
                  changeLanguage("si")
                }
                className="text-sm font-medium transition hover:opacity-75"
              >
                සිංහල
              </button>

              <button
                type="button"
                onClick={() =>
                  changeLanguage("ta")
                }
                className="text-sm font-medium transition hover:opacity-75"
              >
                தமிழ்
              </button>

              <button
                type="button"
                onClick={() =>
                  changeLanguage("en")
                }
                className="text-sm font-medium transition hover:opacity-75"
              >
                English
              </button>
            </div>

            {/* THEME TOGGLE */}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex h-8 items-center gap-1 rounded-full border border-white/40 bg-white/15 px-1.5 transition hover:bg-white/25"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                  !darkMode
                    ? "bg-white text-orange-500"
                    : "text-white"
                }`}
              >
                <Sun size={14} />
              </span>

              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                  darkMode
                    ? "bg-white text-indigo-700"
                    : "text-white"
                }`}
              >
                <Moon size={14} />
              </span>
            </button>

            {/* SOCIAL */}

            <div className="hidden items-center gap-3 lg:flex">
              <a
                href="#"
                aria-label="Facebook"
                className="text-base font-bold transition hover:opacity-75"
              >
                f
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="text-xs font-bold transition hover:opacity-75"
              >
                ▶
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="text-base font-bold transition hover:opacity-75"
              >
                ◎
              </a>

              <a
                href="#"
                aria-label="X"
                className="text-base font-bold transition hover:opacity-75"
              >
                X
              </a>

              <a
                href="#"
                aria-label="TikTok"
                className="transition hover:opacity-75"
              >
                <Music2 size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 bg-white dark:border-[#30374e] dark:bg-[#151a2d]">
        <div className="tv-container flex min-h-[92px] items-center justify-between gap-5">

          {/* LOGO */}

          <Link
            href="/"
            className="shrink-0 transition-opacity hover:opacity-90"
          >
            <div className="flex items-center gap-3">

              {/* LOGO MARK */}

              <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec008c] to-[#5b16a5] text-white shadow-sm">
                <span className="text-2xl font-bold">
                  ♛
                </span>
              </div>

              {/* LOGO TEXT */}

              <div>
                <div className="text-xl font-black leading-none text-[#111d4a] dark:text-white sm:text-2xl">
                  TV SUPREME
                </div>

                <div className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs">
                  NEWS. PEOPLE. A BRIGHTER TOMORROW.
                </div>
              </div>
            </div>
          </Link>

          {/* TAGLINE */}

          <div className="hidden xl:block">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              NEWS • PEOPLE • A BRIGHTER TOMORROW
            </p>
          </div>

          {/* DESKTOP SEARCH */}

          <div className="hidden flex-1 md:flex md:max-w-[420px]">
            <form
              className="flex w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-[#30374e] dark:bg-[#1c2238]"
              onSubmit={handleSearch}
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search news, videos..."
                aria-label="Search news and videos"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-[#111d4a] outline-none placeholder:text-slate-400 dark:text-white"
              />

              <button
                type="submit"
                aria-label="Search"
                className="flex w-13 items-center justify-center bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] text-white transition hover:opacity-90"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* WATCH LIVE */}

          <Link
            href="/watch-live"
            className="hidden shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-[#ec008c] to-[#5b16a5] px-5 py-3 text-base font-bold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md sm:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Play
                size={14}
                fill="currentColor"
              />
            </span>

            <span>
              Watch Live
            </span>
          </Link>

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (value) => !value
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
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#111d4a] transition hover:border-[#ec008c] hover:text-[#ec008c] dark:border-[#30374e] dark:bg-[#1c2238] dark:text-white md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          DESKTOP NAVIGATION
      ====================================================== */}

      <nav className="hidden border-b border-slate-200 bg-white dark:border-[#30374e] dark:bg-[#151a2d] md:block">
        <div className="tv-container">
          <div className="flex items-center justify-center overflow-x-auto">
            {navigation.map(
              (item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-base font-semibold text-[#111d4a] transition hover:border-[#ec008c] hover:text-[#ec008c] dark:text-white dark:hover:text-[#ec008c]"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white shadow-lg dark:border-[#30374e] dark:bg-[#151a2d] md:hidden">
          <div className="tv-container py-5">

            {/* MOBILE SEARCH */}

            <form
              className="mb-5 flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-[#30374e] dark:bg-[#1c2238]"
              onSubmit={handleSearch}
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search news, videos..."
                aria-label="Search news and videos"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base text-[#111d4a] outline-none placeholder:text-slate-400 dark:text-white"
              />

              <button
                type="submit"
                aria-label="Search"
                className="flex w-12 items-center justify-center bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] text-white"
              >
                <Search size={19} />
              </button>
            </form>

            {/* CATEGORY MENU */}

            <nav className="space-y-1">
              {navigation.map(
                (item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() =>
                        setMobileMenuOpen(
                          false
                        )
                      }
                      className="group flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-semibold text-[#111d4a] transition hover:bg-fuchsia-50 hover:text-[#ec008c] dark:text-white dark:hover:bg-[#242044] dark:hover:text-[#ec008c]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fuchsia-50 text-[#ec008c] transition group-hover:bg-[#ec008c] group-hover:text-white dark:bg-[#242044]">
                        <Icon
                          size={20}
                          strokeWidth={2}
                        />
                      </span>

                      <span>
                        {item.name}
                      </span>
                    </Link>
                  );
                }
              )}
            </nav>

            {/* MOBILE LANGUAGES */}

            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-[#30374e]">
              <p className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Language
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("si")
                  }
                  className="rounded-lg bg-fuchsia-50 px-4 py-2.5 text-sm font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100 dark:bg-[#35172c] dark:text-fuchsia-300"
                >
                  සිංහල
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("ta")
                  }
                  className="rounded-lg bg-fuchsia-50 px-4 py-2.5 text-sm font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100 dark:bg-[#35172c] dark:text-fuchsia-300"
                >
                  தமிழ்
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("en")
                  }
                  className="rounded-lg bg-fuchsia-50 px-4 py-2.5 text-sm font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100 dark:bg-[#35172c] dark:text-fuchsia-300"
                >
                  English
                </button>
              </div>
            </div>

            {/* MOBILE WATCH LIVE */}

            <Link
              href="/watch-live"
              onClick={() =>
                setMobileMenuOpen(
                  false
                )
              }
              className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ec008c] to-[#5b16a5] px-4 py-3.5 text-base font-bold text-white shadow-sm"
            >
              <Play
                size={16}
                fill="currentColor"
              />

              Watch Live
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}