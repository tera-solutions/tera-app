/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import SortSelect from "_common/components/SortSelect";

interface Option {
  value: string;
  label: string;
}

interface RoomFilterProps {
  branchOptions: Option[];
  typeOptions: Option[];
  branch: string;
  type: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  onBranchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách phòng học (Chi nhánh + Loại phòng + Sắp xếp).
 * Inline — không phải drawer. Status tabs + search nằm ngoài (ở list page).
 */
const RoomFilter = ({
  branchOptions,
  typeOptions,
  branch,
  type,
  sortBy,
  sortDir,
  onBranchChange,
  onTypeChange,
  onSortChange,
}: RoomFilterProps) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "room_code", label: t("room.code") },
    { value: "room_name", label: t("room.name") },
    { value: "capacity", label: t("room.capacity") },
    { value: "floor", label: t("room.floor") },
    { value: "created_at", label: t("room.created_at") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      {/* Các select — CHỈ hiện desktop (mobile đưa vào modal "Lọc") */}
      <div className="hidden xmd:contents">
        <FilterSelect
          allowClear
          className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
          value={branch}
          placeholder={t("common.all_branches")}
          options={branchOptions}
          onChange={onBranchChange}
        />
        <FilterSelect
          allowClear
          className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[130px]"
          value={type}
          placeholder={t("room.all_types")}
          options={typeOptions}
          onChange={onTypeChange}
        />
      </div>
      {/* Sắp xếp — luôn hiện (không đưa vào modal) */}
      <div className="shrink-0">
        <SortSelect
          options={sortOptions}
          sortBy={sortBy}
          sortDir={sortDir}
          placeholder={t("room.sort_by")}
          defaultDir="asc"
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default RoomFilter;
