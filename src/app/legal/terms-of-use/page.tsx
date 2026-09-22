import { Link } from "@/i18n/navigation";
import {
  getStaticTranslator,
  type StaticPageTranslations,
} from "@/lib/static-page-translations";
import { getLocale } from "next-intl/server";
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

const termsTranslations = {
  si: {
    "Legal Information": "නීතිමය තොරතුරු",
    "Terms of Use": "භාවිත නියමයන්",
    "Please read these terms carefully before using the TV SUPREME website and digital services.":
      "TV SUPREME වෙබ් අඩවිය සහ ඩිජිටල් සේවාවන් භාවිත කිරීමට පෙර කරුණාකර මෙම නියමයන් හොඳින් කියවන්න.",
    "Last updated: 15 September 2026": "අවසන් යාවත්කාලීන කිරීම: 15 සැප්තැම්බර් 2026",
    "On this page": "මෙම පිටුවේ",
    "Use of this website": "මෙම වෙබ් අඩවිය භාවිත කිරීම",
    "By using TV SUPREME, you agree to these terms.":
      "TV SUPREME භාවිත කිරීමෙන්, ඔබ මෙම නියමයන්ට එකඟ වෙයි.",
    "Introduction": "හැඳින්වීම",
    "Using This Website": "මෙම වෙබ් අඩවිය භාවිත කිරීම",
    "Content & Information": "අන්තර්ගතය සහ තොරතුරු",
    "Intellectual Property": "බුද්ධිමය දේපළ",
    "Acceptable Use": "පිළිගත හැකි භාවිතය",
    "External Links": "බාහිර සබැඳි",
    "Disclaimer": "වගකීම් ප්‍රතික්ෂේපය",
    "Limitation of Liability": "වගකීම් සීමා කිරීම",
    "Changes to These Terms": "මෙම නියමයන්ට වෙනස්කම්",
    "Contact Us": "අප අමතන්න",
    "These Terms of Use explain the conditions that apply when you access or use the TV SUPREME website and related digital services.":
      "ඔබ TV SUPREME වෙබ් අඩවිය සහ ඒ ආශ්‍රිත ඩිජිටල් සේවාවන් වෙත ප්‍රවේශ වන හෝ ඒවා භාවිත කරන විට අදාළ වන කොන්දේසි මෙම භාවිත නියමයන් මඟින් විස්තර කෙරේ.",
    "By accessing or using the website, you acknowledge that you have read, understood and agreed to these Terms of Use.":
      "වෙබ් අඩවිය වෙත ප්‍රවේශ වීමෙන් හෝ එය භාවිත කිරීමෙන්, ඔබ මෙම භාවිත නියමයන් කියවා, අවබෝධ කරගෙන, ඒවාට එකඟ වූ බව පිළිගනී.",
    "You may use the TV SUPREME website for lawful purposes and in accordance with these terms.":
      "ඔබට TV SUPREME වෙබ් අඩවිය නීත්‍යානුකූල අරමුණු සඳහා සහ මෙම නියමයන්ට අනුකූලව භාවිත කළ හැකියි.",
    "You must use the website responsibly and respectfully.":
      "ඔබ වෙබ් අඩවිය වගකීමෙන් සහ ගෞරවයෙන් භාවිත කළ යුතුය.",
    "You must not use the website for unlawful or fraudulent purposes.":
      "ඔබ වෙබ් අඩවිය නීතිවිරෝධී හෝ වංචනික අරමුණු සඳහා භාවිත නොකළ යුතුය.",
    "You must not attempt to interfere with the operation or security of the website.":
      "වෙබ් අඩවියේ ක්‍රියාකාරීත්වයට හෝ ආරක්ෂාවට බාධා කිරීමට ඔබ උත්සාහ නොකළ යුතුය.",
    "You must not knowingly introduce malicious software or harmful code.":
      "දැනුවත්ව හානිකර මෘදුකාංග හෝ අහිතකර කේත හඳුන්වා නොදිය යුතුය.",
    "TV SUPREME provides news, articles, videos and other information through the website.":
      "TV SUPREME වෙබ් අඩවිය හරහා පුවත්, ලිපි, වීඩියෝ සහ වෙනත් තොරතුරු සපයයි.",
    "We aim to provide useful and timely information, but content may change, be updated or be removed without prior notice.":
      "ප්‍රයෝජනවත් සහ කාලෝචිත තොරතුරු සැපයීම අපගේ අරමුණ වුවද, පූර්ව දැනුම්දීමකින් තොරව අන්තර්ගතය වෙනස් කිරීමට, යාවත්කාලීන කිරීමට හෝ ඉවත් කිරීමට හැකියි.",
    "News and other information may reflect developments that change over time.":
      "පුවත් සහ වෙනත් තොරතුරු කාලයත් සමඟ වෙනස් වන වර්ධනයන් පිළිබිඹු කළ හැකියි.",
    "Descriptions, schedules and other website information may be updated.":
      "විස්තර, කාලසටහන් සහ වෙනත් වෙබ් අඩවි තොරතුරු යාවත්කාලීන කළ හැකියි.",
    "Users should consider the context and source of information before relying on it.":
      "තොරතුරු මත රඳා පවතින්නට පෙර, පරිශීලකයන් එහි සන්දර්භය සහ මූලාශ්‍රය සලකා බැලිය යුතුය.",
    "Unless otherwise stated, content published by TV SUPREME, including text, graphics, logos, design elements, videos and other materials, may be protected by applicable intellectual property laws.":
      "වෙනත් ආකාරයකින් සඳහන් කර නොමැති නම්, පෙළ, ග්‍රැෆික්ස්, ලාංඡන, සැලසුම් අංග, වීඩියෝ සහ වෙනත් ද්‍රව්‍ය ඇතුළුව TV SUPREME විසින් පළ කරන අන්තර්ගතය අදාළ බුද්ධිමය දේපළ නීති මගින් ආරක්ෂා විය හැකියි.",
    "You may access and view content for personal and lawful purposes. Reproduction, distribution, modification or commercial use may require appropriate permission.":
      "ඔබට පුද්ගලික සහ නීත්‍යානුකූල අරමුණු සඳහා අන්තර්ගතය වෙත ප්‍රවේශ වී නැරඹිය හැකියි. ප්‍රතිනිෂ්පාදනය, බෙදාහැරීම, වෙනස් කිරීම හෝ වාණිජ භාවිතය සඳහා සුදුසු අවසරයක් අවශ්‍ය විය හැකියි.",
    "Respect our content": "අපගේ අන්තර්ගතයට ගරු කරන්න",
    "Please respect the intellectual property rights associated with TV SUPREME content and third-party materials.":
      "TV SUPREME අන්තර්ගතය සහ තෙවන පාර්ශ්ව ද්‍රව්‍ය සමඟ සම්බන්ධ බුද්ධිමය දේපළ අයිතිවාසිකම්වලට කරුණාකර ගරු කරන්න.",
    "You agree not to misuse the website or its services.":
      "වෙබ් අඩවිය හෝ එහි සේවාවන් අනිසි ලෙස භාවිත නොකිරීමට ඔබ එකඟ වෙයි.",
    "Do not attempt unauthorized access to restricted areas or systems.":
      "සීමා කළ ප්‍රදේශ හෝ පද්ධති වෙත අනවසර ප්‍රවේශයක් ලබා ගැනීමට උත්සාහ නොකරන්න.",
    "Do not disrupt or overload website services.":
      "වෙබ් අඩවි සේවාවන්ට බාධා නොකරන්න හෝ ඒවාට අධික බරක් නොදෙන්න.",
    "Do not use automated methods to abuse, scrape or interfere with website functionality where prohibited.":
      "තහනම් වන අවස්ථාවල වෙබ් අඩවි ක්‍රියාකාරීත්වය අනිසි ලෙස භාවිත කිරීමට, ස්වයංක්‍රීයව දත්ත රැස් කිරීමට හෝ බාධා කිරීමට ස්වයංක්‍රීය ක්‍රම භාවිත නොකරන්න.",
    "Do not use website content to mislead, impersonate or defraud others.":
      "අන් අය නොමඟ යැවීමට, වෙනත් අයෙකු ලෙස පෙනී සිටීමට හෝ වංචා කිරීමට වෙබ් අඩවි අන්තර්ගතය භාවිත නොකරන්න.",
    "Do not submit unlawful, abusive or harmful material through website forms.":
      "වෙබ් අඩවි පෝරම හරහා නීතිවිරෝධී, අපහාසාත්මක හෝ හානිකර ද්‍රව්‍ය ඉදිරිපත් නොකරන්න.",
    "The TV SUPREME website may contain links to external websites, platforms or services operated by third parties.":
      "TV SUPREME වෙබ් අඩවියේ තෙවන පාර්ශ්ව විසින් ක්‍රියාත්මක කරන බාහිර වෙබ් අඩවි, වේදිකා හෝ සේවා වෙත සබැඳි අඩංගු විය හැකියි.",
    "These links are provided for convenience or informational purposes. TV SUPREME does not necessarily control or endorse the content, availability or policies of external websites.":
      "මෙම සබැඳි පහසුව හෝ තොරතුරු සඳහා ලබා දී ඇත. බාහිර වෙබ් අඩවිවල අන්තර්ගතය, ලබාගත හැකි බව හෝ ප්‍රතිපත්ති TV SUPREME විසින් අනිවාර්යයෙන්ම පාලනය හෝ අනුමත නොකරයි.",
    "The website and its content are provided on an informational basis. While TV SUPREME aims to keep information accurate and current, we do not guarantee that every item of content will always be complete, accurate, current or uninterrupted.":
      "වෙබ් අඩවිය සහ එහි අන්තර්ගතය තොරතුරුමය පදනමකින් සපයනු ලැබේ. තොරතුරු නිවැරදි සහ යාවත්කාලීනව තබා ගැනීමට TV SUPREME උත්සාහ කළද, සෑම අන්තර්ගත අයිතමයක්ම සෑම විටම සම්පූර්ණ, නිවැරදි, යාවත්කාලීන හෝ බාධාවකින් තොර බවට අපි සහතික නොකරමු.",
    "Website content should not automatically be treated as professional, legal, financial, medical or other specialised advice.":
      "වෙබ් අඩවි අන්තර්ගතය වෘත්තීය, නීතිමය, මූල්‍ය, වෛද්‍ය හෝ වෙනත් විශේෂඥ උපදෙස් ලෙස ස්වයංක්‍රීයව නොසැලකිය යුතුය.",
    "To the extent permitted by applicable law, TV SUPREME will not be responsible for losses or damages arising from the use of, or inability to use, the website or information provided through it.":
      "අදාළ නීතියෙන් අවසර දෙන සීමාව තුළ, වෙබ් අඩවිය හෝ එය හරහා සපයන තොරතුරු භාවිත කිරීමෙන් හෝ භාවිත කළ නොහැකි වීමෙන් ඇති වන අලාභ හෝ හානි සඳහා TV SUPREME වගකිව යුතු නොවේ.",
    "This includes circumstances involving service interruptions, external links, technical issues or reliance on information that later changes.":
      "සේවා බාධා, බාහිර සබැඳි, තාක්ෂණික ගැටලු හෝ පසුව වෙනස් වන තොරතුරු මත රඳා සිටීම සම්බන්ධ අවස්ථා ද මෙයට ඇතුළත් වේ.",
    "TV SUPREME may update these Terms of Use when necessary to reflect changes to the website, services or applicable requirements.":
      "වෙබ් අඩවිය, සේවාවන් හෝ අදාළ අවශ්‍යතාවන්හි වෙනස්කම් පිළිබිඹු කිරීම සඳහා අවශ්‍ය විට TV SUPREME මෙම භාවිත නියමයන් යාවත්කාලීන කළ හැකියි.",
    "Any updated version will be published on this page with the applicable revision date.":
      "යාවත්කාලීන කළ ඕනෑම අනුවාදයක් අදාළ සංශෝධන දිනය සමඟ මෙම පිටුවේ පළ කෙරේ.",
    "If you have questions regarding these Terms of Use, please contact TV SUPREME.":
      "මෙම භාවිත නියමයන් සම්බන්ධයෙන් ඔබට ප්‍රශ්න තිබේ නම්, කරුණාකර TV SUPREME අමතන්න.",
    "Email": "විද්‍යුත් තැපෑල",
    "Website": "වෙබ් අඩවිය",
    "Review our Privacy Policy": "අපගේ පෞද්ගලිකත්ව ප්‍රතිපත්තිය සමාලෝචනය කරන්න",
    "Learn how TV SUPREME handles information and privacy.":
      "TV SUPREME තොරතුරු සහ පෞද්ගලිකත්වය හැසිරවන්නේ කෙසේදැයි දැනගන්න.",
    "Privacy Policy": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
  },
  ta: {
    "Legal Information": "சட்டத் தகவல்",
    "Terms of Use": "பயன்பாட்டு விதிமுறைகள்",
    "Please read these terms carefully before using the TV SUPREME website and digital services.":
      "TV SUPREME இணையதளத்தையும் டிஜிட்டல் சேவைகளையும் பயன்படுத்துவதற்கு முன், இந்த விதிமுறைகளை கவனமாக வாசிக்கவும்.",
    "Last updated: 15 September 2026": "கடைசியாகப் புதுப்பிக்கப்பட்டது: 15 செப்டம்பர் 2026",
    "On this page": "இந்தப் பக்கத்தில்",
    "Use of this website": "இந்த இணையதளத்தின் பயன்பாடு",
    "By using TV SUPREME, you agree to these terms.":
      "TV SUPREME-ஐப் பயன்படுத்துவதன் மூலம், இந்த விதிமுறைகளை நீங்கள் ஏற்றுக்கொள்கிறீர்கள்.",
    "Introduction": "அறிமுகம்",
    "Using This Website": "இந்த இணையதளத்தைப் பயன்படுத்துதல்",
    "Content & Information": "உள்ளடக்கமும் தகவலும்",
    "Intellectual Property": "அறிவுசார் சொத்து",
    "Acceptable Use": "ஏற்றுக்கொள்ளத்தக்க பயன்பாடு",
    "External Links": "வெளிப்புற இணைப்புகள்",
    "Disclaimer": "பொறுப்புத் துறப்பு",
    "Limitation of Liability": "பொறுப்புக்கான வரம்பு",
    "Changes to These Terms": "இந்த விதிமுறைகளில் மாற்றங்கள்",
    "Contact Us": "எங்களைத் தொடர்புகொள்ளுங்கள்",
    "These Terms of Use explain the conditions that apply when you access or use the TV SUPREME website and related digital services.":
      "TV SUPREME இணையதளத்தையும் தொடர்புடைய டிஜிட்டல் சேவைகளையும் நீங்கள் அணுகும்போது அல்லது பயன்படுத்தும்போது பொருந்தும் நிபந்தனைகளை இந்தப் பயன்பாட்டு விதிமுறைகள் விளக்குகின்றன.",
    "By accessing or using the website, you acknowledge that you have read, understood and agreed to these Terms of Use.":
      "இணையதளத்தை அணுகுவதன் அல்லது பயன்படுத்துவதன் மூலம், இந்தப் பயன்பாட்டு விதிமுறைகளை நீங்கள் வாசித்து, புரிந்துகொண்டு, ஏற்றுக்கொண்டுள்ளீர்கள் என்பதை ஒப்புக்கொள்கிறீர்கள்.",
    "You may use the TV SUPREME website for lawful purposes and in accordance with these terms.":
      "இந்த விதிமுறைகளுக்கு உட்பட்டு, சட்டபூர்வமான நோக்கங்களுக்காக TV SUPREME இணையதளத்தை நீங்கள் பயன்படுத்தலாம்.",
    "You must use the website responsibly and respectfully.":
      "இணையதளத்தைப் பொறுப்புடனும் மரியாதையுடனும் பயன்படுத்த வேண்டும்.",
    "You must not use the website for unlawful or fraudulent purposes.":
      "சட்டவிரோதமான அல்லது மோசடியான நோக்கங்களுக்காக இணையதளத்தைப் பயன்படுத்தக் கூடாது.",
    "You must not attempt to interfere with the operation or security of the website.":
      "இணையதளத்தின் செயல்பாடு அல்லது பாதுகாப்பில் தலையிட முயற்சிக்கக் கூடாது.",
    "You must not knowingly introduce malicious software or harmful code.":
      "தீங்கிழைக்கும் மென்பொருள் அல்லது தீங்கான குறியீட்டை அறிந்தே அறிமுகப்படுத்தக் கூடாது.",
    "TV SUPREME provides news, articles, videos and other information through the website.":
      "TV SUPREME இணையதளம் மூலம் செய்திகள், கட்டுரைகள், வீடியோக்கள் மற்றும் பிற தகவல்களை வழங்குகிறது.",
    "We aim to provide useful and timely information, but content may change, be updated or be removed without prior notice.":
      "பயனுள்ள மற்றும் தகுந்த நேரத் தகவல்களை வழங்குவதே எங்கள் நோக்கம்; எனினும், முன் அறிவிப்பின்றி உள்ளடக்கம் மாற்றப்படலாம், புதுப்பிக்கப்படலாம் அல்லது அகற்றப்படலாம்.",
    "News and other information may reflect developments that change over time.":
      "செய்திகளும் பிற தகவல்களும் காலப்போக்கில் மாறக்கூடிய முன்னேற்றங்களைப் பிரதிபலிக்கலாம்.",
    "Descriptions, schedules and other website information may be updated.":
      "விளக்கங்கள், அட்டவணைகள் மற்றும் பிற இணையதளத் தகவல்கள் புதுப்பிக்கப்படலாம்.",
    "Users should consider the context and source of information before relying on it.":
      "தகவலை நம்புவதற்கு முன், அதன் சூழலையும் மூலத்தையும் பயனர்கள் கவனத்தில் கொள்ள வேண்டும்.",
    "Unless otherwise stated, content published by TV SUPREME, including text, graphics, logos, design elements, videos and other materials, may be protected by applicable intellectual property laws.":
      "வேறுவிதமாகக் குறிப்பிடப்படாவிட்டால், உரை, வரைகலை, சின்னங்கள், வடிவமைப்புக் கூறுகள், வீடியோக்கள் மற்றும் பிற பொருட்கள் உட்பட TV SUPREME வெளியிடும் உள்ளடக்கம் பொருந்தும் அறிவுசார் சொத்துச் சட்டங்களால் பாதுகாக்கப்படலாம்.",
    "You may access and view content for personal and lawful purposes. Reproduction, distribution, modification or commercial use may require appropriate permission.":
      "தனிப்பட்ட மற்றும் சட்டபூர்வமான நோக்கங்களுக்காக உள்ளடக்கத்தை அணுகி பார்வையிடலாம். மறுஉருவாக்கம், விநியோகம், மாற்றம் அல்லது வணிகப் பயன்பாட்டிற்கு உரிய அனுமதி தேவைப்படலாம்.",
    "Respect our content": "எங்கள் உள்ளடக்கத்தை மதியுங்கள்",
    "Please respect the intellectual property rights associated with TV SUPREME content and third-party materials.":
      "TV SUPREME உள்ளடக்கத்திற்கும் மூன்றாம் தரப்புப் பொருட்களுக்கும் தொடர்புடைய அறிவுசார் சொத்து உரிமைகளை மதிக்கவும்.",
    "You agree not to misuse the website or its services.":
      "இணையதளத்தையோ அதன் சேவைகளையோ தவறாகப் பயன்படுத்தமாட்டீர்கள் என்பதை ஒப்புக்கொள்கிறீர்கள்.",
    "Do not attempt unauthorized access to restricted areas or systems.":
      "கட்டுப்படுத்தப்பட்ட பகுதிகள் அல்லது அமைப்புகளுக்கு அங்கீகாரமற்ற அணுகலைப் பெற முயற்சிக்கக் கூடாது.",
    "Do not disrupt or overload website services.":
      "இணையதளச் சேவைகளைத் தடைசெய்யவோ அதிக சுமை ஏற்படுத்தவோ கூடாது.",
    "Do not use automated methods to abuse, scrape or interfere with website functionality where prohibited.":
      "தடைசெய்யப்பட்ட இடங்களில் இணையதளச் செயல்பாடுகளைத் தவறாகப் பயன்படுத்த, தானியக்கமாகத் தரவைச் சேகரிக்க அல்லது அவற்றில் தலையிட தானியக்க முறைகளைப் பயன்படுத்தக் கூடாது.",
    "Do not use website content to mislead, impersonate or defraud others.":
      "பிறரைத் தவறாக வழிநடத்த, பிறர் போல நடிக்க அல்லது மோசடி செய்ய இணையதள உள்ளடக்கத்தைப் பயன்படுத்தக் கூடாது.",
    "Do not submit unlawful, abusive or harmful material through website forms.":
      "இணையதளப் படிவங்கள் மூலம் சட்டவிரோதமான, துஷ்பிரயோகமான அல்லது தீங்கான உள்ளடக்கத்தைச் சமர்ப்பிக்கக் கூடாது.",
    "The TV SUPREME website may contain links to external websites, platforms or services operated by third parties.":
      "TV SUPREME இணையதளத்தில் மூன்றாம் தரப்பினரால் இயக்கப்படும் வெளிப்புற இணையதளங்கள், தளங்கள் அல்லது சேவைகளுக்கான இணைப்புகள் இருக்கலாம்.",
    "These links are provided for convenience or informational purposes. TV SUPREME does not necessarily control or endorse the content, availability or policies of external websites.":
      "இந்த இணைப்புகள் வசதி அல்லது தகவல் நோக்கங்களுக்காக வழங்கப்படுகின்றன. வெளிப்புற இணையதளங்களின் உள்ளடக்கம், கிடைப்புத்தன்மை அல்லது கொள்கைகளை TV SUPREME கட்டுப்படுத்தவோ அங்கீகரிக்கவோ அவசியமில்லை.",
    "The website and its content are provided on an informational basis. While TV SUPREME aims to keep information accurate and current, we do not guarantee that every item of content will always be complete, accurate, current or uninterrupted.":
      "இணையதளமும் அதன் உள்ளடக்கமும் தகவல் நோக்கத்திற்காக வழங்கப்படுகின்றன. தகவல்களைத் துல்லியமாகவும் புதுப்பித்ததாகவும் வைத்திருக்க TV SUPREME முயன்றாலும், ஒவ்வொரு உள்ளடக்கமும் எப்போதும் முழுமையானதாகவும் துல்லியமானதாகவும் புதுப்பித்ததாகவும் தடையின்றியும் இருக்கும் என்று நாங்கள் உத்தரவாதம் அளிப்பதில்லை.",
    "Website content should not automatically be treated as professional, legal, financial, medical or other specialised advice.":
      "இணையதள உள்ளடக்கத்தைத் தொழில்முறை, சட்ட, நிதி, மருத்துவ அல்லது பிற சிறப்பான ஆலோசனையாகத் தானாகவே கருதக் கூடாது.",
    "To the extent permitted by applicable law, TV SUPREME will not be responsible for losses or damages arising from the use of, or inability to use, the website or information provided through it.":
      "பொருந்தும் சட்டம் அனுமதிக்கும் வரம்பிற்குள், இணையதளம் அல்லது அதன் மூலம் வழங்கப்படும் தகவலைப் பயன்படுத்துவதாலோ பயன்படுத்த இயலாமையாலோ ஏற்படும் இழப்பு அல்லது சேதங்களுக்கு TV SUPREME பொறுப்பேற்காது.",
    "This includes circumstances involving service interruptions, external links, technical issues or reliance on information that later changes.":
      "சேவைத் தடங்கல்கள், வெளிப்புற இணைப்புகள், தொழில்நுட்பப் பிரச்சினைகள் அல்லது பின்னர் மாறும் தகவல்களை நம்புதல் ஆகிய சூழல்களும் இதில் அடங்கும்.",
    "TV SUPREME may update these Terms of Use when necessary to reflect changes to the website, services or applicable requirements.":
      "இணையதளம், சேவைகள் அல்லது பொருந்தும் தேவைகளில் ஏற்படும் மாற்றங்களைப் பிரதிபலிக்கத் தேவைப்படும் போது TV SUPREME இந்தப் பயன்பாட்டு விதிமுறைகளைப் புதுப்பிக்கலாம்.",
    "Any updated version will be published on this page with the applicable revision date.":
      "புதுப்பிக்கப்பட்ட எந்தப் பதிப்பும் பொருந்தும் திருத்தத் தேதியுடன் இந்தப் பக்கத்தில் வெளியிடப்படும்.",
    "If you have questions regarding these Terms of Use, please contact TV SUPREME.":
      "இந்தப் பயன்பாட்டு விதிமுறைகள் தொடர்பாக உங்களுக்கு கேள்விகள் இருந்தால், TV SUPREME-ஐத் தொடர்புகொள்ளுங்கள்.",
    "Email": "மின்னஞ்சல்",
    "Website": "இணையதளம்",
    "Review our Privacy Policy": "எங்கள் தனியுரிமைக் கொள்கையைப் பார்வையிடுங்கள்",
    "Learn how TV SUPREME handles information and privacy.":
      "TV SUPREME தகவலையும் தனியுரிமையையும் எவ்வாறு கையாள்கிறது என்பதை அறிந்துகொள்ளுங்கள்.",
    "Privacy Policy": "தனியுரிமைக் கொள்கை",
  },
} satisfies StaticPageTranslations;

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

