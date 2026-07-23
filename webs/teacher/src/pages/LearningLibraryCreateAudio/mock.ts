import type { AudioContentItemDraft } from "./_interface";

export const DEFAULT_CONTENT_ITEMS: AudioContentItemDraft[] = [
  { id: "item-1", textEn: "Dog", textVi: "Con chó", startTime: "00:00.00", endTime: "00:05.20" },
  { id: "item-2", textEn: "Cat", textVi: "Con mèo", startTime: "00:05.21", endTime: "00:10.40" },
  { id: "item-3", textEn: "Cow", textVi: "Con bò", startTime: "00:10.41", endTime: "00:15.80" },
  { id: "item-4", textEn: "Bird", textVi: "Con chim", startTime: "00:15.81", endTime: "00:21.10" },
];

export const DEFAULT_THUMBNAIL_GRADIENT = "from-sky-300 to-emerald-200";
