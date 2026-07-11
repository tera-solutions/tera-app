import { useMemo, useState } from "react";
import { Button, notification } from "tera-dls";

import ClassroomSelect from "_common/components/ClassroomSelect";
import EmptyState from "_common/components/EmptyState";
import type { SelectOption } from "_common/hooks/useAsyncSelectOptions";
import { ClassRoomService } from "@tera/modules/education";
import type { Classroom } from "pages/Classroom/_interface";
import { toClassrooms } from "pages/Classroom/_utils";

interface StepSelectTargetClassProps {
  courseId: number;
  excludeClassIds: number[];
  targetClass: Classroom | null;
  onBack: () => void;
  onNext: (target: Classroom) => void;
}

const StepSelectTargetClass = ({
  courseId,
  excludeClassIds,
  targetClass,
  onBack,
  onNext,
}: StepSelectTargetClassProps) => {
  const [pickedId, setPickedId] = useState<number | null>(targetClass?.id ?? null);

  const classesQuery = ClassRoomService.useClassRoomList({
    params: { per_page: 50, filters: { course_id: courseId, status: "active" } },
  });
  const classes = useMemo(
    () => toClassrooms(classesQuery.data?.data?.items),
    [classesQuery.data],
  );

  // Fallback label so the previously picked class still renders when it isn't
  // on the select's current search page.
  const selectedOption: SelectOption | null = targetClass
    ? { value: targetClass.id, label: targetClass.name }
    : null;

  const handleNext = () => {
    if (pickedId == null) return;
    if (excludeClassIds.includes(pickedId)) {
      notification.error({ message: "Không thể chuyển đến lớp hiện tại của học viên" });
      return;
    }
    const target = classes.find((c) => c.id === pickedId);
    if (target) onNext(target);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700">Lớp chuyển đến</p>
        <ClassroomSelect
          value={pickedId}
          onChange={(value) => setPickedId(value != null ? Number(value) : null)}
          courseId={courseId}
          selectedOption={selectedOption}
          placeholder="Chọn lớp cùng khoá học"
          allowClear
        />
        {!classesQuery.isLoading && classes.length === 0 && (
          <EmptyState description="Không có lớp cùng khoá học để chuyển đến" className="py-10" />
        )}
      </div>

      <div className="mt-2 flex justify-between">
        <Button outlined onClick={onBack}>
          ← Quay lại
        </Button>
        <Button disabled={pickedId == null} onClick={handleNext}>
          Bước tới →
        </Button>
      </div>
    </div>
  );
};

export default StepSelectTargetClass;
