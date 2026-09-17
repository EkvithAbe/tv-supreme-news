"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Radio,
  Save,
  Play,
  Square,
  Copy,
  Check,
  Signal,
  Tv,
  Globe,
  ExternalLink,
  Settings2,
  Activity,
  Video,
} from "lucide-react";

type StreamType = "HLS" | "MP4" | "Embed";

interface LiveTVSettings {
  id: string;
  channelName: string;
  streamUrl: string;
  streamType: StreamType;
  isLive: boolean;
  isEnabled: boolean;
  playerTitle: string;
  fallbackUrl: string;
  autoPlay: boolean;
  showChat: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  settings?: LiveTVSettings | null;
  message?: string;
}

const defaultSettings: Omit<
  LiveTVSettings,
  "id" | "createdAt" | "updatedAt"
> = {
  channelName: "TV SUPREME",
  streamUrl: "",
  streamType: "HLS",
  isLive: false,
  isEnabled: true,
  playerTitle: "TV SUPREME Live",
  fallbackUrl: "",
  autoPlay: true,
  showChat: false,
};

function mapStreamTypeFromApi(value: string): StreamType {
  switch (value) {
    case "MP4":
      return "MP4";

    case "EMBED":
      return "Embed";

    case "HLS":
    default:
      return "HLS";
  }
}

function mapStreamTypeToApi(value: StreamType) {
  switch (value) {
    case "MP4":
      return "MP4";

    case "Embed":
      return "EMBED";

    case "HLS":
    default:
      return "HLS";
  }
}

function createFormFromSettings(
  settings: LiveTVSettings | null,
): Omit<LiveTVSettings, "id" | "createdAt" | "updatedAt"> {
  if (!settings) {
    return defaultSettings;
  }

  return {
    channelName: settings.channelName,
    streamUrl: settings.streamUrl,
    streamType: mapStreamTypeFromApi(settings.streamType),
    isLive: settings.isLive,
    isEnabled: settings.isEnabled,
    playerTitle: settings.playerTitle,
    fallbackUrl: settings.fallbackUrl,
    autoPlay: settings.autoPlay,
    showChat: settings.showChat,
  };
}

