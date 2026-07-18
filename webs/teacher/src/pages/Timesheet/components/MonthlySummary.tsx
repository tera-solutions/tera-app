import ChartDoughnut from "@tera/components/dof/Chart/ChartDoughnut";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { TimesheetSessionRow } from "../_interface";
import { pct, summarizeAttendance } from "../_utils";

interface MonthlySummaryProps {
  items: TimesheetSessionRow[];
  /** Tháng đang xem (từ range.from) — hiện trong tiêu đề. */
  month: Date;
  loading?: boolean;
}

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];
const LABELS = ["Có mặt", "Vắng mặt", "Muộn/Có phép"];

/** "Tổng hợp tháng" — tỷ lệ chuyên cần của các buổi trong khoảng đang xem. */
const MonthlySummary = ({ items, month, loading }: MonthlySummaryProps) => {
  const attendance = summarizeAttendance(items);
  const data = [attendance.present, attendance.absent, attendance.other];
  const isEmpty = attendance.total === 0;
  const monthLabel = `${String(month.getMonth() + 1).padStart(2, "0")}/${month.getFullYear()}`;

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-3 text-base font-semibold text-slate-800">Tổng hợp tháng {monthLabel}</p>
      <WidgetState isLoading={loading} isEmpty={!loading && isEmpty} emptyText="Chưa có buổi dạy">
        <div className="flex flex-col items-center gap-4">
          <div className="h-28 w-28 shrink-0">
            <ChartDoughnut
              data={{
                labels: LABELS,
                datasets: [
                  {
                    data,
                    backgroundColor: COLORS,
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            {LABELS.map((label, i) => (
              <div key={label} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  {label}
                </span>
                <span className="font-semibold text-slate-700">
                  {data[i]} ({pct(data[i], attendance.total)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </WidgetState>
    </Card>
  );
};

export default MonthlySummary;
