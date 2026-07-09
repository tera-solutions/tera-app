import moment from "moment";
import { DatePicker } from "tera-dls";

import ClassroomSelect from "_common/components/ClassroomSelect";
import DonutStatsCard from "_common/components/DonutStatsCard";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import type { ExamSessionSummary } from "../_interface";

export interface ExamSessionFilterDraft {
  class_id?: number;
  exam_date: string;
}

interface ExamSessionFilterSidebarProps {
  draft: ExamSessionFilterDraft;
  onChange: (patch: Partial<ExamSessionFilterDraft>) => void;
  onReset: () => void;
  summary: ExamSessionSummary;
  loading?: boolean;
}

const DATE_FORMAT = "YYYY-MM-DD";

const ExamSessionFilterSidebar = ({
  draft,
  onChange,
  onReset,
  summary,
  loading,
}: ExamSessionFilterSidebarProps) => (
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

      <FilterField label="Ngày kiểm tra">
        <DatePicker
          className="w-full"
          value={draft.exam_date ? (moment(draft.exam_date, DATE_FORMAT) as any) : undefined}
          onChange={(value: any) => onChange({ exam_date: value ? value.format(DATE_FORMAT) : "" })}
          allowClear
        />
      </FilterField>
    </FilterCard>

    <DonutStatsCard
      title="Thống kê"
      centerValue={`${summary.total}`}
      centerCaption="Bài kiểm tra"
      loading={loading}
      legend={[
        { key: "scheduled", label: "Đã lên lịch", color: "#f59e0b", value: summary.scheduled },
        { key: "in_progress", label: "Đang diễn ra", color: "#8b5cf6", value: summary.in_progress },
        { key: "closed", label: "Đã đóng", color: "#10b981", value: summary.closed },
      ]}
    />
  </div>
);

export default ExamSessionFilterSidebar;
