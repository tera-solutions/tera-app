/* Import: library */
import { useRef } from "react";
import { Modal, Spin } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { StudentService } from "@tera/modules";

/* Import: pages */
import StudentForm from "./containers/StudentForm";

const StudentFormModal = (props: IModalProps) => {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);

  const { open, onClose, id, type } = props;

  const { data, isLoading } = StudentService.useStudentDetail({ id });

  const handleCloseConfirm = async () => {
    if (actionRef.current?.isDirty) {
      confirm.warning({
        title: t("common.exit_title"),
        content: (
          <>
            <p>{messageWarning.WARNING_EXIT_1}</p>
            <p>{messageWarning.WARNING_EXIT_2}</p>
          </>
        ),
        onOk: () => {
          onClose();
        },
      });
    } else onClose();
  };

  return (
    <Modal
      title={id ? t("student.update") : t("student.create")}
      destroyOnClose
      closeIcon={false}
      width={"80%"}
      cancelText={t("button.cancel")}
      okText={t("button.save")}
      onOk={() => actionRef?.current?.submit()}
      onCancel={handleCloseConfirm}
      open={open}
      centered={true}
    >
      <Spin spinning={isLoading}>
        <StudentForm ref={actionRef} dataDetail={data?.data} type={type} />
      </Spin>
    </Modal>
  );
};

export default StudentFormModal;
