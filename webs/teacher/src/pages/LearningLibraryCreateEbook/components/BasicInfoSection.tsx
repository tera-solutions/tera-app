import { Input, PlusOutlined, Select, TextArea } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";

import { AUDIENCE_OPTIONS, LANGUAGE_OPTIONS, LEVEL_OPTIONS, TAG_OPTIONS } from "../constants";

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
  audience: string;
  onAudienceChange: (value: string) => void;
  tags: string[];
  onChangeTags: (tags: string[]) => void;
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
  audience,
  onAudienceChange,
  tags,
  onChangeTags,
}: BasicInfoSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">1. Thông tin cơ bản</p>

    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Tiêu đề ebook <span className="text-rose-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value.slice(0, TITLE_MAX))}
          placeholder="VD: Animals World – Let's Explore!"
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
        <TextArea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value.slice(0, DESCRIPTION_MAX))}
          placeholder="Mô tả ngắn gọn về ebook..."
          rows={2}
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {description.length}/{DESCRIPTION_MAX}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Cấp độ / Độ tuổi <span className="text-rose-500">*</span>
          </label>
          <Select value={level} options={LEVEL_OPTIONS} onChange={(v) => onLevelChange(v as string)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Đối tượng</label>
          <Select value={audience} options={AUDIENCE_OPTIONS} onChange={(v) => onAudienceChange(v as string)} />
        </div>
      </div>

      <div className="sm:col-span-2">
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
    </div>
  </Card>
);

export default BasicInfoSection;
