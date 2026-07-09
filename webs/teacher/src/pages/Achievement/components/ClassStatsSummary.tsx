import Table, { TableColumn } from "_common/components/Table";
import StatusBadge from "_common/components/StatusBadge";

interface ClassStatRow {
  id: number;
  name: string;
  student_count: number;
  status: string;
}

interface ClassStatsSummaryProps {
  rows: ClassStatRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const ClassStatsSummary = ({ rows, isLoading, isError, onRetry }: ClassStatsSummaryProps) => {
  const columns: TableColumn<ClassStatRow>[] = [
    { key: "name", title: "Tên lớp", render: (row) => <span className="font-medium text-slate-700">{row.name}</span> },
    { key: "students", title: "Số HV", render: (row) => row.student_count },
    { key: "status", title: "Trạng thái", render: (row) => <StatusBadge name="class_status" value={row.status} /> },
  ];

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-700">Thống kê lớp học</p>
      <Table
        columns={columns}
        data={rows}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        emptyText="Chưa có lớp học nào"
      />
    </div>
  );
};

export default ClassStatsSummary;
