import Image from "next/image";
import Link from "next/link";
import type { ElementType } from "react";

import {
  ArrowRight,
  BarChart3,
  Clapperboard,
  Cpu,
  Eye,
  Globe2,
  Home,
  Landmark,
  Leaf,
  Play,
  Trophy,
} from "lucide-react";

import { getArticles } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { prisma } from "@/lib/prisma";

/* =========================================================
   TYPES
========================================================= */

type SupportedLanguage = "EN" | "SI" | "TA";

type HomeArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  views: number;
  publishedAt: Date | string | null;
  isBreaking: boolean;
  isFeatured: boolean;
  showOnHomepage: boolean;
  showInLatest: boolean;
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  mainImage: {
    id: string;
    url: string;
    altText: string | null;
  } | null;
  tags: {
    id: string;
    slug: string;
    name: string;
  }[];
};

type HomeVideo = {
  id: string;
  title: string;
  image: string;
  duration: string;
  views: number;
  publishedAt: Date | string | null;
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

/* =========================================================
   CATEGORY ICONS
   These are UI mappings, not content data.
========================================================= */

const categoryIcons: Record<
  string,
  ElementType
> = {
  "sri-lanka": Home,
  world: Globe2,
  politics: Landmark,
  business: BarChart3,
  sports: Trophy,
  entertainment: Clapperboard,
  technology: Cpu,
  lifestyle: Leaf,
};

/* =========================================================
   CATEGORY IMAGES
   UI fallback images only.
   Actual category/content data comes from PostgreSQL.
========================================================= */

const categoryImages: Record<
  string,
  string
> = {
  "sri-lanka": "/images/news/president.jpg",
  world: "/images/news/world.jpg",
  politics: "/images/news/president.jpg",
  business: "/images/news/port.jpg",
  sports: "/images/news/cricket.jpg",
  entertainment: "/images/news/world.jpg",
  technology: "/images/news/technology.jpg",
  lifestyle: "/images/news/phone.jpg",
};

/* =========================================================
   HELPERS
========================================================= */

function formatTime(
  value: Date | string | null,
) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    diff / 1000 / 60,
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(
    "en-LK",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function formatDuration(
  seconds: number | null,
) {
  if (!seconds || seconds <= 0) {
    return "00:00";
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  const remainingSeconds =
    seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0",
  )}:${String(remainingSeconds).padStart(
    2,
    "0",
  )}`;
}

/* =========================================================
   LOAD HOMEPAGE DATA
========================================================= */

async function getHomepageData() {
  const [
    articleResult,
    categoryResult,
    videoRecords,
  ] = await Promise.all([
    getArticles({
      language: "EN",
      status: "PUBLISHED",
      page: 1,
      pageSize: 100,
    }),

    getCategories("EN"),

    prisma.video.findMany({
      where: {
        status: "PUBLISHED",
        language: "EN",
      },

      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 3,

      select: {
        id: true,
        title: true,
        thumbnailId: true,
        duration: true,
        views: true,
        publishedAt: true,
      },
    }),
  ]);

  const articles =
    articleResult.articles as HomeArticle[];

  const categories =
    categoryResult.map(
      (category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      }),
    ) as CategoryItem[];

  /*
   * Load video thumbnail media separately.
   * This follows the same pattern we have been
   * using elsewhere to avoid relation typing issues.
   */

  const thumbnailIds =
    videoRecords
      .map(
        (video) =>
          video.thumbnailId,
      )
      .filter(
        (
          id,
        ): id is string =>
          Boolean(id),
      );

  const thumbnailRecords =
    thumbnailIds.length > 0
      ? await prisma.media.findMany({
          where: {
            id: {
              in: thumbnailIds,
            },
          },

          select: {
            id: true,
            url: true,
            altText: true,
          },
        })
      : [];

  const thumbnailMap =
    new Map(
      thumbnailRecords.map(
        (media) => [
          media.id,
          media,
        ],
      ),
    );

  const videos: HomeVideo[] =
    videoRecords.map(
      (video) => ({
        id: video.id,
        title: video.title,

        image:
          (video.thumbnailId
            ? thumbnailMap.get(
                video.thumbnailId,
              )?.url
            : undefined) ??
          "/images/home/live-tv.jpg",

        duration:
          formatDuration(
            video.duration,
          ),

        views: video.views,

        publishedAt:
          video.publishedAt,
      }),
    );

  /*
   * Latest news:
   * newest published articles first.
   */
  const latestNews =
    articles
      .filter(
        (article) =>
          article.showInLatest,
      )
      .slice(0, 5);

  /*
   * Homepage articles:
   * first use articles explicitly marked
   * "Show on Homepage".
   */
  const homepageArticles =
    articles.filter(
      (article) =>
        article.showOnHomepage,
    );

  /*
   * Featured articles:
   * used when homepage articles are
   * not available.
   */
  const featuredArticles =
    articles.filter(
      (article) =>
        article.isFeatured,
    );

  /*
   * Hero article:
   *
   * 1. Show on Homepage
   * 2. Featured
   * 3. Latest published article
   */
  const heroStory =
    homepageArticles[0] ??
    featuredArticles[0] ??
    articles[0] ??
    null;

  /*
   * Top stories:
   * Homepage -> Featured -> Latest.
   *
   * Remove duplicates by ID.
   */
  const topStoryCandidates = [
    ...homepageArticles,
    ...featuredArticles,
    ...articles,
  ];

  const topStories: HomeArticle[] = [];

  const usedStoryIds =
    new Set<string>();

  for (const article of topStoryCandidates) {
    if (
      usedStoryIds.has(article.id)
    ) {
      continue;
    }

    if (
      heroStory &&
      article.id === heroStory.id
    ) {
      continue;
    }

    usedStoryIds.add(article.id);
    topStories.push(article);

    if (topStories.length >= 4) {
      break;
    }
  }

  /*
   * Trending topics:
   * Build them from real article tags.
   */
  const trendingTopics: string[] = [];

  const usedTopics =
    new Set<string>();

  for (const article of articles) {
    for (const tag of article.tags) {
      const topic =
        tag.name.trim();

      if (!topic) {
        continue;
      }

      const key =
        topic.toLowerCase();

      if (
        usedTopics.has(key)
      ) {
        continue;
      }

      usedTopics.add(key);
      trendingTopics.push(topic);

      if (trendingTopics.length >= 6) {
        break;
      }
    }

    if (
      trendingTopics.length >= 6
    ) {
      break;
    }
  }

  /*
   * Make sure homepage still has useful
   * fallback topics when the database has
   * no tags yet.
   *
   * These are interface fallbacks, not
   * article records.
   */
  if (
    trendingTopics.length === 0
  ) {
    trendingTopics.push(
      ...categories
        .slice(0, 6)
        .map(
          (category) =>
            category.name,
        ),
    );
  }

  return {
    articles,
    latestNews,
    categories,
    trendingTopics,
    topStories,
    heroStory,
    videos,
  };
}

/* =========================================================
   HOME PAGE
========================================================= */

export default async function HomePage() {
  const {
    latestNews,
    categories,
    trendingTopics,
    topStories,
    heroStory,
    videos,
  } = await getHomepageData();

  return (
    <main className="bg-white text-[#111d4a]">
      {/* =====================================================
          HERO + LATEST NEWS
      ====================================================== */}

      <section className="tv-container py-6 sm:py-7 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,0.95fr)]">
          {/* =================================================
              HERO
          ================================================== */}

          <article className="relative overflow-hidden rounded-xl bg-black shadow-sm">
            {heroStory ? (
              <div className="relative aspect-[16/9] min-h-[330px] sm:min-h-[400px]">
                <Image
                  src={
                    heroStory.mainImage?.url ??
                    "/images/home/hero.jpg"
                  }
                  alt={
                    heroStory.mainImage
                      ?.altText ??
                    heroStory.title
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 67vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                {/* Category */}
                <span className="absolute left-4 top-4 rounded-md bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                  {
                    heroStory.category
                      ?.name
                  }
                </span>

                {/* Previous */}
                <button
                  type="button"
                  aria-label="Previous story"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-xl text-white transition hover:bg-black/75"
                >
                  ‹
                </button>

                {/* Next */}
                <button
                  type="button"
                  aria-label="Next story"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-xl text-white transition hover:bg-black/75"
                >
                  ›
                </button>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-7">
                  <h1 className="max-w-4xl text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {
                      heroStory.title
                    }
                  </h1>

                  {heroStory.summary && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                      {
                        heroStory.summary
                      }
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-white">
                    <span>
                      ◷{" "}
                      {formatTime(
                        heroStory.publishedAt,
                      )}
                    </span>

                    <span>
                      ◉{" "}
                      {
                        heroStory.views
                      }
                    </span>

                    <Link
                      href={`/news/${heroStory.slug}`}
                      className="ml-auto inline-flex items-center gap-1.5 font-bold text-white transition hover:text-fuchsia-200"
                    >
                      Read More
                      <ArrowRight
                        size={16}
                      />
                    </Link>
                  </div>
                </div>

                {/* Hero dots */}
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                  <span className="h-1.5 w-5 rounded-full bg-[#ec008c]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                </div>
              </div>
            ) : (
              <div className="flex aspect-[16/9] min-h-[330px] items-center justify-center text-white sm:min-h-[400px]">
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-white/70">
                    TV SUPREME
                  </p>

                  <h1 className="mt-2 text-3xl font-extrabold">
                    Latest News
                  </h1>

                  <p className="mt-2 text-sm text-white/70">
                    No published articles yet.
                  </p>
                </div>
              </div>
            )}
          </article>

          {/* =================================================
              LATEST NEWS
          ================================================== */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Latest News
              </h2>

              <Link
                href="/latest"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#ec008c]"
              >
                View All
                <ArrowRight
                  size={15}
                />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {latestNews.length >
              0 ? (
                latestNews.map(
                  (news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.slug}`}
                      className="flex gap-3.5 py-3.5 first:pt-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-lg sm:h-[72px] sm:w-[100px]">
                        <Image
                          src={
                            news.mainImage
                              ?.url ??
                            "/images/home/hero.jpg"
                          }
                          alt={
                            news.mainImage
                              ?.altText ??
                            news.title
                          }
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#ec008c]">
                          {
                            news
                              .category
                              ?.name
                          }
                        </p>

                        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#111d4a] sm:text-base">
                          {
                            news.title
                          }
                        </h3>

                        <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                          {formatTime(
                            news.publishedAt,
                          )}
                        </p>
                      </div>
                    </Link>
                  ),
                )
              ) : (
                <div className="py-10 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    No published news yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Slider dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-[#ec008c]" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        </div>
      </section>

      {/* =====================================================
          EXPLORE BY CATEGORY
      ====================================================== */}

      <section className="tv-container py-5 sm:py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Explore by Category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Find the stories that matter to you.
            </p>
          </div>

          <Link
            href="/latest"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#ec008c]"
          >
            View All
            <ArrowRight
              size={15}
            />
          </Link>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map(
            (category) => {
              const Icon =
                categoryIcons[
                  category.slug
                ] ?? Home;

              return (
                <Link
                  href={`/${category.slug}`}
                  key={category.id}
                  className="group flex min-h-[88px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-2 py-4 text-center transition hover:border-[#ec008c] hover:bg-fuchsia-50 hover:shadow-sm"
                >
                  <span className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#ec008c] shadow-sm transition group-hover:bg-gradient-to-br group-hover:from-[#ec008c] group-hover:to-[#6a1b9a] group-hover:text-white">
                    <Icon
                      size={21}
                      strokeWidth={2}
                    />
                  </span>

                  <span className="text-xs font-bold sm:text-sm">
                    {
                      category.name
                    }
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </section>

      {/* =====================================================
          LIVE TV + FEATURED VIDEOS + PROMO
      ====================================================== */}

      <section className="tv-container py-6">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr_0.72fr]">
          {/* =================================================
              LIVE TV
          ================================================== */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold sm:text-2xl">
                Live TV
              </h2>

              <Link
                href="/watch-live"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#ec008c]"
              >
                Watch Live
                <ArrowRight
                  size={15}
                />
              </Link>
            </div>

            <Link
              href="/watch-live"
              className="group block overflow-hidden rounded-xl bg-black shadow-sm"
            >
              <div className="relative aspect-video">
                <Image
                  src="/images/home/live-tv.jpg"
                  alt="TV SUPREME Live"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />

                <span className="absolute left-4 top-4 rounded-md bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white">
                  ● LIVE
                </span>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                    <Play
                      size={22}
                      fill="currentColor"
                    />
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-4 pt-16 text-white">
                  <h3 className="text-base font-extrabold sm:text-lg">
                    TV SUPREME LIVE
                  </h3>

                  <p className="mt-1 text-xs text-white/80 sm:text-sm">
                    Trusted News. Real Stories. Always With You.
                  </p>
                </div>
              </div>
            </Link>
          </section>

          {/* =================================================
              FEATURED VIDEOS
          ================================================== */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold sm:text-2xl">
                Featured Videos
              </h2>

              <Link
                href="/video"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#ec008c]"
              >
                View All
                <ArrowRight
                  size={15}
                />
              </Link>
            </div>

            <div className="space-y-3">
              {videos.length >
              0 ? (
                videos.map(
                  (video) => (
                    <Link
                      href={`/video/${video.id}`}
                      key={video.id}
                      className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-2 transition hover:border-fuchsia-300 hover:shadow-sm"
                    >
                      <div className="relative h-[76px] w-[110px] shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={
                            video.image
                          }
                          alt={
                            video.title
                          }
                          fill
                          sizes="110px"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />

                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {
                            video.duration
                          }
                        </span>

                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white">
                            <Play
                              size={12}
                              fill="currentColor"
                            />
                          </span>
                        </span>
                      </div>

                      <div className="min-w-0 py-1">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#111d4a] sm:text-base">
                          {
                            video.title
                          }
                        </h3>

                        <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                          {formatTime(
                            video.publishedAt,
                          )}{" "}
                          ·{" "}
                          {
                            video.views
                          }{" "}
                          views
                        </p>
                      </div>
                    </Link>
                  ),
                )
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    No published videos yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Published CMS videos will appear here.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              PROMO
          ================================================== */}

          <Link
            href="/watch-live"
            className="group overflow-hidden rounded-xl bg-gradient-to-br from-[#ec008c] to-[#5b16a5] shadow-sm"
          >
            <div className="relative min-h-[260px] aspect-[4/5]">
              <Image
                src="/images/home/category-promo.jpg"
                alt="TV SUPREME"
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover opacity-50 transition duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#4b168c] via-[#6a1b9a]/75 to-[#ec008c]/20" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-2xl">
                  ♛
                </div>

                <h3 className="mt-4 text-xl font-extrabold sm:text-2xl">
                  TV SUPREME
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/95">
                  Real News.
                  <br />
                  Real People.
                  <br />
                  A Brighter Tomorrow.
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-extrabold text-[#5b16a5] shadow-md">
                  Watch Live TV
                  <ArrowRight
                    size={15}
                  />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* =====================================================
          TRENDING NOW
      ====================================================== */}

      <section className="tv-container py-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold sm:text-2xl">
            Trending Now
          </h2>

          <span className="text-xs text-slate-400 sm:text-sm">
            Based on current article tags
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {trendingTopics.map(
            (topic, index) => (
              <Link
                href="/latest"
                key={topic}
                className="flex min-w-[180px] items-center gap-3 rounded-full border border-fuchsia-100 bg-fuchsia-50 px-4 py-2.5 text-sm font-bold text-fuchsia-700 transition hover:bg-fuchsia-100 sm:min-w-[200px]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] text-xs font-extrabold text-white">
                  {index + 1}
                </span>

                <span className="truncate">
                  {topic}
                </span>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          TOP STORIES
      ====================================================== */}

      <section className="tv-container py-6 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold sm:text-2xl">
            Top Stories
          </h2>

          <Link
            href="/latest"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#ec008c]"
          >
            View All
            <ArrowRight
              size={15}
            />
          </Link>
        </div>

        {topStories.length >
        0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topStories.map(
              (story) => (
                <Link
                  href={`/news/${story.slug}`}
                  key={story.id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={
                        story.mainImage
                          ?.url ??
                        categoryImages[
                          story
                            .category
                            ?.slug ??
                            ""
                        ] ??
                        "/images/home/hero.jpg"
                      }
                      alt={
                        story.mainImage
                          ?.altText ??
                        story.title
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />

                    <span className="absolute bottom-3 left-3 rounded-md bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                      {
                        story
                          .category
                          ?.name
                      }
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-extrabold leading-snug sm:text-base">
                      {
                        story.title
                      }
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <span>
                        {formatTime(
                          story.publishedAt,
                        )}
                      </span>

                      <span>
                        •
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Eye
                          size={13}
                        />

                        {
                          story.views
                        }
                      </span>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <p className="text-sm font-semibold text-slate-500">
              No top stories have been published yet.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}