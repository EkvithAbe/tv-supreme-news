import { getLocale } from "next-intl/server";

import {
  getStaticTranslator,
  type StaticPageTranslations,
} from "@/lib/static-page-translations";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Image as ImageIcon,
  Mail,
  Megaphone,
  MonitorPlay,
  Newspaper,
  Phone,
  Radio,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react";

const advertiseTranslations: StaticPageTranslations = {
  si: {
    Advertising: "වෙළඳ ප්‍රචාරණය",
    "Reach Millions": "මිලියන ගණනාවක් වෙත ළඟා වන්න",
    "With TV SUPREME": "TV SUPREME සමඟ",
    "Connect your brand with an engaged audience through premium digital advertising, video, live TV and sponsored content opportunities.":
      "ප්‍රිමියම් ඩිජිටල් දැන්වීම්, වීඩියෝ, සජීවී රූපවාහිනිය සහ අනුග්‍රහිත අන්තර්ගත අවස්ථා හරහා සක්‍රීය ප්‍රේක්ෂක පිරිසක් සමඟ ඔබේ සන්නාමය සම්බන්ධ කරන්න.",
    "Explore Solutions": "විසඳුම් ගවේෂණය කරන්න",
    "Contact Sales": "විකුණුම් කණ්ඩායම අමතන්න",
    "Your brand, front and centre.": "ඔබේ සන්නාමය, ප්‍රමුඛ ස්ථානයේ.",
    "Campaign Reach": "ව්‍යාපාරයේ ළඟා වීම",
    "Digital audience opportunities": "ඩිජිටල් ප්‍රේක්ෂක අවස්ථා",
    Digital: "ඩිජිටල්",
    Languages: "භාෂා",
    Solutions: "විසඳුම්",
    "Why Advertise With TV SUPREME?":
      "TV SUPREME සමඟ වෙළඳ ප්‍රචාරණය කරන්නේ ඇයි?",
    "Put your message in front of the right audience":
      "ඔබේ පණිවිඩය නිවැරදි ප්‍රේක්ෂකයන් ඉදිරියට ගෙන යන්න",
    "Build awareness, connect with audiences and create stronger digital campaigns through a trusted news platform.":
      "විශ්වාසනීය පුවත් වේදිකාවක් හරහා දැනුවත්භාවය ගොඩනඟා, ප්‍රේක්ෂකයන් සමඟ සම්බන්ධ වී වඩාත් ශක්තිමත් ඩිජිටල් ව්‍යාපාර නිර්මාණය කරන්න.",
    "Reach More People": "තවත් පිරිසක් වෙත ළඟා වන්න",
    "Connect with a broad audience across Sri Lanka and beyond.":
      "ශ්‍රී ලංකාව පුරා සහ ඉන් ඔබ්බෙහි පුළුල් ප්‍රේක්ෂක පිරිසක් සමඟ සම්බන්ධ වන්න.",
    "Targeted Reach": "ඉලක්කගත ළඟා වීම",
    "Reach audiences around relevant topics, categories and content.":
      "අදාළ මාතෘකා, කාණ්ඩ සහ අන්තර්ගතය වටා සිටින ප්‍රේක්ෂකයන් වෙත ළඟා වන්න.",
    "Measurable Results": "මැනිය හැකි ප්‍රතිඵල",
    "Track campaign performance and make data-informed decisions.":
      "ව්‍යාපාරයේ කාර්යසාධනය නිරීක්ෂණය කර දත්ත මත පදනම් වූ තීරණ ගන්න.",
    "Premium Presence": "ප්‍රිමියම් පෙනී සිටීම",
    "Showcase your brand through a modern, professional digital environment.":
      "නවීන, වෘත්තීය ඩිජිටල් පරිසරයක් තුළ ඔබේ සන්නාමය ප්‍රදර්ශනය කරන්න.",
    "Our Advertising Solutions": "අපගේ වෙළඳ ප්‍රචාරණ විසඳුම්",
    "Flexible solutions for every campaign":
      "සෑම ව්‍යාපාරයකටම නම්‍යශීලී විසඳුම්",
    "Choose the format that best matches your campaign goals, audience and budget.":
      "ඔබේ ව්‍යාපාර ඉලක්ක, ප්‍රේක්ෂකයන් සහ අයවැයට වඩාත් ගැළපෙන ආකෘතිය තෝරන්න.",
    "Web Advertising": "වෙබ් දැන්වීම්",
    "Promote your brand across high-visibility areas of the TV SUPREME website.":
      "TV SUPREME වෙබ් අඩවියේ වැඩි දෘශ්‍යතාවක් ඇති කොටස් හරහා ඔබේ සන්නාමය ප්‍රවර්ධනය කරන්න.",
    "Homepage placements": "මුල් පිටු ස්ථානගත කිරීම්",
    "Category placements": "කාණ්ඩ ස්ථානගත කිරීම්",
    "Display campaigns": "දර්ශන දැන්වීම් ව්‍යාපාර",
    "Branded promotions": "සන්නාමගත ප්‍රවර්ධන",
    "Video Advertising": "වීඩියෝ දැන්වීම්",
    "Reach viewers through premium video placements and sponsored content.":
      "ප්‍රිමියම් වීඩියෝ ස්ථානගත කිරීම් සහ අනුග්‍රහිත අන්තර්ගතය හරහා නරඹන්නන් වෙත ළඟා වන්න.",
    "Pre-roll opportunities": "පෙර-වීඩියෝ අවස්ථා",
    "Video sponsorships": "වීඩියෝ අනුග්‍රාහකත්වයන්",
    "Branded video": "සන්නාමගත වීඩියෝ",
    "Programme promotions": "වැඩසටහන් ප්‍රවර්ධන",
    "Live TV Advertising": "සජීවී රූපවාහිනී දැන්වීම්",
    "Connect with viewers around live broadcasts and special programming.":
      "සජීවී විකාශන සහ විශේෂ වැඩසටහන් වටා සිටින නරඹන්නන් සමඟ සම්බන්ධ වන්න.",
    "Live stream placements": "සජීවී ප්‍රවාහ ස්ථානගත කිරීම්",
    "Broadcast sponsorships": "විකාශන අනුග්‍රාහකත්වයන්",
    "Special events": "විශේෂ සිදුවීම්",
    "Campaign integrations": "ව්‍යාපාර ඒකාබද්ධ කිරීම්",
    "Sponsored Content": "අනුග්‍රහිත අන්තර්ගතය",
    "Create meaningful branded storytelling with editorial-style digital experiences.":
      "සංස්කාරකීය ශෛලියේ ඩිජිටල් අත්දැකීම් සමඟ අර්ථවත් සන්නාම කතාන්දර නිර්මාණය කරන්න.",
    "Branded articles": "සන්නාමගත ලිපි",
    "Special features": "විශේෂාංග",
    "Campaign stories": "ව්‍යාපාර කතාන්දර",
    "Custom landing pages": "අභිරුචි ගොඩබැසීමේ පිටු",
    "Mobile Campaigns": "ජංගම ව්‍යාපාර",
    "Keep your brand visible to audiences using smartphones and mobile devices.":
      "ස්මාර්ට්ෆෝන් සහ ජංගම උපාංග භාවිත කරන ප්‍රේක්ෂකයන්ට ඔබේ සන්නාමය පෙනෙන ලෙස තබාගන්න.",
    "Mobile placements": "ජංගම ස්ථානගත කිරීම්",
    "Responsive creatives": "ප්‍රතිචාරාත්මක නිර්මාණ",
    "Mobile-first campaigns": "ජංගම-ප්‍රමුඛ ව්‍යාපාර",
    "Audience reach": "ප්‍රේක්ෂක ළඟා වීම",
    "Custom Campaigns": "අභිරුචි ව්‍යාපාර",
    "Build a campaign around your unique business objectives and creative ideas.":
      "ඔබේ සුවිශේෂී ව්‍යාපාරික අරමුණු සහ නිර්මාණාත්මක අදහස් වටා ව්‍යාපාරයක් ගොඩනඟන්න.",
    "Custom packages": "අභිරුචි පැකේජ",
    "Creative support": "නිර්මාණාත්මක සහාය",
    "Multi-format campaigns": "බහු-ආකෘති ව්‍යාපාර",
    "Campaign consultation": "ව්‍යාපාර උපදේශනය",
    "Available Formats": "ලබාගත හැකි ආකෘති",
    "Choose the format that fits your campaign":
      "ඔබේ ව්‍යාපාරයට ගැළපෙන ආකෘතිය තෝරන්න",
    "From simple display placements to integrated multi-format campaigns, we can create a solution around your objectives.":
      "සරල දර්ශන ස්ථානගත කිරීම් සිට ඒකාබද්ධ බහු-ආකෘති ව්‍යාපාර දක්වා, ඔබේ අරමුණු වටා විසඳුමක් අපට නිර්මාණය කළ හැකිය.",
    "Display Advertising": "දර්ශන දැන්වීම්",
    "High-visibility placements across relevant website sections.":
      "අදාළ වෙබ් අඩවි කොටස් හරහා ඉහළ දෘශ්‍යතා ස්ථානගත කිරීම්.",
    "Video Campaigns": "වීඩියෝ ව්‍යාපාර",
    "Video placements and branded video opportunities.":
      "වීඩියෝ ස්ථානගත කිරීම් සහ සන්නාමගත වීඩියෝ අවස්ථා.",
    "Sponsored Stories": "අනුග්‍රහිත කතාන්දර",
    "Story-led branded content designed around your message.":
      "ඔබේ පණිවිඩය වටා සැලසුම් කළ කතාන්දර මූලික සන්නාමගත අන්තර්ගතය.",
    "Integrated Campaigns": "ඒකාබද්ධ ව්‍යාපාර",
    "Combine web, video and live TV opportunities into one campaign.":
      "වෙබ්, වීඩියෝ සහ සජීවී රූපවාහිනී අවස්ථා එකම ව්‍යාපාරයකට ඒකාබද්ධ කරන්න.",
    "Campaign Formats": "ව්‍යාපාර ආකෘති",
    "One platform.": "එක වේදිකාවක්.",
    "Multiple opportunities.": "බහු අවස්ථා.",
    Website: "වෙබ් අඩවිය",
    "Digital reach": "ඩිජිටල් ළඟා වීම",
    Video: "වීඩියෝ",
    "Visual impact": "දෘශ්‍ය බලපෑම",
    "Live TV": "සජීවී රූපවාහිනිය",
    "Live audiences": "සජීවී ප්‍රේක්ෂකයන්",
    Sponsored: "අනුග්‍රහිත",
    "Branded stories": "සන්නාමගත කතාන්දර",
    Recommended: "නිර්දේශිත",
    "Integrated multi-channel campaign": "ඒකාබද්ධ බහු-නාලිකා ව්‍යාපාරය",
    "Combine multiple formats for a stronger campaign presence.":
      "වඩාත් ශක්තිමත් ව්‍යාපාරික පෙනී සිටීමක් සඳහා ආකෘති කිහිපයක් ඒකාබද්ධ කරන්න.",
    "English, Sinhala and Tamil": "ඉංග්‍රීසි, සිංහල සහ දෙමළ",
    "Digital Presence": "ඩිජිටල් පෙනී සිටීම",
    "Always-on online visibility": "සැමවිටම සක්‍රීය මාර්ගගත දෘශ්‍යතාව",
    "Campaign Support": "ව්‍යාපාර සහාය",
    "From planning to delivery": "සැලසුම් කිරීමෙන් බෙදාහැරීම දක්වා",
    "Trusted Platform": "විශ්වාසනීය වේදිකාව",
    "One place for your audience": "ඔබේ ප්‍රේක්ෂකයන් සඳහා එකම තැන",
    "How It Works": "මෙය ක්‍රියා කරන ආකාරය",
    "From idea to campaign": "අදහසේ සිට ව්‍යාපාරය දක්වා",
    "Tell Us Your Goal": "ඔබේ ඉලක්කය අපට කියන්න",
    "Share your campaign objective, audience and preferred timeline.":
      "ඔබේ ව්‍යාපාර අරමුණ, ප්‍රේක්ෂකයන් සහ කැමති කාලසටහන අප සමඟ බෙදාගන්න.",
    "Choose a Solution": "විසඳුමක් තෝරන්න",
    "We recommend the most suitable advertising formats.":
      "වඩාත් ගැළපෙන වෙළඳ ප්‍රචාරණ ආකෘති අපි නිර්දේශ කරමු.",
    Launch: "ආරම්භය",
    "Your campaign goes live across the agreed TV SUPREME channels.":
      "ඔබේ ව්‍යාපාරය එකඟ වූ TV SUPREME නාලිකා හරහා සජීවී වේ.",
    Measure: "මැන බලන්න",
    "Review campaign performance and identify opportunities to improve.":
      "ව්‍යාපාරයේ කාර්යසාධනය සමාලෝචනය කර වැඩිදියුණු කිරීමේ අවස්ථා හඳුනාගන්න.",
    "Let's Grow Your Brand Together": "ඔබේ සන්නාමය එක්ව වර්ධනය කරමු",
    "Ready to reach your audience?": "ඔබේ ප්‍රේක්ෂකයන් වෙත ළඟා වීමට සූදානම්ද?",
    "Talk to the TV SUPREME team about your next campaign and let's build the right solution for your brand.":
      "ඔබේ මීළඟ ව්‍යාපාරය ගැන TV SUPREME කණ්ඩායම සමඟ කතා කර, ඔබේ සන්නාමයට ගැළපෙන විසඳුම එක්ව ගොඩනඟමු.",
    "Call Us": "අප අමතන්න",
    Popular: "ජනප්‍රිය",
  },
  ta: {
    Advertising: "விளம்பரம்",
    "Reach Millions": "மில்லியன் கணக்கானவர்களை அடையுங்கள்",
    "With TV SUPREME": "TV SUPREME உடன்",
    "Connect your brand with an engaged audience through premium digital advertising, video, live TV and sponsored content opportunities.":
      "உயர்தர டிஜிட்டல் விளம்பரம், காணொளி, நேரலை தொலைக்காட்சி மற்றும் ஆதரவு உள்ளடக்க வாய்ப்புகள் மூலம் ஈடுபாடுள்ள பார்வையாளர்களுடன் உங்கள் பிராண்டை இணைக்குங்கள்.",
    "Explore Solutions": "தீர்வுகளை ஆராயுங்கள்",
    "Contact Sales": "விற்பனைக் குழுவைத் தொடர்புகொள்ளுங்கள்",
    "Your brand, front and centre.":
      "உங்கள் பிராண்ட், முன்னிலையிலும் மையத்திலும்.",
    "Campaign Reach": "பிரச்சார அணுகல்",
    "Digital audience opportunities": "டிஜிட்டல் பார்வையாளர் வாய்ப்புகள்",
    Digital: "டிஜிட்டல்",
    Languages: "மொழிகள்",
    Solutions: "தீர்வுகள்",
    "Why Advertise With TV SUPREME?":
      "TV SUPREME உடன் ஏன் விளம்பரம் செய்ய வேண்டும்?",
    "Put your message in front of the right audience":
      "உங்கள் செய்தியை சரியான பார்வையாளர்களிடம் கொண்டு செல்லுங்கள்",
    "Build awareness, connect with audiences and create stronger digital campaigns through a trusted news platform.":
      "நம்பகமான செய்தித் தளத்தின் மூலம் விழிப்புணர்வை உருவாக்கி, பார்வையாளர்களுடன் இணைந்து, வலுவான டிஜிட்டல் பிரச்சாரங்களை உருவாக்குங்கள்.",
    "Reach More People": "மேலும் பலரை அடையுங்கள்",
    "Connect with a broad audience across Sri Lanka and beyond.":
      "இலங்கை முழுவதும் மற்றும் அதற்கு அப்பாலும் உள்ள பரந்த பார்வையாளர்களுடன் இணையுங்கள்.",
    "Targeted Reach": "இலக்கிடப்பட்ட அணுகல்",
    "Reach audiences around relevant topics, categories and content.":
      "தொடர்புடைய தலைப்புகள், பிரிவுகள் மற்றும் உள்ளடக்கங்களை விரும்பும் பார்வையாளர்களை அடையுங்கள்.",
    "Measurable Results": "அளவிடக்கூடிய முடிவுகள்",
    "Track campaign performance and make data-informed decisions.":
      "பிரச்சார செயல்திறனை கண்காணித்து, தரவு சார்ந்த முடிவுகளை எடுக்குங்கள்.",
    "Premium Presence": "உயர்தர முன்னிலை",
    "Showcase your brand through a modern, professional digital environment.":
      "நவீனமான, தொழில்முறை டிஜிட்டல் சூழலில் உங்கள் பிராண்டை வெளிப்படுத்துங்கள்.",
    "Our Advertising Solutions": "எங்கள் விளம்பரத் தீர்வுகள்",
    "Flexible solutions for every campaign":
      "ஒவ்வொரு பிரச்சாரத்திற்கும் நெகிழ்வான தீர்வுகள்",
    "Choose the format that best matches your campaign goals, audience and budget.":
      "உங்கள் பிரச்சார இலக்குகள், பார்வையாளர்கள் மற்றும் பட்ஜெட்டிற்கு சிறப்பாகப் பொருந்தும் வடிவத்தைத் தேர்ந்தெடுங்கள்.",
    "Web Advertising": "இணைய விளம்பரம்",
    "Promote your brand across high-visibility areas of the TV SUPREME website.":
      "TV SUPREME இணையதளத்தின் அதிகக் காட்சித் திறன் கொண்ட பகுதிகளில் உங்கள் பிராண்டை விளம்பரப்படுத்துங்கள்.",
    "Homepage placements": "முகப்புப் பக்க இடங்கள்",
    "Category placements": "பிரிவு இடங்கள்",
    "Display campaigns": "காட்சி விளம்பரப் பிரச்சாரங்கள்",
    "Branded promotions": "பிராண்டு விளம்பரங்கள்",
    "Video Advertising": "காணொளி விளம்பரம்",
    "Reach viewers through premium video placements and sponsored content.":
      "உயர்தர காணொளி இடங்கள் மற்றும் ஆதரவு உள்ளடக்கத்தின் மூலம் பார்வையாளர்களை அடையுங்கள்.",
    "Pre-roll opportunities": "முன்னோட்ட விளம்பர வாய்ப்புகள்",
    "Video sponsorships": "காணொளி ஆதரவு வாய்ப்புகள்",
    "Branded video": "பிராண்டு காணொளி",
    "Programme promotions": "நிகழ்ச்சி விளம்பரங்கள்",
    "Live TV Advertising": "நேரலை தொலைக்காட்சி விளம்பரம்",
    "Connect with viewers around live broadcasts and special programming.":
      "நேரலை ஒளிபரப்புகள் மற்றும் சிறப்பு நிகழ்ச்சிகளைச் சுற்றியுள்ள பார்வையாளர்களுடன் இணையுங்கள்.",
    "Live stream placements": "நேரலை ஒளிபரப்பு இடங்கள்",
    "Broadcast sponsorships": "ஒளிபரப்பு ஆதரவுகள்",
    "Special events": "சிறப்பு நிகழ்வுகள்",
    "Campaign integrations": "பிரச்சார ஒருங்கிணைப்புகள்",
    "Sponsored Content": "ஆதரவு உள்ளடக்கம்",
    "Create meaningful branded storytelling with editorial-style digital experiences.":
      "தொகுப்பாசிரியர் பாணியிலான டிஜிட்டல் அனுபவங்களுடன் அர்த்தமுள்ள பிராண்டு கதையாடலை உருவாக்குங்கள்.",
    "Branded articles": "பிராண்டு கட்டுரைகள்",
    "Special features": "சிறப்பு அம்சங்கள்",
    "Campaign stories": "பிரச்சாரக் கதைகள்",
    "Custom landing pages": "தனிப்பயன் இறங்குப் பக்கங்கள்",
    "Mobile Campaigns": "மொபைல் பிரச்சாரங்கள்",
    "Keep your brand visible to audiences using smartphones and mobile devices.":
      "ஸ்மார்ட்போன்கள் மற்றும் மொபைல் சாதனங்களைப் பயன்படுத்தும் பார்வையாளர்களுக்கு உங்கள் பிராண்டைத் தொடர்ந்து காட்சிப்படுத்துங்கள்.",
    "Mobile placements": "மொபைல் இடங்கள்",
    "Responsive creatives": "பதிலளிக்கும் படைப்புகள்",
    "Mobile-first campaigns": "மொபைல் முதன்மை பிரச்சாரங்கள்",
    "Audience reach": "பார்வையாளர் அணுகல்",
    "Custom Campaigns": "தனிப்பயன் பிரச்சாரங்கள்",
    "Build a campaign around your unique business objectives and creative ideas.":
      "உங்கள் தனித்துவமான வணிக இலக்குகள் மற்றும் படைப்பாற்றல் எண்ணங்களை மையமாகக் கொண்டு ஒரு பிரச்சாரத்தை உருவாக்குங்கள்.",
    "Custom packages": "தனிப்பயன் தொகுப்புகள்",
    "Creative support": "படைப்பாற்றல் ஆதரவு",
    "Multi-format campaigns": "பல வடிவப் பிரச்சாரங்கள்",
    "Campaign consultation": "பிரச்சார ஆலோசனை",
    "Available Formats": "கிடைக்கும் வடிவங்கள்",
    "Choose the format that fits your campaign":
      "உங்கள் பிரச்சாரத்திற்கு ஏற்ற வடிவத்தைத் தேர்ந்தெடுங்கள்",
    "From simple display placements to integrated multi-format campaigns, we can create a solution around your objectives.":
      "எளிய காட்சி இடங்களிலிருந்து ஒருங்கிணைந்த பல வடிவப் பிரச்சாரங்கள் வரை, உங்கள் இலக்குகளை மையமாகக் கொண்ட தீர்வை உருவாக்க முடியும்.",
    "Display Advertising": "காட்சி விளம்பரம்",
    "High-visibility placements across relevant website sections.":
      "தொடர்புடைய இணையதளப் பகுதிகளில் உயர் காட்சித் திறன் கொண்ட இடங்கள்.",
    "Video Campaigns": "காணொளிப் பிரச்சாரங்கள்",
    "Video placements and branded video opportunities.":
      "காணொளி இடங்கள் மற்றும் பிராண்டு காணொளி வாய்ப்புகள்.",
    "Sponsored Stories": "ஆதரவு கதைகள்",
    "Story-led branded content designed around your message.":
      "உங்கள் செய்தியை மையமாகக் கொண்டு வடிவமைக்கப்பட்ட கதை சார்ந்த பிராண்டு உள்ளடக்கம்.",
    "Integrated Campaigns": "ஒருங்கிணைந்த பிரச்சாரங்கள்",
    "Combine web, video and live TV opportunities into one campaign.":
      "இணையம், காணொளி மற்றும் நேரலை தொலைக்காட்சி வாய்ப்புகளை ஒரே பிரச்சாரமாக இணைக்குங்கள்.",
    "Campaign Formats": "பிரச்சார வடிவங்கள்",
    "One platform.": "ஒரே தளம்.",
    "Multiple opportunities.": "பல வாய்ப்புகள்.",
    Website: "இணையதளம்",
    "Digital reach": "டிஜிட்டல் அணுகல்",
    Video: "காணொளி",
    "Visual impact": "காட்சித் தாக்கம்",
    "Live TV": "நேரலை தொலைக்காட்சி",
    "Live audiences": "நேரலை பார்வையாளர்கள்",
    Sponsored: "ஆதரவு",
    "Branded stories": "பிராண்டு கதைகள்",
    Recommended: "பரிந்துரைக்கப்பட்டது",
    "Integrated multi-channel campaign": "ஒருங்கிணைந்த பல-சேனல் பிரச்சாரம்",
    "Combine multiple formats for a stronger campaign presence.":
      "வலுவான பிரச்சார முன்னிலைக்காக பல வடிவங்களை இணைக்குங்கள்.",
    "English, Sinhala and Tamil": "ஆங்கிலம், சிங்களம் மற்றும் தமிழ்",
    "Digital Presence": "டிஜிட்டல் முன்னிலை",
    "Always-on online visibility": "எப்போதும் செயலிலுள்ள இணையக் காட்சித்திறன்",
    "Campaign Support": "பிரச்சார ஆதரவு",
    "From planning to delivery": "திட்டமிடலிலிருந்து வழங்கல் வரை",
    "Trusted Platform": "நம்பகமான தளம்",
    "One place for your audience": "உங்கள் பார்வையாளர்களுக்கான ஒரே இடம்",
    "How It Works": "இது எவ்வாறு செயல்படுகிறது",
    "From idea to campaign": "யோசனையிலிருந்து பிரச்சாரம் வரை",
    "Tell Us Your Goal": "உங்கள் இலக்கை எங்களிடம் கூறுங்கள்",
    "Share your campaign objective, audience and preferred timeline.":
      "உங்கள் பிரச்சார நோக்கம், பார்வையாளர்கள் மற்றும் விருப்பமான கால அட்டவணையை எங்களுடன் பகிருங்கள்.",
    "Choose a Solution": "ஒரு தீர்வைத் தேர்ந்தெடுங்கள்",
    "We recommend the most suitable advertising formats.":
      "மிகவும் பொருத்தமான விளம்பர வடிவங்களை நாங்கள் பரிந்துரைக்கிறோம்.",
    Launch: "தொடங்குங்கள்",
    "Your campaign goes live across the agreed TV SUPREME channels.":
      "ஒப்புக்கொள்ளப்பட்ட TV SUPREME சேனல்களில் உங்கள் பிரச்சாரம் நேரலையாகத் தொடங்கும்.",
    Measure: "அளவிடுங்கள்",
    "Review campaign performance and identify opportunities to improve.":
      "பிரச்சார செயல்திறனை மதிப்பாய்வு செய்து மேம்படுத்தும் வாய்ப்புகளை அடையாளம் காணுங்கள்.",
    "Let's Grow Your Brand Together": "உங்கள் பிராண்டை ஒன்றாக வளர்ப்போம்",
    "Ready to reach your audience?": "உங்கள் பார்வையாளர்களை அடையத் தயாரா?",
    "Talk to the TV SUPREME team about your next campaign and let's build the right solution for your brand.":
      "உங்கள் அடுத்த பிரச்சாரம் குறித்து TV SUPREME குழுவுடன் பேசுங்கள்; உங்கள் பிராண்டிற்கான சரியான தீர்வை ஒன்றாக உருவாக்குவோம்.",
    "Call Us": "எங்களை அழைக்கவும்",
    Popular: "பிரபலமானது",
  },
};

