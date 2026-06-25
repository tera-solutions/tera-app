/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";

const DATE_CLASS =
  "h-9 w-full border border-gray-300 bg-white rounded px-2 text-[13px] xmd:w-auto xmd:min-w-[150px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 cursor-pointer";

interface BusinessFilterProps {
  manager: string;
  selectedManager: any;
  date: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  onManagerChange: (id: string, user?: any) => void;
  onDateChange: (value: string) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách doanh nghiệp (Người quản lý + Ngày tạo + Sắp xếp).
 * Inline — không phải drawer. Status tabs + search nằm ngoài (ở list page).
 */
const BusinessFilter = ({
  manager,
  selectedManager,
  date,
  sortBy,
  sortDir,
  onManagerChange,
  onDateChange,
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
      <div className="flex-1 min-w-[160px] xmd:flex-none xmd:w-auto xmd:min-w-[170px]">
        <UserSelect
          value={manager}
          selectedUser={selectedManager}
          placeholder={t("business.all_managers")}
          allowClear
          onChange={onManagerChange}
        />
      </div>
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        title={t("business.created_at")}
        className={`${DATE_CLASS} flex-1 min-w-[140px] xmd:flex-none`}
        style={{ color: date ? "#111827" : "#9ca3af" }}
      />
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
