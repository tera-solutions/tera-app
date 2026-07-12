import { ClockOutlined } from "tera-dls";

import Card from "_common/components/Card";

/**
 * "Hoạt động gần đây" — thiết kế có, nhưng không có endpoint activity log.
 * Để "Sắp có" tới khi backend cung cấp.
 */
const RecentActivityCard = () => (
  <Card className="xmd:p-5" animated={false}>
    <p className="mb-3 text-base font-semibold text-slate-800">Hoạt động gần đây</p>
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-300 [&_svg]:h-5 [&_svg]:w-5">
        <ClockOutlined />
      </span>
      <p className="text-sm italic text-slate-300">Sắp có — nhật ký hoạt động</p>
    </div>
  </Card>
);

export default RecentActivityCard;
