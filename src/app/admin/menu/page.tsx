"use client";

import { useMemo, useState } from "react";
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
  Link2,
  Menu as MenuIcon,
  Plus,
  Save,
  Smartphone,
  Trash2,
  X,
  Monitor,
} from "lucide-react";

type MenuType = "Page" | "Category" | "Custom Link" | "System";

type MenuItem = {
  id: number;
  label: string;
  href: string;
  type: MenuType;
  visible: boolean;
  desktop: boolean;
  mobile: boolean;
  openNewTab: boolean;
};

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    label: "Home",
    href: "/en",
    type: "System",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 2,
    label: "Latest",
    href: "/en/latest",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 3,
    label: "Sri Lanka",
    href: "/en/sri-lanka",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 4,
    label: "World",
    href: "/en/world",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 5,
    label: "Politics",
    href: "/en/politics",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 6,
    label: "Business",
    href: "/en/business",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 7,
    label: "Sports",
    href: "/en/sports",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 8,
    label: "Entertainment",
    href: "/en/entertainment",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 9,
    label: "Technology",
    href: "/en/technology",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 10,
    label: "Lifestyle",
    href: "/en/lifestyle",
    type: "Category",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 11,
    label: "Video",
    href: "/en/video",
    type: "Page",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
  {
    id: 12,
    label: "Watch Live",
    href: "/en/live-tv",
    type: "System",
    visible: true,
    desktop: true,
    mobile: true,
    openNewTab: false,
  },
];

const typeFilters = [
  { label: "All Items", value: "All" },
  { label: "Pages", value: "Page" },
  { label: "Categories", value: "Category" },
  { label: "Custom Links", value: "Custom Link" },
  { label: "System", value: "System" },
] as const;

