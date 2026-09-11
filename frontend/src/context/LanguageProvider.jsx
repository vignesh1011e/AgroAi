import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { LANGUAGES, SUPPORTED_LANGUAGES, getLanguageConfig } from "../data/languages";

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

  const currentLanguageConfig = getLanguageConfig(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        setLanguage: changeLanguage,
        languages: SUPPORTED_LANGUAGES,
        languageList: LANGUAGES,
        currentLanguageConfig,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};