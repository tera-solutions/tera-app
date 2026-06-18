/* Import: library */
import { useRef, useState } from "react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { StudentService } from "@tera/modules";

/* Import: pages */
import StudentForm from "./containers/StudentForm";

const StudentFormModal = ({ open, onClose, id, type }: IModalProps) => {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);
  const [currentType, setCurrentType] = useState(type);

  const isDetail = currentType === "detail";

  const { data, isLoading } = StudentService.useStudentDetail({ id });
  const student = data?.data?.student;

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

  const titleMap: Record<string, string> = {
    create: t("student.create"),
    update: t("student.update"),
    detail: t("student.detail"),
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
            <Button onClick={() => setCurrentType("update")} className="rounded-xsm!">
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
        {isDetail && (
          <div className="flex flex-col items-center py-4 bg-white rounded-md border border-gray-100 mb-3">
            <div className="w-16 h-16 rounded-full mb-2 overflow-hidden">
              {student?.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl font-bold">
                  {student?.name ? student.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <p className="text-sm font-bold text-gray-800">
              {student?.name ?? "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{student?.code ?? "—"}</p>
          </div>
        )}
        <StudentForm
          ref={actionRef}
          dataDetail={student}
          type={currentType}
          onSuccess={onClose}
        />
      </Spin>
    </Modal>
  );
};

export default StudentFormModal;
