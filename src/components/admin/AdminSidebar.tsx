"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  FileText,
  ClipboardCheck,
  CalendarClock,
  CheckCircle2,
  Archive,
  Zap,
  Video,
  Radio,
  Image as ImageIcon,
  FolderTree,
  Home,
  File,
  Menu as MenuIcon,
  PanelBottom,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";

/* =========================================================
   ADMIN NAVIGATION
========================================================= */

const menuGroups = [
  {
    title: "Overview",

    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "News",

    items: [
      {
        label: "Articles",
        href: "/admin/news",
        icon: Newspaper,
      },

      {
        label: "New Article",
        href: "/admin/news/new",
        icon: PlusCircle,
      },

      {
        label: "Drafts",
        href: "/admin/news/drafts",
        icon: FileText,
      },

      {
        label: "Review",
        href: "/admin/news/review",
        icon: ClipboardCheck,
      },

      {
        label: "Scheduled",
        href: "/admin/news/scheduled",
        icon: CalendarClock,
      },

      {
        label: "Published",
        href: "/admin/news/published",
        icon: CheckCircle2,
      },

      {
        label: "Archived",
        href: "/admin/news/archived",
        icon: Archive,
      },

      {
        label: "Breaking News",
        href: "/admin/breaking-news",
        icon: Zap,
      },
    ],
  },

  {
    title: "Content",

    items: [
      {
        label: "Videos",
        href: "/admin/videos",
        icon: Video,
      },

      {
        label: "Live TV",
        href: "/admin/live-tv",
        icon: Radio,
      },

      {
        label: "Media Library",
        href: "/admin/media",
        icon: ImageIcon,
      },

      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },

      {
        label: "Homepage",
        href: "/admin/homepage",
        icon: Home,
      },
    ],
  },

  {
    title: "Pages",

    items: [
      {
        label: "Pages",
        href: "/admin/pages",
        icon: File,
      },

      {
        label: "Menu",
        href: "/admin/menu",
        icon: MenuIcon,
      },

      {
        label: "Footer",
        href: "/admin/footer",
        icon: PanelBottom,
      },
    ],
  },

  {
    title: "Administration",

    items: [
      {
        label: "Users & Roles",
        href: "/admin/users",
        icon: Users,
      },

      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

/* =========================================================
   SIDEBAR
========================================================= */

export default function AdminSidebar() {
  const pathname =
    usePathname() || "";

  /* =======================================================
     ACTIVE ITEM
  ======================================================== */

  const isActive = (
    href: string,
  ) => {
    /*
     * Dashboard should only be active
     * on exactly /admin.
     */
    if (
      href === "/admin"
    ) {
      return (
        pathname ===
        "/admin"
      );
    }

    /*
     * All other admin pages should
     * remain active for nested routes.
     *
     * Example:
     * /admin/news/edit/123
     * keeps "Articles" active.
     */
    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  };

  return (
    <aside
      className="
        sticky top-0
        z-40
        flex h-screen min-h-screen
        w-[72px] shrink-0
        flex-col
        border-r border-[#272d47]
        bg-[#141a31]
        text-white
        transition-all duration-200
        md:w-[250px]
      "
    >

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div
        className="
          shrink-0
          border-b border-[#272d47]
          px-2.5 py-4
          md:px-5 md:py-5
        "
      >

        <Link
          href="/admin"
          className="block transition-opacity hover:opacity-90"
          aria-label="TV SUPREME Admin"
        >

          <div className="flex items-center justify-center gap-3 md:justify-start">

            {/* LOGO ICON */}

            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-gradient-to-br from-[#ec008c] to-[#6a1b9a]
                shadow-md
              "
            >
              <span className="text-lg font-bold">
                ♛
              </span>
            </div>

            {/* LOGO TEXT */}

            <div className="hidden min-w-0 md:block">

              <div className="truncate text-base font-black tracking-tight">
                TV SUPREME
              </div>

              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                Admin Panel
              </div>

            </div>

          </div>

        </Link>

      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-2 py-4
          md:px-3
        "
      >

        <div className="space-y-5">

          {menuGroups.map(
            (group) => (
              <section
                key={
                  group.title
                }
              >

                {/* GROUP TITLE */}

                <div
                  className="
                    mb-2
                    hidden
                    px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-500
                    md:block
                  "
                >
                  {
                    group.title
                  }
                </div>

                {/* GROUP ITEMS */}

                <div className="space-y-1">

                  {group.items.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      const active =
                        isActive(
                          item.href,
                        );

                      return (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          title={
                            item.label
                          }
                          aria-current={
                            active
                              ? "page"
                              : undefined
                          }
                          className={`
                            group
                            flex items-center
                            justify-center
                            gap-3
                            rounded-lg
                            px-2
                            py-2.5
                            text-sm
                            transition-all
                            md:justify-start
                            md:px-3
                            ${
                              active
                                ? "bg-gradient-to-r from-[#ec008c] to-[#8b1fc8] font-semibold text-white shadow-md"
                                : "text-slate-300 hover:bg-[#1d2440] hover:text-white"
                            }
                          `}
                        >

                          {/* ICON */}

                          <Icon
                            size={17}
                            strokeWidth={
                              active
                                ? 2.2
                                : 2
                            }
                            className={
                              active
                                ? "text-white"
                                : "text-slate-400 group-hover:text-pink-400"
                            }
                          />

                          {/* LABEL */}

                          <span className="hidden truncate md:block">
                            {
                              item.label
                            }
                          </span>

                        </Link>
                      );
                    },
                  )}

                </div>

              </section>
            ),
          )}

        </div>

      </nav>

      {/* =====================================================
          BOTTOM ADMIN INFO
      ====================================================== */}

      <div
        className="
          shrink-0
          border-t border-[#272d47]
          px-2 py-3
          md:px-4 md:py-4
        "
      >

        <div
          className="
            flex
            items-center
            justify-center
            gap-3
            rounded-lg
            bg-[#1a2038]
            px-2
            py-3
            md:justify-start
            md:px-3
          "
        >

          {/* SHIELD */}

          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              bg-gradient-to-br from-[#ec008c] to-[#6a1b9a]
            "
          >
            <ShieldCheck
              size={15}
            />
          </div>

          {/* TEXT */}

          <div className="hidden min-w-0 md:block">

            <p className="truncate text-xs font-semibold text-white">
              Admin Panel
            </p>

            <p className="truncate text-[10px] text-slate-400">
              TV SUPREME CMS
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}