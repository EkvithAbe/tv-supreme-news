"use client";

import { Link } from "@/i18n/navigation";
import { getStaticTranslator } from "@/lib/static-page-translations";
import {
  Clock3,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useState, type ReactNode } from "react";

const contactTranslations = {
  si: {
    "Let's Connect": "සම්බන්ධ වෙමු",
    "Contact Us": "අප අමතන්න",
    "Have a question, story tip, feedback or business enquiry? Our team would love to hear from you.":
      "ඔබට ප්‍රශ්නයක්, පුවත් තොරතුරක්, ප්‍රතිචාරයක් හෝ ව්‍යාපාරික විමසීමක් තිබේද? ඔබගෙන් ඇසීමට අපගේ කණ්ඩායම සතුටු වේ.",
    "Call Us": "අප අමතන්න",
    "Mon–Fri, 9:00 AM–5:00 PM": "සඳුදා සිට සිකුරාදා දක්වා, පෙ.ව. 9.00–ප.ව. 5.00",
    "Email Us": "අපට විද්‍යුත් තැපැල් කරන්න",
    "We usually reply within 1–2 business days": "සාමාන්‍යයෙන් වැඩ කරන දින 1–2ක් ඇතුළත පිළිතුරු ලබා දෙමු",
    "Visit Us": "අප වෙත පැමිණෙන්න",
    "Colombo, Sri Lanka": "කොළඹ, ශ්‍රී ලංකාව",
    "By appointment": "පූර්ව හමුවීමක් මත",
    "Newsroom": "පුවත් මධ්‍යස්ථානය",
    "Always Connected": "සෑමවිටම සම්බන්ධයි",
    "Breaking news and editorial enquiries": "හදිසි පුවත් හා කතුවැකි විමසීම්",
    "Send Us a Message": "අපට පණිවිඩයක් එවන්න",
    "We're here to help": "ඔබට සහාය වීමට අපි සූදානම්",
    "Send us your message and the appropriate TV SUPREME team will get back to you.":
      "ඔබේ පණිවිඩය අපට එවන්න; අදාළ TV SUPREME කණ්ඩායම ඔබ වෙත නැවත සම්බන්ධ වේ.",
    "Full Name": "සම්පූර්ණ නම",
    "Enter your full name": "ඔබේ සම්පූර්ණ නම ඇතුළත් කරන්න",
    "Email Address": "විද්‍යුත් තැපැල් ලිපිනය",
    "Phone Number": "දුරකථන අංකය",
    "Subject": "මාතෘකාව",
    "How can we help?": "අපට ඔබට සහාය විය හැක්කේ කෙසේද?",
    "Message": "පණිවිඩය",
    "Write your message here...": "ඔබේ පණිවිඩය මෙහි ලියන්න...",
    "I agree to the TV SUPREME": "මම TV SUPREME හි",
    "Privacy Policy": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
    " and understand that my information will be used to respond to this enquiry.":
      "ට එකඟ වන අතර, මෙම විමසීමට පිළිතුරු සැපයීම සඳහා මගේ තොරතුරු භාවිත කරන බව මම තේරුම් ගනිමි.",
    "Sending...": "යවමින් පවතී...",
    "Send Message": "පණිවිඩය යවන්න",
    "We could not send your message right now.": "ඔබේ පණිවිඩය මේ මොහොතේ යැවීමට නොහැකි විය.",
    "Please wait a minute before sending another message.":
      "තවත් පණිවිඩයක් යැවීමට පෙර කරුණාකර මිනිත්තුවක් රැඳී සිටින්න.",
    "Please complete all required contact fields.": "අවශ්‍ය සියලු සම්බන්ධතා ක්ෂේත්‍ර සම්පූර්ණ කරන්න.",
    "Please enter a valid email address.": "වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න.",
    "Contact email is not configured yet. Please try again later.":
      "සම්බන්ධතා විද්‍යුත් තැපෑල තවම සකසා නැත. කරුණාකර පසුව නැවත උත්සාහ කරන්න.",
    "We could not send your message right now. Please try again later.":
      "ඔබේ පණිවිඩය මේ මොහොතේ යැවීමට නොහැකි විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.",
    "Your message has been sent. We will get back to you soon.":
      "ඔබේ පණිවිඩය යවා ඇත. අපි ඉක්මනින් ඔබ වෙත නැවත සම්බන්ධ වෙමු.",
    "Contact Channels": "සම්බන්ධ වීමේ මාර්ග",
    "Let's talk": "කතා කරමු",
    "Choose the most convenient way to reach the TV SUPREME team.":
      "TV SUPREME කණ්ඩායම වෙත ළඟා වීමට ඔබට පහසුම ක්‍රමය තෝරන්න.",
    "General Enquiries": "සාමාන්‍ය විමසීම්",
    "Business": "ව්‍යාපාරික විමසීම්",
    "Our Office": "අපගේ කාර්යාලය",
    "Colombo": "කොළඹ",
    "Sri Lanka": "ශ්‍රී ලංකාව",
    "Serving audiences across Sri Lanka and beyond": "ශ්‍රී ලංකාව පුරා සහ ඉන් ඔබ්බට ප්‍රේක්ෂකයන්ට සේවය කරමින්",
    "Follow TV SUPREME": "TV SUPREME අනුගමනය කරන්න",
    "Stay connected with our latest stories and updates.": "අපගේ නවතම කතා සහ යාවත්කාලීන සමඟ සම්බන්ධව සිටින්න.",
    "Website": "වෙබ් අඩවිය",
    "Follow TV SUPREME on Facebook": "Facebook හි TV SUPREME අනුගමනය කරන්න",
    "Follow TV SUPREME on Instagram": "Instagram හි TV SUPREME අනුගමනය කරන්න",
    "Follow TV SUPREME on YouTube": "YouTube හි TV SUPREME අනුගමනය කරන්න",
    "Visit the TV SUPREME website": "TV SUPREME වෙබ් අඩවියට පිවිසෙන්න",
    "Frequently Asked Questions": "නිතර අසන ප්‍රශ්න",
    "Here are some common questions about contacting TV SUPREME.":
      "TV SUPREME සම්බන්ධ කරගැනීම පිළිබඳ නිතර අසන ප්‍රශ්න කිහිපයක් මෙන්න.",
    "How can I send a news tip?": "පුවත් තොරතුරක් යවන්නේ කෙසේද?",
    "Use the contact form above and provide the details of the story. Our newsroom team can review the information and follow up when appropriate.":
      "ඉහත සම්බන්ධතා පෝරමය භාවිත කර කතාවේ විස්තර ලබාදෙන්න. අපගේ පුවත් මධ්‍යස්ථාන කණ්ඩායම තොරතුරු සමාලෝචනය කර අවශ්‍ය විට නැවත සම්බන්ධ විය හැක.",
    "How can I contact the advertising team?": "වෙළඳ දැන්වීම් කණ්ඩායම සම්බන්ධ කරගන්නේ කෙසේද?",
    "Use the business enquiry channel or visit the Advertise page for information about advertising opportunities.":
      "ව්‍යාපාරික විමසීම් මාර්ගය භාවිත කරන්න, නැතහොත් වෙළඳ දැන්වීම් අවස්ථා පිළිබඳ තොරතුරු සඳහා වෙළඳ දැන්වීම් පිටුවට පිවිසෙන්න.",
    "Can I provide feedback about the website?": "වෙබ් අඩවිය පිළිබඳ ප්‍රතිචාර ලබා දිය හැකිද?",
    "Yes. We welcome suggestions and feedback about the TV SUPREME website and digital experience.":
      "ඔව්. TV SUPREME වෙබ් අඩවිය සහ ඩිජිටල් අත්දැකීම පිළිබඳ යෝජනා හා ප්‍රතිචාර අපි සාදරයෙන් පිළිගනිමු.",
    "Can I contact TV SUPREME for media enquiries?": "මාධ්‍ය විමසීම් සඳහා TV SUPREME සම්බන්ධ කරගත හැකිද?",
    "Yes. Please use the contact form and select an appropriate subject so your request can be directed to the relevant team.":
      "ඔව්. ඔබගේ ඉල්ලීම අදාළ කණ්ඩායම වෙත යොමු කිරීමට, සම්බන්ධතා පෝරමය භාවිත කර සුදුසු මාතෘකාවක් තෝරන්න.",
    "Have something important to share?": "බෙදාගැනීමට වැදගත් යමක් තිබේද?",
    "Whether it's a story tip, feedback or a business enquiry, we're ready to hear from you.":
      "එය පුවත් තොරතුරක්, ප්‍රතිචාරයක් හෝ ව්‍යාපාරික විමසීමක් වුවද, ඔබගෙන් ඇසීමට අපි සූදානම්.",
    "Latest News": "නවතම පුවත්",
  },
  ta: {
    "Let's Connect": "தொடர்பில் இருப்போம்",
    "Contact Us": "எங்களைத் தொடர்புகொள்ளவும்",
    "Have a question, story tip, feedback or business enquiry? Our team would love to hear from you.":
      "உங்களிடம் கேள்வி, செய்திக் குறிப்பு, கருத்து அல்லது வணிக விசாரணை உள்ளதா? உங்களிடமிருந்து கேட்க எங்கள் குழு விரும்புகிறது.",
    "Call Us": "எங்களை அழைக்கவும்",
    "Mon–Fri, 9:00 AM–5:00 PM": "திங்கள்–வெள்ளி, காலை 9.00–மாலை 5.00",
    "Email Us": "எங்களுக்கு மின்னஞ்சல் அனுப்பவும்",
    "We usually reply within 1–2 business days": "பொதுவாக 1–2 வேலை நாட்களுக்குள் பதிலளிப்போம்",
    "Visit Us": "எங்களைச் சந்திக்கவும்",
    "Colombo, Sri Lanka": "கொழும்பு, இலங்கை",
    "By appointment": "முன்பதிவு மூலம்",
    "Newsroom": "செய்தியகம்",
    "Always Connected": "எப்போதும் இணைந்திருப்போம்",
    "Breaking news and editorial enquiries": "அவசரச் செய்திகள் மற்றும் ஆசிரியர் குழு விசாரணைகள்",
    "Send Us a Message": "எங்களுக்கு ஒரு செய்தி அனுப்பவும்",
    "We're here to help": "உங்களுக்கு உதவ நாங்கள் இருக்கிறோம்",
    "Send us your message and the appropriate TV SUPREME team will get back to you.":
      "உங்கள் செய்தியை அனுப்புங்கள்; பொருத்தமான TV SUPREME குழு உங்களைத் தொடர்புகொள்ளும்.",
    "Full Name": "முழுப் பெயர்",
    "Enter your full name": "உங்கள் முழுப் பெயரை உள்ளிடவும்",
    "Email Address": "மின்னஞ்சல் முகவரி",
    "Phone Number": "தொலைபேசி எண்",
    "Subject": "பொருள்",
    "How can we help?": "நாங்கள் எவ்வாறு உதவலாம்?",
    "Message": "செய்தி",
    "Write your message here...": "உங்கள் செய்தியை இங்கே எழுதவும்...",
    "I agree to the TV SUPREME": "TV SUPREME-இன்",
    "Privacy Policy": "தனியுரிமைக் கொள்கை",
    " and understand that my information will be used to respond to this enquiry.":
      "க்கு நான் ஒப்புக்கொள்கிறேன்; இந்த விசாரணைக்கு பதிலளிக்க எனது தகவல்கள் பயன்படுத்தப்படும் என்பதை புரிந்துகொள்கிறேன்.",
    "Sending...": "அனுப்பப்படுகிறது...",
    "Send Message": "செய்தியை அனுப்பவும்",
    "We could not send your message right now.": "உங்கள் செய்தியை தற்போது அனுப்ப முடியவில்லை.",
    "Please wait a minute before sending another message.":
      "மற்றொரு செய்தியை அனுப்புவதற்கு முன் ஒரு நிமிடம் காத்திருக்கவும்.",
    "Please complete all required contact fields.": "தேவையான அனைத்து தொடர்பு விவரங்களையும் பூர்த்தி செய்யவும்.",
    "Please enter a valid email address.": "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    "Contact email is not configured yet. Please try again later.":
      "தொடர்பு மின்னஞ்சல் இன்னும் அமைக்கப்படவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
    "We could not send your message right now. Please try again later.":
      "உங்கள் செய்தியை தற்போது அனுப்ப முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
    "Your message has been sent. We will get back to you soon.":
      "உங்கள் செய்தி அனுப்பப்பட்டுள்ளது. விரைவில் உங்களைத் தொடர்புகொள்வோம்.",
    "Contact Channels": "தொடர்பு வழிகள்",
    "Let's talk": "பேசலாம்",
    "Choose the most convenient way to reach the TV SUPREME team.":
      "TV SUPREME குழுவைத் தொடர்புகொள்ள உங்களுக்கு மிகவும் வசதியான வழியைத் தேர்ந்தெடுக்கவும்.",
    "General Enquiries": "பொதுவான விசாரணைகள்",
    "Business": "வணிக விசாரணைகள்",
    "Our Office": "எங்கள் அலுவலகம்",
    "Colombo": "கொழும்பு",
    "Sri Lanka": "இலங்கை",
    "Serving audiences across Sri Lanka and beyond": "இலங்கை முழுவதும் மற்றும் அதற்கு அப்பாலான பார்வையாளர்களுக்கு சேவை செய்கிறோம்",
    "Follow TV SUPREME": "TV SUPREME-ஐப் பின்தொடரவும்",
    "Stay connected with our latest stories and updates.": "எங்கள் சமீபத்திய செய்திகள் மற்றும் புதுப்பிப்புகளுடன் இணைந்திருங்கள்.",
    "Website": "இணையதளம்",
    "Follow TV SUPREME on Facebook": "Facebook-இல் TV SUPREME-ஐப் பின்தொடரவும்",
    "Follow TV SUPREME on Instagram": "Instagram-இல் TV SUPREME-ஐப் பின்தொடரவும்",
    "Follow TV SUPREME on YouTube": "YouTube-இல் TV SUPREME-ஐப் பின்தொடரவும்",
    "Visit the TV SUPREME website": "TV SUPREME இணையதளத்தைப் பார்வையிடவும்",
    "Frequently Asked Questions": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "Here are some common questions about contacting TV SUPREME.":
      "TV SUPREME-ஐத் தொடர்புகொள்வது குறித்த பொதுவான கேள்விகள் சில இங்கே உள்ளன.",
    "How can I send a news tip?": "செய்திக் குறிப்பை எவ்வாறு அனுப்பலாம்?",
    "Use the contact form above and provide the details of the story. Our newsroom team can review the information and follow up when appropriate.":
      "மேலுள்ள தொடர்புப் படிவத்தைப் பயன்படுத்தி செய்தியின் விவரங்களை வழங்கவும். எங்கள் செய்தியகக் குழு தகவலை மதிப்பாய்வு செய்து, தேவையானபோது உங்களைத் தொடர்புகொள்ளும்.",
    "How can I contact the advertising team?": "விளம்பரக் குழுவை எவ்வாறு தொடர்புகொள்வது?",
    "Use the business enquiry channel or visit the Advertise page for information about advertising opportunities.":
      "வணிக விசாரணை வழியைப் பயன்படுத்தவும் அல்லது விளம்பர வாய்ப்புகள் பற்றிய தகவலுக்கு விளம்பரப் பக்கத்தைப் பார்வையிடவும்.",
    "Can I provide feedback about the website?": "இணையதளம் குறித்து கருத்து தெரிவிக்கலாமா?",
    "Yes. We welcome suggestions and feedback about the TV SUPREME website and digital experience.":
      "ஆம். TV SUPREME இணையதளம் மற்றும் டிஜிட்டல் அனுபவம் குறித்த உங்கள் ஆலோசனைகளையும் கருத்துகளையும் நாங்கள் வரவேற்கிறோம்.",
    "Can I contact TV SUPREME for media enquiries?": "ஊடக விசாரணைகளுக்காக TV SUPREME-ஐத் தொடர்புகொள்ளலாமா?",
    "Yes. Please use the contact form and select an appropriate subject so your request can be directed to the relevant team.":
      "ஆம். உங்கள் கோரிக்கையைப் பொருத்தமான குழுவுக்கு அனுப்ப, தொடர்புப் படிவத்தைப் பயன்படுத்தி சரியான பொருளைத் தேர்ந்தெடுக்கவும்.",
    "Have something important to share?": "பகிர வேண்டிய முக்கியமான தகவல் உள்ளதா?",
    "Whether it's a story tip, feedback or a business enquiry, we're ready to hear from you.":
      "அது செய்திக் குறிப்பு, கருத்து அல்லது வணிக விசாரணையாக இருந்தாலும், உங்களிடமிருந்து கேட்க நாங்கள் தயாராக உள்ளோம்.",
    "Latest News": "சமீபத்திய செய்திகள்",
  },
};

