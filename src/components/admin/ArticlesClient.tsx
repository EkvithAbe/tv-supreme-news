"use client";

import {
  Archive,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Filter,
  MoreHorizontal,
  Newspaper,
  Plus,
  Search,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type Article = {
  id: string;
  slug: string;
  status: string;
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  title: string;
  summary: string | null;
  publishedAt: string | Date | null;
  scheduledAt: string | Date | null;
  createdAt: string | Date;
  isBreaking: boolean;
  isFeatured: boolean;
  views: number;
};

type Props = {
  initialArticles: Article[];
};

const statusFilters = [
  { label: "All News", value: "all" },
  { label: "Drafts", value: "DRAFT" },
  { label: "Review", value: "REVIEW" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

function formatDate(value: string | Date | null) {
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

export default function ArticlesClient({
  initialArticles,
}: Props) {
  const [articles] = useState<Article[]>(initialArticles);
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const categories = useMemo(() => {
    const map = new Map<string, string>();

    articles.forEach((article) => {
      if (article.category) {
        map.set(
          article.category.id,
          article.category.name,
        );
      }
    });

    return Array.from(map.entries()).map(
      ([id, name]) => ({
        id,
        name,
      }),
    );
  }, [articles]);

  const stats = useMemo(() => {
    return {
      total: articles.length,
      drafts: articles.filter(
        (article) => article.status === "DRAFT",
      ).length,
      review: articles.filter(
        (article) => article.status === "REVIEW",
      ).length,
      published: articles.filter(
        (article) => article.status === "PUBLISHED",
      ).length,
    };
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesStatus =
        activeStatus === "all" ||
        article.status === activeStatus;

      const matchesCategory =
        selectedCategory === "all" ||
        article.category?.id === selectedCategory;

      const matchesSearch =
        !searchText ||
        article.title
          .toLowerCase()
          .includes(searchText) ||
        article.summary
          ?.toLowerCase()
          .includes(searchText) ||
        article.slug
          .toLowerCase()
          .includes(searchText) ||
        article.author?.name
          .toLowerCase()
          .includes(searchText);

      return (
        matchesStatus &&
        matchesCategory &&
        Boolean(matchesSearch)
      );
    });
  }, [
    articles,
    activeStatus,
    selectedCategory,
    search,
  ]);

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: Newspaper,
    },
    {
      label: "Drafts",
      value: stats.drafts,
      icon: FileText,
    },
    {
      label: "Review",
      value: stats.review,
      icon: ClipboardCheck,
    },
    {
      label: "Published",
      value: stats.published,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            News Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            All News
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage, edit and organize every article in
            your newsroom.
          </p>
        </div>

        <a
          href="/admin/news/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={17} />
          New Article
        </a>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Search */}
            <div className="relative w-full xl:max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search articles..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Filter size={16} />
                Filter
              </button>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(
                      event.target.value,
                    )
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none"
                >
                  <option value="all">
                    All Categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Latest
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Status tabs */}
          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-100">
            {statusFilters.map((filter) => {
              const active =
                activeStatus === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveStatus(filter.value)
                  }
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-pink-600 text-pink-600"
                      : "border-transparent text-slate-500 hover:border-pink-200 hover:text-pink-600"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table heading */}
        <div className="hidden grid-cols-[minmax(0,2.5fr)_150px_140px_120px_60px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 md:grid">
          <span>Article</span>
          <span>Category</span>
          <span>Status</span>
          <span>Published</span>
          <span />
        </div>

        {/* Articles */}
        {filteredArticles.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 md:grid-cols-[minmax(0,2.5fr)_150px_140px_120px_60px] md:items-center"
              >
                {/* Article */}
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    {article.isBreaking && (
                      <span className="mt-1 rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold uppercase text-red-600">
                        Breaking
                      </span>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {article.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {article.author?.name ??
                          "Unknown author"}
                        {" · "}
                        {article.slug}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="text-sm text-slate-600">
                  {article.category?.name ?? "—"}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                      article.status,
                    )}`}
                  >
                    {getStatusLabel(
                      article.status,
                    )}
                  </span>
                </div>

                {/* Published */}
                <div className="text-sm text-slate-500">
                  {formatDate(
                    article.publishedAt,
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-start md:justify-end">
                  <button
                    type="button"
                    title="Article actions"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="rounded-2xl bg-slate-50 p-5">
              <Newspaper
                size={42}
                className="text-slate-300"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-700">
              {articles.length === 0
                ? "No articles yet"
                : "No matching articles"}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              {articles.length === 0
                ? "Your articles will appear here after they are created."
                : "Try changing the search text, category or status filter."}
            </p>

            {articles.length === 0 && (
              <a
                href="/admin/news/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
              >
                <Plus size={16} />
                Create First Article
              </a>
            )}
          </div>
        )}
      </section>

      {/* Bottom information */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <CalendarClock size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Scheduled
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Articles ready for future publication
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <Zap size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Breaking News
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Important stories requiring priority
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <Archive size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Archived
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Older stories kept in the archive
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}