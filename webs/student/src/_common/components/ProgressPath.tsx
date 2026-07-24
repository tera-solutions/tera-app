import { CheckOutlined, StarSolid } from "tera-dls";

interface IProps {
  done: number;
  total: number;
  className?: string;
  maxSteps?: number;
}

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
          <span key={i} className='flex flex-1 items-center gap-1'>
            <span
              className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
                passed
                  ? "bg-hana-blue text-white"
                  : current
                    ? "bg-hana-sun text-white ring-4 ring-hana-sun/25"
                    : "bg-hana-sky"
              }`}
            >
              {passed && <CheckOutlined className='h-3.5 w-3.5' />}
              {current && (
                <>
                  {/* Kim tuyến: mini sao vàng đứng NGOÀI viền ring (trên nền
                      trắng của card) để không bị viền mờ nuốt mất; giữ đỉnh
                      sáng lâu hơn (plateau trong keyframe) để mắt kịp thấy. */}
                  <StarSolid
                    className='hana-sparkle absolute -right-2 -top-2 h-2.5 w-2.5 text-hana-sun'
                    style={{ animationDelay: "0s" }}
                  />
                  <StarSolid
                    className='hana-sparkle absolute -bottom-2 -left-1.5 h-2 w-2 text-hana-sun'
                    style={{ animationDelay: "0.6s" }}
                  />
                  <StarSolid
                    className='hana-sparkle absolute -top-1.5 -left-2.5 h-2 w-2 text-hana-sun'
                    style={{ animationDelay: "1.1s" }}
                  />
                  <StarSolid className='hana-star-pulse h-5 w-5' />
                </>
              )}
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
