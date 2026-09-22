"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Loader2,
  Play,
  Radio,
} from "lucide-react";

type LiveTVSettings = {
  channelName: string;
  streamUrl: string;
  fallbackUrl: string;
  streamType: string;
  isLive: boolean;
  isEnabled: boolean;
  playerTitle: string;
  autoPlay: boolean;
};

type Props = {
  settings: LiveTVSettings | null;
  poster?: string;
  compact?: boolean;
};

/* =========================================================
   PLAYER URL
========================================================= */

function getPlayerUrl(
  settings: LiveTVSettings | null,
): string {
  if (!settings) {
    return "";
  }

  return (
    settings.streamUrl?.trim() ||
    settings.fallbackUrl?.trim() ||
    ""
  );
}

/* =========================================================
   AUTOPLAY EMBED URL
========================================================= */

function getAutoplayEmbedUrl(
  url: string,
): string {
  try {
    const parsed = new URL(url);

    const hostname =
      parsed.hostname.toLowerCase();

    /*
     * Castr
     *
     * Castr documents:
     * autoplay=on
     * muted=on
     */
    if (
      hostname.includes("player.castr.com")
    ) {
      parsed.searchParams.set(
        "autoplay",
        "on",
      );

      parsed.searchParams.set(
        "muted",
        "on",
      );

      return parsed.toString();
    }

    /*
     * YouTube
     */
    if (
      hostname.includes("youtube.com") ||
      hostname.includes(
        "youtube-nocookie.com",
      )
    ) {
      parsed.searchParams.set(
        "autoplay",
        "1",
      );

      parsed.searchParams.set(
        "mute",
        "1",
      );

      return parsed.toString();
    }

    /*
     * Vimeo
     */
    if (
      hostname.includes(
        "player.vimeo.com",
      )
    ) {
      parsed.searchParams.set(
        "autoplay",
        "1",
      );

      parsed.searchParams.set(
        "muted",
        "1",
      );

      return parsed.toString();
    }

    /*
     * Generic embed provider
     */
    parsed.searchParams.set(
      "autoplay",
      "1",
    );

    parsed.searchParams.set(
      "muted",
      "1",
    );

    return parsed.toString();
  } catch {
    return url;
  }
}

/* =========================================================
   HOSTED PLAYER DETECTION
========================================================= */

function isHostedPlayerUrl(
  url: string,
): boolean {
  const normalized =
    url.toLowerCase();

  return (
    normalized.includes(
      "player.castr.com",
    ) ||
    normalized.includes(
      "youtube.com/embed",
    ) ||
    normalized.includes(
      "youtube-nocookie.com/embed",
    ) ||
    normalized.includes(
      "player.vimeo.com",
    )
  );
}

/* =========================================================
   HLS DETECTION
========================================================= */

