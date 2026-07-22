import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CogOutlined, MicrophoneOutlined } from "tera-dls";

import { STUDENT_PAGE_URL } from "_common/constants/url";
import girlImg from "@/assets/characters/girl.png";
import rabbitImg from "@/assets/characters/rabbit.png";

interface IProps {
  topic?: string;
}

const actionClass =
  "flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-hana transition hover:-translate-y-0.5";

/** Banner chào mừng — mục 5.2 của task [086] */
const WelcomeBanner = ({ topic }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-hana-lg bg-gradient-to-r from-[#dbeafe] via-[#e7f1ff] to-[#cfe4ff] px-6 py-7 shadow-hana-lg xl:px-10 xl:py-9">
      {/* mây trang trí */}
      <span className="pointer-events-none absolute -left-12 bottom-0 h-24 w-48 rounded-full bg-white/45 blur-lg" />
      <span className="pointer-events-none absolute left-1/3 top-3 h-12 w-24 rounded-full bg-white/35 blur-lg" />
      <span className="pointer-events-none absolute bottom-6 right-10 h-16 w-40 rounded-full bg-white/35 blur-lg" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="max-w-md">
          <h1 className="text-3xl font-extrabold text-hana-navy xl:text-[40px]">
            {t("banner.hello")}
          </h1>
          <p className="mt-2 text-base font-medium text-hana-navy/80 xl:text-lg">
            <Trans
              i18nKey="banner.intro"
              values={{ topic: topic ?? t("banner.default_topic") }}
              components={{
                b: <span className="font-extrabold text-hana-blue" />,
              }}
            />
          </p>

          <div className="mt-5 flex items-center gap-5">
            <div className="text-center">
              <button
                type="button"
                className={actionClass}
                onClick={() => navigate(STUDENT_PAGE_URL.settings)}
                title={t("banner.settings")}
              >
                <CogOutlined className="h-6 w-6 text-hana-muted" />
              </button>
              <p className="mt-1.5 text-xs font-semibold text-hana-muted">
                {t("banner.settings")}
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                className={actionClass}
                title={t("banner.speak")}
              >
                <MicrophoneOutlined className="h-6 w-6 text-hana-blue" />
              </button>
              <p className="mt-1.5 text-xs font-semibold text-hana-blue">
                {t("banner.speak")}
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                className={`${actionClass} overflow-hidden p-1`}
                onClick={() => navigate(STUDENT_PAGE_URL.companion)}
                title={t("banner.companion")}
              >
                <img
                  src={rabbitImg}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </button>
              <p className="mt-1.5 text-xs font-semibold text-hana-muted">
                {t("banner.companion")}
              </p>
            </div>
          </div>
        </div>

        <img
          src={girlImg}
          alt=""
          className="pointer-events-none hidden h-[230px] shrink-0 self-end object-contain drop-shadow-sm md:block xl:h-[290px]"
        />
      </div>
    </section>
  );
};

export default WelcomeBanner;
