import { useEffect, useRef, useState } from "react";
import moment from "moment";
import classNames from "classnames";
import { FaceSmileOutlined, PaperClipOutlined, PaperAirplaneOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import EmptyState from "_common/components/EmptyState";

import type { Conversation } from "../_interface";

interface ChatWindowProps {
  conversation: Conversation | null;
  onSend: (content: string) => void;
}

const ChatWindow = ({ conversation, onSend }: ChatWindowProps) => {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [conversation?.messages.length, conversation?.id]);

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState description="Chọn một hội thoại để bắt đầu" />
      </div>
    );
  }

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
        <Avatar src={conversation.contact.avatar} alt={conversation.contact.name} sizeClassName="h-9 w-9" />
        <div>
          <p className="text-sm font-semibold text-slate-700">{conversation.contact.name}</p>
          <p className="text-xs text-slate-400">
            {conversation.contact.is_online ? "Đang hoạt động" : "Ngoại tuyến"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {conversation.messages.map((msg) => {
            const isTeacher = msg.sender === "teacher";
            return (
              <div key={msg.id} className={classNames("flex", isTeacher ? "justify-end" : "justify-start")}>
                <div
                  className={classNames(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                    isTeacher ? "bg-brand text-white" : "border border-slate-100 bg-white text-slate-700",
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.attachments.map((file) => (
                    <p
                      key={file.id}
                      className={classNames(
                        "mt-1 truncate text-xs underline",
                        isTeacher ? "text-sky-100" : "text-brand",
                      )}
                    >
                      {file.name}
                    </p>
                  ))}
                  <p
                    className={classNames(
                      "mt-1 text-right text-[10px]",
                      isTeacher ? "text-sky-100" : "text-slate-400",
                    )}
                  >
                    {moment(msg.sent_at).format("HH:mm")}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 px-3 py-2.5">
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 [&_svg]:h-5 [&_svg]:w-5">
          <FaceSmileOutlined />
        </button>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 [&_svg]:h-5 [&_svg]:w-5">
          <PaperClipOutlined />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition-opacity hover:opacity-90 disabled:opacity-40 [&_svg]:h-4 [&_svg]:w-4"
        >
          <PaperAirplaneOutlined />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
