"use client";

import { useEffect, useMemo, useState } from "react";
import MediaImagePicker, {
  type SelectedImage,
} from "@/components/admin/MediaImagePicker";
import { useAdminUser } from "@/components/admin/AdminUserContext";

import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  FileVideo,
  Loader2,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react";

type VideoStatus =
  | "Draft"
  | "Review"
  | "Scheduled"
  | "Published"
  | "Archived";

type LanguageLabel =
  | "English"
  | "Sinhala"
  | "Tamil";

type CategoryOption = {
  id: string;
  name: string;
  slug?: string;
};

type VideoItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailId: string | null;
  category: string;
  categoryId: string | null;
  videoCategoryId: string | null;
  videoCategoryName: string | null;
  status: VideoStatus;
  language: LanguageLabel;
  duration: string;
  views: number;
  publishedAt: string;
  scheduledAt: string;
  featured: boolean;
  videoUrl: string;
};

const statusFilters = [
  { label: "All Videos", value: "All" },
  { label: "Drafts", value: "Draft" },
  { label: "Review", value: "Review" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Published", value: "Published" },
  { label: "Archived", value: "Archived" },
] as const;

function mapStatusFromApi(
  status: string,
): VideoStatus {
  switch (status) {
    case "REVIEW":
      return "Review";
    case "SCHEDULED":
      return "Scheduled";
    case "PUBLISHED":
      return "Published";
    case "ARCHIVED":
      return "Archived";
    default:
      return "Draft";
  }
}

function mapStatusToApi(
  status: VideoStatus,
): string {
  switch (status) {
    case "Review":
      return "REVIEW";
    case "Scheduled":
      return "SCHEDULED";
    case "Published":
      return "PUBLISHED";
    case "Archived":
      return "ARCHIVED";
    default:
      return "DRAFT";
  }
}

function mapLanguageFromApi(
  language: string,
): LanguageLabel {
  switch (language) {
    case "SI":
      return "Sinhala";
    case "TA":
      return "Tamil";
    default:
      return "English";
  }
}

function mapLanguageToApi(
  language: LanguageLabel,
): string {
  switch (language) {
    case "Sinhala":
      return "SI";
    case "Tamil":
      return "TA";
    default:
      return "EN";
  }
}

function formatDuration(
  seconds: number | null | undefined,
): string {
  if (
    seconds === null ||
    seconds === undefined ||
    !Number.isFinite(seconds)
  ) {
    return "0:00";
  }

  const totalSeconds = Math.max(
    0,
    Math.floor(seconds),
  );

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const remainingSeconds =
    totalSeconds % 60;

  return `${minutes}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function parseDuration(
  value: string,
): number | null {
  const clean = value.trim();

  if (!clean) {
    return null;
  }

  if (clean.includes(":")) {
    const parts = clean.split(":");

    if (parts.length !== 2) {
      return null;
    }

    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);

    if (
      !Number.isFinite(minutes) ||
      !Number.isFinite(seconds) ||
      minutes < 0 ||
      seconds < 0 ||
      seconds >= 60
    ) {
      return null;
    }

    return Math.floor(
      minutes * 60 + seconds,
    );
  }

  const seconds = Number(clean);

  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return null;
  }

  return Math.floor(seconds);
}

function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function toDateTimeLocal(
  value: string | null | undefined,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(
    date.getDate(),
  )}T${pad(
    date.getHours(),
  )}:${pad(
    date.getMinutes(),
  )}`;
}

function formatViews(
  views: number,
): string {
  if (views >= 1000000) {
    return `${(
      views / 1000000
    ).toFixed(1)}M`;
  }

  if (views >= 1000) {
    return `${(
      views / 1000
    ).toFixed(
      views >= 10000 ? 0 : 1,
    )}K`;
  }

  return String(views);
}

function mapApiVideo(
  item: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    language: string;
    status: string;
    categoryId: string | null;
    categoryName: string | null;
    videoCategoryId: string | null;
    videoCategoryName: string | null;
    thumbnailId: string | null;
    thumbnailUrl: string | null;
    videoUrl: string;
    duration: number | null;
    views: number;
    isFeatured: boolean;
    publishedAt: string | null;
    scheduledAt: string | null;
  },
): VideoItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description:
      item.description ?? "",
    thumbnail:
      item.thumbnailUrl ||
      "/images/home/live-tv.jpg",
    thumbnailId:
      item.thumbnailId,
    category:
      item.videoCategoryName ||
      item.categoryName ||
      "Uncategorized",
    categoryId:
      item.videoCategoryId ||
      item.categoryId,
    videoCategoryId:
      item.videoCategoryId,
    videoCategoryName:
      item.videoCategoryName,
    status:
      mapStatusFromApi(item.status),
    language:
      mapLanguageFromApi(
        item.language,
      ),
    duration:
      formatDuration(item.duration),
    views: item.views,
    publishedAt:
      formatDate(item.publishedAt),
    scheduledAt:
      formatDate(item.scheduledAt),
    featured:
      item.isFeatured,
    videoUrl: item.videoUrl,
  };
}

