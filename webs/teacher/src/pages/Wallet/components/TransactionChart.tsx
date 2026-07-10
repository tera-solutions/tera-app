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
  /** `null` = người dùng chưa chọn khoảng ngày → ô ngày để trống, biểu đồ chưa vẽ. */
  range: DateRange | null;
  /** `null` khi người dùng bấm × xoá khoảng ngày. */
  onRangeChange: (range: DateRange | null) => void;
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

/** "Biểu đồ giao dịch" — 2 đường tiền nạp vào / tiền rút ra. Khoảng ngày do người dùng tự chọn
 * qua RangePicker (2 nút preset chỉ để set nhanh); **mặc định để trống, chưa vẽ gì.** */
const TransactionChart = ({
  points,
  range,
  onRangeChange,
  loading,
}: TransactionChartProps) => {
  const hasData = points.some((p) => p.moneyIn > 0 || p.moneyOut > 0);

  const isPresetActive = (key: ChartPeriod) => {
    if (!range) return false;
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
    /* `animated={false}`: Card mặc định bọc children trong `AnimatedHeight` (`overflow-hidden`),
       mép phải của nó trùng mép phải RangePicker → xén mất ring focus (`box-shadow` lồi 2px ra
       ngoài viền). Nội dung bên trong vẫn được `WidgetState` animate. */
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">Biểu đồ giao dịch</p>
        {/* `justify-end`: trên mobile khối này xuống dòng và chiếm hết bề ngang → không có
            `justify-end` thì 2 control dồn về trái. Desktop khối co theo nội dung nên vô hại.
            KHÔNG `flex-wrap`: 2 control phải nằm cùng 1 hàng — picker tự co (xem className của nó). */}
        <div className="flex w-full items-center justify-end gap-2 xmd:w-auto">
          {/* `h-9` (36px) cho cả 2 control để chúng bằng nhau — mặc định select 30px, picker 26px.
              `shrink-0`: mobile hẹp thì picker co, select giữ nguyên. */}
          <CompactSelect
            className="h-9 shrink-0 text-[13px]"
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
            /* `hover:border-brand/50` + `focus-within:border-brand/60` để giống CompactSelect cạnh bên.
               🐞 `.tera-picker-active-bar` (gạch chân 2px báo đang ở ô "Từ ngày" hay "Đến ngày")
               mặc định nằm ở `bottom:-1px` → đè lên cạnh dưới bo tròn, trông như viền gãy.
               KHÔNG ẩn nó (mất chỉ báo) — kéo vào trong viền + bo tròn hai đầu. */
            /* `flex-1 min-w-0` để picker CO khi hàng chật (thay vì cứng 260px rồi bị đẩy xuống
               dòng), `max-w-[260px]` để nó KHÔNG NỞ quá bề rộng chuẩn khi hàng rộng — thiếu cái
               này thì ở tablet 768px picker bị kéo tới ~593px.
               ⚠️ `.tera-picker-input` mặc định rộng CỐ ĐỊNH 99px/ô → khi picker co, ô thứ 2 tràn
               ra dưới icon lịch (icon là `position:absolute`). Ép 2 ô `flex-1 min-w-0` + thu hẹp
               dấu `→` thì chúng mới chia đều phần còn lại. */
            className="h-9! min-w-0 max-w-[260px] flex-1 rounded-lg! border-slate-200! pr-9! transition-colors hover:border-blue-700! focus-within:border-blue-700! [&_.tera-picker-active-bar]:bottom-[3px]! [&_.tera-picker-active-bar]:rounded-full! [&_.tera-picker-input]:min-w-0! [&_.tera-picker-input]:flex-1! [&_.tera-picker-range-separator]:px-1! [&_input]:w-full! [&_input]:text-[12px]! [&_input]:text-slate-600 xmd:[&_.tera-picker-range-separator]:px-2! xmd:[&_input]:text-[13px]!"
            inputReadOnly
            /* 🐞 Popup mặc định bày 2 bảng tháng CẠNH NHAU (`flex-row`, rộng ~409px) → trên màn
               390px nó tràn khỏi mép trái (`left: -29px`) và bị cắt mất cột thứ. Popup render qua
               portal + `position:fixed` nên không cuộn ngang tới được.
               → dưới `xmd` xếp 2 bảng CHỒNG DỌC để popup chỉ rộng bằng 1 bảng.
               (`classNames.popup` là API của rc-picker v4 — tera-dls forward thẳng props.) */
            /* ⚠️ Popup là hộp `absolute` → bề rộng = shrink-to-fit = min(max-width, max-content).
               `max-content` của nó là 580px, nên phải CHẶN `max-width` bằng đúng bề rộng 1 bảng
               (290px + viền) thì nó mới co lại; chỉ xếp `flex-col` thôi là chưa đủ. */
            /* Bảng tháng cần tối thiểu 290px; màn ≤340px thì popup hẹp hơn thế và
               `.tera-picker-panel-container` (overflow-x:hidden) sẽ CẮT MẤT cột thứ.
               → cho chính nó cuộn ngang. Đặt `overflow-x-auto` ở root popup KHÔNG có tác dụng,
               vì phần tử clip nằm sâu bên trong. */
            classNames={{
              popup:
                "max-w-[min(300px,calc(100vw-2.5rem))] [&_.tera-picker-panel-container]:overflow-x-auto! [&_.tera-picker-panels]:flex-col xmd:max-w-none xmd:[&_.tera-picker-panel-container]:overflow-x-hidden! xmd:[&_.tera-picker-panels]:flex-row",
            }}
            suffixIcon={<CalendarOutlined className="h-3.5 w-3.5 text-slate-400" />}
            // `null` → ô trống, hiện placeholder. KHÔNG điền sẵn khoảng ngày nào.
            value={range ? [moment(range.from), moment(range.to)] : null}
            placeholder={["Từ ngày", "Đến ngày"]}
            format="DD/MM/YYYY"
            onChange={(dates: any) => {
              // Bấm × xoá → về `null` (ô trống, biểu đồ quay lại trạng thái chờ chọn).
              if (!dates?.[0] || !dates?.[1]) {
                onRangeChange(null);
                return;
              }
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
        // Chưa chọn ngày → chưa vẽ gì, mời người dùng chọn. Đã chọn mà rỗng → báo không có giao dịch.
        isEmpty={!loading && (!range || !hasData)}
        emptyText={
          range
            ? "Chưa có giao dịch trong khoảng thời gian này"
            : "Chọn khoảng thời gian để xem biểu đồ"
        }
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
