/* Import: library */
import { useRef, useState } from "react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { CourseService } from "@tera/modules";

/* Import: pages */
import CourseForm from "./containers/CourseForm";
import CourseDetailContent, {
  getCourseDetailTabs,
} from "./containers/CourseDetailContent";

const CourseFormModal = ({ open, onClose, id, type }: IModalProps) => {
  const [currentType, setCurrentType] = useState(type);
  const [activeTab, setActiveTab] = useState("basic");
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = currentType === "detail";

  const { data, isLoading } = CourseService.useCourseDetail({ id });
  const course = data?.data?.course ?? data?.data;
  const statistics = data?.data?.statistics;

  const detailTabs = getCourseDetailTabs(t);

  const handleCloseConfirm = async () => {
    if (!isDetail && actionRef.current?.isDirty?.()) {
      confirm.warning({
        title: t("common.exit_title"),
        content: (
          <>
            <p>{messageWarning.WARNING_EXIT_1}</p>
            <p>{messageWarning.WARNING_EXIT_2}</p>
          </>
        ),
        onOk: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  const titleMap = {
    create: t("course.create"),
    update: t("course.update"),
    detail: t("course.detail"),
  };

  return (
    <Modal
      title={titleMap[currentType]}
      destroyOnClose
      closeIcon={false}
      width={"60%"}
      open={open}
      centered={true}
      footer={
        <div className="flex justify-end gap-2">
          {isDetail && (
            <Button
              onClick={() => setCurrentType("update")}
              className="rounded-xsm!"
            >
              {t("button.edit")}
            </Button>
          )}
          <Button onClick={handleCloseConfirm} className="rounded-xsm!">
            {t("button.cancel")}
          </Button>
          {!isDetail && (
            <Button
              type="primary"
              className="rounded-xsm!"
              onClick={() => actionRef?.current?.submit()}
            >
              {t("button.save")}
            </Button>
          )}
        </div>
      }
    >
      <Spin spinning={isLoading}>
        {isDetail ? (
          <div>
            {/* Profile card */}
            <div className="flex flex-col items-center py-4 bg-white rounded-md border border-gray-100 mb-3">
              <div className="w-20 h-20 rounded-lg mb-2 overflow-hidden border border-gray-100">
                {course?.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl font-bold">
                    {course?.name ? course.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-gray-800">
                {course?.name ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {course?.code ?? "—"}
              </p>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-gray-200 mb-3 overflow-x-auto overflow-y-hidden scrollbar-none">
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

            <CourseDetailContent
              course={course}
              statistics={statistics}
              activeTab={activeTab}
            />
          </div>
        ) : (
          <CourseForm
            ref={actionRef}
            dataDetail={course}
            type={currentType}
            hasClasses={(statistics?.operational?.total_classes ?? 0) > 0}
            onSuccess={onClose}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default CourseFormModal;
