import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";

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
      community: "Community",
      marketplace: "Marketplace",
      weather: "Weather",
      calculators: "Calculators",
      activities: "Farm Tasks",
      notifications: "Notifications",
      profile: "Profile",
      mainMenu: "Workspace",
      logout: "Log out",
      subtitle: "Smart Farming Platform",
    },
    Telugu: {
      dashboard: "డాష్‌బోర్డ్",
      ai: "అగ్రో AI",
      community: "కమ్యూనిటీ",
      marketplace: "మార్కెట్‌ప్లేస్",
      weather: "వాతావరణం",
      calculators: "కాలిక్యులేటర్లు",
      activities: "వ్యవసాయ పనులు",
      notifications: "నోటిఫికేషన్‌లు",
      profile: "ప్రొఫైల్",
      mainMenu: "వర్క్‌స్పేస్",
      logout: "లాగ్ అవుట్",
      subtitle: "స్మార్ట్ వ్యవసాయం",
    },
    Hindi: {
      dashboard: "डैशबोर्ड",
      ai: "एग्रो AI",
      community: "समुदाय",
      marketplace: "मार्केटप्लेस",
      weather: "मौसम",
      calculators: "कैलकुलेटर",
      activities: "कृषि कार्य",
      notifications: "सूचनाएँ",
      profile: "प्रोफ़ाइल",
      mainMenu: "कार्यक्षेत्र",
      logout: "लॉग आउट",
      subtitle: "स्मार्ट कृषि",
    },
  };
  const t = translations[language] || translations.English;

  const menuItems = [
    { name: t.dashboard, path: "/dashboard", icon: "🏠", shortcut: "⌘1" },
    { name: t.ai, path: "/ai-chat", icon: "✦", shortcut: "⌘2" },
    { name: t.marketplace, path: "/marketplace", icon: "🛒", shortcut: "⌘3" },
    { name: t.weather, path: "/weather", icon: "☁️", shortcut: "⌘4" },
    { name: t.activities, path: "/activities", icon: "✓", shortcut: "⌘5" },
    { name: t.calculators, path: "/calculators", icon: "⊞", shortcut: "⌘6" },
    { name: t.community, path: "/community", icon: "💬", shortcut: "⌘7" },
    { name: t.notifications, path: "/notifications", icon: "🔔", shortcut: "⌘8" },
    { name: t.profile, path: "/profile", icon: "👤", shortcut: "⌘9" },
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base font-semibold text-emerald-700 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              🌱
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
