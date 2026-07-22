import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import HanaLogo from "_common/components/Layout/StudentLayout/HanaLogo";
import Sparkle from "_common/components/Sparkle";
import girlImg from "@/assets/characters/girl.png";

/**
 * Phần đầu màn đăng nhập trên mobile — mockup screen/mobile/dang nhap.png.
 * Desktop dùng `LoginIntro` thay cho khối này.
 *
 * Hero đứng yên (`sticky top-0`) còn phiếu đăng nhập trượt đè lên; càng cuộn
 * xuống hero càng mờ + sáng dần để chữ trong form dễ đọc.
 * ⚠️ Hiệu ứng này cần cha KHÔNG có `overflow-hidden` (xem `Login/index.tsx`
 * dùng `overflow-x-clip`) — `overflow:hidden` sẽ vô hiệu hoá `position: sticky`.
 */
const LoginHero = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const height = ref.current?.offsetHeight ?? 0;
      if (!height) return; // desktop ẩn hero (xl:hidden) → bỏ qua
      // cuộn hết ~3/4 chiều cao hero là mờ tối đa
      const next = Math.min(1, Math.max(0, window.scrollY / (height * 0.75)));
      setProgress(next);
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
      className="sticky top-0 z-0 flex min-h-[50vh] w-full flex-col justify-end px-6 pb-4 pt-6 xl:hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          filter: `blur(${progress * 9}px)`,
          transform: `scale(${1 + progress * 0.08})`,
          opacity: 1 - progress * 0.2,
          willChange: "filter, transform",
        }}
      >
        <HanaLogo className="absolute left-6 top-6" />

        <Sparkle className="absolute right-[42%] top-[18%] h-6 w-6 text-hana-sun" />
        <Sparkle className="absolute right-[10%] top-[30%] h-5 w-5 text-hana-sun/80" />
        <Sparkle className="absolute right-[52%] top-[26%] h-4 w-4 text-white" />

        <img
          src={girlImg}
          alt=""
          className="absolute -right-8 bottom-0 h-[68%] max-h-[400px] object-contain"
        />

        <div className="absolute bottom-4 left-6 max-w-[52%]">
          <h1 className="text-[34px] font-extrabold leading-tight text-hana-navy">
            {t("banner.hello")}
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-hana-navy/85">
            <Trans
              i18nKey="auth.welcome_subtitle"
              components={{
                b: <span className="font-semibold text-hana-blue" />,
              }}
            />
          </p>
        </div>
      </div>

      {/* Lớp sương trắng phủ dần khi cuộn */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#eaf3ff]"
        style={{ opacity: progress * 0.45 }}
      />
    </div>
  );
};

export default LoginHero;
