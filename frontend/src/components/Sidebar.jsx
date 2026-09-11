import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";
import logoSvg from "../assets/logo.svg";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const { logout, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const translations = {
    English: {
      dashboard: "Dashboard",
      ai: "Agro AI",
      farmerDirect: "Farmer Direct",
      marketplace: "Equipment Market",
      weather: "Weather",
      calculators: "Calculators",
      activities: "Farm Tasks",
      community: "Community",
      notifications: "Notifications",
      profile: "Profile",
      mainMenu: "Workspace",
      logout: "Log out",
      subtitle: "Smart Farming Platform",
    },
    Telugu: {
      dashboard: "డాష్‌బోర్డ్",
      ai: "అగ్రో AI",
      farmerDirect: "రైతు బజార్ (ప్రత్యక్ష)",
      marketplace: "పరికరాల మార్కెట్",
      weather: "వాతావరణం",
      calculators: "కాలిక్యులేటర్లు",
      activities: "వ్యవసాయ పనులు",
      community: "కమ్యూనిటీ",
      notifications: "నోటిఫికేషన్‌లు",
      profile: "ప్రొఫైల్",
      mainMenu: "వర్క్‌స్పేస్",
      logout: "లాగ్ అవుట్",
      subtitle: "స్మార్ట్ వ్యవసాయం",
    },
    Hindi: {
      dashboard: "डैशबोर्ड",
      ai: "एग्रो AI",
      farmerDirect: "किसान डायरेक्ट मंडी",
      marketplace: "उपकरण बाज़ार",
      weather: "मौसम",
      calculators: "कैलकुलेटर",
      activities: "कृषि कार्य",
      community: "समुदाय",
      notifications: "सूचनाएँ",
      profile: "प्रोफ़ाइल",
      mainMenu: "कार्यक्षेत्र",
      logout: "लॉग आउट",
      subtitle: "स्मार्ट कृषि",
    },
    Tamil: {
      dashboard: "முகப்புப்பலகை",
      ai: "அக்ரோ AI",
      farmerDirect: "உழவர் நேரடி சந்தை",
      marketplace: "உபகரண சந்தை",
      weather: "வானிலை",
      calculators: "கணக்கீடுகள்",
      activities: "பண்ணைப் பணிகள்",
      community: "சமூகம்",
      notifications: "அறிவிப்புகள்",
      profile: "சுயவிவரம்",
      mainMenu: "பணியிடம்",
      logout: "வெளியேறு",
      subtitle: "ஸ்மார்ட் விவசாயம்",
    },
    Kannada: {
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      ai: "ಅಗ್ರೋ AI",
      farmerDirect: "ರೈತರ ನೇರ ಮಾರುಕಟ್ಟೆ",
      marketplace: "ಉಪಕರಣ ಮಾರುಕಟ್ಟೆ",
      weather: "ಹವಾಮಾನ",
      calculators: "ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು",
      activities: "ಕೃಷಿ ಕಾರ್ಯಗಳು",
      community: "ಸಮುದಾಯ",
      notifications: "ಅಧಿಸೂಚನೆಗಳು",
      profile: "ಪ್ರೊಫೈಲ್",
      mainMenu: "ಕಾರ್ಯಕ್ಷೇತ್ರ",
      logout: "ಲಾಗ್ ಔಟ್",
      subtitle: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ",
    },
    Malayalam: {
      dashboard: "ഡാഷ്‌ബോർഡ്",
      ai: "അഗ്രോ AI",
      farmerDirect: "കർഷക വിപണി",
      marketplace: "ഉപകരണ മാർക്കറ്റ്",
      weather: "കാലാവസ്ഥ",
      calculators: "കാൽക്കുലേറ്ററുകൾ",
      activities: "കൃഷി ജോലികൾ",
      community: "കമ്മ്യൂണിറ്റി",
      notifications: "അറിയിപ്പുകൾ",
      profile: "പ്രൊഫൈൽ",
      mainMenu: "വർക്ക്‌സ്‌പേസ്",
      logout: "ലോഗ് ഔട്ട്",
      subtitle: "സ്മാർട്ട് കൃഷി പ്ലാറ്റ്‌ഫോം",
    },
    Marathi: {
      dashboard: "डॅशबोर्ड",
      ai: "ॲग्रो AI",
      farmerDirect: "शेतकरी थेट बाजार",
      marketplace: "उपकरणे बाजार",
      weather: "हवामान",
      calculators: "कॅल्क्युलेटर",
      activities: "शेतीची कामे",
      community: "समुदाय",
      notifications: "सूचना",
      profile: "प्रोफाइल",
      mainMenu: "कार्यक्षेत्र",
      logout: "लॉग आउट",
      subtitle: "स्मार्ट शेती",
    },
    Gujarati: {
      dashboard: "ડેશબોર્ડ",
      ai: "એગ્રો AI",
      farmerDirect: "ખેડૂત સીધું બજાર",
      marketplace: "સાધન બજાર",
      weather: "હવામાન",
      calculators: "કેલ્ક્યુલેટર",
      activities: "ખેતી કાર્યો",
      community: "સમુદાય",
      notifications: "સૂચનાઓ",
      profile: "પ્રોફાઇલ",
      mainMenu: "કાર્યક્ષેત્ર",
      logout: "લૉગ આઉટ",
      subtitle: "સ્માર્ટ ખેતી પ્લેટફોર્મ",
    },
    Bengali: {
      dashboard: "ড্যাশবোর্ড",
      ai: "এগ্রো AI",
      farmerDirect: "কৃষক সরাসরি বাজার",
      marketplace: "কৃষি সরঞ্জাম বাজার",
      weather: "আবহাওয়া",
      calculators: "ক্যালকুলেটর",
      activities: "খামারের কাজ",
      community: "কমিউনিটি",
      notifications: "বিজ্ঞপ্তি",
      profile: "প্রোফাইল",
      mainMenu: "ওয়ার্কস্পেস",
      logout: "লগ আউট",
      subtitle: "স্মার্ট কৃষি প্ল্যাটফর্ম",
    },
    Punjabi: {
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      ai: "ਐਗਰੋ AI",
      farmerDirect: "ਕਿਸਾਨ ਸਿੱਧੀ ਮੰਡੀ",
      marketplace: "ਸੰਦਾਂ ਦੀ ਮੰਡੀ",
      weather: "ਮੌਸਮ",
      calculators: "ਕੈਲਕੂਲੇਟਰ",
      activities: "ਖੇਤੀਬਾੜੀ ਕੰਮ",
      community: "ਭਾਈਚਾਰਾ",
      notifications: "ਸੂਚਨਾਵਾਂ",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      mainMenu: "ਵਰਕਸਪੇਸ",
      logout: "ਲਾਗ ਆਊਟ",
      subtitle: "ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ",
    },
    Odia: {
      dashboard: "ଡ୍ୟାସବୋର୍ଡ",
      ai: "ଆଗ୍ରୋ AI",
      farmerDirect: "ଚାଷୀ ପ୍ରତ୍ୟକ୍ଷ ମଣ୍ଡି",
      marketplace: "ଉପକରଣ ବଜାର",
      weather: "ପାଣିପାଗ",
      calculators: "କାଲକୁଲେଟର",
      activities: "ଚାଷ କାର୍ଯ୍ୟ",
      community: "ସମୁଦାୟ",
      notifications: "ବିଜ୍ଞପ୍ତି",
      profile: "ପ୍ରୋଫାଇଲ",
      mainMenu: "କାର୍ଯ୍ୟକ୍ଷେତ୍ର",
      logout: "ଲଗ ଆଉଟ",
      subtitle: "ସ୍ମାର୍ଟ କୃଷି ମଞ୍ଚ",
    },
    Assamese: {
      dashboard: "ডেচবৰ্ড",
      ai: "এগ্ৰ’ AI",
      farmerDirect: "কৃষক পোনপটীয়া বজাৰ",
      marketplace: "সঁজুলি বজাৰ",
      weather: "বতৰ",
      calculators: "কেলকুলেটৰ",
      activities: "খেতিৰ কাম",
      community: "সম্প্ৰদায়",
      notifications: "বিজ্ঞপ্তি",
      profile: "প্রোফাইল",
      mainMenu: "কৰ্মক্ষেত্ৰ",
      logout: "লগ আউট",
      subtitle: "স্মাৰ্ট কৃষি প্লেটফৰ্ম",
    },
    Urdu: {
      dashboard: "ڈیش بورڈ",
      ai: "ایگرو AI",
      farmerDirect: "کسان ڈائریکٹ منڈی",
      marketplace: "زرعی آلات بازار",
      weather: "موسم",
      calculators: "کیلکولیٹرز",
      activities: "کھیتی کے کام",
      community: "کمیونٹی",
      notifications: "اطلاعات",
      profile: "پروفائل",
      mainMenu: "ورک اسپیس",
      logout: "لاگ آؤٹ",
      subtitle: "اسمارٹ زراعت",
    },
  };
  const t = translations[language] || translations.English;

  const menuItems = [
    { name: t.dashboard, path: "/dashboard", icon: "🏠", shortcut: "⌘1" },
    { name: t.ai, path: "/ai-chat", icon: "✦", shortcut: "⌘2" },
    { name: t.farmerDirect, path: "/farmer-direct", icon: "🌾", shortcut: "⌘3" },
    { name: t.marketplace, path: "/marketplace", icon: "🚜", shortcut: "⌘4" },
    { name: t.weather, path: "/weather", icon: "☁️", shortcut: "⌘5" },
    { name: t.activities, path: "/activities", icon: "✓", shortcut: "⌘6" },
    { name: t.calculators, path: "/calculators", icon: "⊞", shortcut: "⌘7" },
    { name: t.community, path: "/community", icon: "💬", shortcut: "⌘8" },
    { name: t.notifications, path: "/notifications", icon: "🔔", shortcut: "⌘9" },
    { name: t.profile, path: "/profile", icon: "👤", shortcut: "⌘0" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-neutral-200/80 bg-white/95 text-neutral-900 backdrop-blur-xl transition-all duration-300 dark:border-neutral-800/80 dark:bg-neutral-950/95 dark:text-neutral-100 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200/80 px-5 dark:border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-emerald-200/80 bg-emerald-50 p-1 shadow-2xs dark:border-emerald-800/80 dark:bg-emerald-950/60">
              <img src={logoSvg} alt="Agro AI" className="h-full w-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs font-bold tracking-tight text-neutral-950 dark:text-white">
                  Agro AI
                </h1>
                <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                  Agri
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">{t.subtitle}</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-500">
            {t.mainMenu}
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs font-semibold dark:bg-emerald-500 dark:text-neutral-950"
                      : "text-neutral-600 hover:bg-emerald-50/70 hover:text-emerald-900 dark:text-neutral-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm transition-transform duration-150 group-hover:scale-105 ${
                          isActive ? "bg-white/20 dark:bg-black/10" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={`text-[10px] transition-opacity duration-150 ${
                        isActive
                          ? "text-emerald-100 dark:text-emerald-900 opacity-90 font-semibold"
                          : "text-neutral-400 opacity-0 group-hover:opacity-80 dark:text-neutral-500"
                      }`}
                    >
                      {item.shortcut}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer / User & Logout */}
        <div className="border-t border-neutral-200/80 p-3 dark:border-neutral-800/80">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-neutral-600 transition duration-150 hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg
                className="h-4 w-4 transition duration-150 group-hover:-translate-x-0.5 text-neutral-400 group-hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>{t.logout}</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
