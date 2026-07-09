export const ASSIGNMENT_STATUS_META = "assignment_status";
export const ASSIGNMENT_TYPE_META = "assignment_type";

export const DEFAULT_FORM_VALUES = {
  assignment_name: "",
  assignment_type: "homework",
  avatar: "",
  description: "",
  instruction: "",
  due_date: "",
  max_score: 10,
  course_id: undefined,
  class_room_id: undefined,
  level_id: undefined,
  lesson_id: undefined,
  allow_late_submission: false,
  allow_multiple_submission: false,
};

export const ATTACHMENT_ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png";
export const ATTACHMENT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

/** Maps a filename's extension to the generic `material_type` enum (pdf/document/image/video/audio/presentation/worksheet/homework/exam/other). */
const MATERIAL_TYPE_BY_EXT: Record<string, string> = {
  pdf: "pdf",
  doc: "document",
  docx: "document",
  ppt: "presentation",
  pptx: "presentation",
  jpg: "image",
  jpeg: "image",
  png: "image",
  mp4: "video",
  mov: "video",
  mp3: "audio",
  wav: "audio",
};

export const materialTypeOf = (name: string): string => {
  const match = name.match(/\.([a-z0-9]+)$/i);
  const ext = match ? match[1].toLowerCase() : "";
  return MATERIAL_TYPE_BY_EXT[ext] ?? "other";
};
