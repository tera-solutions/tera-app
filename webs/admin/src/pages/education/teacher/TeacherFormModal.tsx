/* Import: library */
import { useRef } from "react";
import { Modal, Spin } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import TeacherForm from "./containers/TeacherForm";

const TeacherFormModal = ({ open, onClose, id, type }: IModalProps) => {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const isDetail = type === "detail";

  const { data, isLoading } = TeacherService.useTeacherDetail({ id });

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
    create: t("teacher.create"),
    update: t("teacher.update"),
    detail: t("teacher.detail"),
  };

  return (
    <Modal
      title={titleMap[type]}
      destroyOnClose
      closeIcon={false}
      width={"60%"}
      cancelText={t("button.cancel")}
      okText={isDetail ? undefined : t("button.save")}
      okButtonProps={isDetail ? { style: { display: "none" } } : undefined}
      onOk={() => actionRef?.current?.submit()}
      onCancel={handleCloseConfirm}
      open={open}
      centered={true}
    >
      <Spin spinning={isLoading}>
        <TeacherForm
          ref={actionRef}
          dataDetail={data?.data?.teacher}
          type={type}
          onSuccess={onClose}
        />
      </Spin>
    </Modal>
  );
};

export default TeacherFormModal;
