import { useTranslation } from "react-i18next";

import rabbitImg from "@/assets/characters/rabbit.png";

/** Thẻ nhắc của trợ lý AI — mục 5.5 của task [087] */
const HanaAiPromptCard = () => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center gap-3 rounded-hana bg-hana-blue-soft p-4">
      <img
        src={rabbitImg}
        alt={t("ai.name")}
        className="h-16 w-16 shrink-0 object-contain"
      />
      <div className="min-w-0">
        <p className="text-lg font-bold text-hana-navy">
          {t("classes.ai_title")}
        </p>
        <p className="text-sm text-hana-muted">{t("classes.ai_desc")}</p>
        <button
          type="button"
          className="mt-2 cursor-pointer rounded-full bg-hana-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-hana-blue-dark"
        >
          {t("ai.chat_now")}
        </button>
      </div>
    </section>
  );
};

export default HanaAiPromptCard;
