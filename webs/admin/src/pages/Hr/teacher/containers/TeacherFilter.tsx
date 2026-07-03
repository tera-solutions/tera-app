/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import UserSelect from "_common/components/UserSelect";
import MultiSelect from "_common/components/MultiSelect";

interface Option {
  value: string;
  label: string;
}

interface TeacherFilterProps {
  branchOptions: Option[];
  skillOptions: Option[];
  type: string;
  branch: string;
  manager: string;
  selectedManager: any;
  skills: string[];
  onTypeChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onManagerChange: (id: string, user?: any) => void;
  onSkillsChange: (values: string[]) => void;
}

/**
 * Bộ lọc nhanh danh sách giáo viên (Loại GV + Chi nhánh + Người quản lý + Chuyên môn).
 * Inline — không phải drawer. Status tabs + search nằm ngoài (ở list page).
 */
const TeacherFilter = ({
  branchOptions,
  skillOptions,
  type,
  branch,
  manager,
  selectedManager,
  skills,
  onTypeChange,
  onBranchChange,
  onManagerChange,
  onSkillsChange,
}: TeacherFilterProps) => {
  const { t } = useTranslation();

  const typeOptions = [
    { value: "part_time", label: t("teacher.type_part_time") },
    { value: "full_time", label: t("teacher.type_full_time") },
    { value: "assistant", label: t("teacher.type_assistant") },
    { value: "freelancer", label: t("teacher.type_freelancer") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      <FilterSelect
        className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[130px]"
        value={type}
        placeholder={t("teacher.all_types")}
        options={typeOptions}
        onChange={onTypeChange}
        allowClear
      />
      <FilterSelect
        className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={branch}
        placeholder={t("common.all_branches")}
        options={branchOptions}
        onChange={onBranchChange}
        allowClear
      />
      <div className="flex-1 min-w-[150px] xmd:flex-none xmd:w-auto xmd:min-w-[170px]">
        <UserSelect
          value={manager}
          selectedUser={selectedManager}
          placeholder={t("teacher.all_managers")}
          allowClear
          onChange={onManagerChange}
        />
      </div>
      <div className="flex-1 min-w-[150px] xmd:flex-none xmd:w-auto xmd:min-w-[160px]">
        <MultiSelect
          options={skillOptions}
          value={skills}
          placeholder={t("teacher.all_skills")}
          onChange={onSkillsChange}
        />
      </div>
    </div>
  );
};

export default TeacherFilter;
