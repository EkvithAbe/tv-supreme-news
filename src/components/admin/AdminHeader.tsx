"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Loader2,
  LogOut,
  Search,
  UserCircle,
} from "lucide-react";

type Props = {
  user: {
    name: string;
    role: "ADMIN" | "EDITOR";
  };
};

function getRoleLabel(
  role: Props["user"]["role"],
) {
  return role === "ADMIN"
    ? "Administrator"
    : "Editor";
}

export default function AdminHeader({
  user,
}: Props) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] =
    useState(false);
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);
  const [logoutError, setLogoutError] =
    useState("");
  const [search, setSearch] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      title: string;
      message: string;
      href: string | null;
      isRead: boolean;
      createdAt: string;
    }>
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const logout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Unable to sign out right now.",
        );
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Unable to sign out right now.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (query.length < 2) {
      router.push("/admin/search");
      return;
    }

    router.push(`/admin/search?q=${encodeURIComponent(query)}`);
  };

  const toggleNotifications = async () => {
    const nextOpen = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpen);

    if (!nextOpen) {
      return;
    }

    setNotificationsLoading(true);

    try {
      const response = await fetch("/api/admin/notifications", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Unable to load notifications.");
      }

      const items = Array.isArray(data.items) ? data.items : [];
      setNotifications(items);
      setUnreadCount(data.unreadCount || 0);

      const unreadIds = items
        .filter((item: { isRead: boolean }) => !item.isRead)
        .map((item: { id: string }) => item.id);

      if (unreadIds.length > 0) {
        void fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: unreadIds }),
        });
        setUnreadCount(0);
        setNotifications((current) =>
          current.map((item) => ({
            ...item,
            isRead: true,
          })),
        );
      }
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  return (
    <header className="relative flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 sm:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-[#111d4a] sm:text-xl">
          TV SUPREME Admin
        </h1>

        <p className="hidden text-xs text-slate-500 sm:block">
          Manage your news website easily.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:block">
          <form
            onSubmit={submitSearch}
            className="flex w-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-pink-300 focus-within:ring-4 focus-within:ring-pink-50"
          >
            <Search
              size={17}
              className="shrink-0 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search articles, categories..."
              aria-label="Search admin"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </form>
        </div>

        <button
          type="button"
          aria-label="Search"
          onClick={() => router.push("/admin/search")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-pink-300 hover:text-pink-600 md:hidden"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          aria-expanded={isNotificationsOpen}
          onClick={toggleNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-pink-300 hover:text-pink-600"
        >
          <Bell size={18} />

          {unreadCount > 0 && (
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-pink-600" />
          )}
        </button>

        {isNotificationsOpen && (
          <div className="absolute right-16 top-16 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-28">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="font-bold text-slate-800">Notifications</p>
              <button type="button" onClick={() => setIsNotificationsOpen(false)} className="text-xs font-semibold text-slate-500 hover:text-pink-600">Close</button>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              {notificationsLoading ? (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" /> Loading...</div>
              ) : notifications.length ? notifications.map((notification) => (
                notification.href ? (
                  <Link key={notification.id} href={notification.href} onClick={() => setIsNotificationsOpen(false)} className="block rounded-xl p-3 transition hover:bg-pink-50">
                    <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{notification.message}</p>
                  </Link>
                ) : (
                  <div key={notification.id} className="rounded-xl p-3"><p className="text-sm font-semibold text-slate-800">{notification.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{notification.message}</p></div>
                )
              )) : <p className="p-6 text-center text-sm text-slate-500">You are all caught up.</p>}
            </div>
          </div>
        )}

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsAccountOpen(
                (current) => !current,
              )
            }
            aria-expanded={isAccountOpen}
            aria-controls="admin-account-menu"
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
          >
            <UserCircle
              size={34}
              strokeWidth={1.8}
              className="text-slate-400"
            />

            <span className="hidden text-left sm:block">
              <span className="block max-w-36 truncate text-sm font-semibold text-[#111d4a]">
                {user.name}
              </span>

              <span className="block text-[11px] text-slate-500">
                {getRoleLabel(user.role)}
              </span>
            </span>

            <ChevronDown
              size={15}
              className={`hidden text-slate-400 transition sm:block ${
                isAccountOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isAccountOpen && (
            <div
              id="admin-account-menu"
              className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {getRoleLabel(user.role)}
                </p>
              </div>

              <Link
                href="/admin/profile"
                onClick={() => setIsAccountOpen(false)}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-pink-50 hover:text-pink-700"
              >
                <UserCircle size={16} />
                My profile
              </Link>

              <button
                type="button"
                onClick={logout}
                disabled={isLoggingOut}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-pink-50 hover:text-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <LogOut size={16} />
                )}
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </button>

              {logoutError && (
                <p
                  role="alert"
                  className="px-3 pb-2 pt-1 text-xs text-red-600"
                >
                  {logoutError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
