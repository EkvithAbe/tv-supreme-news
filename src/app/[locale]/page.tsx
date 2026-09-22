import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
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
import HeroSlider from "@/components/home/HeroSlider";
import { prisma } from "@/lib/prisma";
import LiveTVPlayer from "@/components/home/LiveTVPlayer";
import { getLiveTVSettings } from "@/lib/data/live-tv";

/* =========================================================
   TYPES
========================================================= */

type SupportedLanguage = "EN" | "SI" | "TA";

function getLanguageFromLocale(
  locale: string,
): SupportedLanguage {
  const normalized = locale.toLowerCase();

  if (normalized === "si") {
    return "SI";
  }

  if (normalized === "ta") {
    return "TA";
  }

  return "EN";
}

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
   Actual category/content data comes from MySQL.
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

async function getHomepageData(
  language: SupportedLanguage,
) {


  const [
    articleResult,
    categoryResult,
    videoRecords,
    liveTVSettings,
  ] = await Promise.all([
    getArticles({
      language,
      status: "PUBLISHED",
      page: 1,
      pageSize: 100,
    }),

    getCategories(language),

    prisma.video.findMany({
      where: {
        status: "PUBLISHED",
        language,
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

    getLiveTVSettings(),
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
   * Hero slider stories:
   * Homepage -> Featured -> Latest.
   *
   * Remove duplicates by ID and keep a maximum
   * of four stories for the slider.
   */
  const heroCandidates = [
    ...homepageArticles,
    ...featuredArticles,
    ...articles,
  ];

  const heroStories: HomeArticle[] = [];

  const usedHeroStoryIds =
    new Set<string>();

  for (const article of heroCandidates) {
    if (
      usedHeroStoryIds.has(article.id)
    ) {
      continue;
    }

    usedHeroStoryIds.add(article.id);
    heroStories.push(article);

    if (heroStories.length >= 4) {
      break;
    }
  }

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
    heroStories,
    videos,
    liveTVSettings,
  };
}

/* =========================================================
   HOME PAGE
========================================================= */

export default async function HomePage() {
  const locale = await getLocale();

  const language =
    getLanguageFromLocale(locale);

  const {
    articles,
    latestNews,
    categories,
    trendingTopics,
    topStories,
    heroStory,
    heroStories,
    videos,
    liveTVSettings,
  } = await getHomepageData(language);

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-white text-[#111d4a]">
      {/* =====================================================
          HERO + LATEST NEWS
      ====================================================== */}

      <section className="w-full px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 2xl:px-10">
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]">
          {/* =================================================
              HERO
          ================================================== */}

          <HeroSlider stories={heroStories} />

          {/* =================================================
              LATEST NEWS
          ================================================== */}

          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold sm:text-2xl lg:text-3xl">
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
                      <div className="relative h-[64px] w-[84px] shrink-0 overflow-hidden rounded-lg sm:h-[72px] sm:w-[100px]">
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

      </section>

      {/* =====================================================
          EXPLORE BY CATEGORY
      ====================================================== */}

      <section className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 2xl:px-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold sm:text-xl lg:text-2xl">
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
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

      <section className="w-full px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_0.72fr]">
          {/* =================================================
    LIVE TV
================================================== */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold sm:text-xl lg:text-2xl">
                Live TV
              </h2>

              <Link
                href="/watch-live"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#ec008c]"
              >
                Watch Live
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl bg-black shadow-sm">
              {/* ACTUAL LIVE PLAYER */}
              <LiveTVPlayer
                settings={liveTVSettings}
                poster="/images/home/live-tv.jpg"
              />
              <div className="border-t border-white/10 bg-black px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-extrabold text-white sm:text-lg">
                      {liveTVSettings?.channelName ||
                        "TV SUPREME LIVE"}
                    </h3>

                    <p className="mt-1 text-xs text-white/70 sm:text-sm">
                      {liveTVSettings?.playerTitle ||
                        "Trusted News. Real Stories. Always With You."}
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </section>

          {/* =================================================
              FEATURED VIDEOS
          ================================================== */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold sm:text-xl lg:text-2xl">
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
                      <div className="relative h-[68px] w-[96px] shrink-0 overflow-hidden rounded-lg sm:h-[76px] sm:w-[110px]">
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
              BREAKING NEWS
          ================================================== */}

          <section className="min-w-0 overflow-hidden rounded-xl border border-fuchsia-200 bg-white shadow-sm">
            {(() => {
              const breakingNews = articles
                .filter(
                  (article) =>
                    article.isBreaking,
                )
                .slice(0, 4);

              const leadBreaking =
                breakingNews[0] ?? null;

              const moreBreaking =
                breakingNews.slice(1);

              if (!leadBreaking) {
                return (
                  <>
                    {/* Header */}

                    <div className="bg-gradient-to-r from-[#ec008c] to-[#5f19c8] px-4 py-3">
                      <div className="flex items-center gap-2 text-white">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm font-black">
                          !
                        </span>

                        <h3 className="text-sm font-extrabold uppercase tracking-wide">
                          Breaking News
                        </h3>
                      </div>
                    </div>

                    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 py-10 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-50 text-2xl font-black text-[#ec008c]">
                        !
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-600">
                        No breaking news
                      </p>

                      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                        Breaking stories published from the CMS will appear here.
                      </p>

                      <Link
                        href="/latest"
                        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#5f19c8] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3c2372]"
                      >
                        View Latest News
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </>
                );
              }

              return (
                <>
                  {/* =================================================
                      HEADER
                  ================================================== */}

                  <div className="relative overflow-hidden bg-gradient-to-r from-[#ec008c] via-[#b516b2] to-[#5f19c8] px-4 py-3.5">
                    <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

                    <div className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-white">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-black ring-1 ring-white/15">
                          !
                        </span>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">
                            Live Update
                          </p>

                          <h3 className="text-sm font-extrabold uppercase tracking-wide">
                            Breaking News
                          </h3>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white ring-1 ring-white/15">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        Live
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      LEAD BREAKING STORY
                  ================================================== */}

                  <Link
                    href={`/news/${leadBreaking.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                      <Image
                        src={
                          leadBreaking.mainImage?.url ??
                          "/images/home/hero.jpg"
                        }
                        alt={
                          leadBreaking.mainImage?.altText ??
                          leadBreaking.title
                        }
                        fill
                        sizes="(max-width: 1024px) 100vw, 30vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#11152b] via-black/25 to-black/5" />

                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#ec008c] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-lg">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Breaking
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-pink-200">
                          {leadBreaking.category?.name ??
                            "TV SUPREME"}
                        </p>

                        <h4 className="line-clamp-3 text-base font-extrabold leading-5 text-white transition group-hover:text-pink-100">
                          {leadBreaking.title}
                        </h4>

                        <div className="mt-3 flex items-center gap-3 text-[10px] text-white/70">
                          <span>
                            {formatTime(
                              leadBreaking.publishedAt,
                            )}
                          </span>

                          <span>•</span>

                          <span className="inline-flex items-center gap-1">
                            <Eye size={11} />
                            {leadBreaking.views.toLocaleString()}
                            {" views"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <div className="px-4 pb-4 pt-3.5">
                      {leadBreaking.summary && (
                        <p className="line-clamp-3 text-xs leading-5 text-slate-500">
                          {leadBreaking.summary}
                        </p>
                      )}

                      <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#5f19c8] transition group-hover:text-[#ec008c]">
                        Read full story
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </Link>

                  {/* =================================================
                      ADDITIONAL BREAKING STORIES
                  ================================================== */}

                  {moreBreaking.length > 0 && (
                    <div className="border-t border-slate-100">
                      {moreBreaking.map(
                        (article) => (
                          <Link
                            key={article.id}
                            href={`/news/${article.slug}`}
                            className="group flex gap-3 border-b border-slate-100 px-4 py-3 transition last:border-b-0 hover:bg-fuchsia-50"
                          >
                            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              <Image
                                src={
                                  article.mainImage?.url ??
                                  "/images/home/hero.jpg"
                                }
                                alt={
                                  article.mainImage?.altText ??
                                  article.title
                                }
                                fill
                                sizes="80px"
                                className="object-cover transition duration-500 group-hover:scale-105"
                              />

                              <span className="absolute bottom-1 left-1 rounded bg-[#ec008c] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                                Live
                              </span>
                            </div>

                            <div className="min-w-0">
                              <h5 className="line-clamp-2 text-xs font-bold leading-5 text-[#111d4a] transition group-hover:text-[#5f19c8]">
                                {article.title}
                              </h5>

                              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                                <span>
                                  {formatTime(
                                    article.publishedAt,
                                  )}
                                </span>

                                <span>•</span>

                                <span className="inline-flex items-center gap-1">
                                  <Eye size={10} />
                                  {article.views.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ),
                      )}
                    </div>
                  )}

                  {/* =================================================
                      VIEW ALL
                  ================================================== */}

                  <Link
                    href="/breaking-news"
                    className="flex items-center justify-center gap-1 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-[#5f19c8] transition hover:bg-fuchsia-50 hover:text-[#ec008c]"
                  >
                    View All Breaking News
                    <ArrowRight size={14} />
                  </Link>
                </>
              );
            })()}
          </section>
        </div>
      </section>

      {/* =====================================================
          TRENDING NOW
      ====================================================== */}

      {/* =====================================================
          TOP STORIES
      ====================================================== */}

      <section className="w-full px-4 py-6 pb-12 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold sm:text-xl lg:text-2xl">
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
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

                    <span className="absolute top-3 left-3 rounded-md bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
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
