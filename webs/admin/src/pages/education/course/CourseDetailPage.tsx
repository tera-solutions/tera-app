/* Import: library */
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Spin,
  ArrowSmallLeftSolid,
  Breadcrumb,
  PencilSquareOutlined,
  Button,
} from "tera-dls";

/* Import: packages */
import { COURSE_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { CourseService } from "@tera/modules";

/* Import: pages */
import CourseDetailContent, {
  getCourseDetailTabs,
} from "./containers/CourseDetailContent";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Trang này chỉ dành cho mobile; desktop dùng modal trên trang danh sách.
  // Resize sang desktop → quay về danh sách và nhắn nó mở modal detail.
  useEffect(() => {
    if (!isMobile) {
      navigate(COURSE_PAGE_URL.list.path, {
        replace: true,
        state: { openModal: { type: "detail", id } },
      });
    }
  }, [isMobile, navigate, id]);
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "basic";
  const setActiveTab = (key: string) =>
    setSearchParams({ tab: key }, { replace: true });

  const { data, isPending } = CourseService.useCourseDetail({ id });

  const course = data?.data?.course ?? data?.data;
  const statistics = data?.data?.statistics;

  const detailTabs = getCourseDetailTabs(t);

  return (
    <div className="tera-page-form gap-0! relative">
      <div className="sticky top-11.25 z-30 bg-[#F3F3F9]">
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
                      <span className="text-blue-400! hover:text-blue-600!">
                        {t("course.list")}
                      </span>
                    </a>
                  ),
                },
                {
                  title: t("course.detail"),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="relative">
          {/* Profile card */}
          <div className="relative z-20 flex flex-col items-center py-4 px-20 bg-white rounded-md shadow-sm border border-gray-100 w-fit mx-auto">
            <div className="w-20 h-20 rounded-lg mb-3 overflow-hidden border border-gray-100">
              {course?.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                  {course?.name ? course.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <p className="text-base font-bold text-gray-800">
              {course?.name ?? "—"}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">{course?.code ?? "—"}</p>
          </div>

          {/* Info card */}
          <div className="relative z-10 bg-white rounded-lg border border-gray-200 shadow-sm px-4 pb-4 pt-6 -mt-14">
            <div className="pt-10">
              <div className="flex overflow-x-auto border-b border-gray-200 mb-4 scrollbar-none">
                {detailTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <Spin spinning={isPending}>
                <CourseDetailContent
                  course={course}
                  statistics={statistics}
                  activeTab={activeTab}
                />
              </Spin>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={() => navigate(COURSE_PAGE_URL.update.path(Number(id)))}
            className="flex items-center gap-2 px-6 py-3 xmd:px-4 xmd:py-2 mr-4 rounded-xl! bg-gradient-to-r! from-green-400! to-emerald-500! text-white! font-semibold shadow-lg shadow-emerald-200 hover:from-green-500! hover:to-emerald-600! hover:shadow-emerald-300 active:scale-95 transition-all duration-200 border-none!"
          >
            <PencilSquareOutlined className="w-5 h-5 xmd:w-4 xmd:h-4" />
            <span className="text-base xmd:text-sm">{t("button.edit")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
