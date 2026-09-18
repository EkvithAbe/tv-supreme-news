"use client";

import Link from "next/link";
import {
  Archive,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Image as ImageIcon,
  Newspaper,
  Plus,
  RefreshCw,
  Video,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ===============================================================
   TYPES
=============================================================== */

type DashboardStats = {
  totalNews: number;
  drafts: number;
  review: number;
  published: number;
  scheduled: number;
  archived: number;
};

type DashboardCategory = {
  id: string;
  slug: string;
  name: string;
  count: number;
};

type DashboardArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: string;
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  publishedAt: string | null;
  createdAt: string;
};

type DashboardMedia = {
  count: number;
};

type DashboardResponse = {
  success: boolean;
  stats?: DashboardStats;
  recentArticles?: DashboardArticle[];
  categories?: DashboardCategory[];
  media?: DashboardMedia;
  message?: string;
};

/* ===============================================================
   QUICK ACTIONS
   UI configuration only
=============================================================== */

const quickActions = [
  {
    title: "New Article",
    description: "Create a new news story",
    icon: Plus,
    href: "/admin/news/new",
  },
  {
    title: "Upload Media",
    description: "Add images or videos",
    icon: ImageIcon,
    href: "/admin/media",
  },
  {
    title: "Add Video",
    description: "Publish a new video",
    icon: Video,
    href: "/admin/videos",
  },
  {
    title: "Breaking News",
    description: "Manage breaking stories",
    icon: Zap,
    href: "/admin/breaking-news",
  },
];

/* ===============================================================
   HELPERS
=============================================================== */

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "REVIEW":
      return "Review";

    case "APPROVED":
      return "Approved";

    case "SCHEDULED":
      return "Scheduled";

    case "PUBLISHED":
      return "Published";

    case "ARCHIVED":
      return "Archived";

    default:
      return status;
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "DRAFT":
      return "bg-slate-100 text-slate-600";

    case "REVIEW":
      return "bg-amber-50 text-amber-700";

    case "APPROVED":
      return "bg-blue-50 text-blue-700";

    case "SCHEDULED":
      return "bg-violet-50 text-violet-700";

    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700";

    case "ARCHIVED":
      return "bg-slate-100 text-slate-500";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

