import classNames from "classnames";
import { BarsArrowDownOutlined, BarsArrowUpOutlined, Select } from "tera-dls";

export interface SortOption {
  value: string;
  label: string;
}

interface SortControlProps {
  sortBy: string;
  sortDir: "asc" | "desc";
  options: SortOption[];
  onSortByChange: (value: string) => void;
  onToggleDir: () => void;
  label?: string;
  className?: string;
}

/** Shared "Sắp xếp theo [field] [asc/desc toggle]" control for list/table pages. */
const SortControl = ({
  sortBy,
  sortDir,
  options,
  onSortByChange,
  onToggleDir,
  label = "Sắp xếp theo",
  className,
}: SortControlProps) => {
  const selectedValue = options.find((o) => o.value === sortBy);

  return (
    <div
      className={classNames(
        "flex items-center gap-1.5 text-sm text-slate-500",
        className,
      )}
    >
      <span className="whitespace-nowrap">{label}</span>
      <div className="w-40">
        <Select
          value={sortBy}
          selectedValue={selectedValue}
          options={options}
          onChange={(value) => onSortByChange(value as string)}
        />
      </div>
      <button
        type="button"
        title={sortDir === "asc" ? "Tăng dần" : "Giảm dần"}
        onClick={onToggleDir}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 [&_svg]:h-4 [&_svg]:w-4"
      >
        {sortDir === "asc" ? <BarsArrowUpOutlined /> : <BarsArrowDownOutlined />}
      </button>
    </div>
  );
};

export default SortControl;
