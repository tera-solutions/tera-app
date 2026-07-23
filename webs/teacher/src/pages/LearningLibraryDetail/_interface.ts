export type DetailTabKey = "listen" | "read" | "dubbing" | "quiz" | "game";

export interface MaterialDetail {
  id: string;
  title: string;
  formatLabel: string;
  unit: string;
  category: string;
  level: string;
  meta: string;
  usageCount: number;
  rating: number;
  reviewCount: number;
  views: number;
  description: string;
  goal: string;
  audience: string;
  topic: string;
  duration: string;
  tags: string[];
  gradient: string;
}

export interface VocabularyItem {
  id: string;
  emoji: string;
  word: string;
  ipa: string;
  meaning: string;
}

export interface SubtitleLine {
  id: string;
  start: string;
  end: string;
  en: string;
  vi: string;
}

export interface DubbingLine {
  id: string;
  index: number;
  start: string;
  end: string;
  en: string;
  vi: string;
  score: number | null;
}

export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  score: number;
}
