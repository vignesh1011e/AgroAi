import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";

import API from "../services/api";
import sampleActivities from "../data/sampleActivities";
import sampleListings from "../data/sampleListings";
import farmBanner from "../assets/farm-banner.jpg";

function Dashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [activities, setActivities] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    English: {
      welcome: "Welcome to Agro AI",
      farmer: "Farmer",
      heroSubtitle:
        "An intelligent, modern agricultural command center for farm planning, real-time AI crop diagnostics, and equipment marketplace.",
      askAI: "Open Agro AI ✦",
      viewActivities: "View Tasks",
      quickActions: "Workspace Navigation",
      recentActivities: "Recent Farm Activities",
      viewAll: "View All →",
      featuredEquipment: "Equipment Marketplace",
      noActivities: "No activities scheduled yet.",
      noListings: "No marketplace listings available.",
      aiAdvisorTitle: "Agro AI Assistant",
      aiAdvisorDesc: "Ask farming queries or scan crop images for instant disease diagnosis.",
      activitiesTitle: "Farm Activities",
      activitiesDesc: "Schedule, filter, and track farm operations from planting to harvest.",
      marketplaceTitle: "Farmer Marketplace",
      marketplaceDesc: "Browse, buy, sell, and rent tractors, implements, and tools.",
      weatherTitle: "Weather Advisory",
      weatherDesc: "Precise hyper-local forecasts, precipitation alerts, and field advice.",
      calculatorsTitle: "Farm Calculators",
      calculatorsDesc: "Calculate NPK fertilizer dosages, seed density, and yield profits.",
      communityTitle: "Regional Community",
      communityDesc: "Connect with verified agricultural peers in your home region.",
      statsActiveTasks: "Pending Tasks",
      statsMarketListings: "Active Listings",
      statsRegion: "Registered Region",
      statsCropHealth: "AI Model Status",
      readyStatus: "Online (ViT + Gemini)",
      aiTipTitle: "Agronomic Farming Insight",
      aiTipContent:
        "Ensure optimal field drainage prior to monsoon showers. Upload leaf photographs to Agro AI early if noticing yellowing or lesion spots.",
    },
    Telugu: {
      welcome: "అగ్రో AI కి స్వాగతం",
      farmer: "రైతు",
      heroSubtitle:
        "వ్యవసాయ ప్రణాళిక, నిజ-సమయ AI సహాయం మరియు యంత్రాల మార్కెట్‌ప్లేస్ కోసం స్మార్ట్ కేంద్రం.",
      askAI: "అగ్రో AI ని అడగండి ✦",
      viewActivities: "పనులు చూడండి",
      quickActions: "త్వరిత నావిగేషన్",
      recentActivities: "ఇటీవలి వ్యవసాయ కార్యకలాపాలు",
      viewAll: "అన్నీ చూడండి →",
      featuredEquipment: "మార్కెట్‌ప్లేస్ పరికరాలు",
      noActivities: "ఇంకా ఎలాంటి పనులు షెడ్యూల్ చేయలేదు.",
      noListings: "మార్కెట్‌ప్లేస్‌లో ఇంకా లిస్టింగ్‌లు లేవు.",
      aiAdvisorTitle: "అగ్రో AI అసిస్టెంట్",
      aiAdvisorDesc: "వ్యవసాయ ప్రశ్నలు అడగండి లేదా తెగుళ్లను గుర్తించడానికి ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి.",
      activitiesTitle: "వ్యవసాయ పనులు",
      activitiesDesc: "నాట్లు, నీటిపారుదల, ఎరువులు మరియు కోత పనులను ట్రాక్ చేయండి.",
      marketplaceTitle: "రైతు మార్కెట్",
      marketplaceDesc: "ట్రాక్టర్లు మరియు పరికరాలను కొనండి, అమ్మండి లేదా అద్దెకు తీసుకోండి.",
      weatherTitle: "వాతావరణ సమాచారం",
      weatherDesc: "వర్షపాతం, ఉష్ణోగ్రత మరియు వ్యవసాయ వాతావరణ అంచనాలు.",
      calculatorsTitle: "కాలిక్యులేటర్లు",
      calculatorsDesc: "ఎరువులు, విత్తనాలు మరియు లాభాల లెక్కలు.",
      communityTitle: "ప్రాంతీయ కమ్యూనిటీ",
      communityDesc: "మీ ప్రాంత రైతులందరితో చర్చించండి మరియు సలహాలు పంచుకోండి.",
      statsActiveTasks: "బాకీ ఉన్న పనులు",
      statsMarketListings: "మార్కెట్ లిస్టింగ్‌లు",
      statsRegion: "మీ ప్రాంతం",
      statsCropHealth: "AI స్థితి",
      readyStatus: "సిద్ధంగా ఉంది",
      aiTipTitle: "నేటి వ్యవసాయ చిట్కా",
      aiTipContent:
        "భారీ వర్షాల సమయంలో వేరు కుళ్లు రాకుండా సరైన నీటి పారుదల కల్పించండి.",
    },
    Hindi: {
      welcome: "एग्रो AI में आपका स्वागत है",
      farmer: "किसान",
      heroSubtitle:
        "कृषि योजना, वास्तविक समय AI सहायता और उपकरण बाज़ार के लिए स्मार्ट कार्यक्षेत्र।",
      askAI: "एग्रो AI से पूछें ✦",
      viewActivities: "गतिविधियाँ देखें",
      quickActions: "त्वरित नेविगेशन",
      recentActivities: "हाल की गतिविधियाँ",
      viewAll: "सभी देखें →",
      featuredEquipment: "उपकरण बाज़ार",
      noActivities: "अभी कोई गतिविधि निर्धारित नहीं है।",
      noListings: "मार्केटप्लेस में कोई लिस्टिंग उपलब्ध नहीं है।",
      aiAdvisorTitle: "एग्रो AI सहायक",
      aiAdvisorDesc: "कृषि प्रश्न पूछें या फसल रोग पहचान के लिए तस्वीर अपलोड करें।",
      activitiesTitle: "कृषि कार्य",
      activitiesDesc: "बुवाई, सिंचाई, खाद और कटाई कार्यों को ट्रैक करें।",
      marketplaceTitle: "किसान मार्केटप्लेस",
      marketplaceDesc: "ट्रैक्टर और उपकरण खरीदें, बेचें या किराए पर लें।",
      weatherTitle: "मौसम सलाह",
      weatherDesc: "सटीक स्थानीय पूर्वानुमान और वर्षा अलर्ट प्राप्त करें।",
      calculatorsTitle: "कृषि कैलकुलेटर",
      calculatorsDesc: "खाद, बीज घनत्व और उपज लाभ की गणना करें।",
      communityTitle: "क्षेत्रीय समुदाय",
      communityDesc: "अपने क्षेत्र के साथी किसानों से जुड़ें।",
      statsActiveTasks: "लंबित कार्य",
      statsMarketListings: "सक्रिय लिस्टिंग",
      statsRegion: "पंजीकृत क्षेत्र",
      statsCropHealth: "AI स्थिति",
      readyStatus: "सक्रिय (ViT + Gemini)",
      aiTipTitle: "आज का कृषि सुझाव",
      aiTipContent:
        "मानसून से पहले खेतों में उचित जल निकासी सुनिश्चित करें।",
    },
  };

  const t = translations[language] || translations.English;

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [activitiesResponse, listingsResponse] = await Promise.allSettled([
          API.get("/activities"),
          API.get("/listings"),
        ]);

        if (isMounted) {
          if (
            activitiesResponse.status === "fulfilled" &&
            activitiesResponse.value.data?.activities
          ) {
            setActivities(activitiesResponse.value.data.activities.slice(0, 4));
          } else {
            setActivities(sampleActivities.slice(0, 4));
          }

          if (
            listingsResponse.status === "fulfilled" &&
            listingsResponse.value.data?.listings
          ) {
            setListings(listingsResponse.value.data.listings.slice(0, 3));
          } else {
            setListings(sampleListings.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Dashboard data load error:", error);
        if (isMounted) {
          setActivities(sampleActivities.slice(0, 4));
          setListings(sampleListings.slice(0, 3));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingTasksCount = activities.filter((a) => a.status === "Pending").length;
  const activeListingsCount = listings.length;
  const farmerName = user?.name || t.farmer;
  const userRegion = user?.region || user?.district || "India";

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* =========================================================
          HERO BANNER
      ========================================================= */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        {/* Cover Graphic Banner */}
        <div className="relative h-48 w-full overflow-hidden border-b border-neutral-200/60 bg-emerald-950 sm:h-64">
          <img
            src={farmBanner}
            alt="Farm Landscape"
            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="px-6 py-6 sm:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl md:text-3xl">
                {t.welcome}, <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{farmerName}</span>
              </h1>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/ai-chat"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
              >
                <span>{t.askAI}</span>
              </Link>
              <Link
                to="/activities"
                className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-emerald-700"
              >
                <span>{t.viewActivities}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FARMING INSIGHT CALLOUT (Green Agricultural Accent)
      ========================================================= */}
      <section className="notion-callout">
        <span className="text-base shrink-0">🌿</span>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
            {t.aiTipTitle}
          </h4>
          <p className="mt-0.5 text-xs text-emerald-800/90 dark:text-emerald-400/90 leading-relaxed">
            {t.aiTipContent}
          </p>
        </div>
      </section>

      {/* =========================================================
          KEY METRICS ROW (Green Agricultural Highlights)
      ========================================================= */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              ✓
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Tasks
            </span>
          </div>
          <p className="mt-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            {t.statsActiveTasks}
          </p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            {pendingTasksCount}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              🛒
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Market
            </span>
          </div>
          <p className="mt-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            {t.statsMarketListings}
          </p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            {activeListingsCount}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              📍
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Region
            </span>
          </div>
          <p className="mt-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            {t.statsRegion}
          </p>
          <p className="mt-0.5 truncate text-base font-bold tracking-tight text-neutral-950 dark:text-white">
            {userRegion}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              🌱
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live
            </span>
          </div>
          <p className="mt-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            {t.statsCropHealth}
          </p>
          <p className="mt-0.5 truncate text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {t.readyStatus}
          </p>
        </div>
      </div>

      {/* =========================================================
          WORKSPACE NAVIGATION TILES
      ========================================================= */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {t.quickActions}
        </h3>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: AI */}
          <Link
            to="/ai-chat"
            className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-600"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                ✦
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                    {t.aiAdvisorTitle}
                  </h4>
                  <span className="text-xs text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-600">
                    →
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {t.aiAdvisorDesc}
                </p>
              </div>
            </div>
          </Link>

          {/* Card 2: Tasks */}
          <Link
            to="/activities"
            className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-600"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                ✓
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                    {t.activitiesTitle}
                  </h4>
                  <span className="text-xs text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-600">
                    →
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {t.activitiesDesc}
                </p>
              </div>
            </div>
          </Link>

          {/* Card 3: Marketplace */}
          <Link
            to="/marketplace"
            className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-600"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                🛒
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                    {t.marketplaceTitle}
                  </h4>
                  <span className="text-xs text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-600">
                    →
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {t.marketplaceDesc}
                </p>
              </div>
            </div>
          </Link>

          {/* Card 4: Weather */}
          <Link
            to="/weather"
            className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-600"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                ☁️
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                    {t.weatherTitle}
                  </h4>
                  <span className="text-xs text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-600">
                    →
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {t.weatherDesc}
                </p>
              </div>
            </div>
          </Link>

          {/* Card 5: Calculators */}
          <Link
            to="/calculators"
            className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-600"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                ⊞
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                    {t.calculatorsTitle}
                  </h4>
                  <span className="text-xs text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-600">
                    →
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {t.calculatorsDesc}
                </p>
              </div>
            </div>
          </Link>

          {/* Card 6: Community */}
          <Link
            to="/community"
            className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-600"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-base text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                💬
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                    {t.communityTitle}
                  </h4>
                  <span className="text-xs text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-600">
                    →
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {t.communityDesc}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================
          RECENT ACTIVITIES & FEATURED EQUIPMENT
      ========================================================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Column 1: Recent Farm Activities */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {t.recentActivities}
            </h3>
            <Link
              to="/activities"
              className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {t.viewAll}
            </Link>
          </div>

          <div className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {activities.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-400">
                {t.noActivities}
              </p>
            ) : (
              activities.map((a) => (
                <div key={a._id || a.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-neutral-900 dark:text-white">
                        {a.title}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {a.type} • {a.date ? new Date(a.date).toLocaleDateString() : "Scheduled"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      a.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Equipment Marketplace */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {t.featuredEquipment}
            </h3>
            <Link
              to="/marketplace"
              className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {t.viewAll}
            </Link>
          </div>

          <div className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {listings.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-400">
                {t.noListings}
              </p>
            ) : (
              listings.map((l) => (
                <div key={l._id || l.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-[10px] dark:border-neutral-700 dark:bg-neutral-800">
                      🚜
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-neutral-900 dark:text-white">
                        {l.title}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {l.category} • 📍 {l.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-neutral-950 dark:text-white">
                      ₹{Number(l.price || 0).toLocaleString()}
                    </p>
                    <span className="text-[9px] font-semibold uppercase text-emerald-700 dark:text-emerald-400">
                      {l.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;