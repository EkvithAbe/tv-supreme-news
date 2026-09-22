"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  EyeOff,
  Globe2,
  GripVertical,
  Languages,
  Link2,
  Menu as MenuIcon,
  Monitor,
  Plus,
  RefreshCw,
  Save,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";

/* ===============================================================
   TYPES
=============================================================== */

type MenuType =
  | "Page"
  | "Category"
  | "Custom Link"
  | "System";

type MenuLanguage =
  | "EN"
  | "SI"
  | "TA";

type MenuItem = {
  id: string;
  language: MenuLanguage;
  label: string;
  href: string;
  position: number;
  visible: boolean;
  type: MenuType;
  desktop: boolean;
  mobile: boolean;
  openNewTab: boolean;
};

type ApiMenuItem = {
  id: string;
  language: MenuLanguage;
  label: string;
  href: string;
  position: number;
  isVisible: boolean;
  type: MenuType;
  desktop: boolean;
  mobile: boolean;
  openNewTab: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiListResponse = {
  success: boolean;
  items?: ApiMenuItem[];
  message?: string;
};

type ApiItemResponse = {
  success: boolean;
  item?: ApiMenuItem;
  message?: string;
};

type LanguageOption = {
  label: string;
  shortLabel: string;
  value: MenuLanguage;
};

type TranslationForm = {
  EN: string;
  SI: string;
  TA: string;
};

/* ===============================================================
   CONSTANTS
=============================================================== */

const languageOptions: LanguageOption[] = [
  {
    label: "English",
    shortLabel: "EN",
    value: "EN",
  },
  {
    label: "Sinhala",
    shortLabel: "SI",
    value: "SI",
  },
  {
    label: "Tamil",
    shortLabel: "TA",
    value: "TA",
  },
];

const typeFilters = [
  {
    label: "All Items",
    value: "All",
  },
  {
    label: "Pages",
    value: "Page",
  },
  {
    label: "Categories",
    value: "Category",
  },
  {
    label: "Custom Links",
    value: "Custom Link",
  },
  {
    label: "System",
    value: "System",
  },
] as const;

/* ===============================================================
   MAPPERS
=============================================================== */

function mapApiItem(
  item: ApiMenuItem,
): MenuItem {
  return {
    id: item.id,
    language: item.language,
    label: item.label,
    href: item.href,
    position: item.position,
    visible: item.isVisible,
    type: item.type,
    desktop: item.desktop,
    mobile: item.mobile,
    openNewTab: item.openNewTab,
  };
}

/* ===============================================================
   HELPERS
=============================================================== */

function normalizeHref(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }

  return `/${trimmed}`;
}

function normalizeMatchHref(
  value: string,
): string {
  const normalized =
    normalizeHref(value);

  return normalized
    .replace(
      /^\/(en|si|ta)(?=\/|$)/,
      "",
    )
    .replace(
      /\/+$/,
      "",
    ) || "/";
}

function getLanguageLabel(
  language: MenuLanguage,
): string {
  return (
    languageOptions.find(
      (item) =>
        item.value ===
        language,
    )?.label ?? language
  );
}

function isWatchLiveHref(
  href: string,
): boolean {
  return (
    normalizeMatchHref(
      href,
    ) === "/watch-live"
  );
}

function isHomeHref(
  href: string,
): boolean {
  return (
    normalizeMatchHref(
      href,
    ) === "/"
  );
}

function isExternalUrl(
  href: string,
): boolean {
  return /^https?:\/\//i.test(
    href.trim(),
  );
}

/* ===============================================================
   PAGE
=============================================================== */

