import { useMemo } from "react";

import EmptyState from "_common/components/EmptyState";
import { BusinessBankAccountService } from "@tera/modules/finance";

interface InvoicePaymentQRProps {
  amount: number;
  /** Shown in the transfer note (addInfo) so the payment can be matched to this invoice. */
  invoiceCode: string;
}

/**
 * VietQR "quick link" — a public, key-less image URL VietQR renders on the
 * fly (https://www.vietqr.io/danh-sach-api/link-tao-ma-vietqr), no backend
 * call needed. Uses the business's default receiving account.
 */
const InvoicePaymentQR = ({ amount, invoiceCode }: InvoicePaymentQRProps) => {
  const accountsQuery = BusinessBankAccountService.useBusinessBankAccountList({
    params: { per_page: 50, filters: { status: "active" } },
  });
  const accounts = accountsQuery.data?.data?.items ?? [];
  const account = accounts.find((a: any) => a.is_default) ?? accounts[0];

  const qrUrl = useMemo(() => {
    if (!account) return null;
    const addInfo = encodeURIComponent(`Thanh toan HD ${invoiceCode}`);
    const accountName = encodeURIComponent(account.account_holder ?? "");
    return `https://img.vietqr.io/image/${account.bank_code}-${account.account_number}-compact2.png?amount=${Math.round(
      amount,
    )}&addInfo=${addInfo}&accountName=${accountName}`;
  }, [account, amount, invoiceCode]);

  if (accountsQuery.isLoading) return null;

  if (!account) {
    return (
      <EmptyState
        description="Chưa cấu hình tài khoản ngân hàng nhận học phí (Cài đặt → Tài khoản nhận học phí)"
        className="py-4"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-3">
      <p className="text-sm font-semibold text-slate-700">Quét mã để chuyển khoản</p>
      {qrUrl && <img src={qrUrl} alt="VietQR" className="h-56 w-56 rounded-lg object-contain" />}
      <div className="text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">
          {account.bank_name} — {account.account_number}
        </p>
        <p>{account.account_holder}</p>
      </div>
    </div>
  );
};

export default InvoicePaymentQR;
