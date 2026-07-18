import {
  AcademicCapOutlined,
  BanknotesOutlined,
  CurrencyDollarOutlined,
  MinusCircleOutlined,
  StarOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";
import WidgetState from "_common/components/WidgetState";

import type { PayrollRow } from "../_interface";
import { formatVnd, periodLabel } from "../_utils";

interface PayrollSummaryProps {
  latest: PayrollRow | null;
  loading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

/** 4 thẻ tổng quan kỳ lương GẦN NHẤT — chỉ các trường thật (giờ dạy, lương cơ bản,
 * thưởng, phạt, thực lãnh); không có phụ cấp/khấu trừ bảo hiểm/thuế (BE không có). */
const PayrollSummary = ({ latest, loading }: PayrollSummaryProps) => {
  const tiles: Tile[] = latest
    ? [
        { label: "Giờ dạy", value: `${latest.totalHours}h`, icon: <AcademicCapOutlined />, color: "bg-sky-50 text-sky-500" },
        { label: "Lương cơ bản", value: formatVnd(latest.baseSalary), icon: <CurrencyDollarOutlined />, color: "bg-emerald-50 text-emerald-500" },
        { label: "Thưởng", value: formatVnd(latest.bonus), icon: <StarOutlined />, color: "bg-amber-50 text-amber-500" },
        { label: "Phạt", value: formatVnd(latest.penalty), icon: <MinusCircleOutlined />, color: "bg-rose-50 text-rose-500" },
        { label: "Thực lãnh", value: formatVnd(latest.totalSalary), icon: <BanknotesOutlined />, color: "bg-teal-50 text-teal-500" },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 gap-3 xmd:grid-cols-3 2xl:grid-cols-5">
      {(loading ? Array.from({ length: 5 }) : tiles).map((t: Tile | undefined, i) => (
        <Card key={t?.label ?? i} animated={false} className="flex items-center gap-3">
          <IconBox icon={t?.icon ?? <BanknotesOutlined />} colorClassName={t?.color ?? "bg-slate-50 text-slate-400"} />
          <WidgetState isLoading={loading} animated={false}>
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-400">{t?.label}</p>
              <p className="truncate text-lg font-bold text-slate-800">{t?.value}</p>
              {latest && (
                <p className="truncate text-[11px] text-slate-400">
                  Kỳ {periodLabel(latest.month, latest.year)}
                </p>
              )}
            </div>
          </WidgetState>
        </Card>
      ))}
      {!loading && tiles.length === 0 && (
        <p className="col-span-full text-sm text-slate-400">Chưa có kỳ lương nào.</p>
      )}
    </div>
  );
};

export default PayrollSummary;
