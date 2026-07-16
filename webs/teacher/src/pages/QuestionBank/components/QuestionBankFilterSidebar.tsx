import { Select } from "tera-dls";

import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import { QUESTION_DIFFICULTY_OPTIONS, QUESTION_SKILL_OPTIONS, QUESTION_TYPE_OPTIONS } from "../constants";

export interface QuestionBankFilterDraft {
  skill: string;
  type: string;
  difficulty: string;
}

interface QuestionBankFilterSidebarProps {
  draft: QuestionBankFilterDraft;
  onChange: (patch: Partial<QuestionBankFilterDraft>) => void;
  onReset: () => void;
}

const skillOptions = QUESTION_SKILL_OPTIONS.filter((o) => o.value);
const typeOptions = QUESTION_TYPE_OPTIONS.filter((o) => o.value);
const difficultyOptions = QUESTION_DIFFICULTY_OPTIONS.filter((o) => o.value);

const QuestionBankFilterSidebar = ({ draft, onChange, onReset }: QuestionBankFilterSidebarProps) => (
  <FilterCard onReset={onReset}>
    <FilterField label="Môn học">
      <Select
        value={draft.skill || undefined}
        selectedValue={skillOptions.find((o) => o.value === draft.skill)}
        placeholder="Tất cả môn học"
        allowClear
        options={skillOptions}
        onChange={(value) => onChange({ skill: (value as string | undefined) ?? "" })}
      />
    </FilterField>

    <FilterField label="Dạng câu hỏi">
      <Select
        value={draft.type || undefined}
        selectedValue={typeOptions.find((o) => o.value === draft.type)}
        placeholder="Tất cả dạng câu hỏi"
        allowClear
        options={typeOptions}
        onChange={(value) => onChange({ type: (value as string | undefined) ?? "" })}
      />
    </FilterField>

    <FilterField label="Độ khó">
      <Select
        value={draft.difficulty || undefined}
        selectedValue={difficultyOptions.find((o) => o.value === draft.difficulty)}
        placeholder="Tất cả độ khó"
        allowClear
        options={difficultyOptions}
        onChange={(value) => onChange({ difficulty: (value as string | undefined) ?? "" })}
      />
    </FilterField>
  </FilterCard>
);

export default QuestionBankFilterSidebar;
