import PrivacyPolicyPage from "@/app/legal/privacy-policy/page";

export default async function LocalizedPrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <PrivacyPolicyPage locale={locale} />;
}
