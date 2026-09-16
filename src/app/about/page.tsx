import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Globe2,
  HeartHandshake,
  Mail,
  Newspaper,
  Target,
  Users,
  Video,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3c2372] via-[#5f19c8] to-[#ec008c]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.18),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[250px] items-center py-14 sm:min-h-[290px] sm:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Globe2 size={14} />
                TV SUPREME
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                About Us
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Discover who we are, what we stand for and why we are
                committed to bringing meaningful news to our audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            {/* Text */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                Our Story
              </span>

              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
                Your trusted source for better-informed decisions
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                <p>
                  TV SUPREME is a modern digital news platform focused
                  on delivering timely, relevant and engaging news to
                  audiences in Sri Lanka and around the world.
                </p>

                <p>
                  We bring together national and international
                  developments, business, politics, sports,
                  entertainment, technology and lifestyle stories in
                  one accessible digital experience.
                </p>

                <p>
                  Our aim is to make important information easy to
                  discover while maintaining a strong commitment to
                  responsible and meaningful journalism.
                </p>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-xl" />

              <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-[#111d4a] shadow-xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#111d4a] via-[#2b1c67] to-[#ec008c]">
                  <div className="flex h-full items-center justify-center p-8">
                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec008c] to-[#5f19c8] text-white shadow-lg">
                          <Newspaper size={22} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                            TV SUPREME
                          </p>

                          <p className="mt-1 text-lg font-bold text-white">
                            News. Stories. Perspective.
                          </p>
                        </div>
                      </div>

                      <div className="mt-7 space-y-3">
                        <div className="h-2 rounded-full bg-white/20" />
                        <div className="h-2 w-5/6 rounded-full bg-white/20" />
                        <div className="h-2 w-2/3 rounded-full bg-white/20" />
                      </div>

                      <div className="mt-7 grid grid-cols-3 gap-2">
                        <div className="h-14 rounded-xl bg-white/10" />
                        <div className="h-14 rounded-xl bg-white/10" />
                        <div className="h-14 rounded-xl bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HIGHLIGHTS
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <ValueCard
              icon={<Target size={21} />}
              title="Our Mission"
              text="Deliver reliable, relevant and engaging news through a modern digital platform."
            />

            <ValueCard
              icon={<HeartHandshake size={21} />}
              title="Our Commitment"
              text="Put our audience first and make meaningful information accessible."
            />

            <ValueCard
              icon={<Award size={21} />}
              title="Our Standard"
              text="Build trust through responsible reporting, clarity and consistency."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT WE DO
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            {/* Visual */}
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 shadow-sm">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-white to-pink-50 p-6">
                  <div className="grid h-full grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#111d4a] p-4">
                      <Newspaper
                        size={20}
                        className="text-white"
                      />

                      <p className="mt-8 text-sm font-bold text-white">
                        News
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/60">
                        Timely stories from Sri Lanka and the world.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-[#ec008c] to-[#5f19c8] p-4">
                      <Video
                        size={20}
                        className="text-white"
                      />

                      <p className="mt-8 text-sm font-bold text-white">
                        Video
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/75">
                        News, interviews and featured programmes.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <Globe2
                        size={20}
                        className="text-pink-600"
                      />

                      <p className="mt-8 text-sm font-bold text-[#111d4a]">
                        Digital
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Accessible across devices and languages.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <Users
                        size={20}
                        className="text-[#5f19c8]"
                      />

                      <p className="mt-8 text-sm font-bold text-[#111d4a]">
                        Community
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Stories that matter to our audience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                What We Do
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
                News designed for the way people live today
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                We combine newsroom content with a modern digital
                experience so readers can quickly find the stories
                that matter to them.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Cover important developments across Sri Lanka and beyond.",
                  "Make news easier to discover through clear categories and search.",
                  "Bring together articles, videos and live coverage.",
                  "Support English, Sinhala and Tamil content.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-pink-600"
                    />

                    <p className="text-sm leading-6 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COVERAGE
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              Our Coverage
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              Stories across the topics that matter
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Explore the main areas covered by the TV SUPREME
              newsroom.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Sri Lanka",
              "World",
              "Politics",
              "Business",
              "Sports",
              "Entertainment",
              "Technology",
              "Lifestyle",
            ].map((category, index) => (
              <Link
                key={category}
                href={`/en/${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <span className="text-sm font-black">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="text-slate-300 transition group-hover:text-pink-500">
                    →
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-bold text-[#111d4a]">
                  {category}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Explore {category.toLowerCase()} news
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST STRIP
      ========================================================== */}
      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <TrustItem
                icon={<CheckCircle2 size={20} />}
                title="Responsible"
                text="We value accurate and responsible reporting."
              />

              <TrustItem
                icon={<Globe2 size={20} />}
                title="Accessible"
                text="Our digital platform is designed for easy access."
              />

              <TrustItem
                icon={<Users size={20} />}
                title="Audience First"
                text="We create a better experience for readers and viewers."
              />
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
                Stay Connected
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Together for a better-informed tomorrow
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Keep up with the latest stories, live coverage and
                important developments from TV SUPREME.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link
                href="/en/latest"
                className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
              >
                Latest News
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Mail size={16} />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   VALUE CARD
================================================================ */

function ValueCard({
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
   TRUST ITEM
================================================================ */

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#111d4a]">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}