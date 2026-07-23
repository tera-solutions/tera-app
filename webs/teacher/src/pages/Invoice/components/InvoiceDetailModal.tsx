import { useState } from "react";
import moment from "moment";
import { ArrowDownTrayOutlined, Modal, notification } from "tera-dls";

import Badge from "_common/components/Badge";
import WidgetState from "_common/components/WidgetState";
import { InvoiceService } from "@tera/modules/finance";

import { INVOICE_STATUS_BADGE, INVOICE_STATUS_LABELS } from "../constants";
import { formatCurrency, toInvoiceDetail } from "../_utils";
import InvoiceReasonModal from "./InvoiceReasonModal";
import RecordPaymentModal, { RecordPaymentFormValues } from "./RecordPaymentModal";
import InvoicePaymentQR from "./InvoicePaymentQR";

const TERMINAL_STATUSES = ["paid", "cancelled", "refunded", "closed"];
const APPROVABLE_STATUSES = ["draft", "pending", "pending_payment"];
// Khớp `InvoiceService::guardPayable` (BE): payable phải approved/pending_payment/partial;
// receivable là pending/partial.
const PAYABLE_PAY_STATUSES = ["approved", "pending_payment", "partial"];
const RECEIVABLE_PAY_STATUSES = ["pending", "partial"];

interface InvoiceDetailModalProps {
  invoiceId: number | null;
  onClose: () => void;
}

/** Xem chi tiết hóa đơn + toàn bộ vòng đời: duyệt/từ chối (chỉ hóa đơn chi), hủy,
 * hoàn tiền (chỉ hóa đơn đã thanh toán), ghi nhận thanh toán — khớp guard của
 * `InvoiceService` (BE) để nút chỉ hiện khi hành động thực sự hợp lệ. */
