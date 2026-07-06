import { useMemo, useState } from "react";
import { Button, PlusOutlined, Spin } from "tera-dls";

import { LessonPlanService } from "@tera/modules/education";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";

import { toWizardTemplates } from "./_utils";
import LessonTemplateCard from "./components/LessonTemplateCard";

interface StepLessonTemplatesProps {
  planId: number;
  onBack: () => void;
  onNext: () => void;
}

const StepLessonTemplates = ({
  planId,
  onBack,
  onNext,
}: StepLessonTemplatesProps) => {
  const [addingNew, setAddingNew] = useState(false);

  const planQuery = LessonPlanService.useLessonPlanDetail({ id: planId });
  const { isLoading, isError, refetch } = planQuery;

  const templates = useMemo(() => {
    const payload = planQuery.data?.data;
    const plan = payload?.plan ?? payload;
    return toWizardTemplates(plan?.lessons).sort(
      (a, b) => (a.lesson_no ?? 0) - (b.lesson_no ?? 0),
    );
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
          {templates.length === 0 && !addingNew && (
            <EmptyState
              classNameImage="w-28 mx-auto"
              description="Chưa có buổi học nào. Thêm buổi học đầu tiên cho giáo án."
            />
          )}

          {templates.map((template, index) => (
            <LessonTemplateCard
              key={template.id}
              planId={planId}
              index={index + 1}
              template={template}
              onSaved={() => refetch()}
            />
          ))}

          {addingNew && (
            <LessonTemplateCard
              key="new"
              planId={planId}
              index={templates.length + 1}
              template={null}
              onSaved={() => refetch()}
              onCancelNew={() => setAddingNew(false)}
            />
          )}

          {!addingNew && (
            <button
              type="button"
              onClick={() => setAddingNew(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-500 hover:border-brand hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
            >
              <PlusOutlined />
              Thêm buổi học
            </button>
          )}
        </div>
      </Spin>

      <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
        <Button
          outlined
          onClick={onBack}
          className="text-slate-600 border-slate-200 hover:bg-slate-50"
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

export default StepLessonTemplates;
