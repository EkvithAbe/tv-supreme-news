"use client";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Check,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";

export type SelectedImage = {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
};

type ImageApiItem = SelectedImage & {
  type: "IMAGE";
};

type Props = {
  label: string;
  value: SelectedImage | null;
  onChange: (image: SelectedImage | null) => void;
  disabled?: boolean;
};

const ACCEPTED_IMAGE_TYPES =
  "image/jpeg,image/png,image/webp,image/gif";

function getImageError(
  error: unknown,
) {
  return error instanceof Error
    ? error.message
    : "Unable to load images.";
}

/**
 * Shared image picker for article main images and video thumbnails.
 * Editors see and upload only image media through the API permissions.
 */
export default function MediaImagePicker({
  label,
  value,
  onChange,
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<
    SelectedImage[]
  >([]);
  const [isLoading, setIsLoading] =
    useState(false);
  const [isUploading, setIsUploading] =
    useState(false);
  const [error, setError] = useState("");
  const [altText, setAltText] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);
  const dialogRef =
    useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (isUploading) {
      return;
    }

    setIsOpen(false);
  }, [isUploading]);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/media?type=IMAGE&page=1&pageSize=100",
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to load images.",
        );
      }

      const nextImages = Array.isArray(
        data.items,
      )
        ? (data.items as ImageApiItem[]).map(
            (item) => ({
              id: item.id,
              filename: item.filename,
              url: item.url,
              altText: item.altText ?? null,
            }),
          )
        : [];

      setImages(nextImages);
    } catch (loadError) {
      setError(getImageError(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Defer the request until after the dialog has mounted. This avoids a
    // synchronous state update during the effect and keeps the dialog
    // responsive while its image list loads.
    const loadTimer = window.setTimeout(() => {
      void loadImages();
    }, 0);

    const previousFocus = document.activeElement;

    window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () => {
      window.clearTimeout(loadTimer);

      document.removeEventListener(
        "keydown",
        onKeyDown,
      );

      if (
        previousFocus instanceof HTMLElement
      ) {
        previousFocus.focus();
      }
    };
  }, [close, isOpen, loadImages]);

  const uploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (
      !ACCEPTED_IMAGE_TYPES.split(",").includes(
        file.type,
      )
    ) {
      setError(
        "Choose a JPEG, PNG, WebP or GIF image.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Images must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("altText", altText.trim());

      const response = await fetch(
        "/api/admin/media",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to upload the image.",
        );
      }

      const uploaded: SelectedImage = {
        id: data.media.id,
        filename: data.media.filename,
        url: data.media.url,
        altText: data.media.altText ?? null,
      };

      setImages((current) => [
        uploaded,
        ...current.filter(
          (image) => image.id !== uploaded.id,
        ),
      ]);
      onChange(uploaded);
      setAltText("");
      setIsOpen(false);
    } catch (uploadError) {
      setError(getImageError(uploadError));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {label}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Choose an existing image or upload a new one.
          </p>
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <img
            src={value.url}
            alt={value.altText || value.filename}
            className="aspect-video w-full object-cover"
          />
          <p className="truncate px-3 py-2 text-xs font-medium text-slate-600">
            {value.filename}
          </p>
        </div>
      ) : (
        <div className="mt-3 flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
          <ImageIcon size={28} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-pink-300 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ImageIcon size={16} />
        {value ? "Change image" : "Choose or upload image"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close();
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-image-picker-title"
            tabIndex={-1}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl outline-none sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="media-image-picker-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Select image
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Image files are available to articles and video thumbnails.
                </p>
              </div>

              <button
                type="button"
                onClick={close}
                disabled={isUploading}
                aria-label="Close image picker"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-pink-200 bg-pink-50/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="image-alt-text"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                  >
                    Image description (optional)
                  </label>
                  <input
                    id="image-alt-text"
                    value={altText}
                    onChange={(event) =>
                      setAltText(event.target.value)
                    }
                    disabled={isUploading}
                    placeholder="Describe the image"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed"
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={uploadImage}
                  disabled={isUploading}
                  className="sr-only"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={isUploading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isUploading ? "Uploading..." : "Upload image"}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                JPEG, PNG, WebP or GIF, up to 10 MB.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="mt-5">
              {isLoading ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
                  <Loader2
                    size={20}
                    className="mr-2 animate-spin"
                  />
                  Loading images...
                </div>
              ) : images.length > 0 ? (
                <div className="grid max-h-[45vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image) => {
                    const selected = value?.id === image.id;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => {
                          onChange(image);
                          setIsOpen(false);
                        }}
                        className={`group relative overflow-hidden rounded-xl border-2 bg-slate-100 text-left transition focus:outline-none focus:ring-4 focus:ring-pink-100 ${
                          selected
                            ? "border-pink-600"
                            : "border-transparent hover:border-pink-300"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={
                            image.altText ||
                            image.filename
                          }
                          className="aspect-video w-full object-cover"
                        />
                        <span className="block truncate bg-white px-2.5 py-2 text-xs font-medium text-slate-600">
                          {image.filename}
                        </span>
                        {selected && (
                          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-white shadow">
                            <Check size={15} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                  <ImageIcon
                    size={28}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    No images yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Upload the first image above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
