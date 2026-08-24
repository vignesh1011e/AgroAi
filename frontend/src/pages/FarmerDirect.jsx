import { useState, useEffect, useMemo } from "react";
import API from "../services/api";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";

function FarmerDirect() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [produceList, setProduceList] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeFarmers: 0,
    organicSharePercent: 0,
    middlemanCutSavedPercent: 35,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showMyListingsOnly, setShowMyListingsOnly] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: "", text: "" });

  // Interactive Profit Calculator State
  const [calcQty, setCalcQty] = useState(500);
  const [calcPrice, setCalcPrice] = useState(30);
  const [calcMarginPercent, setCalcMarginPercent] = useState(35);

  // Form State
  const initialFormState = {
    cropName: "",
    variety: "",
    category: "Vegetables",
    quantityAvailable: "",
    quantityUnit: "kg",
    pricePerUnit: "",
    distributorMarketPrice: "",
    minimumOrderQty: "1",
    harvestDate: "Freshly Harvested Today",
    farmLocation: user?.district ? `${user.district}, ${user.state || ""}` : "",
    farmingMethod: "Natural / ZBNF",
    deliveryOptions: ["Farm Gate Pickup", "Local Delivery (<30km)"],
    description: "",
    image: "",
    farmerPhone: user?.phone || "",
    farmerWhatsapp: user?.phone || "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);

  // Multilingual content dictionary
  const t = useMemo(() => {
    const dict = {
      English: {
        pageTitle: "Farmer Direct Produce Market",
        badge: "0% Middleman Commission",
        subtitle: "Sell directly from your farm to consumers, restaurants & bulk buyers at fair farmer-fixed prices.",
        statsTotalListings: "Direct Farm Listings",
        statsActiveFarmers: "Verified Farmers",
        statsOrganicShare: "Organic & Natural",
        statsSavedMargin: "Distributor Margin Saved",
        calcTitle: "Direct Farmer vs Middleman Profit Calculator",
        calcSubtitle: "See how much more revenue stays in your pocket by eliminating distributor cuts",
        calcHarvestQty: "Harvest Quantity (kg / units)",
        calcDirectPrice: "Your Direct Price (₹/unit)",
        calcMiddlemanCut: "Distributor Cut Avoided (%)",
        calcDirectEarnings: "Direct Farmer Revenue",
        calcDistributorEarnings: "Distributor Route Revenue",
        calcExtraProfit: "Extra Profit in Farmer's Pocket",
        searchPlaceholder: "Search crops, varieties, farm locations, or farmers...",
        allCategories: "All Produce",
        vegetables: "Vegetables",
        fruits: "Fruits",
        grains: "Grains & Cereals",
        pulses: "Pulses & Lentils",
        spices: "Spices & Herbs",
        organic: "Organic Produce",
        dairyHoney: "Dairy & Honey",
        other: "Other",
        allMethods: "All Methods",
        organicCertified: "Organic (Certified)",
        naturalZbnf: "Natural / ZBNF",
        conventional: "Conventional",
        hydroponic: "Hydroponic",
        listHarvestBtn: "+ List My Harvest",
        myListingsToggle: "My Harvests",
        allListingsToggle: "All Farm Produce",
        sortNewest: "Newest Harvest",
        sortPriceLow: "Price: Low to High",
        sortPriceHigh: "Price: High to Low",
        sortQtyHigh: "Quantity: High to Low",
        farmerPrice: "Direct Farm Price",
        distributorPrice: "Mandi/Retail Price",
        savePercent: "Save",
        availableQty: "Available Stock",
        minOrder: "Min Order",
        harvestFreshness: "Harvested",
        directWhatsapp: "WhatsApp Order",
        callFarmer: "Call Farmer",
        viewDetails: "View Details",
        noProduceFound: "No farm produce listings match your criteria.",
        modalCreateTitle: "List Your Harvest for Direct Sale",
        modalEditTitle: "Update Harvest Listing",
        cropNameLabel: "Crop Name * (e.g. Desi Tomatoes, Sona Masoori)",
        varietyLabel: "Variety / Strain",
        categoryLabel: "Category *",
        farmingMethodLabel: "Farming Method *",
        qtyLabel: "Quantity Available *",
        unitLabel: "Unit *",
        priceLabel: "Direct Farmer Price (₹) *",
        mandiPriceLabel: "Distributor / Market Comparison Price (₹)",
        minOrderLabel: "Minimum Order Qty",
        harvestDateLabel: "Harvest Date / Freshness",
        farmLocationLabel: "Farm Location (Village, District, State) *",
        deliveryOptionsLabel: "Delivery & Pickup Options",
        descriptionLabel: "Harvest Description & Quality Highlights",
        photoLabel: "Produce Photo",
        farmerPhoneLabel: "Contact Phone *",
        farmerWhatsappLabel: "WhatsApp Number for Inquiries *",
        cancelBtn: "Cancel",
        saveListingBtn: "Publish Harvest",
        updateListingBtn: "Save Changes",
        editBtn: "Edit",
        deleteBtn: "Delete",
        markSoldOut: "Mark Sold Out",
        markAvailable: "Mark Available",
        statusAvailable: "Available",
        statusSoldOut: "Sold Out",
      },
      Telugu: {
        pageTitle: "రైతు ప్రత్యక్ష పంట విక్రయ బజార్",
        badge: "0% దళారీ కమీషన్ (రైతుకే పూర్తి లాభం)",
        subtitle: "దళారులు, డిస్ట్రిబ్యూటర్లు లేకుండా మీ పంటను నేరుగా వినియోగదారులకు, హోల్‌సేల్ వ్యాపారులకు విక్రయించండి.",
        statsTotalListings: "ప్రత్యక్ష పంట జాబితాలు",
        statsActiveFarmers: "నమోదైన రైతులు",
        statsOrganicShare: "సేంద్రీయ & ప్రకృతి వ్యవసాయం",
        statsSavedMargin: "ఆదా అయిన దళారీ కమీషన్",
        calcTitle: "రైతు ప్రత్యక్ష లాభాల కాలిక్యులేటర్",
        calcSubtitle: "దళారుల కమీషన్ లేకుండా మీ జేబులో ఎంత ఎక్కువ ఆదాయం మిగులుతుందో చూడండి",
        calcHarvestQty: "పంట పరిమాణం (కేజీలు / యూనిట్లు)",
        calcDirectPrice: "మీ ప్రత్యక్ష ధర (₹/యూనిట్)",
        calcMiddlemanCut: "దళారీ తీసుకునే కమీషన్ శాతం (%)",
        calcDirectEarnings: "ప్రత్యక్ష విక్రయ ఆదాయం",
        calcDistributorEarnings: "దళారుల మార్గంలో వచ్చేది",
        calcExtraProfit: "రైతుకు లభించే అదనపు లాభం",
        searchPlaceholder: "పంట పేరు, రకం, గ్రామం లేదా రైతు పేరును వెతకండి...",
        allCategories: "అన్ని పంటలు",
        vegetables: "కూరగాయలు",
        fruits: "పండ్లు",
        grains: "ధాన్యాలు & బియ్యం",
        pulses: "పప్పు ధాన్యాలు",
        spices: "సుగంధ ద్రవ్యాలు & పసుపు",
        organic: "సేంద్రీయ ఉత్పత్తులు",
        dairyHoney: "పాల ఉత్పత్తులు & స్వచ్ఛమైన తేనె",
        other: "ఇతరాలు",
        allMethods: "అన్ని పద్ధతులు",
        organicCertified: "సేంద్రీయ (ధృవీకరించబడినది)",
        naturalZbnf: "ప్రకృతి వ్యవసాయం (ZBNF)",
        conventional: "సాంప్రదాయ",
        hydroponic: "హైడ్రోపోనిక్",
        listHarvestBtn: "+ నా పంటను అమ్మండి",
        myListingsToggle: "నా పంటలు",
        allListingsToggle: "అన్ని ఉత్పత్తులు",
        sortNewest: "తాజా కోత",
        sortPriceLow: "ధర: తక్కువ నుండి ఎక్కువ",
        sortPriceHigh: "ధర: ఎక్కువ నుండి తక్కువ",
        sortQtyHigh: "నిల్వ: ఎక్కువ నుండి తక్కువ",
        farmerPrice: "రైతు ప్రత్యక్ష ధర",
        distributorPrice: "మార్కెట్/దళారీ ధర",
        savePercent: "ఆదా",
        availableQty: "అందుబాటులో ఉన్న నిల్వ",
        minOrder: "కనిష్ట ఆర్డర్",
        harvestFreshness: "కోత సమయం",
        directWhatsapp: "WhatsApp ఆర్డర్",
        callFarmer: "రైతుకు కాల్ చేయండి",
        viewDetails: "వివరాలు చూడండి",
        noProduceFound: "ఈ వర్గంలో పంటలు అందుబాటులో లేవు.",
        modalCreateTitle: "మీ పంటను ప్రత్యక్షంగా అమ్మకానికి పెట్టండి",
        modalEditTitle: "పంట వివరాలను సవరించండి",
        cropNameLabel: "పంట పేరు * (ఉదా: నాటు టమోటాలు, సోనా మసూరి)",
        varietyLabel: "రకం / వెరైటీ",
        categoryLabel: "వర్గం *",
        farmingMethodLabel: "వ్యవసాయ పద్ధతి *",
        qtyLabel: "అందుబాటులో ఉన్న పరిమాణం *",
        unitLabel: "యూనిట్ *",
        priceLabel: "రైతు ప్రత్యక్ష ధర (₹) *",
        mandiPriceLabel: "మార్కెట్ / దళారీ పోలిక ధర (₹)",
        minOrderLabel: "కనిష్ట ఆర్డర్ పరిమాణం",
        harvestDateLabel: "కోత వివరాలు / తాజాదనం",
        farmLocationLabel: "వ్యవసాయ క్షేత్రం ప్రదేశం (గ్రామం, జిల్లా, రాష్ట్రం) *",
        deliveryOptionsLabel: "డెలివరీ & రవాణా ఎంపికలు",
        descriptionLabel: "పంట నాణ్యత & ఇతర వివరాలు",
        photoLabel: "పంట ఫోటో",
        farmerPhoneLabel: "ఫోన్ నంబర్ *",
        farmerWhatsappLabel: "WhatsApp నంబర్ *",
        cancelBtn: "రద్దు చేయండి",
        saveListingBtn: "పంటను ప్రచురించండి",
        updateListingBtn: "సవరణలను భద్రపరచండి",
        editBtn: "సవరించండి",
        deleteBtn: "తొలగించండి",
        markSoldOut: "అయిపోయిందిగా మార్చండి",
        markAvailable: "అందుబాటులో ఉంచండి",
        statusAvailable: "అందుబాటులో ఉంది",
        statusSoldOut: "అయిపోయింది",
      },
      Hindi: {
        pageTitle: "किसान प्रत्यक्ष उपज बाज़ार (किसान मंडी)",
        badge: "0% बिचौलिया कमीशन (सीधा किसान से)",
        subtitle: "बिचौलियों और वितरकों के बिना सीधे उपभोक्ताओं, रेस्तरां और थोक खरीदारों को अपनी फसल बेचें।",
        statsTotalListings: "प्रत्यक्ष फसल लिस्टिंग",
        statsActiveFarmers: "सत्यापित किसान",
        statsOrganicShare: "जैविक और प्राकृतिक उपज",
        statsSavedMargin: "बिचौलिया कमीशन की बचत",
        calcTitle: "किसान प्रत्यक्ष लाभ कैलकुलेटर",
        calcSubtitle: "देखें कि बिचौलिया कमीशन हटाकर आपके पास कितनी अधिक आय बचती है",
        calcHarvestQty: "फसल मात्रा (किलो / यूनिट)",
        calcDirectPrice: "आपकी सीधी दर (₹/यूनिट)",
        calcMiddlemanCut: "बचाया गया बिचौलिया हिस्सा (%)",
        calcDirectEarnings: "प्रत्यक्ष बिक्री आय",
        calcDistributorEarnings: "मंडी/बिचौलिया मार्ग आय",
        calcExtraProfit: "किसान की जेब में अतिरिक्त मुनाफ़ा",
        searchPlaceholder: "फसल, किस्म, गाँव या किसान के नाम से खोजें...",
        allCategories: "सभी उपज",
        vegetables: "सब्जियाँ",
        fruits: "फल",
        grains: "अनाज और चावल",
        pulses: "दालें और फलियाँ",
        spices: "मसाले और हल्दी",
        organic: "जैविक उत्पाद",
        dairyHoney: "डेयरी और शुद्ध शहद",
        other: "अन्य",
        allMethods: "सभी विधियाँ",
        organicCertified: "जैविक (प्रमाणित)",
        naturalZbnf: "प्राकृतिक खेती (ZBNF)",
        conventional: "पारंपरिक",
        hydroponic: "हाइड्रोपोनिक",
        listHarvestBtn: "+ अपनी फसल बेचें",
        myListingsToggle: "मेरी फसलें",
        allListingsToggle: "सभी उपज",
        sortNewest: "ताज़ा कटाई",
        sortPriceLow: "कीमत: कम से ज्यादा",
        sortPriceHigh: "कीमत: ज्यादा से कम",
        sortQtyHigh: "मात्रा: ज्यादा से कम",
        farmerPrice: "सीधा किसान मूल्य",
        distributorPrice: "बाज़ार/वितरक मूल्य",
        savePercent: "बचत",
        availableQty: "उपलब्ध स्टॉक",
        minOrder: "न्यूनतम ऑर्डर",
        harvestFreshness: "कटाई समय",
        directWhatsapp: "WhatsApp ऑर्डर",
        callFarmer: "किसान को कॉल करें",
        viewDetails: "विवरण देखें",
        noProduceFound: "इस श्रेणी में कोई उपज नहीं मिली।",
        modalCreateTitle: "सीधी बिक्री के लिए फसल लिस्ट करें",
        modalEditTitle: "फसल लिस्टिंग संपादित करें",
        cropNameLabel: "फसल का नाम * (उदा: देसी टमाटर, बासमती)",
        varietyLabel: "किस्म / वैरायटी",
        categoryLabel: "श्रेणी *",
        farmingMethodLabel: "खेती की विधि *",
        qtyLabel: "उपलब्ध मात्रा *",
        unitLabel: "इकाई *",
        priceLabel: "सीधा किसान मूल्य (₹) *",
        mandiPriceLabel: "बाज़ार / वितरक तुलना मूल्य (₹)",
        minOrderLabel: "न्यूनतम ऑर्डर मात्रा",
        harvestDateLabel: "कटाई की तिथि / ताज़गी",
        farmLocationLabel: "खेत का स्थान (गाँव, जिला, राज्य) *",
        deliveryOptionsLabel: "डिलीवरी और परिवहन विकल्प",
        descriptionLabel: "फसल विवरण और गुणवत्ता",
        photoLabel: "फसल की तस्वीर",
        farmerPhoneLabel: "फ़ोन नंबर *",
        farmerWhatsappLabel: "WhatsApp नंबर *",
        cancelBtn: "रद्द करें",
        saveListingBtn: "फसल प्रकाशित करें",
        updateListingBtn: "बदलाव सहेजें",
        editBtn: "संपादित करें",
        deleteBtn: "हटाएँ",
        markSoldOut: "बिक गया मार्क करें",
        markAvailable: "उपलब्ध मार्क करें",
        statusAvailable: "उपलब्ध",
        statusSoldOut: "बिक चुका",
      },
    };
    return dict[language] || dict.English;
  }, [language]);

  // Load Produce Listings and Stats
  const fetchProduce = async () => {
    try {
      setLoading(true);
      const res = await API.get("/produce", {
        params: {
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          method: selectedMethod !== "All" ? selectedMethod : undefined,
          search: searchQuery || undefined,
          sort:
            sortBy === "price-low"
              ? "price-low"
              : sortBy === "price-high"
              ? "price-high"
              : sortBy === "qty-high"
              ? "qty-high"
              : undefined,
        },
      });
      if (res.data?.produce) {
        setProduceList(res.data.produce);
      }
    } catch (err) {
      console.error("Error fetching farm produce:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/produce/stats");
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn("Could not load produce stats:", err);
    }
  };

  useEffect(() => {
    fetchProduce();
  }, [selectedCategory, selectedMethod, sortBy]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProduce();
  };

  // Filter for "My Listings"
  const displayedProduce = useMemo(() => {
    if (!showMyListingsOnly) return produceList;
    const currentUserId = user?._id || user?.id;
    const currentUserName = user?.name;
    return produceList.filter(
      (item) =>
        (item.farmerId && String(item.farmerId) === String(currentUserId)) ||
        item.farmerName === currentUserName
    );
  }, [produceList, showMyListingsOnly, user]);

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryCheckbox = (option) => {
    setFormData((prev) => {
      const exists = prev.deliveryOptions.includes(option);
      if (exists) {
        return {
          ...prev,
          deliveryOptions: prev.deliveryOptions.filter((o) => o !== option),
        };
      } else {
        return {
          ...prev,
          deliveryOptions: [...prev.deliveryOptions, option],
        };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Submit Listing (Create or Update)
  const handleSubmitListing = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg({ type: "", text: "" });

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "deliveryOptions") {
          formPayload.append(key, JSON.stringify(formData[key]));
        } else {
          formPayload.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        formPayload.append("image", selectedFile);
      }

      if (editingItem) {
        await API.put(`/produce/${editingItem._id}`, formPayload);
        setFeedbackMsg({ type: "success", text: "Listing updated successfully!" });
      } else {
        await API.post("/produce", formPayload);
        setFeedbackMsg({ type: "success", text: "Harvest listed successfully!" });
      }

      setIsCreateModalOpen(false);
      setEditingItem(null);
      setFormData(initialFormState);
      setSelectedFile(null);
      fetchProduce();
      fetchStats();
    } catch (err) {
      console.error("Produce submission error:", err);
      setFeedbackMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to save listing. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      cropName: item.cropName,
      variety: item.variety || "",
      category: item.category,
      quantityAvailable: item.quantityAvailable,
      quantityUnit: item.quantityUnit,
      pricePerUnit: item.pricePerUnit,
      distributorMarketPrice: item.distributorMarketPrice || "",
      minimumOrderQty: item.minimumOrderQty || 1,
      harvestDate: item.harvestDate || "Freshly Harvested Today",
      farmLocation: item.farmLocation,
      farmingMethod: item.farmingMethod || "Natural / ZBNF",
      deliveryOptions: item.deliveryOptions || ["Farm Gate Pickup"],
      description: item.description || "",
      image: item.image || "",
      farmerPhone: item.farmerPhone || "",
      farmerWhatsapp: item.farmerWhatsapp || item.farmerPhone || "",
    });
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this harvest listing?")) return;
    try {
      await API.delete(`/produce/${id}`);
      fetchProduce();
      fetchStats();
    } catch (err) {
      alert("Failed to delete listing: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = item.status === "Available" ? "Sold Out" : "Available";
      await API.put(`/produce/${item._id}`, { status: newStatus });
      fetchProduce();
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  // Profit Calculator Calculation
  const directTotal = Number(calcQty) * Number(calcPrice);
  const distributorPriceEst = Number(calcPrice) * (1 + Number(calcMarginPercent) / 100);
  const distributorFarmerShare = Number(calcPrice) * (1 - Number(calcMarginPercent) / 100);
  const middlemanCutPerHarvest = directTotal - (Number(calcQty) * distributorFarmerShare);

  return (
    <div className="min-h-screen pb-16">
      {/* Top Value Proposition Banner */}
      <div className="relative overflow-hidden border-b border-emerald-900/20 bg-gradient-to-br from-emerald-950 via-neutral-900 to-emerald-900 px-4 py-8 text-white sm:px-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-lime-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.badge}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                {t.pageTitle}
              </h1>
              <p className="max-w-2xl text-xs text-neutral-300 sm:text-sm leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormData(initialFormState);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 hover:scale-[1.02] cursor-pointer"
              >
                <span>🌾</span>
                <span>{t.listHarvestBtn}</span>
              </button>

              <button
                onClick={() => setShowMyListingsOnly(!showMyListingsOnly)}
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition cursor-pointer ${
                  showMyListingsOnly
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {showMyListingsOnly ? `✓ ${t.myListingsToggle}` : t.myListingsToggle}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span>📦</span>
                <span>{t.statsTotalListings}</span>
              </div>
              <p className="mt-1 text-xl font-bold">{stats.totalListings || produceList.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span>👨‍🌾</span>
                <span>{t.statsActiveFarmers}</span>
              </div>
              <p className="mt-1 text-xl font-bold">{stats.activeFarmers || 1}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span>🌱</span>
                <span>{t.statsOrganicShare}</span>
              </div>
              <p className="mt-1 text-xl font-bold">{stats.organicSharePercent || 70}%</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span>💰</span>
                <span>{t.statsSavedMargin}</span>
              </div>
              <p className="mt-1 text-xl font-bold text-emerald-300">
                ~{stats.middlemanCutSavedPercent || 35}% Extra
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 space-y-6">
        {/* Interactive Direct Farmer vs Middleman Calculator */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">⚖️</span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {t.calcTitle}
                </h3>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {t.calcSubtitle}
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                  {t.calcHarvestQty}
                </label>
                <input
                  type="number"
                  value={calcQty}
                  onChange={(e) => setCalcQty(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                  {t.calcDirectPrice}
                </label>
                <input
                  type="number"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                  {t.calcMiddlemanCut}
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={calcMarginPercent}
                    onChange={(e) => setCalcMarginPercent(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 min-w-[32px]">
                    {calcMarginPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-emerald-200/60 pt-3.5 dark:border-emerald-900/40">
            <div className="rounded-xl bg-white p-3 shadow-2xs dark:bg-neutral-900">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                {t.calcDirectEarnings} (100% to You)
              </span>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{directTotal.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-3 shadow-2xs dark:bg-neutral-900">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                {t.calcDistributorEarnings} (With cuts)
              </span>
              <p className="text-lg font-bold text-neutral-600 dark:text-neutral-400">
                ₹{Math.round(calcQty * distributorFarmerShare).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-600 p-3 text-white shadow-xs">
              <span className="text-[11px] font-medium text-emerald-100">
                {t.calcExtraProfit}
              </span>
              <p className="text-lg font-black">
                +₹{Math.round(middlemanCutPerHarvest).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Search, Filter Tabs & Sort Controls */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-emerald-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:border-emerald-400"
              />
              <span className="absolute left-3 top-2.5 text-xs text-neutral-400">🔍</span>
            </form>

            {/* Sorting & Method Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <option value="All">{t.allMethods}</option>
                <option value="Organic (Certified)">{t.organicCertified}</option>
                <option value="Natural / ZBNF">{t.naturalZbnf}</option>
                <option value="Conventional">{t.conventional}</option>
                <option value="Hydroponic">{t.hydroponic}</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <option value="newest">{t.sortNewest}</option>
                <option value="price-low">{t.sortPriceLow}</option>
                <option value="price-high">{t.sortPriceHigh}</option>
                <option value="qty-high">{t.sortQtyHigh}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: "All", label: t.allCategories, icon: "🌾" },
              { key: "Vegetables", label: t.vegetables, icon: "🥦" },
              { key: "Fruits", label: t.fruits, icon: "🍎" },
              { key: "Grains & Cereals", label: t.grains, icon: "🌾" },
              { key: "Pulses & Lentils", label: t.pulses, icon: "🫘" },
              { key: "Spices & Herbs", label: t.spices, icon: "🌶️" },
              { key: "Organic Produce", label: t.organic, icon: "🌱" },
              { key: "Dairy & Honey", label: t.dairyHoney, icon: "🍯" },
            ].map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white shadow-xs dark:bg-emerald-500 dark:text-neutral-950"
                      : "border border-neutral-200 bg-white text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Produce Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
            <p className="mt-3">Loading fresh direct farm harvests...</p>
          </div>
        ) : displayedProduce.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800">
            <div className="text-4xl mb-2">🌾</div>
            <h4 className="text-sm font-bold text-neutral-800 dark:text-white">
              {t.noProduceFound}
            </h4>
            <p className="mt-1 text-xs text-neutral-400">
              Try adjusting your category or method filters, or list your own farm harvest!
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData(initialFormState);
                setIsCreateModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
            >
              <span>+</span>
              <span>{t.listHarvestBtn}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProduce.map((item) => {
              const currentUserId = user?._id || user?.id;
              const isOwner =
                (item.farmerId && String(item.farmerId) === String(currentUserId)) ||
                item.farmerName === user?.name;

              const isSoldOut = item.status === "Sold Out";
              const savingsPercent =
                item.distributorMarketPrice && item.distributorMarketPrice > item.pricePerUnit
                  ? Math.round(
                      ((item.distributorMarketPrice - item.pricePerUnit) /
                        item.distributorMarketPrice) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={item._id}
                  className={`group flex flex-col rounded-2xl border bg-white shadow-xs transition duration-200 hover:shadow-md dark:bg-neutral-900 ${
                    isSoldOut
                      ? "border-neutral-300 opacity-60 dark:border-neutral-800"
                      : "border-neutral-200/90 hover:border-emerald-400/60 dark:border-neutral-800 dark:hover:border-emerald-600/60"
                  }`}
                >
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : item.image
                          ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${item.image}`
                          : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80"
                      }
                      alt={item.cropName}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80";
                      }}
                    />

                    {/* Quality & Method Badges */}
                    <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-neutral-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                        {item.farmingMethod}
                      </span>
                      {savingsPercent > 0 && (
                        <span className="rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          {savingsPercent}% Direct Savings
                        </span>
                      )}
                    </div>

                    {isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                        <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                          {t.statusSoldOut}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                          {item.cropName}
                        </h3>
                        <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {item.category}
                        </span>
                      </div>
                      {item.variety && (
                        <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                          {item.variety}
                        </p>
                      )}
                    </div>

                    {/* Price Block */}
                    <div className="mt-3 flex items-baseline justify-between rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-800/60">
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-neutral-400">
                          {t.farmerPrice}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                            ₹{item.pricePerUnit}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            / {item.quantityUnit}
                          </span>
                        </div>
                      </div>

                      {item.distributorMarketPrice > item.pricePerUnit && (
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 line-through">
                            Mandi: ₹{item.distributorMarketPrice}
                          </span>
                          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            0% Middleman Cut
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Stock & Location Metadata */}
                    <div className="mt-3 space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <span>📦</span> {t.availableQty}:
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {item.quantityAvailable} {item.quantityUnit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <span>📍</span> Location:
                        </span>
                        <span className="font-medium truncate max-w-[140px]">
                          {item.farmLocation}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <span>👨‍🌾</span> Farmer:
                        </span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {item.farmerName}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      {isOwner ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className="flex-1 rounded-lg border border-neutral-300 py-1.5 text-[11px] font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
                          >
                            {isSoldOut ? t.markAvailable : t.markSoldOut}
                          </button>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="rounded-lg bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 cursor-pointer"
                          >
                            {t.editBtn}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id)}
                            className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 cursor-pointer"
                          >
                            {t.deleteBtn}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Direct WhatsApp Order */}
                          <a
                            href={`https://wa.me/${(item.farmerWhatsapp || item.farmerPhone || "").replace(
                              /\D/g,
                              ""
                            )}?text=${encodeURIComponent(
                              `Hello ${item.farmerName}, I saw your direct farm listing for "${item.cropName}" (${item.variety || ""}) on Agro AI. I am interested in purchasing.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer"
                          >
                            <span>💬</span>
                            <span>{t.directWhatsapp}</span>
                          </a>

                          {/* Direct Call */}
                          {item.farmerPhone && (
                            <a
                              href={`tel:${item.farmerPhone}`}
                              title="Call Farmer"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-emerald-600 cursor-pointer"
                            >
                              📞
                            </a>
                          )}

                          {/* Details Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduce(item);
                              setIsDetailModalOpen(true);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 cursor-pointer"
                            title="View full harvest batch details"
                          >
                            ℹ️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Produce Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌾</span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {editingItem ? t.modalEditTitle : t.modalCreateTitle}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingItem(null);
                }}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {feedbackMsg.text && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs font-semibold ${
                  feedbackMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmitListing} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.cropNameLabel}
                  </label>
                  <input
                    type="text"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Organic Desi Tomatoes"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none transition focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.varietyLabel}
                  </label>
                  <input
                    type="text"
                    name="variety"
                    value={formData.variety}
                    onChange={handleFormChange}
                    placeholder="e.g. Heirloom Country, Sona Masoori, Hybrid F1"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none transition focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.categoryLabel}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="Vegetables">{t.vegetables}</option>
                    <option value="Fruits">{t.fruits}</option>
                    <option value="Grains & Cereals">{t.grains}</option>
                    <option value="Pulses & Lentils">{t.pulses}</option>
                    <option value="Spices & Herbs">{t.spices}</option>
                    <option value="Organic Produce">{t.organic}</option>
                    <option value="Dairy & Honey">{t.dairyHoney}</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.farmingMethodLabel}
                  </label>
                  <select
                    name="farmingMethod"
                    value={formData.farmingMethod}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="Organic (Certified)">{t.organicCertified}</option>
                    <option value="Natural / ZBNF">{t.naturalZbnf}</option>
                    <option value="Conventional">{t.conventional}</option>
                    <option value="Hydroponic">{t.hydroponic}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.qtyLabel}
                  </label>
                  <input
                    type="number"
                    name="quantityAvailable"
                    value={formData.quantityAvailable}
                    onChange={handleFormChange}
                    required
                    min="1"
                    placeholder="500"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.unitLabel}
                  </label>
                  <select
                    name="quantityUnit"
                    value={formData.quantityUnit}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="crate (25kg)">crate (25kg)</option>
                    <option value="bag (50kg)">bag (50kg)</option>
                    <option value="box">box</option>
                    <option value="dozen">dozen</option>
                    <option value="liter">liter</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.priceLabel}
                  </label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    value={formData.pricePerUnit}
                    onChange={handleFormChange}
                    required
                    min="0"
                    placeholder="28"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.mandiPriceLabel}
                  </label>
                  <input
                    type="number"
                    name="distributorMarketPrice"
                    value={formData.distributorMarketPrice}
                    onChange={handleFormChange}
                    min="0"
                    placeholder="45"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.farmLocationLabel}
                  </label>
                  <input
                    type="text"
                    name="farmLocation"
                    value={formData.farmLocation}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Madanapalle, Chittoor District, AP"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.harvestDateLabel}
                  </label>
                  <input
                    type="text"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleFormChange}
                    placeholder="e.g. Harvested Today Morning / Ready Oct 28"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.deliveryOptionsLabel}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "Farm Gate Pickup",
                    "Local Delivery (<30km)",
                    "Transport / Courier",
                    "Bulk Freight",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/50 p-2 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.deliveryOptions.includes(opt)}
                        onChange={() => handleDeliveryCheckbox(opt)}
                        className="accent-emerald-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.farmerPhoneLabel}
                  </label>
                  <input
                    type="text"
                    name="farmerPhone"
                    value={formData.farmerPhone}
                    onChange={handleFormChange}
                    required
                    placeholder="+91 98480 12345"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.farmerWhatsappLabel}
                  </label>
                  <input
                    type="text"
                    name="farmerWhatsapp"
                    value={formData.farmerWhatsapp}
                    onChange={handleFormChange}
                    placeholder="+91 98480 12345"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.descriptionLabel}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="e.g. Fresh naturally grown desi tomatoes, zero chemicals, handpicked this morning..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.photoLabel}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-800 hover:file:bg-emerald-200 dark:file:bg-emerald-950 dark:file:text-emerald-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400 cursor-pointer"
                >
                  {submitting ? "Saving..." : editingItem ? t.updateListingBtn : t.saveListingBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Produce Detailed View Modal */}
      {isDetailModalOpen && selectedProduce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {selectedProduce.category}
              </span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <img
                src={
                  selectedProduce.image?.startsWith("http")
                    ? selectedProduce.image
                    : selectedProduce.image
                    ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${selectedProduce.image}`
                    : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80"
                }
                alt={selectedProduce.cropName}
                className="max-h-64 w-full rounded-xl object-cover"
              />

              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {selectedProduce.cropName}
                </h3>
                {selectedProduce.variety && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Variety: {selectedProduce.variety}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/60">
                <div>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                    Direct Farmer Price
                  </span>
                  <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{selectedProduce.pricePerUnit} / {selectedProduce.quantityUnit}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                    Available Harvest
                  </span>
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {selectedProduce.quantityAvailable} {selectedProduce.quantityUnit}
                  </p>
                </div>
              </div>

              {selectedProduce.description && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Produce Description
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {selectedProduce.description}
                  </p>
                </div>
              )}

              <div className="space-y-2 rounded-xl border border-neutral-100 p-3 text-xs dark:border-neutral-800">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Farming Method:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedProduce.farmingMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Harvest Freshness:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedProduce.harvestDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Farm Location:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedProduce.farmLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Delivery Options:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedProduce.deliveryOptions?.join(", ") || "Farm Pickup"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${(
                    selectedProduce.farmerWhatsapp ||
                    selectedProduce.farmerPhone ||
                    ""
                  ).replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hello ${selectedProduce.farmerName}, I want to buy "${selectedProduce.cropName}" directly from your farm at ₹${selectedProduce.pricePerUnit}/${selectedProduce.quantityUnit}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 cursor-pointer"
                >
                  <span>💬</span>
                  <span>Direct WhatsApp Inquiry</span>
                </a>

                {selectedProduce.farmerPhone && (
                  <a
                    href={`tel:${selectedProduce.farmerPhone}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white cursor-pointer"
                  >
                    <span>📞</span>
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerDirect;
