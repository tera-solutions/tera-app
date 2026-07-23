export type FlashcardViewMode = "card" | "list";

export interface FlashcardDraft {
  id: string;
  emoji: string;
  gradient: string;
  imageUrl: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
}

export interface LearningSettings {
  autoPronounce: boolean;
  showPhonetic: boolean;
  showMeaning: boolean;
  shuffleOnReview: boolean;
}
