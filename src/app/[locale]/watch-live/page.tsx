import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Globe2,
  Play,
  Radio,
  Tv,
  Video,
} from "lucide-react";

import { getLiveTVSettings } from "@/lib/data/live-tv";

export const revalidate = 15;

interface WatchLivePageProps {
  params: Promise<{
    locale: string;
  }>;
}

type PublicStreamType =
  | "HLS"
  | "MP4"
  | "EMBED"
  | "OTHER";

function getPlayerUrl(
  settings: Awaited<
    ReturnType<typeof getLiveTVSettings>
  >,
) {
  if (!settings) {
    return "";
  }

  const primaryUrl =
    settings.streamUrl?.trim() ?? "";

  const fallbackUrl =
    settings.fallbackUrl?.trim() ?? "";

  return primaryUrl || fallbackUrl;
}

function normalizeStreamType(
  value: string | undefined,
): PublicStreamType {
  switch (value) {
    case "MP4":
      return "MP4";

    case "EMBED":
      return "EMBED";

    case "OTHER":
      return "OTHER";

    case "HLS":
    default:
      return "HLS";
  }
}

function isHostedPlayerUrl(url: string) {
  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.includes("player.castr.com") ||
    normalizedUrl.includes("youtube.com/embed") ||
    normalizedUrl.includes(
      "youtube-nocookie.com/embed",
    ) ||
    normalizedUrl.includes("player.vimeo.com")
  );
}

function isHlsUrl(url: string) {
  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.includes(".m3u8") ||
    normalizedUrl.includes(
      "application/vnd.apple.mpegurl",
    ) ||
    normalizedUrl.includes(
      "application/x-mpegurl",
    )
  );
}

function getAutoplayEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes("player.castr.com")) {
      parsed.searchParams.set("autoplay", "on");
      parsed.searchParams.set("muted", "on");
      return parsed.toString();
    }

    if (hostname.includes("youtube.com") || hostname.includes("youtube-nocookie.com")) {
      parsed.searchParams.set("autoplay", "1");
      parsed.searchParams.set("mute", "1");
      return parsed.toString();
    }

    if (hostname.includes("player.vimeo.com")) {
      parsed.searchParams.set("autoplay", "1");
      parsed.searchParams.set("muted", "1");
      return parsed.toString();
    }

    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("muted", "1");
    return parsed.toString();
  } catch {
    return url;
  }
}

