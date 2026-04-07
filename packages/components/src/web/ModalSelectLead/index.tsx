import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Modal, Spin } from "tera-dls";
import LeadContent, { ILeadContentRef } from "./LeadContent";

function ModalSelectLead() {
  const {
    modalSelectStore: { lead, updateData, closeModal },
  } = useStores();
  // const {
  //   openModalLead,
  //   handleSelectItemLead,
  //   closeModalLead,
  //   selectedLead,
  //   title,
  // } = useCrmClient();

  const actionRef = useRef<ILeadContentRef>(null);

  const handleOk = () => {
    updateData("lead", "data", actionRef?.current?.onSubmit());
    closeModal("lead");
    // handleSelectItemLead(actionRef?.current?.onSubmit())
  };

  return (
    <Modal
      // title={
      //   <>
      //     DANH SÁCH <span className="uppercase">{title}</span>
      //   </>
      // }
      title="Danh sách tiềm năng"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[90%]"
      onOk={() => handleOk()}
      onCancel={() => closeModal("lead")}
      open={lead?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <LeadContent ref={actionRef} title="tiềm năng" value={lead?.data} />
      </Spin>
    </Modal>
  );
}

export default observer(ModalSelectLead);
