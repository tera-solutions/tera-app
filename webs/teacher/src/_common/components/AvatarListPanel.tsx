import { Key } from "react";
import classNames from "classnames";
import { Spin } from "tera-dls";

import EmptyState from "./EmptyState";
import ErrorRetry from "./ErrorRetry";

interface AvatarListPanelProps<T> {
  items: T[];
  rowKey: (item: T) => Key;
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  errorMessage?: string;
  emptyText?: string;
  onRowClick?: (item: T) => void;
  renderRow: (item: T) => React.ReactNode;
}

/** Shared shell for the "avatar row" list pattern (avatar + title/subtitle +
 * status + dropdown actions) used by Teacher/LessonPlan/Lesson lists — a
 * distinct, deliberately different layout from the tabular `Table` component,
 * but the loading/error/empty/wrapper boilerplate around it was triplicated. */
const AvatarListPanel = <T,>({
  items,
  rowKey,
  loading,
  fetching,
  isError,
  onRetry,
  errorMessage = "Không tải được danh sách",
  emptyText = "Không có dữ liệu",
  onRowClick,
  renderRow,
}: AvatarListPanelProps<T>) => {
  if (isError)
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <ErrorRetry onRetry={onRetry} message={errorMessage} iconClassName="h-7 w-7" />
      </div>
    );

  if (loading && items.length === 0)
    return (
      <Spin spinning>
        <div className="h-[40vh]" />
      </Spin>
    );

  if (!loading && items.length === 0)
    return <EmptyState classNameImage="w-32 mx-auto" description={emptyText} />;

  return (
    <Spin spinning={loading || fetching}>
      <div className="flex flex-col divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={rowKey(item)}
            role={onRowClick ? "button" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            onKeyDown={onRowClick ? (e) => e.key === "Enter" && onRowClick(item) : undefined}
            className={classNames(
              "flex items-center gap-3 py-3",
              onRowClick && "cursor-pointer hover:bg-slate-50",
            )}
          >
            {renderRow(item)}
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default AvatarListPanel;
