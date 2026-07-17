import { CheckOutlined } from "tera-dls";

interface BenefitSectionProps {
  /** Tiêu đề nhóm (vd "Tất cả tính năng của Miễn phí, và:"). Bỏ nếu không có. */
  title?: string;
  items: string[];
  /** Cỡ chữ item — mặc định sm. */
  compact?: boolean;
}

/** Danh sách quyền lợi/tính năng của gói (mỗi dòng 1 dấu check xanh). */
const BenefitSection = ({ title, items, compact }: BenefitSectionProps) => (
  <div className="flex flex-col gap-2.5">
    {title && (
      <p className="text-xs font-medium text-slate-500">{title}</p>
    )}
    {items.map((it, i) => (
      <div
        key={i}
        className={`flex items-start gap-2 text-slate-600 ${compact ? "text-xs" : "text-sm"}`}
      >
        <CheckOutlined className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <span>{it}</span>
      </div>
    ))}
  </div>
);

export default BenefitSection;
