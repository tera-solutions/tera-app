import Card from "_common/components/Card";
import Table, { TableColumn } from "_common/components/Table";

import type { PaymentScheduleRow } from "../_interface";
import PayrollStatusBadge from "./PayrollStatusBadge";

interface PaymentScheduleProps {
  rows: PaymentScheduleRow[];
}

const PaymentSchedule = ({ rows }: PaymentScheduleProps) => {
  const columns: TableColumn<PaymentScheduleRow>[] = [
    {
      key: "period",
      title: "Kỳ thu đóng",
      render: (r) => <span className="whitespace-nowrap font-medium text-slate-700">{r.period}</span>,
    },
    {
      key: "paidDate",
      title: "Ngày thanh toán",
      render: (r) => <span className="whitespace-nowrap text-slate-600">{r.paidDate}</span>,
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <PayrollStatusBadge status={r.status} />,
    },
  ];

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-3 text-base font-semibold text-slate-800">Lịch thanh toán</p>
      <Table columns={columns} data={rows} rowKey={(r) => r.id} emptyText="Chưa có lịch thanh toán" />
    </Card>
  );
};

export default PaymentSchedule;
