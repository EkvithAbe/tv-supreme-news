"use client";

import {
  Bell,
  Search,
  UserCircle,
  ChevronDown,
} from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 sm:px-6">
      {/* Left */}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold text-[#111d4a] sm:text-xl">
          TV SUPREME Admin
        </h1>

        <p className="hidden text-xs text-slate-500 sm:block">
          Manage your news website easily.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="hidden md:block">
          <div className="flex w-[260px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
            <Search
              size={17}
              className="shrink-0 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search articles, categories..."
              aria-label="Search admin"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Mobile search */}
        <button
          type="button"
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-pink-300 hover:text-pink-600 md:hidden"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-pink-300 hover:text-pink-600"
        >
          <Bell size={18} />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-pink-600" />
        </button>

        {/* Divider */}
        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        {/* User */}
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
        >
          <UserCircle
            size={34}
            strokeWidth={1.8}
            className="text-slate-400"
          />

          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-[#111d4a]">
              Administrator
            </span>

            <span className="block text-[11px] text-slate-500">
              Admin
            </span>
          </span>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}