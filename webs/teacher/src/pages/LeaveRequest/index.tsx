import { useNavigate } from "react-router-dom";
import { CalendarDaysOutlined, ListBulletOutlined } from "tera-dls";

import IconBox from "_common/components/IconBox";
import { PATHS } from "_common/components/Layout/Menu/menus";

import CreateLeaveForm from "./components/CreateLeaveForm";

/** [068] Đơn xin nghỉ — tạo đơn (v1/edu/leave/create). Trang index (thống kê +
 * lịch + danh sách đầy đủ) nằm ở AllRequestsPage (PATHS.leaveRequestAll). */
const LeaveRequest = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBox
            icon={<CalendarDaysOutlined />}
            sizeClassName="h-12 w-12"
            roundedClassName="rounded-2xl"
            colorClassName="bg-brand text-white"
            iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tạo đơn xin nghỉ</h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Gửi đơn xin nghỉ cho học viên hoặc chính bạn.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(PATHS.leaveRequestAll)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <ListBulletOutlined className="h-4 w-4" />
          Xem tất cả đơn
        </button>
      </div>

      <div className="mx-auto max-w-xl">
        <CreateLeaveForm />
      </div>
    </div>
  );
};

export default LeaveRequest;
