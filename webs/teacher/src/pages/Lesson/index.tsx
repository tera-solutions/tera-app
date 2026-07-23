import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { Button, notification, Spin, StarOutlined } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import { CARD } from "_common/constants/dashboard";
import ErrorRetry from "_common/components/ErrorRetry";
import EntityMaterialManager from "_common/components/EntityMaterialManager";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { LessonPlanService, LessonService } from "@tera/modules/education";
import { toLessonPlan } from "pages/LessonPlan/_utils";

import type { LessonDetailTab } from "./_interface";
import { DETAIL_TABS } from "./constants";
import { toLessonDetail } from "./_utils";
import LessonHeader from "./components/LessonHeader";
import LessonStatRow from "./components/LessonStatRow";
import ObjectiveList from "./components/ObjectiveList";
import ActivityTimeline from "./components/ActivityTimeline";
import LessonSidebar from "./components/LessonSidebar";
import LessonHomework from "./components/LessonHomework";
import SkillEvaluationForm from "./components/SkillEvaluationForm";
import EditLessonModal from "./components/EditLessonModal";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-sm font-semibold text-slate-700">{children}</p>
);

const Lesson = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const lessonId = id ? Number(id) : null;

  const [tab, setTab] = useState<LessonDetailTab>("overview");
  const [skillEvalOpen, setSkillEvalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const detailQuery = LessonService.useLessonDetail({ id: lessonId ?? "" });
  const { isLoading, isError, refetch } = detailQuery;

  const detail = useMemo(() => {
    const payload = detailQuery.data?.data;
    if (!payload) return undefined;
    return toLessonDetail(payload.lesson ?? payload);
  }, [detailQuery.data]);

  const lessonPlanQuery = LessonPlanService.useLessonPlanDetail(
    { id: detail?.lesson_plan_id ?? "" },
    { enabled: !!detail?.lesson_plan_id },
  );
  const lessonPlan = useMemo(() => {
    const payload = lessonPlanQuery.data?.data;
    if (!payload) return undefined;
    return toLessonPlan(payload.plan ?? payload);
  }, [lessonPlanQuery.data]);

  const notFound = !isLoading && (isError || !detail?.id);

  const renderTab = () => {
    if (!detail) return null;
    switch (tab) {
      case "materials":
        return (
          <div>
            <SectionTitle>Tài liệu sử dụng</SectionTitle>
            <EntityMaterialManager entityType="lesson" entityId={detail.id} />
          </div>
        );
      case "homework":
        return <LessonHomework lessonId={detail.id} classRoomId={detail.class_room_id} />;
      default:
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div>
                <SectionTitle>Mục tiêu bài học</SectionTitle>
                <ObjectiveList objectives={detail.objectives} />
              </div>
              <div>
                <SectionTitle>Tài liệu sử dụng</SectionTitle>
                <EntityMaterialManager entityType="lesson" entityId={detail.id} readOnly />
              </div>
            </div>
            <div>
              <SectionTitle>Hoạt động trong bài</SectionTitle>
              <ActivityTimeline activities={detail.activities} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Giáo án", onClick: () => navigate(PATHS.lessonPlans) },
          { label: "Chi tiết giáo án", onClick: () => navigate(`${PATHS.lessonPlans}/${detail.lesson_plan_id}`) },
          { label: "Chi tiết bài học" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tìm thấy bài học hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{
              label: "Về danh sách giáo án",
              onClick: () => navigate(PATHS.lessonPlans),
            }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {detail && detail.id ? (
            <div className="flex flex-col gap-4">
              <LessonHeader
                detail={detail}
                onEdit={() => setEditOpen(true)}
                onMore={() =>
                  notification.open({
                    message: "Tính năng đang được phát triển",
                  })
                }
              />

              <LessonStatRow detail={detail} />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
                <div className={`${CARD} p-4`}>
                  <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-100 scrollbar-none">
                    {DETAIL_TABS.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTab(item.key)}
                        className={classNames(
                          "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                          tab === item.key
                            ? "border-brand text-brand"
                            : "border-transparent text-slate-500 hover:text-slate-700",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {renderTab()}

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Button
                      outlined
                      icon={<StarOutlined />}
                      onClick={() => setSkillEvalOpen(true)}
                      className="whitespace-nowrap text-brand border-brand hover:bg-brand"
                    >
                      Đánh giá kỹ năng
                    </Button>
                  </div>
                </div>

                <div className="xl:block">
                  <LessonSidebar
                    detail={detail}
                    courseName={lessonPlan?.course_name}
                    level={lessonPlan?.level_name}
                  />
                </div>
              </div>
            </div>
          ) : isLoading ? (
            // `Spin` only centers its spinner when it has children to overlay —
            // an empty/falsy child renders the bare icon un-centered.
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">
              Không tải được chi tiết bài học
            </p>
          )}
        </Spin>
      )}

      {detail && (
        <SkillEvaluationForm
          open={skillEvalOpen}
          onClose={() => setSkillEvalOpen(false)}
          classId={detail.class_room_id}
          lessonId={detail.id}
        />
      )}

      <EditLessonModal open={editOpen} lesson={detail ?? null} onClose={() => setEditOpen(false)} />
    </div>
  );
};

export default Lesson;
