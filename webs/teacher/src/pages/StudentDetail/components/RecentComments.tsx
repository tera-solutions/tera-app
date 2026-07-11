import moment from "moment";

import EmptyState from "_common/components/EmptyState";

import type { CommentItem } from "../_interface";

const RecentComments = ({ comments }: { comments: CommentItem[] }) => {
  if (comments.length === 0) {
    return <EmptyState description="Chưa có nhận xét nào" className="py-6" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.slice(0, 5).map((comment) => (
        <div key={comment.id} className="rounded-xl border border-slate-100 p-3">
          <p className="text-sm text-slate-700">{comment.content}</p>
          {comment.evaluated_at && (
            <p className="mt-1 text-[11px] text-slate-400">
              {moment(comment.evaluated_at).format("DD/MM/YYYY")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentComments;
