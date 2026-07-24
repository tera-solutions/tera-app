import { useState } from "react";
import moment from "moment";
import { Button, DatePicker, notification, PlusOutlined, Select, TextArea } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import { useMeta } from "_common/hooks/useMeta";
import { LeadService } from "@tera/modules/crm";

import type { LeadHistoryEntry } from "../_interface";
import { HISTORY_ACTION_LABEL } from "../_utils";

interface CareHistoryTimelineProps {
  leadId: number;
  histories: LeadHistoryEntry[];
  loading?: boolean;
}

const CARE_LOG_TYPE_OPTIONS = [
  { value: "note", label: "Ghi chú" },
  { value: "call", label: "Cuộc gọi" },
  { value: "appointment", label: "Hẹn tư vấn" },
];

const fmtDateTime = (value: string) => (value ? moment(value).format("DD/MM HH:mm") : "—");

const AddCareLogForm = ({ leadId, onDone }: { leadId: number; onDone: () => void }) => {
  const [type, setType] = useState("note");
  const [content, setContent] = useState("");
  const [nextAppointment, setNextAppointment] = useState<moment.Moment | null>(null);

  const { mutate: addHistory, isPending } = LeadService.useLeadAddHistory();

  const handleSubmit = () => {
    if (!content.trim()) {
      notification.warning({ message: "Vui lòng nhập nội dung" });
      return;
    }
    addHistory(
      {
        id: leadId,
        params: {
          type,
          content: content.trim(),
          next_appointment: nextAppointment ? nextAppointment.toISOString() : undefined,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Đã thêm ghi chú" });
          onDone();
        },
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể thêm ghi chú" }),
      },
    );
  };

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-xl border border-slate-100 p-3">
      <Select value={type} options={CARE_LOG_TYPE_OPTIONS} onChange={(v: any) => setType(v)} />
      <TextArea
        placeholder="Nội dung ghi chú, cuộc gọi hoặc lịch hẹn..."
        rows={2}
        value={content}
        onChange={(e: any) => setContent(e.target.value)}
      />
      <DatePicker
        showTime
        placeholder="Hẹn tư vấn tiếp theo (nếu có)"
        className="w-full"
        value={nextAppointment ?? undefined}
        onChange={(v: any) => setNextAppointment(v ? moment(v) : null)}
      />
      <div className="flex justify-end gap-2">
        <Button outlined onClick={onDone} className="text-slate-500 border-slate-200">
          Hủy
        </Button>
        <Button onClick={handleSubmit} loading={isPending}>
          Lưu
        </Button>
      </div>
    </div>
  );
};

const CareHistoryTimeline = ({ leadId, histories, loading }: CareHistoryTimelineProps) => {
  const { getLabel } = useMeta();
  const [adding, setAdding] = useState(false);

  return (
    <>
      <div className="mb-3 flex items-center justify-end">
        {!adding && (
          <Button
            outlined
            icon={<PlusOutlined />}
            onClick={() => setAdding(true)}
            className="whitespace-nowrap px-3 py-1.5 text-xs"
          >
            Thêm ghi chú
          </Button>
        )}
      </div>

      {adding && <AddCareLogForm leadId={leadId} onDone={() => setAdding(false)} />}

      {!loading && histories.length === 0 ? (
        <EmptyState description="Chưa có lịch sử chăm sóc" className="py-8" />
      ) : (
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
      )}
    </>
  );
};

export default CareHistoryTimeline;
