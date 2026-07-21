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

import type { AdvancedOptions, AudioContentItemDraft, AudioContentType } from "./_interface";
import { DEFAULT_CONTENT_ITEMS, DEFAULT_THUMBNAIL_GRADIENT } from "./mock";
import BasicInfoSection from "./components/BasicInfoSection";
import AudioUploadSection from "./components/AudioUploadSection";
import ContentListSection from "./components/ContentListSection";
import PlaybackSettingsSection from "./components/PlaybackSettingsSection";
import AdvancedOptionsSection from "./components/AdvancedOptionsSection";
import ThumbnailSection from "./components/ThumbnailSection";
import NoteSection from "./components/NoteSection";

const LearningLibraryCreateAudio = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("Animal Sounds – Listen and Learn");
  const [language, setLanguage] = useState("en");
  const [description, setDescription] = useState(
    "Audio giúp trẻ nhận biết và học từ vựng các con vật qua âm thanh.",
  );
  const [level, setLevel] = useState("beginner_6_8");
  const [contentType, setContentType] = useState<AudioContentType>("vocabulary");
  const [duration, setDuration] = useState("02:15");
  const [tags, setTags] = useState<string[]>(["Animals", "Vocabulary", "Kids"]);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [contentItems, setContentItems] = useState<AudioContentItemDraft[]>(DEFAULT_CONTENT_ITEMS);

  const [music, setMusic] = useState("happy_bright");
  const [musicVolume, setMusicVolume] = useState(36);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0");
  const [autoPlay, setAutoPlay] = useState(true);

  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    showSubtitle: false,
    showPhonetic: true,
    pauseBetweenItems: true,
    allowDownload: false,
  });

  const [customThumbnailUrl, setCustomThumbnailUrl] = useState("");
  const [note, setNote] = useState("");

  const goBack = () => navigate(PATHS.learningLibrary);

  const handleComingSoon = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  const handleUploadThumbnail = (file?: File) => {
    if (!file) {
      if (customThumbnailUrl) URL.revokeObjectURL(customThumbnailUrl);
      setCustomThumbnailUrl("");
      return;
    }
    setCustomThumbnailUrl(URL.createObjectURL(file));
  };

  const handleSaveDraft = () => {
    notification.success({ message: `Đã lưu nháp "${title || "audio mới"}"` });
    goBack();
  };

  const handlePublish = () => {
    if (!title.trim()) {
      notification.warning({ message: "Vui lòng nhập tiêu đề audio" });
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
        <span className="text-slate-700">Tạo audio</span>
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
          <Button outlined icon={<EyeOutlined />} className="border-brand text-brand" onClick={handleComingSoon}>
            Xem trước
          </Button>
          <Button icon={<PaperAirplaneOutlined />} className="bg-brand hover:bg-brand/80" onClick={handlePublish}>
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
            description={description}
            onDescriptionChange={setDescription}
            level={level}
            onLevelChange={setLevel}
            contentType={contentType}
            onContentTypeChange={setContentType}
            duration={duration}
            onDurationChange={setDuration}
            tags={tags}
            onChangeTags={setTags}
          />

          <AudioUploadSection
            file={audioFile}
            onUpload={(file) => setAudioFile(file ?? null)}
            onRemove={() => setAudioFile(null)}
          />

          <ContentListSection items={contentItems} onChange={setContentItems} />
        </div>

        <div className="flex flex-col gap-4">
          <PlaybackSettingsSection
            music={music}
            onMusicChange={setMusic}
            musicVolume={musicVolume}
            onMusicVolumeChange={setMusicVolume}
            playbackSpeed={playbackSpeed}
            onPlaybackSpeedChange={setPlaybackSpeed}
            autoPlay={autoPlay}
            onAutoPlayChange={setAutoPlay}
          />

          <AdvancedOptionsSection
            value={advancedOptions}
            onChange={(patch) => setAdvancedOptions((s) => ({ ...s, ...patch }))}
          />

          <ThumbnailSection
            title={title}
            gradient={DEFAULT_THUMBNAIL_GRADIENT}
            customImageUrl={customThumbnailUrl}
            onUpload={handleUploadThumbnail}
            onRemove={() => handleUploadThumbnail(undefined)}
          />

          <NoteSection value={note} onChange={setNote} />
        </div>
      </div>
    </div>
  );
};

export default LearningLibraryCreateAudio;
