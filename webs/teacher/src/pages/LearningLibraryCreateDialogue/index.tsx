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
  AccessSettings,
  DialogueContentType,
  DialogueLineDraft,
  DisplaySettings,
  VocabularyItemDraft,
} from "./_interface";
import { DEFAULT_COVER_GRADIENT, DEFAULT_DIALOGUE_LINES, DEFAULT_TAGS, DEFAULT_VOCABULARY_ITEMS } from "./mock";
import BasicInfoSection from "./components/BasicInfoSection";
import ScriptContentSection from "./components/ScriptContentSection";
import MediaSection from "./components/MediaSection";
import VideoPreviewSection from "./components/VideoPreviewSection";
import DisplaySettingsSection from "./components/DisplaySettingsSection";
import AccessSection from "./components/AccessSection";
import NoteSection from "./components/NoteSection";

const LearningLibraryCreateDialogue = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("At the Pet Shop - Hội thoại và từ vựng");
  const [language, setLanguage] = useState("en");
  const [contentType, setContentType] = useState<DialogueContentType>("dialogue");
  const [level, setLevel] = useState("beginner_6_8");
  const [description, setDescription] = useState(
    "Video giúp trẻ học các từ vựng và mẫu câu giao tiếp khi đi cửa hàng thú cưng.",
  );
  const [durationMinutes, setDurationMinutes] = useState("02:30");
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);

  const [dialogueLines, setDialogueLines] = useState<DialogueLineDraft[]>(DEFAULT_DIALOGUE_LINES);
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItemDraft[]>(DEFAULT_VOCABULARY_ITEMS);

  const [music, setMusic] = useState("happy_bright");
  const [musicVolume, setMusicVolume] = useState(60);
  const [autoSubtitle, setAutoSubtitle] = useState(true);
  const [subtitleLanguage, setSubtitleLanguage] = useState("vi");
  const [customCoverUrl, setCustomCoverUrl] = useState("");

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    showSubtitle: true,
    showHighlightVocabulary: true,
    showTranslation: true,
    subtitleSpeed: "normal",
    subtitlePosition: "middle",
  });

  const [access, setAccess] = useState<AccessSettings>({ visibility: "all", classroomId: "" });
  const [note, setNote] = useState("");

  const handleComingSoon = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  const handleUploadVideo = (_file?: File) => handleComingSoon();

  const handleUploadCover = (file?: File) => {
    if (!file) {
      if (customCoverUrl) URL.revokeObjectURL(customCoverUrl);
      setCustomCoverUrl("");
      return;
    }
    setCustomCoverUrl(URL.createObjectURL(file));
  };

  const goBack = () => navigate(PATHS.learningLibrary);

  const handleSaveDraft = () => {
    notification.success({ message: `Đã lưu nháp "${title || "học liệu mới"}"` });
    goBack();
  };

  const handlePublish = () => {
    if (!title.trim()) {
      notification.warning({ message: "Vui lòng nhập tiêu đề video" });
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
        <span className="text-slate-700">Tạo video hội thoại và từ vựng</span>
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
            className="border-brand text-brand"
            onClick={handleComingSoon}
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
          <BasicInfoSection
            title={title}
            onTitleChange={setTitle}
            language={language}
            onLanguageChange={setLanguage}
            contentType={contentType}
            onContentTypeChange={setContentType}
            level={level}
            onLevelChange={setLevel}
            description={description}
            onDescriptionChange={setDescription}
            durationMinutes={durationMinutes}
            onDurationChange={setDurationMinutes}
            tags={tags}
            onChangeTags={setTags}
          />

          <ScriptContentSection
            contentType={contentType}
            dialogueLines={dialogueLines}
            onChangeDialogueLines={setDialogueLines}
            vocabularyItems={vocabularyItems}
            onChangeVocabularyItems={setVocabularyItems}
          />

          <MediaSection
            onUploadVideo={handleUploadVideo}
            coverTitle={title}
            coverGradient={DEFAULT_COVER_GRADIENT}
            customCoverUrl={customCoverUrl}
            onUploadCover={handleUploadCover}
            onAiGenerateCover={handleComingSoon}
            music={music}
            onMusicChange={setMusic}
            musicVolume={musicVolume}
            onMusicVolumeChange={setMusicVolume}
            autoSubtitle={autoSubtitle}
            onAutoSubtitleChange={setAutoSubtitle}
            subtitleLanguage={subtitleLanguage}
            onSubtitleLanguageChange={setSubtitleLanguage}
          />
        </div>

        <div className="flex flex-col gap-4">
          <VideoPreviewSection
            gradient={DEFAULT_COVER_GRADIENT}
            previewLine={dialogueLines[0]?.lineEn ?? ""}
            onFullscreenPreview={handleComingSoon}
          />

          <DisplaySettingsSection
            value={displaySettings}
            onChange={(patch) => setDisplaySettings((s) => ({ ...s, ...patch }))}
          />

          <AccessSection value={access} onChange={(patch) => setAccess((s) => ({ ...s, ...patch }))} />

          <NoteSection value={note} onChange={setNote} />
        </div>
      </div>
    </div>
  );
};

export default LearningLibraryCreateDialogue;
