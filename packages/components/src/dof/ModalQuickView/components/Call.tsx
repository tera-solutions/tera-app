import HoverQuickView from "@tera/components/web/HoverQuickView";
import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { StatusTaskActivity } from "@tera/components/shared/Activity/constants";
import { Description, Tag } from "tera-dls";

type CallProps = {
  data: any;
};
const Call = ({ data }: CallProps) => {
  const object = data?.object;
  const info = [
    {
      title: "Tiêu đề cuộc gọi",
      value: data?.title,
    },
    {
      title: "Loại đối tượng",
      value: data?.object_type_text,
    },
    {
      title: "Đối tượng",
      value: (
        <HoverQuickView
          avatarUrl={object?.avatar_url}
          email={object?.email}
          phone={object?.phone}
          name={object?.name}
          sub={object?.customer_type_text?.title}
          code={object?.code}
        >
          {object?.name}
        </HoverQuickView>
      ),
    },
    {
      title: "Loại liên quan",
      value: data?.relate_type_text,
    },
    {
      title: "Loại liên quan đến",
      value: (
        <EmployeeText
          code={data?.relation_to?.code}
          name={data?.relation_to?.name}
        />
      ),
    },
    {
      title: "Điện thoại",
      value: data?.number_phone,
    },

    {
      title: "Loại cuộc gọi",
      value: data?.call_type,
    },
    {
      title: "Trạng thái",
      value: (
        <Tag color={StatusTaskActivity[data?.status]?.color}>
          {data?.status_text}
        </Tag>
      ),
    },
    {
      title: "Thời gian gọi",
      value: `${Number(data?.minute)} phút ${Number(data?.second)} giây`,
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
      title: "Mô tả",
      value: data?.description,
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

export default Call;
