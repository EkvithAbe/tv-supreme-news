"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  Home,
  Landmark,
  Briefcase,
  Trophy,
  Clapperboard,
  Cpu,
  Leaf,
  ListFilter,
  Newspaper,
  Search,
} from "lucide-react";

import { useMemo, useState } from "react";

import { latestNews } from "@/data/homepage";
import { Link } from "@/i18n/navigation";

/* =========================================================
   TYPES
========================================================= */

type CategoryPageProps = {
  categorySlug: string;
};

type SortOption = "latest" | "oldest" | "popular";

/* =========================================================
   CATEGORY LIST
========================================================= */

const categories = [
  {
    name: "Latest",
    slug: "latest",
    icon: Newspaper,
  },
  {
    name: "Sri Lanka",
    slug: "sri-lanka",
    icon: Home,
  },
  {
    name: "World",
    slug: "world",
    icon: Globe2,
  },
  {
    name: "Politics",
    slug: "politics",
    icon: Landmark,
  },
  {
    name: "Business",
    slug: "business",
    icon: Briefcase,
  },
  {
    name: "Sports",
    slug: "sports",
    icon: Trophy,
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    icon: Clapperboard,
  },
  {
    name: "Technology",
    slug: "technology",
    icon: Cpu,
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    icon: Leaf,
  },
];

/* =========================================================
   CATEGORY INFORMATION
========================================================= */

const categoryInfo: Record<
  string,
  {
    title: string;
    description: string;
    image: string;
  }
> = {
  latest: {
    title: "Latest News",
    description:
      "Stay informed with the latest stories and important updates.",
    image: "/images/home/hero.jpg",
  },

  "sri-lanka": {
    title: "Sri Lanka News",
    description:
      "The latest news and developments from Sri Lanka.",
    image: "/images/news/president.jpg",
  },

  world: {
    title: "World News",
    description:
      "Important stories and developments from around the world.",
    image: "/images/news/world.jpg",
  },

  politics: {
    title: "Politics News",
    description:
      "Political news, updates and developments.",
    image: "/images/news/president.jpg",
  },

  business: {
    title: "Business News",
    description:
      "Business, economy, markets and investment news.",
    image: "/images/news/port.jpg",
  },

  sports: {
    title: "Sports News",
    description:
      "The latest sports news, results and updates.",
    image: "/images/news/cricket.jpg",
  },

  entertainment: {
    title: "Entertainment News",
    description:
      "Entertainment, celebrities and the latest happenings.",
    image: "/images/news/world.jpg",
  },

  technology: {
    title: "Technology News",
    description:
      "Technology, AI, gadgets and digital developments.",
    image: "/images/news/technology.jpg",
  },

  lifestyle: {
    title: "Lifestyle News",
    description:
      "Lifestyle, people, travel, food and more.",
    image: "/images/news/phone.jpg",
  },
};

/* =========================================================
   HELPER
========================================================= */

