import { useMemo, useState } from "react";
import moment from "moment";
import { Modal } from "tera-dls";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import WidgetState from "_common/components/WidgetState";
import { useMeta } from "_common/hooks/useMeta";
import { EnrollmentService } from "@tera/modules/education";

interface EnrollmentHistoryRow {
  id: number;
  code: string;
  course_name: string;
  class_name: string;
  status: string;
  enrolled_at: string;
  completed_lessons: number;
  total_lessons: number;
}

const toRows = (raw: any[] | null | undefined): EnrollmentHistoryRow[] =>
  (raw ?? []).map((e) => ({
    id: e.id ?? 0,
    code: e.code ?? "",
    course_name: e.course?.name ?? "—",
    class_name: e.class?.name ?? "—",
    status: e.status ?? "",
    enrolled_at: e.enrolled_at ?? "",
    completed_lessons: e.completed_lessons ?? 0,
    total_lessons: e.total_lessons ?? 0,
  }));

const formatVnd = (value: number): string => `${Math.round(value || 0).toLocaleString("vi-VN")}đ`;
const fmtDate = (v: string | null | undefined) => (v ? moment(v).format("DD/MM/YYYY") : "—");

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-1.5 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

/** Chi tiết một ghi danh: tiến độ, tài chính, thanh toán, chuyển lớp, bảo lưu
 * — mở trực tiếp từ dòng trong bảng lịch sử, không có trang riêng. */
const EnrollmentDetailModal = ({ enrollmentId, onClose }: { enrollmentId: number | null; onClose: () => void }) => {
  const detailQuery = EnrollmentService.useEnrollmentDetail(
    { id: enrollmentId ?? "" },
    { enabled: !!enrollmentId },
  );
  const { getLabel } = useMeta();
  const data = detailQuery.data?.data;
  const enrollment = data?.enrollment;
  const progress = data?.progress;
  const financial = data?.financial;
  const payments: any[] = data?.payments ?? [];
  const transfers: any[] = data?.transfers ?? [];
  const suspensions: any[] = data?.suspensions ?? [];

  return (
    <Modal
      title={enrollment ? `Ghi danh ${enrollment.code}` : "Chi tiết ghi danh"}
      open={!!enrollmentId}
      onCancel={onClose}
      className="!w-[95%] xmd:!w-[640px]"
      footer={null}
    >
      <WidgetState isLoading={detailQuery.isLoading} isError={detailQuery.isError}>
        {enrollment && (
          <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusBadge name="enrollment_status" value={enrollment.status} />
              <span className="text-xs text-slate-400">Ghi danh ngày {fmtDate(enrollment.enrolled_at)}</span>
            </div>

            <div className="rounded-lg border border-slate-100 p-3 text-sm">
              <Row label="Khóa học" value={enrollment.course?.name ?? "—"} />
              <Row label="Lớp học" value={enrollment.class?.name ?? "—"} />
              <Row label="Giáo viên" value={enrollment.class?.teacher?.full_name ?? "—"} />
            </div>

            {progress && (
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">Tiến độ học tập</p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${Math.min(progress.completion_rate, 100)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                  <span>
                    {progress.completed_lessons}/{progress.total_lessons} buổi ({progress.completion_rate}%)
                  </span>
                  <span>Còn lại: {progress.remaining_lessons} buổi</span>
                </div>
              </div>
            )}

            {financial && (
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="mb-1 text-sm font-semibold text-slate-700">Tài chính</p>
                <Row label="Học phí" value={formatVnd(financial.tuition_amount)} />
                <Row label="Giảm giá" value={`-${formatVnd(financial.discount_amount)}`} />
                <Row label="Đã thanh toán" value={formatVnd(financial.paid_amount)} />
                {financial.refund_amount > 0 && (
                  <Row label="Đã hoàn tiền" value={formatVnd(financial.refund_amount)} />
                )}
                <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-1.5 text-sm">
                  <span className="text-slate-500">Còn nợ</span>
                  <span className={`font-semibold ${financial.debt_amount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {formatVnd(financial.debt_amount)}
                  </span>
                </div>
              </div>
            )}

            {payments.length > 0 && (
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">Lịch sử thanh toán</p>
                <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100 text-sm">
                  {payments.map((p) => (
                    <div key={p.id} className="flex justify-between p-2.5">
                      <span className="text-slate-600">
                        {fmtDate(p.paid_at ?? p.created_at)} · {getLabel("payment_method", p.method)}
                      </span>
                      <span className="font-medium text-slate-800">{formatVnd(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transfers.length > 0 && (
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">Lịch sử chuyển lớp</p>
                <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100 text-sm">
                  {transfers.map((t) => (
                    <div key={t.id} className="flex flex-col gap-0.5 p-2.5">
                      <span className="text-slate-700">
                        Lớp #{t.from_class_id} → Lớp #{t.to_class_id}
                      </span>
                      <span className="text-xs text-slate-400">
                        {fmtDate(t.transfer_date)} {t.reason ? `· ${t.reason}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suspensions.length > 0 && (
              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">Lịch sử bảo lưu</p>
                <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100 text-sm">
                  {suspensions.map((s) => (
                    <div key={s.id} className="flex flex-col gap-0.5 p-2.5">
                      <span className="text-slate-700">
                        {fmtDate(s.start_date)} – {fmtDate(s.end_date)}
                      </span>
                      {s.reason && <span className="text-xs text-slate-400">{s.reason}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enrollment.note && (
              <div>
                <p className="text-xs text-slate-400">Ghi chú</p>
                <p className="text-sm text-slate-700">{enrollment.note}</p>
              </div>
            )}
          </div>
        )}
      </WidgetState>
    </Modal>
  );
};

/**
 * The student's learning history — their enrollment records (course, class,
 * status, progress). `edu/enrollment/list` honours `student_id` and is
 * teacher-scoped, so only enrollments in the teacher's own classes appear.
 * Click a row to open the full detail (tài chính, thanh toán, chuyển lớp,
 * bảo lưu) inline — there's no separate enrollment detail page/route.
 */
const StudentHistoryPanel = ({ studentId }: { studentId: number | null }) => {
  const [viewingId, setViewingId] = useState<number | null>(null);

  const query = EnrollmentService.useEnrollmentList(
    { params: { per_page: 50, filters: { student_id: studentId ?? 0 } } },
    { enabled: !!studentId },
  );
  const rows = useMemo(() => toRows(query.data?.data?.items), [query.data]);

  const columns: TableColumn<EnrollmentHistoryRow>[] = [
    {
      key: "course",
      title: "Khóa học",
      render: (row) => <span className="font-medium text-slate-800">{row.course_name}</span>,
    },
    { key: "class", title: "Lớp học", cellClassName: "px-4 py-3 text-slate-500", render: (row) => row.class_name },
    {
      key: "enrolled_at",
      title: "Ngày ghi danh",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => fmtDate(row.enrolled_at),
    },
    {
      key: "progress",
      title: "Tiến độ",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => `${row.completed_lessons}/${row.total_lessons} buổi`,
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name="enrollment_status" value={row.status} />,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={rows}
        rowKey={(row) => row.id}
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => query.refetch()}
        errorMessage="Không tải được lịch sử học tập"
        emptyText="Chưa có lịch sử ghi danh nào"
        minWidthClassName="min-w-180"
        onRowClick={(row) => setViewingId(row.id)}
      />
      <EnrollmentDetailModal enrollmentId={viewingId} onClose={() => setViewingId(null)} />
    </>
  );
};

export default StudentHistoryPanel;
