import { Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";

import type { CurriculumItem } from "../_interface";

interface CurriculumListProps {
  items: CurriculumItem[];
  loading?: boolean;
}

/** Read-only outline of the course's curriculum (edu_course_curriculums) — an ordered list of syllabus topics, independent of any lesson plan or class. */
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
    <ol className="flex flex-col divide-y divide-slate-100">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-brand">
            {String(item.order).padStart(2, "0")}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800">{item.title || "—"}</p>
            {item.content && (
              <p className="mt-0.5 text-xs text-slate-500">{item.content}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default CurriculumList;
