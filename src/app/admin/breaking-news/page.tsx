"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  Check,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  FileText,
  History,
  Newspaper,
  PauseCircle,
  Play,
  Plus,
  Radio,
  Save,
  Search,
  Trash2,
  X,
  Zap,
} from "lucide-react";

/* ===============================================================
   TYPES
================================================================ */

type BreakingStatus =
  | "Active"
  | "Scheduled"
  | "Inactive"
  | "Expired";

type BreakingPriority = "High" | "Medium" | "Low";

type BreakingNewsItem = {
  id: number;
  headline: string;
  description: string;
  category: string;
  status: BreakingStatus;
  priority: BreakingPriority;
  startTime: string;
  endTime: string;
  createdAt: string;
  createdBy: string;
};

/* ===============================================================
   INITIAL DATA
================================================================ */

const initialBreakingNews: BreakingNewsItem[] = [
  {
    id: 1,
    headline:
      "Heavy rains expected across several districts",
    description:
      "Authorities advise the public to remain alert as heavy rainfall is expected in several areas.",
    category: "Sri Lanka",
    status: "Active",
    priority: "High",
    startTime: "15 Sep 2026, 10:30 AM",
    endTime: "15 Sep 2026, 06:00 PM",
    createdAt: "15 Sep 2026",
    createdBy: "Administrator",
  },
  {
    id: 2,
    headline:
      "Sri Lanka announces new economic measures",
    description:
      "The latest economic measures were announced during a government briefing today.",
    category: "Business",
    status: "Scheduled",
    priority: "High",
    startTime: "16 Sep 2026, 08:00 AM",
    endTime: "16 Sep 2026, 12:00 PM",
    createdAt: "15 Sep 2026",
    createdBy: "News Editor",
  },
  {
    id: 3,
    headline:
      "Sri Lanka team arrives ahead of final Test",
    description:
      "The national cricket team has arrived ahead of the deciding Test match.",
    category: "Sports",
    status: "Inactive",
    priority: "Medium",
    startTime: "13 Sep 2026, 09:00 AM",
    endTime: "13 Sep 2026, 05:00 PM",
    createdAt: "13 Sep 2026",
    createdBy: "Sports Desk",
  },
  {
    id: 4,
    headline:
      "Major technology event begins in Colombo",
    description:
      "Industry leaders gather in Colombo for a major technology and innovation event.",
    category: "Technology",
    status: "Expired",
    priority: "Low",
    startTime: "11 Sep 2026, 10:00 AM",
    endTime: "11 Sep 2026, 04:00 PM",
    createdAt: "11 Sep 2026",
    createdBy: "Technology Desk",
  },
];

/* ===============================================================
   CONSTANTS
================================================================ */

const categories = [
  "Sri Lanka",
  "World",
  "Politics",
  "Business",
  "Sports",
  "Entertainment",
  "Technology",
  "Lifestyle",
];

const statusFilters = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Inactive", value: "Inactive" },
  { label: "Expired", value: "Expired" },
] as const;

const priorities: BreakingPriority[] = [
  "High",
  "Medium",
  "Low",
];

/* ===============================================================
   PAGE
================================================================ */

