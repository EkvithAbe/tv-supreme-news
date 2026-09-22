import TermsOfUsePage from "@/app/legal/terms-of-use/page";

export default async function LocalizedTermsOfUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <TermsOfUsePage locale={locale} />;
}
