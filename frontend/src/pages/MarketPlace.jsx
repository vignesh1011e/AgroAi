import { useEffect, useState } from "react";
import API from "../services/api";
import { useLanguage } from "../context/useLanguage";

const EQUIPMENT_FALLBACK_IMAGES = {
  sprayer: "/images/marketplace/sprayer.jpg",
  trailer: "/images/marketplace/trailer.jpg",
  harvester: "/images/marketplace/harvester.jpg",
  cultivator: "/images/marketplace/cultivator.jpg",
  rotavator: "/images/marketplace/rotavator.jpg",
  tiller: "/images/marketplace/cultivator.jpg",
  drill: "/images/marketplace/seed-drill.jpg",
  pump: "/images/marketplace/water-pump.jpg",
  swaraj: "/images/marketplace/swaraj-tractor.jpg",
  deere: "/images/marketplace/johndeere-tractor.jpg",
  mahindra: "/images/marketplace/mahindra-tractor.jpg",
  tractor: "/images/marketplace/mahindra-tractor.jpg",
  vehicles: "/images/marketplace/trailer.jpg",
  tools: "/images/marketplace/sprayer.jpg",
  irrigation: "/images/marketplace/water-pump.jpg",
  machinery: "/images/marketplace/harvester.jpg",
};

const getFallbackImage = (item) => {
  const text = `${item?.title || ""} ${item?.category || ""} ${item?.description || ""}`.toLowerCase();
  if (text.includes("sprayer")) return EQUIPMENT_FALLBACK_IMAGES.sprayer;
  if (text.includes("trailer") || text.includes("trolley")) return EQUIPMENT_FALLBACK_IMAGES.trailer;
  if (text.includes("harvester") || text.includes("paddy")) return EQUIPMENT_FALLBACK_IMAGES.harvester;
  if (text.includes("cultivator")) return EQUIPMENT_FALLBACK_IMAGES.cultivator;
  if (text.includes("rotavator")) return EQUIPMENT_FALLBACK_IMAGES.rotavator;
  if (text.includes("tiller")) return EQUIPMENT_FALLBACK_IMAGES.tiller;
  if (text.includes("seed") || text.includes("drill")) return EQUIPMENT_FALLBACK_IMAGES.drill;
  if (text.includes("pump") || text.includes("irrigation") || text.includes("water")) return EQUIPMENT_FALLBACK_IMAGES.pump;
  if (text.includes("swaraj")) return EQUIPMENT_FALLBACK_IMAGES.swaraj;
  if (text.includes("john deere") || text.includes("deere")) return EQUIPMENT_FALLBACK_IMAGES.deere;
  if (text.includes("mahindra")) return EQUIPMENT_FALLBACK_IMAGES.mahindra;
  if (text.includes("tractor")) return EQUIPMENT_FALLBACK_IMAGES.tractor;
  if (item?.category === "Vehicles") return EQUIPMENT_FALLBACK_IMAGES.vehicles;
  if (item?.category === "Tools") return EQUIPMENT_FALLBACK_IMAGES.tools;
  if (item?.category === "Irrigation") return EQUIPMENT_FALLBACK_IMAGES.irrigation;
  if (item?.category === "Farm Machinery") return EQUIPMENT_FALLBACK_IMAGES.machinery;
  return EQUIPMENT_FALLBACK_IMAGES.tractor;
};