/* ===============================================================
   DASHBOARD
=============================================================== */

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    drafts: 0,
    review: 0,
    published: 0,
    scheduled: 0,
    archived: 0,
  });

  const [recentArticles, setRecentArticles] = useState<
    DashboardArticle[]
  >([]);

  const [categories, setCategories] = useState<
    DashboardCategory[]
  >([]);

  const [mediaCount, setMediaCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  /* =============================================================
     LOAD DASHBOARD
  ============================================================= */

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/dashboard",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data: DashboardResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load dashboard.",
        );
      }

      setStats(
        data.stats ?? {
          totalNews: 0,
          drafts: 0,
          review: 0,
          published: 0,
          scheduled: 0,
          archived: 0,
        },
      );

      setRecentArticles(
        data.recentArticles ?? [],
      );

      setCategories(
        data.categories ?? [],
      );

      setMediaCount(
        data.media?.count ?? 0,
      );
    } catch (dashboardError) {
      console.error(
        "Failed to load dashboard:",
        dashboardError,
      );

      setError(
        dashboardError instanceof Error
          ? dashboardError.message
          : "Failed to load dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =============================================================
     INITIAL LOAD
  ============================================================= */

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  /* =============================================================
     STAT CARDS
  ============================================================= */

  const statCards = useMemo(
    () => [
      {
        title: "Total News",
        value: stats.totalNews,
        note: "All articles",
        icon: Newspaper,
      },
      {
        title: "Drafts",
        value: stats.drafts,
        note: "Waiting to be completed",
        icon: FileText,
      },
      {
        title: "Under Review",
        value: stats.review,
        note: "Waiting for approval",
        icon: ClipboardCheck,
      },
      {
        title: "Published",
        value: stats.published,
        note: "Currently live",
        icon: CheckCircle2,
      },
      {
        title: "Scheduled",
        value: stats.scheduled,
        note: "Upcoming stories",
        icon: CalendarClock,
      },
    ],
    [stats],
  );

  /* =============================================================
     CMS OVERVIEW
  ============================================================= */

  const cmsOverview = useMemo(
    () => [
      [
        "Draft",
        stats.drafts,
        "Articles being prepared",
      ],
      [
        "Review",
        stats.review,
        "Waiting for editor approval",
      ],
      [
        "Scheduled",
        stats.scheduled,
        "Ready for future publication",
      ],
      [
        "Archived",
        stats.archived,
        "Stored older articles",
      ],
    ],
    [stats],
  );

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADING
      ========================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            TV SUPREME CMS
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, Admin
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your newsroom, content and website from one place.
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={17} />
          New Article
        </Link>
      </div>

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* =========================================================
          STATS
      ========================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {isLoading ? "…" : stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {stat.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          MAIN DASHBOARD GRID
      ========================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* =======================================================
            RECENT ARTICLES
        ======================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Articles
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest newsroom activity.
              </p>
            </div>

            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-purple-600"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600" />

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading recent articles...
                  </p>
                </div>
              </div>
            ) : recentArticles.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Newspaper
                    size={34}
                    className="text-slate-300"
                  />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-700">
                  No articles yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Create your first article and it will appear here.
                </p>

                <Link
                  href="/admin/news/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                >
                  <Plus size={16} />
                  Create Article
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentArticles.map(
                  (article) => (
                    <Link
                      key={article.id}
                      href={`/admin/news/edit/${article.id}`}
                      className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-pink-200 hover:bg-slate-50/60 sm:flex-row sm:items-center"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                        <Newspaper size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-800">
                            {article.title}
                          </h3>

                          <span
                            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                              article.status,
                            )}`}
                          >
                            {getStatusLabel(
                              article.status,
                            )}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                          <span>
                            {article.category?.name ??
                              "Uncategorized"}
                          </span>

                          <span className="text-slate-300">
                            •
                          </span>

                          <span>
                            {formatDate(
                              article.createdAt,
                            )}
                          </span>
                        </div>

                        {article.summary && (
                          <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                            {article.summary}
                          </p>
                        )}
                      </div>

                      <ArrowRight
                        size={16}
                        className="shrink-0 text-slate-300"
                      />
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        </section>

        {/* =======================================================
            QUICK ACTIONS
        ======================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common newsroom tasks.
            </p>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-pink-200 hover:bg-pink-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                    <Icon size={18} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">
                      {action.title}
                    </span>

                    <span className="mt-0.5 block text-xs text-slate-400">
                      {action.description}
                    </span>
                  </span>

                  <ArrowRight
                    size={15}
                    className="ml-auto shrink-0 text-slate-300"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* =========================================================
          CATEGORIES + CMS STATUS
      ========================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* =======================================================
            CATEGORIES
        ======================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Categories
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current article distribution.
              </p>
            </div>

            <BarChart3
              size={20}
              className="text-slate-400"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="h-3 w-20 rounded bg-slate-200" />

                    <div className="mt-3 h-6 w-10 rounded bg-slate-200" />
                  </div>
                ),
              )}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-400">
                No categories found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categories.map(
                (category) => (
                  <div
                    key={category.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="truncate text-xs font-medium text-slate-500">
                      {category.name}
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {category.count}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        {/* =======================================================
            CMS STATUS
        ======================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              CMS Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current content workflow status.
            </p>
          </div>

          <div className="space-y-4">
            {cmsOverview.map(
              ([label, value, description]) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {label}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {description}
                    </p>
                  </div>

                  <span className="text-lg font-bold text-slate-900">
                    {isLoading
                      ? "…"
                      : value}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      {/* =========================================================
          MEDIA / WEBSITE
      ========================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* =======================================================
            MEDIA LIBRARY
        ======================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <ImageIcon size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Media Library
              </h2>

              <p className="text-sm text-slate-500">
                Manage images, videos and other media.
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-600 to-purple-600 transition-all"
              style={{
                width:
                  mediaCount > 0
                    ? "25%"
                    : "0%",
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {isLoading
                ? "Loading..."
                : `${mediaCount} ${
                    mediaCount === 1
                      ? "file"
                      : "files"
                  }`}
            </span>

            <span className="font-medium text-slate-500">
              {mediaCount > 0
                ? "Media available"
                : "Storage unused"}
            </span>
          </div>
        </section>

        {/* =======================================================
            WEBSITE STATUS
        ======================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-pink-600 to-purple-700 p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Archive size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Website Status
              </h2>

              <p className="text-sm text-white/75">
                TV SUPREME public website
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />

            <span className="text-sm font-semibold">
              Operational
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Your newsroom CMS is ready to manage stories,
            videos, media and homepage content.
          </p>
        </section>
      </div>
    </div>
  );
}