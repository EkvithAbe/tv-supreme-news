"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  FileText,
  Globe2,
  Plus,
  Search,
  X,
} from "lucide-react";

type PageStatus = "Published" | "Draft";

type SitePage = {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: PageStatus;
  language: string;
  lastUpdated: string;
  updatedBy: string;
  content: string;
};

/* ===============================================================
   INITIAL PAGE DATA
================================================================ */

const initialPages: SitePage[] = [
  {
    id: 1,
    title: "About Us",
    slug: "about-us",
    description:
      "Learn about TV SUPREME, our newsroom and our commitment to trusted journalism.",
    status: "Published",
    language: "English",
    lastUpdated: "14 Sep 2026",
    updatedBy: "Administrator",
    content:
      "TV SUPREME is a modern Sri Lankan digital news platform delivering timely and reliable news across Sri Lanka and around the world.",
  },
  {
    id: 2,
    title: "Contact Us",
    slug: "contact-us",
    description:
      "Contact the TV SUPREME newsroom, editorial team and support team.",
    status: "Published",
    language: "English",
    lastUpdated: "13 Sep 2026",
    updatedBy: "Administrator",
    content:
      "Contact TV SUPREME for newsroom enquiries, feedback, technical support and general questions.",
  },
  {
    id: 3,
    title: "Advertise With Us",
    slug: "advertise",
    description:
      "Advertising opportunities and promotional solutions offered by TV SUPREME.",
    status: "Published",
    language: "English",
    lastUpdated: "12 Sep 2026",
    updatedBy: "Administrator",
    content:
      "TV SUPREME provides advertising and promotional opportunities for brands, organisations and businesses.",
  },
  {
    id: 4,
    title: "Privacy Policy",
    slug: "privacy-policy",
    description:
      "Information about privacy, personal data and how TV SUPREME handles user information.",
    status: "Published",
    language: "English",
    lastUpdated: "10 Sep 2026",
    updatedBy: "Administrator",
    content:
      "This Privacy Policy explains how TV SUPREME collects, uses, stores and protects information when users access our website and services.",
  },
  {
    id: 5,
    title: "Terms of Use",
    slug: "terms-of-use",
    description:
      "Terms and conditions for using the TV SUPREME website and services.",
    status: "Published",
    language: "English",
    lastUpdated: "10 Sep 2026",
    updatedBy: "Administrator",
    content:
      "These Terms of Use describe the rules and conditions that apply when accessing and using TV SUPREME services.",
  },
  {
    id: 6,
    title: "Editorial Policy",
    slug: "editorial-policy",
    description:
      "Editorial standards and principles followed by the TV SUPREME newsroom.",
    status: "Draft",
    language: "English",
    lastUpdated: "09 Sep 2026",
    updatedBy: "Administrator",
    content:
      "Editorial standards, fact-checking principles, corrections policy and newsroom practices.",
  },
];

/* ===============================================================
   FILTERS
================================================================ */

const statusFilters = [
  { label: "All Pages", value: "All" },
  { label: "Published", value: "Published" },
  { label: "Drafts", value: "Draft" },
] as const;

const languages = ["English", "Sinhala", "Tamil"];

/* ===============================================================
   PAGE COMPONENT
================================================================ */

