/* Import: library */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowSmallLeftSolid,
  Breadcrumb,
  BoltOutlined,
  Button,
} from "tera-dls";

/* Import: packages */
import { IFormRef } from "@tera/commons/interfaces";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { LESSON_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import LessonGenerateForm from "./containers/LessonGenerateForm";

/** Trang mobile: sinh bài học (generate) cho 1 lớp. */
const LessonGeneratePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const actionRef = useRef<IFormRef>(null);

  // Trang này chỉ dành cho mobile; desktop dùng modal generate trên trang danh sách.
  useEffect(() => {
    if (!isMobile) {
      navigate(LESSON_PAGE_URL.list.path, {
        replace: true,
        state: { openModal: { type: "create" } },
      });
    }
  }, [isMobile, navigate]);

  return (
    <div className="tera-page-form gap-0! relative">
      <div className="sticky top-11.5 z-10 bg-[#F3F3F9]">
        <div className="page-header-v2">
          <div className="page-header-v2__breadcrumb">
            <div
              className="page-header__breadcrumb-back cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ArrowSmallLeftSolid className="h-6 w-6" />
            </div>
            <Breadcrumb
              separator={">"}
              items={[
                {
                  title: (
                    <a onClick={() => navigate(-1)}>
                      <span className="!text-blue-400 hover:!text-blue-600">
                        {t("lesson.list")}
                      </span>
                    </a>
                  ),
                },
                { title: t("lesson.generate") },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto max-xmd:pb-[60px]">
        <div className="flex justify-end mb-2">
          <Button
            onClick={() => actionRef?.current?.submit()}
            className="flex! items-center! gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold! shadow-lg! shadow-emerald-200! hover:from-green-500! hover:to-emerald-600! active:scale-95 transition-all duration-200 border-none!"
          >
            <BoltOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">
              {t("lesson.generate_submit")}
            </span>
          </Button>
        </div>

        <div className="bg-white rounded-[5px] w-full p-4">
          <LessonGenerateForm
            ref={actionRef}
            onSuccess={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonGeneratePage;