export default function MenuPage() {
  /* =============================================================
     MENU DATA
  ============================================================== */

  const [
    items,
    setItems,
  ] = useState<MenuItem[]>(
    [],
  );

  const [
    allLanguageItems,
    setAllLanguageItems,
  ] = useState<
    Record<
      MenuLanguage,
      MenuItem[]
    >
  >({
    EN: [],
    SI: [],
    TA: [],
  });

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isSavingItem,
    setIsSavingItem,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    string | null
  >(null);

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState<MenuLanguage>(
    "EN",
  );

  /* =============================================================
     FILTERS
  ============================================================== */

  const [
    typeFilter,
    setTypeFilter,
  ] = useState<
    (typeof typeFilters)[number]["value"]
  >("All");

  const [
    showHiddenOnly,
    setShowHiddenOnly,
  ] = useState(false);

  /* =============================================================
     MESSAGES
  ============================================================== */

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =============================================================
     STANDARD MENU MODAL
  ============================================================== */

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] = useState<MenuItem | null>(
    null,
  );

  const [
    label,
    setLabel,
  ] = useState("");

  const [
    href,
    setHref,
  ] = useState("");

  const [
    type,
    setType,
  ] = useState<MenuType>(
    "Custom Link",
  );

  const [
    visible,
    setVisible,
  ] = useState(true);

  const [
    desktop,
    setDesktop,
  ] = useState(true);

  const [
    mobile,
    setMobile,
  ] = useState(true);

  const [
    openNewTab,
    setOpenNewTab,
  ] = useState(false);

  /* =============================================================
     TRANSLATION MODAL
  ============================================================== */

  const [
    showTranslationModal,
    setShowTranslationModal,
  ] = useState(false);

  const [
    translationItem,
    setTranslationItem,
  ] = useState<MenuItem | null>(
    null,
  );

  const [
    translationForm,
    setTranslationForm,
  ] = useState<TranslationForm>({
    EN: "",
    SI: "",
    TA: "",
  });

  const [
    isSavingTranslations,
    setIsSavingTranslations,
  ] = useState(false);

  /* =============================================================
     LOAD ONE LANGUAGE
  ============================================================== */

  const loadLanguageMenu =
    useCallback(
      async (
        language: MenuLanguage,
      ): Promise<MenuItem[]> => {
        const response =
          await fetch(
            `/api/admin/menu?language=${language}`,
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
              `Failed to load ${language} menu.`,
          );
        }

        return (
          data.items ?? []
        ).map(
          mapApiItem,
        );
      },
      [],
    );

  /* =============================================================
     LOAD ALL LANGUAGES
  ============================================================== */

  const loadAllMenus =
    useCallback(
      async () => {
        try {
          setIsLoading(true);
          setError("");

          const [
            english,
            sinhala,
            tamil,
          ] =
            await Promise.all([
              loadLanguageMenu(
                "EN",
              ),
              loadLanguageMenu(
                "SI",
              ),
              loadLanguageMenu(
                "TA",
              ),
            ]);

          const nextData = {
            EN: english,
            SI: sinhala,
            TA: tamil,
          };

          setAllLanguageItems(
            nextData,
          );

          setItems(
            nextData[
              selectedLanguage
            ],
          );
        } catch (loadError) {
          console.error(
            "Failed to load menus:",
            loadError,
          );

          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Failed to load menu items.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      [
        loadLanguageMenu,
        selectedLanguage,
      ],
    );

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadAllMenus();
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [loadAllMenus]);

  /* =============================================================
     SELECTED LANGUAGE
  ============================================================== */

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      setItems(
        allLanguageItems[
          selectedLanguage
        ] ?? [],
      );
    }, 0);

    return () => {
      window.clearTimeout(syncTimer);
    };
  }, [
    selectedLanguage,
    allLanguageItems,
  ]);

  const handleLanguageChange =
    (
      language: MenuLanguage,
    ) => {
      setSelectedLanguage(
        language,
      );

      setTypeFilter("All");
      setShowHiddenOnly(
        false,
      );
      setSuccessMessage("");
      setError("");
    };

  /* =============================================================
     FILTERED ITEMS
  ============================================================== */

  const filteredItems =
    useMemo(() => {
      return items
        .filter(
          (item) =>
            typeFilter ===
              "All" ||
            item.type ===
              typeFilter,
        )
        .filter(
          (item) =>
            !showHiddenOnly ||
            !item.visible,
        )
        .sort(
          (a, b) =>
            a.position -
            b.position,
        );
    }, [
      items,
      typeFilter,
      showHiddenOnly,
    ]);

  /* =============================================================
     STATS
  ============================================================== */

  const visibleCount =
    items.filter(
      (item) =>
        item.visible,
    ).length;

  const hiddenCount =
    items.filter(
      (item) =>
        !item.visible,
    ).length;

  const desktopCount =
    items.filter(
      (item) =>
        item.desktop,
    ).length;

  const mobileCount =
    items.filter(
      (item) =>
        item.mobile,
    ).length;

  /* =============================================================
     TRANSLATION STATUS
  ============================================================== */

  const englishItems =
    allLanguageItems.EN;

  const sinhalaItems =
    allLanguageItems.SI;

  const tamilItems =
    allLanguageItems.TA;

  const getMatchingItem =
    (
      sourceItem: MenuItem,
      language: MenuLanguage,
    ): MenuItem | null => {
      if (
        language ===
        sourceItem.language
      ) {
        return sourceItem;
      }

      const languageItems =
        allLanguageItems[
          language
        ] ?? [];

      const byHref =
        languageItems.find(
          (item) =>
            normalizeMatchHref(
              item.href,
            ) ===
            normalizeMatchHref(
              sourceItem.href,
            ),
        );

      if (byHref) {
        return byHref;
      }

      const byPosition =
        languageItems.find(
          (item) =>
            item.position ===
            sourceItem.position,
        );

      return (
        byPosition ??
        null
      );
    };

  const getTranslationStatus =
    (
      sourceItem: MenuItem,
      language: MenuLanguage,
    ): boolean => {
      const match =
        getMatchingItem(
          sourceItem,
          language,
        );

      return Boolean(
        match?.label.trim(),
      );
    };

  const translatedSinhalaCount =
    englishItems.filter(
      (item) =>
        getTranslationStatus(
          item,
          "SI",
        ),
    ).length;

  const translatedTamilCount =
    englishItems.filter(
      (item) =>
        getTranslationStatus(
          item,
          "TA",
        ),
    ).length;

  /* =============================================================
     RESET STANDARD FORM
  ============================================================== */

  const resetForm = () => {
    setLabel("");
    setHref("");
    setType(
      "Custom Link",
    );
    setVisible(true);
    setDesktop(true);
    setMobile(true);
    setOpenNewTab(false);
    setEditingItem(null);
  };

  /* =============================================================
     CLOSE STANDARD MODAL
  ============================================================== */

  const closeModal = () => {
    if (isSavingItem) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  /* =============================================================
     OPEN ADD
  ============================================================== */

  const openAddModal = () => {
    if (
      selectedLanguage !==
      "EN"
    ) {
      setError(
        "Add new navigation items in English first. Then use Translate to add Sinhala and Tamil labels.",
      );
      return;
    }

    setError("");
    setSuccessMessage("");

    resetForm();
    setShowModal(true);
  };

  /* =============================================================
     OPEN EDIT
  ============================================================== */

  const openEditModal = (
    item: MenuItem,
  ) => {
    setError("");
    setSuccessMessage("");

    setEditingItem(item);
    setLabel(item.label);
    setHref(item.href);
    setType(item.type);
    setVisible(item.visible);
    setDesktop(item.desktop);
    setMobile(item.mobile);
    setOpenNewTab(
      item.openNewTab,
    );

    setShowModal(true);
  };

  /* =============================================================
     SAVE STANDARD ITEM
  ============================================================== */

  const saveItem =
    async () => {
      const cleanLabel =
        label.trim();

      const cleanHref =
        normalizeHref(href);

      if (!cleanLabel) {
        setError(
          "Menu label is required.",
        );
        return;
      }

      if (!cleanHref) {
        setError(
          "Menu URL is required.",
        );
        return;
      }

      /*
       * Structure is managed from English.
       */
      if (
        selectedLanguage !==
        "EN"
      ) {
        setError(
          "Create and edit menu structure in English. Use Translate for Sinhala and Tamil labels.",
        );
        return;
      }

      try {
        setIsSavingItem(true);
        setError("");
        setSuccessMessage("");

        if (editingItem) {
          const response =
            await fetch(
              "/api/admin/menu",
              {
                method: "PUT",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  id:
                    editingItem.id,

                  language:
                    "EN",

                  label:
                    cleanLabel,

                  href:
                    cleanHref,

                  type,

                  isVisible:
                    visible,

                  desktop,

                  mobile,

                  openNewTab,
                }),
              },
            );

          const data:
            ApiItemResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to update menu item.",
            );
          }

          setSuccessMessage(
            "Menu item updated successfully.",
          );
        } else {
          const response =
            await fetch(
              "/api/admin/menu",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  language:
                    "EN",

                  label:
                    cleanLabel,

                  href:
                    cleanHref,

                  type,

                  isVisible:
                    visible,

                  desktop,

                  mobile,

                  openNewTab,
                }),
              },
            );

          const data:
            ApiItemResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to create menu item.",
            );
          }

          setSuccessMessage(
            "Menu item created successfully.",
          );
        }

        setShowModal(false);
        resetForm();

        await loadAllMenus();
      } catch (saveError) {
        console.error(
          "Failed to save menu item:",
          saveError,
        );

        setError(
          saveError instanceof
            Error
            ? saveError.message
            : "Failed to save menu item.",
        );
      } finally {
        setIsSavingItem(false);
      }
    };

  /* =============================================================
     OPEN TRANSLATION MODAL
  ============================================================== */

  const openTranslationModal =
    (
      item: MenuItem,
    ) => {
      /*
       * Always translate against English
       * master item.
       */
      const englishItem =
        item.language ===
        "EN"
          ? item
          : getMatchingItem(
              item,
              "EN",
            );

      if (!englishItem) {
        setError(
          "The English master menu item could not be found.",
        );
        return;
      }

      const siItem =
        getMatchingItem(
          englishItem,
          "SI",
        );

      const taItem =
        getMatchingItem(
          englishItem,
          "TA",
        );

      setTranslationItem(
        englishItem,
      );

      setTranslationForm({
        EN:
          englishItem.label ||
          "",
        SI:
          siItem?.label ||
          "",
        TA:
          taItem?.label ||
          "",
      });

      setError("");
      setSuccessMessage("");

      setShowTranslationModal(
        true,
      );
    };

  /* =============================================================
     CLOSE TRANSLATION MODAL
  ============================================================== */

  const closeTranslationModal =
    () => {
      if (
        isSavingTranslations
      ) {
        return;
      }

      setShowTranslationModal(
        false,
      );

      setTranslationItem(
        null,
      );

      setTranslationForm({
        EN: "",
        SI: "",
        TA: "",
      });
    };

  /* =============================================================
     UPDATE TRANSLATION FIELD
  ============================================================== */

  const updateTranslation =
    (
      language: MenuLanguage,
      value: string,
    ) => {
      setTranslationForm(
        (current) => ({
          ...current,
          [language]:
            value,
        }),
      );
    };

  /* =============================================================
     FIND TRANSLATED ITEM BY MASTER
  ============================================================== */

  const findItemForLanguage =
    (
      sourceItem: MenuItem,
      language: MenuLanguage,
    ): MenuItem | null => {
      if (
        language ===
        sourceItem.language
      ) {
        return sourceItem;
      }

      const languageItems =
        allLanguageItems[
          language
        ] ?? [];

      const sourceHref =
        normalizeMatchHref(
          sourceItem.href,
        );

      const exact =
        languageItems.find(
          (item) =>
            normalizeMatchHref(
              item.href,
            ) === sourceHref,
        );

      if (exact) {
        return exact;
      }

      const samePosition =
        languageItems.find(
          (item) =>
            item.position ===
            sourceItem.position,
        );

      return (
        samePosition ??
        null
      );
    };

  /* =============================================================
     CREATE / UPDATE TRANSLATION
  ============================================================== */

  const saveTranslationForLanguage =
    async ({
      language,
      labelValue,
      sourceItem,
    }: {
      language: MenuLanguage;
      labelValue: string;
      sourceItem: MenuItem;
    }) => {
      /*
       * English already exists.
       */
      if (
        language ===
        "EN"
      ) {
        return;
      }

      const cleanLabel =
        labelValue.trim();

      /*
       * Empty translation:
       *
       * Do not delete existing item.
       *
       * This lets the admin keep an
       * intentionally missing translation.
       */
      if (!cleanLabel) {
        return;
      }

      const existingItem =
        findItemForLanguage(
          sourceItem,
          language,
        );

      if (existingItem) {
        const response =
          await fetch(
            "/api/admin/menu",
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                id:
                  existingItem.id,

                language,

                label:
                  cleanLabel,

                href:
                  sourceItem.href,

                type:
                  sourceItem.type,

                isVisible:
                  sourceItem.visible,

                desktop:
                  sourceItem.desktop,

                mobile:
                  sourceItem.mobile,

                openNewTab:
                  sourceItem.openNewTab,
              }),
            },
          );

        const data:
          ApiItemResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              `Failed to update ${language} translation.`,
          );
        }

        return;
      }

      /*
       * Translation does not exist yet.
       */
      const response =
        await fetch(
          "/api/admin/menu",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              language,

              label:
                cleanLabel,

              href:
                sourceItem.href,

              type:
                sourceItem.type,

              isVisible:
                sourceItem.visible,

              desktop:
                sourceItem.desktop,

              mobile:
                sourceItem.mobile,

              openNewTab:
                sourceItem.openNewTab,
            }),
          },
        );

      const data:
        ApiItemResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            `Failed to create ${language} translation.`,
        );
      }
    };

  /* =============================================================
     REORDER LANGUAGE AFTER TRANSLATIONS
  ============================================================== */

  const synchronizeLanguageOrder =
    async (
      language: MenuLanguage,
      masterItems: MenuItem[],
    ) => {
      const languageItems =
        await loadLanguageMenu(
          language,
        );

      const orderedIds: string[] =
        [];

      for (
        const masterItem of masterItems
      ) {
        const match =
          languageItems.find(
            (item) =>
              normalizeMatchHref(
                item.href,
              ) ===
              normalizeMatchHref(
                masterItem.href,
              ),
          );

        if (match) {
          orderedIds.push(
            match.id,
          );
        }
      }

      /*
       * Keep any extra language-only
       * items after the master structure.
       */
      const knownIds =
        new Set(
          orderedIds,
        );

      const remaining =
        languageItems
          .filter(
            (item) =>
              !knownIds.has(
                item.id,
              ),
          )
          .sort(
            (a, b) =>
              a.position -
              b.position,
          );

      const finalIds = [
        ...orderedIds,
        ...remaining.map(
          (item) =>
            item.id,
        ),
      ];

      if (
        finalIds.length ===
        0
      ) {
        return;
      }

      const response =
        await fetch(
          "/api/admin/menu",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action:
                "SAVE_ORDER",

              items:
                finalIds.map(
                  (
                    id,
                    position,
                  ) => ({
                    id,
                    position,
                  }),
                ),
            }),
          },
        );

      const data =
        (await response.json()) as {
          success: boolean;
          message?: string;
        };

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            `Failed to synchronize ${language} menu order.`,
        );
      }
    };

  /* =============================================================
     SAVE ALL TRANSLATIONS
  ============================================================== */

  const saveTranslations =
    async () => {
      if (
        !translationItem
      ) {
        return;
      }

      if (
        !translationForm.EN.trim()
      ) {
        setError(
          "English label is required.",
        );
        return;
      }

      try {
        setIsSavingTranslations(
          true,
        );

        setError("");
        setSuccessMessage("");

        /*
         * English master item:
         * update the English label if changed.
         */
        if (
          translationForm.EN.trim() !==
          translationItem.label.trim()
        ) {
          const response =
            await fetch(
              "/api/admin/menu",
              {
                method: "PUT",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  id:
                    translationItem.id,

                  language:
                    "EN",

                  label:
                    translationForm.EN.trim(),

                  href:
                    translationItem.href,

                  type:
                    translationItem.type,

                  isVisible:
                    translationItem.visible,

                  desktop:
                    translationItem.desktop,

                  mobile:
                    translationItem.mobile,

                  openNewTab:
                    translationItem.openNewTab,
                }),
              },
            );

          const data:
            ApiItemResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to update English label.",
            );
          }
        }

        /*
         * Save Sinhala.
         */
        await saveTranslationForLanguage(
          {
            language:
              "SI",

            labelValue:
              translationForm.SI,

            sourceItem:
              translationItem,
          },
        );

        /*
         * Save Tamil.
         */
        await saveTranslationForLanguage(
          {
            language:
              "TA",

            labelValue:
              translationForm.TA,

            sourceItem:
              translationItem,
          },
        );

        /*
         * Reload before order sync.
         */
        const latestEnglish =
          await loadLanguageMenu(
            "EN",
          );

        await synchronizeLanguageOrder(
          "SI",
          latestEnglish,
        );

        await synchronizeLanguageOrder(
          "TA",
          latestEnglish,
        );

        setSuccessMessage(
          "English, Sinhala and Tamil navigation labels saved successfully.",
        );

        closeTranslationModal();

        await loadAllMenus();
      } catch (
        translationError
      ) {
        console.error(
          "Failed to save translations:",
          translationError,
        );

        setError(
          translationError instanceof
            Error
            ? translationError.message
            : "Failed to save translations.",
        );
      } finally {
        setIsSavingTranslations(
          false,
        );
      }
    };

  /* =============================================================
     TOGGLE VISIBILITY
  ============================================================== */

  const toggleVisibility =
    async (
      item: MenuItem,
    ) => {
      /*
       * Visibility is controlled from
       * the English master structure.
       */
      if (
        selectedLanguage !==
        "EN"
      ) {
        setError(
          "Change menu visibility from English. The setting is shared across all languages.",
        );
        return;
      }

      try {
        setError("");
        setSuccessMessage("");

        const response =
          await fetch(
            "/api/admin/menu",
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                action:
                  "TOGGLE_VISIBILITY",

                id:
                  item.id,

                isVisible:
                  !item.visible,
              }),
            },
          );

        const data:
          ApiItemResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update visibility.",
          );
        }

        await loadAllMenus();

        setSuccessMessage(
          "Menu visibility updated successfully.",
        );
      } catch (
        visibilityError
      ) {
        console.error(
          "Failed to update visibility:",
          visibilityError,
        );

        setError(
          visibilityError instanceof
            Error
            ? visibilityError.message
            : "Failed to update visibility.",
        );
      }
    };

  /* =============================================================
     MOVE ITEM
  ============================================================== */

  const moveItem =
    async (
      id: string,
      direction:
        | "up"
        | "down",
    ) => {
      /*
       * Reordering is done from
       * the English master menu.
       */
      if (
        selectedLanguage !==
        "EN"
      ) {
        setError(
          "Change menu order from English. The structure/order is shared across all languages.",
        );
        return;
      }

      const index =
        items.findIndex(
          (item) =>
            item.id ===
            id,
        );

      if (
        index ===
        -1
      ) {
        return;
      }

      const targetIndex =
        direction ===
        "up"
          ? index - 1
          : index + 1;

      if (
        targetIndex <
          0 ||
        targetIndex >=
          items.length
      ) {
        return;
      }

      const updated =
        [...items];

      const temp =
        updated[index];

      updated[index] =
        updated[
          targetIndex
        ];

      updated[
        targetIndex
      ] = temp;

      const reordered =
        updated.map(
          (
            item,
            position,
          ) => ({
            ...item,
            position,
          }),
        );

      setItems(
        reordered,
      );

      try {
        setError("");
        setSuccessMessage("");

        const response =
          await fetch(
            "/api/admin/menu",
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                action:
                  "SAVE_ORDER",

                items:
                  reordered.map(
                    (
                      item,
                    ) => ({
                      id:
                        item.id,

                      position:
                        item.position,
                    }),
                  ),
              }),
            },
          );

        const data =
          (await response.json()) as {
            success: boolean;
            message?: string;
          };

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to save menu order.",
          );
        }

        await loadAllMenus();

        setSuccessMessage(
          "Menu order updated successfully.",
        );
      } catch (orderError) {
        console.error(
          "Failed to save menu order:",
          orderError,
        );

        await loadAllMenus();

        setError(
          orderError instanceof
            Error
            ? orderError.message
            : "Failed to save menu order.",
        );
      }
    };

  /* =============================================================
     DELETE
  ============================================================== */

  const deleteItem =
    async (
      item: MenuItem,
    ) => {
      if (
        selectedLanguage !==
        "EN"
      ) {
        setError(
          "Delete menu structure from English. Translation labels should be managed using Translate.",
        );
        return;
      }

      if (
        item.type ===
        "System"
      ) {
        window.alert(
          "System menu items cannot be deleted.",
        );
        return;
      }

      if (
        isHomeHref(
          item.href,
        )
      ) {
        window.alert(
          "Home is protected and cannot be deleted.",
        );
        return;
      }

      if (
        isWatchLiveHref(
          item.href,
        )
      ) {
        window.alert(
          "Watch Live is protected and cannot be deleted.",
        );
        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${item.label}" from the navigation? This will also remove its language versions.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          item.id,
        );

        setError("");
        setSuccessMessage("");

        /*
         * Delete English master.
         */
        const response =
          await fetch(
            `/api/admin/menu?id=${encodeURIComponent(
              item.id,
            )}`,
            {
              method: "DELETE",
            },
          );

        const data =
          (await response.json()) as {
            success: boolean;
            message?: string;
          };

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to delete menu item.",
          );
        }

        /*
         * Remove matching Sinhala/Tamil
         * translations too.
         */
        for (
          const language of [
            "SI",
            "TA",
          ] as MenuLanguage[]
        ) {
          const translatedItem =
            findItemForLanguage(
              item,
              language,
            );

          if (
            translatedItem
          ) {
            const translatedResponse =
              await fetch(
                `/api/admin/menu?id=${encodeURIComponent(
                  translatedItem.id,
                )}`,
                {
                  method:
                    "DELETE",
                },
              );

            const translatedData =
              (await translatedResponse.json()) as {
                success: boolean;
                message?: string;
              };

            if (
              !translatedResponse.ok ||
              !translatedData.success
            ) {
              console.warn(
                `Could not delete ${language} translation:`,
                translatedData.message,
              );
            }
          }
        }

        await loadAllMenus();

        setSuccessMessage(
          "Menu item and its translations were deleted successfully.",
        );
      } catch (
        deleteError
      ) {
        console.error(
          "Failed to delete menu item:",
          deleteError,
        );

        setError(
          deleteError instanceof
            Error
            ? deleteError.message
            : "Failed to delete menu item.",
        );
      } finally {
        setDeletingId(
          null,
        );
      }
    };

  /* =============================================================
     SAVE MENU
  ============================================================== */

  const saveMenu =
    async () => {
      try {
        setIsSaving(true);
        setError("");
        setSuccessMessage("");

        const englishOrder =
          [...allLanguageItems.EN]
            .sort(
              (a, b) =>
                a.position -
                b.position,
            );

        /*
         * Save English order.
         */
        if (
          englishOrder.length >
          0
        ) {
          const response =
            await fetch(
              "/api/admin/menu",
              {
                method: "PATCH",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  action:
                    "SAVE_ORDER",

                  items:
                    englishOrder.map(
                      (
                        item,
                        position,
                      ) => ({
                        id:
                          item.id,

                        position,
                      }),
                    ),
                }),
              },
            );

          const data =
            (await response.json()) as {
              success: boolean;
              message?: string;
            };

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to save menu.",
            );
          }
        }

        /*
         * Synchronize language order.
         */
        await synchronizeLanguageOrder(
          "SI",
          englishOrder,
        );

        await synchronizeLanguageOrder(
          "TA",
          englishOrder,
        );

        await loadAllMenus();

        setSuccessMessage(
          "Menu structure and language ordering saved successfully.",
        );
      } catch (
        saveError
      ) {
        console.error(
          "Failed to save menu:",
          saveError,
        );

        setError(
          saveError instanceof
            Error
            ? saveError.message
            : "Failed to save menu.",
        );
      } finally {
        setIsSaving(false);
      }
    };

  /* =============================================================
     PREVIEW HELPERS
  ============================================================== */

  const getPreviewHref =
    (
      value: string,
    ) =>
      normalizeHref(
        value,
      );

  const currentLanguage =
    selectedLanguage;

  /* =============================================================
     RENDER
  ============================================================== */

  return (
    <div className="space-y-6">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

        <div className="min-w-0">

          <p className="text-sm font-semibold text-pink-600">
            Website Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Menu
          </h1>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            Manage the public TV SUPREME
            navigation structure and its
            English, Sinhala and Tamil
            labels.
          </p>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* LANGUAGE SELECTOR */}

          <div className="relative">

            <select
              value={
                selectedLanguage
              }
              onChange={(
                event,
              ) =>
                handleLanguageChange(
                  event.target
                    .value as MenuLanguage,
                )
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
            >

              {languageOptions.map(
                (
                  option,
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                ),
              )}

            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={() =>
              void loadAllMenus()
            }
            disabled={
              isLoading ||
              isSaving ||
              isSavingTranslations
            }
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

          {/* ADD -- ENGLISH STRUCTURE ONLY */}

          <button
            type="button"
            onClick={
              openAddModal
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >

            <Plus
              size={17}
            />

            Add Menu Item

          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={() =>
              void saveMenu()
            }
            disabled={
              isSaving ||
              isLoading ||
              isSavingTranslations
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                Saving...
              </>
            ) : (
              <>
                <Save
                  size={16}
                />
                Save Menu
              </>
            )}

          </button>

        </div>

      </div>

      {/* =========================================================
          LANGUAGE TABS
      ========================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <Languages
                  size={18}
                />
              </div>

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Navigation Languages
                </h2>

                <p className="text-xs text-slate-500">
                  English controls the menu
                  structure. Sinhala and Tamil
                  provide translated labels.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            {languageOptions.map(
              (
                option,
              ) => {

                const count =
                  allLanguageItems[
                    option.value
                  ].length;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      handleLanguageChange(
                        option.value,
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      selectedLanguage ===
                      option.value
                        ? "border-pink-600 bg-pink-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-pink-300 hover:text-pink-600"
                    }`}
                  >

                    <span>
                      {
                        option.label
                      }
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        selectedLanguage ===
                        option.value
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>

                  </button>
                );
              },
            )}

          </div>

        </div>

      </section>

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
          TRANSLATION SUMMARY
      ========================================================== */}

      <div className="grid gap-4 sm:grid-cols-3">

        <LanguageSummaryCard
          language="EN"
          title="English"
          total={
            englishItems.length
          }
          translated={
            englishItems.length
          }
          description="Master navigation structure"
          active={
            currentLanguage ===
            "EN"
          }
          onClick={() =>
            handleLanguageChange(
              "EN",
            )
          }
        />

        <LanguageSummaryCard
          language="SI"
          title="Sinhala"
          total={
            englishItems.length
          }
          translated={
            translatedSinhalaCount
          }
          description="Translated navigation labels"
          active={
            currentLanguage ===
            "SI"
          }
          onClick={() =>
            handleLanguageChange(
              "SI",
            )
          }
        />

        <LanguageSummaryCard
          language="TA"
          title="Tamil"
          total={
            englishItems.length
          }
          translated={
            translatedTamilCount
          }
          description="Translated navigation labels"
          active={
            currentLanguage ===
            "TA"
          }
          onClick={() =>
            handleLanguageChange(
              "TA",
            )
          }
        />

      </div>

      {/* =========================================================
          STATS
      ========================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MenuStatCard
          title="Total Items"
          value={String(
            items.length,
          )}
          note={`${getLanguageLabel(
            selectedLanguage,
          )} navigation`}
          icon={
            <MenuIcon
              size={20}
            />
          }
        />

        <MenuStatCard
          title="Visible"
          value={String(
            visibleCount,
          )}
          note="Shown on website"
          icon={
            <Eye
              size={20}
            />
          }
          active
        />

        <MenuStatCard
          title="Hidden"
          value={String(
            hiddenCount,
          )}
          note="Currently disabled"
          icon={
            <EyeOff
              size={20}
            />
          }
        />

        <MenuStatCard
          title="Mobile Ready"
          value={String(
            mobileCount,
          )}
          note="Available on mobile"
          icon={
            <Smartphone
              size={20}
            />
          }
        />

      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">

        {/* =======================================================
            MAIN MENU
        ======================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <MenuIcon
                  size={20}
                />
              </div>

              <div className="min-w-0">

                <h2 className="text-lg font-semibold text-slate-900">
                  {getLanguageLabel(
                    selectedLanguage,
                  )} Navigation
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {selectedLanguage ===
                  "EN"
                    ? "Manage the master navigation structure and translations."
                    : "View the translated navigation labels. Use Translate on the English master item to edit labels."}
                </p>

              </div>

            </div>

            {/* FILTERS */}

            <div className="mt-5 flex flex-wrap gap-2">

              {typeFilters.map(
                (
                  filter,
                ) => (
                  <button
                    key={
                      filter.value
                    }
                    type="button"
                    onClick={() =>
                      setTypeFilter(
                        filter.value,
                      )
                    }
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                      typeFilter ===
                      filter.value
                        ? "bg-pink-50 text-pink-600"
                        : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {
                      filter.label
                    }
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setShowHiddenOnly(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  showHiddenOnly
                    ? "bg-slate-800 text-white"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >

                <EyeOff
                  size={13}
                />

                Hidden Only

              </button>

            </div>

          </div>

          {/* MENU LIST */}

          <div className="divide-y divide-slate-100">

            {isLoading ? (
              <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                  <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600" />

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading menu
                    items...
                  </p>

                </div>

              </div>
            ) : filteredItems.length >
              0 ? (
              filteredItems.map(
                (
                  item,
                ) => {

                  const originalIndex =
                    items.findIndex(
                      (
                        menuItem,
                      ) =>
                        menuItem.id ===
                        item.id,
                    );

                  const englishMaster =
                    selectedLanguage ===
                    "EN"
                      ? item
                      : getMatchingItem(
                          item,
                          "EN",
                        );

                  const hasSinhala =
                    englishMaster
                      ? getTranslationStatus(
                          englishMaster,
                          "SI",
                        )
                      : false;

                  const hasTamil =
                    englishMaster
                      ? getTranslationStatus(
                          englishMaster,
                          "TA",
                        )
                      : false;

                  return (
                    <div
                      key={
                        item.id
                      }
                      className={`p-4 transition sm:p-5 ${
                        item.visible
                          ? "bg-white"
                          : "bg-slate-50/70"
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        {/* GRIP */}

                        <div className="hidden shrink-0 pt-2 text-slate-300 sm:block">
                          <GripVertical
                            size={18}
                          />
                        </div>

                        {/* NUMBER */}

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            item.visible
                              ? "bg-pink-50 text-pink-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {String(
                            originalIndex +
                              1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        {/* ICON */}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                          {item.type ===
                          "Category" ? (
                            <Globe2
                              size={
                                17
                              }
                            />
                          ) : item.type ===
                            "Custom Link" ? (
                            <Link2
                              size={
                                17
                              }
                            />
                          ) : (
                            <FileMenuIcon />
                          )}
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3
                              className={`text-sm font-bold sm:text-base ${
                                item.visible
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              }`}
                            >
                              {
                                item.label
                              }
                            </h3>

                            <MenuTypeBadge
                              type={
                                item.type
                              }
                            />

                            {!item.visible && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                                Hidden
                              </span>
                            )}

                          </div>

                          <p
                            className={`mt-1 truncate text-xs ${
                              item.visible
                                ? "text-slate-400"
                                : "text-slate-300"
                            }`}
                          >
                            {
                              item.href
                            }
                          </p>

                          {/* TRANSLATION STATUS */}

                          {englishMaster && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">

                              <TranslationBadge
                                language="EN"
                                label="English"
                                translated
                              />

                              <TranslationBadge
                                language="SI"
                                label="Sinhala"
                                translated={
                                  hasSinhala
                                }
                              />

                              <TranslationBadge
                                language="TA"
                                label="Tamil"
                                translated={
                                  hasTamil
                                }
                              />

                            </div>
                          )}

                          {/* DEVICE SETTINGS */}

                          <div className="mt-2 flex flex-wrap items-center gap-2">

                            {item.desktop && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400">
                                <Monitor
                                  size={
                                    11
                                  }
                                />
                                Desktop
                              </span>
                            )}

                            {item.mobile && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400">
                                <Smartphone
                                  size={
                                    11
                                  }
                                />
                                Mobile
                              </span>
                            )}

                            {item.openNewTab && (
                              <span className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-medium text-purple-600">
                                New Tab
                              </span>
                            )}

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex shrink-0 items-center gap-1">

                          {/* TRANSLATE */}

                          {englishMaster && (
                            <button
                              type="button"
                              onClick={() =>
                                openTranslationModal(
                                  englishMaster,
                                )
                              }
                              className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-pink-600 transition hover:bg-pink-50"
                              aria-label={`Translate ${englishMaster.label}`}
                              title="Translate"
                            >
                              <Languages
                                size={
                                  15
                                }
                              />

                              <span className="hidden xl:inline">
                                Translate
                              </span>
                            </button>
                          )}

                          {/* MOVE UP */}

                          <button
                            type="button"
                            onClick={() =>
                              void moveItem(
                                item.id,
                                "up",
                              )
                            }
                            disabled={
                              selectedLanguage !==
                                "EN" ||
                              originalIndex ===
                                0
                            }
                            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
                            aria-label={`Move ${item.label} up`}
                          >
                            <ArrowUp
                              size={
                                15
                              }
                            />
                          </button>

                          {/* MOVE DOWN */}

                          <button
                            type="button"
                            onClick={() =>
                              void moveItem(
                                item.id,
                                "down",
                              )
                            }
                            disabled={
                              selectedLanguage !==
                                "EN" ||
                              originalIndex ===
                                items.length -
                                  1
                            }
                            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
                            aria-label={`Move ${item.label} down`}
                          >
                            <ArrowDown
                              size={
                                15
                              }
                            />
                          </button>

                          {/* VISIBILITY */}

                          <button
                            type="button"
                            onClick={() =>
                              void toggleVisibility(
                                item,
                              )
                            }
                            disabled={
                              selectedLanguage !==
                              "EN"
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                              item.visible
                                ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                : "text-pink-500 hover:bg-pink-50"
                            } disabled:cursor-not-allowed disabled:opacity-30`}
                            aria-label={
                              item.visible
                                ? `Hide ${item.label}`
                                : `Show ${item.label}`
                            }
                          >

                            {item.visible ? (
                              <EyeOff
                                size={
                                  15
                                }
                              />
                            ) : (
                              <Eye
                                size={
                                  15
                                }
                              />
                            )}

                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                selectedLanguage ===
                                "EN"
                              ) {
                                openEditModal(
                                  item,
                                );
                              } else if (
                                englishMaster
                              ) {
                                openTranslationModal(
                                  englishMaster,
                                );
                              }
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                            aria-label={`Edit ${item.label}`}
                            title={
                              selectedLanguage ===
                              "EN"
                                ? "Edit structure"
                                : "Edit translation"
                            }
                          >

                            {selectedLanguage ===
                            "EN" ? (
                              <Edit3
                                size={
                                  15
                                }
                              />
                            ) : (
                              <Languages
                                size={
                                  15
                                }
                              />
                            )}

                          </button>

                          {/* DELETE */}

                          {selectedLanguage ===
                            "EN" &&
                            item.type !==
                              "System" &&
                            !isHomeHref(
                              item.href,
                            ) &&
                            !isWatchLiveHref(
                              item.href,
                            ) && (
                              <button
                                type="button"
                                onClick={() =>
                                  void deleteItem(
                                    item,
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  item.id
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Delete ${item.label}`}
                              >
                                {deletingId ===
                                item.id ? (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                                ) : (
                                  <Trash2
                                    size={
                                      15
                                    }
                                  />
                                )}
                              </button>
                            )}

                        </div>

                      </div>

                      {/* MOBILE ORDER BUTTONS */}

                      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 sm:hidden">

                        <button
                          type="button"
                          onClick={() =>
                            void moveItem(
                              item.id,
                              "up",
                            )
                          }
                          disabled={
                            selectedLanguage !==
                              "EN" ||
                            originalIndex ===
                              0
                          }
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowUp
                            size={
                              13
                            }
                          />
                          Move Up
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void moveItem(
                              item.id,
                              "down",
                            )
                          }
                          disabled={
                            selectedLanguage !==
                              "EN" ||
                            originalIndex ===
                              items.length -
                                1
                          }
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowDown
                            size={
                              13
                            }
                          />
                          Move Down
                        </button>

                      </div>

                    </div>
                  );
                },
              )
            ) : (
              <div className="px-6 py-16 text-center">

                <div className="mx-auto flex max-w-md flex-col items-center">

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <MenuIcon
                      size={40}
                      className="text-slate-300"
                    />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-700">
                    No menu items
                    found
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {selectedLanguage ===
                    "EN"
                      ? "Add your first navigation item."
                      : `No ${getLanguageLabel(
                          selectedLanguage,
                        )} translations are available yet.`}
                  </p>

                  {selectedLanguage !==
                    "EN" &&
                    englishItems.length >
                      0 && (
                      <button
                        type="button"
                        onClick={() =>
                          openTranslationModal(
                            englishItems[0],
                          )
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                      >
                        <Languages
                          size={
                            15
                          }
                        />
                        Start Translation
                      </button>
                    )}

                  {selectedLanguage ===
                    "EN" && (
                    <button
                      type="button"
                      onClick={
                        openAddModal
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
                    >
                      <Plus
                        size={
                          15
                        }
                      />
                      Add Menu Item
                    </button>
                  )}

                </div>

              </div>
            )}

          </div>

          {/* FOOTER */}

          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

            <span>
              Showing{" "}
              {
                filteredItems.length
              }{" "}
              of{" "}
              {items.length}{" "}
              {
                getLanguageLabel(
                  selectedLanguage,
                )
              }{" "}
              menu items
            </span>

            <span>
              Menu data is stored
              in MySQL.
            </span>

          </div>

        </section>

        {/* =======================================================
            RIGHT SIDE
        ======================================================== */}

        <div className="space-y-6">

          {/* =====================================================
              TRANSLATION OVERVIEW
          ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Languages
                    size={20}
                  />
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Translation
                    Coverage
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Translate each English
                    navigation item into
                    Sinhala and Tamil.
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-3 p-5">

              <TranslationProgress
                title="English"
                translated={
                  englishItems.length
                }
                total={
                  englishItems.length
                }
              />

              <TranslationProgress
                title="Sinhala"
                translated={
                  translatedSinhalaCount
                }
                total={
                  englishItems.length
                }
              />

              <TranslationProgress
                title="Tamil"
                translated={
                  translatedTamilCount
                }
                total={
                  englishItems.length
                }
              />

            </div>

          </section>

          {/* =====================================================
              PREVIEW
          ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Eye
                    size={20}
                  />
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Menu Preview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Preview the public
                    navigation.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5">

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* PREVIEW HEADER */}

                <div className="flex items-center justify-between bg-[#3c2372] px-4 py-3">

                  <div className="text-xs font-black text-white">
                    TV SUPREME
                  </div>

                  <div className="h-2 w-12 rounded-full bg-white/30" />

                </div>

                {/* NAVIGATION */}

                <div className="border-b border-slate-100 bg-white px-3 py-3">

                  <div className="flex flex-wrap gap-1">

                    {(selectedLanguage ===
                    "EN"
                      ? englishItems
                      : selectedLanguage ===
                        "SI"
                      ? sinhalaItems
                      : tamilItems
                    )
                      .filter(
                        (
                          item,
                        ) =>
                          item.visible &&
                          item.desktop,
                      )
                      .sort(
                        (a, b) =>
                          a.position -
                          b.position,
                      )
                      .map(
                        (
                          item,
                        ) => (
                          <span
                            key={
                              item.id
                            }
                            className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                              isWatchLiveHref(
                                item.href,
                              )
                                ? "bg-pink-50 text-pink-600"
                                : "text-slate-500"
                            }`}
                          >
                            {
                              item.label
                            }
                          </span>
                        ),
                      )}

                  </div>

                </div>

                {/* MOBILE */}

                <div className="p-3">

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

                    <div className="flex items-center justify-between">

                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Mobile
                        Menu
                      </span>

                      <Smartphone
                        size={
                          14
                        }
                        className="text-slate-400"
                      />

                    </div>

                    <div className="mt-2 space-y-1">

                      {(selectedLanguage ===
                      "EN"
                        ? englishItems
                        : selectedLanguage ===
                          "SI"
                        ? sinhalaItems
                        : tamilItems
                      )
                        .filter(
                          (
                            item,
                          ) =>
                            item.visible &&
                            item.mobile,
                        )
                        .sort(
                          (a, b) =>
                            a.position -
                            b.position,
                        )
                        .slice(
                          0,
                          6,
                        )
                        .map(
                          (
                            item,
                          ) => (
                            <div
                              key={
                                item.id
                              }
                              className="rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-slate-600"
                            >
                              {
                                item.label
                              }
                            </div>
                          ),
                        )}

                    </div>

                  </div>

                </div>

              </div>

              {/* INFO */}

              <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/50 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-pink-600 shadow-sm">
                    <Globe2
                      size={15}
                    />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-700">
                      Current language
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Showing{" "}
                      <strong>
                        {
                          getLanguageLabel(
                            selectedLanguage,
                          )
                        }
                      </strong>{" "}
                      navigation.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              QUICK TRANSLATION
          ====================================================== */}

          {selectedLanguage !==
            "EN" &&
            englishItems.length >
              0 && (
              <section className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                    <Languages
                      size={19}
                    />
                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-slate-800">
                      Translation Mode
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      English controls
                      the navigation
                      structure. Use
                      Translate to add
                      or update the
                      {selectedLanguage ===
                      "SI"
                        ? " Sinhala "
                        : " Tamil "}
                      labels without
                      changing the URLs.
                    </p>

                  </div>

                </div>

              </section>
            )}

        </div>

      </div>

      {/* =========================================================
          STANDARD ADD / EDIT MODAL
      ========================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div>

                <p className="text-sm font-medium text-pink-600">
                  Website
                  Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingItem
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  English is the
                  master navigation
                  structure.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  isSavingItem
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X
                  size={19}
                />
              </button>

            </div>

            {/* FORM */}

            <div className="space-y-5 p-6">

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* LABEL */}

              <div>

                <label
                  htmlFor="menuLabel"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  English Menu
                  Label
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  id="menuLabel"
                  type="text"
                  value={
                    label
                  }
                  onChange={(
                    event,
                  ) =>
                    setLabel(
                      event.target
                        .value,
                    )
                  }
                  placeholder="e.g. Latest"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

              </div>

              {/* URL */}

              <div>

                <label
                  htmlFor="menuHref"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  URL
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  id="menuHref"
                  type="text"
                  value={
                    href
                  }
                  onChange={(
                    event,
                  ) =>
                    setHref(
                      event.target
                        .value,
                    )
                  }
                  placeholder="/latest"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter the internal
                  route without the
                  language prefix.
                  Example:
                  <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                    /latest
                  </code>
                  or
                  <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">
                    /sports
                  </code>
                </p>

              </div>

              {/* TYPE */}

              <div>

                <label
                  htmlFor="menuType"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Menu Type
                </label>

                <div className="relative">

                  <select
                    id="menuType"
                    value={
                      type
                    }
                    onChange={(
                      event,
                    ) =>
                      setType(
                        event.target
                          .value as MenuType,
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
                  >

                    <option value="Page">
                      Page
                    </option>

                    <option value="Category">
                      Category
                    </option>

                    <option value="Custom Link">
                      Custom Link
                    </option>

                    <option value="System">
                      System
                    </option>

                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

                {type ===
                  "System" && (
                  <p className="mt-2 text-xs text-amber-600">
                    System items are
                    protected.
                  </p>
                )}

              </div>

              {/* VISIBILITY */}

              <div>

                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Visibility
                </p>

                <div className="space-y-3">

                  <ToggleRow
                    title="Visible on website"
                    description="Show this item in the public navigation."
                    enabled={
                      visible
                    }
                    onToggle={() =>
                      setVisible(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                  />

                  <ToggleRow
                    title="Desktop"
                    description="Show this item on desktop navigation."
                    enabled={
                      desktop
                    }
                    onToggle={() =>
                      setDesktop(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                  />

                  <ToggleRow
                    title="Mobile"
                    description="Show this item in the mobile menu."
                    enabled={
                      mobile
                    }
                    onToggle={() =>
                      setMobile(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                  />

                  <ToggleRow
                    title="Open in new tab"
                    description="Open this link in a separate browser tab."
                    enabled={
                      openNewTab
                    }
                    onToggle={() =>
                      setOpenNewTab(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                  />

                </div>

              </div>

              {/* PREVIEW */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Preview
                </p>

                <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                    <Link2
                      size={16}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {label ||
                        "Menu Label"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {normalizeHref(
                        href,
                      ) ||
                        "/example"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  isSavingItem
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void saveItem()
                }
                disabled={
                  !label.trim() ||
                  !href.trim() ||
                  isSavingItem
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isSavingItem ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check
                      size={16}
                    />

                    {editingItem
                      ? "Save Changes"
                      : "Add Menu Item"}
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          TRANSLATION MODAL
      ========================================================== */}

      {showTranslationModal &&
        translationItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                      <Languages
                        size={17}
                      />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-pink-600">
                        Navigation
                        Translation
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {translationItem.label}
                      </h2>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    closeTranslationModal
                  }
                  disabled={
                    isSavingTranslations
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X
                    size={19}
                  />
                </button>

              </div>

              {/* BODY */}

              <div className="space-y-5 p-6">

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <div className="rounded-xl border border-pink-100 bg-pink-50/60 p-4">

                  <div className="flex items-start gap-3">

                    <Globe2
                      size={18}
                      className="mt-0.5 shrink-0 text-pink-600"
                    />

                    <div>

                      <p className="text-sm font-semibold text-slate-800">
                        One navigation item,
                        three languages
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        The URL, position,
                        visibility and device
                        settings are shared
                        from the English master.
                        Only the displayed
                        labels change by
                        language.
                      </p>

                    </div>

                  </div>

                </div>

                {/* ENGLISH */}

                <TranslationInput
                  language="EN"
                  title="English"
                  description="Master navigation label"
                  value={
                    translationForm.EN
                  }
                  onChange={(
                    value,
                  ) =>
                    updateTranslation(
                      "EN",
                      value,
                    )
                  }
                  required
                />

                {/* SINHALA */}

                <TranslationInput
                  language="SI"
                  title="Sinhala"
                  description="Sinhala navigation label"
                  value={
                    translationForm.SI
                  }
                  onChange={(
                    value,
                  ) =>
                    updateTranslation(
                      "SI",
                      value,
                    )
                  }
                  placeholder="උදා: නවතම"
                />

                {/* TAMIL */}

                <TranslationInput
                  language="TA"
                  title="Tamil"
                  description="Tamil navigation label"
                  value={
                    translationForm.TA
                  }
                  onChange={(
                    value,
                  ) =>
                    updateTranslation(
                      "TA",
                      value,
                    )
                  }
                  placeholder="உதா: சமீபத்திய"
                />

                {/* LINK INFORMATION */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="grid gap-4 sm:grid-cols-3">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        URL
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                        {
                          translationItem.href
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Type
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {
                          translationItem.type
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Position
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {translationItem.position +
                          1}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-slate-400">
                  Empty Sinhala or Tamil
                  fields are left untranslated.
                </p>

                <div className="flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={
                      closeTranslationModal
                    }
                    disabled={
                      isSavingTranslations
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void saveTranslations()
                    }
                    disabled={
                      !translationForm.EN.trim() ||
                      isSavingTranslations
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {isSavingTranslations ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check
                          size={16}
                        />
                        Save
                        Translations
                      </>
                    )}

                  </button>

                </div>

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

function MenuStatCard({
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
   LANGUAGE SUMMARY CARD
=============================================================== */

function LanguageSummaryCard({
  language,
  title,
  total,
  translated,
  description,
  active,
  onClick,
}: {
  language: MenuLanguage;
  title: string;
  total: number;
  translated: number;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (translated /
            total) *
            100,
        );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
        active
          ? "border-pink-300 ring-4 ring-pink-50"
          : "border-slate-200 hover:border-pink-200 hover:shadow-md"
      }`}
    >

      <div className="flex items-start justify-between gap-3">

        <div>

          <div className="flex items-center gap-2">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-xs font-bold text-pink-600">
              {language}
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {title}
            </span>

          </div>

          <p className="mt-3 text-xs text-slate-500">
            {description}
          </p>

        </div>

        <span className="text-xl font-bold text-slate-900">
          {percentage}%
        </span>

      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-600 to-purple-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-2 text-xs text-slate-400">
        {translated} of{" "}
        {total} translated
      </p>

    </button>
  );
}

/* ===============================================================
   TRANSLATION BADGE
=============================================================== */

function TranslationBadge({
  language,
  label,
  translated,
}: {
  language: MenuLanguage;
  label: string;
  translated: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${
        translated
          ? "bg-emerald-50 text-emerald-600"
          : "bg-slate-100 text-slate-400"
      }`}
      title={`${label}: ${
        translated
          ? "Translated"
          : "Not translated"
      }`}
    >
      {translated ? (
        <Check
          size={10}
        />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {language}

    </span>
  );
}

/* ===============================================================
   TRANSLATION PROGRESS
=============================================================== */

function TranslationProgress({
  title,
  translated,
  total,
}: {
  title: string;
  translated: number;
  total: number;
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (translated /
            total) *
            100,
        );

  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-xs font-semibold text-slate-700">
          {title}
        </span>

        <span className="text-[10px] font-semibold text-slate-400">
          {translated}/
          {total}
        </span>

      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-600 to-purple-600"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

/* ===============================================================
   TRANSLATION INPUT
=============================================================== */

function TranslationInput({
  language,
  title,
  description,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  language: MenuLanguage;
  title: string;
  description: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center gap-2">

        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-[10px] font-bold text-pink-600">
          {language}
        </span>

        <div>

          <label
            className="block text-sm font-semibold text-slate-700"
          >
            {title}
            {required && (
              <span className="ml-1 text-pink-600">
                *
              </span>
            )}
          </label>

          <p className="text-xs text-slate-400">
            {description}
          </p>

        </div>

      </div>

      <input
        type="text"
        value={
          value
        }
        onChange={(event) =>
          onChange(
            event.target
              .value,
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
      />

    </div>
  );
}

/* ===============================================================
   MENU TYPE BADGE
=============================================================== */

function MenuTypeBadge({
  type,
}: {
  type: MenuType;
}) {
  const styles: Record<
    MenuType,
    string
  > = {
    Page:
      "bg-blue-50 text-blue-600",

    Category:
      "bg-purple-50 text-purple-600",

    "Custom Link":
      "bg-amber-50 text-amber-700",

    System:
      "bg-pink-50 text-pink-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[type]}`}
    >
      {type}
    </span>
  );
}

/* ===============================================================
   TOGGLE ROW
=============================================================== */

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">

      <div className="min-w-0">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>

      </div>

      <button
        type="button"
        role="switch"
        aria-checked={
          enabled
        }
        aria-label={
          title
        }
        onClick={
          onToggle
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-gradient-to-r from-pink-600 to-purple-600"
            : "bg-slate-200"
        }`}
      >

        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-[22px]"
              : "left-0.5"
          }`}
        />

      </button>

    </div>
  );
}

/* ===============================================================
   FILE MENU ICON
=============================================================== */

function FileMenuIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}
