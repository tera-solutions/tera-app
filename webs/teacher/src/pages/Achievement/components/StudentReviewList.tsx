import moment from "moment";
import { StarOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { TeacherReview } from "../_interface";

interface StudentReviewListProps {
  reviews: TeacherReview[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const StudentReviewList = ({ reviews, isLoading, isError, onRetry }: StudentReviewListProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-700">Đánh giá học viên</p>
    <WidgetState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && reviews.length === 0}
      emptyText="Chưa có đánh giá nào từ học viên/phụ huynh"
      onRetry={onRetry}
    >
      <div className="flex flex-col divide-y divide-slate-100">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3 py-3">
            <Avatar src={review.student_avatar} alt={review.student_name} sizeClassName="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-slate-700">{review.student_name}</p>
                <span className="whitespace-nowrap text-xs text-slate-400">
                  {review.created_at ? moment(review.created_at).format("DD/MM/YYYY") : ""}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-0.5 text-amber-400 [&_svg]:h-3.5 [&_svg]:w-3.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarOutlined key={i} className={i < review.rating ? "opacity-100" : "opacity-20"} />
                ))}
              </div>
              {review.content && <p className="mt-1 text-sm text-slate-600">{review.content}</p>}
            </div>
          </div>
        ))}
      </div>
    </WidgetState>
  </Card>
);

export default StudentReviewList;
