import { useEffect, useState } from "react";
import { Button, CheckBadgeOutlined, Input, notification, PlusOutlined, Select, StarOutlined } from "tera-dls";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import FieldLabel from "_common/components/FieldLabel";
import Table, { TableColumn } from "_common/components/Table";
import useConfirm from "_common/hooks/useConfirm";
import FormScaff from "@tera/components/dof/FormScaff";
import { BusinessBankAccountService } from "@tera/modules/finance";

import { VIETQR_BANKS } from "../constants";

interface BankAccountRow {
  id: number;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  branch: string;
  is_default: boolean;
  status: string;
}

const toRows = (raw: any[] | null | undefined): BankAccountRow[] =>
  (raw ?? []).map((a) => ({
    id: a.id ?? 0,
    bank_name: a.bank_name ?? "",
    bank_code: a.bank_code ?? "",
    account_number: a.account_number ?? "",
    account_holder: a.account_holder ?? "",
    branch: a.branch ?? "",
    is_default: !!a.is_default,
    status: a.status ?? "",
  }));

const emptyForm = {
  bank_code: "",
  account_number: "",
  account_holder: "",
  branch: "",
  is_default: false,
};

const BankAccountForm = ({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account: BankAccountRow | null;
}) => {
  const isEdit = !!account;
  const [form, setForm] = useState(emptyForm);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const { mutate: create, isPending: creating } = BusinessBankAccountService.useBusinessBankAccountCreate();
  const { mutate: update, isPending: updating } = BusinessBankAccountService.useBusinessBankAccountUpdate();

  useEffect(() => {
    if (!open) return;
    setForm(
      account
        ? {
            bank_code: account.bank_code,
            account_number: account.account_number,
            account_holder: account.account_holder,
            branch: account.branch,
            is_default: account.is_default,
          }
        : emptyForm,
    );
  }, [open, account]);

  const handleSubmit = () => {
    const bank = VIETQR_BANKS.find((b) => b.value === form.bank_code);
    if (!bank) {
      notification.warning({ message: "Vui lòng chọn ngân hàng" });
      return;
    }
    if (!form.account_number.trim() || !form.account_holder.trim()) {
      notification.warning({ message: "Vui lòng nhập số tài khoản và tên chủ tài khoản" });
      return;
    }

    const params = {
      bank_name: bank.label,
      bank_code: form.bank_code,
      account_number: form.account_number.trim(),
      account_holder: form.account_holder.trim().toUpperCase(),
      branch: form.branch.trim() || undefined,
      is_default: form.is_default,
    };
    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật tài khoản" : "Đã thêm tài khoản" });
        onClose();
      },
      onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể lưu tài khoản" }),
    };

    if (isEdit && account) {
      update({ id: account.id, params }, done);
    } else {
      create({ params }, done);
    }
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Thêm tài khoản ngân hàng"
      titleEdit="Sửa tài khoản ngân hàng"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Lưu"
      onOk={handleSubmit}
      confirmLoading={creating || updating}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel required>Ngân hàng</FieldLabel>
          <Select
            value={form.bank_code || undefined}
            placeholder="Chọn ngân hàng"
            options={VIETQR_BANKS}
            onChange={(v: any) => set({ bank_code: v })}
          />
        </div>
        <div>
          <FieldLabel required>Số tài khoản</FieldLabel>
          <Input value={form.account_number} onChange={(e) => set({ account_number: e.target.value })} />
        </div>
        <div>
          <FieldLabel required>Tên chủ tài khoản (không dấu)</FieldLabel>
          <Input
            value={form.account_holder}
            onChange={(e) => set({ account_holder: e.target.value.toUpperCase() })}
            placeholder="CONG TY TNHH HANA ENGLISH"
          />
        </div>
        <div>
          <FieldLabel>Chi nhánh</FieldLabel>
          <Input value={form.branch} onChange={(e) => set({ branch: e.target.value })} />
        </div>
      </div>
    </FormScaff>
  );
};

/** Manages the business's receiving bank accounts — used to build the VietQR
 * payment code shown on an invoice. */
const BankAccountSettingsTab = () => {
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BankAccountRow | null>(null);

  const listQuery = BusinessBankAccountService.useBusinessBankAccountList({ params: { per_page: 50 } });
  const rows = toRows(listQuery.data?.data?.items);

  const { mutate: suspendAccount } = BusinessBankAccountService.useBusinessBankAccountSuspend();
  const { mutate: restoreAccount } = BusinessBankAccountService.useBusinessBankAccountRestore();
  const { mutate: setDefault } = BusinessBankAccountService.useBusinessBankAccountUpdate();

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const handleEdit = (row: BankAccountRow) => {
    setEditing(row);
    setFormOpen(true);
  };
  const handleSetDefault = (row: BankAccountRow) =>
    setDefault(
      { id: row.id, params: { is_default: true } },
      {
        onSuccess: () => notification.success({ message: "Đã đặt làm tài khoản mặc định" }),
        onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể đặt mặc định" }),
      },
    );
  const handleToggleStatus = (row: BankAccountRow) => {
    const isActive = row.status === "active";
    confirm.warning({
      title: isActive ? "Ngừng sử dụng tài khoản" : "Khôi phục tài khoản",
      content: `${isActive ? "Ngừng" : "Khôi phục"} tài khoản "${row.bank_name} - ${row.account_number}"?`,
      onOk: () => {
        const mutate = isActive ? suspendAccount : restoreAccount;
        mutate(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã cập nhật trạng thái" }),
            onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể cập nhật" }),
          },
        );
      },
    });
  };

  const columns: TableColumn<BankAccountRow>[] = [
    {
      key: "bank",
      title: "Ngân hàng",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {r.is_default && <StarOutlined className="h-4 w-4 shrink-0 text-amber-500" />}
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{r.bank_name}</span>
            <span className="text-xs text-slate-400">{r.branch || "—"}</span>
          </div>
        </div>
      ),
    },
    { key: "account_number", title: "Số tài khoản", render: (r) => r.account_number },
    { key: "account_holder", title: "Chủ tài khoản", render: (r) => r.account_holder },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            r.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {r.status === "active" ? "Đang hoạt động" : "Ngừng"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (r) => (
        <div className="flex items-center gap-1">
          {!r.is_default && r.status === "active" && (
            <button
              type="button"
              title="Đặt làm mặc định"
              onClick={() => handleSetDefault(r)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-500 [&_svg]:h-4.5 [&_svg]:w-4.5"
            >
              <CheckBadgeOutlined />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleEdit(r)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-brand hover:bg-sky-50"
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => handleToggleStatus(r)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            {r.status === "active" ? "Ngừng" : "Khôi phục"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Tài khoản nhận học phí</p>
          <p className="text-xs text-slate-400">
            Dùng để tạo mã QR chuyển khoản trên hóa đơn. Tài khoản mặc định được ưu tiên hiển thị.
          </p>
        </div>
        <Button icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm tài khoản
        </Button>
      </div>

      {rows.length === 0 && !listQuery.isLoading ? (
        <EmptyState description="Chưa có tài khoản ngân hàng nào" className="py-8" />
      ) : (
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          isLoading={listQuery.isLoading}
          isError={listQuery.isError}
          onRetry={() => listQuery.refetch()}
          errorMessage="Không tải được danh sách tài khoản"
          emptyText="Chưa có tài khoản ngân hàng nào"
          minWidthClassName="min-w-160"
        />
      )}

      <BankAccountForm open={formOpen} onClose={() => setFormOpen(false)} account={editing} />
    </Card>
  );
};

export default BankAccountSettingsTab;
