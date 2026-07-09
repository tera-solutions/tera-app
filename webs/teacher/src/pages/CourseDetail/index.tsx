import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  AcademicCapOutlined,
  BookOpenOutlined,
  Button,
  CheckBadgeOutlined,
  RectangleGroupOutlined,
  Spin,
  UsersOutlined,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ClassroomInfoCard from "_common/components/ClassroomInfoCard";
import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import StatisticCard from "_common/components/StatisticCard";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import {
  ClassRoomService,
  CourseService,
  LessonPlanService,
  LessonService,
} from "@tera/modules/education";
import { toClassrooms } from "pages/Classroom/_utils";
import { getCoverGradient } from "pages/Classroom/constants";
import { toLessons } from "pages/LessonPlan/_utils";
import TeachingProgressCard from "pages/LessonPlan/components/TeachingProgressCard";

import { toCourseDetail, toCourseStats, toCurriculumItems } from "./_utils";
import CourseLessonList from "./components/CourseLessonList";
import CurriculumList from "./components/CurriculumList";

const CourseDetail = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = id ? Number(id) : null;

  const [filters, setFilters] = useUrlFilters({
    classroomId: { type: "number", default: undefined as number | undefined, param: "class_id" },
  });

  const courseQuery = CourseService.useCourseDetail({ id: courseId ?? "" });
  const course = useMemo(() => toCourseDetail(courseQuery.data?.data?.course), [courseQuery.data]);
  const stats = useMemo(() => toCourseStats(courseQuery.data?.data?.statistics), [courseQuery.data]);

  const notFound = !courseQuery.isLoading && (courseQuery.isError || !course?.id);

  // The course's curriculum is its lesson plan's ordered lesson templates —
  // independent of any specific class's schedule.
  const curriculumPlanQuery = LessonPlanService.useLessonPlanList(
    { params: { per_page: 1, filters: { course_id: courseId } } },
    { enabled: !!courseId },
  );
  const curriculumPlanId = curriculumPlanQuery.data?.data?.items?.[0]?.id;
  const curriculumDetailQuery = LessonPlanService.useLessonPlanDetail({
    id: curriculumPlanId ?? "",
  });
  const curriculumItems = useMemo(() => {
    const detail = curriculumDetailQuery.data?.data;
    return toCurriculumItems((detail?.plan ?? detail)?.lessons);
  }, [curriculumDetailQuery.data]);
  const isCurriculumLoading = curriculumPlanQuery.isLoading || curriculumDetailQuery.isLoading;

  // `crm/course` (unlike ClassRoom) has no TeacherScope — a teacher may view
  // any course's catalog info, but "which of my classes teach it" is
  // resolved via the real teacher-scoped ClassRoom list.
  const classroomsQuery = ClassRoomService.useClassRoomList(
    { params: { per_page: 20, filters: { course_id: courseId } } },
    { enabled: !!courseId },
  );
  const classrooms = useMemo(
    () => (courseId ? toClassrooms(classroomsQuery.data?.data?.items) : []),
    [classroomsQuery.data, courseId],
  );
  const selectedClassroom = classrooms.find((c) => c.id === filters.classroomId) ?? classrooms[0];

  const lessonsQuery = LessonService.useLessonList(
    {
      params: {
        per_page: 200,
        sort_by: "lesson_no",
        sort_dir: "asc",
        filters: { class_room_id: selectedClassroom?.id },
      },
    },
    { enabled: !!selectedClassroom?.id },
  );
  const lessons = useMemo(() => toLessons(lessonsQuery.data?.data?.items), [lessonsQuery.data]);

  const nextLesson = useMemo(
    () =>
      [...lessons]
        .filter((l) => l.status === "scheduled" || l.status === "confirmed")
        .sort((a, b) => a.date.localeCompare(b.date))[0],
    [lessons],
  );

  const handleStartLesson = () => {
    if (nextLesson) navigate(`${PATHS.lesson}/${nextLesson.id}`);
  };
  const handleViewLessonPlan = () => {
    if (selectedClassroom?.lesson_plan_id) navigate(`${PATHS.lessonPlans}/${selectedClassroom.lesson_plan_id}`);
  };

  const isLoading = courseQuery.isLoading;

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Lớp học", onClick: () => navigate(PATHS.classroom) },
          { label: "Chi tiết khóa học" },
        ]}
      />

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => courseQuery.refetch()}
            message="Không tìm thấy khóa học"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{ label: "Về danh sách lớp học", onClick: () => navigate(PATHS.classroom) }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {course ? (
            <div className="mt-2 flex flex-col gap-4">
              <Card animated={false}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
                  <div
                    className={`relative flex min-h-40 flex-col justify-end overflow-hidden rounded-2xl bg-linear-to-br p-4 text-white ${getCoverGradient(
                      course.id,
                    )}`}
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <BookOpenOutlined className="mb-2 h-10 w-10 opacity-80" />
                    )}
                    <p className="relative text-base font-bold leading-tight">{course.name}</p>
                    {course.code && <p className="relative text-xs text-white/80">{course.code}</p>}
                  </div>

                  <div className="flex flex-col justify-between gap-3">
                    <div>
                      <h1 className="text-lg font-bold text-slate-800">{course.name}</h1>
                      {course.description && (
                        <p className="mt-1 text-sm text-slate-500">{course.description}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        icon={<BookOpenOutlined />}
                        onClick={handleStartLesson}
                        disabled={!nextLesson}
                      >
                        Bắt đầu học
                      </Button>
                      <Button
                        outlined
                        onClick={handleViewLessonPlan}
                        disabled={!selectedClassroom?.lesson_plan_id}
                        className="text-brand border-brand hover:bg-brand"
                      >
                        Xem giáo án
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatisticCard
                  icon={<UsersOutlined />}
                  value={stats.total_students}
                  label="Học viên"
                  iconClassName="bg-sky-50 text-brand"
                  loading={isLoading}
                />
                <StatisticCard
                  icon={<CheckBadgeOutlined />}
                  value={stats.completed_students}
                  label="Đã hoàn thành"
                  iconClassName="bg-emerald-50 text-emerald-500"
                  loading={isLoading}
                />
                <StatisticCard
                  icon={<RectangleGroupOutlined />}
                  value={stats.total_classes}
                  label="Lớp học"
                  iconClassName="bg-violet-50 text-violet-500"
                  loading={isLoading}
                />
                <StatisticCard
                  icon={<AcademicCapOutlined />}
                  value={`${stats.completion_rate}%`}
                  label="Tỷ lệ hoàn thành"
                  iconClassName="bg-amber-50 text-amber-500"
                  loading={isLoading}
                />
              </div>

              <Card>
                <p className="mb-2 text-sm font-semibold text-slate-700">Chương trình học tập</p>
                <CurriculumList items={curriculumItems} loading={isCurriculumLoading} />
              </Card>

              {classrooms.length === 0 ? (
                !classroomsQuery.isLoading && (
                  <Card>
                    <EmptyState description="Bạn chưa dạy lớp nào thuộc khóa học này" className="py-10" />
                  </Card>
                )
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
                  <div className="flex flex-col gap-4">
                    <ClassroomInfoCard
                      loading={classroomsQuery.isLoading}
                      classroom={selectedClassroom}
                      classrooms={classrooms}
                      onChangeClassroom={(classroomId) => setFilters({ classroomId })}
                      icon={<BookOpenOutlined />}
                    />

                    <Card>
                      <p className="mb-2 text-sm font-semibold text-slate-700">Buổi học đã lên lịch</p>
                      <CourseLessonList
                        lessons={lessons}
                        loading={lessonsQuery.isLoading}
                        onView={(lesson) => navigate(`${PATHS.lesson}/${lesson.id}`)}
                      />
                    </Card>
                  </div>

                  <div className="flex flex-col gap-4">
                    <TeachingProgressCard lessons={lessons} total={lessons.length} />

                    <Card>
                      <p className="mb-2 text-sm font-semibold text-slate-700">Hoạt động gần đây</p>
                      <EmptyState description="Chưa có hoạt động nào được ghi nhận" className="py-8" />
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">Không tải được chi tiết khóa học</p>
          )}
        </Spin>
      )}
    </div>
  );
});

export default CourseDetail;
