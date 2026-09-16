"use client";

import { useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  File,
  FileText,
  Grid2X2,
  Image as ImageIcon,
  List,
  MoreHorizontal,
  Play,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

type MediaType = "Image" | "Video" | "Document";

type MediaItem = {
  id: number;
  name: string;
  type: MediaType;
  url: string;
  size: string;
  dimensions?: string;
  uploaded: string;
};

const initialMedia: MediaItem[] = [
  {
    id: 1,
    name: "president.jpg",
    type: "Image",
    url: "/images/news/president.jpg",
    size: "245 KB",
    dimensions: "1200 × 800 px",
    uploaded: "Today",
  },
  {
    id: 2,
    name: "port.jpg",
    type: "Image",
    url: "/images/news/port.jpg",
    size: "318 KB",
    dimensions: "1200 × 800 px",
    uploaded: "Today",
  },
  {
    id: 3,
    name: "cricket.jpg",
    type: "Image",
    url: "/images/news/cricket.jpg",
    size: "286 KB",
    dimensions: "1200 × 800 px",
    uploaded: "Yesterday",
  },
  {
    id: 4,
    name: "rain.jpg",
    type: "Image",
    url: "/images/news/rain.jpg",
    size: "221 KB",
    dimensions: "1200 × 800 px",
    uploaded: "Yesterday",
  },
  {
    id: 5,
    name: "technology.jpg",
    type: "Image",
    url: "/images/news/technology.jpg",
    size: "301 KB",
    dimensions: "1200 × 800 px",
    uploaded: "2 days ago",
  },
  {
    id: 6,
    name: "world.jpg",
    type: "Image",
    url: "/images/news/world.jpg",
    size: "276 KB",
    dimensions: "1200 × 800 px",
    uploaded: "2 days ago",
  },
  {
    id: 7,
    name: "phone.jpg",
    type: "Image",
    url: "/images/news/phone.jpg",
    size: "198 KB",
    dimensions: "1200 × 800 px",
    uploaded: "3 days ago",
  },
  {
    id: 8,
    name: "hero.jpg",
    type: "Image",
    url: "/images/home/hero.jpg",
    size: "392 KB",
    dimensions: "1200 × 700 px",
    uploaded: "3 days ago",
  },
  {
    id: 9,
    name: "live-tv.jpg",
    type: "Image",
    url: "/images/home/live-tv.jpg",
    size: "341 KB",
    dimensions: "1200 × 650 px",
    uploaded: "4 days ago",
  },
  {
    id: 10,
    name: "category-promo.jpg",
    type: "Image",
    url: "/images/home/category-promo.jpg",
    size: "264 KB",
    dimensions: "1200 × 800 px",
    uploaded: "4 days ago",
  },
];

const typeFilters = [
  { label: "All Media", value: "All" },
  { label: "Images", value: "Image" },
  { label: "Videos", value: "Video" },
  { label: "Documents", value: "Document" },
] as const;

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    (typeof typeFilters)[number]["value"]
  >("All");

  const [viewMode, setViewMode] = useState<"grid" | "list">(
    "grid"
  );

  const [selectedId, setSelectedId] = useState<number | null>(
    null
  );

  const [showUploadPanel, setShowUploadPanel] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedMedia =
    media.find((item) => item.id === selectedId) ?? null;

  const filteredMedia = useMemo(() => {
    const query = search.trim().toLowerCase();

    return media.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [media, search, typeFilter]);

  const totalImages = media.filter(
    (item) => item.type === "Image"
  ).length;

  const totalVideos = media.filter(
    (item) => item.type === "Video"
  ).length;

  const totalDocuments = media.filter(
    (item) => item.type === "Document"
  ).length;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = Array.from(files).map(
      (file, index) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        return {
          id:
            Math.max(
              0,
              ...media.map((item) => item.id)
            ) +
            index +
            1,
          name: file.name,
          type: isImage
            ? "Image"
            : isVideo
              ? "Video"
              : "Document",
          url: URL.createObjectURL(file),
          size: formatFileSize(file.size),
          uploaded: "Just now",
        };
      }
    );

    setMedia((current) => [...newItems, ...current]);
    setShowUploadPanel(false);
  };

  const deleteMedia = (id: number) => {
    const item = media.find((mediaItem) => mediaItem.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Delete "${item.name}"?`
    );

    if (!confirmed) return;

    setMedia((current) =>
      current.filter((mediaItem) => mediaItem.id !== id)
    );

    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const copyUrl = async (item: MediaItem) => {
    const url = `${window.location.origin}${item.url}`;

    try {
      await navigator.clipboard.writeText(url);
      window.alert("Media URL copied.");
    } catch {
      window.alert("Unable to copy the media URL.");
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            Content Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Media Library
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage images, videos and documents used across TV
            SUPREME.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowUploadPanel(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Upload size={17} />
            Upload Media
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MediaStatCard
          title="Total Media"
          value={String(media.length)}
          note="All uploaded files"
          icon={<File size={20} />}
        />

        <MediaStatCard
          title="Images"
          value={String(totalImages)}
          note="Photos and graphics"
          icon={<ImageIcon size={20} />}
        />

        <MediaStatCard
          title="Videos"
          value={String(totalVideos)}
          note="Video files"
          icon={<Video size={20} />}
        />

        <MediaStatCard
          title="Documents"
          value={String(totalDocuments)}
          note="Other uploaded files"
          icon={<FileText size={20} />}
        />
      </div>

      {/* =========================================================
          STORAGE
      ========================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Storage Usage
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor your media storage.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                2.1 GB used
              </span>

              <span className="text-slate-400">
                10 GB
              </span>
            </div>

            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[21%] rounded-full bg-gradient-to-r from-pink-600 to-purple-600" />
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              21% of available storage used.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          FILTER BAR
      ========================================================== */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                placeholder="Search media..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value as
                        | "All"
                        | "Image"
                        | "Video"
                        | "Document"
                    )
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-pink-400"
                >
                  {typeFilters.map((filter) => (
                    <option
                      key={filter.value}
                      value={filter.value}
                    >
                      {filter.label}
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

              <div className="hidden rounded-xl border border-slate-200 bg-white p-1 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-pink-50 text-pink-600"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <Grid2X2 size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-pink-50 text-pink-600"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Type tabs */}
          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-100">
            {typeFilters.map((filter, index) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setTypeFilter(filter.value)
                }
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  typeFilter === filter.value
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
            MEDIA CONTENT
        ======================================================== */}
        <div className="p-5">
          {filteredMedia.length === 0 ? (
            <EmptyMediaState
              search={search}
              onUpload={() => setShowUploadPanel(true)}
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredMedia.map((item) => (
                <MediaGridItem
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => setSelectedId(item.id)}
                  onDelete={() => deleteMedia(item.id)}
                  onCopy={() => copyUrl(item)}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Media
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Type
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Size
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Dimensions
                    </th>

                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Uploaded
                    </th>

                    <th className="w-[110px] px-4 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredMedia.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedId(item.id)
                          }
                          className="flex items-center gap-3 text-left"
                        >
                          <MediaThumbnail item={item} small />

                          <span>
                            <span className="block text-sm font-semibold text-slate-800">
                              {item.name}
                            </span>

                            <span className="mt-0.5 block text-xs text-slate-400">
                              {item.uploaded}
                            </span>
                          </span>
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <MediaTypeBadge type={item.type} />
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-500">
                        {item.size}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-500">
                        {item.dimensions ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-500">
                        {item.uploaded}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => copyUrl(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-pink-50 hover:text-pink-600"
                            aria-label={`Copy URL for ${item.name}`}
                          >
                            <Copy size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteMedia(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredMedia.length} of{" "}
            {media.length} files
          </span>

          <span>
            Media storage will connect to the CMS later.
          </span>
        </div>
      </section>

      {/* =========================================================
          SELECTED MEDIA PANEL
      ========================================================== */}
      {selectedMedia && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Media Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preview and manage the selected file.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close media details"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Preview */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <MediaPreview item={selectedMedia} />
            </div>

            {/* Details */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  File Name
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {selectedMedia.name}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Type"
                  value={selectedMedia.type}
                />

                <DetailItem
                  label="Size"
                  value={selectedMedia.size}
                />

                <DetailItem
                  label="Dimensions"
                  value={selectedMedia.dimensions ?? "—"}
                />

                <DetailItem
                  label="Uploaded"
                  value={selectedMedia.uploaded}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Media URL
                </p>

                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedMedia.url}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => copyUrl(selectedMedia)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition hover:bg-pink-100"
                    aria-label="Copy media URL"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    window.alert(
                      "This media can later be selected directly from the Article Editor."
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                >
                  <Check size={16} />
                  Use in Article
                </button>

                <a
                  href={selectedMedia.url}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Download size={16} />
                  Download
                </a>

                <button
                  type="button"
                  onClick={() =>
                    deleteMedia(selectedMedia.id)
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
          UPLOAD MODAL
      ========================================================== */}
      {showUploadPanel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  Media Library
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Upload Media
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadPanel(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close upload dialog"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6">
              <div
                className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-pink-300 hover:bg-pink-50/30"
                onClick={openFilePicker}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFiles(event.dataTransfer.files);
                }}
              >
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <Upload
                    size={32}
                    className="text-pink-600"
                  />
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-800">
                  Drag & drop files here
                </h3>

                <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">
                  Or click to select images, videos or documents
                  from your computer.
                </p>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openFilePicker();
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Upload size={16} />
                  Choose Files
                </button>

                <p className="mt-4 text-[11px] text-slate-400">
                  Images · Videos · Documents
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(event) =>
                  handleFiles(event.target.files)
                }
              />

              <div className="mt-5 rounded-xl bg-pink-50 p-4">
                <p className="text-xs font-semibold text-pink-800">
                  CMS note
                </p>

                <p className="mt-1 text-xs leading-5 text-pink-700/80">
                  Uploads are currently stored only in this
                  browser session. We will connect the Media
                  Library to permanent storage later.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowUploadPanel(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===============================================================
   MEDIA GRID ITEM
================================================================ */

function MediaGridItem({
  item,
  selected,
  onSelect,
  onDelete,
  onCopy,
}: {
  item: MediaItem;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border bg-white transition ${
        selected
          ? "border-pink-500 ring-2 ring-pink-100"
          : "border-slate-200 hover:border-pink-200 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <MediaThumbnail item={item} />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-8">
            <p className="truncate text-xs font-semibold text-white">
              {item.name}
            </p>
          </div>

          {item.type === "Video" && (
            <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
              <Play size={13} fill="currentColor" />
            </span>
          )}
        </div>
      </button>

      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <div className="min-w-0">
          <MediaTypeBadge type={item.type} />

          <p className="mt-1 text-[11px] text-slate-400">
            {item.size}
            {item.dimensions
              ? ` · ${item.dimensions}`
              : ""}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onCopy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-pink-50 hover:text-pink-600"
            aria-label={`Copy URL for ${item.name}`}
          >
            <Copy size={14} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={14} />
          </button>

          <button
            type="button"
            onClick={onSelect}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label={`More details for ${item.name}`}
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   THUMBNAIL
================================================================ */

function MediaThumbnail({
  item,
  small = false,
}: {
  item: MediaItem;
  small?: boolean;
}) {
  if (item.type === "Image") {
    return (
      <img
        src={item.url}
        alt={item.name}
        className={`h-full w-full object-cover ${
          small ? "h-12 w-16 rounded-lg" : ""
        }`}
      />
    );
  }

  if (item.type === "Video") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white">
        <Video size={small ? 18 : 30} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
      <FileText size={small ? 18 : 30} />
    </div>
  );
}

/* ===============================================================
   PREVIEW
================================================================ */

function MediaPreview({ item }: { item: MediaItem }) {
  if (item.type === "Image") {
    return (
      <img
        src={item.url}
        alt={item.name}
        className="h-full min-h-[260px] w-full object-cover"
      />
    );
  }

  if (item.type === "Video") {
    return (
      <div className="flex min-h-[260px] items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Play size={25} fill="currentColor" />
          </div>

          <p className="mt-3 text-sm font-semibold">
            Video Preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[260px] items-center justify-center bg-slate-50 text-slate-400">
      <div className="text-center">
        <FileText size={45} className="mx-auto" />

        <p className="mt-3 text-sm font-semibold text-slate-600">
          Document
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   TYPE BADGE
================================================================ */

function MediaTypeBadge({
  type,
}: {
  type: MediaType;
}) {
  const classes =
    type === "Image"
      ? "bg-pink-50 text-pink-700"
      : type === "Video"
        ? "bg-purple-50 text-purple-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${classes}`}
    >
      {type}
    </span>
  );
}

/* ===============================================================
   EMPTY STATE
================================================================ */

function EmptyMediaState({
  search,
  onUpload,
}: {
  search: string;
  onUpload: () => void;
}) {
  return (
    <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
      <div className="rounded-2xl bg-slate-50 p-5">
        <ImageIcon
          size={40}
          className="text-slate-300"
        />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-700">
        {search
          ? "No media found"
          : "Your media library is empty"}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        {search
          ? "Try a different search term or filter."
          : "Upload your first image, video or document to start building your media library."}
      </p>

      {!search && (
        <button
          type="button"
          onClick={onUpload}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
        >
          <Upload size={16} />
          Upload First File
        </button>
      )}
    </div>
  );
}

/* ===============================================================
   STAT CARD
================================================================ */

function MediaStatCard({
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
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   HELPERS
================================================================ */

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}