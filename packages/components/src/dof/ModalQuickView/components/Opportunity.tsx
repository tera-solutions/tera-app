import { EmployeeText } from "@tera/components/web/TableColumnCustom/EmployeeText";
import { DATE_FORMAT } from "@tera/commons/constants/common";
import moment from "moment";
import { Description, Progress, Tag, formatCurrency } from "tera-dls";

type OpportunityProps = {
  data: any;
};
const Opportunity = ({ data }: OpportunityProps) => {
  const info = [
    {
      title: "Tên cơ hội",
      value: data?.opportunity_name,
    },
    {
      title: "Nhóm cơ hội",
      value: (
        <span className="text-green-400">{data?.opportunity_group_text}</span>
      ),
    },
    {
      title: "Nguồn cơ hội",
      value: data?.opportunity_source_text?.title,
    },
    {
      title: "Tỉ lệ deal (%)",
      value: (
        <div className="flex gap-2 w-full items-center">
          <span className="text-center">{data?.deal ?? 0}%</span>
          <div className="flex-1">
            <Progress percent={data?.deal ?? 0} size={10} />
          </div>
        </div>
      ),
    },
    {
      title: "Ghi chú",
      value: data?.note,
    },
    {
      title: "Ngày kết thúc dự kiến",
      value: data?.pre_date && moment(data?.pre_date).format(DATE_FORMAT),
    },
    {
      title: "Chiến dịch",
      value: (
        <EmployeeText
          code={data?.campaign?.code}
          name={data?.campaign?.campaign_name}
        />
      ),
    },
    {
      title: "Giai đoạn",
      value: data?.step?.name ? (
        <Tag color="green03">{data?.step?.name}</Tag>
      ) : null,
    },
    {
      title: "Người phụ trách",
      value: (
        <EmployeeText
          code={data?.implemeter?.code}
          name={data?.implemeter?.full_name}
        />
      ),
    },
    {
      title: "Doanh thu dự kiến",
      value: formatCurrency(data?.pre_revenue ?? 0),
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

export default Opportunity;
