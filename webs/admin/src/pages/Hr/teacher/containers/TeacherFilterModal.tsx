/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import UserSelect from "_common/components/UserSelect";

interface Option {
  value: string;
  label: string;
}

/** Giá trị lọc mà modal chỉnh sửa (bản nháp) rồi commit khi bấm "Áp dụng". */
export interface TeacherFilterDraft {
  type: string;
  branch: string;
  manager: string;
  selectedManager: any;
  skills: string[];
}

interface TeacherFilterModalProps {
  open: boolean;
  onClose: () => void;
  /** Giá trị đang áp dụng (seed cho bản nháp mỗi khi mở). */
  value: TeacherFilterDraft;
  /** Bấm "Áp dụng" → commit bản nháp ra ngoài. */
  onApply: (value: TeacherFilterDraft) => void;
  branchOptions: Option[];
  skillOptions: Option[];
  /** Param nền (search + tab trạng thái) để đếm preview đúng như list sẽ hiện. */
  baseParams?: Record<string, any>;
}

const EMPTY: TeacherFilterDraft = {
  type: "",
  branch: "",
  manager: "",
  selectedManager: null,
  skills: [],
};

/**
 * Modal "Bộ lọc nâng cao" cho DS giáo viên (mobile): Loại GV + Chuyên môn(multi) +
 * Chi nhánh dạng chip, Người quản lý giữ `UserSelect` (search server).
 */
const TeacherFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  branchOptions,
  skillOptions,
  baseParams,
}: TeacherFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<TeacherFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + tab trạng thái).
  const { data: previewData, isFetching } = TeacherService.useTeacherList(
    {
      params: {
        ...baseParams,
        teacher_type: draft.type || undefined,
        branch_id: draft.branch || undefined,
        manager_id: draft.manager || undefined,
        skill: draft.skills.length ? draft.skills : undefined,
        page: 1,
        per_page: 1,
      } as any,
    },
    { enabled: open },
  );
  const count: number | undefined = open
    ? (previewData?.data?.pagination?.total ?? undefined)
    : undefined;

  const typeOptions: Option[] = [
    { value: "part_time", label: t("teacher.type_part_time") },
    { value: "full_time", label: t("teacher.type_full_time") },
    { value: "assistant", label: t("teacher.type_assistant") },
    { value: "freelancer", label: t("teacher.type_freelancer") },
  ];

  return (
    <FilterModalShell
      open={open}
      onClose={onClose}
      onApply={() => onApply(draft)}
      onReset={() => setDraft(EMPTY)}
      count={count}
      countLoading={isFetching}
    >
      <ChipGroup
        label={t("teacher.filter_type")}
        options={typeOptions}
        value={draft.type}
        hideWhenEmpty={false}
        onChange={(type) => setDraft((d) => ({ ...d, type }))}
      />
      <ChipGroup
        label={t("teacher.tab_expertise")}
        options={skillOptions}
        value={draft.skills}
        multi
        onChange={(skills) => setDraft((d) => ({ ...d, skills }))}
      />
      <ChipGroup
        label={t("teacher.branch")}
        options={branchOptions}
        value={draft.branch}
        onChange={(branch) => setDraft((d) => ({ ...d, branch }))}
      />
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("teacher.manager")}
        </p>
        <UserSelect
          value={draft.manager}
          selectedUser={draft.selectedManager}
          placeholder={t("teacher.all_managers")}
          allowClear
          onChange={(id, user) =>
            setDraft((d) => ({
              ...d,
              manager: id,
              selectedManager: user ?? null,
            }))
          }
        />
      </div>
    </FilterModalShell>
  );
};

export default TeacherFilterModal;
