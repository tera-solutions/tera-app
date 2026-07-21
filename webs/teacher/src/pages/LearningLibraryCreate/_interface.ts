export type ContentConfigTabKey = "subtitles" | "reading" | "quiz" | "game";

export interface SubtitleConfig {
  english: boolean;
  vietnamese: boolean;
  displayMode: string;
  fileName: string;
}

export interface ReadingPageDraft {
  id: string;
  title: string;
  content: string;
}

export interface QuizOptionDraft {
  id: string;
  text: string;
}

export interface QuizQuestionDraft {
  id: string;
  question: string;
  options: QuizOptionDraft[];
  correctOptionId: string;
}

export interface GameConfigDraft {
  gameType: string;
  vocabulary: string[];
  playSeconds: number;
  rewardCoins: number;
}

export interface FeatureToggles {
  aiDubbing: boolean;
  quiz: boolean;
  game: boolean;
  publicVisible: boolean;
}
