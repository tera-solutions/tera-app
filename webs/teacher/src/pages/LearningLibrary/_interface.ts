export type ResourceType =
  | "video"
  | "lesson_plan"
  | "worksheet"
  | "flashcard"
  | "audio"
  | "game"
  | "comic"
  | "dialogue";

export interface LibraryResource {
  id: string;
  title: string;
  type: ResourceType;
  /** Badge text shown on the thumbnail, e.g. "Video" | "PDF" | "PPT" | "DOCX". */
  formatLabel: string;
  unit: string;
  level: string;
  /** Duration/length line, e.g. "15 phút" | "20 trang" | "24 slide". */
  meta: string;
  views: number;
  likes: number;
  rating: number;
  usageCount: number;
  category: string;
  updatedAt: string;
  ownerName: string;
  /** Tailwind gradient classes for the thumbnail placeholder. */
  gradient: string;
}

export interface RecentLibraryItem {
  id: string;
  title: string;
  type: ResourceType;
  updatedAt: string;
  ownerName: string;
}

export interface StorageSegment {
  key: string;
  label: string;
  color: string;
  gb: number;
}
