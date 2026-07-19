import { useMemo, useState } from "react";
import { Button, ChevronDownOutlined, ChevronUpOutlined, DocumentTextOutlined, Select, TrashOutlined } from "tera-dls";

import { MaterialService } from "@tera/modules/education";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";

import type { WizardLessonTemplate } from "./_interface";

interface LessonMaterialsPanelLocalProps {
  index: number;
  template: WizardLessonTemplate;
  onChange: (next: WizardLessonTemplate) => void;
}

/**
 * Stages bank materials (`/materials`) to attach once this lesson actually
 * exists — the wizard doesn't create lessons until final submit, so there's
 * nothing to link to yet (see `StepReviewCreate`'s attach loop).
 */
const LessonMaterialsPanelLocal = ({
  index,
  template,
  onChange,
}: LessonMaterialsPanelLocalProps) => {
  const [expanded, setExpanded] = useState(false);

  const handlePick = (materialId: number | string, label: string) => {
    if (template.materials.some((m) => m.material_id === materialId)) return;
    onChange({
      ...template,
      materials: [...template.materials, { material_id: materialId, name: label }],
    });
  };

  const handleRemove = (materialId: number | string) => {
    onChange({
      ...template,
      materials: template.materials.filter((m) => m.material_id !== materialId),
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
            {template.lesson_title || "—"}
          </p>
          <p className="text-xs text-slate-400">
            {template.materials.length} tài liệu
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
          {expanded ? <ChevronUpOutlined /> : <ChevronDownOutlined />}
        </span>
      </div>

      {expanded && (
        <div
          className="flex flex-col gap-2 border-t border-slate-100 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          {template.materials.map((material) => (
            <div
              key={material.material_id}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-sm text-slate-600"
            >
              <DocumentTextOutlined className="h-4 w-4 shrink-0 text-brand" />
              <span className="min-w-0 flex-1 truncate">{material.name}</span>
              <button
                type="button"
                title="Xóa"
                onClick={() => handleRemove(material.material_id)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-3.5 [&_svg]:w-3.5"
              >
                <TrashOutlined />
              </button>
            </div>
          ))}

          {template.materials.length === 0 && (
            <p className="text-xs text-slate-400">Chưa có tài liệu đính kèm.</p>
          )}

          <MaterialSelectField onPick={handlePick} />
        </div>
      )}
    </div>
  );
};

/**
 * A plain (non-async-search) bank picker: staging needs the material's name
 * at pick time (to render in the local list before anything is saved), which
 * a bare id-only `onChange` can't provide — so this reads the fetched page
 * directly instead of going through the generic `MaterialSelect`.
 */
const MaterialSelectField = ({
  onPick,
}: {
  onPick: (id: number | string, label: string) => void;
}) => {
  const query = MaterialService.useMaterialList({ params: { per_page: 100 } });
  const options = useMemo(
    () =>
      (query.data?.data?.items ?? []).map((m: any) => ({ value: m.id, label: m.material_name })),
    [query.data],
  );

  return (
    <Select
      value={undefined}
      loading={query.isLoading}
      options={options}
      placeholder="Chọn tài liệu từ ngân hàng tài liệu"
      onChange={(v) => {
        if (v == null || typeof v === "object") return;
        const option = options.find((o) => o.value === v);
        onPick(v, option?.label ?? `#${v}`);
      }}
    />
  );
};

interface StepMaterialsLocalProps {
  templates: WizardLessonTemplate[];
  onChange: (templates: WizardLessonTemplate[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const StepMaterialsLocal = ({
  templates,
  onChange,
  onBack,
  onNext,
}: StepMaterialsLocalProps) => {
  const updateAt = (index: number, next: WizardLessonTemplate) =>
    onChange(templates.map((t, i) => (i === index ? next : t)));

  return (
    <Card>
      <div className="flex flex-col gap-3">
        {templates.length === 0 && (
          <EmptyState
            classNameImage="w-28 mx-auto"
            description="Chưa có buổi học nào để đính kèm tài liệu."
          />
        )}

        {templates.map((template, index) => (
          <LessonMaterialsPanelLocal
            key={index}
            index={index + 1}
            template={template}
            onChange={(next) => updateAt(index, next)}
          />
        ))}
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

export default StepMaterialsLocal;
