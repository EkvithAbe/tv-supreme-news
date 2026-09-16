import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  Eye,
  Link2,
  Mail,
  MessageCircle,
  Share2,
  Tag,
} from "lucide-react";

/* ===============================================================
   TYPES
================================================================ */

type Article = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  image: string;
  time: string;
  views: string;
  author: string;
  publishedDate: string;
  content: string[];
  tags: string[];
};

/* ===============================================================
   TEMPORARY ARTICLE DATA
   This is UI/demo data for now.
   Later this will come from Prisma/PostgreSQL.
================================================================ */

const articles: Article[] = [
  {
    slug: "president-stresses-unity-for-a-stronger-sri-lanka",
    category: "Sri Lanka",
    title:
      "President stresses unity for a stronger Sri Lanka",
    summary:
      "The President has called for greater unity and cooperation as the country works towards a stronger and more sustainable future.",
    image: "/images/news/president.jpg",
    time: "12:30 PM",
    views: "12.5K",
    author: "TV SUPREME News Desk",
    publishedDate: "15 September 2026",
    content: [
      "The President has stressed the importance of national unity and cooperation while discussing the country's priorities for the future.",
      "The remarks focused on the need for people, institutions and communities to work together to support economic development and improve opportunities for citizens.",
      "The message comes as Sri Lanka continues to focus on strengthening key sectors and creating better conditions for long-term growth.",
      "Officials also highlighted the importance of maintaining public confidence, supporting communities and ensuring that development reaches people across the country.",
      "Further announcements and developments are expected as relevant programmes and initiatives move forward.",
    ],
    tags: [
      "Sri Lanka",
      "President",
      "National Development",
      "Politics",
    ],
  },

  {
    slug: "port-expansion-to-boost-regional-trade",
    category: "Business",
    title:
      "Port expansion to boost regional trade",
    summary:
      "A major port expansion programme is expected to strengthen trade activity and improve regional connectivity.",
    image: "/images/news/port.jpg",
    time: "11:45 AM",
    views: "8.7K",
    author: "TV SUPREME Business Desk",
    publishedDate: "15 September 2026",
    content: [
      "Plans for port expansion are expected to support increased trade and improve Sri Lanka's position as a regional logistics hub.",
      "The proposed improvements are focused on increasing capacity, improving infrastructure and supporting more efficient movement of goods.",
      "Industry stakeholders say stronger connectivity could create opportunities for businesses involved in shipping, logistics and related services.",
      "The development is also expected to support wider economic activity through investment and employment opportunities.",
      "Further details regarding timelines and implementation are expected to be announced as the programme progresses.",
    ],
    tags: [
      "Business",
      "Ports",
      "Trade",
      "Sri Lanka Economy",
    ],
  },

  {
    slug: "sri-lanka-eye-series-win-in-final-test",
    category: "Sports",
    title:
      "Sri Lanka eye series win in final Test",
    summary:
      "Sri Lanka are preparing for the final Test as the team looks to secure a series victory.",
    image: "/images/news/cricket.jpg",
    time: "10:20 AM",
    views: "15.2K",
    author: "TV SUPREME Sports Desk",
    publishedDate: "15 September 2026",
    content: [
      "Sri Lanka are preparing for the decisive Test match with the team focused on maintaining momentum and producing a strong performance.",
      "The squad has been working on preparation, consistency and adapting to the conditions ahead of the important match.",
      "Supporters will be looking closely at the team's batting, bowling and overall strategy during the final Test.",
      "The result could determine the overall outcome of the series and provide an important boost ahead of upcoming international fixtures.",
      "More updates will follow as the match approaches and team announcements are made.",
    ],
    tags: [
      "Sports",
      "Cricket",
      "Sri Lanka Cricket",
      "Test Match",
    ],
  },

  {
    slug: "heavy-rains-expected-across-several-districts",
    category: "Sri Lanka",
    title:
      "Heavy rains expected across several districts",
    summary:
      "Authorities have advised the public to remain alert as heavy rainfall is expected across several areas.",
    image: "/images/news/rain.jpg",
    time: "09:10 AM",
    views: "19.4K",
    author: "TV SUPREME News Desk",
    publishedDate: "15 September 2026",
    content: [
      "Several areas are expected to experience heavy rainfall, with authorities advising the public to remain alert and follow official guidance.",
      "Residents in areas vulnerable to flooding and landslides have been encouraged to take necessary precautions.",
      "Road conditions may also change rapidly during periods of heavy rain, particularly in low-lying and hilly areas.",
      "The public is advised to monitor official weather and emergency updates throughout the day.",
      "TV SUPREME will continue to provide updates as new information becomes available.",
    ],
    tags: [
      "Sri Lanka",
      "Weather",
      "Rain",
      "Weather Update",
    ],
  },

  {
    slug: "global-tech-giant-to-unveil-new-ai-features-today",
    category: "Technology",
    title:
      "Global tech giant to unveil new AI features today",
    summary:
      "A major technology company is expected to announce a new set of artificial intelligence features.",
    image: "/images/news/technology.jpg",
    time: "08:30 AM",
    views: "11.8K",
    author: "TV SUPREME Technology Desk",
    publishedDate: "15 September 2026",
    content: [
      "A major technology company is preparing to introduce new artificial intelligence features as competition in the technology sector continues to grow.",
      "The expected announcements are likely to focus on improving productivity, user experience and intelligent digital services.",
      "Technology users and developers are closely watching the launch for information about new capabilities and availability.",
      "The latest developments reflect the growing role of artificial intelligence across consumer and business applications.",
      "More details will become available following the official announcement.",
    ],
    tags: [
      "Technology",
      "AI",
      "Artificial Intelligence",
      "Innovation",
    ],
  },

  {
    slug: "new-investment-to-create-thousands-of-jobs",
    category: "Business",
    title:
      "New investment to create thousands of jobs",
    summary:
      "A new investment programme is expected to generate employment opportunities and support economic activity.",
    image: "/images/news/port.jpg",
    time: "4h ago",
    views: "3.2K",
    author: "TV SUPREME Business Desk",
    publishedDate: "15 September 2026",
    content: [
      "A new investment programme is expected to create employment opportunities while supporting activity across several sectors.",
      "The initiative is designed to encourage investment and strengthen productive capacity in areas with growth potential.",
      "Businesses and industry representatives are expected to benefit from new opportunities created through the investment.",
      "Officials said continued investment will remain important for supporting economic development and job creation.",
      "Further information about the programme is expected to be released as implementation begins.",
    ],
    tags: [
      "Business",
      "Investment",
      "Jobs",
      "Economy",
    ],
  },

  {
    slug: "global-leaders-call-for-climate-action",
    category: "World",
    title:
      "Global leaders call for climate action",
    summary:
      "World leaders have renewed calls for coordinated action on climate-related challenges.",
    image: "/images/news/world.jpg",
    time: "6h ago",
    views: "4.8K",
    author: "TV SUPREME World Desk",
    publishedDate: "15 September 2026",
    content: [
      "Global leaders have renewed calls for coordinated action to address climate-related challenges and strengthen international cooperation.",
      "Discussions have focused on reducing risks, improving resilience and supporting long-term environmental sustainability.",
      "Countries continue to examine policies and investments aimed at reducing the impact of climate-related events.",
      "Experts and policymakers have also highlighted the importance of cooperation between governments, businesses and communities.",
      "Further international discussions are expected to continue in the coming weeks.",
    ],
    tags: [
      "World",
      "Climate",
      "Environment",
      "Global News",
    ],
  },

  {
    slug: "sri-lanka-fight-back-on-day-3",
    category: "Sports",
    title:
      "Sri Lanka fight back on Day 3",
    summary:
      "Sri Lanka produced a strong response on the third day as the match remained closely contested.",
    image: "/images/news/cricket.jpg",
    time: "8h ago",
    views: "6.1K",
    author: "TV SUPREME Sports Desk",
    publishedDate: "15 September 2026",
    content: [
      "Sri Lanka produced a determined performance on the third day as the team looked to regain control of the match.",
      "The players responded positively after earlier pressure and produced important contributions in key stages of the game.",
      "The contest remained closely balanced as both sides looked for opportunities to gain an advantage.",
      "The next phase of the match is expected to be closely followed by supporters.",
      "TV SUPREME will continue to provide updates and analysis.",
    ],
    tags: [
      "Sports",
      "Cricket",
      "Match Update",
    ],
  },

  {
    slug: "next-generation-smartphones-to-hit-markets-soon",
    category: "Technology",
    title:
      "Next generation smartphones to hit markets soon",
    summary:
      "The latest generation of smartphones is expected to introduce new hardware and software features.",
    image: "/images/news/phone.jpg",
    time: "10h ago",
    views: "7.9K",
    author: "TV SUPREME Technology Desk",
    publishedDate: "15 September 2026",
    content: [
      "A new generation of smartphones is expected to reach markets with updated hardware, improved displays and new software features.",
      "Manufacturers are increasingly focusing on artificial intelligence, battery efficiency and improved mobile photography.",
      "Consumers are also seeing greater competition around performance, design and connectivity.",
      "The latest devices are expected to continue the trend towards more intelligent and connected mobile experiences.",
      "Availability and pricing will vary by market following the official launches.",
    ],
    tags: [
      "Technology",
      "Smartphones",
      "Mobile",
      "Innovation",
    ],
  },
];

