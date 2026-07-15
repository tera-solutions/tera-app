import { useMemo, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "tera-dls";

import Card from "_common/components/Card";
import { PATHS } from "_common/components/Layout/Menu/menus";

import LeaveRequestTable from "./components/LeaveRequestTable";
import { MOCK_LEAVE_HISTORY } from "./_mock";
import type { LeaveStatus } from "./_interface";

const TABS: { key: LeaveStatus | ""; label: string }[] = [
  { key: "", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "approved", label: "Đã duyệt" },
  { key: "rejected", label: "Từ chối" },
];

/**
 * Màn "Danh sách đơn xin nghỉ" đầy đủ (mở từ nút "Xem tất cả").
 * ⚠️ UI-only: data từ `_mock.ts`. Wire API: thay bằng list hook + phân trang server.
 */
const AllRequestsPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<LeaveStatus | "">("");

  // Mới nhất trước.
  const sorted = useMemo(
    () =>
      [...MOCK_LEAVE_HISTORY].sort(
        (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
      ),
    [],
  );
  const filtered = useMemo(
    () => (status ? sorted.filter((i) => i.status === status) : sorted),
    [sorted, status],
  );

  return (
    <div className="p-4 xmd:p-6">
      <button
        type="button"
        onClick={() => navigate(PATHS.leaveRequest)}
        className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand"
      >
        <ArrowLeftOutlined className="h-4 w-4" />
        Quay lại Đơn xin nghỉ
      </button>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Danh sách đơn xin nghỉ</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Toàn bộ đơn xin nghỉ bạn đã tạo.
        </p>
      </div>

      <Card animated={false} className="xmd:p-5">
        {/* Tab lọc trạng thái */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key || "all"}
              type="button"
              onClick={() => setStatus(tab.key)}
              className={`rounded-lg px-3 py-1 text-[13px] font-medium transition-colors ${
                status === tab.key
                  ? "bg-brand text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <LeaveRequestTable items={filtered} />
      </Card>
    </div>
  );
};

export default AllRequestsPage;
