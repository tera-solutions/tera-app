export type AudioContentType = "vocabulary" | "dialogue" | "story";

export interface AudioContentItemDraft {
  id: string;
  textEn: string;
  textVi: string;
  startTime: string;
  endTime: string;
}

export interface AdvancedOptions {
  showSubtitle: boolean;
  showPhonetic: boolean;
  pauseBetweenItems: boolean;
  allowDownload: boolean;
}
