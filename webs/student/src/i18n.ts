import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import studentEN from "@tera/assets/locales/en/student.json";
import studentVI from "@tera/assets/locales/vi/student.json";

/**
 * Web học viên dùng **file dịch riêng** (`locales/{vi,en}/student.json`), KHÔNG dùng
 * `translation.json` chung với admin/teacher/parent — copy của phân hệ này
 * (19 màn, giọng văn cho trẻ em) sẽ rất nhiều, nhét vào file chung chỉ làm nặng
 * các app không dùng tới.
 *
 * Ngôn ngữ do người dùng chọn ở topbar, lưu localStorage. Key nào chưa dịch
 * tiếng Anh thì i18next tự rơi về tiếng Việt (`fallbackLng`), giao diện không vỡ.
 */
export const LANGUAGE_STORAGE_KEY = "student_language";

export const SUPPORTED_LANGUAGES = ["vi", "en"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const stored = localStorage.getItem(
  LANGUAGE_STORAGE_KEY,
) as SupportedLanguage | null;

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: studentVI },
    en: { translation: studentEN },
  },
  lng: stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : "vi",
  fallbackLng: "vi",
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export const changeLanguage = (language: SupportedLanguage) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  i18n.changeLanguage(language);
};

export default i18n;
