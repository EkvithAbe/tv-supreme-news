"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Loader2 } from "lucide-react";

type Props = {
  videoUrl: string;
  title: string;
  poster?: string;
};

function getYouTubeEmbedUrl(
  url: string,
): string | null {
  try {
    const parsed = new URL(url);
    const hostname =
      parsed.hostname.toLowerCase();

    if (
      hostname === "youtu.be"
    ) {
      const id =
        parsed.pathname
          .replace(/^\/+/, "")
          .split("/")[0];

      return id
        ? `https://www.youtube.com/embed/${id}`
        : null;
    }

    if (
      hostname.includes("youtube.com")
    ) {
      if (
        parsed.pathname === "/watch"
      ) {
        const id =
          parsed.searchParams.get("v");

        return id
          ? `https://www.youtube.com/embed/${id}`
          : null;
      }

      if (
        parsed.pathname.startsWith(
          "/live/",
        )
      ) {
        const id =
          parsed.pathname
            .split("/")[2];

        return id
          ? `https://www.youtube.com/embed/${id}`
          : null;
      }

      if (
        parsed.pathname.startsWith(
          "/embed/",
        )
      ) {
        return url;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isHostedEmbed(
  url: string,
): boolean {
  const value =
    url.toLowerCase();

  return (
    value.includes(
      "player.castr.com",
    ) ||
    value.includes(
      "player.vimeo.com",
    ) ||
    value.includes(
      "youtube.com/embed",
    ) ||
    value.includes(
      "youtube-nocookie.com/embed",
    )
  );
}

function isHlsUrl(
  url: string,
): boolean {
  const value =
    url.toLowerCase();

  return (
    value.includes(".m3u8") ||
    value.includes(
      "application/vnd.apple.mpegurl",
    ) ||
    value.includes(
      "application/x-mpegurl",
    )
  );
}

function isDirectVideo(
  url: string,
): boolean {
  const value =
    url.toLowerCase();

  return (
    value.includes(".mp4") ||
    value.includes(".webm") ||
    value.includes(".ogg") ||
    isHlsUrl(value)
  );
}

export default function VideoPlayer({
  videoUrl,
  title,
  poster,
}: Props) {
  const videoRef =
    useRef<HTMLVideoElement | null>(
      null,
    );

  const hlsRef = useRef<{
    destroy: () => void;
  } | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const cleanUrl =
    videoUrl.trim();

  const youtubeUrl =
    getYouTubeEmbedUrl(
      cleanUrl,
    );

  const hosted =
    isHostedEmbed(
      cleanUrl,
    ) || Boolean(youtubeUrl);

  const hls =
    isHlsUrl(cleanUrl);

  /*
   * HLS direct playback.
   */
  useEffect(() => {
    if (
      hosted ||
      !hls ||
      !cleanUrl
    ) {
      return;
    }

    let cancelled = false;

    async function attach() {
      const video =
        videoRef.current;

      if (!video) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        if (
          video.canPlayType(
            "application/vnd.apple.mpegurl",
          )
        ) {
          video.src = cleanUrl;

          if (!cancelled) {
            setIsLoading(false);
          }

          return;
        }

        const hlsModule =
          await import("hls.js");

        if (cancelled) {
          return;
        }

        const Hls =
          hlsModule.default;

        if (!Hls.isSupported()) {
          setError(
            "This browser cannot play the HLS video.",
          );
          setIsLoading(false);
          return;
        }

        const player =
          new Hls();

        hlsRef.current =
          player;

        player.on(
          Hls.Events.ERROR,
          (
            _event: unknown,
            data: {
              fatal?: boolean;
            },
          ) => {
            if (
              data.fatal
            ) {
              setError(
                "The video could not be loaded.",
              );

              try {
                player.destroy();
              } catch {
                // Ignore cleanup errors.
              }

              hlsRef.current =
                null;

              setIsLoading(false);
            }
          },
        );

        player.on(
          Hls.Events.MANIFEST_PARSED,
          () => {
            if (!cancelled) {
              setIsLoading(false);
            }
          },
        );

        player.loadSource(
          cleanUrl,
        );

        player.attachMedia(
          video,
        );
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to initialise HLS video:",
          loadError,
        );

        setError(
          "The video could not be loaded.",
        );

        setIsLoading(false);
      }
    }

    void attach();

    return () => {
      cancelled = true;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current =
          null;
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
    cleanUrl,
    hls,
    hosted,
  ]);

  if (!cleanUrl) {
    return (
      <div className="flex aspect-video items-center justify-center bg-black text-sm text-white/70">
        Video source is unavailable.
      </div>
    );
  }

  if (youtubeUrl) {
    return (
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={youtubeUrl}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (hosted) {
    return (
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={cleanUrl}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  if (isDirectVideo(cleanUrl)) {
    return (
      <div className="relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          src={
            hls
              ? undefined
              : cleanUrl
          }
          poster={poster}
          title={title}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full bg-black object-contain"
          onLoadStart={() =>
            setIsLoading(true)
          }
          onCanPlay={() =>
            setIsLoading(false)
          }
          onError={() => {
            setIsLoading(false);
            setError(
              "The video could not be played.",
            );
          }}
        />

        {isLoading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white">
              <Loader2
                size={22}
                className="animate-spin"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-0 bottom-0 bg-black/80 px-4 py-3 text-center text-xs text-white">
            {error}
          </div>
        )}
      </div>
    );
  }

  /*
   * Fallback:
   * treat unknown video URLs as embedded players.
   */
  return (
    <div className="relative aspect-video w-full bg-black">
      <iframe
        src={cleanUrl}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
