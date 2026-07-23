import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownOutlined } from "tera-dls";

import useClickOutside from "_common/hooks/useClickOutside";
import { changeLanguage, SupportedLanguage } from "@/i18n";

/** Cờ vẽ bằng SVG để không lệ thuộc font emoji cờ của hệ điều hành */
const FlagVN = () => (
  <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0 rounded-[3px]">
    <rect width="24" height="16" fill="#da251d" />
    <path
      d="M12 3.2l1.4 4.3h4.5l-3.6 2.6 1.4 4.3-3.7-2.7-3.7 2.7 1.4-4.3-3.6-2.6h4.5z"
      fill="#ff0"
    />
  </svg>
);

const FlagEN = () => (
  <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0 rounded-[3px]">
    <rect width="24" height="16" fill="#012169" />
    <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
    <path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1.6" />
    <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
    <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
  </svg>
);

const LANGUAGES: {
  value: SupportedLanguage;
  label: string;
  Flag: () => JSX.Element;
}[] = [
  { value: "vi", label: "VN", Flag: FlagVN },
  { value: "en", label: "EN", Flag: FlagEN },
];

/** Đổi ngôn ngữ hiển thị VN/EN — mục 5.1 + test case #7 của task [086] */
const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const current =
    LANGUAGES.find((l) => l.value === i18n.language) ?? LANGUAGES[0];
  const CurrentFlag = current.Flag;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="hana-chip cursor-pointer"
        title={`${t("topbar.language_tooltip")}: ${current.label}`}
      >
        {/* Chỉ hiện cờ — tên ngôn ngữ để dành cho lúc xổ menu ra */}
        <CurrentFlag />
        <ChevronDownOutlined
          className={`h-4 w-4 text-hana-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-32 overflow-hidden rounded-2xl bg-white py-1 shadow-hana">
          {LANGUAGES.map(({ value, label, Flag }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                changeLanguage(value);
                setOpen(false);
              }}
              className={`flex h-11 w-full cursor-pointer items-center gap-2 px-3.5 text-sm font-semibold transition hover:bg-hana-blue-soft ${
                value === current.value ? "text-hana-blue" : "text-hana-navy"
              }`}
            >
              <Flag />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
