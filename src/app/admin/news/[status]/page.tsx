"use client";

import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import {
  Archive,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Newspaper,
  Zap,
} from "lucide-react";

type NewsStatus =
  | "drafts"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

const statusConfig: Record<
  NewsStatus,
  {
    title: string;
    description: string;
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  drafts: {
    title: "Draft Articles",
    description:
      "Articles currently being prepared by the newsroom.",
    label: "Draft",
    icon: FileText,
    color: "text-slate-600",
  },
  review: {
    title: "Articles Under Review",
    description:
      "Articles waiting for editorial review and approval.",
    label: "Review",
    icon: ClipboardCheck,
    color: "text-amber-600",
  },
  scheduled: {
    title: "Scheduled Articles",
    description:
      "Articles prepared for future publication.",
    label: "Scheduled",
    icon: CalendarClock,
    color: "text-purple-600",
  },
  published: {
    title: "Published Articles",
    description:
      "Articles currently published on the TV SUPREME website.",
    label: "Published",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  archived: {
    title: "Archived Articles",
    description:
      "Articles that are no longer actively published.",
    label: "Archived",
    icon: Archive,
    color: "text-slate-500",
  },
};

const sampleArticles = [
  {
    id: 1,
    title:
      "President stresses unity for a stronger Sri Lanka",
    category: "Sri Lanka",
    author: "Administrator",
    date: "14 Sep 2026",
  },
  {
    id: 2,
    title: "Port expansion to boost regional trade",
    category: "Business",
    author: "Administrator",
    date: "13 Sep 2026",
  },
  {
    id: 3,
    title:
      "Sri Lanka eye series win in final Test",
    category: "Sports",
    author: "Administrator",
    date: "12 Sep 2026",
  },
];

export default function NewsStatusPage() {
  const params = useParams();

  const status = String(
    params.status
  ) as NewsStatus;

  if (!statusConfig[status]) {
    notFound();
  }

  const config = statusConfig[status];
  const Icon = config.icon;

  const articles = useMemo(() => {
    return sampleArticles;
  }, []);

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div>
        <p className="text-sm font-medium text-pink-600">
          News Management
        </p>

        <div className="mt-1 flex items-center gap-3">
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
            <Icon size={22} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {config.title}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              This screen will be connected to PostgreSQL later.
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
              <Newspaper size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Articles
              </h2>

              <p className="text-sm text-slate-500">
                Current {config.label.toLowerCase()} article
                records.
              </p>
            </div>
          </div>
        </div>

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
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <FileText size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[380px] truncate text-sm font-semibold text-slate-800">
                          {article.title}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {article.category}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {article.author}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {article.date}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {config.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
          <p className="text-xs text-slate-400">
            Article data is currently sample UI data and will
            later come from PostgreSQL.
          </p>
        </div>
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
              These status pages use the same common structure.
              Later, the status will determine which Article
              records are loaded from PostgreSQL.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}