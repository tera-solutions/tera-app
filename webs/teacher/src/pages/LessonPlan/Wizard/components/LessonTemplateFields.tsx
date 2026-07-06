import type { WizardLessonTemplate } from "../_interface";
import ActivityListEditor from "./ActivityListEditor";

interface LessonTemplateFieldsProps {
  form: WizardLessonTemplate;
  onChange: (patch: Partial<WizardLessonTemplate>) => void;
}

export const templateInputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand";

/** The lesson-template form body, shared by the server-backed (edit) and local (create) cards. */
const LessonTemplateFields = ({ form, onChange }: LessonTemplateFieldsProps) => (
  <div className="flex flex-col gap-3">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Tiêu đề buổi học
        </label>
        <input
          value={form.lesson_title}
          onChange={(e) => onChange({ lesson_title: e.target.value })}
          placeholder="Ví dụ: My Family"
          maxLength={255}
          className={templateInputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Thời lượng (phút)
        </label>
        <input
          type="number"
          min={1}
          value={form.duration ?? ""}
          onChange={(e) =>
            onChange({ duration: e.target.value ? Number(e.target.value) : undefined })
          }
          className={templateInputClass}
        />
      </div>
    </div>

    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">
        Mục tiêu bài học (mỗi dòng một mục tiêu)
      </label>
      <textarea
        value={form.objective}
        onChange={(e) => onChange({ objective: e.target.value })}
        placeholder={"Giới thiệu bản thân\nSử dụng từ vựng cơ bản"}
        rows={3}
        maxLength={5000}
        className={`${templateInputClass} resize-none`}
      />
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Từ vựng
        </label>
        <input
          value={form.vocabulary}
          onChange={(e) => onChange({ vocabulary: e.target.value })}
          maxLength={5000}
          className={templateInputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Ngữ pháp
        </label>
        <input
          value={form.grammar}
          onChange={(e) => onChange({ grammar: e.target.value })}
          maxLength={5000}
          className={templateInputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Bài tập về nhà
        </label>
        <input
          value={form.homework}
          onChange={(e) => onChange({ homework: e.target.value })}
          maxLength={5000}
          className={templateInputClass}
        />
      </div>
    </div>

    <ActivityListEditor
      activities={form.activities}
      onChange={(activities) => onChange({ activities })}
    />
  </div>
);

export default LessonTemplateFields;
