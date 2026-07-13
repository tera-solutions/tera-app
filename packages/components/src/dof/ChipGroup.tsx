/* Import: pages */
import FilterChip from "./FilterChip";

interface Option {
  value: string;
  label: string;
}

interface ChipGroupProps {
  label: string;
  options: Option[];
  /** single-select: string ("" = chưa chọn); multi-select: string[]. */
  value: string | string[];
  onChange: (value: any) => void;
  /** true = chọn nhiều (value là string[]); mặc định single. */
  multi?: boolean;
  /** Ẩn cả section khi không có option (mặc định true). */
  hideWhenEmpty?: boolean;
}

/**
 * Một nhóm chip lọc có tiêu đề (dùng trong các modal "Bộ lọc nâng cao").
 * - single: bấm chip đang chọn → bỏ chọn (về "").
 * - multi: toggle trong mảng.
 *
 * Dùng chung mọi web (đặt ở @tera/components/dof).
 */
const ChipGroup = ({
  label,
  options,
  value,
  onChange,
  multi,
  hideWhenEmpty = true,
}: ChipGroupProps) => {
  if (hideWhenEmpty && options.length === 0) return null;

  const isSelected = (v: string) =>
    multi ? (value as string[]).includes(v) : value === v;

  const toggle = (v: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(value === v ? "" : v);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-gray-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={isSelected(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChipGroup;
