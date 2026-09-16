import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Image as ImageIcon,
  Mail,
  Megaphone,
  MonitorPlay,
  Newspaper,
  Phone,
  Radio,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react";

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(255,255,255,0.2),transparent_30%)]" />

        <div className="absolute right-[-8%] top-[-30%] h-[500px] w-[500px] rounded-full border border-white/10" />

        <div className="absolute bottom-[-35%] left-[55%] h-[420px] w-[420px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[390px] items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
            {/* Hero text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Megaphone size={14} />
                Advertising
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Reach Millions
                <br />
                With TV SUPREME
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Connect your brand with an engaged audience through
                premium digital advertising, video, live TV and
                sponsored content opportunities.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#advertising-solutions"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] shadow-lg transition hover:bg-slate-100"
                >
                  Explore Solutions
                  <ChevronRight size={16} />
                </a>

                <a
                  href="mailto:business@tvsupreme.lk"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Mail size={16} />
                  Contact Sales
                </a>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 rounded-[40px] bg-white/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <div className="rounded-[22px] bg-[#111d4a] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                        TV SUPREME
                      </p>

                      <p className="mt-1 text-lg font-black text-white">
                        Your brand, front and centre.
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                      <Megaphone
                        size={19}
                        className="text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#ec008c] to-[#5f19c8] p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                          Campaign Reach
                        </p>

                        <p className="mt-2 text-3xl font-black text-white">
                          1.2M+
                        </p>

                        <p className="mt-1 text-xs text-white/70">
                          Digital audience opportunities
                        </p>
                      </div>

                      <BarChart3
                        size={52}
                        className="text-white/80"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <MiniMetric
                      value="24/7"
                      label="Digital"
                    />

                    <MiniMetric
                      value="3"
                      label="Languages"
                    />

                    <MiniMetric
                      value="360°"
                      label="Solutions"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY ADVERTISE
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              Why Advertise With TV SUPREME?
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              Put your message in front of the right audience
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Build awareness, connect with audiences and create
              stronger digital campaigns through a trusted news
              platform.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={<Users size={21} />}
              title="Reach More People"
              text="Connect with a broad audience across Sri Lanka and beyond."
            />

            <BenefitCard
              icon={<Target size={21} />}
              title="Targeted Reach"
              text="Reach audiences around relevant topics, categories and content."
            />

            <BenefitCard
              icon={<BarChart3 size={21} />}
              title="Measurable Results"
              text="Track campaign performance and make data-informed decisions."
            />

            <BenefitCard
              icon={<Sparkles size={21} />}
              title="Premium Presence"
              text="Showcase your brand through a modern, professional digital environment."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          ADVERTISING SOLUTIONS
      ========================================================== */}
      <section
        id="advertising-solutions"
        className="bg-[#f8f7fc] py-14 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              Our Advertising Solutions
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              Flexible solutions for every campaign
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Choose the format that best matches your campaign goals,
              audience and budget.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SolutionCard
              icon={<MonitorPlay size={22} />}
              title="Web Advertising"
              description="Promote your brand across high-visibility areas of the TV SUPREME website."
              features={[
                "Homepage placements",
                "Category placements",
                "Display campaigns",
                "Branded promotions",
              ]}
            />

            <SolutionCard
              icon={<Video size={22} />}
              title="Video Advertising"
              description="Reach viewers through premium video placements and sponsored content."
              features={[
                "Pre-roll opportunities",
                "Video sponsorships",
                "Branded video",
                "Programme promotions",
              ]}
              featured
            />

            <SolutionCard
              icon={<Radio size={22} />}
              title="Live TV Advertising"
              description="Connect with viewers around live broadcasts and special programming."
              features={[
                "Live stream placements",
                "Broadcast sponsorships",
                "Special events",
                "Campaign integrations",
              ]}
            />

            <SolutionCard
              icon={<Newspaper size={22} />}
              title="Sponsored Content"
              description="Create meaningful branded storytelling with editorial-style digital experiences."
              features={[
                "Branded articles",
                "Special features",
                "Campaign stories",
                "Custom landing pages",
              ]}
            />

            <SolutionCard
              icon={<Smartphone size={22} />}
              title="Mobile Campaigns"
              description="Keep your brand visible to audiences using smartphones and mobile devices."
              features={[
                "Mobile placements",
                "Responsive creatives",
                "Mobile-first campaigns",
                "Audience reach",
              ]}
            />

            <SolutionCard
              icon={<ImageIcon size={22} />}
              title="Custom Campaigns"
              description="Build a campaign around your unique business objectives and creative ideas."
              features={[
                "Custom packages",
                "Creative support",
                "Multi-format campaigns",
                "Campaign consultation",
              ]}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          FORMATS
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            {/* Left */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                Available Formats
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
                Choose the format that fits your campaign
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                From simple display placements to integrated
                multi-format campaigns, we can create a solution around
                your objectives.
              </p>

              <div className="mt-7 space-y-4">
                <FormatRow
                  number="01"
                  title="Display Advertising"
                  description="High-visibility placements across relevant website sections."
                />

                <FormatRow
                  number="02"
                  title="Video Campaigns"
                  description="Video placements and branded video opportunities."
                />

                <FormatRow
                  number="03"
                  title="Sponsored Stories"
                  description="Story-led branded content designed around your message."
                />

                <FormatRow
                  number="04"
                  title="Integrated Campaigns"
                  description="Combine web, video and live TV opportunities into one campaign."
                />
              </div>
            </div>

            {/* Right visual */}
            <div>
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-[22px] bg-[#111d4a] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                        Campaign Formats
                      </p>

                      <h3 className="mt-1 text-xl font-black text-white">
                        One platform.
                        <br />
                        Multiple opportunities.
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                      <Globe2 size={19} className="text-white" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <VisualTile
                      icon={<MonitorPlay size={18} />}
                      title="Website"
                      text="Digital reach"
                    />

                    <VisualTile
                      icon={<Video size={18} />}
                      title="Video"
                      text="Visual impact"
                    />

                    <VisualTile
                      icon={<Radio size={18} />}
                      title="Live TV"
                      text="Live audiences"
                    />

                    <VisualTile
                      icon={<Sparkles size={18} />}
                      title="Sponsored"
                      text="Branded stories"
                    />
                  </div>

                  <div className="mt-4 rounded-xl bg-gradient-to-r from-[#ec008c] to-[#5f19c8] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/70">
                      Recommended
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      Integrated multi-channel campaign
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/70">
                      Combine multiple formats for a stronger campaign
                      presence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CAMPAIGN BENEFITS
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <CampaignStat
              value="3"
              title="Languages"
              text="English, Sinhala and Tamil"
            />

            <CampaignStat
              value="24/7"
              title="Digital Presence"
              text="Always-on online visibility"
            />

            <CampaignStat
              value="360°"
              title="Campaign Support"
              text="From planning to delivery"
            />

            <CampaignStat
              value="1"
              title="Trusted Platform"
              text="One place for your audience"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              How It Works
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              From idea to campaign
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <StepCard
              number="01"
              title="Tell Us Your Goal"
              text="Share your campaign objective, audience and preferred timeline."
            />

            <StepCard
              number="02"
              title="Choose a Solution"
              text="We recommend the most suitable advertising formats."
            />

            <StepCard
              number="03"
              title="Launch"
              text="Your campaign goes live across the agreed TV SUPREME channels."
            />

            <StepCard
              number="04"
              title="Measure"
              text="Review campaign performance and identify opportunities to improve."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]">
          <div className="px-6 py-11 sm:px-10 sm:py-14 lg:px-14">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Let&apos;s Grow Your Brand Together
                </p>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  Ready to reach your audience?
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  Talk to the TV SUPREME team about your next campaign
                  and let&apos;s build the right solution for your brand.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:business@tvsupreme.lk"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
                >
                  <Mail size={16} />
                  Contact Sales
                </a>

                <a
                  href="tel:+94110000000"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Phone size={16} />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   MINI METRIC
================================================================ */

function MiniMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-lg font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-white/50">
        {label}
      </p>
    </div>
  );
}

