/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import SortSelect from "_common/components/SortSelect";

interface Option {
  value: string;
  label: string;
}

interface StudentFilterProps {
  levelOptions: Option[];
  branchOptions: Option[];
  level: string;
  branch: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  onLevelChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách học viên (Trình độ + Chi nhánh + Sắp xếp).
 * Inline — không phải drawer. Status tabs + search nằm ngoài (ở list page).
 */
const StudentFilter = ({
  levelOptions,
  branchOptions,
  level,
  branch,
  sortBy,
  sortDir,
  onLevelChange,
  onBranchChange,
  onSortChange,
}: StudentFilterProps) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "code", label: t("student.code") },
    { value: "name", label: t("student.name") },
    { value: "enrollment_date", label: t("student.enrollment_date") },
    { value: "created_at", label: t("student.created_at") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      <FilterSelect
        className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[110px]"
        value={level}
        placeholder={t("student.all_levels")}
        options={levelOptions}
        onChange={onLevelChange}
      />
      <FilterSelect
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
          placeholder={t("student.sort_by")}
          defaultDir="asc"
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default StudentFilter;
