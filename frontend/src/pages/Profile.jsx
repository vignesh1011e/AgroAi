import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/useLanguage";
import API from "../services/api";
import farmBanner from "../assets/farm-banner.jpg";

function Profile() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profilePhoto, setProfilePhoto] = useState(user?.profileImage || null);
  const [actualPassbookNumber, setActualPassbookNumber] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    region: "",
    village: "",
    passbookNumber: "",
    landArea: "",
    surveyNumber: "",
    profileImage: "",
  });

  const translations = {
    English: {
      farmerProfile: "Farmer Profile",
      manageInfo: "Manage your personal credentials, farm land records, and passbook metadata.",
      editProfile: "Edit Profile",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      state: "State",
      district: "District",
      region: "Region / Taluka",
      village: "Village",
      agriculturalDetails: "Agricultural & Land Record",
      landArea: "Land Area (Acres)",
      passbookNumber: "Farmer Passbook ID",
      surveyNumber: "Land Survey Number",
      notAdded: "Not specified",
      savedSuccess: "Profile updated successfully.",
      uploading: "Uploading photo...",
    },
    Telugu: {
      farmerProfile: "రైతు ప్రొఫైల్",
      manageInfo: "మీ వివరాలు మరియు భూమి రికార్డులను నిర్వహించండి.",
      editProfile: "సవరించు",
      cancel: "రద్దు",
      saveChanges: "భద్రపరుచు",
      fullName: "పూర్తి పేరు",
      email: "ఈమెయిల్",
      phone: "ఫోన్",
      state: "రాష్ట్రం",
      district: "జిల్లా",
      region: "ప్రాంతం",
      village: "గ్రామం",
      agriculturalDetails: "వ్యవసాయ మరియు భూమి వివరాలు",
      landArea: "భూమి విస్తీర్ణం (ఎకరాలు)",
      passbookNumber: "పాస్‌బుక్ సంఖ్య",
      surveyNumber: "సర్వే సంఖ్య",
      notAdded: "చేర్చలేదు",
      savedSuccess: "వివరాలు నవీకరించబడ్డాయి.",
      uploading: "అప్‌లోడ్ అవుతోంది...",
    },
    Hindi: {
      farmerProfile: "किसान प्रोफ़ाइल",
      manageInfo: "अपनी व्यक्तिगत जानकारी और भूमि रिकॉर्ड प्रबंधित करें।",
      editProfile: "संपादित करें",
      cancel: "रद्द करें",
      saveChanges: "सहेजें",
      fullName: "पूरा नाम",
      email: "ईमेल",
      phone: "फ़ोन",
      state: "राज्य",
      district: "ज़िला",
      region: "क्षेत्र",
      village: "गाँव",
      agriculturalDetails: "कृषि और भूमि विवरण",
      landArea: "भूमि क्षेत्र (एकड़)",
      passbookNumber: "पासबुक नंबर",
      surveyNumber: "सर्वेक्षण संख्या",
      notAdded: "उपलब्ध नहीं",
      savedSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई।",
      uploading: "अपलोड हो रहा है...",
    },
  };

  const t = translations[language] || translations.English;

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("/profile");
        const userData = response.data?.user;

        if (!cancelled && userData) {
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            state: userData.state || "",
            district: userData.district || "",
            region: userData.region || "",
            village: userData.village || "",
            passbookNumber: userData.passbookNumber || "",
            landArea: userData.landArea ?? "",
            surveyNumber: userData.surveyNumber || "",
            profileImage: userData.profileImage || "",
          });
          setProfilePhoto(userData.profileImage || null);
        }
      } catch (err) {
        console.error("Profile load error:", err);
        if (!cancelled) setError("Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "passbookNumber") setActualPassbookNumber(value);
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image.");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError("");
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await API.post("/profile/photo", formData);
      const newImg = res.data.profileImage;
      setProfilePhoto(newImg);
      setProfile((prev) => ({ ...prev, profileImage: newImg }));
      setSuccess("Profile photo updated.");
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Failed to upload profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = { ...profile };
      if (actualPassbookNumber) {
        payload.passbookNumber = actualPassbookNumber;
      }

      const res = await API.put("/profile", payload);
      setSuccess(t.savedSuccess);
      setEditing(false);
      if (res.data?.user) {
        setProfile((prev) => ({
          ...prev,
          ...res.data.user,
        }));
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const serverUrl = apiUrl.replace(/\/api\/?$/, "");
    return `${serverUrl}${imagePath}`;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Notion Profile Workspace Card */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        {/* Cover Header */}
        <div className="relative h-44 w-full overflow-hidden border-b border-neutral-200/60 bg-emerald-950 sm:h-56">
          <img
            src={farmBanner}
            alt="Profile Cover"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Profile Avatar & Title */}
        <div className="px-6 pb-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative -mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-neutral-100 shadow-md dark:border-neutral-900 dark:bg-neutral-800">
                {profilePhoto ? (
                  <img
                    src={getProfileImageUrl(profilePhoto)}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">
                    👨‍🌾
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition hover:opacity-100 cursor-pointer text-xs font-semibold backdrop-blur-xs">
                  <span>Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-2 sm:pt-0 sm:pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
                    {profile.name || "Farmer"}
                  </h1>
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    ● Verified
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {profile.email} • 📍 {profile.region || profile.district || "Registered Region"}
                </p>
              </div>
            </div>

            <div>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-950"
                  >
                    {saving ? "Saving..." : t.saveChanges}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  ✎ {t.editProfile}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="notion-callout text-xs text-red-600 border border-red-200 bg-red-50 dark:bg-red-950/30">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="notion-callout text-xs text-neutral-900 border border-neutral-200 bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Information Sections */}
      <div className="space-y-6">
        {/* Personal Details */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            Personal Credentials
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ProfileField
              label={t.fullName}
              name="name"
              value={profile.name}
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              label={t.email}
              name="email"
              value={profile.email}
              editing={false}
              onChange={handleChange}
              help="Account primary ID"
            />
            <ProfileField
              label={t.phone}
              name="phone"
              value={profile.phone}
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              label={t.state}
              name="state"
              value={profile.state}
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              label={t.district}
              name="district"
              value={profile.district}
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              label={t.region}
              name="region"
              value={profile.region}
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              label={t.village}
              name="village"
              value={profile.village}
              editing={editing}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Agricultural Land Metadata */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            {t.agriculturalDetails}
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <ProfileField
              label={t.landArea}
              name="landArea"
              type="number"
              value={profile.landArea}
              editing={editing}
              onChange={handleChange}
              suffix="acres"
            />
            <ProfileField
              label={t.surveyNumber}
              name="surveyNumber"
              value={profile.surveyNumber}
              editing={editing}
              onChange={handleChange}
            />
            <ProfileField
              label={t.passbookNumber}
              name="passbookNumber"
              value={editing ? actualPassbookNumber : profile.passbookNumber}
              editing={editing}
              onChange={handleChange}
              placeholder={editing ? "Enter new number" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  name,
  value,
  editing,
  onChange,
  type = "text",
  placeholder,
  help,
  suffix,
}) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-800/40">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
          {label}
        </label>
        {help && <span className="text-[10px] text-neutral-400">{help}</span>}
      </div>

      {editing ? (
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
      ) : (
        <p className="mt-1 text-xs font-semibold text-neutral-900 dark:text-white truncate">
          {value !== "" && value !== null && value !== undefined ? (
            `${value} ${suffix ? suffix : ""}`
          ) : (
            <span className="text-neutral-400 font-normal">Not specified</span>
          )}
        </p>
      )}
    </div>
  );
}

export default Profile;