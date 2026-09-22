export type StaticLocale = "en" | "si" | "ta";

export type StaticPageTranslations = {
  si: Record<string, string>;
  ta: Record<string, string>;
};

function normalizeLocale(locale: string): StaticLocale {
  if (locale === "si" || locale === "ta") {
    return locale;
  }

  return "en";
}

/**
 * Keeps English as the canonical copy while returning a Sinhala or Tamil
 * equivalent for localized public pages. A missing translation deliberately
 * falls back to English instead of rendering an empty label.
 */
export function getStaticTranslator(
  locale: string,
  translations: StaticPageTranslations,
) {
  const normalizedLocale = normalizeLocale(locale);
  const selectedTranslations =
    normalizedLocale === "en" ? {} : translations[normalizedLocale];

  return (english: string) => selectedTranslations[english] ?? english;
}
