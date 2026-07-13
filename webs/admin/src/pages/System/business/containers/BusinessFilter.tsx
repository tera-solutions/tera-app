/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import DateRangeFilter from "_common/components/DateRangeFilter";
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";

interface BusinessFilterProps {
  manager: string;
  selectedManager: any;
  createdFrom: string;
  createdTo: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  onManagerChange: (id: string, user?: any) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách doanh nghiệp (Người quản lý + Ngày tạo + Sắp xếp).
 * Inline — Người quản lý + Ngày tạo CHỈ hiện desktop (mobile đưa vào modal "Lọc");
 * chỉ Sắp xếp luôn hiện. Status tabs + search nằm ngoài (ở list page).
 */
const BusinessFilter = ({
  manager,
  selectedManager,
  createdFrom,
  createdTo,
  sortBy,
  sortDir,
  onManagerChange,
  onDateRangeChange,
  onSortChange,
}: BusinessFilterProps) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "business_code", label: t("business.code") },
    { value: "name", label: t("business.name") },
    { value: "created_at", label: t("business.created_at") },
    { value: "status", label: t("business.status") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      {/* Người quản lý + Ngày tạo — CHỈ hiện desktop (mobile đưa vào modal "Lọc") */}
      <div className="hidden xmd:contents">
        <div className="flex-1 min-w-[160px] xmd:flex-none xmd:w-auto xmd:min-w-[170px]">
          <UserSelect
            value={manager}
            selectedUser={selectedManager}
            placeholder={t("business.all_managers")}
            allowClear
            onChange={onManagerChange}
          />
        </div>
        <DateRangeFilter
          className="flex-1 xmd:flex-none xmd:w-[200px]"
          from={createdFrom}
          to={createdTo}
          placeholder={[t("common.from"), t("common.to")]}
          onChange={onDateRangeChange}
        />
      </div>
      {/* Sắp xếp — luôn hiện */}
      <div className="shrink-0">
        <SortSelect
          options={sortOptions}
          sortBy={sortBy}
          sortDir={sortDir}
          placeholder={t("business.sort_by")}
          defaultDir="asc"
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default BusinessFilter;
