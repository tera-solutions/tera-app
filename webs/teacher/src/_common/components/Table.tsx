import classNames from "classnames";
import { Spin } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";

export interface TableColumn<T> {
  key: string;
  title: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  errorMessage?: string;
  emptyText?: string;
  emptyClassName?: string;
  /** e.g. "min-w-140" — table stays this wide before the wrapper scrolls horizontally. */
  minWidthClassName?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  className?: string;
}

/** Shared list table: loading spinner / error+retry / empty state all render as a
 * single full-width row inside `tbody`, so callers only ever supply columns + data. */
const Table = <T,>({
  columns,
  data,
  rowKey,
  isLoading,
  isError,
  onRetry,
  errorMessage = "Không tải được dữ liệu",
  emptyText = "Không có dữ liệu phù hợp",
  emptyClassName,
  minWidthClassName = "min-w-full",
  onRowClick,
  rowClassName,
  className,
}: TableProps<T>) => {
  const body = () => {
    if (isLoading)
      return (
        <tr>
          <td colSpan={columns.length}>
            <Spin spinning>
              <div className="h-40" />
            </Spin>
          </td>
        </tr>
      );

    if (isError)
      return (
        <tr>
          <td colSpan={columns.length}>
            <div className="flex h-40 items-center justify-center">
              <ErrorRetry onRetry={onRetry} message={errorMessage} />
            </div>
          </td>
        </tr>
      );

    if (data.length === 0)
      return (
        <tr>
          <td colSpan={columns.length}>
            <EmptyState description={emptyText} className={emptyClassName} />
          </td>
        </tr>
      );

    return data.map((row, i) => (
      <tr
        key={rowKey(row)}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        className={classNames(
          "text-slate-700",
          onRowClick && "cursor-pointer hover:bg-sky-50/60",
          rowClassName?.(row),
        )}
      >
        {columns.map((col) => (
          <td key={col.key} className={col.cellClassName ?? "px-4 py-3"}>
            {col.render(row, i)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className={classNames("overflow-x-auto rounded-xl border border-slate-100", className)}>
      <table className={classNames("w-full text-left text-sm", minWidthClassName)}>
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
            {columns.map((col) => (
              <th key={col.key} className={col.headerClassName ?? "whitespace-nowrap px-4 py-3"}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{body()}</tbody>
      </table>
    </div>
  );
};

export default Table;
