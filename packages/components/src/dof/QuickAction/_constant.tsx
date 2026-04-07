import {
  ChatBubbleLeftOutlined,
  ChatBubbleOvalLeftEllipsisOutlined,
  CheckBadgeOutlined,
  ClipboardDocumentListOutlined,
  ClockOutlined,
  EnvelopeOutlined,
  PaperClipOutlined,
  PhoneOutlined,
} from "tera-dls";

const iconClasses = "w-5 h-5";
export const dataMenu = [
  {
    key: "activity-log",
    label: "Lịch sử hoạt động",
    icon: <ClockOutlined className={iconClasses} />,
  },
  {
    key: "comment",
    label: "Trao đổi",
    icon: <ChatBubbleLeftOutlined className={iconClasses} />,
  },
  {
    key: "attachment",
    label: "Tệp đính kèm",
    icon: <PaperClipOutlined className={iconClasses} />,
  },
  {
    key: "mission",
    label: "Nhiệm vụ",
    icon: <CheckBadgeOutlined className={iconClasses} />,
  },
  {
    key: "appointment",
    label: "Lịch hẹn",
    icon: <ClipboardDocumentListOutlined className={iconClasses} />,
  },
  {
    key: "call",
    label: "Cuộc gọi",
    icon: <PhoneOutlined className={iconClasses} />,
  },
  {
    key: "chat",
    label: "Chat",
    icon: <ChatBubbleOvalLeftEllipsisOutlined className={iconClasses} />,
  },
  {
    key: "mail",
    label: "Mail",
    icon: <EnvelopeOutlined className={iconClasses} />,
  },
];
