import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined, Button, ChevronRightOutlined, DocumentTextOutlined, PaperAirplaneOutlined, notification } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import type {
  ContentConfigTabKey,
  FeatureToggles,
  GameConfigDraft,
  QuizQuestionDraft,
  ReadingPageDraft,
  SubtitleConfig,
} from "./_interface";
import BasicInfoSection from "./components/BasicInfoSection";
import ResourceUploadSection from "./components/ResourceUploadSection";
import ContentConfigSection from "./components/ContentConfigSection";
import ClassificationSection from "./components/ClassificationSection";
import FeatureToggleSection from "./components/FeatureToggleSection";
import NoteSection from "./components/NoteSection";

let draftIdCounter = 0;
const nextDraftId = (prefix: string) => `${prefix}-${++draftIdCounter}`;

const createEmptyQuestion = (): QuizQuestionDraft => ({
  id: nextDraftId("question"),
  question: "",
  options: [
    { id: nextDraftId("option"), text: "" },
    { id: nextDraftId("option"), text: "" },
    { id: nextDraftId("option"), text: "" },
    { id: nextDraftId("option"), text: "" },
  ],
  correctOptionId: "",
});

const createEmptyPage = (): ReadingPageDraft => ({
  id: nextDraftId("page"),
  title: "",
  content: "",
});

const LearningLibraryCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "video";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");

  const [materialType, setMaterialType] = useState(initialType);
  const [level, setLevel] = useState("beginner");
  const [unit, setUnit] = useState("unit5");
  const [tags, setTags] = useState<string[]>(["Animals", "Vocabulary", "Kids"]);

  const [toggles, setToggles] = useState<FeatureToggles>({
    aiDubbing: true,
    quiz: true,
    game: true,
    publicVisible: false,
  });

  const [activeConfigTab, setActiveConfigTab] = useState<ContentConfigTabKey>("subtitles");
  const [subtitle, setSubtitle] = useState<SubtitleConfig>({
    english: true,
    vietnamese: true,
    displayMode: "bilingual",
    fileName: "",
  });
  const [readingPages, setReadingPages] = useState<ReadingPageDraft[]>([createEmptyPage()]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionDraft[]>([createEmptyQuestion()]);
  const [quizTimeLimit, setQuizTimeLimit] = useState(5);
  const [gameConfig, setGameConfig] = useState<GameConfigDraft>({
    gameType: "word_catcher",
    vocabulary: ["Dog", "Cat", "Woof", "Pet"],
    playSeconds: 60,
    rewardCoins: 50,
  });

  const [note, setNote] = useState("");

  const handleAddReadingPage = () => setReadingPages((pages) => [...pages, createEmptyPage()]);
  const handleChangeReadingPage = (id: string, patch: Partial<ReadingPageDraft>) =>
    setReadingPages((pages) => pages.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const handleRemoveReadingPage = (id: string) =>
    setReadingPages((pages) => (pages.length > 1 ? pages.filter((p) => p.id !== id) : pages));

  const handleAddQuizQuestion = () => setQuizQuestions((qs) => [...qs, createEmptyQuestion()]);
  const handleChangeQuizQuestion = (id: string, patch: Partial<QuizQuestionDraft>) =>
    setQuizQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  const handleRemoveQuizQuestion = (id: string) =>
    setQuizQuestions((qs) => (qs.length > 1 ? qs.filter((q) => q.id !== id) : qs));
  const handleChangeQuizOption = (questionId: string, optionId: string, text: string) =>
    setQuizQuestions((qs) =>
      qs.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, text } : o)) }
          : q,
      ),
    );
  const handleSelectCorrectOption = (questionId: string, optionId: string) =>
    setQuizQuestions((qs) =>
      qs.map((q) => (q.id === questionId ? { ...q, correctOptionId: optionId } : q)),
    );

  const goBack = () => navigate(PATHS.learningLibrary);

  const handleSaveDraft = () => {
    notification.success({ message: `Đã lưu nháp "${title || "học liệu mới"}"` });
    goBack();
  };

  const handlePublish = () => {
    if (!title.trim()) {
      notification.warning({ message: "Vui lòng nhập tiêu đề bài học" });
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
        <span className="text-slate-700">Tạo mới học liệu</span>
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
            description={description}
            onDescriptionChange={setDescription}
            objectives={objectives}
            onObjectivesChange={setObjectives}
          />

          <ResourceUploadSection />

          <ContentConfigSection
            activeTab={activeConfigTab}
            onTabChange={setActiveConfigTab}
            toggles={toggles}
            subtitle={subtitle}
            onChangeSubtitle={(patch) => setSubtitle((s) => ({ ...s, ...patch }))}
            readingPages={readingPages}
            onChangeReadingPage={handleChangeReadingPage}
            onAddReadingPage={handleAddReadingPage}
            onRemoveReadingPage={handleRemoveReadingPage}
            quizQuestions={quizQuestions}
            quizTimeLimit={quizTimeLimit}
            onChangeQuizTimeLimit={setQuizTimeLimit}
            onChangeQuizQuestion={handleChangeQuizQuestion}
            onChangeQuizOption={handleChangeQuizOption}
            onSelectCorrectOption={handleSelectCorrectOption}
            onAddQuizQuestion={handleAddQuizQuestion}
            onRemoveQuizQuestion={handleRemoveQuizQuestion}
            gameConfig={gameConfig}
            onChangeGameConfig={(patch) => setGameConfig((g) => ({ ...g, ...patch }))}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ClassificationSection
            materialType={materialType}
            onChangeMaterialType={setMaterialType}
            level={level}
            onChangeLevel={setLevel}
            unit={unit}
            onChangeUnit={setUnit}
            tags={tags}
            onChangeTags={setTags}
          />

          <FeatureToggleSection value={toggles} onChange={(patch) => setToggles((t) => ({ ...t, ...patch }))} />

          <NoteSection value={note} onChange={setNote} />
        </div>
      </div>
    </div>
  );
};

export default LearningLibraryCreate;
