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

import type { FlashcardDraft, FlashcardViewMode, LearningSettings } from "./_interface";
import { DEFAULT_CARDS } from "./mock";
import BasicInfoSection from "./components/BasicInfoSection";
import CardDesignSection from "./components/CardDesignSection";
import PreviewSection from "./components/PreviewSection";
import LearningSettingsSection from "./components/LearningSettingsSection";
import NoteSection from "./components/NoteSection";

const LearningLibraryCreateFlashcard = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("Animals Vocabulary");
  const [language, setLanguage] = useState("en");
  const [description, setDescription] = useState("Bộ flashcard giúp trẻ học từ vựng về các loài động vật.");
  const [level, setLevel] = useState("kids_6_8");
  const [tags, setTags] = useState<string[]>(["Animals", "Vocabulary", "Kids"]);
  const [cardCount, setCardCount] = useState(12);

  const [cards, setCards] = useState<FlashcardDraft[]>(DEFAULT_CARDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reverseOnReview, setReverseOnReview] = useState(false);
  const [viewMode, setViewMode] = useState<FlashcardViewMode>("card");

  const [learningSettings, setLearningSettings] = useState<LearningSettings>({
    autoPronounce: true,
    showPhonetic: true,
    showMeaning: true,
    shuffleOnReview: false,
  });

  const [note, setNote] = useState("");

  const goBack = () => navigate(PATHS.learningLibrary);

  const handleComingSoon = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  const handleSaveDraft = () => {
    notification.success({ message: `Đã lưu nháp "${title || "bộ flashcard mới"}"` });
    goBack();
  };

  const handlePublish = () => {
    if (!title.trim()) {
      notification.warning({ message: "Vui lòng nhập tiêu đề bộ flashcard" });
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
        <span className="text-slate-700">Tạo Flashcard</span>
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
            tags={tags}
            onChangeTags={setTags}
            cardCount={cardCount}
            onCardCountChange={setCardCount}
          />

          <CardDesignSection
            cards={cards}
            onChangeCards={setCards}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            reverseOnReview={reverseOnReview}
            onReverseOnReviewChange={setReverseOnReview}
          />
        </div>

        <div className="flex flex-col gap-4">
          <PreviewSection
            cards={cards}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            cardCountTarget={cardCount}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <LearningSettingsSection
            value={learningSettings}
            onChange={(patch) => setLearningSettings((s) => ({ ...s, ...patch }))}
          />

          <NoteSection value={note} onChange={setNote} />
        </div>
      </div>
    </div>
  );
};

export default LearningLibraryCreateFlashcard;
