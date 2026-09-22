import { getLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import {
  getStaticTranslator,
  type StaticPageTranslations,
} from "@/lib/static-page-translations";
import {
  Award,
  CheckCircle2,
  Globe2,
  HeartHandshake,
  Mail,
  Newspaper,
  Target,
  Users,
  Video,
} from "lucide-react";

const aboutTranslations: StaticPageTranslations = {
  si: {
    "About Us": "අප ගැන",
    "Discover who we are, what we stand for and why we are committed to bringing meaningful news to our audience.":
      "අප කවුද, අප විශ්වාස කරන දේ මොනවාද සහ අපගේ ප්‍රේක්ෂකයන් වෙත අර්ථවත් පුවත් ගෙන ඒමට අප කැපවී සිටින්නේ ඇයි යන්න දැනගන්න.",
    "Our Story": "අපගේ කතාව",
    "Your trusted source for better-informed decisions":
      "වඩාත් දැනුවත් තීරණ සඳහා ඔබේ විශ්වාසනීය මූලාශ්‍රය",
    "TV SUPREME is a modern digital news platform focused on delivering timely, relevant and engaging news to audiences in Sri Lanka and around the world.":
      "TV SUPREME යනු ශ්‍රී ලංකාවේ සහ ලොව පුරා ප්‍රේක්ෂකයන් වෙත කාලෝචිත, අදාළ සහ ආකර්ෂණීය පුවත් ලබාදීමට කැප වූ නවීන ඩිජිටල් පුවත් වේදිකාවකි.",
    "We bring together national and international developments, business, politics, sports, entertainment, technology and lifestyle stories in one accessible digital experience.":
      "ජාතික හා ජාත්‍යන්තර වර්ධනයන්, ව්‍යාපාර, දේශපාලනය, ක්‍රීඩා, විනෝදාස්වාදය, තාක්ෂණය සහ ජීවන රටාව පිළිබඳ කතාන්දර එකම පහසුවෙන් ප්‍රවේශ විය හැකි ඩිජිටල් අත්දැකීමක් තුළ ගෙන එමු.",
    "Our aim is to make important information easy to discover while maintaining a strong commitment to responsible and meaningful journalism.":
      "වගකීම් සහගත හා අර්ථවත් පුවත්කරණය සඳහා අපගේ දැඩි කැපවීම රැකගෙන, වැදගත් තොරතුරු පහසුවෙන් සොයාගත හැකි කිරීම අපගේ අරමුණයි.",
    "News. Stories. Perspective.": "පුවත්. කතාන්දර. දෘෂ්ටිකෝණය.",
    "Our Mission": "අපගේ මෙහෙවර",
    "Deliver reliable, relevant and engaging news through a modern digital platform.":
      "නවීන ඩිජිටල් වේදිකාවක් හරහා විශ්වාසනීය, අදාළ සහ ආකර්ෂණීය පුවත් ලබාදීම.",
    "Our Commitment": "අපගේ කැපවීම",
    "Put our audience first and make meaningful information accessible.":
      "අපගේ ප්‍රේක්ෂකයන්ට ප්‍රමුඛත්වය දී අර්ථවත් තොරතුරු පහසුවෙන් ප්‍රවේශ විය හැකි කිරීම.",
    "Our Standard": "අපගේ ප්‍රමිතිය",
    "Build trust through responsible reporting, clarity and consistency.":
      "වගකීම් සහගත වාර්තාකරණය, පැහැදිලි බව සහ ස්ථාවරත්වය තුළින් විශ්වාසය ගොඩනැගීම.",
    News: "පුවත්",
    "Timely stories from Sri Lanka and the world.":
      "ශ්‍රී ලංකාවෙන් සහ ලෝකයෙන් කාලෝචිත කතාන්දර.",
    Video: "වීඩියෝ",
    "News, interviews and featured programmes.":
      "පුවත්, සම්මුඛ සාකච්ඡා සහ විශේෂ වැඩසටහන්.",
    Digital: "ඩිජිටල්",
    "Accessible across devices and languages.":
      "උපාංග සහ භාෂා හරහා පහසුවෙන් ප්‍රවේශ විය හැකිය.",
    Community: "ප්‍රජාව",
    "Stories that matter to our audience.":
      "අපගේ ප්‍රේක්ෂකයන්ට වැදගත් කතාන්දර.",
    "What We Do": "අප කරන දේ",
    "News designed for the way people live today":
      "අද ජනතාව ජීවත් වන ආකාරයට සැලසුම් කළ පුවත්",
    "We combine newsroom content with a modern digital experience so readers can quickly find the stories that matter to them.":
      "පාඨකයන්ට ඔවුන්ට වැදගත් කතාන්දර ඉක්මනින් සොයාගත හැකි වන ලෙස, අපි පුවත් කාමර අන්තර්ගතය නවීන ඩිජිටල් අත්දැකීමක් සමඟ එක් කරමු.",
    "Cover important developments across Sri Lanka and beyond.":
      "ශ්‍රී ලංකාව පුරා සහ ඉන් ඔබ්බෙහි වැදගත් වර්ධනයන් ආවරණය කරමු.",
    "Make news easier to discover through clear categories and search.":
      "පැහැදිලි කාණ්ඩ සහ සෙවුම හරහා පුවත් පහසුවෙන් සොයාගත හැකි කරමු.",
    "Bring together articles, videos and live coverage.":
      "ලිපි, වීඩියෝ සහ සජීවී ආවරණය එකම තැනකට ගෙන එමු.",
    "Support English, Sinhala and Tamil content.":
      "ඉංග්‍රීසි, සිංහල සහ දෙමළ අන්තර්ගතයට සහාය ලබාදෙමු.",
    "Our Coverage": "අපගේ ආවරණය",
    "Stories across the topics that matter": "වැදගත් මාතෘකා හරහා කතාන්දර",
    "Explore the main areas covered by the TV SUPREME newsroom.":
      "TV SUPREME පුවත් කාමරය ආවරණය කරන ප්‍රධාන ක්ෂේත්‍ර ගවේෂණය කරන්න.",
    "Sri Lanka": "ශ්‍රී ලංකාව",
    World: "ලෝකය",
    Politics: "දේශපාලනය",
    Business: "ව්‍යාපාර",
    Sports: "ක්‍රීඩා",
    Entertainment: "විනෝදාස්වාදය",
    Technology: "තාක්ෂණය",
    Lifestyle: "ජීවන රටාව",
    "Explore {category} news": "{category} පුවත් ගවේෂණය කරන්න",
    Responsible: "වගකීම් සහගත",
    "We value accurate and responsible reporting.":
      "නිවැරදි සහ වගකීම් සහගත වාර්තාකරණය අප අගය කරමු.",
    Accessible: "පහසුවෙන් ප්‍රවේශ විය හැකි",
    "Our digital platform is designed for easy access.":
      "අපගේ ඩිජිටල් වේදිකාව පහසු ප්‍රවේශය සඳහා සැලසුම් කර ඇත.",
    "Audience First": "ප්‍රේක්ෂකයා ප්‍රමුඛයි",
    "We create a better experience for readers and viewers.":
      "පාඨකයන් සහ නරඹන්නන් සඳහා වඩා හොඳ අත්දැකීමක් අපි නිර්මාණය කරමු.",
    "Stay Connected": "සම්බන්ධව සිටින්න",
    "Together for a better-informed tomorrow":
      "වඩාත් දැනුවත් හෙටක් සඳහා එක්වෙමු",
    "Keep up with the latest stories, live coverage and important developments from TV SUPREME.":
      "TV SUPREME වෙතින් නවතම කතාන්දර, සජීවී ආවරණය සහ වැදගත් වර්ධනයන් සමඟ යාවත්කාලීනව සිටින්න.",
    "Latest News": "නවතම පුවත්",
    "Contact Us": "අප අමතන්න",
  },
  ta: {
    "About Us": "எங்களைப் பற்றி",
    "Discover who we are, what we stand for and why we are committed to bringing meaningful news to our audience.":
      "நாங்கள் யார், எதற்காக நிற்கிறோம், எங்கள் பார்வையாளர்களுக்கு அர்த்தமுள்ள செய்திகளை வழங்குவதில் ஏன் உறுதிபூண்டுள்ளோம் என்பதை அறிந்துகொள்ளுங்கள்.",
    "Our Story": "எங்கள் கதை",
    "Your trusted source for better-informed decisions":
      "மேலும் தகவலறிந்த முடிவுகளுக்கான உங்கள் நம்பகமான ஆதாரம்",
    "TV SUPREME is a modern digital news platform focused on delivering timely, relevant and engaging news to audiences in Sri Lanka and around the world.":
      "TV SUPREME என்பது இலங்கையிலும் உலகம் முழுவதிலும் உள்ள பார்வையாளர்களுக்கு காலத்திற்கேற்ற, தொடர்புடைய மற்றும் ஈர்க்கக்கூடிய செய்திகளை வழங்குவதில் கவனம் செலுத்தும் நவீன டிஜிட்டல் செய்தித் தளமாகும்.",
    "We bring together national and international developments, business, politics, sports, entertainment, technology and lifestyle stories in one accessible digital experience.":
      "தேசிய மற்றும் சர்வதேச முன்னேற்றங்கள், வணிகம், அரசியல், விளையாட்டு, பொழுதுபோக்கு, தொழில்நுட்பம் மற்றும் வாழ்க்கை முறை கதைகளை எளிதில் அணுகக்கூடிய ஒரே டிஜிட்டல் அனுபவத்தில் வழங்குகிறோம்.",
    "Our aim is to make important information easy to discover while maintaining a strong commitment to responsible and meaningful journalism.":
      "பொறுப்பான மற்றும் அர்த்தமுள்ள பத்திரிகைத்துறைக்கான உறுதியான அர்ப்பணிப்பைத் தக்கவைத்துக்கொண்டு, முக்கியமான தகவல்களை எளிதில் கண்டறியக்கூடியதாக மாற்றுவதே எங்கள் நோக்கம்.",
    "News. Stories. Perspective.": "செய்திகள். கதைகள். பார்வை.",
    "Our Mission": "எங்கள் நோக்கம்",
    "Deliver reliable, relevant and engaging news through a modern digital platform.":
      "நவீன டிஜிட்டல் தளத்தின் மூலம் நம்பகமான, தொடர்புடைய மற்றும் ஈர்க்கக்கூடிய செய்திகளை வழங்குதல்.",
    "Our Commitment": "எங்கள் அர்ப்பணிப்பு",
    "Put our audience first and make meaningful information accessible.":
      "எங்கள் பார்வையாளர்களுக்கு முன்னுரிமை அளித்து, அர்த்தமுள்ள தகவல்களை எளிதில் அணுகக்கூடியதாக மாற்றுதல்.",
    "Our Standard": "எங்கள் தரநிலை",
    "Build trust through responsible reporting, clarity and consistency.":
      "பொறுப்பான செய்தியளிப்பு, தெளிவு மற்றும் தொடர்ச்சியின் மூலம் நம்பிக்கையை உருவாக்குதல்.",
    News: "செய்திகள்",
    "Timely stories from Sri Lanka and the world.":
      "இலங்கையிலும் உலகம் முழுவதிலும் இருந்து காலத்திற்கேற்ற கதைகள்.",
    Video: "காணொளி",
    "News, interviews and featured programmes.":
      "செய்திகள், நேர்காணல்கள் மற்றும் சிறப்பு நிகழ்ச்சிகள்.",
    Digital: "டிஜிட்டல்",
    "Accessible across devices and languages.":
      "சாதனங்கள் மற்றும் மொழிகள் அனைத்திலும் எளிதில் அணுகக்கூடியது.",
    Community: "சமூகம்",
    "Stories that matter to our audience.":
      "எங்கள் பார்வையாளர்களுக்கு முக்கியமான கதைகள்.",
    "What We Do": "நாங்கள் செய்வது",
    "News designed for the way people live today":
      "இன்றைய மக்களின் வாழ்க்கை முறைக்கேற்ப வடிவமைக்கப்பட்ட செய்திகள்",
    "We combine newsroom content with a modern digital experience so readers can quickly find the stories that matter to them.":
      "வாசகர்கள் தங்களுக்கு முக்கியமான கதைகளை விரைவாகக் கண்டறிய நாங்கள் செய்தியறை உள்ளடக்கத்தை நவீன டிஜிட்டல் அனுபவத்துடன் இணைக்கிறோம்.",
    "Cover important developments across Sri Lanka and beyond.":
      "இலங்கை முழுவதும் மற்றும் அதற்கு அப்பாலும் உள்ள முக்கிய முன்னேற்றங்களை வழங்குகிறோம்.",
    "Make news easier to discover through clear categories and search.":
      "தெளிவான பிரிவுகள் மற்றும் தேடல் மூலம் செய்திகளைக் கண்டறிவதை எளிதாக்குகிறோம்.",
    "Bring together articles, videos and live coverage.":
      "கட்டுரைகள், காணொளிகள் மற்றும் நேரலை செய்தியளிப்பை ஒரே இடத்தில் வழங்குகிறோம்.",
    "Support English, Sinhala and Tamil content.":
      "ஆங்கிலம், சிங்களம் மற்றும் தமிழ் உள்ளடக்கங்களுக்கு ஆதரவு வழங்குகிறோம்.",
    "Our Coverage": "எங்கள் செய்தியளிப்பு",
    "Stories across the topics that matter":
      "முக்கியமான தலைப்புகளில் உள்ள கதைகள்",
    "Explore the main areas covered by the TV SUPREME newsroom.":
      "TV SUPREME செய்தியறை வழங்கும் முக்கிய துறைகளை ஆராயுங்கள்.",
    "Sri Lanka": "இலங்கை",
    World: "உலகம்",
    Politics: "அரசியல்",
    Business: "வணிகம்",
    Sports: "விளையாட்டு",
    Entertainment: "பொழுதுபோக்கு",
    Technology: "தொழில்நுட்பம்",
    Lifestyle: "வாழ்க்கை முறை",
    "Explore {category} news": "{category} செய்திகளை ஆராயுங்கள்",
    Responsible: "பொறுப்புணர்வு",
    "We value accurate and responsible reporting.":
      "துல்லியமான மற்றும் பொறுப்பான செய்தியளிப்பை நாங்கள் மதிக்கிறோம்.",
    Accessible: "அணுக எளிதானது",
    "Our digital platform is designed for easy access.":
      "எங்கள் டிஜிட்டல் தளம் எளிதான அணுகலுக்காக வடிவமைக்கப்பட்டுள்ளது.",
    "Audience First": "பார்வையாளர்களுக்கு முன்னுரிமை",
    "We create a better experience for readers and viewers.":
      "வாசகர்கள் மற்றும் பார்வையாளர்களுக்கு சிறந்த அனுபவத்தை உருவாக்குகிறோம்.",
    "Stay Connected": "தொடர்பில் இருங்கள்",
    "Together for a better-informed tomorrow":
      "மேலும் தகவலறிந்த நாளைக்காக ஒன்றிணைவோம்",
    "Keep up with the latest stories, live coverage and important developments from TV SUPREME.":
      "TV SUPREME-இன் சமீபத்திய கதைகள், நேரலை செய்தியளிப்பு மற்றும் முக்கிய முன்னேற்றங்களுடன் தொடர்ந்து இணைந்திருங்கள்.",
    "Latest News": "சமீபத்திய செய்திகள்",
    "Contact Us": "எங்களைத் தொடர்புகொள்ளுங்கள்",
  },
};

export default async function AboutPage({
  locale: localeOverride,
}: {
  locale?: string;
} = {}) {
  const locale = localeOverride ?? (await getLocale());
  const t = getStaticTranslator(locale, aboutTranslations);
  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3c2372] via-[#5f19c8] to-[#ec008c]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.18),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[250px] items-center py-14 sm:min-h-[290px] sm:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Globe2 size={14} />
                TV SUPREME
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("About Us")}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                {t(
                  "Discover who we are, what we stand for and why we are committed to bringing meaningful news to our audience.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            {/* Text */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                {t("Our Story")}
              </span>

              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
                {t("Your trusted source for better-informed decisions")}
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                <p>
                  {t(
                    "TV SUPREME is a modern digital news platform focused on delivering timely, relevant and engaging news to audiences in Sri Lanka and around the world.",
                  )}
                </p>

                <p>
                  {t(
                    "We bring together national and international developments, business, politics, sports, entertainment, technology and lifestyle stories in one accessible digital experience.",
                  )}
                </p>

                <p>
                  {t(
                    "Our aim is to make important information easy to discover while maintaining a strong commitment to responsible and meaningful journalism.",
                  )}
                </p>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-xl" />

              <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-[#111d4a] shadow-xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#111d4a] via-[#2b1c67] to-[#ec008c]">
                  <div className="flex h-full items-center justify-center p-8">
                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec008c] to-[#5f19c8] text-white shadow-lg">
                          <Newspaper size={22} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                            TV SUPREME
                          </p>

                          <p className="mt-1 text-lg font-bold text-white">
                            {t("News. Stories. Perspective.")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-7 space-y-3">
                        <div className="h-2 rounded-full bg-white/20" />
                        <div className="h-2 w-5/6 rounded-full bg-white/20" />
                        <div className="h-2 w-2/3 rounded-full bg-white/20" />
                      </div>

                      <div className="mt-7 grid grid-cols-3 gap-2">
                        <div className="h-14 rounded-xl bg-white/10" />
                        <div className="h-14 rounded-xl bg-white/10" />
                        <div className="h-14 rounded-xl bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HIGHLIGHTS
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <ValueCard
              icon={<Target size={21} />}
              title={t("Our Mission")}
              text={t(
                "Deliver reliable, relevant and engaging news through a modern digital platform.",
              )}
            />

            <ValueCard
              icon={<HeartHandshake size={21} />}
              title={t("Our Commitment")}
              text={t(
                "Put our audience first and make meaningful information accessible.",
              )}
            />

            <ValueCard
              icon={<Award size={21} />}
              title={t("Our Standard")}
              text={t(
                "Build trust through responsible reporting, clarity and consistency.",
              )}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT WE DO
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            {/* Visual */}
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 shadow-sm">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-white to-pink-50 p-6">
                  <div className="grid h-full grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#111d4a] p-4">
                      <Newspaper size={20} className="text-white" />

                      <p className="mt-8 text-sm font-bold text-white">
                        {t("News")}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/60">
                        {t("Timely stories from Sri Lanka and the world.")}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-[#ec008c] to-[#5f19c8] p-4">
                      <Video size={20} className="text-white" />

                      <p className="mt-8 text-sm font-bold text-white">
                        {t("Video")}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/75">
                        {t("News, interviews and featured programmes.")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <Globe2 size={20} className="text-pink-600" />

                      <p className="mt-8 text-sm font-bold text-[#111d4a]">
                        {t("Digital")}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {t("Accessible across devices and languages.")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <Users size={20} className="text-[#5f19c8]" />

                      <p className="mt-8 text-sm font-bold text-[#111d4a]">
                        {t("Community")}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {t("Stories that matter to our audience.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                {t("What We Do")}
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
                {t("News designed for the way people live today")}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                {t(
                  "We combine newsroom content with a modern digital experience so readers can quickly find the stories that matter to them.",
                )}
              </p>

              <div className="mt-7 space-y-4">
                {[
                  t(
                    "Cover important developments across Sri Lanka and beyond.",
                  ),
                  t(
                    "Make news easier to discover through clear categories and search.",
                  ),
                  t("Bring together articles, videos and live coverage."),
                  t("Support English, Sinhala and Tamil content."),
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-pink-600"
                    />

                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COVERAGE
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              {t("Our Coverage")}
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              {t("Stories across the topics that matter")}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {t("Explore the main areas covered by the TV SUPREME newsroom.")}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { slug: "sri-lanka", label: t("Sri Lanka") },
              { slug: "world", label: t("World") },
              { slug: "politics", label: t("Politics") },
              { slug: "business", label: t("Business") },
              { slug: "sports", label: t("Sports") },
              { slug: "entertainment", label: t("Entertainment") },
              { slug: "technology", label: t("Technology") },
              { slug: "lifestyle", label: t("Lifestyle") },
            ].map((category, index) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                locale={locale}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <span className="text-sm font-black">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="text-slate-300 transition group-hover:text-pink-500">
                    →
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-bold text-[#111d4a]">
                  {category.label}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {t("Explore {category} news").replace(
                    "{category}",
                    category.label,
                  )}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST STRIP
      ========================================================== */}
      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <TrustItem
                icon={<CheckCircle2 size={20} />}
                title={t("Responsible")}
                text={t("We value accurate and responsible reporting.")}
              />

              <TrustItem
                icon={<Globe2 size={20} />}
                title={t("Accessible")}
                text={t("Our digital platform is designed for easy access.")}
              />

              <TrustItem
                icon={<Users size={20} />}
                title={t("Audience First")}
                text={t(
                  "We create a better experience for readers and viewers.",
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]">
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                {t("Stay Connected")}
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                {t("Together for a better-informed tomorrow")}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/75">
                {t(
                  "Keep up with the latest stories, live coverage and important developments from TV SUPREME.",
                )}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link
                href="/latest"
                locale={locale}
                className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
              >
                {t("Latest News")}
              </Link>

              <Link
                href="/contact"
                locale={locale}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Mail size={16} />
                {t("Contact Us")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   VALUE CARD
================================================================ */

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#111d4a]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

/* ===============================================================
   TRUST ITEM
================================================================ */

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#111d4a]">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  );
}
