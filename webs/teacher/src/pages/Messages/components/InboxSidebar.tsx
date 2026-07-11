import moment from "moment";
import classNames from "classnames";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import SearchInput from "_common/components/SearchInput";
import StatusTabs from "_common/components/StatusTabs";

import type { Conversation, ConversationTab } from "../_interface";

interface InboxSidebarProps {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (conversation: Conversation) => void;
  tab: ConversationTab;
  onTabChange: (tab: ConversationTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "unread", label: "Chưa đọc" },
  { key: "pending", label: "Đang trả lời" },
];

const InboxSidebar = ({
  conversations,
  activeId,
  onSelect,
  tab,
  onTabChange,
  search,
  onSearchChange,
}: InboxSidebarProps) => (
  <div className="flex h-full flex-col border-r border-slate-100">
    <div className="border-b border-slate-100 p-3">
      <p className="mb-2 text-sm font-semibold text-slate-700">Hộp thư</p>
      <StatusTabs tabs={TABS} activeKey={tab} onChange={(k) => onTabChange(k as ConversationTab)} className="mb-2" />
      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm kiếm..."
      />
    </div>

    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <EmptyState description="Không có hội thoại nào" className="py-10" />
      ) : (
        conversations.map((conv) => (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv)}
            className={classNames(
              "flex w-full items-start gap-2.5 border-b border-slate-50 px-3 py-3 text-left transition-colors",
              activeId === conv.id ? "bg-sky-50" : "hover:bg-slate-50",
            )}
          >
            <div className="relative shrink-0">
              <Avatar src={conv.contact.avatar} alt={conv.contact.name} sizeClassName="h-10 w-10" />
              {conv.contact.is_online && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-slate-700">{conv.contact.name}</p>
                <span className="whitespace-nowrap text-[11px] text-slate-400">
                  {moment(conv.last_message_at).fromNow()}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">{conv.last_message}</p>
            </div>
            {conv.unread_count > 0 && (
              <Badge className="bg-brand px-1.5 py-0.5 text-[10px] text-white">
                {conv.unread_count}
              </Badge>
            )}
          </button>
        ))
      )}
    </div>
  </div>
);

export default InboxSidebar;
