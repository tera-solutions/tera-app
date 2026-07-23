import type { LeadDetail, LeadHistoryEntry } from "./_interface";

export const toLeadDetail = (raw: any): LeadDetail | null => {
  if (!raw) return null;
  return {
    id: raw.id ?? 0,
    code: raw.code ?? "",
    name: raw.name ?? "",
    gender: raw.gender ?? "",
    dob: raw.dob ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    source: raw.source ?? "",
    status: raw.status ?? "",
    note: raw.note ?? "",
    owner_id: raw.owner_id ?? null,
    owner_name: raw.owner?.name ?? "",
    branch_id: raw.branch_id ?? null,
    branch_name: raw.branch?.name ?? "",
    guardians: (raw.guardians ?? []).map((g: any) => ({
      id: g.id ?? 0,
      full_name: g.full_name ?? "",
      relationship: g.relationship ?? "",
      phone: g.phone ?? "",
      email: g.email ?? "",
    })),
    students: (raw.students ?? []).map((s: any) => ({
      id: s.id ?? 0,
      code: s.code ?? "",
      name: s.name ?? "",
      relationship: s.relationship ?? "",
    })),
    courses: (raw.courses ?? []).map((c: any) => ({ id: c.id ?? 0, code: c.code ?? "", name: c.name ?? "" })),
    created_at: raw.created_at ?? "",
  };
};

export const toLeadHistories = (raw: any[] | null | undefined): LeadHistoryEntry[] =>
  (raw ?? []).map((h) => ({
    id: h.id ?? 0,
    action: h.action ?? "",
    from_status: h.from_status ?? null,
    to_status: h.to_status ?? null,
    reason: h.reason ?? null,
    note: h.note ?? null,
    created_at: h.created_at ?? "",
  }));

export const HISTORY_ACTION_LABEL: Record<string, string> = {
  created: "Tạo lead",
  updated: "Cập nhật thông tin",
  status_changed: "Đổi trạng thái",
  owner_changed: "Đổi người phụ trách",
  suspended: "Ngừng theo dõi",
  restored: "Khôi phục theo dõi",
  converted: "Chuyển đổi thành học viên",
};
