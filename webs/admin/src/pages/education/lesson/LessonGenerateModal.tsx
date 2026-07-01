/* Import: library */
import { useRef } from "react";
import { Modal, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { IFormRef } from "@tera/commons/interfaces";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: pages */
import LessonGenerateForm from "./containers/LessonGenerateForm";

interface LessonGenerateModalProps {
  open: boolean;
  onClose: () => void;
}

const LessonGenerateModal = ({ open, onClose }: LessonGenerateModalProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const actionRef = useRef<IFormRef>(null);

  return (
    <Modal
      title={t("lesson.generate")}
      destroyOnClose
      closeIcon={false}
      width={isMobile ? "92%" : 520}
      className="max-w-[520px]!"
      open={open}
      centered
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="rounded-xsm!">
            {t("button.cancel")}
          </Button>
          <Button
            type="primary"
            className="rounded-xsm!"
            onClick={() => actionRef?.current?.submit()}
          >
            {t("lesson.generate_submit")}
          </Button>
        </div>
      }
    >
      <LessonGenerateForm ref={actionRef} onSuccess={onClose} />
    </Modal>
  );
};

export default LessonGenerateModal;
