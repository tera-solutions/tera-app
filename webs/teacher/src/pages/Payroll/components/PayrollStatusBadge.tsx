import classNames from "classnames";

import Badge from "_common/components/Badge";

import type { PayrollStatus } from "../_interface";
import { PAYROLL_STATUS_META } from "../_utils";

const PayrollStatusBadge = ({ status }: { status: PayrollStatus }) => {
  const meta = PAYROLL_STATUS_META[status];
  return (
    <Badge
      className={classNames(
        "whitespace-nowrap px-2.5 py-0.5 text-[11px]",
        meta?.className ?? "bg-slate-100 text-slate-500",
      )}
    >
      {meta?.label ?? status}
    </Badge>
  );
};

export default PayrollStatusBadge;
