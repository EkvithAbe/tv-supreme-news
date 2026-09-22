import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/common/ThemeProvider";
import SiteShell from "@/components/common/SiteShell";
import { NextIntlClientProvider } from "next-intl";
import englishMessages from "@/messages/en.json";

export const metadata: Metadata = {
  title: "TV SUPREME",
  description: "News. People. A Brighter Tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider
            locale="en"
            messages={englishMessages}
          >
            <SiteShell skipLocalizedPublicRoutes>
              {children}
            </SiteShell>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
