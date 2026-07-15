/* Import: library */
import { useTranslation } from "react-i18next";
import { FunnelOutlined } from "tera-dls";

interface FilterButtonProps {
  onClick: () => void;
  /** Số bộ lọc đang bật → hiện badge. 0 = ẩn badge. */
  count?: number;
  className?: string;
}

/**
 * Nút "Lọc" mở modal "Bộ lọc nâng cao" — **CHỈ hiện ở mobile** (`xmd:hidden`);
 * desktop dùng các dropdown lọc inline. Badge hiện số bộ lọc đang bật.
 * Bo góc `rounded` (4px) cho khớp các select/ô search cạnh nó.
 *
 * Dùng chung mọi web (đặt ở @tera/components/dof). Phụ thuộc breakpoint `xmd`
 * (1280px) khai báo ở packages/assets/src/styles/main.css — web nào import CSS
 * đó đều dùng được. Cần breakpoint khác thì override qua prop `className`.
 */
const FilterButton = ({ onClick, count = 0, className = "" }: FilterButtonProps) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`xmd:hidden flex items-center justify-center gap-1.5 shrink-0 h-9 px-3 text-[13px] font-medium border border-gray-300 rounded bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer ${className}`}
    >
      <FunnelOutlined className="w-4 h-4" />
      <span>{t("button.filter")}</span>
      {count > 0 && (
        <span className="ml-0.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-blue-500 text-white text-[11px] leading-none">
          {count}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
