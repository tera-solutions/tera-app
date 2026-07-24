import { useEffect, useMemo, useState } from "react";
import { Input, InputNumber, notification, Select } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import { WalletService } from "@tera/modules/wallet";

import type { Teacher } from "../_interface";
import { formatVnd } from "../_utils";

const ADJUSTMENT_TYPES = [
  { value: "increase", label: "Cộng thêm" },
  { value: "decrease", label: "Trừ bớt" },
];

interface AdjustWalletModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

/** Lets the center admin correct a teacher's wallet balance directly
 * (`POST /fin/wallet/adjustment`) — distinct from the deposit/withdraw
 * request-approval flow, for one-off corrections (e.g. reconciliation). */
const AdjustWalletModal = ({ teacher, onClose }: AdjustWalletModalProps) => {
  const [adjustmentType, setAdjustmentType] = useState("increase");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [reason, setReason] = useState("");

  const walletQuery = WalletService.useWalletList(
    { params: { per_page: 1, filters: { owner_type: "teacher", owner_id: teacher?.id } } },
    { enabled: !!teacher },
  );
  const wallet = walletQuery.data?.data?.items?.[0];

  useEffect(() => {
    if (!teacher) return;
    setAdjustmentType("increase");
    setAmount(undefined);
    setReason("");
  }, [teacher]);

  const { mutate: adjust, isPending } = WalletService.useWalletAdjustment();

  const handleSubmit = () => {
    if (!wallet) {
      notification.warning({ message: "Giáo viên chưa có ví" });
      return;
    }
    if (!amount || amount <= 0) {
      notification.warning({ message: "Vui lòng nhập số tiền lớn hơn 0" });
      return;
    }
    if (!reason.trim()) {
      notification.warning({ message: "Vui lòng nhập lý do điều chỉnh" });
      return;
    }

    adjust(
      {
        params: {
          wallet_id: wallet.id,
          adjustment_type: adjustmentType,
          amount,
          reason: reason.trim(),
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Đã điều chỉnh số dư ví" });
          onClose();
        },
        onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể điều chỉnh số dư" }),
      },
    );
  };

  const currentBalance = useMemo(() => Number(wallet?.balance ?? 0), [wallet]);

  return (
    <FormScaff
      open={!!teacher}
      onClose={onClose}
      isEdit
      titleCreate="Cập nhật số dư ví"
      titleEdit="Cập nhật số dư ví"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Điều chỉnh"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="space-y-3">
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="text-slate-500">{teacher?.fullName}</p>
          <p className="font-semibold text-slate-800">
            Số dư hiện tại: {walletQuery.isLoading ? "..." : wallet ? formatVnd(currentBalance) : "Chưa có ví"}
          </p>
        </div>
        <div>
          <FieldLabel required>Loại điều chỉnh</FieldLabel>
          <Select value={adjustmentType} options={ADJUSTMENT_TYPES} onChange={(v: any) => setAdjustmentType(v)} />
        </div>
        <div>
          <FieldLabel required>Số tiền</FieldLabel>
          <InputNumber min={1} className="w-full" value={amount} onChange={(v) => setAmount(v == null ? undefined : Number(v))} />
        </div>
        <div>
          <FieldLabel required>Lý do</FieldLabel>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="VD: Bù trừ sai lệch đối soát" />
        </div>
      </div>
    </FormScaff>
  );
};

export default AdjustWalletModal;
