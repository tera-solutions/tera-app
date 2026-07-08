import ClassroomSelect from "_common/components/ClassroomSelect";
import LevelSelect from "_common/components/LevelSelect";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";
import DonutStatsCard from "_common/components/DonutStatsCard";

export interface HomeworkFilterDraft {
  class_id?: number;
  level_id?: number;
}

interface HomeworkFilterSidebarProps {
  draft: HomeworkFilterDraft;
  onChange: (patch: Partial<HomeworkFilterDraft>) => void;
  onReset: () => void;
  submittedRate: number;
  totalSubmitted: number;
  totalExpected: number;
  loading?: boolean;
}

const HomeworkFilterSidebar = ({
  draft,
  onChange,
  onReset,
  submittedRate,
  totalSubmitted,
  totalExpected,
  loading,
}: HomeworkFilterSidebarProps) => (
  <div className="flex flex-col gap-4">
    <FilterCard onReset={onReset}>
      <FilterField label="Lớp">
        <ClassroomSelect
          value={draft.class_id}
          placeholder="Tất cả lớp"
          allowClear
          onChange={(value) => onChange({ class_id: value != null ? Number(value) : undefined })}
        />
      </FilterField>

      <FilterField label="Hạng thứ">
        <LevelSelect
          value={draft.level_id}
          placeholder="Tất cả hạng thứ"
          allowClear
          onChange={(value) => onChange({ level_id: value != null ? Number(value) : undefined })}
        />
      </FilterField>
    </FilterCard>

    <DonutStatsCard
      title="Thống kê hoàn thành"
      centerValue={`${submittedRate}%`}
      centerCaption="Đã nộp"
      loading={loading}
      legend={[
        {
          key: "submitted",
          label: "Hoàn thành",
          color: "#34d399",
          value: totalSubmitted,
          displayValue: `${submittedRate}%`,
        },
        {
          key: "pending",
          label: "Chưa nộp",
          color: "#e2e8f0",
          value: Math.max(totalExpected - totalSubmitted, 0),
          displayValue: `${Math.max(100 - submittedRate, 0)}%`,
        },
      ]}
    />
  </div>
);

export default HomeworkFilterSidebar;
