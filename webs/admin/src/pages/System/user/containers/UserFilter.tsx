/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import SortSelect from "_common/components/SortSelect";

interface Option {
  value: string;
  label: string;
}

interface UserFilterProps {
  roleOptions: Option[];
  branchOptions: Option[];
  role: string;
  branch: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  onRoleChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách người dùng (Vai trò + Chi nhánh + Sắp xếp).
 * Status tabs + search nằm ngoài (ở list page).
 */
const UserFilter = ({
  roleOptions,
  branchOptions,
  role,
  branch,
  sortBy,
  sortDir,
  onRoleChange,
  onBranchChange,
  onSortChange,
}: UserFilterProps) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "full_name", label: t("user.full_name") },
    { value: "username", label: t("user.username") },
    { value: "created_at", label: t("user.created_at") },
    { value: "status", label: t("user.status") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      <FilterSelect
        allowClear
        className="flex-1 min-w-[140px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={role}
        placeholder={t("user.all_roles")}
        options={roleOptions}
        onChange={onRoleChange}
      />
      <FilterSelect
        allowClear
        className="flex-1 min-w-[140px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={branch}
        placeholder={t("user.all_branches")}
        options={branchOptions}
        onChange={onBranchChange}
      />
      <div className="shrink-0">
        <SortSelect
          options={sortOptions}
          sortBy={sortBy}
          sortDir={sortDir}
          placeholder={t("user.sort_by")}
          defaultDir="asc"
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default UserFilter;
