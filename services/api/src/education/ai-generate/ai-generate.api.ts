import { aiEndpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

// ==========================
// ENUMS
// ==========================
export type AiJobStatus =
  | "WAITING"
  | "GENERATING"
  | "DOWNLOADING"
  | "REMOVE_BG"
  | "RESIZE"
  | "THUMBNAIL"
  | "WEBP"
  | "METADATA"
  | "UPLOAD"
  | "SUCCESS"
  | "FAILED"
  | "RETRY";

export type AiJobType =
  | "image"
  | "audio"
  | "video"
  | "story"
  | "dialogue"
  | "lesson"
  | "flashcard"
  | "comic"
  | "mindmap"
  | "ebook";

// ==========================
// SCHEMAS
// ==========================
export interface AiAssetRead {
  id: number;
  vocabulary_id: string;
  type: string;
  path: string;
  width: number | null;
  height: number | null;
  size: number | null;
  checksum: string | null;
}

export interface AiVocabularyRead {
  id: string;
  word: string;
  level: string;
  topic: string;
  subcategory: string | null;
  status: AiJobStatus;
  image_path: string | null;
  audio_path: string | null;
  video_path: string | null;
  story_path: string | null;
  source: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AiJobRead {
  id: number;
  vocabulary_id: string | null;
  type: AiJobType;
  status: AiJobStatus;
  provider: string | null;
  model: string | null;
  retry: number;
  cost: number | null;
  duration: number | null;
  error: string | null;
  created_at: string;
}

export interface AiJobEnqueuedResponse {
  job_id: number;
  status: string;
}

// ==========================
// PAYLOADS
// ==========================
export interface AiGenerateRequestPayload {
  params: {
    vocabulary_id: string;
    prompt_template?: string | null;
    force?: boolean;
  };
}

export interface AiVocabularySearchPayload {
  params: {
    q: string;
    limit?: number;
    offset?: number;
  };
}

export const AiGenerateAPI = {
  // Health
  getHealth: async () =>
    await api.get(`${aiEndpoint}/edu/ai-generate/health`).then((r) => r.data),

  // Image (đã triển khai đầy đủ)
  generateImage: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/image/generate`, params)
      .then((r) => r.data),

  getImageAssets: async ({ id }: DetailPayload) =>
    await api
      .get(`${aiEndpoint}/edu/ai-generate/image/${id}`)
      .then((r) => r.data),

  // Vocabulary (đã triển khai đầy đủ)
  getVocabularyList: async ({ params }: ListPayload) =>
    await api
      .get(`${aiEndpoint}/edu/ai-generate/vocabulary`, { ...params, ...params?.filters })
      .then((r) => r.data),

  searchVocabulary: async ({ params }: AiVocabularySearchPayload) =>
    await api
      .get(`${aiEndpoint}/edu/ai-generate/vocabulary/search`, params)
      .then((r) => r.data),

  getVocabularyDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${aiEndpoint}/edu/ai-generate/vocabulary/${id}`)
      .then((r) => r.data),

  // Job (đã triển khai đầy đủ)
  getJobList: async ({ params }: ListPayload) =>
    await api
      .get(`${aiEndpoint}/edu/ai-generate/jobs`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getJobDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${aiEndpoint}/edu/ai-generate/jobs/${id}`)
      .then((r) => r.data),

  // Video / Audio / Story / Dialogue / Lesson / Flashcard / Ebook / Comic / Mindmap (stub — 501)
  generateVideo: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/video/generate`, params)
      .then((r) => r.data),

  generateAudio: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/audio/generate`, params)
      .then((r) => r.data),

  generateStory: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/story/generate`, params)
      .then((r) => r.data),

  generateDialogue: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/dialogue/generate`, params)
      .then((r) => r.data),

  generateLesson: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/lesson/generate`, params)
      .then((r) => r.data),

  generateFlashcard: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/flashcard/generate`, params)
      .then((r) => r.data),

  generateEbook: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/ebook/generate`, params)
      .then((r) => r.data),

  generateComic: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/comic/generate`, params)
      .then((r) => r.data),

  generateMindmap: async ({ params }: AiGenerateRequestPayload) =>
    await api
      .post(`${aiEndpoint}/edu/ai-generate/mindmap/generate`, params)
      .then((r) => r.data),
};