export default async function WatchLivePage({
  params,
}: WatchLivePageProps) {
  const { locale } = await params;

  const settings = await getLiveTVSettings();

  const hasSettings = Boolean(settings);

  /*
   * IMPORTANT:
   *
   * Player availability is separate from broadcast status.
   *
   * Previously the player was only rendered when:
   *
   *   isEnabled && isLive
   *
   * That meant an otherwise valid Castr player was hidden
   * whenever the CMS status was OFFLINE.
   *
   * Now the configured player can still be displayed when
   * Live TV is enabled, while the actual LIVE/OFFLINE status
   * remains controlled by isLive.
   */
  const isEnabled =
    settings?.isEnabled ?? false;

  const isLive =
    settings?.isLive ?? false;

  const playerUrl =
    getPlayerUrl(settings);

  const canRenderPlayer =
    Boolean(isEnabled && playerUrl);

  const channelName =
    settings?.channelName ||
    "TV SUPREME";

  const playerTitle =
    settings?.playerTitle ||
    "TV SUPREME Live";

  const streamType =
    normalizeStreamType(
      settings?.streamType,
    );

  const autoPlay =
    settings?.autoPlay ?? true;

  const showChat =
    settings?.showChat ?? false;

  const latestHref =
    `/${locale}/latest`;

  const videoHref =
    `/${locale}/video`;

  const isHostedPlayer =
    isHostedPlayerUrl(playerUrl) ||
    streamType === "EMBED";

  const isMp4 =
    streamType === "MP4";

  const isDirectHls =
    streamType === "HLS" &&
    isHlsUrl(playerUrl) &&
    !isHostedPlayer;

  const autoplayPlayerUrl =
    isHostedPlayer && autoPlay
      ? getAutoplayEmbedUrl(playerUrl)
      : playerUrl;

  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3c2372] via-[#5f19c8] to-[#ec008c]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(255,255,255,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[250px] items-center py-14 sm:min-h-[290px] sm:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Radio size={14} />

                {channelName}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Watch Live
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Watch TV SUPREME live coverage, breaking
                news, programmes and special broadcasts
                online.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white ring-1 ${
                    isLive
                      ? "bg-red-500/15 ring-red-300/20"
                      : "bg-slate-500/20 ring-white/15"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isLive
                        ? "animate-pulse bg-red-400"
                        : "bg-slate-300"
                    }`}
                  />

                  {isLive
                    ? "LIVE NOW"
                    : "OFFLINE"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
                  <Globe2 size={13} />

                  Live online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIVE PLAYER
      ========================================================== */}

      <section
        id="live-player"
        className="py-8 sm:py-10 lg:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* =====================================================
                PLAYER CARD
            ====================================================== */}

            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#111d4a] shadow-xl">
              {/* Player Header */}

              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#0d142d] px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-600 to-purple-600">
                    <Tv
                      size={18}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white">
                      {channelName}
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/50">
                      Live Television
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                    isLive
                      ? "bg-red-500/15 text-red-300"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isLive
                        ? "animate-pulse bg-red-400"
                        : "bg-slate-500"
                    }`}
                  />

                  {isLive
                    ? "LIVE"
                    : "OFFLINE"}
                </span>
              </div>

              {/* ===================================================
                  PLAYER
              ==================================================== */}

              <div className="relative aspect-video w-full bg-black">
                {canRenderPlayer ? (
                  <>
                    {/* =================================================
                        CASTR / HOSTED EMBED
                    ================================================== */}

                    {isHostedPlayer ? (
                      <iframe
                        src={autoplayPlayerUrl}
                        title={playerTitle}
                        className="absolute inset-0 h-full w-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        allowFullScreen
                        loading="eager"
                      />
                    ) : isMp4 ? (
                      /* =================================================
                         MP4
                      ================================================== */

                      <video
                        src={playerUrl}
                        title={playerTitle}
                        className="absolute inset-0 h-full w-full bg-black object-contain"
                        controls
                        playsInline
                        autoPlay={autoPlay}
                        muted={autoPlay}
                        preload="metadata"
                      />
                    ) : isDirectHls ? (
                      /* =================================================
                         DIRECT HLS
                      ================================================== */

                      <video
                        src={playerUrl}
                        title={playerTitle}
                        className="absolute inset-0 h-full w-full bg-black object-contain"
                        controls
                        playsInline
                        autoPlay={autoPlay}
                        muted={autoPlay}
                        preload="metadata"
                      />
                    ) : (
                      /* =================================================
                         OTHER
                      ================================================== */

                      <iframe
                        src={playerUrl}
                        title={playerTitle}
                        className="absolute inset-0 h-full w-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        allowFullScreen
                        loading="eager"
                      />
                    )}

                    {/* =================================================
                        OFFLINE OVERLAY
                    ================================================== */}

                    {!isLive && (
                      <div className="pointer-events-none absolute left-4 top-4 z-10">
                        <span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />

                          BROADCAST OFFLINE
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  /* ===================================================
                     NO PLAYER CONFIGURATION
                  ==================================================== */

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#151b35] via-[#20264a] to-[#101527] px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-xl">
                      <Radio size={28} />
                    </div>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-pink-300">
                      {!hasSettings
                        ? "Live TV Unavailable"
                        : !isEnabled
                          ? "Live TV Disabled"
                          : "Live TV"}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      {playerTitle}
                    </h3>

                    <p className="mt-2 max-w-md text-xs leading-5 text-slate-400">
                      {!hasSettings
                        ? "Live TV has not been configured yet."
                        : !isEnabled
                          ? "Live TV is currently disabled."
                          : !playerUrl
                            ? "Add a stream URL to connect the live player."
                            : "The live player is currently unavailable."}
                    </p>
                  </div>
                )}
              </div>

              {/* Player Footer */}

              <div className="border-t border-white/10 bg-[#0d142d] px-4 py-3 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">
                      {playerTitle}
                    </p>

                    <p className="mt-1 text-xs text-white/50">
                      Live news and current programming
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                      isLive
                        ? "bg-white/5 text-white/60"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    <Play
                      size={13}
                      fill="currentColor"
                    />

                    {isLive
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* =====================================================
                RIGHT SIDEBAR
            ====================================================== */}

            <aside className="space-y-5">
              {/* Now Live */}

              <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <Radio size={17} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-[#111d4a]">
                        Now Live
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-400">
                        TV SUPREME online broadcast
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="rounded-2xl bg-gradient-to-br from-[#111d4a] to-[#2e205f] p-5 text-white">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isLive
                            ? "animate-pulse bg-red-400"
                            : "bg-slate-500"
                        }`}
                      />

                      <span
                        className={
                          isLive
                            ? "text-red-300"
                            : "text-slate-400"
                        }
                      >
                        {isLive
                          ? "Live"
                          : "Offline"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-black">
                      {channelName}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/60">
                      {isLive
                        ? "Watch the current live stream directly on the website."
                        : "The live player is configured, but there is currently no active broadcast."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Quick Links */}

              <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-bold text-[#111d4a]">
                    Quick Links
                  </h2>
                </div>

                <div className="p-3">
                  <LiveQuickLink
                    href={latestHref}
                    icon={<Bell size={16} />}
                    title="Latest News"
                    text="Read the latest stories"
                  />

                  <LiveQuickLink
                    href={videoHref}
                    icon={<Video size={16} />}
                    title="Featured Videos"
                    text="Watch video coverage"
                  />

                  <LiveQuickLink
                    href="/about"
                    icon={<Globe2 size={16} />}
                    title="About TV SUPREME"
                    text="Learn more about us"
                  />
                </div>
              </section>
            </aside>
          </div>

          {/* =======================================================
              OPTIONAL LIVE CHAT
          ======================================================== */}

          {showChat && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <Radio size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#111d4a]">
                    Live Chat
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Live chat is enabled for this broadcast.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Live chat integration can be connected
                  here later.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          LIVE INFORMATION
      ========================================================== */}

      <section className="bg-[#f8f7fc] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              Live Coverage
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              Stay connected throughout the day
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Watch TV SUPREME online and stay up to date
              with current news, live coverage and special
              broadcasts.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            <LiveInfoCard
              icon={<Radio size={20} />}
              title="Live News"
              text="Follow current developments and breaking stories as they happen."
            />

            <LiveInfoCard
              icon={<Video size={20} />}
              title="Live Programmes"
              text="Watch TV SUPREME programmes and live broadcast content online."
            />

            <LiveInfoCard
              icon={<Clock3 size={20} />}
              title="Stay Updated"
              text="Return throughout the day for the latest live coverage."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          EXPERIENCE
      ========================================================== */}

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                Live Experience
              </span>

              <h2 className="mt-3 text-3xl font-black text-[#111d4a] sm:text-4xl">
                Your screen, wherever you are
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                The TV SUPREME live experience is designed
                to work across desktop, tablet and mobile
                devices.
              </p>

              <div className="mt-7 space-y-3">
                <ExperienceRow
                  icon={<MonitorIcon />}
                  title="Desktop"
                  text="Watch on a large screen with a responsive player."
                />

                <ExperienceRow
                  icon={<SmartphoneIcon />}
                  title="Mobile"
                  text="Stay connected from your phone or tablet."
                />

                <ExperienceRow
                  icon={<CalendarDays size={18} />}
                  title="Live Events"
                  text="Special broadcasts and important live coverage can be watched here."
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#111d4a] via-[#2c215f] to-[#5f19c8] p-6 text-white shadow-xl sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Radio size={22} />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                {channelName}
              </p>

              <h3 className="mt-2 text-2xl font-black">
                Watch the news live
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/65">
                Keep this page open during major news events
                and special coverage to watch the live
                broadcast.
              </p>

              <a
                href="#live-player"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
              >
                <Play
                  size={15}
                  fill="currentColor"
                />

                Watch Live
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}

      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]">
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                {channelName}
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Never miss an important story
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Explore the latest news, videos and live
                coverage from TV SUPREME.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link
                href={latestHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
              >
                Latest News

                <ChevronRight size={16} />
              </Link>

              <Link
                href={videoHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Videos

                <Video size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   QUICK LINK
=============================================================== */

function LiveQuickLink({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-pink-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600 group-hover:bg-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-700 group-hover:text-pink-600">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-400">
          {text}
        </p>
      </div>

      <ChevronRight
        size={14}
        className="shrink-0 text-slate-300 group-hover:text-pink-500"
      />
    </Link>
  );
}

/* ===============================================================
   INFO CARD
=============================================================== */

function LiveInfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#111d4a]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* ===============================================================
   EXPERIENCE ROW
=============================================================== */

function ExperienceRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#111d4a]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   MONITOR ICON
=============================================================== */

function MonitorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="12"
        rx="2"
      />

      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

/* ===============================================================
   SMARTPHONE ICON
=============================================================== */

function SmartphoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="2"
      />

      <path d="M10 18h4" />
    </svg>
  );
}