export default async function TermsOfUsePage({
  locale: localeOverride,
}: {
  locale?: string;
} = {}) {
  const locale = localeOverride ?? await getLocale();
  const t = getStaticTranslator(locale, termsTranslations);
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
                {t("Legal Information")}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("Terms of Use")}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                {t(
                  "Please read these terms carefully before using the TV SUPREME website and digital services.",
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
                    {t("On this page")}
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-[#111d4a]">
                    {t("Terms of Use")}
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
                    <FileCheck2 size={16} />
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    {t("Use of this website")}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/60">
                    {t("By using TV SUPREME, you agree to these terms.")}
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
                title={t("Introduction")}
                icon={<FileText size={18} />}
              >
                <p>
                  {t(
                    "These Terms of Use explain the conditions that apply when you access or use the TV SUPREME website and related digital services.",
                  )}
                </p>

                <p>
                  {t(
                    "By accessing or using the website, you acknowledge that you have read, understood and agreed to these Terms of Use.",
                  )}
                </p>
              </TermsSection>

              {/* Using Website */}
              <TermsSection
                id="eligibility"
                number="02"
                title={t("Using This Website")}
                icon={<UserCheck size={18} />}
              >
                <p>
                  {t(
                    "You may use the TV SUPREME website for lawful purposes and in accordance with these terms.",
                  )}
                </p>

                <TermsList
                  items={[
                    t(
                      "You must use the website responsibly and respectfully.",
                    ),
                    t(
                      "You must not use the website for unlawful or fraudulent purposes.",
                    ),
                    t(
                      "You must not attempt to interfere with the operation or security of the website.",
                    ),
                    t(
                      "You must not knowingly introduce malicious software or harmful code.",
                    ),
                  ]}
                />
              </TermsSection>

              {/* Content */}
              <TermsSection
                id="content"
                number="03"
                title={t("Content & Information")}
              >
                <p>
                  {t(
                    "TV SUPREME provides news, articles, videos and other information through the website.",
                  )}
                </p>

                <p>
                  {t(
                    "We aim to provide useful and timely information, but content may change, be updated or be removed without prior notice.",
                  )}
                </p>

                <TermsList
                  items={[
                    t(
                      "News and other information may reflect developments that change over time.",
                    ),
                    t(
                      "Descriptions, schedules and other website information may be updated.",
                    ),
                    t(
                      "Users should consider the context and source of information before relying on it.",
                    ),
                  ]}
                />
              </TermsSection>

              {/* Intellectual Property */}
              <TermsSection
                id="intellectual-property"
                number="04"
                title={t("Intellectual Property")}
                icon={<ShieldCheck size={18} />}
              >
                <p>
                  {t(
                    "Unless otherwise stated, content published by TV SUPREME, including text, graphics, logos, design elements, videos and other materials, may be protected by applicable intellectual property laws.",
                  )}
                </p>

                <p>
                  {t(
                    "You may access and view content for personal and lawful purposes. Reproduction, distribution, modification or commercial use may require appropriate permission.",
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
                        {t("Respect our content")}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {t(
                          "Please respect the intellectual property rights associated with TV SUPREME content and third-party materials.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </TermsSection>

              {/* Acceptable Use */}
              <TermsSection
                id="acceptable-use"
                number="05"
                title={t("Acceptable Use")}
                icon={<Gavel size={18} />}
              >
                <p>
                  {t("You agree not to misuse the website or its services.")}
                </p>

                <TermsList
                  items={[
                    t(
                      "Do not attempt unauthorized access to restricted areas or systems.",
                    ),
                    t("Do not disrupt or overload website services."),
                    t(
                      "Do not use automated methods to abuse, scrape or interfere with website functionality where prohibited.",
                    ),
                    t(
                      "Do not use website content to mislead, impersonate or defraud others.",
                    ),
                    t(
                      "Do not submit unlawful, abusive or harmful material through website forms.",
                    ),
                  ]}
                />
              </TermsSection>

              {/* External Links */}
              <TermsSection
                id="external-links"
                number="06"
                title={t("External Links")}
                icon={<Link2 size={18} />}
              >
                <p>
                  {t(
                    "The TV SUPREME website may contain links to external websites, platforms or services operated by third parties.",
                  )}
                </p>

                <p>
                  {t(
                    "These links are provided for convenience or informational purposes. TV SUPREME does not necessarily control or endorse the content, availability or policies of external websites.",
                  )}
                </p>
              </TermsSection>

              {/* Disclaimer */}
              <TermsSection
                id="disclaimer"
                number="07"
                title={t("Disclaimer")}
                icon={<AlertCircle size={18} />}
              >
                <p>
                  {t(
                    "The website and its content are provided on an informational basis. While TV SUPREME aims to keep information accurate and current, we do not guarantee that every item of content will always be complete, accurate, current or uninterrupted.",
                  )}
                </p>

                <p>
                  {t(
                    "Website content should not automatically be treated as professional, legal, financial, medical or other specialised advice.",
                  )}
                </p>
              </TermsSection>

              {/* Limitation */}
              <TermsSection
                id="limitation"
                number="08"
                title={t("Limitation of Liability")}
              >
                <p>
                  {t(
                    "To the extent permitted by applicable law, TV SUPREME will not be responsible for losses or damages arising from the use of, or inability to use, the website or information provided through it.",
                  )}
                </p>

                <p>
                  {t(
                    "This includes circumstances involving service interruptions, external links, technical issues or reliance on information that later changes.",
                  )}
                </p>
              </TermsSection>

              {/* Changes */}
              <TermsSection
                id="changes"
                number="09"
                title={t("Changes to These Terms")}
              >
                <p>
                  {t(
                    "TV SUPREME may update these Terms of Use when necessary to reflect changes to the website, services or applicable requirements.",
                  )}
                </p>

                <p>
                  {t(
                    "Any updated version will be published on this page with the applicable revision date.",
                  )}
                </p>
              </TermsSection>

              {/* Contact */}
              <TermsSection
                id="contact"
                number="10"
                title={t("Contact Us")}
                icon={<Mail size={18} />}
              >
                <p>
                  {t(
                    "If you have questions regarding these Terms of Use, please contact TV SUPREME.",
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
                  {t("Legal Information")}
                </p>

                <h2 className="mt-2 text-xl font-black text-[#111d4a]">
                  {t("Review our Privacy Policy")}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t(
                    "Learn how TV SUPREME handles information and privacy.",
                  )}
                </p>
              </div>

              <Link
                href="/legal/privacy-policy"
                locale={locale}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                {t("Privacy Policy")}
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
