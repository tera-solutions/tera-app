import classNames from "classnames";
import moment from "moment";
import { Chart as ChartJS, Filler } from "chart.js";
import { CalendarOutlined, RangePicker } from "tera-dls";

import ChartLine from "@tera/components/dof/Chart/ChartLine";
import Card from "_common/components/Card";
import CompactSelect from "_common/components/CompactSelect";
import WidgetState from "_common/components/WidgetState";

import type { ChartPeriod, ChartPoint, DateRange } from "../_interface";
import { presetToRange } from "../_utils";

// ChartLine không đăng ký sẵn Filler — cần cho vùng tô dưới đường.
ChartJS.register(Filler);

interface TransactionChartProps {
  points: ChartPoint[];
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  loading?: boolean;
}

const PERIOD_OPTIONS: { key: ChartPeriod; label: string }[] = [
  { key: "week", label: "Theo tuần" },
  { key: "month", label: "Theo tháng" },
];

const LegendDot = ({ className, label }: { className: string; label: string }) => (
  <span className="flex items-center gap-1.5 text-xs text-slate-500">
    <span className={classNames("h-2 w-2 rounded-full", className)} />
    {label}
  </span>
);

/** "Biểu đồ giao dịch" — 2 đường tiền nạp vào / tiền rút ra, khoảng ngày do
 * người dùng tự chọn qua RangePicker (2 nút preset chỉ để set nhanh). */
const TransactionChart = ({
  points,
  range,
  onRangeChange,
  loading,
}: TransactionChartProps) => {
  const hasData = points.some((p) => p.moneyIn > 0 || p.moneyOut > 0);

  const isPresetActive = (key: ChartPeriod) => {
    const preset = presetToRange(key);
    return (
      preset.from.toDateString() === range.from.toDateString() &&
      preset.to.toDateString() === range.to.toDateString()
    );
  };

  // Khoảng ngày chọn tay từ RangePicker không khớp preset nào → select hiện "Tùy chọn".
  const selectValue = isPresetActive("week")
    ? "week"
    : isPresetActive("month")
      ? "month"
      : "";

  return (
    <Card className="xmd:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">Biểu đồ giao dịch</p>
        <div className="flex flex-wrap items-center gap-2">
          <CompactSelect
            value={selectValue}
            placeholder="Tùy chọn"
            options={PERIOD_OPTIONS.map((opt) => ({ value: opt.key, label: opt.label }))}
            onChange={(v) => {
              if (v) onRangeChange(presetToRange(v as ChartPeriod));
            }}
          />
          {/* Icon lịch của tera-picker là position:absolute right:1rem → chừa pr-9
              để ô ngày thứ 2 không bị icon đè lên chữ. */}
          <RangePicker
            className="w-[250px] max-w-full shrink-0 rounded-lg! border-slate-200! py-1! pr-9! [&_input]:text-xs! [&_input]:text-slate-600"
            inputReadOnly
            allowClear={false}
            suffixIcon={<CalendarOutlined className="h-3.5 w-3.5 text-slate-400" />}
            value={[moment(range.from), moment(range.to)]}
            format="DD/MM/YYYY"
            onChange={(dates: any) => {
              if (!dates?.[0] || !dates?.[1]) return;
              onRangeChange({
                from: moment(dates[0]).startOf("day").toDate(),
                to: moment(dates[1]).startOf("day").toDate(),
              });
            }}
          />
        </div>
      </div>

      <div className="mb-2 flex items-center gap-4">
        <LegendDot className="bg-sky-400" label="Tiền nạp vào" />
        <LegendDot className="bg-emerald-400" label="Tiền rút ra" />
      </div>

      <WidgetState
        isLoading={loading}
        isEmpty={!loading && !hasData}
        emptyText="Chưa có giao dịch trong khoảng thời gian này"
      >
        <div className="h-64">
          <ChartLine
            data={{
              labels: points.map((p) => p.label),
              datasets: [
                {
                  label: "Tiền nạp vào",
                  data: points.map((p) => p.moneyIn),
                  borderColor: "#38bdf8",
                  backgroundColor: "rgba(56, 189, 248, 0.12)",
                  pointBackgroundColor: "#38bdf8",
                  pointRadius: 2.5,
                  fill: true,
                  tension: 0.35,
                },
                {
                  label: "Tiền rút ra",
                  data: points.map((p) => p.moneyOut),
                  borderColor: "#34d399",
                  backgroundColor: "rgba(52, 211, 153, 0.12)",
                  pointBackgroundColor: "#34d399",
                  pointRadius: 2.5,
                  fill: true,
                  tension: 0.35,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => {
                      const v = Number(value);
                      if (v >= 1_000_000) return `${v / 1_000_000}M`;
                      if (v >= 1_000) return `${v / 1_000}K`;
                      return v;
                    },
                  },
                  grid: { color: "rgba(148, 163, 184, 0.12)" },
                },
                x: { grid: { display: false } },
              },
            }}
          />
        </div>
      </WidgetState>
    </Card>
  );
};

export default TransactionChart;
