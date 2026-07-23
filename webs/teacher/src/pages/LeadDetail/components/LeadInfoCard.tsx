import { ReactNode } from "react";
import moment from "moment";
import { Select } from "tera-dls";

import Card from "_common/components/Card";
import StatusBadge from "_common/components/StatusBadge";
import { useMeta } from "_common/hooks/useMeta";

import type { LeadDetail } from "../_interface";
import { SOURCE_LABEL } from "pages/Leads/constants";

interface LeadInfoCardProps {
  lead: LeadDetail;
  onStatusChange: (status: string) => void;
  statusChanging?: boolean;
}

const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-center justify-between py-1.5 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

const fmtDate = (value: string) => (value ? moment(value).format("DD/MM/YYYY") : "—");

const LeadInfoCard = ({ lead, onStatusChange, statusChanging }: LeadInfoCardProps) => {
  const { getOptions } = useMeta();
  // "inactive" (Không tiềm năng) is only reachable via suspend, which asks for
  // a reason — kept out of this quick picker on purpose.
  const statusOptions = getOptions("lead_status").filter((o) => o.value !== "inactive");

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Thông tin lead</p>
        <StatusBadge name="lead_status" value={lead.status} />
      </div>

      <InfoRow label="Họ tên" value={lead.name || "—"} />
      <InfoRow label="Mã lead" value={lead.code || "—"} />
      <InfoRow label="SĐT" value={lead.phone || "—"} />
      <InfoRow label="Email" value={lead.email || "—"} />
      <InfoRow label="Nguồn" value={SOURCE_LABEL[lead.source] ?? lead.source ?? "—"} />
      <InfoRow label="Người phụ trách" value={lead.owner_name || "—"} />
      <InfoRow label="Chi nhánh" value={lead.branch_name || "—"} />
      <InfoRow label="Ngày sinh" value={lead.dob ? fmtDate(lead.dob) : "—"} />
      <InfoRow label="Ngày tạo" value={fmtDate(lead.created_at)} />
      <InfoRow
        label="Quan tâm"
        value={lead.courses.length ? lead.courses.map((c) => c.name).join(", ") : "—"}
      />

      {lead.status !== "inactive" && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="mb-1.5 text-xs text-slate-400">Đổi trạng thái</p>
          <Select
            value={lead.status}
            disabled={statusChanging}
            options={statusOptions.map((o) => ({ value: o.value, label: o.label }))}
            onChange={(v: any) => v && v !== lead.status && onStatusChange(v)}
          />
        </div>
      )}

      {lead.note && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-400">Ghi chú</p>
          <p className="mt-1 text-sm text-slate-700">{lead.note}</p>
        </div>
      )}
    </Card>
  );
};

export default LeadInfoCard;
