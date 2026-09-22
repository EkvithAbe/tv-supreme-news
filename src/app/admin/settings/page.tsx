"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Eye,
  Globe2,
  Image as ImageIcon,
  Link2,
  Mail,
  Monitor,
  Moon,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sun,
  Wrench,
  X,
} from "lucide-react";

/* ===============================================================
   TYPES
================================================================ */

type ThemeMode = "Light" | "Dark" | "System";

type SettingsState = {
  siteName: string;
  tagline: string;
  websiteUrl: string;
  defaultLanguage: string;
  timezone: string;

  theme: ThemeMode;
  primaryColor: string;
  logoUrl: string;

  facebook: string;
  youtube: string;
  instagram: string;
  x: string;
  tiktok: string;

  metaTitle: string;
  metaDescription: string;
  keywords: string;

  maintenanceMode: boolean;
  commentsEnabled: boolean;
  analyticsEnabled: boolean;
  emailNotifications: boolean;
};

type SettingsApiResponse = {
  success: boolean;
  settings?: SettingsState;
  message?: string;
};

/* ===============================================================
   INITIAL SETTINGS
================================================================ */

const initialSettings: SettingsState = {
  siteName: "TV SUPREME",
  tagline: "Your trusted source for Sri Lankan and world news.",
  websiteUrl: "https://www.tvsupreme.lk",
  defaultLanguage: "English",
  timezone: "Asia/Colombo",

  theme: "System",
  primaryColor: "#EC008C",
  logoUrl: "/logo.png",

  facebook: "https://facebook.com/tvsupreme",
  youtube: "https://youtube.com/@tvsupreme",
  instagram: "https://instagram.com/tvsupreme",
  x: "https://x.com/tvsupreme",
  tiktok: "https://tiktok.com/@tvsupreme",

  metaTitle: "TV SUPREME | Sri Lanka News",
  metaDescription:
    "TV SUPREME delivers the latest Sri Lankan, world, political, business, sports, entertainment and technology news.",
  keywords:
    "Sri Lanka news, TV SUPREME, breaking news, world news, politics, business, sports",

  maintenanceMode: false,
  commentsEnabled: true,
  analyticsEnabled: true,
  emailNotifications: true,
};

