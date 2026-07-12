import classNames from "classnames";

import Badge from "_common/components/Badge";

import { WITHDRAW_STATUS_CONFIG } from "../constants";

interface WithdrawStatusProps {
  status: string;
  className?: string;
}

/** Badge trạng thái yêu cầu rút tiền. Giá trị lạ → badge xám + text thô, để lộ ra chứ không nuốt. */
const WithdrawStatus = ({ status, className }: WithdrawStatusProps) => {
  const cfg = WITHDRAW_STATUS_CONFIG[status];
  return (
    <Badge
      className={classNames(
        "whitespace-nowrap px-2.5 py-0.5 text-[11px]",
        cfg?.className ?? "bg-slate-100 text-slate-500",
        className,
      )}
    >
      {cfg?.label ?? status ?? "—"}
    </Badge>
  );
};

export default WithdrawStatus;
