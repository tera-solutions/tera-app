import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationVI from "@tera/assets/locales/vi/translation.json";
import translationEN from "@tera/assets/locales/en/translation.json";

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI }
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "vi",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
