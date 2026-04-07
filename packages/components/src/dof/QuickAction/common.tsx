import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { OBJECT_KEY_CRM } from "@tera/commons/constants/object-key";
import {
  BuildingOffice2Outlined,
  OptionProps,
  SwatchOutlined,
  TableCellsOutlined,
  UserGroupOutlined,
} from "tera-dls";
import Description from "./components/Description";
import Heading from "./components/Heading";

const SubTitle = ({ title, code, name }) => {
  return (
    <Description
      title={title}
      value={
        <EmployeeText
          code={code}
          name={name}
          classNameContent="text-blue-600"
        />
      }
    />
  );
};

export const generateTitle = (values: any) => {
  return {
    [OBJECT_KEY_CRM.consulting_ticket]: (
      <Heading
        icon={<SwatchOutlined className="w-[13px] h-[13px] text-white" />}
        value={{
          code: values?.code,
          name: values?.name,
        }}
      />
    ),
    [OBJECT_KEY_CRM.customer]: (
      <Heading
        icon={<UserGroupOutlined className="w-[13px] h-[13px] text-white" />}
        value={{
          code: values?.code,
          name: values?.name,
        }}
      />
    ),
    [OBJECT_KEY_CRM.supplier]: (
      <Heading
        icon={
          <BuildingOffice2Outlined className="w-[13px] h-[13px] text-white" />
        }
        value={{
          code: values?.code,
          name: values?.name,
        }}
      />
    ),
    [OBJECT_KEY_CRM.opportunity]: (
      <Heading
        icon={<TableCellsOutlined className="w-[13px] h-[13px] text-white" />}
        value={{
          code: values?.code,
          name: values?.name,
        }}
      />
    ),
  };
};

export const generateObjectContent = (value: any) => {
  const object = value?.object;
  const relatedObject = value?.relation_to;
  const objectContentCustomerSupplier = {
    subTitle: {
      consulting_ticket: (
        <SubTitle
          title="Thẻ tư vấn"
          code={relatedObject?.code}
          name={relatedObject?.name}
        />
      ),
      opportunity: (
        <SubTitle
          title="Cơ hội"
          code={relatedObject?.code}
          name={relatedObject?.name}
        />
      ),
      contact: (
        <SubTitle
          title="Liên hệ"
          code={relatedObject?.code}
          name={relatedObject?.name}
        />
      ),
      price_quotation: (
        <SubTitle
          title="Báo giá"
          code={relatedObject?.code}
          name={relatedObject?.name}
        />
      ),
      sell_order: (
        <SubTitle
          title="Đơn bán hàng"
          code={relatedObject?.code}
          name={relatedObject?.name}
        />
      ),
    },
  };
  return {
    [OBJECT_KEY_CRM.consulting_ticket]: {
      subTitle: {
        consulting_ticket: (
          <SubTitle
            title="Khách hàng"
            code={object?.code}
            name={object?.name}
          />
        ),
      },
    },
    [OBJECT_KEY_CRM.customer]: objectContentCustomerSupplier,
    [OBJECT_KEY_CRM.supplier]: objectContentCustomerSupplier,
    [OBJECT_KEY_CRM.opportunity]: {
      subTitle: {
        consulting_ticket: (
          <SubTitle
            title="Khách hàng"
            code={object?.code}
            name={object?.name}
          />
        ),
      },
    },
  };
};

export const paramsObject = (object_id: number) => {
  return {
    [OBJECT_KEY_CRM.customer]: {
      object_type: "customer",
      object_id,
    },
    [OBJECT_KEY_CRM.supplier]: {
      object_type: "supplier",
      object_id,
    },
    [OBJECT_KEY_CRM.consulting_ticket]: {
      relate_type: "consulting_ticket",
      relate_to: object_id,
    },
    [OBJECT_KEY_CRM.opportunity]: {
      object_type: "opportunity",
      object_id,
    },
  };
};
export const ACTION_TYPE = {
  created: "Tạo mới",
  edited: "Chỉnh sửa",
  deleted: "Xóa",
  approve: "Duyệt",
  send_request: "Gửi yêu cầu duyệt",
  reject: "Từ chối",
  unapprove: "Hủy yêu cầu duyệt",
  edited_price: "Chỉnh sửa giá",
  processing: "Xử lý",
  received: "Đã nhận",
  complete: "Hoàn thành",
  change_implement: "Bàn giao công việc",
  uploaded: "Tải lên tệp",
  change_status: "Cập nhật trạng thái",
};

export const ACTION_TYPE_OPTIONS: OptionProps[] = Object.entries(
  ACTION_TYPE,
).map(([value, label]) => ({ label, value }));

export const classTabs = "flex items-center justify-center cursor-pointer";