function parseApiVideos(
  items: unknown[],
): VideoItem[] {
  return items
    .filter(
      (
        item,
      ): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === "object",
    )
    .map(
      (
        item: Record<string, unknown>,
      ) =>
        mapApiVideo({
          id: String(
            item.id ?? "",
          ),
          slug: String(
            item.slug ?? "",
          ),
          title: String(
            item.title ?? "",
          ),
          description:
            item.description ===
              null ||
            item.description ===
              undefined
              ? null
              : String(
                  item.description,
                ),
          language: String(
            item.language ?? "EN",
          ),
          status: String(
            item.status ?? "DRAFT",
          ),
          categoryId:
            item.categoryId ===
              null ||
            item.categoryId ===
              undefined
              ? null
              : String(
                  item.categoryId,
                ),
          categoryName:
            item.categoryName ===
              null ||
            item.categoryName ===
              undefined
              ? null
              : String(
                  item.categoryName,
                ),
          videoCategoryId:
            item.videoCategoryId ===
              null ||
            item.videoCategoryId ===
              undefined
              ? null
              : String(
                  item.videoCategoryId,
                ),
          videoCategoryName:
            item.videoCategoryName ===
              null ||
            item.videoCategoryName ===
              undefined
              ? null
              : String(
                  item.videoCategoryName,
                ),
          thumbnailId:
            item.thumbnailId ===
              null ||
            item.thumbnailId ===
              undefined
              ? null
              : String(
                  item.thumbnailId,
                ),
          thumbnailUrl:
            item.thumbnailUrl ===
              null ||
            item.thumbnailUrl ===
              undefined
              ? null
              : String(
                  item.thumbnailUrl,
                ),
          videoUrl: String(
            item.videoUrl ?? "",
          ),
          duration:
            typeof item.duration ===
            "number"
              ? item.duration
              : null,
          views:
            typeof item.views ===
            "number"
              ? item.views
              : 0,
          isFeatured:
            item.isFeatured === true,
          publishedAt:
            item.publishedAt ===
              null ||
            item.publishedAt ===
              undefined
              ? null
              : String(
                  item.publishedAt,
                ),
          scheduledAt:
            item.scheduledAt ===
              null ||
            item.scheduledAt ===
              undefined
              ? null
              : String(
                  item.scheduledAt,
                ),
        }),
    );
}

