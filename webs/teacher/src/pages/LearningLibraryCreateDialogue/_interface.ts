export type DialogueContentType = "dialogue" | "vocabulary";

export interface DialogueLineDraft {
  id: string;
  character: string;
  lineEn: string;
  lineVi: string;
  duration: string;
}

export interface VocabularyItemDraft {
  id: string;
  emoji: string;
  word: string;
  ipa: string;
  meaning: string;
}

export interface DisplaySettings {
  showSubtitle: boolean;
  showHighlightVocabulary: boolean;
  showTranslation: boolean;
  subtitleSpeed: string;
  subtitlePosition: string;
}

export interface AccessSettings {
  visibility: string;
  classroomId: string;
}
