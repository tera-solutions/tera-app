/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import SortSelect from "_common/components/SortSelect";

interface Option {
  value: string;
  label: string;
}

interface ParentFilterProps {
  relationOptions: Option[];
  branchOptions: Option[];
  relation: string;
  branch: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  onRelationChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách phụ huynh (Quan hệ + Chi nhánh + Sắp xếp).
 * Inline — không phải drawer. Status tabs + search nằm ngoài (ở list page).
 */
const ParentFilter = ({
  relationOptions,
  branchOptions,
  relation,
  branch,
  sortBy,
  sortDir,
  onRelationChange,
  onBranchChange,
  onSortChange,
}: ParentFilterProps) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "code", label: t("parent.code") },
    { value: "name", label: t("parent.name") },
    { value: "created_at", label: t("parent.created_at") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      <FilterSelect
        allowClear
        className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[120px]"
        value={relation}
        placeholder={t("parent.all_relations")}
        options={relationOptions}
        onChange={onRelationChange}
      />
      <FilterSelect
        allowClear
        className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={branch}
        placeholder={t("common.all_branches")}
        options={branchOptions}
        onChange={onBranchChange}
      />
      <div className="shrink-0">
        <SortSelect
          options={sortOptions}
          sortBy={sortBy}
          sortDir={sortDir}
          placeholder={t("parent.sort_by")}
          defaultDir="asc"
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default ParentFilter;
