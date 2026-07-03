import classNames from "classnames";
import { ArrowPathOutlined, ExclamationTriangleOutlined } from "tera-dls";

interface ErrorRetryProps {
  onRetry?: () => void;
  message?: string;
  iconClassName?: string;
  messageClassName?: string;
  secondaryAction?: { label: string; onClick: () => void };
}

/** Shared "failed to load, retry" block for tables, widgets, and full-page states. */
const ErrorRetry = ({
  onRetry,
  message = "Không tải được dữ liệu",
  iconClassName = "h-6 w-6",
  messageClassName = "text-sm text-slate-400",
  secondaryAction,
}: ErrorRetryProps) => (
  <div className="flex flex-col items-center justify-center gap-2 text-center">
    <ExclamationTriangleOutlined className={classNames(iconClassName, "text-red-400")} />
    <p className={messageClassName}>{message}</p>
    {(onRetry || secondaryAction) && (
      <div className="mt-1 flex items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-brand hover:bg-sky-100 [&_svg]:h-3.5 [&_svg]:w-3.5"
          >
            <ArrowPathOutlined />
            Thử lại
          </button>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="rounded-full px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    )}
  </div>
);

export default ErrorRetry;
