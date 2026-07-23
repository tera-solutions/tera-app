import classNames from "classnames";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";

import type {
  ContentConfigTabKey,
  FeatureToggles,
  GameConfigDraft,
  QuizQuestionDraft,
  ReadingPageDraft,
  SubtitleConfig,
} from "../_interface";
import { CONTENT_CONFIG_TABS } from "../constants";
import SubtitlesTab from "./content-tabs/SubtitlesTab";
import ReadingMaterialTab from "./content-tabs/ReadingMaterialTab";
import QuizConfigTab from "./content-tabs/QuizConfigTab";
import GameConfigTab from "./content-tabs/GameConfigTab";

interface ContentConfigSectionProps {
  activeTab: ContentConfigTabKey;
  onTabChange: (tab: ContentConfigTabKey) => void;
  toggles: FeatureToggles;
  subtitle: SubtitleConfig;
  onChangeSubtitle: (patch: Partial<SubtitleConfig>) => void;
  readingPages: ReadingPageDraft[];
  onChangeReadingPage: (id: string, patch: Partial<ReadingPageDraft>) => void;
  onAddReadingPage: () => void;
  onRemoveReadingPage: (id: string) => void;
  quizQuestions: QuizQuestionDraft[];
  quizTimeLimit: number;
  onChangeQuizTimeLimit: (minutes: number) => void;
  onChangeQuizQuestion: (id: string, patch: Partial<QuizQuestionDraft>) => void;
  onChangeQuizOption: (questionId: string, optionId: string, text: string) => void;
  onSelectCorrectOption: (questionId: string, optionId: string) => void;
  onAddQuizQuestion: () => void;
  onRemoveQuizQuestion: (id: string) => void;
  gameConfig: GameConfigDraft;
  onChangeGameConfig: (patch: Partial<GameConfigDraft>) => void;
}

const ContentConfigSection = ({
  activeTab,
  onTabChange,
  toggles,
  subtitle,
  onChangeSubtitle,
  readingPages,
  onChangeReadingPage,
  onAddReadingPage,
  onRemoveReadingPage,
  quizQuestions,
  quizTimeLimit,
  onChangeQuizTimeLimit,
  onChangeQuizQuestion,
  onChangeQuizOption,
  onSelectCorrectOption,
  onAddQuizQuestion,
  onRemoveQuizQuestion,
  gameConfig,
  onChangeGameConfig,
}: ContentConfigSectionProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-800">3. Cấu hình nội dung</p>

    <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-100">
      {CONTENT_CONFIG_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={classNames(
            "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors [&_svg]:h-4 [&_svg]:w-4",
            activeTab === tab.key
              ? "border-brand text-brand"
              : "border-transparent text-slate-500 hover:text-slate-700",
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>

    {activeTab === "subtitles" && <SubtitlesTab value={subtitle} onChange={onChangeSubtitle} />}

    {activeTab === "reading" && (
      <ReadingMaterialTab
        pages={readingPages}
        onChangePage={onChangeReadingPage}
        onAddPage={onAddReadingPage}
        onRemovePage={onRemoveReadingPage}
      />
    )}

    {activeTab === "quiz" &&
      (toggles.quiz ? (
        <QuizConfigTab
          questions={quizQuestions}
          timeLimitMinutes={quizTimeLimit}
          onChangeTimeLimit={onChangeQuizTimeLimit}
          onChangeQuestion={onChangeQuizQuestion}
          onChangeOption={onChangeQuizOption}
          onSelectCorrectOption={onSelectCorrectOption}
          onAddQuestion={onAddQuizQuestion}
          onRemoveQuestion={onRemoveQuizQuestion}
        />
      ) : (
        <EmptyState description={'Bật "Enable Quiz" ở mục Tùy chọn & Tính năng để cấu hình câu hỏi'} />
      ))}

    {activeTab === "game" &&
      (toggles.game ? (
        <GameConfigTab value={gameConfig} onChange={onChangeGameConfig} />
      ) : (
        <EmptyState description={'Bật "Enable Game Mode" ở mục Tùy chọn & Tính năng để cấu hình trò chơi'} />
      ))}
  </Card>
);

export default ContentConfigSection;