const getLocalFallbackImage = (item) => {
  const text = `${item?.title || ""} ${item?.category || ""} ${item?.description || ""}`.toLowerCase();
  if (text.includes("sprayer")) return "/images/marketplace/sprayer.jpg";
  if (text.includes("trailer") || text.includes("trolley")) return "/images/marketplace/trailer.jpg";
  if (text.includes("harvester") || text.includes("paddy")) return "/images/marketplace/harvester.jpg";
  if (text.includes("cultivator")) return "/images/marketplace/cultivator.jpg";
  if (text.includes("rotavator")) return "/images/marketplace/rotavator.jpg";
  if (text.includes("tiller")) return "/images/marketplace/cultivator.jpg";
  if (text.includes("seed") || text.includes("drill")) return "/images/marketplace/seed-drill.jpg";
  if (text.includes("pump") || text.includes("water")) return "/images/marketplace/water-pump.jpg";
  if (text.includes("swaraj")) return "/images/marketplace/swaraj-tractor.jpg";
  if (text.includes("john deere") || text.includes("deere")) return "/images/marketplace/johndeere-tractor.jpg";
  if (text.includes("mahindra")) return "/images/marketplace/mahindra-tractor.jpg";
  if (text.includes("tractor")) return "/images/marketplace/mahindra-tractor.jpg";
  if (item?.category === "Vehicles") return "/images/marketplace/trailer.jpg";
  if (item?.category === "Tools") return "/images/marketplace/sprayer.jpg";
  if (item?.category === "Irrigation") return "/images/marketplace/water-pump.jpg";
  if (item?.category === "Farm Machinery") return "/images/marketplace/harvester.jpg";
  return "/images/marketplace/mahindra-tractor.jpg";
};

const getListingImage = (item) => {
  if (item?.image && typeof item.image === "string" && item.image.trim() !== "") {
    if (item.image.startsWith("http")) return item.image;
    if (item.image.startsWith("/uploads")) return `http://localhost:5000${item.image}`;
    return item.image;
  }
  return getFallbackImage(item);
};

