import type { ComicCharacterDraft, ComicFrameDraft } from "./_interface";

export const DEFAULT_CHARACTERS: ComicCharacterDraft[] = [
  { id: "char-1", name: "Tom (Boy)", emoji: "🧒" },
  { id: "char-2", name: "Lucky (Dog)", emoji: "🐶" },
];

export const DEFAULT_FRAMES: ComicFrameDraft[] = [
  { id: "frame-1", gradient: "from-sky-200 to-emerald-100", emoji: "🧒🐶", caption: "Tom has a pet dog. His name is Lucky." },
  { id: "frame-2", gradient: "from-emerald-200 to-lime-100", emoji: "🧒⚽", caption: "They play together in the park." },
  { id: "frame-3", gradient: "from-amber-200 to-orange-100", emoji: "🧒🍖", caption: "Tom gives Lucky some food." },
  { id: "frame-4", gradient: "from-slate-200 to-blue-100", emoji: "🐶💤", caption: "Lucky is happy and takes a nap." },
  { id: "frame-5", gradient: "from-pink-200 to-rose-100", emoji: "🧒👋", caption: "Tom loves his dog very much." },
];

export const DEFAULT_COVER_GRADIENT = "from-sky-300 to-emerald-200";
