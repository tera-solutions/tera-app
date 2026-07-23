import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CodeBracketOutlined,
  EllipsisHorizontalOutlined,
  Input,
  LinkOutlined,
  ListBulletOutlined,
  PhotoOutlined,
  PlusOutlined,
  QueueListOutlined,
  Select,
  TextArea,
  XMarkOutlined,
} from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";

import type { ComicCharacterDraft } from "../_interface";
import { AGE_LEVEL_OPTIONS, GENRE_OPTIONS, LANGUAGE_OPTIONS } from "../constants";

const TOOLBAR_BUTTONS: { key: string; content: React.ReactNode }[] = [
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

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 200;
const OBJECTIVES_MAX = 1000;
let charIdCounter = 0;

interface ComicInfoSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  ageLevel: string;
  onAgeLevelChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
  characters: ComicCharacterDraft[];
  onChangeCharacters: (characters: ComicCharacterDraft[]) => void;
  objectives: string;
  onObjectivesChange: (value: string) => void;
}

const ComicInfoSection = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  language,
  onLanguageChange,
  ageLevel,
  onAgeLevelChange,
  genre,
  onGenreChange,
  characters,
  onChangeCharacters,
  objectives,
  onObjectivesChange,
}: ComicInfoSectionProps) => {
  const handleAddCharacter = () => {
    charIdCounter += 1;
    onChangeCharacters([
      ...characters,
      { id: `char-new-${charIdCounter}`, name: "Nhân vật mới", emoji: "🧑" },
    ]);
  };
  const handleRemoveCharacter = (id: string) =>
    onChangeCharacters(characters.filter((c) => c.id !== id));

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-800">1. Thông tin truyện tranh</p>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Tiêu đề truyện <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value.slice(0, TITLE_MAX))}
            placeholder="VD: A Day with My Pet"
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
            placeholder="Mô tả ngắn gọn về câu chuyện..."
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {description.length}/{DESCRIPTION_MAX}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Độ tuổi / Cấp độ <span className="text-rose-500">*</span>
          </label>
          <Select value={ageLevel} options={AGE_LEVEL_OPTIONS} onChange={(v) => onAgeLevelChange(v as string)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Nhân vật chính <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {characters.map((character) => (
              <Badge
                key={character.id}
                className="gap-1.5 border border-slate-200 bg-slate-50 py-1 pl-2.5 pr-1.5 text-sm text-slate-700"
              >
                <span>{character.emoji}</span>
                {character.name}
                <button
                  type="button"
                  onClick={() => handleRemoveCharacter(character.id)}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                >
                  <XMarkOutlined className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <button
              type="button"
              onClick={handleAddCharacter}
              className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-sm text-slate-500 hover:border-brand hover:text-brand"
            >
              <PlusOutlined className="h-3.5 w-3.5" /> Thêm nhân vật
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Thể loại</label>
          <Select value={genre} options={GENRE_OPTIONS} onChange={(v) => onGenreChange(v as string)} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Mục tiêu học tập <span className="text-rose-500">*</span>
          </label>
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
              placeholder={"- Học từ vựng...\n- Hiểu và sử dụng câu đơn..."}
              rows={4}
              className="rounded-none border-none focus:ring-0"
            />
          </div>
          <p className="mt-1 text-right text-xs text-slate-400">
            {objectives.length}/{OBJECTIVES_MAX}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ComicInfoSection;
