import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  Zap,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

import { getArticles } from "@/lib/data/articles";

/* =========================================================
   TYPES
========================================================= */

type SupportedLanguage =
  | "EN"
  | "SI"
  | "TA";

type BreakingArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  views: number;
  publishedAt:
    | Date
    | string
    | null;
  isBreaking: boolean;

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
};

/* =========================================================
   LANGUAGE
========================================================= */

function getLanguageFromLocale(
  locale: string,
): SupportedLanguage {
  const normalized =
    locale.toLowerCase();

  if (normalized === "si") {
    return "SI";
  }

  if (normalized === "ta") {
    return "TA";
  }

  if (normalized === "en") {
    return "EN";
  }

  notFound();
}

/* =========================================================
   HELPERS
========================================================= */

function formatTime(
  value:
    | Date
    | string
    | null,
) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Recently";
  }

  const diff =
    Date.now() -
    date.getTime();

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

function formatFullDate(
  value:
    | Date
    | string
    | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "en-LK",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function BreakingNewsPage() {
  const locale =
    await getLocale();

  const language =
    getLanguageFromLocale(
      locale,
    );

  /* =======================================================
     LOAD PUBLISHED ARTICLES
  ======================================================== */

  const articleResult =
    await getArticles({
      language,
      status: "PUBLISHED",
      page: 1,
      pageSize: 100,
    });

  const breakingNews =
    (
      articleResult.articles as BreakingArticle[]
    )
      .filter(
        (article) =>
          article.isBreaking,
      )
      .sort(
        (a, b) => {
          const aTime = a.publishedAt
            ? new Date(
                a.publishedAt,
              ).getTime()
            : 0;

          const bTime = b.publishedAt
            ? new Date(
                b.publishedAt,
              ).getTime()
            : 0;

          return bTime - aTime;
        },
      );

  const leadStory =
    breakingNews[0] ??
    null;

  const otherStories =
    breakingNews.slice(1);

  return (
    <main className="min-h-screen bg-[#f8f9fc] text-[#111d4a]">

      {/* =====================================================
          HERO HEADER
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#3c2372] via-[#5f19c8] to-[#ec008c]">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-pink-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <Zap size={14} />
              TV SUPREME
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Breaking News
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Stay up to date with the latest
              breaking stories from TV SUPREME.
            </p>

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="py-8 sm:py-10 lg:py-12">

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {breakingNews.length ===
          0 ? (
            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-pink-50 text-[#ec008c]">

                <Zap
                  size={34}
                />

              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ec008c]">
                TV SUPREME
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#111d4a]">
                No breaking news
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                There are currently no active
                breaking news stories.
              </p>

              <Link
                href="/latest"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#5f19c8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3c2372]"
              >
                Browse Latest News
                <ArrowRight size={16} />
              </Link>

            </div>
          ) : (
            <>
              {/* ===============================================
                  SECTION TITLE
              ================================================ */}

              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">

                <div>

                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ec008c]">
                    Live Updates
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-[#111d4a] sm:text-3xl">
                    Latest Breaking News
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {breakingNews.length}{" "}
                    {breakingNews.length ===
                    1
                      ? "breaking story"
                      : "breaking stories"}
                  </p>

                </div>

              </div>

              {/* ===============================================
                  LEAD STORY
              ================================================ */}

              {leadStory && (
                <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">

                  <Link
                    href={`/news/${leadStory.slug}`}
                    className="group grid lg:grid-cols-[1.35fr_0.65fr]"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[16/9] overflow-hidden bg-[#11152b] lg:aspect-auto lg:min-h-[430px]">

                      <Image
                        src={
                          leadStory
                            .mainImage
                            ?.url ??
                          "/images/home/hero.jpg"
                        }
                        alt={
                          leadStory
                            .mainImage
                            ?.altText ??
                          leadStory.title
                        }
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 65vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#11152b] via-black/20 to-transparent" />

                      {/* BREAKING BADGE */}

                      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#ec008c] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg">

                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />

                        Breaking

                      </span>

                      {/* IMAGE INFO */}

                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">

                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-pink-200">
                          {leadStory.category?.name ??
                            "TV SUPREME"}
                        </p>

                        <h3 className="max-w-3xl text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                          {leadStory.title}
                        </h3>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/75">

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays
                              size={14}
                            />
                            {formatFullDate(
                              leadStory.publishedAt,
                            )}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Eye
                              size={14}
                            />
                            {leadStory.views.toLocaleString()}{" "}
                            views
                          </span>

                        </div>

                      </div>
                    </div>

                    {/* STORY DETAILS */}

                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-9">

                      <div className="flex items-center gap-2">

                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#ec008c]" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ec008c]">
                          Breaking News
                        </span>

                      </div>

                      <h3 className="mt-4 text-2xl font-black leading-tight text-[#111d4a] sm:text-3xl">
                        {leadStory.title}
                      </h3>

                      {leadStory.summary && (
                        <p className="mt-5 text-sm leading-7 text-slate-500">
                          {leadStory.summary}
                        </p>
                      )}

                      <div className="mt-7 h-px bg-slate-100" />

                      <div className="mt-5 flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3 text-xs text-slate-400">

                          <span className="inline-flex items-center gap-1.5">
                            <Eye
                              size={14}
                              className="text-[#5f19c8]"
                            />
                            {leadStory.views.toLocaleString()}
                          </span>

                          <span>
                            {formatTime(
                              leadStory.publishedAt,
                            )}
                          </span>

                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5f19c8] transition group-hover:text-[#ec008c]">
                          Read Story
                          <ArrowRight
                            size={14}
                          />
                        </span>

                      </div>

                    </div>

                  </Link>

                </article>
              )}

              {/* ===============================================
                  OTHER BREAKING STORIES
              ================================================ */}

              {otherStories.length >
                0 && (
                <section className="mt-10">

                  <div className="mb-5">

                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ec008c]">
                      More Alerts
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-[#111d4a]">
                      More Breaking Stories
                    </h2>

                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {otherStories.map(
                      (article) => (
                        <Link
                          key={
                            article.id
                          }
                          href={`/news/${article.slug}`}
                          className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-pink-100 hover:shadow-xl"
                        >

                          {/* IMAGE */}

                          <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">

                            <Image
                              src={
                                article
                                  .mainImage
                                  ?.url ??
                                "/images/home/hero.jpg"
                              }
                              alt={
                                article
                                  .mainImage
                                  ?.altText ??
                                article.title
                              }
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition duration-700 group-hover:scale-[1.04]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                            <span className="absolute left-3 top-3 rounded-full bg-[#ec008c] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-md">
                              Breaking
                            </span>

                            <div className="absolute bottom-3 left-3 right-3">

                              <p className="text-[9px] font-bold uppercase tracking-wide text-pink-200">
                                {article.category?.name ??
                                  "TV SUPREME"}
                              </p>

                            </div>

                          </div>

                          {/* CONTENT */}

                          <div className="p-5">

                            <h3 className="line-clamp-2 text-lg font-black leading-6 text-[#111d4a] transition group-hover:text-[#5f19c8]">
                              {article.title}
                            </h3>

                            {article.summary && (
                              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                {article.summary}
                              </p>
                            )}

                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">

                              <span>
                                {formatTime(
                                  article.publishedAt,
                                )}
                              </span>

                              <span className="inline-flex items-center gap-1.5">
                                <Eye
                                  size={13}
                                  className="text-[#5f19c8]"
                                />
                                {article.views.toLocaleString()}
                              </span>

                            </div>

                          </div>

                        </Link>
                      ),
                    )}

                  </div>

                </section>
              )}
            </>
          )}

        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="px-4 pb-12 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#3c2372] via-[#5f19c8] to-[#ec008c]">

          <div className="flex flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
                TV SUPREME
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Stay informed with TV SUPREME
              </h2>

              <p className="mt-3 text-sm text-white/75">
                Follow the latest news and important
                breaking updates.
              </p>

            </div>

            <Link
              href="/latest"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Latest News
              <ArrowRight size={16} />
            </Link>

          </div>
        </div>

      </section>

    </main>
  );
}