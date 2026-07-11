import { Button, PlusOutlined } from "tera-dls";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";

import type { WizardLessonTemplate } from "./_interface";
import { emptyTemplate } from "./_utils";
import LessonTemplateCardLocal from "./components/LessonTemplateCardLocal";

interface StepLessonTemplatesLocalProps {
  templates: WizardLessonTemplate[];
  onChange: (templates: WizardLessonTemplate[]) => void;
  onBack: () => void;
  onNext: () => void;
}

/** Create-wizard step 2: lesson templates are staged locally, nothing is saved yet. */
const StepLessonTemplatesLocal = ({
  templates,
  onChange,
  onBack,
  onNext,
}: StepLessonTemplatesLocalProps) => {
  const updateAt = (index: number, next: WizardLessonTemplate) =>
    onChange(templates.map((t, i) => (i === index ? next : t)));

  const removeAt = (index: number) =>
    onChange(templates.filter((_, i) => i !== index));

  const addTemplate = () => onChange([...templates, emptyTemplate()]);

  return (
    <Card>
      <div className="flex flex-col gap-3">
        {templates.length === 0 && (
          <EmptyState
            classNameImage="w-28 mx-auto"
            description="Chưa có buổi học nào. Thêm buổi học đầu tiên cho giáo án."
          />
        )}

        {templates.map((template, index) => (
          <LessonTemplateCardLocal
            key={index}
            index={index + 1}
            template={template}
            onChange={(next) => updateAt(index, next)}
            onRemove={() => removeAt(index)}
          />
        ))}

        <button
          type="button"
          onClick={addTemplate}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-500 hover:border-brand hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
        >
          <PlusOutlined />
          Thêm buổi học
        </button>
      </div>

      <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
        <Button
          outlined
          onClick={onBack}
          className="text-brand border-brand hover:bg-brand"
        >
          Quay lại
        </Button>
        <Button onClick={onNext} className="bg-brand hover:bg-brand/80">
          Tiếp tục
        </Button>
      </div>
    </Card>
  );
};

export default StepLessonTemplatesLocal;
