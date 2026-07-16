import {
  BanknotesOutlined,
  CurrencyDollarOutlined,
  GiftOutlined,
  MinusCircleOutlined,
  StarOutlined,
  WalletOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { PayrollStats } from "../_interface";
import { formatVnd } from "../_utils";

interface PayrollSummaryProps {
  stats: PayrollStats;
}

interface Tile {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const PayrollSummary = ({ stats }: PayrollSummaryProps) => {
  const tiles: Tile[] = [
    { label: "Tổng thu nhập", value: stats.grossIncome, icon: <WalletOutlined />, color: "bg-sky-50 text-sky-500" },
    { label: "Lương cơ bản", value: stats.baseSalary, icon: <CurrencyDollarOutlined />, color: "bg-emerald-50 text-emerald-500" },
    { label: "Thưởng", value: stats.bonus, icon: <StarOutlined />, color: "bg-amber-50 text-amber-500" },
    { label: "Phụ cấp", value: stats.allowance, icon: <GiftOutlined />, color: "bg-violet-50 text-violet-500" },
    { label: "Khấu trừ", value: stats.deduction, icon: <MinusCircleOutlined />, color: "bg-rose-50 text-rose-500" },
    { label: "Thực nhận", value: stats.netIncome, icon: <BanknotesOutlined />, color: "bg-teal-50 text-teal-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xmd:grid-cols-3 2xl:grid-cols-6">
      {tiles.map((t) => (
        <Card key={t.label} animated={false} className="flex items-center gap-3">
          <IconBox icon={t.icon} colorClassName={t.color} />
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-400">{t.label}</p>
            <p className="truncate text-lg font-bold text-slate-800">{formatVnd(t.value)}</p>
            <p className="truncate text-[11px] text-slate-400">Trong tháng {stats.monthLabel}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PayrollSummary;
