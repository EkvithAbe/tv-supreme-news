import Link from "next/link";
import {
  AlertCircle,
  ChevronRight,
  Cookie,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const sections = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
  },
  {
    id: "information",
    number: "02",
    title: "Information We Collect",
  },
  {
    id: "use",
    number: "03",
    title: "How We Use Information",
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies & Tracking",
  },
  {
    id: "security",
    number: "05",
    title: "Data Security",
  },
  {
    id: "sharing",
    number: "06",
    title: "Information Sharing",
  },
  {
    id: "rights",
    number: "07",
    title: "Your Rights",
  },
  {
    id: "children",
    number: "08",
    title: "Children's Privacy",
  },
  {
    id: "changes",
    number: "09",
    title: "Changes to This Policy",
  },
  {
    id: "contact",
    number: "10",
    title: "Contact Us",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_40%,rgba(255,255,255,0.2),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[250px] items-center py-14 sm:min-h-[290px] sm:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <ShieldCheck size={14} />
                Legal Information
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Learn how TV SUPREME collects, uses, protects and
                manages information when you use our website and
                services.
              </p>

              <p className="mt-4 text-xs font-medium text-white/60">
                Last updated: 15 September 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          POLICY CONTENT
      ========================================================== */}
      <section className="py-12 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
            {/* =====================================================
                LEFT NAVIGATION
            ====================================================== */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    On this page
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-[#111d4a]">
                    Privacy Policy
                  </h2>
                </div>

                <nav className="p-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-pink-50"
                    >
                      <span className="w-5 shrink-0 text-[9px] font-bold text-slate-300 group-hover:text-pink-500">
                        {section.number}
                      </span>

                      <span className="min-w-0 flex-1 text-xs font-semibold text-slate-500 group-hover:text-pink-600">
                        {section.title}
                      </span>

                      <ChevronRight
                        size={13}
                        className="shrink-0 text-slate-300 group-hover:text-pink-500"
                      />
                    </a>
                  ))}
                </nav>

                <div className="border-t border-slate-200 bg-gradient-to-br from-[#111d4a] to-[#2c215f] p-5 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <Lock size={16} />
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    Your privacy matters
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/60">
                    We are committed to handling information
                    responsibly.
                  </p>
                </div>
              </div>
            </aside>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <article className="min-w-0">
              {/* Introduction */}
              <PolicySection
                id="introduction"
                number="01"
                title="Introduction"
              >
                <p>
                  TV SUPREME respects your privacy and is committed
                  to protecting information you provide when using
                  our website and digital services.
                </p>

                <p>
                  This Privacy Policy explains the types of
                  information that may be collected, how that
                  information may be used and the choices available
                  to you.
                </p>
              </PolicySection>

              {/* Information */}
              <PolicySection
                id="information"
                number="02"
                title="Information We Collect"
              >
                <p>
                  Depending on how you interact with TV SUPREME, we
                  may collect information such as:
                </p>

                <PolicyList
                  items={[
                    "Name and contact details you provide through forms or enquiries.",
                    "Information submitted when contacting our newsroom or business team.",
                    "Technical information such as browser type, device information and general usage data.",
                    "Information relating to your interactions with our website and services.",
                  ]}
                />
              </PolicySection>

              {/* Use */}
              <PolicySection
                id="use"
                number="03"
                title="How We Use Information"
              >
                <p>
                  Information may be used to operate, maintain and
                  improve our website and services.
                </p>

                <PolicyList
                  items={[
                    "Respond to enquiries, feedback and requests.",
                    "Provide and improve website functionality and content.",
                    "Understand how visitors use our website.",
                    "Maintain website security and prevent misuse.",
                    "Communicate important service or administrative information.",
                  ]}
                />
              </PolicySection>

              {/* Cookies */}
              <PolicySection
                id="cookies"
                number="04"
                title="Cookies & Tracking"
                icon={<Cookie size={18} />}
              >
                <p>
                  TV SUPREME may use cookies and similar technologies
                  to support website functionality, remember
                  preferences and understand website usage.
                </p>

                <p>
                  Your browser may provide options for managing or
                  disabling cookies. Some website features may not
                  work as intended when certain cookies are disabled.
                </p>
              </PolicySection>

              {/* Security */}
              <PolicySection
                id="security"
                number="05"
                title="Data Security"
                icon={<Lock size={18} />}
              >
                <p>
                  We take reasonable technical and organisational
                  measures to protect information from unauthorized
                  access, misuse, alteration or disclosure.
                </p>

                <div className="mt-5 rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-pink-600"
                    />

                    <div>
                      <p className="text-sm font-bold text-[#111d4a]">
                        Security reminder
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        No internet-based system can be guaranteed
                        to be completely secure. We continue to review
                        and improve our security practices.
                      </p>
                    </div>
                  </div>
                </div>
              </PolicySection>

              {/* Sharing */}
              <PolicySection
                id="sharing"
                number="06"
                title="Information Sharing"
              >
                <p>
                  TV SUPREME does not intend to sell personal
                  information. Information may be shared where
                  reasonably necessary to operate our services,
                  comply with legal obligations or protect our
                  rights and users.
                </p>

                <PolicyList
                  items={[
                    "Service providers supporting website operations.",
                    "Authorities or other parties where legally required.",
                    "Professional advisers where reasonably necessary.",
                  ]}
                />
              </PolicySection>

              {/* Rights */}
              <PolicySection
                id="rights"
                number="07"
                title="Your Rights"
                icon={<UserCheck size={18} />}
              >
                <p>
                  Depending on applicable law, you may have rights
                  regarding information we hold about you, including
                  requests to access, correct or delete certain
                  information.
                </p>

                <p>
                  To make a privacy-related enquiry, please contact
                  our team using the contact details provided below.
                </p>
              </PolicySection>

              {/* Children */}
              <PolicySection
                id="children"
                number="08"
                title="Children's Privacy"
              >
                <p>
                  TV SUPREME is intended for a general audience. We do
                  not knowingly seek to collect personal information
                  from children through our services.
                </p>
              </PolicySection>

              {/* Changes */}
              <PolicySection
                id="changes"
                number="09"
                title="Changes to This Policy"
              >
                <p>
                  We may update this Privacy Policy from time to time
                  to reflect changes to our services, legal
                  requirements or privacy practices.
                </p>

                <p>
                  Updated versions will be published on this page
                  together with the relevant revision date.
                </p>
              </PolicySection>

              {/* Contact */}
              <PolicySection
                id="contact"
                number="10"
                title="Contact Us"
                icon={<Mail size={18} />}
              >
                <p>
                  If you have questions, concerns or requests
                  relating to this Privacy Policy, please contact
                  TV SUPREME.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ContactCard
                    icon={<Mail size={17} />}
                    title="Email"
                    value="info@tvsupreme.lk"
                  />

                  <ContactCard
                    icon={<FileText size={17} />}
                    title="Website"
                    value="TV SUPREME"
                  />
                </div>
              </PolicySection>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================
          LEGAL NAVIGATION
      ========================================================== */}
      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-600">
                  Legal Information
                </p>

                <h2 className="mt-2 text-xl font-black text-[#111d4a]">
                  Review our Terms of Use
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Learn about the terms and conditions that apply when
                  using TV SUPREME.
                </p>
              </div>

              <Link
                href="/legal/terms-of-use"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Terms of Use
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   POLICY SECTION
================================================================ */

function PolicySection({
  id,
  number,
  title,
  icon,
  children,
}: {
  id: string;
  number: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-slate-100 py-8 first:pt-0 last:border-b-0"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-xs font-black text-pink-600">
          {icon ?? number}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black tracking-tight text-[#111d4a] sm:text-2xl">
            {title}
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   POLICY LIST
================================================================ */

function PolicyList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-600" />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ===============================================================
   CONTACT CARD
================================================================ */

function ContactCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 text-sm font-bold text-[#111d4a]">
          {value}
        </p>
      </div>
    </div>
  );
}