/* Import: library */
import { useTranslation } from "react-i18next";
import { Modal } from "tera-dls";

/* Import: packages */
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { EvaluationService } from "@tera/modules";

/* Import: pages */
import RatingStars from "./RatingStars";
import {
  CLASSIFICATION_COLOR,
  IEvaluation,
  STATUS_COLOR,
} from "../_interface";

const fmtDateTime = (v?: string) =>
  v ? new Date(v).toLocaleString("vi-VN") : "—";

const Badge = ({
  text,
  cfg,
}: {
  text?: string;
  cfg?: { color: string; backgroundColor: string };
}) =>
  text ? (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium shrink-0"
      style={{
        color: cfg?.color ?? "#6b7280",
        backgroundColor: cfg?.backgroundColor ?? "#f3f4f6",
      }}
    >
      {text}
    </span>
  ) : (
    <span className="text-gray-300">—</span>
  );

const Row = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
    <span className="w-[130px] shrink-0 text-[13px] text-gray-400">
      {label}
    </span>
    <span className="text-[13px] text-gray-800 break-words">
      {value ?? "—"}
    </span>
  </div>
);

const Note = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <div className="text-[13px]">
      <span className="text-gray-400">{label}: </span>
      <span className="text-gray-700 whitespace-pre-wrap">{value}</span>
    </div>
  ) : null;

interface IProps {
  open: boolean;
  id?: number;
  record?: IEvaluation;
  onClose: () => void;
}

/** Modal chi tiết đánh giá (gọi API detail, fallback dữ liệu dòng list). */
const EvaluationDetail = ({ open, id, record, onClose }: IProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { data } = EvaluationService.useEvaluationDetail(
    { id: id as number },
    { enabled: !!id && open },
  );

  // Detail trả evaluation trực tiếp ở data.data (đã verify)
  const ev: IEvaluation = data?.data ?? record ?? ({} as IEvaluation);

  return (
    <Modal
      title={t("evaluation.detail")}
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText={t("button.close")}
      cancelButtonProps={{ className: "hidden" }}
      width={isMobile ? "94%" : 640}
      className="max-w-[640px]!"
    >
      <div className="flex flex-col gap-3">
        {/* Header: mã + loại + trạng thái */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-gray-800">
              {ev.evaluation_code}
            </span>
            <Badge
              text={ev.evaluation_type_label}
              cfg={{ color: "#4338ca", backgroundColor: "#e0e7ff" }}
            />
          </div>
          <Badge text={ev.status_label} cfg={STATUS_COLOR[ev.status]} />
        </div>

        {/* Điểm + xếp loại */}
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <RatingStars score={ev.score} size={18} />
          <Badge
            text={ev.classification_label}
            cfg={CLASSIFICATION_COLOR[ev.classification ?? ""]}
          />
        </div>

        {/* Thông tin chung */}
        <div>
          <Row
            label={t("evaluation.evaluator")}
            value={ev.evaluator_type_label}
          />
          <Row label={t("evaluation.period")} value={ev.evaluation_period_label} />
          <Row label={t("evaluation.course")} value={ev.course?.name} />
          <Row label={t("evaluation.class")} value={ev.class_room?.name} />
          <Row
            label={t("evaluation.lesson")}
            value={ev.lesson?.lesson_title}
          />
          <Row
            label={t("evaluation.evaluated_at")}
            value={fmtDateTime(ev.evaluated_at)}
          />
        </div>

        {/* Tiêu chí */}
        {Array.isArray(ev.criteria) && ev.criteria.length > 0 && (
          <div>
            <div className="mb-1 text-[13px] font-medium text-gray-700">
              {t("evaluation.criteria")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ev.criteria.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-[12px] text-gray-600"
                >
                  {t(`evaluation.crit_${c.criterion}`, c.criterion)}:
                  <span className="font-semibold text-gray-800">{c.score}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Nhận xét */}
        <div className="flex flex-col gap-1">
          <Note label={t("evaluation.comment")} value={ev.comment} />
          <Note label={t("evaluation.strengths")} value={ev.strengths} />
          <Note label={t("evaluation.weaknesses")} value={ev.weaknesses} />
          <Note
            label={t("evaluation.recommendations")}
            value={ev.recommendations}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EvaluationDetail;