function getCategoryKey(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/* =========================================================
   PAGE
========================================================= */

export default function CategoryPage({
  categorySlug,
}: CategoryPageProps) {
  const [searchText, setSearchText] =
    useState("");

  const [sortBy, setSortBy] =
    useState<SortOption>("latest");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;

  /* =======================================================
     CATEGORY INFORMATION
  ======================================================== */

  const info =
    categoryInfo[categorySlug] ??
    categoryInfo.latest;

  /* =======================================================
     FILTER NEWS
  ======================================================== */

  const filteredNews = useMemo(() => {
    let result = [...latestNews];

    /* CATEGORY FILTER */

    if (categorySlug !== "latest") {
      result = result.filter((article) => {
        const articleCategory =
          getCategoryKey(article.category);

        return (
          articleCategory === categorySlug
        );
      });
    }

    /* SEARCH FILTER */

    if (searchText.trim()) {
      const query =
        searchText.trim().toLowerCase();

      result = result.filter((article) => {
        const searchableText = [
          article.title,
          article.category,
          article.time,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    /* SORT */

    if (sortBy === "oldest") {
      result = [...result].reverse();
    }

    /*
      We don't have real view counts in the current
      homepage dataset, so "popular" temporarily keeps
      the current order rather than pretending to know
      which story is most popular.
      
      This will become a real popularity sort after
      the CMS/news model contains views.
    */

    if (selectedDate) {
      /*
        The current hardcoded news data contains only
        "time", not a publication date.
        
        We intentionally do not fake date filtering.
        This will be connected when publishedAt is
        added to the CMS-ready news model.
      */
    }

    return result;
  }, [
    categorySlug,
    searchText,
    sortBy,
    selectedDate,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredNews.length / itemsPerPage
    )
  );

  const visibleNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* =======================================================
     CATEGORY CHANGE
  ======================================================== */

  const handleCategoryChange = () => {
    setCurrentPage(1);
    setSearchText("");
    setSelectedDate("");
  };

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <main className="min-h-screen bg-white dark:bg-[#0f1425]">
      {/* =====================================================
          CATEGORY HERO
      ====================================================== */}

      <section className="px-0 pt-6 sm:pt-8">
        <div className="tv-container">
          <div className="relative h-[190px] overflow-hidden rounded-2xl sm:h-[220px]">
            <img
              src={info.image}
              alt={info.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#35105f]/95 via-[#6a1b9a]/75 to-[#ec008c]/45" />

            <div className="relative z-10 flex h-full items-center px-6 sm:px-9">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/85">
                  <Newspaper size={18} />

                  <span>
                    TV SUPREME
                  </span>
                </div>

                <h1 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                  {info.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                  {info.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="py-7 sm:py-9">
        <div className="tv-container">
          <div className="grid gap-7 lg:grid-cols-[245px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]">

            {/* =================================================
                SIDEBAR
            ================================================== */}

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#30374e] dark:bg-[#151a2d]">
              {/* SEARCH */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-bold text-[#111d4a] dark:text-white">
                  Search
                </label>

                <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-[#30374e] dark:bg-[#1c2238]">
                  <input
                    type="search"
                    value={searchText}
                    onChange={(event) => {
                      setSearchText(
                        event.target.value
                      );

                      setCurrentPage(1);
                    }}
                    placeholder="Search news..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#111d4a] outline-none placeholder:text-slate-400 dark:text-white"
                  />

                  <div className="flex w-10 items-center justify-center text-[#ec008c]">
                    <Search size={17} />
                  </div>
                </div>
              </div>

              {/* CATEGORY LIST */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#111d4a] dark:text-white">
                    Categories
                  </h2>

                  <ListFilter
                    size={17}
                    className="text-[#ec008c]"
                  />
                </div>

                <div className="space-y-1.5">
                  {categories.map(
                    (category) => {
                      const Icon =
                        category.icon;

                      const active =
                        category.slug ===
                        categorySlug;

                      return (
                        <Link
                          key={category.slug}
                          href={
                            category.slug ===
                            "latest"
                              ? "/latest"
                              : `/${category.slug}`
                          }
                          onClick={
                            handleCategoryChange
                          }
                          className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                            active
                              ? "bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] text-white shadow-sm"
                              : "text-[#111d4a] hover:bg-fuchsia-50 hover:text-[#ec008c] dark:text-white dark:hover:bg-[#242044]"
                          }`}
                        >
                          <Icon
                            size={17}
                            strokeWidth={2}
                          />

                          <span className="flex-1">
                            {category.name}
                          </span>

                          {active && (
                            <ChevronRight
                              size={15}
                            />
                          )}
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>

              {/* DATE FILTER */}

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-[#30374e]">
                <h2 className="mb-3 text-base font-extrabold text-[#111d4a] dark:text-white">
                  Filter by Date
                </h2>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => {
                      setSelectedDate(
                        event.target.value
                      );

                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-[#111d4a] outline-none dark:border-[#30374e] dark:bg-[#1c2238] dark:text-white"
                  />
                </div>
              </div>
            </aside>

            {/* =================================================
                MAIN NEWS AREA
            ================================================== */}

            <div>
              {/* HEADER */}

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#ec008c]">
                    Newsroom
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-[#111d4a] dark:text-white sm:text-3xl">
                    {info.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {filteredNews.length}{" "}
                    {filteredNews.length === 1
                      ? "story"
                      : "stories"}
                  </p>
                </div>

                {/* SORT */}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Sort by
                  </span>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(event) => {
                        setSortBy(
                          event.target
                            .value as SortOption
                        );

                        setCurrentPage(1);
                      }}
                      className="appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-[#111d4a] outline-none dark:border-[#30374e] dark:bg-[#151a2d] dark:text-white"
                    >
                      <option value="latest">
                        Latest First
                      </option>

                      <option value="oldest">
                        Oldest First
                      </option>

                      <option value="popular">
                        Most Popular
                      </option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  NEWS CARDS
              ================================================== */}

              <div className="space-y-4">
                {visibleNews.map(
                  (article) => (
                    <article
                      key={article.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#30374e] dark:bg-[#151a2d] sm:flex-row"
                    >
                      {/* IMAGE */}

                      <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-xl sm:h-[145px] sm:w-[230px]">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <div className="absolute left-3 top-3 rounded-md bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          {article.category}
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <div>
                          <h3 className="text-lg font-extrabold leading-7 text-[#111d4a] transition group-hover:text-[#ec008c] dark:text-white sm:text-xl">
                            {article.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Stay updated with the
                            latest developments
                            and important details
                            from TV SUPREME.
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3
                              size={14}
                            />

                            {article.time}
                          </span>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>

              {/* =================================================
                  NO RESULTS
              ================================================== */}

              {visibleNews.length === 0 && (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-[#30374e] dark:bg-[#151a2d]">
                  <Search
                    size={32}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-4 text-lg font-bold text-[#111d4a] dark:text-white">
                    No news found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try another search or category.
                  </p>
                </div>
              )}

              {/* =================================================
                  PAGINATION
              ================================================== */}

              {filteredNews.length > 0 && (
                <div className="mt-7 flex items-center justify-center gap-2">
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#ec008c] hover:text-[#ec008c] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#30374e] dark:bg-[#151a2d]"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] text-white shadow-sm"
                          : "border border-slate-200 bg-white text-[#111d4a] hover:border-[#ec008c] hover:text-[#ec008c] dark:border-[#30374e] dark:bg-[#151a2d] dark:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* NEXT */}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#ec008c] hover:text-[#ec008c] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#30374e] dark:bg-[#151a2d]"
                    aria-label="Next page"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}