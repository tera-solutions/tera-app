import Card from "_common/components/Card";

/**
 * "Tổng giờ giảng theo hình thức" (Online/Offline) — thiết kế có, nhưng endpoint timetable
 * KHÔNG trả `learning_type`. Để "Sắp có" tới khi backend bổ sung field hình thức.
 */
const HoursByTypeCard = () => (
  <Card className="xmd:p-5" animated={false}>
    <p className="mb-3 text-base font-semibold text-slate-800">
      Tổng giờ giảng theo hình thức
    </p>
    <div className="flex flex-col gap-3 opacity-60">
      {["Online", "Offline"].map((label) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-sm text-slate-500">{label}</span>
          <div className="h-2 flex-1 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
    <p className="mt-3 text-center text-xs italic text-slate-300">
      Sắp có — chờ dữ liệu hình thức từ hệ thống
    </p>
  </Card>
);

export default HoursByTypeCard;