const InvoiceDetailModal = ({ invoiceId, onClose }: InvoiceDetailModalProps) => {
  const [action, setAction] = useState<"deny" | "cancel" | "refund" | "pay" | null>(null);

  const detailQuery = InvoiceService.useInvoiceDetail(
    { id: invoiceId ?? "" },
    { enabled: !!invoiceId },
  );
  const invoice = toInvoiceDetail(detailQuery.data);

  const { mutate: approveInvoice, isPending: isApproving } = InvoiceService.useInvoiceApprove();
  const { mutate: denyInvoice, isPending: isDenying } = InvoiceService.useInvoiceDeny();
  const { mutate: cancelInvoice, isPending: isCancelling } = InvoiceService.useInvoiceCancel();
  const { mutate: refundInvoice, isPending: isRefunding } = InvoiceService.useInvoiceRefund();
  const { mutate: payInvoice, isPending: isPaying } = InvoiceService.useInvoicePay();
  const { mutate: downloadInvoice, isPending: isDownloading } = InvoiceService.useInvoiceDownload();

  const onErr = (error: any, fallback: string) =>
    notification.error({ message: error?.data?.msg ?? fallback });

  const handleDownload = () => {
    if (!invoice) return;
    downloadInvoice(
      { id: invoice.id, code: invoice.code },
      { onError: (e: any) => onErr(e, "Không thể tải hóa đơn") },
    );
  };

  const handleApprove = () => {
    if (!invoice) return;
    approveInvoice(
      { id: invoice.id },
      {
        onSuccess: () => notification.success({ message: "Duyệt hóa đơn thành công" }),
        onError: (e: any) => onErr(e, "Không thể duyệt hóa đơn"),
      },
    );
  };

  const handleReasonSubmit = (values: { reason: string; note?: string }) => {
    if (!invoice) return;
    const onSuccess = () => {
      notification.success({ message: "Thao tác thành công" });
      setAction(null);
    };
    if (action === "deny") {
      denyInvoice({ id: invoice.id, params: values }, { onSuccess, onError: (e: any) => onErr(e, "Không thể từ chối hóa đơn") });
    } else if (action === "cancel") {
      cancelInvoice({ id: invoice.id, params: values }, { onSuccess, onError: (e: any) => onErr(e, "Không thể hủy hóa đơn") });
    } else if (action === "refund") {
      refundInvoice({ id: invoice.id, params: values }, { onSuccess, onError: (e: any) => onErr(e, "Không thể hoàn tiền hóa đơn") });
    }
  };

  const handlePaySubmit = (values: RecordPaymentFormValues) => {
    if (!invoice) return;
    payInvoice(
      { id: invoice.id, params: values },
      {
        onSuccess: () => {
          notification.success({ message: "Ghi nhận thanh toán thành công" });
          setAction(null);
        },
        onError: (e: any) => onErr(e, "Không thể ghi nhận thanh toán"),
      },
    );
  };

  const canApproveOrDeny = invoice?.invoiceType === "payable" && APPROVABLE_STATUSES.includes(invoice.status);
  const canCancel = !!invoice && !TERMINAL_STATUSES.includes(invoice.status);
  const canRefund = invoice?.status === "paid";
  const canPay =
    !!invoice &&
    invoice.balanceAmount > 0 &&
    (invoice.invoiceType === "payable"
      ? PAYABLE_PAY_STATUSES.includes(invoice.status)
      : RECEIVABLE_PAY_STATUSES.includes(invoice.status));

  return (
    <>
      <Modal
        title={invoice ? `Hóa đơn ${invoice.code}` : "Chi tiết hóa đơn"}
        open={!!invoiceId}
        onCancel={onClose}
        className="!w-[95%] xmd:!w-[640px]"
        footer={null}
      >
        <WidgetState isLoading={detailQuery.isLoading} isError={detailQuery.isError}>
          {invoice && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className={`px-2.5 py-1 text-xs ${INVOICE_STATUS_BADGE[invoice.status]}`}>
                  {INVOICE_STATUS_LABELS[invoice.status]}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {invoice.invoiceType === "receivable" ? "Khoản phải thu" : "Khoản phải chi"}
                  </span>
                  <button
                    type="button"
                    title="Tải xuống PDF"
                    disabled={isDownloading}
                    onClick={handleDownload}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <ArrowDownTrayOutlined />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Học viên</p>
                  <p className="font-medium text-slate-800">{invoice.studentName ?? "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400">Ngày lập</p>
                  <p className="font-medium text-slate-800">
                    {invoice.invoiceDate ? moment(invoice.invoiceDate).format("DD/MM/YYYY") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Hạn thanh toán</p>
                  <p className="font-medium text-slate-800">
                    {invoice.dueDate ? moment(invoice.dueDate).format("DD/MM/YYYY") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Ngày thanh toán</p>
                  <p className="font-medium text-slate-800">
                    {invoice.paidAt ? moment(invoice.paidAt).format("DD/MM/YYYY HH:mm") : "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">Khoản mục</p>
                <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100 text-sm">
                  {invoice.items.length === 0 && (
                    <p className="p-3 text-slate-400">Không có khoản mục</p>
                  )}
                  {invoice.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-2.5">
                      <span className="text-slate-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-slate-800">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100 text-sm">
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500">Tạm tính</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500">Giảm giá</span>
                  <span>-{formatCurrency(invoice.discount)}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500">Thuế</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between p-2.5 font-semibold text-slate-800">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between p-2.5 text-emerald-600">
                  <span>Đã thanh toán</span>
                  <span>{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between p-2.5 font-semibold text-amber-600">
                  <span>Còn lại</span>
                  <span>{formatCurrency(invoice.balanceAmount)}</span>
                </div>
              </div>

              {canPay && invoice.invoiceType === "receivable" && (
                <InvoicePaymentQR amount={invoice.balanceAmount} invoiceCode={invoice.code} />
              )}

              {invoice.payments.length > 0 && (
                <div>
                  <p className="mb-1.5 text-sm font-semibold text-slate-700">Lịch sử thanh toán</p>
                  <div className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-100 text-sm">
                    {invoice.payments.map((p) => (
                      <div key={p.id} className="flex justify-between p-2.5">
                        <span className="text-slate-600">
                          {p.paidAt ? moment(p.paidAt).format("DD/MM/YYYY HH:mm") : "—"} · {p.method ?? "—"}
                        </span>
                        <span className="font-medium text-slate-800">{formatCurrency(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {invoice.note && (
                <div>
                  <p className="text-slate-400">Ghi chú</p>
                  <p className="text-slate-700">{invoice.note}</p>
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                {canApproveOrDeny && (
                  <>
                    <button
                      type="button"
                      onClick={() => setAction("deny")}
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                      Từ chối
                    </button>
                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={handleApprove}
                      className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand/80"
                    >
                      Duyệt
                    </button>
                  </>
                )}
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => setAction("cancel")}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Hủy hóa đơn
                  </button>
                )}
                {canRefund && (
                  <button
                    type="button"
                    onClick={() => setAction("refund")}
                    className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50"
                  >
                    Hoàn tiền
                  </button>
                )}
                {canPay && (
                  <button
                    type="button"
                    onClick={() => setAction("pay")}
                    className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand/80"
                  >
                    Ghi nhận thanh toán
                  </button>
                )}
              </div>
            </div>
          )}
        </WidgetState>
      </Modal>

      <InvoiceReasonModal
        open={action === "deny"}
        title="Từ chối hóa đơn"
        okText="Từ chối"
        isPending={isDenying}
        onSubmit={handleReasonSubmit}
        onClose={() => setAction(null)}
      />
      <InvoiceReasonModal
        open={action === "cancel"}
        title="Hủy hóa đơn"
        okText="Hủy hóa đơn"
        isPending={isCancelling}
        onSubmit={handleReasonSubmit}
        onClose={() => setAction(null)}
      />
      <InvoiceReasonModal
        open={action === "refund"}
        title="Hoàn tiền hóa đơn"
        okText="Hoàn tiền"
        isPending={isRefunding}
        onSubmit={handleReasonSubmit}
        onClose={() => setAction(null)}
      />
      <RecordPaymentModal
        open={action === "pay"}
        maxAmount={invoice?.balanceAmount ?? 0}
        isPending={isPaying}
        onSubmit={handlePaySubmit}
        onClose={() => setAction(null)}
      />
    </>
  );
};

export default InvoiceDetailModal;
