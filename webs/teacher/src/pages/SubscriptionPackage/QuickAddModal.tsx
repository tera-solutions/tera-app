import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, InputNumber, notification, Select } from "tera-dls";

import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";
import { SubscriptionPackageService } from "@tera/modules/finance";

import { PATHS } from "_common/components/Layout/Menu/menus";
import { PACKAGE_TYPE_OPTIONS } from "./constants";

interface Props {
  open: boolean;
  onClose: () => void;
}

const empty = {
  name: "",
  type: "session",
  price: undefined as number | undefined,
};

/** Form thêm nhanh (task-081) — tạo xong điều hướng sang trang cấu hình chi
 * tiết (task-082) để hoàn thiện số buổi/thời hạn/khóa áp dụng/giảm giá. */
const QuickAddModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const { mutate: create, isPending } = SubscriptionPackageService.useSubscriptionPackageCreate();

  useEffect(() => {
    if (open) setForm(empty);
  }, [open]);

  const isCustom = form.type === "custom";

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên gói" });
      return;
    }
    if (!isCustom && (!form.price || form.price <= 0)) {
      notification.warning({ message: "Vui lòng nhập giá gói" });
      return;
    }

    create(
      {
        params: {
          name: form.name.trim(),
          type: form.type,
          price: isCustom ? form.price ?? null : form.price,
        },
      },
      {
        onSuccess: (res: any) => {
          notification.success({ message: "Đã tạo gói đăng ký" });
          onClose();
          const id = res?.data?.id;
          if (id) navigate(`${PATHS.subscriptionPackages}/${id}`);
        },
        onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể tạo gói đăng ký" }),
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={false}
      titleCreate="Thêm gói đăng ký"
      titleEdit="Thêm gói đăng ký"
      className="!w-[95%] xmd:!w-[440px]"
      okText="Tạo"
      onOk={handleSubmit}
      confirmLoading={isPending}
    >
      <div className="space-y-3">
        <div>
          <FieldLabel required>Tên gói</FieldLabel>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="VD: Gói tháng" />
        </div>
        <div>
          <FieldLabel required>Loại gói</FieldLabel>
          <Select
            value={form.type}
            options={PACKAGE_TYPE_OPTIONS}
            onChange={(v) => set({ type: v as string })}
          />
        </div>
        <div>
          <FieldLabel required={!isCustom}>Giá {isCustom && "(tùy chọn — cấu hình chi tiết sau)"}</FieldLabel>
          <InputNumber
            min={0}
            className="w-full"
            value={form.price}
            onChange={(v) => set({ price: v == null ? undefined : Number(v) })}
            placeholder="VD: 2400000"
          />
        </div>
      </div>
    </FormScaff>
  );
};

export default QuickAddModal;
