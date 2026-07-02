import { FileAPI, stripExtension } from "@tera/api/common/FileAPI";
import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export interface AttachMaterialPayload {
  lessonId: number | string;
  file_id: number | string;
  material_type: "pdf" | "video" | "audio" | "slide" | "worksheet" | "homework";
}

export interface DetachMaterialPayload {
  id: number | string;
}

export const LessonMaterialAPI = {
  upload: (file: File) =>
    FileAPI.upload(file, { title: stripExtension(file.name) }),

  attach: async ({ lessonId, file_id, material_type }: AttachMaterialPayload) =>
    await api
      .post(`${endpoint}/edu/lesson-plan/lesson/${lessonId}/material/attach`, {
        file_id,
        material_type,
      })
      .then((r) => r.data),

  detach: async ({ id }: DetachMaterialPayload) =>
    await api
      .delete(`${endpoint}/edu/lesson-plan/material/delete/${id}`)
      .then((r) => r.data),
};
