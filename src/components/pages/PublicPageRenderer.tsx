import { getPageBuilderBlocks } from "@/lib/page-builder";

type PublicMedia = {
  id: string;
  url: string;
  filename: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
  altText: string | null;
};

type Props = {
  page: {
    title: string;
    content: string;
    updatedAt: Date;
  };
  media: PublicMedia[];
};

const placementClasses = {
  FULL: "w-full",
  LEFT: "max-w-3xl mr-auto",
  CENTER: "max-w-3xl mx-auto",
  RIGHT: "max-w-3xl ml-auto",
} as const;

export default function PublicPageRenderer({
  page,
  media,
}: Props) {
  const mediaById = new Map(
    media.map((item) => [item.id, item]),
  );
  const blocks = getPageBuilderBlocks(page.content);

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <article className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-slate-200 pb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
            TV Supreme
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {page.title}
          </h1>
        </header>

        <div className="space-y-7 py-8 sm:py-10">
          {blocks.length === 0 ? (
            <p className="text-slate-500">No content has been added yet.</p>
          ) : (
            blocks.map((block) => {
              if (block.type === "TEXT") {
                return (
                  <section
                    key={block.id}
                    className={`${placementClasses[block.placement]} whitespace-pre-line text-base leading-8 text-slate-700`}
                  >
                    {block.text}
                  </section>
                );
              }

              const item = block.mediaId
                ? mediaById.get(block.mediaId)
                : undefined;

              if (!item) {
                return null;
              }

              const expectedType = block.type;

              if (item.type !== expectedType) {
                return null;
              }

              return (
                <figure
                  key={block.id}
                  className={placementClasses[block.placement]}
                >
                  {block.type === "IMAGE" ? (
                    <img
                      src={item.url}
                      alt={item.altText || block.caption || item.filename}
                      className="h-auto w-full rounded-2xl border border-slate-200 bg-white object-cover shadow-sm"
                    />
                  ) : (
                    <video
                      controls
                      preload="metadata"
                      className="w-full rounded-2xl border border-slate-200 bg-black shadow-sm"
                    >
                      <source src={item.url} />
                      Your browser does not support video playback.
                    </video>
                  )}
                  {block.caption && (
                    <figcaption className="mt-2 text-sm leading-6 text-slate-500">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })
          )}
        </div>

        <footer className="border-t border-slate-200 pt-5 text-sm text-slate-500">
          Updated {page.updatedAt.toLocaleDateString("en-GB")}
        </footer>
      </article>
    </main>
  );
}
