import { Trans, useTranslation } from "react-i18next";
import {
  BookOpenOutlined,
  ShieldCheckOutlined,
  StarOutlined,
  TrophyOutlined,
  UserGroupOutlined,
} from "tera-dls";

import HanaFlower from "_common/components/HanaFlower";
import Sparkle from "_common/components/Sparkle";
import girlImg from "@/assets/characters/girl.png";
import rabbitImg from "@/assets/characters/rabbit.png";

/** Nửa trái màn đăng nhập — mockup screen/desktop/dang nhap.png */
const LoginIntro = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();

  const features = [
    { icon: BookOpenOutlined, label: t("auth.feature_learn") },
    { icon: TrophyOutlined, label: t("auth.feature_achievement") },
    { icon: UserGroupOutlined, label: t("auth.feature_friends") },
    { icon: StarOutlined, label: t("auth.feature_explore") },
  ];

  return (
    <div className={`max-w-[680px] ${className}`}>
      <h1 className="max-w-[380px] text-[46px] font-extrabold leading-[1.15] text-hana-navy">
        {t("auth.welcome_title")}
      </h1>
      <p className="mt-4 max-w-[420px] text-base leading-relaxed text-hana-navy/70">
        <Trans
          i18nKey="auth.welcome_subtitle"
          components={{ b: <span className="font-semibold text-hana-blue" /> }}
        />
      </p>

      {/* Hoa trang trí + nhân vật vẫy tay */}
      <div className="relative mt-2 h-[340px]">
        <Sparkle className="absolute left-[52%] top-2 h-7 w-7 text-hana-sun" />
        <Sparkle className="absolute left-[30%] top-16 h-4 w-4 text-white" />
        <Sparkle className="absolute right-[18%] top-24 h-5 w-5 text-white" />
        <HanaFlower className="absolute bottom-8 left-2 h-44 w-44 drop-shadow-sm" />
        <img
          src={girlImg}
          alt=""
          className="pointer-events-none absolute bottom-0 left-[24%] h-[340px] object-contain"
        />
      </div>

      {/* Thẻ "Học tập an toàn & bảo mật" */}
      <div className="relative flex items-center gap-4 overflow-hidden rounded-hana bg-white/55 p-5 pr-44">
        <ShieldCheckOutlined className="h-14 w-14 shrink-0 text-hana-blue" />
        <div>
          <p className="text-lg font-bold text-hana-navy">
            {t("auth.safe_title")}
          </p>
          <p className="mt-1 max-w-[280px] text-sm leading-relaxed text-hana-navy/70">
            {t("auth.safe_desc")}
          </p>
        </div>
        <img
          src={rabbitImg}
          alt=""
          className="pointer-events-none absolute bottom-0 right-3 h-36 object-contain"
        />
      </div>

      {/* Dải 4 điểm nổi bật */}
      <div className="mt-4 grid grid-cols-2 gap-4 rounded-hana bg-white/55 px-6 py-5 sm:grid-cols-4">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon className="h-7 w-7 shrink-0 text-hana-blue" />
            <span className="max-w-[92px] text-sm font-semibold leading-tight text-hana-navy">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginIntro;
