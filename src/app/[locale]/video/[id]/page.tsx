import Image from "next/image";
import { notFound } from "next/navigation";
import {
    CalendarDays,
    ChevronRight,
    Eye,
    Play,
    Radio,
    Video as VideoIcon,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* =========================================================
   TYPES
========================================================= */

type SupportedLanguage =
    | "EN"
    | "SI"
    | "TA";

/* =========================================================
   LANGUAGE
========================================================= */

function getLanguage(
    locale: string,
): SupportedLanguage {
    switch (locale) {
        case "si":
            return "SI";

        case "ta":
            return "TA";

        case "en":
            return "EN";

        default:
            notFound();
    }
}

/* =========================================================
   DATE
========================================================= */

function formatDate(
    value: Date | null,
    locale: string,
): string {
    if (!value) {
        return "";
    }

    return new Intl.DateTimeFormat(
        locale === "si"
            ? "si-LK"
            : locale === "ta"
                ? "ta-LK"
                : "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        },
    ).format(value);
}

/* =========================================================
   DURATION
========================================================= */

function formatDuration(
    seconds: number | null,
): string {
    if (
        seconds === null ||
        seconds === undefined ||
        seconds <= 0
    ) {
        return "";
    }

    const minutes = Math.floor(
        seconds / 60,
    );

    const remainingSeconds =
        seconds % 60;

    return `${minutes}:${String(
        remainingSeconds,
    ).padStart(2, "0")}`;
}

/* =========================================================
   YOUTUBE
========================================================= */

function getYouTubeEmbedUrl(
    url: string,
): string | null {
    try {
        const parsed = new URL(url);

        if (
            parsed.hostname.includes(
                "youtube.com",
            )
        ) {
            if (
                parsed.pathname === "/watch"
            ) {
                const videoId =
                    parsed.searchParams.get("v");

                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
            }

            if (
                parsed.pathname.startsWith(
                    "/live/",
                )
            ) {
                const videoId =
                    parsed.pathname.split("/")[2];

                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
            }

            if (
                parsed.pathname.startsWith(
                    "/embed/",
                )
            ) {
                return url;
            }
        }

        if (
            parsed.hostname === "youtu.be"
        ) {
            const videoId =
                parsed.pathname.replace(
                    "/",
                    "",
                );

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        return null;
    } catch {
        return null;
    }
}

/* =========================================================
   HOSTED PLAYER
========================================================= */

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

/* =========================================================
   DIRECT VIDEO
========================================================= */

function isDirectVideo(
    url: string,
): boolean {
    const value =
        url.toLowerCase();

    return (
        value.includes(".mp4") ||
        value.includes(".webm") ||
        value.includes(".ogg") ||
        value.includes(".m3u8")
    );
}

/* =========================================================
   PAGE
========================================================= */

interface VideoDetailPageProps {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}

export default async function VideoDetailPage({
    params,
}: VideoDetailPageProps) {
    const {
        locale,
        id,
    } = await params;

    const language =
        getLanguage(locale);

    /* =======================================================
       LOAD PUBLISHED VIDEO
    ======================================================== */
    const video =
        await prisma.video.findFirst({
            where: {
                id,
                language,
                status: "PUBLISHED",
            },

            include: {
                category: {
                    include: {
                        translations: {
                            where: {
                                language,
                            },
                        },
                    },
                },

                thumbnail: true,
            },
        });
    /*
     * If the video does not exist,
     * is not published, or belongs to
     * another language, show 404.
     */
    if (!video) {
        notFound();
    }

    /* =======================================================
       MEDIA
    ======================================================== */

    const thumbnail =
        video.thumbnail?.url ||
        "/images/home/live-tv.jpg";

    const youtubeEmbed =
        getYouTubeEmbedUrl(
            video.videoUrl,
        );

    const hostedEmbed =
        isHostedEmbed(
            video.videoUrl,
        );

    const directVideo =
        isDirectVideo(
            video.videoUrl,
        );

    /*
     * Hosted player or YouTube
     */
    const iframeUrl =
        hostedEmbed
            ? video.videoUrl
            : youtubeEmbed;

    return (
        <main className="min-h-screen bg-white text-[#111d4a]">

            {/* ===================================================
          BREADCRUMB
      ==================================================== */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">

                        <Link
                            href="/"
                            className="font-medium transition hover:text-pink-600"
                        >
                            Home
                        </Link>

                        <ChevronRight size={13} />

                        <Link
                            href="/video"
                            className="font-medium transition hover:text-pink-600"
                        >
                            Video
                        </Link>

                        <ChevronRight size={13} />

                        <span className="line-clamp-1 max-w-[260px] font-medium text-slate-500 sm:max-w-none">
                            {video.title}
                        </span>

                    </div>

                </div>
            </section>

            {/* ===================================================
          HERO
      ==================================================== */}

            <section className="relative overflow-hidden">

                <div className="absolute inset-0 bg-gradient-to-r from-[#3c2372] via-[#5f19c8] to-[#ec008c]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.18),transparent_30%)]" />

                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

                    <div className="max-w-4xl">

                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">

                            <VideoIcon size={14} />

                            TV SUPREME Video

                        </div>

                        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                            {video.title}
                        </h1>

                        {video.description && (
                            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                                {video.description}
                            </p>
                        )}

                    </div>

                </div>

            </section>

            {/* ===================================================
          VIDEO PLAYER
      ==================================================== */}

            <section className="py-8 sm:py-10 lg:py-12">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">

                        {/* PLAYER */}

                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#111d4a] shadow-xl">

                            <div className="relative aspect-video bg-black">

                                {iframeUrl ? (
                                    <iframe
                                        src={iframeUrl}
                                        title={video.title}
                                        className="absolute inset-0 h-full w-full border-0"
                                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                        allowFullScreen
                                    />
                                ) : directVideo ? (
                                    <video
                                        src={video.videoUrl}
                                        poster={thumbnail}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        className="absolute inset-0 h-full w-full bg-black object-contain"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#151b35] via-[#20264a] to-[#101527] px-6 text-center">

                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-xl">
                                            <VideoIcon size={28} />
                                        </div>

                                        <h2 className="mt-4 text-lg font-bold text-white">
                                            Video unavailable
                                        </h2>

                                        <p className="mt-2 max-w-md text-xs leading-5 text-slate-400">
                                            The video source is not available in a supported player format.
                                        </p>

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* DETAILS */}

                        <aside className="space-y-5">

                            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

                                <div className="relative aspect-video overflow-hidden bg-slate-100">

                                    <Image
                                        src={thumbnail}
                                        alt={
                                            video.thumbnail?.altText ||
                                            video.title
                                        }
                                        fill
                                        sizes="320px"
                                        className="object-cover"
                                    />

                                </div>

                                <div className="p-5">

                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-600">
                                        TV SUPREME
                                    </p>

                                    <h2 className="mt-3 text-lg font-black text-[#111d4a]">
                                        {video.title}
                                    </h2>

                                    <div className="mt-5 space-y-3 text-xs text-slate-400">

                                        {video.publishedAt && (
                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={14}
                                                />

                                                <span>
                                                    {formatDate(
                                                        video.publishedAt,
                                                        locale,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <Eye
                                                size={14}
                                            />

                                            <span>
                                                {video.views.toLocaleString()} views
                                            </span>
                                        </div>

                                        {video.duration && (
                                            <div className="flex items-center gap-2">
                                                <Play
                                                    size={14}
                                                />

                                                <span>
                                                    {formatDuration(
                                                        video.duration,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                    </div>

                                    {video.category && (
                                        <div className="mt-5">

                                            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600">
                                                {video.category.translations[0]?.name ??
                                                    video.category.slug}
                                            </span>

                                        </div>
                                    )}

                                </div>

                            </section>

                            {/* LIVE TV */}

                            <section className="rounded-[24px] bg-gradient-to-br from-[#111d4a] to-[#2e205f] p-5 text-white">

                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/60">

                                    <Radio size={14} />

                                    TV SUPREME Live

                                </div>

                                <h3 className="mt-3 text-lg font-black">
                                    Watch Live
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-white/60">
                                    Watch TV SUPREME&apos;s live broadcast.
                                </p>

                                <Link
                                    href="/watch-live"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
                                >
                                    Watch Live
                                    <ChevronRight size={15} />
                                </Link>

                            </section>

                        </aside>

                    </div>

                </div>

            </section>

        </main>
    );
}