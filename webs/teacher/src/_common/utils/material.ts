import type { AttachMaterialPayload } from "@tera/api";

/** Maps a filename's extension to the backend's fixed `material_type` enum. */
export const MATERIAL_TYPE_BY_EXT: Record<string, string> = {
  pdf: "pdf",
  mp4: "video",
  mov: "video",
  avi: "video",
  mkv: "video",
  webm: "video",
  mp3: "audio",
  wav: "audio",
  m4a: "audio",
  ppt: "slide",
  pptx: "slide",
  doc: "worksheet",
  docx: "worksheet",
  jpg: "worksheet",
  jpeg: "worksheet",
  png: "worksheet",
};

export const materialTypeOf = (
  name: string,
): AttachMaterialPayload["material_type"] => {
  const match = name.match(/\.([a-z0-9]+)$/i);
  const ext = match ? match[1].toLowerCase() : "";
  return (MATERIAL_TYPE_BY_EXT[ext] ??
    "worksheet") as AttachMaterialPayload["material_type"];
};
