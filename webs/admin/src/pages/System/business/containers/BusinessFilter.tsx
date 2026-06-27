/* Import: library */
import { useTranslation } from "react-i18next";
import moment from "moment";
import { DatePicker } from "tera-dls";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";

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
      <DatePicker
        className="flex-1 min-w-[140px] xmd:flex-none xmd:w-[160px]"
        value={date ? moment(date, "YYYY-MM-DD") : undefined}
        format="DD/MM/YYYY"
        placeholder={t("business.created_at")}
        allowClear
        onChange={(d: any) =>
          onDateChange(d ? moment(d).format("YYYY-MM-DD") : "")
        }
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