function Marketplace() {
  const { language } = useLanguage();

  const translations = {
    English: {
      title: "Farmer Marketplace", subtitle: "Buy, sell, and rent agricultural equipment, machinery, and tools.", sellRent: "New Listing +", totalListings: "Total Equipment", forSale: "For Sale", forRent: "For Rent", search: "Search tractors, tools, implements, locations...", filters: "Filters", filterListings: "Filter Catalog", filterDescription: "Refine by category, price, and location.", clearAll: "Reset", category: "Category", listingType: "Listing Type", all: "All", maximumPrice: "Max Price (₹)", noLimit: "Any Price", location: "Location", locationExample: "e.g. Vadodara", listings: "items", listing: "item", applyFilters: "Apply", active: "Active:", clear: "Clear", available: "Equipment Database", forSaleBadge: "FOR SALE", forRentBadge: "RENTAL", perDay: "/day", contactSeller: "Contact Seller", noListings: "No equipment found", noListingsDesc: "Try adjusting your search criteria or category filter.", clearFilters: "Reset Filters", safeTrading: "Verified Agricultural Trading Notice", safeTradingDesc: "Inspect equipment and test operational condition before payment. Transact in open local farming depots when possible.", disclaimer: "Marketplace listings are published directly by local farmers.", loading: "Loading catalog...", unavailable: "Marketplace unavailable", tryAgain: "Retry", createTitle: "Publish New Listing", createSubtitle: "List equipment for sale or agricultural rental.", listingTitle: "Title *", listingTitlePlaceholder: "e.g. Mahindra 575 DI Tractor", description: "Details & Specifications *", descriptionPlaceholder: "Describe horsepower, year, attachments, condition, and terms...", sell: "Sell", rent: "Rent", price: "Price (₹) *", pricePerDay: "Daily Rental Rate (₹)", sellingPrice: "Sale Price (₹)", displayedPerDay: "Shown as daily rental rate.", contactPhone: "Contact Phone", contactNumber: "Phone number", registeredPhone: "Leave empty to use your account phone number.", productImage: "Equipment Photograph", chooseImage: "Upload image", imageFormats: "JPG, PNG, WEBP • Max 5 MB", remove: "Remove", uploadClear: "Upload a clean photo of the equipment.", cancel: "Cancel", uploading: "Publishing...", createListing: "Publish Listing", imageError: "Please choose a valid image file.", imageSizeError: "Image must be under 5 MB.", requiredError: "Please complete all required fields.", loadError: "Unable to load marketplace catalog.", createError: "Failed to create listing.", phoneUnavailable: "Phone not listed",
      categoryNames: { All: "All", Tractors: "Tractors", "Farm Machinery": "Machinery", Tools: "Tools", Vehicles: "Vehicles", Irrigation: "Irrigation", Other: "Other" }
    },
    Telugu: {
      title: "రైతు మార్కెట్", subtitle: "వ్యవసాయ పరికరాలను కొనండి, అమ్మండి మరియు అద్దెకు తీసుకోండి.", sellRent: "కొత్త లిస్టింగ్ +", totalListings: "మొత్తం పరికరాలు", forSale: "అమ్మకానికి", forRent: "అద్దెకు", search: "ట్రాక్టర్లు, పరికరాలు, యంత్రాలను వెతకండి...", filters: "ఫిల్టర్‌లు", filterListings: "ఫిల్టర్ చేయండి", filterDescription: "మీ అవసరాలకు అనుగుణంగా ఎంచుకోండి.", clearAll: "రీసెట్", category: "వర్గం", listingType: "రకం", all: "అన్నీ", maximumPrice: "గరిష్ఠ ధర", noLimit: "పరిమితి లేదు", location: "ప్రాంతం", locationExample: "ఉదా. వడోదర", listings: "వస్తువులు", listing: "వస్తువు", applyFilters: "వర్తింపజేయి", active: "క్రియాశీలం:", clear: "తొలగించు", available: "అందుబాటులో ఉన్న పరికరాలు", forSaleBadge: "అమ్మకానికి", forRentBadge: "అద్దెకు", perDay: "/రోజు", contactSeller: "సంప్రదించండి", noListings: "ఏమీ కనుగొనబడలేదు", noListingsDesc: "శోధన లేదా ఫిల్టర్‌లను మార్చండి.", clearFilters: "రీసెట్", safeTrading: "సురక్షిత లావాదేవీల సూచన", safeTradingDesc: "చెల్లింపుకు ముందు యంత్రాన్ని పరిశీలించండి.", disclaimer: "లిస్టింగ్‌లు రైతులు స్వయంగా అందించినవి.", loading: "లోడ్ అవుతోంది...", unavailable: "అందుబాటులో లేదు", tryAgain: "మళ్లీ ప్రయత్నించండి", createTitle: "లిస్టింగ్ సృష్టించండి", createSubtitle: "మీ వ్యవసాయ పరికరాన్ని అమ్మండి లేదా అద్దెకు ఇవ్వండి.", listingTitle: "శీర్షిక *", listingTitlePlaceholder: "ఉదా. ట్రాక్టర్", description: "వివరాలు *", descriptionPlaceholder: "పరిస్థితి మరియు ముఖ్య వివరాలు...", sell: "అమ్మకం", rent: "అద్దె", price: "ధర *", pricePerDay: "రోజుకు ధర", sellingPrice: "అమ్మకపు ధర", displayedPerDay: "రోజువారీ ధరగా చూపబడుతుంది.", contactPhone: "ఫోన్", contactNumber: "మీ ఫోన్ నంబర్", registeredPhone: "ఖాళీగా ఉంచితే ఖాతా నంబర్ వాడబడుతుంది.", productImage: "చిత్రం", chooseImage: "చిత్రాన్ని ఎంచుకోండి", imageFormats: "గరిష్ఠంగా 5 MB", remove: "తొలగించు", uploadClear: "స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.", cancel: "రద్దు", uploading: "అప్‌లోడ్ అవుతోంది...", createListing: "ప్రచురించండి", imageError: "సరైన ఇమేజ్ ఫైల్‌ను ఎంచుకోండి.", imageSizeError: "చిత్రం 5 MB కంటే చిన్నదిగా ఉండాలి.", requiredError: "అన్ని ఫీల్డ్‌లను పూరించండి.", loadError: "లోడ్ చేయడం సాధ్యపడలేదు.", createError: "విఫలమైంది.", phoneUnavailable: "ఫోన్ లేదు",
      categoryNames: { All: "అన్నీ", Tractors: "ట్రాక్టర్లు", "Farm Machinery": "యంత్రాలు", Tools: "పరికరాలు", Vehicles: "వాహనాలు", Irrigation: "నీటిపారుదల", Other: "ఇతరాలు" }
    },
    Hindi: {
      title: "किसान मार्केटप्लेस", subtitle: "कृषि उपकरण, मशीनरी और औजार खरीदें, बेचें और किराए पर लें।", sellRent: "नई लिस्टिंग +", totalListings: "कुल उपकरण", forSale: "बिक्री के लिए", forRent: "किराए पर", search: "ट्रैक्टर, उपकरण, मशीनरी खोजें...", filters: "फ़िल्टर", filterListings: "फ़िल्टर करें", filterDescription: "अपनी जरूरत के अनुसार उपकरण खोजें।", clearAll: "रीसेट", category: "श्रेणी", listingType: "प्रकार", all: "सभी", maximumPrice: "अधिकतम कीमत", noLimit: "कोई सीमा नहीं", location: "स्थान", locationExample: "उदा. वडोदरा", listings: "उपकरण", listing: "उपकरण", applyFilters: "लागू करें", active: "सक्रिय:", clear: "हटाएँ", available: "उपलब्ध उपकरण", forSaleBadge: "बिक्री", forRentBadge: "किराया", perDay: "/दिन", contactSeller: "संपर्क करें", noListings: "कोई उपकरण नहीं मिला", noListingsDesc: "अपनी खोज या फ़िल्टर बदलकर देखें।", clearFilters: "फ़िल्टर रीसेट", safeTrading: "सुरक्षित व्यापार सूचना", safeTradingDesc: "भुगतान से पहले उपकरण की स्थिति की जाँच करें।", disclaimer: "लिस्टिंग किसानों द्वारा प्रदान की जाती हैं।", loading: "लोड हो रहा है...", unavailable: "उपलब्ध नहीं है", tryAgain: "पुनः प्रयास", createTitle: "नई लिस्टिंग जोड़ें", createSubtitle: "कृषि उपकरण बेचें या किराए पर दें।", listingTitle: "शीर्षक *", listingTitlePlaceholder: "उदा. महिंद्रा ट्रैक्टर", description: "विवरण *", descriptionPlaceholder: "उपकरण की स्थिति और विवरण बताएं...", sell: "बेचें", rent: "किराए पर दें", price: "कीमत *", pricePerDay: "दैनिक किराया", sellingPrice: "बिक्री मूल्य", displayedPerDay: "प्रति दिन दर के रूप में दिखाया जाएगा।", contactPhone: "फ़ोन", contactNumber: "आपका संपर्क नंबर", registeredPhone: "खाली छोड़ने पर पंजीकृत नंबर इस्तेमाल होगा।", productImage: "तस्वीर", chooseImage: "तस्वीर अपलोड करें", imageFormats: "अधिकतम 5 MB", remove: "हटाएँ", uploadClear: "स्पष्ट तस्वीर अपलोड करें।", cancel: "रद्द करें", uploading: "प्रकाशित हो रहा है...", createListing: "लिस्टिंग प्रकाशित करें", imageError: "कृपया मान्य तस्वीर चुनें।", imageSizeError: "तस्वीर 5 MB से कम होनी चाहिए।", requiredError: "सभी फ़ील्ड भरें।", loadError: "लोड नहीं हो सका।", createError: "लिस्टिंग बनाना विफल।", phoneUnavailable: "फ़ोन उपलब्ध नहीं",
      categoryNames: { All: "सभी", Tractors: "ट्रैक्टर", "Farm Machinery": "मशीनरी", Tools: "उपकरण", Vehicles: "वाहन", Irrigation: "सिंचाई", Other: "अन्य" }
    }
  };

  const t = translations[language] || translations.English;
  const categoryLabel = (value) => t.categoryNames[value] || value;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("All");
  const [listingType, setListingType] = useState("All");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");

  const [showCreateListing, setShowCreateListing] = useState(false);
  const [creatingListing, setCreatingListing] = useState(false);
  const [createError, setCreateError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    category: "Tools",
    type: "Sell",
    price: "",
    location: "",
    sellerPhone: "",
  });

  const categories = [
    "All",
    "Tractors",
    "Farm Machinery",
    "Tools",
    "Vehicles",
    "Irrigation",
    "Other",
  ];

  const createCategories = [
    "Tractors",
    "Farm Machinery",
    "Tools",
    "Vehicles",
    "Irrigation",
    "Other",
  ];

  const loadListings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/listings");
      setListings(response.data.listings || []);
    } catch (err) {
      console.error("Marketplace error:", err);
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadInitialListings = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("/listings");
        if (!cancelled) {
          setListings(response.data.listings || []);
        }
      } catch (err) {
        console.error("Marketplace error:", err);
        if (!cancelled) setError("LISTINGS_LOAD_ERROR");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitialListings();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredListings = listings.filter((listing) => {
    const searchText = search.toLowerCase().trim();
    const locationText = location.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      listing.title?.toLowerCase().includes(searchText) ||
      listing.description?.toLowerCase().includes(searchText) ||
      listing.category?.toLowerCase().includes(searchText) ||
      listing.location?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || listing.category === category;

    const matchesType =
      listingType === "All" || listing.type === listingType;

    const matchesPrice =
      !maxPrice || Number(listing.price) <= Number(maxPrice);

    const matchesLocation =
      !locationText ||
      listing.location?.toLowerCase().includes(locationText);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesPrice &&
      matchesLocation
    );
  });

  const totalListings = listings.length;
  const saleListings = listings.filter((l) => l.type === "Sell").length;
  const rentListings = listings.filter((l) => l.type === "Rent").length;

  const clearFilters = () => {
    setCategory("All");
    setListingType("All");
    setMaxPrice("");
    setLocation("");
  };

  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setNewListing((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCreateError(t.imageError);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCreateError(t.imageSizeError);
      return;
    }

    setCreateError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
  };

  const resetCreateForm = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setNewListing({
      title: "",
      description: "",
      category: "Tools",
      type: "Sell",
      price: "",
      location: "",
      sellerPhone: "",
    });
    setImageFile(null);
    setImagePreview("");
    setCreateError("");
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (
      !newListing.title.trim() ||
      !newListing.description.trim() ||
      !newListing.price ||
      !newListing.location.trim()
    ) {
      setCreateError(t.requiredError);
      return;
    }

    try {
      setCreatingListing(true);
      const formData = new FormData();
      formData.append("title", newListing.title.trim());
      formData.append("description", newListing.description.trim());
      formData.append("category", newListing.category);
      formData.append("type", newListing.type);
      formData.append("price", Number(newListing.price));
      formData.append("location", newListing.location.trim());
      formData.append("sellerPhone", newListing.sellerPhone.trim());
      if (imageFile) formData.append("image", imageFile);

      await API.post("/listings", formData);
      resetCreateForm();
      setShowCreateListing(false);
      await loadListings();
    } catch (err) {
      console.error("Create listing error:", err);
      setCreateError(err.response?.data?.message || t.createError);
    } finally {
      setCreatingListing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🛒</span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
              {t.title}
            </h1>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowCreateListing(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
        >
          <span>{t.sellRent}</span>
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-[11px] font-medium text-neutral-400">{t.totalListings}</p>
          <p className="mt-0.5 text-lg font-bold text-neutral-950 dark:text-white">{totalListings}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-[11px] font-medium text-neutral-400">{t.forSale}</p>
          <p className="mt-0.5 text-lg font-bold text-neutral-950 dark:text-white">{saleListings}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-[11px] font-medium text-neutral-400">{t.forRent}</p>
          <p className="mt-0.5 text-lg font-bold text-neutral-950 dark:text-white">{rentListings}</p>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pl-9 text-xs text-neutral-900 outline-none transition focus:border-emerald-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-emerald-400"
            />
            <span className="absolute left-3 top-2.5 text-xs text-neutral-400">🔍</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <option value="All">{t.all} Types</option>
              <option value="Sell">{t.forSale}</option>
              <option value="Rent">{t.forRent}</option>
            </select>

            {(category !== "All" || listingType !== "All" || search) && (
              <button
                onClick={clearFilters}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-500 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-emerald-400"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                category === cat
                  ? "bg-emerald-600 text-white font-semibold shadow-xs dark:bg-emerald-500 dark:text-neutral-950"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Database Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 dark:border-neutral-700 dark:border-t-emerald-400" />
          <p className="mt-3">{t.loading}</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{t.noListings}</h3>
          <p className="mt-1 text-xs text-neutral-400">{t.noListingsDesc}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((item) => (
            <div
              key={item._id || item.id}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-700"
            >
              <div>
                {/* Item Image */}
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl border border-neutral-100 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
                  <img
                    src={getListingImage(item)}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = () => {
                        e.currentTarget.src = "/images/marketplace/mahindra-tractor.jpg";
                      };
                      e.currentTarget.src = getLocalFallbackImage(item);
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-md border border-emerald-200/90 bg-emerald-50/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-xs backdrop-blur-md dark:border-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300">
                    {item.type}
                  </span>
                </div>

                {/* Meta info */}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {item.category}
                </span>
                <h3 className="mt-0.5 text-sm font-bold text-neutral-950 dark:text-white truncate">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-neutral-400">📍 {item.location}</p>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      ₹{Number(item.price || 0).toLocaleString()}
                      {item.type === "Rent" ? <span className="text-xs font-normal text-neutral-400">/day</span> : ""}
                    </p>
                  </div>

                  {item.sellerPhone && (
                    <a
                      href={`tel:${item.sellerPhone}`}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    >
                      📞 Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safe Trading Callout */}
      <section className="notion-callout mt-8">
        <span className="text-base shrink-0">🛡️</span>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
            {t.safeTrading}
          </h4>
          <p className="mt-0.5 text-xs text-emerald-800/90 dark:text-emerald-400/90">
            {t.safeTradingDesc}
          </p>
        </div>
      </section>

      {/* Create Listing Modal */}
      {showCreateListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-up rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white">{t.createTitle}</h3>
                <p className="text-xs text-neutral-400">{t.createSubtitle}</p>
              </div>
              <button
                onClick={() => {
                  resetCreateForm();
                  setShowCreateListing(false);
                }}
                className="h-7 w-7 rounded-full text-xs text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="notion-callout mt-4 text-xs text-red-600 border border-red-200 bg-red-50 dark:bg-red-950/30">
                <span>⚠️</span>
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateListing} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.listingTitle}
                </label>
                <input
                  type="text"
                  name="title"
                  value={newListing.title}
                  onChange={handleListingChange}
                  required
                  placeholder={t.listingTitlePlaceholder}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none transition focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.category}
                  </label>
                  <select
                    name="category"
                    value={newListing.category}
                    onChange={handleListingChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    {createCategories.map((c) => (
                      <option key={c} value={c}>{categoryLabel(c)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.listingType}
                  </label>
                  <select
                    name="type"
                    value={newListing.type}
                    onChange={handleListingChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="Sell">{t.sell}</option>
                    <option value="Rent">{t.rent}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.price}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newListing.price}
                    onChange={handleListingChange}
                    required
                    placeholder="50000"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.location} *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newListing.location}
                    onChange={handleListingChange}
                    required
                    placeholder="Vadodara, Gujarat"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.description}
                </label>
                <textarea
                  name="description"
                  value={newListing.description}
                  onChange={handleListingChange}
                  required
                  rows="3"
                  placeholder={t.descriptionPlaceholder}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.contactPhone}
                </label>
                <input
                  type="text"
                  name="sellerPhone"
                  value={newListing.sellerPhone}
                  onChange={handleListingChange}
                  placeholder={t.contactNumber}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-emerald-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800"
                />
              </div>

              {/* Image Input */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.productImage}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-800 dark:file:bg-emerald-950/60 dark:file:text-emerald-300"
                />
                {imagePreview && (
                  <div className="mt-2 relative h-24 w-36 overflow-hidden rounded-xl border">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-[10px] text-white"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    resetCreateForm();
                    setShowCreateListing(false);
                  }}
                  className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={creatingListing}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:text-neutral-950"
                >
                  {creatingListing ? t.uploading : t.createListing}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;