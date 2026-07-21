import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CodeBracketOutlined,
  EllipsisHorizontalOutlined,
  Input,
  LinkOutlined,
  ListBulletOutlined,
  PhotoOutlined,
  QueueListOutlined,
  TextArea,
} from "tera-dls";

import Card from "_common/components/Card";

const TOOLBAR_BUTTONS: { key: string; content: React.ReactNode; className?: string }[] = [
  { key: "bold", content: <span className="font-bold">B</span> },
  { key: "italic", content: <span className="italic">I</span> },
  { key: "underline", content: <span className="underline">U</span> },
  { key: "bullet", content: <ListBulletOutlined className="h-4 w-4" /> },
  { key: "numbered", content: <QueueListOutlined className="h-4 w-4" /> },
  { key: "outdent", content: <ArrowLeftOutlined className="h-4 w-4" /> },
  { key: "indent", content: <ArrowRightOutlined className="h-4 w-4" /> },
  { key: "image", content: <PhotoOutlined className="h-4 w-4" /> },
  { key: "link", content: <LinkOutlined className="h-4 w-4" /> },
  { key: "code", content: <CodeBracketOutlined className="h-4 w-4" /> },
  { key: "more", content: <EllipsisHorizontalOutlined className="h-4 w-4" /> },
];

interface BasicInfoSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  objectives: string;
  onObjectivesChange: (value: string) => void;
}

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 200;
const OBJECTIVES_MAX = 1000;

const BasicInfoSection = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  objectives,
  onObjectivesChange,
}: BasicInfoSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">1. Thông tin cơ bản</p>

    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Tiêu đề bài học <span className="text-rose-500">*</span>
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

    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Mô tả ngắn</label>
      <TextArea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value.slice(0, DESCRIPTION_MAX))}
        placeholder="Mô tả ngắn gọn về học liệu..."
        rows={2}
      />
      <p className="mt-1 text-right text-xs text-slate-400">
        {description.length}/{DESCRIPTION_MAX}
      </p>
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Mục tiêu học tập</label>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-500">
          {TOOLBAR_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200/70"
            >
              {btn.content}
            </button>
          ))}
        </div>
        <TextArea
          value={objectives}
          onChange={(e) => onObjectivesChange(e.target.value.slice(0, OBJECTIVES_MAX))}
          placeholder={"- Nhận biết và phát âm đúng các từ vựng...\n- Hiểu nghĩa và cách sử dụng từ..."}
          rows={5}
          className="rounded-none border-none focus:ring-0"
        />
      </div>
      <p className="mt-1 text-right text-xs text-slate-400">
        {objectives.length}/{OBJECTIVES_MAX}
      </p>
    </div>
  </Card>
);

export default BasicInfoSection;
