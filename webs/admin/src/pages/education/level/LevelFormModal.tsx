/* Import: library */
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "tera-dls";

/* Import: packages */
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: pages */
import LevelForm from "./containers/LevelForm";
import { ILevel } from "./_interface";

interface IProps {
  open: boolean;
  type: "create" | "update" | "detail";
  record?: ILevel | null;
  onClose: () => void;
}

const LevelFormModal = ({ open, type, record, onClose }: IProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const formRef = useRef<any>(null);
  const isView = type === "detail";

  const title =
    type === "create"
      ? t("level.create")
      : type === "update"
        ? t("level.update")
        : t("level.detail");

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      width={isMobile ? "94%" : 640}
      className="max-w-[640px]!"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="alternative"
            onClick={onClose}
            className="rounded-lg bg-white! cursor-pointer"
          >
            {isView ? t("button.close") : t("button.cancel")}
          </Button>
          {!isView && (
            <Button
              onClick={() => formRef.current?.submit()}
              className="rounded-lg bg-blue-500! text-white! cursor-pointer"
            >
              {t("button.save")}
            </Button>
          )}
        </div>
      }
    >
      <LevelForm
        ref={formRef}
        type={type}
        dataDetail={record}
        onSuccess={onClose}
      />
    </Modal>
  );
};

export default LevelFormModal;
