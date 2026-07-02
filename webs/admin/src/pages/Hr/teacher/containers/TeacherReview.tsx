/* Import: library */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { EvaluationService } from "@tera/modules";

/** Xếp loại → màu badge (API trả sẵn classification_label). */
const CLASSIFICATION_COLOR: Record<string, { color: string; bg: string }> = {
  excellent: { color: "#16a34a", bg: "#dcfce7" },
  good: { color: "#0891b2", bg: "#cffafe" },
  average: { color: "#d97706", bg: "#fef3c7" },
  weak: { color: "#ea580c", bg: "#ffedd5" },
  warning: { color: "#dc2626", bg: "#fee2e2" },
};

/** Trạng thái đánh giá → màu badge (API trả sẵn status_label). */
const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  draft: { color: "#6b7280", bg: "#f3f4f6" },
  submitted: { color: "#2563eb", bg: "#dbeafe" },
  approved: { color: "#16a34a", bg: "#dcfce7" },
  rejected: { color: "#dc2626", bg: "#fee2e2" },
  locked: { color: "#475569", bg: "#e2e8f0" },
};

const fmtDateTime = (v?: string) => (v ? new Date(v).toLocaleString("vi-VN") : "");

const Badge = ({
  text,
  cfg,
}: {
  text?: string;
  cfg?: { color: string; bg: string };
}) =>
  text ? (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0"
      style={{
        color: cfg?.color ?? "#6b7280",
        backgroundColor: cfg?.bg ?? "#f3f4f6",
      }}
    >
      {text}
    </span>
  ) : null;

const NoteBlock = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <p className="text-[12px] text-gray-600">
      <span className="text-gray-400">{label}: </span>
      <span className="whitespace-pre-wrap">{value}</span>
    </p>
  ) : null;

/**
 * Tab Đánh giá trong chi tiết giáo viên — đánh giá GV = evaluation_type "teacher"
 * + target_id = giáo viên (NGƯỜI ĐƯỢC đánh giá). Lọc lại client-side cho chắc.
 */
const TeacherReview = ({ teacherId }: { teacherId?: number }) => {
  const { t } = useTranslation();

  const { data, isLoading } = EvaluationService.useEvaluationList({
    params: {
      per_page: 100,
      evaluation_type: "teacher",
      target_id: teacherId,
    },
  });

  const items: any[] = useMemo(() => {
    const list = (data as any)?.data?.items ?? [];
    return list.filter(
      (ev: any) =>
        (ev.evaluation_type == null || ev.evaluation_type === "teacher") &&
        (ev.target_id == null || Number(ev.target_id) === Number(teacherId)),
    );
  }, [data, teacherId]);

  if (isLoading) {
    return (
      <p className="text-[13px] text-gray-400 italic py-2">
        {t("common.loading")}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-[13px] text-gray-400 italic py-2">
        {t("lesson.no_evaluation")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((it, idx) => (
        <div
          key={it.id ?? idx}
          className="flex flex-col gap-1.5 p-3 border border-gray-100 rounded"
        >
          {/* Hàng đầu: mã + loại đánh giá + trạng thái */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[12px] text-gray-400 shrink-0">
                {it.evaluation_code}
              </span>
              <Badge
                text={it.evaluation_type_label}
                cfg={{ color: "#4338ca", bg: "#e0e7ff" }}
              />
            </div>
            <Badge text={it.status_label} cfg={STATUS_COLOR[it.status]} />
          </div>

          {/* Điểm + xếp loại */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500">
              {t("lesson.eval_score")}:
            </span>
            <span className="text-[14px] font-semibold text-gray-800">
              {it.score ?? "—"}
            </span>
            <Badge
              text={it.classification_label}
              cfg={CLASSIFICATION_COLOR[it.classification]}
            />
          </div>

          {/* Meta: người đánh giá · kỳ · khóa học · lớp · ngày đánh giá */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[12px] text-gray-500">
            {it.evaluator_type_label && (
              <span>
                {t("lesson.eval_evaluator")}: {it.evaluator_type_label}
              </span>
            )}
            {it.evaluation_period_label && (
              <span>
                {t("lesson.eval_period")}: {it.evaluation_period_label}
              </span>
            )}
            {it.course?.name && (
              <span>
                {t("lesson.eval_course")}: {it.course.name}
              </span>
            )}
            {it.class_room?.name && (
              <span>
                {t("lesson.class")}: {it.class_room.name}
              </span>
            )}
            {it.evaluated_at && (
              <span>
                {t("lesson.eval_date")}: {fmtDateTime(it.evaluated_at)}
              </span>
            )}
          </div>

          {/* Tiêu chí */}
          {Array.isArray(it.criteria) && it.criteria.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {it.criteria.map((c: any, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-[11px] text-gray-600"
                >
                  {c.criterion}
                  <span className="font-semibold text-gray-800">{c.score}</span>
                </span>
              ))}
            </div>
          )}

          {/* Nhận xét + điểm mạnh/yếu/đề xuất */}
          {it.comment ? (
            <p className="text-[12px] text-gray-600 whitespace-pre-wrap">
              {t("lesson.eval_comment")}: {it.comment}
            </p>
          ) : null}
          <NoteBlock label={t("lesson.eval_strengths")} value={it.strengths} />
          <NoteBlock label={t("lesson.eval_weaknesses")} value={it.weaknesses} />
          <NoteBlock
            label={t("lesson.eval_recommendations")}
            value={it.recommendations}
          />
        </div>
      ))}
    </div>
  );
};

export default TeacherReview;
