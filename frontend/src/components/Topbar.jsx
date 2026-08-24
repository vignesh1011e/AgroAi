import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";
import API from "../services/api";

function Topbar({ setMobileOpen }) {
  const { user } = useAuth();
  const { language, changeLanguage, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("agro_theme") === "dark"
  );

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openLanguageMenu, setOpenLanguageMenu] = useState(false);

  const notifRef = useRef(null);
  const langRef = useRef(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("agro_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("agro_theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Load notification count
  useEffect(() => {
    let cancelled = false;
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        if (!cancelled && res.data?.notifications) {
          setNotifications(res.data.notifications.slice(0, 5));
          const unread = res.data.notifications.filter((n) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        // silent fail
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setOpenLanguageMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectLanguage = (lang) => {
    if (changeLanguage) {
      changeLanguage(lang);
    } else if (setLanguage) {
      setLanguage(lang);
    }
    localStorage.setItem("agro_language", lang);
    window.dispatchEvent(new CustomEvent("agro-language-change", { detail: lang }));
    setOpenLanguageMenu(false);
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const serverUrl = apiUrl.replace(/\/api\/?$/, "");
    return `${serverUrl}${imagePath}`;
  };

  const locationText =
    user?.village && user?.district
      ? `${user.village}, ${user.district}`
      : user?.region || user?.district || user?.state || "Location";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200/80 bg-white/85 px-4 md:px-8 backdrop-blur-xl transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/85">
      {/* =========================================================
          LEFT SIDE: Mobile Toggle + Farmer Name + Location
      ========================================================= */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen && setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-sm text-neutral-700 shadow-2xs hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900 md:hidden"
          title="Open Menu"
        >
          ☰
        </button>

        {/* Farmer Info & Location */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xs font-bold text-neutral-950 dark:text-white sm:text-sm">
              {user?.name || "Farmer"}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Farmer
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            <span className="text-emerald-600 dark:text-emerald-400">📍</span>
            <span className="truncate">{locationText}</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE: Language + Theme + Notifications + Profile
      ========================================================= */}
      <div className="flex items-center gap-2">
        {/* Language Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setOpenLanguageMenu(!openLanguageMenu)}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-700"
            title="Switch Language"
          >
            <span>🌐</span>
            <span className="hidden sm:inline font-medium">
              {language === "Telugu" ? "తెలుగు" : language === "Hindi" ? "हिन्दी" : "English"}
            </span>
            <span className="text-[9px] text-neutral-400">▼</span>
          </button>

          {openLanguageMenu && (
            <div className="absolute right-0 mt-2 w-36 animate-scale-up overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              <button
                onClick={() => selectLanguage("English")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium ${
                  language === "English"
                    ? "bg-emerald-600 text-white font-semibold shadow-xs"
                    : "text-neutral-700 hover:bg-emerald-50 dark:text-neutral-300 dark:hover:bg-emerald-950/40"
                }`}
              >
                <span>🇬🇧 English</span>
                {language === "English" && <span>✓</span>}
              </button>
              <button
                onClick={() => selectLanguage("Telugu")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium ${
                  language === "Telugu"
                    ? "bg-emerald-600 text-white font-semibold shadow-xs"
                    : "text-neutral-700 hover:bg-emerald-50 dark:text-neutral-300 dark:hover:bg-emerald-950/40"
                }`}
              >
                <span>🇮🇳 తెలుగు</span>
                {language === "Telugu" && <span>✓</span>}
              </button>
              <button
                onClick={() => selectLanguage("Hindi")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium ${
                  language === "Hindi"
                    ? "bg-emerald-600 text-white font-semibold shadow-xs"
                    : "text-neutral-700 hover:bg-emerald-50 dark:text-neutral-300 dark:hover:bg-emerald-950/40"
                }`}
              >
                <span>🇮🇳 हिन्दी</span>
                {language === "Hindi" && <span>✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 shadow-2xs transition hover:border-emerald-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-700"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setOpenNotifications(!openNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 shadow-2xs transition hover:border-emerald-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-700"
            title="Notifications"
          >
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 mt-2 w-80 animate-scale-up overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-950 dark:text-white">
                  Notifications
                </span>
                <Link
                  to="/notifications"
                  onClick={() => setOpenNotifications(false)}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  View All →
                </Link>
              </div>

              <div className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800/60 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-neutral-400">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className="py-2">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 shadow-2xs transition hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/60"
          title="Go to Profile"
        >
          {user?.profileImage ? (
            <img
              src={getProfileImageUrl(user.profileImage)}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm">👤</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Topbar;
