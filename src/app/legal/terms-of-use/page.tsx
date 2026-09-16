import Link from "next/link";
import {
  AlertCircle,
  ChevronRight,
  FileCheck2,
  FileText,
  Gavel,
  Link2,
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
    id: "eligibility",
    number: "02",
    title: "Using This Website",
  },
  {
    id: "content",
    number: "03",
    title: "Content & Information",
  },
  {
    id: "intellectual-property",
    number: "04",
    title: "Intellectual Property",
  },
  {
    id: "acceptable-use",
    number: "05",
    title: "Acceptable Use",
  },
  {
    id: "external-links",
    number: "06",
    title: "External Links",
  },
  {
    id: "disclaimer",
    number: "07",
    title: "Disclaimer",
  },
  {
    id: "limitation",
    number: "08",
    title: "Limitation of Liability",
  },
  {
    id: "changes",
    number: "09",
    title: "Changes to These Terms",
  },
  {
    id: "contact",
    number: "10",
    title: "Contact Us",
  },
];

export default function TermsOfUsePage() {
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
                <Gavel size={14} />
                Legal Information
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Terms of Use
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Please read these terms carefully before using the
                TV SUPREME website and digital services.
              </p>

              <p className="mt-4 text-xs font-medium text-white/60">
                Last updated: 15 September 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TERMS CONTENT
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
                    Terms of Use
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
                    <FileCheck2 size={16} />
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    Use of this website
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/60">
                    By using TV SUPREME, you agree to these terms.
                  </p>
                </div>
              </div>
            </aside>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <article className="min-w-0">
              {/* Introduction */}
              <TermsSection
                id="introduction"
                number="01"
                title="Introduction"
                icon={<FileText size={18} />}
              >
                <p>
                  These Terms of Use explain the conditions that apply
                  when you access or use the TV SUPREME website and
                  related digital services.
                </p>

                <p>
                  By accessing or using the website, you acknowledge
                  that you have read, understood and agreed to these
                  Terms of Use.
                </p>
              </TermsSection>

              {/* Using Website */}
              <TermsSection
                id="eligibility"
                number="02"
                title="Using This Website"
                icon={<UserCheck size={18} />}
              >
                <p>
                  You may use the TV SUPREME website for lawful
                  purposes and in accordance with these terms.
                </p>

                <TermsList
                  items={[
                    "You must use the website responsibly and respectfully.",
                    "You must not use the website for unlawful or fraudulent purposes.",
                    "You must not attempt to interfere with the operation or security of the website.",
                    "You must not knowingly introduce malicious software or harmful code.",
                  ]}
                />
              </TermsSection>

              {/* Content */}
              <TermsSection
                id="content"
                number="03"
                title="Content & Information"
              >
                <p>
                  TV SUPREME provides news, articles, videos and other
                  information through the website.
                </p>

                <p>
                  We aim to provide useful and timely information,
                  but content may change, be updated or be removed
                  without prior notice.
                </p>

                <TermsList
                  items={[
                    "News and other information may reflect developments that change over time.",
                    "Descriptions, schedules and other website information may be updated.",
                    "Users should consider the context and source of information before relying on it.",
                  ]}
                />
              </TermsSection>

              {/* Intellectual Property */}
              <TermsSection
                id="intellectual-property"
                number="04"
                title="Intellectual Property"
                icon={<ShieldCheck size={18} />}
              >
                <p>
                  Unless otherwise stated, content published by
                  TV SUPREME, including text, graphics, logos, design
                  elements, videos and other materials, may be
                  protected by applicable intellectual property laws.
                </p>

                <p>
                  You may access and view content for personal and
                  lawful purposes. Reproduction, distribution,
                  modification or commercial use may require
                  appropriate permission.
                </p>

                <div className="mt-5 rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-pink-600"
                    />

                    <div>
                      <p className="text-sm font-bold text-[#111d4a]">
                        Respect our content
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Please respect the intellectual property rights
                        associated with TV SUPREME content and third-party
                        materials.
                      </p>
                    </div>
                  </div>
                </div>
              </TermsSection>

              {/* Acceptable Use */}
              <TermsSection
                id="acceptable-use"
                number="05"
                title="Acceptable Use"
                icon={<Gavel size={18} />}
              >
                <p>
                  You agree not to misuse the website or its services.
                </p>

                <TermsList
                  items={[
                    "Do not attempt unauthorized access to restricted areas or systems.",
                    "Do not disrupt or overload website services.",
                    "Do not use automated methods to abuse, scrape or interfere with website functionality where prohibited.",
                    "Do not use website content to mislead, impersonate or defraud others.",
                    "Do not submit unlawful, abusive or harmful material through website forms.",
                  ]}
                />
              </TermsSection>

              {/* External Links */}
              <TermsSection
                id="external-links"
                number="06"
                title="External Links"
                icon={<Link2 size={18} />}
              >
                <p>
                  The TV SUPREME website may contain links to external
                  websites, platforms or services operated by third
                  parties.
                </p>

                <p>
                  These links are provided for convenience or
                  informational purposes. TV SUPREME does not
                  necessarily control or endorse the content,
                  availability or policies of external websites.
                </p>
              </TermsSection>

              {/* Disclaimer */}
              <TermsSection
                id="disclaimer"
                number="07"
                title="Disclaimer"
                icon={<AlertCircle size={18} />}
              >
                <p>
                  The website and its content are provided on an
                  informational basis. While TV SUPREME aims to keep
                  information accurate and current, we do not
                  guarantee that every item of content will always be
                  complete, accurate, current or uninterrupted.
                </p>

                <p>
                  Website content should not automatically be treated
                  as professional, legal, financial, medical or other
                  specialised advice.
                </p>
              </TermsSection>

              {/* Limitation */}
              <TermsSection
                id="limitation"
                number="08"
                title="Limitation of Liability"
              >
                <p>
                  To the extent permitted by applicable law, TV SUPREME
                  will not be responsible for losses or damages arising
                  from the use of, or inability to use, the website or
                  information provided through it.
                </p>

                <p>
                  This includes circumstances involving service
                  interruptions, external links, technical issues or
                  reliance on information that later changes.
                </p>
              </TermsSection>

              {/* Changes */}
              <TermsSection
                id="changes"
                number="09"
                title="Changes to These Terms"
              >
                <p>
                  TV SUPREME may update these Terms of Use when
                  necessary to reflect changes to the website,
                  services or applicable requirements.
                </p>

                <p>
                  Any updated version will be published on this page
                  with the applicable revision date.
                </p>
              </TermsSection>

              {/* Contact */}
              <TermsSection
                id="contact"
                number="10"
                title="Contact Us"
                icon={<Mail size={18} />}
              >
                <p>
                  If you have questions regarding these Terms of Use,
                  please contact TV SUPREME.
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
              </TermsSection>
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
                  Review our Privacy Policy
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Learn how TV SUPREME handles information and privacy.
                </p>
              </div>

              <Link
                href="/legal/privacy-policy"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Privacy Policy
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
   TERMS SECTION
================================================================ */

function TermsSection({
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
   TERMS LIST
================================================================ */

function TermsList({
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