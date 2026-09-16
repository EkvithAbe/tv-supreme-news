"use client";

import Link from "next/link";
import {
  Clock3,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import type { ReactNode } from "react";

export default function ContactPage() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    window.alert(
      "Thank you for contacting TV SUPREME. Your message form is ready for backend integration."
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3c2372] via-[#5f19c8] to-[#ec008c]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(255,255,255,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[250px] items-center py-14 sm:min-h-[290px] sm:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                <MessageCircle size={14} />
                Let&apos;s Connect
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Contact Us
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Have a question, story tip, feedback or business
                enquiry? Our team would love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT INTRO
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <ContactInfoCard
              icon={<Phone size={20} />}
              title="Call Us"
              value="+94 11 000 0000"
              note="Mon–Fri, 9:00 AM–5:00 PM"
            />

            <ContactInfoCard
              icon={<Mail size={20} />}
              title="Email Us"
              value="info@tvsupreme.lk"
              note="We usually reply within 1–2 business days"
            />

            <ContactInfoCard
              icon={<MapPin size={20} />}
              title="Visit Us"
              value="Colombo, Sri Lanka"
              note="By appointment"
            />

            <ContactInfoCard
              icon={<Clock3 size={20} />}
              title="Newsroom"
              value="Always Connected"
              note="Breaking news and editorial enquiries"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTACT AREA
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
            {/* =====================================================
                MESSAGE FORM
            ====================================================== */}
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                  Send Us a Message
                </span>

                <h2 className="mt-2 text-2xl font-black text-[#111d4a] sm:text-3xl">
                  We&apos;re here to help
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Send us your message and the appropriate TV SUPREME
                  team will get back to you.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6 sm:p-8"
              >
                {/* Name + Email */}
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    id="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                  />

                  <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Phone + Subject */}
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    id="phone"
                    label="Phone Number"
                    placeholder="+94 XX XXX XXXX"
                  />

                  <FormField
                    id="subject"
                    label="Subject"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={7}
                    required
                    placeholder="Write your message here..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                  />
                </div>

                {/* Agreement */}
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-pink-600"
                  />

                  <span className="text-xs leading-5 text-slate-500">
                    I agree to the TV SUPREME{" "}
                    <Link
                      href="/legal/privacy-policy"
                      className="font-semibold text-pink-600 hover:text-purple-600"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and understand that my information will be used
                    to respond to this enquiry.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>

            {/* =====================================================
                RIGHT SIDEBAR
            ====================================================== */}
            <div className="space-y-6">
              {/* Contact Channels */}
              <section className="overflow-hidden rounded-[24px] bg-[#111d4a] p-6 text-white shadow-sm sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                  Contact Channels
                </p>

                <h2 className="mt-3 text-2xl font-black">
                  Let&apos;s talk
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  Choose the most convenient way to reach the TV
                  SUPREME team.
                </p>

                <div className="mt-6 space-y-3">
                  <ContactChannel
                    icon={<Mail size={17} />}
                    title="General Enquiries"
                    value="info@tvsupreme.lk"
                  />

                  <ContactChannel
                    icon={<NewspaperIcon />}
                    title="Newsroom"
                    value="news@tvsupreme.lk"
                  />

                  <ContactChannel
                    icon={<BriefcaseIcon />}
                    title="Business"
                    value="business@tvsupreme.lk"
                  />
                </div>
              </section>

              {/* Office */}
              <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <MapPin size={20} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#111d4a]">
                  Our Office
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  TV SUPREME
                  <br />
                  Colombo
                  <br />
                  Sri Lanka
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Globe2
                    size={14}
                    className="text-pink-600"
                  />
                  Serving audiences across Sri Lanka and beyond
                </div>
              </section>

              {/* Social */}
              <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <h3 className="text-lg font-bold text-[#111d4a]">
                  Follow TV SUPREME
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Stay connected with our latest stories and updates.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <SocialButton
                    label="Facebook"
                    icon={<FacebookIcon />}
                    href="#"
                  />

                  <SocialButton
                    label="Instagram"
                    icon={<InstagramIcon />}
                    href="#"
                  />

                  <SocialButton
                    label="YouTube"
                    icon={<YoutubeIcon />}
                    href="#"
                  />

                  <SocialButton
                    label="Website"
                    icon={<Globe2 size={16} />}
                    href="/en"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================== */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              Frequently Asked Questions
            </span>

            <h2 className="mt-3 text-3xl font-black text-[#111d4a] sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Here are some common questions about contacting TV
              SUPREME.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <FAQItem
              question="How can I send a news tip?"
              answer="Use the contact form above and provide the details of the story. Our newsroom team can review the information and follow up when appropriate."
            />

            <FAQItem
              question="How can I contact the advertising team?"
              answer="Use the business enquiry channel or visit the Advertise page for information about advertising opportunities."
            />

            <FAQItem
              question="Can I provide feedback about the website?"
              answer="Yes. We welcome suggestions and feedback about the TV SUPREME website and digital experience."
            />

            <FAQItem
              question="Can I contact TV SUPREME for media enquiries?"
              answer="Yes. Please use the contact form and select an appropriate subject so your request can be directed to the relevant team."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]">
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                TV SUPREME
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Have something important to share?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Whether it&apos;s a story tip, feedback or a business
                enquiry, we&apos;re ready to hear from you.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:info@tvsupreme.lk"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
                >
                  <Mail size={16} />
                  Email Us
                </a>

                <Link
                  href="/en/latest"
                  className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Latest News
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   CONTACT INFO CARD
================================================================ */

function ContactInfoCard({
  icon,
  title,
  value,
  note,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      <p className="mt-2 break-words text-base font-bold text-[#111d4a]">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {note}
      </p>
    </div>
  );
}

/* ===============================================================
   FORM FIELD
================================================================ */

function FormField({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-pink-600">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
      />
    </div>
  );
}

/* ===============================================================
   CONTACT CHANNEL
================================================================ */

function ContactChannel({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-pink-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-white/60">
          {title}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   SOCIAL BUTTON
================================================================ */

function SocialButton({
  label,
  icon,
  href,
}: {
  label: string;
  icon: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
      aria-label={label}
    >
      {icon}
      {label}
    </a>
  );
}

/* ===============================================================
   FAQ
================================================================ */

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-[#111d4a]">
        <span>{question}</span>

        <span className="shrink-0 text-pink-600 transition-transform group-open:rotate-45">
          <span className="text-xl leading-none">
            +
          </span>
        </span>
      </summary>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-sm leading-6 text-slate-500">
          {answer}
        </p>
      </div>
    </details>
  );
}

/* ===============================================================
   FACEBOOK ICON
================================================================ */

function FacebookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.314 0-6 2.686-6 6v2H5v4h3v6h4v-6h4l1-4h-5v-2a2 2 0 0 1 2-2z" />
    </svg>
  );
}

/* ===============================================================
   INSTAGRAM ICON
================================================================ */

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/* ===============================================================
   YOUTUBE ICON
================================================================ */

function YoutubeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

/* ===============================================================
   NEWSROOM ICON
================================================================ */

function NewspaperIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

/* ===============================================================
   BUSINESS ICON
================================================================ */

function BriefcaseIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />

      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />

      <path d="M3 12h18" />
    </svg>
  );
}