import { useMemo, useState } from "react";
import moment from "moment";
import { Button, PlusOutlined } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import WidgetState from "_common/components/WidgetState";
import { StudentLevelService } from "@tera/modules/education";

import UpdateLevelModal from "./UpdateLevelModal";

interface HistoryEntry {
  id: number;
  from_level_name: string | null;
  to_level_name: string | null;
  reason: string | null;
  score: number | null;
  effective_at: string;
}

const toHistories = (raw: any[] | null | undefined): HistoryEntry[] =>
  (raw ?? []).map((h) => ({
    id: h.id ?? 0,
    from_level_name: h.from_level?.level_name ?? null,
    to_level_name: h.to_level?.level_name ?? null,
    reason: h.reason ?? null,
    score: h.score ?? null,
    effective_at: h.effective_at ?? h.created_at ?? "",
  }));

const fmtDate = (value: string) => (value ? moment(value).format("DD/MM/YYYY") : "—");

const StudentLevelHistoryTab = ({ studentId }: { studentId: number | null }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const detailQuery = StudentLevelService.useStudentLevelDetail(
    { id: studentId ?? "" },
    { enabled: !!studentId },
  );
  const studentLevel = detailQuery.data?.data?.student_level;
  const histories = useMemo(() => toHistories(detailQuery.data?.data?.histories), [detailQuery.data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
        <div>
          <p className="text-xs text-slate-400">Trình độ hiện tại</p>
          <p className="text-base font-semibold text-slate-800">
            {studentLevel?.level?.level_name ?? "Chưa xếp trình độ"}
          </p>
        </div>
        <Button
          outlined
          icon={<PlusOutlined />}
          disabled={!studentLevel?.id}
          onClick={() => setModalOpen(true)}
        >
          Cập nhật
        </Button>
      </div>

      <WidgetState isLoading={detailQuery.isLoading} isError={detailQuery.isError} onRetry={() => detailQuery.refetch()}>
        {histories.length === 0 ? (
          <EmptyState description="Chưa có lịch sử thay đổi trình độ" className="py-8" />
        ) : (
          <ol className="flex flex-col gap-3">
            {histories.map((h) => (
              <li key={h.id} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                <div className="min-w-0 flex-1 border-b border-slate-50 pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <p className="text-sm font-medium text-slate-700">
                      {h.from_level_name ? `${h.from_level_name} → ` : "Xếp trình độ ban đầu: "}
                      {h.to_level_name ?? "—"}
                    </p>
                    <span className="shrink-0 text-xs text-slate-400">{fmtDate(h.effective_at)}</span>
                  </div>
                  {(h.reason || h.score != null) && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {h.reason}
                      {h.score != null ? ` (${h.score}/10)` : ""}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </WidgetState>

      <UpdateLevelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        studentLevelId={studentLevel?.id ?? null}
        currentLevelId={studentLevel?.level_id ?? null}
      />
    </div>
  );
};

export default StudentLevelHistoryTab;
