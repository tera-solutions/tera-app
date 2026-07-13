/* Import: library */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "tera-dls";

/* Import: packages */
import useIsMobile from "@tera/commons/hooks/useIsMobile";

interface FilterModalShellProps {
  open: boolean;
  onClose: () => void;
  /** Commit bản nháp ra ngoài (modal tự đóng sau đó). */
  onApply: () => void;
  /** Xoá bản nháp về rỗng. */
  onReset: () => void;
  title?: string;
  children: ReactNode;
  /**
   * Số bản ghi sẽ nhận nếu áp dụng bộ lọc đang chọn (preview). Có thì nút Áp dụng
   * hiện "Áp dụng (có N dữ liệu)". `undefined` = không hiện số (page không truyền).
   */
  count?: number;
  /** Đang đếm lại (query preview chạy) → hiện "…" khi chưa có số nào. */
  countLoading?: boolean;
}

/**
 * Khung modal "Bộ lọc nâng cao" dùng chung cho MỌI màn list (mobile).
 * Chỉ lo phần vỏ (title + footer Chọn lại / Áp dụng + responsive width);
 * nội dung (ChipGroup / UserSelect / range...) do từng page truyền vào `children`,
 * và quản lý state bản nháp bên ngoài. ⚠️ Nút Sắp xếp + Ngày (date range) KHÔNG nằm
 * trong modal này — vẫn để inline theo yêu cầu.
 *
 * Dùng chung mọi web (đặt ở @tera/components/dof).
 */
const FilterModalShell = ({
  open,
  onClose,
  onApply,
  onReset,
  title,
  children,
  count,
  countLoading,
}: FilterModalShellProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const applyLabel =
    count != null
      ? t("button.apply_with_count", { count })
      : countLoading
        ? `${t("button.apply")} (…)`
        : t("button.apply");

  return (
    <Modal
      title={title ?? t("common.advanced_filter")}
      open={open}
      onCancel={onClose}
      centered
      width={isMobile ? "92%" : 560}
      className="max-w-[560px]!"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-1.5 text-[13px] border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {t("button.reset_filter")}
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            {applyLabel}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">{children}</div>
    </Modal>
  );
};

export default FilterModalShell;