export default function BreakingNewsPage() {
  const [breakingNews, setBreakingNews] =
    useState<BreakingNewsItem[]>(
      initialBreakingNews
    );

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilters)[number]["value"]>(
      "All"
    );

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [selectedStory, setSelectedStory] =
    useState<BreakingNewsItem | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [editingStory, setEditingStory] =
    useState<BreakingNewsItem | null>(null);

  /* =============================================================
     FORM STATE
  ============================================================== */

  const [headline, setHeadline] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState("Sri Lanka");
  const [priority, setPriority] =
    useState<BreakingPriority>("High");
  const [status, setStatus] =
    useState<BreakingStatus>("Active");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* =============================================================
     FILTER
  ============================================================== */

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return breakingNews.filter((story) => {
      const matchesSearch =
        !query ||
        story.headline
          .toLowerCase()
          .includes(query) ||
        story.description
          .toLowerCase()
          .includes(query) ||
        story.category
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        story.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        story.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    breakingNews,
    search,
    statusFilter,
    categoryFilter,
  ]);

  /* =============================================================
     STATS
  ============================================================== */

  const activeCount = breakingNews.filter(
    (story) => story.status === "Active"
  ).length;

  const scheduledCount = breakingNews.filter(
    (story) => story.status === "Scheduled"
  ).length;

  const inactiveCount = breakingNews.filter(
    (story) => story.status === "Inactive"
  ).length;

  const highPriorityCount = breakingNews.filter(
    (story) => story.priority === "High"
  ).length;

  /* =============================================================
     FORM HELPERS
  ============================================================== */

  const resetForm = () => {
    setHeadline("");
    setDescription("");
    setCategory("Sri Lanka");
    setPriority("High");
    setStatus("Active");
    setStartTime("");
    setEndTime("");
    setEditingStory(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (
    story: BreakingNewsItem
  ) => {
    setEditingStory(story);
    setHeadline(story.headline);
    setDescription(story.description);
    setCategory(story.category);
    setPriority(story.priority);
    setStatus(story.status);
    setStartTime("");
    setEndTime("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  /* =============================================================
     SAVE STORY
  ============================================================== */

  const saveStory = () => {
    const cleanHeadline = headline.trim();

    if (!cleanHeadline) {
      return;
    }

    if (editingStory) {
      const updatedStory: BreakingNewsItem = {
        ...editingStory,
        headline: cleanHeadline,
        description: description.trim(),
        category,
        priority,
        status,
        startTime:
          startTime.trim() ||
          editingStory.startTime,
        endTime:
          endTime.trim() || editingStory.endTime,
      };

      setBreakingNews((current) =>
        current.map((story) =>
          story.id === editingStory.id
            ? updatedStory
            : story
        )
      );

      if (
        selectedStory &&
        selectedStory.id === editingStory.id
      ) {
        setSelectedStory(updatedStory);
      }
    } else {
      const newStory: BreakingNewsItem = {
        id:
          Math.max(
            0,
            ...breakingNews.map(
              (story) => story.id
            )
          ) + 1,
        headline: cleanHeadline,
        description: description.trim(),
        category,
        priority,
        status,
        startTime:
          startTime.trim() || "Starts now",
        endTime:
          endTime.trim() || "No end time",
        createdAt: "Just now",
        createdBy: "Administrator",
      };

      setBreakingNews((current) => [
        newStory,
        ...current,
      ]);
    }

    closeModal();
  };

  /* =============================================================
     DELETE
  ============================================================== */

  const deleteStory = (id: number) => {
    const story = breakingNews.find(
      (item) => item.id === id
    );

    if (!story) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${story.headline}"?`
    );

    if (!confirmed) {
      return;
    }

    setBreakingNews((current) =>
      current.filter((item) => item.id !== id)
    );

    if (selectedStory?.id === id) {
      setSelectedStory(null);
    }
  };

  /* =============================================================
     TOGGLE ACTIVE
  ============================================================== */

  const toggleActive = (id: number) => {
    setBreakingNews((current) =>
      current.map((story) =>
        story.id === id
          ? {
              ...story,
              status:
                story.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : story
      )
    );

    if (selectedStory?.id === id) {
      setSelectedStory((current) =>
        current
          ? {
              ...current,
              status:
                current.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : null
      );
    }
  };

  /* =============================================================
     SAVE CONFIG
  ============================================================== */

  const saveConfiguration = () => {
    setSaving(true);
    setSaved(false);

    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            News Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Breaking News
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Create and manage urgent stories displayed in the
            TV SUPREME breaking news area.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              activeCount > 0
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                activeCount > 0
                  ? "animate-pulse bg-red-500"
                  : "bg-slate-300"
              }`}
            />

            {activeCount > 0
              ? `${activeCount} Active`
              : "No Active Breaking News"}
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={17} />
            Add Breaking News
          </button>
        </div>
      </div>

      {/* =========================================================
          STATS
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BreakingStatCard
          title="Active"
          value={String(activeCount)}
          note="Currently running"
          icon={<Radio size={20} />}
          active={activeCount > 0}
        />

        <BreakingStatCard
          title="Scheduled"
          value={String(scheduledCount)}
          note="Upcoming alerts"
          icon={<CalendarClock size={20} />}
        />

        <BreakingStatCard
          title="Inactive"
          value={String(inactiveCount)}
          note="Currently disabled"
          icon={<PauseCircle size={20} />}
        />

        <BreakingStatCard
          title="High Priority"
          value={String(highPriorityCount)}
          note="Urgent stories"
          icon={<AlertTriangle size={20} />}
        />
      </div>

      {/* =========================================================
          CURRENT BREAKING STORY
      ========================================================== */}
      {activeCount > 0 && (
        <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
          <div className="border-b border-red-100 bg-red-50/60 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Zap size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Current Breaking Story
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This story is currently marked as breaking
                    news.
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                LIVE BREAKING
              </span>
            </div>
          </div>

          {breakingNews
            .filter(
              (story) => story.status === "Active"
            )
            .slice(0, 1)
            .map((story) => (
              <div
                key={story.id}
                className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_300px]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge
                      priority={story.priority}
                    />

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      {story.category}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                    {story.headline}
                  </h3>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                    {story.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {story.startTime}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Bell size={14} />
                      Breaking alert active
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Quick Actions
                  </p>

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(story)
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                    >
                      <Edit3 size={15} />
                      Edit Story
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleActive(story.id)
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-amber-600 shadow-sm ring-1 ring-amber-100 transition hover:bg-amber-50"
                    >
                      <PauseCircle size={15} />
                      Stop Breaking
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </section>
      )}

      {/* =========================================================
          BREAKING NEWS TABLE
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
                placeholder="Search breaking news..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <SelectFilter
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  "All Categories",
                  ...categories,
                ]}
              />
            </div>
          </div>

          {/* Status Tabs */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Breaking Story
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Category
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Priority
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Schedule
                </th>

                <th className="w-[150px] px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <tr
                    key={story.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70"
                  >
                    {/* Story */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStory(story)
                        }
                        className="flex max-w-[420px] items-center gap-3 text-left"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            story.status === "Active"
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {story.status ===
                          "Active" ? (
                            <Zap size={18} />
                          ) : (
                            <FileText size={18} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {story.headline}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {story.description}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {story.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-5 py-4">
                      <PriorityBadge
                        priority={story.priority}
                      />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <BreakingStatusBadge
                        status={story.status}
                      />
                    </td>

                    {/* Schedule */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          {story.startTime}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Until {story.endTime}
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedStory(story)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`View ${story.headline}`}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(story)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                          aria-label={`Edit ${story.headline}`}
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleActive(story.id)
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            story.status ===
                            "Active"
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-emerald-500 hover:bg-emerald-50"
                          }`}
                          aria-label={
                            story.status ===
                            "Active"
                              ? `Stop ${story.headline}`
                              : `Activate ${story.headline}`
                          }
                        >
                          {story.status ===
                          "Active" ? (
                            <PauseCircle size={15} />
                          ) : (
                            <Play size={15} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteStory(story.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${story.headline}`}
                        >
                          <Trash2 size={15} />
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
                        <Zap
                          size={40}
                          className="text-slate-300"
                        />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-slate-700">
                        No breaking news found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or create a new
                        breaking story.
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
            Showing {filteredStories.length} of{" "}
            {breakingNews.length} stories
          </span>

          <span>
            Breaking news records are currently local UI data.
          </span>
        </div>
      </section>

      {/* =========================================================
          BREAKING NEWS HISTORY / INFO
      ========================================================== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* History */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <History size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Recent breaking news activity.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {breakingNews.slice(0, 4).map((story) => (
              <div
                key={story.id}
                className="flex items-center gap-3 px-5 py-4"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    story.status === "Active"
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <Zap size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {story.headline}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {story.createdAt} · {story.createdBy}
                  </p>
                </div>

                <BreakingStatusBadge
                  status={story.status}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Breaking News Display
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  How breaking stories will work on the public
                  website.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <InfoRow
              title="Active stories"
              description="Displayed as breaking news alerts on supported public pages."
            />

            <InfoRow
              title="Scheduled stories"
              description="Automatically become active when their scheduled start time is reached."
            />

            <InfoRow
              title="Priority"
              description="High priority stories receive the strongest newsroom alert treatment."
            />

            <InfoRow
              title="Expiry"
              description="Stories can automatically stop being displayed after their end time."
            />
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
            <p className="text-xs leading-5 text-slate-400">
              Breaking news settings are currently UI-only. They
              will later be connected to the Article and
              notification system through MySQL.
            </p>
          </div>
        </section>
      </div>

      {/* =========================================================
          SELECTED STORY
      ========================================================== */}
      {selectedStory && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-pink-600">
                Breaking News Details
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {selectedStory.headline}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage this breaking news item.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedStory(null)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close story details"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_350px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <BreakingStatusBadge
                  status={selectedStory.status}
                />

                <PriorityBadge
                  priority={selectedStory.priority}
                />

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  {selectedStory.category}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                {selectedStory.headline}
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                {selectedStory.description ||
                  "No description added yet."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DetailItem
                  label="Category"
                  value={selectedStory.category}
                />

                <DetailItem
                  label="Priority"
                  value={selectedStory.priority}
                />

                <DetailItem
                  label="Start"
                  value={selectedStory.startTime}
                />

                <DetailItem
                  label="End"
                  value={selectedStory.endTime}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Actions
              </p>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(selectedStory)
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                >
                  <Edit3 size={15} />
                  Edit Story
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleActive(
                      selectedStory.id
                    )
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  {selectedStory.status ===
                  "Active" ? (
                    <>
                      <PauseCircle size={15} />
                      Stop Breaking
                    </>
                  ) : (
                    <>
                      <Play size={15} />
                      Activate Breaking
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteStory(
                      selectedStory.id
                    )
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={15} />
                  Delete Story
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  News Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingStory
                    ? "Edit Breaking News"
                    : "Add Breaking News"}
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
              {/* Headline */}
              <div>
                <label
                  htmlFor="breakingHeadline"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Breaking Headline
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <textarea
                  id="breakingHeadline"
                  rows={3}
                  value={headline}
                  onChange={(event) =>
                    setHeadline(
                      event.target.value
                    )
                  }
                  placeholder="Enter urgent breaking news headline..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="breakingDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Short Description
                </label>

                <textarea
                  id="breakingDescription"
                  rows={4}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Add a short explanation of the breaking story..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Category + Priority */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="breakingCategory"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Category
                  </label>

                  <div className="relative">
                    <select
                      id="breakingCategory"
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      {categories.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="breakingPriority"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Priority
                  </label>

                  <div className="relative">
                    <select
                      id="breakingPriority"
                      value={priority}
                      onChange={(event) =>
                        setPriority(
                          event.target
                            .value as BreakingPriority
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      {priorities.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="breakingStatus"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <div className="relative">
                  <select
                    id="breakingStatus"
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target
                          .value as BreakingStatus
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Scheduled">
                      Scheduled
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                    <option value="Expired">
                      Expired
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Start + End */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="breakingStart"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Start Date &amp; Time
                  </label>

                  <input
                    id="breakingStart"
                    type="text"
                    value={startTime}
                    onChange={(event) =>
                      setStartTime(
                        event.target.value
                      )
                    }
                    placeholder="e.g. 15 Sep 2026, 02:00 PM"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="breakingEnd"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    End Date &amp; Time
                  </label>

                  <input
                    id="breakingEnd"
                    type="text"
                    value={endTime}
                    onChange={(event) =>
                      setEndTime(
                        event.target.value
                      )
                    }
                    placeholder="e.g. 15 Sep 2026, 06:00 PM"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>
              </div>

              {/* Alert Preview */}
              <div className="overflow-hidden rounded-2xl border border-red-100 bg-red-50">
                <div className="flex items-center gap-2 border-b border-red-100 bg-red-100/60 px-4 py-3">
                  <Zap
                    size={15}
                    className="text-red-600"
                  />

                  <span className="text-xs font-bold uppercase tracking-wide text-red-600">
                    Breaking News Preview
                  </span>
                </div>

                <div className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-500" />

                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-6 text-slate-800">
                        {headline ||
                          "Your breaking news headline will appear here."}
                      </p>

                      {description && (
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              {status === "Active" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={17}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        Active breaking alert
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        This story will be treated as a currently
                        active breaking news item in the UI.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                onClick={saveStory}
                disabled={!headline.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />

                {editingStory
                  ? "Save Changes"
                  : "Create Breaking News"}
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

function BreakingStatCard({
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
                ? "text-red-600"
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
   PRIORITY BADGE
================================================================ */

function PriorityBadge({
  priority,
}: {
  priority: BreakingPriority;
}) {
  const styles: Record<
    BreakingPriority,
    string
  > = {
    High: "bg-red-50 text-red-600",
    Medium:
      "bg-amber-50 text-amber-700",
    Low: "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

/* ===============================================================
   STATUS BADGE
================================================================ */

function BreakingStatusBadge({
  status,
}: {
  status: BreakingStatus;
}) {
  const styles: Record<
    BreakingStatus,
    string
  > = {
    Active:
      "bg-red-50 text-red-600",
    Scheduled:
      "bg-purple-50 text-purple-700",
    Inactive:
      "bg-slate-100 text-slate-500",
    Expired:
      "bg-slate-100 text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Active" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      )}

      {status}
    </span>
  );
}

/* ===============================================================
   SELECT FILTER
================================================================ */

function SelectFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* ===============================================================
   INFO ROW
================================================================ */

function InfoRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* ===============================================================
   DETAIL ITEM
================================================================ */

function DetailItem({
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