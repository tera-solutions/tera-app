import { Pagination } from "tera-dls";

import { PAGE_SIZE_OPTIONS } from "_common/constants/pagination";

interface TablePaginationProps {
  total: number;
  page: number;
  perPage: number;
  /** Noun shown in "Hiển thị X - Y trong tổng số Z {unit}", e.g. "học viên". */
  unit: string;
  onChange: (page: number, perPage: number) => void;
}

/** Shared "Hiển thị X - Y trong tổng số Z" + pager footer for list/table panels. */
const TablePagination = ({ total, page, perPage, unit, onChange }: TablePaginationProps) => {
  if (total === 0) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="mt-3 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
      <span>
        Hiển thị {from} - {to} trong tổng số {total} {unit}
      </span>
      <Pagination
        total={total}
        current={page}
        pageSize={perPage}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onChange={(p, size) => onChange(p ?? 1, size ?? perPage)}
      />
    </div>
  );
};

export default TablePagination;
