import { useNavigate } from "react-router-dom";
import {
  ChevronLeftOutlined,
  EllipsisVerticalOutlined,
  StarOutlined,
  TrashOutlined,
} from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import { todo } from "_common/utils/todo";

import type { NotificationItem } from "../_interface";
import { CATEGORY_META, formatFullDateTime } from "../_utils";

interface NotificationDetailPanelProps {
  item: NotificationItem | null;
}

const NotificationDetailPanel = ({ item }: NotificationDetailPanelProps) => {
  const navigate = useNavigate();

  if (!item) {
    return (
      <Card>
        <EmptyState className="py-16" description="Chọn một thông báo để xem chi tiết" />
      </Card>
    );
  }

  const meta = CATEGORY_META[item.category];

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={todo}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand xl:hidden [&_svg]:h-3.5 [&_svg]:w-3.5"
        >
          <ChevronLeftOutlined />
          Quay lại danh sách
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            title="Đánh dấu sao"
            onClick={todo}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-amber-500 [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <StarOutlined />
          </button>
          <button
            type="button"
            title="Xóa"
            onClick={todo}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-red-500 [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <TrashOutlined />
          </button>
          <button
            type="button"
            title="Thêm"
            onClick={todo}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <EllipsisVerticalOutlined />
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <p className="text-base font-bold text-slate-800">{item.title}</p>
        {!item.is_read && (
          <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <Badge className={`px-2 py-0.5 text-[11px] ${meta.badge}`}>
          {meta.label}
        </Badge>
        <span className="text-xs text-slate-400">{formatFullDateTime(item.created_at)}</span>
      </div>

      {item.image_url && (
        <img
          src={item.image_url}
          alt=""
          className="mt-4 w-full rounded-xl object-cover"
        />
      )}

      {/*
        Content is authored mock data (see ../_mock.ts), not user/API input,
        so it's safe to render as-is here. A real API integration must
        sanitize this HTML (e.g. DOMPurify) before using dangerouslySetInnerHTML.
      */}
      <div
        className="prose prose-sm mt-4 max-w-none text-slate-600"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />

      {item.action_label && (
        <button
          type="button"
          onClick={() => (item.action_url ? navigate(item.action_url) : todo())}
          className="mt-5 w-full rounded-lg bg-brand py-2 text-sm font-medium text-white hover:bg-brand/80"
        >
          {item.action_label}
        </button>
      )}
    </Card>
  );
};

export default NotificationDetailPanel;
