import { DocumentTextOutlined, Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import IconBox from "_common/components/IconBox";

import type { CurriculumItem } from "../_interface";

interface CurriculumListProps {
  items: CurriculumItem[];
  loading?: boolean;
}

/** Read-only list of the course's curriculum units — sourced from its lesson plan's templates, independent of any specific class's schedule. */
const CurriculumList = ({ items, loading }: CurriculumListProps) => {
  if (loading) {
    return (
      <Spin spinning>
        <div className="h-[20vh]" />
      </Spin>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        classNameImage="w-28 mx-auto"
        description="Khóa học chưa có chương trình học tập."
      />
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 py-3">
          <span className="w-7 shrink-0 text-center text-sm font-semibold text-slate-400">
            {String(item.order).padStart(2, "0")}
          </span>

          <IconBox icon={<DocumentTextOutlined />} sizeClassName="h-11 w-11" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {item.title || "—"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {item.duration ? `Thời gian: ${item.duration} phút` : ""}
            </p>
          </div>

          <div className="shrink-0 text-right text-xs text-slate-400">
            <p>
              {item.objective_count} mục tiêu • {item.activities_count} hoạt động
            </p>
            <p className="mt-1">{item.materials_count} tài liệu</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurriculumList;
