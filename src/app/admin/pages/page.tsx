"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Archive,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  FileText,
  Globe2,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

type PageStatus = "Published" | "Draft";
type PageLanguage = "English" | "Sinhala" | "Tamil";

type SitePage = {
  id: string;
  pageId: string;
  translationId: string;
  title: string;
  slug: string;
  description: string;
  status: PageStatus;
  language: PageLanguage;
  lastUpdated: string;
  updatedBy: string;
  content: string;
};

type ApiPage = {
  id: string;
  pageId: string;
  translationId: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  language: "EN" | "SI" | "TA";
  title: string;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiListResponse = {
  success: boolean;
  pages?: ApiPage[];
  message?: string;
};

type ApiSingleResponse = {
  success: boolean;
  page?: {
    id: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED";
    translations: Array<{
      id: string;
      language: "EN" | "SI" | "TA";
      title: string;
      content: string;
      seoTitle: string | null;
      seoDescription: string | null;
    }>;
    createdAt: string;
    updatedAt: string;
  } | null;
  message?: string;
};

const statusFilters = [
  { label: "All Pages", value: "All" },
  { label: "Published", value: "Published" },
  { label: "Drafts", value: "Draft" },
] as const;

const languages: PageLanguage[] = [
  "English",
  "Sinhala",
  "Tamil",
];

const languageToApi: Record<
  PageLanguage,
  "EN" | "SI" | "TA"
> = {
  English: "EN",
  Sinhala: "SI",
  Tamil: "TA",
};

const apiToLanguage: Record<
  "EN" | "SI" | "TA",
  PageLanguage
> = {
  EN: "English",
  SI: "Sinhala",
  TA: "Tamil",
};

const statusToApi: Record<
  PageStatus,
  "DRAFT" | "PUBLISHED"
> = {
  Draft: "DRAFT",
  Published: "PUBLISHED",
};

const apiToStatus: Record<
  "DRAFT" | "PUBLISHED",
  PageStatus
> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function mapApiPage(
  page: ApiPage,
): SitePage {
  return {
    id: page.id,
    pageId: page.pageId,
    translationId: page.translationId,
    title: page.title,
    slug: page.slug,
    description:
      page.seoDescription ?? "",
    status: apiToStatus[page.status],
    language:
      apiToLanguage[page.language],
    lastUpdated:
      formatDate(page.updatedAt),
    updatedBy: "Administrator",
    content: page.content,
  };
}

function generateSlug(
  value: string,
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PagesPage() {
  const [pages, setPages] = useState<
    SitePage[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      (typeof statusFilters)[number]["value"]
    >("All");

  const [languageFilter, setLanguageFilter] =
    useState("All Languages");

  const [showModal, setShowModal] =
    useState(false);

  const [editingPage, setEditingPage] =
    useState<SitePage | null>(null);

  const [selectedPage, setSelectedPage] =
    useState<SitePage | null>(null);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =============================================================
     FORM STATE
  ============================================================== */

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [language, setLanguage] =
    useState<PageLanguage>("English");

  const [status, setStatus] =
    useState<PageStatus>("Draft");

  const [content, setContent] =
    useState("");

  /* =============================================================
     LOAD PAGES
  ============================================================== */

  const loadPages = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/pages",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data: ApiListResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to load pages.",
          );
        }

        const mappedPages = (
          data.pages ?? []
        ).map(mapApiPage);

        setPages(mappedPages);

        /*
         * Keep selected page in sync after
         * a refresh.
         */
        setSelectedPage(
          (currentSelected) => {
            if (!currentSelected) {
              return null;
            }

            return (
              mappedPages.find(
                (page) =>
                  page.id ===
                  currentSelected.id,
              ) ?? null
            );
          },
        );
      } catch (loadError) {
        console.error(
          "Failed to load pages:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load pages.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  /* =============================================================
     FILTERED PAGES
  ============================================================== */

  const filteredPages = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return pages.filter((page) => {
      const matchesSearch =
        !query ||
        page.title
          .toLowerCase()
          .includes(query) ||
        page.slug
          .toLowerCase()
          .includes(query) ||
        page.description
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        page.status === statusFilter;

      const matchesLanguage =
        languageFilter === "All Languages" ||
        page.language ===
          languageFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLanguage
      );
    });
  }, [
    pages,
    search,
    statusFilter,
    languageFilter,
  ]);

  /* =============================================================
     STATS
  ============================================================== */

  const uniquePageIds = useMemo(
    () =>
      new Set(
        pages.map(
          (page) => page.pageId,
        ),
      ),
    [pages],
  );

  const publishedCount = useMemo(
    () =>
      new Set(
        pages
          .filter(
            (page) =>
              page.status ===
              "Published",
          )
          .map(
            (page) => page.pageId,
          ),
      ).size,
    [pages],
  );

  const draftCount = useMemo(
    () =>
      new Set(
        pages
          .filter(
            (page) =>
              page.status ===
              "Draft",
          )
          .map(
            (page) => page.pageId,
          ),
      ).size,
    [pages],
  );

  const englishCount = useMemo(
    () =>
      new Set(
        pages
          .filter(
            (page) =>
              page.language ===
              "English",
          )
          .map(
            (page) => page.pageId,
          ),
      ).size,
    [pages],
  );

  /* =============================================================
     FORM HELPERS
  ============================================================== */

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setLanguage("English");
    setStatus("Draft");
    setContent("");
    setEditingPage(null);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  const openAddModal = () => {
    setError("");
    setSuccessMessage("");
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (
    page: SitePage,
  ) => {
    setError("");
    setSuccessMessage("");

    setEditingPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setDescription(
      page.description,
    );
    setLanguage(page.language);
    setStatus(page.status);
    setContent(page.content);

    setShowModal(true);
  };

  const handleTitleChange = (
    value: string,
  ) => {
    setTitle(value);

    if (!editingPage) {
      setSlug(generateSlug(value));
    }
  };

  /* =============================================================
     SAVE PAGE
  ============================================================== */

  const savePage = async () => {
    const cleanTitle =
      title.trim();

    const cleanSlug =
      slug.trim() ||
      generateSlug(cleanTitle);

    const cleanContent =
      content.trim();

    const cleanDescription =
      description.trim();

    if (!cleanTitle) {
      setError(
        "Page title is required.",
      );
      return;
    }

    if (!cleanSlug) {
      setError(
        "Page slug is required.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      const apiLanguage =
        languageToApi[language];

      if (editingPage) {
        const response = await fetch(
          "/api/admin/pages",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              pageId:
                editingPage.pageId,
              slug: cleanSlug,
              status:
                statusToApi[status],
              translation: {
                language:
                  apiLanguage,
                title:
                  cleanTitle,
                content:
                  cleanContent,
                seoDescription:
                  cleanDescription,
              },
            }),
          },
        );

        const data: ApiSingleResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update page.",
          );
        }

        setSuccessMessage(
          "Page updated successfully.",
        );
      } else {
        const response = await fetch(
          "/api/admin/pages",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              slug: cleanSlug,
              status:
                statusToApi[status],
              translations: [
                {
                  language:
                    apiLanguage,
                  title:
                    cleanTitle,
                  content:
                    cleanContent,
                  seoDescription:
                    cleanDescription,
                },
              ],
            }),
          },
        );

        const data: ApiSingleResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to create page.",
          );
        }

        setSuccessMessage(
          "Page created successfully.",
        );
      }

      setShowModal(false);
      resetForm();

      await loadPages();
    } catch (saveError) {
      console.error(
        "Failed to save page:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save page.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =============================================================
     DELETE PAGE
  ============================================================== */

  const deletePage = async (
    page: SitePage,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${page.title}"? This will delete the entire page and its translations.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(page.pageId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `/api/admin/pages?pageId=${encodeURIComponent(
          page.pageId,
        )}`,
        {
          method: "DELETE",
        },
      );

      const data:
        | {
            success: boolean;
            message?: string;
          }
        = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete page.",
        );
      }

      if (
        selectedPage?.pageId ===
        page.pageId
      ) {
        setSelectedPage(null);
      }

      setSuccessMessage(
        data.message ||
          "Page deleted successfully.",
      );

      await loadPages();
    } catch (deleteError) {
      console.error(
        "Failed to delete page:",
        deleteError,
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete page.",
      );
    } finally {
      setIsDeleting(null);
    }
  };

  /* =============================================================
     PUBLIC PAGE URL
  ============================================================== */

  const getPublicPageUrl = (
    page: SitePage,
  ) => {
    const languageCode =
      languageToApi[page.language];

    const locale =
      languageCode === "EN"
        ? "en"
        : languageCode === "SI"
          ? "si"
          : "ta";

    return `/${locale}/${page.slug}`;
  };

  /* =============================================================
     RETURN
  ============================================================== */

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            Website Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Pages
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Create and manage the
            static pages used across the
            TV SUPREME website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              void loadPages()
            }
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isLoading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={17} />

            New Page
          </button>
        </div>
      </div>

      {/* =========================================================
          MESSAGES
      ========================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {/* =========================================================
          STATS
      ========================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PageStatCard
          title="Total Pages"
          value={String(
            uniquePageIds.size,
          )}
          note="All website pages"
          icon={<FileText size={20} />}
        />

        <PageStatCard
          title="Published"
          value={String(
            publishedCount,
          )}
          note="Currently visible"
          icon={<Eye size={20} />}
          active
        />

        <PageStatCard
          title="Drafts"
          value={String(
            draftCount,
          )}
          note="Not published yet"
          icon={
            <Archive size={20} />
          }
        />

        <PageStatCard
          title="English Pages"
          value={String(
            englishCount,
          )}
          note="English content"
          icon={<Globe2 size={20} />}
        />
      </div>

      {/* =========================================================
          MAIN TABLE
      ========================================================== */}

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
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search pages..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>

            {/* Filters */}

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={languageFilter}
                  onChange={(event) =>
                    setLanguageFilter(
                      event.target.value,
                    )
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400"
                >
                  <option>
                    All Languages
                  </option>

                  {languages.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Status tabs */}

          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-100">
            {statusFilters.map(
              (filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      filter.value,
                    )
                  }
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    statusFilter ===
                    filter.value
                      ? "border-pink-600 text-pink-600"
                      : "border-transparent text-slate-500 hover:border-pink-200 hover:text-pink-600"
                  }`}
                >
                  {filter.label}
                </button>
              ),
            )}
          </div>
        </div>

        {/* =======================================================
            TABLE
        ======================================================== */}

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex min-h-[350px] items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading pages...
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Page
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Slug
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Language
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Last Updated
                  </th>

                  <th className="w-[150px] px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPages.length >
                0 ? (
                  filteredPages.map(
                    (page) => (
                      <tr
                        key={page.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/70"
                      >
                        {/* Page */}

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPage(
                                page,
                              )
                            }
                            className="flex max-w-[430px] items-center gap-3 text-left"
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                page.status ===
                                "Published"
                                  ? "bg-pink-50 text-pink-600"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <FileText
                                size={19}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {page.title}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-400">
                                {page.description ||
                                  "No description"}
                              </p>
                            </div>
                          </button>
                        </td>

                        {/* Slug */}

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-500">
                            /{page.slug}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <PageStatusBadge
                            status={
                              page.status
                            }
                          />
                        </td>

                        {/* Language */}

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                            <Globe2
                              size={14}
                            />

                            {page.language}
                          </span>
                        </td>

                        {/* Last Updated */}

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm text-slate-600">
                              {
                                page.lastUpdated
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              by{" "}
                              {
                                page.updatedBy
                              }
                            </p>
                          </div>
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPage(
                                  page,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              aria-label={`View ${page.title}`}
                            >
                              <Eye
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  page,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                              aria-label={`Edit ${page.title}`}
                            >
                              <Edit3
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void deletePage(
                                  page,
                                )
                              }
                              disabled={
                                isDeleting ===
                                page.pageId
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Delete ${page.title}`}
                            >
                              {isDeleting ===
                              page.pageId ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                              ) : (
                                <Archive
                                  size={15}
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="rounded-2xl bg-slate-50 p-5">
                          <FileText
                            size={40}
                            className="text-slate-300"
                          />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-slate-700">
                          No pages found
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Try another search
                          or create a new
                          page.
                        </p>

                        <button
                          type="button"
                          onClick={
                            openAddModal
                          }
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                        >
                          <Plus
                            size={15}
                          />

                          Create Page
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing{" "}
            {filteredPages.length} of{" "}
            {pages.length} page translations
          </span>

          <span>
            Page records are stored in
            PostgreSQL.
          </span>
        </div>
      </section>

      {/* =========================================================
          SELECTED PAGE DETAILS
      ========================================================== */}

      {selectedPage && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-pink-600">
                Page Details
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {selectedPage.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the selected website
                page.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedPage(null)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close page details"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Content */}

            <div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Page Content
                </p>

                <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {selectedPage.content ||
                    "No content added yet."}
                </div>
              </div>
            </div>

            {/* Details */}

            <div className="space-y-3">
              <PageDetail
                label="Slug"
                value={`/${selectedPage.slug}`}
              />

              <PageDetail
                label="Status"
                value={selectedPage.status}
              />

              <PageDetail
                label="Language"
                value={selectedPage.language}
              />

              <PageDetail
                label="Last Updated"
                value={
                  selectedPage.lastUpdated
                }
              />

              <PageDetail
                label="Public URL"
                value={getPublicPageUrl(
                  selectedPage,
                )}
              />

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(
                      selectedPage,
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                >
                  <Edit3
                    size={15}
                  />

                  Edit Page
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const publicUrl =
                      getPublicPageUrl(
                        selectedPage,
                      );

                    window.open(
                      publicUrl,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Eye size={15} />

                  Preview
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPage(null)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          ADD / EDIT PAGE MODAL
      ========================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  Website Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingPage
                    ? "Edit Page"
                    : "Create New Page"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}

            <div className="space-y-5 p-6">
              {/* Form Error */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Title */}

              <div>
                <label
                  htmlFor="pageTitle"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Page Title

                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  id="pageTitle"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    handleTitleChange(
                      event.target.value,
                    )
                  }
                  placeholder="Enter page title..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Slug */}

              <div>
                <label
                  htmlFor="pageSlug"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  URL Slug
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                  <span className="pl-4 text-sm text-slate-400">
                    /
                  </span>

                  <input
                    id="pageSlug"
                    type="text"
                    value={slug}
                    onChange={(event) =>
                      setSlug(
                        generateSlug(
                          event.target.value,
                        ),
                      )
                    }
                    placeholder="page-slug"
                    className="min-w-0 flex-1 bg-transparent px-1 py-3 pr-4 text-sm text-slate-700 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use lowercase letters,
                  numbers and hyphens.
                </p>
              </div>

              {/* Language + Status */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="pageLanguage"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Language
                  </label>

                  <div className="relative">
                    <select
                      id="pageLanguage"
                      value={language}
                      onChange={(event) =>
                        setLanguage(
                          event.target
                            .value as PageLanguage,
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      {languages.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ),
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Each translation is
                    stored under the same
                    page.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="pageStatus"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Status
                  </label>

                  <div className="relative">
                    <select
                      id="pageStatus"
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target
                            .value as PageStatus,
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      <option value="Draft">
                        Draft
                      </option>

                      <option value="Published">
                        Published
                      </option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="pageDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Short Description
                </label>

                <textarea
                  id="pageDescription"
                  rows={3}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Describe this page..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Stored as the SEO
                  description for this
                  translation.
                </p>
              </div>

              {/* Content */}

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="pageContent"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Page Content
                  </label>

                  <span className="text-xs text-slate-400">
                    Basic editor
                  </span>
                </div>

                <textarea
                  id="pageContent"
                  rows={10}
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value,
                    )
                  }
                  placeholder="Write the page content here..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Info */}

              <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-pink-600 shadow-sm">
                    <FileText
                      size={16}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Page publishing
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Published pages can
                      be displayed on the
                      public TV SUPREME
                      website. Draft pages
                      remain unpublished.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void savePage()
                }
                disabled={
                  !title.trim() ||
                  isSaving
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Saving...
                  </>
                ) : (
                  <>
                    <Check
                      size={16}
                    />

                    {editingPage
                      ? "Save Changes"
                      : "Create Page"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===============================================================
   STAT CARD
=============================================================== */

function PageStatCard({
  title,
  value,
  note,
  icon,
  active = false,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              active
                ? "text-emerald-600"
                : "text-slate-900"
            }`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {note}
          </p>
        </div>

        <div className="shrink-0 rounded-xl bg-pink-50 p-3 text-pink-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   STATUS BADGE
=============================================================== */

function PageStatusBadge({
  status,
}: {
  status: PageStatus;
}) {
  const styles: Record<
    PageStatus,
    string
  > = {
    Published:
      "bg-emerald-50 text-emerald-700",
    Draft:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ===============================================================
   DETAIL ITEM
=============================================================== */

function PageDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-all text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}