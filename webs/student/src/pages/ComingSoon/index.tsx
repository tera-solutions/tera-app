import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import rabbitImg from "@/assets/characters/rabbit.png";

interface IProps {
  /** Key i18n tên màn hình, vd "screens.practice" */
  titleKey: string;
}

/** Placeholder cho các màn 087–104 đã có route nhưng chưa dựng UI */
const ComingSoon = ({ titleKey }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="hana-card mt-2 flex flex-col items-center gap-3 px-6 py-14 text-center">
      <img src={rabbitImg} alt="" className="h-28 w-28 object-contain" />
      <h1 className="text-xl font-bold text-hana-navy">{t(titleKey)}</h1>
      <p className="max-w-sm text-sm text-hana-muted">
        {t("coming_soon.description")}
      </p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-1 cursor-pointer rounded-full bg-hana-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-hana-blue-dark"
      >
        {t("common.back")}
      </button>
    </div>
  );
};

export default ComingSoon;
