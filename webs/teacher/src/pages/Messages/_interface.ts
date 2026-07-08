export type ConversationTab = "all" | "unread" | "pending";
export type ContactRole = "parent" | "student";
export type MessageSender = "teacher" | "contact";

export interface Attachment {
  id: number;
  name: string;
  type: string;
  url: string;
}

export interface Message {
  id: number;
  sender: MessageSender;
  content: string;
  sent_at: string;
  attachments: Attachment[];
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  role: ContactRole;
  email: string;
  phone: string;
  is_online: boolean;
}

export interface Conversation {
  id: number;
  contact: Contact;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  is_pending: boolean;
  messages: Message[];
}
