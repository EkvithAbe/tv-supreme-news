import { Link } from "@/i18n/navigation";
import {
  getStaticTranslator,
  type StaticPageTranslations,
} from "@/lib/static-page-translations";
import { getLocale } from "next-intl/server";
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

const privacyTranslations = {
  si: {
    "Legal Information": "නීතිමය තොරතුරු",
    "Privacy Policy": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
    "Learn how TV SUPREME collects, uses, protects and manages information when you use our website and services.":
      "අපගේ වෙබ් අඩවිය සහ සේවාවන් භාවිත කරන විට TV SUPREME තොරතුරු රැස් කරන්නේ, භාවිත කරන්නේ, ආරක්ෂා කරන්නේ සහ කළමනාකරණය කරන්නේ කෙසේදැයි දැනගන්න.",
    "Last updated: 15 September 2026": "අවසන් යාවත්කාලීන කිරීම: 15 සැප්තැම්බර් 2026",
    "On this page": "මෙම පිටුවේ",
    "Your privacy matters": "ඔබගේ පෞද්ගලිකත්වය වැදගත්ය",
    "We are committed to handling information responsibly.":
      "තොරතුරු වගකීමෙන් හැසිරවීමට අපි කැපවී සිටිමු.",
    "Introduction": "හැඳින්වීම",
    "Information We Collect": "අප රැස් කරන තොරතුරු",
    "How We Use Information": "අපි තොරතුරු භාවිත කරන ආකාරය",
    "Cookies & Tracking": "කුකීස් සහ ලුහුබැඳීම",
    "Data Security": "දත්ත ආරක්ෂාව",
    "Information Sharing": "තොරතුරු හුවමාරුව",
    "Your Rights": "ඔබගේ අයිතිවාසිකම්",
    "Children's Privacy": "ළමුන්ගේ පෞද්ගලිකත්වය",
    "Changes to This Policy": "මෙම ප්‍රතිපත්තියට වෙනස්කම්",
    "Contact Us": "අප අමතන්න",
    "TV SUPREME respects your privacy and is committed to protecting information you provide when using our website and digital services.":
      "අපගේ වෙබ් අඩවිය සහ ඩිජිටල් සේවාවන් භාවිත කරන විට ඔබ සපයන තොරතුරු ආරක්ෂා කිරීමට TV SUPREME ඔබගේ පෞද්ගලිකත්වයට ගරු කරන අතර කැපවී සිටී.",
    "This Privacy Policy explains the types of information that may be collected, how that information may be used and the choices available to you.":
      "රැස් කළ හැකි තොරතුරු වර්ග, එම තොරතුරු භාවිත කළ හැකි ආකාරය සහ ඔබට ලබාගත හැකි තේරීම් මෙම පෞද්ගලිකත්ව ප්‍රතිපත්තියෙන් විස්තර කෙරේ.",
    "Depending on how you interact with TV SUPREME, we may collect information such as:":
      "ඔබ TV SUPREME සමඟ සම්බන්ධ වන ආකාරය අනුව, පහත වැනි තොරතුරු අප රැස් කළ හැකියි:",
    "Name and contact details you provide through forms or enquiries.":
      "පෝරම හෝ විමසීම් මගින් ඔබ සපයන නම සහ සම්බන්ධතා තොරතුරු.",
    "Information submitted when contacting our newsroom or business team.":
      "අපගේ පුවත් කාමරය හෝ ව්‍යාපාරික කණ්ඩායම අමතන විට ඉදිරිපත් කරන තොරතුරු.",
    "Technical information such as browser type, device information and general usage data.":
      "බ්‍රවුසර වර්ගය, උපාංග තොරතුරු සහ සාමාන්‍ය භාවිත දත්ත වැනි තාක්ෂණික තොරතුරු.",
    "Information relating to your interactions with our website and services.":
      "අපගේ වෙබ් අඩවිය සහ සේවාවන් සමඟ ඔබගේ අන්තර්ක්‍රියා සම්බන්ධ තොරතුරු.",
    "Information may be used to operate, maintain and improve our website and services.":
      "අපගේ වෙබ් අඩවිය සහ සේවාවන් ක්‍රියාත්මක කිරීමට, පවත්වාගෙන යාමට සහ වැඩිදියුණු කිරීමට තොරතුරු භාවිත කළ හැකියි.",
    "Respond to enquiries, feedback and requests.":
      "විමසීම්, ප්‍රතිචාර සහ ඉල්ලීම්වලට ප්‍රතිචාර දැක්වීමට.",
    "Provide and improve website functionality and content.":
      "වෙබ් අඩවියේ ක්‍රියාකාරීත්වය සහ අන්තර්ගතය සැපයීමට හා වැඩිදියුණු කිරීමට.",
    "Understand how visitors use our website.":
      "අමුත්තන් අපගේ වෙබ් අඩවිය භාවිත කරන ආකාරය අවබෝධ කර ගැනීමට.",
    "Maintain website security and prevent misuse.":
      "වෙබ් අඩවියේ ආරක්ෂාව පවත්වාගෙන යාමට සහ අනිසි භාවිතය වැළැක්වීමට.",
    "Communicate important service or administrative information.":
      "වැදගත් සේවා හෝ පරිපාලන තොරතුරු දැනුම් දීමට.",
    "TV SUPREME may use cookies and similar technologies to support website functionality, remember preferences and understand website usage.":
      "වෙබ් අඩවියේ ක්‍රියාකාරීත්වයට සහාය වීමට, ඔබගේ මනාප මතක තබා ගැනීමට සහ වෙබ් අඩවි භාවිතය අවබෝධ කර ගැනීමට TV SUPREME කුකීස් සහ සමාන තාක්ෂණයන් භාවිත කළ හැකියි.",
    "Your browser may provide options for managing or disabling cookies. Some website features may not work as intended when certain cookies are disabled.":
      "කුකීස් කළමනාකරණය කිරීමට හෝ අක්‍රිය කිරීමට ඔබගේ බ්‍රවුසරයෙන් විකල්ප ලබා දිය හැකියි. ඇතැම් කුකීස් අක්‍රිය කළ විට වෙබ් අඩවියේ සමහර විශේෂාංග අපේක්ෂිත පරිදි ක්‍රියා නොකළ හැකියි.",
    "We take reasonable technical and organisational measures to protect information from unauthorized access, misuse, alteration or disclosure.":
      "අනවසර ප්‍රවේශය, අනිසි භාවිතය, වෙනස් කිරීම හෝ හෙළිදරව් කිරීමෙන් තොරතුරු ආරක්ෂා කිරීමට අපි සාධාරණ තාක්ෂණික සහ සංවිධානමය පියවර ගනිමු.",
    "Security reminder": "ආරක්ෂක මතක් කිරීම",
    "No internet-based system can be guaranteed to be completely secure. We continue to review and improve our security practices.":
      "අන්තර්ජාලය මත පදනම් වූ කිසිදු පද්ධතියක් සම්පූර්ණයෙන්ම ආරක්ෂිත බවට සහතික කළ නොහැකියි. අපගේ ආරක්ෂක ක්‍රමවේද නිරන්තරයෙන් සමාලෝචනය කර වැඩිදියුණු කරමින් සිටිමු.",
    "TV SUPREME does not intend to sell personal information. Information may be shared where reasonably necessary to operate our services, comply with legal obligations or protect our rights and users.":
      "පුද්ගලික තොරතුරු විකිණීම TV SUPREME හි අරමුණ නොවේ. අපගේ සේවාවන් ක්‍රියාත්මක කිරීමට, නීතිමය බැඳීම්වලට අනුකූල වීමට හෝ අපගේ අයිතිවාසිකම් සහ පරිශීලකයන් ආරක්ෂා කිරීමට සාධාරණ ලෙස අවශ්‍ය වන අවස්ථාවල තොරතුරු හුවමාරු කළ හැකියි.",
    "Service providers supporting website operations.":
      "වෙබ් අඩවි ක්‍රියාකාරිත්වයට සහාය වන සේවා සපයන්නන් සමඟ.",
    "Authorities or other parties where legally required.":
      "නීතියෙන් අවශ්‍ය වන විට බලධාරීන් හෝ වෙනත් පාර්ශ්ව සමඟ.",
    "Professional advisers where reasonably necessary.":
      "සාධාරණ ලෙස අවශ්‍ය වන විට වෘත්තීය උපදේශකයන් සමඟ.",
    "Depending on applicable law, you may have rights regarding information we hold about you, including requests to access, correct or delete certain information.":
      "අදාළ නීතිය අනුව, ඔබ සම්බන්ධයෙන් අප සතුව ඇති තොරතුරු වෙත ප්‍රවේශ වීම, ඇතැම් තොරතුරු නිවැරදි කිරීම හෝ මකා දැමීම ඉල්ලා සිටීම ඇතුළු අයිතිවාසිකම් ඔබට තිබිය හැකියි.",
    "To make a privacy-related enquiry, please contact our team using the contact details provided below.":
      "පෞද්ගලිකත්වයට අදාළ විමසීමක් සඳහා, පහත දැක්වෙන සම්බන්ධතා තොරතුරු භාවිත කර අපගේ කණ්ඩායම අමතන්න.",
    "TV SUPREME is intended for a general audience. We do not knowingly seek to collect personal information from children through our services.":
      "TV SUPREME සාමාන්‍ය ප්‍රේක්ෂකයන් සඳහා නිර්මාණය කර ඇත. අපගේ සේවාවන් හරහා ළමුන්ගෙන් පුද්ගලික තොරතුරු දැනුවත්ව රැස් කිරීමට අපි උත්සාහ නොකරමු.",
    "We may update this Privacy Policy from time to time to reflect changes to our services, legal requirements or privacy practices.":
      "අපගේ සේවාවන්, නීතිමය අවශ්‍යතා හෝ පෞද්ගලිකත්ව ක්‍රමවේදවල වෙනස්කම් පිළිබිඹු කිරීම සඳහා මෙම පෞද්ගලිකත්ව ප්‍රතිපත්තිය වරින් වර යාවත්කාලීන කළ හැකියි.",
    "Updated versions will be published on this page together with the relevant revision date.":
      "යාවත්කාලීන කළ අනුවාද අදාළ සංශෝධන දිනය සමඟ මෙම පිටුවේ පළ කරනු ලැබේ.",
    "If you have questions, concerns or requests relating to this Privacy Policy, please contact TV SUPREME.":
      "මෙම පෞද්ගලිකත්ව ප්‍රතිපත්තිය සම්බන්ධයෙන් ඔබට ප්‍රශ්න, ගැටලු හෝ ඉල්ලීම් තිබේ නම්, කරුණාකර TV SUPREME අමතන්න.",
    "Email": "විද්‍යුත් තැපෑල",
    "Website": "වෙබ් අඩවිය",
    "Review our Terms of Use": "අපගේ භාවිත නියමයන් සමාලෝචනය කරන්න",
    "Learn about the terms and conditions that apply when using TV SUPREME.":
      "TV SUPREME භාවිත කරන විට අදාළ වන නියමයන් සහ කොන්දේසි ගැන දැනගන්න.",
    "Terms of Use": "භාවිත නියමයන්",
  },
  ta: {
    "Legal Information": "சட்டத் தகவல்",
    "Privacy Policy": "தனியுரிமைக் கொள்கை",
    "Learn how TV SUPREME collects, uses, protects and manages information when you use our website and services.":
      "எங்கள் இணையதளத்தையும் சேவைகளையும் நீங்கள் பயன்படுத்தும்போது TV SUPREME தகவல்களை எவ்வாறு சேகரிக்கிறது, பயன்படுத்துகிறது, பாதுகாக்கிறது மற்றும் நிர்வகிக்கிறது என்பதை அறிந்துகொள்ளுங்கள்.",
    "Last updated: 15 September 2026": "கடைசியாகப் புதுப்பிக்கப்பட்டது: 15 செப்டம்பர் 2026",
    "On this page": "இந்தப் பக்கத்தில்",
    "Your privacy matters": "உங்கள் தனியுரிமை முக்கியமானது",
    "We are committed to handling information responsibly.":
      "தகவல்களைப் பொறுப்புடன் கையாளுவதில் நாங்கள் உறுதியாக இருக்கிறோம்.",
    "Introduction": "அறிமுகம்",
    "Information We Collect": "நாங்கள் சேகரிக்கும் தகவல்கள்",
    "How We Use Information": "தகவலை எவ்வாறு பயன்படுத்துகிறோம்",
    "Cookies & Tracking": "குக்கீகள் மற்றும் கண்காணிப்பு",
    "Data Security": "தரவுப் பாதுகாப்பு",
    "Information Sharing": "தகவல் பகிர்வு",
    "Your Rights": "உங்கள் உரிமைகள்",
    "Children's Privacy": "குழந்தைகளின் தனியுரிமை",
    "Changes to This Policy": "இந்தக் கொள்கையில் மாற்றங்கள்",
    "Contact Us": "எங்களைத் தொடர்புகொள்ளுங்கள்",
    "TV SUPREME respects your privacy and is committed to protecting information you provide when using our website and digital services.":
      "எங்கள் இணையதளத்தையும் டிஜிட்டல் சேவைகளையும் பயன்படுத்தும்போது நீங்கள் வழங்கும் தகவலின் தனியுரிமையை TV SUPREME மதிக்கிறது; அதை பாதுகாப்பதில் நாங்கள் உறுதியாக இருக்கிறோம்.",
    "This Privacy Policy explains the types of information that may be collected, how that information may be used and the choices available to you.":
      "சேகரிக்கப்படக்கூடிய தகவல் வகைகள், அந்தத் தகவல் எவ்வாறு பயன்படுத்தப்படலாம், உங்களுக்கு கிடைக்கும் தேர்வுகள் ஆகியவற்றை இந்தத் தனியுரிமைக் கொள்கை விளக்குகிறது.",
    "Depending on how you interact with TV SUPREME, we may collect information such as:":
      "நீங்கள் TV SUPREME-உடன் தொடர்புகொள்ளும் விதத்தைப் பொறுத்து, பின்வரும் தகவல்களை நாங்கள் சேகரிக்கலாம்:",
    "Name and contact details you provide through forms or enquiries.":
      "படிவங்கள் அல்லது விசாரணைகள் மூலம் நீங்கள் வழங்கும் பெயர் மற்றும் தொடர்பு விவரங்கள்.",
    "Information submitted when contacting our newsroom or business team.":
      "எங்கள் செய்தியகம் அல்லது வணிக அணியைத் தொடர்புகொள்ளும்போது சமர்ப்பிக்கப்படும் தகவல்கள்.",
    "Technical information such as browser type, device information and general usage data.":
      "உலாவி வகை, சாதனத் தகவல் மற்றும் பொதுவான பயன்பாட்டுத் தரவு போன்ற தொழில்நுட்பத் தகவல்கள்.",
    "Information relating to your interactions with our website and services.":
      "எங்கள் இணையதளம் மற்றும் சேவைகளுடனான உங்கள் தொடர்புகளைச் சார்ந்த தகவல்கள்.",
    "Information may be used to operate, maintain and improve our website and services.":
      "எங்கள் இணையதளம் மற்றும் சேவைகளை இயக்க, பராமரிக்க மற்றும் மேம்படுத்த தகவல்கள் பயன்படுத்தப்படலாம்.",
    "Respond to enquiries, feedback and requests.":
      "விசாரணைகள், கருத்துகள் மற்றும் கோரிக்கைகளுக்குப் பதிலளிக்க.",
    "Provide and improve website functionality and content.":
      "இணையதளத்தின் செயல்பாடுகளையும் உள்ளடக்கத்தையும் வழங்கி மேம்படுத்த.",
    "Understand how visitors use our website.":
      "பார்வையாளர்கள் எங்கள் இணையதளத்தை எவ்வாறு பயன்படுத்துகிறார்கள் என்பதைப் புரிந்துகொள்ள.",
    "Maintain website security and prevent misuse.":
      "இணையதளப் பாதுகாப்பைப் பேணவும் தவறான பயன்பாட்டைத் தடுக்கவும்.",
    "Communicate important service or administrative information.":
      "முக்கியமான சேவை அல்லது நிர்வாகத் தகவல்களைத் தெரிவிக்க.",
    "TV SUPREME may use cookies and similar technologies to support website functionality, remember preferences and understand website usage.":
      "இணையதளச் செயல்பாடுகளுக்கு ஆதரவு வழங்கவும், விருப்பங்களை நினைவில் வைத்திருக்கவும், இணையதளப் பயன்பாட்டைப் புரிந்துகொள்ளவும் TV SUPREME குக்கீகளையும் அதற்கு ஒத்த தொழில்நுட்பங்களையும் பயன்படுத்தலாம்.",
    "Your browser may provide options for managing or disabling cookies. Some website features may not work as intended when certain cookies are disabled.":
      "குக்கீகளை நிர்வகிக்க அல்லது முடக்க உங்கள் உலாவி விருப்பங்களை வழங்கலாம். சில குக்கீகள் முடக்கப்பட்டால், இணையதளத்தின் சில அம்சங்கள் எதிர்பார்த்தபடி செயல்படாமல் போகலாம்.",
    "We take reasonable technical and organisational measures to protect information from unauthorized access, misuse, alteration or disclosure.":
      "அங்கீகரிக்கப்படாத அணுகல், தவறான பயன்பாடு, மாற்றம் அல்லது வெளிப்படுத்தலிலிருந்து தகவல்களைப் பாதுகாக்க நாங்கள் நியாயமான தொழில்நுட்ப மற்றும் நிறுவனரீதியான நடவடிக்கைகளை எடுக்கிறோம்.",
    "Security reminder": "பாதுகாப்பு நினைவூட்டல்",
    "No internet-based system can be guaranteed to be completely secure. We continue to review and improve our security practices.":
      "இணையத்தை அடிப்படையாகக் கொண்ட எந்த அமைப்பும் முழுமையாகப் பாதுகாப்பானது என உத்தரவாதம் அளிக்க முடியாது. எங்கள் பாதுகாப்பு நடைமுறைகளை நாங்கள் தொடர்ந்து மறுஆய்வு செய்து மேம்படுத்துகிறோம்.",
    "TV SUPREME does not intend to sell personal information. Information may be shared where reasonably necessary to operate our services, comply with legal obligations or protect our rights and users.":
      "தனிப்பட்ட தகவல்களை விற்பனை செய்வது TV SUPREME-ன் நோக்கமல்ல. எங்கள் சேவைகளை இயக்க, சட்டப்பூர்வக் கடமைகளைப் பின்பற்ற அல்லது எங்கள் உரிமைகள் மற்றும் பயனர்களைப் பாதுகாக்க நியாயமாகத் தேவையான இடங்களில் தகவல்கள் பகிரப்படலாம்.",
    "Service providers supporting website operations.":
      "இணையதளச் செயல்பாடுகளுக்கு ஆதரவளிக்கும் சேவை வழங்குநர்களுடன்.",
    "Authorities or other parties where legally required.":
      "சட்டப்படி தேவைப்படும் இடங்களில் அதிகாரிகள் அல்லது பிற தரப்புகளுடன்.",
    "Professional advisers where reasonably necessary.":
      "நியாயமாகத் தேவையான இடங்களில் தொழில்முறை ஆலோசகர்களுடன்.",
    "Depending on applicable law, you may have rights regarding information we hold about you, including requests to access, correct or delete certain information.":
      "பொருந்தும் சட்டத்தின் அடிப்படையில், உங்களைப் பற்றிய எங்களிடம் உள்ள தகவல்களை அணுக, குறிப்பிட்ட தகவல்களைத் திருத்த அல்லது நீக்கக் கோருவதற்கான உரிமைகள் உங்களுக்கு இருக்கலாம்.",
    "To make a privacy-related enquiry, please contact our team using the contact details provided below.":
      "தனியுரிமை தொடர்பான விசாரணைக்கு, கீழே வழங்கப்பட்டுள்ள தொடர்பு விவரங்களைப் பயன்படுத்தி எங்கள் அணியைத் தொடர்புகொள்ளுங்கள்.",
    "TV SUPREME is intended for a general audience. We do not knowingly seek to collect personal information from children through our services.":
      "TV SUPREME பொதுப் பார்வையாளர்களுக்காக உருவாக்கப்பட்டுள்ளது. எங்கள் சேவைகள் மூலம் குழந்தைகளிடமிருந்து தனிப்பட்ட தகவல்களை அறிந்தே சேகரிக்க நாங்கள் முயற்சிப்பதில்லை.",
    "We may update this Privacy Policy from time to time to reflect changes to our services, legal requirements or privacy practices.":
      "எங்கள் சேவைகள், சட்டத் தேவைகள் அல்லது தனியுரிமை நடைமுறைகளில் ஏற்படும் மாற்றங்களைப் பிரதிபலிக்க, இந்தத் தனியுரிமைக் கொள்கையை அவ்வப்போது புதுப்பிக்கலாம்.",
    "Updated versions will be published on this page together with the relevant revision date.":
      "புதுப்பிக்கப்பட்ட பதிப்புகள் தொடர்புடைய திருத்தத் தேதியுடன் இந்தப் பக்கத்தில் வெளியிடப்படும்.",
    "If you have questions, concerns or requests relating to this Privacy Policy, please contact TV SUPREME.":
      "இந்தத் தனியுரிமைக் கொள்கை தொடர்பாக உங்களுக்கு கேள்விகள், கவலைகள் அல்லது கோரிக்கைகள் இருந்தால், TV SUPREME-ஐத் தொடர்புகொள்ளுங்கள்.",
    "Email": "மின்னஞ்சல்",
    "Website": "இணையதளம்",
    "Review our Terms of Use": "எங்கள் பயன்பாட்டு விதிமுறைகளைப் பார்வையிடுங்கள்",
    "Learn about the terms and conditions that apply when using TV SUPREME.":
      "TV SUPREME-ஐப் பயன்படுத்தும்போது பொருந்தும் விதிமுறைகள் மற்றும் நிபந்தனைகளை அறிந்துகொள்ளுங்கள்.",
    "Terms of Use": "பயன்பாட்டு விதிமுறைகள்",
  },
} satisfies StaticPageTranslations;

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

