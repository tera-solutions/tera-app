import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import {
  AcademicCapOutlined,
  BookOpenOutlined,
  Button,
  DocumentTextOutlined,
  MicrophoneOutlined,
  PencilSquareOutlined,
  PlusOutlined,
  SpeakerWaveOutlined,
  TrophyOutlined,
} from "tera-dls";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import ComingSoon from "_common/components/ComingSoon";
import EmptyState from "_common/components/EmptyState";
import StatusBadge from "_common/components/StatusBadge";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { getRank } from "pages/Students/constants";
import { StudentService } from "@tera/modules/education";

import type { StudentEvaluationRow } from "../_interface";
import { rankOf } from "../_utils";

type PanelTab = "overview" | "detail" | "comments" | "parent_feedback";

const PANEL_TABS: { key: PanelTab; label: string }[] = [
  { key: "overview", label: "Tổng quan" },
  { key: "detail", label: "Đánh giá chi tiết" },
  { key: "comments", label: "Nhận xét" },
  { key: "parent_feedback", label: "Phản hồi từ PH" },
];

const StatTile = ({
  icon,
  iconClassName,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  value: React.ReactNode;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 p-3 text-center">
    <span className={classNames("flex h-8 w-8 items-center justify-center rounded-lg [&_svg]:h-4.5 [&_svg]:w-4.5", iconClassName)}>
      {icon}
    </span>
    <p className="text-base font-bold text-slate-800">{value}</p>
    <p className="text-[11px] text-slate-400">{label}</p>
  </div>
);

const SKILL_META = [
  { key: "listening", label: "Nghe (Listening)", icon: <SpeakerWaveOutlined /> },
  { key: "speaking", label: "Nói (Speaking)", icon: <MicrophoneOutlined /> },
  { key: "reading", label: "Đọc (Reading)", icon: <BookOpenOutlined /> },
  { key: "writing", label: "Viết (Writing)", icon: <PencilSquareOutlined /> },
] as const;

interface StudentDetailPanelProps {
  student: StudentEvaluationRow | null;
  rows: StudentEvaluationRow[];
  evaluations: any[];
  onAddEvaluation: () => void;
}

const StudentDetailPanel = ({ student, rows, evaluations, onAddEvaluation }: StudentDetailPanelProps) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<PanelTab>("overview");

  useEffect(() => {
    setTab("overview");
  }, [student?.student_id]);

  const statsQuery = StudentService.useStudentStats(
    { id: student?.student_id ?? "" },
    { enabled: !!student },
  );
  const skills = statsQuery.data?.data?.skills;

  const rank = useMemo(
    () => (student ? rankOf(student.student_id, rows) : null),
    [student, rows],
  );
  const grade = getRank(student?.avg_score ?? null);

  const studentEvaluations = useMemo(
    () =>
      evaluations
        .filter((e) => e.target_id === student?.student_id)
        .sort((a, b) => (b.evaluated_at ?? "").localeCompare(a.evaluated_at ?? "")),
    [evaluations, student?.student_id],
  );

  if (!student) {
    return (
      <Card animated={false}>
        <EmptyState description="Chọn một học viên để xem chi tiết" className="py-10" />
      </Card>
    );
  }

  return (
    <Card animated={false}>
      <div className="mb-3 flex items-center gap-3">
        <Avatar src={student.avatar} alt={student.student_name} sizeClassName="h-12 w-12" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-base font-bold text-slate-800">{student.student_name}</p>
            <StatusBadge name="student_status" value={student.status} />
          </div>
          <p className="truncate text-xs text-slate-400">
            {student.student_code}
            {student.class_name ? ` - ${student.class_name}` : ""}
          </p>
        </div>
      </div>

      <div className="-mx-4 mb-3 flex gap-1 overflow-x-auto border-b border-slate-100 px-4 scrollbar-none">
        {PANEL_TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={classNames(
              "whitespace-nowrap border-b-2 px-2 py-2 text-xs font-medium transition-colors",
              tab === item.key
                ? "border-brand text-brand"
                : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "comments" ? (
        studentEvaluations.length === 0 ? (
          <EmptyState description="Chưa có nhận xét nào" className="py-6" />
        ) : (
          <div className="flex flex-col gap-3">
            {studentEvaluations.map((e) => (
              <div key={e.id} className="rounded-xl border border-slate-100 p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  {e.evaluation_period_label && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                      {e.evaluation_period_label}
                    </span>
                  )}
                  {e.classification_label && (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-brand">
                      {e.classification_label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700">{e.comment || "Không có nội dung nhận xét"}</p>
                {e.evaluated_at && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(e.evaluated_at).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : tab !== "overview" ? (
        <ComingSoon />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <StatTile
              icon={<DocumentTextOutlined />}
              iconClassName="bg-sky-50 text-brand"
              value={student.avg_score ?? "—"}
              label="Điểm trung bình"
            />
            <StatTile
              icon={<TrophyOutlined />}
              iconClassName="bg-amber-50 text-amber-500"
              value={rank ? `${rank.rank}/${rank.total}` : "—"}
              label="Xếp hạng"
            />
            <StatTile
              icon={<AcademicCapOutlined />}
              iconClassName="bg-violet-50 text-violet-500"
              value={student.classification_label ?? grade.label}
              label="Xếp loại"
            />
          </div>

          <p className="mb-2 text-sm font-semibold text-slate-700">Kỹ năng</p>
          <div className="mb-4 flex flex-col gap-3">
            {SKILL_META.map((skill) => {
              const percent = skills?.[skill.key] ?? 0;
              return (
                <div key={skill.key} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
                    {skill.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 truncate text-xs text-slate-500">{skill.label}</p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-medium text-slate-700">
                    {(percent / 10).toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="mb-1.5 text-sm font-semibold text-slate-700">Nhận xét mới nhất</p>
            <div className="rounded-xl bg-sky-50/60 p-3">
              <p className="text-sm text-slate-600">{student.latest_comment || "Chưa có nhận xét"}</p>
            </div>
          </div>
        </>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => navigate(`${PATHS.studentDetail}/${student.student_id}`)}
          className="text-xs font-medium text-brand hover:underline"
        >
          Xem tất cả
        </button>
      </div>

      <Button
        icon={<PlusOutlined />}
        className="mt-3 w-full bg-brand hover:bg-brand/80"
        onClick={onAddEvaluation}
      >
        Thêm nhận xét
      </Button>
    </Card>
  );
};

export default StudentDetailPanel;
