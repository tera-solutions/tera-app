import { ReactNode } from "react";
import { ArrowPathOutlined, Button } from "tera-dls";

import Card from "_common/components/Card";

interface FilterCardProps {
  /** Set to `null` to omit the heading entirely. */
  title?: string | null;
  children: ReactNode;
  className?: string;
  /** Shows a trailing "Đặt lại" button when provided. */
  onReset?: () => void;
}

/** Shared sidebar card shell for the portal's per-page filter panels. */
const FilterCard = ({ title = "Bộ lọc", children, className, onReset }: FilterCardProps) => (
  <Card animated={false} className={className}>
    <div className="flex flex-col gap-4">
      {title && <p className="text-sm font-semibold text-slate-700">{title}</p>}
      {children}
      {onReset && (
        <Button
          outlined
          icon={<ArrowPathOutlined />}
          onClick={onReset}
          className="text-brand border-brand hover:bg-brand"
        >
          Đặt lại
        </Button>
      )}
    </div>
  </Card>
);

export default FilterCard;
