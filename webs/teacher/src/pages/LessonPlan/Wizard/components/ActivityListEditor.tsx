import { PlusOutlined, TrashOutlined } from "tera-dls";

import { useMeta } from "_common/hooks/useMeta";

import type { WizardActivity } from "../_interface";
import { LESSON_ACTIVITY_STATUS_META } from "../constants";
import { emptyActivity } from "../_utils";

interface ActivityListEditorProps {
  activities: WizardActivity[];
  onChange: (activities: WizardActivity[]) => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand";

const ActivityListEditor = ({ activities, onChange }: ActivityListEditorProps) => {
  const { getOptions } = useMeta();
  const statusOptions = getOptions(LESSON_ACTIVITY_STATUS_META);

  const updateAt = (index: number, patch: Partial<WizardActivity>) => {
    onChange(
      activities.map((activity, i) =>
        i === index ? { ...activity, ...patch } : activity,
      ),
    );
  };

  const removeAt = (index: number) => {
    onChange(activities.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...activities, emptyActivity()]);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-500">Hoạt động</p>

      {activities.length === 0 && (
        <p className="text-xs text-slate-400">Chưa có hoạt động nào.</p>
      )}

      {activities.map((activity, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 rounded-lg border border-slate-100 p-2.5 sm:grid-cols-[1fr_90px_120px_auto]"
        >
          <div className="flex flex-col gap-1.5 sm:col-span-4 sm:grid sm:grid-cols-[1fr_90px_120px_auto] sm:gap-2">
            <input
              value={activity.title}
              onChange={(e) => updateAt(index, { title: e.target.value })}
              placeholder="Tên hoạt động (vd: Warm-up)"
              maxLength={255}
              className={inputClass}
            />
            <input
              type="number"
              min={1}
              value={activity.duration ?? ""}
              onChange={(e) =>
                updateAt(index, {
                  duration: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Phút"
              className={inputClass}
            />
            <select
              value={activity.status}
              onChange={(e) =>
                updateAt(index, {
                  status: e.target.value as WizardActivity["status"],
                })
              }
              className={inputClass}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeAt(index)}
              title="Xóa hoạt động"
              className="flex h-8 w-8 items-center justify-center justify-self-end rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-4 [&_svg]:w-4"
            >
              <TrashOutlined />
            </button>
          </div>
          <textarea
            value={activity.description}
            onChange={(e) => updateAt(index, { description: e.target.value })}
            placeholder="Mô tả hoạt động"
            rows={2}
            maxLength={5000}
            className={`${inputClass} resize-none sm:col-span-4`}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:border-brand hover:text-brand [&_svg]:h-3.5 [&_svg]:w-3.5"
      >
        <PlusOutlined />
        Thêm hoạt động
      </button>
    </div>
  );
};

export default ActivityListEditor;
