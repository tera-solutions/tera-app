/* Import: library */
import { useRef, useState } from "react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { LessonService } from "@tera/modules";

/* Import: pages */
import LessonForm from "./containers/LessonForm";

const LessonFormModal = ({ open, onClose, id, type }: IModalProps) => {
  const [currentType, setCurrentType] = useState(type);
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = currentType === "detail";

  const { data, isLoading } = LessonService.useLessonDetail({ id });
  const lesson = data?.data?.lesson ?? data?.data;

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
    create: t("lesson.create"),
    update: t("lesson.update"),
    detail: t("lesson.detail"),
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
          {isDetail &&
            !lesson?.is_locked &&
            lesson?.status !== "completed" &&
            lesson?.status !== "cancelled" && (
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
        <LessonForm
          ref={actionRef}
          dataDetail={lesson}
          type={currentType}
          onSuccess={onClose}
        />
      </Spin>
    </Modal>
  );
};

export default LessonFormModal;
