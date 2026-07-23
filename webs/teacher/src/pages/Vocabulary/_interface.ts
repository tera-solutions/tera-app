import type { AiJobStatus } from "@tera/api";

/** 11 job-pipeline statuses bucketed into 3 groups the UI actually needs. */
export type VocabularyStatusGroup = "success" | "processing" | "failed";

export interface VocabularyItem {
  id: string;
  word: string;
  level: string;
  topic: string;
  subcategory: string | null;
  status: AiJobStatus;
  statusGroup: VocabularyStatusGroup;
  imagePath: string | null;
  audioPath: string | null;
  videoPath: string | null;
  storyPath: string | null;
  createdAt: string;
}

export interface VocabularyListResult {
  items: VocabularyItem[];
  total: number;
  page: number;
  perPage: number;
}

/** Derived from the currently loaded page — `ai-generate` has no dedicated summary endpoint. */
export interface VocabularySummary {
  total: number;
  topicCount: number;
  successCount: number;
  processingCount: number;
  failedCount: number;
}
