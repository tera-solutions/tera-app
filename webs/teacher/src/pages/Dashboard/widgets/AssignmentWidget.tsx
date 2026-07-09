import { useNavigate } from "react-router-dom";
import { DocumentTextOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import AssignmentRow from "../components/AssignmentRow";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const AssignmentWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const assignments = data?.assignment_pending ?? [];

  return (
    <DashboardCard
      title="Bài tập cần chấm"
      icon={<DocumentTextOutlined />}
      actionLabel="Xem tất cả"
      onAction={() => navigate(PATHS.assignment)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={assignments.length === 0}
        emptyText="Không có bài tập cần chấm"
        onRetry={refetch}
      >
        <div className="divide-y divide-slate-100">
          {assignments.map((item) => (
            <AssignmentRow key={item.id} item={item} />
          ))}
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default AssignmentWidget;
