import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  BookOpenOutlined,
  ShieldCheckOutlined,
  StarOutlined,
  TrophyOutlined,
  UserGroupOutlined,
} from "tera-dls";

import HanaLogo from "_common/components/Layout/StudentLayout/HanaLogo";
import Sparkle from "_common/components/Sparkle";
import girlImg from "@/assets/characters/girl.png";
import rabbitImg from "@/assets/characters/rabbit.png";

/** Nửa trái màn đăng ký (desktop) — mockup screen/desktop/dang ky.png */
const RegisterIntro = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpenOutlined,
      tile: "bg-blue-100 text-hana-blue",
      title: t("register.feature_easy_title"),
      desc: t("register.feature_easy_desc"),
    },
    {
      icon: TrophyOutlined,
      tile: "bg-amber-100 text-amber-500",
      title: t("register.feature_progress_title"),
      desc: t("register.feature_progress_desc"),
    },
    {
      icon: UserGroupOutlined,
      tile: "bg-emerald-100 text-emerald-500",
      title: t("register.feature_friends_title"),
      desc: t("register.feature_friends_desc"),
    },
    {
      icon: StarOutlined,
      tile: "bg-purple-100 text-purple-500",
      title: t("register.feature_explore_title"),
      desc: t("register.feature_explore_desc"),
    },
  ];

  return (
    <div className={`max-w-[720px] ${className}`}>
      <HanaLogo />

      <h1 className="mt-8 max-w-[420px] text-[40px] font-extrabold leading-[1.15] text-hana-navy">
        {t("register.intro_title")}
      </h1>
      <p className="mt-4 max-w-[380px] text-base leading-relaxed text-hana-navy/85">
        {t("register.intro_subtitle")}
      </p>

      {/* Nhân vật + thỏ vẫy tay */}
      <div className="relative mt-2 h-[300px]">
        <Sparkle className="absolute left-[52%] top-2 h-6 w-6 text-white" />
        <Sparkle className="absolute right-[24%] top-12 h-7 w-7 text-hana-sun" />
        <img
          src={rabbitImg}
          alt=""
          className="pointer-events-none absolute bottom-0 left-[14%] h-[190px] object-contain"
        />
        <img
          src={girlImg}
          alt=""
          className="pointer-events-none absolute bottom-0 left-[34%] h-[300px] object-contain"
        />
      </div>

      {/* 4 điểm nổi bật */}
      <div className="grid grid-cols-2 gap-5 rounded-hana bg-white/60 px-6 py-5 sm:grid-cols-4">
        {features.map(({ icon: Icon, tile, title, desc }) => (
          <div key={title} className="text-center">
            <span
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${tile}`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-2 text-sm font-bold text-hana-navy">{title}</p>
            <p className="mt-0.5 text-xs leading-snug text-hana-muted">
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* An toàn & bảo mật */}
      <div className="mt-4 flex items-center gap-4 rounded-hana bg-white/60 p-5">
        <ShieldCheckOutlined className="h-14 w-14 shrink-0 text-hana-blue" />
        <div>
          <p className="text-lg font-bold text-hana-navy">
            {t("register.safe_title")}
          </p>
          <p className="mt-1 max-w-[400px] text-sm leading-relaxed text-hana-navy/85">
            {t("register.safe_desc")}
          </p>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-hana-navy">
        {t("register.have_account")}{" "}
        <Link
          to="/auth/login"
          className="font-bold text-hana-blue hover:underline"
        >
          {t("register.login_now")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterIntro;
