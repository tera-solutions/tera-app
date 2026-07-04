import { ReactNode } from "react";
import { Spin } from "tera-dls";

import AnimatedHeight from "_common/components/AnimatedHeight";
import ErrorRetry from "_common/components/ErrorRetry";

interface WidgetStateProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
  children: ReactNode;
  animated?: boolean;
}

const WidgetState = ({
  isLoading,
  isError,
  isEmpty,
  emptyText = "Không có dữ liệu",
  onRetry,
  children,
  animated = true,
}: WidgetStateProps) => {
  const content = (() => {
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
        <div className="flex h-28 w-full items-center justify-center">
          <ErrorRetry onRetry={onRetry} messageClassName="text-xs text-slate-400" />
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

    return children;
  })();

  return animated ? <AnimatedHeight>{content}</AnimatedHeight> : <>{content}</>;
};

export default WidgetState;
