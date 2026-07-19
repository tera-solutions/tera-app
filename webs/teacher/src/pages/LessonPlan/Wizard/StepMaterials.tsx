import { useMemo, useState } from "react";
import { Button, ChevronDownOutlined, ChevronUpOutlined, Spin } from "tera-dls";

import { LessonPlanService } from "@tera/modules/education";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import EntityMaterialManager from "_common/components/EntityMaterialManager";

import type { WizardLessonTemplate } from "./_interface";
import { toWizardTemplates } from "./_utils";

interface LessonMaterialsPanelProps {
  template: WizardLessonTemplate;
  index: number;
}

const LessonMaterialsPanel = ({ template, index }: LessonMaterialsPanelProps) => {
  const [expanded, setExpanded] = useState(false);

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
          className="border-t border-slate-100 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <EntityMaterialManager entityType="lesson" entityId={template.id!} />
        </div>
      )}
    </div>
  );
};

interface StepMaterialsProps {
  planId: number;
  onBack: () => void;
  onNext: () => void;
}

const StepMaterials = ({ planId, onBack, onNext }: StepMaterialsProps) => {
  const planQuery = LessonPlanService.useLessonPlanDetail({ id: planId });
  const { isLoading, isError, refetch } = planQuery;

  const templates = useMemo(() => {
    const payload = planQuery.data?.data;
    const plan = payload?.plan ?? payload;
    return toWizardTemplates(plan?.lessons)
      .filter((t) => !!t.id)
      .sort((a, b) => (a.lesson_no ?? 0) - (b.lesson_no ?? 0));
  }, [planQuery.data]);

  if (isError) {
    return (
      <Card>
        <div className="flex h-[30vh] items-center justify-center">
          <ErrorRetry onRetry={() => refetch()} message="Không tải được danh sách buổi học" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Spin spinning={isLoading}>
        <div className="flex flex-col gap-3">
          {templates.length === 0 && (
            <EmptyState
              classNameImage="w-28 mx-auto"
              description="Chưa có buổi học nào để đính kèm tài liệu."
            />
          )}

          {templates.map((template, index) => (
            <LessonMaterialsPanel key={template.id} template={template} index={index + 1} />
          ))}
        </div>
      </Spin>

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

export default StepMaterials;
