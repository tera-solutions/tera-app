export type MaterialType =
  | "pdf"
  | "document"
  | "image"
  | "video"
  | "audio"
  | "presentation"
  | "worksheet"
  | "homework"
  | "exam"
  | "other";

export type MaterialAccessType = "teacher" | "student" | "parent" | "internal";

export interface MaterialRow {
  id: number;
  code: string;
  name: string;
  type: MaterialType;
  categoryId: number | null;
  categoryName: string | null;
  description: string | null;
  accessType: MaterialAccessType;
  status: string;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MaterialSummary {
  total: number;
  byType: Record<string, number>;
}

export type MaterialSortBy = "material_name" | "material_type" | "created_at" | "updated_at";
export type MaterialSortDir = "asc" | "desc";
