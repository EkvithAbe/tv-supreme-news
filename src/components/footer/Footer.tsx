"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

const footerLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Advertise", href: "/advertise" },
  { name: "Privacy Policy", href: "/legal/privacy-policy" },
  { name: "Terms of Use", href: "/legal/terms-of-use" },
];
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-[#30374e] dark:bg-[#151a2d]">
      <div className="tv-container">

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}
        <div className="flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">

          {/* LOGO */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec008c] to-[#5b16a5] text-white shadow-sm">
              <span className="text-xl font-bold">
                ♛
              </span>
            </div>

            <div>
              <div className="text-base font-extrabold leading-none text-[#111d4a] dark:text-white">
                TV SUPREME
              </div>

              <p className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                NEWS. PEOPLE. A BRIGHTER TOMORROW.
              </p>
            </div>
          </Link>

          {/* LINKS */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5"
          >
            {footerLinks.map((link, index) => (
              <div
                key={link.name}
                className="flex items-center gap-4"
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition hover:text-[#ec008c] dark:text-slate-300"
                >
                  {link.name}
                </Link>

                {index < footerLinks.length - 1 && (
                  <span className="text-sm text-slate-300 dark:text-slate-600">
                    |
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* SOCIAL ICONS */}
          <div className="flex items-center justify-center gap-4">

            <a
              href="#"
              aria-label="Facebook"
              className="text-base font-bold text-[#111d4a] transition hover:text-[#ec008c] dark:text-white"
            >
              f
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="text-sm font-bold text-[#111d4a] transition hover:text-[#ec008c] dark:text-white"
            >
              ▶
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="text-base font-bold text-[#111d4a] transition hover:text-[#ec008c] dark:text-white"
            >
              ◎
            </a>

            <a
              href="#"
              aria-label="X"
              className="text-base font-bold text-[#111d4a] transition hover:text-[#ec008c] dark:text-white"
            >
              X
            </a>

            <a
              href="#"
              aria-label="TikTok"
              className="text-base font-bold text-[#111d4a] transition hover:text-[#ec008c] dark:text-white"
            >
              ♪
            </a>

          </div>
        </div>

        {/* =====================================================
            BOTTOM FOOTER
        ====================================================== */}
        <div className="flex flex-col gap-3 border-t border-slate-100 py-5 text-xs text-slate-500 dark:border-[#30374e] dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 TV SUPREME. All Rights Reserved.
          </p>

          <p>
            Designed for a More Informed Sri Lanka
          </p>

        </div>
      </div>

      {/* =====================================================
          BACK TO TOP
      ====================================================== */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#6a1b9a] to-[#ec008c] text-white shadow-lg transition hover:scale-105"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}