import { useState } from "react";
import {
  ChevronDownOutlined,
  ChevronUpOutlined,
  notification,
  TrashOutlined,
} from "tera-dls";

import { LessonPlanLessonService } from "@tera/modules/education";
import useConfirm from "_common/hooks/useConfirm";

import type { WizardLessonTemplate } from "../_interface";
import { emptyTemplate, toTemplateParams } from "../_utils";
import LessonTemplateFields from "./LessonTemplateFields";

interface LessonTemplateCardProps {
  planId: number;
  index: number;
  /** `null` renders the "add new lesson" card. */
  template: WizardLessonTemplate | null;
  onSaved: () => void;
  onCancelNew?: () => void;
}

/**
 * Server-backed lesson-template editor for the edit wizard: each save/delete
 * hits the API immediately (the plan already exists). See
 * `LessonTemplateCardLocal` for the create wizard's fully in-memory variant.
 */
const LessonTemplateCard = ({
  planId,
  index,
  template,
  onSaved,
  onCancelNew,
}: LessonTemplateCardProps) => {
  const isNew = !template;
  const [expanded, setExpanded] = useState(isNew);
  const [form, setForm] = useState<WizardLessonTemplate>(
    () => template ?? emptyTemplate(),
  );

  const confirm = useConfirm();
  const { mutate: create, isPending: isCreating } =
    LessonPlanLessonService.useLessonPlanLessonCreate();
  const { mutate: update, isPending: isUpdating } =
    LessonPlanLessonService.useLessonPlanLessonUpdate();
  const { mutate: remove, isPending: isDeleting } =
    LessonPlanLessonService.useLessonPlanLessonDelete();

  const isSaving = isCreating || isUpdating;

  const handleSave = () => {
    if (!form.lesson_title.trim()) {
      notification.error({ message: "Vui lòng nhập tiêu đề buổi học" });
      return;
    }

    const params = toTemplateParams(form);
    const onSuccess = (res: any) => {
      notification.success({ message: res?.msg ?? "Lưu buổi học thành công" });
      onSaved();
      if (isNew) {
        setForm(emptyTemplate());
        onCancelNew?.();
      }
    };
    const onError = (err: any) => {
      notification.error({
        message: err?.msg ?? err?.message ?? "Lưu buổi học thất bại",
      });
    };

    if (form.id) {
      update({ id: form.id, params }, { onSuccess, onError });
    } else {
      create({ id: planId, params }, { onSuccess, onError });
    }
  };

  const handleDelete = () => {
    if (!form.id) return;
    confirm.warning({
      title: "Xóa buổi học",
      content: (
        <p>
          Bạn có chắc muốn xóa buổi học <b>{form.lesson_title}</b>?
        </p>
      ),
      onOk: () =>
        remove(
          { id: form.id },
          {
            onSuccess: (res: any) => {
              notification.success({
                message: res?.msg ?? "Xóa buổi học thành công",
              });
              onSaved();
            },
            onError: (err: any) => {
              notification.error({
                message: err?.msg ?? err?.message ?? "Xóa buổi học thất bại",
              });
            },
          },
        ),
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
            {form.lesson_title || (isNew ? "Buổi học mới" : "—")}
          </p>
          {form.duration ? (
            <p className="text-xs text-slate-400">{form.duration} phút</p>
          ) : null}
        </div>
        {!isNew && (
          <button
            type="button"
            title="Xóa"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-4 [&_svg]:w-4"
          >
            <TrashOutlined />
          </button>
        )}
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
          {expanded ? <ChevronUpOutlined /> : <ChevronDownOutlined />}
        </span>
      </div>

      {expanded && (
        <div
          className="flex flex-col gap-3 border-t border-slate-100 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <LessonTemplateFields
            form={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          />

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            {isNew && (
              <button
                type="button"
                onClick={() => onCancelNew?.()}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand/80 disabled:opacity-60"
            >
              {isSaving ? "Đang lưu..." : "Lưu buổi học"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonTemplateCard;
