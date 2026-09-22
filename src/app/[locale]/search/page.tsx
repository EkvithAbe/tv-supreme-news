import Link from "next/link";
import { Search, Video } from "lucide-react";
import { notFound } from "next/navigation";

import {
  getArticles,
  type SupportedLanguage,
} from "@/lib/data/articles";
import {
  getVideos,
  type VideoLanguageValue,
} from "@/lib/data/videos";

type SearchPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
};

function getLanguage(locale: string): SupportedLanguage {
  if (locale === "en") return "EN";
  if (locale === "si") return "SI";
  if (locale === "ta") return "TA";

  notFound();
}

function formatDate(value: Date | null) {
  if (!value) return "Recently published";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const [{ locale }, queryParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const language = getLanguage(locale);
  const query = (queryParams.q || "").trim();

  const [articleResult, videoResult] = query
    ? await Promise.all([
        getArticles({
          language,
          status: "PUBLISHED",
          search: query,
          page: 1,
          pageSize: 30,
        }),
        getVideos({
          language: language as VideoLanguageValue,
          status: "PUBLISHED",
          search: query,
          page: 1,
          pageSize: 20,
        }),
      ])
    : [
        { articles: [], total: 0 },
        { items: [], total: 0 },
      ];

  const total = articleResult.total + videoResult.total;

  return (
    <main className="min-h-[60vh] bg-white dark:bg-[#0f1425]">
      <div className="tv-container py-10 sm:py-14">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-pink-50 p-2.5 text-pink-600 dark:bg-pink-500/10">
            <Search size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#111d4a] dark:text-white">
              Search Results
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Search published TV SUPREME articles and videos.
            </p>
          </div>
        </div>

        {query ? (
          <p className="mt-7 text-base text-slate-600 dark:text-slate-300">
            {total} result{total === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-[#111d4a] dark:text-white">
              &ldquo;{query}&rdquo;
            </span>
          </p>
        ) : (
          <p className="mt-7 text-base text-slate-500 dark:text-slate-400">
            Enter a keyword in the website search bar to search TV SUPREME news.
          </p>
        )}

        {query && total === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-[#30374e] dark:bg-[#1c2238]">
            <h2 className="text-xl font-bold text-[#111d4a] dark:text-white">
              No results found
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try a different title, topic, category, or keyword.
            </p>
          </div>
        )}

        {articleResult.articles.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black text-[#111d4a] dark:text-white">
              Articles
            </h2>
            <div className="mt-4 space-y-4">
              {articleResult.articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${locale}/news/${article.slug}`}
                  className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-pink-200 hover:shadow-md dark:border-[#30374e] dark:bg-[#151a2d]"
                >
                  {article.mainImage?.url ? (
                    <img
                      src={article.mainImage.url}
                      alt={article.mainImage.altText || article.title}
                      className="h-24 w-32 shrink-0 rounded-xl object-cover sm:w-40"
                    />
                  ) : (
                    <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400 sm:w-40 dark:bg-slate-800">
                      TV SUPREME
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wide text-pink-600">
                      {article.category?.name || "News"}
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-[#111d4a] transition group-hover:text-pink-600 dark:text-white">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {article.summary}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      {formatDate(article.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {videoResult.items.length > 0 && (
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-xl font-black text-[#111d4a] dark:text-white">
              <Video size={20} className="text-pink-600" /> Videos
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videoResult.items.map((video) => (
                <Link
                  key={video.id}
                  href={`/${locale}/video/${video.id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-pink-200 hover:shadow-md dark:border-[#30374e] dark:bg-[#151a2d]"
                >
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-[#111d4a] text-white">
                      <Video size={28} />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-pink-600">
                      {video.categoryName || "Video"}
                    </p>
                    <h3 className="mt-1 font-bold text-[#111d4a] transition group-hover:text-pink-600 dark:text-white">
                      {video.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400">
                      {formatDate(video.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
