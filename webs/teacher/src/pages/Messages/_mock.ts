import moment from "moment";

import type { Conversation } from "./_interface";

const ago = (amount: number, unit: moment.unitOfTime.DurationConstructor) =>
  moment().subtract(amount, unit).toISOString();

/**
 * Static prototype data — task 048 has no backend at all (no Conversation/
 * Message model, no websocket route anywhere in the API). This screen runs
 * entirely on local component state seeded from this list; sending a message
 * appends locally and is lost on reload, same treatment as
 * `Notifications/_mock.ts`.
 */
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    contact: {
      id: 101,
      name: "Phụ huynh Minh Anh",
      avatar: "",
      role: "parent",
      email: "ph.minhanh@example.com",
      phone: "0901234567",
      is_online: true,
    },
    last_message: "Cảm ơn cô đã nhận xét, bé rất thích học ạ.",
    last_message_at: ago(30, "minutes"),
    unread_count: 2,
    is_pending: false,
    messages: [
      {
        id: 1,
        sender: "teacher",
        content: "Chào anh/chị, hôm nay bé Minh Anh học rất tốt ạ.",
        sent_at: ago(2, "hours"),
        attachments: [],
      },
      {
        id: 2,
        sender: "contact",
        content: "Cảm ơn cô đã nhận xét, bé rất thích học ạ.",
        sent_at: ago(30, "minutes"),
        attachments: [
          { id: 1, name: "BaiTap_MinhAnh.pdf", type: "pdf", url: "" },
        ],
      },
    ],
  },
  {
    id: 2,
    contact: {
      id: 102,
      name: "Phụ huynh Lan Anh",
      avatar: "",
      role: "parent",
      email: "ph.lananh@example.com",
      phone: "0902345678",
      is_online: false,
    },
    last_message: "Cô ơi cho em hỏi về bài tập tuần này ạ",
    last_message_at: ago(3, "hours"),
    unread_count: 0,
    is_pending: true,
    messages: [
      {
        id: 1,
        sender: "contact",
        content: "Cô ơi cho em hỏi về bài tập tuần này ạ",
        sent_at: ago(3, "hours"),
        attachments: [],
      },
    ],
  },
  {
    id: 3,
    contact: {
      id: 103,
      name: "Phụ huynh Tuấn Kiệt",
      avatar: "",
      role: "parent",
      email: "ph.tuankiet@example.com",
      phone: "0903456789",
      is_online: true,
    },
    last_message: "Vâng ạ, em cảm ơn cô nhiều.",
    last_message_at: ago(1, "days"),
    unread_count: 0,
    is_pending: false,
    messages: [
      {
        id: 1,
        sender: "teacher",
        content: "Bé Tuấn Kiệt tuần này chuyên cần hơn nhiều rồi ạ.",
        sent_at: ago(1, "days"),
        attachments: [],
      },
      {
        id: 2,
        sender: "contact",
        content: "Vâng ạ, em cảm ơn cô nhiều.",
        sent_at: ago(1, "days"),
        attachments: [],
      },
    ],
  },
  {
    id: 4,
    contact: {
      id: 104,
      name: "Phụ huynh Bảo Nam",
      avatar: "",
      role: "parent",
      email: "ph.baonam@example.com",
      phone: "0904567890",
      is_online: false,
    },
    last_message: "Con có nghỉ học được không ạ, con hơi sốt.",
    last_message_at: ago(2, "days"),
    unread_count: 1,
    is_pending: false,
    messages: [
      {
        id: 1,
        sender: "contact",
        content: "Con có nghỉ học được không ạ, con hơi sốt.",
        sent_at: ago(2, "days"),
        attachments: [],
      },
    ],
  },
];
