import { AcademicCapOutlined, BookOpenOutlined, Button, CheckOutlined } from "tera-dls";

import StatusBadge from "_common/components/StatusBadge";
import { CARD } from "_common/constants/dashboard";
import type { LessonPlan } from "pages/LessonPlan/_interface";

import InfoRow from "./InfoRow";

interface LessonPlanCardProps {
  loading: boolean;
  lessonPlanId?: number | null;
  lessonPlan?: LessonPlan;
  onView: () => void;
}

const LessonPlanCard = ({ loading, lessonPlanId, lessonPlan, onView }: LessonPlanCardProps) => (
  <div className={`${CARD} p-4`}>
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-sm font-semibold text-slate-700">Giáo án</p>
      {lessonPlan?.status && (
        <StatusBadge name="lesson_plan_status" value={lessonPlan.status} />
      )}
    </div>
    {!lessonPlanId ? (
      <p className="text-sm text-slate-400">Lớp học chưa được gắn giáo án.</p>
    ) : loading ? (
      <p className="text-sm text-slate-400">Đang tải...</p>
    ) : (
      <div className="flex flex-col gap-1">
        <InfoRow
          icon={<BookOpenOutlined />}
          label="Tên giáo án"
          value={lessonPlan?.plan_name || "—"}
        />
        <InfoRow
          icon={<AcademicCapOutlined />}
          label="Khóa học"
          value={lessonPlan?.course_name || "—"}
        />
        <InfoRow
          icon={<AcademicCapOutlined />}
          label="Cấp độ"
          value={lessonPlan?.level_name || "—"}
        />
        <InfoRow
          icon={<CheckOutlined />}
          label="Số bài học"
          value={`${lessonPlan?.total_lessons ?? 0} bài`}
        />
      </div>
    )}
    <Button
      outlined
      className="mt-4 w-full text-brand border-brand hover:bg-brand"
      disabled={!lessonPlanId}
      onClick={onView}
    >
      Xem giáo án
    </Button>
  </div>
);

export default LessonPlanCard;