export default function PagesPage() {
  const [pages, setPages] =
    useState<SitePage[]>(initialPages);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilters)[number]["value"]>("All");

  const [languageFilter, setLanguageFilter] =
    useState("All Languages");

  const [showModal, setShowModal] = useState(false);

  const [editingPage, setEditingPage] =
    useState<SitePage | null>(null);

  const [selectedPage, setSelectedPage] =
    useState<SitePage | null>(null);

  /* =============================================================
     FORM STATE
  ============================================================== */

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [status, setStatus] =
    useState<PageStatus>("Draft");
  const [content, setContent] = useState("");

  /* =============================================================
     FILTERED PAGES
  ============================================================== */

  const filteredPages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pages.filter((page) => {
      const matchesSearch =
        !query ||
        page.title.toLowerCase().includes(query) ||
        page.slug.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        page.status === statusFilter;

      const matchesLanguage =
        languageFilter === "All Languages" ||
        page.language === languageFilter;

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

  const publishedCount = pages.filter(
    (page) => page.status === "Published"
  ).length;

  const draftCount = pages.filter(
    (page) => page.status === "Draft"
  ).length;

  const englishCount = pages.filter(
    (page) => page.language === "English"
  ).length;

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
    setShowModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (page: SitePage) => {
    setEditingPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setDescription(page.description);
    setLanguage(page.language);
    setStatus(page.status);
    setContent(page.content);
    setShowModal(true);
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!editingPage) {
      setSlug(generateSlug(value));
    }
  };

  /* =============================================================
     SAVE PAGE
  ============================================================== */

  const savePage = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    const cleanSlug =
      slug.trim() || generateSlug(cleanTitle);

    if (editingPage) {
      const updatedPage: SitePage = {
        ...editingPage,
        title: cleanTitle,
        slug: cleanSlug,
        description: description.trim(),
        language,
        status,
        content: content.trim(),
        lastUpdated: "Just now",
        updatedBy: "Administrator",
      };

      setPages((current) =>
        current.map((page) =>
          page.id === editingPage.id
            ? updatedPage
            : page
        )
      );

      if (selectedPage?.id === editingPage.id) {
        setSelectedPage(updatedPage);
      }
    } else {
      const newPage: SitePage = {
        id:
          Math.max(
            0,
            ...pages.map((page) => page.id)
          ) + 1,
        title: cleanTitle,
        slug: cleanSlug,
        description: description.trim(),
        status,
        language,
        lastUpdated: "Just now",
        updatedBy: "Administrator",
        content: content.trim(),
      };

      setPages((current) => [
        newPage,
        ...current,
      ]);
    }

    closeModal();
  };

  /* =============================================================
     DELETE PAGE
  ============================================================== */

  const deletePage = (id: number) => {
    const page = pages.find(
      (item) => item.id === id
    );

    if (!page) return;

    const confirmed = window.confirm(
      `Delete "${page.title}"?`
    );

    if (!confirmed) return;

    setPages((current) =>
      current.filter((item) => item.id !== id)
    );

    if (selectedPage?.id === id) {
      setSelectedPage(null);
    }
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
            Create and manage the static pages used across
            the TV SUPREME website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          STATS
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PageStatCard
          title="Total Pages"
          value={String(pages.length)}
          note="All website pages"
          icon={<FileText size={20} />}
        />

        <PageStatCard
          title="Published"
          value={String(publishedCount)}
          note="Currently visible"
          icon={<Eye size={20} />}
          active
        />

        <PageStatCard
          title="Drafts"
          value={String(draftCount)}
          note="Not published yet"
          icon={<Archive size={20} />}
        />

        <PageStatCard
          title="English Pages"
          value={String(englishCount)}
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
                  setSearch(event.target.value)
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
                      event.target.value
                    )
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400"
                >
                  <option>All Languages</option>

                  {languages.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
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
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setStatusFilter(filter.value)
                }
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  statusFilter === filter.value
                    ? "border-pink-600 text-pink-600"
                    : "border-transparent text-slate-500 hover:border-pink-200 hover:text-pink-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* =======================================================
            TABLE
        ======================================================== */}
        <div className="overflow-x-auto">
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

                <th className="w-[130px] px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70"
                  >
                    {/* Page */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPage(page)
                        }
                        className="flex max-w-[430px] items-center gap-3 text-left"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            page.status === "Published"
                              ? "bg-pink-50 text-pink-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <FileText size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {page.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {page.description}
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
                        status={page.status}
                      />
                    </td>

                    {/* Language */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Globe2 size={14} />
                        {page.language}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          {page.lastUpdated}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          by {page.updatedBy}
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPage(page)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`View ${page.title}`}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(page)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                          aria-label={`Edit ${page.title}`}
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deletePage(page.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${page.title}`}
                        >
                          <Archive size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                        Try another search or create a new
                        page.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredPages.length} of{" "}
            {pages.length} pages
          </span>

          <span>
            Page records are currently local UI data.
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
                Review the selected website page.
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

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {selectedPage.content ||
                    "No content added yet."}
                </p>
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
                value={selectedPage.lastUpdated}
              />

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(selectedPage)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                >
                  <Edit3 size={15} />
                  Edit Page
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
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-6">
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
                      event.target.value
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
                      setSlug(event.target.value)
                    }
                    placeholder="page-slug"
                    className="min-w-0 flex-1 bg-transparent px-1 py-3 pr-4 text-sm text-slate-700 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use lowercase letters, numbers and hyphens.
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
                        setLanguage(event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      {languages.map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
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
                          event.target.value as PageStatus
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
                      event.target.value
                    )
                  }
                  placeholder="Describe this page..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
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
                    setContent(event.target.value)
                  }
                  placeholder="Write the page content here..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Info */}
              <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-pink-600 shadow-sm">
                    <FileText size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Page publishing
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Published pages will be available to
                      visitors on the public TV SUPREME
                      website. Draft pages remain hidden.
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
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={savePage}
                disabled={!title.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />

                {editingPage
                  ? "Save Changes"
                  : "Create Page"}
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
================================================================ */

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
================================================================ */

function PageStatusBadge({
  status,
}: {
  status: PageStatus;
}) {
  const styles: Record<PageStatus, string> = {
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
================================================================ */

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

      <p className="mt-1.5 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}