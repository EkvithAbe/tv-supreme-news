import { latestNews } from "@/data/homepage";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = (params.q || "").trim().toLowerCase();

  const results = query
    ? latestNews.filter((article) => {
        const searchableText = [
          article.title,
          article.category,
          article.time,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
    : [];

  return (
    <main className="min-h-[60vh] bg-white dark:bg-[#0f1425]">
      <div className="tv-container py-10">
        <h1 className="text-3xl font-black text-[#111d4a] dark:text-white">
          Search Results
        </h1>

        {query ? (
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            Results for:{" "}
            <span className="font-semibold">
              "{query}"
            </span>
          </p>
        ) : (
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            Enter a keyword to search TV SUPREME news.
          </p>
        )}

        {query && results.length === 0 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-8 dark:border-[#30374e] dark:bg-[#1c2238]">
            <h2 className="text-xl font-bold text-[#111d4a] dark:text-white">
              No results found
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try another keyword.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.map((article) => (
              <article
                key={article.id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#30374e] dark:bg-[#151a2d]"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-24 w-36 shrink-0 rounded-lg object-cover"
                />

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-[#ec008c]">
                    {article.category}
                  </div>

                  <h2 className="mt-1 text-lg font-bold text-[#111d4a] dark:text-white">
                    {article.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {article.time}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}