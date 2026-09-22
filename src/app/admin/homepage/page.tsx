"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  LayoutDashboard,
  Pencil,
  Plus,
  Save,
  Sparkles,
  TrendingUp,
  Video,
  X,
} from "lucide-react";

/* ===============================================================
   TYPES
================================================================ */

type SectionType =
  | "Hero"
  | "Latest News"
  | "Explore Categories"
  | "Live TV"
  | "Featured Videos"
  | "Trending"
  | "Top Stories"
  | "Promo";

type HomepageSection = {
  id: number;
  name: string;
  type: SectionType;
  description: string;
  enabled: boolean;
  items: number;
};

/* ===============================================================
   INITIAL DATA
================================================================ */

const initialSections: HomepageSection[] = [
  {
    id: 1,
    name: "Hero Story",
    type: "Hero",
    description: "Main featured story displayed at the top of the homepage.",
    enabled: true,
    items: 1,
  },
  {
    id: 2,
    name: "Latest News",
    type: "Latest News",
    description: "Latest published news stories from across the newsroom.",
    enabled: true,
    items: 5,
  },
  {
    id: 3,
    name: "Explore by Category",
    type: "Explore Categories",
    description: "Quick navigation to the main news categories.",
    enabled: true,
    items: 8,
  },
  {
    id: 4,
    name: "Live TV",
    type: "Live TV",
    description: "TV SUPREME live television player and broadcast area.",
    enabled: true,
    items: 1,
  },
  {
    id: 5,
    name: "Featured Videos",
    type: "Featured Videos",
    description: "Featured video news and programmes.",
    enabled: true,
    items: 4,
  },
  {
    id: 6,
    name: "Trending",
    type: "Trending",
    description: "Popular topics and stories currently trending.",
    enabled: true,
    items: 5,
  },
  {
    id: 7,
    name: "Top Stories",
    type: "Top Stories",
    description: "High-priority stories selected for homepage visibility.",
    enabled: true,
    items: 4,
  },
  {
    id: 8,
    name: "Homepage Promotion",
    type: "Promo",
    description: "Promotional banner or campaign displayed on the homepage.",
    enabled: true,
    items: 1,
  },
];

/* ===============================================================
   CATEGORY DATA
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

const heroStories = [
  "Sri Lanka steps into a brighter future",
  "President stresses unity for a stronger Sri Lanka",
  "New investment to create thousands of jobs",
  "Sri Lanka eye series win in final Test",
];

const promoOptions = [
  "Homepage Promotion",
  "Back to School Program 2026",
  "Colombo Comic Expo",
  "TV SUPREME Special",
];

/* ===============================================================
   PAGE
================================================================ */

