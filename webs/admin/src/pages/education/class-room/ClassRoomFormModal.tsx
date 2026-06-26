/* Import: library */
import { useRef, useState } from "react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { ClassRoomService } from "@tera/modules";

/* Import: pages */
import ClassRoomForm from "./containers/ClassRoomForm";
import ClassRoomDetailContent, {
  getClassRoomDetailTabs,
} from "./containers/ClassRoomDetailContent";

const ClassRoomFormModal = ({ open, onClose, id, type }: IModalProps) => {
  const [currentType, setCurrentType] = useState(type);
  const [detailTab, setDetailTab] = useState("basic");
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = currentType === "detail";

  const { data, isLoading } = ClassRoomService.useClassRoomDetail({ id });
  const classRoom =
    data?.data?.class ??
    data?.data?.class_room ??
    data?.data?.classRoom ??
    data?.data;
  const statistics = data?.data?.statistics;
  const hasSessions =
    (data?.data?.statistics?.operational?.total_sessions ?? 0) > 0;
  const detailTabs = getClassRoomDetailTabs(t);

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
    create: t("classroom.create"),
    update: t("classroom.update"),
    detail: t("classroom.detail"),
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
          <>
            <div className="flex flex-col items-center py-3 bg-white rounded-md border border-gray-100 mb-3">
              <p className="text-sm font-bold text-gray-800">
                {classRoom?.name ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {classRoom?.code ?? "—"}
              </p>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto overflow-y-hidden scrollbar-none">
              {detailTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDetailTab(tab.key)}
                  className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                    detailTab === tab.key
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
              activeTab={detailTab}
            />
          </>
        ) : (
          <ClassRoomForm
            ref={actionRef}
            dataDetail={classRoom}
            type={currentType}
            hasSessions={hasSessions}
            onSuccess={onClose}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default ClassRoomFormModal;
