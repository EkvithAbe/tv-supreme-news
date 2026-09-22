import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  Eye,
  Link2,
  Mail,
  MessageCircle,
  Share2,
  Tag,
} from "lucide-react";

import {
  getArticleBySlug,
  getArticles,
} from "@/lib/data/articles";

type NewsPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

type SupportedLanguage =
  | "EN"
  | "SI"
  | "TA";

function getLanguage(
  locale: string,
): SupportedLanguage {
  if (locale === "si") {
    return "SI";
  }

  if (locale === "ta") {
    return "TA";
  }

  return "EN";
}

function formatDate(
  value: Date | string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-LK",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

function formatTime(
  value: Date | string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString(
    "en-LK",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

function splitContent(
  content: string,
) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph.trim(),
    )
    .filter(Boolean);
}

function getCategoryPath(
  locale: string,
  categorySlug: string | null,
) {
  if (!categorySlug) {
    return `/${locale}/latest`;
  }

  return `/${locale}/${categorySlug}`;
}

/*
 * ===============================================================
 * SEO METADATA
 * ===============================================================
 */

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const language = getLanguage(locale);

  const article =
    await getArticleBySlug(
      slug,
      language,
    );

  if (
    !article ||
    article.status !== "PUBLISHED"
  ) {
    return {
      title: "News | TV SUPREME",
    };
  }

  return {
    title:
      article.seoTitle ??
      `${article.title} | TV SUPREME`,

    description:
      article.seoDescription ??
      article.summary ??
      undefined,
  };
}

/*
 * ===============================================================
 * PAGE
 * ===============================================================
 */

