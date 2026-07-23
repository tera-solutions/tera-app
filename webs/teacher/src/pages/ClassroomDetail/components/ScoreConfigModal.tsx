import { useEffect, useState } from "react";
import { Modal, Button, Input, InputNumber, PlusOutlined, TrashOutlined, notification } from "tera-dls";

import type { ScoreComponent } from "@tera/api";
import { ScoreService } from "@tera/modules/education";

interface ScoreConfigModalProps {
  open: boolean;
  classId: number;
  initialComponents: ScoreComponent[];
  onClose: () => void;
}

const EMPTY_ROW: ScoreComponent = { key: "", label: "", weight: 0 };

const ScoreConfigModal = ({ open, classId, initialComponents, onClose }: ScoreConfigModalProps) => {
  const [rows, setRows] = useState<ScoreComponent[]>([]);

  useEffect(() => {
    if (open) setRows(initialComponents.length > 0 ? initialComponents : [{ ...EMPTY_ROW }]);
  }, [open, initialComponents]);

  const { mutate: saveConfig, isPending } = ScoreService.useSaveScoreConfig(classId);

  const totalWeight = rows.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);

  const updateRow = (index: number, patch: Partial<ScoreComponent>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));

  const addRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }]);

  const handleOk = () => {
    if (rows.some((r) => !r.key.trim() || !r.label.trim())) {
      notification.warning({ message: "Vui lòng nhập đủ mã và tên cho mọi thành phần điểm" });
      return;
    }
    if (Math.abs(totalWeight - 100) > 0.01) {
      notification.warning({ message: "Tổng trọng số phải bằng 100%" });
      return;
    }

    saveConfig(rows, {
      onSuccess: () => {
        notification.success({ message: "Đã lưu cấu trúc điểm" });
        onClose();
      },
      onError: (error: any) =>
        notification.error({ message: error?.data?.msg ?? "Không thể lưu cấu trúc điểm" }),
    });
  };

  return (
    <Modal
      title="Cấu hình trọng số điểm"
      okText="Lưu"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isPending}
      className="!w-[95%] xmd:!w-[520px]"
    >
      <div className="flex flex-col gap-2">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={row.key}
              onChange={(e) => updateRow(index, { key: e.target.value })}
              placeholder="Mã (VD: midterm)"
              className="w-32 text-sm"
            />
            <Input
              value={row.label}
              onChange={(e) => updateRow(index, { label: e.target.value })}
              placeholder="Tên hiển thị (VD: Giữa kỳ)"
              className="flex-1 text-sm"
            />
            <InputNumber
              min={0}
              max={100}
              value={row.weight}
              onChange={(v) => updateRow(index, { weight: typeof v === "number" ? v : 0 })}
              className="w-20 text-sm"
            />
            <span className="text-xs text-slate-400">%</span>
            <button
              type="button"
              onClick={() => removeRow(index)}
              disabled={rows.length <= 1}
              className="text-slate-400 hover:text-red-500 disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4"
            >
              <TrashOutlined />
            </button>
          </div>
        ))}

        <Button outlined icon={<PlusOutlined />} onClick={addRow} className="mt-1 self-start">
          Thêm thành phần
        </Button>

        <p
          className={`mt-2 text-sm font-medium ${Math.abs(totalWeight - 100) > 0.01 ? "text-red-500" : "text-emerald-600"}`}
        >
          Tổng trọng số: {totalWeight}%
        </p>
      </div>
    </Modal>
  );
};

export default ScoreConfigModal;
