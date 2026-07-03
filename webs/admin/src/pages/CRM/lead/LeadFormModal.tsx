/* Import: library */
import { useRef, useState } from "react";
import { Modal, Spin, Button } from "tera-dls";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { messageWarning } from "@tera/commons/constants/message";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IFormRef, IModalProps } from "@tera/commons/interfaces";

/* Import: services */
import { LeadService } from "@tera/modules";

/* Import: pages */
import LeadForm from "./containers/LeadForm";

const LeadFormModal = ({ open, onClose, id, type }: IModalProps) => {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const actionRef = useRef<IFormRef>(null);
  const [currentType, setCurrentType] = useState(type);

  const isDetail = currentType === "detail";

  const { data, isLoading } = LeadService.useLeadDetail({ id });
  const lead = data?.data?.lead ?? data?.data;

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
    create: t("lead.create"),
    update: t("lead.update"),
    detail: t("lead.detail"),
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
        <LeadForm
          ref={actionRef}
          dataDetail={lead}
          type={currentType}
          onSuccess={onClose}
        />
      </Spin>
    </Modal>
  );
};

export default LeadFormModal;