export default function LiveTVPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingLive, setIsUpdatingLive] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [settingsId, setSettingsId] = useState<string | null>(null);

  const [isLive, setIsLive] = useState(false);
  const [streamType, setStreamType] = useState<StreamType>("HLS");

  const [channelName, setChannelName] =
    useState("TV SUPREME");

  const [streamUrl, setStreamUrl] = useState("");

  const [fallbackUrl, setFallbackUrl] =
    useState("");

  const [playerTitle, setPlayerTitle] =
    useState("TV SUPREME Live");

  const [autoPlay, setAutoPlay] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  /*
   * ============================================================
   * LOAD SETTINGS
   * ============================================================
   */

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/live-tv",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load Live TV settings.",
        );
      }

      if (data.settings) {
        const settings = data.settings;

        setSettingsId(settings.id);
        setChannelName(settings.channelName);
        setStreamUrl(settings.streamUrl);
        setStreamType(
          mapStreamTypeFromApi(settings.streamType),
        );
        setIsLive(settings.isLive);
        setIsEnabled(settings.isEnabled);
        setPlayerTitle(settings.playerTitle);
        setFallbackUrl(settings.fallbackUrl);
        setAutoPlay(settings.autoPlay);
        setShowChat(settings.showChat);
      } else {
        setSettingsId(null);
        setChannelName(defaultSettings.channelName);
        setStreamUrl(defaultSettings.streamUrl);
        setStreamType(defaultSettings.streamType);
        setIsLive(defaultSettings.isLive);
        setIsEnabled(defaultSettings.isEnabled);
        setPlayerTitle(defaultSettings.playerTitle);
        setFallbackUrl(defaultSettings.fallbackUrl);
        setAutoPlay(defaultSettings.autoPlay);
        setShowChat(defaultSettings.showChat);
      }
    } catch (loadError) {
      console.error(
        "Failed to load Live TV settings:",
        loadError,
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load Live TV settings.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  /*
   * ============================================================
   * SAVE SETTINGS
   * ============================================================
   */

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        "/api/admin/live-tv",
        {
          method: settingsId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channelName,
            streamUrl,
            streamType:
              mapStreamTypeToApi(streamType),
            isLive,
            isEnabled,
            playerTitle,
            fallbackUrl,
            autoPlay,
            showChat,
          }),
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save Live TV settings.",
        );
      }

      if (data.settings) {
        setSettingsId(data.settings.id);
        setChannelName(data.settings.channelName);
        setStreamUrl(data.settings.streamUrl);
        setStreamType(
          mapStreamTypeFromApi(
            data.settings.streamType,
          ),
        );
        setIsLive(data.settings.isLive);
        setIsEnabled(data.settings.isEnabled);
        setPlayerTitle(data.settings.playerTitle);
        setFallbackUrl(data.settings.fallbackUrl);
        setAutoPlay(data.settings.autoPlay);
        setShowChat(data.settings.showChat);
      }

      setSaved(true);
      setSuccessMessage(
        data.message ||
          "Live TV settings saved successfully.",
      );

      window.setTimeout(() => {
        setSaved(false);
        setSuccessMessage("");
      }, 2500);
    } catch (saveError) {
      console.error(
        "Failed to save Live TV settings:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save Live TV settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * ============================================================
   * LIVE STATUS
   * ============================================================
   */

  const toggleLive = async () => {
    try {
      setIsUpdatingLive(true);
      setError("");
      setSuccessMessage("");

      const action = isLive ? "OFFLINE" : "LIVE";

      const response = await fetch(
        "/api/admin/live-tv",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update broadcast status.",
        );
      }

      if (data.settings) {
        setSettingsId(data.settings.id);
        setIsLive(data.settings.isLive);
        setIsEnabled(data.settings.isEnabled);
      }

      setSuccessMessage(
        data.message ||
          (isLive
            ? "Broadcast ended."
            : "Broadcast started."),
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (statusError) {
      console.error(
        "Failed to update live status:",
        statusError,
      );

      setError(
        statusError instanceof Error
          ? statusError.message
          : "Failed to update broadcast status.",
      );
    } finally {
      setIsUpdatingLive(false);
    }
  };

  /*
   * ============================================================
   * ENABLE / DISABLE LIVE TV
   * ============================================================
   */

  const toggleEnabled = async () => {
    try {
      setError("");
      setSuccessMessage("");

      const action = isEnabled
        ? "DISABLE"
        : "ENABLE";

      const response = await fetch(
        "/api/admin/live-tv",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update Live TV status.",
        );
      }

      if (data.settings) {
        setSettingsId(data.settings.id);
        setIsLive(data.settings.isLive);
        setIsEnabled(data.settings.isEnabled);
      }

      setSuccessMessage(
        data.message ||
          (isEnabled
            ? "Live TV disabled."
            : "Live TV enabled."),
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (enabledError) {
      console.error(
        "Failed to update Live TV enabled status:",
        enabledError,
      );

      setError(
        enabledError instanceof Error
          ? enabledError.message
          : "Failed to update Live TV status.",
      );
    }
  };

  /*
   * ============================================================
   * COPY URL
   * ============================================================
   */

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        streamUrl ||
          "https://example.com/live/stream.m3u8",
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard may not be available.
    }
  };

  /*
   * ============================================================
   * RESET
   * ============================================================
   */

  const handleReset = () => {
    setError("");
    setSuccessMessage("");
    setSaved(false);

    setChannelName(defaultSettings.channelName);
    setStreamUrl(defaultSettings.streamUrl);
    setFallbackUrl(defaultSettings.fallbackUrl);
    setPlayerTitle(defaultSettings.playerTitle);
    setStreamType(defaultSettings.streamType);
    setAutoPlay(defaultSettings.autoPlay);
    setShowChat(defaultSettings.showChat);

    /*
     * Do not change the database status during reset.
     * The form reset only resets the editable settings.
     */
  };

  /*
   * ============================================================
   * PUBLIC PREVIEW
   * ============================================================
   */

  const openPublicLiveTV = () => {
    window.open(
      "/en/watch-live",
      "_blank",
      "noopener,noreferrer",
    );
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading Live TV settings...
          </p>
        </div>
      </div>
    );
  }

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
            Live TV
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage the TV SUPREME live stream, player
            settings and current broadcast status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live status */}
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              isLive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isLive
                  ? "animate-pulse bg-emerald-500"
                  : "bg-slate-300"
              }`}
            />

            {isLive ? "LIVE NOW" : "OFFLINE"}
          </div>

          <button
            type="button"
            onClick={toggleLive}
            disabled={isUpdatingLive || !settingsId}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
              isLive
                ? "bg-slate-800"
                : "bg-gradient-to-r from-pink-600 to-purple-600"
            }`}
          >
            {isUpdatingLive ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Updating...
              </>
            ) : isLive ? (
              <>
                <Square size={16} fill="currentColor" />
                End Broadcast
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                Go Live
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          NOTIFICATIONS
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
          STATUS CARDS
      ========================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          title="Broadcast Status"
          value={isLive ? "Live" : "Offline"}
          note={
            isLive
              ? "Broadcast is active"
              : "No active broadcast"
          }
          icon={<Radio size={20} />}
          active={isLive}
        />

        <StatusCard
          title="Stream Type"
          value={streamType}
          note="Configured player source"
          icon={<Video size={20} />}
        />

        <StatusCard
          title="Channel"
          value={channelName || "TV SUPREME"}
          note="Current channel name"
          icon={<Tv size={20} />}
        />

        <StatusCard
          title="Connection"
          value={streamUrl ? "Configured" : "Not Set"}
          note={
            streamUrl
              ? "Stream URL is available"
              : "Add a stream URL"
          }
          icon={<Signal size={20} />}
          active={Boolean(streamUrl)}
        />
      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
        {/* =======================================================
            STREAM SETTINGS
        ======================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}

          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <Settings2 size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Stream Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the live broadcast source used
                  by the public website.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <div className="space-y-5 p-5">
            {/* Channel Name */}

            <div>
              <label
                htmlFor="channelName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Channel Name
              </label>

              <input
                id="channelName"
                type="text"
                value={channelName}
                onChange={(event) =>
                  setChannelName(event.target.value)
                }
                placeholder="TV SUPREME"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
              />
            </div>

            {/* Player Title */}

            <div>
              <label
                htmlFor="playerTitle"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Player Title
              </label>

              <input
                id="playerTitle"
                type="text"
                value={playerTitle}
                onChange={(event) =>
                  setPlayerTitle(event.target.value)
                }
                placeholder="TV SUPREME Live"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
              />
            </div>

            {/* Stream Type */}

            <div>
              <label
                htmlFor="streamType"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Stream Type
              </label>

              <div className="grid gap-2 sm:grid-cols-3">
                {(
                  ["HLS", "MP4", "Embed"] as StreamType[]
                ).map((type) => {
                  const active =
                    streamType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setStreamType(type)
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "border-pink-500 bg-pink-50 text-pink-600"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stream URL */}

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="streamUrl"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Stream URL
                </label>

                <span className="text-xs text-slate-400">
                  {streamType === "HLS"
                    ? "Example: .m3u8"
                    : streamType === "MP4"
                      ? "MP4 video URL"
                      : "Embed source"}
                </span>
              </div>

              <div className="relative">
                <input
                  id="streamUrl"
                  type="url"
                  value={streamUrl}
                  onChange={(event) =>
                    setStreamUrl(event.target.value)
                  }
                  placeholder={
                    streamType === "HLS"
                      ? "https://example.com/live/stream.m3u8"
                      : "https://..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                />

                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Copy stream URL"
                >
                  {copied ? (
                    <Check
                      size={16}
                      className="text-emerald-600"
                    />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {copied && (
                <p className="mt-2 text-xs font-medium text-emerald-600">
                  Stream URL copied.
                </p>
              )}
            </div>

            {/* Fallback URL */}

            <div>
              <label
                htmlFor="fallbackUrl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Fallback Stream URL
              </label>

              <input
                id="fallbackUrl"
                type="url"
                value={fallbackUrl}
                onChange={(event) =>
                  setFallbackUrl(event.target.value)
                }
                placeholder="https://example.com/live/fallback.m3u8"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
              />

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Optional backup stream used when the
                primary stream is unavailable.
              </p>
            </div>

            {/* Player Options */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-800">
                  Player Options
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Control how the live player behaves on
                  the public website.
                </p>
              </div>

              <div className="space-y-3">
                <ToggleRow
                  title="Auto Play"
                  description="Start the live player automatically when supported."
                  enabled={autoPlay}
                  onToggle={() =>
                    setAutoPlay(!autoPlay)
                  }
                />

                <ToggleRow
                  title="Show Live Chat"
                  description="Display a live chat area beside the broadcast."
                  enabled={showChat}
                  onToggle={() =>
                    setShowChat(!showChat)
                  }
                />

                <ToggleRow
                  title="Live TV Enabled"
                  description="Make the Live TV channel available on the public website."
                  enabled={isEnabled}
                  onToggle={toggleEnabled}
                />
              </div>
            </div>

            {/* Save */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check size={16} />
                    Saved
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* =======================================================
            LIVE PREVIEW
        ======================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}

          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Tv size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Live Preview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Preview how your live broadcast will
                    appear.
                  </p>
                </div>
              </div>

              {isLive && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  LIVE
                </span>
              )}
            </div>
          </div>

          {/* Preview Player */}

          <div className="p-5">
            <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
              <div className="relative aspect-video">
                {/* Background */}

                <div className="absolute inset-0 bg-gradient-to-br from-[#151b35] via-[#20264a] to-[#101527]" />

                {/* Center */}

                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-xl">
                    <Radio size={28} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-pink-300">
                    {isLive
                      ? "Live Broadcast"
                      : "Live TV"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    {playerTitle || "TV SUPREME Live"}
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
                    {streamUrl
                      ? isLive
                        ? "Broadcast is live and the stream source is configured."
                        : "Stream source configured and ready."
                      : "Add a stream URL to connect your live player."}
                  </p>

                  {!isLive && (
                    <button
                      type="button"
                      onClick={toggleLive}
                      disabled={
                        isUpdatingLive ||
                        !settingsId
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Play
                        size={14}
                        fill="currentColor"
                      />

                      Preview Broadcast
                    </button>
                  )}
                </div>

                {/* Bottom Bar */}

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/40 px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isLive
                          ? "animate-pulse bg-red-500"
                          : "bg-slate-500"
                      }`}
                    />

                    <span className="text-[11px] font-semibold text-white">
                      {isLive ? "LIVE" : "OFFLINE"}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-300">
                    {channelName || "TV SUPREME"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview information */}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PreviewItem
                icon={<Globe size={15} />}
                label="Stream Type"
                value={streamType}
              />

              <PreviewItem
                icon={<Activity size={15} />}
                label="Status"
                value={isLive ? "Broadcasting" : "Offline"}
              />

              <PreviewItem
                icon={<Signal size={15} />}
                label="Connection"
                value={
                  streamUrl
                    ? "Configured"
                    : "Not Configured"
                }
              />

              <PreviewItem
                icon={<Tv size={15} />}
                label="Channel"
                value={channelName || "TV SUPREME"}
              />
            </div>

            {/* Public page button */}

            <button
              type="button"
              onClick={openPublicLiveTV}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ExternalLink size={15} />
              Preview Public Live TV Page
            </button>
          </div>
        </section>
      </div>

      {/* =========================================================
          CURRENT CONFIGURATION
      ========================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Activity size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Current Configuration
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quick overview of the current live TV
                settings.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <ConfigItem
            label="Channel"
            value={
              channelName || "Not configured"
            }
          />

          <ConfigItem
            label="Player Title"
            value={
              playerTitle || "Not configured"
            }
          />

          <ConfigItem
            label="Stream Type"
            value={streamType}
          />

          <ConfigItem
            label="Broadcast"
            value={
              isLive ? "Live" : "Offline"
            }
          />

          <ConfigItem
            label="Live TV"
            value={
              isEnabled ? "Enabled" : "Disabled"
            }
          />

          <ConfigItem
            label="Connection"
            value={
              streamUrl
                ? "Configured"
                : "Not configured"
            }
          />

          <ConfigItem
            label="Auto Play"
            value={
              autoPlay ? "Enabled" : "Disabled"
            }
          />

          <ConfigItem
            label="Live Chat"
            value={
              showChat ? "Enabled" : "Disabled"
            }
          />
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
          <p className="text-xs leading-5 text-slate-400">
            Live TV settings are now loaded from and
            saved to PostgreSQL through the CMS API.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ===============================================================
   STATUS CARD
=============================================================== */

function StatusCard({
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
   PREVIEW ITEM
=============================================================== */

function PreviewItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-pink-600 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   CONFIG ITEM
=============================================================== */

function ConfigItem({
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

      <p className="mt-1.5 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}