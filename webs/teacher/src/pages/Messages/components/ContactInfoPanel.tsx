import { DocumentTextOutlined, EnvelopeOutlined, PhoneOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";

import type { Conversation } from "../_interface";

interface ContactInfoPanelProps {
  conversation: Conversation | null;
}

const ROLE_LABEL: Record<string, string> = { parent: "Phụ huynh", student: "Học viên" };

const ContactInfoPanel = ({ conversation }: ContactInfoPanelProps) => {
  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <EmptyState description="Chọn một hội thoại để xem thông tin" />
      </div>
    );
  }

  const attachments = conversation.messages.flatMap((m) => m.attachments);

  return (
    <div className="flex h-full flex-col gap-4 border-l border-slate-100 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar src={conversation.contact.avatar} alt={conversation.contact.name} sizeClassName="h-16 w-16" />
        <p className="font-semibold text-slate-800">{conversation.contact.name}</p>
        <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">
          {ROLE_LABEL[conversation.contact.role] ?? conversation.contact.role}
        </Badge>
      </div>

      <div className="flex flex-col gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-slate-400">
          <EnvelopeOutlined />
          <span className="truncate">{conversation.contact.email || "—"}</span>
        </div>
        <div className="flex items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-slate-400">
          <PhoneOutlined />
          <span>{conversation.contact.phone || "—"}</span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Tài liệu đính kèm</p>
        {attachments.length === 0 ? (
          <p className="text-xs text-slate-400">Chưa có tệp nào được chia sẻ</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-xs text-slate-600 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-slate-400"
              >
                <DocumentTextOutlined />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoPanel;
