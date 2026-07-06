import { BellOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";

const ClassNotifications = () => (
  <div className={`${CARD} p-4`}>
    <p className="mb-3 text-sm font-semibold text-slate-700">
      Thông báo lớp học
    </p>
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 [&_svg]:h-5 [&_svg]:w-5">
        <BellOutlined />
      </div>
      <p className="text-xs text-slate-400">
        Chưa có thông báo cho lớp này.
      </p>
    </div>
  </div>
);

export default ClassNotifications;
