import { useState } from "react";
import { notification } from "tera-dls";
import classNames from "classnames";

import Card from "_common/components/Card";

import type { DetailTabKey } from "./_interface";
import { DETAIL_TABS } from "./constants";
import {
  ANSWERED_OPTION_BY_QUESTION,
  DUBBING_LINES,
  LEADERBOARD_ENTRIES,
  MATERIAL_DETAIL,
  QUIZ_QUESTIONS,
  READ_PAGES,
  SUBTITLE_LINES,
  VOCABULARY_ITEMS,
} from "./mock";
import DetailHeader from "./components/DetailHeader";
import DescriptionCard from "./components/DescriptionCard";
import ListenTab from "./components/tabs/ListenTab";
import ReadTab from "./components/tabs/ReadTab";
import DubbingTab from "./components/tabs/DubbingTab";
import QuizTab from "./components/tabs/QuizTab";
import GameTab from "./components/tabs/GameTab";

const LearningLibraryDetail = () => {
  const [activeTab, setActiveTab] = useState<DetailTabKey>("listen");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleComingSoon = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <div className="p-4 xmd:p-6">
      <DetailHeader
        detail={MATERIAL_DETAIL}
        isFavorite={isFavorite}
        onUse={handleComingSoon}
        onDownload={handleComingSoon}
        onShare={handleComingSoon}
        onToggleFavorite={() => setIsFavorite((f) => !f)}
      />

      <Card className="mb-4">
        <div className="flex flex-wrap gap-1.5">
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={classNames(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors [&_svg]:h-4 [&_svg]:w-4",
                activeTab === tab.key ? "bg-brand text-white" : "text-slate-500 hover:bg-slate-50",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {activeTab === "listen" && <ListenTab lines={SUBTITLE_LINES} />}
      {activeTab === "read" && (
        <ReadTab pages={READ_PAGES} vocabulary={VOCABULARY_ITEMS} onViewAllVocabulary={handleComingSoon} />
      )}
      {activeTab === "dubbing" && <DubbingTab lines={DUBBING_LINES} />}
      {activeTab === "quiz" && (
        <QuizTab questions={QUIZ_QUESTIONS} initialAnswers={ANSWERED_OPTION_BY_QUESTION} initialIndex={2} />
      )}
      {activeTab === "game" && <GameTab leaderboard={LEADERBOARD_ENTRIES} />}

      <DescriptionCard detail={MATERIAL_DETAIL} />
    </div>
  );
};

export default LearningLibraryDetail;
