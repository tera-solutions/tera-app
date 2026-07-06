import { useMemo, useRef, useState } from "react";
import {
  ArrowUpTrayOutlined,
  Button,
  ChevronDownOutlined,
  ChevronUpOutlined,
  DocumentTextOutlined,
  notification,
  Spin,
  TrashOutlined,
} from "tera-dls";

import { LessonMaterialService, LessonPlanService } from "@tera/modules/education";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import { materialTypeOf } from "_common/utils/material";

import type { WizardLessonTemplate } from "./_interface";
import { toWizardTemplates } from "./_utils";
import { MATERIAL_ACCEPT, MATERIAL_MAX_SIZE } from "./constants";

interface LessonMaterialsPanelProps {
  template: WizardLessonTemplate;
  index: number;
  onChanged: () => void;
}

const LessonMaterialsPanel = ({
  template,
  index,
  onChanged,
}: LessonMaterialsPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState<string[]>([]);
  const [detachingId, setDetachingId] = useState<number | string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadFile } = LessonMaterialService.useLessonMaterialUpload();
  const { mutateAsync: attachMaterial } = LessonMaterialService.useLessonMaterialAttach();
  const { mutate: detachMaterial } = LessonMaterialService.useLessonMaterialDetach();

  const attach = async (file: File) => {
    setPending((prev) => [...prev, file.name]);
    try {
      const uploaded = await uploadFile(file);
      await attachMaterial({
        lessonId: template.id!,
        file_id: uploaded.id,
        material_type: materialTypeOf(file.name),
      });
      onChanged();
      notification.success({ message: `Đã đính kèm "${file.name}"` });
    } catch (err: any) {
      notification.error({
        message: err?.msg ?? err?.message ?? `Đính kèm "${file.name}" thất bại`,
      });
    } finally {
      setPending((prev) => prev.filter((name) => name !== file.name));
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const tooBig = picked.find((f) => f.size > MATERIAL_MAX_SIZE);
    if (tooBig) {
      notification.error({ message: `File quá lớn (tối đa 10MB): ${tooBig.name}` });
      return;
    }
    picked.forEach(attach);
  };

  const handleDetach = (materialId: number | string) => {
    setDetachingId(materialId);
    detachMaterial(
      { id: materialId },
      {
        onSuccess: () => {
          onChanged();
          notification.success({ message: "Đã xóa tài liệu" });
        },
        onError: (err: any) => {
          notification.error({
            message: err?.msg ?? err?.message ?? "Xóa tài liệu thất bại",
          });
        },
        onSettled: () => setDetachingId(null),
      },
    );
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
              key={material.id}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-sm text-slate-600"
            >
              <DocumentTextOutlined className="h-4 w-4 shrink-0 text-brand" />
              <span className="min-w-0 flex-1 truncate">{material.name}</span>
              <span className="shrink-0 text-[11px] uppercase text-slate-400">
                {material.material_type}
              </span>
              {detachingId === material.id ? (
                <Spin spinning size="small" />
              ) : (
                <button
                  type="button"
                  title="Xóa"
                  onClick={() => handleDetach(material.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 [&_svg]:h-3.5 [&_svg]:w-3.5"
                >
                  <TrashOutlined />
                </button>
              )}
            </div>
          ))}

          {template.materials.length === 0 && (
            <p className="text-xs text-slate-400">Chưa có tài liệu đính kèm.</p>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-2.5 text-sm text-slate-500 hover:border-brand hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
          >
            <ArrowUpTrayOutlined />
            Tải tài liệu (pdf, doc, ppt, ảnh — tối đa 10MB)
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={MATERIAL_ACCEPT}
            className="hidden"
            onChange={handleSelect}
          />

          {pending.length > 0 && (
            <ul className="flex flex-col gap-1">
              {pending.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
                >
                  <Spin spinning size="small" />
                  <span className="min-w-0 flex-1 truncate">{name}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">
                    Đang tải...
                  </span>
                </li>
              ))}
            </ul>
          )}
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
            <LessonMaterialsPanel
              key={template.id}
              template={template}
              index={index + 1}
              onChanged={() => refetch()}
            />
          ))}
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

export default StepMaterials;
