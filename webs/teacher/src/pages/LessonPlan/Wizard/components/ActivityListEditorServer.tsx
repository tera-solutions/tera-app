import { useEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  Input,
  InputNumber,
  PlusOutlined,
  Select,
  TextArea,
  TrashOutlined,
} from "tera-dls";

import { useMeta } from "_common/hooks/useMeta";
import { LessonPlanLessonActivityService } from "@tera/modules/education";

import type { WizardActivityStatus } from "../_interface";
import { ACTIVITY_AUTOSAVE_DELAY, LESSON_ACTIVITY_STATUS_META } from "../constants";

interface ServerActivity {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  status: WizardActivityStatus;
}

interface ActivityListEditorServerProps {
  lessonPlanLessonId: number;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand";

type SaveState = "idle" | "saving" | "saved" | "error";

const ActivityRow = ({
  activity,
  onDeleted,
}: {
  activity: ServerActivity;
  onDeleted: () => void;
}) => {
  const { getOptions } = useMeta();
  const statusOptions = getOptions(LESSON_ACTIVITY_STATUS_META);

  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description ?? "");
  const [duration, setDuration] = useState<number | undefined>(activity.duration);
  const [status, setStatus] = useState<WizardActivityStatus>(activity.status);
  const [state, setState] = useState<SaveState>("idle");
  const savedRef = useRef({
    title: activity.title,
    description: activity.description ?? "",
    duration: activity.duration,
    status: activity.status,
  });

  const { mutate: update } =
    LessonPlanLessonActivityService.useLessonPlanLessonActivityUpdate();
  const { mutate: remove, isPending: isDeleting } =
    LessonPlanLessonActivityService.useLessonPlanLessonActivityDelete();

  useEffect(() => {
    const current = { title, description, duration, status };
    const prev = savedRef.current;
    const unchanged =
      current.title === prev.title &&
      current.description === prev.description &&
      current.duration === prev.duration &&
      current.status === prev.status;
    if (unchanged || !title.trim()) return;

    setState("saving");
    const timer = setTimeout(() => {
      update(
        {
          id: activity.id,
          params: {
            title: title.trim(),
            description: description.trim() || undefined,
            duration,
            status,
          },
        },
        {
          onSuccess: () => {
            savedRef.current = current;
            setState("saved");
          },
          onError: () => setState("error"),
        },
      );
    }, ACTIVITY_AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, duration, status]);

  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-100 p-2.5 sm:grid-cols-[1fr_90px_120px_auto]">
      <div className="flex flex-col gap-1.5 sm:col-span-4 sm:grid sm:grid-cols-[1fr_90px_120px_auto] sm:gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên hoạt động (vd: Warm-up)"
          maxLength={255}
          className={inputClass}
        />
        <InputNumber
          min={1}
          value={duration ?? undefined}
          onChange={(v) => setDuration(typeof v === "number" ? v : undefined)}
          placeholder="Phút"
          className={inputClass}
        />
        <Select
          value={status}
          options={statusOptions}
          onChange={(v) => setStatus(v as WizardActivityStatus)}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => remove({ id: activity.id }, { onSuccess: onDeleted })}
          disabled={isDeleting}
          title="Xóa hoạt động"
          className="flex h-8 w-8 items-center justify-center justify-self-end rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-60 [&_svg]:h-4 [&_svg]:w-4"
        >
          <TrashOutlined />
        </button>
      </div>
      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả hoạt động"
        rows={2}
        maxLength={5000}
        className={`${inputClass} resize-none sm:col-span-4`}
      />
      <div className="h-4 text-xs sm:col-span-4">
        {state === "saving" && <span className="text-slate-400">Đang lưu...</span>}
        {state === "saved" && (
          <span className="flex items-center gap-1 text-emerald-500 [&_svg]:h-3.5 [&_svg]:w-3.5">
            <CheckCircleOutlined />
            Đã lưu
          </span>
        )}
        {state === "error" && <span className="text-red-500">Lưu thất bại, thử lại sau.</span>}
      </div>
    </div>
  );
};

/**
 * Server-backed activity editor for a saved lesson-plan-lesson: each row
 * autosaves via the standalone activity endpoints instead of being bundled
 * into the parent lesson's payload. See `ActivityListEditor` for the
 * in-memory variant used before the lesson has a real id.
 */
const ActivityListEditorServer = ({
  lessonPlanLessonId,
}: ActivityListEditorServerProps) => {
  const listParams = {
    lesson_plan_lesson_id: lessonPlanLessonId,
    per_page: 100,
    sort_by: "sort_order",
    sort_dir: "asc" as const,
  };
  const { data, refetch, isLoading } =
    LessonPlanLessonActivityService.useLessonPlanLessonActivityList({
      params: listParams,
    });
  const { mutate: create, isPending: isCreating } =
    LessonPlanLessonActivityService.useLessonPlanLessonActivityCreate();

  const activities: ServerActivity[] = data?.data?.items ?? [];

  const addRow = () => {
    create(
      {
        params: {
          lesson_plan_lesson_id: lessonPlanLessonId,
          title: "Hoạt động mới",
        },
      },
      { onSuccess: () => refetch() },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-500">Hoạt động</p>

      {isLoading && <p className="text-xs text-slate-400">Đang tải...</p>}

      {!isLoading && activities.length === 0 && (
        <p className="text-xs text-slate-400">Chưa có hoạt động nào.</p>
      )}

      {activities.map((activity) => (
        <ActivityRow key={activity.id} activity={activity} onDeleted={() => refetch()} />
      ))}

      <button
        type="button"
        onClick={addRow}
        disabled={isCreating}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:border-brand hover:text-brand disabled:opacity-60 [&_svg]:h-3.5 [&_svg]:w-3.5"
      >
        <PlusOutlined />
        Thêm hoạt động
      </button>
    </div>
  );
};

export default ActivityListEditorServer;
