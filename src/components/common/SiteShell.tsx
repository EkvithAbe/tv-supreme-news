"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function SiteShell({
  children,
  skipLocalizedPublicRoutes = false,
}: {
  children: React.ReactNode;
  /**
   * The root layout supplies the English fallback provider for legacy,
   * unprefixed URLs. Locale layouts render their own shell inside the
   * correct provider, so the outer shell must stay empty for those routes.
   */
  skipLocalizedPublicRoutes?: boolean;
}) {
  const pathname = usePathname();

  const isAdmin =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isLogin = pathname === "/login";
  const isLocalizedPublicRoute = /^\/(?:en|si|ta)(?:\/|$)/.test(
    pathname,
  );

  if (
    isAdmin ||
    isLogin ||
    (skipLocalizedPublicRoutes && isLocalizedPublicRoute)
  ) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
