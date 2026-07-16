import Card from "_common/components/Card";

import type { PayrollLineItem } from "../_interface";
import { formatNumber } from "../_utils";
import BonusInfo from "./BonusInfo";

interface SalaryBreakdownProps {
  salaryItems: PayrollLineItem[];
  bonusItems: PayrollLineItem[];
  total: number;
}

// Mục "1. Thu nhập": bảng lương + phụ cấp, dòng thưởng do `BonusInfo` render (cùng 1 bảng).
const SalaryBreakdown = ({ salaryItems, bonusItems, total }: SalaryBreakdownProps) => (
  <Card className="xmd:p-5" animated={false}>
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-base font-semibold text-slate-800">1. Thu nhập</p>
      <span className="text-base font-bold text-emerald-600">{formatNumber(total)}đ</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-medium text-slate-400">
            <th className="py-2 pr-3 font-medium">Khoản mục</th>
            <th className="py-2 pr-3 font-medium">Chi tiết</th>
            <th className="py-2 text-right font-medium">Số tiền (đ)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {salaryItems.map((it) => (
            <tr key={it.label}>
              <td className="py-2.5 pr-3 text-slate-700">{it.label}</td>
              <td className="py-2.5 pr-3 text-slate-500">{it.detail}</td>
              <td className="py-2.5 text-right font-medium text-slate-700">{formatNumber(it.amount)}</td>
            </tr>
          ))}
          <BonusInfo items={bonusItems} />
        </tbody>
      </table>
    </div>

    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
      <span className="text-sm font-semibold text-emerald-600">Tổng thu nhập</span>
      <span className="text-base font-bold text-emerald-600">{formatNumber(total)}đ</span>
    </div>
  </Card>
);

export default SalaryBreakdown;
