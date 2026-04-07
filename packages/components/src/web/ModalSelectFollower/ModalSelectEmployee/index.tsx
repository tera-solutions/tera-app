import { useCrmClient } from "@tera/components/dof/CrmProvider";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Modal, Spin } from "tera-dls";
import EmployeeContent, { IEmployeeContentRef } from "./EmployeeContent";
import { useStores } from "hooks/useStores";

function ModalSelectCustomer() {
  const {
    modalSelectStore: { employee, closeModal, updateData },
  } = useStores();
  // const {
  //   openModalEmployee,
  //   handleSelectItemEmployee,
  //   closeModalEmployee,
  //   selectEmployee,
  //   title,
  // } = useCrmClient();
  const actionRef = useRef<IEmployeeContentRef>(null);

  const handleOk = () => {
    updateData("employee", "data", actionRef?.current?.onSubmit());
    closeModal("employee");
    // handleSelectItemEmployee(actionRef?.current?.onSubmit());
  };

  return (
    <Modal
      title={`Danh sách ${employee.title}`}
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[65%] md:w-[65%] lg:w-[90%]"
      onOk={() => handleOk()}
      onCancel={() => closeModal("employee")}
      open={employee?.open}
      // onCancel={() => closeModalEmployee()}
      // open={openModalEmployee?.open}
      centered={true}
    >
      <Spin spinning={false}>
        <EmployeeContent
          mode={employee?.mode}
          ref={actionRef}
          title={employee?.title}
          value={employee?.data}
        />
      </Spin>
    </Modal>
  );
}

export default observer(ModalSelectCustomer);
