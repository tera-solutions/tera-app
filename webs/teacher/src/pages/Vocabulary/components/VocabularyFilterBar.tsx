import { ArrowPathOutlined, Select } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";

import { STATUS_FILTER_OPTIONS } from "../constants";

interface SelectOption {
  value: string;
  label: string;
}

interface VocabularyFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  levelOptions: SelectOption[];
  topic: string;
  onTopicChange: (value: string) => void;
  topicOptions: SelectOption[];
  status: string;
  onStatusChange: (value: string) => void;
  onResetFilters: () => void;
}

const VocabularyFilterBar = ({
  search,
  onSearchChange,
  level,
  onLevelChange,
  levelOptions,
  topic,
  onTopicChange,
  topicOptions,
  status,
  onStatusChange,
  onResetFilters,
}: VocabularyFilterBarProps) => (
  <Card>
    <SearchInput
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Tìm kiếm từ vựng..."
      wrapperClassName="mb-3"
    />

    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-36 flex-1">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Cấp độ</label>
        <Select value={level} options={levelOptions} onChange={(v) => onLevelChange(v as string)} />
      </div>
      <div className="min-w-36 flex-1">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Chủ đề</label>
        <Select value={topic} options={topicOptions} onChange={(v) => onTopicChange(v as string)} />
      </div>
      <div className="min-w-36 flex-1">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Trạng thái</label>
        <Select value={status} options={STATUS_FILTER_OPTIONS} onChange={(v) => onStatusChange(v as string)} />
      </div>

      <button
        type="button"
        onClick={onResetFilters}
        className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:border-brand hover:text-brand"
      >
        <ArrowPathOutlined className="h-4 w-4" />
        Xóa bộ lọc
      </button>
    </div>
  </Card>
);

export default VocabularyFilterBar;
