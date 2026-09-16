import type { Metadata } from "next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { ThemeProvider } from "@/components/common/ThemeProvider";
import SiteShell from "@/components/common/SiteShell";

export const metadata: Metadata = {
  title: "TV SUPREME",
  description: "News. People. A Brighter Tomorrow.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
          >
            <SiteShell>{children}</SiteShell>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}