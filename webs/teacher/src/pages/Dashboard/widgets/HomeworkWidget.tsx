import { useNavigate } from "react-router-dom";
import { DocumentTextOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import HomeworkRow from "../components/HomeworkRow";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const HomeworkWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const homework = data?.homework_pending ?? [];

  return (
    <DashboardCard
      title="Bài tập cần chấm"
      icon={<DocumentTextOutlined />}
      actionLabel="Xem tất cả"
      onAction={() => navigate(PATHS.homework)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={homework.length === 0}
        emptyText="Không có bài tập cần chấm"
        onRetry={refetch}
      >
        <div className="divide-y divide-slate-100">
          {homework.map((item) => (
            <HomeworkRow key={item.id} item={item} />
          ))}
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default HomeworkWidget;
