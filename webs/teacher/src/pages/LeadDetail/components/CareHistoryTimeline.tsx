import moment from "moment";

import EmptyState from "_common/components/EmptyState";
import { useMeta } from "_common/hooks/useMeta";

import type { LeadHistoryEntry } from "../_interface";
import { HISTORY_ACTION_LABEL } from "../_utils";

interface CareHistoryTimelineProps {
  histories: LeadHistoryEntry[];
  loading?: boolean;
}

const fmtDateTime = (value: string) => (value ? moment(value).format("DD/MM HH:mm") : "—");

const CareHistoryTimeline = ({ histories, loading }: CareHistoryTimelineProps) => {
  const { getLabel } = useMeta();

  if (!loading && histories.length === 0) {
    return <EmptyState description="Chưa có lịch sử chăm sóc" className="py-8" />;
  }

  return (
    <ol className="flex flex-col gap-3">
      {histories.map((h) => (
        <li key={h.id} className="flex gap-3">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
          <div className="min-w-0 flex-1 border-b border-slate-50 pb-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <p className="text-sm font-medium text-slate-700">
                {HISTORY_ACTION_LABEL[h.action] ?? h.action}
                {h.to_status && (
                  <span className="ml-1 font-normal text-slate-400">
                    {h.from_status ? `${getLabel("lead_status", h.from_status)} → ` : ""}
                    {getLabel("lead_status", h.to_status)}
                  </span>
                )}
              </p>
              <span className="shrink-0 text-xs text-slate-400">{fmtDateTime(h.created_at)}</span>
            </div>
            {(h.note || h.reason) && (
              <p className="mt-0.5 text-xs text-slate-500">{h.note || h.reason}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default CareHistoryTimeline;