/* ===============================================================
   BENEFIT CARD
================================================================ */

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
   SOLUTION CARD
================================================================ */

function SolutionCard({
  icon,
  title,
  description,
  features,
  featured = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        featured
          ? "border-pink-200 bg-gradient-to-b from-pink-50/60 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      {featured && (
        <div className="absolute right-4 top-4 rounded-full bg-pink-100 px-2.5 py-1 text-[10px] font-bold text-pink-600">
          Popular
        </div>
      )}

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#111d4a]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 space-y-2.5">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-2"
          >
            <CheckCircle2
              size={15}
              className="mt-0.5 shrink-0 text-pink-600"
            />

            <span className="text-xs leading-5 text-slate-600">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===============================================================
   FORMAT ROW
================================================================ */

function FormatRow({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-xs font-black text-pink-600">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#111d4a]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   VISUAL TILE
================================================================ */

function VisualTile({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-pink-300">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-white/50">
        {text}
      </p>
    </div>
  );
}

/* ===============================================================
   CAMPAIGN STAT
================================================================ */

function CampaignStat({
  value,
  title,
  text,
}: {
  value: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p className="text-3xl font-black text-pink-600">
        {value}
      </p>

      <h3 className="mt-2 text-sm font-bold text-[#111d4a]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {text}
      </p>
    </div>
  );
}

/* ===============================================================
   STEP CARD
================================================================ */

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 text-xs font-black text-white">
        {number}
      </div>

      <h3 className="mt-4 text-base font-bold text-[#111d4a]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}