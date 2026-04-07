import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Modal, Spin } from "tera-dls";
import CustomerLeadContent, {
  ICustomerLeadContentRef,
} from "./CustomerLeadContent";

function ModalSelectCustomerLead() {
  const {
    modalSelectStore: { customerLead, closeModal, updateData },
  } = useStores();
  // const {
  //   openModalCustomerLead,
  //   handleSelectItemCustomerLead,
  //   closeModalCustomerLead,
  //   selectedCustomerLead,
  //   title,
  // } = useCrmClient();

  const actionRef = useRef<ICustomerLeadContentRef>(null);

  const handleOk = () => {
    // handleSelectItemCustomerLead(actionRef?.current?.onSubmit());
    updateData("customerLead", "data", actionRef?.current?.onSubmit());
    closeModal("customerLead");
  };

  return (
    <Modal
      title="Danh sách khách hàng tiềm năng"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="w-[95%] xmd:w-[90%]"
      onOk={() => handleOk()}
      onCancel={() => closeModal("customerLead")}
      open={customerLead?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <CustomerLeadContent
          ref={actionRef}
          title={"khách hàng tiềm năng"}
          value={customerLead?.data}
        />
      </Spin>
    </Modal>
  );
}

export default observer(ModalSelectCustomerLead);
