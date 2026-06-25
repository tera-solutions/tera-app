/* Import: library */
import { PaginationProps } from "tera-dls";

/* Import: packages */
import PaginationCustom from "@tera/components/web/PaginationCustom";

interface PaginationProps_ {
  total: number;
  current: number;
  pageSize: number;
  onChange: PaginationProps["onChange"];
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Phân trang dùng chung (bọc PaginationCustom của tera-dls — hiện "Hiển thị x-y của N"
 * + chuyển trang + đổi pageSize). Tự tính from/to từ current & pageSize.
 */
const Pagination = ({
  total,
  current,
  pageSize,
  onChange,
  pageSizeOptions = [20, 50, 100],
  className,
}: PaginationProps_) => {
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  return (
    <PaginationCustom
      from={from}
      to={to}
      total={total}
      current={current}
      pageSize={pageSize}
      onChange={onChange}
      pageSizeOptions={pageSizeOptions}
      className={className}
    />
  );
};

export default Pagination;
