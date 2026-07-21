export interface ComicCharacterDraft {
  id: string;
  name: string;
  emoji: string;
}

export interface ComicFrameDraft {
  id: string;
  gradient: string;
  emoji: string;
  caption: string;
}

export interface DialogTextSettings {
  font: string;
  fontSize: string;
  textColor: string;
  uppercaseTitle: boolean;
  boldKeyVocabulary: boolean;
  bubbleStyle: string;
}

export interface ComicVisualSettings {
  artStyle: string;
  frameLayout: string;
  themeColor: string;
}

export interface VoiceAudioSettings {
  enabled: boolean;
  voice: string;
  music: string;
  musicVolume: number;
}
