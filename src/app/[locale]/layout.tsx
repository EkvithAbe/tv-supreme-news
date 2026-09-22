import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import SiteShell from "@/components/common/SiteShell";
import { routing } from "@/i18n/routing";
import englishMessages from "@/messages/en.json";
import sinhalaMessages from "@/messages/si.json";
import tamilMessages from "@/messages/ta.json";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "si" | "ta")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages =
    locale === "si"
      ? sinhalaMessages
      : locale === "ta"
        ? tamilMessages
        : englishMessages;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <div lang={locale}>
        <SiteShell>{children}</SiteShell>
      </div>
    </NextIntlClientProvider>
  );
}
