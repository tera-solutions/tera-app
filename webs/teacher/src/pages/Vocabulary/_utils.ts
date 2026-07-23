import { aiStorageOrigin } from "@tera/api/_endpoint";
import type { AiVocabularyRead } from "@tera/api";

import type { VocabularyItem, VocabularyListResult, VocabularySummary } from "./_interface";
import { STATUS_GROUP_BY_JOB_STATUS } from "./constants";

const capitalize = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

/** Deterministic asset layout the AI-generate service writes to, e.g.
 * `.../storage/images/vocabulary/PreA1/Food/apple/preview.jpg` — `image_path` on the record
 * isn't reliably populated yet, so the image URL is built from level/topic/word instead. */
const buildVocabularyImageUrl = (level: string, topic: string, word: string, fileName: string) =>
  `${aiStorageOrigin}/storage/images/vocabulary/${encodeURIComponent(level)}/${encodeURIComponent(
    capitalize(topic),
  )}/${encodeURIComponent(word.toLowerCase())}/${fileName}`;

/** Small thumbnail used in table rows/lists. */
export const buildVocabularyThumbnailUrl = (level: string, topic: string, word: string) =>
  buildVocabularyImageUrl(level, topic, word, "thumbnail.jpg");

/** Full-size image used in the preview modal. */
export const buildVocabularyPreviewImageUrl = (level: string, topic: string, word: string) =>
  buildVocabularyImageUrl(level, topic, word, "preview.jpg");

export const toVocabularyItem = (raw: AiVocabularyRead): VocabularyItem => ({
  id: raw.id,
  word: raw.word ?? "",
  level: raw.level ?? "",
  topic: raw.topic ?? "",
  subcategory: raw.subcategory ?? null,
  status: raw.status,
  statusGroup: STATUS_GROUP_BY_JOB_STATUS[raw.status] ?? "processing",
  imagePath: raw.image_path ?? null,
  audioPath: raw.audio_path ?? null,
  videoPath: raw.video_path ?? null,
  storyPath: raw.story_path ?? null,
  createdAt: raw.created_at ?? "",
});

const toItemArray = (raw: any): AiVocabularyRead[] => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

/** List endpoint follows the shared `{ items, pagination|meta }` shape used across the repo. */
export const toVocabularyListResult = (raw: any): VocabularyListResult => {
  const rawItems = toItemArray(raw);
  const pagination = raw?.pagination ?? raw?.meta ?? {};
  return {
    items: rawItems.map(toVocabularyItem),
    total: pagination.total ?? rawItems.length,
    page: pagination.current_page ?? pagination.page ?? 1,
    perPage: pagination.per_page ?? rawItems.length,
  };
};

/** Search endpoint has no pagination meta — just a raw array (or `{ items }`). */
export const toVocabularySearchItems = (raw: any): VocabularyItem[] => toItemArray(raw).map(toVocabularyItem);

/** No dedicated summary endpoint — counted from whatever page is currently loaded. */
export const toVocabularySummary = (total: number, items: VocabularyItem[]): VocabularySummary => ({
  total,
  topicCount: new Set(items.map((i) => i.topic).filter(Boolean)).size,
  successCount: items.filter((i) => i.statusGroup === "success").length,
  processingCount: items.filter((i) => i.statusGroup === "processing").length,
  failedCount: items.filter((i) => i.statusGroup === "failed").length,
});
