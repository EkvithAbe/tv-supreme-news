import { notFound } from "next/navigation";

import {
  Archive,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Newspaper,
  Zap,
} from "lucide-react";

import {
  getArticles,
  type ArticleStatusValue,
} from "@/lib/data/articles";
import { requireCmsUserPage } from "@/lib/auth";

type NewsStatus =
  | "drafts"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

type StatusConfig = {
  title: string;
  description: string;
  label: string;
  icon: React.ElementType;
  color: string;
  databaseStatus: ArticleStatusValue;
};

const statusConfig: Record<
  NewsStatus,
  StatusConfig
> = {
  drafts: {
    title: "Draft Articles",
    description:
      "Articles currently being prepared by the newsroom.",
    label: "Draft",
    icon: FileText,
    color: "text-slate-600",
    databaseStatus: "DRAFT",
  },

  review: {
    title: "Articles Under Review",
    description:
      "Articles waiting for editorial review and approval.",
    label: "Review",
    icon: ClipboardCheck,
    color: "text-amber-600",
    databaseStatus: "REVIEW",
  },

  scheduled: {
    title: "Scheduled Articles",
    description:
      "Articles prepared for future publication.",
    label: "Scheduled",
    icon: CalendarClock,
    color: "text-purple-600",
    databaseStatus: "SCHEDULED",
  },

  published: {
    title: "Published Articles",
    description:
      "Articles currently published on the TV SUPREME website.",
    label: "Published",
    icon: CheckCircle2,
    color: "text-emerald-600",
    databaseStatus: "PUBLISHED",
  },

  archived: {
    title: "Archived Articles",
    description:
      "Articles that are no longer actively published.",
    label: "Archived",
    icon: Archive,
    color: "text-slate-500",
    databaseStatus: "ARCHIVED",
  },
};

type PageProps = {
  params: Promise<{
    status: string;
  }>;
};

function formatDate(
  value: Date | string | null | undefined,
) {
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

export default async function NewsStatusPage({
  params,
}: PageProps) {
  await requireCmsUserPage();

  const { status } = await params;

  if (
    !Object.prototype.hasOwnProperty.call(
      statusConfig,
      status,
    )
  ) {
    notFound();
  }

  const config =
    statusConfig[status as NewsStatus];

  const result = await getArticles({
    language: "EN",
    status: config.databaseStatus,
    page: 1,
    pageSize: 100,
  });

  const articles = result.articles;

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div>
        <p className="text-sm font-medium text-pink-600">
          News Management
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {config.title}
          </h1>

          <span
            className={`rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold ${config.color}`}
          >
            {config.label}
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {config.description}
        </p>
      </div>

      {/* =========================================================
          INFO CARD
      ========================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
            <Icon size={22} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              {config.title}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {articles.length}{" "}
              {articles.length === 1
                ? "article"
                : "articles"}{" "}
              currently in this status.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          ARTICLES
      ========================================================== */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
              <Newspaper size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Articles
              </h2>

              <p className="text-sm text-slate-500">
                Current{" "}
                {config.label.toLowerCase()}{" "}
                article records from MySQL.
              </p>
            </div>
          </div>
        </div>

        {articles.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Article
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Author
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article) => {
                    const date =
                      article.status ===
                      "SCHEDULED"
                        ? article.scheduledAt ??
                          article.createdAt
                        : article.publishedAt ??
                          article.createdAt;

                    return (
                      <tr
                        key={article.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                              <FileText
                                size={17}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[380px] truncate text-sm font-semibold text-slate-800">
                                {article.title}
                              </p>

                              <p className="mt-1 max-w-[420px] truncate text-xs text-slate-400">
                                {article.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {article.category
                            ?.name ?? "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {article.author
                            ?.name ?? "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(date)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${config.color} bg-slate-100`}
                          >
                            {config.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
              <p className="text-xs text-slate-400">
                These articles are loaded directly
                from MySQL.
              </p>
            </div>
          </>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
              <FileText size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-700">
              No {config.label.toLowerCase()}{" "}
              articles
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              There are currently no articles with
              this status in MySQL.
            </p>
          </div>
        )}
      </section>

      {/* =========================================================
          CMS NOTE
      ========================================================== */}
      <section className="rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
            <Zap size={17} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              CMS workflow
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              This page now uses the article status
              stored in MySQL. Creating or
              changing an article status will update
              the corresponding status page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
