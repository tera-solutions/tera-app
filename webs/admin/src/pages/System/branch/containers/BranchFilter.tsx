/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";

interface Option {
  value: string;
  label: string;
}

interface BranchFilterProps {
  businessOptions: Option[];
  provinceOptions: Option[];
  business: string;
  province: string;
  manager: string;
  selectedManager: any;
  sortBy: string;
  sortDir: "asc" | "desc";
  onBusinessChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onManagerChange: (id: string, user?: any) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách chi nhánh (Doanh nghiệp + Tỉnh/Thành + Người quản lý + Sắp xếp).
 * Inline — không phải drawer. Status tabs + search nằm ngoài (ở list page).
 */
const BranchFilter = ({
  businessOptions,
  provinceOptions,
  business,
  province,
  manager,
  selectedManager,
  sortBy,
  sortDir,
  onBusinessChange,
  onProvinceChange,
  onManagerChange,
  onSortChange,
}: BranchFilterProps) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "code", label: t("branch.code") },
    { value: "name", label: t("branch.name") },
    { value: "created_at", label: t("branch.created_at") },
    { value: "status", label: t("branch.status") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      <FilterSelect
        className="flex-1 min-w-[140px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={business}
        placeholder={t("branch.all_business")}
        options={businessOptions}
        onChange={onBusinessChange}
      />
      <FilterSelect
        className="flex-1 min-w-[140px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={province}
        placeholder={t("branch.all_provinces")}
        options={provinceOptions}
        onChange={onProvinceChange}
      />
      <div className="flex-1 min-w-[160px] xmd:flex-none xmd:w-auto xmd:min-w-[180px]">
        <UserSelect
          value={manager}
          selectedUser={selectedManager}
          placeholder={t("branch.all_managers")}
          allowClear
          onChange={onManagerChange}
        />
      </div>
      <div className="shrink-0">
        <SortSelect
          options={sortOptions}
          sortBy={sortBy}
          sortDir={sortDir}
          placeholder={t("branch.sort_by")}
          defaultDir="asc"
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default BranchFilter;
