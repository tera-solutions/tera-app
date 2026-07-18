import type { MaterialRow, MaterialSummary, MaterialType } from "./_interface";

export const toMaterials = (raw: any): MaterialRow[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    code: item.material_code,
    name: item.material_name,
    type: (item.material_type ?? "other") as MaterialType,
    categoryId: item.category_id ?? null,
    categoryName: item.category?.category_name ?? null,
    description: item.description ?? null,
    accessType: item.access_type ?? "teacher",
    status: item.status ?? "draft",
    fileId: item.current_file?.file_id ?? null,
    fileName: item.current_file?.file_name ?? null,
    fileSize: item.current_file?.file_size ?? null,
    mimeType: item.current_file?.mime_type ?? null,
    createdAt: item.created_at ?? null,
    updatedAt: item.updated_at ?? null,
  }));

export const summarizeMaterials = (items: MaterialRow[]): MaterialSummary => {
  const byType: Record<string, number> = {};
  items.forEach((item) => {
    byType[item.type] = (byType[item.type] ?? 0) + 1;
  });
  return { total: items.length, byType };
};

export const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
