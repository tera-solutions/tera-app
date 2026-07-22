import { CheckOutlined } from "tera-dls";

interface IProps {
  done: number;
  total: number;
  className?: string;
  /** Số chặng tối đa vẽ ra; nhiều bài hơn thì gộp lại cho khỏi rối */
  maxSteps?: number;
}

/**
 * Tiến độ dạng CON ĐƯỜNG CÓ CHẶNG thay cho con số phần trăm: chặng đã qua tô
 * xanh có dấu tích, chặng đang đứng là ngôi sao to, chặng chưa tới để mờ.
 * Trẻ nhìn là biết "mình đang ở đâu, còn bao xa" mà không cần đọc số.
 */
const ProgressPath = ({
  done,
  total,
  className = "",
  maxSteps = 10,
}: IProps) => {
  const steps = Math.min(total, maxSteps);
  // Quy đổi khi bài nhiều hơn số chặng vẽ được
  const currentStep = total ? Math.round((done / total) * steps) : 0;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: steps }, (_, i) => {
        const passed = i < currentStep;
        const current = i === currentStep;

        return (
          <span key={i} className="flex flex-1 items-center gap-1">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
                passed
                  ? "bg-hana-blue text-white"
                  : current
                    ? "bg-hana-sun text-white ring-4 ring-hana-sun/25"
                    : "bg-hana-sky"
              }`}
            >
              {passed && <CheckOutlined className="h-3.5 w-3.5" />}
              {current && <span className="text-[11px] leading-none">★</span>}
            </span>
            {i < steps - 1 && (
              <span
                className={`h-1.5 flex-1 rounded-full ${
                  passed ? "bg-hana-blue" : "bg-hana-sky"
                }`}
              />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default ProgressPath;
