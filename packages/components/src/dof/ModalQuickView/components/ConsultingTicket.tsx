import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { STATUS_CONSULTING_TICKET_COLOR } from "@tera/components/shared/Activity/containers/Implementerchange/constants/common";
import { Description, Tag } from "tera-dls";

type ConsultingTicketProps = {
  data: any;
};
const ConsultingTicket = ({ data }: ConsultingTicketProps) => {
  const info = [
    {
      title: "Mã thẻ tư vấn",
      value: data?.code,
    },
    {
      title: "Tên thẻ tư vấn",
      value: data?.name,
    },
    {
      title: "Khách hàng",
      value: (
        <EmployeeText code={data?.customer?.code} name={data?.customer?.name} />
      ),
    },
    {
      title: "Liên hệ",
      value: (
        <EmployeeText code={data?.contact?.code} name={data?.contact?.name} />
      ),
    },
    {
      title: "Mức độ ưu tiên",
      value: data?.priority_level,
    },
    {
      title: "Người thực hiện",
      value: (
        <EmployeeText
          code={data?.staff_by?.code}
          name={data?.staff_by?.full_name}
        />
      ),
    },

    {
      title: "Thời gian hoàn thành",
      value: data?.time_end,
    },
    {
      title: "Trạng thái tư vấn",
      value: (
        <Tag color={STATUS_CONSULTING_TICKET_COLOR[data?.status]}>
          {data?.status_text}
        </Tag>
      ),
    },
  ];

  return (
    <>
      {info.map((item, index) => (
        <Description
          key={index}
          label={item?.title}
          childrenClassName="text-gray-800 font-normal col-span-7"
          labelClassName="col-span-5 font-bold text-gray-800"
          className="grid-cols-12"
        >
          {item?.value}
        </Description>
      ))}
    </>
  );
};

export default ConsultingTicket;
