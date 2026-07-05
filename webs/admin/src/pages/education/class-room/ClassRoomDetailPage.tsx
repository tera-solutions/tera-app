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
import { CLASS_ROOM_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { ClassRoomService } from "@tera/modules";

/* Import: pages */
import ClassRoomDetailContent, {
  getClassRoomDetailTabs,
} from "./containers/ClassRoomDetailContent";

const ClassRoomDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Trang này chỉ dành cho mobile; desktop dùng modal trên trang danh sách.
  // Resize sang desktop → quay về danh sách và nhắn nó mở modal detail.
  useEffect(() => {
    if (!isMobile) {
      navigate(CLASS_ROOM_PAGE_URL.list.path, {
        replace: true,
        state: { openModal: { type: "detail", id } },
      });
    }
  }, [isMobile, navigate, id]);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "basic";

  const { data, isPending } = ClassRoomService.useClassRoomDetail({ id });
  const classRoom =
    data?.data?.class ??
    data?.data?.class_room ??
    data?.data?.classRoom ??
    data?.data;
  const statistics = data?.data?.statistics;

  const tabs = getClassRoomDetailTabs(t);

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
                        {t("classroom.list")}
                      </span>
                    </a>
                  ),
                },
                { title: t("classroom.detail") },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center py-4 bg-white rounded-md shadow-sm border border-gray-100 w-fit mx-auto px-16 mb-2">
          <p className="text-base font-bold text-gray-800">
            {classRoom?.name ?? "—"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{classRoom?.code ?? "—"}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <Spin spinning={isPending}>
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto overflow-y-hidden scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSearchParams({ tab: tab.key }, { replace: true })}
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

            <ClassRoomDetailContent
              classRoom={classRoom}
              statistics={statistics}
              activeTab={activeTab}
            />
          </Spin>
        </div>

        <div className="flex justify-end mt-2 max-xmd:mb-[60px]">
          <Button
            onClick={() => navigate(CLASS_ROOM_PAGE_URL.update.path(Number(id)))}
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

export default ClassRoomDetailPage;
