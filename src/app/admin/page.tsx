import {
  Archive,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Image as ImageIcon,
  Newspaper,
  Plus,
  Video,
  Zap,
} from "lucide-react";

const stats = [
  {
    title: "Total News",
    value: "0",
    note: "All articles",
    icon: Newspaper,
  },
  {
    title: "Drafts",
    value: "0",
    note: "Waiting to be completed",
    icon: FileText,
  },
  {
    title: "Under Review",
    value: "0",
    note: "Waiting for approval",
    icon: ClipboardCheck,
  },
  {
    title: "Published",
    value: "0",
    note: "Currently live",
    icon: CheckCircle2,
  },
  {
    title: "Scheduled",
    value: "0",
    note: "Upcoming stories",
    icon: CalendarClock,
  },
];

const quickActions = [
  {
    title: "New Article",
    description: "Create a new news story",
    icon: Plus,
  },
  {
    title: "Upload Media",
    description: "Add images or videos",
    icon: ImageIcon,
  },
  {
    title: "Add Video",
    description: "Publish a new video",
    icon: Video,
  },
  {
    title: "Breaking News",
    description: "Manage breaking stories",
    icon: Zap,
  },
];

const categories = [
  { name: "Sri Lanka", count: 0 },
  { name: "World", count: 0 },
  { name: "Politics", count: 0 },
  { name: "Business", count: 0 },
  { name: "Sports", count: 0 },
  { name: "Entertainment", count: 0 },
  { name: "Technology", count: 0 },
  { name: "Lifestyle", count: 0 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">
            TV SUPREME CMS
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, Admin
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your newsroom, content and website from one place.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={17} />
          New Article
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {stat.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main dashboard grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent Articles */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Articles
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest newsroom activity.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-purple-600"
            >
              View All
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
              <div className="rounded-2xl bg-slate-50 p-4">
                <Newspaper size={34} className="text-slate-300" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-700">
                No articles yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Create your first article and it will appear here.
              </p>

              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-100"
              >
                <Plus size={16} />
                Create Article
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common newsroom tasks.
            </p>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-pink-200 hover:bg-pink-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                    <Icon size={18} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">
                      {action.title}
                    </span>

                    <span className="mt-0.5 block text-xs text-slate-400">
                      {action.description}
                    </span>
                  </span>

                  <ArrowRight
                    size={15}
                    className="ml-auto shrink-0 text-slate-300"
                  />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Categories + Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Categories */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Categories
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current article distribution.
              </p>
            </div>

            <BarChart3 size={20} className="text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="truncate text-xs font-medium text-slate-500">
                  {category.name}
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  {category.count}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CMS status */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              CMS Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current content workflow status.
            </p>
          </div>

          <div className="space-y-4">
            {[
              ["Draft", "0", "Articles being prepared"],
              ["Review", "0", "Waiting for editor approval"],
              ["Scheduled", "0", "Ready for future publication"],
              ["Archived", "0", "Stored older articles"],
            ].map(([label, value, description]) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {description}
                  </p>
                </div>

                <span className="text-lg font-bold text-slate-900">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Media / Website */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <ImageIcon size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Media Library
              </h2>

              <p className="text-sm text-slate-500">
                Manage images, videos and other media.
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-pink-600 to-purple-600" />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              0 files
            </span>

            <span className="font-medium text-slate-500">
              Storage unused
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-pink-600 to-purple-700 p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Archive size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Website Status
              </h2>

              <p className="text-sm text-white/75">
                TV SUPREME public website
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
            <span className="text-sm font-semibold">
              Operational
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Your newsroom CMS is ready to manage stories,
            videos, media and homepage content.
          </p>
        </section>
      </div>
    </div>
  );
}