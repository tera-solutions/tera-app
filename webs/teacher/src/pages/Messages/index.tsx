import { useMemo, useState } from "react";

import { CARD } from "_common/constants/dashboard";

import type { Conversation, ConversationTab } from "./_interface";
import { MOCK_CONVERSATIONS } from "./_mock";
import InboxSidebar from "./components/InboxSidebar";
import ChatWindow from "./components/ChatWindow";
import ContactInfoPanel from "./components/ContactInfoPanel";

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<number | null>(MOCK_CONVERSATIONS[0]?.id ?? null);
  const [tab, setTab] = useState<ConversationTab>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = conversations;
    if (tab === "unread") list = list.filter((c) => c.unread_count > 0);
    if (tab === "pending") list = list.filter((c) => c.is_pending);

    const keyword = search.trim().toLowerCase();
    if (keyword) {
      list = list.filter(
        (c) =>
          c.contact.name.toLowerCase().includes(keyword) ||
          c.last_message.toLowerCase().includes(keyword),
      );
    }
    return list;
  }, [conversations, tab, search]);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const handleSelect = (conversation: Conversation) => {
    setActiveId(conversation.id);
    setConversations((prev) =>
      prev.map((c) => (c.id === conversation.id ? { ...c, unread_count: 0 } : c)),
    );
  };

  const handleSend = (content: string) => {
    if (!active) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              last_message: content,
              last_message_at: new Date().toISOString(),
              messages: [
                ...c.messages,
                {
                  id: c.messages.length + 1,
                  sender: "teacher",
                  content,
                  sent_at: new Date().toISOString(),
                  attachments: [],
                },
              ],
            }
          : c,
      ),
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] p-4 xmd:p-6">
      <div className={`${CARD} grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[280px_1fr_260px]`}>
        <InboxSidebar
          conversations={filtered}
          activeId={activeId}
          onSelect={handleSelect}
          tab={tab}
          onTabChange={setTab}
          search={search}
          onSearchChange={setSearch}
        />
        <ChatWindow conversation={active} onSend={handleSend} />
        <div className="hidden lg:block">
          <ContactInfoPanel conversation={active} />
        </div>
      </div>
    </div>
  );
};

export default Messages;
