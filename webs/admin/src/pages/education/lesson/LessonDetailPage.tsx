/* Import: library */
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowSmallLeftSolid,
  Breadcrumb,
  PencilSquareOutlined,
  Button,
  Spin,
} from "tera-dls";

/* Import: packages */
import { LESSON_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { LessonService } from "@tera/modules";

/* Import: pages */
import LessonForm from "./containers/LessonForm";

const LessonDetailPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const { data, isLoading } = LessonService.useLessonDetail({ id });
  const lesson = data?.data?.lesson ?? data?.data;

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
                { title: t("lesson.detail") },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto max-xmd:pb-[60px]">
        {!lesson?.is_locked &&
          lesson?.status !== "completed" &&
          lesson?.status !== "cancelled" && (
            <div className="flex justify-end mb-2 mr-4">
              <Button
                onClick={() =>
                  navigate(LESSON_PAGE_URL.update.path(String(id)))
                }
                className="rounded-xsm!"
              >
                <PencilSquareOutlined className="w-4 h-4 mr-1" />
                {t("button.edit")}
              </Button>
            </div>
          )}

        <div className="bg-white rounded-[5px] w-full p-4">
          <Spin spinning={isLoading}>
            <LessonForm dataDetail={lesson} type="detail" />
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