export default function HomepagePage() {
  const [sections, setSections] =
    useState<HomepageSection[]>(initialSections);

  const [heroStory, setHeroStory] = useState(
    "Sri Lanka steps into a brighter future"
  );

  const [heroCategory, setHeroCategory] = useState("Sri Lanka");

  const [featuredCategory, setFeaturedCategory] =
    useState("All Categories");

  const [featuredCount, setFeaturedCount] = useState("4");

  const [promo, setPromo] = useState("Homepage Promotion");

  const [showHeroDescription, setShowHeroDescription] =
    useState(true);

  const [autoRotateHero, setAutoRotateHero] = useState(false);

  const [showLatestMore, setShowLatestMore] = useState(true);

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [editingSection, setEditingSection] =
    useState<HomepageSection | null>(null);

  const [editName, setEditName] = useState("");

  const [editDescription, setEditDescription] = useState("");

  /* =============================================================
     STATS
  ============================================================== */

  const enabledSections = useMemo(
    () => sections.filter((section) => section.enabled).length,
    [sections]
  );

  const hiddenSections = useMemo(
    () => sections.filter((section) => !section.enabled).length,
    [sections]
  );

  const totalItems = useMemo(
    () =>
      sections
        .filter((section) => section.enabled)
        .reduce((sum, section) => sum + section.items, 0),
    [sections]
  );

  /* =============================================================
     SECTION ACTIONS
  ============================================================== */

  const toggleSection = (id: number) => {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? {
              ...section,
              enabled: !section.enabled,
            }
          : section
      )
    );
  };

  const moveSection = (
    id: number,
    direction: "up" | "down"
  ) => {
    setSections((current) => {
      const index = current.findIndex(
        (section) => section.id === id
      );

      if (index === -1) return current;

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

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

  const openEditSection = (section: HomepageSection) => {
    setEditingSection(section);
    setEditName(section.name);
    setEditDescription(section.description);
  };

  const closeEditSection = () => {
    setEditingSection(null);
    setEditName("");
    setEditDescription("");
  };

  const saveSectionChanges = () => {
    if (!editingSection) return;

    const cleanName = editName.trim();

    if (!cleanName) return;

    setSections((current) =>
      current.map((section) =>
        section.id === editingSection.id
          ? {
              ...section,
              name: cleanName,
              description:
                editDescription.trim() ||
                "Homepage content section.",
            }
          : section
      )
    );

    closeEditSection();
  };

  /* =============================================================
     SAVE HOMEPAGE
  ============================================================== */

  const saveHomepage = () => {
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

  /* =============================================================
     RETURN
  ============================================================== */

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
            Homepage Manager
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Control which sections appear on the public TV
            SUPREME homepage and arrange their order.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <Eye size={16} />
            Preview Website
          </button>

          <button
            type="button"
            onClick={saveHomepage}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                {saving ? "Saving..." : "Save Homepage"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          STATS
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HomepageStatCard
          title="Total Sections"
          value={String(sections.length)}
          note="Homepage sections"
          icon={<LayoutDashboard size={20} />}
        />

        <HomepageStatCard
          title="Visible Sections"
          value={String(enabledSections)}
          note="Currently displayed"
          icon={<Eye size={20} />}
          active
        />

        <HomepageStatCard
          title="Hidden Sections"
          value={String(hiddenSections)}
          note="Currently disabled"
          icon={<EyeOff size={20} />}
        />

        <HomepageStatCard
          title="Content Items"
          value={String(totalItems)}
          note="Across visible sections"
          icon={<Sparkles size={20} />}
        />
      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================== */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        {/* =======================================================
            SECTION ORDER
        ======================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <LayoutDashboard size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Homepage Sections
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Drag-style controls are represented by the
                  arrows. Move sections up or down to change
                  homepage order.
                </p>
              </div>
            </div>
          </div>

          {/* Section List */}
          <div className="divide-y divide-slate-100">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`p-4 transition sm:p-5 ${
                  section.enabled
                    ? "bg-white"
                    : "bg-slate-50/70"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Grip */}
                  <div className="hidden pt-2 text-slate-300 sm:block">
                    <GripVertical size={18} />
                  </div>

                  {/* Number */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      section.enabled
                        ? "bg-pink-50 text-pink-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800">
                            {section.name}
                          </h3>

                          <SectionTypeBadge
                            type={section.type}
                          />

                          {section.enabled ? (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                              Visible
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                              Hidden
                            </span>
                          )}
                        </div>

                        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
                          {section.description}
                        </p>

                        <p className="mt-2 text-xs font-medium text-slate-500">
                          {section.items}{" "}
                          {section.items === 1
                            ? "content item"
                            : "content items"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            moveSection(section.id, "up")
                          }
                          disabled={index === 0}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`Move ${section.name} up`}
                        >
                          <ArrowUp size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveSection(section.id, "down")
                          }
                          disabled={
                            index === sections.length - 1
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`Move ${section.name} down`}
                        >
                          <ArrowDown size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditSection(section)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-pink-50 hover:text-pink-600"
                          aria-label={`Edit ${section.name}`}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleSection(section.id)
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            section.enabled
                              ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              : "text-pink-500 hover:bg-pink-50"
                          }`}
                          aria-label={
                            section.enabled
                              ? `Hide ${section.name}`
                              : `Show ${section.name}`
                          }
                        >
                          {section.enabled ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {enabledSections} of {sections.length} sections
              visible
            </span>

            <span>
              Homepage configuration is currently UI-only.
            </span>
          </div>
        </section>

        {/* =======================================================
            HOMEPAGE PREVIEW / QUICK SETTINGS
        ======================================================== */}
        <div className="space-y-6">
          {/* Preview */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Eye size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Homepage Preview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Quick visual representation of the current
                    section order.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {/* Fake website header */}
                <div className="flex items-center justify-between bg-[#3c2372] px-4 py-3">
                  <div className="text-xs font-black tracking-tight text-white">
                    TV SUPREME
                  </div>

                  <div className="h-2 w-20 rounded-full bg-white/30" />
                </div>

                {/* Sections */}
                <div className="space-y-2 p-3">
                  {sections
                    .filter((section) => section.enabled)
                    .slice(0, 6)
                    .map((section, index) => (
                      <div
                        key={section.id}
                        className={`rounded-xl border bg-white p-3 ${
                          index === 0
                            ? "border-pink-200"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              index === 0
                                ? "bg-pink-50 text-pink-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {getSectionIcon(
                              section.type
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-700">
                              {section.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              Homepage section
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <ExternalPreviewIcon />
                Open Public Homepage
              </button>
            </div>
          </section>

          {/* Quick Settings */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Control the main homepage content selection.
              </p>
            </div>

            <div className="space-y-5 p-5">
              {/* Hero Story */}
              <div>
                <label
                  htmlFor="heroStory"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Hero Story
                </label>

                <div className="relative">
                  <select
                    id="heroStory"
                    value={heroStory}
                    onChange={(event) =>
                      setHeroStory(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                  >
                    {heroStories.map((story) => (
                      <option key={story} value={story}>
                        {story}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Hero Category */}
              <div>
                <label
                  htmlFor="heroCategory"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Hero Category
                </label>

                <div className="relative">
                  <select
                    id="heroCategory"
                    value={heroCategory}
                    onChange={(event) =>
                      setHeroCategory(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Featured Category */}
              <div>
                <label
                  htmlFor="featuredCategory"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Featured Videos Category
                </label>

                <div className="relative">
                  <select
                    id="featuredCategory"
                    value={featuredCategory}
                    onChange={(event) =>
                      setFeaturedCategory(
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                  >
                    <option>All Categories</option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Featured Count */}
              <div>
                <label
                  htmlFor="featuredCount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Featured Video Count
                </label>

                <div className="relative">
                  <select
                    id="featuredCount"
                    value={featuredCount}
                    onChange={(event) =>
                      setFeaturedCount(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                  >
                    <option value="3">3 Videos</option>
                    <option value="4">4 Videos</option>
                    <option value="5">5 Videos</option>
                    <option value="6">6 Videos</option>
                    <option value="8">8 Videos</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Promo */}
              <div>
                <label
                  htmlFor="promo"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Homepage Promotion
                </label>

                <div className="relative">
                  <select
                    id="promo"
                    value={promo}
                    onChange={(event) =>
                      setPromo(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                  >
                    {promoOptions.map((option) => (
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
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <ToggleRow
                  title="Show Hero Description"
                  description="Display the story summary below the hero headline."
                  enabled={showHeroDescription}
                  onToggle={() =>
                    setShowHeroDescription(
                      !showHeroDescription
                    )
                  }
                />

                <ToggleRow
                  title="Auto Rotate Hero"
                  description="Rotate between selected hero stories automatically."
                  enabled={autoRotateHero}
                  onToggle={() =>
                    setAutoRotateHero(!autoRotateHero)
                  }
                />

                <ToggleRow
                  title="Show Latest More Link"
                  description="Show the View All link in the Latest News section."
                  enabled={showLatestMore}
                  onToggle={() =>
                    setShowLatestMore(!showLatestMore)
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =========================================================
          SELECTED HERO SUMMARY
      ========================================================== */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Current Homepage Selection
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quick overview of the current homepage
                configuration.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <HomepageInfoCard
            label="Hero Story"
            value={heroStory}
            icon={<ImageIcon size={16} />}
          />

          <HomepageInfoCard
            label="Hero Category"
            value={heroCategory}
            icon={<LayoutDashboard size={16} />}
          />

          <HomepageInfoCard
            label="Featured Videos"
            value={`${featuredCount} videos`}
            icon={<Video size={16} />}
          />

          <HomepageInfoCard
            label="Promotion"
            value={promo}
            icon={<TrendingUp size={16} />}
          />
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
          <p className="text-xs leading-5 text-slate-400">
            Homepage configuration is currently stored in local
            UI state. It will later connect to your MySQL
            database through the CMS API.
          </p>
        </div>
      </section>

      {/* =========================================================
          EDIT MODAL
      ========================================================== */}
      {editingSection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  Homepage Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Edit Section
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditSection}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="editSectionName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Section Name
                </label>

                <input
                  id="editSectionName"
                  type="text"
                  value={editName}
                  onChange={(event) =>
                    setEditName(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              <div>
                <label
                  htmlFor="editSectionDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="editSectionDescription"
                  rows={4}
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Section Type
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {editingSection.type}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeEditSection}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveSectionChanges}
                disabled={!editName.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />
                Save Changes
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

function HomepageStatCard({
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
   SECTION TYPE BADGE
================================================================ */

function SectionTypeBadge({
  type,
}: {
  type: SectionType;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
      {type}
    </span>
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
   HOMEPAGE INFO CARD
================================================================ */

function HomepageInfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-pink-600">
        {icon}

        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   SECTION ICON
================================================================ */

function getSectionIcon(type: SectionType) {
  switch (type) {
    case "Hero":
      return <Sparkles size={15} />;

    case "Latest News":
      return <LayoutDashboard size={15} />;

    case "Explore Categories":
      return <TrendingUp size={15} />;

    case "Live TV":
      return <RadioIcon />;

    case "Featured Videos":
      return <Video size={15} />;

    case "Trending":
      return <TrendingUp size={15} />;

    case "Top Stories":
      return <Sparkles size={15} />;

    case "Promo":
      return <ImageIcon size={15} />;

    default:
      return <LayoutDashboard size={15} />;
  }
}

/* ===============================================================
   SMALL ICON HELPERS
================================================================ */

function RadioIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M8.1 15.9a8.5 8.5 0 0 0 0-7.8" />
      <circle cx="12" cy="12" r="2" />
      <path d="M15.9 8.1a8.5 8.5 0 0 1 0 7.8" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
    </svg>
  );
}

function ExternalPreviewIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}