import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { notification, Select, Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import { CARD } from "_common/constants/dashboard";
import ErrorRetry from "_common/components/ErrorRetry";
import useConfirm from "_common/hooks/useConfirm";
import { PATHS } from "_common/components/Layout/Menu/menus";
import {
  ClassRoomService,
  ClassSessionService,
  LessonActivityService,
  LessonPlanService,
  LessonService,
} from "@tera/modules/education";
import { toSessionDetail } from "pages/Schedule/_utils";
import { toClassroomDetail } from "pages/ClassroomDetail/_utils";
import { toLessonPlan, toLessonTemplateSummaries } from "pages/LessonPlan/_utils";
import { toLessonDetail } from "pages/Lesson/_utils";
import { useAttendanceSession } from "pages/Attendance/hooks/useAttendanceSession";
import AttendanceEditor from "pages/Attendance/components/AttendanceEditor";
import type { AttendanceRow } from "pages/Attendance/_interface";
import SkillEvaluationForm from "pages/Lesson/components/SkillEvaluationForm";
import WizardSteps from "pages/LessonPlan/Wizard/components/WizardSteps";

import type { SessionWizardStep } from "./_interface";
import { SESSION_STEP_LABELS } from "./constants";
import SessionSummaryCard from "./components/SessionSummaryCard";
import StepOverview from "./components/StepOverview";
import StepPlan from "./components/StepPlan";
import StepLesson from "./components/StepLesson";
import StepEvaluation from "./components/StepEvaluation";
import SessionFinishedCard from "./components/SessionFinishedCard";
import SessionFooterNav from "./components/SessionFooterNav";
import ChangeLessonPlanModal from "./components/ChangeLessonPlanModal";

interface NextStepConfig {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  hint?: string;
}

const SessionRuntime = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { id } = useParams<{ id: string }>();
  const sessionId = id ? Number(id) : null;

  const [step, setStep] = useState<SessionWizardStep>(1);
  const [finished, setFinished] = useState(false);
  const [evalStudent, setEvalStudent] = useState<AttendanceRow | null>(null);
  const [changePlanOpen, setChangePlanOpen] = useState(false);

  const detailQuery = ClassSessionService.useClassSessionDetail({
    id: sessionId ?? "",
  });
  const { isLoading, isError, refetch } = detailQuery;
  const detail = useMemo(
    () => toSessionDetail(detailQuery.data),
    [detailQuery.data],
  );

  const classRoomQuery = ClassRoomService.useClassRoomDetail(
    { id: detail?.class_id ?? "" },
    { enabled: !!detail?.class_id },
  );
  const classRoom = useMemo(
    () => toClassroomDetail(classRoomQuery.data?.data).detail,
    [classRoomQuery.data],
  );

  const lessonPlanQuery = LessonPlanService.useLessonPlanDetail(
    { id: classRoom?.lesson_plan_id ?? "" },
    { enabled: !!classRoom?.lesson_plan_id },
  );
  const lessonPlan = useMemo(() => {
    const payload = lessonPlanQuery.data?.data;
    if (!payload) return undefined;
    return toLessonPlan(payload.plan ?? payload);
  }, [lessonPlanQuery.data]);

  const attendanceSession = useAttendanceSession({
    classId: detail?.class_id ?? null,
    sessionId: detail?.id ?? null,
  });
  const hasAttendance = attendanceSession.hasSavedAttendance;
  const attendingRows = useMemo(
    () => attendanceSession.rows.filter((r) => r.status === "present" || r.status === "late"),
    [attendanceSession.rows],
  );

  const sessionLessonQuery = LessonService.useLessonList(
    { params: { per_page: 1, filters: { session_id: detail?.id } } },
    { enabled: !!detail?.id },
  );
  const sessionLessonId = sessionLessonQuery.data?.data?.items?.[0]?.id ?? null;
  const hasLesson = !!sessionLessonId;

  // A session doesn't require a plan (e.g. an exam day) — this only offers a
  // choice among the class's published, linked plans when there's one to make.
  const [selectedPlanId, setSelectedPlanId] = useState<number | undefined>(undefined);
  const availablePlans = (classRoom?.lesson_plans ?? []).filter((p) => p.status === "published");

  // Which specific "Bài học" (template) of the chosen plan to use — optional,
  // the backend falls back to the next unused template (by lesson_no) when
  // this is left unset.
  const [selectedLessonPlanLessonId, setSelectedLessonPlanLessonId] = useState<
    number | undefined
  >(undefined);
  const selectedPlanDetailQuery = LessonPlanService.useLessonPlanDetail(
    { id: selectedPlanId ?? "" },
    { enabled: !!selectedPlanId },
  );
  const selectedPlanTemplates = useMemo(() => {
    const payload = selectedPlanDetailQuery.data?.data;
    return toLessonTemplateSummaries((payload?.plan ?? payload)?.lessons);
  }, [selectedPlanDetailQuery.data]);
  const handleSelectPlan = (planId: number | undefined) => {
    setSelectedPlanId(planId);
    setSelectedLessonPlanLessonId(undefined);
  };

  const lessonDetailQuery = LessonService.useLessonDetail(
    { id: sessionLessonId ?? "" },
    { enabled: !!sessionLessonId },
  );
  const lessonDetail = useMemo(() => {
    const payload = lessonDetailQuery.data?.data;
    if (!payload) return undefined;
    return toLessonDetail(payload.lesson ?? payload);
  }, [lessonDetailQuery.data]);
  const activities = lessonDetail?.activities ?? [];

  // The API only exposes a pending/in_progress/completed status per activity,
  // not a start timestamp, so the running timer anchors to the moment this
  // client first observes the activity as in_progress.
  const activeIdRef = useRef<number | string | null>(null);
  const [activeActivityStartedAt, setActiveActivityStartedAt] = useState<moment.Moment | null>(
    null,
  );
  useEffect(() => {
    const inProgress = activities.find((a) => a.status === "in_progress") ?? null;
    const newId = inProgress?.id ?? null;
    if (newId !== activeIdRef.current) {
      activeIdRef.current = newId;
      setActiveActivityStartedAt(newId ? moment() : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  const { mutate: updateActivityStatus, isPending: isActivityUpdating } =
    LessonActivityService.useLessonActivityUpdateStatus();
  const handleStartActivity = (activityId: number | string) =>
    updateActivityStatus({ id: activityId, status: "in_progress" });
  const handleCompleteActivity = (activityId: number | string) =>
    updateActivityStatus({ id: activityId, status: "completed" });

  const { mutate: startSession, isPending: isStarting } =
    ClassSessionService.useClassSessionStart();
  const handleStart = () => {
    if (!sessionId) return;
    startSession(
      {
        id: sessionId,
        params: {
          lesson_plan_id: hasLesson ? undefined : selectedPlanId,
          lesson_plan_lesson_id: hasLesson ? undefined : selectedLessonPlanLessonId,
        },
      },
      {
        onSuccess: (res: any) => {
          notification.success({
            message: res?.msg ?? "Đã bắt đầu buổi học",
          });
          // The mutation may have just materialized a Lesson from the chosen
          // plan — refetch so StepLesson (step 4) picks it up immediately.
          sessionLessonQuery.refetch();
          setStep(4);
        },
        onError: (err: any) => {
          notification.error({
            message: err?.msg ?? err?.message ?? "Bắt đầu buổi học thất bại",
          });
        },
      },
    );
  };

  const { mutate: endSession, isPending: isEnding } =
    ClassSessionService.useClassSessionEnd();
  const handleEnd = () => {
    if (!sessionId) return;
    confirm.warning({
      title: "Kết thúc buổi học",
      content: <p>Bạn có chắc chắn muốn kết thúc buổi học này?</p>,
      onOk: () => {
        endSession(
          { id: sessionId, params: {} },
          {
            onSuccess: (res: any) => {
              notification.success({
                message: res?.msg ?? "Đã kết thúc buổi học",
              });
              setFinished(true);
            },
            onError: (err: any) => {
              notification.error({
                message: err?.msg ?? err?.message ?? "Kết thúc buổi học thất bại",
              });
            },
          },
        );
      },
    });
  };

  const notFound = !isLoading && (isError || !detail?.id);
  const isSessionFinished = finished || detail?.status === "completed";

  const doneActivities = activities.filter((a) => a.status === "completed").length;

  const nextConfig: NextStepConfig = (() => {
    if (step === 3) {
      if (detail?.status === "upcoming") {
        return {
          label: "Bắt đầu buổi học",
          loading: isStarting,
          disabled: !hasAttendance || attendanceSession.loading,
          onClick: handleStart,
          hint: !hasAttendance ? "Cần điểm danh trước khi bắt đầu buổi học." : undefined,
        };
      }
      return { label: "Tiếp theo →", onClick: () => setStep(4) };
    }
    if (step === 5) {
      return { label: "⚑ Kết thúc buổi học", loading: isEnding, onClick: handleEnd };
    }
    return {
      label: "Tiếp theo →",
      onClick: () => setStep((s) => Math.min(5, s + 1) as SessionWizardStep),
    };
  })();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOverview
            classId={detail?.class_id}
            classRoomLoading={classRoomQuery.isLoading}
            classRoom={classRoom}
            onViewClassroom={() => navigate(`${PATHS.classroom}/${detail?.class_id}`)}
            lessonPlanId={classRoom?.lesson_plan_id}
            lessonPlanLoading={lessonPlanQuery.isLoading}
            lessonPlan={lessonPlan}
            onViewLessonPlan={() =>
              classRoom?.lesson_plan_id &&
              navigate(`${PATHS.lessonPlans}/${classRoom.lesson_plan_id}`)
            }
            objectives={lessonDetail?.objectives ?? []}
          />
        );
      case 2:
        return <StepPlan loading={lessonDetailQuery.isLoading} activities={activities} />;
      case 3:
        return (
          <>
            {!hasLesson && availablePlans.length > 0 && (
              <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-100 p-3 sm:flex-row">
                <div className="flex-1">
                  <p className="mb-1.5 text-sm font-semibold text-slate-700">Giáo án cho buổi học này</p>
                  <Select
                    value={selectedPlanId}
                    placeholder="Không dùng giáo án (VD: buổi kiểm tra)"
                    allowClear
                    options={availablePlans.map((p) => ({ value: p.id, label: p.plan_name }))}
                    onChange={(v: any) => handleSelectPlan(v ?? undefined)}
                  />
                </div>
                {selectedPlanId && (
                  <div className="flex-1">
                    <p className="mb-1.5 text-sm font-semibold text-slate-700">Bài học</p>
                    <Select
                      value={selectedLessonPlanLessonId}
                      loading={selectedPlanDetailQuery.isLoading}
                      placeholder="Tự động — bài học kế tiếp chưa dùng"
                      allowClear
                      options={selectedPlanTemplates.map((t) => ({
                        value: t.id,
                        label: `Bài ${t.lesson_no} — ${t.lesson_title}`,
                      }))}
                      onChange={(v: any) => setSelectedLessonPlanLessonId(v ?? undefined)}
                    />
                  </div>
                )}
              </div>
            )}
            <AttendanceEditor session={attendanceSession} />
          </>
        );
      case 4:
        return (
          <StepLesson
            loading={lessonDetailQuery.isLoading}
            activities={activities}
            onStart={handleStartActivity}
            onComplete={handleCompleteActivity}
            activeActivityStartedAt={activeActivityStartedAt}
            activityUpdating={isActivityUpdating}
            lessonId={lessonDetail?.id ?? null}
            lessonNote={lessonDetail?.lesson_note ?? ""}
            classRoomId={detail?.class_id ?? null}
            onChangePlan={() => setChangePlanOpen(true)}
          />
        );
      case 5:
        return <StepEvaluation students={attendingRows} onEvaluate={setEvalStudent} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Lịch dạy", onClick: () => navigate(PATHS.schedule) },
          { label: "Chi tiết buổi học" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tìm thấy buổi học hoặc bạn không có quyền truy cập"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{
              label: "Về lịch dạy",
              onClick: () => navigate(PATHS.schedule),
            }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {detail && detail.id ? (
            <div className="flex flex-col gap-4">
              <SessionSummaryCard detail={detail} />

              {isSessionFinished ? (
                <SessionFinishedCard
                  className={detail.class_name}
                  attendanceRate={
                    attendanceSession.counts.total
                      ? Math.round(
                          ((attendanceSession.counts.present + attendanceSession.counts.late) /
                            attendanceSession.counts.total) *
                            100,
                        )
                      : 0
                  }
                  attendingCount={
                    attendanceSession.counts.present + attendanceSession.counts.late
                  }
                  totalStudents={attendanceSession.counts.total}
                  activitiesDone={doneActivities}
                  activitiesTotal={activities.length}
                  onBack={() => setFinished(false)}
                />
              ) : (
                <div className={`${CARD} p-4`}>
                  <WizardSteps
                    currentStep={step}
                    steps={SESSION_STEP_LABELS}
                    completedSteps={Array.from({ length: step - 1 }, (_, i) => i + 1)}
                    onStepClick={(s) => setStep(s as SessionWizardStep)}
                  />

                  {renderStep()}

                  <SessionFooterNav
                    step={step}
                    onPrev={() => setStep((s) => (Math.max(1, s - 1) as SessionWizardStep))}
                    onNext={nextConfig.onClick}
                    nextLabel={nextConfig.label}
                    nextLoading={nextConfig.loading}
                    nextDisabled={nextConfig.disabled}
                    hint={nextConfig.hint}
                  />
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">
              Không tải được chi tiết buổi học
            </p>
          )}
        </Spin>
      )}

      <SkillEvaluationForm
        open={!!evalStudent}
        onClose={() => setEvalStudent(null)}
        classId={detail?.class_id ?? null}
        lessonId={lessonDetail?.id ?? 0}
        presetStudentId={evalStudent?.student_id ?? null}
      />

      <ChangeLessonPlanModal
        open={changePlanOpen}
        onClose={() => setChangePlanOpen(false)}
        lessonId={lessonDetail?.id ?? null}
        currentPlanId={lessonDetail?.lesson_plan_id}
        currentLessonPlanLessonId={lessonDetail?.lesson_plan_lesson_id}
        availablePlans={availablePlans}
        activities={activities}
      />
    </div>
  );
};

export default SessionRuntime;
