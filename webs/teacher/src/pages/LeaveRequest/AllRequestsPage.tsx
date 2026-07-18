import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDaysOutlined, PlusOutlined, notification } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";
import { PATHS } from "_common/components/Layout/Menu/menus";
import useConfirm from "_common/hooks/useConfirm";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { LeaveRequestService } from "@tera/modules/education";

import LeaveStats from "./components/LeaveStats";
import LeaveCalendarCard from "./components/LeaveCalendarCard";
import LeaveRequestTable from "./components/LeaveRequestTable";
import RejectLeaveModal from "./components/RejectLeaveModal";
import ScheduleMakeupModal from "./components/ScheduleMakeupModal";
import type { LeaveRequestRow, LeaveStatus } from "./_interface";
import { toLeaveRequests, summarizeLeaveRequests } from "./_utils";

const CALENDAR_FETCH_SIZE = 100;

/** [068] Đơn xin nghỉ — trang index: thống kê + lịch nghỉ + danh sách đầy đủ
 * (duyệt/từ chối/xếp lịch học bù). Tạo đơn mới nằm ở trang riêng (PATHS.leaveRequest). */
const AllRequestsPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { getOptions } = useMeta();
  const statusTabs = useMemo(
    () => [{ key: "", label: "Tất cả" }, ...getOptions("leave_status").map((o) => ({ key: o.value, label: o.label }))],
    [getOptions],
  );
  const [rejecting, setRejecting] = useState<LeaveRequestRow | null>(null);
  const [schedulingMakeup, setSchedulingMakeup] = useState<LeaveRequestRow | null>(null);

  const [filters, setFilters] = useUrlFilters(
    {
      status: { type: "string", default: "" as LeaveStatus | "" },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const listParams: Record<string, unknown> = {
    page: filters.page,
    per_page: filters.per_page,
    status: filters.status || undefined,
    sort_by: "created_at",
    sort_dir: "desc",
  };
  const listQuery = LeaveRequestService.useLeaveRequestList({ params: listParams });
  const items = useMemo(() => toLeaveRequests(listQuery.data), [listQuery.data]);
  const total = listQuery.data?.data?.pagination?.total ?? items.length;

  // Thống kê + lịch nghỉ cần một tập rộng hơn trang hiện tại (không phụ thuộc
  // status tab/phân trang đang chọn) — tách riêng khỏi listQuery ở trên.
  const overviewQuery = LeaveRequestService.useLeaveRequestList({
    params: { page: 1, per_page: CALENDAR_FETCH_SIZE, sort_by: "created_at", sort_dir: "desc" },
  });
  const overviewItems = useMemo(() => toLeaveRequests(overviewQuery.data), [overviewQuery.data]);
  const stats = useMemo(() => summarizeLeaveRequests(overviewItems), [overviewItems]);

  const { mutate: approveLeave } = LeaveRequestService.useLeaveRequestApprove();
  const { mutate: rejectLeave, isPending: isRejecting } = LeaveRequestService.useLeaveRequestReject();
  const { mutate: cancelLeave } = LeaveRequestService.useLeaveRequestCancel();
  const { mutate: scheduleMakeup, isPending: isScheduling } = LeaveRequestService.useLeaveRequestScheduleMakeup();

  const handleApprove = (row: LeaveRequestRow) =>
    approveLeave(
      { id: row.id },
      {
        onSuccess: () => notification.success({ message: "Đã duyệt đơn xin nghỉ" }),
        onError: (error: any) => notification.error({ message: error?.data?.msg ?? "Không thể duyệt đơn" }),
      },
    );

  const handleReject = (values: { rejection_reason: string }) => {
    if (!rejecting) return;
    rejectLeave(
      { id: rejecting.id, params: values },
      {
        onSuccess: () => {
          notification.success({ message: "Đã từ chối đơn xin nghỉ" });
          setRejecting(null);
        },
        onError: (error: any) => notification.error({ message: error?.data?.msg ?? "Không thể từ chối đơn" }),
      },
    );
  };

  const handleCancel = (row: LeaveRequestRow) => {
    confirm.warning({
      title: "Hủy đơn xin nghỉ",
      content: `Bạn có chắc muốn hủy đơn "${row.code}"?`,
      onOk: () =>
        cancelLeave(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã hủy đơn xin nghỉ" }),
            onError: (error: any) => notification.error({ message: error?.data?.msg ?? "Không thể hủy đơn" }),
          },
        ),
    });
  };

  const handleScheduleMakeup = (makeupLessonId: number | string) => {
    const waitingMakeup = schedulingMakeup?.makeups.find((m) => m.status === "waiting");
    if (!waitingMakeup) return;
    scheduleMakeup(
      { makeupId: waitingMakeup.id, params: { makeup_lesson_id: makeupLessonId } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã xếp lịch học bù" });
          setSchedulingMakeup(null);
        },
        onError: (error: any) => notification.error({ message: error?.data?.msg ?? "Không thể xếp lịch học bù" }),
      },
    );
  };

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
            <h1 className="text-xl font-bold text-slate-800">Đơn xin nghỉ</h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Toàn bộ đơn xin nghỉ trong trung tâm — duyệt, từ chối, xếp lịch học bù.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(PATHS.leaveRequest)}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/80"
        >
          <PlusOutlined className="h-4 w-4" />
          Tạo đơn xin nghỉ
        </button>
      </div>

      <div className="mb-4">
        <LeaveStats stats={stats} loading={overviewQuery.isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] [&>*]:min-w-0">
        <Card animated={false} className="xmd:p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.key || "all"}
                type="button"
                onClick={() => setFilters({ status: tab.key as LeaveStatus | "", page: 1 })}
                className={`rounded-lg px-3 py-1 text-[13px] font-medium transition-colors ${
                  filters.status === tab.key
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <LeaveRequestTable
            items={items}
            loading={listQuery.isLoading}
            isError={listQuery.isError}
            onRetry={() => listQuery.refetch()}
            total={total}
            page={filters.page}
            perPage={filters.per_page}
            onPageChange={(p, size) => {
              if (size !== filters.per_page) setFilters({ per_page: size, page: 1 });
              else setFilters({ page: p });
            }}
            onApprove={handleApprove}
            onReject={(row) => setRejecting(row)}
            onCancel={handleCancel}
            onScheduleMakeup={(row) => setSchedulingMakeup(row)}
          />
        </Card>

        <LeaveCalendarCard items={overviewItems} />
      </div>

      <RejectLeaveModal
        open={!!rejecting}
        isPending={isRejecting}
        onSubmit={handleReject}
        onClose={() => setRejecting(null)}
      />
      <ScheduleMakeupModal
        open={!!schedulingMakeup}
        request={schedulingMakeup}
        isPending={isScheduling}
        onSubmit={handleScheduleMakeup}
        onClose={() => setSchedulingMakeup(null)}
      />
    </div>
  );
};

export default AllRequestsPage;