export default async function AdvertisePage({
  locale: localeOverride,
}: {
  locale?: string;
} = {}) {
  const locale = localeOverride ?? (await getLocale());
  const t = getStaticTranslator(locale, advertiseTranslations);
  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ec008c] via-[#8b1fc8] to-[#3c2372]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(255,255,255,0.2),transparent_30%)]" />

        <div className="absolute right-[-8%] top-[-30%] h-[500px] w-[500px] rounded-full border border-white/10" />

        <div className="absolute bottom-[-35%] left-[55%] h-[420px] w-[420px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[390px] items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
            {/* Hero text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Megaphone size={14} />
                {t("Advertising")}
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("Reach Millions")}
                <br />
                {t("With TV SUPREME")}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                {t(
                  "Connect your brand with an engaged audience through premium digital advertising, video, live TV and sponsored content opportunities.",
                )}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#advertising-solutions"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] shadow-lg transition hover:bg-slate-100"
                >
                  {t("Explore Solutions")}
                  <ChevronRight size={16} />
                </a>

                <a
                  href="mailto:business@tvsupreme.lk"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Mail size={16} />
                  {t("Contact Sales")}
                </a>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 rounded-[40px] bg-white/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                <div className="rounded-[22px] bg-[#111d4a] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                        TV SUPREME
                      </p>

                      <p className="mt-1 text-lg font-black text-white">
                        {t("Your brand, front and centre.")}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                      <Megaphone size={19} className="text-white" />
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#ec008c] to-[#5f19c8] p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                          {t("Campaign Reach")}
                        </p>

                        <p className="mt-2 text-3xl font-black text-white">
                          1.2M+
                        </p>

                        <p className="mt-1 text-xs text-white/70">
                          {t("Digital audience opportunities")}
                        </p>
                      </div>

                      <BarChart3 size={52} className="text-white/80" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <MiniMetric value="24/7" label={t("Digital")} />

                    <MiniMetric value="3" label={t("Languages")} />

                    <MiniMetric value="360°" label={t("Solutions")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY ADVERTISE
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              {t("Why Advertise With TV SUPREME?")}
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              {t("Put your message in front of the right audience")}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {t(
                "Build awareness, connect with audiences and create stronger digital campaigns through a trusted news platform.",
              )}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={<Users size={21} />}
              title={t("Reach More People")}
              text={t(
                "Connect with a broad audience across Sri Lanka and beyond.",
              )}
            />

            <BenefitCard
              icon={<Target size={21} />}
              title={t("Targeted Reach")}
              text={t(
                "Reach audiences around relevant topics, categories and content.",
              )}
            />

            <BenefitCard
              icon={<BarChart3 size={21} />}
              title={t("Measurable Results")}
              text={t(
                "Track campaign performance and make data-informed decisions.",
              )}
            />

            <BenefitCard
              icon={<Sparkles size={21} />}
              title={t("Premium Presence")}
              text={t(
                "Showcase your brand through a modern, professional digital environment.",
              )}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          ADVERTISING SOLUTIONS
      ========================================================== */}
      <section
        id="advertising-solutions"
        className="bg-[#f8f7fc] py-14 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              {t("Our Advertising Solutions")}
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              {t("Flexible solutions for every campaign")}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {t(
                "Choose the format that best matches your campaign goals, audience and budget.",
              )}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SolutionCard
              icon={<MonitorPlay size={22} />}
              title={t("Web Advertising")}
              description={t(
                "Promote your brand across high-visibility areas of the TV SUPREME website.",
              )}
              features={[
                t("Homepage placements"),
                t("Category placements"),
                t("Display campaigns"),
                t("Branded promotions"),
              ]}
            />

            <SolutionCard
              icon={<Video size={22} />}
              title={t("Video Advertising")}
              description={t(
                "Reach viewers through premium video placements and sponsored content.",
              )}
              features={[
                t("Pre-roll opportunities"),
                t("Video sponsorships"),
                t("Branded video"),
                t("Programme promotions"),
              ]}
              featured
              featuredLabel={t("Popular")}
            />

            <SolutionCard
              icon={<Radio size={22} />}
              title={t("Live TV Advertising")}
              description={t(
                "Connect with viewers around live broadcasts and special programming.",
              )}
              features={[
                t("Live stream placements"),
                t("Broadcast sponsorships"),
                t("Special events"),
                t("Campaign integrations"),
              ]}
            />

            <SolutionCard
              icon={<Newspaper size={22} />}
              title={t("Sponsored Content")}
              description={t(
                "Create meaningful branded storytelling with editorial-style digital experiences.",
              )}
              features={[
                t("Branded articles"),
                t("Special features"),
                t("Campaign stories"),
                t("Custom landing pages"),
              ]}
            />

            <SolutionCard
              icon={<Smartphone size={22} />}
              title={t("Mobile Campaigns")}
              description={t(
                "Keep your brand visible to audiences using smartphones and mobile devices.",
              )}
              features={[
                t("Mobile placements"),
                t("Responsive creatives"),
                t("Mobile-first campaigns"),
                t("Audience reach"),
              ]}
            />

            <SolutionCard
              icon={<ImageIcon size={22} />}
              title={t("Custom Campaigns")}
              description={t(
                "Build a campaign around your unique business objectives and creative ideas.",
              )}
              features={[
                t("Custom packages"),
                t("Creative support"),
                t("Multi-format campaigns"),
                t("Campaign consultation"),
              ]}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          FORMATS
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            {/* Left */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
                {t("Available Formats")}
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
                {t("Choose the format that fits your campaign")}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                {t(
                  "From simple display placements to integrated multi-format campaigns, we can create a solution around your objectives.",
                )}
              </p>

              <div className="mt-7 space-y-4">
                <FormatRow
                  number="01"
                  title={t("Display Advertising")}
                  description={t(
                    "High-visibility placements across relevant website sections.",
                  )}
                />

                <FormatRow
                  number="02"
                  title={t("Video Campaigns")}
                  description={t(
                    "Video placements and branded video opportunities.",
                  )}
                />

                <FormatRow
                  number="03"
                  title={t("Sponsored Stories")}
                  description={t(
                    "Story-led branded content designed around your message.",
                  )}
                />

                <FormatRow
                  number="04"
                  title={t("Integrated Campaigns")}
                  description={t(
                    "Combine web, video and live TV opportunities into one campaign.",
                  )}
                />
              </div>
            </div>

            {/* Right visual */}
            <div>
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-[22px] bg-[#111d4a] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                        {t("Campaign Formats")}
                      </p>

                      <h3 className="mt-1 text-xl font-black text-white">
                        {t("One platform.")}
                        <br />
                        {t("Multiple opportunities.")}
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                      <Globe2 size={19} className="text-white" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <VisualTile
                      icon={<MonitorPlay size={18} />}
                      title={t("Website")}
                      text={t("Digital reach")}
                    />

                    <VisualTile
                      icon={<Video size={18} />}
                      title={t("Video")}
                      text={t("Visual impact")}
                    />

                    <VisualTile
                      icon={<Radio size={18} />}
                      title={t("Live TV")}
                      text={t("Live audiences")}
                    />

                    <VisualTile
                      icon={<Sparkles size={18} />}
                      title={t("Sponsored")}
                      text={t("Branded stories")}
                    />
                  </div>

                  <div className="mt-4 rounded-xl bg-gradient-to-r from-[#ec008c] to-[#5f19c8] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/70">
                      {t("Recommended")}
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {t("Integrated multi-channel campaign")}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/70">
                      {t(
                        "Combine multiple formats for a stronger campaign presence.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CAMPAIGN BENEFITS
      ========================================================== */}
      <section className="bg-[#f8f7fc] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <CampaignStat
              value="3"
              title={t("Languages")}
              text={t("English, Sinhala and Tamil")}
            />

            <CampaignStat
              value="24/7"
              title={t("Digital Presence")}
              text={t("Always-on online visibility")}
            />

            <CampaignStat
              value="360°"
              title={t("Campaign Support")}
              text={t("From planning to delivery")}
            />

            <CampaignStat
              value="1"
              title={t("Trusted Platform")}
              text={t("One place for your audience")}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              {t("How It Works")}
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111d4a] sm:text-4xl">
              {t("From idea to campaign")}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <StepCard
              number="01"
              title={t("Tell Us Your Goal")}
              text={t(
                "Share your campaign objective, audience and preferred timeline.",
              )}
            />

            <StepCard
              number="02"
              title={t("Choose a Solution")}
              text={t("We recommend the most suitable advertising formats.")}
            />

            <StepCard
              number="03"
              title={t("Launch")}
              text={t(
                "Your campaign goes live across the agreed TV SUPREME channels.",
              )}
            />

            <StepCard
              number="04"
              title={t("Measure")}
              text={t(
                "Review campaign performance and identify opportunities to improve.",
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
          <div className="px-6 py-11 sm:px-10 sm:py-14 lg:px-14">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  {t("Let's Grow Your Brand Together")}
                </p>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  {t("Ready to reach your audience?")}
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  {t(
                    "Talk to the TV SUPREME team about your next campaign and let's build the right solution for your brand.",
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:business@tvsupreme.lk"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3c2372] transition hover:bg-slate-100"
                >
                  <Mail size={16} />
                  {t("Contact Sales")}
                </a>

                <a
                  href="tel:+94110000000"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Phone size={16} />
                  {t("Call Us")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   MINI METRIC
================================================================ */

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-lg font-black text-white">{value}</p>

      <p className="mt-1 text-[10px] text-white/50">{label}</p>
    </div>
  );
}

/* ===============================================================
   BENEFIT CARD
================================================================ */

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#111d4a]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

/* ===============================================================
   SOLUTION CARD
================================================================ */

function SolutionCard({
  icon,
  title,
  description,
  features,
  featured = false,
  featuredLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  featured?: boolean;
  featuredLabel?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        featured
          ? "border-pink-200 bg-gradient-to-b from-pink-50/60 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      {featured && (
        <div className="absolute right-4 top-4 rounded-full bg-pink-100 px-2.5 py-1 text-[10px] font-bold text-pink-600">
          {featuredLabel}
        </div>
      )}

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#111d4a]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-5 space-y-2.5">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-pink-600" />

            <span className="text-xs leading-5 text-slate-600">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===============================================================
   FORMAT ROW
================================================================ */

function FormatRow({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-xs font-black text-pink-600">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#111d4a]">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* ===============================================================
   VISUAL TILE
================================================================ */

function VisualTile({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-pink-300">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-white">{title}</p>

      <p className="mt-1 text-xs text-white/50">{text}</p>
    </div>
  );
}

/* ===============================================================
   CAMPAIGN STAT
================================================================ */

function CampaignStat({
  value,
  title,
  text,
}: {
  value: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p className="text-3xl font-black text-pink-600">{value}</p>

      <h3 className="mt-2 text-sm font-bold text-[#111d4a]">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
    </div>
  );
}

/* ===============================================================
   STEP CARD
================================================================ */

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 text-xs font-black text-white">
        {number}
      </div>

      <h3 className="mt-4 text-base font-bold text-[#111d4a]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