export default async function NewsArticlePage({
  params,
}: NewsPageProps) {
  const { locale, slug } = await params;

  const language = getLanguage(locale);

  /*
   * Load the article directly from MySQL.
   */
  const article =
    await getArticleBySlug(
      slug,
      language,
    );

  /*
   * Only published articles are public.
   */
  if (
    !article ||
    article.status !== "PUBLISHED"
  ) {
    notFound();
  }

  /*
   * Load published articles from MySQL
   * for the sidebar and related stories.
   */
  const publishedResult =
    await getArticles({
      language,
      status: "PUBLISHED",
      page: 1,
      pageSize: 20,
    });

  /*
   * Remove the current article.
   */
  const otherArticles =
    publishedResult.articles.filter(
      (item) =>
        item.id !== article.id,
    );

  /*
   * Prefer articles from the same category.
   * If there are not enough, use other published
   * articles to fill the remaining positions.
   */
  const sameCategoryArticles =
    article.category?.id
      ? otherArticles.filter(
          (item) =>
            item.category?.id ===
            article.category?.id,
        )
      : [];

  const otherCategoryArticles =
    otherArticles.filter(
      (item) =>
        !article.category?.id ||
        item.category?.id !==
          article.category?.id,
    );

  const relatedArticles = [
    ...sameCategoryArticles,
    ...otherCategoryArticles,
  ].slice(0, 4);

  /*
   * Sidebar latest news.
   */
  const latestArticles =
    otherArticles.slice(0, 5);

  /*
   * Article content.
   */
  const paragraphs =
    splitContent(
      article.content,
    );

  /*
   * Category.
   */
  const categoryName =
    article.category?.name ??
    "News";

  const categorySlug =
    article.category?.slug ??
    null;

  /*
   * Main image.
   *
   * This fallback is only a UI asset fallback.
   * The article itself still comes from MySQL.
   */
  const imageUrl =
    article.mainImage?.url ??
    "/images/home/hero.jpg";

  const imageAlt =
    article.mainImage?.altText ??
    article.title;

  /*
   * Build popular topics dynamically from
   * database tags instead of a hardcoded list.
   */
  const topicMap =
    new Map<string, string>();

  for (const tag of article.tags) {
    topicMap.set(
      tag.id,
      tag.name,
    );
  }

  for (const related of relatedArticles) {
    for (const tag of related.tags) {
      if (topicMap.size >= 6) {
        break;
      }

      topicMap.set(
        tag.id,
        tag.name,
      );
    }

    if (topicMap.size >= 6) {
      break;
    }
  }

  const popularTopics =
    Array.from(
      topicMap.values(),
    ).slice(0, 6);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0f1425]">
      {/* =========================================================
          BREADCRUMB
      ========================================================== */}
      <section className="border-b border-slate-200 bg-white dark:border-[#30374e] dark:bg-[#0f1425]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link
              href={`/${locale}`}
              className="font-medium transition hover:text-pink-600"
            >
              Home
            </Link>

            <ChevronRight size={13} />

            <Link
              href={getCategoryPath(
                locale,
                categorySlug,
              )}
              className="font-medium transition hover:text-pink-600"
            >
              {categoryName}
            </Link>

            <ChevronRight size={13} />

            <span className="truncate font-medium text-slate-500">
              News
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN ARTICLE
      ========================================================== */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-10">
            {/* =====================================================
                ARTICLE
            ====================================================== */}
            <article className="min-w-0">
              {/* Back */}
              <Link
                href={`/${locale}/latest`}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-pink-600"
              >
                <ArrowLeft size={16} />

                Back to Latest News
              </Link>

              {/* Category */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600">
                  {categoryName}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  News
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-5 max-w-5xl text-3xl font-black leading-tight tracking-tight text-[#111d4a] dark:text-white sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {/* Summary */}
              {article.summary && (
                <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                  {article.summary}
                </p>
              )}

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-slate-100 py-4 text-xs text-slate-400 dark:border-[#30374e]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} />

                  {formatDate(
                    article.publishedAt,
                  )}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock3 size={14} />

                  {formatTime(
                    article.publishedAt,
                  )}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Eye size={14} />

                  {article.views} views
                </span>

                {article.author && (
                  <span>
                    By{" "}
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {article.author.name}
                    </span>
                  </span>
                )}
              </div>

              {/* Main Image */}
              <div className="mt-7 overflow-hidden rounded-[24px] bg-slate-100 dark:bg-[#151a2d]">
                <div className="relative aspect-[16/9] w-full">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Image caption */}
              <p className="mt-2 text-xs leading-5 text-slate-400">
                TV SUPREME |{" "}
                {article.title}
              </p>

              {/* Share bar */}
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#30374e] dark:bg-[#151a2d] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Share2
                    size={17}
                    className="text-pink-600"
                  />

                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Share this story
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ShareButton
                    icon={
                      <FacebookIcon />
                    }
                    label="Facebook"
                  />

                  <ShareButton
                    icon={<XIcon />}
                    label="X"
                  />

                  <ShareButton
                    icon={
                      <Link2 size={15} />
                    }
                    label="Copy link"
                  />
                </div>
              </div>

              {/* Article Content */}
              <div className="mt-8">
                <div className="max-w-4xl space-y-6 text-[16px] leading-8 text-slate-700 dark:text-slate-200">
                  {paragraphs.map(
                    (
                      paragraph,
                      index,
                    ) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              </div>

              {/* Tags */}
              {article.tags.length >
                0 && (
                <div className="mt-9 border-t border-slate-100 pt-6 dark:border-[#30374e]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag
                      size={16}
                      className="mr-1 text-pink-600"
                    />

                    {article.tags.map(
                      (tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-[#1c2238] dark:text-slate-300"
                        >
                          {tag.name}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Author */}
              {article.author && (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#30374e] dark:bg-[#151a2d] sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-purple-600 text-sm font-black text-white">
                      TV
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Published by
                      </p>

                      <h3 className="mt-1 text-base font-bold text-[#111d4a] dark:text-white">
                        {
                          article
                            .author
                            .name
                        }
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-[#30374e] dark:bg-[#151a2d]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm dark:bg-[#1c2238]">
                    <MessageCircle
                      size={18}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111d4a] dark:text-white">
                      Comments
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Reader comments will
                      be connected later.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* =====================================================
                SIDEBAR
            ====================================================== */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Latest News */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#30374e] dark:bg-[#151a2d]">
                <div className="border-b border-slate-200 px-5 py-4 dark:border-[#30374e]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-600">
                        TV SUPREME
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-[#111d4a] dark:text-white">
                        Latest News
                      </h2>
                    </div>

                    <Link
                      href={`/${locale}/latest`}
                      className="text-xs font-semibold text-pink-600 hover:text-purple-600"
                    >
                      View All
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-[#30374e]">
                  {latestArticles.length >
                  0 ? (
                    latestArticles
                      .map(
                        (item) => (
                          <Link
                            key={item.id}
                            href={`/${locale}/news/${item.slug}`}
                            className="group flex gap-3 p-4 transition hover:bg-slate-50 dark:hover:bg-[#1c2238]"
                          >
                            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              <img
                                src={
                                  item
                                    .mainImage
                                    ?.url ??
                                  "/images/home/hero.jpg"
                                }
                                alt={
                                  item
                                    .mainImage
                                    ?.altText ??
                                  item.title
                                }
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            </div>

                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wide text-pink-600">
                                {
                                  item
                                    .category
                                    ?.name
                                }
                              </span>

                              <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-700 group-hover:text-pink-600 dark:text-slate-200">
                                {
                                  item.title
                                }
                              </p>
                            </div>
                          </Link>
                        ),
                      )
                  ) : (
                    <p className="p-5 text-xs text-slate-400">
                      No other published
                      stories yet.
                    </p>
                  )}
                </div>
              </section>

              {/* Newsletter */}
              <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#111d4a] to-[#3c2372] p-6 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Mail size={18} />
                </div>

                <h2 className="mt-4 text-xl font-black">
                  Stay informed
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  Follow TV SUPREME for the
                  latest stories and important
                  updates.
                </p>

                <Link
                  href={`/${locale}/latest`}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Explore Latest

                  <ChevronRight
                    size={15}
                  />
                </Link>
              </section>

              {/* Dynamic Topics */}
              {popularTopics.length >
                0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#30374e] dark:bg-[#151a2d]">
                  <h2 className="text-base font-bold text-[#111d4a] dark:text-white">
                    Popular Topics
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {popularTopics.map(
                      (topic) => (
                        <span
                          key={topic}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-[#1c2238] dark:text-slate-300"
                        >
                          {topic}
                        </span>
                      ),
                    )}
                  </div>
                </section>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* =========================================================
          RELATED STORIES
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-14 dark:bg-[#12182a] sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                More Stories
              </span>

              <h2 className="mt-2 text-2xl font-black text-[#111d4a] dark:text-white sm:text-3xl">
                Related News
              </h2>
            </div>

            <Link
              href={`/${locale}/latest`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-purple-600"
            >
              See all news

              <ChevronRight
                size={15}
              />
            </Link>
          </div>

          {relatedArticles.length >
            0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedArticles.map(
                (item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/news/${item.slug}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#30374e] dark:bg-[#151a2d]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={
                          item
                            .mainImage
                            ?.url ??
                          "/images/home/hero.jpg"
                        }
                        alt={
                          item.mainImage
                            ?.altText ??
                          item.title
                        }
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-pink-600 shadow-sm">
                        {
                          item.category
                            ?.name
                        }
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-3 text-sm font-bold leading-5 text-[#111d4a] group-hover:text-pink-600 dark:text-white">
                        {item.title}
                      </h3>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {formatDate(
                            item.publishedAt,
                          )}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Eye
                            size={12}
                          />

                          {item.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]">
          <div className="flex flex-col gap-6 px-6 py-9 sm:px-10 sm:py-11 lg:flex-row lg:items-center lg:justify-between lg:px-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                TV SUPREME
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Keep up with the latest
                stories
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/70">
                Discover more news, videos and
                live coverage from TV SUPREME.
              </p>
            </div>

            <Link
              href={`/${locale}/latest`}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
            >
              View Latest News

              <ChevronRight
                size={16}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/*
 * ===============================================================
 * SHARE BUTTON
 * ===============================================================
 */

function ShareButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
    >
      {icon}
    </button>
  );
}

/*
 * ===============================================================
 * FACEBOOK ICON
 * ===============================================================
 */

function FacebookIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.314 0-6 2.686-6 6v2H5v4h3v6h4v-6h4l1-4h-5v-2a2 2 0 0 1 2-2z" />
    </svg>
  );
}

/*
 * ===============================================================
 * X ICON
 * ===============================================================
 */

function XIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.548l-5.128-6.703L5.205 22H1.947l7.604-8.69L1.5 2h6.715l4.635 6.134L18.244 2Zm-1.148 17.847h1.807L7.22 4.045H5.281l11.815 15.802Z" />
    </svg>
  );
}