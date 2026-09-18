"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Languages,
  Plus,
  Save,
  Send,
  Settings2,
  Tag,
  Video,
  X,
  Zap,
} from "lucide-react";

type Language = "EN" | "SI" | "TA";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type AuthorOption = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type MediaOption = {
  id: string;
  filename: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  altText: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
};

type TranslationState = {
  title: string;
  summary: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};

type TranslationsState = Record<
  Language,
  TranslationState
>;

type ArticleStatus =
  | "DRAFT"
  | "REVIEW"
  | "SCHEDULED"
  | "PUBLISHED";

type Props = {
  initialCategories: CategoryOption[];
  initialAuthors: AuthorOption[];
};

const languageLabels: Record<
  Language,
  string
> = {
  EN: "English",
  SI: "සිංහල",
  TA: "தமிழ்",
};

const emptyTranslation: TranslationState = {
  title: "",
  summary: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
};

const emptyTranslations: TranslationsState = {
  EN: { ...emptyTranslation },
  SI: { ...emptyTranslation },
  TA: { ...emptyTranslation },
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatFileSize(bytes: number | null | undefined) {
  if (!bytes || bytes <= 0) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function NewArticleClient({
  initialCategories,
  initialAuthors,
}: Props) {
  const [activeLanguage, setActiveLanguage] =
    useState<Language>("EN");

  const [translations, setTranslations] =
    useState<TranslationsState>(
      emptyTranslations,
    );

  const [slug, setSlug] =
    useState("");

  /*
   * IMPORTANT:
   * Do not automatically choose the first category.
   *
   * The editor must explicitly select a category
   * from the categories stored in PostgreSQL.
   */
  const [categoryId, setCategoryId] =
    useState("");

  /*
   * Do not automatically choose an author.
   * The editor must explicitly select one.
   */
  const [authorId, setAuthorId] =
    useState("");

  const [tags, setTags] =
    useState<string[]>([]);

  const [tagInput, setTagInput] =
    useState("");

  const [breakingNews, setBreakingNews] =
    useState(false);

  const [featured, setFeatured] =
    useState(false);

  const [showOnHomepage, setShowOnHomepage] =
    useState(false);

  const [showInLatest, setShowInLatest] =
    useState(true);

  const [publishDate, setPublishDate] =
    useState("");

  const [publishTime, setPublishTime] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
   * ============================================================
   * MAIN IMAGE / MEDIA LIBRARY
   * ============================================================
   */
  const [mainImageId, setMainImageId] =
    useState<string | null>(null);

  const [mediaOptions, setMediaOptions] =
    useState<MediaOption[]>([]);

  const [loadingMedia, setLoadingMedia] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [selectedMediaIds, setSelectedMediaIds] =
    useState<string[]>([]);

  const [uploadingArticleMedia, setUploadingArticleMedia] =
    useState(false);

  const imageInputRef =
    useRef<HTMLInputElement | null>(null);

  const articleMediaInputRef =
    useRef<HTMLInputElement | null>(null);

  /*
   * Load existing images and videos from the Media Library.
   *
   * Main Image uses only IMAGE records.
   * Article Media can use both IMAGE and VIDEO records.
   */
  useEffect(() => {
    let cancelled = false;

    const loadMedia = async () => {
      setLoadingMedia(true);

      try {
        const response = await fetch(
          "/api/admin/media?page=1&pageSize=100",
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              data.message ||
              "Unable to load media from the Media Library.",
          );
        }

        const rawItems = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.media)
            ? data.media
            : [];

        const mappedMedia: MediaOption[] =
          rawItems
            .map(
              (item: {
                id?: string;
                filename?: string;
                name?: string;
                url?: string;
                type?: string;
                altText?: string | null;
                size?: number | null;
                bytes?: number | null;
                width?: number | null;
                height?: number | null;
              }) => {
                const mediaType =
                  String(
                    item.type ?? "",
                  ).toUpperCase();

                const type =
                  mediaType === "VIDEO"
                    ? "VIDEO"
                    : mediaType === "IMAGE"
                      ? "IMAGE"
                      : null;

                if (!type) {
                  return null;
                }

                return {
                  id: String(item.id ?? ""),
                  filename:
                    item.filename ??
                    item.name ??
                    "Untitled media",
                  url: item.url ?? "",
                  type,
                  altText:
                    item.altText ?? null,
                  size:
                    item.size ??
                    item.bytes ??
                    null,
                  width:
                    item.width ?? null,
                  height:
                    item.height ?? null,
                };
              },
            )
            .filter(
              (
                item: MediaOption,
              ): item is MediaOption =>
                Boolean(item?.id) &&
                Boolean(item?.url),
            );

        if (!cancelled) {
          setMediaOptions(mappedMedia);
        }
      } catch (mediaError) {
        if (!cancelled) {
          setError(
            mediaError instanceof Error
              ? mediaError.message
              : "Unable to load media.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingMedia(false);
        }
      }
    };

    void loadMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  const imageMediaOptions =
    mediaOptions.filter(
      (media) => media.type === "IMAGE",
    );

  const articleMediaOptions =
    mediaOptions.filter(
      (media) =>
        media.type === "IMAGE" ||
        media.type === "VIDEO",
    );

  const selectedMainImage =
    imageMediaOptions.find(
      (media) => media.id === mainImageId,
    ) ?? null;

  const selectedArticleMedia =
    selectedMediaIds
      .map(
        (id) =>
          mediaOptions.find(
            (media) => media.id === id,
          ) ?? null,
      )
      .filter(
        (media): media is MediaOption =>
          media !== null,
      );

  const toggleArticleMedia = (
    mediaId: string,
  ) => {
    setSelectedMediaIds((current) =>
      current.includes(mediaId)
        ? current.filter(
            (id) => id !== mediaId,
          )
        : [
            ...current,
            mediaId,
          ],
    );
  };

  const updateTranslation = (
    language: Language,
    field: keyof TranslationState,
    value: string,
  ) => {
    setTranslations((current) => ({
      ...current,
      [language]: {
        ...current[language],
        [field]: value,
      },
    }));

    /*
     * Generate the article slug from the
     * English headline only when a slug
     * has not already been entered.
     */
    if (
      language === "EN" &&
      field === "title"
    ) {
      setSlug((currentSlug) => {
        if (currentSlug.trim()) {
          return currentSlug;
        }

        return generateSlug(value);
      });
    }
  };

  const addTag = () => {
    const value =
      tagInput.trim();

    if (!value) {
      return;
    }

    const exists = tags.some(
      (tag) =>
        tag.toLowerCase() ===
        value.toLowerCase(),
    );

    if (!exists) {
      setTags((current) => [
        ...current,
        value,
      ]);
    }

    setTagInput("");
  };

  const removeTag = (
    tagToRemove: string,
  ) => {
    setTags((current) =>
      current.filter(
        (tag) =>
          tag !== tagToRemove,
      ),
    );
  };

  const handleTagKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addTag();
    }
  };

  /*
   * ============================================================
   * MAIN IMAGE / ARTICLE MEDIA UPLOAD
   * ============================================================
   */

  const uploadMediaFile = async (
    file: File,
    purpose: "MAIN_IMAGE" | "ARTICLE_MEDIA",
  ) => {
    if (!file) {
      return;
    }

    const isImage =
      file.type.startsWith("image/");

    const isVideo =
      file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError(
        "Please select an image or video file.",
      );
      return;
    }

    if (file.size <= 0) {
      setError(
        "The selected media file is empty.",
      );
      return;
    }

    if (
      purpose === "MAIN_IMAGE" &&
      !isImage
    ) {
      setError(
        "The Main Image must be an image file.",
      );
      return;
    }

    if (purpose === "MAIN_IMAGE") {
      setUploadingImage(true);
    } else {
      setUploadingArticleMedia(true);
    }

    setError("");
    setSavedMessage("");

    try {
      const formData = new FormData();

      formData.append(
        "file",
        file,
      );

      const response = await fetch(
        "/api/admin/media",
        {
          method: "POST",
          body: formData,
        },
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to upload the media file.",
        );
      }

      const uploadedMedia =
        data.media;

      if (
        !uploadedMedia ||
        !uploadedMedia.id ||
        !uploadedMedia.url
      ) {
        throw new Error(
          "The uploaded media response is invalid.",
        );
      }

      const uploadedType =
        String(
          uploadedMedia.type ??
            "",
        ).toUpperCase();

      const newMediaType: "IMAGE" | "VIDEO" =
        uploadedType === "VIDEO"
          ? "VIDEO"
          : "IMAGE";

      const newMedia: MediaOption = {
        id: String(
          uploadedMedia.id,
        ),
        filename:
          uploadedMedia.filename ??
          file.name,
        url:
          uploadedMedia.url,
        type:
          newMediaType,
        altText:
          uploadedMedia.altText ??
          null,
        size:
          uploadedMedia.size ??
          file.size,
        width:
          uploadedMedia.width ??
          null,
        height:
          uploadedMedia.height ??
          null,
      };

      setMediaOptions(
        (current) => [
          newMedia,
          ...current.filter(
            (media) =>
              media.id !==
              newMedia.id,
          ),
        ],
      );

      if (
        purpose === "MAIN_IMAGE"
      ) {
        setMainImageId(
          newMedia.id,
        );

        setSavedMessage(
          "Image uploaded and selected as the main image.",
        );
      } else {
        setSelectedMediaIds(
          (current) =>
            current.includes(
              newMedia.id,
            )
              ? current
              : [
                  ...current,
                  newMedia.id,
                ],
        );

        /*
         * If an article media upload is an image and
         * no Main Image is selected yet, select it as
         * the Main Image as a convenience.
         */
        if (
          newMediaType === "IMAGE" &&
          !mainImageId
        ) {
          setMainImageId(
            newMedia.id,
          );
        }

        setSavedMessage(
          "Media uploaded and added to the article.",
        );
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the media file.",
      );
    } finally {
      if (
        purpose === "MAIN_IMAGE"
      ) {
        setUploadingImage(false);
      } else {
        setUploadingArticleMedia(false);
      }
    }
  };

  const handleMainImageFileChange =
    async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      event.target.value = "";

      if (!file) {
        return;
      }

      await uploadMediaFile(
        file,
        "MAIN_IMAGE",
      );
    };

  const handleArticleMediaFileChange =
    async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const files = Array.from(
        event.target.files ?? [],
      );

      event.target.value = "";

      if (files.length === 0) {
        return;
      }

      setUploadingArticleMedia(true);
      setError("");
      setSavedMessage("");

      try {
        for (const file of files) {
          const isImage =
            file.type.startsWith("image/");
          const isVideo =
            file.type.startsWith("video/");

          if (!isImage && !isVideo) {
            continue;
          }

          if (file.size <= 0) {
            continue;
          }

          const formData =
            new FormData();

          formData.append(
            "file",
            file,
          );

          const response =
            await fetch(
              "/api/admin/media",
              {
                method: "POST",
                body: formData,
              },
            );

          const data =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.error ||
                data.message ||
                `Unable to upload ${file.name}.`,
            );
          }

          const uploadedMedia =
            data.media;

          if (
            !uploadedMedia?.id ||
            !uploadedMedia?.url
          ) {
            throw new Error(
              `Invalid upload response for ${file.name}.`,
            );
          }

          const uploadedType =
            String(
              uploadedMedia.type ??
                "",
            ).toUpperCase();

          const newMediaType: "IMAGE" | "VIDEO" =
            uploadedType ===
            "VIDEO"
              ? "VIDEO"
              : "IMAGE";

          const newMedia: MediaOption = {
            id: String(
              uploadedMedia.id,
            ),
            filename:
              uploadedMedia.filename ??
              file.name,
            url:
              uploadedMedia.url,
            type:
              newMediaType,
            altText:
              uploadedMedia.altText ??
              null,
            size:
              uploadedMedia.size ??
              file.size,
            width:
              uploadedMedia.width ??
              null,
            height:
              uploadedMedia.height ??
              null,
          };

          setMediaOptions(
            (current) => [
              newMedia,
              ...current.filter(
                (media) =>
                  media.id !==
                  newMedia.id,
              ),
            ],
          );

          setSelectedMediaIds(
            (current) =>
              current.includes(
                newMedia.id,
              )
                ? current
                : [
                    ...current,
                    newMedia.id,
                  ],
          );

          if (
            newMediaType === "IMAGE" &&
            !mainImageId
          ) {
            setMainImageId(
              newMedia.id,
            );
          }
        }

        setSavedMessage(
          "Selected media uploaded and added to the article.",
        );
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Unable to upload article media.",
        );
      } finally {
        setUploadingArticleMedia(
          false,
        );
      }
    };

  const getPublishDateValue = () => {
    if (
      !publishDate ||
      !publishTime
    ) {
      return undefined;
    }

    const value = new Date(
      `${publishDate}T${publishTime}`,
    );

    if (
      Number.isNaN(
        value.getTime(),
      )
    ) {
      return undefined;
    }

    return value.toISOString();
  };

  const buildTranslationPayload = () => {
    return (
      Object.entries(
        translations,
      ) as [
        Language,
        TranslationState,
      ][]
    )
      .filter(
        ([, translation]) =>
          translation.title.trim() ||
          translation.content.trim(),
      )
      .map(
        ([
          language,
          translation,
        ]) => ({
          language,
          title:
            translation.title.trim(),
          summary:
            translation.summary.trim() ||
            undefined,
          content:
            translation.content.trim(),
          seoTitle:
            translation.seoTitle.trim() ||
            undefined,
          seoDescription:
            translation.seoDescription.trim() ||
            undefined,
        }),
      );
  };

  const saveArticle = async (
    status: ArticleStatus,
  ) => {
    setError("");
    setSavedMessage("");

    const english =
      translations.EN;

    /*
     * Required English fields
     */
    if (!english.title.trim()) {
      setError(
        "English headline is required.",
      );
      setActiveLanguage("EN");
      return;
    }

    if (!english.content.trim()) {
      setError(
        "English article content is required.",
      );
      setActiveLanguage("EN");
      return;
    }

    /*
     * Category is required.
     */
    if (!categoryId) {
      setError(
        "Please select a category from the database.",
      );
      return;
    }

    /*
     * Author is required.
     */
    if (!authorId) {
      setError(
        "Please select an author.",
      );
      return;
    }

    /*
     * Scheduled articles need a date
     * and time.
     */
    if (
      status === "SCHEDULED" &&
      !getPublishDateValue()
    ) {
      setError(
        "Please select a publish date and time.",
      );
      return;
    }

    /*
     * Need a valid slug.
     */
    const finalSlug =
      generateSlug(slug);

    if (!finalSlug) {
      setError(
        "Article slug is required.",
      );
      return;
    }

    /*
     * Make sure the selected category
     * actually exists in the data received
     * from PostgreSQL.
     */
    const selectedCategory =
      initialCategories.find(
        (category) =>
          category.id ===
          categoryId,
      );

    if (!selectedCategory) {
      setError(
        "The selected category is no longer available. Please refresh the page and choose a valid category.",
      );
      return;
    }

    /*
     * Make sure the selected author
     * still exists in the loaded author list.
     */
    const selectedAuthor =
      initialAuthors.find(
        (author) =>
          author.id ===
          authorId,
      );

    if (!selectedAuthor) {
      setError(
        "The selected author is no longer available. Please refresh the page and select an author again.",
      );
      return;
    }

    /*
     * If a main image was selected, make sure
     * it still exists in the loaded Media Library.
     */
    if (
      mainImageId &&
      !selectedMainImage
    ) {
      setError(
        "The selected main image is no longer available. Please choose another image.",
      );
      return;
    }

    const invalidMediaIds =
      selectedMediaIds.filter(
        (mediaId) =>
          !mediaOptions.some(
            (media) =>
              media.id === mediaId,
          ),
      );

    if (invalidMediaIds.length > 0) {
      setError(
        "One or more selected article media items are no longer available. Please refresh and choose them again.",
      );
      return;
    }

    const translationPayload =
      buildTranslationPayload();

    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/articles",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            slug: finalSlug,

            categoryId,

            authorId,

            status,

            isBreaking:
              breakingNews,

            isFeatured:
              featured,

            showOnHomepage:
              showOnHomepage,

            showInLatest:
              showInLatest,

            /*
             * IMPORTANT:
             * Save the selected Media Library ID
             * into Article.mainImageId.
             */
            mainImageId:
              mainImageId ??
              undefined,

            publishedAt:
              status === "PUBLISHED"
                ? getPublishDateValue()
                : undefined,

            scheduledAt:
              status === "SCHEDULED"
                ? getPublishDateValue()
                : undefined,

            translations:
              translationPayload,

            tags,

            mediaIds:
              selectedMediaIds,
          }),
        },
      );

      /*
       * The API should normally return JSON.
       */
      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save article.",
        );
      }

      if (
        status === "DRAFT"
      ) {
        setSavedMessage(
          "Article saved as draft.",
        );
      } else if (
        status === "REVIEW"
      ) {
        setSavedMessage(
          "Article submitted for review.",
        );
      } else if (
        status === "SCHEDULED"
      ) {
        setSavedMessage(
          "Article scheduled successfully.",
        );
      } else {
        setSavedMessage(
          "Article published successfully.",
        );
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save article.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await saveArticle("REVIEW");
  };

  const currentTranslation =
    translations[activeLanguage];

  return (
    <div className="w-full space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Link
            href="/admin/news"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-pink-300 hover:text-pink-600"
            aria-label="Back to Articles"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="min-w-0">
            <p className="text-sm font-medium text-pink-600">
              News Management
            </p>

            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              New Article
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new TV SUPREME news
              article.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              saveArticle("DRAFT")
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <Save size={17} />
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              saveArticle("PUBLISHED")
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <Send size={17} />
            Publish Now
          </button>
        </div>
      </div>

      {/* =========================================================
          SUCCESS MESSAGE
      ========================================================== */}
      {savedMessage && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex min-w-0 items-center gap-2">
            <Check
              size={16}
              className="shrink-0"
            />

            <span>
              {savedMessage}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setSavedMessage("")
            }
            aria-label="Close message"
            className="shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =========================================================
          ERROR MESSAGE
      ========================================================== */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-6"
      >
        {/*
         * IMPORTANT RESPONSIVE CHANGE:
         *
         * Under lg:
         * Main content
         * then sidebar
         *
         * lg and above:
         * Main content | Sidebar
         */}
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}
          <div className="min-w-0 space-y-6">
            {/* LANGUAGE */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-pink-50 p-3 text-pink-600">
                    <Languages
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Article Language
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Write one article with
                      English, Sinhala and Tamil
                      translations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
                {(
                  [
                    "EN",
                    "SI",
                    "TA",
                  ] as Language[]
                ).map(
                  (language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() =>
                        setActiveLanguage(
                          language,
                        )
                      }
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                        activeLanguage ===
                        language
                          ? "border-pink-600 bg-pink-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-pink-300 hover:text-pink-600"
                      }`}
                    >
                      {
                        languageLabels[
                          language
                        ]
                      }
                    </button>
                  ),
                )}
              </div>
            </section>

            {/* ARTICLE DETAILS */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Article Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Write the content for the
                  selected language.
                </p>
              </div>

              <div className="space-y-6 p-4 sm:p-6">
                {/* HEADLINE */}
                <div>
                  <label
                    htmlFor="headline"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Headline
                    {activeLanguage ===
                      "EN" && (
                      <span className="ml-1 text-pink-600">
                        *
                      </span>
                    )}
                  </label>

                  <input
                    id="headline"
                    type="text"
                    value={
                      currentTranslation.title
                    }
                    onChange={(
                      event,
                    ) =>
                      updateTranslation(
                        activeLanguage,
                        "title",
                        event.target
                          .value,
                      )
                    }
                    maxLength={160}
                    placeholder="Enter the article headline..."
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />

                  <div className="mt-2 flex items-start justify-between gap-3 text-xs text-slate-400">
                    <span>
                      Write a clear and engaging
                      headline.
                    </span>

                    <span className="shrink-0">
                      {
                        currentTranslation
                          .title.length
                      }
                      /160
                    </span>
                  </div>
                </div>

                {/* SUMMARY */}
                <div>
                  <label
                    htmlFor="summary"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Summary
                  </label>

                  <textarea
                    id="summary"
                    value={
                      currentTranslation.summary
                    }
                    onChange={(
                      event,
                    ) =>
                      updateTranslation(
                        activeLanguage,
                        "summary",
                        event.target
                          .value,
                      )
                    }
                    rows={4}
                    placeholder="Write a short summary of the story..."
                    className="w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>

                {/* CONTENT */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="content"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Article Content
                      {activeLanguage ===
                        "EN" && (
                        <span className="ml-1 text-pink-600">
                          *
                        </span>
                      )}
                    </label>

                    <span className="shrink-0 text-xs text-slate-400">
                      {
                        languageLabels[
                          activeLanguage
                        ]
                      }
                    </span>
                  </div>

                  <textarea
                    id="content"
                    value={
                      currentTranslation.content
                    }
                    onChange={(
                      event,
                    ) =>
                      updateTranslation(
                        activeLanguage,
                        "content",
                        event.target
                          .value,
                      )
                    }
                    rows={18}
                    placeholder="Write your article here..."
                    className="w-full min-w-0 resize-y rounded-xl border border-slate-200 px-4 py-4 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 sm:px-5"
                  />
                </div>
              </div>
            </section>

            {/* SEO */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-slate-100 p-3 text-slate-600">
                    <Settings2
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      SEO & Social
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      SEO values are stored for
                      each language.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-4 sm:p-6">
                <div>
                  <label
                    htmlFor="seoTitle"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    SEO Title
                  </label>

                  <input
                    id="seoTitle"
                    type="text"
                    value={
                      currentTranslation.seoTitle
                    }
                    onChange={(
                      event,
                    ) =>
                      updateTranslation(
                        activeLanguage,
                        "seoTitle",
                        event.target
                          .value,
                      )
                    }
                    placeholder="SEO title..."
                    className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="seoDescription"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    SEO Description
                  </label>

                  <textarea
                    id="seoDescription"
                    value={
                      currentTranslation.seoDescription
                    }
                    onChange={(
                      event,
                    ) =>
                      updateTranslation(
                        activeLanguage,
                        "seoDescription",
                        event.target
                          .value,
                      )
                    }
                    rows={4}
                    placeholder="Write a search-engine description..."
                    className="w-full min-w-0 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* =====================================================
              SIDEBAR
          ====================================================== */}
          <div className="min-w-0 space-y-6">
            {/* PUBLISHING */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Publishing
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Control publication timing.
                </p>
              </div>

              <div className="space-y-5 p-5">
                {/* AUTHOR */}
                <div>
                  <label
                    htmlFor="author"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Author
                  </label>

                  <div className="relative">
                    <select
                      id="author"
                      value={authorId}
                      onChange={(
                        event,
                      ) =>
                        setAuthorId(
                          event.target
                            .value,
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                    >
                      <option value="">
                        Select author
                      </option>

                      {initialAuthors.map(
                        (author) => (
                          <option
                            key={
                              author.id
                            }
                            value={
                              author.id
                            }
                          >
                            {author.name} —{" "}
                            {author.role}
                          </option>
                        ),
                      )}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {initialAuthors.length ===
                    0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      No CMS authors are available.
                      Create an Admin, Editor or
                      Journalist user first.
                    </p>
                  )}
                </div>

                {/* PUBLISH DATE */}
                <div>
                  <label
                    htmlFor="publishDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Publish Date
                  </label>

                  <input
                    id="publishDate"
                    type="date"
                    value={
                      publishDate
                    }
                    onChange={(
                      event,
                    ) =>
                      setPublishDate(
                        event.target
                          .value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-pink-400"
                  />
                </div>

                {/* PUBLISH TIME */}
                <div>
                  <label
                    htmlFor="publishTime"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Publish Time
                  </label>

                  <input
                    id="publishTime"
                    type="time"
                    value={
                      publishTime
                    }
                    onChange={(
                      event,
                    ) =>
                      setPublishTime(
                        event.target
                          .value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-pink-400"
                  />
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    saveArticle(
                      "SCHEDULED",
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CalendarClock
                    size={17}
                  />
                  Schedule Article
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    saveArticle(
                      "PUBLISHED",
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={17} />
                  Publish Now
                </button>
              </div>
            </section>

            {/* CATEGORY */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Category
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Choose a category from
                  PostgreSQL.
                </p>
              </div>

              <div className="p-5">
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <div className="relative">
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(
                      event,
                    ) =>
                      setCategoryId(
                        event.target
                          .value,
                      )
                    }
                    disabled={
                      initialCategories.length ===
                      0
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      Select category
                    </option>

                    {initialCategories.map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {category.name}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {initialCategories.length ===
                  0 && (
                  <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-700">
                    No categories are currently
                    available. Create a category
                    in Admin → Categories first.
                  </div>
                )}
              </div>
            </section>

            {/* URL */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  URL
                </h2>
              </div>

              <div className="p-5">
                <label
                  htmlFor="articleSlug"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Article Slug
                </label>

                <input
                  id="articleSlug"
                  type="text"
                  value={slug}
                  onChange={(
                    event,
                  ) =>
                    setSlug(
                      generateSlug(
                        event.target
                          .value,
                      ),
                    )
                  }
                  placeholder="article-slug"
                  className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-pink-400"
                />

                <p className="mt-2 break-all text-xs leading-5 text-slate-400">
                  Public URL:
                  {" /en/news/"}
                  {slug ||
                    "article-slug"}
                </p>
              </div>
            </section>

            {/* TAGS */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Tags
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Add keywords for organization
                  and search.
                </p>
              </div>

              <div className="p-5">
                <div className="flex min-w-0 gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(
                      event,
                    ) =>
                      setTagInput(
                        event.target
                          .value,
                      )
                    }
                    onKeyDown={
                      handleTagKeyDown
                    }
                    placeholder="Add a tag..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-pink-400"
                  />

                  <button
                    type="button"
                    onClick={
                      addTag
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition hover:bg-pink-100"
                    aria-label="Add tag"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700"
                        >
                          <span className="max-w-[180px] truncate">
                            {tag}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeTag(
                                tag,
                              )
                            }
                            className="shrink-0 text-pink-400 transition hover:text-pink-700"
                            aria-label={`Remove ${tag}`}
                          >
                            <X
                              size={13}
                            />
                          </button>
                        </span>
                      ),
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* MAIN IMAGE */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-purple-50 p-3 text-purple-600">
                    <ImageIcon
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Main Image
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Choose the primary image that
                      represents this article.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <input
                  ref={
                    imageInputRef
                  }
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleMainImageFileChange
                  }
                />

                {selectedMainImage ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={
                          selectedMainImage.url
                        }
                        alt={
                          selectedMainImage.altText ||
                          selectedMainImage.filename
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-3 p-4">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {
                          selectedMainImage.filename
                        }
                      </p>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={
                            uploadingImage ||
                            uploadingArticleMedia
                          }
                          onClick={() =>
                            imageInputRef.current?.click()
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-pink-300 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ImageIcon
                            size={16}
                          />
                          Change Image
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setMainImageId(
                              null,
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <X size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <ImageIcon
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No main image selected
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Select an image from the Media Library
                      or upload a new one.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    uploadingImage ||
                    uploadingArticleMedia
                  }
                  onClick={() =>
                    imageInputRef.current?.click()
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-pink-300 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={17} />
                  {uploadingImage
                    ? "Uploading..."
                    : "Upload New Image"}
                </button>

                <div>
                  <label
                    htmlFor="mainImage"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Media Library
                  </label>

                  <div className="relative">
                    <select
                      id="mainImage"
                      value={
                        mainImageId ?? ""
                      }
                      onChange={(
                        event,
                      ) =>
                        setMainImageId(
                          event.target
                            .value ||
                            null,
                        )
                      }
                      disabled={
                        loadingMedia ||
                        uploadingImage ||
                        uploadingArticleMedia
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">
                        {loadingMedia
                          ? "Loading images..."
                          : "Choose an image"}
                      </option>

                      {imageMediaOptions.map(
                        (media) => (
                          <option
                            key={
                              media.id
                            }
                            value={
                              media.id
                            }
                          >
                            {
                              media.filename
                            }
                          </option>
                        ),
                      )}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {!loadingMedia &&
                    imageMediaOptions.length ===
                      0 && (
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        No images are currently
                        available in the Media Library.
                      </p>
                    )}
                </div>
              </div>
            </section>

            {/* ARTICLE MEDIA */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-pink-50 p-3 text-pink-600">
                    <Video
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Article Media
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Add multiple images and videos
                      to this article.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <input
                  ref={
                    articleMediaInputRef
                  }
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={
                    handleArticleMediaFileChange
                  }
                />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={
                      uploadingArticleMedia
                    }
                    onClick={() =>
                      articleMediaInputRef.current?.click()
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={17} />
                    {uploadingArticleMedia
                      ? "Uploading..."
                      : "Upload Images / Videos"}
                  </button>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Media Library
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Select one or more images or videos.
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                      {
                        selectedMediaIds.length
                      }{" "}
                      selected
                    </span>
                  </div>

                  {loadingMedia ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
                      Loading media...
                    </div>
                  ) : articleMediaOptions.length ===
                    0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                      <ImageIcon
                        size={28}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        No images or videos available
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Upload media to the Media Library
                        to add it to this article.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {articleMediaOptions.map(
                        (media) => {
                          const isSelected =
                            selectedMediaIds.includes(
                              media.id,
                            );

                          return (
                            <button
                              key={
                                media.id
                              }
                              type="button"
                              onClick={() =>
                                toggleArticleMedia(
                                  media.id,
                                )
                              }
                              className={`overflow-hidden rounded-2xl border text-left transition ${
                                isSelected
                                  ? "border-pink-500 ring-2 ring-pink-100"
                                  : "border-slate-200 hover:border-pink-300"
                              }`}
                            >
                              <div className="relative aspect-video overflow-hidden bg-slate-100">
                                {media.type ===
                                "IMAGE" ? (
                                  <img
                                    src={
                                      media.url
                                    }
                                    alt={
                                      media.altText ||
                                      media.filename
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                                    <Video
                                      size={34}
                                    />
                                  </div>
                                )}

                                <span
                                  className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                    isSelected
                                      ? "bg-pink-600 text-white"
                                      : "bg-white/90 text-slate-700"
                                  }`}
                                >
                                  {isSelected
                                    ? "Selected"
                                    : media.type ===
                                        "IMAGE"
                                      ? "Image"
                                      : "Video"}
                                </span>
                              </div>

                              <div className="p-3">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {
                                    media.filename
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {media.type ===
                                  "IMAGE"
                                    ? "Image"
                                    : "Video"}
                                </p>
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>

                {selectedArticleMedia.length >
                  0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        Selected Media
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMediaIds([])
                        }
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2">
                      {selectedArticleMedia.map(
                        (media, index) => (
                          <div
                            key={
                              media.id
                            }
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5"
                          >
                            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              {media.type ===
                              "IMAGE" ? (
                                <img
                                  src={
                                    media.url
                                  }
                                  alt={
                                    media.altText ||
                                    media.filename
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                                  <Video
                                    size={20}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {index + 1}.{" "}
                                {
                                  media.filename
                                }
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  media.type
                                }
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                toggleArticleMedia(
                                  media.id,
                                )
                              }
                              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              aria-label={`Remove ${media.filename}`}
                            >
                              <X
                                size={16}
                              />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ARTICLE OPTIONS */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Article Options
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <ToggleRow
                  label="Breaking News"
                  description="Mark this as a priority breaking story."
                  checked={
                    breakingNews
                  }
                  onChange={
                    setBreakingNews
                  }
                  icon={
                    <Zap size={17} />
                  }
                />

                <ToggleRow
                  label="Featured"
                  description="Highlight this article in featured areas."
                  checked={
                    featured
                  }
                  onChange={
                    setFeatured
                  }
                  icon={
                    <FileText
                      size={17}
                    />
                  }
                />

                <ToggleRow
                  label="Show on Homepage"
                  description="Allow this article to appear in homepage sections."
                  checked={
                    showOnHomepage
                  }
                  onChange={
                    setShowOnHomepage
                  }
                  icon={
                    <ImageIcon
                      size={17}
                    />
                  }
                />

                <ToggleRow
                  label="Show in Latest"
                  description="Include this article in the Latest feed."
                  checked={
                    showInLatest
                  }
                  onChange={
                    setShowInLatest
                  }
                  icon={
                    <FileText
                      size={17}
                    />
                  }
                />
              </div>
            </section>
          </div>
        </div>

        {/* =========================================================
            BOTTOM ACTION BAR
        ========================================================== */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              Ready to continue?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Save your article as a draft or
              send it for editor review.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                saveArticle("DRAFT")
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Save size={17} />
              Save Draft
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Send size={17} />

              {saving
                ? "Saving..."
                : "Submit for Review"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean,
  ) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 shrink-0 rounded-lg p-2 ${
          checked
            ? "bg-pink-50 text-pink-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              {label}
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-400">
              {description}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={
              checked
            }
            onClick={() =>
              onChange(!checked)
            }
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              checked
                ? "bg-gradient-to-r from-pink-600 to-purple-600"
                : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                checked
                  ? "left-[22px]"
                  : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}