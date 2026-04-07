import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Modal, Spin } from "tera-dls";
import SupplierLeadContent, {
  ISupplierLeadContentRef,
} from "./SupplierLeadContent";

function ModalSelectSupplierLead() {
  const {
    modalSelectStore: { supplierLead, updateData, closeModal },
  } = useStores();
  // const {
  //   openModalSupplierLead,
  //   handleSelectItemSupplierLead,
  //   closeModalSupplierLead,
  //   selectedSupplierLead,
  //   title,
  // } = useCrmClient();

  const actionRef = useRef<ISupplierLeadContentRef>(null);

  const handleOk = () => {
    updateData("supplierLead", "data", actionRef?.current?.onSubmit());
    closeModal("supplierLead");
  };

  return (
    <Modal
      // title={
      //   <>
      //     DANH SÁCH <span className="uppercase">{title}</span>
      //   </>
      // }
      title="Danh sách nhà cung cấp tiềm năng"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[65%] md:w-[65%] lg:w-[90%] z-100"
      onOk={() => handleOk()}
      onCancel={() => closeModal("supplierLead")}
      open={supplierLead?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <SupplierLeadContent
          ref={actionRef}
          title="nhà cung cấp tiềm năng"
          value={supplierLead?.data}
        />
      </Spin>
    </Modal>
  );
}

export default observer(ModalSelectSupplierLead);
