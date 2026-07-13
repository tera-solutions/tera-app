/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { LeadService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import UserSelect from "_common/components/UserSelect";

interface Option {
  value: string;
  label: string;
}

export interface LeadFilterDraft {
  source: string;
  courses: string[];
  tags: string[];
  owner: string;
  ownerUser: any;
}

interface LeadFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: LeadFilterDraft;
  onApply: (value: LeadFilterDraft) => void;
  sourceOptions: Option[];
  courseOptions: Option[];
  tagOptions: Option[];
  /** Param nền (search + tab trạng thái) để đếm preview đúng như list sẽ hiện. */
  baseParams?: Record<string, any>;
}

const EMPTY: LeadFilterDraft = {
  source: "",
  courses: [],
  tags: [],
  owner: "",
  ownerUser: undefined,
};

/**
 * Modal "Bộ lọc nâng cao" cho DS khách hàng tiềm năng (mobile): Nguồn (chip) +
 * Khóa học/Tag (multi chip) + Người phụ trách (UserSelect).
 */
const LeadFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  sourceOptions,
  courseOptions,
  tagOptions,
  baseParams,
}: LeadFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<LeadFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + tab trạng thái).
  const { data: previewData, isFetching } = LeadService.useLeadList(
    {
      params: {
        ...baseParams,
        source: draft.source || undefined,
        course_ids: draft.courses.length
          ? draft.courses.map(Number)
          : undefined,
        tag_ids: draft.tags.length ? draft.tags.map(Number) : undefined,
        owner_id: draft.owner || undefined,
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
        label={t("lead.source")}
        options={sourceOptions}
        value={draft.source}
        onChange={(source) => setDraft((d) => ({ ...d, source }))}
      />
      <ChipGroup
        label={t("lead.courses")}
        options={courseOptions}
        value={draft.courses}
        multi
        onChange={(courses) => setDraft((d) => ({ ...d, courses }))}
      />
      <ChipGroup
        label={t("lead.tags")}
        options={tagOptions}
        value={draft.tags}
        multi
        onChange={(tags) => setDraft((d) => ({ ...d, tags }))}
      />
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("lead.owner")}
        </p>
        <UserSelect
          value={draft.owner}
          selectedUser={draft.ownerUser}
          placeholder={t("lead.owner")}
          allowClear
          onChange={(id, user) =>
            setDraft((d) => ({
              ...d,
              owner: id ? String(id) : "",
              ownerUser: user,
            }))
          }
        />
      </div>
    </FilterModalShell>
  );
};

export default LeadFilterModal;
