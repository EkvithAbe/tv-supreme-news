"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type HeroStory = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  views: number;
  publishedAt: Date | string | null;
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  mainImage: {
    id: string;
    url: string;
    altText: string | null;
  } | null;
};

type HeroSliderProps = {
  stories: HeroStory[];
};

function formatTime(value: Date | string | null) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HeroSlider({
  stories,
}: HeroSliderProps) {
  const validStories = useMemo(
    () => stories.filter(Boolean),
    [stories],
  );

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const totalSlides = validStories.length;

  const goToNext = useCallback(() => {
    if (totalSlides <= 1) {
      return;
    }

    setCurrentIndex((current) =>
      current === totalSlides - 1
        ? 0
        : current + 1,
    );
  }, [totalSlides]);

  const goToPrevious = useCallback(() => {
    if (totalSlides <= 1) {
      return;
    }

    setCurrentIndex((current) =>
      current === 0
        ? totalSlides - 1
        : current - 1,
    );
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    if (index < 0 || index >= totalSlides) {
      return;
    }

    setCurrentIndex(index);
  };

  useEffect(() => {
    if (totalSlides <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      goToNext();
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [goToNext, totalSlides]);

  useEffect(() => {
    if (
      currentIndex >= totalSlides &&
      totalSlides > 0
    ) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  if (totalSlides === 0) {
    return (
      <article className="relative overflow-hidden rounded-xl bg-black shadow-sm">
        <div className="flex aspect-[16/9] min-h-[330px] items-center justify-center text-white sm:min-h-[400px]">
          <div className="text-center px-6">
            <p className="text-sm font-bold uppercase tracking-wide text-white/70">
              TV SUPREME
            </p>

            <h1 className="mt-2 text-3xl font-extrabold">
              Latest News
            </h1>

            <p className="mt-2 text-sm text-white/70">
              No published articles yet.
            </p>
          </div>
        </div>
      </article>
    );
  }

  const currentStory =
    validStories[currentIndex];

  if (!currentStory) {
    return null;
  }

  return (
    <article className="relative overflow-hidden rounded-xl bg-black shadow-sm">
      <div className="relative aspect-[16/9] min-h-[330px] sm:min-h-[400px]">
        <Image
          key={currentStory.id}
          src={
            currentStory.mainImage?.url ??
            "/images/home/hero.jpg"
          }
          alt={
            currentStory.mainImage?.altText ??
            currentStory.title
          }
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 67vw"
          className="object-cover transition-opacity duration-500"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        {/* Category */}
        {currentStory.category?.name && (
          <span className="absolute left-4 top-4 rounded-md bg-gradient-to-r from-[#ec008c] to-[#6a1b9a] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            {currentStory.category.name}
          </span>
        )}

        {/* Previous button */}
        {totalSlides > 1 && (
          <button
            type="button"
            aria-label="Previous story"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            <ChevronLeft size={21} />
          </button>
        )}

        {/* Next button */}
        {totalSlides > 1 && (
          <button
            type="button"
            aria-label="Next story"
            onClick={goToNext}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            <ChevronRight size={21} />
          </button>
        )}

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-7">
          <h1 className="max-w-4xl text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            {currentStory.title}
          </h1>

          {currentStory.summary && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
              {currentStory.summary}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-white">
            <span>
              ◷{" "}
              {formatTime(
                currentStory.publishedAt,
              )}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Eye size={15} />
              {currentStory.views}
            </span>

            <Link
              href={`/news/${currentStory.slug}`}
              className="ml-auto inline-flex items-center gap-1.5 font-bold text-white transition hover:text-fuchsia-200"
            >
              Read More
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Slider dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {validStories.map(
              (story, index) => {
                const isActive =
                  index === currentIndex;

                return (
                  <button
                    key={story.id}
                    type="button"
                    aria-label={`Go to story ${index + 1}`}
                    aria-current={
                      isActive
                        ? "true"
                        : undefined
                    }
                    onClick={() =>
                      goToSlide(index)
                    }
                    className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/80 ${
                      isActive
                        ? "h-2 w-6 bg-[#ec008c]"
                        : "h-2 w-2 bg-white/60 hover:bg-white"
                    }`}
                  />
                );
              },
            )}
          </div>
        )}
      </div>
    </article>
  );
}