import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Modal, Spin } from "tera-dls";
import SupplierContent, { ISupplierContentRef } from "./SupplierContent";

function ModalSelectSupplier() {
  const {
    modalSelectStore: { supplier, updateData, closeModal },
  } = useStores();
  // const {
  //   openModalSupplier,
  //   handleSelectItemSupplier,
  //   closeModalSupplier,
  //   selectSupplier,
  //   title,
  // } = useCrmClient();

  const actionRef = useRef<ISupplierContentRef>(null);

  const handleOk = () => {
    updateData("supplier", "data", actionRef?.current?.onSubmit());
    closeModal("supplier");
    // handleSelectItemSupplier(actionRef?.current?.onSubmit());
  };

  return (
    <Modal
      // title={
      //   <>
      //     DANH SÁCH <span className="uppercase">{title}</span>
      //   </>
      // }
      title="Danh sách nhà cung cấp"
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[65%] md:w-[65%] lg:w-[90%] z-100"
      onOk={() => handleOk()}
      onCancel={() => closeModal("supplier")}
      open={supplier?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <SupplierContent
          ref={actionRef}
          title="nhà cung cấp"
          value={supplier?.data}
        />
      </Spin>
    </Modal>
  );
}

export default observer(ModalSelectSupplier);
