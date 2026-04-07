import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Modal, Select } from "tera-dls";
import CustomerContent, {
  ICustomerContentRef,
} from "../ModalSelectCustomer/CustomerContent";
import CustomerLeadContent from "../ModalSelectCustomerLead/CustomerLeadContent";
import SupplierContent from "../ModalSelectSupplier/SupplierContent";
import SupplierLeadContent from "../ModalSelectSupplierLead/SupplierLeadContent";

const OBJECT_TYPE = {
  customer: "khách hàng",
  supplier: "nhà cung cấp",
  customer_lead: "khách hàng tiềm năng",
  supplier_lead: "nhà cung cấp tiềm năng",
};

const TITLE = {
  customer: "Khách hàng",
  supplier: "Nhà cung cấp",
  customer_lead: "Khách hàng tiềm năng",
  supplier_lead: "Nhà cung cấp tiềm năng",
};

function ModalSelectCustomer() {
  const {
    modalSelectStore: { member, updateData, closeModal },
  } = useStores();
  // const {
  //   openModalMember,
  //   handleSelectItemMember,
  //   closeModalMember,
  //   selectedMember,
  //   exceptedMember,
  //   handleAddExceptIdMember,
  //   updateMemberType,
  //   memberType,
  // } = useCrmClient();
  const { open, displayMode = "delete" } = (member as any) ?? {};
  const [selectedType, setSelectedType] = useState<string>();

  useEffect(() => {
    setSelectedType(member?.type);
  }, [member?.type]);

  const actionRef = useRef<ICustomerContentRef>(null);

  const handleOk = () => {
    const data: any = actionRef?.current?.onSubmit();

    data &&
      updateData(
        "member",
        "data",
        data?.map((item) => ({ ...item, selectedType })),
      );
    // handleSelectItemMember(data?.map((item) => ({ ...item, selectedType })));
    // closeModalMember();
    closeModal("member");
  };

  const options = Object.entries(TITLE).map(([key, value]) => ({
    label: value,
    labelDisplay: <span>{value}</span>,
    value: key,
  }));

  const getExceptedMembers = () => {
    const result = member?.exceptId ?? [];
    member?.data?.forEach((item) => {
      const existed = result?.find(
        (i) =>
          i.id === item.id &&
          (i.selectedType === item.selectedType || i.type === item.type),
      );
      if (!existed) {
        result.push(item);
      }
    });
    return result;
  };
  const header = (
    <Select
      className="w-[500px] rounded-lg"
      options={options}
      onSelect={(val) => {
        setSelectedType(val as string);
        updateData("member", "data", []);
        updateData("member", "exceptId", getExceptedMembers());
        updateData("member", "type", val);
        // handleAddExceptIdMember(getExceptedMembers());
        // updateMemberType(val as any);
      }}
      value={selectedType}
    />
  );

  const object = {
    customer: CustomerContent,
    supplier: SupplierContent,
    customer_lead: CustomerLeadContent,
    supplier_lead: SupplierLeadContent,
  };

  const Wrapper = object[selectedType];

  const getExceptedIds = () => {
    if (displayMode === "delete") {
      const data = [
        ...(member?.exceptId ?? []),
        ...(member?.exceptId ?? []),
      ]?.filter(
        (item) =>
          item.selectedType === selectedType || item.type === selectedType,
      );

      return data.map((item) => item.id);
    }
    return [];
  };

  return (
    <>
      <Modal
        title={
          <>
            DANH SÁCH{" "}
            <span className="uppercase">{OBJECT_TYPE[selectedType]}</span>
          </>
        }
        okText="Đồng ý"
        cancelText="Huỷ"
        destroyOnClose
        closeIcon={false}
        className="sm:w-[65%] md:w-[65%] lg:w-[90%]"
        onOk={handleOk}
        onCancel={() => closeModal("member")}
        open={open}
        centered={true}
      >
        {Wrapper && (
          <Wrapper
            header={header}
            exceptedIds={getExceptedIds()}
            mode="multiple"
            rowSelectionProps={{ type: "checkbox" }}
            ref={actionRef}
            title={OBJECT_TYPE[selectedType]}
            value={member?.data?.filter(
              (item) => item.selectedType === selectedType,
            )}
            displayMode={displayMode}
          />
        )}
      </Modal>
    </>
  );
}

export default observer(ModalSelectCustomer);
