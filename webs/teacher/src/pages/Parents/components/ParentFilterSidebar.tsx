import ClassroomSelect from "_common/components/ClassroomSelect";
import DonutStatsCard from "_common/components/DonutStatsCard";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import type { ParentRow } from "../_interface";
import { RELATION_LABEL } from "../constants";

interface ParentFilterSidebarProps {
  classId: number;
  onChange: (patch: { class_id: number }) => void;
  onReset: () => void;
  rows: ParentRow[];
  loading?: boolean;
}

const RELATION_COLOR: Record<string, string> = {
  father: "#0ea5e9",
  mother: "#ec4899",
  guardian: "#8b5cf6",
  grandfather: "#f59e0b",
  grandmother: "#f59e0b",
  uncle: "#64748b",
  aunt: "#64748b",
  other: "#64748b",
};
const DEFAULT_COLOR = "#94a3b8";

const ParentFilterSidebar = ({ classId, onChange, onReset, rows, loading }: ParentFilterSidebarProps) => {
  const byRelation = new Map<string, number>();
  rows.forEach((r) => {
    const key = r.relation || "other";
    byRelation.set(key, (byRelation.get(key) ?? 0) + 1);
  });

  return (
    <div className="flex flex-col gap-4">
      <FilterCard onReset={onReset}>
        <FilterField label="Lớp học">
          <ClassroomSelect
            value={classId || undefined}
            placeholder="Tất cả lớp học"
            allowClear
            onChange={(value) => onChange({ class_id: value != null ? Number(value) : 0 })}
          />
        </FilterField>
      </FilterCard>

      <DonutStatsCard
        title="Theo vai trò"
        centerValue={String(rows.length)}
        centerCaption="Phụ huynh"
        loading={loading}
        legend={Array.from(byRelation.entries()).map(([key, value]) => ({
          key,
          label: RELATION_LABEL[key] ?? key,
          color: RELATION_COLOR[key] ?? DEFAULT_COLOR,
          value,
        }))}
      />
    </div>
  );
};

export default ParentFilterSidebar;
