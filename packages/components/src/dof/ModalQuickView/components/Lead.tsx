import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { Description } from "tera-dls";

type LeadProps = {
  data: any;
};
const Lead = ({ data }: LeadProps) => {
  const info = [
    {
      title: "Mã tiềm năng",
      value: data?.code,
    },
    {
      title: "Tên tiềm năng",
      value: data?.business_name,
    },
    {
      title: "Người phụ trách",
      value: (
        <EmployeeText
          code={data?.implementer?.code}
          name={data?.implementer?.full_name}
        />
      ),
    },
    {
      title: "Số điện thoại",
      value: data?.phone,
    },
    {
      title: "Email",
      value: data?.email,
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

export default Lead;
