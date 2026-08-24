import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";

const SUPPORTED_LANGUAGES = [
  "English",
  "Telugu",
  "Hindi",
];

const getStoredLanguage = () => {
  const storedLanguage = localStorage.getItem("agro_language");
  if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }
  return "English";
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getStoredLanguage);

  const changeLanguage = (newLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
      return;
    }

    setLanguageState(newLanguage);
    localStorage.setItem("agro_language", newLanguage);
    window.dispatchEvent(new CustomEvent("agro-language-change", { detail: newLanguage }));
  };

  useEffect(() => {
    localStorage.setItem("agro_language", language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        setLanguage: changeLanguage,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};