export default function ContactPage() {
  const locale = useLocale();
  const t = getStaticTranslator(locale, contactTranslations);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    void fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        locale,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            t(
              data.error ||
                "We could not send your message right now.",
            ),
          );
        }

        form.reset();
        setFormSuccess(
          t(data.message),
        );
      })
      .catch((error) => {
        setFormError(
          error instanceof Error
            ? error.message
            : t(
                "We could not send your message right now.",
              ),
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
                {t("Let's Connect")}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("Contact Us")}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                {t(
                  "Have a question, story tip, feedback or business enquiry? Our team would love to hear from you.",
                )}
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
              title={t("Call Us")}
              value="+94 11 000 0000"
              note={t("Mon–Fri, 9:00 AM–5:00 PM")}
            />

            <ContactInfoCard
              icon={<Mail size={20} />}
              title={t("Email Us")}
              value="info@tvsupreme.lk"
              note={t("We usually reply within 1–2 business days")}
            />

            <ContactInfoCard
              icon={<MapPin size={20} />}
              title={t("Visit Us")}
              value={t("Colombo, Sri Lanka")}
              note={t("By appointment")}
            />

            <ContactInfoCard
              icon={<Clock3 size={20} />}
              title={t("Newsroom")}
              value={t("Always Connected")}
              note={t("Breaking news and editorial enquiries")}
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
                  {t("Send Us a Message")}
                </span>

                <h2 className="mt-2 text-2xl font-black text-[#111d4a] sm:text-3xl">
                  {t("We're here to help")}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  {t(
                    "Send us your message and the appropriate TV SUPREME team will get back to you.",
                  )}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6 sm:p-8"
              >
                {formError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {formError}
                  </p>
                )}

                {formSuccess && (
                  <p
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                  >
                    {formSuccess}
                  </p>
                )}

                {/* Name + Email */}
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    id="name"
                    label={t("Full Name")}
                    placeholder={t("Enter your full name")}
                    required
                  />

                  <FormField
                    id="email"
                    label={t("Email Address")}
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Phone + Subject */}
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    id="phone"
                    label={t("Phone Number")}
                    placeholder="+94 XX XXX XXXX"
                  />

                  <FormField
                    id="subject"
                    label={t("Subject")}
                    placeholder={t("How can we help?")}
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    {t("Message")}
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={7}
                    required
                    placeholder={t("Write your message here...")}
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
                    {t("I agree to the TV SUPREME")}{" "}
                    <Link
                      href="/legal/privacy-policy"
                      className="font-semibold text-pink-600 hover:text-purple-600"
                    >
                      {t("Privacy Policy")}
                    </Link>
                    {t(
                      " and understand that my information will be used to respond to this enquiry.",
                    )}
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                >
                  <Send size={16} />
                  {isSubmitting
                    ? t("Sending...")
                    : t("Send Message")}
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
                  {t("Contact Channels")}
                </p>

                <h2 className="mt-3 text-2xl font-black">
                  {t("Let's talk")}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  {t(
                    "Choose the most convenient way to reach the TV SUPREME team.",
                  )}
                </p>

                <div className="mt-6 space-y-3">
                  <ContactChannel
                    icon={<Mail size={17} />}
                    title={t("General Enquiries")}
                    value="info@tvsupreme.lk"
                  />

                  <ContactChannel
                    icon={<NewspaperIcon />}
                    title={t("Newsroom")}
                    value="news@tvsupreme.lk"
                  />

                  <ContactChannel
                    icon={<BriefcaseIcon />}
                    title={t("Business")}
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
                  {t("Our Office")}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  TV SUPREME
                  <br />
                  {t("Colombo")}
                  <br />
                  {t("Sri Lanka")}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Globe2
                    size={14}
                    className="text-pink-600"
                  />
                  {t("Serving audiences across Sri Lanka and beyond")}
                </div>
              </section>

              {/* Social */}
              <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <h3 className="text-lg font-bold text-[#111d4a]">
                  {t("Follow TV SUPREME")}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t("Stay connected with our latest stories and updates.")}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <SocialButton
                    label="Facebook"
                    ariaLabel={t("Follow TV SUPREME on Facebook")}
                    icon={<FacebookIcon />}
                    href="https://www.facebook.com/tvsupremenews/"
                  />

                  <SocialButton
                    label="Instagram"
                    ariaLabel={t("Follow TV SUPREME on Instagram")}
                    icon={<InstagramIcon />}
                    href="https://www.instagram.com/tvsupremenews.lk/"
                  />

                  <SocialButton
                    label="YouTube"
                    ariaLabel={t("Follow TV SUPREME on YouTube")}
                    icon={<YoutubeIcon />}
                    href="https://www.youtube.com/@tvsupremenews"
                  />

                  <Link
                    href="/"
                    aria-label={t("Visit the TV SUPREME website")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                  >
                    <Globe2 size={16} />
                    {t("Website")}
                  </Link>
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
              {t("Frequently Asked Questions")}
            </span>

            <h2 className="mt-3 text-3xl font-black text-[#111d4a] sm:text-4xl">
              {t("Frequently Asked Questions")}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              {t(
                "Here are some common questions about contacting TV SUPREME.",
              )}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <FAQItem
              question={t("How can I send a news tip?")}
              answer={t(
                "Use the contact form above and provide the details of the story. Our newsroom team can review the information and follow up when appropriate.",
              )}
            />

            <FAQItem
              question={t("How can I contact the advertising team?")}
              answer={t(
                "Use the business enquiry channel or visit the Advertise page for information about advertising opportunities.",
              )}
            />

            <FAQItem
              question={t("Can I provide feedback about the website?")}
              answer={t(
                "Yes. We welcome suggestions and feedback about the TV SUPREME website and digital experience.",
              )}
            />

            <FAQItem
              question={t("Can I contact TV SUPREME for media enquiries?")}
              answer={t(
                "Yes. Please use the contact form and select an appropriate subject so your request can be directed to the relevant team.",
              )}
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
                {t("Have something important to share?")}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/75">
                {t(
                  "Whether it's a story tip, feedback or a business enquiry, we're ready to hear from you.",
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:info@tvsupreme.lk"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
                >
                  <Mail size={16} />
                  {t("Email Us")}
                </a>

                <Link
                  href="/latest"
                  className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  {t("Latest News")}
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
  ariaLabel,
  icon,
  href,
}: {
  label: string;
  ariaLabel?: string;
  icon: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
      aria-label={ariaLabel || label}
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
