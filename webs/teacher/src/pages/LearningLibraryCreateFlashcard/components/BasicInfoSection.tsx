import { Input, MinusOutlined, PlusOutlined, Select } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";

import { LANGUAGE_OPTIONS, LEVEL_OPTIONS, MAX_CARD_COUNT, MIN_CARD_COUNT, TAG_OPTIONS } from "../constants";

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 200;

interface BasicInfoSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  tags: string[];
  onChangeTags: (tags: string[]) => void;
  cardCount: number;
  onCardCountChange: (value: number) => void;
}

const BasicInfoSection = ({
  title,
  onTitleChange,
  language,
  onLanguageChange,
  description,
  onDescriptionChange,
  level,
  onLevelChange,
  tags,
  onChangeTags,
  cardCount,
  onCardCountChange,
}: BasicInfoSectionProps) => {
  const clamp = (value: number) => Math.min(MAX_CARD_COUNT, Math.max(MIN_CARD_COUNT, value));

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">1. Thông tin cơ bản</p>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Tiêu đề bộ flashcard <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value.slice(0, TITLE_MAX))}
            placeholder="VD: Animals Vocabulary"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {title.length}/{TITLE_MAX}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Ngôn ngữ <span className="text-rose-500">*</span>
          </label>
          <Select value={language} options={LANGUAGE_OPTIONS} onChange={(v) => onLanguageChange(v as string)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Mô tả ngắn</label>
          <Input
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value.slice(0, DESCRIPTION_MAX))}
            placeholder="Mô tả ngắn gọn về bộ flashcard..."
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {description.length}/{DESCRIPTION_MAX}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Độ tuổi / Cấp độ <span className="text-rose-500">*</span>
          </label>
          <Select value={level} options={LEVEL_OPTIONS} onChange={(v) => onLevelChange(v as string)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Chủ đề (Tags)</label>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Badge key={tag} className="gap-1.5 bg-sky-50 py-1 pl-2.5 pr-1.5 text-sm text-brand">
                {tag}
                <button
                  type="button"
                  onClick={() => onChangeTags(tags.filter((t) => t !== tag))}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-brand/60 hover:bg-sky-100 hover:text-brand"
                >
                  ×
                </button>
              </Badge>
            ))}
            <button
              type="button"
              onClick={() => {
                const next = TAG_OPTIONS.find((o) => !tags.includes(o.value));
                if (next) onChangeTags([...tags, next.value]);
              }}
              className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-sm text-slate-500 hover:border-brand hover:text-brand"
            >
              <PlusOutlined className="h-3.5 w-3.5" /> Thêm tag
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Số lượng thẻ <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCardCountChange(clamp(cardCount - 1))}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand hover:text-brand"
            >
              <MinusOutlined className="h-4 w-4" />
            </button>
            <Input
              value={cardCount}
              onChange={(e) => onCardCountChange(clamp(Number(e.target.value) || MIN_CARD_COUNT))}
              className="w-16 text-center"
            />
            <button
              type="button"
              onClick={() => onCardCountChange(clamp(cardCount + 1))}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand hover:text-brand"
            >
              <PlusOutlined className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-400">thẻ</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
