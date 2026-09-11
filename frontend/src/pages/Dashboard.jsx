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
    Tamil: {
      welcome: "அக்ரோ AI-க்கு நல்வரவு",
      farmer: "விவசாயி",
      heroSubtitle: "விவசாய திட்டமிடல், நேரடி AI பயிர் நோய் கண்டறிதல் மற்றும் உபகரண சந்தைக்கான ஸ்மார்ட் விவசாய மையம்.",
      askAI: "அக்ரோ AI-யை கேளுங்கள் ✦",
      viewActivities: "பணிகளைப் பார்க்கவும்",
      quickActions: "விரைவு வழிசெலுத்தல்",
      recentActivities: "சமீபத்திய பண்ணைப் பணிகள்",
      viewAll: "அனைத்தையும் காண்க →",
      featuredEquipment: "உபகரண சந்தை",
      noActivities: "பணிகள் எதுவும் திட்டமிடப்படவில்லை.",
      noListings: "சந்தை பட்டியல்கள் எதுவும் இல்லை.",
      aiAdvisorTitle: "அக்ரோ AI உதவியாளர்",
      aiAdvisorDesc: "விவசாய கேள்விகள் கேட்கவும் அல்லது பயிர் நோய்களை கண்டறிய இலை புகைப்படத்தை பதிவேற்றவும்.",
      activitiesTitle: "பண்ணைப் பணிகள்",
      activitiesDesc: "விதைப்பு, நீர்ப்பாசனம், உரம் மற்றும் அறுவடை பணிகளை கண்காணிக்கவும்.",
      marketplaceTitle: "உழவர் சந்தை",
      marketplaceDesc: "டிராக்டர்கள் மற்றும் உபகரணங்களை வாங்கவும், விற்கவும் அல்லது வாடகைக்கு எடுக்கவும்.",
      weatherTitle: "வானிலை ஆலோசனை",
      weatherDesc: "துல்லியமான உள்ளூர் முன்னறிவிப்பு மற்றும் மழை எச்சரிக்கைகள்.",
      calculatorsTitle: "பண்ணை கணக்கீடுகள்",
      calculatorsDesc: "உர அளவுகள், விதை அடர்த்தி மற்றும் மகசூல் லாபத்தை கணக்கிடுங்கள்.",
      communityTitle: "பிராந்திய சமூகம்",
      communityDesc: "உங்கள் பகுதியில் உள்ள விவசாயிகளுடன் இணைந்திருங்கள்.",
      statsActiveTasks: "நிலுவையில் உள்ள பணிகள்",
      statsMarketListings: "செயலில் உள்ள பட்டியல்கள்",
      statsRegion: "பதிவுசெய்த பகுதி",
      statsCropHealth: "AI நிலை",
      readyStatus: "ஆன்லைன் (ViT + Gemini)",
      aiTipTitle: "இன்றைய விவசாய குறிப்பு",
      aiTipContent: "மழைக்காலத்திற்கு முன் வயலில் முறையான வடிகால் வசதி இருப்பதை உறுதி செய்யுங்கள்.",
    },
    Kannada: {
      welcome: "ಅಗ್ರೋ AI ಗೆ ಸುಸ್ವಾಗತ",
      farmer: "ರೈತ",
      heroSubtitle: "ಕೃಷಿ ಯೋಜನೆ, ನೈಜ-ಸಮಯದ AI ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಉಪಕರಣಗಳ ಮಾರುಕಟ್ಟೆಗಾಗಿ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ.",
      askAI: "ಅಗ್ರೋ AI ಕೇಳಿ ✦",
      viewActivities: "ಕಾರ್ಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      quickActions: "ತ್ವರಿತ ನ್ಯಾವಿಗೇಷನ್",
      recentActivities: "ಇತ್ತೀಚಿನ ಕೃಷಿ ಕಾರ್ಯಗಳು",
      viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ →",
      featuredEquipment: "ಉಪಕರಣ ಮಾರುಕಟ್ಟೆ",
      noActivities: "ಯಾವುದೇ ಕಾರ್ಯಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ.",
      noListings: "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಯಾವುದೇ ಪಟ್ಟಿಗಳಿಲ್ಲ.",
      aiAdvisorTitle: "ಅಗ್ರೋ AI ಸಹಾಯಕ",
      aiAdvisorDesc: "ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಅಥವಾ ರೋಗ ಪತ್ತೆಗಾಗಿ ಬೆಳೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      activitiesTitle: "ಕೃಷಿ ಕಾರ್ಯಗಳು",
      activitiesDesc: "ಬಿತ್ತನೆ, ನೀರಾವರಿ, ರಸಗೊಬ್ಬರ ಮತ್ತು ಕೊಯ್ಲು ಕಾರ್ಯಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
      marketplaceTitle: "ರೈತರ ಮಾರುಕಟ್ಟೆ",
      marketplaceDesc: "ಟ್ರಾಕ್ಟರ್ ಮತ್ತು ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳನ್ನು ಖರೀದಿಸಿ, ಮಾರಿ ಅಥವಾ ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ.",
      weatherTitle: "ಹವಾಮಾನ ಸಲಹೆ",
      weatherDesc: "ನಿಖರವಾದ ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಮಳೆ ಎಚ್ಚರಿಕೆಗಳು.",
      calculatorsTitle: "ಕೃಷಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು",
      calculatorsDesc: "ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ, ಬೀಜ ಸಾಂದ್ರತೆ ಮತ್ತು ಇಳುವರಿ ಲಾಭವನ್ನು ಲೆಕ್ಕಹಾಕಿ.",
      communityTitle: "ಪ್ರಾದೇಶಿಕ ಸಮುದಾಯ",
      communityDesc: "ನಿಮ್ಮ ಭಾಗದ ರೈತರೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ.",
      statsActiveTasks: "ಬಾಕಿ ಇರುವ ಕಾರ್ಯಗಳು",
      statsMarketListings: "ಸಕ್ರಿಯ ಪಟ್ಟಿಗಳು",
      statsRegion: "ನೋಂದಾಯಿತ ಪ್ರದೇಶ",
      statsCropHealth: "AI ಸ್ಥಿತಿ",
      readyStatus: "ಆನ್‌ಲೈನ್ (ViT + Gemini)",
      aiTipTitle: "ಇಂದಿನ ಕೃಷಿ ಸಲಹೆ",
      aiTipContent: "ಮುಂಗಾರು ಮಳೆಗೂ ಮುನ್ನ ಹೊಲದಲ್ಲಿ ಸರಿಯಾದ ನೀರು ಹರಿದುಹೋಗುವ ವ್ಯವಸ್ಥೆ ಮಾಡಿಕೊಳ್ಳಿ.",
    },
    Malayalam: {
      welcome: "അഗ്രോ AI-ലേക്ക് സ്വാഗതം",
      farmer: "കർഷകൻ",
      heroSubtitle: "കാർഷിക ആസൂത്രണം, തത്സമയ AI വിള രോഗനിർണയം, ഉപകരണ വിപണി എന്നിവയ്ക്കുള്ള സ്മാർട്ട് പ്ലാറ്റ്‌ഫോം.",
      askAI: "അഗ്രോ AI ചോദിക്കൂ ✦",
      viewActivities: "ജോലികൾ കാണുക",
      quickActions: "ദ്രുത നാവിഗേഷൻ",
      recentActivities: "സമീപകാല കാർഷിക പ്രവർത്തനങ്ങൾ",
      viewAll: "എല്ലാം കാണുക →",
      featuredEquipment: "ഉപകരണ മാർക്കറ്റ്",
      noActivities: "ഇതുവരെ ജോലികളൊന്നും ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല.",
      noListings: "വിപണി ലിസ്റ്റിംഗുകൾ ലഭ്യമല്ല.",
      aiAdvisorTitle: "അഗ്രോ AI അസിസ്റ്റന്റ്",
      aiAdvisorDesc: "കൃഷി സംശയങ്ങൾ ചോദിക്കുക അല്ലെങ്കിൽ രോഗനിർണയത്തിനായി ഇലയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
      activitiesTitle: "കൃഷി ജോലികൾ",
      activitiesDesc: "നടീൽ, നനയ്ക്കൽ, വളപ്രയോഗം, വിളവെടുപ്പ് എന്നിവ ട്രാക്ക് ചെയ്യുക.",
      marketplaceTitle: "കർഷക വിപണി",
      marketplaceDesc: "ട്രാക്ടറുകളും ഉപകരണങ്ങളും വാങ്ങുക, വിൽക്കുക അല്ലെങ്കിൽ വാടകയ്‌ക്കെടുക്കുക.",
      weatherTitle: "കാലാവസ്ഥാ മുന്നറിയിപ്പ്",
      weatherDesc: "പ്രാദേശിക കാലാവസ്ഥാ പ്രവചനങ്ങളും മഴ അലേർട്ടുകളും.",
      calculatorsTitle: "കാർഷിക കാൽക്കുലേറ്ററുകൾ",
      calculatorsDesc: "വളത്തിന്റെ അളവ്, വിത്തിന്റെ സാന്ദ്രത, വിള ലാഭം എന്നിവ കണക്കാക്കുക.",
      communityTitle: "കർഷക കൂട്ടായ്മ",
      communityDesc: "നിങ്ങളുടെ പ്രദേശത്തെ കർഷകരുമായി ബന്ധപ്പെടുക.",
      statsActiveTasks: "ബാക്കി നിൽക്കുന്ന ജോലികൾ",
      statsMarketListings: "സജീവ ലിസ്റ്റിംഗുകൾ",
      statsRegion: "രജിസ്റ്റർ ചെയ്ത പ്രദേശം",
      statsCropHealth: "AI നില",
      readyStatus: "ഓൺ‌ലൈൻ (ViT + Gemini)",
      aiTipTitle: "ഇന്നത്തെ കാർഷിക ടിപ്പ്",
      aiTipContent: "മഴക്കാലത്തിന് മുമ്പ് കൃഷിയിടത്തിൽ ശരിയായ നീർവാർച്ചാ സൗകര്യം ഉറപ്പാക്കുക.",
    },
    Marathi: {
      welcome: "ॲग्रो AI मध्ये आपले स्वागत आहे",
      farmer: "शेतकरी",
      heroSubtitle: "शेती नियोजन, रिअल-टाइम AI पीक रोग निदान आणि उपकरण बाजारासाठी आधुनिक कृषी व्यासपीठ.",
      askAI: "ॲग्रो AI ला विचारा ✦",
      viewActivities: "कामे पहा",
      quickActions: "द्रुत नेव्हिगेशन",
      recentActivities: "अलीकडील शेतीची कामे",
      viewAll: "सर्व पहा →",
      featuredEquipment: "उपकरणे बाजार",
      noActivities: "कोणतीही कामे नियोजित नाहीत.",
      noListings: "बाजारात कोणतीही लिस्टिंग उपलब्ध नाही.",
      aiAdvisorTitle: "ॲग्रो AI सल्लागार",
      aiAdvisorDesc: "शेतीविषयक प्रश्न विचारा किंवा रोग निदानासाठी पानांचा फोटो अपलोड करा.",
      activitiesTitle: "शेतीची कामे",
      activitiesDesc: "पेरणी, सिंचन, खत आणि कापणीच्या कामांचा मागोवा घ्या.",
      marketplaceTitle: "शेतकरी बाजार",
      marketplaceDesc: "ट्रॅक्टर आणि अवजारे खरेदी करा, विका किंवा भाड्याने घ्या.",
      weatherTitle: "हवामान सल्ला",
      weatherDesc: "अचूक स्थानिक अंदाज आणि पावसाचा इशारा मिळवा.",
      calculatorsTitle: "कृषी कॅल्क्युलेटर",
      calculatorsDesc: "खतांची मात्रा, बियाणे घनता आणि नफा मोजा.",
      communityTitle: "प्रादेशिक समुदाय",
      communityDesc: "आपल्या परिसरातील शेतकरी मित्रांशी जोडून राहा.",
      statsActiveTasks: "प्रलंबित कामे",
      statsMarketListings: "सक्रिय लिस्टिंग",
      statsRegion: "नोंदणीकृत प्रदेश",
      statsCropHealth: "AI स्थिती",
      readyStatus: "ऑनलाइन (ViT + Gemini)",
      aiTipTitle: "आजचा कृषी सल्ला",
      aiTipContent: "पावसाळ्यापूर्वी शेतात पाण्याचा योग्य निचरा होईल याची खात्री करा.",
    },
    Gujarati: {
      welcome: "એગ્રો AI માં આપનું સ્વાગત છે",
      farmer: "ખેડૂત",
      heroSubtitle: "ખેતી આયોજન, વાસ્તવિક સમય AI પાક રોગ નિદાન અને સાધનોના બજાર માટે આધુનિક કૃષિ પ્લેટફોર્મ.",
      askAI: "એગ્રો AI ને પૂછો ✦",
      viewActivities: "કામો જુઓ",
      quickActions: "ઝડપી નેવિગેશન",
      recentActivities: "તાજેતરની ખેતી પ્રવૃત્તિઓ",
      viewAll: "બધા જુઓ →",
      featuredEquipment: "સાધન બજાર",
      noActivities: "હજુ કોઈ કામ નિર્ધારિત નથી.",
      noListings: "બજારમાં કોઈ લિસ્ટિંગ ઉપલબ્ધ નથી.",
      aiAdvisorTitle: "એગ્રો AI સહાયક",
      aiAdvisorDesc: "ખેતી સંબંધિત પ્રશ્નો પૂછો અથવા રોગ નિદાન માટે પાનનો ફોટો અપલોડ કરો.",
      activitiesTitle: "ખેતી કાર્યો",
      activitiesDesc: "વાવણી, પિયત, ખાતર અને લણણીના કામોને ટ્રેક કરો.",
      marketplaceTitle: "ખેડૂત માર્કેટપ્લેસ",
      marketplaceDesc: "ટ્રેક્ટર અને કૃષિ સાધનો ખરીદો, વેચો અથવા ભાડે આપો.",
      weatherTitle: "હવામાન સલાહ",
      weatherDesc: "સચોટ સ્થાનિક હવામાન આગાહી અને વરસાદની ચેતવણી.",
      calculatorsTitle: "કૃષિ કેલ્ક્યુલેટર",
      calculatorsDesc: "ખાતર માત્રા, બીજ દર અને નફાની ગણતરી કરો.",
      communityTitle: "પ્રાદેશિક સમુદાય",
      communityDesc: "તમારા વિસ્તારના સાથી ખેડૂતો સાથે જોડાઓ.",
      statsActiveTasks: "બાકી કામો",
      statsMarketListings: "સક્રિય લિસ્ટિંગ",
      statsRegion: "નોંધાયેલ વિસ્તાર",
      statsCropHealth: "AI સ્થિતિ",
      readyStatus: "ઓનલાઇન (ViT + Gemini)",
      aiTipTitle: "આજની કૃષિ સલાહ",
      aiTipContent: "ચોમાસા પહેલા ખેતરમાં પાણીના યોગ્ય નિકાલની વ્યવસ્થા કરો.",
    },
    Bengali: {
      welcome: "এগ্রো AI-তে স্বাগতম",
      farmer: "কৃষক",
      heroSubtitle: "কৃষি পরিকল্পনা, রিয়েল-টাইম AI ফসল রোগ নির্ণয় এবং সরঞ্জাম বাজারের জন্য আধুনিক প্ল্যাটফর্ম।",
      askAI: "এগ্রো AI-কে জিজ্ঞাসা করুন ✦",
      viewActivities: "কাজ দেখুন",
      quickActions: "দ্রুত নেভিগেশন",
      recentActivities: "সাম্প্রতিক খামারের কাজ",
      viewAll: "সব দেখুন →",
      featuredEquipment: "কৃষি সরঞ্জাম বাজার",
      noActivities: "এখনও কোনও কাজ নির্ধারিত নেই।",
      noListings: "মার্কেটপ্লেসে কোনও তালিকা উপলব্ধ নেই।",
      aiAdvisorTitle: "এগ্রো AI সহকারী",
      aiAdvisorDesc: "কৃষি বিষয়ক প্রশ্ন জিজ্ঞাসা করুন বা রোগ নির্ণয়ের জন্য পাতার ছবি আপলোড করুন।",
      activitiesTitle: "খামারের কাজ",
      activitiesDesc: "বপন, সেচ, সার প্রয়োগ এবং ফসল কাটার কাজ ট্র্যাক করুন।",
      marketplaceTitle: "কৃষক মার্কেটপ্লেস",
      marketplaceDesc: "ট্র্যাক্টর ও কৃষি যন্ত্রপাতি কিনুন, বিক্রি করুন বা ভাড়ায় নিন।",
      weatherTitle: "আবহাওয়া পরামর্শ",
      weatherDesc: "সঠিক স্থানীয় পূর্বাভাস এবং বৃষ্টিপাতের সতর্কতা।",
      calculatorsTitle: "কৃষি ক্যালকুলেটর",
      calculatorsDesc: "সার প্রয়োগের মাত্রা, বীজের ঘনত্ব এবং ফলন মুনাফা হিসাব করুন।",
      communityTitle: "আঞ্চলিক কমিউনিটি",
      communityDesc: "আপনার এলাকার কৃষক বন্ধুদের সাথে যুক্ত থাকুন।",
      statsActiveTasks: "বকেয়া কাজ",
      statsMarketListings: "সক্রিয় তালিকা",
      statsRegion: "নিবন্ধিত অঞ্চল",
      statsCropHealth: "AI অবস্থা",
      readyStatus: "অনলাইন (ViT + Gemini)",
      aiTipTitle: "আজকের কৃষি পরামর্শ",
      aiTipContent: "বর্ষার আগে জমিতে সঠিক জল নিষ্কাশনের ব্যবস্থা নিশ্চিত করুন।",
    },
    Punjabi: {
      welcome: "ਐਗਰੋ AI ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
      farmer: "ਕਿਸਾਨ",
      heroSubtitle: "ਖੇਤੀ ਯੋਜਨਾਬੰਦੀ, ਰੀਅਲ-ਟਾਈਮ AI ਫਸਲ ਰੋਗ ਜਾਂਚ ਅਤੇ ਸੰਦਾਂ ਦੀ ਮੰਡੀ ਲਈ ਸਮਾਰਟ ਪਲੇਟਫਾਰਮ।",
      askAI: "ਐਗਰੋ AI ਤੋਂ ਪੁੱਛੋ ✦",
      viewActivities: "ਕੰਮ ਵੇਖੋ",
      quickActions: "ਤੇਜ਼ ਨੇਵੀਗੇਸ਼ਨ",
      recentActivities: "ਤਾਜ਼ਾ ਖੇਤੀਬਾੜੀ ਗਤੀਵਿਧੀਆਂ",
      viewAll: "ਸਾਰੇ ਵੇਖੋ →",
      featuredEquipment: "ਸੰਦਾਂ ਦੀ ਮੰਡੀ",
      noActivities: "ਅਜੇ ਕੋਈ ਕੰਮ ਤੈਅ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
      noListings: "ਮਾਰਕੀਟ ਵਿੱਚ ਕੋਈ ਲਿਸਟਿੰਗ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
      aiAdvisorTitle: "ਐਗਰੋ AI ਸਹਾਇਕ",
      aiAdvisorDesc: "ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ ਲਈ ਪੱਤੇ ਦੀ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ।",
      activitiesTitle: "ਖੇਤੀਬਾੜੀ ਕੰਮ",
      activitiesDesc: "ਬਿਜਾਈ, ਸਿੰਚਾਈ, ਖਾਦ ਅਤੇ ਵਾਢੀ ਦੇ ਕੰਮਾਂ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ।",
      marketplaceTitle: "ਕਿਸਾਨ ਮਾਰਕੀਟਪਲੇਸ",
      marketplaceDesc: "ਟਰੈਕਟਰ ਅਤੇ ਖੇਤੀ ਸੰਦ ਖਰੀਦੋ, ਵੇਚੋ ਜਾਂ ਕਿਰਾਏ 'ਤੇ ਲਓ।",
      weatherTitle: "ਮੌਸਮ ਸਲਾਹ",
      weatherDesc: "ਸਹੀ ਸਥਾਨਕ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਮੀਂਹ ਦੇ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ।",
      calculatorsTitle: "ਖੇਤੀਬਾੜੀ ਕੈਲਕੂਲੇਟਰ",
      calculatorsDesc: "ਖਾਦ ਦੀ ਮਾਤਰਾ, ਬੀਜ ਦਰ ਅਤੇ ਮੁਨਾਫੇ ਦਾ ਹਿਸਾਬ ਲਗਾਓ।",
      communityTitle: "ਖੇਤਰੀ ਭਾਈਚਾਰਾ",
      communityDesc: "ਆਪਣੇ ਇਲਾਕੇ ਦੇ ਕਿਸਾਨ ਸਾਥੀਆਂ ਨਾਲ ਜੁੜੋ।",
      statsActiveTasks: "ਬਾਕੀ ਕੰਮ",
      statsMarketListings: "ਸਰਗਰਮ ਲਿਸਟਿੰਗ",
      statsRegion: "ਰਜਿਸਟਰਡ ਖੇਤਰ",
      statsCropHealth: "AI ਸਥਿਤੀ",
      readyStatus: "ਆਨਲਾਈਨ (ViT + Gemini)",
      aiTipTitle: "ਅੱਜ ਦਾ ਖੇਤੀਬਾੜੀ ਸੁਝਾਅ",
      aiTipContent: "ਬਰਸਾਤਾਂ ਤੋਂ ਪਹਿਲਾਂ ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਦੇ ਨਿਕਾਸ ਦਾ ਸਹੀ ਪ੍ਰਬੰਧ ਯਕੀਨੀ ਬਣਾਓ।",
    },
    Odia: {
      welcome: "ଆଗ୍ରୋ AI କୁ ସ୍ୱାଗତ",
      farmer: "ଚାଷୀ",
      heroSubtitle: "କୃଷି ଯୋଜନା, ପ୍ରତ୍ୟକ୍ଷ AI ଫସଲ ରୋଗ ନିର୍ଣ୍ଣୟ ଏବଂ ଯନ୍ତ୍ରପାତି ବଜାର ପାଇଁ ସ୍ମାର୍ଟ କୃଷି ମଞ୍ଚ।",
      askAI: "ଆଗ୍ରୋ AI କୁ ପଚାରନ୍ତୁ ✦",
      viewActivities: "କାର୍ଯ୍ୟ ଦେଖନ୍ତୁ",
      quickActions: "ଶୀଘ୍ର ନେଭିଗେସନ",
      recentActivities: "ସାମ୍ପ୍ରତିକ ଚାଷ କାର୍ଯ୍ୟ",
      viewAll: "ସବୁ ଦେଖନ୍ତୁ →",
      featuredEquipment: "ଉପକରଣ ବଜାର",
      noActivities: "କୌଣସି କାର୍ଯ୍ୟ ଧାର୍ଯ୍ୟ ହୋଇନାହିଁ।",
      noListings: "ବଜାରରେ କୌଣସି ତାଲିକା ଉପଲବ୍ଧ ନାହିଁ।",
      aiAdvisorTitle: "ଆଗ୍ରୋ AI ସହାୟକ",
      aiAdvisorDesc: "ଚାଷ ବିଷୟରେ ପଚାରନ୍ତୁ କିମ୍ବା ରୋଗ ଚିହ୍ନଟ ପାଇଁ ପତ୍ରର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ।",
      activitiesTitle: "ଚାଷ କାର୍ଯ୍ୟ",
      activitiesDesc: "ବୁଣିବା, ଜଳସେଚନ, ଖତ ସାର ଏବଂ ଅମଳ କାର୍ଯ୍ୟ ଟ୍ରାକ୍ କରନ୍ତୁ।",
      marketplaceTitle: "ଚାଷୀ ମାର୍କେଟପ୍ଲେସ୍",
      marketplaceDesc: "ଟ୍ରାକ୍ଟର ଏବଂ କୃଷି ଯନ୍ତ୍ରପାତି କିଣନ୍ତୁ, ବିକ୍ରି କରନ୍ତୁ କିମ୍ବା ଭଡ଼ାରେ ନିଅନ୍ତୁ।",
      weatherTitle: "ପାଣିପାଗ ପରାମର୍ଶ",
      weatherDesc: "ସଠିକ୍ ସ୍ଥାନୀୟ ପୂର୍ବାନୁମାନ ଏବଂ ବର୍ଷା ସତର୍କତା।",
      calculatorsTitle: "କୃଷି କାଲକୁଲେଟର",
      calculatorsDesc: "ସାର ପ୍ରୟୋଗ, ବିହନ ହାର ଏବଂ ଲାଭ ଗଣନା କରନ୍ତୁ।",
      communityTitle: "ଆଞ୍ଚଳିକ ସମୁଦାୟ",
      communityDesc: "ଆପଣଙ୍କ ଅଞ୍ଚଳର ଚାଷୀ ଭାଇମାନଙ୍କ ସହ ଯୋଡ଼ି ହୁଅନ୍ତୁ।",
      statsActiveTasks: "ବାକି ଥିବା କାର୍ଯ୍ୟ",
      statsMarketListings: "ସକ୍ରିୟ ତାଲିକା",
      statsRegion: "ପଞ୍ଜୀକୃତ ଅଞ୍ଚଳ",
      statsCropHealth: "AI ସ୍ଥିତି",
      readyStatus: "ଅନଲାଇନ୍ (ViT + Gemini)",
      aiTipTitle: "ଆଜିର କୃଷି ପରାମର୍ଶ",
      aiTipContent: "ବର୍ଷା ଋତୁ ପୂର୍ବରୁ ଜମିରେ ଉତ୍ତମ ଜଳ ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା ନିଶ୍ଚିତ କରନ୍ତୁ।",
    },
    Assamese: {
      welcome: "এগ্ৰ’ AI লৈ স্বাগতম",
      farmer: "কৃষক",
      heroSubtitle: "কৃষি পৰিকল্পনা, প্ৰত্যক্ষ AI শস্য ৰোগ নিৰ্ণয় আৰু সঁজুলি বজাৰৰ বাবে স্মাৰ্ট মঞ্চ।",
      askAI: "এগ্ৰ’ AI ক সোধক ✦",
      viewActivities: "কাম চাওক",
      quickActions: "দ্ৰুত নেভিগেচন",
      recentActivities: "শেহতীয়া খেতিৰ কাম",
      viewAll: "সকলো চাওক →",
      featuredEquipment: "সঁজুলি বজাৰ",
      noActivities: "কোনো কাম নিৰ্ধাৰণ কৰা হোৱা নাই।",
      noListings: "বজাৰত কোনো তালিকা নাই।",
      aiAdvisorTitle: "এগ্ৰ’ AI সহায়ক",
      aiAdvisorDesc: "কৃষি সম্পৰ্কীয় প্ৰশ্ন সোধক বা ৰোগ নিৰ্ণয়ৰ বাবে পাতৰ ফটো দিয়ক।",
      activitiesTitle: "খেতিৰ কাম",
      activitiesDesc: "ৰোপণ, জলসিঞ্চন, সাৰ আৰু শস্য চপোৱাৰ কাম নিৰীক্ষণ কৰক।",
      marketplaceTitle: "কৃষক বজাৰ",
      marketplaceDesc: "ট্ৰেক্টৰ আৰু কৃষি সঁজুলি কিনক, বেচক বা ভাড়াত লওক।",
      weatherTitle: "বতৰৰ পৰামৰ্শ",
      weatherDesc: "সঠিক স্থানীয় পূৰ্বাভাস আৰু বৰষুণৰ সতৰ্কবাণী।",
      calculatorsTitle: "কৃষি কেলকুলেটৰ",
      calculatorsDesc: "সাৰৰ মাত্ৰা, বীজৰ ঘনত্ব আৰু লাভৰ হিচাপ কৰক।",
      communityTitle: "আঞ্চলিক সম্প্ৰদায়",
      communityDesc: "আপোনাৰ অঞ্চলৰ কৃষকসকলৰ লগত সংযোগ স্থাপন কৰক।",
      statsActiveTasks: "বাকী থকা কাম",
      statsMarketListings: "সক্ৰিয় তালিকা",
      statsRegion: "পঞ্জীভুক্ত অঞ্চল",
      statsCropHealth: "AI স্থিতি",
      readyStatus: "অনলাইন (ViT + Gemini)",
      aiTipTitle: "আজিৰ কৃষি পৰামৰ্শ",
      aiTipContent: "বাৰিষাৰ পূৰ্বে পথাৰত পানী নিষ্কাষণৰ উপযুক্ত ব্যৱস্থা নিশ্চিত কৰক।",
    },
    Urdu: {
      welcome: "ایگرو AI میں خوش آمدید",
      farmer: "کسان",
      heroSubtitle: "زرعی منصوبہ بندی، ریئل ٹائم AI فصل کی بیماری کی تشخیص اور آلات کی منڈی کا جدید پلیٹ فارم۔",
      askAI: "ایگرو AI سے پوچھیں ✦",
      viewActivities: "کام دیکھیں",
      quickActions: "فوری نیویگیشن",
      recentActivities: "حالیہ زرعی سرگرمیاں",
      viewAll: "سب دیکھیں →",
      featuredEquipment: "آلات کی منڈی",
      noActivities: "ابھی کوئی کام شیڈول نہیں ہے۔",
      noListings: "مارکیٹ میں کوئی فہرست دستیاب نہیں ہے۔",
      aiAdvisorTitle: "ایگرو AI اسسٹنٹ",
      aiAdvisorDesc: "کھیتی کے بارے میں سوالات پوچھیں یا بیماری کی تشخیص کے لیے پتے کی تصویر اپ لوڈ کریں۔",
      activitiesTitle: "کھیتی کے کام",
      activitiesDesc: "بوائی، آبپاشی، کھاد اور کٹائی کے کاموں پر نظر رکھیں۔",
      marketplaceTitle: "کسان مارکیٹ پلیس",
      marketplaceDesc: "ٹریکٹر اور زرعی آلات خریدیں، بیچیں یا کرائے پر حاصل کریں۔",
      weatherTitle: "موسمی ایڈوائزری",
      weatherDesc: "درست مقامی پیشین گوئی اور بارش کے الرٹس حاصل کریں۔",
      calculatorsTitle: "زرعی کیلکولیٹرز",
      calculatorsDesc: "کھاد کی خوراک، بیج کی کثافت اور فصل کے منافع کا حساب لگائیں۔",
      communityTitle: "علاقائی برادری",
      communityDesc: "اپنے علاقے کے کسان ساتھیوں سے جڑیں۔",
      statsActiveTasks: "زیر التواء کام",
      statsMarketListings: "فعال فہرستیں",
      statsRegion: "رجسٹرڈ علاقہ",
      statsCropHealth: "AI حیثیت",
      readyStatus: "آن لائن (ViT + Gemini)",
      aiTipTitle: "آج کا زرعی مشورہ",
      aiTipContent: "مون سون سے پہلے کھیت میں مناسب نکاسی آب کا انتظام یقینی بنائیں۔",
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