/* ===============================================================
   PAGE
================================================================ */

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsState>(initialSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showResetModal, setShowResetModal] =
    useState(false);

  const logoInputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
    setApiError("");
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      setApiError("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data: SettingsApiResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.settings
      ) {
        throw new Error(
          data.message ||
            "Failed to load settings."
        );
      }

      setSettings({
        ...initialSettings,
        ...data.settings,
      });
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );

      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadSettings();
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, []);

  const saveSettings = async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setApiError("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data: SettingsApiResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.settings
      ) {
        throw new Error(
          data.message ||
            "Failed to save settings."
        );
      }

      setSettings({
        ...initialSettings,
        ...data.settings,
      });

      /*
       * The Settings page controls the PUBLIC website theme.
       * Keep this separate from the Admin CMS theme.
       *
       * Store the public theme mode locally as well so that
       * another public tab can react to the change, and emit
       * an event for an already-mounted public ThemeProvider.
       */
      if (typeof window !== "undefined") {
        localStorage.removeItem("tv-supreme-theme");

        localStorage.setItem(
          "tv-supreme-public-theme-mode",
          data.settings.theme
        );

        window.dispatchEvent(
          new CustomEvent(
            "tv-supreme-settings-updated",
            {
              detail: {
                theme: data.settings.theme,
                primaryColor:
                  data.settings.primaryColor,
                logoUrl:
                  data.settings.logoUrl,
              },
            }
          )
        );
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setApiError("Please select a valid image file for the logo.");
      return;
    }

    if (file.size <= 0) {
      setApiError("The selected logo file is empty.");
      return;
    }

    try {
      setUploadingLogo(true);
      setSaved(false);
      setApiError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/admin/media",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.media?.url) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to upload the logo."
        );
      }

      updateSetting(
        "logoUrl",
        String(data.media.url)
      );
    } catch (error) {
      console.error(
        "Failed to upload logo:",
        error
      );

      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to upload the logo."
      );
    } finally {
      setUploadingLogo(false);

      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  const resetSettings = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setApiError("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            initialSettings
          ),
        }
      );

      const data: SettingsApiResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.settings
      ) {
        throw new Error(
          data.message ||
            "Failed to reset settings."
        );
      }

      setSettings({
        ...initialSettings,
        ...data.settings,
      });

      /*
       * Reset also updates the PUBLIC website theme.
       * The Admin CMS remains independent.
       */
      if (typeof window !== "undefined") {
        localStorage.removeItem("tv-supreme-theme");

        localStorage.setItem(
          "tv-supreme-public-theme-mode",
          data.settings.theme
        );

        window.dispatchEvent(
          new CustomEvent(
            "tv-supreme-settings-updated",
            {
              detail: {
                theme: data.settings.theme,
                primaryColor:
                  data.settings.primaryColor,
                logoUrl:
                  data.settings.logoUrl,
              },
            }
          )
        );
      }

      setShowResetModal(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to reset settings:",
        error
      );

      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to reset settings."
      );
    } finally {
      setSaving(false);
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
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage the main website, appearance, social, SEO and
            system settings for TV SUPREME.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                {saving ? "Saving..." : "Save Settings"}
              </>
            )}
          </button>
        </div>
      </div>

      {apiError && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{apiError}</span>

          <button
            type="button"
            onClick={() => void loadSettings()}
            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* =========================================================
          STATUS SUMMARY
      ========================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SettingsStatCard
          title="Website"
          value={settings.siteName}
          note="Main website identity"
          icon={<Globe2 size={20} />}
        />

        <SettingsStatCard
          title="Language"
          value={settings.defaultLanguage}
          note="Default website language"
          icon={<Monitor size={20} />}
        />

        <SettingsStatCard
          title="Theme"
          value={settings.theme}
          note="Display preference"
          icon={
            settings.theme === "Dark" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )
          }
        />

        <SettingsStatCard
          title="Maintenance"
          value={
            settings.maintenanceMode
              ? "Enabled"
              : "Disabled"
          }
          note={
            settings.maintenanceMode
              ? "Website temporarily restricted"
              : "Website operating normally"
          }
          icon={<Wrench size={20} />}
          active={!settings.maintenanceMode}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* =======================================================
            LEFT COLUMN
        ======================================================== */}
        <div className="space-y-6">
          {/* =====================================================
              GENERAL
          ====================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Globe2 size={20} />}
              title="General"
              description="Basic website identity and localization settings."
            />

            <div className="space-y-5 p-5">
              {/* Website Name */}
              <div>
                <label
                  htmlFor="siteName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Website Name
                </label>

                <input
                  id="siteName"
                  type="text"
                  value={settings.siteName}
                  onChange={(event) =>
                    updateSetting(
                      "siteName",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Tagline */}
              <div>
                <label
                  htmlFor="tagline"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Website Tagline
                </label>

                <input
                  id="tagline"
                  type="text"
                  value={settings.tagline}
                  onChange={(event) =>
                    updateSetting(
                      "tagline",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* Website URL */}
              <div>
                <label
                  htmlFor="websiteUrl"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Website URL
                </label>

                <div className="relative">
                  <Link2
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="websiteUrl"
                    type="url"
                    value={settings.websiteUrl}
                    onChange={(event) =>
                      updateSetting(
                        "websiteUrl",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>
              </div>

              {/* Language + Timezone */}
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  id="defaultLanguage"
                  label="Default Language"
                  value={settings.defaultLanguage}
                  onChange={(value) =>
                    updateSetting(
                      "defaultLanguage",
                      value
                    )
                  }
                  options={[
                    "English",
                    "Sinhala",
                    "Tamil",
                  ]}
                />

                <SelectField
                  id="timezone"
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(value) =>
                    updateSetting(
                      "timezone",
                      value
                    )
                  }
                  options={[
                    "Asia/Colombo",
                    "Asia/Kolkata",
                    "UTC",
                  ]}
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              APPEARANCE
          ====================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Sun size={20} />}
              title="Appearance"
              description="Control the public website theme and brand appearance."
            />

            <div className="space-y-5 p-5">
              {/* Theme */}
              <div>
                <p className="mb-1 text-sm font-semibold text-slate-700">
                  Website Theme
                </p>

                <p className="mb-3 text-xs leading-5 text-slate-400">
                  This controls the public TV SUPREME website. The Admin CMS stays in light mode.
                  Save Settings to apply the new default.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {(
                    ["Light", "Dark", "System"] as ThemeMode[]
                  ).map((theme) => {
                    const active =
                      settings.theme === theme;

                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() =>
                          updateSetting(
                            "theme",
                            theme
                          )
                        }
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-pink-400 bg-pink-50 text-pink-600"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            active
                              ? "bg-white"
                              : "bg-slate-50"
                          }`}
                        >
                          {theme === "Light" ? (
                            <Sun size={16} />
                          ) : theme === "Dark" ? (
                            <Moon size={16} />
                          ) : (
                            <Monitor size={16} />
                          )}
                        </span>

                        <span className="text-sm font-semibold">
                          {theme}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Color */}
              <div>
                <label
                  htmlFor="primaryColor"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Primary Brand Color
                </label>

                <div className="flex gap-3">
                  <input
                    id="primaryColor"
                    type="text"
                    value={settings.primaryColor}
                    onChange={(event) =>
                      updateSetting(
                        "primaryColor",
                        event.target.value
                      )
                    }
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />

                  <div
                    className="h-[46px] w-[46px] shrink-0 rounded-xl border border-slate-200 shadow-sm"
                    style={{
                      backgroundColor:
                        settings.primaryColor,
                    }}
                    aria-label="Primary color preview"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  TV SUPREME currently uses a pink/magenta brand
                  palette.
                </p>
              </div>

              {/* Logo */}
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Website Logo
                </p>

                <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt={`${settings.siteName || "TV SUPREME"} logo`}
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-600 to-purple-600 text-lg font-black text-white">
                        TV
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      {settings.siteName || "TV SUPREME"} Logo
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Upload an image from your computer. It will be added to the
                      Media Library and saved as the public website logo when you save settings.
                    </p>

                    {settings.logoUrl && (
                      <p className="mt-2 truncate text-[11px] text-slate-400">
                        {settings.logoUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          void uploadLogo(file);
                        }
                      }}
                    />

                    <button
                      type="button"
                      disabled={uploadingLogo}
                      onClick={() =>
                        logoInputRef.current?.click()
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ImageIcon size={15} />
                      {uploadingLogo ? "Uploading..." : "Choose Logo"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              SOCIAL MEDIA
          ====================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Globe2 size={20} />}
              title="Social Media"
              description="Manage the social media links used across the website."
            />

            <div className="grid gap-5 p-5 md:grid-cols-2">
              <SocialField
                id="facebook"
                label="Facebook"
                value={settings.facebook}
                onChange={(value) =>
                  updateSetting("facebook", value)
                }
              />

              <SocialField
                id="youtube"
                label="YouTube"
                value={settings.youtube}
                onChange={(value) =>
                  updateSetting("youtube", value)
                }
              />

              <SocialField
                id="instagram"
                label="Instagram"
                value={settings.instagram}
                onChange={(value) =>
                  updateSetting("instagram", value)
                }
              />

              <SocialField
                id="x"
                label="X"
                value={settings.x}
                onChange={(value) =>
                  updateSetting("x", value)
                }
              />

              <SocialField
                id="tiktok"
                label="TikTok"
                value={settings.tiktok}
                onChange={(value) =>
                  updateSetting("tiktok", value)
                }
              />
            </div>
          </section>

          {/* =====================================================
              SEO
          ====================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Search size={20} />}
              title="SEO"
              description="Default search engine optimization settings for the website."
            />

            <div className="space-y-5 p-5">
              {/* Meta Title */}
              <div>
                <label
                  htmlFor="metaTitle"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Meta Title
                </label>

                <input
                  id="metaTitle"
                  type="text"
                  value={settings.metaTitle}
                  onChange={(event) =>
                    updateSetting(
                      "metaTitle",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  {settings.metaTitle.length} characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label
                  htmlFor="metaDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Meta Description
                </label>

                <textarea
                  id="metaDescription"
                  rows={4}
                  value={settings.metaDescription}
                  onChange={(event) =>
                    updateSetting(
                      "metaDescription",
                      event.target.value
                    )
                  }
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  {settings.metaDescription.length} characters
                </p>
              </div>

              {/* Keywords */}
              <div>
                <label
                  htmlFor="keywords"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Keywords
                </label>

                <textarea
                  id="keywords"
                  rows={3}
                  value={settings.keywords}
                  onChange={(event) =>
                    updateSetting(
                      "keywords",
                      event.target.value
                    )
                  }
                  placeholder="keyword 1, keyword 2, keyword 3"
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              {/* SEO Preview */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Search Preview
                </p>

                <p className="mt-3 text-lg font-medium text-blue-700">
                  {settings.metaTitle ||
                    "TV SUPREME | Sri Lanka News"}
                </p>

                <p className="mt-1 text-xs text-emerald-700">
                  {settings.websiteUrl}
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {settings.metaDescription ||
                    "Website meta description preview."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* =======================================================
            RIGHT COLUMN
        ======================================================== */}
        <div className="space-y-6">
          {/* =====================================================
              SYSTEM
          ====================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Settings2 size={20} />}
              title="System"
              description="Control important website behaviour."
            />

            <div className="space-y-3 p-5">
              <ToggleRow
                title="Maintenance Mode"
                description="Temporarily restrict access to the public website."
                enabled={settings.maintenanceMode}
                onToggle={() =>
                  updateSetting(
                    "maintenanceMode",
                    !settings.maintenanceMode
                  )
                }
                warning
              />

              <ToggleRow
                title="Comments"
                description="Allow comments on supported content."
                enabled={settings.commentsEnabled}
                onToggle={() =>
                  updateSetting(
                    "commentsEnabled",
                    !settings.commentsEnabled
                  )
                }
              />

              <ToggleRow
                title="Analytics"
                description="Enable website analytics and traffic tracking."
                enabled={settings.analyticsEnabled}
                onToggle={() =>
                  updateSetting(
                    "analyticsEnabled",
                    !settings.analyticsEnabled
                  )
                }
              />

              <ToggleRow
                title="Email Notifications"
                description="Send CMS notifications by email."
                enabled={settings.emailNotifications}
                onToggle={() =>
                  updateSetting(
                    "emailNotifications",
                    !settings.emailNotifications
                  )
                }
              />
            </div>

            {settings.maintenanceMode && (
              <div className="border-t border-amber-100 bg-amber-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <Wrench
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Maintenance mode is enabled
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      Visitors may see a maintenance message instead
                      of the normal website.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* =====================================================
              LANGUAGE SETTINGS
          ====================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<Globe2 size={20} />}
              title="Languages"
              description="Languages available on the public website."
            />

            <div className="space-y-3 p-5">
              <LanguageRow
                code="EN"
                language="English"
                enabled
                defaultLanguage={
                  settings.defaultLanguage === "English"
                }
              />

              <LanguageRow
                code="SI"
                language="Sinhala"
                enabled
                defaultLanguage={
                  settings.defaultLanguage === "Sinhala"
                }
              />

              <LanguageRow
                code="TA"
                language="Tamil"
                enabled
                defaultLanguage={
                  settings.defaultLanguage === "Tamil"
                }
              />
            </div>

            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
              <p className="text-xs leading-5 text-slate-400">
                Language content will be managed through the
                multilingual article and page system.
              </p>
            </div>
          </section>

          {/* =====================================================
              PUBLIC WEBSITE STATUS
          ====================================================== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SettingsSectionHeader
              icon={<ShieldCheck size={20} />}
              title="Website Status"
              description="Current configuration overview."
            />

            <div className="space-y-3 p-5">
              <StatusRow
                label="Website"
                value="Operational"
                good
              />

              <StatusRow
                label="Default Language"
                value={settings.defaultLanguage}
              />

              <StatusRow
                label="Timezone"
                value={settings.timezone}
              />

              <StatusRow
                label="Comments"
                value={
                  settings.commentsEnabled
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <StatusRow
                label="Analytics"
                value={
                  settings.analyticsEnabled
                    ? "Enabled"
                    : "Disabled"
                }
              />
            </div>
          </section>

          {/* =====================================================
              SECURITY NOTE
          ====================================================== */}
          <section className="rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                <ShieldCheck size={17} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  CMS Security
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Authentication, role permissions and protected
                  settings will be enforced when the database and
                  authentication layer are connected.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =========================================================
          BOTTOM SAVE BAR
      ========================================================== */}
      <div className="sticky bottom-4 z-40">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Save size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Settings
              </p>

              <p className="text-xs text-slate-400">
                Changes are loaded from and saved to MySQL.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved ? (
              <>
                <Check size={16} />
                Settings Saved
              </>
            ) : (
              <>
                <Save size={16} />
                {saving ? "Saving..." : "Save Settings"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          RESET MODAL
      ========================================================== */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-medium text-pink-600">
                  Settings
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Reset Settings?
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowResetModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-slate-500">
                This will restore all settings on this page to
                their original demo values.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setShowResetModal(false)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={resetSettings}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===============================================================
   SETTINGS SECTION HEADER
================================================================ */

function SettingsSectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-200 px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   STAT CARD
================================================================ */

function SettingsStatCard({
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
            className={`mt-2 truncate text-2xl font-bold ${
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
   SELECT FIELD
================================================================ */

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-pink-400"
        >
          {options.map((option) => (
            <option key={option} value={option}>
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
  );
}

/* ===============================================================
   SOCIAL FIELD
================================================================ */

function SocialField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <Link2
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          type="url"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={`https://${label.toLowerCase()}.com/...`}
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
        />
      </div>
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
  warning = false,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  warning?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${
        warning && enabled
          ? "border-amber-200 bg-amber-50/60"
          : "border-slate-200 bg-white"
      }`}
    >
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
            ? warning
              ? "bg-amber-500"
              : "bg-gradient-to-r from-pink-600 to-purple-600"
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
   LANGUAGE ROW
================================================================ */

function LanguageRow({
  code,
  language,
  enabled,
  defaultLanguage,
}: {
  code: string;
  language: string;
  enabled: boolean;
  defaultLanguage: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-pink-600 shadow-sm">
        {code}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-700">
          {language}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {enabled ? "Enabled" : "Disabled"}
        </p>
      </div>

      {defaultLanguage && (
        <span className="rounded-full bg-pink-50 px-2.5 py-1 text-[10px] font-bold text-pink-600">
          Default
        </span>
      )}
    </div>
  );
}

/* ===============================================================
   STATUS ROW
================================================================ */

function StatusRow({
  label,
  value,
  good = false,
}: {
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <span className="text-sm font-medium text-slate-600">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
          good
            ? "text-emerald-600"
            : "text-slate-500"
        }`}
      >
        {good && (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        )}

        {value}
      </span>
    </div>
  );
}
