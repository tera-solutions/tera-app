import classNames from "classnames";
import { Input, PlusOutlined, Select } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";

import type { AudioContentType } from "../_interface";
import { CONTENT_TYPE_OPTIONS, LANGUAGE_OPTIONS, LEVEL_OPTIONS, TAG_OPTIONS } from "../constants";

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
  contentType: AudioContentType;
  onContentTypeChange: (value: AudioContentType) => void;
  duration: string;
  onDurationChange: (value: string) => void;
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
  contentType,
  onContentTypeChange,
  duration,
  onDurationChange,
  tags,
  onChangeTags,
}: BasicInfoSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">1. Thông tin cơ bản</p>

    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Tiêu đề audio <span className="text-rose-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value.slice(0, TITLE_MAX))}
          placeholder="VD: Animal Sounds - Listen and Learn"
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
          placeholder="Mô tả ngắn gọn về nội dung audio..."
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {description.length}/{DESCRIPTION_MAX}
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Cấp độ / Độ tuổi <span className="text-rose-500">*</span>
        </label>
        <Select value={level} options={LEVEL_OPTIONS} onChange={(v) => onLevelChange(v as string)} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Loại nội dung <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {CONTENT_TYPE_OPTIONS.map((option) => {
            const active = contentType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onContentTypeChange(option.value)}
                className={classNames(
                  "flex flex-col gap-1 rounded-xl border-2 p-3 text-left transition-colors",
                  active ? "border-brand bg-sky-50" : "border-slate-200 hover:border-slate-300",
                )}
              >
                <span
                  className={classNames(
                    "flex items-center gap-1.5 text-sm font-semibold [&_svg]:h-4 [&_svg]:w-4",
                    active ? "text-brand" : "text-slate-700",
                  )}
                >
                  {option.icon}
                  {option.title}
                </span>
                <span className="text-xs text-slate-400">{option.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Thời lượng dự kiến</label>
        <div className="flex items-center gap-2">
          <Input value={duration} onChange={(e) => onDurationChange(e.target.value)} placeholder="00:00" className="w-24" />
          <span className="text-sm text-slate-400">phút</span>
          <span className="text-sm text-slate-400">giây</span>
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
