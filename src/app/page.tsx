import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  let targetLocale = "en";

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "default_language" },
    });

    const lang = setting?.value?.trim().toLowerCase();
    if (lang === "sinhala" || lang === "si") {
      targetLocale = "si";
    } else if (lang === "tamil" || lang === "ta") {
      targetLocale = "ta";
    } else {
      targetLocale = "en";
    }
  } catch (error) {
    console.error("Failed to query default language setting:", error);
    targetLocale = "en";
  }

  // Set the NEXT_LOCALE cookie so next-intl client components and navigation stay in sync
  try {
    const cookieStore = await cookies();
    cookieStore.set("NEXT_LOCALE", targetLocale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  } catch {
    // Ignore cookie write errors in non-standard contexts
  }

  // redirect() MUST be called outside try/catch because in Next.js it throws NEXT_REDIRECT
  redirect(`/${targetLocale}`);
}
