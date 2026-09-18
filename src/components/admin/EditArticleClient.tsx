"use client";

import Link from "next/link";
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
  Video,
  X,
  Zap,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

type Article = {
  id: string;
  slug: string;
  status: ArticleStatus;
  categoryId: string;
  authorId: string;
  mainImageId: string | null;
  mainImage?: {
    id: string;
    filename: string;
    url: string;
    altText: string | null;
    size: number | null;
    width: number | null;
    height: number | null;
  } | null;
  media?: Array<{
    id: string;
    filename: string;
    url: string;
    type: string;
    altText: string | null;
    size: number | null;
    width: number | null;
    height: number | null;
  }>;
  isBreaking: boolean;
  isFeatured: boolean;
  showOnHomepage: boolean;
  showInLatest: boolean;
  publishedAt: string | Date | null;
  scheduledAt: string | Date | null;
  translations: Array<{
    language: Language;
    title: string;
    summary: string | null;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
  }>;
  tags: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
};

type Props = {
  article: Article;
  initialCategories: CategoryOption[];
  initialAuthors: AuthorOption[];
};

const languageLabels: Record<Language, string> = {
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

function createInitialTranslations(
  article: Article,
): TranslationsState {
  const result: TranslationsState = {
    EN: { ...emptyTranslation },
    SI: { ...emptyTranslation },
    TA: { ...emptyTranslation },
  };

  for (const translation of article.translations) {
    result[translation.language] = {
      title: translation.title ?? "",
      summary: translation.summary ?? "",
      content: translation.content ?? "",
      seoTitle: translation.seoTitle ?? "",
      seoDescription:
        translation.seoDescription ?? "",
    };
  }

  return result;
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDateInput(
  value: string | Date | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toTimeInput(
  value: string | Date | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const hours = String(
    date.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export default function EditArticleClient({
  article,
  initialCategories,
  initialAuthors,
}: Props) {
  const [activeLanguage, setActiveLanguage] =
    useState<Language>("EN");

  const [translations, setTranslations] =
    useState<TranslationsState>(
      createInitialTranslations(article),
    );

  const [slug, setSlug] = useState(
    article.slug,
  );

  const [categoryId, setCategoryId] =
    useState(article.categoryId);

  const [authorId, setAuthorId] =
    useState(article.authorId);

  const [tags, setTags] = useState<string[]>(
    article.tags.map((tag) => tag.name),
  );

  const [tagInput, setTagInput] =
    useState("");

  const [breakingNews, setBreakingNews] =
    useState(article.isBreaking);

  const [featured, setFeatured] =
    useState(article.isFeatured);

  const [showOnHomepage, setShowOnHomepage] =
    useState(article.showOnHomepage);

  const [showInLatest, setShowInLatest] =
    useState(article.showInLatest);

  const [publishDate, setPublishDate] =
    useState(
      toDateInput(
        article.publishedAt ??
          article.scheduledAt,
      ),
    );

  const [publishTime, setPublishTime] =
    useState(
      toTimeInput(
        article.publishedAt ??
          article.scheduledAt,
      ),
    );

  const [saving, setSaving] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [mainImageId, setMainImageId] =
    useState<string | null>(
      article.mainImageId ?? null,
    );

  const [mediaOptions, setMediaOptions] =
    useState<MediaOption[]>([]);

  const [loadingMedia, setLoadingMedia] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const imageInputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedMediaIds, setSelectedMediaIds] =
    useState<string[]>(
      article.media?.map((media) => media.id) ?? [],
    );

  const [uploadingArticleMedia, setUploadingArticleMedia] =
    useState(false);

  const articleMediaInputRef =
    useRef<HTMLInputElement | null>(null);

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

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load media from the Media Library.",
          );
        }

        type RawMediaItem = {
          id?: unknown;
          filename?: unknown;
          name?: unknown;
          url?: unknown;
          type?: unknown;
          altText?: unknown;
          size?: unknown;
          bytes?: unknown;
          width?: unknown;
          height?: unknown;
        };

        const rawItems: RawMediaItem[] = Array.isArray(data.items)
          ? (data.items as RawMediaItem[])
          : Array.isArray(data.media)
            ? (data.media as RawMediaItem[])
            : [];

        const libraryMedia: MediaOption[] = rawItems
          .map((item): MediaOption | null => {
            const rawType = String(item.type ?? "").toUpperCase();
            const type: "IMAGE" | "VIDEO" =
              rawType === "VIDEO" ? "VIDEO" : "IMAGE";

            const id = String(item.id ?? "");
            const url = String(item.url ?? "");

            if (!id || !url) {
              return null;
            }

            return {
              id,
              filename: String(
                item.filename ??
                  item.name ??
                  (type === "VIDEO"
                    ? "Untitled video"
                    : "Untitled image"),
              ),
              url,
              type,
              altText:
                typeof item.altText === "string"
                  ? item.altText
                  : null,
              size:
                typeof item.size === "number"
                  ? item.size
                  : typeof item.bytes === "number"
                    ? item.bytes
                    : null,
              width:
                typeof item.width === "number"
                  ? item.width
                  : null,
              height:
                typeof item.height === "number"
                  ? item.height
                  : null,
            };
          })
          .filter(
            (item): item is MediaOption =>
              Boolean(item),
          );

        const existingMedia: MediaOption[] =
          (article.media ?? [])
            .map((item): MediaOption | null => {
              const mediaType = String(item.type).toUpperCase();

              if (mediaType !== "IMAGE" && mediaType !== "VIDEO") {
                return null;
              }

              return {
                id: item.id,
                filename: item.filename,
                url: item.url,
                type: mediaType,
                altText: item.altText ?? null,
                size: item.size ?? null,
                width: item.width ?? null,
                height: item.height ?? null,
              };
            })
            .filter(
              (item): item is MediaOption => Boolean(item),
            );

        const existingMainImage: MediaOption[] =
          article.mainImage
            ? [
                {
                  id: article.mainImage.id,
                  filename: article.mainImage.filename,
                  url: article.mainImage.url,
                  type: "IMAGE",
                  altText:
                    article.mainImage.altText ?? null,
                  size: article.mainImage.size ?? null,
                  width:
                    article.mainImage.width ?? null,
                  height:
                    article.mainImage.height ?? null,
                },
              ]
            : [];

        const uniqueMedia = new Map<string, MediaOption>();

        for (const media of [
          ...existingMainImage,
          ...existingMedia,
          ...libraryMedia,
        ]) {
          uniqueMedia.set(media.id, media);
        }

        if (!cancelled) {
          setMediaOptions(
            Array.from(uniqueMedia.values()),
          );
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
  }, [article.media, article.mainImage]);

  const imageMediaOptions = mediaOptions.filter(
    (media) => media.type === "IMAGE",
  );

  const articleMediaOptions = mediaOptions;

  const selectedMainImage =
    imageMediaOptions.find(
      (media) => media.id === mainImageId,
    ) ?? article.mainImage ?? null;

  const selectedArticleMedia = selectedMediaIds
    .map((id) =>
      articleMediaOptions.find(
        (media) => media.id === id,
      ),
    )
    .filter(
      (media): media is MediaOption =>
        Boolean(media),
    );

  const toggleArticleMedia = (mediaId: string) => {
    setSelectedMediaIds((current) =>
      current.includes(mediaId)
        ? current.filter((id) => id !== mediaId)
        : [...current, mediaId],
    );
  };

  const formatFileSize = (bytes: number | null) => {
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
  };

  const uploadMediaFile = async (
    file: File,
    purpose: "MAIN_IMAGE" | "ARTICLE_MEDIA",
  ) => {
    if (!file) {
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError(
        "Please select a valid image or video file.",
      );
      return;
    }

    if (file.size <= 0) {
      setError("The selected media file is empty.");
      return;
    }

    if (purpose === "MAIN_IMAGE" && !isImage) {
      setError(
        "The main image must be an image file.",
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
      formData.append("file", file);

      const response = await fetch(
        "/api/admin/media",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to upload the media file.",
        );
      }

      const uploadedMedia = data.media;

      if (
        !uploadedMedia ||
        !uploadedMedia.id ||
        !uploadedMedia.url
      ) {
        throw new Error(
          "The uploaded media response is invalid.",
        );
      }

      const mediaType: "IMAGE" | "VIDEO" =
        String(
          uploadedMedia.type ?? "",
        ).toUpperCase() === "VIDEO"
          ? "VIDEO"
          : isVideo
            ? "VIDEO"
            : "IMAGE";

      const newMedia: MediaOption = {
        id: String(uploadedMedia.id),
        filename:
          uploadedMedia.filename ??
          file.name,
        url: uploadedMedia.url,
        type: mediaType,
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

      setMediaOptions((current) => [
        newMedia,
        ...current.filter(
          (media) => media.id !== newMedia.id,
        ),
      ]);

      if (purpose === "MAIN_IMAGE") {
        setMainImageId(newMedia.id);

        setSavedMessage(
          "Image uploaded and selected as the main image.",
        );
      } else {
        setSelectedMediaIds((current) =>
          current.includes(newMedia.id)
            ? current
            : [...current, newMedia.id],
        );

        if (
          mediaType === "IMAGE" &&
          !mainImageId
        ) {
          setMainImageId(newMedia.id);
          setSavedMessage(
            "Media uploaded, selected for the article, and set as the main image.",
          );
        } else {
          setSavedMessage(
            "Media uploaded and added to the article.",
          );
        }
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the media file.",
      );
    } finally {
      if (purpose === "MAIN_IMAGE") {
        setUploadingImage(false);
      } else {
        setUploadingArticleMedia(false);
      }
    }
  };

  const handleMainImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    await uploadMediaFile(file, "MAIN_IMAGE");
  };

  const handleArticleMediaFileChange = async (
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
        await uploadMediaFile(
          file,
          "ARTICLE_MEDIA",
        );
      }
    } finally {
      setUploadingArticleMedia(false);
    }
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
  };

  const addTag = () => {
    const value = tagInput.trim();

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
        (tag) => tag !== tagToRemove,
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

  const getPublishDateValue = () => {
    if (!publishDate || !publishTime) {
      return undefined;
    }

    const value = new Date(
      `${publishDate}T${publishTime}`,
    );

    if (Number.isNaN(value.getTime())) {
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
        ([language, translation]) => ({
          language,
          title: translation.title.trim(),
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

    const english = translations.EN;

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

    if (!categoryId) {
      setError(
        "Please select a category.",
      );
      return;
    }

    if (!authorId) {
      setError(
        "Please select an author.",
      );
      return;
    }

    const finalSlug = generateSlug(slug);

    if (!finalSlug) {
      setError(
        "Article slug is required.",
      );
      return;
    }

    if (
      status === "SCHEDULED" &&
      !getPublishDateValue()
    ) {
      setError(
        "Please select a publish date and time.",
      );
      return;
    }

    if (
      status === "PUBLISHED" &&
      publishDate &&
      !publishTime
    ) {
      setError(
        "Please select a publish time.",
      );
      return;
    }

    const selectedCategory =
      initialCategories.find(
        (category) =>
          category.id === categoryId,
      );

    if (!selectedCategory) {
      setError(
        "The selected category is no longer available. Please refresh the page.",
      );
      return;
    }

    const selectedAuthor =
      initialAuthors.find(
        (author) =>
          author.id === authorId,
      );

    if (!selectedAuthor) {
      setError(
        "The selected author is no longer available. Please refresh the page.",
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
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: article.id,
            slug: finalSlug,
            categoryId,
            authorId,
            status,
            isBreaking: breakingNews,
            isFeatured: featured,
            showOnHomepage,
            showInLatest,

            mainImageId:
              mainImageId ?? null,

            publishedAt:
              status === "PUBLISHED"
                ? getPublishDateValue()
                : status === "DRAFT" ||
                    status === "REVIEW"
                  ? null
                  : undefined,

            scheduledAt:
              status === "SCHEDULED"
                ? getPublishDateValue()
                : null,

            translations:
              translationPayload,

            tags,
            mediaIds: selectedMediaIds,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update article.",
        );
      }

      if (status === "DRAFT") {
        setSavedMessage(
          "Article updated and saved as draft.",
        );
      } else if (
        status === "REVIEW"
      ) {
        setSavedMessage(
          "Article updated and submitted for review.",
        );
      } else if (
        status === "SCHEDULED"
      ) {
        setSavedMessage(
          "Article updated and scheduled successfully.",
        );
      } else if (
        status === "PUBLISHED"
      ) {
        setSavedMessage(
          "Article updated and published successfully.",
        );
      } else {
        setSavedMessage(
          "Article updated successfully.",
        );
      }

      setSlug(finalSlug);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update article.",
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
      {/* PAGE HEADER */}
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
              Edit Article
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update this TV SUPREME news
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

      {/* SUCCESS */}
      {savedMessage && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex min-w-0 items-center gap-2">
            <Check
              size={16}
              className="shrink-0"
            />
            <span>{savedMessage}</span>
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

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-6"
      >
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
          {/* MAIN */}
          <div className="min-w-0 space-y-6">
            {/* LANGUAGE */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-pink-50 p-3 text-pink-600">
                    <Languages size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Article Language
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Edit English, Sinhala
                      and Tamil translations.
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
                  Edit the content for the
                  selected language.
                </p>
              </div>

              <div className="space-y-6 p-4 sm:p-6">
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
                    onChange={(event) =>
                      updateTranslation(
                        activeLanguage,
                        "title",
                        event.target.value,
                      )
                    }
                    maxLength={160}
                    placeholder="Enter the article headline..."
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />

                  <div className="mt-2 flex items-start justify-between gap-3 text-xs text-slate-400">
                    <span>
                      Write a clear and
                      engaging headline.
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
                    onChange={(event) =>
                      updateTranslation(
                        activeLanguage,
                        "summary",
                        event.target.value,
                      )
                    }
                    rows={4}
                    placeholder="Write a short summary of the story..."
                    className="w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>

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
                    onChange={(event) =>
                      updateTranslation(
                        activeLanguage,
                        "content",
                        event.target.value,
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
                    <Settings2 size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      SEO & Social
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      SEO values are stored
                      for each language.
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
                    onChange={(event) =>
                      updateTranslation(
                        activeLanguage,
                        "seoTitle",
                        event.target.value,
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
                    onChange={(event) =>
                      updateTranslation(
                        activeLanguage,
                        "seoDescription",
                        event.target.value,
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

          {/* SIDEBAR */}
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
                      onChange={(event) =>
                        setAuthorId(
                          event.target.value,
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
                            key={author.id}
                            value={author.id}
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
                </div>

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
                    value={publishDate}
                    onChange={(event) =>
                      setPublishDate(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-pink-400"
                  />
                </div>

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
                    value={publishTime}
                    onChange={(event) =>
                      setPublishTime(
                        event.target.value,
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
                    onChange={(event) =>
                      setCategoryId(
                        event.target.value,
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                  >
                    <option value="">
                      Select category
                    </option>

                    {initialCategories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
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
                  onChange={(event) =>
                    setSlug(
                      generateSlug(
                        event.target.value,
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
                    onChange={(event) =>
                      setTagInput(
                        event.target.value,
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
                    onClick={addTag}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition hover:bg-pink-100"
                    aria-label="Add tag"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
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
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* MAIN IMAGE */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-purple-50 p-3 text-purple-600">
                    <ImageIcon size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Main Image
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Select an image from the Media
                      Library or upload a new one.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageFileChange}
                />

                {selectedMainImage ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={selectedMainImage.url}
                        alt={
                          selectedMainImage.altText ||
                          selectedMainImage.filename
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {selectedMainImage.filename}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                          {selectedMainImage.width &&
                          selectedMainImage.height ? (
                            <span>
                              {selectedMainImage.width} × {selectedMainImage.height}
                            </span>
                          ) : null}

                          {selectedMainImage.size ? (
                            <span>
                              {formatFileSize(selectedMainImage.size)}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() =>
                            imageInputRef.current?.click()
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-pink-300 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ImageIcon size={16} />
                          Change Image
                        </button>

                        <button
                          type="button"
                          onClick={() => setMainImageId(null)}
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
                      Choose an existing image below
                      or upload a new image.
                    </p>

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() =>
                        imageInputRef.current?.click()
                      }
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={16} />
                      {uploadingImage
                        ? "Uploading..."
                        : "Upload New Image"}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={uploadingImage}
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
                      value={mainImageId ?? ""}
                      onChange={(event) =>
                        setMainImageId(
                          event.target.value || null,
                        )
                      }
                      disabled={
                        loadingMedia || uploadingImage
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">
                        {loadingMedia
                          ? "Loading images..."
                          : "Choose an image"}
                      </option>

                      {imageMediaOptions.map((media) => (
                        <option
                          key={media.id}
                          value={media.id}
                        >
                          {media.filename}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {!loadingMedia &&
                    imageMediaOptions.length === 0 && (
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        No images are currently
                        available in the Media Library.
                        Upload an image to use it here.
                      </p>
                    )}

                  {!loadingMedia &&
                    imageMediaOptions.length > 0 && (
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {imageMediaOptions.length} image
                        {imageMediaOptions.length === 1 ? "" : "s"}
                        {" "}
                        available in the Media Library.
                      </p>
                    )}
                </div>
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
                  checked={breakingNews}
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
                  checked={featured}
                  onChange={setFeatured}
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

            {/* ARTICLE MEDIA */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-pink-50 p-3 text-pink-600">
                    <Video size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Article Media
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Add images and videos that belong
                      to this article.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <input
                  ref={articleMediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={
                    handleArticleMediaFileChange
                  }
                />

                <button
                  type="button"
                  disabled={
                    uploadingArticleMedia
                  }
                  onClick={() =>
                    articleMediaInputRef.current?.click()
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={17} />
                  {uploadingArticleMedia
                    ? "Uploading..."
                    : "Upload Images / Videos"}
                </button>

                {selectedArticleMedia.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Selected Media
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {selectedArticleMedia.length} item
                          {selectedArticleMedia.length === 1
                            ? ""
                            : "s"} selected.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMediaIds([])
                        }
                        className="text-xs font-semibold text-red-500 transition hover:text-red-700"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2">
                      {selectedArticleMedia.map(
                        (media, index) => (
                          <div
                            key={media.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                          >
                            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              {media.type ===
                              "IMAGE" ? (
                                <img
                                  src={media.url}
                                  alt={
                                    media.altText ||
                                    media.filename
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  muted
                                  playsInline
                                  preload="metadata"
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-700">
                                {index + 1}.{" "}
                                {media.filename}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {media.type ===
                                "IMAGE"
                                  ? "Image"
                                  : "Video"}
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
                              <X size={16} />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Media Library
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Click images or videos to add or remove
                        them from this article.
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-slate-400">
                      {articleMediaOptions.length} item
                      {articleMediaOptions.length === 1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  {loadingMedia ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
                      Loading media...
                    </div>
                  ) : articleMediaOptions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                      <Video
                        size={28}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        No images or videos available
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Upload article media to add it to
                        this story.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {articleMediaOptions.map(
                        (media) => {
                          const isSelected =
                            selectedMediaIds.includes(
                              media.id,
                            );

                          return (
                            <button
                              key={media.id}
                              type="button"
                              onClick={() =>
                                toggleArticleMedia(
                                  media.id,
                                )
                              }
                              className={`group overflow-hidden rounded-xl border text-left transition ${
                                isSelected
                                  ? "border-pink-500 ring-2 ring-pink-100"
                                  : "border-slate-200 hover:border-pink-300"
                              }`}
                            >
                              <div className="relative aspect-video overflow-hidden bg-slate-100">
                                {media.type ===
                                "IMAGE" ? (
                                  <img
                                    src={media.url}
                                    alt={
                                      media.altText ||
                                      media.filename
                                    }
                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                  />
                                ) : (
                                  <video
                                    src={media.url}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="h-full w-full object-cover"
                                  />
                                )}

                                <div className="absolute left-2 top-2 rounded-full bg-slate-900/75 px-2 py-1 text-[10px] font-semibold text-white">
                                  {media.type ===
                                  "IMAGE"
                                    ? "IMAGE"
                                    : "VIDEO"}
                                </div>

                                <div
                                  className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full ${
                                    isSelected
                                      ? "bg-pink-600 text-white"
                                      : "bg-white/90 text-slate-500"
                                  }`}
                                >
                                  <Check
                                    size={14}
                                  />
                                </div>
                              </div>

                              <div className="p-3">
                                <p className="truncate text-xs font-semibold text-slate-700">
                                  {media.filename}
                                </p>

                                {media.width &&
                                media.height ? (
                                  <p className="mt-1 text-[11px] text-slate-400">
                                    {media.width} ×{" "}
                                    {media.height}
                                  </p>
                                ) : null}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              Ready to save your changes?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Update the article and save it
              as a draft or send it for review.
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
            aria-checked={checked}
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