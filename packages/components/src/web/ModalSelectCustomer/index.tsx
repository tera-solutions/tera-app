import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Modal } from "tera-dls";
import CustomerContent, { ICustomerContentRef } from "./CustomerContent";
import { tw } from "tailwind-merge.config";

function ModalSelectCustomer() {
  // const {
  //   openModalCustomer,
  //   handleSelectItemCustomer,
  //   closeModalCustomer,
  //   selectCustomer,
  //   title,
  // } = useCrmClient();
  const {
    modalSelectStore: { customer, updateData, closeModal },
  } = useStores();

  const actionRef = useRef<ICustomerContentRef>(null);

  const handleOk = () => {
    updateData("customer", "data", actionRef?.current?.onSubmit());
    closeModal("customer");
  };

  return (
    <Modal
      title="Danh sách khách hàng"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className={tw("sm:w-[95%] xmd:w-[90%]")}
      onOk={() => handleOk()}
      onCancel={() => closeModal("customer")}
      open={customer.open}
      centered={true}
    >
      <CustomerContent
        ref={actionRef}
        title={"khách hàng"}
        value={customer?.data}
      />
    </Modal>
  );
}

export default observer(ModalSelectCustomer);
