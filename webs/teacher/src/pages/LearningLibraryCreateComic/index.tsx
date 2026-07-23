import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  Button,
  ChevronRightOutlined,
  DocumentTextOutlined,
  EyeOutlined,
  PaperAirplaneOutlined,
  notification,
} from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import type {
  ComicCharacterDraft,
  ComicFrameDraft,
  ComicVisualSettings,
  DialogTextSettings,
  VoiceAudioSettings,
} from "./_interface";
import { DEFAULT_CHARACTERS, DEFAULT_COVER_GRADIENT, DEFAULT_FRAMES } from "./mock";
import ComicInfoSection from "./components/ComicInfoSection";
import StoryboardSection from "./components/StoryboardSection";
import DialogTextSection from "./components/DialogTextSection";
import ComicSettingsSection from "./components/ComicSettingsSection";
import VoiceAudioSection from "./components/VoiceAudioSection";
import CoverImageSection from "./components/CoverImageSection";
import NoteSection from "./components/NoteSection";

const LearningLibraryCreateComic = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("A Day with My Pet");
  const [description, setDescription] = useState("A fun comic story about a boy and his pet dog.");
  const [language, setLanguage] = useState("en");
  const [ageLevel, setAgeLevel] = useState("kids_6_8");
  const [genre, setGenre] = useState("adventure_vocab");
  const [characters, setCharacters] = useState<ComicCharacterDraft[]>(DEFAULT_CHARACTERS);
  const [objectives, setObjectives] = useState(
    "- Học từ vựng về thú cưng (pet, dog, play, happy, food...).\n- Hiểu và sử dụng câu đơn trong ngữ cảnh.\n- Rèn luyện kỹ năng đọc hiểu thông qua truyện tranh.",
  );

  const [frames, setFrames] = useState<ComicFrameDraft[]>(DEFAULT_FRAMES);

  const [dialogText, setDialogText] = useState<DialogTextSettings>({
    font: "comic_neue",
    fontSize: "14",
    textColor: "#0f172a",
    uppercaseTitle: true,
    boldKeyVocabulary: true,
    bubbleStyle: "round",
  });

  const [visualSettings, setVisualSettings] = useState<ComicVisualSettings>({
    artStyle: "cartoon",
    frameLayout: "2",
    themeColor: "#2563eb",
  });
  const [customColor, setCustomColor] = useState("#2563eb");

  const [voiceAudio, setVoiceAudio] = useState<VoiceAudioSettings>({
    enabled: true,
    voice: "jenny_us",
    music: "happy_kids",
    musicVolume: 60,
  });

  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [note, setNote] = useState("");

  const handleUploadCover = (file?: File) => {
    if (!file) return;
    setCustomCoverUrl(URL.createObjectURL(file));
  };
  const handleRemoveCover = () => {
    if (customCoverUrl) URL.revokeObjectURL(customCoverUrl);
    setCustomCoverUrl("");
  };

  const goBack = () => navigate(PATHS.learningLibrary);

  const handlePreview = () =>
    notification.warning({ message: "Tính năng xem trước đang được phát triển" });

  const handleSaveDraft = () => {
    notification.success({ message: `Đã lưu nháp "${title || "truyện tranh mới"}"` });
    goBack();
  };

  const handlePublish = () => {
    if (!title.trim()) {
      notification.warning({ message: "Vui lòng nhập tiêu đề truyện" });
      return;
    }
    notification.success({ message: `Đã xuất bản "${title}"` });
    goBack();
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
        <Link to={PATHS.learningLibrary} className="hover:text-brand">
          Học liệu
        </Link>
        <ChevronRightOutlined className="h-3.5 w-3.5 text-slate-300" />
        <Link to={`${PATHS.learningLibrary}/create`} className="hover:text-brand">
          Tạo mới học liệu
        </Link>
        <ChevronRightOutlined className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-slate-700">Tạo truyện tranh</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button
          outlined
          icon={<ArrowLeftOutlined />}
          className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
          onClick={goBack}
        >
          Quay lại
        </Button>
        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<DocumentTextOutlined />}
            className="border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            onClick={handleSaveDraft}
          >
            Lưu nháp
          </Button>
          <Button
            outlined
            icon={<EyeOutlined />}
            className="border-slate-200 text-brand hover:border-brand"
            onClick={handlePreview}
          >
            Xem trước
          </Button>
          <Button
            icon={<PaperAirplaneOutlined />}
            className="bg-brand hover:bg-brand/80"
            onClick={handlePublish}
          >
            Xuất bản
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <ComicInfoSection
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            language={language}
            onLanguageChange={setLanguage}
            ageLevel={ageLevel}
            onAgeLevelChange={setAgeLevel}
            genre={genre}
            onGenreChange={setGenre}
            characters={characters}
            onChangeCharacters={setCharacters}
            objectives={objectives}
            onObjectivesChange={setObjectives}
          />

          <StoryboardSection frames={frames} onChange={setFrames} />

          <DialogTextSection value={dialogText} onChange={(patch) => setDialogText((s) => ({ ...s, ...patch }))} />
        </div>

        <div className="flex flex-col gap-4">
          <ComicSettingsSection
            value={visualSettings}
            onChange={(patch) => setVisualSettings((s) => ({ ...s, ...patch }))}
            customColor={customColor}
            onCustomColor={setCustomColor}
          />

          <VoiceAudioSection value={voiceAudio} onChange={(patch) => setVoiceAudio((s) => ({ ...s, ...patch }))} />

          <CoverImageSection
            title={title}
            gradient={DEFAULT_COVER_GRADIENT}
            customCoverUrl={customCoverUrl}
            onUpload={handleUploadCover}
            onRemoveCustom={handleRemoveCover}
          />

          <NoteSection value={note} onChange={setNote} />
        </div>
      </div>
    </div>
  );
};

export default LearningLibraryCreateComic;