export default function MenuPage() {
  const [items, setItems] =
    useState<MenuItem[]>(initialMenuItems);

  const [typeFilter, setTypeFilter] =
    useState<(typeof typeFilters)[number]["value"]>("All");

  const [showHiddenOnly, setShowHiddenOnly] =
    useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [type, setType] =
    useState<MenuType>("Custom Link");
  const [visible, setVisible] = useState(true);
  const [desktop, setDesktop] = useState(true);
  const [mobile, setMobile] = useState(true);
  const [openNewTab, setOpenNewTab] = useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const visibleCount = items.filter(
    (item) => item.visible
  ).length;

  const hiddenCount = items.filter(
    (item) => !item.visible
  ).length;

  const desktopCount = items.filter(
    (item) => item.desktop
  ).length;

  const mobileCount = items.filter(
    (item) => item.mobile
  ).length;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      const matchesVisibility =
        !showHiddenOnly || !item.visible;

      return matchesType && matchesVisibility;
    });
  }, [items, typeFilter, showHiddenOnly]);

  const resetForm = () => {
    setLabel("");
    setHref("");
    setType("Custom Link");
    setVisible(true);
    setDesktop(true);
    setMobile(true);
    setOpenNewTab(false);
    setEditingItem(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setHref(item.href);
    setType(item.type);
    setVisible(item.visible);
    setDesktop(item.desktop);
    setMobile(item.mobile);
    setOpenNewTab(item.openNewTab);
    setShowModal(true);
  };

  const toggleVisibility = (id: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              visible: !item.visible,
            }
          : item
      )
    );
  };

  const moveItem = (
    id: number,
    direction: "up" | "down"
  ) => {
    setItems((current) => {
      const index = current.findIndex(
        (item) => item.id === id
      );

      if (index === -1) {
        return current;
      }

      const targetIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= current.length
      ) {
        return current;
      }

      const updated = [...current];
      const temp = updated[index];

      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      return updated;
    });
  };

  const deleteItem = (id: number) => {
    const item = items.find(
      (menuItem) => menuItem.id === id
    );

    if (!item) {
      return;
    }

    if (item.type === "System") {
      window.alert(
        "System menu items cannot be deleted from the UI."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${item.label}" from the menu?`
    );

    if (!confirmed) {
      return;
    }

    setItems((current) =>
      current.filter((menuItem) => menuItem.id !== id)
    );
  };

  const saveItem = () => {
    const cleanLabel = label.trim();
    const cleanHref = href.trim();

    if (!cleanLabel || !cleanHref) {
      return;
    }

    if (editingItem) {
      const updatedItem: MenuItem = {
        ...editingItem,
        label: cleanLabel,
        href: cleanHref,
        type,
        visible,
        desktop,
        mobile,
        openNewTab,
      };

      setItems((current) =>
        current.map((item) =>
          item.id === editingItem.id
            ? updatedItem
            : item
        )
      );
    } else {
      const newItem: MenuItem = {
        id:
          Math.max(
            0,
            ...items.map((item) => item.id)
          ) + 1,
        label: cleanLabel,
        href: cleanHref,
        type,
        visible,
        desktop,
        mobile,
        openNewTab,
      };

      setItems((current) => [
        ...current,
        newItem,
      ]);
    }

    closeModal();
  };

  const saveMenu = () => {
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
            Website Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Menu
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage the public TV SUPREME navigation menu,
            ordering and visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={17} />
            Add Menu Item
          </button>

          <button
            type="button"
            onClick={saveMenu}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved ? (
              <>
                <Check
                  size={16}
                  className="text-emerald-600"
                />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                {saving ? "Saving..." : "Save Menu"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          STATS
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MenuStatCard
          title="Total Items"
          value={String(items.length)}
          note="Navigation items"
          icon={<MenuIcon size={20} />}
        />

        <MenuStatCard
          title="Visible"
          value={String(visibleCount)}
          note="Shown on website"
          icon={<Eye size={20} />}
          active
        />

        <MenuStatCard
          title="Hidden"
          value={String(hiddenCount)}
          note="Currently disabled"
          icon={<EyeOff size={20} />}
        />

        <MenuStatCard
          title="Mobile Ready"
          value={String(mobileCount)}
          note="Available on mobile"
          icon={<Smartphone size={20} />}
        />
      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================== */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        {/* =======================================================
            MENU ITEMS
        ======================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <MenuIcon size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Navigation Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Change the order and visibility of your public
                  navigation links.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-wrap gap-2">
              {typeFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setTypeFilter(filter.value)
                  }
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    typeFilter === filter.value
                      ? "bg-pink-50 text-pink-600"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setShowHiddenOnly(!showHiddenOnly)
                }
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  showHiddenOnly
                    ? "bg-slate-800 text-white"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <EyeOff size={13} />
                Hidden Only
              </button>
            </div>
          </div>

          {/* Menu List */}
          <div className="divide-y divide-slate-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const originalIndex = items.findIndex(
                  (menuItem) =>
                    menuItem.id === item.id
                );

                return (
                  <div
                    key={item.id}
                    className={`p-4 transition sm:p-5 ${
                      item.visible
                        ? "bg-white"
                        : "bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Drag Icon */}
                      <div className="hidden shrink-0 text-slate-300 sm:block">
                        <GripVertical size={18} />
                      </div>

                      {/* Number */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          item.visible
                            ? "bg-pink-50 text-pink-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {String(
                          originalIndex + 1
                        ).padStart(2, "0")}
                      </div>

                      {/* Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                        {item.type === "Category" ? (
                          <Globe2 size={17} />
                        ) : item.type ===
                          "Custom Link" ? (
                          <Link2 size={17} />
                        ) : (
                          <FileMenuIcon />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm font-bold ${
                              item.visible
                                ? "text-slate-800"
                                : "text-slate-400"
                            }`}
                          >
                            {item.label}
                          </h3>

                          <MenuTypeBadge
                            type={item.type}
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
                          {item.href}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {item.desktop && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400">
                              <Monitor size={11} />
                              Desktop
                            </span>
                          )}

                          {item.mobile && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400">
                              <Smartphone size={11} />
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

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            moveItem(item.id, "up")
                          }
                          disabled={originalIndex === 0}
                          className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
                          aria-label={`Move ${item.label} up`}
                        >
                          <ArrowUp size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveItem(item.id, "down")
                          }
                          disabled={
                            originalIndex ===
                            items.length - 1
                          }
                          className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
                          aria-label={`Move ${item.label} down`}
                        >
                          <ArrowDown size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleVisibility(item.id)
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            item.visible
                              ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              : "text-pink-500 hover:bg-pink-50"
                          }`}
                          aria-label={
                            item.visible
                              ? `Hide ${item.label}`
                              : `Show ${item.label}`
                          }
                        >
                          {item.visible ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                          aria-label={`Edit ${item.label}`}
                        >
                          <Edit3 size={15} />
                        </button>

                        {item.type !== "System" && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteItem(item.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${item.label}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mobile ordering buttons */}
                    <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 sm:hidden">
                      <button
                        type="button"
                        onClick={() =>
                          moveItem(item.id, "up")
                        }
                        disabled={originalIndex === 0}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                        Move Up
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveItem(item.id, "down")
                        }
                        disabled={
                          originalIndex ===
                          items.length - 1
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                        Move Down
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <MenuIcon
                      size={40}
                      className="text-slate-300"
                    />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-700">
                    No menu items found
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Try another filter or add a new menu item.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredItems.length} of{" "}
              {items.length} menu items
            </span>

            <span>
              Menu changes are currently UI-only.
            </span>
          </div>
        </section>

        {/* =======================================================
            PREVIEW + SETTINGS
        ======================================================== */}
        <div className="space-y-6">
          {/* Public Menu Preview */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Eye size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Menu Preview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Preview the visible public navigation.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Preview Header */}
                <div className="flex items-center justify-between bg-[#3c2372] px-4 py-3">
                  <div className="text-xs font-black text-white">
                    TV SUPREME
                  </div>

                  <div className="h-2 w-12 rounded-full bg-white/30" />
                </div>

                {/* Desktop Menu */}
                <div className="border-b border-slate-100 bg-white px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {items
                      .filter(
                        (item) =>
                          item.visible &&
                          item.desktop
                      )
                      .map((item) => (
                        <span
                          key={item.id}
                          className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                            item.label ===
                            "Watch Live"
                              ? "bg-pink-50 text-pink-600"
                              : "text-slate-500"
                          }`}
                        >
                          {item.label}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Mobile Preview */}
                <div className="p-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Mobile Menu
                      </span>

                      <Smartphone
                        size={14}
                        className="text-slate-400"
                      />
                    </div>

                    <div className="mt-2 space-y-1">
                      {items
                        .filter(
                          (item) =>
                            item.visible &&
                            item.mobile
                        )
                        .slice(0, 5)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-slate-600"
                          >
                            {item.label}
                          </div>
                        ))}

                      {mobileCount > 5 && (
                        <div className="pt-1 text-center text-[9px] font-medium text-slate-400">
                          + {mobileCount - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Visibility Summary */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Visibility Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Where your menu items are currently available.
              </p>
            </div>

            <div className="space-y-3 p-5">
              <VisibilityRow
                icon={<Monitor size={16} />}
                label="Desktop"
                value={`${desktopCount} items`}
              />

              <VisibilityRow
                icon={<Smartphone size={16} />}
                label="Mobile"
                value={`${mobileCount} items`}
              />

              <VisibilityRow
                icon={<Eye size={16} />}
                label="Visible"
                value={`${visibleCount} items`}
              />

              <VisibilityRow
                icon={<EyeOff size={16} />}
                label="Hidden"
                value={`${hiddenCount} items`}
              />
            </div>
          </section>

          {/* Menu Information */}
          <section className="rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                <Globe2 size={17} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Public Navigation
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  The menu controls the navigation displayed
                  across the public TV SUPREME website. Language
                  versions can later use the same menu structure
                  with translated labels.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

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
                  Website Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {editingItem
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
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
              {/* Label */}
              <div>
                <label
                  htmlFor="menuLabel"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Menu Label
                  <span className="ml-1 text-pink-600">
                    *
                  </span>
                </label>

                <input
                  id="menuLabel"
                  type="text"
                  value={label}
                  onChange={(event) =>
                    setLabel(event.target.value)
                  }
                  placeholder="e.g. Latest News"
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

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                  <span className="pl-4 text-sm text-slate-400">
                    /
                  </span>

                  <input
                    id="menuHref"
                    type="text"
                    value={href}
                    onChange={(event) =>
                      setHref(event.target.value)
                    }
                    placeholder="en/latest"
                    className="min-w-0 flex-1 bg-transparent px-1 py-3 pr-4 text-sm text-slate-700 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Example: en/latest or an external URL.
                </p>
              </div>

              {/* Type */}
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
                    value={type}
                    onChange={(event) =>
                      setType(
                        event.target.value as MenuType
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
              </div>

              {/* Visibility */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Visibility
                </p>

                <div className="space-y-3">
                  <ToggleRow
                    title="Visible on website"
                    description="Show this menu item in the public navigation."
                    enabled={visible}
                    onToggle={() =>
                      setVisible(!visible)
                    }
                  />

                  <ToggleRow
                    title="Desktop"
                    description="Display this item on desktop navigation."
                    enabled={desktop}
                    onToggle={() =>
                      setDesktop(!desktop)
                    }
                  />

                  <ToggleRow
                    title="Mobile"
                    description="Display this item in the mobile menu."
                    enabled={mobile}
                    onToggle={() =>
                      setMobile(!mobile)
                    }
                  />

                  <ToggleRow
                    title="Open in new tab"
                    description="Open the link in a separate browser tab."
                    enabled={openNewTab}
                    onToggle={() =>
                      setOpenNewTab(!openNewTab)
                    }
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Menu Preview
                </p>

                <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                    <Link2 size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {label || "Menu Label"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {href || "/example"}
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
                onClick={saveItem}
                disabled={
                  !label.trim() || !href.trim()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />

                {editingItem
                  ? "Save Changes"
                  : "Add Menu Item"}
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
   MENU TYPE BADGE
================================================================ */

function MenuTypeBadge({
  type,
}: {
  type: MenuType;
}) {
  const styles: Record<MenuType, string> = {
    Page: "bg-blue-50 text-blue-600",
    Category: "bg-purple-50 text-purple-600",
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
   VISIBILITY ROW
================================================================ */

function VisibilityRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-pink-600 shadow-sm">
          {icon}
        </div>

        <span className="text-sm font-semibold text-slate-700">
          {label}
        </span>
      </div>

      <span className="text-xs font-medium text-slate-400">
        {value}
      </span>
    </div>
  );
}

/* ===============================================================
   TOGGLE ROW
================================================================ */

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
        aria-checked={enabled}
        aria-label={title}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-gradient-to-r from-pink-600 to-purple-600"
            : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* ===============================================================
   MENU ICON
================================================================ */

function FileMenuIcon() {
  return <FileTextIcon />;
}

function FileTextIcon() {
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
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}