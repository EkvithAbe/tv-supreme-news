import AdvertisePage from "@/app/advertise/page";

export default async function LocalizedAdvertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <AdvertisePage locale={locale} />;
}
