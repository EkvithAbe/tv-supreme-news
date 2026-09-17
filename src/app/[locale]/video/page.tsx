import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Eye,
  Globe2,
  Play,
  Radio,
  Video as VideoIcon,
} from "lucide-react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface VideoPageProps {
  params: Promise<{
    locale: string;
  }>;
}

type SupportedLanguage = "EN" | "SI" | "TA";

function getLanguage(
  locale: string,
): SupportedLanguage {
  if (locale === "si") {
    return "SI";
  }

  if (locale === "ta") {
    return "TA";
  }

  if (locale === "en") {
    return "EN";
  }

  notFound();
}

function formatDate(
  date: Date | null,
  locale: string,
) {
  if (!date) {
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
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDuration(
  seconds: number | null,
) {
  if (
    seconds === null ||
    seconds === undefined ||
    seconds <= 0
  ) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function getYouTubeEmbedUrl(
  url: string,
) {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes(
        "youtube.com",
      )
    ) {
      if (
        parsed.pathname ===
        "/watch"
      ) {
        const videoId =
          parsed.searchParams.get(
            "v",
          );

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
          parsed.pathname.split(
            "/",
          )[2];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
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

function isHostedEmbed(
  url: string,
) {
  const value = url.toLowerCase();

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

function isDirectVideo(
  url: string,
) {
  const value = url.toLowerCase();

  return (
    value.includes(".mp4") ||
    value.includes(".webm") ||
    value.includes(".ogg") ||
    value.includes(".m3u8")
  );
}

export default async function VideoPage({
  params,
}: VideoPageProps) {
  const { locale } = await params;

  const language =
    getLanguage(locale);

  /*
   * ============================================================
   * LOAD PUBLISHED VIDEOS
   * ============================================================
   */

  const videos =
    await prisma.video.findMany({
      where: {
        language,
        status: "PUBLISHED",
      },
      orderBy: [
        {
          isFeatured: "desc",
        },
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 100,
    });

  /*
   * ============================================================
   * LOAD THUMBNAILS
   *
   * We load Media separately to avoid relation typing
   * issues with the current Prisma setup.
   * ============================================================
   */

  const thumbnailIds =
    videos
      .map(
        (video) =>
          video.thumbnailId,
      )
      .filter(
        (
          id,
        ): id is string =>
          Boolean(id),
      );

  const thumbnails =
    thumbnailIds.length > 0
      ? await prisma.media.findMany({
          where: {
            id: {
              in: thumbnailIds,
            },
          },
        })
      : [];

  const thumbnailMap =
    new Map(
      thumbnails.map(
        (media) => [
          media.id,
          media.url,
        ],
      ),
    );

  /*
   * ============================================================
   * FEATURED + REGULAR VIDEOS
   * ============================================================
   */

  const featuredVideo =
    videos.find(
      (video) =>
        video.isFeatured,
    ) ?? videos[0] ?? null;

  const remainingVideos =
    featuredVideo
      ? videos.filter(
          (video) =>
            video.id !==
            featuredVideo.id,
        )
      : [];

  const featuredThumbnail =
    featuredVideo?.thumbnailId
      ? thumbnailMap.get(
          featuredVideo.thumbnailId,
        )
      : null;

  const latestHref =
    `/${locale}/latest`;

  const liveHref =
    `/${locale}/watch-live`;

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
                <VideoIcon size={14} />
                TV SUPREME Videos
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Video
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Watch the latest TV SUPREME
                video news, programmes,
                interviews and special coverage.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={liveHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
                >
                  <Radio
                    size={15}
                  />
                  Watch Live
                </Link>

                <Link
                  href={latestHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Latest News
                  <ChevronRight
                    size={15}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VIDEO CONTENT
      ========================================================== */}

      <section className="py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {videos.length === 0 ? (
            <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <VideoIcon
                  size={28}
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#111d4a]">
                No videos available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Published TV SUPREME videos
                will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* ===================================================
                  FEATURED VIDEO
              ==================================================== */}

              {featuredVideo && (
                <section>
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                        Featured
                      </span>

                      <h2 className="mt-2 text-2xl font-black text-[#111d4a] sm:text-3xl">
                        Featured Video
                      </h2>
                    </div>

                    <span className="hidden text-xs font-medium text-slate-400 sm:block">
                      {videos.length}{" "}
                      published{" "}
                      {videos.length ===
                      1
                        ? "video"
                        : "videos"}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
                    <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
                      {/* Player / Thumbnail */}

                      <div className="relative aspect-video overflow-hidden bg-[#101527]">
                        {featuredVideo.videoUrl &&
                        isHostedEmbed(
                          featuredVideo.videoUrl,
                        ) ? (
                          <iframe
                            src={
                              featuredVideo.videoUrl
                            }
                            title={
                              featuredVideo.title
                            }
                            className="absolute inset-0 h-full w-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                            allowFullScreen
                            loading="eager"
                          />
                        ) : featuredVideo.videoUrl &&
                          getYouTubeEmbedUrl(
                            featuredVideo.videoUrl,
                          ) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(
                              featuredVideo.videoUrl,
                            )!}
                            title={
                              featuredVideo.title
                            }
                            className="absolute inset-0 h-full w-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                            allowFullScreen
                            loading="eager"
                          />
                        ) : featuredVideo.videoUrl &&
                          isDirectVideo(
                            featuredVideo.videoUrl,
                          ) ? (
                          <video
                            src={
                              featuredVideo.videoUrl
                            }
                            poster={
                              featuredThumbnail ??
                              undefined
                            }
                            className="absolute inset-0 h-full w-full bg-black object-contain"
                            controls
                            playsInline
                            preload="metadata"
                          />
                        ) : featuredThumbnail ? (
                          <a
                            href={
                              featuredVideo.videoUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group absolute inset-0 block"
                          >
                            <img
                              src={
                                featuredThumbnail
                              }
                              alt={
                                featuredVideo.title
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />

                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#5f19c8] shadow-xl transition group-hover:scale-110">
                                <Play
                                  size={25}
                                  fill="currentColor"
                                />
                              </div>
                            </div>
                          </a>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#151b35] via-[#20264a] to-[#101527]">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-xl">
                              <VideoIcon
                                size={28}
                              />
                            </div>
                          </div>
                        )}

                        {featuredVideo.isFeatured && (
                          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-pink-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                            Featured
                          </span>
                        )}

                        {featuredVideo.duration ? (
                          <span className="absolute bottom-4 right-4 z-10 rounded-md bg-black/75 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
                            {formatDuration(
                              featuredVideo.duration,
                            )}
                          </span>
                        ) : null}
                      </div>

                      {/* Details */}

                      <div className="flex flex-col justify-center p-6 sm:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-600">
                          TV SUPREME
                        </p>

                        <h3 className="mt-3 text-2xl font-black leading-tight text-[#111d4a] sm:text-3xl">
                          {
                            featuredVideo.title
                          }
                        </h3>

                        {featuredVideo.description && (
                          <p className="mt-4 text-sm leading-7 text-slate-500">
                            {
                              featuredVideo.description
                            }
                          </p>
                        )}

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                          {featuredVideo.publishedAt && (
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={14}
                              />

                              {formatDate(
                                featuredVideo.publishedAt,
                                locale,
                              )}
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1.5">
                            <Eye
                              size={14}
                            />

                            {featuredVideo.views.toLocaleString()}
                            {" "}
                            views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ===================================================
                  ALL VIDEOS
              ==================================================== */}

              {remainingVideos.length >
                0 && (
                <section className="mt-12">
                  <div className="mb-6">
                    <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                      Latest Videos
                    </span>

                    <h2 className="mt-2 text-2xl font-black text-[#111d4a] sm:text-3xl">
                      More Videos
                    </h2>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {remainingVideos.map(
                      (video) => {
                        const thumbnail =
                          video.thumbnailId
                            ? thumbnailMap.get(
                                video.thumbnailId,
                              )
                            : null;

                        const youtubeEmbed =
                          getYouTubeEmbedUrl(
                            video.videoUrl,
                          );

                        const hostedEmbed =
                          isHostedEmbed(
                            video.videoUrl,
                          );

                        return (
                          <article
                            key={
                              video.id
                            }
                            className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                          >
                            {/* Thumbnail */}

                            <div className="relative aspect-video overflow-hidden bg-[#111d4a]">
                              {thumbnail ? (
                                <img
                                  src={
                                    thumbnail
                                  }
                                  alt={
                                    video.title
                                  }
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#151b35] via-[#20264a] to-[#101527]">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 text-white">
                                    <VideoIcon
                                      size={21}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />

                              {/* Play */}

                              {video.videoUrl && (
                                hostedEmbed ||
                                youtubeEmbed ||
                                isDirectVideo(
                                  video.videoUrl,
                                ) ||
                                thumbnail
                              ) ? (
                                <a
                                  href={
                                    hostedEmbed ||
                                    youtubeEmbed ||
                                    !isDirectVideo(
                                      video.videoUrl,
                                    )
                                      ? video.videoUrl
                                      : "#"
                                  }
                                  target={
                                    hostedEmbed ||
                                    youtubeEmbed
                                      ? "_blank"
                                      : undefined
                                  }
                                  rel={
                                    hostedEmbed ||
                                    youtubeEmbed
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#5f19c8] shadow-lg transition duration-300 group-hover:scale-110">
                                    <Play
                                      size={18}
                                      fill="currentColor"
                                    />
                                  </span>
                                </a>
                              ) : null}

                              {video.duration ? (
                                <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
                                  {formatDuration(
                                    video.duration,
                                  )}
                                </span>
                              ) : null}
                            </div>

                            {/* Content */}

                            <div className="p-4">
                              <h3 className="line-clamp-2 text-base font-bold leading-6 text-[#111d4a] transition group-hover:text-pink-600">
                                {
                                  video.title
                                }
                              </h3>

                              {video.description && (
                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {
                                    video.description
                                  }
                                </p>
                              )}

                              <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                                <span className="inline-flex items-center gap-1.5">
                                  <Eye
                                    size={12}
                                  />

                                  {video.views.toLocaleString()}
                                </span>

                                {video.publishedAt && (
                                  <span>
                                    {formatDate(
                                      video.publishedAt,
                                      locale,
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      },
                    )}
                  </div>
                </section>
              )}
            </>
          )}
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
                TV SUPREME
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Watch more from TV SUPREME
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Explore the latest stories or
                watch TV SUPREME live coverage.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link
                href={latestHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
              >
                Latest News
                <ChevronRight
                  size={16}
                />
              </Link>

              <Link
                href={liveHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Watch Live
                <Radio
                  size={16}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}