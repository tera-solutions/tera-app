import type { PayrollLineItem } from "../_interface";
import { formatNumber } from "../_utils";

// Các dòng "Thưởng" của mục "1. Thu nhập" — tách riêng theo yêu cầu task ([055]).
// Trả về fragment các <tr> để nằm chung 1 bảng với SalaryBreakdown (giao diện không đổi).
const BonusInfo = ({ items }: { items: PayrollLineItem[] }) => (
  <>
    {items.map((it) => (
      <tr key={it.label}>
        <td className="py-2.5 pr-3 text-slate-700">{it.label}</td>
        <td className="py-2.5 pr-3 text-slate-500">{it.detail}</td>
        <td className="py-2.5 text-right font-medium text-slate-700">{formatNumber(it.amount)}</td>
      </tr>
    ))}
  </>
);

export default BonusInfo;
