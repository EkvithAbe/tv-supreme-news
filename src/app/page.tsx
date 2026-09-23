import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function RootPage() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "default_language" },
    });

    const lang = setting?.value?.trim().toLowerCase();
    if (lang === "sinhala" || lang === "si") {
      redirect("/si");
    } else if (lang === "tamil" || lang === "ta") {
      redirect("/ta");
    } else {
      redirect("/en");
    }
  } catch {
    redirect("/en");
  }
}

