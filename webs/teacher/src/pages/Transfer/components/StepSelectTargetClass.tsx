import { useMemo, useState } from "react";
import { Button } from "tera-dls";

import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import { ClassRoomService } from "@tera/modules/education";
import type { Classroom } from "pages/Classroom/_interface";
import { toClassrooms } from "pages/Classroom/_utils";

interface StepSelectTargetClassProps {
  courseId: number;
  excludeClassIds: number[];
  targetClassId: number | null;
  onBack: () => void;
  onNext: (target: Classroom) => void;
}

const StepSelectTargetClass = ({
  courseId,
  excludeClassIds,
  targetClassId,
  onBack,
  onNext,
}: StepSelectTargetClassProps) => {
  const [pickedId, setPickedId] = useState<number | null>(targetClassId);

  const classesQuery = ClassRoomService.useClassRoomList({
    params: { per_page: 50, filters: { course_id: courseId, status: "active" } },
  });
  const classes = useMemo(
    () => toClassrooms(classesQuery.data?.data?.items).filter((c) => !excludeClassIds.includes(c.id)),
    [classesQuery.data, excludeClassIds],
  );

  return (
    <div className="flex flex-col gap-3">
      {!classesQuery.isLoading && classes.length === 0 && (
        <EmptyState description="Không có lớp cùng khoá học để chuyển đến" className="py-10" />
      )}

      <div className="flex flex-col gap-2">
        {classes.map((classroom) => {
          const isFull = classroom.student_count >= classroom.max_students;
          const isSelected = pickedId === classroom.id;
          return (
            <button
              key={classroom.id}
              type="button"
              disabled={isFull}
              onClick={() => setPickedId(classroom.id)}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected ? "border-brand bg-sky-50/60" : "border-slate-200 hover:border-brand/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? "border-brand" : "border-slate-300"
                  }`}
                >
                  {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{classroom.name}</p>
                  <p className="text-xs text-slate-400">
                    {classroom.schedule_days || "Chưa xếp lịch"}
                    {classroom.room ? ` — ${classroom.room}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-slate-500">
                  {classroom.student_count}/{classroom.max_students || "—"}
                </span>
                <Badge
                  className={`px-2 py-0.5 text-[11px] ${
                    isFull ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {isFull ? "Đầy" : "Còn chỗ"}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between">
        <Button outlined onClick={onBack}>
          ← Quay lại
        </Button>
        <Button
          disabled={!pickedId}
          onClick={() => {
            const target = classes.find((c) => c.id === pickedId);
            if (target) onNext(target);
          }}
        >
          Bước tới →
        </Button>
      </div>
    </div>
  );
};

export default StepSelectTargetClass;
