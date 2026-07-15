/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { UserService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";

interface Option {
  value: string;
  label: string;
}

export interface UserFilterDraft {
  role: string;
  branch: string;
}

interface UserFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: UserFilterDraft;
  onApply: (value: UserFilterDraft) => void;
  roleOptions: Option[];
  branchOptions: Option[];
  /** Param nền (search + tab trạng thái) để đếm preview đúng như list sẽ hiện. */
  baseParams?: Record<string, any>;
}

const EMPTY: UserFilterDraft = { role: "", branch: "" };

/** Modal "Bộ lọc nâng cao" cho DS người dùng (mobile): Vai trò + Chi nhánh dạng chip. */
const UserFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  roleOptions,
  branchOptions,
  baseParams,
}: UserFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<UserFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + tab trạng thái).
  const { data: previewData, isFetching } = UserService.useUserList(
    {
      params: {
        ...baseParams,
        role_id: draft.role || undefined,
        branch_id: draft.branch || undefined,
        page: 1,
        per_page: 1,
      } as any,
    },
    { enabled: open },
  );
  const count: number | undefined = open
    ? (previewData?.data?.pagination?.total ?? undefined)
    : undefined;

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
        label={t("user.role")}
        options={roleOptions}
        value={draft.role}
        onChange={(role) => setDraft((d) => ({ ...d, role }))}
      />
      <ChipGroup
        label={t("user.branch")}
        options={branchOptions}
        value={draft.branch}
        onChange={(branch) => setDraft((d) => ({ ...d, branch }))}
      />
    </FilterModalShell>
  );
};

export default UserFilterModal;
