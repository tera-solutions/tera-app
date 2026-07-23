import { useMemo } from "react";
import { Button, Modal, notification } from "tera-dls";

import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import WidgetState from "_common/components/WidgetState";
import { PayrollService } from "@tera/modules/hr";

import type { Teacher } from "../_interface";
import { formatVnd } from "../_utils";

interface PayrollPeriodRow {
  id: number;
  month: number;
  year: number;
  totalSalary: number;
  status: string;
}

const toRows = (raw: any): PayrollPeriodRow[] =>
  (raw?.data?.items ?? []).map((p: any) => ({
    id: p.id,
    month: p.month,
    year: p.year,
    totalSalary: Number(p.total_salary ?? 0) || 0,
    status: p.status ?? "draft",
  }));

interface PayTeacherPayrollModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

/** Admin-only: browse a teacher's payroll periods and disburse ("Trả lương")
 * one — credits their wallet via `POST /hr/payroll/pay/{id}`. Backend blocks
 * a non-admin from paying their own payroll, so this surface only does
 * anything useful for an admin account. */
const PayTeacherPayrollModal = ({ teacher, onClose }: PayTeacherPayrollModalProps) => {
  const listQuery = PayrollService.usePayrollList(
    { params: { per_page: 12, filters: { teacher_id: teacher?.id } } },
    { enabled: !!teacher },
  );
  const rows = useMemo(() => toRows(listQuery.data), [listQuery.data]);

  const { mutate: pay, isPending } = PayrollService.usePayrollPay();

  const handlePay = (row: PayrollPeriodRow) => {
    pay(row.id, {
      onSuccess: () => notification.success({ message: "Đã trả lương" }),
      onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể trả lương" }),
    });
  };

  return (
    <Modal
      title={teacher ? `Bảng lương — ${teacher.fullName}` : "Bảng lương"}
      open={!!teacher}
      onCancel={onClose}
      className="!w-[95%] xmd:!w-[520px]"
      footer={null}
    >
      <WidgetState isLoading={listQuery.isLoading} isError={listQuery.isError} onRetry={() => listQuery.refetch()}>
        {rows.length === 0 ? (
          <EmptyState description="Chưa có kỳ lương nào" className="py-8" />
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {String(row.month).padStart(2, "0")}/{row.year}
                  </p>
                  <p className="text-xs text-slate-400">{formatVnd(row.totalSalary)}</p>
                </div>
                {row.status === "paid" ? (
                  <Badge className="bg-emerald-50 px-2.5 py-1 text-xs text-emerald-600">Đã trả</Badge>
                ) : (
                  <Button
                    loading={isPending}
                    onClick={() => handlePay(row)}
                    className="whitespace-nowrap bg-brand hover:bg-brand/80"
                  >
                    Trả lương
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </WidgetState>
    </Modal>
  );
};

export default PayTeacherPayrollModal;
