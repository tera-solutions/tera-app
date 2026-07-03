import classNames from "classnames";
import { CheckOutlined } from "tera-dls";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({
  currentStep,
  steps,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <ol className="mb-6 flex items-center gap-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCompleted = completedSteps.includes(step);
        const isActive = step === currentStep;
        const isClickable = !!onStepClick && (isCompleted || isActive);
        const isLast = index === steps.length - 1;

        return (
          <li
            key={label}
            className="relative flex flex-1 justify-center items-start gap-2"
          >
            {!isLast && (
              <span
                className={classNames(
                  "absolute left-[calc(50%+24px)] right-[calc(-50%+18px)] top-4 h-px -translate-y-1/2 bg-slate-200",
                  isCompleted && "bg-brand/40",
                )}
              />
            )}

            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick?.(step)}
              className={classNames(
                "relative z-10 flex flex-col items-center gap-2 text-left",
                isClickable ? "cursor-pointer" : "cursor-default",
              )}
            >
              <span
                className={classNames(
                  "relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isActive && "bg-brand text-white",
                  isCompleted && !isActive && "bg-brand/15 text-brand",
                  !isActive && !isCompleted && "bg-slate-100 text-slate-400",
                )}
              >
                {isCompleted && !isActive ? (
                  <CheckOutlined className="h-4 w-4" />
                ) : (
                  step
                )}
              </span>

              <span
                className={classNames(
                  "hidden text-xs font-medium sm:block",
                  isActive ? "text-slate-800" : "text-slate-400",
                )}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default StepIndicator;
