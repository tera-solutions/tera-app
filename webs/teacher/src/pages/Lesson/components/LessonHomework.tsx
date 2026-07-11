import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import { Button, DocumentTextOutlined, PlusOutlined } from "tera-dls";

import StatusBadge from "_common/components/StatusBadge";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { AssignmentService } from "@tera/modules/education";
import { ASSIGNMENT_STATUS_META } from "pages/Assignment/constants";
import { toAssignments, isOverdue } from "pages/Assignment/_utils";

interface LessonHomeworkProps {
  lessonId: number;
  classRoomId: number | null;
}

const LessonHomework = ({ lessonId, classRoomId }: LessonHomeworkProps) => {
  const navigate = useNavigate();

  const listParams = { lesson_id: lessonId, per_page: 50 };
  const listQuery = AssignmentService.useAssignmentList({ params: listParams });
  const assignments = useMemo(
    () => toAssignments(listQuery.data?.data?.items),
    [listQuery.data],
  );

  const handleCreate = () => {
    navigate(`${PATHS.assignment}/new`, {
      state: { lesson_id: lessonId, class_room_id: classRoomId },
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          Bài tập gắn với buổi học
        </p>
        <Button
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="whitespace-nowrap bg-brand px-3 py-1.5 text-xs hover:bg-brand/80"
        >
          Giao bài tập
        </Button>
      </div>

      {listQuery.isLoading ? (
        <p className="py-6 text-center text-sm text-slate-400">Đang tải...</p>
      ) : assignments.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Chưa có bài tập nào cho buổi học này.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {assignments.map((a) => (
            <div
              key={a.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`${PATHS.assignmentDetail}/${a.id}`)}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-brand/40 hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4.5 [&_svg]:w-4.5">
                <DocumentTextOutlined />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{a.name}</p>
                <p
                  className={classNames(
                    "text-xs",
                    a.due_date && isOverdue(a.due_date) ? "text-red-500" : "text-slate-400",
                  )}
                >
                  {a.due_date ? `Hạn nộp: ${moment(a.due_date).format("DD/MM/YYYY HH:mm")}` : "Chưa có hạn nộp"}
                </p>
              </div>
              <StatusBadge name={ASSIGNMENT_STATUS_META} value={a.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonHomework;
