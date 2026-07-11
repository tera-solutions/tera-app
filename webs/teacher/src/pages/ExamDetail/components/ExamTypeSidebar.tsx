import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useMeta } from "_common/hooks/useMeta";

import type { SiblingExam } from "../_interface";
import { EXAM_TYPE_META } from "../constants";

interface ExamTypeSidebarProps {
  exams: SiblingExam[];
  isLoading?: boolean;
}

const ExamTypeSidebar = ({ exams, isLoading }: ExamTypeSidebarProps) => {
  const navigate = useNavigate();
  const { getLabel } = useMeta();

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">Danh sách loại bài kiểm tra</p>
      <WidgetState
        isLoading={isLoading}
        isEmpty={!isLoading && exams.length === 0}
        emptyText="Không có bài kiểm tra liên quan"
      >
        <div className="flex flex-col gap-1">
          {exams.map((exam) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => navigate(`${PATHS.exam}/${exam.id}`)}
              className={classNames(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                exam.active ? "bg-sky-50 font-medium text-brand" : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span
                className={classNames(
                  "h-2 w-2 shrink-0 rounded-full",
                  exam.active ? "bg-brand" : "bg-slate-300",
                )}
              />
              <span className="truncate">{getLabel(EXAM_TYPE_META, exam.type) || exam.name}</span>
            </button>
          ))}
        </div>
      </WidgetState>
    </Card>
  );
};

export default ExamTypeSidebar;
