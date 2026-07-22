import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronLeftOutlined } from "tera-dls";

import HanaLogo from "_common/components/Layout/StudentLayout/HanaLogo";
import Sparkle from "_common/components/Sparkle";
import girlImg from "@/assets/characters/girl.png";
import rabbitImg from "@/assets/characters/rabbit.png";

/**
 * Phần đầu màn đăng ký trên mobile — mockup screen/mobile/dang ky.png.
 * Cùng cơ chế với `Login/containers/LoginHero`: hero `sticky` đứng yên, phiếu
 * đăng ký trượt đè lên và hero mờ dần theo mức cuộn.
 */
const RegisterHero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const height = ref.current?.offsetHeight ?? 0;
      if (!height) return; // desktop ẩn hero (xl:hidden) → bỏ qua
      setProgress(Math.min(1, Math.max(0, window.scrollY / (height * 0.75))));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="sticky top-0 z-0 flex min-h-[54vh] w-full flex-col justify-end px-6 pb-4 pt-6 xl:hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          filter: `blur(${progress * 9}px)`,
          transform: `scale(${1 + progress * 0.08})`,
          opacity: 1 - progress * 0.2,
          willChange: "filter, transform",
        }}
      >
        <div className="absolute left-6 top-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-hana-sm"
          >
            <ChevronLeftOutlined className="h-5 w-5 text-hana-navy" />
          </button>
          <HanaLogo />
        </div>

        <Sparkle className="absolute right-[38%] top-[16%] h-6 w-6 text-hana-sun" />
        <Sparkle className="absolute right-[8%] top-[24%] h-5 w-5 text-hana-sun/80" />

        <img
          src={rabbitImg}
          alt=""
          className="pointer-events-none absolute bottom-0 left-[2%] h-[26%] max-h-[150px] object-contain"
        />
        <img
          src={girlImg}
          alt=""
          className="pointer-events-none absolute -right-5 bottom-0 h-[64%] max-h-[380px] object-contain"
        />

        <div className="absolute left-6 top-[84px] max-w-[56%]">
          <h1 className="text-[23px] font-extrabold leading-snug text-hana-navy">
            {t("register.intro_title")}
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-hana-navy/70">
            {t("register.intro_subtitle")}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-[#eaf3ff]"
        style={{ opacity: progress * 0.45 }}
      />
    </div>
  );
};

export default RegisterHero;
