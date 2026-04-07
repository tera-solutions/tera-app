import classNames from "classnames";
import { Pagination, PaginationProps } from "tera-dls";

interface PaginationCustomProps extends PaginationProps {
  from: number;
  to: number;
  className?: string;
}

function PaginationCustom({
  from,
  to,
  className,
  ...props
}: PaginationCustomProps) {
  const classNamePagination = classNames(
    "flex justify-between sm:items-center p-2.5 sm:flex-row flex-col gap-y-[5px] border-t border-gray-200",
    className,
  );
  return (
    <div className={classNamePagination}>
      <p className="text-sm	font-normal text-gray-500">
        Hiển thị {from}-{to} của {props?.total}
      </p>
      <Pagination {...props} />
    </div>
  );
}

export default PaginationCustom;
