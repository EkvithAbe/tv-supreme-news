import AboutPage from "@/app/about/page";

export default async function LocalizedAboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <AboutPage locale={locale} />;
}
