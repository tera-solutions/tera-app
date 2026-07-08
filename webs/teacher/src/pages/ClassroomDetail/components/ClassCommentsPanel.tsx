import { useMemo } from "react";

import Avatar from "_common/components/Avatar";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import { Spin } from "tera-dls";
import { EvaluationService, StudentService } from "@tera/modules/education";

/**
 * Student evaluations scoped to this class — `edu/evaluation/list` honours
 * `class_room_id`. The evaluation resource carries only `target_id` (no student
 * name), so names are joined from the class roster.
 */
const ClassCommentsPanel = ({ classId }: { classId: number | null }) => {
  const query = EvaluationService.useEvaluationList(
    {
      params: {
        per_page: 100,
        filters: { class_room_id: classId ?? 0, evaluation_type: "student" },
      },
    },
    { enabled: !!classId },
  );

  const rosterQuery = StudentService.useStudentList(
    { params: { class_id: classId ?? 0, per_page: 100 } },
    { enabled: !!classId },
  );
  const studentNameMap = useMemo(() => {
    const map = new Map<number, { name: string; avatar: string }>();
    (rosterQuery.data?.data?.items ?? []).forEach((s: any) =>
      map.set(s.id, { name: s.name ?? `#${s.id}`, avatar: s.avatar ?? "" }),
    );
    return map;
  }, [rosterQuery.data]);

  const items = query.data?.data?.items ?? [];

  if (query.isLoading || rosterQuery.isLoading) {
    return (
      <Spin spinning>
        <div className="h-40" />
      </Spin>
    );
  }
  if (query.isError) {
    return (
      <div className="flex h-40 items-center justify-center">
        <ErrorRetry onRetry={() => query.refetch()} message="Không tải được nhận xét" />
      </div>
    );
  }
  if (items.length === 0) {
    return <EmptyState description="Lớp học chưa có nhận xét nào" className="py-10" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((e: any) => {
        const student = studentNameMap.get(e.target_id);
        return (
          <div key={e.id} className="rounded-xl border border-slate-100 p-3">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Avatar src={student?.avatar} alt={student?.name} sizeClassName="size-7" />
              <span className="text-sm font-medium text-slate-800">
                {student?.name ?? `HV #${e.target_id}`}
              </span>
              {e.score != null && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                  {e.score} điểm
                </span>
              )}
              {e.classification_label && (
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-brand">
                  {e.classification_label}
                </span>
              )}
              {e.evaluation_period_label && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                  {e.evaluation_period_label}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-700">{e.comment || "Không có nội dung nhận xét"}</p>
            {e.evaluated_at && (
              <p className="mt-1 text-[11px] text-slate-400">
                {new Date(e.evaluated_at).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClassCommentsPanel;
