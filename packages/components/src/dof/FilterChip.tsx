/* Import: library */
import { CheckOutlined } from "tera-dls";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Nút chip chọn lọc (dùng trong modal "Bộ lọc nâng cao") — theo mẫu Bách hóa Xanh:
 * bo góc + viền, nền trắng khi thường; khi chọn → nền xanh nhạt + viền xanh + **badge
 * dấu ✓ ở góc trên phải**. Dùng cho cả single-select (Loại GV / Chi nhánh) lẫn
 * multi-select (Chuyên môn) — chỉ khác cách cha quản lý `selected`.
 *
 * Dùng chung mọi web (đặt ở @tera/components/dof).
 */
const FilterChip = ({
  label,
  selected,
  onClick,
  className = "",
  disabled,
}: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`relative rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
      selected
        ? "border-blue-500 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
    } ${className}`}
  >
    <span className="block truncate">{label}</span>
    {selected && (
      <span className="absolute -right-px -top-px flex h-4 w-4 items-center justify-center rounded-bl-lg rounded-tr-lg bg-blue-500 text-white">
        <CheckOutlined className="h-2.5 w-2.5" />
      </span>
    )}
  </button>
);

export default FilterChip;
