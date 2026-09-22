import Link from "next/link";
import { Search } from "lucide-react";

import { requireCmsUserPage } from "@/lib/auth";
import { searchAdminContent } from "@/lib/data/admin-search";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const labels = {
  ARTICLE: "Article",
  VIDEO: "Video",
  CATEGORY: "Category",
  MEDIA: "Media",
  EDITOR: "Editor",
  ACTIVITY: "Editor activity",
} as const;

export default async function AdminSearchPage({ searchParams }: Props) {
  const [user, params] = await Promise.all([
    requireCmsUserPage(),
    searchParams,
  ]);
  const query = params.q?.trim() || "";
  const results = query.length >= 2
    ? await searchAdminContent(user, query.slice(0, 120))
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-pink-50 p-3 text-pink-600"><Search size={21} /></div>
        <div><h1 className="text-2xl font-black text-slate-900">Admin search</h1><p className="mt-1 text-sm text-slate-500">{user.role === "ADMIN" ? "Search content, categories, media, Editors, and Editor activity." : "Search CMS articles and videos."}</p></div>
      </div>

      <form className="mt-7 flex gap-3" action="/admin/search">
        <input name="q" defaultValue={query} minLength={2} placeholder="Search the CMS..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50" />
        <button className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 px-5 py-3 text-sm font-semibold text-white">Search</button>
      </form>

      {query && <p className="mt-6 text-sm text-slate-500">{results.length} result{results.length === 1 ? "" : "s"} for <span className="font-semibold text-slate-800">&ldquo;{query}&rdquo;</span></p>}

      {query.length >= 2 && <div className="mt-4 space-y-3">{results.length ? results.map((result) => <Link key={result.id} href={result.href} className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-pink-200 hover:shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-pink-600">{labels[result.type]}</p><h2 className="mt-1 font-bold text-slate-800">{result.title}</h2><p className="mt-1 text-sm text-slate-500">{result.detail}</p></div><time className="shrink-0 text-xs text-slate-400">{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(result.createdAt)}</time></div></Link>) : <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">No matching CMS records found.</p>}</div>}
    </div>
  );
}
