import { Button, CheckOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";

interface SessionFinishedCardProps {
  className: string;
  attendanceRate: number;
  attendingCount: number;
  totalStudents: number;
  activitiesDone: number;
  activitiesTotal: number;
  onBack: () => void;
}

const SessionFinishedCard = ({
  className,
  attendanceRate,
  attendingCount,
  totalStudents,
  activitiesDone,
  activitiesTotal,
  onBack,
}: SessionFinishedCardProps) => (
  <div className={`${CARD} flex flex-col items-center p-10 text-center`}>
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
      <CheckOutlined className="h-8 w-8" />
    </div>
    <h2 className="mb-1 text-xl font-bold text-slate-800">Buổi học đã kết thúc</h2>
    <p className="mb-6 max-w-md text-sm text-slate-500">
      {className} đã hoàn tất. Điểm danh và đánh giá đã được lưu lại.
    </p>
    <div className="mb-6 flex flex-wrap justify-center gap-8">
      <div>
        <p className="text-2xl font-bold text-slate-800">{attendanceRate}%</p>
        <p className="text-xs text-slate-400">
          Điểm danh ({attendingCount}/{totalStudents})
        </p>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">
          {activitiesDone}/{activitiesTotal}
        </p>
        <p className="text-xs text-slate-400">Hoạt động hoàn thành</p>
      </div>
    </div>
    <Button outlined onClick={onBack} className="text-slate-600 border-slate-200">
      ← Xem lại buổi học
    </Button>
  </div>
);

export default SessionFinishedCard;
