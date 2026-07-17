import { ExclamationTriangleOutlined } from "tera-dls";

import useQuota from "_common/hooks/useQuota";

interface QuotaMeterProps {
  /** Resource key matching the plan limits (students, classes, teachers, parents, branches). */
  resource: string;
  /** Current usage count. */
  used: number;
  /** Noun for the tooltip, e.g. "học viên". */
  unit?: string;
  className?: string;
}

/**
 * Compact "used / limit" pill for a plan-limited resource. Renders nothing when
 * the plan is unlimited (grandfathered or a null cap). Turns amber at ≥80% and
 * rose when the cap is reached, hinting the tenant to upgrade.
 */
const QuotaMeter = ({ resource, used, unit, className }: QuotaMeterProps) => {
  const { limitOf } = useQuota();
  const limit = limitOf(resource);

  if (limit === null) return null;

  const atLimit = used >= limit;
  const near = used >= limit * 0.8;
  const tone = atLimit
    ? "bg-rose-50 text-rose-600"
    : near
      ? "bg-amber-50 text-amber-600"
      : "bg-slate-100 text-slate-500";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tone} ${className ?? ""}`}
      title={
        atLimit
          ? `Đã đạt giới hạn gói (${limit}${unit ? ` ${unit}` : ""}). Nâng cấp gói để thêm mới.`
          : `Đã dùng ${used}/${limit}${unit ? ` ${unit}` : ""} của gói`
      }
    >
      {(atLimit || near) && <ExclamationTriangleOutlined className="h-3.5 w-3.5" />}
      {used}/{limit}
      {unit ? ` ${unit}` : ""}
    </span>
  );
};

export default QuotaMeter;
