"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Edit3,
  FolderTree,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";

type Language = "EN" | "SI" | "TA";

type CategoryTranslation = {
  id: string;
  categoryId: string;
  language: Language;
  name: string;
  description: string | null;
};

type Category = {
  id: string;
  slug: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  translations: CategoryTranslation[];
  name: string;
  description: string | null;
  articleCount: number;
  videoCount: number;
};

type FormTranslation = {
  name: string;
  description: string;
};

type CategoryForm = {
  slug: string;
  EN: FormTranslation;
  SI: FormTranslation;
  TA: FormTranslation;
};

type Props = {
  initialCategories: Category[];
};

const languageLabels: Record<Language, string> = {
  EN: "English",
  SI: "සිංහල",
  TA: "தமிழ்",
};

const emptyForm: CategoryForm = {
  slug: "",
  EN: {
    name: "",
    description: "",
  },
  SI: {
    name: "",
    description: "",
  },
  TA: {
    name: "",
    description: "",
  },
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function convertCategoryToForm(
  category: Category,
): CategoryForm {
  const getTranslation = (language: Language) => {
    const translation =
      category.translations.find(
        (item) => item.language === language,
      );

    return {
      name: translation?.name ?? "",
      description:
        translation?.description ?? "",
    };
  };

  return {
    slug: category.slug,
    EN: getTranslation("EN"),
    SI: getTranslation("SI"),
    TA: getTranslation("TA"),
  };
}

function convertFormToPayload(
  form: CategoryForm,
) {
  const translations: Array<{
    language: Language;
    name: string;
    description?: string;
  }> = [];

  for (const language of ["EN", "SI", "TA"] as Language[]) {
    const translation = form[language];

    if (translation.name.trim()) {
      translations.push({
        language,
        name: translation.name.trim(),
        description:
          translation.description.trim() || undefined,
      });
    }
  }

  return {
    slug: generateSlug(form.slug),
    translations,
  };
}

export default function CategoriesClient({
  initialCategories,
}: Props) {
  const [categories, setCategories] =
    useState<Category[]>(initialCategories);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [form, setForm] =
    useState<CategoryForm>(emptyForm);

  const [activeLanguage, setActiveLanguage] =
    useState<Language>("EN");

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const filteredCategories = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      const translationText =
        category.translations
          .map(
            (translation) =>
              `${translation.name} ${
                translation.description ?? ""
              }`,
          )
          .join(" ")
          .toLowerCase();

      return (
        category.slug
          .toLowerCase()
          .includes(query) ||
        category.name
          .toLowerCase()
          .includes(query) ||
        translationText.includes(query)
      );
    });
  }, [categories, search]);

  const totalArticles = categories.reduce(
    (total, category) =>
      total + category.articleCount,
    0,
  );

  const totalVideos = categories.reduce(
    (total, category) =>
      total + category.videoCount,
    0,
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCategory(null);
    setActiveLanguage("EN");
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (
    category: Category,
  ) => {
    setEditingCategory(category);
    setForm(
      convertCategoryToForm(category),
    );
    setActiveLanguage("EN");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  const updateTranslation = (
    language: Language,
    field: keyof FormTranslation,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [language]: {
        ...current[language],
        [field]: value,
      },
    }));
  };

  const handleEnglishNameChange = (
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      EN: {
        ...current.EN,
        name: value,
      },
      slug:
        editingCategory
          ? current.slug
          : generateSlug(value),
    }));
  };

  const handleSave = async () => {
    setError("");

    const payload =
      convertFormToPayload(form);

    if (!payload.slug) {
      setError(
        "Please enter a valid category slug.",
      );
      return;
    }

    if (
      !form.EN.name.trim()
    ) {
      setError(
        "English category name is required.",
      );
      setActiveLanguage("EN");
      return;
    }

    if (
      payload.translations.length === 0
    ) {
      setError(
        "At least one translation is required.",
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/categories",
        {
          method: editingCategory
            ? "PUT"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            editingCategory
              ? {
                  id: editingCategory.id,
                  ...payload,
                }
              : payload,
          ),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save category.",
        );
      }

      const savedCategory =
        data.category as Category;

      if (editingCategory) {
        setCategories((current) =>
          current.map((category) =>
            category.id ===
            savedCategory.id
              ? savedCategory
              : category,
          ),
        );
      } else {
        setCategories((current) => [
          savedCategory,
          ...current,
        ]);
      }

      closeModal();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save category.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    category: Category,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${category.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/categories?id=${encodeURIComponent(
          category.id,
        )}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete category.",
        );
      }

      setCategories((current) =>
        current.filter(
          (item) =>
            item.id !== category.id,
        ),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete category.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const currentTranslation =
    form[activeLanguage];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            Content Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the categories used across
            the TV SUPREME newsroom.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={17} />
          Add Category
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && !showModal && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Categories"
          value={String(
            categories.length,
          )}
          note="Stored in MySQL"
          icon={
            <FolderTree size={20} />
          }
        />

        <SummaryCard
          title="Articles"
          value={String(
            totalArticles,
          )}
          note="Assigned to categories"
          icon={<Tag size={20} />}
        />

        <SummaryCard
          title="Videos"
          value={String(
            totalVideos,
          )}
          note="Assigned to categories"
          icon={
            <FolderTree size={20} />
          }
        />

        <SummaryCard
          title="Languages"
          value="3"
          note="English • Sinhala • Tamil"
          icon={<Tag size={20} />}
        />
      </div>

      {/* MAIN TABLE */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TOOLBAR */}
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
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
                placeholder="Search categories..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Category
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Slug
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Languages
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Articles
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Videos
                </th>

                <th className="w-[110px] px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.length >
              0 ? (
                filteredCategories.map(
                  (category) => (
                    <tr
                      key={
                        category.id
                      }
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                            <FolderTree
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {
                                category.name
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {
                                category.description ??
                                "No description"
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                          /{category.slug}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(
                            [
                              "EN",
                              "SI",
                              "TA",
                            ] as Language[]
                          ).map(
                            (
                              language,
                            ) => {
                              const exists =
                                category.translations.some(
                                  (
                                    translation,
                                  ) =>
                                    translation.language ===
                                    language,
                                );

                              return (
                                <span
                                  key={
                                    language
                                  }
                                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                                    exists
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-slate-100 text-slate-400"
                                  }`}
                                >
                                  {
                                    language
                                  }
                                </span>
                              );
                            },
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-800">
                          {
                            category.articleCount
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-800">
                          {
                            category.videoCount
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                category,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-pink-50 hover:text-pink-600"
                            aria-label={`Edit ${category.name}`}
                          >
                            <Edit3
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              category.id
                            }
                            onClick={() =>
                              handleDelete(
                                category,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2
                              size={16}
                            />
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
                        <FolderTree
                          size={38}
                          className="text-slate-300"
                        />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-slate-700">
                        No categories found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Try a different search
                        or create a new
                        category.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400">
          Showing{" "}
          {filteredCategories.length}{" "}
          of {categories.length}{" "}
          categories
        </div>
      </section>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  Category Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* BODY */}
            <div className="space-y-6 p-6">
              {/* LANGUAGE TABS */}
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Language
                </p>

                <div className="flex flex-wrap gap-2">
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
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          activeLanguage ===
                          language
                            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {languageLabels[
                          language
                        ]}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* NAME */}
              <div>
                <label
                  htmlFor="categoryName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category Name
                  {activeLanguage ===
                    "EN" && (
                    <span className="ml-1 text-pink-600">
                      *
                    </span>
                  )}
                </label>

                <input
                  id="categoryName"
                  type="text"
                  value={
                    currentTranslation.name
                  }
                  onChange={(event) => {
                    if (
                      activeLanguage ===
                      "EN"
                    ) {
                      handleEnglishNameChange(
                        event.target
                          .value,
                      );
                    } else {
                      updateTranslation(
                        activeLanguage,
                        "name",
                        event.target
                          .value,
                      );
                    }
                  }}
                  placeholder={
                    activeLanguage ===
                    "EN"
                      ? "e.g. Technology"
                      : activeLanguage ===
                        "SI"
                      ? "උදා: තාක්ෂණය"
                      : "உதா: தொழில்நுட்பம்"
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="categoryDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="categoryDescription"
                  value={
                    currentTranslation.description
                  }
                  onChange={(event) =>
                    updateTranslation(
                      activeLanguage,
                      "description",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Write a short category description..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* SLUG */}
              <div>
                <label
                  htmlFor="categorySlug"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Slug
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  id="categorySlug"
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: generateSlug(
                        event.target
                          .value,
                      ),
                    }))
                  }
                  placeholder="technology"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Public URL: /{form.slug || "category-name"}
                </p>
              </div>

              {/* TRANSLATION STATUS */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Translation status
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      "EN",
                      "SI",
                      "TA",
                    ] as Language[]
                  ).map(
                    (language) => (
                      <div
                        key={language}
                        className="rounded-lg bg-white px-3 py-2"
                      >
                        <p className="text-xs font-medium text-slate-400">
                          {
                            languageLabels[
                              language
                            ]
                          }
                        </p>

                        <p
                          className={`mt-1 text-sm font-semibold ${
                            form[
                              language
                            ].name.trim()
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        >
                          {form[
                            language
                          ].name.trim()
                            ? "Added"
                            : "Not added"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Tag size={16} />

                {saving
                  ? "Saving..."
                  : editingCategory
                  ? "Save Changes"
                  : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
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