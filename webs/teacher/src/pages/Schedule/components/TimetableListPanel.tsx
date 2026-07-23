import { useMemo, useState } from "react";
import moment from "moment";
import { Modal } from "tera-dls";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import WidgetState from "_common/components/WidgetState";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { TimetableService } from "@tera/modules/education";

interface TimetableRow {
  id: number;
  code: string;
  name: string;
  course_name: string;
  class_name: string;
  schedule_pattern: string;
  start_date: string;
  end_date: string;
  total_sessions: number;
  status: string;
}

const toRows = (raw: any[] | null | undefined): TimetableRow[] =>
  (raw ?? []).map((t) => ({
    id: t.id ?? 0,
    code: t.timetable_code ?? "",
    name: t.name ?? "",
    course_name: t.course?.name ?? "—",
    class_name: t.class_room?.name ?? "—",
    schedule_pattern: t.schedule_pattern_label ?? t.schedule_pattern ?? "",
    start_date: t.start_date ?? "",
    end_date: t.end_date ?? "",
    total_sessions: t.total_sessions ?? 0,
    status: t.status ?? "",
  }));

const fmtDate = (value: string) => (value ? moment(value).format("DD/MM/YYYY") : "—");

const WEEKDAY_LABEL: Record<number, string> = {
  0: "CN",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};

const TimetableDetailModal = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const detailQuery = TimetableService.useTimetableDetail({ id: id ?? "" }, { enabled: !!id });
  const data = detailQuery.data?.data;
  const rules: any[] = data?.rules ?? [];

  return (
    <Modal
      title={data ? `Thời khóa biểu ${data.timetable_code}` : "Chi tiết thời khóa biểu"}
      open={!!id}
      onCancel={onClose}
      className="!w-[95%] xmd:!w-[520px]"
      footer={null}
    >
      <WidgetState isLoading={detailQuery.isLoading} isError={detailQuery.isError} onRetry={() => detailQuery.refetch()}>
        {data && (
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-800">{data.name}</span>
              <StatusBadge name="timetable_status" value={data.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-100 p-3">
              <span className="text-slate-400">Khóa học</span>
              <span className="text-right text-slate-700">{data.course?.name ?? "—"}</span>
              <span className="text-slate-400">Lớp</span>
              <span className="text-right text-slate-700">{data.class_room?.name ?? "—"}</span>
              <span className="text-slate-400">Thời gian</span>
              <span className="text-right text-slate-700">
                {fmtDate(data.start_date)} - {fmtDate(data.end_date)}
              </span>
              <span className="text-slate-400">Tổng buổi</span>
              <span className="text-right text-slate-700">{data.total_sessions}</span>
            </div>
            {rules.length > 0 && (
              <div>
                <p className="mb-1.5 font-medium text-slate-700">Lịch lặp lại</p>
                <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100">
                  {rules.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-2.5">
                      <span className="text-slate-700">{WEEKDAY_LABEL[r.day_of_week] ?? r.day_of_week}</span>
                      <span className="text-slate-500">
                        {r.start_time} - {r.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </WidgetState>
    </Modal>
  );
};

/** Timetable (schedule *definitions* — code, pattern, date range, total
 * sessions) list, distinct from the session-instance calendar/list views
 * above it. There was previously no way to see this at all. */
const TimetableListPanel = () => {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const [filters, setFilters] = useUrlFilters(
    {
      ttPage: { type: "number", default: 1 },
      ttPerPage: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const listQuery = TimetableService.useTimetableList({
    params: { page: filters.ttPage, per_page: filters.ttPerPage },
  });
  const rows = useMemo(() => toRows(listQuery.data?.data?.items), [listQuery.data]);
  const total = listQuery.data?.data?.pagination?.total ?? 0;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== filters.ttPerPage) {
      setFilters({ ttPerPage: nextSize, ttPage: 1 });
    } else {
      setFilters({ ttPage: nextPage });
    }
  };

  const columns: TableColumn<TimetableRow>[] = [
    { key: "code", title: "Mã TKB", render: (r) => r.code || "—" },
    { key: "name", title: "Tên lịch", render: (r) => r.name || "—" },
    {
      key: "target",
      title: "Khóa học / Lớp",
      render: (r) => (
        <div className="flex flex-col">
          <span className="text-slate-700">{r.course_name}</span>
          <span className="text-xs text-slate-400">{r.class_name}</span>
        </div>
      ),
    },
    { key: "pattern", title: "Mẫu lịch", render: (r) => r.schedule_pattern || "—" },
    {
      key: "range",
      title: "Thời gian",
      render: (r) => `${fmtDate(r.start_date)} - ${fmtDate(r.end_date)}`,
    },
    { key: "total_sessions", title: "Tổng buổi", render: (r) => r.total_sessions },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <StatusBadge name="timetable_status" value={r.status} />,
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        onRetry={() => listQuery.refetch()}
        errorMessage="Không tải được danh sách thời khóa biểu"
        emptyText="Chưa có thời khóa biểu nào"
        minWidthClassName="min-w-215"
        onRowClick={(r) => setViewingId(r.id)}
      />
      <TablePagination
        total={total}
        page={filters.ttPage}
        perPage={filters.ttPerPage}
        unit="thời khóa biểu"
        onChange={handleChangePage}
      />
      <TimetableDetailModal id={viewingId} onClose={() => setViewingId(null)} />
    </div>
  );
};

export default TimetableListPanel;
