import { DocumentTextOutlined, PencilSquareOutlined, Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import IconBox from "_common/components/IconBox";

import type { LessonTemplateSummary } from "../_interface";

interface LessonTemplateListProps {
  templates: LessonTemplateSummary[];
  loading?: boolean;
  onEdit?: () => void;
}

/** Read-only list of a plan's lesson templates (edu_lesson_plan_lessons) — the content authored in the wizard. */
const LessonTemplateList = ({ templates, loading, onEdit }: LessonTemplateListProps) => {
  if (loading) {
    return (
      <Spin spinning>
        <div className="h-[20vh]" />
      </Spin>
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        classNameImage="w-28 mx-auto"
        description="Giáo án chưa có bài học mẫu nào."
      />
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {templates.map((template) => (
        <div
          key={template.id}
          role={onEdit ? "button" : undefined}
          tabIndex={onEdit ? 0 : undefined}
          onClick={onEdit}
          onKeyDown={(e) => onEdit && e.key === "Enter" && onEdit()}
          className={`flex items-center gap-3 py-3 ${
            onEdit ? "cursor-pointer hover:bg-slate-50" : ""
          }`}
        >
          <span className="w-7 shrink-0 text-center text-sm font-semibold text-slate-400">
            {String(template.lesson_no).padStart(2, "0")}
          </span>

          <IconBox icon={<DocumentTextOutlined />} sizeClassName="h-11 w-11" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {template.lesson_title || "—"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {template.duration ? `Thời gian: ${template.duration} phút` : ""}
            </p>
          </div>

          <div className="shrink-0 text-right text-xs text-slate-400">
            <p>
              {template.objective_count} mục tiêu • {template.activities_count} hoạt
              động
            </p>
            <p className="mt-1">{template.materials_count} tài liệu</p>
          </div>

          {onEdit && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-300 [&_svg]:h-4 [&_svg]:w-4">
              <PencilSquareOutlined />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonTemplateList;