export default function VideosPage() {
  const currentUser = useAdminUser();

  const [videos, setVideos] =
    useState<VideoItem[]>([]);

  const [videoCategories, setVideoCategories] =
    useState<CategoryOption[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      (typeof statusFilters)[number]["value"]
    >("All");

  const [videoCategoryFilter, setVideoCategoryFilter] =
    useState("All Video Categories");

  const [sortOrder, setSortOrder] =
    useState<
      "latest" | "oldest" | "name"
    >("latest");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editingVideo, setEditingVideo] =
    useState<VideoItem | null>(null);

  const [selectedVideo, setSelectedVideo] =
    useState<VideoItem | null>(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [videoCategoryId, setVideoCategoryId] =
    useState("");

  const [language, setLanguage] =
    useState<LanguageLabel>("English");

  const [duration, setDuration] =
    useState("");

  const [videoUrl, setVideoUrl] =
    useState("");

  const [thumbnail, setThumbnail] =
    useState<SelectedImage | null>(null);

  const [featured, setFeatured] =
    useState(false);

  const [status, setStatus] =
    useState<VideoStatus>("Draft");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [
        videosResponse,
        videoCategoriesResponse,
      ] = await Promise.all([
        fetch(
          "/api/admin/videos?page=1&pageSize=100",
          {
            cache: "no-store",
          },
        ),
        fetch(
          "/api/admin/video-categories?language=EN",
          {
            cache: "no-store",
          },
        ),
      ]);

      const [
        videosData,
        videoCategoriesData,
      ] = await Promise.all([
        videosResponse.json(),
        videoCategoriesResponse.json(),
      ]);

      if (
        !videosResponse.ok ||
        !videosData.success
      ) {
        throw new Error(
          videosData.message ||
            "Failed to load videos.",
        );
      }

      const videoItems =
        Array.isArray(
          videosData.items,
        )
          ? videosData.items
          : Array.isArray(
                videosData.videos,
              )
            ? videosData.videos
            : [];

      setVideos(
        parseApiVideos(
          videoItems,
        ),
      );

      if (
        videoCategoriesResponse.ok &&
        videoCategoriesData.success
      ) {
        const categoryItems =
          Array.isArray(
            videoCategoriesData.categories,
          )
            ? videoCategoriesData.categories
            : Array.isArray(
                  videoCategoriesData.items,
                )
              ? videoCategoriesData.items
              : [];

        setVideoCategories(
          categoryItems
            .filter(
              (
                item: unknown,
              ): item is Record<
                string,
                unknown
              > =>
                Boolean(item) &&
                typeof item ===
                  "object",
            )
            .map(
              (
                item: Record<
                  string,
                  unknown
                >,
              ) => ({
                id: String(
                  item.id ?? "",
                ),
                name: String(
                  item.name ??
                    item.slug ??
                    "Category",
                ),
                slug:
                  item.slug ===
                  undefined
                    ? undefined
                    : String(
                        item.slug,
                      ),
              }),
            )
            .filter(
              (
                item: CategoryOption,
              ) =>
                Boolean(
                  item.id,
                ),
            ),
        );
      } else {
        setVideoCategories([]);
      }

    } catch (loadError) {
      console.error(
        "Failed to load video data:",
        loadError,
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load video data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, []);

  const videoCategoryNames = useMemo(
    () => [
      "All Video Categories",
      ...videoCategories.map(
        (item: CategoryOption) =>
          item.name,
      ),
    ],
    [videoCategories],
  );

  const filteredVideos = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    const filtered =
      videos.filter(
        (video: VideoItem) => {
          const matchesSearch =
            !query ||
            video.title
              .toLowerCase()
              .includes(query) ||
            video.description
              .toLowerCase()
              .includes(query) ||
            video.category
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === "All" ||
            video.status ===
              statusFilter;

          const matchesVideoCategory =
            videoCategoryFilter ===
              "All Video Categories" ||
            video.category ===
              videoCategoryFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesVideoCategory
          );
        },
      );

    return [...filtered].sort(
      (
        a: VideoItem,
        b: VideoItem,
      ) => {
        if (
          sortOrder === "name"
        ) {
          return a.title.localeCompare(
            b.title,
          );
        }

        const aIndex =
          videos.indexOf(a);

        const bIndex =
          videos.indexOf(b);

        if (
          sortOrder === "oldest"
        ) {
          return (
            aIndex - bIndex
          );
        }

        return (
          bIndex - aIndex
        );
      },
    );
  }, [
    videos,
    search,
    statusFilter,
    videoCategoryFilter,
    sortOrder,
  ]);

  const totalVideos =
    videos.length;

  const publishedCount =
    videos.filter(
      (video: VideoItem) =>
        video.status ===
        "Published",
    ).length;

  const draftCount =
    videos.filter(
      (video: VideoItem) =>
        video.status ===
        "Draft",
    ).length;

  const scheduledCount =
    videos.filter(
      (video: VideoItem) =>
        video.status ===
        "Scheduled",
    ).length;

  const reviewCount =
    videos.filter(
      (video: VideoItem) =>
        video.status ===
        "Review",
    ).length;

  const totalViews =
    videos.reduce(
      (
        sum: number,
        video: VideoItem,
      ) =>
        sum + video.views,
      0,
    );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoCategoryId(
      videoCategories[0]?.id || "",
    );
    setLanguage("English");
    setDuration("");
    setVideoUrl("");
    setThumbnail(null);
    setFeatured(false);
    setStatus("Draft");
    setScheduledAt("");
    setEditingVideo(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (
    video: VideoItem,
  ) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(
      video.description,
    );
    setVideoCategoryId(
      video.videoCategoryId ||
        video.categoryId ||
        "",
    );
    setLanguage(video.language);
    setDuration(video.duration);
    setVideoUrl(video.videoUrl);
    setThumbnail(
      video.thumbnailId
        ? {
            id: video.thumbnailId,
            filename: "Current thumbnail",
            url: video.thumbnail,
            altText: null,
          }
        : null,
    );
    setFeatured(video.featured);
    setStatus(video.status);

    setScheduledAt(
      video.scheduledAt === "—"
        ? ""
        : toDateTimeLocal(
            video.scheduledAt,
          ),
    );

    setShowAddModal(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setShowAddModal(false);
    resetForm();
  };

  const saveVideo = async () => {
    const cleanTitle =
      title.trim();

    const cleanDescription =
      description.trim();

    const cleanVideoUrl =
      videoUrl.trim();

    if (!cleanTitle) {
      setError(
        "Video title is required.",
      );
      return;
    }

    if (!cleanVideoUrl) {
      setError(
        "Video URL is required.",
      );
      return;
    }

    const durationSeconds =
      parseDuration(duration);

    if (
      duration.trim() &&
      durationSeconds === null
    ) {
      setError(
        "Duration must be in MM:SS format, for example 4:12.",
      );
      return;
    }

    if (
      !videoCategoryId &&
      videoCategories.length > 0
    ) {
      setError(
        "Please select a video category.",
      );
      return;
    }

    if (
      status === "Scheduled" &&
      !scheduledAt
    ) {
      setError(
        "Please select a scheduled date and time.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const body = {
        title: cleanTitle,
        description:
          cleanDescription ||
          null,
        language:
          mapLanguageToApi(
            language,
          ),
        status:
          mapStatusToApi(status),
        videoCategoryId:
          videoCategoryId || null,
        thumbnailId:
          thumbnail?.id ?? null,
        videoUrl:
          cleanVideoUrl,
        duration:
          durationSeconds,
        isFeatured:
          featured,
        scheduledAt:
          status === "Scheduled"
            ? new Date(
                scheduledAt,
              ).toISOString()
            : null,
      };

      let response: Response;

      if (editingVideo) {
        response = await fetch(
          "/api/admin/videos",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: editingVideo.id,
              ...body,
            }),
          },
        );
      } else {
        response = await fetch(
          "/api/admin/videos",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(body),
          },
        );
      }

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to save video.",
        );
      }

      await loadData();

      setShowAddModal(false);
      resetForm();
    } catch (saveError) {
      console.error(
        "Failed to save video:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save video.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteVideo = async (
    id: string,
  ) => {
    const video =
      videos.find(
        (item: VideoItem) =>
          item.id === id,
      );

    if (!video) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${video.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response =
        await fetch(
          `/api/admin/videos?id=${encodeURIComponent(
            id,
          )}`,
          {
            method: "DELETE",
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete video.",
        );
      }

      setVideos(
        (
          current: VideoItem[],
        ) =>
          current.filter(
            (item: VideoItem) =>
              item.id !== id,
          ),
      );

      if (
        selectedVideo?.id ===
        id
      ) {
        setSelectedVideo(null);
      }
    } catch (deleteError) {
      console.error(
        "Failed to delete video:",
        deleteError,
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete video.",
      );
    }
  };

  const changeVideoStatus =
    async (
      video: VideoItem,
      nextStatus: VideoStatus,
    ) => {
      try {
        setError("");

        const response =
          await fetch(
            "/api/admin/videos",
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                id: video.id,
                status:
                  mapStatusToApi(
                    nextStatus,
                  ),
              }),
            },
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update video status.",
          );
        }

        await loadData();

        if (
          selectedVideo?.id ===
          video.id &&
          data.video
        ) {
          const refreshed =
            mapApiVideo({
              id:
                data.video.id,
              slug:
                data.video.slug,
              title:
                data.video.title,
              description:
                data.video
                  .description ??
                null,
              language:
                data.video.language,
              status:
                data.video.status,
              categoryId:
                data.video
                  .categoryId ??
                null,
              categoryName:
                data.video
                  .categoryName ??
                null,
              videoCategoryId:
                data.video
                  .videoCategoryId ??
                null,
              videoCategoryName:
                data.video
                  .videoCategoryName ??
                null,
              thumbnailId:
                data.video
                  .thumbnailId ??
                null,
              thumbnailUrl:
                data.video
                  .thumbnailUrl ??
                null,
              videoUrl:
                data.video.videoUrl,
              duration:
                data.video.duration ??
                null,
              views:
                data.video.views ??
                0,
              isFeatured:
                data.video
                  .isFeatured ===
                true,
              publishedAt:
                data.video
                  .publishedAt ??
                null,
              scheduledAt:
                data.video
                  .scheduledAt ??
                null,
            });

          setSelectedVideo(
            refreshed,
          );
        }
      } catch (statusError) {
        console.error(
          "Failed to update video status:",
          statusError,
        );

        setError(
          statusError instanceof Error
            ? statusError.message
            : "Failed to update video status.",
        );
      }
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
            Manage TV SUPREME video news,
            programmes and featured videos.
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================================================
          STATS
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <VideoStatCard
          title="Total Videos"
          value={String(
            totalVideos,
          )}
          note="All videos"
          icon={<Video size={20} />}
        />

        <VideoStatCard
          title="Published"
          value={String(
            publishedCount,
          )}
          note="Currently live"
          icon={
            <CheckCircle2 size={20} />
          }
        />

        <VideoStatCard
          title="Drafts"
          value={String(
            draftCount,
          )}
          note="Being prepared"
          icon={
            <FileVideo size={20} />
          }
        />

        <VideoStatCard
          title="Review"
          value={String(
            reviewCount,
          )}
          note="Waiting for approval"
          icon={<Clock3 size={20} />}
        />

        <VideoStatCard
          title="Total Views"
          value={formatViews(
            totalViews,
          )}
          note="Across all videos"
          icon={<Eye size={20} />}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <section className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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
                placeholder="Search videos..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={
                    videoCategoryFilter
                  }
                  onChange={(event) =>
                    setVideoCategoryFilter(
                      event.target
                        .value,
                    )
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400"
                >
                  {videoCategoryNames.map(
                    (item: string) => (
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

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target
                        .value as
                        | "latest"
                        | "oldest"
                        | "name",
                    )
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400"
                >
                  <option value="latest">
                    Latest
                  </option>
                  <option value="oldest">
                    Oldest
                  </option>
                  <option value="name">
                    Name
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

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
                  Video Category
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Loader2
                        size={34}
                        className="animate-spin text-pink-600"
                      />

                      <p className="mt-4 text-sm font-semibold text-slate-700">
                        Loading videos...
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Loading video records
                        from the CMS.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredVideos.length >
                0 ? (
                filteredVideos.map(
                  (video: VideoItem) => (
                    <tr
                      key={video.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedVideo(
                              video,
                            )
                          }
                          className="flex max-w-[430px] items-center gap-3 text-left"
                        >
                          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                            <img
                              src={
                                video.thumbnail
                              }
                              alt={
                                video.title
                              }
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
                              {
                                video.duration
                              }
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {
                                video.title
                              }
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-400">
                              {
                                video.language
                              }{" "}
                              ·{" "}
                              {
                                video.duration
                              }
                            </p>
                          </div>
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-slate-600">
                          {
                            video.category
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            video.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                          <Eye
                            size={14}
                          />
                          {formatViews(
                            video.views,
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">
                          {video.status ===
                          "Scheduled"
                            ? video.scheduledAt
                            : video.publishedAt}
                        </span>
                      </td>

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

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                video,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                            aria-label={`Edit ${video.title}`}
                          >
                            <Edit3
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedVideo(
                                video,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`View ${video.title}`}
                          >
                            <Eye
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteVideo(
                                video.id,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${video.title}`}
                          >
                            <Trash2
                              size={15}
                            />
                          </button>

                          <div className="group relative">
                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100 hover:text-slate-700"
                              aria-label={`More actions for ${video.title}`}
                            >
                              <MoreHorizontal
                                size={15}
                              />
                            </button>

                            <div className="invisible absolute right-0 top-10 z-30 w-40 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                              {video.status !==
                                "Published" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void changeVideoStatus(
                                      video,
                                      "Published",
                                    )
                                  }
                                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                                >
                                  Publish
                                </button>
                              )}

                              {video.status !==
                                "Draft" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void changeVideoStatus(
                                      video,
                                      "Draft",
                                    )
                                  }
                                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                  Move to Draft
                                </button>
                              )}

                              {video.status !==
                                "Archived" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void changeVideoStatus(
                                      video,
                                      "Archived",
                                    )
                                  }
                                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                  Archive
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                )
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
                        Try another search,
                        filter or create a
                        new video.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing{" "}
            {
              filteredVideos.length
            }{" "}
            of {videos.length} videos
          </span>

          <span>
            Video records are stored in
            MySQL.
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
                Preview and manage the selected
                video.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedVideo(null)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close video details"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
              <div className="relative aspect-video">
                <img
                  src={
                    selectedVideo.thumbnail
                  }
                  alt={
                    selectedVideo.title
                  }
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
                  {
                    selectedVideo.duration
                  }
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Title
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {
                    selectedVideo.title
                  }
                </h3>
              </div>

              <p className="text-sm leading-6 text-slate-500">
                {selectedVideo.description ||
                  "No description added yet."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  label="Category"
                  value={
                    selectedVideo.category
                  }
                />

                <DetailItem
                  label="Language"
                  value={
                    selectedVideo.language
                  }
                />

                <DetailItem
                  label="Status"
                  value={
                    selectedVideo.status
                  }
                />

                <DetailItem
                  label="Views"
                  value={formatViews(
                    selectedVideo.views,
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(
                      selectedVideo,
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                >
                  <Edit3 size={16} />
                  Edit Video
                </button>

                {selectedVideo.videoUrl && (
                  <a
                    href={
                      selectedVideo.videoUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Play size={16} />
                    Open Video
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideo(
                      null,
                    );
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
                    void deleteVideo(
                      selectedVideo.id,
                    )
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
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

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
                    setTitle(
                      event.target.value,
                    )
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
                      event.target
                        .value,
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
                    Video Category
                  </label>

                  <div className="relative">
                    <select
                      id="videoCategory"
                      value={videoCategoryId}
                      onChange={(event) =>
                        setVideoCategoryId(
                          event.target
                            .value,
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      <option value="">
                        Select video category
                      </option>

                      {videoCategories.map(
                        (
                          item: CategoryOption,
                        ) => (
                          <option
                            key={item.id}
                            value={
                              item.id
                            }
                          >
                            {
                              item.name
                            }
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
                        setLanguage(
                          event.target
                            .value as LanguageLabel,
                        )
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
                      setDuration(
                        event.target
                          .value,
                      )
                    }
                    placeholder="e.g. 4:12"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Use MM:SS format.
                  </p>
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
                          event.target
                            .value as VideoStatus,
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

              {status ===
                "Scheduled" && (
                <div>
                  <label
                    htmlFor="scheduledAt"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Schedule Date & Time
                  </label>

                  <div className="relative">
                    <CalendarClock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="scheduledAt"
                      type="datetime-local"
                      value={
                        scheduledAt
                      }
                      onChange={(event) =>
                        setScheduledAt(
                          event.target
                            .value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-pink-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="videoUrl"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Video URL
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(event) =>
                    setVideoUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              <MediaImagePicker
                label="Video thumbnail"
                value={thumbnail}
                onChange={setThumbnail}
                disabled={isSaving}
              />

              {currentUser.role === "ADMIN" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Featured Video
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Highlight this video in the public Featured Videos section.
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={featured}
                      aria-label="Featured Video"
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
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void saveVideo()
                }
                disabled={
                  isSaving ||
                  !title.trim()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Video size={16} />
                    {editingVideo
                      ? "Save Changes"
                      : "Add Video"}
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
=============================================================== */

function StatusBadge({
  status,
}: {
  status: VideoStatus;
}) {
  const styles: Record<
    VideoStatus,
    string
  > = {
    Draft:
      "bg-slate-100 text-slate-600",
    Review:
      "bg-amber-50 text-amber-700",
    Scheduled:
      "bg-purple-50 text-purple-700",
    Published:
      "bg-emerald-50 text-emerald-700",
    Archived:
      "bg-slate-100 text-slate-500",
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
