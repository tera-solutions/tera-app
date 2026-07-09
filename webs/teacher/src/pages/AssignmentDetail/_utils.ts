import type { AssignmentAttachment, AssignmentDetailData } from "./_interface";

export const toAssignmentDetail = (raw: any): AssignmentDetailData | undefined => {
  const assignment = raw?.assignment;
  if (!assignment?.id) return undefined;
  return {
    id: assignment.id,
    code: assignment.assignment_code ?? "",
    name: assignment.assignment_name ?? "",
    type: assignment.assignment_type ?? "",
    instruction: assignment.instruction ?? "",
    class_name: assignment.class?.name ?? "",
    due_date: assignment.due_date ?? "",
    max_score: assignment.max_score ?? 0,
    status: (assignment.status ?? "draft") as AssignmentDetailData["status"],
    progress: {
      total: raw.progress?.total ?? 0,
      submitted: raw.progress?.submitted ?? 0,
      graded: raw.progress?.graded ?? 0,
      pending: raw.progress?.pending ?? 0,
    },
  };
};

export const toAssignmentAttachments = (raw: any[] | null | undefined): AssignmentAttachment[] =>
  (raw ?? []).map((item) => ({
    id: item.id ?? 0,
    name: item.material_name ?? "",
    type: item.material_type ?? "",
    file_id: item.current_file?.file_id ?? null,
    file_name: item.current_file?.file_name ?? "",
  }));
