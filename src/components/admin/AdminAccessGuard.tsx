"use client";

import { useEffect } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

type Props = {
  role: "ADMIN" | "EDITOR";
  children: React.ReactNode;
};

function editorCanOpen(
  pathname: string,
) {
  return (
    pathname === "/admin/news" ||
    pathname.startsWith("/admin/news/") ||
    pathname === "/admin/videos" ||
    pathname === "/admin/profile" ||
    pathname === "/admin/search"
  );
}

/**
 * Keeps navigation clear for Editors. This is deliberately paired
 * with server/API authorization; client navigation is not trusted
 * as the security boundary.
 */
export default function AdminAccessGuard({
  role,
  children,
}: Props) {
  const pathname = usePathname() || "";
  const router = useRouter();

  const isForbiddenForEditor =
    role === "EDITOR" &&
    !editorCanOpen(pathname);

  useEffect(() => {
    if (isForbiddenForEditor) {
      router.replace("/admin/news");
    }
  }, [
    isForbiddenForEditor,
    router,
  ]);

  if (isForbiddenForEditor) {
    return null;
  }

  return <>{children}</>;
}
