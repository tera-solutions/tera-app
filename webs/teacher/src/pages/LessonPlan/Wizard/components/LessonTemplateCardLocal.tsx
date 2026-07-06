import { useState } from "react";
import { ChevronDownOutlined, ChevronUpOutlined, TrashOutlined } from "tera-dls";

import useConfirm from "_common/hooks/useConfirm";

import type { WizardLessonTemplate } from "../_interface";
import LessonTemplateFields from "./LessonTemplateFields";

interface LessonTemplateCardLocalProps {
  index: number;
  template: WizardLessonTemplate;
  onChange: (next: WizardLessonTemplate) => void;
  onRemove: () => void;
}

/**
 * Fully in-memory lesson-template editor for the create wizard: every edit
 * updates the parent's local array directly — nothing is persisted until the
 * final review step submits the whole plan at once.
 */
const LessonTemplateCardLocal = ({
  index,
  template,
  onChange,
  onRemove,
}: LessonTemplateCardLocalProps) => {
  const [expanded, setExpanded] = useState(!template.lesson_title);
  const confirm = useConfirm();

  const handleRemove = () => {
    confirm.warning({
      title: "Xóa buổi học",
      content: (
        <p>
          Bạn có chắc muốn xóa buổi học <b>{template.lesson_title || "này"}</b>?
        </p>
      ),
      onOk: onRemove,
    });
  };

  return (
    <div className="rounded-xl border border-slate-100">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((prev) => !prev)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((prev) => !prev)}
        className="flex cursor-pointer items-center gap-3 px-3 py-2.5"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-700">
            {template.lesson_title || "Buổi học mới"}
          </p>
          {template.duration ? (
            <p className="text-xs text-slate-400">{template.duration} phút</p>
          ) : null}
        </div>
        <button
          type="button"
          title="Xóa"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-4 [&_svg]:w-4"
        >
          <TrashOutlined />
        </button>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
          {expanded ? <ChevronUpOutlined /> : <ChevronDownOutlined />}
        </span>
      </div>

      {expanded && (
        <div
          className="border-t border-slate-100 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <LessonTemplateFields
            form={template}
            onChange={(patch) => onChange({ ...template, ...patch })}
          />
        </div>
      )}
    </div>
  );
};

export default LessonTemplateCardLocal;
