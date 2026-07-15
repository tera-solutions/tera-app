import { useMemo } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { CalendarDaysOutlined } from "tera-dls";

import IconBox from "_common/components/IconBox";
import { PATHS } from "_common/components/Layout/Menu/menus";

import LeaveStats from "./components/LeaveStats";
import CreateLeaveForm from "./components/CreateLeaveForm";
import LeaveCalendarCard from "./components/LeaveCalendarCard";
import LeaveHistoryCard from "./components/LeaveHistoryCard";
import { MOCK_LEAVE_HISTORY, MOCK_LEAVE_STATS } from "./_mock";

const RECENT_LIMIT = 4;

/**
 * [068] Đơn xin nghỉ (Leave Request) — GIAO DIỆN theo design `picture's page/don xin nghi.png`.
 * ⚠️ UI-only: dữ liệu lấy từ `_mock.ts`, CHƯA wire API. Người làm API nối route thật
 * `v1/edu/leave/*` (xem `docs/postman-structure.md` §5), giữ shape ở `_interface.ts`.
 */
const LeaveRequest = () => {
  const navigate = useNavigate();

  // Lịch sử rút gọn ở trang chính: mới nhất trước, tối đa RECENT_LIMIT đơn.
  const recentHistory = useMemo(
    () =>
      [...MOCK_LEAVE_HISTORY]
        .sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf())
        .slice(0, RECENT_LIMIT),
    [],
  );

  return (
    <div className="p-4 xmd:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <IconBox
          icon={<CalendarDaysOutlined />}
          sizeClassName="h-12 w-12"
          roundedClassName="rounded-2xl"
          colorClassName="bg-brand text-white"
          iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-800">Đơn xin nghỉ</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý đơn xin nghỉ phép và lịch nghỉ của bạn.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <LeaveStats stats={MOCK_LEAVE_STATS} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] [&>*]:min-w-0">
        <div className="order-2 lg:order-none">
          <CreateLeaveForm />
        </div>
        <div className="order-1 flex flex-col gap-4 lg:order-none">
          <LeaveCalendarCard items={MOCK_LEAVE_HISTORY} />
          <LeaveHistoryCard
            items={recentHistory}
            onViewAll={() => navigate(PATHS.leaveRequestAll)}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