export default async function PrivacyPolicyPage({
  locale: localeOverride,
}: {
  locale?: string;
} = {}) {
  const locale = localeOverride ?? await getLocale();
  const t = getStaticTranslator(locale, privacyTranslations);
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
                {t("Legal Information")}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("Privacy Policy")}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                {t(
                  "Learn how TV SUPREME collects, uses, protects and manages information when you use our website and services.",
                )}
              </p>

              <p className="mt-4 text-xs font-medium text-white/60">
                {t("Last updated: 15 September 2026")}
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
                    {t("On this page")}
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-[#111d4a]">
                    {t("Privacy Policy")}
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
                        {t(section.title)}
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
                    {t("Your privacy matters")}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/60">
                    {t(
                      "We are committed to handling information responsibly.",
                    )}
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
                title={t("Introduction")}
              >
                <p>
                  {t(
                    "TV SUPREME respects your privacy and is committed to protecting information you provide when using our website and digital services.",
                  )}
                </p>

                <p>
                  {t(
                    "This Privacy Policy explains the types of information that may be collected, how that information may be used and the choices available to you.",
                  )}
                </p>
              </PolicySection>

              {/* Information */}
              <PolicySection
                id="information"
                number="02"
                title={t("Information We Collect")}
              >
                <p>
                  {t(
                    "Depending on how you interact with TV SUPREME, we may collect information such as:",
                  )}
                </p>

                <PolicyList
                  items={[
                    t(
                      "Name and contact details you provide through forms or enquiries.",
                    ),
                    t(
                      "Information submitted when contacting our newsroom or business team.",
                    ),
                    t(
                      "Technical information such as browser type, device information and general usage data.",
                    ),
                    t(
                      "Information relating to your interactions with our website and services.",
                    ),
                  ]}
                />
              </PolicySection>

              {/* Use */}
              <PolicySection
                id="use"
                number="03"
                title={t("How We Use Information")}
              >
                <p>
                  {t(
                    "Information may be used to operate, maintain and improve our website and services.",
                  )}
                </p>

                <PolicyList
                  items={[
                    t("Respond to enquiries, feedback and requests."),
                    t(
                      "Provide and improve website functionality and content.",
                    ),
                    t("Understand how visitors use our website."),
                    t(
                      "Maintain website security and prevent misuse.",
                    ),
                    t(
                      "Communicate important service or administrative information.",
                    ),
                  ]}
                />
              </PolicySection>

              {/* Cookies */}
              <PolicySection
                id="cookies"
                number="04"
                title={t("Cookies & Tracking")}
                icon={<Cookie size={18} />}
              >
                <p>
                  {t(
                    "TV SUPREME may use cookies and similar technologies to support website functionality, remember preferences and understand website usage.",
                  )}
                </p>

                <p>
                  {t(
                    "Your browser may provide options for managing or disabling cookies. Some website features may not work as intended when certain cookies are disabled.",
                  )}
                </p>
              </PolicySection>

              {/* Security */}
              <PolicySection
                id="security"
                number="05"
                title={t("Data Security")}
                icon={<Lock size={18} />}
              >
                <p>
                  {t(
                    "We take reasonable technical and organisational measures to protect information from unauthorized access, misuse, alteration or disclosure.",
                  )}
                </p>

                <div className="mt-5 rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-pink-600"
                    />

                    <div>
                      <p className="text-sm font-bold text-[#111d4a]">
                        {t("Security reminder")}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {t(
                          "No internet-based system can be guaranteed to be completely secure. We continue to review and improve our security practices.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </PolicySection>

              {/* Sharing */}
              <PolicySection
                id="sharing"
                number="06"
                title={t("Information Sharing")}
              >
                <p>
                  {t(
                    "TV SUPREME does not intend to sell personal information. Information may be shared where reasonably necessary to operate our services, comply with legal obligations or protect our rights and users.",
                  )}
                </p>

                <PolicyList
                  items={[
                    t("Service providers supporting website operations."),
                    t(
                      "Authorities or other parties where legally required.",
                    ),
                    t("Professional advisers where reasonably necessary."),
                  ]}
                />
              </PolicySection>

              {/* Rights */}
              <PolicySection
                id="rights"
                number="07"
                title={t("Your Rights")}
                icon={<UserCheck size={18} />}
              >
                <p>
                  {t(
                    "Depending on applicable law, you may have rights regarding information we hold about you, including requests to access, correct or delete certain information.",
                  )}
                </p>

                <p>
                  {t(
                    "To make a privacy-related enquiry, please contact our team using the contact details provided below.",
                  )}
                </p>
              </PolicySection>

              {/* Children */}
              <PolicySection
                id="children"
                number="08"
                title={t("Children's Privacy")}
              >
                <p>
                  {t(
                    "TV SUPREME is intended for a general audience. We do not knowingly seek to collect personal information from children through our services.",
                  )}
                </p>
              </PolicySection>

              {/* Changes */}
              <PolicySection
                id="changes"
                number="09"
                title={t("Changes to This Policy")}
              >
                <p>
                  {t(
                    "We may update this Privacy Policy from time to time to reflect changes to our services, legal requirements or privacy practices.",
                  )}
                </p>

                <p>
                  {t(
                    "Updated versions will be published on this page together with the relevant revision date.",
                  )}
                </p>
              </PolicySection>

              {/* Contact */}
              <PolicySection
                id="contact"
                number="10"
                title={t("Contact Us")}
                icon={<Mail size={18} />}
              >
                <p>
                  {t(
                    "If you have questions, concerns or requests relating to this Privacy Policy, please contact TV SUPREME.",
                  )}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ContactCard
                    icon={<Mail size={17} />}
                    title={t("Email")}
                    value="info@tvsupreme.lk"
                  />

                  <ContactCard
                    icon={<FileText size={17} />}
                    title={t("Website")}
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
                  {t("Legal Information")}
                </p>

                <h2 className="mt-2 text-xl font-black text-[#111d4a]">
                  {t("Review our Terms of Use")}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t(
                    "Learn about the terms and conditions that apply when using TV SUPREME.",
                  )}
                </p>
              </div>

              <Link
                href="/legal/terms-of-use"
                locale={locale}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                {t("Terms of Use")}
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
