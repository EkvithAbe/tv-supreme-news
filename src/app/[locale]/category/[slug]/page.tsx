import { notFound } from "next/navigation";

import CategoryPage from "@/components/category/CategoryPage";

const validSlugs = [
  "latest",
  "sri-lanka",
  "world",
  "politics",
  "business",
  "sports",
  "entertainment",
  "technology",
  "lifestyle",
];

type CategoryRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryRoute({
  params,
}: CategoryRouteProps) {
  const { slug } = await params;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return <CategoryPage categorySlug={slug} />;
}