function isHlsUrl(
  url: string,
): boolean {
  const normalized =
    url.toLowerCase();

  return (
    normalized.includes(".m3u8") ||
    normalized.includes(
      "application/vnd.apple.mpegurl",
    ) ||
    normalized.includes(
      "application/x-mpegurl",
    )
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function LiveTVPlayer({
  settings,
  poster = "/images/home/live-tv.jpg",
  compact = false,
}: Props) {
  const videoRef =
    useRef<HTMLVideoElement | null>(
      null,
    );

  const hlsRef = useRef<{
    destroy: () => void;
  } | null>(null);

  /*
   * This wrapper is used only for the
   * Home page compact player.
   */
  const embedContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  /*
   * For the Home page, wait until the player
   * is near the viewport before creating the
   * third-party iframe.
   *
   * Watch Live page keeps the original
   * immediate loading behavior.
   */
  const [hasIntersected, setHasIntersected] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [playerError, setPlayerError] =
    useState("");

  const playerUrl =
    getPlayerUrl(settings);

  const streamType =
    settings?.streamType || "HLS";

  const isEnabled =
    settings?.isEnabled ?? false;

  const isLive =
    settings?.isLive ?? false;

  const autoPlay =
    settings?.autoPlay ?? true;

  const playerTitle =
    settings?.playerTitle ||
    settings?.channelName ||
    "TV SUPREME Live";

  const hostedPlayer =
    Boolean(playerUrl) &&
    (isHostedPlayerUrl(playerUrl) ||
      streamType === "EMBED");

  const shouldLoadEmbed =
    !hostedPlayer ||
    !compact ||
    hasIntersected;

  const directHls =
    Boolean(playerUrl) &&
    streamType === "HLS" &&
    isHlsUrl(playerUrl) &&
    !hostedPlayer;

  /*
   * Build the actual URL used by the iframe.
   */
  const autoplayPlayerUrl =
    hostedPlayer && autoPlay
      ? getAutoplayEmbedUrl(
          playerUrl,
        )
      : playerUrl;

  /* =======================================================
     INTERSECTION OBSERVER FOR HOME EMBED
  ======================================================== */

  useEffect(() => {
    /*
     * Nothing to observe when:
     *
     * - this is not a hosted player
     * - this is not the compact Home player
     */
    if (!hostedPlayer || !compact) {
      return;
    }

    const element =
      embedContainerRef.current;

    if (!element) {
      return;
    }

    /*
     * Start loading a little before the player
     * enters the visible screen.
     */
    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting
          ) {
            setHasIntersected(true);

            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin:
            "300px 0px",
          threshold: 0.01,
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    hostedPlayer,
    compact,
  ]);

  /* =======================================================
     CLEANUP HLS
  ======================================================== */

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  /* =======================================================
     HLS PLAYER
  ======================================================== */

  useEffect(() => {
    if (
      hostedPlayer ||
      !directHls ||
      !playerUrl
    ) {
      return;
    }

    let cancelled = false;

    async function attachHls() {
      const video =
        videoRef.current;

      if (!video) {
        return;
      }

      try {
        setPlayerError("");
        setIsLoading(true);

        /*
         * Safari / iOS native HLS
         */
        if (
          video.canPlayType(
            "application/vnd.apple.mpegurl",
          )
        ) {
          video.src = playerUrl;

          if (
            autoPlay &&
            !cancelled
          ) {
            try {
              await video.play();
            } catch {
              /*
               * Browser autoplay policy
               * may block playback.
               */
            }
          }

          if (!cancelled) {
            setIsLoading(false);
          }

          return;
        }

        /*
         * HLS.js
         */
        const hlsModule =
          await import("hls.js");

        if (cancelled) {
          return;
        }

        const Hls =
          hlsModule.default;

        if (!Hls.isSupported()) {
          setPlayerError(
            "This browser cannot play the HLS stream.",
          );

          setIsLoading(false);
          return;
        }

        const hls =
          new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30,
          });

        hlsRef.current = hls;

        hls.on(
          Hls.Events.ERROR,
          (
            _event: unknown,
            data: {
              fatal?: boolean;
              details?: string;
            },
          ) => {
            if (!data.fatal) {
              return;
            }

            setPlayerError(
              "The live stream could not be loaded.",
            );

            try {
              hls.destroy();
            } catch {
              // Ignore cleanup errors.
            }

            hlsRef.current = null;

            setIsLoading(false);
          },
        );

        hls.on(
          Hls.Events.MANIFEST_PARSED,
          async () => {
            if (cancelled) {
              return;
            }

            setIsLoading(false);

            if (autoPlay) {
              try {
                await video.play();
              } catch {
                /*
                 * Autoplay may be blocked.
                 */
              }
            }
          },
        );

        hls.loadSource(
          playerUrl,
        );

        hls.attachMedia(video);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to initialise live HLS player:",
          error,
        );

        setPlayerError(
          "The live stream could not be loaded.",
        );

        setIsLoading(false);
      }
    }

    void attachHls();

    return () => {
      cancelled = true;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const video =
        videoRef.current;

      if (video) {
        video.pause();
        video.removeAttribute(
          "src",
        );
        video.load();
      }
    };
  }, [
    autoPlay,
    directHls,
    hostedPlayer,
    playerUrl,
  ]);

  /* =======================================================
     NO LIVE TV CONFIGURATION
  ======================================================== */

  if (
    !settings ||
    !isEnabled ||
    !playerUrl
  ) {
    return (
      <div
        className={`relative overflow-hidden bg-black ${
          compact
            ? "aspect-video"
            : "aspect-video min-h-[300px]"
        }`}
      >
        <img
          src={poster}
          alt="TV SUPREME Live"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60">
            <Radio size={24} />
          </div>

          <p className="mt-4 text-sm font-extrabold">
            TV SUPREME LIVE
          </p>

          <p className="mt-1 text-xs text-white/75">
            {!settings
              ? "Live TV has not been configured yet."
              : !isEnabled
                ? "Live TV is currently disabled."
                : "Add a live stream URL in Admin → Live TV."}
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     HOSTED EMBED PLAYER
  ======================================================== */

  if (hostedPlayer) {
    return (
      <div
        ref={embedContainerRef}
        className={`relative bg-black ${
          compact
            ? "aspect-video"
            : "aspect-video min-h-[300px]"
        }`}
      >
        {shouldLoadEmbed ? (
          <iframe
            src={autoplayPlayerUrl}
            title={playerTitle}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            loading={
              compact
                ? "eager"
                : "eager"
            }
          />
        ) : (
          /*
           * Before the Home iframe is loaded,
           * keep the same player area.
           */
          <>
            <img
              src={poster}
              alt="TV SUPREME Live"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white">
                <Loader2
                  size={22}
                  className="animate-spin"
                />
              </div>
            </div>
          </>
        )}

        <div className="pointer-events-none absolute left-3 top-3 z-10">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur ${
              isLive
                ? "bg-red-600/90"
                : "bg-black/65"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLive
                  ? "animate-pulse bg-white"
                  : "bg-slate-300"
              }`}
            />

            {isLive
              ? "LIVE"
              : "OFFLINE"}
          </span>
        </div>
      </div>
    );
  }

  /* =======================================================
     DIRECT MP4 / HLS PLAYER
  ======================================================== */

  return (
    <div
      className={`relative bg-black ${
        compact
          ? "aspect-video"
          : "aspect-video min-h-[300px]"
      }`}
    >
      <video
        ref={videoRef}
        src={
          directHls
            ? undefined
            : playerUrl
        }
        poster={poster}
        title={playerTitle}
        className="absolute inset-0 h-full w-full bg-black object-contain"
        controls
        playsInline
        autoPlay={autoPlay}
        muted={autoPlay}
        preload="metadata"
        onLoadStart={() =>
          setIsLoading(true)
        }
        onCanPlay={() =>
          setIsLoading(false)
        }
        onError={() => {
          setIsLoading(false);

          setPlayerError(
            "The live video could not be played.",
          );
        }}
      />

      <div className="pointer-events-none absolute left-3 top-3 z-10">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur ${
            isLive
              ? "bg-red-600/90"
              : "bg-black/65"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isLive
                ? "animate-pulse bg-white"
                : "bg-slate-300"
            }`}
          />

          {isLive
            ? "LIVE"
            : "OFFLINE"}
        </span>
      </div>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
            <Loader2
              size={22}
              className="animate-spin"
            />
          </div>
        </div>
      )}

      {playerError && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-black/80 px-4 py-3 text-center text-xs text-white">
          {playerError}
        </div>
      )}

      {!isLive && (
        <div className="pointer-events-none absolute right-3 top-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-semibold text-white">
            <Play size={10} />
            Broadcast offline
          </span>
        </div>
      )}
    </div>
  );
}
