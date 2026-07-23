import type { LeadRow, LeadSummary } from "./_interface";

export const toLeadRows = (raw: any[] | null | undefined): LeadRow[] =>
  (raw ?? []).map((l) => ({
    id: l.id ?? 0,
    code: l.code ?? "",
    name: l.name ?? "",
    phone: l.phone ?? "",
    email: l.email ?? "",
    source: l.source ?? "",
    status: l.status ?? "",
    owner_id: l.owner_id ?? null,
    owner_name: l.owner?.name ?? "",
    created_at: l.created_at ?? "",
  }));

/** Counts from the current filtered page's totals aren't right for stat cards
 * (they'd only reflect the visible page) — the caller passes the unfiltered,
 * business-wide list here instead. */
export const toLeadSummary = (rows: LeadRow[]): LeadSummary => ({
  total: rows.length,
  pending: rows.filter((r) => r.status === "pending").length,
  verified: rows.filter((r) => r.status === "verified").length,
  consulting: rows.filter((r) => r.status === "consulting").length,
  studying: rows.filter((r) => r.status === "studying").length,
});
