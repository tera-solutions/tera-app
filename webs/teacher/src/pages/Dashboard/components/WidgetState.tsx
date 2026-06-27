import { ReactNode } from "react";
import { ArrowPathOutlined, ExclamationTriangleOutlined, Spin } from "tera-dls";

interface WidgetStateProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
  children: ReactNode;
}

const WidgetState = ({
  isLoading,
  isError,
  isEmpty,
  emptyText = "Không có dữ liệu",
  onRetry,
  children,
}: WidgetStateProps) => {
  if (isLoading) {
    return (
      <div className="h-28 w-full">
        <Spin spinning>
          <div className="h-28" />
        </Spin>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-28 w-full flex-col items-center justify-center gap-2 text-center">
        <ExclamationTriangleOutlined className="h-6 w-6 text-red-400" />
        <p className="text-xs text-slate-400">Không tải được dữ liệu</p>
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
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex h-28 w-full items-center justify-center">
        <p className="text-xs text-slate-400">{emptyText}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default WidgetState;