/* ===============================================================
   HELPERS
================================================================ */

function getArticleBySlug(slug: string) {
  return articles.find(
    (article) => article.slug === slug
  );
}

function getRelatedArticles(
  currentArticle: Article
) {
  return articles
    .filter(
      (article) =>
        article.slug !== currentArticle.slug
    )
    .sort((a, b) => {
      if (a.category === currentArticle.category) {
        return -1;
      }

      if (b.category === currentArticle.category) {
        return 1;
      }

      return 0;
    })
    .slice(0, 4);
}

/* ===============================================================
   PAGE
================================================================ */

type NewsPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function NewsArticlePage({
  params,
}: NewsPageProps) {
  const { locale, slug } = await params;

  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles =
    getRelatedArticles(article);

  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          BREADCRUMB
      ========================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link
              href={`/${locale}`}
              className="font-medium transition hover:text-pink-600"
            >
              Home
            </Link>

            <ChevronRight size={13} />

            <Link
              href={`/${locale}/${article.category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="font-medium transition hover:text-pink-600"
            >
              {article.category}
            </Link>

            <ChevronRight size={13} />

            <span className="truncate font-medium text-slate-500">
              News
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN ARTICLE
      ========================================================== */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-10">
            {/* =====================================================
                ARTICLE
            ====================================================== */}
            <article className="min-w-0">
              {/* Back */}
              <Link
                href={`/${locale}/latest`}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-pink-600"
              >
                <ArrowLeft size={16} />
                Back to Latest News
              </Link>

              {/* Category */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600">
                  {article.category}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  News
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-5 max-w-5xl text-3xl font-black leading-tight tracking-tight text-[#111d4a] sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {/* Summary */}
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">
                {article.summary}
              </p>

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-slate-100 py-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} />
                  {article.publishedDate}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock3 size={14} />
                  {article.time}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Eye size={14} />
                  {article.views} views
                </span>

                <span>
                  By{" "}
                  <span className="font-semibold text-slate-600">
                    {article.author}
                  </span>
                </span>
              </div>

              {/* Main Image */}
              <div className="mt-7 overflow-hidden rounded-[24px] bg-slate-100">
                <div className="relative aspect-[16/9] w-full">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Image caption */}
              <p className="mt-2 text-xs leading-5 text-slate-400">
                TV SUPREME | {article.title}
              </p>

              {/* Share bar */}
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Share2
                    size={17}
                    className="text-pink-600"
                  />

                  <span className="text-sm font-semibold text-slate-700">
                    Share this story
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ShareButton
                    icon={<FacebookIcon />}
                    label="Facebook"
                  />

                  <ShareButton
                    icon={<XIcon />}
                    label="X"
                  />

                  <ShareButton
                    icon={<Link2 size={15} />}
                    label="Copy link"
                  />
                </div>
              </div>

              {/* Article Content */}
              <div className="mt-8">
                <div className="max-w-4xl space-y-6 text-[16px] leading-8 text-slate-700">
                  {article.content.map(
                    (paragraph, index) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-9 border-t border-slate-100 pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag
                    size={16}
                    className="mr-1 text-pink-600"
                  />

                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-purple-600 text-sm font-black text-white">
                    TV
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Published by
                    </p>

                    <h3 className="mt-1 text-base font-bold text-[#111d4a]">
                      {article.author}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Comments placeholder */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                    <MessageCircle size={18} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111d4a]">
                      Comments
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Reader comments will be connected later.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* =====================================================
                SIDEBAR
            ====================================================== */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Latest */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-pink-600">
                        TV SUPREME
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-[#111d4a]">
                        Latest News
                      </h2>
                    </div>

                    <Link
                      href={`/${locale}/latest`}
                      className="text-xs font-semibold text-pink-600 hover:text-purple-600"
                    >
                      View All
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {articles
                    .filter(
                      (item) =>
                        item.slug !==
                        article.slug
                    )
                    .slice(0, 5)
                    .map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${locale}/news/${item.slug}`}
                        className="group flex gap-3 p-4 transition hover:bg-slate-50"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-pink-600">
                            {item.category}
                          </span>

                          <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-700 group-hover:text-pink-600">
                            {item.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </section>

              {/* Newsletter */}
              <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#111d4a] to-[#3c2372] p-6 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Mail size={18} />
                </div>

                <h2 className="mt-4 text-xl font-black">
                  Stay informed
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  Follow TV SUPREME for the latest stories and
                  important updates.
                </p>

                <Link
                  href={`/${locale}/latest`}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Explore Latest
                  <ChevronRight size={15} />
                </Link>
              </section>

              {/* Topics */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#111d4a]">
                  Popular Topics
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Sri Lanka",
                    "Economy",
                    "Cricket",
                    "Technology",
                    "Politics",
                    "World",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>

      {/* =========================================================
          RELATED STORIES
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                More Stories
              </span>

              <h2 className="mt-2 text-2xl font-black text-[#111d4a] sm:text-3xl">
                Related News
              </h2>
            </div>

            <Link
              href={`/${locale}/latest`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-purple-600"
            >
              See all news
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/news/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-pink-600 shadow-sm">
                    {item.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-3 text-sm font-bold leading-5 text-[#111d4a] group-hover:text-pink-600">
                    {item.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.time}</span>

                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} />
                      {item.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]">
          <div className="flex flex-col gap-6 px-6 py-9 sm:px-10 sm:py-11 lg:flex-row lg:items-center lg:justify-between lg:px-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                TV SUPREME
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Keep up with the latest stories
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/70">
                Discover more news, videos and live coverage from
                TV SUPREME.
              </p>
            </div>

            <Link
              href={`/${locale}/latest`}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
            >
              View Latest News
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   SHARE BUTTON
================================================================ */

function ShareButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
    >
      {icon}
    </button>
  );
}

/* ===============================================================
   FACEBOOK ICON
================================================================ */

function FacebookIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.314 0-6 2.686-6 6v2H5v4h3v6h4v-6h4l1-4h-5v-2a2 2 0 0 1 2-2z" />
    </svg>
  );
}

/* ===============================================================
   X ICON
================================================================ */

function XIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.548l-5.128-6.703L5.205 22H1.947l7.604-8.69L1.5 2h6.715l4.635 6.134L18.244 2Zm-1.148 17.847h1.807L7.22 4.045H5.281l11.815 15.802Z" />
    </svg>
  );
}