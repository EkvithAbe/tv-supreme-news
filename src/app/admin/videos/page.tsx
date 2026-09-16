"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  FileVideo,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
  Video,
  X,
  Zap,
} from "lucide-react";

type VideoStatus =
  | "Draft"
  | "Review"
  | "Scheduled"
  | "Published"
  | "Archived";

type VideoItem = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  status: VideoStatus;
  language: string;
  duration: string;
  views: number;
  publishedAt: string;
  featured: boolean;
  videoUrl: string;
};

const initialVideos: VideoItem[] = [
  {
    id: 1,
    title: "Sri Lanka's incredible wildlife – A closer look",
    description:
      "A closer look at Sri Lanka's extraordinary wildlife and natural beauty.",
    thumbnail: "/images/news/world.jpg",
    category: "Lifestyle",
    status: "Published",
    language: "English",
    duration: "4:12",
    views: 8400,
    publishedAt: "14 Sep 2026",
    featured: true,
    videoUrl: "",
  },
  {
    id: 2,
    title: "Colombo: A city of new opportunities",
    description:
      "Exploring Colombo's changing business and urban landscape.",
    thumbnail: "/images/news/port.jpg",
    category: "Business",
    status: "Published",
    language: "English",
    duration: "6:25",
    views: 12000,
    publishedAt: "13 Sep 2026",
    featured: true,
    videoUrl: "",
  },
  {
    id: 3,
    title: "In Conversation with Change Makers",
    description:
      "An interview with people creating meaningful change in Sri Lanka.",
    thumbnail: "/images/news/president.jpg",
    category: "Sri Lanka",
    status: "Review",
    language: "English",
    duration: "3:40",
    views: 5100,
    publishedAt: "12 Sep 2026",
    featured: false,
    videoUrl: "",
  },
  {
    id: 4,
    title: "Latest technology trends you should know",
    description:
      "The latest developments in AI, technology and digital innovation.",
    thumbnail: "/images/news/technology.jpg",
    category: "Technology",
    status: "Draft",
    language: "English",
    duration: "5:18",
    views: 0,
    publishedAt: "—",
    featured: false,
    videoUrl: "",
  },
  {
    id: 5,
    title: "Sri Lanka cricket: Match day analysis",
    description:
      "Expert analysis and highlights from the latest Sri Lanka cricket action.",
    thumbnail: "/images/news/cricket.jpg",
    category: "Sports",
    status: "Scheduled",
    language: "English",
    duration: "8:05",
    views: 0,
    publishedAt: "16 Sep 2026",
    featured: false,
    videoUrl: "",
  },
  {
    id: 6,
    title: "Weather update across the island",
    description:
      "The latest weather conditions and forecast for Sri Lanka.",
    thumbnail: "/images/news/rain.jpg",
    category: "Sri Lanka",
    status: "Archived",
    language: "English",
    duration: "2:36",
    views: 6400,
    publishedAt: "10 Sep 2026",
    featured: false,
    videoUrl: "",
  },
];

const statusFilters = [
  { label: "All Videos", value: "All" },
  { label: "Drafts", value: "Draft" },
  { label: "Review", value: "Review" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Published", value: "Published" },
  { label: "Archived", value: "Archived" },
] as const;

const categories = [
  "All Categories",
  "Sri Lanka",
  "World",
  "Politics",
  "Business",
  "Sports",
  "Entertainment",
  "Technology",
  "Lifestyle",
];

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>(
    initialVideos
  );

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    (typeof statusFilters)[number]["value"]
  >("All");

  const [categoryFilter, setCategoryFilter] = useState(
    "All Categories"
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const [editingVideo, setEditingVideo] =
    useState<VideoItem | null>(null);

  const [selectedVideo, setSelectedVideo] =
    useState<VideoItem | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sri Lanka");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] =
    useState<VideoStatus>("Draft");

  const filteredVideos = useMemo(() => {
    const query = search.trim().toLowerCase();

    return videos.filter((video) => {
      const matchesSearch =
        !query ||
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        video.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        video.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [videos, search, statusFilter, categoryFilter]);

  const totalVideos = videos.length;

  const publishedCount = videos.filter(
    (video) => video.status === "Published"
  ).length;

  const draftCount = videos.filter(
    (video) => video.status === "Draft"
  ).length;

  const scheduledCount = videos.filter(
    (video) => video.status === "Scheduled"
  ).length;

  const reviewCount = videos.filter(
    (video) => video.status === "Review"
  ).length;

  const totalViews = videos.reduce(
    (sum, video) => sum + video.views,
    0
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Sri Lanka");
    setLanguage("English");
    setDuration("");
    setVideoUrl("");
    setFeatured(false);
    setStatus("Draft");
    setEditingVideo(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (video: VideoItem) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setCategory(video.category);
    setLanguage(video.language);
    setDuration(video.duration);
    setVideoUrl(video.videoUrl);
    setFeatured(video.featured);
    setStatus(video.status);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const saveVideo = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) return;

    if (editingVideo) {
      setVideos((current) =>
        current.map((video) =>
          video.id === editingVideo.id
            ? {
                ...video,
                title: cleanTitle,
                description: description.trim(),
                category,
                language,
                duration: duration.trim() || "0:00",
                videoUrl: videoUrl.trim(),
                featured,
                status,
              }
            : video
        )
      );
    } else {
      const newVideo: VideoItem = {
        id:
          Math.max(
            0,
            ...videos.map((video) => video.id)
          ) + 1,
        title: cleanTitle,
        description: description.trim(),
        thumbnail: "/images/home/live-tv.jpg",
        category,
        status,
        language,
        duration: duration.trim() || "0:00",
        views: 0,
        publishedAt:
          status === "Published"
            ? "Just now"
            : status === "Scheduled"
              ? "Scheduled"
              : "—",
        featured,
        videoUrl: videoUrl.trim(),
      };

      setVideos((current) => [
        newVideo,
        ...current,
      ]);
    }

    closeModal();
  };

  const deleteVideo = (id: number) => {
    const video = videos.find(
      (item) => item.id === id
    );

    if (!video) return;

    const confirmed = window.confirm(
      `Delete "${video.title}"?`
    );

    if (!confirmed) return;

    setVideos((current) =>
      current.filter((item) => item.id !== id)
    );

    if (selectedVideo?.id === id) {
      setSelectedVideo(null);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }

    if (views >= 1000) {
      return `${(views / 1000).toFixed(
        views >= 10000 ? 0 : 1
      )}K`;
    }

    return String(views);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            Content Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Videos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage TV SUPREME video news, programmes and
            featured videos.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={17} />
          Add Video
        </button>
      </div>

      {/* =========================================================
          STATS
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <VideoStatCard
          title="Total Videos"
          value={String(totalVideos)}
          note="All videos"
          icon={<Video size={20} />}
        />

        <VideoStatCard
          title="Published"
          value={String(publishedCount)}
          note="Currently live"
          icon={<CheckCircle2 size={20} />}
        />

        <VideoStatCard
          title="Drafts"
          value={String(draftCount)}
          note="Being prepared"
          icon={<FileVideo size={20} />}
        />

        <VideoStatCard
          title="Review"
          value={String(reviewCount)}
          note="Waiting for approval"
          icon={<Clock3 size={20} />}
        />

        <VideoStatCard
          title="Total Views"
          value={formatViews(totalViews)}
          note="Across all videos"
          icon={<Eye size={20} />}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
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
                placeholder="Search videos..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
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
            VIDEO TABLE
        ======================================================== */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Video
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Category
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Views
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Published
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Featured
                </th>

                <th className="w-[120px] px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <tr
                    key={video.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70"
                  >
                    {/* Video */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedVideo(video)
                        }
                        className="flex max-w-[430px] items-center gap-3 text-left"
                      >
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
                              <Play
                                size={12}
                                fill="currentColor"
                              />
                            </span>
                          </div>

                          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            {video.duration}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {video.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {video.language} ·{" "}
                            {video.duration}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {video.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={video.status} />
                    </td>

                    {/* Views */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Eye size={14} />
                        {formatViews(video.views)}
                      </span>
                    </td>

                    {/* Published */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {video.publishedAt}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4">
                      {video.featured ? (
                        <span className="inline-flex rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700">
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(video)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                          aria-label={`Edit ${video.title}`}
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedVideo(video)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`View ${video.title}`}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteVideo(video.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${video.title}`}
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`More actions for ${video.title}`}
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <Video
                          size={40}
                          className="text-slate-300"
                        />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-slate-700">
                        No videos found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or create a new
                        video.
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
            Showing {filteredVideos.length} of{" "}
            {videos.length} videos
          </span>

          <span>
            Video records are currently local UI data.
          </span>
        </div>
      </section>

      {/* =========================================================
          SELECTED VIDEO
      ========================================================== */}
      {selectedVideo && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Video Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preview and manage the selected video.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close video details"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[360px_minmax(0,1fr)]">
            {/* Preview */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
              <div className="relative aspect-video">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="h-full w-full object-cover opacity-80"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white">
                    <Play
                      size={23}
                      fill="currentColor"
                    />
                  </span>
                </div>

                <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-1 text-xs font-bold text-white">
                  {selectedVideo.duration}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Title
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedVideo.title}
                </h3>
              </div>

              <p className="text-sm leading-6 text-slate-500">
                {selectedVideo.description ||
                  "No description added yet."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  label="Category"
                  value={selectedVideo.category}
                />

                <DetailItem
                  label="Language"
                  value={selectedVideo.language}
                />

                <DetailItem
                  label="Status"
                  value={selectedVideo.status}
                />

                <DetailItem
                  label="Views"
                  value={formatViews(
                    selectedVideo.views
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(selectedVideo)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                >
                  <Edit3 size={16} />
                  Edit Video
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideo(null);
                    openAddModal();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Plus size={16} />
                  Add Another
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteVideo(selectedVideo.id)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  Video Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingVideo
                    ? "Edit Video"
                    : "Add Video"}
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
              <div>
                <label
                  htmlFor="videoTitle"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Video Title
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  id="videoTitle"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter video title..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              <div>
                <label
                  htmlFor="videoDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="videoDescription"
                  rows={4}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe the video..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="videoCategory"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Category
                  </label>

                  <div className="relative">
                    <select
                      id="videoCategory"
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      {categories
                        .filter(
                          (item) =>
                            item !== "All Categories"
                        )
                        .map((item) => (
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
                    htmlFor="videoLanguage"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Language
                  </label>

                  <div className="relative">
                    <select
                      id="videoLanguage"
                      value={language}
                      onChange={(event) =>
                        setLanguage(event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      <option value="English">
                        English
                      </option>

                      <option value="Sinhala">
                        Sinhala
                      </option>

                      <option value="Tamil">
                        Tamil
                      </option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="videoDuration"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Duration
                  </label>

                  <input
                    id="videoDuration"
                    type="text"
                    value={duration}
                    onChange={(event) =>
                      setDuration(event.target.value)
                    }
                    placeholder="e.g. 4:12"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="videoStatus"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Status
                  </label>

                  <div className="relative">
                    <select
                      id="videoStatus"
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as VideoStatus
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      <option value="Draft">
                        Draft
                      </option>

                      <option value="Review">
                        Review
                      </option>

                      <option value="Scheduled">
                        Scheduled
                      </option>

                      <option value="Published">
                        Published
                      </option>

                      <option value="Archived">
                        Archived
                      </option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="videoUrl"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Video URL
                </label>

                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(event) =>
                    setVideoUrl(event.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Thumbnail
                </label>

                <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <FileVideo
                      size={24}
                      className="text-pink-600"
                    />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Upload video thumbnail
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Thumbnail management will connect to
                    Media Library later.
                  </p>

                  <button
                    type="button"
                    className="mt-4 rounded-xl bg-pink-50 px-4 py-2 text-xs font-semibold text-pink-600 hover:bg-pink-100"
                  >
                    Choose Image
                  </button>
                </div>
              </div>

              {/* Featured */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Featured Video
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Highlight this video in the public
                      Featured Videos section.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={featured}
                    onClick={() =>
                      setFeatured(!featured)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      featured
                        ? "bg-gradient-to-r from-pink-600 to-purple-600"
                        : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        featured
                          ? "left-[22px]"
                          : "left-0.5"
                      }`}
                    />
                  </button>
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
                onClick={saveVideo}
                disabled={!title.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Video size={16} />

                {editingVideo
                  ? "Save Changes"
                  : "Add Video"}
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

function VideoStatCard({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {note}
          </p>
        </div>

        <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
  status,
}: {
  status: VideoStatus;
}) {
  const styles: Record<VideoStatus, string> = {
    Draft: "bg-slate-100 text-slate-600",
    Review: "bg-amber-50 text-amber-700",
    Scheduled: "bg-purple-50 text-purple-700",
    Published: "bg-emerald-50 text-emerald-700",
    Archived: "bg-slate-100 text-slate-500",
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

      <p className="mt-1.5 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}